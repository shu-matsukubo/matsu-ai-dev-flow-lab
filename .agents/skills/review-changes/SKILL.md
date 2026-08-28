---
name: review-changes
description: 承認済み実装diffを要求充足、正しさ、回帰、アーキテクチャと責務境界、安全性、検証不足の順にレビューする。
---

# 実装レビュー

要求Issue、現在の`docs/`、タスクファイル、対応するIssue統合PR、baseからの実差分、ローカル検証結果を直接読む。Agentの報告や過去チャットだけを根拠にしない。対象PRがRequirement Issueを `Refs #<number>` などの非close形式で参照し、本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを含まないことを確認する。Task PRではTaskの承認範囲・完了条件、担当範囲が寄与する受入条件と根拠、未対象または未充足の事項、Issue branchへの安全な取り込みを確認する。Issue統合PRでは全Task、最新`develop`同期、Requirement Issue全体の受入条件と統合・回帰、各条件の根拠、未実施項目、残るリスクを確認する。レビューで受入条件充足を認めても、Issueをcloseしない。

次を重要度順に確認する。

- 目的、要件、受入条件と完了条件を満たすか
- 対象外変更、不要な依存関係、無関係な整形がないか
- エラー、空入力、境界値、再実行、部分失敗で正しさを失わないか
- frontend / backend、service、依存関係、API、data、securityの境界を破らないか
- secret、credential、個人情報、過剰権限、危険なremote操作がないか
- テスト、lint、typecheck、buildが変更リスクを十分に覆うか
- 設計と実装が矛盾せず、未導入機能を現在の契約としていないか
- Agent構成の必須レビュー経路を満たしたか

指摘は `P0`（停止が必要）、`P1`（merge前に必須修正）、`P2`（限定的不具合・契約違反・検証不足）、`P3`（小さな保守性懸念）で示す。各指摘にpathと最小行範囲、具体的な影響または再現条件、必要な修正を含める。好みだけの指摘、根拠のない将来懸念、diff外の既存問題は指摘にしない。

指摘がない場合も、確認した差分、検証範囲、Task PRでは担当範囲が寄与する受入条件、Issue統合PRでは要求全体の受入条件について、充足状況と根拠、未実施項目、残るリスクを示す。フロー上の問題はMainへ返し、タスクファイルへの記録はMainに委ねる。PR merge後もRequirement Issueはopenのまま維持し、すべての受入条件と根拠を確認した人間だけが明示的にcloseする。
