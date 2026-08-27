# Agent構成選択基準のSkill反映

- 元Issue: `#6`
- 設計PR: `#11`
- 状態: `active`
- タスクキー: `issue-6-agent-strategy-skills`
- 優先度: `normal`
- Agent構成: `worker-parent-review`
- タスクブランチ: `codex/issue-6-agent-strategy-skills`
- ベースブランチ: `develop`
- 承認記録: 2026-08-28のチャットでユーザーが「承認」

要求や設計全文は複製せず、元Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

merge済みの設計PR `#11` で定義されたAgent構成の選択基準を、タスク計画と承認済みタスク調整のSkillへ責務に応じて反映し、通常の変更で独立Reviewerが過剰に選択されない状態にする。

## 対象範囲

- `.agents/skills/plan-tasks/SKILL.md`
- `.agents/skills/coordinate-approved-tasks/SKILL.md`
- 本タスク記録

## 作業内容

- `plan-tasks`へ、`worker-parent-review`を通常の既定構成とする選択基準を反映する
- 3種類のAgent構成の使い分け、独立Reviewerを追加する具体的根拠、根拠がない場合の選択、追加理由として不十分な条件を明確化する
- `coordinate-approved-tasks`へ、承認済みAgent構成を維持し、独立Reviewerの追加や省略を調整時に独断で行わない責務を反映する
- WorkerのセルフレビューとMainの最終レビュー・最終判断を維持する

## 対象外

- `docs/ai-development/overview.md`で確定済みの設計変更
- `.codex/`のmodelおよびreasoning effort設定
- Main / Worker / Reviewerの既存責務の変更
- Worker / Reviewerの人数決定ロジックや並列実装方式の固定
- アプリケーション、テスト戦略、CI品質ゲートの変更

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#11` | `hard` | `start` | `develop`へmerge済み | 2026-08-27にmerge済み。merge commit `c2983f63fa6e5293332cddd11cf481f6a36ee769` |

## 懸念事項

- 選択基準を複数Skillへ過度に複製すると将来の更新で不整合が生じるため、`plan-tasks`は構成の選択、`coordinate-approved-tasks`は承認済み構成の適用という責務境界を維持する
- Windows sandboxの初期化エラーが通常のコマンド実行で再現しているため、承認付き実行経路を使用し、未実施の検証を成功扱いにしない

## 完了条件

- [x] `worker-parent-review`が通常の既定構成としてSkill上で明確になっている
- [x] `parent-only`、`worker-parent-review`、`worker-reviewer-parent`の使い分けが明確になっている
- [x] 独立Reviewerを選ぶ具体的理由をタスク計画へ示し、説明できない場合は`worker-parent-review`を選ぶルールが反映されている
- [x] ファイル数、変更行数、抽象的なレビュー価値だけでは独立Reviewerを追加しないルールが反映されている
- [x] 軽微な変更では独立Reviewerが既定選択されず、高リスクまたは複雑な境界変更では選択可能な状態が維持されている
- [x] Mainの最終レビュー責務とWorkerのセルフレビュー責務が維持されている
- [x] AI開発フロー正本と関連Skillの責務・選択基準に矛盾がない
- [x] 変更したSkillがvalidatorを通過する
- [x] 共通品質ゲートとTask固有検証の結果が記録されている
- [x] WorkerセルフレビューとMain最終レビューを完了している

## 実装結果

- `plan-tasks`へ、`worker-parent-review`を通常の既定構成とし、3構成をWorker委譲の価値、Task固有リスク、独立レビューで検出したい不具合から選ぶ基準を反映した
- `worker-reviewer-parent`は具体的理由を計画で説明できる場合だけ選び、説明できなければ`worker-parent-review`を選ぶルールを反映した
- ファイル数、変更行数、抽象的なレビュー価値だけでは独立Reviewerを追加せず、軽微な変更は具体的理由がない限り対象にしないルールを反映した
- `coordinate-approved-tasks`へ、承認済み構成と必須レビュー経路を維持し、独立Reviewerの追加・省略や構成変更を独断で行わない境界を反映した
- WorkerセルフレビューとMainによる実差分・検証結果の確認、最終レビュー、最終判断を維持した
- 残るリスク: ローカルDocker品質ゲートはdaemon未接続により未成功。Draft PR作成後のGitHub Actions CI確認が必要

