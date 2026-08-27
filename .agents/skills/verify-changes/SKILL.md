---
name: verify-changes
description: 実装後またはレビュー修正後に、共通検証入口と変更リスクに応じた追加検証を実行し、成功・失敗・未実施・残るリスクを記録する。
---

# 検証

要求Issue、現在の設計、タスクファイル、実diff、`docs/quality/testing.md` を確認する。repository全体の共通品質ゲートは `sh scripts/verify.sh` を使用し、Skillへ個別commandを複製しない。

共通品質ゲートはESLint、TypeScript typecheck、ユニットテスト、build、`git diff --check`を含む。変更リスクが共通品質ゲートだけで覆えない場合は、対象を絞った追加テスト、起動確認、契約確認など最小十分な検証を選ぶ。大きなテスト戦略変更が必要なら実装せず設計影響確認へ戻る。

Dockerが存在しない、daemonへ接続できない、依存関係や外部状態が不足する場合は、scriptのmessageと原因を報告して停止する。host実行などの代替確認を行った場合もDocker品質ゲート成功とは扱わない。

失敗が承認対象範囲内の実装原因なら修正して再実行する。環境・外部要因または対象範囲外なら、command、失敗・未実施理由、代替確認、残るリスクをタスクファイルへ記録する。最後に`git status`とbaseからのdiffを確認し、意図しない生成物、lockfile、secret、未追跡fileがないことを確認する。
