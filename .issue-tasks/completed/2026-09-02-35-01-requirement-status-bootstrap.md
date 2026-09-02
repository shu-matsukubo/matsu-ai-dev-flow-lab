# Requirement Issueの初期ステータス設定を準備する

- 元Issue: `#35`
- 要求分析書: `requirements/35.md`
- Requirement Analysis PR: `#40`
- 設計PR: `#41`、`#45`
- 状態: `completed`
- タスクキー: `35-01`
- 優先度: `high`
- Agent構成: `parent-only`
- Issue branch: `issue/35`
- Issue統合PR: `#42`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/35-01`
- Task PR: `#44`
- Task PRのベースブランチ: `issue/35`
- 承認記録: 2026-09-02、設計PR #45 merge後に再提示した修正版タスク計画を要求者が本チャットで「承認」と明示し、Issue #35を`AI：作業可能`へ切り替えた

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

repositoryの既定branchを`main`に維持したまま、Requirement Issue Formと事前作成済みラベルを、将来の`main`反映後に新規Issueを`人間：要求承認待ち`から開始できる設定へ整える。

## 対象範囲

- 指定された6種類のrepository labelの存在確認
- repositoryの既定branchが`main`であることの確認
- `.github/ISSUE_TEMPLATE/requirement.yml`への初期ラベル設定
- 設計PR #45に合わせたTask記録とDraft Task PR #44の修正
- GitHub上の外部設定結果と、後続の外部動作確認条件の記録

## 作業内容

- 要求者が作成した6種類のラベル名を確認する
- Requirement Issue Formへ`人間：要求承認待ち`を既定ラベルとして設定する
- repositoryの既定branchを`main`のまま維持し、`develop`へ変更しない
- Issue branchとIssue統合PRが最新`develop`を起点・baseとしていることを確認する
- Issueイベントを契機とする書き込みActionsやAI自動起動を追加していないことを確認する
- Issue Formが既定branch上で有効になるため、`develop`から`main`への人間管理の反映後に外部動作を確認する条件を残す

## 対象外

- repositoryの既定branchを`develop`へ変更すること
- `develop`から`main`への反映と、反映後のIssue Form実動作確認
- AIの開始ゲート・承認引き渡しに関する`AGENTS.md`とSkillの変更
- Issueイベントを契機とするAI自動起動
- QA用または工程別AIステータスラベル
- Frontend、Backend、API、認証、DBの変更
- 自動検証の追加

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #40 | hard | start | `develop`へmerge済み | merge済み |
| 設計PR #41 | hard | start | `develop`へmerge済み | merge commit `c3e4bc777423f8d14dca957c368c9f5d8815b0e0` |
| 修正設計PR #45 | hard | start | `develop`へmerge済み | merge commit `0e1604e397b942e9880c7880e95b79db9fd943f5` |
| 6種類のrepository label | hard | complete | 表記どおり利用可能 | 要求者が6件作成済みと報告。Issue #35の実遷移で複数の対象ラベルが利用可能であることを確認 |
| `main`反映後のIssue Form外部動作 | ordering | issue acceptance | 新規Requirement Issueへ初期ラベルが付与される | 本TaskとIssue統合PRが`develop`へ取り込まれ、人間管理で`main`へ反映された後に確認する |

## 懸念事項

- GitHub連携にはrepository label一覧取得APIがなく、Browser接続もworkspace runner障害で起動できないため、全6件の機械一覧確認は未実施である
- ラベル存在の根拠には、要求者の作成済み報告とIssue #35で確認済みの実遷移を使用する
- Issue Formは既定branch `main`へ反映されるまでGitHub UIで利用されないため、AC-03の外部動作はIssue全体の後続受入確認まで未充足として扱う
- 外部動作を未確認のままAC-03を完全充足扱いにしない

## 完了条件

- [x] 6種類のラベルが表記どおり作成済みであることを要求者報告で確認する
- [x] repositoryの既定branchが`main`である
- [x] Requirement Issue Formが`人間：要求承認待ち`を既定ラベルとして指定する
- [x] Issue branchが最新`develop`を取り込み、Issue統合PRのbaseが`develop`である
- [x] Issueイベント書き込みActionsやAI自動起動を追加していない
- [x] 設計PR #45に合わせてTaskの範囲、未対象、外部動作確認時点を修正する
- [x] 更新後headの共通品質ゲートとTask固有検証の結果を記録する
- [x] Mainのセルフレビューと最終判断を完了する

## 実装結果

