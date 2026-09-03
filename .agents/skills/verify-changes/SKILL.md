---
name: verify-changes
description: 実装後またはレビュー修正後に、共通検証入口と変更リスクに応じた追加検証を実行し、成功・失敗・未実施・残るリスクを記録する。
---

## 開始ゲートと検証境界

検証開始前にMainが最新Issueのステータスを確認し、`AI：作業可能`だけと現在のチャット指示、必要な永続情報が揃う場合に限り検証する。未付与・人間承認待ち・複数競合・不整合では成果物やラベルを変更せず停止する。検証完了後の人間承認待ちへの切り替えはMainだけが行い、Worker・Reviewerはステータスを変更しない。

# 検証

Requirement Issue、merge済み要求分析書、Requirement Analysis PR、現在の設計、タスクファイル、対応するIssue統合PR、実diff、`docs/quality/testing.md` を確認する。要求分析書が存在しない、またはRequirement Analysis PRが未mergeなら検証を完了扱いにしない。Task PRではTaskの変更リスク、要求分析書の受入条件IDとの対応、Issue branchへの取り込み可能性を、Issue統合PRでは全Task完了後に最新`develop`をmergeした状態でRequirement Issue全体の統合・回帰と要求分析書の全受入条件を確認する。repository全体の共通品質ゲートは `sh scripts/verify.sh` を使用し、Skillへ個別commandを複製しない。

共通品質ゲートはESLint、TypeScript typecheck、ユニットテスト、build、`git diff --check`を含む。変更リスクが共通品質ゲートだけで覆えない場合は、対象を絞った追加テスト、起動確認、契約確認など最小十分な検証を選ぶ。大きなテスト戦略変更が必要なら実装せず設計影響確認へ戻る。

Flow Feedback処理Taskでは、Task記録へ固定した対象file集合と実差分を照合する。filenameと必須8項目、状態metadataの不在、処理記録とIssue参照、1観測1file、移動前後の欠落・重複、分類とdirectory配置の整合を追加確認する。Issueを作成しただけのfile、関連Issueが未完了のfile、最終結果を確認できないfileは`pending/`を維持し、必要な対応の完了時だけ`resolved/`、対応不要の確定時だけ`dismissed/`であることを確認する。

Dockerが存在しない、daemonへ接続できない、依存関係や外部状態が不足する場合は、scriptのmessageと原因を報告して停止する。host実行などの代替確認を行った場合もDocker品質ゲート成功とは扱わない。

失敗が承認対象範囲内の実装原因なら修正して再実行する。環境・外部要因または対象範囲外なら、command、失敗・未実施理由、代替確認、残るリスクをタスクファイルへ記録する。最後に`git status`とbaseからのdiffを確認し、意図しない生成物、lockfile、secret、未追跡fileがないことを確認する。
