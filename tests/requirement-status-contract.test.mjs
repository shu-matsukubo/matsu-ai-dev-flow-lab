import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const root = join(import.meta.dirname, "..");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");

const statusLabels = ["人間：要求承認待ち", "AI：作業可能", "人間：要求分析承認待ち", "人間：基本設計承認待ち", "人間：タスク承認待ち", "人間：最終成果物承認待ち"];
const requiredSkills = ["analyze-requirement", "check-design-impact", "coordinate-approved-tasks", "plan-tasks", "process-flow-feedback", "publish-task-pr", "review-changes", "verify-changes"];

test("Requirement Issueで使うステータスラベルは指定された6種類だけである", async () => {
  const requirements = await read("requirements/35.md");
  const labelSection = requirements.match(/### RQ-01[\\s\\S]*?### RQ-02/)?.[0] ?? "";
  const labels = labelSection.match(/^  - .+$/gm)?.map((line) => line.slice(4)) ?? [];
  assert.deepEqual(labels, statusLabels);
  const agents = await read("AGENTS.md");
  for (const label of statusLabels) assert.match(agents, new RegExp(label));
  assert.doesNotMatch(agents, /AI：(?:要求分析|基本設計|タスク|最終成果物)[^\
]*可能/);
  assert.doesNotMatch(agents, /人間：回答待ち/);
});

test("Requirement Issue Formは人間による要求確認から開始する", async () => {
  const form = await read(".github/ISSUE_TEMPLATE/requirement.yml");
  assert.match(form, /^labels:\\s*\\["人間：要求承認待ち"\\]\\s*$/m);
  assert.doesNotMatch(form, /AI：作業可能/);
});

test("既定branchと開発・Issue統合branchの責務が設計に明記されている", async () => {
  const [flow, agents] = await Promise.all([read("docs/ai-development/overview.md"), read("AGENTS.md")]);
  for (const document of [flow, agents]) {
    assert.match(document, /既定branch[：:]?\\s*main/);
    assert.match(document, /(?:開始点|作業開始点|Issue統合(?:PR)?のbase|統合base)[^\
]*develop/);
  }
});

test("全工程の開始ゲート、安全停止、永続情報復元の契約が各Skillにある", async () => {
  const documents = await Promise.all(requiredSkills.map((skill) => read(".agents/skills/" + skill + "/SKILL.md")));
  for (const document of documents) {
    assert.match(document, /AI：作業可能/);
    assert.match(document, /現在のチャット指示/);
    assert.match(document, /人間承認待ち/);
    assert.match(document, /未付与/);
    assert.match(document, /複数競合/);
    assert.match(document, /不整合/);
    assert.match(document, /Worker、Reviewer|Worker\\/Reviewer|Worker・Reviewer/);
  }
  const agents = await read("AGENTS.md");
  assert.match(agents, /永続情報から次工程/);
  assert.match(agents, /以前のステータスを残さず/);
  assert.match(agents, /非ステータスラベルを保持/);
  assert.match(agents, /変更後のIssueを再取得/);
  assert.match(agents, /Mainだけ/);
});

test("自動起動・自動merge・自動closeの境界を追加していない", async () => {
  const workflow = await read(".github/workflows/ci.yml");
  assert.doesNotMatch(workflow, /^\\s*issues\\s*:/m);
  assert.doesNotMatch(workflow, /AI.*(?:dispatch|起動)|(?:auto|自動).*(?:merge|close)/i);
  const [agents, testing] = await Promise.all([read("AGENTS.md"), read("docs/quality/testing.md")]);
  for (const document of [agents, testing]) {
    assert.match(document, /自動(?:起動|実行)/);
    assert.match(document, /自動merge/);
    assert.match(document, /自動close/);
  }
});
