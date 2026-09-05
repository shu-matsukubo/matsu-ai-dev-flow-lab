# 成果物提出形式

## 目的

GitHubへ成果物を提出するときのbranch、Pull Request、本文、検証証拠、未完了境界の共通形式を一意に定める。

## 適用対象

Requirement Analysis PR、設計PR、Task PR、Issue統合PRなど、Workflowが提出対象、base、head、公開形式を確定した成果物に適用する。

## 判断基準

通常の実装は次の二階層で追跡する。

| 単位 | branch | Pull Requestのbase | 品質上の境界 |
|---|---|---|---|
| Requirement Issue | `issue/<issue-id>` | `develop` | 全Task、最新`develop`との統合、全受入条件 |
| Task | `task/<issue-id>-<task-id>` | 対応するIssue branch | 単一Taskのscope、完了条件、検証 |

要求分析と設計は実装から分離した専用branchとPRを用いる。具体的なbranch名とbaseはWorkflowが確定した入力を正本とする。

Pull Request本文には必要に応じて次を含める。

- `Refs #<number>`など、Requirement Issueを自動closeしない参照
- 元Issue、要求分析書、設計判断記録、関連PR・Task記録
- 変更範囲と対象外
- 寄与する受入条件ごとの根拠
- review結果とfindingの扱い
- verification結果、未実施項目、remaining risk
- 人間だけが行うmerge、branch削除、Issue完了判断という未完了境界

`Closes`、`Fixes`、`Resolves`およびGitHubが同等に扱う自動close keywordは使用しない。Task PRと設計PRは担当範囲が寄与する受入条件を示し、Issue統合PRは全受入条件を一件ずつ示す。Draftは進行中または人間確認前の状態を明示するために用いる。

提出結果として、repository、headとbase、revision、PR番号とURL、Draft状態、remoteで再取得した確認結果を識別できること。remote更新が部分的に成功した場合は成功した操作と未完了操作を分ける。

## 対象外

このReferenceはbranch、commit、Pull Requestを作成または更新せず、提出時期、成果物種別、base、headを選ばず、merge、branch削除、Issue closeを実行しない。

## 設計上の根拠

[Issue #52 設計判断記録](../../design-decisions/52.md) と[テスト戦略](../../quality/testing.md)に基づく。
