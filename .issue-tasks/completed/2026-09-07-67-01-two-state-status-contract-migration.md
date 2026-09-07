# 2状態ステータス契約を一括移行する

- 元Issue: `#67`
- 要求分析書: `requirements/67.md`
- Requirement Analysis PR: `#69`（merge済み）
- 設計PR: `#72`（merge済み）
- 状態: `completed`
- タスクキー: `67-01 two-state-status-contract-migration`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/67`
- Issue統合PR: `#73`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/67-two-state-status-contract-migration`
- Task PR: `#74`
- Task PRのベースブランチ: `issue/67`
- 承認記録: 2026-09-07、このチャットで要求者が「戻しました」「承認します」と回答し、Issue #67を`AI：作業可能`へ切り替えた

要求や設計全文は複製せず、元Issue、merge済み要求分析書、`docs/design-decisions/67.md`と現在の`docs/`を参照する。このfileは完了したTaskの実施記録である。

## 目的

Requirement Issueの現在有効な契約、初期状態、契約テスト、確認可能な外部状態を、作業主体だけを示す2状態モデルへ一貫して移行する。

## 対象範囲

- `docs/ai-development/workflows/requirement-lifecycle.md`
- `docs/ai-development/overview.md`
- `.github/ISSUE_TEMPLATE/requirement.yml`
- `tests/requirement-status-contract.test.mjs`
- open Requirement Issueの最新状態確認と、安全に実行可能な移行
- repository label定義の削除可否と人間操作が必要な境界の確認
- 本Task記録、Task PR、Issue統合PRからの追跡

## 作業内容

- 有効な長時間ステータスを`AI：作業可能`と`人間：PR確認待ち`の2種類へ限定し、ラベルの責務を現在の作業主体だけにする。
- 初期未付与、旧5状態、複数状態の競合、永続成果物との矛盾で安全停止する開始ゲートへ更新する。
- 要求分析、設計、Task計画、実装中の必要な人間判断を同じチャットで完結し、同一事項の再承認や工程別ラベルへの切り替えを要求しないWorkflowへ更新する。
- Requirement Analysis PR、設計PR、Issue統合PRの完成時だけ`人間：PR確認待ち`へ正式に引き渡し、Task PRなどの中間操作では状態を変更しない境界を維持する。
- `人間：PR確認待ち`中は次工程を開始せず、対象PRの修正、追加review、検証、説明など現在のチャットで明示された範囲だけを扱う停止境界を明確にする。
- Requirement Issue Formから初期ステータスを除去し、Issue作成だけではAI作業を開始しない。
- 2状態、旧5状態、開始・停止、同一チャット内判断、正式引き渡し、Issue Form、責務分離、非自動化を契約テストで継続検証する。
- 実移行時点のopen Requirement Issueを永続成果物と最新ラベルへ照合し、非ステータスラベルを保持して確認する。人間判断なしにAIが`AI：作業可能`を自己付与しない。
- repository label定義の列挙・削除がGitHub連携で実行できない場合はNot Executedとし、既定branch `main`のIssue Form更新後に必要な人間操作と確認対象を記録する。

## 対象外

- Frontend、Backend、API、authentication、authorization、session、DB、application persistenceの変更
- Skill、Reference、Agent定義へ状態機械または工程順序を追加すること
- `AGENTS.md`、Task提出Workflow、成果物作成パターン、CI構成の責務変更
- 過去の要求分析書、設計判断記録、完了Task記録、closed Issueの履歴的書き換え
- ラベル変更によるAI自動起動、Pull Requestの自動merge、branchの自動削除、Requirement Issueの自動close
- AIによるPull Requestのmerge、branch削除、Requirement Issueのclose、repository label定義の直接操作が利用不能な場合の代替API操作

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #69 | hard | start | 人間によるmerge | merge済み。`requirements/67.md`を最新`develop`で確認 |
| 設計PR #72 | hard | start | 人間によるmerge | merge済み。merge commit `a7911801bbb92e60fcac4545acf2c01e9dc2a2f4` |
| 承認済みTask計画とIssue #67開始ゲート | hard | start | 計画の人間承認、`AI：作業可能`単独、現在のチャット指示 | 2026-09-07に人間承認と再開指示を受け、GitHub再取得で`AI：作業可能`単独を確認 |
| Issue統合PR #73 | ordering | publish | `develop`をbase、`issue/67`をheadとするDraftで追跡可能 | Draft、open、mergeable、head `2b789f239d1d0646c62e6d32b110da2824c55324`をremoteで再確認 |
| open Requirement Issue #71の移行判断 | soft | complete | 人間が作業開始を認める場合だけ`AI：作業可能`へ移行し、認めない場合は未付与の安全停止状態として記録 | 変更前はopen、未付与、非ステータスlabelなし。2026-09-07に要求者がこのチャットで対応を依頼し、対応後のGitHub再取得でopenかつ`AI：作業可能`単独、非ステータスlabelなしを確認 |
| 旧repository label定義の削除 | soft | complete | 既定branch `main`のIssue Formが旧labelを参照しないことを確認した後、人間が旧5labelの削除結果を確認 | `main` `bd5e399c7712ee2ffa89910528aa9d47785cc1dc`のliveなIssue Formに`labels`指定がないことをGitHub連携で確認済み。2026-09-07に要求者が旧5labelを「削除しました」と回答。連携からlabel一覧を取得できないため、人間確認を外部証拠として区別する |

