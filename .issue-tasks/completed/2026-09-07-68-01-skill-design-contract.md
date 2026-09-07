# Skill設計原則と継続検知を実装する

- 元Issue: `#68`
- 要求分析書: `requirements/68.md`
- Requirement Analysis PR: `#75`（merge済み）
- 設計PR: `#76`（merge済み）
- 状態: `completed`
- タスクキー: `68-01-skill-design-contract`
- 優先度: `normal`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/68`
- Issue統合PR: `#77`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/68-skill-design-contract`
- Task PR: `#78`
- Task PRのベースブランチ: `issue/68`
- 承認記録: 2026-09-07の現在チャットで要求者がTask案に対して「承認」と回答。2026-09-08にGitHubへ送信するSkill本文とTask記録の具体的なpayloadと宛先を示し、要求者が「承認します」と回答

要求や設計全文は複製せず、元Issue、merge済み要求分析書、`docs/design-decisions/68.md`と現在の`docs/`を参照する。このfileは完了したTaskの実施記録である。

## 目的

設計済みのSkill設計ガイド、repositoryの安定原則、文脈を区別する継続検知を一つの整合した変更として有効化し、Skill間の疎結合を今後の新規設計、変更、分割・統合・削除、設計レビューでも維持できる状態にする。

## 対象範囲

- `.agents/skills/design-skill/SKILL.md`の追加
- `AGENTS.md`へのSkill設計の安定原則と利用入口の追加
- `tests/skill-design-contract.test.mjs`の追加
- `tests/requirement-status-contract.test.mjs`の追加・名称変更・削除fixture拡張
- root `package.json`の契約テスト入口更新
- 実装時点のrepository管理下の全Skill監査
- 本Task記録、Task PR、Issue統合PRからの追跡

## 作業内容

- Skill設計対象を自己完結性、直接依存、工程制御、責務配置、共有知識、変更波及へ照合する読み取り評価能力を追加する。
- メタSkillへ提供能力、適用条件、入力、出力、責務外、能力固有の処理、失敗・未実施・残るリスクを記載する。
- `AGENTS.md`へ自己完結、直接依存回避、WorkflowとReferenceへの責務分離、利用可能な設計ガイド確認の入口だけを追加する。
- Skillを動的に発見し、Markdown sectionと依存文脈を解釈する共通predicateを実装する。
- 自己宣言、一般語、成果物の性質、責務外、Referenceまたは安定contract参照を受理する肯定fixtureを追加する。
- 別Skill識別子・path・呼び出し・成功依存、前後工程要求、Workflow状態所有、固定一覧を拒否する否定fixtureを追加する。
- Skill追加・名称変更・削除時に、無関係なSkill、設計ガイド、`AGENTS.md`が不変であることを確認する。
- 最新revisionの全Skillを同じ不変条件と人間による共有知識確認へ照合し、明確な違反だけを修正する。

## 対象外

- application、frontend、backend、API、authentication、authorization、session、DB、persistenceの変更
- Workflow、Reference、`docs/ai-development/overview.md`の変更
- 固定Skill registryまたは手書きcatalogの追加
- 違反が確認されない既存Skillの文言統一または大規模再編
- 過去の要求分析書、設計判断記録、完了済みTask記録の書き換え
- Pull Requestのmerge、branch削除、Requirement Issueのclose

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #75 | hard | start | 人間による`develop`へのmerge | merge済み。`requirements/68.md`を最新`develop`で確認 |
| 設計PR #76 | hard | start | 人間による`develop`へのmerge | merge済み。merge commit `1802c13b5e2cfde663a6814c78dbf698c04a97a1` |
| 承認済みTask計画とIssue #68開始ゲート | hard | start | 計画の人間承認、`AI：作業可能`単独、現在のチャット指示 | 2026-09-07に承認を受け、GitHub再取得でopenかつ`AI：作業可能`単独を確認 |
| Issue統合PR #77 | ordering | publish | `develop`をbase、`issue/68`をheadとするDraft PRから統合結果を追跡できる | open、Draft。開始commit `f7fbf0555ece8b0c938e04b0e98b4901babc725b` |
| Task PR #78 | hard | publish | `issue/68`をbase、`task/68-skill-design-contract`をheadとするDraft PRとCIからTask結果を追跡できる | open、Draft、mergeable。remote実装commit `2943e481a12795ca333a77cce566a2bfdd1da546`のCI run 169がsuccess |
| 独立Reviewer | hard | publish | P0〜P2を解消し、確認範囲、未確認事項、remaining riskを記録する | 3回のP1修正後、最終再レビューで未解消P0〜P2なし |
| 共通品質ゲートとTask固有検証 | hard | publish | 必須検証が成功し、未実施と残るリスクを記録する | 専用・既存契約テスト29/29成功。Docker固定環境の`sh scripts/verify.sh`でlint、typecheck、全test、build成功。Task PR CI run 169もsuccess |

