# AI作業ガイド

このリポジトリでは、要求・設計・実装・作業記録を別の正本として扱う。

- Requirement: GitHub Issue（原則1要求1 Issue）
- Design: `docs/`
- Implementation: codeとautomated tests
- 着手済みTaskの記録: `.tasks/active/`、完了後は `.tasks/completed/`

変更作業は、Requirement Issueを確認し、必ず `$check-design-impact` を実施してから `$plan-tasks` へ進む。Design変更が必要なら案の承認とDesign PRのmergeを待ち、未mergeの判断を前提に実装しない。Task Planはチャットで承認を得て、着手時にだけTask fileを作る。承認範囲外の改善やarchitecture判断は実装しない。

実装はTaskごとのagent strategyに従い、`$coordinate-approved-tasks`、`$review-changes`、`$verify-changes`、`$publish-task-pr` を使用する。Worker / Reviewerのflow feedbackはMainへ返し、Mainが `$record-flow-feedback` でTask fileへ記録する。役割別modelはSkillではなく `.codex/` が定義する。

共通検証入口は `sh scripts/verify.sh`。Dockerが利用できない場合は理由を報告し、成功扱いにしない。

通常のImplementation PRは `develop` base、`codex/<task-name>` branch、1 Task = 1 Draft PRとする。Design PRは実装から分離し、元Issueを `Refs #<number>` で参照する。PRをmergeせず、全Acceptance Criteriaの確認前にIssueをcloseしない。

`git push`、`gh` CLI、GitHub APIへの直接`curl`は禁止する。remote操作はGitHub連携だけを使用し、実行できなければlocalの実装・検証・commit状態と必要なユーザー操作を報告して停止する。secret、credential、実案件固有情報をcommitしない。

詳細な判断基準は [AI開発フロー](docs/ai-development/overview.md)、現在の境界は [システム設計](docs/architecture/system.md)、品質ゲートは [テスト戦略](docs/quality/testing.md) を正本とする。
