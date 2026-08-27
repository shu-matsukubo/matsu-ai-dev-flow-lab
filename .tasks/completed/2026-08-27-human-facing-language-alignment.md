# 人間向け文章と運用成果物の整合

- 要求Issue: `#1`
- 設計PR: `#2`
- 状態: `completed`
- タスクキー: `human-facing-language-alignment`
- 優先度: `normal`
- Agent構成: `worker-reviewer-parent`
- タスクブランチ: `codex/human-facing-language-alignment`
- ベースブランチ: `develop`
- 承認記録: `2026-08-27 このチャットでタスク1・タスク2の計画とAgent構成を承認`

要求や設計全文は複製せず、要求Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

新しい要求Issue構造と日本語記述方針に、既存の運用文書、Skill、Agent設定、タスクテンプレート、CI表示名、shellの人間向けメッセージを整合させる。

## 対象範囲

- `README.md`、`AGENTS.md`
- `docs/architecture/system.md`、`docs/quality/testing.md`
- `.agents/skills/*/SKILL.md`
- `.codex/agents/*.toml`
- `.tasks/TEMPLATE.md`
- `.github/workflows/ci.yml` の人間向け表示名
- `scripts/*.sh`、`scripts/lib/*.sh` の人間向けmessage
- このタスク記録の実施・検証・レビュー・公開記録

## 作業内容

- `Goal / Requirements / Acceptance Criteria` 参照を「要求原文 + 要求分析」の構造へ更新する
- 人間向け見出し、説明、概念語を自然な日本語へ変更する
- `AGENTS.md` に共通の日本語記述ルールと正本文書への参照を追加する
- Skill責務、承認ゲート、Agent構成、品質ゲートの意味を維持する
- Skill名、frontmatter key、enum、model、branch、command、pathなどの機械識別子を維持する
- 指定された英語表現を全体検索し、残す表現は正式名称・識別子・過去記録・対象外のいずれかであることを確認する

## 対象外

- merge済み設計の意味変更
- `.tasks/completed/` の過去記録
- `.github/ISSUE_TEMPLATE/requirement.yml` の再変更
- アプリケーション機能、UI、API契約、テスト仕様
- Skill名、ファイル名、設定key、enum値、model identifier、branch名、commandのrename
- 機械的な全英単語除去

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#2` | `hard` | `start` | `develop`へmerge済み | merge済み。`https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/2` |
| タスク1 PR `#3` | `hard` | `start` | `develop`へmerge済み | merge済み。`https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/3` |

## 懸念事項

- 広範囲の文章変更でも、既存の責務、順序、停止条件、権限境界を変えない必要がある
- Skill frontmatter、TOML、YAML、command、path、enumなどを翻訳で壊さない必要がある
- 自然な日本語と技術用語・正式名称の維持を、機械的な単語置換ではなく文脈ごとに判断する必要がある

## 完了条件

- [x] `AGENTS.md` に人間向け文章の日本語記述ルールと正本への参照がある
- [x] 対象文書、Skill本文、Agent説明、タスクテンプレート、CI表示名、shellの人間向けメッセージが自然な日本語へ整合している
- [x] 新しい要求Issue構造と矛盾する旧 `Goal / Requirements / Acceptance Criteria` 参照が対象範囲から除去されている
- [x] Skill責務、承認ゲート、Agent構成、品質ゲートの意味が維持されている
- [x] Skill名、frontmatter key、enum、model、branch、command、pathなどの機械識別子が維持されている
- [x] 全Skillが `quick_validate.py` を通過する
- [x] TOML / YAML、既存リンク、対象用語の残存理由を確認している
- [x] 共通品質ゲートと `git diff --check` の結果が記録されている
- [x] Workerセルフレビュー、独立Reviewer、Main最終レビューを完了している

## 実装結果

