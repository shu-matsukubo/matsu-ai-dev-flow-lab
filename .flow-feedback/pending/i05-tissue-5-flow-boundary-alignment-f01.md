# Flow Feedback i05-tissue-5-flow-boundary-alignment-f01

- 発生元Issue: #5
- 発生元PR: #10
- 発生元Task: 2026-08-27-issue-5-flow-boundary-alignment.md
- category: other
- symptom: Windows sandboxのsetup refresh errorで通常のshellと標準`apply_patch`が拒否された
- impact: MainとWorkerが標準経路で作業ツリー確認、編集、検証を開始できなかった
- evidence: `helper_unknown_error: setup refresh had errors` がMainとWorkerで再現
- suggestion: setup refresh失敗時に、対象workspaceへ限定したread/write実行経路を案内する
