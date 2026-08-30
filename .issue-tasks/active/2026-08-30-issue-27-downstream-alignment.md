# T27-03 後続フローとAgent・Skillの整合

- 元Issue: `#27`
- 要求分析書: [`requirements/27.md`](../../requirements/27.md)
- Requirement Analysis PR: `#29`
- 設計PR: `#28`
- 状態: `active`
- タスクキー: `downstream-alignment`
- 優先度: `normal`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/27`
- Issue統合PR: `#30`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/27-downstream-alignment`
- Task PR: 未作成
- Task PRのベースブランチ: `issue/27`
- 承認記録: 2026-08-30の会話でIssue #27の3 Task計画を承認

要求や設計全文は複製せず、元Issue、merge済み要求分析書、設計PRと現在の`docs/`を参照する。このファイルは着手済み作業の実施記録である。

## 目的

Requirement Analysis PR merge後の設計影響確認、Task Planning、Task実装、レビュー、検証、PR公開、Issue統合の各入口を、新しい要求分析の正本と承認境界へ整合させる。

## 対象範囲

- `AGENTS.md`
- `README.md`
- `.issue-tasks/TEMPLATE.md`
- `.codex/agents/*.toml`
- 既存の`.agents/skills/*/SKILL.md`のうち、要求、設計、Task、レビュー、検証、PR、Flow Feedbackの入口となるSkill
- 本Task記録

## 作業内容

- 後続工程が元Issueだけでなく、merge済み要求分析書を要求と受入条件の正本として読むようにする
- Requirement Analysis PRが未mergeなら設計影響確認やTask Planningへ進まず、merge後は別チャットから再開する境界を既存Skillへ反映する
- Task記録へ要求分析書とRequirement Analysis PRの追跡参照を追加する
- Task PRとIssue統合PRが要求分析書の受入条件ID、充足状況、根拠、未実施項目、残るリスクを扱うようにする
- Main、Worker、Reviewerのpromptを新しい正本と人間承認境界へ整合させる
- READMEとリポジトリ入口の説明を新しい基本フローへ整合させる

## 対象外

- `docs/`の変更
- Issue Form、要求分析Template、新規`$analyze-requirement` Skillの再変更
- アプリケーションコード、API、依存関係、CI構成の変更
- 既存Issueの一括移行、完了済みIssueの遡及移行
- PRのmerge、branch削除、Requirement Issueの完了操作

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#28` | hard | start | 人間によるmerge | merge済み |
| Requirement Analysis PR `#29` | hard | start | 人間によるmerge | merge済み。要求分析書が`develop`に存在 |
| T27-01 Task PR `#31` | hard | start | `issue/27`への人間によるmerge | 2026-08-30にmerge済み |
| T27-02 Task PR `#32` | hard | start | `issue/27`への人間によるmerge | 2026-08-30にmerge済み |
| Issue branch `issue/27` | hard | branch | T27-01・T27-02取り込み済みの最新head | `664cae9a2d057fd2bf6805af5cc81420d36d38af` |

## 懸念事項

- 複数のSkillとAgent promptに同じ境界が分散しているため、一部だけ旧フローのままだとチャット再開時に要求分析工程を迂回できる
- 要求分析書とTask記録・Issue統合PRの責務を混在させず、受入条件の定義と達成状況の正本を分離する必要がある
- localではremote操作禁止を守るため、最新`issue/27`とblob一致を確認した公開対象外の同期基点 `bf705db` から差分を作成する。remote公開時はGitHub連携で`664cae9a…`を直接baseにする

## 完了条件

- [x] リポジトリ入口とAGENTSがRequirement Issue、要求分析書、設計、実装、Task記録の正本を区別する
- [x] 後続SkillがRequirement Analysis PR merge前に停止し、merge後は別チャットで正本を読み直す
- [x] Task Planning、Task実装、レビュー、検証、PR公開、Issue統合が要求分析書の受入条件を参照する
- [x] Task記録Templateが要求分析書とRequirement Analysis PRを追跡できる
- [x] Main、Worker、Reviewerのpromptが新しい責務境界と必須レビュー経路へ整合する
- [x] 非自動完了形式、人間だけが行うPR merge・branch削除・Issue完了の境界を維持する
- [x] `docs/`、アプリケーションコード、依存関係、CI構成に対象外変更がない
- [x] Workerセルフレビュー、独立Reviewer、Main最終レビューで重大な指摘がない
- [ ] 共通検証とTask PRのCIが成功する
- [ ] Draft Task PRを`issue/27`向けに公開する