- `README.md`、`AGENTS.md`、設計・品質文書の人間向け見出しと説明を自然な日本語へ統一した
- 7つのSkillを新しい要求Issue構造へ整合し、責務、承認ゲート、停止条件、Agent構成を維持した
- Worker / Reviewer設定、タスクテンプレート、CI表示名、shellの人間向けメッセージを日本語へ統一した
- Skill名、frontmatter key、enum、model、branch、command、path、workflow動作などの機械境界が不変であることを確認した
- 対象範囲内の旧 `Goal / Requirements / Acceptance Criteria` は、このタスク記録で除去対象を説明する引用を除いて残っていない
- 残るリスク: Docker daemon未接続のためローカル共通品質ゲートは未成功。shellの成功メッセージは構文検証済みだが実行時表示は未確認

## ローカル検証

- `quick_validate.py`（UTF-8モード）: 7つのSkillすべて成功
- TOML parse: 成功。`description` と `developer_instructions` 以外のmachine値がbaseから不変
- YAML parse: `.github/workflows/ci.yml` と要求Issue Formで成功。workflow差分はstepの `name` 2箇所だけ
- `bash -n scripts/setup.sh scripts/refresh.sh scripts/verify.sh scripts/lib/docker.sh`: 成功
- 変更対象Markdownの相対リンク検査: 成功
- 旧要求項目名の残存検索: 除去対象を説明するこのタスク記録内の引用以外は0件
- `git diff --check`: 成功
- `sh scripts/verify.sh`: 失敗（exit 1）。`Docker daemonへ接続できません。Docker Desktopを起動してから再実行してください。`。環境要因として記録し、成功扱いにしない

## CI

- Draft PR作成後に確認する

## Agent担当

- Main: タスク統括、統合、最終レビュー、最終判断
- Worker: `language_docs_worker`。文書、設定、タスクテンプレート、CI表示名、shellの人間向けメッセージを担当
- Worker: `language_skills_worker`。7つのSkill本文とfrontmatter検証を担当
- Reviewer: `language_alignment_reviewer_retry`。実装担当から独立して、共有された要求、設計、統合差分、検証結果をレビュー

## レビュー結果

- セルフレビュー: 両Workerが担当差分と指定検証を確認。追加指摘を反映後、対象範囲外変更なし、Skill validator成功、設定・構文検証成功
- 独立レビュー: P0〜P3の指摘なし。人間向け文言だけの変更であり、責務、停止条件、承認ゲート、機械値は維持されている。Main追加修正3箇所も追補レビューで指摘なし
- Mainレビュー: 旧概念語、Task template整合、機械境界、scope、差分を確認。日本語表記の小さな不整合3箇所を修正し、追加検証後に指摘なし

## フロー改善フィードバック

| 区分 | 発生事象 | 影響 | 根拠 | 改善案 |
|---|---|---|---|---|
| `other` | Windows sandboxのsetup refresh errorで通常のshell、apply_patch、Reviewerのローカル読取が拒否された | 標準経路を使えず、承認付き直接実行とレビュー資料のメッセージ共有が必要になった | `helper_unknown_error: setup refresh had errors` がMainと2回のReviewer起動で再現 | setup refresh失敗時にread-only Reviewerとapply_patchが利用できる限定fallbackを用意する |
| `verify` | `quick_validate.py` がWindows既定文字コードでUTF-8のSkillを読んだ | 初回検証が内容と無関係な `UnicodeDecodeError` になった | `-X utf8` を付けた同一validatorは7件すべて成功 | validatorの `read_text()` に `encoding="utf-8"` を指定する |
| `verify` | bundled PythonにYAML parserがなく、既存検証をそのまま実行できなかった | 一時領域のPyYAMLを追加して検証する手順が必要になった | TOMLは標準libraryで検証できたがYAMLは追加moduleを使用 | 検証runtimeへYAML parserを含めるか、repositoryに再現可能な検証入口を用意する |
| `verify` | Docker daemonへ接続できなかった | ローカル共通品質ゲートを完走できなかった | `sh scripts/verify.sh` が明示messageとexit 1で停止 | Docker Desktopを起動して再実行するか、Draft PRのGitHub Actions結果を確認する |

## コミット

- 実装commit: 公開準備時に記録する

## Pull Request

- 未作成

## 完了日時

- 2026-08-27
