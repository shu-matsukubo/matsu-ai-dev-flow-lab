---
name: coordinate-approved-tasks
description: 人間が承認したTaskを、承認scope、dependency、agent strategyを保ちながら実装、review、verification、Task記録、Draft PRまで統括する。
---

# Approved Task Coordination

承認済みPlan、Requirement Issue、現在のDesign、Taskのbaseを確認する。着手時に `.tasks/TEMPLATE.md` から `.tasks/active/` へTask fileを作り、`codex/<task-name>` branch上で実装と一緒に扱う。通常baseは`develop`とする。

承認されたagent strategyを適用する。

- `parent-only`: Mainが実装とself reviewを所有する。
- `worker-parent-review`: 必要最小限のWorkerへ実装を割り当て、Mainが直接reviewする。
- `worker-reviewer-parent`: Workerのself review後、実装担当から独立したReviewerへreviewを割り当て、Mainが最終reviewする。

Skillはmodelを選ばない。Mainが責務境界、独立性、dependency、file競合、統合コストから人数と担当範囲を決める。強い順序依存や同一file競合を無理に並列化しない。

WorkerへIssue、Task file、担当範囲、対象外、統合点、完了条件、必要な検証を渡す。Workerは実装、検証、self review、疑問、残るrisk、flow feedbackをMainへ返す。ReviewerはIssue、Design、統合diff、検証結果から独立reviewし、findingとflow feedbackをMainへ返す。

承認外の改善、新しいdependency、architecture判断、scope変更が必要なら実装を広げず再承認へ戻る。Mainは報告だけに依存せず実diffと検証結果を確認し、`$review-changes` と `$verify-changes` の結果をTask fileへ記録する。feedbackは `$record-flow-feedback` でMainが記録する。

合格後はTask fileを `.tasks/completed/` へ移し、`$publish-task-pr` で実装とTask記録を同じDraft Pull Requestへ公開する。mergeとIssue closeは行わない。
