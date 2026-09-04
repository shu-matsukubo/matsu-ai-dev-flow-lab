---
name: coordinate-approved-tasks
description: 人間が承認したタスクを、承認範囲、依存関係、Agent構成を保ちながら実装、レビュー、検証、タスク記録、Draft PRまで統括する。
---

# 承認済みタスクの調整

## 開始ゲートと引き渡し

Mainは各作業指示の開始時に最新Issueの6種類のステータスラベルを確認し、`AI：作業可能`だけと現在のチャット指示がある場合に限りWorkerへ実装を委譲する。未付与・人間承認待ち・複数競合・永続情報との不整合では変更せず停止する。Mainは自己付与せず、Worker・Reviewerはラベルを変更しない。各工程完了時の人間承認待ちへの切り替え、非ステータスラベルの保持、以前のステータスを残さない更新、再取得による目的の1種類だけの確認、同一指示内停止はMainだけが行う。全Taskの完了、最新`develop`との同期、Issue統合・回帰検証、要求分析書の全受入条件確認を終え、Issue統合PRが人間確認可能になった後だけ`人間：最終成果物承認待ち`へ切り替える。一部TaskやTask PRの公開だけでは切り替えない。

## 前提とTask記録

承認済み計画、Requirement Issue、merge済み要求分析書、Requirement Analysis PR、現在の設計、タスクのbaseを確認する。要求分析書が存在しない、またはRequirement Analysis PRが未mergeなら実装を開始しない。計画承認後、Mainは最新の `develop` から `issue/<issue-id>` branchとIssue統合Draft PR（baseは `develop`）を作成する。着手時に `.issue-tasks/TEMPLATE.md` から `.issue-tasks/active/` へタスクファイルを作り、その時点の最新Issue branchから `task/<issue-id>-<task-id>` branchを開始する。Task記録にはIssue、要求分析書、Requirement Analysis PR、設計PR、Issue branch、Issue統合PR、Task branch、Task PRの追跡参照を持たせ、実装と同じTask PRへ含める。

## Agent構成と割り当て

承認されたAgent構成を、その必須レビュー経路を含めて適用する。承認後に独立Reviewerを独断で追加・省略したり、別の構成へ変更したりしない。構成の変更が必要になった場合は、実装を広げずMainへ返して再承認を求める。

- `parent-only`: Mainが実装とセルフレビューを所有する。
- `worker-parent-review`: 必要最小限のWorkerへ実装を割り当て、Mainが直接レビューする。
- `worker-reviewer-parent`: Workerのセルフレビュー後、実装担当から独立したReviewerへレビューを割り当て、Mainが最終レビューする。

### Agentの割り当てと報告

Skillはmodelを選ばない。Mainは承認済み構成の範囲内で、責務境界、独立性、依存関係、ファイル競合、統合コストから人数と担当範囲を決める。強い順序依存や同一ファイル競合を無理に並列化しない。

WorkerへIssue、merge済み要求分析書、現在の設計、タスクファイル、担当範囲、対象外、統合点、完了条件、必要な検証を渡す。Workerは実装、受入条件との対応、検証、セルフレビュー、疑問、未実施項目、残るリスク、フロー改善フィードバックをMainへ返す。ReviewerはIssue、要求分析書、設計、統合差分、検証結果から独立レビューし、受入条件ごとの根拠、指摘、未実施項目、残るリスク、フロー改善フィードバックをMainへ返す。

## Flow Feedback処理Task

承認済みTaskがFlow Feedback処理専用の場合は `$process-flow-feedback` を使用する。Mainが対象`pending/`集合をTask記録へ固定し、Worker / Reviewerは読み取り分析と提案だけを行う。Mainは評価を統合して分類、根拠、関連feedbackのまとめ方、引き継ぎ先Requirement Issueを人間へ提示し、その承認まで既存feedbackの更新・移動、Issue作成・更新、改善実装を行わない。承認後の既存feedback、Task記録、Skillなどの共通file変更もMainだけが行う。対象、分類、まとめ方、引き継ぎ先を変える場合は再承認へ戻る。

## 通常Taskの境界

通常TaskではWorkerが承認範囲の実装を担い、既存feedbackの検索、評価、更新、移動に `$process-flow-feedback` を使用しない。専用処理TaskのMain単一writer責務を通常Taskへ一般化しない。

### 再承認とMainの最終確認

承認外の改善、新しい依存関係、アーキテクチャ判断、対象範囲変更が必要なら実装を広げず再承認へ戻る。要求または受入条件そのものの変更が必要ならTaskを止め、専用Requirement Analysis PRによる改訂へ戻る。Mainは報告だけに依存せず実diffと検証結果を確認し、`$review-changes` と `$verify-changes` の結果をタスクファイルへ記録する。必要な新規feedback fileは `$record-flow-feedback` でMainが記録する。既存feedbackは通常Taskで処理しない。

## Task完了と公開

合格後はタスクファイルを `.issue-tasks/completed/` へ移し、`$publish-task-pr` で実装とタスク記録を同じDraft Pull Requestへ公開する。Issue統合Draft PRとTask PRはRequirement Issueを `Refs #<number>` などの非close形式で参照し、本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを使用しない。Task PRには担当範囲が寄与する要求分析書の受入条件ID、根拠、未対象または未充足の事項を記録する。Main、Worker、Reviewerは受入条件を満たしたと判断してもRequirement Issueをcloseしない。

### Task PRとIssue統合PR

Task PRはTask単位のレビュー・検証、Issue統合PRは全Task完了後に最新 `develop` をIssue branchへmergeした状態でRequirement Issue全体の統合・回帰検証と要求分析書の受入条件確認を担う。Issue統合PRとAI完了報告には、要求分析書の全受入条件ごとの充足状況、根拠、未実施項目、残るリスクを記載する。両PRはSquash mergeを基本とし、merge後もIssueをopenで維持する。merge、branch削除、Issue closeは人間だけが行い、Issue closeは全受入条件と根拠を確認した後に人間が明示的に実施する。
