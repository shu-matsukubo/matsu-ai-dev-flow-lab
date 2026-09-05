# AI作業ガイド

人間が読む見出し、説明、判断記録は、技術上の正式名称や機械値を除き、自然な日本語で記載する。

## 正本

このリポジトリでは、次の情報を別の正本として扱う。

- 要求原文とIssue登録前の補足: GitHub Requirement Issue
- 要求分析: `requirements/<issue-id>.md`
- 現在有効な設計: `docs/`
- 実装の振る舞い: codeとautomated tests
- 着手済み作業の記録: `.issue-tasks/active/`と`.issue-tasks/completed/`
- AI開発フロー改善の観測: `.flow-feedback/`

過去のチャット、要約、ラベル、Agentの報告だけで工程や成果を推測せず、現在の要求、設計、実装、差分、検証結果、Pull Requestなどの永続情報を直接確認する。

## 作業原則

現在の人間指示と承認済みscopeを超えて変更しない。要求または設計上の人間判断が未確定なら、選択肢と影響を示して確認し、AIだけで確定しない。新しい要求、architecture判断、依存関係、運用概念が必要になった場合は、変更前に該当する承認境界へ戻す。

必要な手順は、その時点で利用可能なWorkflow、Skill、Referenceを確認して選択する。個別能力の名前や存在を固定的に仮定せず、`name`、`description`、適用条件、入力、出力、責務外を照合する。能力が存在しない、入力契約を満たせない、または安全に選べない場合は、無関係な文書を変更して補わず、未実施または不足として返す。

## 品質と提出

作業リスクに適したself review、独立review、verificationを選び、Mainが実成果物と根拠を確認する。共通品質ゲートは`sh scripts/verify.sh`とし、変更リスクに応じた追加検証も行う。失敗または未実施を成功扱いにせず、結果、根拠、未実施項目、残るリスクを示してから提出する。

提出前に対象repository、branch、base、head、変更内容、公開範囲、禁止事項を確認する。AI agentはPull Requestをmergeせず、branchを削除せず、Requirement Issueをcloseしない。これらの最終判断は人間だけが行う。

## 安全性

remote操作にはGitHub連携だけを使用する。`git push`、`gh` CLI、GitHub APIへの直接`curl`、credentialの作成・保存へ切り替えない。secret、credential、個人情報、実案件固有情報を成果物やログへ記録しない。

破壊的操作や回復が難しい操作は、正確な対象、承認scope、回復手段を確認する。不明確な対象を推測して削除、上書き、権限変更しない。
