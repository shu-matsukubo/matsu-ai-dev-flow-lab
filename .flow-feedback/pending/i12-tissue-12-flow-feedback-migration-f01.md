# Flow Feedback i12-tissue-12-flow-feedback-migration-f01

- 発生元Issue: #12
- 発生元Task: 2026-08-29-issue-12-flow-feedback-migration.md
- 発生元PR: なし（Task PR作成前）
- category: other
- symptom: Windows sandboxのsetup refresh errorにより、通常のshell実行とapply_patchが繰り返し拒否された
- impact: 読み取り確認と編集のたびに承認付き実行へ切り替える必要があり、作業とレビューが中断した
- evidence: MainとWorkerの実行で `helper_unknown_error: setup refresh had errors` が再現した
- suggestion: setup refresh失敗時に、対象workspaceへ限定したread-only commandとapply_patchの監査可能なfallbackを用意する
