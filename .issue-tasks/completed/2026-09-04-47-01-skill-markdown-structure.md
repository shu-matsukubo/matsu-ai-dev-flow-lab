# Skill本文の意味保持型Markdown構造化

- 元Issue: `#47`
- 要求分析書: `requirements/47.md`
- Requirement Analysis PR: `#50`
- 設計PR: `なし`（設計変更不要判断: Issue #47 comment `#issuecomment-5542055062`）
- 状態: `completed`
- タスクキー: `47-01-skill-markdown-structure`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/47`
- Issue統合PR: `#51`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/47-t01`
- Task PR: 未作成（Draft公開前）
- Task PRのベースブランチ: `issue/47`
- 承認記録: 2026-09-04のチャットで要求者が「承認します」と明示

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

`.agents/skills/`配下に存在する9件すべてのSkill本文を、既存の意味、責務、承認ゲート、Agent構成、AI開発フローとの関係を変えず、見出し階層から目的、使用条件、実行内容、判断基準、制約、完了条件、承認境界を把握できるMarkdown構造へ整理する。

## 対象範囲

- `.agents/skills/analyze-requirement/SKILL.md`
- `.agents/skills/check-design-impact/SKILL.md`
- `.agents/skills/coordinate-approved-tasks/SKILL.md`
- `.agents/skills/plan-tasks/SKILL.md`
- `.agents/skills/process-flow-feedback/SKILL.md`
- `.agents/skills/publish-task-pr/SKILL.md`
- `.agents/skills/record-flow-feedback/SKILL.md`
- `.agents/skills/review-changes/SKILL.md`
- `.agents/skills/verify-changes/SKILL.md`
- 本Taskの実装・レビュー・検証・公開状態を記録するTask file

## 作業内容

- frontmatter、Skill名、既存規則、参照先、正式名称、機械値を維持する
- 各Skillの責務に応じて本文を意味単位へ分け、親子関係が分かる見出し階層にする
- 並列条件と禁止事項には箇条書き、順序や依存関係のある処理には番号付き手順など、関係に適したMarkdown表現を使う
- 全Skillへ同じ章立てを機械的に適用せず、不要な見出しや過度な分割を避ける
- 変更前後を規則単位で照合し、欠落、追加、矛盾、適用条件の変更がないことを確認する
- 既存契約テストを弱めず、共通品質ゲートとTask固有検証を行う

## 対象外

- Skillの追加、削除、名称変更、利用条件変更
- frontmatterの項目または値の変更
- AI開発フロー、承認ゲート、Agent構成、Skill間の責務分担の変更
- `docs/`、`.codex/`、`AGENTS.md`、アプリケーションコード、CI、テスト戦略の変更
- 既存記述の曖昧さや不整合に対する新しい設計判断
- 既存Flow Feedbackの検索、評価、更新、移動

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR `#50` | `hard` | `start` | `develop`へmerge済み | merge commit `482f4c48ba24f63796c11f56c299377538a83e72` |
| 設計変更不要判断 | `hard` | `start` | 人間承認済み | Issue #47 comment `#issuecomment-5542055062`、`AI：作業可能`への切り替えと新しい指示を確認 |
| Issue統合Draft PR `#51` | `ordering` | `publish` | Task PRから相互追跡できる | open / draft、base `develop`、head `issue/47` |

## 懸念事項

- 文の移動や見出し階層によって、条件、例外、禁止事項の適用範囲が変化する可能性がある
- 可読性のための言い換えが、必須性、停止条件、責務主体を弱める可能性がある
- 複数Skillにまたがる承認・引き渡し契約の表現が不整合になる可能性がある
- 既存契約テストが確認する語句と意味を維持する必要がある
- ローカルbranchはGitHub連携で取得した最新`develop` treeと一致させた合成baseであり、remote公開時はremote Issue branchを正本としてtreeを再検証する必要がある

## 完了条件

- [x] 9件すべてのSkill本文が意味単位を表すMarkdown構造へ整理される
- [x] 各Skillの見出し階層から、該当する目的、条件、手順、判断、制約、完了条件、承認境界の所在を把握できる
- [x] 並列事項、順序付き手順、条件分岐、停止条件、例外、参照関係が適切なMarkdown表現で区別される
- [x] 全Skillへ同一の見出しセットを機械的に適用せず、不要または過度な見出しがない
- [x] frontmatterとSkill名が変更されず、全Skillが有効な形式である
- [x] 既存の意味、責務、承認ゲート、Agent構成、参照先、正式名称、機械値に欠落、追加、矛盾、適用条件変更がない
- [x] 既存契約テスト、Task固有検証、`sh scripts/verify.sh`が成功する
- [x] Workerセルフレビュー、独立Reviewer、Main最終レビューで必須修正指摘が残らない

