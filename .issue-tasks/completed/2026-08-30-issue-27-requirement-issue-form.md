# Requirement Issue入力構造の簡素化

- 元Issue: `#27`
- 要求分析書: `requirements/27.md`
- Requirement Analysis PR: `#29`
- 設計PR: `#28`
- 状態: `completed`
- タスクキー: `issue-form`
- 優先度: `normal`
- Agent構成: `parent-only`
- Issue branch: `issue/27`
- Issue統合PR: `#30`
- Issue統合PRのベースブランチ: `develop`
- タスクブランチ: `task/27-issue-form`
- Task PR: `#31`
- Task PRのベースブランチ: `issue/27`
- 承認記録: `2026-08-30のIssue #27タスク計画承認`

要求や設計全文は複製せず、元Issue、merge済み要求分析書、現在の`docs/`を参照する。このファイルは着手済み作業の実施記録である。

## 目的

Requirement Issue Formを、要求原文とIssue登録前の任意の補足だけを入力する構造へ変更する。

## 対象範囲

- `.github/ISSUE_TEMPLATE/requirement.yml`
- このTaskの実施記録

## 作業内容

- 「要求」を必須入力として維持し、要求原文を内容を変えず記録する説明へ整える
- 「補足」を任意の自由記述として追加する
- Issue登録時に要求していた完成済み要求分析の入力欄を除去する
- 要求分析はIssue登録後に別ファイルで行うことを案内する

## 対象外

- 要求分析書templateと`$analyze-requirement`の作成
- 後続のAgent、Skill、Task、PR運用の整合
- `docs/`およびアプリケーションコードの変更

## 依存関係

| 依存対象 | 種類 | ゲート | 完了条件 | 現在状態と根拠 |
|---|---|---|---|---|
| 設計PR `#28` | hard | start | 人間によるmerge | merge済み |
| Requirement Analysis PR `#29` | hard | start | 人間によるmerge | merge済み、`requirements/27.md`が`develop`に存在する |

## 懸念事項

- GitHub Issue Formの構文を壊すと要求Issueを登録できなくなる
- 「補足」が事実上の必須入力や完成済み要求分析として読まれない文言にする必要がある

## 完了条件

- [x] 入力欄が必須の「要求」と任意の「補足」を中心とする
- [x] 「要求」が要求原文を内容を変えず記録する方針を示す
- [x] 「補足」がIssue登録前の思考材料を自由記述できる
- [x] 補足なしで要求Issueを登録できる
- [x] Issue FormがRequirement Issue自体を要求分析の正本として扱わない

## 実装結果

- 変更内容: Issue Formを必須の「要求」、要求分析の別file化を説明する案内、任意の「補足」へ整理した
- 残るリスク: GitHub上で新規Issue作成画面を操作するE2E確認は未実施

## ローカル検証

- `Get-Content -Raw .github/ISSUE_TEMPLATE/requirement.yml`: 2つのtextarea、label、required設定を目視確認して成功
- `sh scripts/verify.sh`: Git Bash経由で成功
  - ESLint: 成功
  - TypeScript typecheck: 成功
  - Unit Test: 4件成功
  - Build: 成功
  - `git diff --check`: 成功
- YAML parserによる追加検証: bundled PythonにPyYAMLが存在しないため未実施。既存依存を変更せず、構造の直接確認で代替した

## CI

- GitHub Actions CI run #58（run id `33302942161`）: 成功

## Agent割り当て

- Mainが`parent-only`として実装、セルフレビュー、最終判断を担当する

## レビュー結果

- セルフレビュー: 指摘なし。入力欄、必須・任意設定、要求原文保持、別file化の案内、対象外変更がないことを確認
- 独立レビュー: strategy対象外
- Mainレビュー: 指摘なし。AC-01からAC-05への寄与とIssue branchへの取り込み可能性を確認

## Flow Feedback参照

- 現時点で新規feedbackなし

## commit

- local commit: `757893bae0f3e10b2c44a3cd4f53323b4731f6a1`
- GitHub連携で公開したcommit: `7a539660d75898be12622f544a147e6fcb7276bd`

## Pull Request

- Draft Task PR: [#31](https://github.com/shu-matsukubo/matsu-ai-dev-flow-lab/pull/31)
- head: `task/27-issue-form`
- base: `issue/27`

## 完了報告

- このTaskが寄与する受入条件と根拠: AC-01からAC-05。必須の`original-request`、任意の`supplement`、要求分析を別file化する案内が根拠
- 未対象または未充足の事項: AC-06以降は後続TaskとIssue統合で確認する
- 未実施項目: GitHub上のIssue作成画面操作
- 残るリスク: GitHub UI固有の表示はTask PR上で確認が必要
- Requirement Issueの状態: PR取り込み後もopen。全受入条件と根拠を確認した人間だけが明示的に完了する
- AI agentによるIssue完了操作: 行わない

## 完了日時

- 2026-08-30
