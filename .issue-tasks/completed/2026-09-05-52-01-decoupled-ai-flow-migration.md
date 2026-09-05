# AI開発フローを疎結合構造へ一括移行する

- 元Issue: `#52`
- 要求分析書: `requirements/52.md`
- Requirement Analysis PR: `#59`
- 設計PR: `#60`
- 状態: `completed`
- タスクキー: `52-01`
- 優先度: `normal`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/52`
- Issue統合PR: `#61`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/52-01`
- Task PR: `#62`
- Task PRのベースブランチ: `issue/52`
- 承認記録: 2026-09-05の現在チャットで要求者が「そのタスクで作業をお願いします」と承認

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の`docs/`を参照する。このfileは着手済み作業の実施記録である。

## 目的

承認済みの4層設計に従い、AI開発フローを安定原則、Workflow、単一能力Skill、共有Referenceへ分離し、固定Skill名や前後工程への依存を除去する。

## 対象範囲

- `AGENTS.md`と`README.md`
- `docs/ai-development/overview.md`
- `docs/ai-development/workflows/`と`docs/ai-development/references/`
- repository管理下の`.agents/skills/`
- `.codex/agents/`
- `requirements/TEMPLATE.md`、`.issue-tasks/TEMPLATE.md`、`.flow-feedback/TEMPLATE.md`
- AI開発フローの動的契約テスト
- このTaskで観測した新規Flow Feedback

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
| 独立Reviewer | hard | publish | P0〜P2を解消または明示的に停止 | 初回P2 1件を修正し、revision `d6f21e17f051abb8906bef7e64db41b73ca9e56f`の再レビューでP0〜P3なし |
| 共通品質ゲートとTask固有検証 | hard | publish | 必須検証が成功し、未実施と残るリスクを記録 | GitHub Actions run 135、job `verify`、step「品質検証」がsuccess |

## 懸念事項

- activeなWorkflow、Skill、Referenceは同じTask treeで一括切り替えた
- 禁止語の単純一致だけに依存せず、directory区分、front matter、能力契約、実操作fixtureを検証した
- WorkflowとReferenceは目的別に4文書と6文書へまとめ、固定registryを追加していない
- ローカル実行環境のACL適用エラーは継続しており、ローカル共通品質ゲートはNot Executedである。Task PR CIを検証証拠とした

## 完了条件

- [x] `AGENTS.md`から個別Skill名、固定Skill前提、Skill固有順序を除去する
- [x] 全Skillが提供能力、適用条件、入力、出力、責務外、失敗・未実施・残るリスクを識別できる
- [x] Skill間参照、前後工程、状態遷移、能力外のTask管理・提出制御を除去する
- [x] Workflowが工程、必要能力、Agent構成、承認、停止・再開、Task・PR統合を所有する
- [x] Referenceが共有判断基準を一意に保持し、処理や遷移を実行しない
- [x] review、verification、submission、Flow Feedback評価・反映を独立能力として利用できる
- [x] runtime Skill一覧とReference directoryから能力契約を発見でき、固定registryを追加しない
- [x] 標準、高リスク、小規模の成果物作成パターンを能力と役割で表現する
- [x] Skill追加・名称変更・削除のfixture検証が`AGENTS.md`や無関係なSkillの変更を要求しない
- [x] 4状態、開始ゲート、承認scope、remote、secret、人間だけのmerge・branch削除・Issue closeを維持する
- [x] 共通品質ゲートとTask固有検証が成功する
- [x] Worker成果のMain確認、独立Reviewer、Main最終レビューを完了する

## 実装結果

- `AGENTS.md`を安定原則へ縮約し、`overview.md`を正本とruntime discoveryの入口へ変更した
- 4つのWorkflowと6つのReferenceを追加した
- repository管理下のSkillを、要求分析、設計影響評価、Task分解、review、verification、新規Flow Feedback記録、汎用submission、既存feedbackのread-only評価、人間承認済み反映という9能力へ再構成した
- 統括、Task限定提出、一体型Flow Feedback処理の3 Skillを削除した
- Worker / Reviewer定義は役割とmodel / reasoning effortだけを保持する形へ変更した
- 3 templateとREADMEを新構造へ整合した
- 契約テストを固定Skill一覧なしの動的発見、依存方向、4状態、安全境界、3作成パターン、実操作fixtureの検証へ置き換えた
- 新規Flow Feedback 2件を`.flow-feedback/pending/`へ記録した
- 残るリスク: 実際のCodex runtimeでの発見動作は、このTaskのfixtureとCIに加え、Task PR取り込み後の実利用でも確認が必要