## 実装結果

- 変更内容: AGENTS、README、Task記録Template、Worker / Reviewer prompt、7つの既存Skillを、merge済み要求分析書の正本、Requirement Analysis PRの承認ゲート、別チャット境界、受入条件IDの追跡へ整合した
- 残るリスク: Task PR公開後のCIが未確認

## ローカル検証

- Worker: `git diff bf705db --check` 成功
- Worker: 旧入口を絞った`rg`で、Requirement Issue単独を要求分析の正本とする残存記述なし
- Worker: 非自動完了関連の`rg`で、禁止keywordは規約説明内だけに存在し、完了指示としての誤用なし
- Worker: `sh scripts/verify.sh` 成功（ESLint、型検査、API / Frontend単体テスト計4件、build）
- Main: `git diff bf705db --check` 成功
- Main: `sh scripts/verify.sh` 成功（ESLint、型検査、API / Frontend単体テスト計4件、build）
- Main: Python標準`tomllib`で`.codex/agents/worker.toml`と`.codex/agents/reviewer.toml`の構文確認に成功
- Main: 変更対象7 SkillのYAML frontmatter構造確認に成功
- Main: 旧入口と承認境界の`rg`確認に成功し、Requirement Issue単独を要求分析の正本とする残存記述なし
- Main: `git diff --name-only bf705db`で、変更が承認済み対象14 fileに限定され、`docs/`、アプリケーションコード、依存関係、CI構成の変更なし

## CI

- 未確認

## Agent割り当て

- Worker: `/root/t27_requirement_analysis`をT27-03担当として再利用。対象分析後、helper障害により編集はMainへ返し、Main適用後のセルフレビューと検証を実施
- Reviewer: `/root/review_t27_requirement_analysis`をT27-03の独立Reviewerとして再利用
- Main: `/root`が統合、最終レビュー、検証、Task記録、Draft Task PR公開を担当

## レビュー結果

- セルフレビュー: WorkerがAC-15、AC-17、AC-19〜AC-22、正本分離、承認境界、対象外変更を確認し、重大な指摘なし
- 独立レビュー: Task記録Templateが受入条件IDの記録を明示していない点をP2として指摘。Templateを要求分析書の受入条件IDと根拠を明示する文言へ修正後、再レビューでP0〜P3の追加指摘なし
- Mainレビュー: AC-15、AC-17、AC-19〜AC-22、正本分離、Requirement Analysis PRの人間承認と別チャット境界、非自動close、人間だけが行う操作、承認範囲を確認し、追加指摘なし

## Flow Feedback参照

- `.flow-feedback/pending/i27-tdownstream-alignment-f01.md`

## commit

- local verification base: `bf705db`（remote `issue/27` head `664cae9a…`との対象blob一致を確認した公開対象外commit）
- 実装commit: 未作成

## Pull Request

- 未作成

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠:
  - AC-15: AGENTS、README、関連Skillが、Requirement Analysis PR merge後もDesign、Task Planning、Task PR、Issue Integration PRの既存二階層フローを維持する
  - AC-17: Task記録Template、Agent prompt、review / verify / publish / coordinate Skillが、Issue Integration PRで受入条件IDごとの結果と根拠を確認する手順を要求する
  - AC-19: AGENTS、Task記録Template、publish Skillが自動close keywordを禁止し、非close形式の参照を維持する
  - AC-20: AGENTS、README、Agent prompt、関連Skillが、Requirement Issueの明示的なcloseを受入確認後の人間だけに限定する
  - AC-21: AGENTS、README、Task記録Template、Worker / Reviewer prompt、7つの関連Skillを新しい要求分析の正本と承認境界へ整合する
  - AC-22: 共通検証`sh scripts/verify.sh`、Task固有のTOML構文、Skill frontmatter、境界文言、変更scopeの検証が成功した
- 未対象または未充足の事項: T27-01・T27-02の実装内容、最新`develop`取り込み後のAC-01〜AC-22のIssue全体統合検証
- 未実施項目: Draft Task PR公開とそのCI確認
- 残るリスク: Task PRのCIが未確認
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
