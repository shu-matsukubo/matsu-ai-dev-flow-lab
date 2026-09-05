# 4状態の承認契約を一括移行する

- 元Issue: `#49`
- 要求分析書: `requirements/49.md`
- Requirement Analysis PR: `#54`（merge済み）
- 設計PR: `#55`（merge済み）
- 状態: `completed`
- タスクキー: `49-01 approval-contract-migration`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/49`
- Issue統合PR: `#56`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/49-approval-contract-migration`
- Task PR: 未作成
- Task PRのベースブランチ: `issue/49`
- 承認記録: 2026-09-05、このチャットで要求者がタスク計画を「承認」と回答

要求や設計全文は複製せず、元Issue、merge済み要求分析書、`docs/design-decisions/49.md`と現在の`docs/`を参照する。このファイルは着手済み作業の実施記録である。

## 目的

要求分析と基本設計を、人間判断が必要な場合だけ同じチャットで質問し、回答後は同じ事項への再承認なしで完成PRまで継続できる4状態の承認契約へ、安全に一括移行する。

## 対象範囲

- `docs/ai-development/overview.md`
- `AGENTS.md`
- 状態判定、工程継続、PR引き渡しに関係する`.agents/skills/*/SKILL.md`
- `.github/ISSUE_TEMPLATE/requirement.yml`の初期状態契約
- `tests/requirement-status-contract.test.mjs`
- GitHub上の新ラベル、後続作業を行うopen Issue、廃止対象ラベルの移行確認
- このTask記録、Task PR、Issue統合PRからの追跡

## 作業内容

- 有効ステータスを`人間：要求承認待ち`、`AI：作業可能`、`人間：PR確認待ち`、`人間：タスク承認待ち`の4種類へ統一する。
- 要求分析と基本設計で、人間判断が必要な場合だけ進行中のチャットで質問し、回答済み事項を再承認させず成果物PRの作成まで継続する規則へ更新する。
- 設計変更なしの場合も設計判断記録と設計PRを完成成果物とし、Issueコメントだけで基本設計を完了する経路を廃止する。
- Task計画以降の二階層PR、レビュー、検証、人間だけが行うmergeとIssue closeの境界を維持する。
- 歴史的正本`requirements/35.md`を書き換えず、現在契約のテスト根拠をIssue #49のmerge済み設計へ切り替える。
- 質問なし・質問ありの要求分析と基本設計の4経路、回答済み事項の再承認禁止、4状態、旧ラベル検出、安全停止、PR引き渡しを自動検証する。
- 新ラベルの実在、open Issueの移行、廃止対象ラベルの利用状況を外部状態として確認する。

## 対象外

- Frontend、Backend、API、authentication、session、DB、application persistenceの変更
- Issue #52で扱うSkillと`AGENTS.md`の疎結合化
- Task計画以降の責務境界、二階層PR、品質ゲートの全面再設計
- GitHub ActionsによるIssue自動起動、PR自動merge、Issue自動close
- 既存Flow Feedbackの評価、更新、移動

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #54 | hard | start | 人間によるmerge | merge済み、merge commit `866b8cbeac62ba5a04b27f9a358974718bd98c19` |
| 設計PR #55 | hard | start | 人間によるmerge | merge済み、最新`develop` `fef605a414d3c858e28341fb81cba6f204330a94` |
| Issue統合PR #56 | ordering | publish | Draftで追跡可能 | `issue/49`から`develop`向けに作成済み |
| `人間：PR確認待ち` repository label | hard | complete | labelが実在し移行先として利用可能 | 2026-09-05に要求者が手動作成と旧3ラベル削除の完了を回答。GitHub連携はrepository label一覧を取得できないため、人間確認を外部移行根拠とし、Issue統合PRの引き渡し更新でも利用可能性を再確認する |
| open Requirement Issue | hard | complete | 新契約の有効状態1種類へ移行し、旧状態競合がない | #49と#52を再取得し、いずれもopenかつ`AI：作業可能`の1種類だけであることを確認 |

## 懸念事項

- 文書、Agent指示、Skill、契約テスト、GitHub外部状態を別々に切り替えると、一時的に開始ゲートまたは引き渡し先が矛盾する。
- `requirements/35.md`は6状態契約を定めた過去要求の正本であり、現在契約へ合わせて改変してはならない。
- 新ラベルを用意する前に新契約を有効化すると、完成PRを引き渡せない。
- 旧ラベル削除前にopen Issueの利用状況を確認し、AIが移行によって自己付与で作業権を取得しないようにする。
- Requirement Issue Formは既定branch `main`の内容が外部動作の正本になるため、`develop`だけの確認を有効化完了と扱わない。

## 完了条件

