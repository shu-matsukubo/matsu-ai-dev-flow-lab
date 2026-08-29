# Flow Feedback i01-thuman-facing-language-alignment-f01

- 発生元Issue: #1
- 発生元PR: #4
- 発生元Task: 2026-08-27-human-facing-language-alignment.md
- category: other
- symptom: Windows sandboxのsetup refresh errorで通常のshell、apply_patch、Reviewerのローカル読取が拒否された
- impact: 標準経路を使えず、承認付き直接実行とレビュー資料のメッセージ共有が必要になった
- evidence: `helper_unknown_error: setup refresh had errors` がMainと2回のReviewer起動で再現
- suggestion: setup refresh失敗時にread-only Reviewerとapply_patchが利用できる限定fallbackを用意する
