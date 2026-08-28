# Codexのおまかせ承認をMain設定へ追加する

- 元Issue: `#8`
- 設計PR: `なし`
- 状態: `completed`
- タスクキー: `issue-8-auto-review-approval`
- 優先度: `high`
- Agent構成: `worker-parent-review`
- Issue branch: `issue/8`
- Issue統合PR: `#22`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/8-t1`
- Task PR: `公開準備中`
- Task PRのベースブランチ: `issue/8`
- 承認記録: 2026-08-28のチャットでユーザーが「承認」

要求や設計全文は複製せず、元Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

Codex Desktopの「おまかせ承認」に相当する現行の正式設定をMainのproject設定へ追加し、sandbox境界を維持したまま、承認が必要な操作を自動Reviewerへ振り分ける。

## 対象範囲

- `.codex/config.toml`
- 本タスク記録

## 作業内容

- top-levelの`approval_policy`を対話的承認が有効な正式値へ設定する
- top-levelの`approvals_reviewer`をAuto-reviewの正式値へ設定する
- 既存のMain model、推論レベル、Agent有効化設定を維持する
- TOML構文とOpenAI公式JSON schemaへの適合を検証する
- 共通品質ゲートと変更範囲の確認を行う

## 対象外

- `.codex/agents/`配下のWorker / Reviewer設定変更
- Skill本文やAI開発フロー文書への承認設定の重複追加
- Main / Worker / Reviewerのmodelまたは推論レベル変更
- sandbox、writable roots、network access、安全制約の緩和
- フルアクセス相当の設定
- GitHub remote操作の権限方針変更

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 承認済みTask計画 | `hard` | `start` | 人間がT8-1と`worker-parent-review`を明示承認済み | 2026-08-28のチャットでユーザーが「承認」 |
| Issue branch / Issue統合PR | `hard` | `start` | 最新`develop`を起点に作成済み | `issue/8`、Draft PR `#22`、内容変更のない初期化commit `83b747320db12300da22b7825449ceae6c0c981a` |
| OpenAI公式仕様 | `hard` | `complete` | 設定キー・値とAuto-reviewの挙動を公式資料またはschemaで確認 | 公式Auto-review文書、Config Reference、`config-schema.json`で確認済み |

## 懸念事項

- projectがtrustedでない場合、project-scoped `.codex/config.toml`は読み込まれない
- 組織のmanaged requirementsが優先される環境では、repository設定だけでAuto-reviewを有効にできない場合がある
- Auto-reviewは承認者の切り替えであり、sandboxやnetwork境界そのものを緩めないことを差分と検証で確認する

## 完了条件

- [x] `.codex/config.toml`に`approval_policy = "on-request"`がtop-level設定として存在する
- [x] `.codex/config.toml`に`approvals_reviewer = "auto_review"`がtop-level設定として存在する
- [x] Main model `gpt-5.6-sol`、推論レベル`max`、Agent有効化設定が維持されている
- [x] `.codex/agents/`、Skill、設計文書、sandbox設定が変更されていない
- [x] TOMLとして有効で、OpenAI公式JSON schemaの検証に成功する
- [x] 共通品質ゲート`sh scripts/verify.sh`が成功する
- [x] Workerの実装・セルフレビューとMainレビューが完了している
- [ ] Task記録と実装が同じDraft Task PRに含まれている

## 実装結果

- 変更内容: `.codex/config.toml`のtop-levelへ`approval_policy = "on-request"`と`approvals_reviewer = "auto_review"`を追加した。既存のMain model、推論レベル、Agent有効化設定は維持し、Worker / Reviewer設定、Skill、docs、sandbox、network設定は変更していない
- 残るリスク: trustedでないprojectではproject-scoped設定が読み込まれず、組織のmanaged requirementsがrepository設定より優先される。これはproject設定から上書きできない製品仕様上の制約として残る

## ローカル検証

