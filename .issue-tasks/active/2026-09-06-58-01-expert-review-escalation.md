# 専門レビュー能力を一括導入する

- 元Issue: `#58`
- 要求分析書: `requirements/58.md`
- Requirement Analysis PR: `#63`
- 設計PR: `#64`
- 状態: `active`
- タスクキー: `58-01`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- Issue branch: `issue/58`
- Issue統合PR: `#65`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/58-01`
- Task PR: `未作成`
- Task PRのベースブランチ: `issue/58`
- 承認記録: `2026-09-06のIssue #58 Task計画チャットで要求者が「承認します」と明示`

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の`docs/`を参照する。このfileは着手済み作業の実施記録である。

## 目的

高難度、高リスク、または高不確実性の論点を、元Agentの作業主体、承認scope、最終判断を維持したまま、専門レビュー担当へ自律的に確認できる独立能力を、Agent設定、Workflow、追跡形式、契約テストと一体で導入する。

## 対象範囲

- `.agents/skills/request-expert-review/SKILL.md`の追加
- `.codex/agents/expert-reviewer.toml`の追加
- `AGENTS.md`、`docs/ai-development/overview.md`、関連Workflowへの安定原則と責務境界の反映
- `requirements/TEMPLATE.md`と`.issue-tasks/TEMPLATE.md`への任意の追跡要約形式の反映
- 動的能力発見、Agent設定分離、結果状態、安全境界、代表事例を確認する契約テスト
- 必要なテスト入口の更新

## 作業内容

- 元Agentが文脈から必要性を判断し、現在の承認scope内で都度の人間承認なしに依頼する能力契約を作成する。
- 依頼入力、Completed、Unavailable、Insufficient Input、No Resultの結果状態、finding、未確認事項、remaining risk、追跡要約を定義する。
- 専門レビュー担当をread-onlyの助言役として定義し、具体的なmodelとreasoning effortをAgent設定だけに置く。
- Workflowへ全工程からの任意利用、元Agentへの責務返却、正式な引き渡し前の追跡を個別Skill名、role名、model名なしで反映する。
- 代表的な高リスク、判断困難、不要、利用不能、入力不足、結果未取得の各事例を契約テストで再現する。
- 共通品質ゲートと変更リスク固有の追加検証を実行する。

## 対象外

- application code、API、authentication、authorization、session、DB、deploymentの変更
- 固定スコアだけで判断する自動判定engine
- 多階層エスカレーション、動的model routing、負荷分散
- 専門レビュー担当による代理実装、外部状態変更、承認、提出、最終判断
- 専門レビュー専用の中央logまたは新しい正本
- 通常の独立review、verification、提出、PR確認の置換
- Pull Requestのmerge、branch削除、Requirement Issueのclose

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Requirement Analysis PR #63 | hard | start | 人間によるmerge | merge済み、`requirements/58.md`を`develop`で確認 |
| 設計PR #64 | hard | start | 人間によるmerge | merge済み、`docs/design-decisions/58.md`を`develop`で確認 |
| 最新`develop` | ordering | start | Issue branchのtreeが開始時点のdevelopと一致 | remote commit `a9988c9263b6db1a8923baed11122f391bb0cace`、tree `e055237ffd81dfeb85f1966ef533065982ae1b95`との一致を確認 |
| Codex custom Agent実行環境 | soft | complete | 設定契約を確認し、実行可能なら固定revisionで代表確認を実行 | 静的設定と契約テストは確認済み。現在sessionではunknown agent_typeとなりruntimeは`Unavailable`、実効権限は未確認 |

## 懸念事項

- 親turnのlive permission overrideによって、Agent fileのread-only既定値が実効権限として再適用されない可能性がある。実効性を確認できなければ成功扱いせず、指示上の非変更境界とUnavailable / Not Executedを記録する。
- custom Agentの追加は現在のsessionへ即時反映されない可能性がある。実際の起動を確認できない場合も、静的契約確認とruntime未確認を分ける。
- Workflow、Skill、Agent設定のいずれかだけを変更すると、存在しないrole参照、model設定の重複、責務の取り違えが起きるため、同一Task内で整合を確認する。
- 文脈判断の裁量を固定checklistへ縮退させず、同時に代表事例を再現可能にする必要がある。

## 完了条件

