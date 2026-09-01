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

## 処理記録

この節は承認済みの専用Flow Feedback処理Taskでだけ使用する。Mainは評価案への人間承認後に追記し、未承認の評価案、directory配置と重複するstatus、feedback本文の複製を記録しない。処理を継続する場合は履歴を上書きせず追記する。

### <処理日> / 処理Issue #<number>

- 処理Task: <task file>
- 処理PR: #<numberまたは未作成>
- 分類: <対応する / 対応不要 / 別Issueとして扱う>
- 判断根拠: <現在の要求・設計・実装・テスト、重複、既存対応などの根拠>
- 関連feedback: <file path、なければなし>
- 引き継ぎ先Issue: <改善Requirement Issue / 独立Requirement Issue / なし>

最終結果が確定した場合だけ、必要な対応の完了または対応不要の確定とその根拠を同じ処理履歴へ追記する。Issueを作成しただけの場合は最終結果を記録せず、fileを`pending/`に維持する。
