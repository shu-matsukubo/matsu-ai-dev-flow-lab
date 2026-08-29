# Flow Feedback i00-tbootstrap-001-f01

- 発生元Issue: なし（Issue運用開始前）
- 発生元PR: なし
- 発生元Task: 2026-08-26-initial-bootstrap.md
- category: verify
- symptom: container内の `npm ci` が企業TLS interception CAを信頼せず失敗した
- impact: 初回Docker buildとsetup / refreshを実行できなかった
- evidence: `UNABLE_TO_VERIFY_LEAF_SIGNATURE` を確認。公開CAをBuildKit secretで渡すと成功
- suggestion: `NPM_CA_FILE` によるoptionalな公開CA注入を標準化し、image・repository・lockfileへ残さない（今回実装済み）