- 変更内容: `.github/ISSUE_TEMPLATE/requirement.yml`のtop-level `labels`へ`人間：要求承認待ち`を追加した。設計PR #45に従い、repositoryの既定branchは`main`のまま維持し、`develop`への変更は行わない
- branch同期: `issue/35`へ最新`develop`の設計修正commit `0e1604e397b942e9880c7880e95b79db9fd943f5`をmerge commit `0860271c398befd65febb261dae83ac36dbe6663`で取り込んだ。Issue統合PR #42はbase `develop`、head `issue/35`、behind 0、mergeableである
- remote差分: Issue Form 1行追加、Task記録、Flow Feedback 1件だけ。workflow変更なし
- 外部状態: repositoryの既定branchは`main`
- ラベル確認: 要求者が6件作成済みと明示。Issue #35では`AI：作業可能`、`人間：基本設計承認待ち`、`人間：タスク承認待ち`の実遷移を確認済み。全6件の機械一覧取得は未実施
- 残るリスク: Issue Formが`develop`とその後の`main`へ反映されるまで、新規Issueへの初期付与は有効にならない。反映後の外部動作確認までAC-03は完全充足扱いにしない

## ローカル検証

- `sh scripts/verify.sh`: 未実施。local workspaceは別Issueのbranchを保持しており、sandbox内のworkspace command runnerも`helper_unknown_error: setup refresh had errors`で起動しないため、共有workspaceを切り替えていない。成功扱いにしない
- GitHub remote file再取得: 成功。Issue Formの`labels: ["人間：要求承認待ち"]`を確認
- repository metadata再取得: 成功。既定branchが`main`であることを確認
- `develop...issue/35`比較: 成功。Issue branchはbehind 0で、設計修正を取り込み済み
- GitHub公式Issue Form仕様照合: 既存確認を再利用。top-level `labels`は自動付与用の配列であり、既定branch上で有効になる

## CI

- 既存実装headのGitHub Actions CI run [#87](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33570088149): `verify` jobと`品質検証` stepが`success`
- 設計修正後の実装・記録head `52a6fdeb1649d24393c05de02c4eb2e7eec0c6ad` のGitHub Actions CI run [#93](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33638781493): `verify` jobと`品質検証` stepが`success`

## Agent割り当て

- Main: 設計修正の反映、Issue branch同期、Task記録・PR metadata更新、外部状態確認、セルフレビュー、最終判断

## レビュー結果

- セルフレビュー: Issue Formのtop-level位置と完全一致ラベル名、既定branch `main`、Issue branchとPR base、対象外workflow変更の不在、設計PR #45との整合を確認し、P0〜P3の指摘なし
- 独立レビュー: `parent-only`のため対象外
- Mainレビュー: Issue、要求分析書、設計PR #41・#45、最新設計、Task記録、PR #42・#44、`issue/35...task/35-01`の実差分、repository metadata、CI run #93を直接照合した。差分はIssue Form 1行、Task記録、既存Flow Feedback 1件だけで、PR #44はbase `issue/35`、head `task/35-01`、Draft、mergeable。AC-03の外部動作を未充足として明記しており、Issue branchへ安全に取り込めると判断

## Flow Feedback参照

- `.flow-feedback/pending/i35-t01-f01.md`

## Flow Feedback処理

対象外

## commit

- Task記録開始commit: `d3e88d67bcb030c9030e88c03f7e05f6d2232436`
- Issue Form実装commit: `a3b065b7a9060299123033e1d24e8dc32eb916f7`
- Flow Feedback記録commit: `6b9980b831c0f1aef90b7ebe40f06c87bc767bb7`
- 設計修正後のTask記録更新commit: `52a6fdeb1649d24393c05de02c4eb2e7eec0c6ad`

## Pull Request

- Draft Task PR: [#44](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/44)
- base: `issue/35`
- head: `task/35-01`
- Draft: `true`
- merge: AI agentは実施しない

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: `AC-01`、`AC-03`、`AC-06`、`AC-17`。Issue Form設定、事前作成ラベル、既定branch `main`の確認、対象外自動化がないことにより寄与する。AC-03の実動作は`main`反映後のIssue全体の受入確認まで未充足
- 未対象または未充足の事項: AI開始ゲート、承認引き渡し、自動検証、`develop`から`main`への反映、反映後のIssue Form実動作
- 未実施項目: 全6ラベルの機械一覧取得、local runner上の共通品質ゲート、`main`反映後の外部動作確認
- 残るリスク: Issue Formの有効化とAC-03の完全充足は、Issue統合後の`main`反映および外部動作確認に依存する
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-09-02
