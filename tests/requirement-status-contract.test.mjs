import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");

const statusLabels = ["人間：要求承認待ち", "AI：作業可能", "人間：PR確認待ち", "人間：タスク承認待ち"];
const retiredLabels = ["人間：要求分析承認待ち", "人間：基本設計承認待ち", "人間：最終成果物承認待ち"];
const requiredSkills = ["analyze-requirement", "check-design-impact", "coordinate-approved-tasks", "plan-tasks", "process-flow-feedback", "publish-task-pr", "review-changes", "verify-changes"];

const extractDesignLabels = (text) => [...text.matchAll(/^[|] `([^`]+)` [|]/gm)].map((match) => match[1]);
const assertExactLabels = (actual, sourceName) => {
  assert.deepEqual(actual, statusLabels, sourceName);
  assert.equal(new Set(actual).size, statusLabels.length, sourceName + " has duplicates");
};

test("Issue #49設計とAI開発フローのステータスラベル一覧が一致する", async () => {
  const [design, overview] = await Promise.all([read("docs/design-decisions/49.md"), read("docs/ai-development/overview.md")]);
  const designContract = design.split("## 工程と承認境界")[0].split("## ステータス契約")[1] ?? "";
  const designSection = overview.match(/### ステータスラベル[\s\S]*?### AI作業開始ゲート/)?.[0] ?? "";
  assert.match(design, /4種類/);
  assertExactLabels(extractDesignLabels(designContract), "design status table");
  assertExactLabels(extractDesignLabels(designSection), "overview status table");
  assert.deepEqual(extractDesignLabels(designContract), extractDesignLabels(designSection), "design and overview status tables");
  for (const label of retiredLabels) assert.doesNotMatch(designSection, new RegExp(label));
});

test("旧3ラベルはactive契約から排除し、残存時は安全停止する", async () => {
  const documents = await Promise.all([
    read("AGENTS.md"),
    read("docs/ai-development/overview.md"),
    ...requiredSkills.map((skill) => read(".agents/skills/" + skill + "/SKILL.md")),
  ]);
  for (const document of documents) {
    assert.match(document, /4種類/);
    assert.match(document, /旧3ラベル|移行完了まで安全停止/);
  }
});

test("active契約に旧設計不要承認・Issueコメント経路を残さない", async () => {
  const documents = await Promise.all([
    read("AGENTS.md"),
    read("docs/ai-development/overview.md"),
    ...requiredSkills.map((skill) => read(".agents/skills/" + skill + "/SKILL.md")),
  ]);
  for (const document of documents) {
    assert.doesNotMatch(document, /設計PRが不要|設計変更不要判断|設計変更不要時のIssueコメント|Requirement Issueへコメント/);
  }
});

test("Requirement Issue Formは人間による要求確認から開始する", async () => {
  const form = await read(".github/ISSUE_TEMPLATE/requirement.yml");
  assert.match(form, /^labels:\s*\["人間：要求承認待ち"\]\s*$/m);
  assert.doesNotMatch(form, /AI：作業可能/);
});

test("既定mainとdevelopのbranch責務を設計の正本どおり確認する", async () => {
  const overview = await read("docs/ai-development/overview.md");
  assert.match(overview, /repositoryの既定branchは`main`/);
  assert.match(overview, /開発作業の起点とIssue統合PRのbaseは`develop`/);
  assert.match(overview, /人間が管理する`develop`から`main`への反映後/);
  assert.match(overview, /Issue単位(?:で|のbranchから)`main`へ直接backport(?:せず|しない)/);
  assert.doesNotMatch(overview, /既定branchは`develop`/);
});

test("各Skillの開始・停止契約とMain単独の引き渡し責務を確認する", async () => {
  const documents = await Promise.all(requiredSkills.map((skill) => read(".agents/skills/" + skill + "/SKILL.md")));
  for (const document of documents) {
    for (const token of ["AI：作業可能", "現在のチャット指示", "人間承認", "未付与", "複数競合", "不整合"]) assert.match(document, new RegExp(token));
  }
  const agents = await read("AGENTS.md");
  for (const token of ["永続情報から次工程", "以前のステータスを残さず", "非ステータスラベルを保持", "変更後のIssueを再取得", "Mainだけ"]) assert.match(agents, new RegExp(token));
  const handoffContracts = [
    ["AGENTS.md", "Worker、Reviewer、補助Skillはステータスを変更しない"],
    [".agents/skills/coordinate-approved-tasks/SKILL.md", "Worker・Reviewerはラベルを変更しない"],
    [".agents/skills/publish-task-pr/SKILL.md", "Worker・Reviewerはステータスを変更しない"],
    [".agents/skills/review-changes/SKILL.md", "Reviewerはステータスを変更せず"],
    [".agents/skills/verify-changes/SKILL.md", "Worker・Reviewerはステータスを変更しない"],
  ];
  for (const [path, contract] of handoffContracts) assert.match(await read(path), new RegExp(contract));
});

test("coordinate-approved-tasksはMainの安全なPR確認待ち引き渡しを所有する", async () => {
  const document = await read(".agents/skills/coordinate-approved-tasks/SKILL.md");
  for (const contract of [
    "非ステータスラベルを保持",
    "以前のステータスを残さず",
    "目的のBT人間：PR確認待ちBTへ更新",
    "更新後Issueを再取得",
    "目的のステータス1種類だけ",
    "同一指示内では次工程へ進まず停止",
    "Task PRだけではこの状態変更を行わない",
  ]) {
    assert.ok(document.includes(contract.replaceAll("BT", String.fromCharCode(96))), contract);
  }
});

test("工程別の人間承認引き渡し先が正確である", async () => {
  const [overview, designGate] = await Promise.all([read("docs/ai-development/overview.md"), read(".agents/skills/check-design-impact/SKILL.md")]);
  const handoff = overview.match(/### 人間への引き渡し[\s\S]*?## 要求分析/)?.[0] ?? "";
  const mappings = [
    [/要求分析書とRequirement Analysis PR[\s\S]*?人間：PR確認待ち/, "requirements"],
    [/設計判断記録と設計PR[\s\S]*?人間：PR確認待ち/, "design"],
    [/人間が承認可能なタスク計画[\s\S]*?人間：タスク承認待ち/, "task-plan"],
    [/全Task、統合・回帰検証、全受入条件確認を終えたIssue統合PR[\s\S]*?人間：PR確認待ち/, "final"],
  ];
  for (const [pattern, name] of mappings) assert.match(handoff, pattern, name);
  assert.match(designGate, /設計判断記録|設計PR/);
  assert.match(designGate, /同じ指示|同一指示/);
  assert.match(designGate, /Task Planning|タスク計画/);
  assert.match(designGate, /同じ作業指示でタスク分解へ進まない|同じ指示でTask Planningへ進まない/);
});

test("要求分析・基本設計の質問有無4経路と再承認禁止を確認する", async () => {
  const [overview, analyze, design] = await Promise.all([
    read("docs/ai-development/overview.md"),
    read(".agents/skills/analyze-requirement/SKILL.md"),
    read(".agents/skills/check-design-impact/SKILL.md"),
  ]);
  for (const document of [overview, analyze, design]) {
    assert.match(document, /未確定.*質問|必要な場合だけ.*質問/);
    assert.match(document, /回答後.*再承認|同一事項.*再承認/);
    assert.match(document, /PR確認待ち/);
  }
  assert.match(overview, /要求分析.*質問/);
  assert.match(overview, /設計.*質問/);
  assert.match(overview, /同じチャット/);
  assert.match(overview, /人間：タスク承認待ち/);
});

test("4経路は開始条件・質問条件・継続条件・成果物引き渡しを表形式で満たす", async () => {
  const overview = await read("docs/ai-development/overview.md");
  const routes = [
    { phase: "要求分析", noQuestion: /未確定の人間判断がない場合は質問せず/, question: /判断が必要な場合だけ質問し/, continue: /回答後は同一事項を再承認せず/, artifact: /要求分析書とRequirement Analysis PR/ },
    { phase: "基本設計", noQuestion: /未確定の設計判断がない場合は質問せず/, question: /判断が必要な場合だけ質問し/, continue: /回答後は同一事項を再承認せず/, artifact: /設計判断記録と設計PR/ },
  ];
  for (const route of routes) {
    assert.match(overview, route.noQuestion, route.phase + " no-question");
    assert.match(overview, route.question, route.phase + " question");
    assert.match(overview, route.continue, route.phase + " no re-approval");
    assert.match(overview, route.artifact, route.phase + " artifact");
    assert.match(overview, /人間：PR確認待ち/, route.phase + " PR handoff");
  }
});

const workflowOnContent = (workflow) => {
  const lines = workflow.split(/\r?\n/);
  const onIndex = lines.findIndex((line) => /^on:\s*(.*)$/.test(line));
  if (onIndex < 0) return "";
  const inline = lines[onIndex].replace(/^on:\s*/, "");
  if (inline) return inline;
  const block = [];
  for (const line of lines.slice(onIndex + 1)) {
    if (/^\S/.test(line) && !/^\s*(?:#|$)/.test(line)) break;
    block.push(line);
  }
  return block.join("\n");
};

const issueEventNames = new Set(["issues", "issue_comment"]);
const normalizeEvent = (value) => value.trim().replace(/^["']|["']$/g, "");
const hasIssueEvent = (onContent) => {
  const lines = onContent.split(/\r?\n/).map((line) => line.replace(/#.*/, ""));
  const significant = lines.filter((line) => /\S/.test(line));
  if (significant.length === 0) return false;
  if (significant.length === 1 && significant[0].search(/\S/) === 0) {
    const inline = significant[0].trim();
    if (/^\[.*\]$/.test(inline)) return inline.slice(1, -1).split(",").some((item) => issueEventNames.has(normalizeEvent(item)));
    if (/^\{.*\}$/.test(inline)) return inline.slice(1, -1).split(",").some((item) => issueEventNames.has(normalizeEvent(item.split(":")[0])));
    return issueEventNames.has(normalizeEvent(inline));
  }
  const minIndent = Math.min(...significant.map((line) => line.search(/\S/)));
  return significant.filter((line) => line.search(/\S/) === minIndent).some((line) => {
    const value = line.trim();
    return /^-\s*["']?(?:issues|issue_comment)["']?\s*$/.test(value)
      || /^["']?(?:issues|issue_comment)["']?\s*:/.test(value);
  });
};

async function workflowFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await workflowFiles(path));
    else if (/\.ya?ml$/i.test(entry.name)) files.push(path);
  }
  return files;
}

test("workflowのonブロック検出は複数行とinline形式を正しく扱う", () => {
  const safe = "name: safe\non:\n  pull_request:\n    branches: [develop]\npermissions:\n  contents: read\n";
  const multilineIssue = "name: issue\non:\n  pull_request:\n  issues:\n    types: [opened]\njobs:\n  verify:\n";
  const inlineIssue = "name: issue\non: [issues]\njobs:\n  verify:\n";
  const inlineIssueName = "name: issue\non: issue_comment\njobs:\n  verify:\n";
  assert.doesNotMatch(workflowOnContent(safe), /issues|issue_comment/);
  assert.match(workflowOnContent(multilineIssue), /^\s*issues\s*:/m);
  assert.match(workflowOnContent(inlineIssue), /issues/);
  assert.match(workflowOnContent(inlineIssueName), /issue_comment/);
});

test("workflowのIssueイベントpredicateはinline形式とon直下だけを判定する", () => {
  const safe = "name: safe\non:\n  pull_request:\n    branches: [issues]\n";
  const safeList = "name: safe\non:\n  pull_request:\n    branches:\n      - issues\n";
  const multilineIssue = "name: issue\non:\n  pull_request:\n  issues:\n    types: [opened]\n";
  const sequenceIssue = "name: issue\non:\n  - pull_request\n  - issue_comment\n";
  const quotedIssue = "name: issue\non:\n  'issues':\n";
  const singleBlockIssue = "name: issue\non:\n  issues:\n";
  const inlineIssue = "name: issue\non: [push, issues]\n";
  const inlineQuotedIssue = "name: issue\non: [push, \"issue_comment\"]\n";
  const inlineSafe = "name: safe\non: [push, pull_request]\n";
  const flowMappingIssue = "name: issue\non: {push: null, issues: null}\n";
  assert.equal(hasIssueEvent(workflowOnContent(safe)), false);
  assert.equal(hasIssueEvent(workflowOnContent(safeList)), false);
  assert.equal(hasIssueEvent(workflowOnContent(multilineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(sequenceIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(quotedIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(singleBlockIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineQuotedIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineSafe)), false);
  assert.equal(hasIssueEvent(workflowOnContent(flowMappingIssue)), true);
});

test("workflowにIssue起動を追加していない", async () => {
  const files = await workflowFiles(join(root, ".github/workflows"));
  assert.ok(files.length > 0);
  for (const path of files) {
    const workflow = await readFile(path, "utf8");
    const onBlock = workflowOnContent(workflow);
    assert.equal(hasIssueEvent(onBlock), false, path);
    assert.doesNotMatch(onBlock, /^\s*(?:issues|issue_comment)\s*:/m, path);
  }
  const overview = await read("docs/ai-development/overview.md");
  assert.match(overview, /ラベル変更だけを契機とするAIの自動起動/);
  assert.match(overview, /Pull Requestをmergeしたり/);
  assert.match(overview, /Issueをcloseしたり/);
  const agents = await read("AGENTS.md");
  assert.match(agents, /自動起動・merge・closeは追加しない/);
});
