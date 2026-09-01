---
name: record-flow-feedback
description: Worker・Reviewer・Mainが観測したAI開発フロー上の問題を、Mainが1件1fileのFlow Feedbackとして記録する。
---

# フローフィードバックの記録

WorkerとReviewerはタスク粒度、承認、Skill、設計、検証、レビュー、不要手順などの問題をMainへ返す。中央集約ファイルや他タスクファイルを直接編集しない。通常Taskでは既存feedbackの検索・整理・統合・判断・更新・削除・状態変更・移動を行わない。

Mainは観測事実を確認し、filename規則 `i<issue-id>-t<task-id>-f<feedback-id>.md` と必須8項目（発生元Issue、発生元Task、発生元PR、category、symptom、impact、evidence、suggestion）を満たす新規fileを `.flow-feedback/pending/` へ記録する。状態metadataは本文へ記録しない。既存feedbackは通常Taskで処理しない。

- `category`: 問題の種類
- `symptom`: 実際に観測した事象
- `impact`: 手戻り、待ち時間、判断不確実性などの影響
- `evidence`: command、レビュー往復、曖昧だった指示などの根拠
- `suggestion`: 次回検証できる最小の改善候補

一般論や推測だけのフィードバック、個人情報、secret、要求 / 設計全文を記録しない。問題がなければfeedback fileを作成しない。タスクの対象範囲を変えない記録は記録整理として扱う。

複数の完了済みタスクから傾向を調べる場合は読み取り集約とし、元タスクを改変しない。既存feedbackの処理は、専用Requirement Issue、merge済み要求分析書、設計ゲート、人間が承認したTaskを通した `$process-flow-feedback` に限定する。`$record-flow-feedback` から既存feedbackを検索・処理したり、`$process-flow-feedback` を起動したりしない。Skill、承認ゲート、AIフローの変更候補は自動適用せず、別Requirement Issueの通常フローへ渡す。schedulerや自動集約基盤は導入しない。