- [x] 独立した専門レビュー能力がruntime metadataと能力契約から一意に発見できる。
- [x] Skillが工程、成果物種別、Workflow状態、具体的なmodel設定から独立している。
- [x] 専門レビュー担当が必要なfindingと失敗状態を返し、作業主体と最終判断が元Agentへ戻る。
- [x] 具体的なmodel、reasoning effort、sandbox設定がAgent定義だけに存在する。
- [x] 利用理由、対象、主要結果、元Agentの対応判断を既存成果物へ必要十分に記録できる。
- [x] 6つの代表事例と、能力追加・名称変更時の疎結合性を契約テストで確認する。
- [x] `sh scripts/verify.sh`と変更リスク固有の追加検証が成功する。
- [x] Workerのセルフレビュー、独立Reviewer、Mainの最終レビューを完了し、P0〜P2が残っていない。
- [ ] Task記録をcompletedへ移し、実装と同じDraft Task PRへ公開する。

## 実装結果

- 変更内容: 専門レビューSkill、専門レビューAgent設定、抽象Workflow、要求・Taskテンプレート、契約テストとテスト入口を追加・更新した。動的発見、名称変更、6代表事例、安全境界を検証し、具体的なmodel、reasoning effort、sandbox設定はAgent fileだけに配置した。
- 残るリスク: fresh sessionでのruntime発見、model / effortの実行時適用、read-only実効権限は未確認。現在sessionではunknown agent_typeのためruntime Unavailableとして扱った。

## ローカル検証

- Main実行の対象契約テスト5件: Passed、exit 0
- `npm test`: Passed、契約テスト23件、API 2件、Front 2件
- `npm run lint`: Passed
- git diff --check: Passed
- 禁止依存検索: Passed（安定文書・Workflow・Skillに具体的なrole名、model値、推論設定なし）
- Git Bash経由 `sh scripts/verify.sh`: Passed、lint、typecheck、契約23件、API 2件、Front 2件、buildを確認
- PowerShellからの直接sh scripts/verify.sh: PATH不在で実行不能。その後Git Bash経由で同一scriptを成功確認

## CI

- Pull Request前のためNot Executed

## Agent割り当て

- 作成担当: Worker 1名、実装とself reviewを実施
- 独立Reviewer: Workerと別Agent。初回reviewと3回の再reviewを実施
- Main: 実差分、正本、review、verification、残るリスクを確認

## レビュー結果

- セルフレビュー: Passed
- 独立レビュー: 初回と3回の再reviewで、secret境界、6事例・動的発見不足、見出し重複、自己比較、意味対応不足を検出。全修正後P0〜P2なし
- Mainレビュー: 実差分、正本、検証証拠を確認しP0〜P2なし

## 専門レビュー要約

専門レビュー能力の実装後、実行環境で利用可能ならこのTaskのsecurity、権限、責務境界を対象に利用する。利用不能の場合は状態、理由、未確認事項、代替確認、remaining riskを記録する。

- 利用理由: 権限、機微情報、責務返却の高リスク論点を独立確認するため
- 確認対象: 新規Agent設定と専門レビューSkillの安全境界。対象外は成果物変更、外部状態変更、子Agent、提出、承認、最終判断
- 状態と主要結果: `Unavailable`。現在sessionではunknown agent_typeでruntime発見不能。静的設定と契約テストでは責務境界、失敗状態、追跡要約を確認
- 元Agentの対応判断と根拠: 成功扱いせず、通常Reviewer、Mainレビュー、静的契約テスト、共通ゲートを代替確認として実施。fresh sessionでruntime確認が必要
- 未確認事項とremaining risk: fresh sessionでの能力発見、model / effortの実効適用、read-only権限の実効性

## Flow Feedback参照

必要な場合だけ、対応する`.flow-feedback/pending/`のfile pathを記載する。本文や状態metadataは複製しない。

## Flow Feedback処理

対象外

## commit

- 実装commit作成前

## Pull Request

- Issue統合Draft PR: `#65`
- Task PR: 未作成

## 完了報告

- このTaskが寄与する要求分析書の受入条件IDと根拠: AC-01〜AC-14。AC-01〜03は文脈判断と全工程利用、AC-04〜05は動的発見・名称変更fixture、AC-06〜07はfinding・責務返却、AC-08〜09はAgent設定への具体値局所化、AC-10は追跡要約、AC-11は3失敗状態、AC-12は既存承認境界、AC-13は6事例表、AC-14は契約テストと共通ゲートで確認
- 未対象または未充足の事項: Task PR、CI、fresh sessionのruntime発見と実効権限確認
- 未実施項目: Task PR、CI、fresh session runtime確認
- 残るリスク: runtimeでの能力発見、model / effortの適用、read-only実効性
- Requirement Issueの状態: merge後もopen。全受入条件と根拠を確認した人間だけが明示的にcloseする
- AI agentによるIssue close: 行わない

## 完了日時

- 未完了
