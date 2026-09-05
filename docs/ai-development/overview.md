# AI開発フロー

## 目的

この文書は、AI開発フローの正本間の関係と、実行時にWorkflow、Skill、Referenceを発見する入口を定義する。工程固有の順序や判断基準の本文は複製せず、それぞれの所有先へ案内する。

## 責務の分離

| 層 | 所有する責務 | 所有しない責務 |
|---|---|---|
| `AGENTS.md` | 正本、現行証拠、承認scope、人間判断、品質、安全、能力発見の安定原則 | 個別Skill名、工程順序、成果物別手順 |
| Workflow | 作業分解、必要能力、実行順序、Agent構成、承認、停止・再開、状態遷移、成果物の統合境界 | 個別能力の処理手順、共有判断基準の詳細 |
| Skill | 一つの能力の適用条件、入力、処理、出力、失敗・未実施・残るリスク | 別Skill、前後工程、承認状態、Workflow遷移、能力外のTask管理や提出 |
| Reference | 複数能力で共有する判断基準、形式、禁止事項、例 | 処理実行、Agent割当、状態遷移、別能力の呼び出し |
| Agent定義 | Main、Worker、Reviewerの役割とmodel / reasoning effort | Workflow固有の能力一覧や工程順序 |

依存方向は、現在の人間指示と永続状態からWorkflowへ、Workflowから必要な能力契約とReferenceへ向かう。Skill同士を依存させず、SkillまたはReferenceからWorkflowの遷移を要求しない。

## 情報の正本

| 情報 | 正本 |
|---|---|
| 要求原文とIssue登録前の補足 | GitHub Requirement Issue |
| 作業権と次の人間承認対象 | Requirement Issueのステータスラベル |
| 目的、要件、受入条件、制約、対象外、人間判断 | `requirements/<issue-id>.md` |
| 現在有効な設計 | `docs/` |
| 実際の振る舞い | codeとautomated tests |
| 着手済みTaskの実施記録 | `.issue-tasks/` |
| AI開発フロー改善の観測と処理状態 | `.flow-feedback/` |

ステータスラベルは作業権を示すが、工程完了や人間承認の証拠を置き換えない。要求、設計、Task、Pull Request、diff、検証結果を直接確認して現在工程を復元する。

## 実行時の発見

1. 現在の指示と永続状態から、適用するWorkflowを`workflows/`から選ぶ。
2. Workflowが要求する能力を、実行時に提示されたSkill一覧の`name`と`description`から探索する。
3. 候補の`SKILL.md`を全文読み、提供能力、適用条件、入力、出力、責務外を照合する。
4. 必要な共有判断を`references/`の目的と適用対象から選ぶ。
5. 入力契約を満たせない、候補がない、または安全に選べない場合は、Not Executedまたは不足としてWorkflowへ返す。

固定Skill registryや手書きの全Skill一覧を作らない。能力の追加、名称変更、削除では、その能力自体の契約が変わらない限り、`AGENTS.md`や無関係なSkillを変更しない。

## Workflow

- [要求ライフサイクル](workflows/requirement-lifecycle.md): Requirement Issueの開始、承認、停止・再開、工程復元
- [Taskと提出](workflows/task-submission.md): Task記録、二階層branch / Pull Request、Issue統合
- [成果物作成パターン](workflows/artifact-patterns.md): 標準、高リスク、小規模のAgent構成
- [Flow Feedback](workflows/flow-feedback.md): 新規観測と承認済み一括処理

## Reference

- [レビュー基準](references/review-criteria.md)
- [検証基準](references/verification-criteria.md)
- [Task分解基準](references/task-decomposition.md)
- [提出形式](references/submission-format.md)
- [安全基準](references/security.md)
- [Flow Feedback基準](references/flow-feedback.md)

## 設計と品質

現在のapplication境界は[システム設計](../architecture/system.md)、共通品質ゲートは[テスト戦略](../quality/testing.md)を正本とする。AI開発フローの目標構造と移行判断は[Issue #52 設計判断記録](../design-decisions/52.md)を根拠とする。
