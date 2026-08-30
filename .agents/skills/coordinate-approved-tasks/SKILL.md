---
name: coordinate-approved-tasks
description: 人間が承認したタスクを、承認範囲、依存関係、Agent構成を保ちながら実装、レビュー、検証、タスク記録、Draft PRまで統括する。
---

# 承認済みタスクの調整

承認済み計画、Requirement Issue、merge済み要求分析書、Requirement Analysis PR、現在の設計、タスクのbaseを確認する。要求分析書が存在しない、またはRequirement Analysis PRが未mergeなら実装を開始しない。計画承認後、Mainは最新の `develop` から `issue/<issue-id>` branchとIssue統合Draft PR（baseは `develop`）を作成する。着手時に `.issue-tasks/TEMPLATE.md` から `.issue-tasks/active/` へタスクファイルを作り、その時点の最新Issue branchから `task/<issue-id>-<task-id>` branchを開始する。Task記録にはIssue、要求分析書、Requirement Analysis PR、設計PR、Issue branch、Issue統合PR、Task branch、Task PRの追跡参照を持たせ、実装と同じTask PRへ含める。

承認されたAgent構成を、その必須レビュー経路を含めて適用する。承認後に独立Reviewerを独断で追加・省略したり、別の構成へ変更したりしない。構成の変更が必要になった場合は、実装を広げずMainへ返して再承認を求める。

- `parent-only`: Mainが実装とセルフレビューを所有する。
- `worker-parent-review`: 必要最小限のWorkerへ実装を割り当て、Mainが直接レビューする。
- `worker-reviewer-parent`: Workerのセルフレビュー後、実装担当から独立したReviewerへレビューを割り当て、Mainが最終レビューする。

Skillはmodelを選ばない。Mainは承認済み構成の範囲内で、責務境界、独立性、依存関係、ファイル競合、統合コストから人数と担当範囲を決める。強い順序依存や同一ファイル競合を無理に並列化しない。

WorkerへIssue、merge済み要求分析書、現在の設計、タスクファイル、担当範囲、対象外、統合点、完了条件、必要な検証を渡す。Workerは実装、受入条件との対応、検証、セルフレビュー、疑問、未実施項目、残るリスク、フロー改善フィードバックをMainへ返す。ReviewerはIssue、要求分析書、設計、統合差分、検証結果から独立レビューし、受入条件ごとの根拠、指摘、未実施項目、残るリスク、フロー改善フィードバックをMainへ返す。

承認外の改善、新しい依存関係、アーキテクチャ判断、対象範囲変更が必要なら実装を広げず再承認へ戻る。要求または受入条件そのものの変更が必要ならTaskを止め、専用Requirement Analysis PRによる改訂へ戻る。Mainは報告だけに依存せず実diffと検証結果を確認し、`$review-changes` と `$verify-changes` の結果をタスクファイルへ記録する。必要な新規feedback fileは `$record-flow-feedback` でMainが記録する。既存feedbackは通常Taskで処理しない。

合格後はタスクファイルを `.issue-tasks/completed/` へ移し、`$publish-task-pr` で実装とタスク記録を同じDraft Pull Requestへ公開する。Issue統合Draft PRとTask PRはRequirement Issueを `Refs #<number>` などの非close形式で参照し、本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを使用しない。Task PRには担当範囲が寄与する要求分析書の受入条件ID、根拠、未対象または未充足の事項を記録する。Main、Worker、Reviewerは受入条件を満たしたと判断してもRequirement Issueをcloseしない。

Task PRはTask単位のレビュー・検証、Issue統合PRは全Task完了後に最新 `develop` をIssue branchへmergeした状態でRequirement Issue全体の統合・回帰検証と要求分析書の受入条件確認を担う。Issue統合PRとAI完了報告には、要求分析書の全受入条件ごとの充足状況、根拠、未実施項目、残るリスクを記載する。両PRはSquash mergeを基本とし、merge後もIssueをopenで維持する。merge、branch削除、Issue closeは人間だけが行い、Issue closeは全受入条件と根拠を確認した後に人間が明示的に実施する。
