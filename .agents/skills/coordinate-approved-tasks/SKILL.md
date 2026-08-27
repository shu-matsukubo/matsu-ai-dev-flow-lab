---
name: coordinate-approved-tasks
description: 人間が承認したタスクを、承認範囲、依存関係、Agent構成を保ちながら実装、レビュー、検証、タスク記録、Draft PRまで統括する。
---

# 承認済みタスクの調整

承認済み計画、要求Issue、現在の設計、タスクのbaseを確認する。着手時に `.tasks/TEMPLATE.md` から `.tasks/active/` へタスクファイルを作り、`codex/<task-name>` branch上で実装と一緒に扱う。通常baseは`develop`とする。

承認されたAgent構成を適用する。

- `parent-only`: Mainが実装とセルフレビューを所有する。
- `worker-parent-review`: 必要最小限のWorkerへ実装を割り当て、Mainが直接レビューする。
- `worker-reviewer-parent`: Workerのセルフレビュー後、実装担当から独立したReviewerへレビューを割り当て、Mainが最終レビューする。

Skillはmodelを選ばない。Mainが責務境界、独立性、依存関係、ファイル競合、統合コストから人数と担当範囲を決める。強い順序依存や同一ファイル競合を無理に並列化しない。

WorkerへIssue、タスクファイル、担当範囲、対象外、統合点、完了条件、必要な検証を渡す。Workerは実装、検証、セルフレビュー、疑問、残るリスク、フロー改善フィードバックをMainへ返す。ReviewerはIssue、設計、統合差分、検証結果から独立レビューし、指摘とフロー改善フィードバックをMainへ返す。

承認外の改善、新しい依存関係、アーキテクチャ判断、対象範囲変更が必要なら実装を広げず再承認へ戻る。Mainは報告だけに依存せず実diffと検証結果を確認し、`$review-changes` と `$verify-changes` の結果をタスクファイルへ記録する。フィードバックは `$record-flow-feedback` でMainが記録する。

合格後はタスクファイルを `.tasks/completed/` へ移し、`$publish-task-pr` で実装とタスク記録を同じDraft Pull Requestへ公開する。mergeとIssue closeは行わない。
