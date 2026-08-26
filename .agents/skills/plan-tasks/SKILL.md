---
name: plan-tasks
description: Design gate通過後のRequirementを、承認可能な単一責務Taskへ分解し、scope、完了条件、依存、risk、agent strategy、必須review経路をチャットで提示する。
---

# Task Planning

`$check-design-impact` がDesign変更不要と判断した根拠、または必要なDesign PRのmergeを確認してから使用する。Requirement Issue、現在の`develop`、`docs/`、関連実装を読み、過去の未着手Planを正本として復元しない。

1 Taskを1つの責務とレビュー可能な成果に限定する。各Taskへ次を定義する。

- 一意なTask key、title、priority
- 目的、対象範囲、作業内容、対象外
- dependencyと着手・完了・公開を止める条件
- concernsとcompletion criteria
- agent strategyと必須review経路

agent strategyは次から選ぶ。

- `parent-only`: Mainが実装、self review、最終判断を行う。
- `worker-parent-review`: Workerが実装・self reviewし、Mainがreviewする。
- `worker-reviewer-parent`: Workerの実装・self review後、独立Reviewerがreviewし、Mainが最終reviewする。

軽量かどうかを行数だけで判断しない。boundary、risk、独立reviewの価値からstrategyを選び、Worker / Reviewerの人数や担当範囲は固定しない。

計画をチャットへ提示し、人間の明示承認を待つ。未着手PlanをGitへ保存しない。承認後、実際にTaskへ着手するときだけ `.tasks/TEMPLATE.md` から `.tasks/active/<date>-<task>.md` を作る。Task fileだけを先にcommitまたはPull Request化しない。

目的、architecture判断、scope、対象外、完了条件、dependencyの意味、agent種別、必須review経路を変更する場合は再計画・再承認へ戻る。
