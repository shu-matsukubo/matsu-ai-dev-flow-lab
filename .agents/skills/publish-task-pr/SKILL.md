---
name: publish-task-pr
description: レビュー・検証済みタスクを、禁止されたpushやCLIへfallbackせずGitHub連携だけでtask branchへ公開し、develop向けDraft Pull Requestを作成する。
---

# Pull Requestの公開

タスクファイル、承認範囲、必須レビュー、検証、local commit、branch、base、`git status`、baseからのdiff、secret混入がないことを確認する。通常は `codex/<task-name>` から `develop` への1タスク = 1 Draft Pull Requestとし、タスクファイルと実装を同じPRへ含める。

remote操作にはGitHub連携だけを使用する。`git push`、`gh` CLI、GitHub APIへの直接`curl`、credential作成・保存へfallbackしない。Connectorがlocalのblob、削除、mode、symlinkを含む最終treeを正確に表現できることと、remote headに想定外更新がないことを確認してからtask branchを作成または更新する。表現または検証ができなければremoteを変更せず停止する。

Draft Pull Request本文にSource Issue、タスクファイル、主な変更、検証結果、未実施項目、残るリスク、Agentレビュー、依存関係を記載する。要求全体の受入条件がこのPRで満たされる場合だけIssueをcloseするkeywordを使い、それ以外は参照に留める。設計PRは別branch / PRとし、`Refs #<number>`で参照してIssueをcloseしない。

PR作成後、URL、head、base、draft状態をタスクファイルへ記録するために必要な記録整理用commitも同じtask branchへ反映する。PRをmergeしない。

remoteがemptyでConnectorから安全なroot commitを作れない場合は、local initial commitとverificationまで完了し、remoteへfallback操作を行わない。local状態、Connectorの制約、ユーザーが行うbootstrap操作を報告して停止する。
