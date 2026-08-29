# Issue TaskとFlow Feedback運用への一括移行

- 元Issue: `#12`
- 設計PR: `#24`
- 状態: `completed`
- タスクキー: `issue-12-flow-feedback-migration`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/12`
- Issue統合PR: `#25`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/12-flow-feedback-migration`
- Task PR: `#26`
- Task PRのベースブランチ: `issue/12`
- 承認記録: 2026-08-29のチャットでユーザーが「承認」

要求や設計全文は複製せず、元Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

merge済み設計PR `#24` に基づき、Issue TaskとFlow Feedbackの保存構造、既存記録、AI作業ガイド、関連Skillを矛盾なく一括移行する。

## 対象範囲

- `.tasks/`から`.issue-tasks/`へのTask記録とテンプレートの移行
- `.flow-feedback/`のテンプレートと3状態directoryの追加
- 既存9 Task記録にある28観測の1件1ファイルへの移行
- AGENTS.mdと関連Skillのpath、正本、Main / Worker / Reviewer責務の整合

## 作業内容

- 既存Taskライフサイクルを維持したままdirectory名を変更する
- Task fileからFlow Feedback本文を削除し、必要な移行先参照だけを残す
- 既存観測を重複統合・改善判断・状態変更せず`.flow-feedback/pending/`へ移す
- Flow Feedbackテンプレートへ発生元Issue、Task、PR、category、symptom、impact、evidence、suggestionを定義する
- 通常TaskではMainだけが必要な新規feedbackを記録し、既存feedbackを処理しない責務境界へSkillを整合する

## 対象外

- 既存feedbackの整理、重複統合、改善要否判断、`resolved/`または`dismissed/`への状態変更
- 外部DB、GitHub Actions、scheduler、lock file、自動集約、自動改善
- Agent model、Agent構成選択基準、branch / Pull Request戦略の変更
- application code、API、認証、DB、テスト戦略の変更

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#24` | hard | start | `develop`へmerge済み | 2026-08-28にmerge済み |
| Issue統合PR `#25` | ordering | publish | Task PRから追跡可能 | Draft作成済み |

## 懸念事項

- 28観測の移行時に欠落、重複、発生元参照の誤りが起きる可能性
- path変更とSkill変更を分離すると、一時的に存在しないdirectoryを参照する可能性
- Windows sandbox setup refresh errorにより標準commandまたはapply_patchが拒否される可能性
- ローカルbranchはGitHub連携で取得した最新`develop` treeと一致させた合成baseであり、remote公開時はremote Issue branchを正本としてtreeを再検証する必要がある

## 完了条件

- [x] `.issue-tasks/TEMPLATE.md`、`active/`、`completed/`が既存Taskライフサイクルを維持する
- [x] `.flow-feedback/TEMPLATE.md`、`pending/`、`resolved/`、`dismissed/`が存在する
- [x] 既存28観測が必須項目を持つ28個の`pending` fileへ1対1で移行される
- [x] Issue運用開始前の観測だけが移行専用`i00`を使用する
- [x] Task fileにFlow Feedback本文が残らず、状態情報を本文へ重複保持しない
- [x] AGENTS.mdと関連Skillが新path、1件1ファイル、Main単一writer、通常Taskの禁止事項に整合する
- [x] 意図した移行説明を除き、運用上の`.tasks/`参照が残らない
- [x] Skill形式検証と`sh scripts/verify.sh`が成功する
- [x] 独立ReviewerとMainのレビューで必須修正指摘が残らない

## 実装結果

- 変更内容: `.tasks/`を`.issue-tasks/`へ移行し、既存28観測をfilename規則付きの`.flow-feedback/pending/`へ1件1fileで移行。AGENTS.md、Task template、関連SkillをMain単一writer責務へ整合。追補でrecord-flow-feedbackの正式field名、空directory維持用gitkeepを反映。
- 残るリスク: Draft Task PRの記録整理commitに対するremote CIと、Issue branchへのmergeは未実施。

## ローカル検証

- Task固有検証: 成功。移行元9 Taskの28観測と移行先28 fileをfield、発生元Issue / Task / PRまで1対1比較し、欠落・重複・内容差分0件。命名、Task別件数、i00、必須項目、状態metadataなし、Task本文分離、旧path、対象外差分、空directory用gitkeepも確認。
- 変更Skillの公式形式検証: 成功。repository外の一時PyYAMLを使用し、`quick_validate.py`をUTF-8 modeで4 Skillすべて通過。
- `git diff --cached --check`: 成功。
- `sh scripts/verify.sh`: Main再実行で成功（lint、typecheck、4 test、build、diff check）。

## CI

- Draft PR `#26` のremote実装commit `c1a4ce0a309b25fdebfb9640c959b5d54537e0b6`: 成功（CI run `#46`）。

## Agent割り当て

- Worker: 本担当Agent（唯一のwriter）。
- 独立Reviewer: `issue12_reviewer`。初回指摘と追補確認を実施し、最終追補では実装上の必須修正指摘なし。
- Main: 実差分、設計、Task固有検証、共通品質ゲートを確認し、最終レビューと最終判断を実施。

## レビュー結果

- セルフレビュー: 実施済み。Reviewer P1/P2（命名、PR、Issue、field、状態metadata、責務文言、literal改行）を反映。
- 独立レビュー: 初回指摘をすべて修正し、最終追補レビューで実装上の必須修正指摘なし。Task記録の完了情報更新だけをMainへ引き継いだ。
- Mainレビュー: 指摘なし。Issue #12、設計PR #24、全差分、対象外、28件の1対1移行、責務境界、検証結果を直接確認。

## Flow Feedback参照

- 移行した既存feedbackは `.flow-feedback/pending/` の個別fileを正本とする。
- `.flow-feedback/pending/i12-tissue-12-flow-feedback-migration-f01.md`
- `.flow-feedback/pending/i12-tissue-12-flow-feedback-migration-f02.md`
- `.flow-feedback/pending/i12-tissue-12-flow-feedback-migration-f03.md`

## commit

- local実装commit: `d2dd4ebcf25c5ec96f0ab7fea38e9f2ffa9669f0`
- remote実装commit: `c1a4ce0a309b25fdebfb9640c959b5d54537e0b6`

## Pull Request

- URL: `https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/26`
- 番号: `#26`
- head: `task/12-flow-feedback-migration`
- base: `issue/12`
- draft: `true`

## 完了報告

- このTaskが寄与する受入条件と根拠: `.issue-tasks/`のTaskライフサイクル、`.flow-feedback/`の1件1file・3状態directory・必須field、既存28観測の無判断移行、Main単一writerと通常Taskの禁止事項を、実装差分とTask固有検証で確認。Issue #12の実装対象受入条件へ寄与する。
- 未対象または未充足の事項: Task範囲内の未充足なし。Task PRのIssue branchへのmerge、Issue統合レビュー、Requirement Issueのclose判断は人間と後続統合工程の責務。
- 未実施項目: この記録整理commitのremote CI確認、Task PRのIssue branchへのmerge、Issue統合工程。
- 残るリスク: Task PR merge前のため変更はIssue branchへ未統合。Issue統合PRでは最新developを取り込み、要求全体の回帰検証と受入条件確認が必要。
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-08-29
