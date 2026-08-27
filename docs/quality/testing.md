# テスト戦略

## 現在の方針

初期段階では、短時間で繰り返せるUnit Testと静的検証を中心にする。人間とAIは共通入口 `sh scripts/verify.sh` を使用し、Docker内の固定toolchainで次の品質ゲートを実行する。

| 品質ゲート | 対象 | 正本となるコマンド |
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

未実施であることは品質保証を意味しない。要求のリスクがUnit Testだけで覆えない場合は、タスク固有の追加検証を選ぶか、テスト戦略変更として設計影響確認へ戻る。

## Pull Requestごとの品質責務

Task PRとIssue統合PRは、どちらも共通品質ゲートを省略しない一方で、確認する統合境界を分ける。

| Pull Request | base | 品質上の責務 |
|---|---|---|
| Task PR | 対応するIssue branch | Taskの変更が承認範囲と完了条件を満たし、その時点のIssue branchへ安全に取り込めることを確認する |
| Issue統合PR | `develop` | Requirement Issue全体が最新の`develop`へ統合可能で、回帰を起こさず、受入条件を満たすことを確認する |

Task PRでは共通入口`sh scripts/verify.sh`と、Taskの変更リスクに応じた追加検証を行う。Issue統合PRでは、全Task完了後に最新の`develop`をIssue branchへmergeし、競合を解消した状態で共通品質ゲート、必要な統合・回帰検証、受入条件の充足確認を行う。

現行の共通品質ゲートが短時間で完了する間は、Task PRとIssue統合PRの両方で同じゲートを実行する。変更内容や実行コストに応じた追加検証と重複の調整はMainが必要十分な範囲で判断してよいが、Task単位とRequirement Issue全体の責務を取り違えない。CI最適化だけを理由に複雑な条件分岐や新しい運用概念を追加しない。

## CIと今後の拡張

`.github/workflows/ci.yml` は、Issue branchをbaseとするTask PR、`develop`をbaseとするIssue統合PR、その他の通常のPull Request / branch品質確認で共通verify scriptを実行する。AI dispatch、Issue branchの自動同期、Issue event orchestrationは行わない。

E2E、Integration Test、coverage gateなどは、具体的な要求とリスクが発生した時点で追加できる。ただし、必須ゲートやテスト責務を大きく変える場合は先に設計案を提示する。