## ローカル検証

- `git status`および`sh scripts/verify.sh`: Not Executed
- 理由: shell起動が`CreateProcess ... helper_unknown_error: apply deny-read ACLs`で失敗
- 代替確認: GitHub上の固定revisionを使ったMain静的契約監査、JavaScript構文確認、独立review、Task PR CI
- この未実施をPassedへ読み替えていない

## CI

- run 134: Failed。契約テストの本文記号と表記差に関する期待値2件を確認し、実装意味を変えず修正した
- run 135: Passed
- URL: https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33963949002
- job `verify`: success
- step「品質検証」: success
- 対象revision: `7ce6a55656ec1b58b6db90fda2468167bb66c047`
- Task記録移動を含む最終headのCIはTask PRで再確認する

## Agent割り当て

- Worker: `/root/task_52_01_worker`。2候補を作成したが、Mainが要求・設計・完了条件との不一致を確認して却下し、最終treeには採用しなかった
- Reviewer: `/root/task_52_01_reviewer`。初回P2 1件を報告し、修正後の再レビューでP0〜P3なし
- Main: 開始ゲート、正本、branch / PR、Worker候補の却下、成果物再構成、静的確認、review修正、CI修正、提出を担当

## レビュー結果

- Workerセルフレビュー: 候補の完成報告はMain確認で不十分と判定。最終成果物の根拠には使用していない
- 独立レビュー: fixture側`AGENTS.md`を検証していないP2 1件を修正。再レビューでP0〜P3なし
- Mainレビュー: 変更33fileがTask scope内であること、application codeと既存feedbackに変更がないこと、9 Skillと6 Referenceの責務、Workflow、安全境界、契約テスト構文を確認。静的事前確認はPassed

## Flow Feedback参照

- `.flow-feedback/pending/i52-t52-01-f01.md`
- `.flow-feedback/pending/i52-t52-01-f02.md`

## Flow Feedback処理

- 対象外。既存feedbackの検索、評価、更新、移動は行っていない

## commit

- Task開始記録: `8fd2c918c63ea3584e271f110172d3114c0343b3`
- レビュー済み実装: `d6f21e17f051abb8906bef7e64db41b73ca9e56f`
- CI修正: `7ce6a55656ec1b58b6db90fda2468167bb66c047`
- Task完了記録: このfileの`.issue-tasks/completed/`への移動を含むTask head

## Pull Request

- Draft Task PR #62: https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/62
- base: `issue/52`
- head: `task/52-01`
- merge、branch削除は人間だけが行う

## 完了報告

| 受入条件 | Task 52-01の状態と根拠 |
|---|---|
| AC-01 | 充足。個別Skill識別名と実行順序を`AGENTS.md`から除去 |
| AC-02〜AC-04 | 充足。全9 Skillを共通能力契約へ統一し、別Skill、工程遷移、能力外責務を除去 |
| AC-05 | 充足。工程制御を4 Workflowへ集約 |
| AC-06 | 充足。metadataと契約、Reference directoryによるruntime discoveryを定義 |
| AC-07 | 充足。review、verification、submissionを独立能力として分離 |
| AC-08 | 充足。共有基準を6 Referenceへ一意に分離し非実行境界を明示 |
| AC-09 | 充足。標準、高リスク、小規模の3パターンを役割と能力で定義 |
| AC-10 | 充足。設計判断記録の全9 Skill棚卸しから再配置を追跡可能 |
| AC-11 | 充足。temporary fixtureで追加・名称変更・削除と非変更性を実行 |
| AC-12 | 充足。正本、scope、人間判断、品質、安全、最終操作の人間境界を維持 |
| AC-13 | 充足。動的契約テストと独立reviewでactive層の整合を確認 |
| AC-14 | Task寄与を充足。run 135でTask品質ゲート成功。Issue統合PRでの全受入条件、未実施、残るリスクの最終記録は未実施 |

- 未対象または未充足の事項: Issue branchへのTask取り込み、最新`develop`同期、Issue全体の統合・回帰検証、Issue統合PRの全受入条件最終記録
- 未実施項目: ローカル共通品質ゲート。理由と代替確認は上記のとおり
- 残るリスク: runtime discoveryの実利用確認とIssue統合境界の回帰確認
- Requirement Issueの状態: openを維持する。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-09-05