## 懸念事項

- 開始・停止条件はAIの作業権を制御するsecurity境界であり、肯定経路だけでなく未付与、旧状態、競合、矛盾、PR確認待ちの否定経路を維持する必要がある。
- Workflow、overview、Issue Form、契約テストを別々に切り替えると、一時的に状態契約が矛盾する。
- Issue #71の未付与からの移行では、AIが作業権を自己付与せず、人間の明示判断と対応後の再取得を証拠にする必要がある。今回は要求者の対応依頼後に`AI：作業可能`単独を確認した。
- repository label定義の削除は回復コストがあり、open Issue移行とliveなIssue Form確認より先に実行しない。
- `develop`のIssue Form変更は既定branch `main`へ反映されるまでGitHub上の新規Issueへ適用されない。現行`main`の旧bootstrap Formにもlabel指定はないため、旧label参照による削除順序の競合は確認されていない。

## 完了条件

- [x] AC-01〜AC-06: activeな状態契約が2状態だけとなり、開始・停止・自己付与禁止・異常状態の安全停止を確認できる。
- [x] AC-07〜AC-12: 永続成果物からの工程復元、同一チャット内判断、完成PRだけの正式引き渡し、Task計画とTask PRの中間境界を確認できる。
- [x] AC-13〜AC-14: Issue Formが初期ステータスを付与せず、Workflowだけが状態遷移を所有し、Skill、Reference、Agent定義へ状態機械を分散していない。
- [x] AC-15〜AC-16: open Requirement Issueの変更前後、未移行、失敗、非ステータスラベル保持を確認し、履歴的成果物を不要に変更していない。
- [x] AC-17〜AC-18: 既存のreview、verification、品質ゲート、人間限定操作、非自動化を維持し、未実施の外部操作と残るリスクを追跡できる。
- [x] `node --test tests/requirement-status-contract.test.mjs`と`sh scripts/verify.sh`が成功する。
- [x] Workerセルフレビュー、独立Reviewer、Main最終レビューを完了し、未解消のP0〜P2がない。
- [x] Task記録をcompletedへ移し、実装と同じDraft Task PRへ公開する。

## 実装結果

- 変更内容: Requirement Issue lifecycleとoverviewを2状態、初期未付与、二条件の開始ゲート、同一チャット内判断、完成PRだけの正式引き渡しへ更新した。Issue Formの初期label指定を削除し、契約テストを2状態と否定経路へ更新した。
- 対象外確認: application、API、認証、DB、AGENTS、Skill、Reference、Agent定義、Task提出Workflow、CI、履歴的要求分析書・設計・完了Task記録は変更していない。
- 外部状態: #67、#68、#71をGitHubから再取得し、いずれもopenかつ`AI：作業可能`単独、非ステータスlabelなしを確認した。#71は変更前の未付与から、人間の対応依頼後に同状態へ移行した。`main`のlive Issue Formはlabel指定なし。要求者が旧5repository labelの削除完了を回答した。repository label定義の列挙はGitHub連携から実行不能のため、人間確認を直接取得結果と区別して記録する。
- 残るリスク: Task PRのIssue branchへの取り込みとIssue統合検証は未完了。旧repository label削除は人間確認に依存し、GitHub連携による一覧の直接確認はできない。

## ローカル検証

- baseline `node --test tests/requirement-status-contract.test.mjs`: 18/18成功。
- Worker実装後 `node --test tests/requirement-status-contract.test.mjs`: 19/19成功。
- Main最終確認 `node --test tests/requirement-status-contract.test.mjs`: 19/19成功。
- Main最終確認 `git diff --check`: 成功。LFからCRLFへの変換予告のみで差分エラーなし。
- Main最終確認 `sh scripts/verify.sh`: 成功。Docker固定toolchainでlint、typecheck、契約テスト24/24、API 2/2、Front 2/2、buildがすべて成功。

