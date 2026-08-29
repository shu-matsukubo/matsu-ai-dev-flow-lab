# Flow Feedback i08-tissue-8-auto-review-approval-f01

- 発生元Issue: #8
- 発生元PR: #23
- 発生元Task: 2026-08-28-issue-8-auto-review-approval.md
- category: other
- symptom: WorkerとMainの通常command / apply-patch helperが`setup refresh had errors`で起動できなかった
- impact: Workerが直接編集できず、MainがWorker確定patchをsandbox外の正規apply-patch入口で機械的に適用する手戻りが発生した
- evidence: Workerの2回の失敗報告、Mainの通常`apply_patch`失敗、`codex doctor`の`sandbox.helpers`に`helper_unknown_error`
- suggestion: commandとapply-patchが同じ安全な再試行経路を利用できるよう、sandbox helperの復旧または明示的fallbackを検証する
