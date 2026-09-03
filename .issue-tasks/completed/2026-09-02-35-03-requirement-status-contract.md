# ステータスラベルフローの契約検証を追加する

- 元Issue: `#35`
- 要求分析書: `requirements/35.md`
- Requirement Analysis PR: `#40`
- 設計PR: `#41`（初版）、`#45`（修正版・最新）
- 状態: `completed`
- タスクキー: `35-03`
- 優先度: `high`
- Agent構成: `worker-parent-review`
- Issue branch: `issue/35`
- Issue統合PR: `#42`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/35-03`
- Task PR: `#48`
- Task PRのベースブランチ: `issue/35`
- 承認記録: 2026-09-02、要求者が設計PR #45後の修正版タスク計画を承認し、Task PR #43・#44をmerge後、本チャットで「マージしたので続けてください」と指示した

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

Requirement Issueのステータスラベル、Issue Form、AI開始ゲート、安全停止、人間への引き渡し、branch責務について、repository内の設定・作業ガイド・Skill間の契約不整合を共通テスト入口で検出できるようにする。

## 対象範囲

- Node.js標準機能によるrepository内の静的契約テスト
- rootの既存`npm test`から契約テストを実行する設定
- Requirement Issue Form、`AGENTS.md`、関連8 Skill、AI開発フロー設計の相互整合確認
- Task記録とDraft Task PR

## 作業内容

- 指定された6種類のステータスラベル名が設計上の一覧と一致することを確認する
- Requirement Issue Formの初期ラベルが`人間：要求承認待ち`であることを確認する
- repository既定branch `main`と、作業開始点・Issue統合base `develop`の責務を確認する
- `AI：作業可能`だけかつ現在のチャット指示がある場合の開始条件を確認する
- 人間承認待ち、未付与、複数競合、永続情報不整合で停止する規則を確認する
- 各工程の引き渡し先、以前のステータスを残さない更新、非ステータスラベル保持、再取得確認を検証する
- IssueイベントによるAI自動起動、PR自動merge、Issue自動closeを追加していないことを確認する
- 共通品質ゲートと変更リスクに応じた契約テスト結果を記録する

## 対象外

- GitHub上のラベル作成・変更
- `develop`から`main`への反映
- `main`反映後のIssue Form実動作確認
- GitHub上の全6ラベル一覧取得
- AIの自動実行、PRの自動merge、Issueの自動close
- 新しい依存関係、GitHub Actions workflow、Frontend、Backend、API、認証、DBの変更
- 既存Flow Feedbackの評価・更新・移動

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #40 | hard | start | `develop`へmerge済み | merge commit `b395f9764b8eb64ec2db3fd0103b340ace5fb507` |
| 設計PR #41・#45 | hard | start | `develop`へmerge済み | 最新設計は#45、merge commit `0e1604e397b942e9880c7880e95b79db9fd943f5` |
| Task PR #44（35-01） | hard | start | `issue/35`へmerge済み | merge commit `b0cdd2326346a0c2379a871eee9fbc35f4d12c7f` |
| Task PR #43（35-02） | hard | start | `issue/35`へmerge済み | merge commit `38a80d530600039e3a8c3e32c17479df109fac79` |
| Issue #35開始ゲート | hard | start | `AI：作業可能`だけかつ現在のチャット指示あり | 2026-09-03にGitHubから再取得し、openかつ`AI：作業可能`単独を確認 |

## 懸念事項

- 文書の自然な言い換えへ過度に依存する脆い検証を避け、重要な機械値と責務境界に絞る
- repository外部のラベル一覧、既定branch、Issue Form実動作は静的テストだけでは保証できない
- local command runner障害が継続する場合、ローカル共通品質ゲートを成功扱いにしない
- Task 35-01・35-02の実装fileを承認範囲外で修正しない

## 完了条件

- [x] 追加依存なしで契約テストが実装される
- [x] rootの`npm test`から契約テストと既存workspace testが実行される
- [x] 6ラベル、Issue Form初期値、branch責務の静的契約を確認できる
- [x] AI開始条件、安全停止、工程復元、引き渡し、Main単独責務の静的契約を確認できる
- [x] Issueイベントによる自動実行、PR自動merge、Issue自動closeを追加していないことを確認できる
- [x] WorkerのセルフレビューとMainの直接レビューが完了する
- [x] 共通品質ゲートとTask固有検証の成功・失敗・未実施・残るリスクが記録される
- [x] Task記録を`.issue-tasks/completed/`へ移し、`issue/35`向けDraft Task PRを作成する

## 実装結果

- 変更内容: `tests/requirement-status-contract.test.mjs`にNode.js標準の静的契約テストを追加し、rootの`npm test`から契約テストとworkspace testを順に実行するよう`package.json`を更新した
- 残るリスク: local runner上のDocker品質ゲートとGitHub外部状態は未確認。GitHub Actions上のDocker共通品質ゲートは成功済み

## ローカル検証

- `sh scripts/verify.sh`: 未実施。local command runnerが`helper_unknown_error: setup refresh had errors`で起動できず、local checkoutもTask branchではないため、Task差分の共通品質ゲート成功とは扱わない
- 代替確認: GitHub上のremote sourceを再取得し、V8によるテストファイルのcompile相当確認に成功。要求・設計・Issue Form・`AGENTS.md`・8 Skillへ主要assert相当を適用し、workflow predicateのsafe/unsafe疑似ケース、現行workflow、base差分を照合した
- 残る検証: Draft Task PR上のGitHub Actionsで`sh scripts/verify.sh`と全expectationを実行する

## CI