- [x] AC-01〜AC-04: 質問なし・質問ありの要求分析と基本設計が、同一チャットで完成PRまで継続する契約と検証を持つ。
- [x] AC-05〜AC-07: 中間承認と二重承認が現在有効な規則から除かれ、成果物PRが最終確認点である。
- [x] AC-08: Task計画以降の既存フロー、責務境界、品質ゲート、二階層PRへ接続できる。
- [x] AC-09〜AC-10: 4状態と各責務が一意で、文書、Agent指示、Skill、状態遷移、関連テンプレートに矛盾がない。
- [x] AC-11: 4経路、回答済み事項の再承認禁止、安全停止、状態遷移を自動または再現可能な検証で確認する。
- [ ] AC-12: `sh scripts/verify.sh`、Task固有検証、Task PRとIssue統合PRのCIが成功し、未実施項目と残るリスクを記録する。
- [x] 変更したSkillのMarkdown構造検証が成功する。
- [x] 新ラベルとopen Issueの移行状態を確認する。新ラベル作成と旧3ラベル削除は要求者の完了回答、open IssueはGitHub連携による再取得を根拠とする。
- [x] Workerセルフレビュー、独立Reviewer、Main最終レビューを完了する。

## 実装結果

- 変更内容: 有効ステータスを4種類へ統一し、要求分析・基本設計の質問有無4経路、回答後の再承認禁止、設計判断記録と設計PRへの統一、8 Skillの開始ゲートと旧3ラベル残存時の安全停止、Mainの安全なPR確認待ち引き渡しを文書・Agent指示・Skill・契約テストへ反映した。
- 対象外確認: application code、API、authentication、session、DB、Issue #52の疎結合化、履歴的正本`requirements/35.md`・`requirements/49.md`・`docs/design-decisions/49.md`は変更していない。
- 残るリスク: GitHub連携ではrepository label一覧を直接取得できないため、作成・削除の根拠は要求者の完了回答である。Issue統合PRの最終引き渡し時に`人間：PR確認待ち`への更新と再取得で利用可能性を再確認する。

## ローカル検証

- `node --test tests/requirement-status-contract.test.mjs`: 成功、13/13。
- `sh scripts/verify.sh`: 成功。Docker環境でlint、typecheck、契約テスト、API・Frontテスト、buildがすべて成功。
- `quick_validate.py`: 変更した8 Skillすべて成功。Windows Python 3.14をUTF-8 modeで実行し、validator依存のPyYAMLは一時ディレクトリだけに導入した。
- `git diff --check`: 成功。GitのLF/CRLF変換予告のみで差分エラーなし。
- GitHub open Issue再取得: #49、#52はいずれもopenで`AI：作業可能`の1種類だけ。旧3ラベルの競合なし。
- GitHub repository label移行: 2026-09-05に要求者が`人間：PR確認待ち`作成と旧3ラベル削除の完了を回答。GitHub連携はlabel一覧取得を提供しないため、人間確認を記録した。

## CI

- Task PR未作成のため未実施。Task PR公開後に確認する。

## Agent割り当て

- Worker: 承認契約の文書、Agent指示、Skill、契約テストを実装し、Task固有検証とセルフレビューを行う。
- 独立Reviewer: 開始ゲートの安全性、旧新ラベルの移行境界、歴史的要求の非改変、4経路と再承認防止の検証を独立確認する。
- Main: 最新Issue、正本、実差分、検証、外部状態を直接確認し、最終判断と公開を行う。

## レビュー結果

- セルフレビュー: Workerが対象範囲、4経路、旧経路除去、8 Skill、安全停止、履歴正本非変更を確認。契約テストと共通検証に成功。
- 独立レビュー: 初回P1 2件・P2 2件、再レビューP2 1件を修正。最終再レビューでP1/P2なし、AC-01〜AC-11を承認可能と判定。
- Mainレビュー: 実差分、旧経路横断検索、履歴正本非変更、責務境界を確認。独立Reviewerの全指摘解消後、契約テスト、共通検証、Skill構造検証を直接再実行して成功。

## Flow Feedback参照

- `.flow-feedback/pending/i49-t49-01-f01.md`: 通常runnerのsetup refresh errorとfallback不足。
- `.flow-feedback/pending/i49-t49-01-f02.md`: 初回契約テストが一部Skillと引き渡し安全責務の回帰を検出できなかった。

## Flow Feedback処理

- 対象外

## commit

- 未作成

## Pull Request

- Issue統合Draft PR: #56
- Task PR: 未作成

## 完了報告

- このTaskが寄与する要求分析書の受入条件ID: `AC-01`〜`AC-12`
- 根拠: AC-01〜AC-11は文書・Agent指示・8 Skill・13件の契約テスト、独立レビュー、Main検証で充足。AC-12のローカル共通品質ゲートは成功。
- 未対象または未充足の事項: AC-12のTask PR CIと、Task PR merge後に行うIssue統合PRの統合・回帰検証およびCIは未完了。
- 未実施項目: Task PR作成とCI確認。Issue統合PRの検証・CI・全受入条件確認はTask PRの人間merge後に行う。
- 残るリスク: GitHub連携からrepository label一覧を直接取得できない。Issue統合PRの最終引き渡し時に`人間：PR確認待ち`への更新と再取得を行い、目的の1状態だけになることを確認する。
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-09-05（ローカル実装・レビュー・検証・外部ラベル移行確認を完了。Task PRの追跡情報とCI結果は公開後に追記する）
