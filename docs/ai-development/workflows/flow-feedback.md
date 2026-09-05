# Flow Feedback Workflow

## 目的

通常Taskでの新規観測記録と、専用Requirement Issueでの既存Flow Feedback一括処理の工程、承認、停止・再開を所有する。記録形式と分類基準は[Flow Feedback基準](../references/flow-feedback.md)を参照する。

## 通常Task

Worker、Reviewer、MainがAI開発フロー上の問題を観測した場合、Task本来のscopeを広げずMainへ事実を返す。Mainは観測根拠を確認し、新規記録が必要な場合だけ、観測を1件のFlow Feedbackへ変換する能力へ入力する。

通常Taskで扱うのは新しい観測の`pending/`への記録だけである。次は行わない。

- 既存feedbackの検索、整理、重複統合
- 改善要否や分類の決定
- 既存feedbackの更新、削除、移動
- feedbackを理由とするscope外の改善
- scheduler、自動集約、自動Issue作成、自動改善

問題がなければ新規fileを作成しない。同じ種類の問題を別Taskで観測した場合も自動統合しない。

## 専用処理の開始条件

既存Flow Feedbackの一括処理は、専用Requirement Issue、merge済み要求分析書、現在の設計、人間が承認したTaskを通した場合だけ開始する。通常Taskから暗黙に開始しない。

Task開始時に処理対象となる`.flow-feedback/pending/`のfile集合を固定し、Task記録へ列挙する。固定後に追加されたfileは今回の対象へ含めない。

複数Agentを使う場合、WorkerとReviewerは読み取り分析と提案だけを行う。既存feedback、Task記録、共通文書を変更するwriterはMainだけとする。

## 読み取り評価

固定済み集合、発生元Issue / Task / PR、現在の要求、設計、実装、テスト、関連feedbackを入力に、Flow Feedbackを評価する能力を選択する。能力はread-onlyで、各fileについて次を返す。

- 必須項目と観測根拠の充足
- 現在の正本との整合
- 同じ原因または改善候補を持つfeedbackとの関係
- 分類案: `対応する`、`対応不要`、`別Issueとして扱う`
- 分類根拠
- 関連feedbackのまとめ方
- 作成または参照するRequirement Issue
- 未確認事項とremaining risk

Mainは評価を統合し、人間が判断できる評価案としてチャットへ提示する。

## 評価案の承認

人間が評価案を明示承認するまで、次を変更しない。

- 既存feedbackの本文とdirectory配置
- 引き継ぎ先Requirement Issue
- AI開発フロー、Skill、Reference、実装
- 評価対象集合、分類、まとめ方

対象、分類、まとめ方、引き継ぎ先を変える場合は評価案を再提示し、再承認を得る。Task計画の承認を評価案の承認として扱わない。

## 承認済み処理の反映

承認済み評価案と固定対象集合を入力に、処理履歴とfile配置へ反映する能力を選択する。Mainだけが結果を永続化する。

- `対応不要`: 根拠と最終結果を記録し、同じ変更で`dismissed/`へ移す。
- `対応する`: 関連feedbackを改善Requirement Issueへ引き継ぎ、必要な対応の最終結果が確定するまで`pending/`を維持する。
- `別Issueとして扱う`: 独立Requirement Issueへ引き継ぎ、そのIssueの最終結果が確定するまで`pending/`を維持する。

Issueを作成しただけ、関連Issueが未完了、または最終結果を確認できない場合は`resolved/`へ移さない。引き継ぎ先で必要な対応が完了した場合だけ、最終結果を記録して`resolved/`へ移す。引き継ぎ先で対応不要と確定した場合は`dismissed/`へ移す。

元の観測fileは統合または削除しない。同じ改善Issueへ複数fileを引き継ぐ場合も、各fileから処理Issueと引き継ぎ先を辿れる状態を保つ。

## 状態

処理状態の正本はdirectory配置だけである。

| directory | 意味 |
|---|---|
| `pending/` | 改善または対応不要の最終結果が確定していない |
| `resolved/` | 必要な対応の完了を確認し、最終結果を記録済み |
| `dismissed/` | 対応不要を根拠付きで確定し、最終結果を記録済み |

本文へ`status` metadataを重複して持たせない。中央一覧file、新しい状態directory、外部DB、lock serviceを追加しない。

## Reviewとverification

専用処理の変更では、固定対象集合と実差分、filename、必須項目、状態metadataの不在、処理履歴、Issue参照、移動前後の欠落・重複、分類とdirectoryの整合を確認する。人間承認前のmutation、対象外fileの混入、元fileの統合・削除、Issue作成だけでの`resolved/`移動は停止が必要なfindingとする。