- GitHub Actions CI run [#101](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33720914822)、head `e1c75fffb282d92fa3b53bb39692034cd92ab863`: `verify` jobの`品質検証` stepがfailure。ESLintの`no-regex-spaces`と`no-useless-escape`の2件を修正した
- GitHub Actions CI run [#103](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33721053341)、head `dfa9f5ecd98e8bbea9b4d5847f1473e68d38089a`: lint・typecheck成功後、契約テスト8件中1件がfailure。単一行のquoted block eventをinline扱いしていた分岐を修正した
- GitHub Actions CI run [#106](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/33721231160)、head `512c5695289cc3739e72027a691df8ccef11134f`: `verify` jobと`品質検証` stepがsuccess。契約テスト8/8、API・Frontend workspace test各2/2、lint、typecheck、build、共通入口の検証が成功

## Agent割り当て

- Worker: 実装、セルフレビュー、GitHub連携による差分確認
- Main: Task記録、統合調整、直接レビュー、最終判断、Draft PR公開を担当

## レビュー結果

- セルフレビュー: Main指摘（P1-1〜P1-5、P2）を確認し、regexの単一escape、明示test path、要求分析書と設計表の行単位6ラベル比較、正本に限定したbranch責務、Skill責務別の開始・停止確認、workflow全file確認、工程別引き渡しmappingを修正・照合した。再取得したsourceのregexは各escapeがU+005C 1個で、backslash+実改行はないことを確認した
- 独立レビュー: `worker-parent-review`のため対象外
- Mainレビュー: 要求充足、正しさ、回帰、責務境界、安全性、検証不足の順に再確認した。指摘したP1/P2はすべて修正済み。V8 compile相当、全主要assert相当、workflowのsafe/unsafe疑似ケース、現行workflow、`issue/35`との差分3file限定・behind 0を再照合し、P0〜P3の残存指摘なし

## Flow Feedback参照

- 新規観測がある場合だけMainが記録する

## Flow Feedback処理

対象外

## commit

- Task branch開始点: `38a80d530600039e3a8c3e32c17479df109fac79`
- Task記録開始commit: `5628eb4ae73090a020d38689a535ce5ba97757eb`
- 実装commit: `da4772d556ddf3028b23ce877217753ac414299d`（テスト追加）、`e65640bb75b089ea06fc08dbb9f57be4e1fb14e9`（root test連携）、`a5a05b50f30c14acc8334d6bfb554c31ca187717`（ラベル抽出範囲の修正）、`01c6759278321727c911981ac9271e2351b3e312`（Main指摘に対応する契約テスト再実装）、`807b8d7f5cfa2e82d5b58b840c37079e14832953`（root test path明示）、`bf3e051be383d1ef1661f99729486fd5bad91345`（単一escape化・ラベル捕捉修正）、`3dc59c9bb319e1e8777418e41c5c722cc7ea56c3`（設計表の行単位捕捉）、`41b5b21696eb8e65183d899eba65c8217ff90b87`（Main再レビュー指摘への責務別・workflow限定修正）、`aa25c42dc30c14f50259b4549b416721a00daa23`（overview/AGENTS分離・onブロック検査）、`b7afbaaad4fde8b650ffc1e3ba1097fdc7e86378`（workflow regexの単一escape修正）、`3b8fa5fe2ccd21abe61e9b4f74ef5f0505a18f10`（onブロックhelperと回帰テスト追加）、`0750fdf790b111904c57ce6d3f08b837a179475c`（helper escape修正）、`061469549b61d56fa2f3626a8fe28eb574b25971`（workflow testへhelper適用）、`3d82b5c79b6acf483ea7d76ee697e93195af9a1c`（Issue event predicateと複数形式の回帰検証）、`2a6350a7afdf8c78c45ea29445ff509a8b578566`（on直下判定・nested値回帰検証）、`44bf0f543763c000864dbb3c7f2cc691c05168dd`（inline配列・flow mappingのイベント判定）、`db84becf56867a660e32b9c39ac4d5a89e079a72`（single block key判定と回帰test）、`c2c44c9461a607d807b960f3b3650779ed54a88d`（backport責務の同値表現対応）、`3e9e15fafe9b8c9f957cbb8920203d21e474bdd3`（CI lint修正）

## Pull Request

- Draft Task PR: [#48](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/48)
- base: `issue/35`
- head: `task/35-03`
- Draft: `true`
- 作成時head: `e85f47eee4d016698a4d1dc6c56770779d96a58e`
- 完了記録移動前の検証済みhead: `512c5695289cc3739e72027a691df8ccef11134f`
- merge: AI agentは実施しない

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: `AC-01`〜`AC-18`の静的契約と、特に`AC-18`の追加検証へ寄与する
- 未対象または未充足の事項: GitHub外部状態、`main`反映後のIssue Form実動作、Issue全体の最終受入判定
- 未実施項目: local runner上の`sh scripts/verify.sh`。local command runner障害のため成功扱いにしていない。GitHub Actions run #106では同じ共通入口が成功し、V8 compile相当とsource再取得によるescape文字数・正規表現・expectationの照合も実施。Main再レビュー指摘の責務別文言・設計不要時停止文言・workflow限定条件も再照合。overview/AGENTSの自動実行禁止文言を個別に照合し、onブロック検査のdead codeを除去。workflowは次トップレベルキーまで行単位で抽出し、複数行・inline形式・block sequenceのIssue eventを共通predicateで判定する疑似workflow回帰expectationを追加し、コメント内tokenを除外。nested `branches`内のtokenを誤検出しないこと、on直下のmapping/sequence・inline scalar/array・quoted token・flow mappingを検出することを確認
- 残るリスク: local runner上のDocker品質ゲートと、GitHub上の全6ラベル一覧、`main`反映後のIssue Form実動作は未確認。CIでのcompile・全expectation・Docker共通品質ゲートは成功済み
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-09-03
