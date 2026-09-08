import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = join(root, ".agents", "skills");
const read = (relativePath) => readFile(join(root, relativePath), "utf8");

const requiredSections = [
  "提供能力",
  "適用条件",
  "入力",
  "出力",
  "責務外",
  "能力固有の処理",
  "失敗・未実施・残るリスク",
];
const dependencySections = requiredSections.filter((section) => section !== "責務外");
const guideDescriptionConcepts = ["新規設計", "変更", "分割", "統合", "削除", "設計レビュー", "自己完結", "責務配置"];

const stripQuotes = (value) => value.trim().replace(/^["']|["']$/g, "");
const escapePattern = (value) => value.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&");

function parseSections(body) {
  const sections = new Map();
  let current = null;
  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^#{1,2}\s+(.+?)\s*$/);
    if (heading) {
      current = heading[1];
      sections.set(current, []);
    } else if (current) {
      sections.get(current).push(line);
    }
  }
  return new Map([...sections].map(([name, lines]) => [name, lines.join("\n").trim()]));
}

function parseSkill(source, path = "<memory>") {
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
  const body = source.slice(frontMatter[0].length);
  return { name, description, path, source, body, sections: parseSections(body) };
}

async function discoverSkills(directory = skillsRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name, "SKILL.md");
    const skill = parseSkill(await readFile(path, "utf8"), path);
    assert.equal(skill.name, entry.name, path + " name must match its directory");
    skills.push(skill);
  }
  skills.sort((left, right) => left.name.localeCompare(right.name));
  assert.equal(new Set(skills.map((skill) => skill.name)).size, skills.length);
  return skills;
}

function isDesignGuide(skill) {
  return guideDescriptionConcepts.every((concept) => skill.description.includes(concept));
}

function selectDesignGuide(skills) {
  const candidates = skills.filter(isDesignGuide);
  assert.equal(candidates.length, 1, "Skill設計ガイドはdescriptionから一意に選択できること");
  return candidates[0];
}

function isDesignGuideExampleLine(skill, subsection, line) {
  const value = line.trim();
  if (!isDesignGuide(skill) || subsection !== "記述例") return false;
  return /^\|\s*(?:判定|禁止|許可)\s*\|/.test(value) || /^\|\s*:?-+/.test(value);
}

function hasPositiveOperation(value, operations) {
  return operations.some((operation) => {
    const escaped = escapePattern(operation);
    if (operation === "呼び出") {
      return /呼び出(?:す|して|させる|させて)|を呼び出し[、て]|呼び出しを(?:要求する|必要とする|前提(?:と|に)する)/.test(value);
    }
    const finiteOperation = new RegExp(`${escaped}(?:する|して|させる|させて)`);
    const connectiveOperation = new RegExp(`を${escaped}し[、て]`);
    const requiredOperation = new RegExp(`${escaped}を(?:要求する|必要とする|前提(?:と|に)する)`);
    return finiteOperation.test(value) || connectiveOperation.test(value) || requiredOperation.test(value);
  });
}

function addFinding(findings, code, section, line, detail) {
  if (findings.some((finding) => finding.code === code && finding.section === section && finding.line === line)) return;
  findings.push({ code, section, line, detail });
}

