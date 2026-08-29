# Flow Feedback i00-tbootstrap-001-f02

- 発生元Issue: なし（Issue運用開始前）
- 発生元PR: なし
- 発生元Task: 2026-08-26-initial-bootstrap.md
- category: verify
- symptom: 初回verify時は全fileがuntrackedで、`git diff --check` が末尾の余分な空行を検出しなかった
- impact: staging後の最終reviewで追加整形とverify再実行が必要になった
- evidence: `git diff --cached --check` が複数fileの `new blank line at EOF` を報告し、整形・再staging後に成功
- suggestion: empty repository bootstrapでは、最終verify前に追跡予定fileをstagingしてdiff gateの対象にする
