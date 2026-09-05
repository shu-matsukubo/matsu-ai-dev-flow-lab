---
name: process-flow-feedback
description: 承認済みの専用Flow Feedback処理Taskで、対象feedback群を評価し、人間承認後にMainが処理記録、Requirement Issueへの引き継ぎ、最終結果に応じたfile移動を行う。
---

# Flow Feedback処理

## 開始ゲートと責務境界

Flow Feedback処理Taskを含むRequirement Issue作業では、Mainが開始前に4種類の有効ステータスを確認し、`AI：作業可能`だけと現在のチャット指示がある場合に限り開始する。旧3ラベル残存、未付与、複数競合、永続情報との不整合では移行完了まで変更せず安全停止する。Worker・Reviewerは既存feedback、共通file、ステータスを変更せず、Mainだけが承認後の引き渡しと処理記録を行う。

## 適用範囲と前提

通常Taskでの新規観測記録には使用しない。既存feedbackの処理は、専用Requirement Issue、merge済み要求分析書、設計ゲート、人間が承認した専用Taskを通して行う。いずれかを確認できなければ開始せず、必要な工程へ戻す。

## 対象を固定する

Mainは処理開始時点で対象とする `.flow-feedback/pending/` のfile pathを列挙し、Task記録へ固定する。対象確定後に追加されたfileは暗黙に含めず、別の処理単位へ残す。元の観測fileは統合、削除、無断改名せず、1観測1fileを維持する。

Worker / Reviewerを使う場合は、固定した対象、Requirement Issue、要求分析書、現在の設計・実装・テスト、Task記録を渡す。Worker / Reviewerは読み取り分析と提案だけを行い、既存feedback、Task記録、AI開発フロー文書、Skill、その他の共通fileを変更しない。

## 評価案を作る

### 各feedbackの確認事項

各feedbackについて、次を確認する。

- 必須8項目と、発生元Issue、Task、PR、観測根拠
- 現在有効な要求分析、設計、実装、テストとの整合性
- 同じ原因または改善候補を持つ他のfeedbackとの関係
- 重複、既存対応、前提変更、既に解消済みか
- 対応効果、影響範囲、依存関係、独立した承認や優先順位判断の必要性

### 評価案の内容

Mainは分析を統合し、対象fileごとに次を含む評価案を人間へ提示する。

- `対応する`、`対応不要`、`別Issueとして扱う` の分類と判断根拠
- 関連feedbackをまとめる単位と、その責務・影響範囲・依存関係の根拠
- 作成または参照する改善Requirement Issue、独立Requirement Issue、または引き継ぎ不要の判断
- 確認できない事項、未実施項目、残るリスク

`対応する`は、関連feedbackを可能な範囲でまとめ、通常の要求分析以降の承認境界を通す改善Requirement Issueへ引き継ぐ場合に使う。大きな設計変更、独立した要求、異なる承認または優先順位判断が必要な内容は`別Issueとして扱う`とし、独立Requirement Issueへ引き継ぐ。重複、既存対応、前提変更、効果とコストなどから対応不要と確定できる場合だけ`対応不要`とする。

## 評価案の承認を待つ

Task計画の承認と評価案への承認を同一視しない。人間が評価案を明示承認するまで、既存feedbackの更新・移動、引き継ぎ先Requirement Issueの作成・更新、改善実装を行わない。対象、分類、まとめ方、引き継ぎ先を変更する場合は、変更案を提示して再承認を待つ。

承認が得られない場合は、評価案と未実施事項を報告して停止する。未承認案をfeedback本文へ記録しない。

## 承認済み処理を反映する

### Mainによる記録

承認後のwriterはMainだけとする。MainはTask記録へ承認内容を記録し、各対象fileへ必要十分な処理履歴を追記する。処理履歴から次を辿れるようにする。

- Flow Feedback処理のRequirement Issue、Task、PR
- 分類、判断根拠、関連feedback file
- まとめて扱う改善Requirement Issueまたは独立Requirement Issue
- 確認済みの場合だけ、必要な対応の完了または対応不要の確定を示す最終結果と根拠

feedback、Issue、Taskへ同じ詳細を大量に複製せず参照で結ぶ。引き継ぎ先Requirement Issueは要求原文とIssue登録前の補足を正本とし、対象feedback fileへの参照を持たせる。directory配置と重複する`status`などの状態metadataや中央一覧fileを追加しない。

| 分類 | 承認後の処理 | fileの状態 |
|---|---|---|
| 対応する | 関連feedbackを改善Requirement Issueへ引き継ぎ、通常の要求分析、設計影響確認、必要な設計承認、Task承認、実装、レビュー、検証を通す | 最終結果が確定するまで`pending/` |
| 対応不要 | 根拠を処理履歴へ記録する | 同じ変更で`dismissed/`へ移動 |
| 別Issueとして扱う | 独立Requirement Issueへ引き継ぎ、通常フローを通す | Issue作成だけでは完了とせず`pending/` |

改善Requirement Issueまたは独立Requirement Issueで必要な対応が完了し、根拠を確認できた場合だけ、最終結果を追記して`resolved/`へ移動する。引き継ぎ先で対応不要と確定した場合は、根拠を追記して`dismissed/`へ移動する。関連Issueが未完了、結果が確認できない、またはIssueを作成しただけの場合は`pending/`を維持する。処理Issue自体の完了を、引き継いだfeedbackの処理完了とは扱わない。

#### 状態の正本と禁止事項

状態は `.flow-feedback/pending/`、`.flow-feedback/dismissed/`、`.flow-feedback/resolved/` のdirectory配置だけを正本とする。新しい状態directory、外部DB、scheduler、lock service、自動Issue作成、自動改善を導入しない。

## レビューと検証

`$review-changes` と `$verify-changes` を使用し、少なくとも次を確認する。

- Task記録へ固定した対象集合と実差分が一致し、対象外fileが変更されていない
- filename、必須8項目、1観測1file、状態metadata不在が維持されている
- 評価案への人間承認後にだけ、Mainが既存feedbackと共通fileを変更している
- 処理記録と参照から、発生元、処理Issue、Task、PR、関連feedback、引き継ぎ先、確認済みの最終結果を辿れる
- 移動前後にfileの欠落や重複がなく、分類とdirectory配置が整合している
- 共通品質ゲート `sh scripts/verify.sh` と、変更リスクに応じた追加検証が成功している

GitHub操作はGitHub連携だけを使用する。AI agentはPull Requestをmergeせず、branchを削除せず、Requirement Issueをcloseしない。検証不能、承認不明、参照先不明、最終結果不明のfileは移動せず、未実施事項と残るリスクを報告して停止する。
