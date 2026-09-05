# Flow Feedback基準

## 目的

AI開発フロー上の新規観測の記録形式、既存feedbackの評価分類、directoryによる状態表現を一意に定める。

## 適用対象

通常作業で新しいフロー上の問題を記録する場合と、人間が承認した専用処理範囲で既存feedbackを評価・反映する場合に適用する。

## 判断基準

新規feedbackは1観測1fileとし、`.flow-feedback/pending/`へ次の8項目を記録する。

1. 発生元Issue
2. 発生元Task
3. 発生元PR
4. category
5. symptom
6. impact
7. evidence
8. suggestion

categoryは`task-size`、`approval`、`skill`、`design`、`verify`、`review`、`unnecessary-step`、`other`から選ぶ。状態metadataを本文へ重複させず、配置directoryを正本とする。

| directory | 意味 |
|---|---|
| `pending/` | 評価前、対応継続中、または最終結果未確定 |
| `resolved/` | 必要な対応の完了と根拠が確定 |
| `dismissed/` | 対応不要の判断と根拠が確定 |

既存feedbackの評価案は固定済みの対象集合ごとに、次の分類、根拠、関連feedback、引き継ぎ先、remaining riskを示す。

| 分類 | 意味 |
|---|---|
| 対応する | 現在の正本に照らして改善が必要 |
| 対応不要 | 重複、既対応、意図された制約などにより変更不要 |
| 別Issueとして扱う | 独立した要求判断が必要 |

評価案への人間承認前は既存feedbackを更新・移動せず、引き継ぎ先Issueを作成・更新しない。承認済み反映ではMainを既存feedbackと共通fileの単一writerとし、移動前後で固定集合の欠落と重複がないことを確認できる記録を持つ。改善Issueを作成しただけでは最終結果とせず`pending/`を維持する。

## 対象外

このReferenceはfeedbackの作成、評価、更新、移動、削除、Issue作成、Agent割り当て、工程遷移を実行しない。

## 設計上の根拠

[Issue #52 設計判断記録](../../design-decisions/52.md) の「Flow Feedback」「Referenceの責務と形式」に基づく。
