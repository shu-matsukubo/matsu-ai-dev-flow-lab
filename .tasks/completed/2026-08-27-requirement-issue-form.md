# 要求原文と要求分析を分離するIssue Form

- Source Issue: `#1`
- Design PR: `#2`
- 状態: `completed`
- Task key: `requirement-issue-form`
- priority: `high`
- agent strategy: `worker-reviewer-parent`
- task branch: `codex/requirement-issue-form`
- base branch: `develop`
- 承認記録: `2026-08-27 このチャットでTask Planを承認`

RequirementやDesign全文は複製せず、Source Issueと現在の `docs/` を参照する。このファイルは着手済み作業の実施記録である。

## 目的

要求原文と要求分析を分離し、日本語で入力できるRequirement Issue Formを提供する。

## 対象範囲

- `.github/ISSUE_TEMPLATE/requirement.yml`
- このTask fileの実施・検証・レビュー・公開記録

## 作業内容

- Issue Formの表示名、説明、title prefixを日本語化する
- 最上段に、要求原文を内容を変えずに保存する必須項目「要求」を設ける
- 要求分析として、目的・要件・受入条件を必須項目にする
- 要求分析として、制約・対象外・未確定事項を任意項目にする
- GitHub Issue Form schema、field ID、必須・任意設定を検証する

## 対象外

- `AGENTS.md`、Skill、Task template、その他文書の日本語化
- AI開発フロー、Agent / Skill責務、品質ゲートの変更
- ファイル名、設定key、既存の機械的識別子の不要なrename

## dependency

| 依存対象 | type | gate | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| Design PR `#2` | `hard` | `start` | `develop`へmerge済み | merge済み。`https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/2` |

## concerns

- GitHub Issue Form schemaを壊さず、表示文だけでなくfield構造を設計正本と一致させる必要がある
- 新規field IDは英語の機械識別子とし、既存利用可能なIDは維持する
- YAML検証のためだけに新しいrepository dependencyを追加しない

## completion criteria

- [x] Issue Formが「要求」と「要求分析」を視覚的・構造的に分離している
- [x] 「要求」は要求原文を保存する必須項目である
- [x] 目的・要件・受入条件が必須である
- [x] 制約・対象外・未確定事項が任意である
- [x] 人間に表示されるlabel、description、placeholder、title prefixが自然な日本語である
- [x] 設計・実装・Task情報を入力させる項目が含まれない
- [x] YAMLとGitHub Issue Form schemaが有効で、field IDが一意である
- [x] 共通品質ゲートと `git diff --check` の結果が記録されている
- [x] 承認済みの必須レビュー経路を完了している

## implementation result

- 変更内容: Requirement Issue Formの最上段に必須の「要求」を追加し、「要求分析」以下を必須の目的・要件・受入条件と、任意の制約・対象外・未確定事項へ再構成した。人間向け表示とtitle prefixを日本語化し、既存の機械識別子 `requirements`、`acceptance-criteria`、`out-of-scope` は維持した
- 残るrisk: Docker daemonへ接続できず、共通品質ゲートはlocalで成功確認できていない。Draft PRのCI結果を確認する必要がある

## local verification

- `git diff --check`: 成功。CRLFからLFへの変換予告warningのみで、whitespace errorなし
- PyYAML 6.0.3によるYAML parse: 成功。検証用packageはrepository外の一時directoryへ導入し、repository dependencyは追加していない
- Issue Form構造検証: 成功。body 8 block、textarea 7項目、ID形式と一意性、label一意性、必須4・任意3、先頭の `original-request`、「要求分析」区切り、既存ID維持を確認
- `sh scripts/verify.sh`: 未成功。`Docker daemonへ接続できません。Docker Desktopを起動してから再実行してください。` で終了
- `docker info`: 未成功。Docker Desktop processは起動中だが、`dockerDesktopLinuxEngine` pipeが存在せずdaemonへ接続不可

## CI

- Draft PR公開前のため未確認

## agent allocation

- Main: Task統括、最終レビュー、最終判断
- Worker: `requirement_form_worker`。Issue Form実装、静的構造確認、self reviewを担当
- Reviewer: `requirement_form_reviewer`。Requirement・merged Design・Task scope・実装差分の独立reviewを担当

## review result

- self review: 成功。Workerが担当外fileの変更なし、構造、ID、必須設定、scope逸脱なしを確認
- independent review: findingsなし（P0〜P3）。要求充足、既存ID維持、日本語表示、Issue Form schema、責務境界、scopeを確認
- Main review: findingsなし。実差分、YAML実parse、構造assertion、独立review結果を確認し、Requirement #1のうちTask 1の承認scopeを満たすと判断

## flow feedback

| category | symptom | impact | evidence | suggestion |
|---|---|---|---|---|
| verify | repository内にYAML parser依存がなく、Issue Formの実parseを共通検証だけでは確認できない | Task固有の一時検証手順が必要になり、Reviewer時点では構文検証が未実施だった | bundled PythonにもPyYAMLがなく、Mainがrepository外の一時directoryへPyYAML 6.0.3を導入してparseした | Issue Formを継続運用する段階で、repository dependencyを増やさず検証できる共通schema checkの追加を別Taskとして評価する |
| verify | Docker Desktop processは起動中だがLinux engine pipeがなく、共通品質ゲートを実行できない | `sh scripts/verify.sh` の成功確認をlocalで完了できない | `docker info` が `dockerDesktopLinuxEngine` pipe不存在で失敗し、verify scriptもdaemon未接続でexit 1 | Draft PRのCIで共通検証を確認し、local環境ではDocker engine復旧後に再実行する |
| other | Windows sandbox helperのsetup refresh errorで通常のterminal / patch操作が一時中断した | Workerが承認済み代替手段を使用し、Mainの差分確認にもsandbox外実行が必要になった | `helper_unknown_error: setup refresh had errors` がWorkerとMainで再現した | 既存のinitial bootstrap Taskに記録済みのCodex Desktop / project custom agent組合せの調査結果へ、本Taskでの再現事例を追加する |

## commit

- 未作成

## Pull Request

- 未作成

## 完了日時

- 2026-08-27
