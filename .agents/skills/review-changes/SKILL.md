---
name: review-changes
description: 承認済み実装diffを要求充足、正しさ、回帰、アーキテクチャと責務境界、安全性、検証不足の順にレビューする。
---

# 実装レビュー

Requirement Issue、merge済み要求分析書、Requirement Analysis PR、現在の`docs/`、タスクファイル、対応するIssue統合PR、baseからの実差分、ローカル検証結果を直接読む。要求分析書が存在しない、またはRequirement Analysis PRが未mergeならレビューを完了扱いにせずMainへ返す。Agentの報告や過去チャットだけを根拠にしない。対象PRがRequirement Issueを `Refs #<number>` などの非close形式で参照し、本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを含まないことを確認する。Task PRではTaskの承認範囲・完了条件、担当範囲が寄与する要求分析書の受入条件IDと根拠、未対象または未充足の事項、Issue branchへの安全な取り込みを確認する。Issue統合PRでは全Task、最新`develop`同期、要求分析書の全受入条件と統合・回帰、各条件の根拠、未実施項目、残るリスクを確認する。レビューで受入条件充足を認めても、Issueをcloseしない。

Flow Feedback処理Taskでは、固定した対象集合、評価案への人間承認、分類と根拠、関連feedbackのまとめ方、引き継ぎ先Issue、Main単一writerを直接確認する。人間承認前の既存feedback変更やIssue作成・更新、対象外fileの混入、元fileの統合・削除、状態metadataや新directory、Issue作成だけでの`resolved/`移動を必須指摘とする。

処理記録と相互参照から、処理Issue、Task、PR、発生元、関連feedback、引き継ぎ先Issue、確定済みの最終結果を辿れることを確認する。Worker / Reviewer自身は既存feedbackや共通fileを変更しない。

次を重要度順に確認する。

- 要求分析書の目的、要件、受入条件とTaskの完了条件を満たすか
- 対象外変更、不要な依存関係、無関係な整形がないか
- エラー、空入力、境界値、再実行、部分失敗で正しさを失わないか
- frontend / backend、service、依存関係、API、data、securityの境界を破らないか
- secret、credential、個人情報、過剰権限、危険なremote操作がないか
- テスト、lint、typecheck、buildが変更リスクを十分に覆うか
- 設計と実装が矛盾せず、未導入機能を現在の契約としていないか
- Agent構成の必須レビュー経路を満たしたか

指摘は `P0`（停止が必要）、`P1`（merge前に必須修正）、`P2`（限定的不具合・契約違反・検証不足）、`P3`（小さな保守性懸念）で示す。各指摘にpathと最小行範囲、具体的な影響または再現条件、必要な修正を含める。好みだけの指摘、根拠のない将来懸念、diff外の既存問題は指摘にしない。

指摘がない場合も、確認した差分、検証範囲、Task PRでは担当範囲が寄与する要求分析書の受入条件、Issue統合PRでは要求分析書の全受入条件について、充足状況と根拠、未実施項目、残るリスクを示す。フロー上の問題はMainへ返し、新規Flow Feedbackの永続化はMainが`$record-flow-feedback`で行う。PR merge後もRequirement Issueはopenのまま維持し、すべての受入条件と根拠を確認した人間だけが明示的にcloseする。
