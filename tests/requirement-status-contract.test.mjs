import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");

const statusLabels = ["人間：要求承認待ち", "AI：作業可能", "人間：要求分析承認待ち", "人間：基本設計承認待ち", "人間：タスク承認待ち", "人間：最終成果物承認待ち"];
const requiredSkills = ["analyze-requirement", "check-design-impact", "coordinate-approved-tasks", "plan-tasks", "process-flow-feedback", "publish-task-pr", "review-changes", "verify-changes"];

const extractRequirementLabels = (text) => [...text.matchAll(/^  - `([^`]+)`$/gm)].map((match) => match[1]);
const extractDesignLabels = (text) => [...text.matchAll(/^[|] `([^`]+)` [|]/gm)].map((match) => match[1]);
const assertExactLabels = (actual, sourceName) => {
  assert.deepEqual(actual, statusLabels, sourceName);
  assert.equal(new Set(actual).size, statusLabels.length, sourceName + " has duplicates");
};

test("要求分析書と設計のステータスラベル一覧が一致する", async () => {
  const [requirements, overview] = await Promise.all([read("requirements/35.md"), read("docs/ai-development/overview.md")]);
  const requirementSection = requirements.match(/### RQ-01[\s\S]*?### RQ-02/)?.[0] ?? "";
  const designSection = overview.match(/### ステータスラベル[\s\S]*?### AI作業開始ゲート/)?.[0] ?? "";
  assertExactLabels(extractRequirementLabels(requirementSection), "requirements/35.md RQ-01");
  assertExactLabels(extractDesignLabels(designSection), "overview status table");
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
  assert.match(overview, /Issue単位で`main`へ直接backportしない/);
  assert.doesNotMatch(overview, /既定branchは`develop`/);
});

test("各Skillの開始・停止契約とMain単独の引き渡し責務を確認する", async () => {
  const documents = await Promise.all(requiredSkills.map((skill) => read(".agents/skills/" + skill + "/SKILL.md")));
  for (const document of documents) {
    for (const token of ["AI：作業可能", "現在のチャット指示", "人間承認待ち", "未付与", "複数競合", "不整合"]) assert.match(document, new RegExp(token));
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

test("工程別の人間承認引き渡し先が正確である", async () => {
  const [overview, designGate] = await Promise.all([read("docs/ai-development/overview.md"), read(".agents/skills/check-design-impact/SKILL.md")]);
  const handoff = overview.match(/### 人間への引き渡し[\s\S]*?## 要求分析/)?.[0] ?? "";
  const mappings = [
    [/要求分析書とRequirement Analysis PR[\s\S]*?人間：要求分析承認待ち/, "requirements"],
    [/設計PR[\s\S]*?人間：基本設計承認待ち/, "design"],
    [/設計変更不要という判断とRequirement Issueへの根拠コメント[\s\S]*?人間：基本設計承認待ち/, "no-design"],
    [/人間が承認可能なタスク計画[\s\S]*?人間：タスク承認待ち/, "task-plan"],
    [/全Task、統合・回帰検証、全受入条件確認を終えたIssue統合PR[\s\S]*?人間：最終成果物承認待ち/, "final"],
  ];
  for (const [pattern, name] of mappings) assert.match(handoff, pattern, name);
  assert.match(designGate, /設計変更なし|設計変更不要/);
  assert.match(designGate, /Requirement Issueへコメント|根拠コメント/);
  assert.match(designGate, /同じ指示|同一指示/);
  assert.match(designGate, /Task Planning|タスク計画/);
  assert.match(designGate, /同じ作業指示でタスク分解へ進まない|同じ指示でTask Planningへ進まない/);
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

const hasIssueEvent = (onContent) => {
  const lines = onContent.split(/\r?\n/).map((line) => line.replace(/#.*/, ""));
  const significant = lines.filter((line) => /\S/.test(line));
  if (significant.length === 0) return false;
  const minIndent = Math.min(...significant.map((line) => line.search(/\S/)));
  return significant.filter((line) => line.search(/\S/) === minIndent).some((line) => {
    const value = line.trim();
    return /^-\s*["']?(?:issues|issue_comment)["']?\s*$/.test(value)
      || /^["']?(?:issues|issue_comment)["']?\s*:/.test(value)
      || /^(?:\[|["']?)(?:issues|issue_comment)(?:["']?\]|\s*$)/.test(value);
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
  assert.doesNotMatch(workflowOnContent(safe), /(?:^|[\s,\[])(?:issues|issue_comment)(?:$|[\s,\]])/m);
  assert.match(workflowOnContent(multilineIssue), /^\s*issues\s*:/m);
  assert.match(workflowOnContent(inlineIssue), /issues/);
  assert.match(workflowOnContent(inlineIssueName), /issue_comment/);
});

test("workflowのIssueイベントpredicateはon直下だけを判定する", () => {
  const safe = "name: safe\non:\n  pull_request:\n    branches: [issues]\n";
  const safeList = "name: safe\non:\n  pull_request:\n    branches:\n      - issues\n";
  const multilineIssue = "name: issue\non:\n  pull_request:\n  issues:\n    types: [opened]\n";
  const sequenceIssue = "name: issue\non:\n  - pull_request\n  - issue_comment\n";
  const quotedIssue = "name: issue\non:\n  'issues':\n";
  const inlineIssue = "name: issue\non: [issues]\n";
  const inlineQuotedIssue = "name: issue\non: 'issue_comment'\n";
  assert.equal(hasIssueEvent(workflowOnContent(safe)), false);
  assert.equal(hasIssueEvent(workflowOnContent(safeList)), false);
  assert.equal(hasIssueEvent(workflowOnContent(multilineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(sequenceIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(quotedIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineQuotedIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent("on:\n  pull_request:\n  # issues: opened\n")), false);
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
