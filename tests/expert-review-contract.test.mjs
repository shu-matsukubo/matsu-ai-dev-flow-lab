import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, readdir, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(join(root, path), "utf8");
const skillsRoot = join(root, ".agents", "skills");
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

function parseSkill(source, path) {
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(frontMatter, path + " must have metadata");
  const fields = new Map();
  for (const line of frontMatter[1].split(/\r?\n/)) {
    const match = line.match(/^([a-z][a-z0-9_-]*):\s*["']?(.+?)["']?$/i);
    if (match) fields.set(match[1], match[2]);
  }
  return { name: fields.get("name"), description: fields.get("description"), source, body: source.slice(frontMatter[0].length), path };
}

async function discoverSkills(directory = skillsRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name, "SKILL.md");
    const skill = parseSkill(await readFile(path, "utf8"), path);
    assert.equal(skill.name, entry.name);
    skills.push(skill);
  }
  return skills;
}

function selectExpertCapability(skills) {
  const candidates = skills.filter((skill) => /独立した専門レビュー担当へ相談/.test(skill.description));
  assert.equal(candidates.length, 1, "専門レビュー能力はmetadata/descriptionから一意に選択できること");
  for (const heading of ["# 提供能力", "## 適用条件", "## 入力", "## 出力", "## 責務外", "## 能力固有の処理", "## 失敗・未実施・残るリスク"]) {
    assert.ok(candidates[0].body.includes(heading), heading);
  }
  return candidates[0];
}

test("runtime metadataと能力契約から専門レビュー能力を動的に一意選択できる", async () => {
  const skills = await discoverSkills();
  const selected = selectExpertCapability(skills);
  assert.match(selected.description, /高難度.*高リスク.*判断困難/);
  assert.match(selected.body, /工程、成果物種別、Workflow状態.*依存しない/);
  assert.match(selected.body, /確認したい論点.*理由/);
  assert.match(selected.body, /対象範囲.*対象外/);
  assert.match(selected.body, /Completed.*Unavailable.*Insufficient Input.*No Result/);
  assert.match(selected.body, /finding.*判断根拠.*確認範囲/);
  assert.match(selected.body, /元Agent.*対応.*非対応.*追加確認.*人間判断/);
});

