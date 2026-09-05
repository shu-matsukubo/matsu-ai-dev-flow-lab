# AI開発フローを疎結合構造へ一括移行する

- 元Issue: `#52`
- 要求分析書: `requirements/52.md`
- Requirement Analysis PR: `#59`
- 設計PR: `#60`
- 状態: `active`
- タスクキー: `52-01`
- 優先度: `normal`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/52`
- Issue統合PR: `#61`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/52-01`
- Task PR: 未作成
- Task PRのベースブランチ: `issue/52`
- 承認記録: 2026-09-05の現在チャットで要求者が「そのタスクで作業をお願いします」と承認

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

承認済みの4層設計に従い、AI開発フローを安定原則、Workflow、単一能力Skill、共有Referenceへ分離し、固定Skill名や前後工程への依存を除去する。

## 対象範囲

- `AGENTS.md`と`README.md`
- `docs/ai-development/overview.md`
- `docs/ai-development/workflows/`と`docs/ai-development/references/`
- repository管理下の`.agents/skills/`
- `.codex/agents/`
- `requirements/TEMPLATE.md`、`.issue-tasks/TEMPLATE.md`、`.flow-feedback/TEMPLATE.md`
- AI開発フローの動的契約テストと必要なpackage script

## 作業内容

- Workflowへ工程、承認、停止・再開、Task・PR統合を集約する
- Referenceへreview、verification、Task分解、submission、安全、Flow Feedbackの共有判断を分離する
- Skillを共通能力契約へ統一し、別Skill名、前後工程、状態遷移、能力外の責務を除去する
- 統括Skillを廃止し、Task固有の提出能力を汎用化し、Flow Feedbackの評価と反映を分割する
- Agent定義と案内・templateを新しい責務境界へ整合する
- 固定Skill一覧を使わず、追加・名称変更・削除を模擬できる契約テストへ置き換える

## 対象外

- application、API、認証、session、persistence、DBの変更
- 固定Skill registryの追加
- 過去の要求分析書、設計判断記録、完了済みTask、既存Flow Feedbackの改変
- CI入口と共通品質ゲートの意味の変更
- Pull Requestのmerge、branch削除、Requirement Issueのclose

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #59 | hard | start | `develop`へmerge済み | merge commit `df9ab17867830eeba613f8f9a2b3ccfe2bf632fb` |
| 設計PR #60 | hard | start | `develop`へmerge済み | merge commit `e96954569bfccbe2e09a70855d1a9922d85e735d` |
| 独立Reviewer | hard | publish | P0〜P2を解消または明示的に停止 | 未実施 |
| 共通品質ゲートとTask固有検証 | hard | publish | 必須検証が成功し、未実施と残るリスクを記録 | 未実施 |

## 懸念事項

- activeなWorkflow、Skill、Referenceを同じ移行境界で切り替えないと承認・提出規則が食い違う
- 単純な禁止語検査はSkillの自己宣言や歴史的設計記録を誤検出しうる
- WorkflowとReferenceの分割が細かすぎると探索コストが増える
- ローカル実行環境のsetup refresh errorによりshellを起動できない状態が継続している。ローカル検証を成功扱いにせず、Task PRの同一品質ゲートCIを必須とする

## 完了条件

- [ ] `AGENTS.md`から個別Skill名、固定Skill前提、Skill固有順序を除去する
- [ ] 全Skillが提供能力、適用条件、入力、出力、責務外、失敗・未実施・残るリスクを識別できる
- [ ] Skill間参照、前後工程、状態遷移、能力外のTask管理・提出制御を除去する
- [ ] Workflowが工程、必要能力、Agent構成、承認、停止・再開、Task・PR統合を所有する
- [ ] Referenceが共有判断基準を一意に保持し、処理や遷移を実行しない
- [ ] review、verification、submission、Flow Feedback評価・反映を独立能力として利用できる
- [ ] runtime Skill一覧とReference directoryから能力契約を発見でき、固定registryを追加しない
- [ ] 標準、高リスク、小規模の成果物作成パターンを能力と役割で表現する
- [ ] Skill追加・名称変更・削除のfixture検証が`AGENTS.md`や無関係なSkillの変更を要求しない
- [ ] 4状態、開始ゲート、承認scope、remote、secret、人間だけのmerge・branch削除・Issue closeを維持する
- [ ] 共通品質ゲートとTask固有検証が成功する
- [ ] Workerセルフレビュー、独立Reviewer、Main最終レビューを完了する

## 実装結果

- 変更内容: 実装中
- 残るリスク: 未確認

## ローカル検証

- 未実施。setup refresh errorによりshellを起動できないため成功扱いにしていない

## CI

- 未確認

## Agent割り当て

- Worker: 未割り当て
- Reviewer: 未割り当て
- Main: Task開始ゲート、branch、Issue統合Draft PR、Task記録を作成

## レビュー結果

- セルフレビュー: 未実施
- 独立レビュー: 未実施
- Mainレビュー: 未実施

## Flow Feedback参照

- 未確認

## Flow Feedback処理

- 対象外

## commit

- Task開始記録commit: このファイル作成時のcommit
- 実装commit: 未作成

## Pull Request

- 未作成

## 完了報告

- 寄与する受入条件: `AC-01`〜`AC-14`
- 未対象または未充足の事項: 未確認
- 未実施項目: 実装、レビュー、検証、Task PR、Issue統合
- 残るリスク: 未確認
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
