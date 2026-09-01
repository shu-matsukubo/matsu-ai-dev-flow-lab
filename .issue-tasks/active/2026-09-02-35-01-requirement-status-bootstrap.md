# Requirement Issueの初期ステータスを有効化

- 元Issue: `#35`
- 要求分析書: `requirements/35.md`
- Requirement Analysis PR: `#40`
- 設計PR: `#41`
- 状態: `active`
- タスクキー: `35-01`
- 優先度: `high`
- Agent構成: `parent-only`
- Issue branch: `issue/35`
- Issue統合PR: `#42`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/35-01`
- Task PR: 未作成
- Task PRのベースブランチ: `issue/35`
- 承認記録: 2026-09-02、本チャットで要求者がタスク計画を「承認」と明示し、Issue #35を`AI：作業可能`へ切り替えた

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

Requirement Issueの入口をGitHub上の設計と一致させ、新規Issueを`人間：要求承認待ち`から開始できる状態にする。

## 対象範囲

- 6種類のrepository labelの存在と完全一致の確認
- repositoryの既定branchを`develop`へ変更
- `.github/ISSUE_TEMPLATE/requirement.yml`への初期ラベル設定
- GitHub上の外部設定結果の確認と記録

## 作業内容

- 人間が作成した6種類のラベル名を確認する
- Requirement Issue Formへ`人間：要求承認待ち`を既定ラベルとして設定する
- repositoryの既定branchを`develop`へ切り替える
- Issueイベントを契機とする書き込みActionsを追加していないことを確認する
- GitHub上の設定とbranch上の設定を再取得して根拠を記録する

## 対象外

- AIの開始ゲート・承認引き渡しに関するAGENTS.mdとSkillの変更
- Issueイベントを契機とするAI自動起動
- QA用または工程別AIステータスラベル
- Frontend、Backend、API、認証、DBの変更
- 自動検証の追加

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #40 | hard | start | `develop`へmerge済み | merge済み |
| 設計PR #41 | hard | start | `develop`へmerge済み | merge commit `c3e4bc777423f8d14dca957c368c9f5d8815b0e0` |
| 6種類のrepository label | hard | complete | GitHub上で完全一致を確認できる | 要求者が作成済みと報告。Task内で再確認する |

## 懸念事項

- 既定branch変更はrepository外部状態であり、GitHub連携または承認済みブラウザ経路で安全に実行・確認できなければ人間操作が必要になる
- Issue Formの変更が`develop`へmergeされるまでは、新規Issueへの初期付与は有効にならない
- 外部状態を確認できない場合は成功扱いにしない

## 完了条件

- [ ] 6種類のラベルが表記どおり存在する
- [ ] repositoryの既定branchが`develop`である
- [ ] Requirement Issue Formが`人間：要求承認待ち`を既定ラベルとして指定する
- [ ] Issueイベント書き込みActionsやAI自動起動を追加していない
- [ ] 変更差分と外部状態の根拠をMainが確認する
- [ ] 共通品質ゲートとTask固有検証の結果を記録する

## 実装結果

- 変更内容: 未実施
- 残るリスク: 未確認

## ローカル検証

- 未実施

## CI

- 未確認

## Agent割り当て

- Main: 実装、外部設定、セルフレビュー、最終判断

## レビュー結果

- セルフレビュー: 未実施
- 独立レビュー: strategy対象外
- Mainレビュー: 未実施

## Flow Feedback参照

- 未確認

## Flow Feedback処理

対象外

## commit

- Task記録開始commit: 作成結果を確認後に記録
- 実装commit: 未作成

## Pull Request

- 未作成

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: `AC-01`、`AC-03`、`AC-06`、`AC-17`。根拠は実装・検証後に記録する
- 未対象または未充足の事項: AI開始ゲート、承認引き渡し、自動検証は後続Task
- 未実施項目: 実装、検証、GitHub外部状態確認
- 残るリスク: 未確認
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
