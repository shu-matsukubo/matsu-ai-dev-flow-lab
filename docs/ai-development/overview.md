# AI開発フロー

## 目的

この文書は、AI駆動開発の責務、承認境界、再開に必要な永続状態の正本である。アプリケーション固有の実装詳細は扱わない。

## Source of Truth

| 情報 | Source of Truth | 責務 |
|---|---|---|
| Requirement | GitHub Issue | Goal、Requirements、Acceptance Criteria、必要なOut of scope / Context |
| Design | `docs/` | 現在有効なarchitecture、boundary、quality strategy、AI flow |
| Implementation | codeとautomated tests | 実際の振る舞いと正確な実装詳細 |
| Task | `.tasks/active/` と `.tasks/completed/` | 着手済み作業の実施・検証・review・feedback記録 |

Task Planはチャット上の承認対象であり、永続的な仕様ではない。Task fileへRequirement全文やDesign全文を複製しない。

## 基本フロー

```text
Requirement Issue
        |
        v
Design Impact Check
        |
        +-- Design変更なし ---------------------+
        |                                       |
        +-- Design変更あり -> 案提示 -> 承認     |
                              -> Design PR       |
                              -> merge ----------+
                                                |
                                                v
Task Planning -> 人間承認 -> Implementation -> Review -> Verify
                                                |
                                                v
                                      Draft PR -> develop
                                                |
                                                v
                               Requirement充足確認 -> Issue Close
```

Designの検討は必須だが、Design文書の変更は毎回必須ではない。

## Requirement Issue

原則1要求1 Issueとし、重複を許容する。既存コードや既存IssueですでにAcceptance Criteriaを満たす場合は、新しい実装をせず根拠を示して完了できる。Issue templateはGoal、Requirements、Acceptance Criteriaを必須、Out of scopeとContextを任意とする。

## Design Impact Check

Task Planning前に `$check-design-impact` を使用し、現在のIssue、`develop`、`docs/`、実装を根拠として次を確認する。

- frontend / backend責務
- service境界とdependency方向
- API契約
- authentication / authorization / session
- persistence / DBとdata ownership
- security boundary
- testing strategyとCI / quality gate
- AI development flow
- Agent / Skill責務

影響がなければ、その理由と根拠を簡潔に示してTask Planningへ進む。単なる事実訂正や明確化もDesign PRとして実装と分離できる。

新しいarchitecture判断、既存architecture変更、新しいservice / dependency、認証方式、persistence方式、API契約方式、testing strategyの大幅変更、新しいDesign文書やtop-level文書カテゴリ、AI flowの重要変更が必要なら、勝手に決めず選択肢・影響・推奨案を人間へ提示する。承認後に元Issueを `Refs #<number>` で参照するDesign PRを作り、mergeまでImplementationを開始しない。Design PRはRequirement Issueをcloseしない。

## Task Planningとapproval gate

Design gateを通過した後、`$plan-tasks` で1 Task = 1責務のレビュー可能な計画をチャットへ提示する。各Taskは目的、対象範囲、作業内容、対象外、dependency、concerns、completion criteria、priority、agent strategy、必須review経路を持つ。人間の明示承認前に書き込みを開始しない。

agent strategyは次から選ぶ。

| Strategy | 必須経路 |
|---|---|
| `parent-only` | Mainが実装・self review・最終判断 |
| `worker-parent-review` | Workerが実装・self review、Mainがreview・最終判断 |
| `worker-reviewer-parent` | Workerが実装・self review、独立Reviewerがreview、Mainが最終review |

承認対象はstrategyと必須経路までであり、人数や担当範囲は固定しない。承認後にMainが責務境界、独立性、dependency、file競合、統合コストから必要最小限を決める。目的、architecture判断、scope、対象外、完了条件、dependencyの意味、agent種別、必須review経路を変える場合は再承認する。検証結果、review結果、agent allocation、commit、PRなどのbookkeepingはscopeを変えない限り追加承認を要しない。

## Task file

未着手PlanはGitへ保存しない。Taskへ着手した時点で `.tasks/TEMPLATE.md` から `.tasks/active/<date>-<task>.md` を作り、実装と同じbranch / Pull Requestへ含める。Task fileだけのPull Requestは作らない。

Task fileはSource Issueと現在のDesignを参照し、実施結果、検証、CI、agent allocation、review、flow feedback、commit、Pull Requestを記録する。完了時に `.tasks/completed/` へ移す。

## Main / Worker / Reviewer

- Main: Task Planning、approval boundary、agent allocation、architecture判断、統合、最終review、最終判断を所有する。
- Worker: 割り当て範囲の実装、必要な検証、self reviewを行い、結果・疑問・flow feedbackをMainへ返す。
- Reviewer: Workerから独立して、Requirement充足、回帰、architecture / boundary違反、検証不足を確認し、findingとflow feedbackをMainへ返す。

modelとreasoning effortは `.codex/` の責務であり、Skillへ記載しない。

## ReviewとVerification

WorkerまたはMainは実装後にself reviewを行う。承認済みstrategyのreview経路を満たした後、MainがIssue、Design、Task file、実diff、検証結果を直接確認する。findingは正しさ、安全性、回帰、boundary、検証不足を重要度順に扱い、好みだけの指摘を避ける。

Verificationは `$verify-changes` を使い、共通入口 `sh scripts/verify.sh` でlint、typecheck、Unit Test、build、`git diff --check`を実行する。riskに応じたTask固有検証を追加し、未実施・失敗は理由と残るriskを記録して成功扱いにしない。

## Pull RequestとIssue完了

通常のImplementationは `develop` base、`codex/<task-name>` branch、1 Task = 1 Draft Pull Requestとする。GitHub remote操作はGitHub連携だけを使用し、`git push`、`gh`、直接API callへfallbackしない。PRはmergeしない。

TaskのDraft PR作成後は、Requirement Issue、現在のDesign、Task file、PR、diff、review / CI結果から別チャットで再開できる。すべてのAcceptance Criteriaを満たした根拠が揃うまでRequirement Issueをcloseしない。

## Chatと永続状態の境界

- Design Impact CheckとDesign PRはImplementationとは別チャットでよい。
- Design PR merge後はIssue、現在の`develop`、現在の`docs/`だけで再開できる状態にする。
- Task Planningから最初のImplementation Draft PRまでは同じチャットで継続する。
- Draft PR後は永続状態から別チャットで復元できる。
- 未着手Planは復元対象にせず、必要なら現在状態から再計画する。

過去チャットの記憶だけを判断根拠にしない。

## Flow feedback loop

Worker / Reviewerは中央ファイルを直接更新せず、困った点と改善候補をMainへ返す。Mainは `$record-flow-feedback` を使い、該当Task fileのFlow feedbackへcategory、symptom、impact、evidence、suggestionを記録する。候補例はTask粒度、approval差し戻し、Skillの曖昧さ、Design不足、検証command、review往復、不要手順である。

将来は `.tasks/completed/` を読み取り、繰り返すfeedbackからSkill改善候補を作れる。初期段階では中央集約ファイル、自動scheduler、feedbackの自動適用を導入しない。改善自体がAI flowやSkill責務を変える場合は新しいRequirementとDesign Impact Checkを通す。
