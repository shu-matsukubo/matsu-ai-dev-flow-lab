import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = join(root, ".agents", "skills");
const workflowsRoot = join(root, "docs", "ai-development", "workflows");
const referencesRoot = join(root, "docs", "ai-development", "references");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");

const activeStatusLabels = [
  "人間：要求承認待ち",
  "AI：作業可能",
  "人間：PR確認待ち",
  "人間：タスク承認待ち",
];
const retiredStatusLabels = [
  "人間：要求分析承認待ち",
  "人間：基本設計承認待ち",
  "人間：最終成果物承認待ち",
];
const requiredSkillHeadings = [
  "# 提供能力",
  "## 適用条件",
  "## 入力",
  "## 出力",
  "## 責務外",
  "## 能力固有の処理",
  "## 失敗・未実施・残るリスク",
];
const requiredReferenceHeadings = [
  "## 目的",
  "## 適用対象",
  "## 判断基準",
  "## 対象外",
  "## 設計上の根拠",
];

const stripQuotes = (value) => value.trim().replace(/^["']|["']$/g, "");

function parseSkill(source, path) {
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(frontMatter, path + " must start with YAML front matter");
  const fields = new Map();
  for (const line of frontMatter[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z][a-z0-9_-]*):\s*(.+)$/i);
    if (field) fields.set(field[1], stripQuotes(field[2]));
  }
  const name = fields.get("name");
  const description = fields.get("description");
  assert.ok(name, path + " must declare name");
  assert.ok(description, path + " must declare description");
  for (const heading of requiredSkillHeadings) {
    assert.ok(source.includes(heading), path + " is missing " + heading);
  }
  return { name, description, path, source, body: source.slice(frontMatter[0].length) };
}

async function discoverSkills(directory = skillsRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name, "SKILL.md");
    const source = await readFile(path, "utf8");
    const skill = parseSkill(source, path);
    assert.equal(skill.name, entry.name, path + " name must match its directory");
    skills.push(skill);
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  assert.ok(skills.length > 0, "at least one runtime capability must be discoverable");
  assert.equal(new Set(skills.map((skill) => skill.name)).size, skills.length, "skill names must be unique");
  return skills;
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (/\.md$/i.test(entry.name)) files.push(path);
  }
  return files.sort();
}

const escapePattern = (value) => value.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");