function validateSkillDesign(skill, allSkills) {
  const findings = [];
  for (const section of requiredSections) {
    if (!skill.sections.has(section)) {
      addFinding(findings, "missing-contract-section", section, "", "能力契約sectionが存在しない");
    } else if (!skill.sections.get(section).trim()) {
      addFinding(findings, "empty-contract-section", section, "", "能力契約sectionに意味のある内容がない");
    }
  }

  const referencedNames = new Set();
  for (const section of dependencySections) {
    const source = skill.sections.get(section) ?? "";
    let subsection = null;
    for (const line of source.split(/\r?\n/)) {
      const value = line.trim();
      const heading = value.match(/^#{3,6}\s+(.+?)\s*$/);
      if (heading) {
        subsection = heading[1];
        continue;
      }
      if (!value || isDesignGuideExampleLine(skill, subsection, line)) continue;
      if (/\$[a-z0-9](?:[a-z0-9-]*)(?=$|[^a-z0-9-])/i.test(value)) {
        addFinding(findings, "dollar-skill-identifier", section, value, "`$`形式の能力識別子に依存している");
      }
      if (/\.agents[\\/]+skills[\\/]+[a-z0-9-]+[\\/]+SKILL\.md/i.test(value)) {
        addFinding(findings, "concrete-skill-path", section, value, "具体的なSkill pathに依存している");
      }
      if (/(?:^|[\s`(])[a-z0-9-]+[\\/]+SKILL\.md(?=$|[\s`)。、])/i.test(value)) {
        addFinding(findings, "concrete-skill-path", section, value, "具体的なSkill pathに依存している");
      }
      if (/docs[\\/]+ai-development[\\/]+workflows[\\/]+[a-z0-9-]+\.md/i.test(value)) {
        addFinding(findings, "concrete-workflow-path", section, value, "特定Workflowのpathまたは構成に依存している");
      }
      for (const other of allSkills) {
        if (other.name === skill.name) continue;
        const identifier = new RegExp(`(^|[^a-z0-9-])${escapePattern(other.name)}(?=$|[^a-z0-9-])`, "i");
        if (identifier.test(value)) {
          referencedNames.add(other.name);
          addFinding(findings, "other-skill-identifier", section, value, `別Skill ${other.name} の識別子に依存している`);
        }
      }
      if (/(?:別|他|その|特定)(?:の)?Skill/.test(value)
        && (hasPositiveOperation(value, ["呼び出", "実行", "取得", "確認"])
          || /成功.*(?:必要(?:である|となる)|前提とする)/.test(value))) {
        addFinding(findings, "other-skill-contract", section, value, "別Skillの呼び出し、出力、成功を能力契約にしている");
      }
      if (/(?:完了後|終了後|処理後).*(?:次|後続).*(?:Skill|能力)|(?:次|後続)の(?:Skill|能力)/.test(value)
        && hasPositiveOperation(value, ["実行", "呼び出", "開始", "決定"])) {
        addFinding(findings, "workflow-order-owner", section, value, "特定の前後工程または次能力を要求している");
      }
      if (/Workflow(?:の)?(?:状態|ステータス)|(?:このSkill|本Skill|Skill自身).*(?:状態|ステータス|停止|再開|次工程)/.test(value)
        && hasPositiveOperation(value, ["更新", "変更", "遷移", "停止", "再開", "決定", "開始"])) {
        addFinding(findings, "workflow-state-owner", section, value, "SkillがWorkflow状態または次工程を所有している");
      }
    }
  }

  if (isDesignGuide(skill) && referencedNames.size >= 2) {
    addFinding(findings, "fixed-skill-catalog", "能力固有の処理", [...referencedNames].join(", "), "設計ガイドが既存Skill一覧を保持している");
  }
  return findings;
}

function fixtureSkill({
  name = "fixture-capability",
  description = "fixtureで独立した一つの能力契約と失敗境界を評価する。",
  overrides = {},
} = {}) {
  const sections = {
    提供能力: "入力を一つの確認結果へ変換する。",
    適用条件: "- 目的と評価対象を取得できる。",
    入力: "- 評価対象となる成果物",
    出力: "- 根拠を伴う確認結果",
    責務外: "- 別能力の呼び出し、作業順序、Workflow状態の変更",
    能力固有の処理: "入力された成果物を基準へ照合する。",
    "失敗・未実施・残るリスク": "入力不足の場合は不足項目とremaining riskを返す。",
    ...overrides,
  };
  const lines = ["---", `name: ${name}`, `description: "${description}"`, "---", ""];
  for (const section of requiredSections) {
    lines.push(section === "提供能力" ? `# ${section}` : `## ${section}`, "", sections[section], "");
  }
  return parseSkill(lines.join("\n"), `<fixture:${name}>`);
}

test("Skill設計ガイドをmetadataと自己完結した能力契約から一意に選択できる", async () => {
  const skills = await discoverSkills();
  const guide = selectDesignGuide(skills);
  assert.deepEqual(validateSkillDesign(guide, skills), []);
  for (const section of requiredSections) assert.match(guide.sections.get(section), /\S/, section);
  for (const owner of ["Skill", "Workflow", "Reference", "`AGENTS.md`", "設計判断記録またはTask記録"]) {
    assert.ok(guide.sections.get("能力固有の処理").includes(owner), owner);
  }
});

test("repository管理下の全Skillが同じ設計predicateを満たす", async () => {
  const skills = await discoverSkills();
  for (const skill of skills) {
    assert.deepEqual(validateSkillDesign(skill, skills), [], skill.path);
  }
});

