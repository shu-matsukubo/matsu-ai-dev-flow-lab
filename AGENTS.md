# AI作業ガイド

このリポジトリでは、要求・設計・実装・作業記録を別の正本として扱う。

人間が読む見出し・説明・記録は、技術上の正式名称や機械値を除き、自然な日本語で記載する。詳細な言語方針は [AI開発フロー](docs/ai-development/overview.md) を参照する。

- 要求: GitHub Issue（原則1要求1 Issue）
- 設計: `docs/`
- 実装: codeとautomated tests
- 着手済みタスクの記録: `.tasks/active/`、完了後は `.tasks/completed/`

変更作業は、要求Issueを確認し、必ず `$check-design-impact` を実施する。設計変更または既存設計の明確化により設計PRが必要なチャットでは、影響分析と設計案の承認・設計PR作成までに責務を限定し、`$plan-tasks` や具体的なTask・実装計画へ進まず停止する。設計PRのmerge後は、そのチャットを完了し、別チャットで元Issue・最新の`develop`・最新の`docs/`から設計影響確認をやり直す。設計PRが不要と判断できた場合にだけ `$plan-tasks` へ進み、タスク計画はチャットで承認を得て、着手時にだけTask記録を作る。承認範囲外の改善やarchitecture判断は実装しない。

実装はタスクごとのAgent構成に従い、`$coordinate-approved-tasks`、`$review-changes`、`$verify-changes`、`$publish-task-pr` を使用する。Worker / Reviewerのフロー改善フィードバックはMainへ返し、Mainが `$record-flow-feedback` でタスク記録へ記録する。役割別modelはSkillではなく `.codex/` が定義する。

共通検証入口は `sh scripts/verify.sh`。Dockerが利用できない場合は理由を報告し、成功扱いにしない。

通常の実装PRは `develop` base、`codex/<task-name>` branch、1タスク = 1 Draft PRとする。設計PRは実装から分離し、元Issueを `Refs #<number>` で参照する。PRをmergeせず、全受入条件の確認前にIssueをcloseしない。

`git push`、`gh` CLI、GitHub APIへの直接`curl`は禁止する。remote操作はGitHub連携だけを使用し、実行できなければlocalの実装・検証・commit状態と必要なユーザー操作を報告して停止する。secret、credential、実案件固有情報をcommitしない。

詳細な判断基準は [AI開発フロー](docs/ai-development/overview.md)、現在の境界は [システム設計](docs/architecture/system.md)、品質ゲートは [テスト戦略](docs/quality/testing.md) を正本とする。