test("runtime catalogから各Skillの能力契約を動的に発見できる", async () => {
  const skills = await discoverSkills();
  for (const skill of skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, skill.path);
    assert.ok(skill.description.length >= 20, skill.path + " description is too vague");
    const output = skill.body.split("## 出力")[1]?.split(/\n## /)[0] ?? "";
    const outOfScope = skill.body.split("## 責務外")[1]?.split(/\n## /)[0] ?? "";
    assert.match(output, /\S/, skill.path + " output contract");
    assert.match(outOfScope, /\S/, skill.path + " out-of-scope contract");
  }
});

test("Skillは別Skillの識別名や呼び出しへ依存しない", async () => {
  const skills = await discoverSkills();
  for (const skill of skills) {
    assert.doesNotMatch(skill.body, /\$[a-z0-9][a-z0-9-]*/i, skill.path);
    for (const other of skills) {
      if (other.name === skill.name) continue;
      assert.doesNotMatch(skill.body, new RegExp(escapePattern(other.name), "i"), skill.path + " -> " + other.name);
    }
    for (const label of [...activeStatusLabels, ...retiredStatusLabels]) {
      assert.ok(!skill.body.includes(label), skill.path + " must not own workflow status " + label);
    }
  }
});

test("review、verification、submissionを能力説明と契約から独立に選べる", async () => {
  const skills = await discoverSkills();
  const selectOne = (descriptionPattern, bodyPatterns, label) => {
    const candidates = skills.filter((skill) => descriptionPattern.test(skill.description));
    assert.equal(candidates.length, 1, label + " must have one unambiguous capability");
    for (const pattern of bodyPatterns) assert.match(candidates[0].body, pattern, label);
    return candidates[0];
  };
  const review = selectOne(/レビュー.*finding/, [/重要度/, /remaining risk/i, /成果物の修正/], "review");
  const verification = selectOne(/Passed.*Failed.*Not Executed.*Remaining Risk/, [/期待結果/, /証拠/, /成功.*読み替えない/], "verification");
  const submission = selectOne(/GitHub.*提出結果.*未完了境界/, [/remote.*再取得/, /部分成功/, /merge.*branch削除.*Issue close/], "submission");
  assert.equal(new Set([review.name, verification.name, submission.name]).size, 3);
});

test("AGENTS.mdは安定原則だけを持ち、runtimeの個別Skillを知らない", async () => {
  const [agents, skills] = await Promise.all([read("AGENTS.md"), discoverSkills()]);
  for (const skill of skills) {
    assert.doesNotMatch(agents, new RegExp(escapePattern(skill.name), "i"), skill.name);
  }
  assert.doesNotMatch(agents, /\$[a-z0-9][a-z0-9-]*/i);
  for (const token of [
    "現在の人間指示",
    "承認済みscope",
    "現在の要求、設計、実装",
    "利用可能なWorkflow、Skill、Reference",
    "sh scripts/verify.sh",
    "GitHub連携だけ",
    "git push",
    "gh",
    "直接`curl`",
    "Pull Requestをmergeせず",
    "branchを削除せず",
    "Requirement Issueをcloseしない",
  ]) assert.ok(agents.includes(token), token);
});

test("overviewは正本とruntime discoveryの入口に限定される", async () => {
  const [overview, skills] = await Promise.all([
    read("docs/ai-development/overview.md"),
    discoverSkills(),
  ]);
  for (const skill of skills) {
    assert.doesNotMatch(overview, new RegExp(escapePattern(skill.name), "i"), skill.name);
  }
  assert.match(overview, /name.*description/);
  assert.match(overview, /SKILL\.mdを全文読み/);
  assert.match(overview, /固定Skill registry.*作らない/);
  assert.match(overview, /references\/.*目的.*適用対象/s);
  assert.match(overview, /Not Executedまたは不足/);
});

test("Workflowは個別Skill名なしで能力、順序、承認、停止と再開を所有する", async () => {
  const [workflowPaths, skills] = await Promise.all([markdownFiles(workflowsRoot), discoverSkills()]);
  assert.ok(workflowPaths.length >= 3);
  for (const path of workflowPaths) {
    const source = await readFile(path, "utf8");
    assert.match(source, /^# .+/);
    assert.match(source, /## 目的/);
    assert.doesNotMatch(source, /\$[a-z0-9][a-z0-9-]*/i, path);
    for (const skill of skills) {
      assert.doesNotMatch(source, new RegExp(escapePattern(skill.name), "i"), path + " -> " + skill.name);
    }
  }
  const combined = (await Promise.all(workflowPaths.map((path) => readFile(path, "utf8")))).join("\n");
  for (const token of ["必要な能力", "Agent構成", "承認", "停止", "再開", "順序"]) {
    assert.match(combined, new RegExp(token), token);
  }
});

test("Requirement Issueの4状態、開始ゲート、正式引き渡しを一意に保つ", async () => {
  const workflow = await read("docs/ai-development/workflows/requirement-lifecycle.md");
  const statusSection = workflow.split("## AI作業開始ゲート")[0].split("## ステータス契約")[1] ?? "";
  const tableLabels = [...statusSection.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]);
  assert.deepEqual(tableLabels, activeStatusLabels);
  assert.equal(new Set(tableLabels).size, activeStatusLabels.length);
  for (const label of retiredStatusLabels) assert.ok(statusSection.includes(label), label);
  for (const token of [
    "移行完了まで安全停止",
    "ステータス集合が`AI：作業可能`の1種類だけ",
    "現在のチャット指示",
    "自ら付与して作業権を取得しない",
    "ステータス以外のラベルを保持",
    "以前のステータスを残さず",
    "更新後のIssueを再取得",
    "同じ作業指示では次工程へ進まず停止",
    "Worker、Reviewer、個別能力はステータスを変更しない",
  ]) assert.ok(workflow.includes(token), token);
});

test("要求分析、設計、Task計画、Issue統合の人間承認境界を維持する", async () => {
  const workflow = await read("docs/ai-development/workflows/requirement-lifecycle.md");
  for (const pattern of [
    /Requirement Analysis PR.*人間：PR確認待ち/s,
    /設計PR完成後.*人間：PR確認待ち/s,
    /Task計画.*人間：タスク承認待ち/s,
    /完成したIssue統合PR.*人間：PR確認待ち/s,
    /人間がmerge.*新しいチャット指示.*停止/s,
  ]) assert.match(workflow, pattern);
  assert.match(workflow, /未確定.*場合だけ.*質問/s);
  assert.match(workflow, /回答後は同一事項を再承認しない/);
});

test("二階層PR、branch責務、非自動close、人間だけの最終操作を維持する", async () => {
  const workflow = await read("docs/ai-development/workflows/task-submission.md");
  for (const token of [
    "既定branchは`main`",
    "開発作業の起点とIssue統合PRのbaseは`develop`",
    "Issue単位のbranchから`main`へ直接backportしない",
    "issue/<issue-id>",
    "task/<issue-id>-<task-id>",
    "Task PRは対応するIssue branchをbase",
    "Issue統合PRは`develop`をbase",
    "Refs #<number>",
    "自動close",
    "Closes",
    "Fixes",
    "Resolves",
    "Task PRの公開だけではRequirement Issueのステータスを変更しない",
    "AIはTask PRをmergeせず",
    "AIはIssue統合PRをmergeせず",
  ]) assert.ok(workflow.includes(token), token);
});

test("標準、高リスク、小規模の成果物作成パターンを役割と能力で表現する", async () => {
  const workflow = await read("docs/ai-development/workflows/artifact-patterns.md");
  for (const token of ["標準", "高リスク", "小規模", "Worker", "独立Reviewer", "Main", "self review", "verification", "提出"]) {
    assert.match(workflow, new RegExp(token), token);
  }
  assert.match(workflow, /modelとreasoning effortは`\.codex\/`だけが所有/);
});

test("Referenceをdirectoryから動的に発見し、非実行の判断知識として扱える", async () => {
  const paths = await markdownFiles(referencesRoot);
  assert.ok(paths.length > 0);
  const sources = [];
  const skills = await discoverSkills();
  for (const path of paths) {
    const source = await readFile(path, "utf8");
    sources.push(source);
    for (const heading of requiredReferenceHeadings) {
      assert.ok(source.includes(heading), path + " is missing " + heading);
    }
    for (const label of [...activeStatusLabels, ...retiredStatusLabels]) {
      assert.ok(!source.includes(label), path + " must not own status " + label);
    }
    for (const skill of skills) {
      assert.doesNotMatch(source, new RegExp(escapePattern(skill.name), "i"), path + " -> " + skill.name);
    }
    const outside = source.split("## 対象外")[1]?.split(/\n## /)[0] ?? "";
    assert.match(outside, /実行|操作|作成|変更|更新/, path + " must state its non-execution boundary");
  }
  const combined = sources.join("\n");
  for (const token of ["finding", "Passed", "Not Executed", "Task分解", "Pull Request本文", "secret", "pending/", "対応不要"]) {
    assert.match(combined, new RegExp(escapePattern(token), "i"), token);
  }
});

test("Flow Feedbackの通常記録と承認済み処理を分離する", async () => {
  const workflow = await read("docs/ai-development/workflows/flow-feedback.md");
  const reference = await read("docs/ai-development/references/flow-feedback.md");
  for (const pattern of [
    /通常Task/,
    /新しい観測/,
    /既存feedbackの検索、整理、重複統合/,
    /専用Requirement Issue/,
    /対象.*集合を固定/,
    /読み取り評価/,
    /人間が評価案を明示承認するまで/,
    /Mainだけ/,
  ]) assert.match(workflow, pattern);
  for (const token of ["pending/", "resolved/", "dismissed/", "対応する", "対応不要", "別Issueとして扱う"]) {
    assert.ok(workflow.includes(token), token);
    assert.ok(reference.includes(token), token);
  }
  assert.doesNotMatch(workflow + reference, /\baccepted\b/i);
});

test("Agent定義は役割と実行設定だけを所有する", async () => {
  const [worker, reviewer, skills] = await Promise.all([
    read(".codex/agents/worker.toml"),
    read(".codex/agents/reviewer.toml"),
    discoverSkills(),
  ]);
  for (const source of [worker, reviewer]) {
    assert.match(source, /^name = /m);
    assert.match(source, /^model = /m);
    assert.match(source, /^model_reasoning_effort = /m);
    assert.match(source, /^sandbox_mode = /m);
    for (const label of [...activeStatusLabels, ...retiredStatusLabels]) assert.ok(!source.includes(label), label);
    for (const skill of skills) assert.doesNotMatch(source, new RegExp(escapePattern(skill.name), "i"), skill.name);
  }
  assert.match(worker, /担当scope/);
  assert.match(worker, /self review/);
  assert.match(reviewer, /独立レビュー/);
  assert.match(reviewer, /成果物、記録、外部状態を変更せず/);
});

test("既存構造の棚卸しと再配置先を設計判断記録から追跡できる", async () => {
  const design = await read("docs/design-decisions/52.md");
  const section = design.split("### 重複している判断知識")[0].split("### 既存Skill")[1] ?? "";
  const rows = [...section.matchAll(/^\| `([^`]+)` \| ([^|]+) \| ([^|]+) \|$/gm)];
  assert.ok(rows.length >= 9, "the historical inventory must cover all skills that existed before migration");
  for (const row of rows) {
    assert.match(row[2], /\S/);
    assert.match(row[3], /能力|Workflow|Reference|廃止|分離/);
  }
  assert.match(design, /AGENTS\.md.*9つの個別Skill.*列挙/s);
  assert.match(design, /重複している判断知識/);
});

test("要求・Task・Flow Feedback templateは新しい責務境界と整合する", async () => {
  const [requirement, taskRecord, feedback, skills] = await Promise.all([
    read("requirements/TEMPLATE.md"),
    read(".issue-tasks/TEMPLATE.md"),
    read(".flow-feedback/TEMPLATE.md"),
    discoverSkills(),
  ]);
  for (const source of [requirement, taskRecord, feedback]) {
    assert.doesNotMatch(source, /\$[a-z0-9][a-z0-9-]*/i);
    for (const skill of skills) assert.doesNotMatch(source, new RegExp(escapePattern(skill.name), "i"), skill.name);
  }
  assert.match(requirement, /この成果物を利用するWorkflow/);
  assert.match(taskRecord, /承認済み計画の役割構成/);
  assert.match(feedback, /1件1file/);
  assert.match(feedback, /配置directory.*正本/);
});

test("能力の追加・名称変更・削除がAGENTS.mdと無関係なSkillを変更しない", async () => {
  const runtimeSkills = await discoverSkills();
  assert.ok(runtimeSkills.length >= 3, "fixture needs three independent capabilities");
  const temporaryRoot = await mkdtemp(join(tmpdir(), "matsu-skill-contract-"));
  const fixtureRoot = join(temporaryRoot, ".agents", "skills");
  const fixtureAgentsPath = join(temporaryRoot, "AGENTS.md");
  const repositoryAgentsBefore = await read("AGENTS.md");
  try {
    await cp(skillsRoot, fixtureRoot, { recursive: true });
    await cp(join(root, "AGENTS.md"), fixtureAgentsPath);
    const fixtureAgentsBefore = await readFile(fixtureAgentsPath, "utf8");
    const fixtureSkills = await discoverSkills(fixtureRoot);
    const renamedSkill = fixtureSkills[0];
    const removedSkill = fixtureSkills[1];
    const unrelatedSkill = fixtureSkills[2];
    const unrelatedBefore = await readFile(unrelatedSkill.path, "utf8");

    const addedName = "fixture-capability";
    const addedDirectory = join(fixtureRoot, addedName);
    await mkdir(addedDirectory);
    await writeFile(join(addedDirectory, "SKILL.md"), [
      "---",
      "name: " + addedName,
      'description: "fixture上で独立した能力の追加を確認するためのテスト用契約である。"',
      "---",
      "",
      "# 提供能力",
      "",
      "fixture検証用の結果を返す。",
      "",
      "## 適用条件",
      "",
      "- fixture内である。",
      "",
      "## 入力",
      "",
      "- 固定入力",
      "",
      "## 出力",
      "",
      "- 確認結果",
      "",
      "## 責務外",
      "",
      "- 外部変更",
      "",
      "## 能力固有の処理",
      "",
      "入力を確認する。",
      "",
      "## 失敗・未実施・残るリスク",
      "",
      "不足を明示する。",
      "",
    ].join("\n"), "utf8");
    const afterAddition = await discoverSkills(fixtureRoot);
    assert.ok(afterAddition.some((skill) => skill.name === addedName));

    const renamedName = renamedSkill.name + "-renamed";
    const renamedDirectory = join(fixtureRoot, renamedName);
    await rename(join(fixtureRoot, renamedSkill.name), renamedDirectory);
    const renamedPath = join(renamedDirectory, "SKILL.md");
    const renamedSource = await readFile(renamedPath, "utf8");
    await writeFile(renamedPath, renamedSource.replace(/^name:\s*.+$/m, "name: " + renamedName), "utf8");
    const afterRename = await discoverSkills(fixtureRoot);
    assert.ok(afterRename.some((skill) => skill.name === renamedName));
    assert.ok(!afterRename.some((skill) => skill.name === renamedSkill.name));

    await rm(join(fixtureRoot, removedSkill.name), { recursive: true, force: true });
    const afterRemoval = await discoverSkills(fixtureRoot);
    assert.ok(!afterRemoval.some((skill) => skill.name === removedSkill.name));
    assert.ok(afterRemoval.some((skill) => skill.name === addedName));
    assert.ok(afterRemoval.some((skill) => skill.name === renamedName));

    const unrelatedAfter = await readFile(join(fixtureRoot, basename(dirname(unrelatedSkill.path)), "SKILL.md"), "utf8");
    assert.equal(unrelatedAfter, unrelatedBefore);
    assert.equal(await readFile(fixtureAgentsPath, "utf8"), fixtureAgentsBefore);
    assert.equal(await read("AGENTS.md"), repositoryAgentsBefore);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
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

async function githubWorkflowFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await githubWorkflowFiles(path));
    else if (/\.ya?ml$/i.test(entry.name)) files.push(path);
  }
  return files;
}

test("workflowのIssueイベントpredicateはinlineと複数行を正しく判定する", () => {
  const safe = "name: safe\non:\n  pull_request:\n    branches: [issues]\n";
  const multilineIssue = "name: issue\non:\n  pull_request:\n  issues:\n    types: [opened]\n";
  const sequenceIssue = "name: issue\non:\n  - pull_request\n  - issue_comment\n";
  const inlineIssue = "name: issue\non: [push, issues]\n";
  const inlineSafe = "name: safe\non: [push, pull_request]\n";
  const mappingIssue = "name: issue\non: {push: null, issues: null}\n";
  assert.equal(hasIssueEvent(workflowOnContent(safe)), false);
  assert.equal(hasIssueEvent(workflowOnContent(multilineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(sequenceIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineIssue)), true);
  assert.equal(hasIssueEvent(workflowOnContent(inlineSafe)), false);
  assert.equal(hasIssueEvent(workflowOnContent(mappingIssue)), true);
});

test("GitHub ActionsへIssue起動・自動merge・自動closeを追加していない", async () => {
  const files = await githubWorkflowFiles(join(root, ".github", "workflows"));
  assert.ok(files.length > 0);
  for (const path of files) {
    const workflow = await readFile(path, "utf8");
    const onBlock = workflowOnContent(workflow);
    assert.equal(hasIssueEvent(onBlock), false, path);
    assert.doesNotMatch(onBlock, /^\s*(?:issues|issue_comment)\s*:/m, path);
  }
  const lifecycle = await read("docs/ai-development/workflows/requirement-lifecycle.md");
  assert.match(lifecycle, /ラベル変更だけを契機とするAI起動/);
  assert.match(lifecycle, /Pull Requestの自動merge/);
  assert.match(lifecycle, /Requirement Issueの自動close/);
});