## ローカル検証

- `quick_validate.py`（`plan-tasks`）: 成功
- `quick_validate.py`（`coordinate-approved-tasks`）: 成功
- validatorの初回実行: 失敗。bundled PythonにPyYAMLがなく、追加後もWindows既定のcp932でUTF-8本文を読めなかった
- 専用一時ディレクトリへPyYAMLを追加し、`PYTHONUTF8=1`で同一validatorを再実行して両Skillとも成功。一時ディレクトリは削除済み
- 設計正本と関連SkillのAgent構成基準の横断確認: 成功
- 変更ファイル範囲確認: 承認済み2 Skillと本Task記録だけ
- `git diff --check`: 成功
- `git diff --cached --check`: 成功
- `sh scripts/verify.sh`: 失敗（exit 1）。Git Bashから実行し、`Docker daemonへ接続できません。Docker Desktopを起動してから再実行してください。`
- Docker Desktopを起動して約1分待機したが、`dockerDesktopLinuxEngine` pipeが生成されずdaemonへ接続できなかった。共通品質ゲート成功とは扱わない

## CI

- Draft PR作成後に確認する

## Agent割り当て

- Main: タスク統括、統合、最終レビュー、最終判断
- Worker: `issue_6_worker`。対象2 Skillの実装、検証、セルフレビュー
- Reviewer: `worker-parent-review`のため独立Reviewerは使用しない

## レビュー結果

- セルフレビュー: Workerが対象範囲、設計正本との整合、3構成の基準、承認済み構成の維持、対象外を確認。Main指摘の修正後にも再確認し、追加指摘なし
- 独立レビュー: strategy対象外
- Mainレビュー: 初回差分で、`parent-only`の選択基準不足と、軽微な変更を一律`worker-parent-review`対象にする設計不整合をmerge前必須修正として指摘。Worker修正後にIssue #6、設計PR #11、設計正本、Task記録、実差分、検証結果を直接確認し、未解消のP0〜P3指摘なし

## フロー改善フィードバック

問題がなければ「なし」。記録する場合は中央ファイルへ転記せずTaskごとに追記する。

| 区分 | 発生事象 | 影響 | 根拠 | 改善案 |
|---|---|---|---|---|
| `verify` | 通常のshell実行がWindows sandboxのsetup refresh errorで拒否された | 作業ツリー確認とSkill本文のローカル読み取りを標準経路で開始できなかった | `helper_unknown_error: setup refresh had errors` が複数回再現 | setup refresh失敗時に、workspaceへ限定した承認付きread/write実行経路を案内する |
| `verify` | Skill validatorのruntimeにPyYAMLがなく、Windows既定のcp932ではUTF-8本文も読めなかった | validatorがSkill内容の検証前に2段階で停止した | `ModuleNotFoundError: No module named 'yaml'` と `UnicodeDecodeError: 'cp932'` | validator runtimeへPyYAMLを含め、UTF-8を明示して実行する |
| `verify` | Docker Desktop起動後もdaemonへ接続できなかった | ローカル共通品質ゲートを完走できなかった | `sh scripts/verify.sh`が明示messageとexit 1で停止し、engine pipeも未生成 | Draft PRのCIを確認し、ローカル結果は未成功として保持する |

## commit

- local実装commit: `f43933a0d830bfbc6422de2f1af4f944118c9ccc`
- local実装tree: `e2087ada891b9b7ffb85a2cdb7b877cf68495569`

## Pull Request

- 未作成

## 完了日時

- 未完了
