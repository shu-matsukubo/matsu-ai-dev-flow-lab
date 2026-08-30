---
name: check-design-impact
description: merge済み要求分析書の要求からタスク計画へ進む前に、現在の設計と実装への影響を評価し、設計変更不要の根拠または承認が必要な設計案を提示する。
---

# 設計影響確認

Requirement Issue、merge済みの`requirements/<issue-id>.md`、現在の`develop`、`docs/`、関連コードとテストを読む。Issueは要求原文とIssue登録前の補足を確認する入力として使い、目的、要件、受入条件、制約、対象外、人間判断の正本には要求分析書を使う。過去チャットを正本にしない。

要求分析書が存在しない、またはRequirement Analysis PRが人間によってmergeされたことを確認できない場合は設計影響確認を開始せず、`$analyze-requirement`による要求分析工程へ戻る。merge後は要求分析チャットを引き継がず、別チャットで上記の正本を読み直して開始する。

次の各観点を `影響なし`、`既存設計の明確化`、`設計判断が必要` のいずれかで評価し、根拠となる文書または実装を示す。

- frontend / backend責務
- service境界と依存関係の方向
- API契約
- authentication / authorization / session
- persistence / DBとdata ownership
- セキュリティ境界
- テスト戦略とCI / 品質ゲート
- AI開発フロー
- Agent / Skill責務

設計文書の変更を機械的に要求しない。影響がなければ、変更不要の理由、確認した正本、タスク計画で守る境界を簡潔に出力し、`$plan-tasks`へ進める。

設計変更または既存設計の明確化により設計PRが必要と判断したチャットでは、設計判断に必要な影響分析と設計案の承認・設計PR作成までに責務を限定する。後続の具体的なTask、実装対象ファイル、作業順序、実装手順、Agent割り当てを決めず、`$plan-tasks`を使用しない。設計PRのmerge後はそのチャットを完了し、別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`から設計影響確認をやり直す。

単なる事実訂正や明確化が必要なら、実装と分離した設計PR候補として示す。新しいアーキテクチャ判断、既存アーキテクチャ変更、新しいservice / 依存関係、認証方式、persistence方式、API契約方式、テスト戦略の大幅変更、新しい設計文書・top-level文書カテゴリ、AIフローの重要変更が必要なら、選択肢、影響、推奨案、未決事項を人間へ提示して停止する。

承認された設計変更は元Issueを `Refs #<number>` で参照する設計PRに限定する。設計PR本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを含めず、その変更範囲が寄与する要求分析書の受入条件、根拠、未対象または未充足の事項を記録する。設計PRのmerge後も要求Issueはopenのまま維持し、AI agentはIssueをcloseしない。すべての受入条件と根拠を確認した後にIssueをcloseする責務は人間だけが持つ。設計PRがmergeされるまで、その判断を前提に実装へ進まない。
