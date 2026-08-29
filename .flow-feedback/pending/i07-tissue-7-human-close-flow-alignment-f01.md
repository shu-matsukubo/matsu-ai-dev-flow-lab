# Flow Feedback i07-tissue-7-human-close-flow-alignment-f01

- 発生元Issue: #7
- 発生元PR: #21
- 発生元Task: 2026-08-28-issue-7-human-close-flow-alignment.md
- category: other
- symptom: WorkerとMainの通常のcommand / `apply_patch` が `setup refresh had errors` で起動できなかった
- impact: Workerが直接編集・検証できず、差分設計の受け渡しとMainによる正規apply_patch実行が必要になった
- evidence: Workerの2回の停止報告、Mainのsandbox内 `apply_patch` 失敗、sandbox外のCodex apply-patch入口で成功
- suggestion: commandとapply_patchで同じ安全な再試行・承認経路を利用できるよう、workspace setup refreshの失敗時fallbackを検証する