## CI

- GitHub Actions CI run [#159](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/34077649340)（run id `34077649340`）: `success`
- 対象remote head: `8e8ef20272760a8147fdbb9d1ef46ac0870a414b`
- CI証拠とPR情報を反映する後続のTask記録commit自体との自己参照を避けるため、最終headのchecksはDraft Task PR #74を正本として確認する。

## Agent割り当て

- Worker: `/root/issue67_worker`。承認済み4実装fileの更新、Task固有検証、セルフレビュー
- 独立Reviewer: `/root/issue67_reviewer`。開始・停止のsecurity境界、2状態と旧5状態、責務分離、Issue Form、外部移行・部分失敗の独立確認
- Main: Task記録、Agent調整、実成果物・外部状態・review・verificationの直接確認、最終判断、GitHub提出

## レビュー結果

- セルフレビュー: Workerが指定4fileだけの変更、2状態、初期未付与、二条件、同一チャット判断、PR確認待ち例外、Issue Form、契約テストを確認し、targeted test 19/19と`git diff --check`に成功。
- 独立レビュー: 初回は実装4fileにP0〜P1の欠陥なしとし、P1として#71と旧repository labelの外部移行未完了、P2として完了報告と実施状況の不整合を指摘した。外部対応と記録修正後の再レビューでは前回P1/P2の解消、AC-15充足、未解消P0〜P2なしを確認した。AC-18はremote CIとTask PR merge後のIssue統合検証を残す部分充足。
- Mainレビュー: 初回差分で、Issue Formの空`labels`、初期未付与、人間によるTask計画承認、実装中を含む途中判断、PR確認待ち例外scopeの不足をP1/P2相当として指摘し、Worker修正後に解消を確認した。独立ReviewerのP2を本記録で修正し、Mainがtargeted testと共通品質ゲートを直接再実行して成功。旧repository label削除は人間確認、#71は人間の対応依頼後の再取得により、外部移行に関するP1の解消根拠が揃った。再レビュー結果を正本と差分へ照合し、Task PR初回提出を妨げるfindingなしと判断した。

## Flow Feedback参照

- `.flow-feedback/pending/i52-t52-01-f01.md`: Windows sandbox helperの`apply deny-read ACLs`。今回もMainとWorkerで再現したため、新規重複fileは作らず既存観測を参照する。

## Flow Feedback処理

- 対象外

## commit

- Issue branch remote開始commit: `2b789f239d1d0646c62e6d32b110da2824c55324`
- Task branch開始点: `2b789f239d1d0646c62e6d32b110da2824c55324`
- ローカル実装commit: `d15e02d`
- 外部label削除確認commit: `56c68d4`
- 外部移行・再レビュー記録commit: `9d29e8d`
- remote初回成果物commit: `8e8ef20272760a8147fdbb9d1ef46ac0870a414b`
- Task完了記録: このfileの`.issue-tasks/completed/`への移動を含むTask head

## Pull Request

- Issue統合Draft PR: [#73](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/73)
- Draft Task PR: [#74](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/74)
- base: `issue/67`
- head: `task/67-two-state-status-contract-migration`
- merge、branch削除は人間だけが行う

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: `AC-01`〜`AC-17`はWorkflow、overview、Issue Form、契約テスト、履歴的成果物の非変更、open Requirement Issueの再取得、review、ローカルverifyで根拠を確認した。`AC-18`はローカルverifyとTask PR CIが成功し、外部移行結果、未実施項目、残るリスクを本記録とTask PRで追跡できる。Issue統合PRでの最終確認はTask取り込み後に行う。
- 未対象または未充足の事項: Task PRの人間merge、branch削除、最新`develop`同期、Issue全体の統合review・検証・最終受入条件確認。
- 未実施項目: Task PR #74のIssue branchへの取り込みと、その後のIssue統合検証。旧repository label削除は人間が完了したが、連携から一覧を再取得できない。
- 残るリスク: repository label削除は人間確認を証拠とし、GitHub連携による直接確認はできない。Task担当範囲の実装・review・local verification・初回remote CIは成功済みで、残りはIssue統合境界で確認する。
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- Draft Task PR公開・初回CI成功確認: 2026-09-07T11:52:39+09:00

## 専門レビュー追跡要約

- 利用なし