test("自己宣言、成果物入力、責務外、安定contract、一般的な能力語を受理する", async () => {
  const skills = await discoverSkills();
  const guide = selectDesignGuide(skills);
  const positive = fixtureSkill({
    description: guide.description,
    overrides: {
      入力: [
        "- レビュー結果が成果物として与えられている場合は利用する。",
        "- Referenceまたは安定したrepository contract",
        "- 一般的なreview、verification、submissionの結果",
      ].join("\n"),
      責務外: [
        "- 別Skillの呼び出しや成功確認",
        "- 作業順序、次工程、Workflow状態の停止・再開・遷移",
        "- `.agents/skills/example/SKILL.md`の取得",
      ].join("\n"),
      能力固有の処理: [
        "入力された成果物を共有基準へ照合する。",
        "",
        "### 記述例",
        "",
        "| 判定 | 記述例 |",
        "|---|---|",
        "| 禁止 | Skill自身がWorkflow状態を更新し、次工程を開始する |",
      ].join("\n"),
    },
  });
  assert.deepEqual(validateSkillDesign(positive, [...skills, positive]), []);
});

test("直接依存、前後工程、状態所有、固定一覧を同じpredicateで拒否する", async () => {
  const skills = await discoverSkills();
  const guide = selectDesignGuide(skills);
  const otherNames = skills.filter((skill) => skill.name !== guide.name).slice(0, 2).map((skill) => skill.name);
  assert.equal(otherNames.length, 2);
  const cases = [
    {
      label: "発見済みの別Skill名",
      code: "other-skill-identifier",
      overrides: { 適用条件: `- ${otherNames[0]}が存在する。` },
    },
    {
      label: "$形式の呼び出し",
      code: "dollar-skill-identifier",
      overrides: { 能力固有の処理: "$coupled-capabilityを呼び出す。" },
    },
    {
      label: "具体的なSkill path",
      code: "concrete-skill-path",
      overrides: { 入力: "- `.agents/skills/coupled-capability/SKILL.md`の出力" },
    },
    {
      label: "具体的なWorkflow path",
      code: "concrete-workflow-path",
      overrides: { 適用条件: "- `docs/ai-development/workflows/fixed-flow.md`の工程内である。" },
    },
    {
      label: "別Skillの出力と成功",
      code: "other-skill-contract",
      overrides: { 適用条件: "- 別Skillの出力を取得し、その成功を確認する。" },
    },
    {
      label: "別Skillの直接呼び出し",
      code: "other-skill-contract",
      overrides: { 能力固有の処理: "別Skillを呼び出す。" },
    },
    {
      label: "別Skill呼び出しの要求構文",
      code: "other-skill-contract",
      overrides: { 適用条件: "- 別Skillの呼び出しを要求する。" },
    },
    {
      label: "否定説明と実依存の混在",
      code: "other-skill-contract",
      overrides: { 能力固有の処理: "別Skillに依存しないが、そのSkillの出力を取得する。" },
    },
    {
      label: "実依存と後置された否定説明の混在",
      code: "other-skill-contract",
      overrides: { 能力固有の処理: "そのSkillの出力を取得し、別Skillに依存しない。" },
    },
    {
      label: "後工程の実行",
      code: "workflow-order-owner",
      overrides: { 能力固有の処理: "この処理の完了後に次のSkillを実行する。" },
    },
    {
      label: "Workflow状態所有",
      code: "workflow-state-owner",
      overrides: { 能力固有の処理: "このSkillがWorkflow状態を更新し、次工程を開始する。" },
    },
    {
      label: "設計ガイドの固定一覧",
      code: "fixed-skill-catalog",
      description: guide.description,
      overrides: { 能力固有の処理: `現在のSkill一覧は ${otherNames.join("、")} である。` },
    },
  ];
  for (const fixture of cases) {
    const candidate = fixtureSkill({
      name: `fixture-${fixture.code}`,
      description: fixture.description,
      overrides: fixture.overrides,
    });
    const findings = validateSkillDesign(candidate, [...skills, candidate]);
    assert.ok(findings.some((finding) => finding.code === fixture.code), `${fixture.label}: ${JSON.stringify(findings)}`);
  }
});

test("AGENTS.mdは安定原則と能力契約による利用入口だけを保持する", async () => {
  const [agents, skills] = await Promise.all([read("AGENTS.md"), discoverSkills()]);
  const guide = selectDesignGuide(skills);
  for (const pattern of [
    /Skillは自己完結した単一能力として設計/,
    /Skill間の直接依存を避ける/,
    /能力の構成、順序、停止・再開、状態遷移はWorkflow/,
    /共有する判断知識はReference/,
    /新規設計、変更、設計レビュー.*能力契約から選択して確認/,
  ]) assert.match(agents, pattern);
  assert.ok(!agents.includes(guide.name));
  assert.doesNotMatch(agents, /\.agents[\\/]+skills[\\/]+[a-z0-9-]+[\\/]+SKILL\.md/i);
});
