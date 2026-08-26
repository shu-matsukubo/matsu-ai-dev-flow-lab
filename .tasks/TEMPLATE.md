# Task title

- Source Issue: `#<number>`
- Design PR: `なし` / `#<number>`
- 状態: `active`
- Task key: `<承認済みPlan内で一意のkey>`
- priority: `normal` (`high` / `normal` / `low`)
- agent strategy: `worker-parent-review` (`parent-only` / `worker-parent-review` / `worker-reviewer-parent`)
- task branch: `codex/<task-name>`
- base branch: `develop`
- 承認記録: `<承認日時または会話内の識別情報>`

RequirementやDesign全文は複製せず、Source Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

このTaskで達成する単一の結果を記載する。

## 対象範囲

- 変更対象を記載する

## 作業内容

- 実施する作業を記載する

## 対象外

- このTaskで扱わない事項を記載する

## dependency

依存がなければ「なし」と記載する。依存があれば対象、種類、gate、完了条件、現在状態の根拠を記載する。

| 依存対象 | type | gate | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| `<Task / PR / Design PR>` | `<hard / soft / ordering>` | `<start / complete / publish / merge>` | `<条件>` | `<状態、URLまたはpath>` |

## concerns

- risk、前提、制約を記載する。なければ「なし」

## completion criteria

- [ ] 完了を判断できる条件を記載する

## implementation result

- 変更内容: 未実施
- 残るrisk: 未確認

## local verification

- 未実施

## CI

- 未確認

## agent allocation

- 未実施

## review result

- self review: 未実施
- independent review: strategy対象外 / 未実施
- Main review: 未実施

## flow feedback

問題がなければ「なし」。記録する場合は中央ファイルへ転記せずTaskごとに追記する。

| category | symptom | impact | evidence | suggestion |
|---|---|---|---|---|
| `<task-size / approval / skill / design / verify / review / unnecessary-step / other>` | `<発生した事象>` | `<作業への影響>` | `<観測した根拠>` | `<改善候補>` |

## commit

- 未作成

## Pull Request

- 未作成

## 完了日時

- 未完了
