---
name: submit-artifact
description: "確定済みの提出契約に従ってGitHubへ成果物を公開し、提出結果、remote確認、未完了境界を返す。"
---

# 提供能力

入力として確定済みのrepository、revision、head、base、公開形式、本文、安全条件に従い、GitHub上へ成果物を提出する。

## 適用条件

- 提出対象とrevisionが固定されている。
- repository、head、base、公開形式、title、body、Draft指定が入力で確定している。
- 必要なレビューと検証の結果、未実施、残るリスクが入力に含まれる。
- remote操作の権限と安全条件を満たす。

## 入力

- repository
- 提出対象のcommitまたはtreeと親revision
- head、base、成果物種別
- Pull Requestのtitle、body、Draft指定
- remote更新の期待する現在値
- 提出形式と安全基準
- review結果、verification結果、未実施、残るリスク

## 出力

- 実行したremote操作と対象
- 公開されたrevision
- headとbase
- Pull Request番号、URL、Draft状態
- remoteから再取得した確認結果
- 部分成功時の完了済み操作と未完了操作
- 失敗、未実施、remaining risk
- merge、branch削除、Issue完了判断が未完了であること

## 責務外

- 提出対象、成果物種別、head、base、公開時期の選択
- 成果物またはPull Request本文の要求内容の決定
- 実装、レビュー、検証
- Task記録または工程状態の更新
- Pull Requestのmerge、branch削除、Issue close
- 別能力の呼び出しまたは作業順序の決定

## 能力固有の処理

入力のrepository、revision、head、base、期待するremote現在値を照合する。GitHub連携だけを使用し、直接のpush、CLI、HTTP呼び出しへ切り替えない。作成または更新したrefとPull Requestをremoteから再取得し、入力どおりか確認する。

既存refを更新する場合はfast-forwardと期待revisionを確認し、明示的な入力なしに強制更新しない。自動close keywordを含まない参照、受入条件の根拠、検証結果、未完了境界が入力本文にあることを確認する。

## 失敗・未実施・残るリスク

権限不足、競合、remote状態の不一致、部分成功は操作ごとに分けて返す。別経路へfallbackせず、再開に必要な現在値を示す。提出成功はmerge、branch削除、Issue closeまたは要求全体の完了を意味しない。
