# Flow Feedback i01-trequirement-issue-form-f02

- 発生元Issue: #1
- 発生元PR: #3
- 発生元Task: 2026-08-27-requirement-issue-form.md
- category: verify
- symptom: Docker Desktop processは起動中だがLinux engine pipeがなく、共通品質ゲートを実行できない
- impact: `sh scripts/verify.sh` の成功確認をlocalで完了できない
- evidence: `docker info` が `dockerDesktopLinuxEngine` pipe不存在で失敗し、verify scriptもdaemon未接続でexit 1
- suggestion: Draft PRのCIで共通検証を確認し、local環境ではDocker engine復旧後に再実行する
