---
name: check-design-impact
description: Requirement IssueからTask Planningへ進む前に、現在のDesignと実装への影響を評価し、Design変更不要の根拠または承認が必要なDesign案を提示する。
---

# Design Impact Check

Requirement Issue、現在の`develop`、`docs/`、関連コードとtestを読む。過去チャットを正本にせず、IssueのGoal、Requirements、Acceptance Criteria、Out of scopeを確認する。

次の各観点を `影響なし`、`既存Designの明確化`、`Design判断が必要` のいずれかで評価し、根拠となる文書または実装を示す。

- frontend / backend責務
- service境界とdependency方向
- API契約
- authentication / authorization / session
- persistence / DBとdata ownership
- security boundary
- testing strategyとCI / quality gate
- AI development flow
- Agent / Skill責務

Design文書の変更を機械的に要求しない。影響がなければ、変更不要の理由、確認した正本、Task Planningで守る境界を簡潔に出力し、`$plan-tasks`へ進める。

単なる事実訂正や明確化が必要なら、実装と分離したDesign PR候補として示す。新しいarchitecture判断、既存architecture変更、新しいservice / dependency、認証方式、persistence方式、API契約方式、testing strategyの大幅変更、新しいDesign文書・top-level文書カテゴリ、AI flowの重要変更が必要なら、選択肢、影響、推奨案、未決事項を人間へ提示して停止する。

承認されたDesign変更は元Issueを `Refs #<number>` で参照するDesign PRに限定する。Requirement Issueをcloseせず、Design PRがmergeされるまで、その判断を前提にImplementationへ進まない。
