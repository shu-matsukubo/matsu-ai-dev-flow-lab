---
name: plan-tasks
description: 設計ゲート通過後の要求を、承認可能な単一責務タスクへ分解し、対象範囲、完了条件、依存関係、リスク、Agent構成、必須レビュー経路をチャットで提示する。
---

# タスク計画

`$check-design-impact` が設計変更不要と判断した根拠、または必要な設計PRのmergeを確認してから使用する。Requirement Issue、merge済み要求分析書、現在の`develop`、`docs/`、関連実装を読む。Issueは要求原文と事前の補足、要求分析書は目的、要件、受入条件、制約、対象外、人間判断の正本として扱い、過去の未着手計画を正本として復元しない。要求分析書が存在しない、またはRequirement Analysis PRが未mergeなら使用しない。

設計変更または既存設計の明確化により設計PRが必要と判断したチャットでは使用しない。設計PRがmergeされた場合も、そのチャットの未永続な計画を引き継がず、別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`から設計影響確認をやり直し、設計PRが不要と判断できた場合にだけ使用する。

1タスクを1つの責務とレビュー可能な成果に限定する。各タスクへ次を定義する。

- 一意なタスク識別子、タイトル、優先度
- 目的、対象範囲、作業内容、対象外
- 寄与する要求分析書の受入条件IDと完了根拠
- 依存関係と着手・完了・公開を止める条件
- 懸念事項と完了条件
- Agent構成と必須レビュー経路

Agent構成は次から選ぶ。通常の既定構成は `worker-parent-review` とし、Task固有の事情から別の構成が適切な場合だけ切り替える。

- `parent-only`: ごく小さく責務と挙動が明確で、Workerへ委譲する価値が低い場合に選び、Mainが実装・セルフレビュー・最終判断を行う。
- `worker-parent-review`: Workerへ委譲する価値があり、独立Reviewerを必要とする具体的な理由がない通常のTaskで選び、Workerが実装・セルフレビューし、Mainがレビュー・最終判断を行う。
- `worker-reviewer-parent`: Workerの実装・セルフレビュー後、独立Reviewerがレビューし、Mainが最終レビューする。高リスクまたは複雑な責務境界など、独立した観点による追加レビューが必要な具体的理由を計画で説明できる場合だけ選ぶ。説明できない場合は `worker-parent-review` を選ぶ。

軽量かどうかを行数だけで判断しない。境界、リスク、独立レビューで検出したい不具合から構成を選び、Worker / Reviewerの人数や担当範囲は固定しない。ファイル数、変更行数、「レビューには一般的に価値がある」といった抽象的な理由だけでは `worker-reviewer-parent` を選ばない。軽微な文言・設定・局所的変更は、独立Reviewerを追加する具体的理由がない限り `worker-reviewer-parent` の対象としない。Workerへ委譲する価値に応じて `parent-only` または `worker-parent-review` を選ぶ。

どの構成でも、Workerを使用する場合のセルフレビューとMainによる実差分・検証結果の確認、最終レビュー、最終判断は省略しない。独立ReviewerはMainの最終レビューを代替しない。

Flow Feedback処理専用Taskを計画する場合は、処理開始時に対象`pending/`集合を固定する方法、評価案への人間承認を変更前に待つ停止条件、Main単一writer、3分類・3状態、引き継ぎ先Issueの最終結果まで`pending/`を維持する完了条件を明記する。Task計画の承認と、Task開始後の評価案への承認を同一視しない。

専用処理Taskでも既存のAgent構成名を使用するが、Worker / Reviewerを使う場合の担当は読み取り分析と提案に限定し、既存feedback、Task記録、Skillなどの共通fileを変更する実装担当はMainとする。通常TaskのWorker実装責務を専用処理Taskへそのまま適用しない。

計画をチャットへ提示し、人間の明示承認を待つ。未着手計画をGitへ保存しない。承認後、実際にタスクへ着手するときだけ `.issue-tasks/TEMPLATE.md` から `.issue-tasks/active/<date>-<task>.md` を作る。タスクファイルだけを先にcommitまたはPull Request化しない。

承認後、Mainは最新の `develop` から `issue/<issue-id>` branchと、`develop`をbaseとするIssue統合Draft PRを作成する。Issue統合Draft PRはRequirement Issue、要求分析書、Requirement Analysis PR、設計、Task、検証、受入条件、`develop` 同期状態を辿る索引とする。各Taskは着手時点の最新Issue branchから `task/<issue-id>-<task-id>` branchを作り、対応するIssue branchをbaseとするTask PRで公開する。

Issue統合Draft PRとTask PRはRequirement Issueを `Refs #<number>` などの非close形式で参照し、PR本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを使用しない。Task PRには担当範囲が寄与する要求分析書の受入条件ID、根拠、未対象または未充足の事項を記録し、Issue統合PRは要求分析書の全受入条件ごとの充足状況、根拠、未実施項目、残るリスクを追跡する索引とする。PRのmerge後もIssueはopenのまま維持し、すべての受入条件と根拠を確認した人間だけが明示的にcloseする。AI agentはIssueをcloseしない。

目的、アーキテクチャ判断、対象範囲、対象外、完了条件、依存関係の意味、Agent種別、必須レビュー経路を変更する場合は再計画・再承認へ戻る。要求または受入条件そのものを変える必要が生じた場合は後続作業を止め、専用Requirement Analysis PRによる改訂と人間のmerge後、別チャットの設計影響確認から再開する。
