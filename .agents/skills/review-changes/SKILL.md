---
name: review-changes
description: 承認済みImplementation diffをRequirement充足、正しさ、回帰、architectureと責務境界、安全性、検証不足の順にreviewする。
---

# Implementation Review

Requirement Issue、現在の`docs/`、Task file、baseからの実diff、local verification結果を直接読む。Agentの報告や過去チャットだけを根拠にしない。

次を重要度順に確認する。

- Goal、Requirements、Acceptance Criteriaとcompletion criteriaを満たすか
- 対象外変更、不要dependency、無関係な整形がないか
- error、空入力、境界値、再実行、部分失敗で正しさを失わないか
- frontend / backend、service、dependency、API、data、securityの境界を破らないか
- secret、credential、個人情報、過剰権限、危険なremote操作がないか
- test、lint、typecheck、buildが変更riskを十分に覆うか
- Designと実装が矛盾せず、未導入機能を現在の契約としていないか
- agent strategyの必須review経路を満たしたか

findingは `P0`（停止が必要）、`P1`（merge前に必須修正）、`P2`（限定的不具合・契約違反・検証不足）、`P3`（小さな保守性懸念）で示す。各findingにpathと最小行範囲、具体的な影響または再現条件、必要な修正を含める。好みだけの指摘、根拠のない将来懸念、diff外の既存問題はfindingにしない。

findingがない場合も、確認したdiff、検証範囲、残るriskを示す。flow上の問題はMainへ返し、Task fileへの記録はMainに委ねる。
