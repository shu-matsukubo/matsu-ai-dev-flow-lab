---
name: record-flow-feedback
description: "作業中に観測したAI開発フロー上の一つの問題を、根拠付きの新規Flow Feedbackとして記録する。"
---

# 提供能力

一つの観測事実を、再現可能な証拠と最小の改善候補を持つ新規feedback fileへ変換する。

## 適用条件

- AI開発フロー上の具体的な問題を現在の作業で観測した。
- 発生元と証拠を識別できる。
- 新規記録の書式と配置先が入力として与えられている。
- 書き手に新規記録の権限がある。

## 入力

- 発生元Issue、Task、Pull Request
- 観測した事実と発生条件
- 作業への具体的影響
- command、review往復、文書pathなどの証拠
- categoryと記録形式
- 出力先path

## 出力

次の8項目を持つ1件の新規feedback fileと作成結果を返す。

- 発生元Issue
- 発生元Task
- 発生元PR
- category
- symptom
- impact
- evidence
- suggestion

あわせて未確認事項、記録失敗、残るリスクを返す。

## 責務外

- 既存feedbackの検索、評価、統合、更新、移動、削除
- feedbackへの状態metadataの追加
- 改善要求の承認または実装
- Issue、branch、commit、Pull Requestの操作
- 工程状態または担当Agentの変更

## 能力固有の処理

観測と推測を分離し、再現または確認可能な事実だけをsymptomへ記載する。impactは余分な往復、誤判定、作業停止など実際の影響を示す。evidenceは秘密情報を除き、第三者が確認できる最小の証拠とする。suggestionは将来検証できる最小の改善候補であり、採用済みの判断として書かない。

一つのfileへ複数の独立した問題をまとめない。配置directoryと重複する状態を本文へ記録しない。

## 失敗・未実施・残るリスク

証拠または発生元を確定できない場合は推測で補わず未確認として返す。出力先が既存fileと衝突する場合は上書きせず失敗を返す。記録は改善の承認や解決を意味しない。
