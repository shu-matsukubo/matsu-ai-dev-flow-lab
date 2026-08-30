---
name: publish-task-pr
description: レビュー・検証済みタスクを、禁止されたpushやCLIへfallbackせずGitHub連携だけでtask branchへ公開し、対応するIssue branch向けDraft Task PRを作成する。
---

# Pull Requestの公開

タスクファイル、Requirement Issue、merge済み要求分析書、Requirement Analysis PR、承認範囲、必須レビュー、検証、local commit、branch、base、`git status`、baseからのdiff、secret混入がないことを確認する。要求分析書が存在しない、またはRequirement Analysis PRが未mergeなら公開しない。Task branchは対応するIssue branchから作成し、Task PRはそのIssue branchをbaseとする。1 Task = 1 Draft Task PRとし、タスクファイルと実装を同じPRへ含める。Issue統合Draft PRのURLとTask PRのURLをTask記録から相互に追跡できる状態にする。

remote操作にはGitHub連携だけを使用する。`git push`、`gh` CLI、GitHub APIへの直接`curl`、credential作成・保存へfallbackしない。Connectorがlocalのblob、削除、mode、symlinkを含む最終treeを正確に表現できることと、remote headに想定外更新がないことを確認してからtask branchを作成または更新する。表現または検証ができなければremoteを変更せず停止する。

Draft Task PR本文にSource Issue、要求分析書、Requirement Analysis PR、Issue統合PR、タスクファイル、主な変更、検証結果、未実施項目、残るリスク、Agentレビュー、依存関係を記載する。Source Issueは `Refs #<number>` などの非close形式で参照し、PR本文に `Closes`、`Fixes`、`Resolves` およびGitHubが同等に扱う自動close keywordを使用しない。Task PRはTask単位の完了根拠に限定し、担当範囲が寄与する要求分析書の受入条件ID、根拠、未対象または未充足の事項を記録する。設計PRは別branch / PRとし、Requirement Issueを非close形式で参照する。PR merge後もRequirement Issueをopenで維持し、すべての受入条件と根拠を確認した人間だけが明示的にcloseする。

PR作成後、URL、head、base、draft状態をタスクファイルへ記録するために必要な記録整理用commitも同じtask branchへ反映する。PRをmergeしない。

remoteがemptyでConnectorから安全なroot commitを作れない場合は、local initial commitとverificationまで完了し、remoteへfallback操作を行わない。local状態、Connectorの制約、ユーザーが行うbootstrap操作を報告して停止する。

Task PRとIssue統合PRはいずれもSquash mergeを基本とし、merge、branch削除、Issue closeは人間が行う。AI agentはPRをmergeせず、Issueをcloseしない。