## 懸念事項

- 自然言語だけから工程所有を完全には判定できないため、Markdown構造、限定した依存文脈、肯定・否定fixture、人間による全件監査を組み合わせる。
- `責務外`や設計ガイド内の禁止例を違反として誤検出すると正当なSkillを拒否するため、検査対象sectionと説明文脈を区別する。
- runtimeで未発見の削除済み識別子や巧妙な言い換えは自動検知だけでは保証できない。
- メタSkill、安定原則、検査の片方だけを先に有効化せず、同じTask treeで切り替える。

## 完了条件

- [x] Skill設計ガイドをruntime metadataと能力契約から一意に発見できる。
- [x] Skill設計ガイドが自己完結した7 sectionと設計判断、配置判定、分割・統合・削除、失敗境界を持つ。
- [x] Skill設計ガイドが固定Skill一覧、別Skill識別子、固定Workflow構成を成立条件または処理手順にしない。
- [x] `AGENTS.md`が安定原則と利用入口だけを持ち、個別Skill名、具体例、詳細手順を持たない。
- [x] activeな全Skillについて自己完結性、直接依存、工程所有、共有知識、変更要否を追跡できる。
- [x] 同じpredicateによる肯定・否定fixtureが、許可文脈と違反文脈を区別する。
- [x] Skill追加・名称変更・削除で無関係なSkill、設計ガイド、`AGENTS.md`が不変である。
- [x] 既存のWorkflow、Reference、overview、application code、履歴的成果物に不要な変更がない。
- [x] 対象契約テスト、既存契約テスト、`sh scripts/verify.sh`が成功する。
- [x] Worker未実施を成功扱いせず記録し、Mainセルフレビュー、独立Reviewer、Main最終レビューを完了し、未解消のP0〜P2がない。
- [x] Task記録をcompletedへ移し、実装と同じDraft Task PRへ公開する。

## 実装結果

- `.agents/skills/design-skill/SKILL.md`へ、Skill設計対象を8つの不変条件、配置判定、分割・統合・削除基準へ照合する読み取り評価能力を追加した。
- `AGENTS.md`へ自己完結、Skill間の直接依存回避、WorkflowとReferenceへの責務分離、利用可能な設計ガイドを能力契約から選ぶ入口だけを一段落で追加した。
- `tests/skill-design-contract.test.mjs`へ動的発見、7 section、具体識別子・path、直接呼び出し・成功依存、前後工程、状態所有、固定一覧を同じpredicateで検査する肯定・否定fixtureを追加した。
- 否定説明と実依存が同じ文の前後に混在する場合も、肯定形の操作だけを局所的に検知するfixtureを追加した。設計ガイドの禁止例は`### 記述例`の表という構造で区別する。
- 既存の追加・名称変更・削除fixtureを、設計ガイドと無関係なSkillと`AGENTS.md`の不変性まで拡張し、root test入口へ新規契約テストを追加した。
- 既存Skill、Workflow、Reference、overview、application code、履歴的成果物は変更していない。
- 残るリスク: 自然言語の同義表現、複雑な係り受け、runtimeから削除済みの識別子は正規表現だけでは完全に検出できない。固定revisionの全Skill監査と、今後の設計レビューを組み合わせる。

## 実装時の全Skill監査

監査対象はremote実装commit `2943e481a12795ca333a77cce566a2bfdd1da546`、tree `7186f3a20cd63fd3b685d2299730d1189d90d52b`である。local実装commit `e70d013ae468566b0707101ff79da27127ab34b5`も同じtreeを持つ。completed Task記録への移動と追記ではSkill本文を変更しないため、このsnapshotの監査対象は最終Task headでも不変である。

