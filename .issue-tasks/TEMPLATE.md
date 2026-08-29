# タスク名

- 元Issue: `#<number>`
- 設計PR: `なし` / `#<number>`
- 状態: `active`
- タスクキー: `<承認済みPlan内で一意のkey>`
- 優先度: `normal` (`high` / `normal` / `low`)
- Agent構成: `worker-parent-review` (`parent-only` / `worker-parent-review` / `worker-reviewer-parent`)
- Issue branch: `issue/<issue-id>`
- Issue統合PR: `#<number>`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/<issue-id>-<task-id>`
- Task PR: `#<number>`
- Task PRのベースブランチ: `issue/<issue-id>`
- 承認記録: `<承認日時または会話内の識別情報>`

要求や設計全文は複製せず、元Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

このTaskで達成する単一の結果を記載する。

## 対象範囲

- 変更対象を記載する

## 作業内容

- 実施する作業を記載する

## 対象外

- このTaskで扱わない事項を記載する

## 依存関係

依存がなければ「なし」と記載する。依存があれば対象、種類、ゲート、完了条件、現在状態の根拠を記載する。

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| `<タスク / PR / 設計PR>` | `<hard / soft / ordering>` | `<start / complete / publish / merge>` | `<条件>` | `<状態、URLまたはpath>` |

## 懸念事項

- リスク、前提、制約を記載する。なければ「なし」

## 完了条件

- [ ] 完了を判断できる条件を記載する

## 実装結果

- 変更内容: 未実施
- 残るリスク: 未確認

## ローカル検証

- 未実施

## CI

- 未確認

## Agent割り当て

- 未実施

## レビュー結果

- セルフレビュー: 未実施
- 独立レビュー: strategy対象外 / 未実施
- Mainレビュー: 未実施

## Flow Feedback参照

必要な場合だけ、対応する `.flow-feedback/pending/` のfile pathを記載する。Feedback本文や状態metadataはTask fileへ重複記録しない。

## commit

- 未作成

## Pull Request

- 未作成

## 完了報告

- このTaskが寄与する受入条件と根拠: 未確認
- 未対象または未充足の事項: 未確認
- 未実施項目: 未確認
- 残るリスク: 未確認
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
