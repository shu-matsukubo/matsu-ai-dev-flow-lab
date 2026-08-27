# 二階層PR運用の作業ガイド・Task記録・Skill整合

- 元Issue: `#14`
- 設計PR: `#15`
- Issue branch: `issue/14`
- Issue統合PR: `#16`
- Issue統合PRのベースブランチ: `develop`
- 状態: `completed`
- タスクキー: `issue-14-two-tier-flow-alignment`
- 優先度: `high`
- Agent構成: `worker-reviewer-parent`
- タスクブランチ: `task/14-two-tier-flow-alignment`
- Task PR: `#18`
- Task PRのベースブランチ: `issue/14`
- remoteベースcommit: `4b007b225f4009d4a744f5eb1e869aa5e4c2e222`
- 承認記録: 2026-08-28のチャットでTask 1とTask 2の計画をユーザーが「承認」

要求や設計全文は複製せず、元Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

merge済みの二階層PR設計と、Agentが実際に従う作業ガイド、Task記録、関連Skillを矛盾なく一致させる。

## 対象範囲

- `AGENTS.md`
- `README.md`
- `.tasks/TEMPLATE.md`
- `.agents/skills/plan-tasks/SKILL.md`
- `.agents/skills/coordinate-approved-tasks/SKILL.md`
- `.agents/skills/publish-task-pr/SKILL.md`
- `.agents/skills/review-changes/SKILL.md`
- `.agents/skills/verify-changes/SKILL.md`
- 本タスク記録

## 作業内容

- Task計画の人間承認後にIssue branchとIssue統合Draft PRを作成する境界を反映する
- Task branchを着手時点の最新Issue branchから作成し、Task PRのbaseを対応するIssue branchに限定する
- Task記録から元Issue、Issue branch、Issue統合PR、Task branch、Task PRを追跡できるようにする
- Issue統合Draft PRを要求、設計、Task、検証、受入条件、develop同期の索引として扱う責務を反映する
- Task PRではTask単位、Issue統合PRではRequirement Issue全体をレビュー・検証する責務差を反映する
- 全Task完了後、Issue統合レビュー前に最新`develop`をIssue branchへmergeする手順を反映する
- Task PRとIssue統合PRはSquash mergeを基本とし、merge、branch削除、Issue closeは人間だけが行う境界を反映する
- 現行ガイドと関連Skillから旧`codex/<task-name> -> develop`前提を除去する

## 対象外

- merge済み`docs/`の再設計
- 新しいSkillまたはtop-level文書カテゴリの追加
- `.codex/`のmodelまたはreasoning effort設定
- Task templateの全面再設計
- アプリケーションコードと自動テスト
- branch自動同期、rebase、force push
- CI workflowまたは品質ゲートの変更

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#15` | `hard` | `start` | `develop`へmerge済み | merge commit `5340e3eb983695c1e4c5f61ef7d2ffaf9a2704c7`をGitHub連携で確認済み |
| 承認済みTask計画 | `hard` | `start` | 人間の明示承認済み | 2026-08-28のチャットで「承認」 |
| Task PR `#17` | `hard` | `start` | `issue/14`へSquash merge済み | GitHub連携でmerge commit `4b007b225f4009d4a744f5eb1e869aa5e4c2e222`を確認済み |
| remote `issue/14` | `hard` | `publish` | 公開時のparentと最新headが一致する | 着手時head `4b007b225f4009d4a744f5eb1e869aa5e4c2e222`。remote treeとlocal開始treeはいずれも`fc92c4a7907a38929951ad2865151d65116eeed5` |

## 懸念事項

- planning、調整、remote公開、レビュー、検証の複数Skill境界を変更するため、同じ規則の過剰複製と責務の取り違えを独立Reviewerが確認する
- local branchはTask 1のlocal commit graphを継承し、remote Issue branchのSquash merge graphとは異なる。公開時はremote `issue/14`の最新headを親としてremote commitを作成し、local最終treeとの完全一致を確認する
- merge済み設計を超える新しいSkill責務またはフロー判断が必要になった場合は実装を広げず再計画へ戻る

## 完了条件

- [x] Task計画の人間承認後にIssue branchとIssue統合Draft PRを作成する境界が明確になっている
- [x] Task branchとTask PRのbaseが対応するIssue branchに統一されている
- [x] Task記録から元Issue、Issue branch、Issue統合PR、Task branch、Task PRを追跡できる
- [x] Issue統合Draft PRの索引責務とReady for review条件が明確になっている
- [x] Task PRとIssue統合PRのレビュー・検証範囲が区別されている
- [x] 最新`develop`のIssue branchへのmerge、Squash merge、人間だけが行うmerge・branch削除・Issue closeが明確になっている
- [x] 旧`codex/<task-name> -> develop`前提が対象ファイルから除去されている
- [x] 対象外変更がない
- [x] 変更したSkillがvalidatorを通過している
- [x] 共通品質ゲートとTask固有の横断整合確認が成功している
- [x] Workerセルフレビュー、独立Reviewer、Mainレビューが完了している
- [x] Task記録と実装が同じTask PRに含まれている

