---
name: publish-task-pr
description: Review・verification済みTaskを、禁止されたpushやCLIへfallbackせずGitHub連携だけでtask branchへ公開し、develop向けDraft Pull Requestを作成する。
---

# Pull Request Publication

Task file、承認scope、必須review、verification、local commit、branch、base、`git status`、baseからのdiff、secret混入がないことを確認する。通常は `codex/<task-name>` から `develop` への1 Task = 1 Draft Pull Requestとし、Task fileと実装を同じPRへ含める。

remote操作にはGitHub連携だけを使用する。`git push`、`gh` CLI、GitHub APIへの直接`curl`、credential作成・保存へfallbackしない。Connectorがlocalのblob、削除、mode、symlinkを含む最終treeを正確に表現できることと、remote headに想定外更新がないことを確認してからtask branchを作成または更新する。表現または検証ができなければremoteを変更せず停止する。

Draft Pull Request本文にSource Issue、Task file、主な変更、検証結果、未実施項目、残るrisk、agent review、dependencyを記載する。Requirement全体のAcceptance CriteriaがこのPRで満たされる場合だけIssueをcloseするkeywordを使い、それ以外は参照に留める。Design PRは別branch / PRとし、`Refs #<number>`で参照してIssueをcloseしない。

PR作成後、URL、head、base、draft状態をTask fileへ記録するために必要なbookkeeping commitも同じtask branchへ反映する。PRをmergeしない。

remoteがemptyでConnectorから安全なroot commitを作れない場合は、local initial commitとverificationまで完了し、remoteへfallback操作を行わない。local状態、Connectorの制約、ユーザーが行うbootstrap操作を報告して停止する。
