# Flow Feedback i<issue-id>-t<task-id>-f<feedback-id>

- 発生元Issue: #<number> または なし（Issue運用開始前）
- 発生元Task: <task file>
- 発生元PR: <PR番号またはなし>
- category: <task-size / approval / skill / design / verify / review / unnecessary-step / other>
- symptom: <観測した事実>
- impact: <作業への影響>
- evidence: <command、レビュー往復、文書pathなど>
- suggestion: <次回検証できる最小の改善候補>

状態は配置directory（pending / resolved / dismissed）を正本とし、本文へmetadataを記録しない。Mainだけが新規feedbackをpendingへ記録する。通常Taskでは既存feedbackの検索・整理・統合・判断・更新・削除・移動を行わない。