test("能力名称を変更してもWorkflow、AGENTS、他Skillは変更不要で再発見できる", async () => {
  const beforeSkills = await discoverSkills();
  const selected = selectExpertCapability(beforeSkills);
  const workflowFiles = await markdownFiles(join(root, "docs", "ai-development", "workflows"));
  const stableFiles = [join(root, "AGENTS.md"), ...workflowFiles];
  const stableBefore = await Promise.all(stableFiles.map((path) => readFile(path, "utf8")));
  const oldNamePattern = new RegExp(selected.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  for (const source of stableBefore) assert.doesNotMatch(source, oldNamePattern);
  const unrelatedBefore = new Map(beforeSkills.filter((skill) => skill.name !== selected.name).map((skill) => [skill.name, skill.source]));
  const temporaryRoot = await mkdtemp(join(tmpdir(), "matsu-expert-review-"));
  const fixtureRoot = join(temporaryRoot, ".agents", "skills");
  try {
    await cp(skillsRoot, fixtureRoot, { recursive: true });
    const renamedDirectory = join(fixtureRoot, "independent-review-capability");
    await rename(join(fixtureRoot, selected.name), renamedDirectory);
    const renamedPath = join(renamedDirectory, "SKILL.md");
    const renamedSource = (await readFile(renamedPath, "utf8")).replace(`name: ${selected.name}`, "name: independent-review-capability");
    const { writeFile } = await import("node:fs/promises");
    await writeFile(renamedPath, renamedSource);
    const afterSkills = await discoverSkills(fixtureRoot);
    const renamed = selectExpertCapability(afterSkills);
    assert.equal(renamed.name, "independent-review-capability");
    assert.equal(renamed.source, renamedSource);
    assert.equal(renamed.body, selected.body);
    for (const [name, source] of unrelatedBefore) {
      const unchanged = afterSkills.find((skill) => skill.name === name);
      assert.ok(unchanged, name);
      assert.equal(unchanged.source, source, name);
    }
    assert.deepEqual(await Promise.all(stableFiles.map((path) => readFile(path, "utf8"))), stableBefore);
    for (const source of stableBefore) assert.doesNotMatch(source, /independent-review-capability/);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
const scenarios = [
  { scenario: "securityまたは復旧困難な高リスク判断", request: "依頼する", state: "Completed", returnToAgent: "元Agentが正本照合、対応判断、通常フロー復帰", handoff: "finding、未確認事項、remaining riskを引き継ぐ" },
  { scenario: "元Agentが判断困難または高不確実性を認識", request: "依頼する", state: "Completed", returnToAgent: "元Agentが正本照合、対応判断、通常フロー復帰", handoff: "前提、未確認事項、remaining riskを引き継ぐ" },
  { scenario: "低影響で可逆的かつ根拠が明確", request: "依頼しない", state: "なし", returnToAgent: "元Agentが通常フローを継続し、専門レビュー結果状態を作らない", handoff: "専門レビューの定型記録は不要。通常の残るリスクを管理する" },
  { scenario: "役割または能力が利用不能", request: "依頼する", state: "Unavailable", returnToAgent: "元Agentへ理由と状態を返し、成功扱いせず追加確認・停止・代替・人間判断を選ぶ", handoff: "理由、未確認事項、remaining riskを引き継ぐ" },
  { scenario: "入力不足", request: "依頼する", state: "Insufficient Input", returnToAgent: "元Agentへ不足項目と状態を返し、推測せず成功扱いしない", handoff: "不足項目、未確認事項、remaining riskを引き継ぐ" },
  { scenario: "実行後に有効な結果を取得できない", request: "依頼する", state: "No Result", returnToAgent: "元Agentへ取得不能の状態を返し、成功扱いせず追加確認・停止・代替・人間判断を選ぶ", handoff: "理由、未確認事項、remaining riskを引き継ぐ" },
];

function parseScenarioTable(source) {
  const section = source.split("### 代表事例契約")[1]?.split("## 失敗・未実施・残るリスク")[0] ?? "";
  return section.split(/\r?\n/)
    .filter((line) => /^\|/.test(line) && !/^\|\s*-+/.test(line))
    .slice(1)
    .map((line) => {
      const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
      assert.equal(cells.length, 5, line);
      return { scenario: cells[0], request: cells[1], state: cells[2], returnToAgent: cells[3], handoff: cells[4] };
    });
}

test("6代表事例表を行単位で解析し、依頼判断・状態・責務返却・引継ぎを比較する", async () => {
  const skill = selectExpertCapability(await discoverSkills());
  assert.deepEqual(parseScenarioTable(skill.body), scenarios);
  assert.equal(new Set(parseScenarioTable(skill.body).map((row) => row.scenario)).size, 6);
});
test("Agent設定に入力探索と機微情報の非取得境界がある", async () => {
  const agent = await read(".codex/agents/expert-reviewer.toml");
  assert.match(agent, /^model = "gpt-6-astra"$/m);
  assert.match(agent, /^model_reasoning_effort = "max"$/m);
  assert.match(agent, /^sandbox_mode = "read-only"$/m);
  assert.match(agent, /明示的な入力と指定されたrevision以外を自ら探索・参照しない/);
  assert.match(agent, /secret.*credential.*\.env.*取得.*参照.*保存しない/);
  assert.match(agent, /成果物、記録、外部状態を変更せず/);
  assert.match(agent, /子Agent.*再エスカレーション.*多階層routing/);
});

test("専門レビューは通常reviewとverificationを置き換えず、抽象Workflowへ戻る", async () => {
  const [skill, lifecycle, artifact, task] = await Promise.all([
    read(".agents/skills/request-expert-review/SKILL.md"),
    read("docs/ai-development/workflows/requirement-lifecycle.md"),
    read("docs/ai-development/workflows/artifact-patterns.md"),
    read("docs/ai-development/workflows/task-submission.md"),
  ]);
  assert.match(skill, /通常のself review、独立review、verification、提出の置換/);
  assert.match(lifecycle, /正本と照合.*通常工程へ戻す/);
  assert.match(artifact, /追加相談.*作業主体.*最終判断/);
  assert.match(task, /専門レビュー.*追加相談/);
  assert.equal((task.match(/^## Taskのreviewとverification$/gm) ?? []).length, 1);
  assert.match(task, /通常review、verification、提出、人間の承認境界を維持/);
});