## 実装結果

- 変更内容: 承認対象の8ファイルだけを更新し、作業ガイド、Task template、計画・調整・公開・レビュー・検証Skillをmerge済み二階層PR設計へ整合させた。独立ReviewerのP1を受け、`publish-task-pr`のfrontmatter descriptionに残っていた`develop`向け旧表記も対応するIssue branch向けDraft Task PRへ修正した
- 残るリスク: remote Task branch / Draft Task PRの公開、remote親commit、local / remote tree、base・draft状態は確認済み。GitHub Actions CIの最終結果だけを確認する

## ローカル検証

- `git diff --check`: Worker、独立Reviewer、Mainで成功。CRLF変換予定のwarningだけで形式errorなし
- 変更範囲: 承認対象8ファイルとMain所有の本Task記録のみ。アプリケーションコード、CI、lockfile、生成物、secretの変更なし
- 旧前提検索: `codex/<task-name>`、`通常baseはdevelop`、`develop向けDraft Pull Request`の残存なし
- 横断整合確認: Issue branch、Issue統合Draft PR、Task branch / Task PR base、追跡参照、Task / Issue統合レビュー境界、最新`develop` merge、Squash merge、人間限定操作を対象ファイル間で確認
- Skill validator: Codex同梱Pythonへ一時領域のPyYAMLを設定し、UTF-8 modeで`quick_validate.py`を実行。`plan-tasks`、`coordinate-approved-tasks`、`publish-task-pr`、`review-changes`、`verify-changes`の5件すべて`Skill is valid!`
- Worker `sh scripts/verify.sh`: Docker daemon未接続で失敗し、成功扱いにしなかった
- Main `sh scripts/verify.sh`: Docker復旧後にGit Bash経由で再実行しexit 0。ESLint、API・frontの型検査、API 2件・front 2件のtest、API・frontのbuildがすべて成功
- 判定: Task固有検証と共通品質ゲートが成功し、公開可能

## CI

- Task PR `#18`作成後のGitHub Actions runを確認中

## Agent割り当て

- Main: タスク統括、Task記録、統合、最終レビュー、最終判断、remote公開
- Worker: Codex task `01a0454b-b203-77f2-a6b9-fb604cac1a20`。承認対象8ファイルの実装、検証、セルフレビュー、P1修正を担当
- Reviewer: Codex task `01a0454f-0383-7961-a492-365ead9011a2`。Workerから独立して要求・設計・Task・実diff・検証不足をレビューし、修正後再レビューを担当

## レビュー結果

- セルフレビュー: Workerが対象8ファイル、旧前提除去、責務境界、対象外差分、secret・生成物なしを確認。独立ReviewerのP1を1行修正後、本文との整合と追加差分なしを再確認
- 独立レビュー: 初回に`publish-task-pr` frontmatter descriptionの`develop`向け旧表記をP1として指摘。Worker修正後に再レビューしP1解消、追加のP0〜P3なし
- Mainレビュー: Issue #14、設計PR #15後の`docs/`、Task記録、Issue統合PR #16、remote base、8ファイルの実diff、Worker / Reviewer結果、validator、共通品質ゲートを直接確認。P1修正後の未解消P0〜P3なし

## フロー改善フィードバック

| 区分 | 発生事象 | 影響 | 根拠 | 改善案 |
|---|---|---|---|---|
| `verify` | `skill-creator`の`quick_validate.py`を通常shellとCodex同梱Pythonからそのまま実行できなかった | Skill validatorの実施方法を追加調査し、一時依存導入とencoding指定が必要になった | Worker環境は`python` / `py`なし。Codex同梱Pythonは最初に`ModuleNotFoundError: yaml`、PyYAML設定後はcp932の`UnicodeDecodeError`。一時PyYAMLと`-X utf8`で5件成功 | Skill validator用の安定したrunner、PyYAML依存、UTF-8指定をruntimeまたは検証手順として提供する |

## commit

- local implementation / review / verification commit: `ff2a5590915e88ab400092950f938200e0225766`
- local implementation tree: `7361fc606fbc78097fc00802c2b464db3db02086`
- remote initial publish commit: `4d0f865ebabcd7cff4d91c813aed326b5c62c3d0`
- remote parent: `4b007b225f4009d4a744f5eb1e869aa5e4c2e222`
- remote initial publish tree: `7361fc606fbc78097fc00802c2b464db3db02086`。local implementation treeと一致
- remote completion bookkeeping: 本記録のPR情報をTask branchへ後続commitとして反映する

## Pull Request

- Task Draft PR: `#18`
- URL: https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/18
- base: `issue/14`
- head: `task/14-two-tier-flow-alignment`
- PR作成時head: `4d0f865ebabcd7cff4d91c813aed326b5c62c3d0`
- draft: `true`
- 内容: 承認対象8ファイルと本Task記録

## 完了日時

- ローカル実装・レビュー・検証・Draft Task PR公開: 2026-08-28T07:31:12+09:00
- CI: 確認中
