# Taskと提出

## 目的

承認済みTaskの着手、作業記録、Issue単位の統合、二階層branch / Pull Request、提出後の復元可能性を所有する。review、verification、提出形式、安全の判断基準はReferenceから入力する。

## repository branchの責務

repositoryの既定branchは`main`とし、開発作業の起点とIssue統合PRのbaseは`develop`とする。人間が管理する`develop`から`main`への反映後に必要な確認を行い、Issue単位のbranchから`main`へ直接backportしない。このWorkflowは`main`への反映を自動化しない。

## Issue単位の統合境界

通常の実装は次の構造とする。

~~~text
develop
  └─ issue/<issue-id> ── Issue統合PR ──> develop
       └─ task/<issue-id>-<task-id> ── Task PR ──> issue/<issue-id>
~~~

- Issue branchはTask計画承認後の最新`develop`から作成する。
- Issue統合PRは`develop`をbase、Issue branchをheadとし、早期にDraftで作成する。
- Task branchは着手時点の最新Issue branchから作成する。
- Task PRは対応するIssue branchをbase、Task branchをheadとし、Draftで作成する。
- Task branch同士を直接依存させず、先行Taskが必要なら先行Task PRをIssue branchへ取り込んだ後に後続Taskを開始する。
- 複数Issue branchは互いにbaseや直接の依存先にせず、必要な成果は`develop`経由で取り込む。

## Task着手

Mainは承認済み計画、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、最新Issue branchを確認する。Task開始時に`.issue-tasks/TEMPLATE.md`から`.issue-tasks/active/<date>-<task>.md`を作成し、実装と同じTask branchへ含める。未着手Task fileだけのPull Requestは作らない。

Task記録には少なくとも次を保持する。

- 元Issue、要求分析書、Requirement Analysis PR、設計判断記録、設計PR
- 承認scope、目的、対象、対象外、依存、懸念、完了条件
- Agent構成と割り当て
- Issue branch、Issue統合PR、Task branch、Task PR
- 実装結果、review、verification、CI
- 寄与する受入条件と根拠
- 未実施項目、残るリスク、必要なFlow Feedback参照

## 成果物作成

承認済みAgent構成に従い、[成果物作成パターン](artifact-patterns.md)から経路を選ぶ。能力の選択では識別名を固定せず、必要な入力と期待する出力を使う。

実装中にscope、対象外、architecture判断、依存の意味、完了条件、Agent種別または必須review経路を変える必要が生じた場合は変更を広げず、Task再計画と人間承認へ戻る。要求または受入条件自体の変更が必要なら、要求分析の改訂から再開する。

## Taskのreviewとverification

Taskの実差分、Task記録、要求、設計を入力にreviewを行い、重要度付きfinding、確認範囲、未確認事項、remaining riskを得る。承認済み構成に独立Reviewerが含まれる場合は、実装担当から独立したreviewを完了する。Mainの最終reviewは省略しない。

Taskの変更リスクに従って`sh scripts/verify.sh`と追加検証を実行する。各確認をPassed、Failed、Not Executedで記録し、未実施を成功扱いにしない。P0〜P2またはTask起因の検証失敗が残る場合は提出しない。

完了したTask記録は同じTask branch上で`.issue-tasks/completed/`へ移し、実装と同じTask PRへ含める。

## 提出

提出能力には、Workflowが確定した次の入力を渡す。

- repository、成果物、変更tree、対象branchまたはref
- base、head、Draft / Ready状態
- Pull Request titleとbody
- review、verification、CIの結果
- [提出形式](../references/submission-format.md)と[安全基準](../references/security.md)
- 期待するremote結果と未完了境界

提出能力は入力された契約を実行し、工程、base、head、公開形式、次の遷移を選ばない。remote headに想定外更新がある、変更treeを正確に表現できない、secret混入を否定できない、または入力契約が不足する場合はremoteを変更せずNot Executedを返す。

## Task PR

Task PR本文には元Issue、要求分析書、Requirement Analysis PR、設計PR、Issue統合PR、Task記録、変更内容、検証、review、依存、未実施、残るリスクを記載する。Taskが寄与する受入条件IDと根拠、未対象または未充足の事項を示す。

Task PRの公開だけではRequirement Issueのステータスを変更しない。AIはTask PRをmergeせず、Task branchを削除しない。人間がTask PRをIssue branchへSquash mergeする。

## Issue統合

全TaskがIssue branchへ取り込まれた後、最新`develop`をIssue branchへmergeする。共有branchはrebaseまたはforce pushせず、競合をRequirement Issue単位の統合問題として解決する。

Mainは次を直接確認する。

- 全TaskとTask記録が完了している
- 最新`develop`との差分と同期状態
- Requirement Issue全体の統合reviewと回帰
- 共通品質ゲートと必要な追加検証
- 要求分析書の全受入条件ごとの充足状態と根拠
- 未実施項目と残るリスク
- Issue統合PR本文と実際のtreeが一致する

確認後、Issue統合PRをReady for reviewへ変更し、人間のPR確認待ちへ引き渡す。AIはIssue統合PRをmergeせず、Issue branchを削除せず、Requirement Issueをcloseしない。

## Pull Request本文の安全境界

すべての成果物PRはRequirement Issueを`Refs #<number>`または通常のリンクなど、mergeでIssueを自動closeしない形式で参照する。`Closes`、`Fixes`、`Resolves`およびGitHubが同等に扱うkeywordを本文へ含めない。

Task PRとIssue統合PRはSquash mergeを基本とするが、mergeとbranch削除は人間が行う。Issue統合PRのmerge後もRequirement Issueはopenのまま維持し、全受入条件と根拠を確認した人間だけがcloseする。

## 再開可能性

Task PR公開後は、Requirement Issue、要求分析書、設計、Issue統合PR、Task記録、Task PR、diff、review、verification、CIから再開する。Issue統合時は、取り込み済みTask PR、最新`develop`との差分、統合検証、全受入条件の根拠から状態を復元する。過去チャットだけを作業状態にしない。
