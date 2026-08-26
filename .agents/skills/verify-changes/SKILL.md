---
name: verify-changes
description: Implementation後またはreview修正後に、共通verify入口と変更riskに応じた追加検証を実行し、成功・失敗・未実施・残るriskを記録する。
---

# Verification

Requirement Issue、現在のDesign、Task file、実diff、`docs/quality/testing.md` を確認する。repository全体の共通gateは `sh scripts/verify.sh` を使用し、Skillへ個別commandを複製しない。

共通gateはESLint、TypeScript typecheck、Unit Test、build、`git diff --check`を含む。変更riskが共通gateだけで覆えない場合は、対象を絞った追加test、起動確認、契約確認など最小十分な検証を選ぶ。大きなtesting strategy変更が必要なら実装せずDesign Impact Checkへ戻る。

Dockerが存在しない、daemonへ接続できない、dependencyや外部状態が不足する場合は、scriptのmessageと原因を報告して停止する。host実行などの代替確認を行った場合もDocker gate成功とは扱わない。

失敗が承認scope内の実装原因なら修正して再実行する。環境・外部要因またはscope外なら、command、失敗・未実施理由、代替確認、残るriskをTask fileへ記録する。最後に`git status`とbaseからのdiffを確認し、意図しない生成物、lockfile、secret、未追跡fileがないことを確認する。
