# AI作業ガイド

このリポジトリでは、要求・設計・実装・作業記録を別の正本として扱う。

人間が読む見出し・説明・記録は、技術上の正式名称や機械値を除き、自然な日本語で記載する。詳細な言語方針は [AI開発フロー](docs/ai-development/overview.md) を参照する。

- 要求: GitHub Issue（原則1要求1 Issue）
- 設計: `docs/`
- 実装: codeとautomated tests
- 着手済みタスクの記録: `.issue-tasks/active/`、完了後は `.issue-tasks/completed/`

変更作業は、要求Issueを確認し、必ず `$check-design-impact` を実施する。設計変更または既存設計の明確化により設計PRが必要なチャットでは、影響分析と設計案の承認・設計PR作成までに責務を限定し、`$plan-tasks` や具体的なTask・実装計画へ進まず停止する。設計PRのmerge後は、そのチャットを完了し、別チャットで元Issue・最新の`develop`・最新の`docs/`から設計影響確認をやり直す。設計PRが不要と判断できた場合にだけ `$plan-tasks` へ進み、タスク計画はチャットで承認を得て、着手時にだけTask記録を作る。承認範囲外の改善やarchitecture判断は実装しない。

実装はタスクごとのAgent構成に従い、`$coordinate-approved-tasks`、`$review-changes`、`$verify-changes`、`$publish-task-pr` を使用する。Worker / Reviewerのフロー改善フィードバックはMainへ返し、Mainが `$record-flow-feedback` で必要な新規feedbackを `.flow-feedback/pending/` の1件1fileへ記録する。役割別modelはSkillではなく `.codex/` が定義する。

共通検証入口は `sh scripts/verify.sh`。Dockerが利用できない場合は理由を報告し、成功扱いにしない。

通常の実装は、1 Requirement Issue = 1 `issue/<issue-id>` branch = 1 Issue統合Draft PR、1 Task = 1 `task/<issue-id>-<task-id>` branch = 1 Draft Task PRの二階層とする。Task計画の人間承認後に最新の `develop` からIssue branchとIssue統合Draft PRを作成し、各Taskは着手時点の最新Issue branchから開始する。Task PRのbaseは対応するIssue branch、Issue統合PRのbaseは `develop` とする。Task記録には元Issue、設計PR、Issue branch、Issue統合PR、Task branch、Task PRを記録する。設計PRは実装から分離し、元Issueを `Refs #<number>` で参照する。

Task PRではTask単位の変更・レビュー・検証を行い、Issue統合PRでは全Task完了後に最新 `develop` をIssue branchへmergeした状態でRequirement Issue全体の統合・回帰検証と受入条件確認を行う。両PRはSquash mergeを基本とし、PRのmerge、branch削除、Issue closeは人間だけが行う。AI agentはPRをmergeせず、全受入条件の確認前にIssueをcloseしない。

設計PR、Task PR、Issue統合PRは、Requirement Issueを `Refs #<number>` などの非close形式で参照する。PR本文では `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを使用しない。設計PRとTask PRには担当範囲が寄与する受入条件、根拠、未対象または未充足の事項を記録し、Issue統合PRとAI agentの完了報告には要求全体の受入条件ごとの充足状況と根拠、未実施項目、残るリスクを示す。PR merge後もRequirement Issueはopenのまま維持し、全受入条件と根拠を確認した人間だけが明示的にIssueをcloseする。Main、Worker、Reviewerを含むAI agentはIssueをcloseしない。

`git push`、`gh` CLI、GitHub APIへの直接`curl`は禁止する。remote操作はGitHub連携だけを使用し、実行できなければlocalの実装・検証・commit状態と必要なユーザー操作を報告して停止する。secret、credential、実案件固有情報をcommitしない。

詳細な判断基準は [AI開発フロー](docs/ai-development/overview.md)、現在の境界は [システム設計](docs/architecture/system.md)、品質ゲートは [テスト戦略](docs/quality/testing.md) を正本とする。