動的発見した全11 Skillにrepository実体と同じpredicateを適用して11/11適合を確認し、設計時snapshotと各本文を人間が再照合した。既存10 Skillは親revisionから本文変更がなく、新規設計ガイドを含めて共有知識の競合する重複は確認されなかった。

| 対象 | 自己完結した能力契約 | 別Skill識別子・path・存在への依存 | 前後工程要求とWorkflow状態所有 | 共有知識との境界 | 変更と根拠 |
|---|---|---|---|---|---|
| `analyze-requirement` | 適合。7 sectionから入力、出力、責務外、失敗を判断可能 | なし | なし | 要求正本と制約を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `apply-flow-feedback` | 適合。承認済み計画を反映結果へ変換する単一能力 | なし | なし | 分類とdirectory状態を確定入力として受ける | なし。親revisionから本文不変でfindingなし |
| `check-design-impact` | 適合。設計影響と判断不足を一つの評価結果へまとめる | なし | なし | 現在の設計と制約を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `design-skill` | 適合。7 section、8不変条件、設計案・finding、失敗境界を単体で判断可能 | なし。禁止例はplaceholderでありcatalogではない | なし。工程制御を責務外と配置判定へ明示 | 詳細設計判断を固有処理として所有し、共有基準はReferenceまたは安定contractを正本にする | あり。Issue #68の確定設計に基づく新規追加 |
| `evaluate-flow-feedback` | 適合。固定集合のread-only評価として完結 | なし | なし | 分類基準を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `plan-tasks` | 適合。確定要求と設計を検証可能なTask案へ分解 | なし | なし | Task分解基準を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `record-flow-feedback` | 適合。一つの観測を一つの記録へ変換 | なし | なし | categoryと記録形式を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `request-expert-review` | 適合。相談の入力、4状態の結果、責務返却が単体で判断可能 | なし | なし | 専門レビュー固有の依頼・結果contractだけを所有 | なし。親revisionから本文不変でfindingなし |
| `review-changes` | 適合。指定成果物を重要度付きfindingへ評価 | なし | なし | 共有review基準を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `submit-artifact` | 適合。確定した提出契約をremote結果へ変換 | なし | なし | 提出形式と安全基準を入力として受ける | なし。親revisionから本文不変でfindingなし |
| `verify-changes` | 適合。検証項目ごとの結果と保証範囲を返す | なし | なし | 検証基準を入力として受ける | なし。親revisionから本文不変でfindingなし |

監査findingは0件で、既存Skillを変更する根拠はなかった。自然言語の同義表現、削除済み識別子、暗黙の共有知識は自動predicateだけでは完全保証できないことをremaining riskとして残す。

## ローカル検証

- `node --test tests\\skill-design-contract.test.mjs tests\\requirement-status-contract.test.mjs tests\\expert-review-contract.test.mjs`: Passed、29/29成功。
- `sh scripts/verify.sh`: Passed。Docker固定toolchainでlint、API・Frontのtypecheck、契約テスト29/29、API test 2/2、Front test 2/2、API・Front buildがすべて成功。
- hostの`npm.cmd run lint`と`npm.cmd test`: Not Executed。hostに`node_modules`がなく`eslint`と`vitest`を起動できなかった。依存を追加せず、同じlockfileを用いるDocker固定toolchainの共通品質ゲートで代替確認した。
- Skill creatorの`quick_validate.py`: Not Executed。利用可能なPython環境に`yaml` moduleがなくvalidator起動前に終了した。新規契約テストによるfront matter、directory名、7 section、本文契約の構造・振る舞い確認で補完した。

## CI

- GitHub Actions CI [run 169](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/actions/runs/34142089160)（run id `34142089160`）: `success`
- 対象remote commit: `2943e481a12795ca333a77cce566a2bfdd1da546`
- 対象tree: `7186f3a20cd63fd3b685d2299730d1189d90d52b`
- job `verify`: `success`
- step「品質検証」: `success`
- completed Task記録を追記するcommit自体との自己参照を避けるため、最終Task headのchecksはTask PR #78を正本として再確認する。

## Agent割り当て

- Worker: `/root/issue68_worker`。初回・再実行ともWindows ACL障害と利用上限により実装、検証、監査を未実施で終了。Mainが成果物作成を引き継ぐ
- 独立Reviewer: `/root/issue68_independent_review`。契約predicateの否定文脈、肯定操作、日本語活用形と要求構文を独立確認
- Main: 開始ゲート、Task記録、branchとPR、実成果物・review・verificationの直接確認、最終判断、GitHub提出

