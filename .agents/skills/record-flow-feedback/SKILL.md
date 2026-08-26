---
name: record-flow-feedback
description: Worker・Reviewer・Mainが作業中に観測したAI開発フロー上の問題を、競合する中央ファイルではなく該当Task fileへ構造化して記録する。
---

# Flow Feedback Recording

WorkerとReviewerはTask粒度、approval、Skill、Design、verification、review、不要手順などの問題をMainへ返す。中央集約ファイルや他Task fileを直接編集しない。

Mainは観測事実を確認し、該当する `.tasks/active/` または `.tasks/completed/` の `flow feedback` へ次を記録する。

- `category`: 問題の種類
- `symptom`: 実際に起きた事象
- `impact`: 手戻り、待ち時間、判断不確実性などの影響
- `evidence`: command、review往復、曖昧だった指示などの根拠
- `suggestion`: 次回検証できる最小の改善候補

一般論や推測だけのfeedback、個人情報、secret、Requirement / Design全文を記録しない。問題がなければ「なし」と明示する。Taskのscopeを変えない記録はbookkeepingとして扱う。

複数のcompleted Taskから傾向を調べる場合は読み取り集約とし、元Taskを改変しない。Skill、approval gate、AI flowの変更候補は自動適用せず、新しいRequirementとDesign Impact Checkへ渡す。schedulerや自動集約基盤は導入しない。