## 実装結果

- 変更内容:
  - `.agents/skills/`配下の9件すべてを確認し、各Skillの責務に応じた見出し階層へ整理した
  - 8件ではSkill名のH1を本文先頭へ移動相当に整理し、開始ゲートをその配下のH2とした
  - `coordinate-approved-tasks`では、前提、Agent構成、Flow Feedback処理Task、通常Taskの境界、Task完了と公開を固有の見出しで区別した
  - 見出し・空行を除く本文行は変更前と順序を含めて完全一致し、既存規則の追加・削除・言い換えを行っていない
- 残るリスク: Task PRのCIと人間によるSquash mergeは未実施

## ローカル検証

- 2026-09-05: `skill-creator/scripts/quick_validate.py`をUTF-8モードで9件すべて実行し成功
  - PyYAMLは検証専用の一時directoryへ導入し、検証後に削除した
- 2026-09-05: 全9件でH1が1件、最初の見出しがH1、見出しレベルの上位飛びがないことを確認し成功
- 2026-09-05: 見出し・空行を除く全本文行をbaseと照合し、9件すべて完全一致
- 2026-09-05: `git diff --check`成功
- 2026-09-05: `sh scripts/verify.sh`成功
  - ESLint成功
  - TypeScript typecheck成功
  - 要求ステータス契約テスト8件成功
  - APIテスト2件、frontテスト2件成功
  - API build、front build成功

## CI

- Task PR公開前のため未実施

## Agent割り当て

- Worker: `/root/issue47_worker`。9件の確認、8件の初期見出し追加、自己検証とセルフレビューを担当。Reviewer指摘の修正中に実行環境の利用制限で停止したため、承認済み範囲の修正はMainが引き継いだ
- 独立Reviewer: `/root/issue47_reviewer`。初回レビューと修正後の再レビューを実装担当から独立して担当
- Main: 調整、実差分確認、最終レビュー、最終判断

## レビュー結果

- セルフレビュー: Workerがfrontmatter、本文、参照先、機械値の保持を確認
- 独立レビュー: 初回は見出し階層の上位飛びとH1より前の開始ゲートをP1/P2として指摘。修正後の再レビューではP0〜P3の残存指摘なし、AC-01〜AC-10充足、AC-11はMain検証待ちと判定
- Mainレビュー: Reviewer指摘を修正し、非見出し本文の完全一致、全9件の見出し階層、frontmatter、差分範囲を直接確認。追加検証後に必須修正指摘なしと判断

## Flow Feedback参照

- 新規Flow Feedbackなし。Worker、Reviewer、Mainのいずれも本Taskの変更内容に関する新規フロー問題を確認していない

## Flow Feedback処理

- 対象外

## commit

- 未作成（この記録と実装を同じTask commitへ含める）

## Pull Request

- Issue統合Draft PR: `#51`
- Task PR: 未作成（この記録を含むcommit公開後にDraftで作成する）

## 完了報告

- `AC-01`〜`AC-03`: 9件すべてを確認し、Skill名H1から意味単位と親子関係を辿れる固有の見出し階層へ整理した
- `AC-04`〜`AC-07`: 既存の箇条書き、番号付き手順、表を維持し、本文の意味単位に対応する見出しだけをSkillごとに追加した。全Skill共通テンプレートは導入していない
- `AC-08`〜`AC-10`: frontmatterとSkill名を維持し、見出し・空行以外の本文をbaseと完全一致させたことで、既存の意味、責務、承認ゲート、Agent構成、参照先、正式名称、機械値の保持を確認した
- `AC-11`: 9件のquick_validate、見出し階層検査、本文同一性検査、`git diff --check`、`sh scripts/verify.sh`が成功した
- 未対象または未充足の事項: Task承認範囲内になし
- 未実施項目: Task PRの公開とCI確認、人間によるSquash merge
- 残るリスク: remote公開後のCI結果は未確認
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 2026-09-05