## レビュー結果

- Workerセルフレビュー: Not Executed。`/root/issue68_worker`は初回・再実行ともACL障害と利用上限で成果物を作成できず、最終成果物の根拠には使用していない。
- Mainセルフレビュー: 要求AC-01〜AC-15、設計判断、対象7file、変更scope、Skill本文の8不変条件、契約predicateとfixtureを照合した。否定語による行全体除外を独立レビュー前の自己確認でもリスクとして認識し、Reviewer findingと合わせて修正対象にした。
- 独立レビュー: 初回は否定語で行全体を除外するP1、再確認では依存操作の後置否定によるP1、次の確認では`呼び出す`と要求構文の活用差によるP1を報告した。すべて修正して前後混在、直接呼び出し、要求構文fixtureを追加し、最終再レビューで未解消P0〜P2なしを確認した。
- Main最終レビュー: 独立findingの修正差分、全29契約テスト、共通品質ゲート、対象外fileの非変更を直接確認した。未解消P0〜P2なし。

## Flow Feedback参照

- `.flow-feedback/pending/i52-t52-01-f01.md`: Windows sandbox helperの`apply deny-read ACLs`。今回も開始時の通常実行で再現したため、新規重複fileは作成せず既存観測を参照する。

## Flow Feedback処理

- 対象外

## commit

- Issue branch remote開始commit: `f7fbf0555ece8b0c938e04b0e98b4901babc725b`
- Task branch開始点: `f7fbf0555ece8b0c938e04b0e98b4901babc725b`
- local実装commit: `e70d013ae468566b0707101ff79da27127ab34b5`
- remote実装commit: `2943e481a12795ca333a77cce566a2bfdd1da546`
- localとremoteの実装tree: `7186f3a20cd63fd3b685d2299730d1189d90d52b`
- Task完了記録: このfileの`.issue-tasks/completed/`への移動と本監査追記を含むTask head

## Pull Request

- Issue統合Draft PR: [#77](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/77)
- Draft Task PR: [#78](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/78)
- Task PR base: `issue/68`
- Task PR head: `task/68-skill-design-contract`
- Task PR状態: open、Draft、mergeable。初回remote実装commitのCI成功
- merge、branch削除、Requirement Issueのcloseは人間だけが行う

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠:

| 受入条件 | Task 68-01の状態と根拠 |
|---|---|
| AC-01〜AC-02 | Task範囲で充足。独立した設計ガイドを追加し、固定Skill一覧と固定Workflow構成を持たず、変更波及fixtureを成功させた |
| AC-03〜AC-05 | Task範囲で充足。全Skillの7 sectionと、名前・path・存在・呼び出し・出力・成功、前後工程、状態所有を同じpredicateと監査で確認した |
| AC-06〜AC-08 | Task範囲で充足。配置判定と共有知識境界を設計ガイドに置き、`AGENTS.md`は一段落の安定原則と利用入口だけにした |
| AC-09 | Task範囲で充足。remote固定revisionの全11 Skill監査を上表へ残し、明確な違反がない既存10 Skillを変更していない |
| AC-10〜AC-12 | Task範囲で充足。肯定・否定fixture、否定説明との混在fixture、追加・名称変更・削除fixtureが成功した |
| AC-13〜AC-14 | Task範囲で充足。runtime discovery、4層責務、review、verification、submission、承認、人間だけの最終判断を維持した |
| AC-15 | Task範囲で充足。application変更なし、local共通品質ゲートとTask PR CIが成功し、Not Executedとremaining riskを本記録とPRへ残した |

- 未対象または未充足の事項: Task PR #78のIssue branchへの人間merge、merge後のIssue統合tree検証、Issue統合PR #77の完成確認。
- 未実施項目: Worker実装・セルフレビュー、`quick_validate.py`、host依存コマンド。理由と代替確認は上記のとおり。
- 残るリスク: 正規表現で解釈できない自然言語、削除済み識別子、Task PR最終headと人間merge後のIssue統合treeに対するremote CI。
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- Draft Task PR公開・初回CI成功確認: 2026-09-08

## 専門レビュー追跡要約

- 利用なし
