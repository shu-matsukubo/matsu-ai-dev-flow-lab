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
- Task PR: `#44`
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
- [x] Requirement Issue Formが`人間：要求承認待ち`を既定ラベルとして指定する
- [x] Issueイベント書き込みActionsやAI自動起動を追加していない
- [ ] 変更差分と外部状態の根拠をMainが確認する
- [x] 共通品質ゲートとTask固有検証の結果を記録する

## 実装結果

- 変更内容: `.github/ISSUE_TEMPLATE/requirement.yml`のtop-level `labels`へ`人間：要求承認待ち`を追加した。GitHub公式仕様で`labels`が自動付与用の配列であり、既存ラベルだけが付与されることを確認した
- remote差分: Issue Form 1行追加、Task記録、Flow Feedback 1件だけ。workflow変更なし
- 外部状態: repositoryの既定branchは現在`main`。`develop`への変更は要求者へ依頼済み
- ラベル確認: 要求者が6件作成済みと明示。Issue #35で`AI：作業可能`と`人間：タスク承認待ち`が利用可能であることは実遷移で確認済み。全6件の機械一覧取得は未実施
- 残るリスク: 既定branch変更と6ラベルの完全な機械確認が完了するまでTaskを完了扱いにできない

## ローカル検証

- `sh scripts/verify.sh`: 未実施。workspace command runnerが`windows sandbox failed: helper_unknown_error: setup refresh had errors`で起動せず、成功扱いにしていない
- GitHub remote file再取得: 成功。Issue Formの`labels: ["人間：要求承認待ち"]`を確認
- `issue/35...task/35-01`比較: 成功。Issue Form 1file・1行の実装変更とTask記録・Flow Feedbackだけを確認
- GitHub公式Issue Form仕様照合: 成功。top-level `labels`は自動付与用の配列で、存在しないラベルは付与されない仕様

## CI

- GitHub Actions CI run [#86](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33569977860): `verify` jobと`品質検証` stepが`success`
- 実行対象head: `644d94e155549333f6e167f89f3dd60f2c53cdfc`

## Agent割り当て

- Main: 実装、外部設定、セルフレビュー、最終判断

## レビュー結果

- セルフレビュー: Issue Formのtop-level位置、完全一致ラベル名、対象外workflow変更がないことを確認。コード差分に指摘なし。外部設定は未完了
- 独立レビュー: strategy対象外
- Mainレビュー: remote差分と公式仕様を直接確認。Draft PR #44がbase `issue/35`、head `task/35-01`であることとCI run #86 successを確認。既定branch変更・全6ラベル確認待ちのため最終合格は保留

## Flow Feedback参照

- `.flow-feedback/pending/i35-t01-f01.md`

## Flow Feedback処理

対象外

## commit

- Task記録開始commit: `d3e88d67bcb030c9030e88c03f7e05f6d2232436`
- Issue Form実装commit: `a3b065b7a9060299123033e1d24e8dc32eb916f7`
- Flow Feedback記録commit: `6b9980b831c0f1aef90b7ebe40f06c87bc767bb7`
- 記録更新commit: GitHub連携による記録更新commit群（Draft PR #44公開済み、mergeは未実施）

## Pull Request

- 外部設定完了待ちDraft Task PR: [#44](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/44)
- base: `issue/35`
- head: `task/35-01`
- Draft: `true`
- merge: AI agentは実施しない

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: `AC-01`、`AC-03`、`AC-06`、`AC-17`。根拠は実装・検証後に記録する
- 未対象または未充足の事項: AI開始ゲート、承認引き渡し、自動検証は後続Task
- 未実施項目: repository既定branchの`develop`への変更、全6ラベルの機械確認、ローカルrunner上の共通品質ゲート。GitHub Actions上の共通品質ゲートは成功済み
- 残るリスク: Issue Formが`develop`へmergeされ既定branchが切り替わるまで新規Issueへの初期付与は有効にならない
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