- OpenAI公式Auto-review文書: `approval_policy = "on-request"`と`approvals_reviewer = "auto_review"`の組み合わせが「Approve for me」を有効にし、sandbox権限を拡張しないことを確認
- OpenAI公式Config Reference / `config-schema.json`: 2つのtop-level keyと値を確認
- Python `tomllib`: TOML構文、追加値、`gpt-5.6-sol`、推論`max`、`agents.enabled = true`をassertし成功
- PowerShell `Test-Json` + 現行OpenAI公式`config-schema.json`: TOMLをJSONへ変換してschema検証し成功
- bundled Pythonでの初回schema validator: `jsonschema`未同梱のため開始前に`ModuleNotFoundError`。PowerShell標準validatorへ切り替えて成功
- `codex --strict-config doctor --json`: `config.load`は`ok`、sandbox helper欄のeffective approval policyは`OnRequest`。doctor全体には既存のsandbox helperと非対話terminalの失敗が残るため、全体成功とは扱っていない
- Worker変更後検証: TOML、`git diff --check`、Git Bash経由の`sh scripts/verify.sh`が成功
- Main初回共通検証: PowerShellのPATHに`sh`がなく処理開始前に失敗。Docker品質ゲートの失敗ではない
- Main共通検証再実行: Git Bash経由の`sh scripts/verify.sh`がexit 0。Docker image build、ESLint、API / front型検査、API 2件 / front 2件のtest、API / front buildがすべて成功
- `git diff --check`: 成功。LFからCRLFへの変換予定warningのみでwhitespace errorなし
- 対象範囲確認: 実装差分は`.codex/config.toml`の2設定追加と本Task記録のみ。lockfile、生成物、secret、credentialの追加なし

## CI

- Task PR作成前のため未確認

## Agent割り当て

- Main: タスク統括、Task記録、公式根拠確認、最終レビュー、最終判断、remote公開
- Worker: `/root/issue8_auto_review`。設定差分の確定、変更前後の検証、実差分のセルフレビューを担当。通常helperでは編集できなかったため、MainがWorker確定patchを正規apply-patch入口で機械的に適用
- Reviewer: `worker-parent-review`のため独立Reviewerは使用しない

## レビュー結果

- セルフレビュー: Workerが`issue/8`基準の実差分を直接確認。2設定がtop-levelで正確、既存Main設定を維持、対象外変更なしとしてP0〜P3の指摘なし
- 独立レビュー: strategy対象外
- Mainレビュー: Issue `#8`、設計正本、Task記録、Issue統合Draft PR `#22`、base差分、公式根拠、検証結果を直接確認。要求充足、対象外、安全境界、回帰、検証範囲について未解消P0〜P3なし

## フロー改善フィードバック

問題がなければ「なし」。記録する場合は中央ファイルへ転記せずTaskごとに追記する。

| 区分 | 発生事象 | 影響 | 根拠 | 改善案 |
|---|---|---|---|---|
| `other` | WorkerとMainの通常command / apply-patch helperが`setup refresh had errors`で起動できなかった | Workerが直接編集できず、MainがWorker確定patchをsandbox外の正規apply-patch入口で機械的に適用する手戻りが発生した | Workerの2回の失敗報告、Mainの通常`apply_patch`失敗、`codex doctor`の`sandbox.helpers`に`helper_unknown_error` | commandとapply-patchが同じ安全な再試行経路を利用できるよう、sandbox helperの復旧または明示的fallbackを検証する |
| `skill` | 最新`develop`と同じtreeの`issue/8`ではIssue統合Draft PRを作成できず、内容変更のない初期化commitが必要だった | Draft PR作成前に追加のcommit生成・ref更新・再試行が必要になった | GitHubの`No commits between develop and issue/8`、初期化commit `83b747320db12300da22b7825449ceae6c0c981a`、Draft PR `#22` | `coordinate-approved-tasks`へ、同一tree時の内容変更を伴わないIssue branch初期化条件を別要求として検討する |
| `verify` | Windows PowerShellのPATHで正本commandの`sh`を直接起動できなかった | Mainの共通品質ゲート初回実行が処理開始前に失敗し、Git Bashの絶対pathで再実行が必要だった | `sh: The term 'sh' is not recognized`と、Git Bash経由再実行のexit 0 | Windowsで共通入口を呼ぶ標準的なGit Bash invocationを検証手順またはrunnerで提供する |

## commit

- 未作成

## Pull Request

- Issue統合Draft PR: `#22`（base `develop`、head `issue/8`、draft）
- Task Draft PR: 未作成

## 完了報告

- このTaskが寄与する受入条件と根拠: 正式なAuto-review設定2件をMain project設定へ追加し、公式文書・schema・現行Codex strict config loaderで有効性を確認した。既存Main設定と無関係なAgent / Skill / sandbox設定を維持し、共通品質ゲートも成功した
- 未対象または未充足の事項: PR merge、branch削除、Issue `#8`のcloseは人間の責務として対象外。Task PR公開とCI確認は未実施
- 未実施項目: Draft Task PR作成、remote tree照合、GitHub Actions CI確認、Issue統合レビュー前の最新`develop`同期
- 残るリスク: project trustとmanaged requirementsによる設定precedence。実装・ローカルレビュー・ローカル検証上の未解消事項なし
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- ローカル実装・レビュー・検証完了: 2026-08-28T17:37:58+09:00
