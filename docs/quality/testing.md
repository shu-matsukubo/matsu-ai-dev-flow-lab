# テスト戦略

## 現在の方針

初期段階では、短時間で繰り返せるUnit Testと静的検証を中心にする。人間とAIは共通入口 `sh scripts/verify.sh` を使用し、Docker内の固定toolchainで次の品質ゲートを実行する。

| Gate | 対象 | 正本となるcommand |
|---|---|---|
| ESLint | repository内のJavaScript / TypeScript | `npm run lint` |
| TypeScript | Front / API | `npm run typecheck` |
| Unit Test | health clientとHono route | `npm run test` |
| Build | Vite production buildとAPIのTypeScript emit | `npm run build` |
| whitespace | working treeとstaged diff | `git diff --check` / `git diff --cached --check` |

各処理の定義はrootとworkspaceの`package.json`を正本とし、shell scriptとCIはそれらを呼び出す。

## 現在実施しない検証

次は初期quality gateに含めない。

- Browser E2E test
- Frontと起動済みAPIを結ぶ本格的なIntegration Test
- performance / load test
- production deployment test
- authentication、DB、外部serviceを伴うtest

未実施であることは品質保証を意味しない。RequirementのriskがUnit Testだけで覆えない場合は、Task固有の追加検証を選ぶか、testing strategy変更としてDesign Impact Checkへ戻る。

## CIと将来拡張

`.github/workflows/ci.yml` は通常のPull Request / branch品質確認として共通verify scriptを実行する。AI dispatchやIssue event orchestrationは行わない。

E2E、Integration Test、coverage gateなどは、具体的なRequirementとriskが発生した時点で追加できる。ただし、必須gateやtesting責務を大きく変える場合は先にDesign案を提示する。
