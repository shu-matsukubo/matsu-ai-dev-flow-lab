# AI開発フロー

## 目的

この文書は、AI駆動開発の責務、承認境界、再開に必要な永続状態の正本である。アプリケーション固有の実装詳細は扱わない。

## 正本

| 情報 | 正本 | 責務 |
|---|---|---|
| 要求原文と事前の思考材料 | GitHub Issue | 要求者から受け取った要求原文と、Issue登録前に人間から得られた補足を保持する |
| 要求分析 | `requirements/<issue-id>.md` | Issueを入力として探索・比較し、人間との追加確認を経て確定した目的・要件・受入条件・制約・対象外・判断根拠・未確定事項・確認履歴を保持する |
| 設計 | `docs/` | 現在有効なアーキテクチャ、責務境界、品質戦略、AI開発フロー |
| 実装 | コードと自動テスト | 実際の振る舞いと正確な実装詳細 |
| Issue Task | `.issue-tasks/active/` と `.issue-tasks/completed/` | Requirement Issueを分解して着手したTaskの実施・検証・レビュー記録 |
| Flow Feedback | `.flow-feedback/pending/`、`.flow-feedback/resolved/`、`.flow-feedback/dismissed/` | AI開発フロー改善のための観測と処理状態。directory配置を状態の正本とする |

タスク計画はチャット上の承認対象であり、永続的な仕様ではない。要求分析書、設計文書、Task fileの間で同じ内容を正本として重複させない。Task fileへ要求分析や設計の全文を複製しない。

## 基本フロー

要求分析、設計影響確認、実装を別の承認境界として扱う。

```text
要求分析
要求Issue（要求 + 任意の補足）
  -> 要求分析
  -> 必要な探索・選択肢比較・人間への確認
  -> requirements/<issue-id>.md
  -> Requirement Analysis PR
  -> 人間が内容を確認してSquash merge
  -> 要求分析チャット終了

Requirement Analysis PR merge後の別チャット（設計変更なし）
要求Issue + merge済み要求分析書 + 最新develop + 最新docs
  -> 設計影響確認 -> タスク分解 -> 人間承認
  -> Issue branch作成 -> Issue統合Draft PR
  -> Task実装 -> レビュー -> 検証 -> Task PR -> Issue branch
  -> 最新developをmerge -> 統合レビュー・検証 -> 受入条件確認
  -> Issue統合PRをReady for review
  -> 人間がdevelopへSquash merge
  -> 人間が受入条件を確認してIssueを明示的にclose

Requirement Analysis PR merge後の別チャット（設計変更あり）
要求Issue + merge済み要求分析書 + 最新develop + 最新docs
  -> 設計影響確認 -> 影響分析 -> 設計案提示 -> 人間承認
  -> 設計PR -> merge -> 設計チャット終了

設計PR merge後の別チャット
要求Issue + merge済み要求分析書 + 最新develop + 最新docs
  -> 設計影響確認
  +-- 追加の設計変更なし -> タスク分解 -> 人間承認 -> 実装
  +-- 追加の設計変更あり -> 上記の設計変更ありの経路へ
```

merge済み要求分析書がない状態では設計影響確認やタスク分解へ進まない。要求分析PRと設計PRはそれぞれ独立した人間承認境界とし、どちらのmergeでもRequirement Issueをcloseしない。設計影響の検討は必須だが、設計文書の変更は毎回必須ではない。

## 要求Issue

原則1要求1 Issueとし、重複を許容する。Requirement Issueは要求分析前の入力を保持し、要求分析の正本にはしない。Issue Formは次の2項目を中心とする。

| 項目 | 必須 | 内容 |
|---|---|---|
| 要求 | 必須 | 要求者から受け取った内容を、AIによる要約や解釈へ置き換えず、原則として内容を変えずに記載する |
| 補足 | 任意 | Issue登録前の会話・壁打ちで得られた背景、意図、優先順位、検討案、採用・棄却理由、懸念、未確定事項などの思考材料を自由記述で残す |

補足を完成された仕様書や要求分析として整形することを要求せず、補足なしで要求だけを登録できる。人間へ新しい定型文書の手入力を求めず、人間は壁打ち、必要な判断、承認へ集中し、記録の構造化はAIが担う。

Issueの補足はIssue登録前までの思考材料である。要求分析中に発生した質問と回答は要求分析書の確認履歴へ記録し、同じ正本へ混在させない。

Requirement Issueには、完成した要求分析、利用するフレームワークやライブラリ、API endpoint、DB column、対象ファイル、実装手順、Agent構成、タスク一覧などの設計・実装・タスク情報を混在させない。これらはそれぞれ、要求分析書、`docs/`、設計影響確認、タスク分解、`.issue-tasks/`、実装で扱う。

## 要求分析

Requirement Issue登録後、`$analyze-requirement`を使用してIssueの要求と補足を読み、`requirements/<issue-id>.md`を作成する。共通構造は`requirements/TEMPLATE.md`を正本とし、ファイル名はIssue番号だけを使用してIssue titleの変更によるrenameを避ける。

要求分析書は少なくとも次を記録できる構造を持つ。

| 項目 | 内容 |
|---|---|
| 元Issue | 要求原文と補足を保持するRequirement Issueへの参照 |
| 目的 | なぜ必要か、何ができる状態になればよいか |
| 要件 | 実装方法ではなく、満たす必要がある振る舞いと条件 |
| 受入条件 | 要求達成を客観的に確認できる条件 |
| 制約 | 互換性、セキュリティ、運用など、要求として守る条件 |
| 対象外 | 今回の要求で扱わない範囲 |
| 重要な人間判断 | 検討した主要な選択肢、採用・棄却した判断、理由 |
| 未確定事項 | 明示的に残す不確実性、または設計工程へ委ねる事項 |
| 確認履歴 | 要求分析中に人間へ確認した質問、回答、確定した判断 |

要求分析はIssue本文の単純な整形や言い換えにしない。必要に応じて前提、解釈候補、複数案、利点・欠点、影響、トレードオフを整理する。要求者による判断が必要な事項をAIの推論だけで確定せず、Issueの補足から人間判断を確認できない場合は必ず人間へ質問する。AI自身の提案や推測を、人間が判断済みの事項として扱わない。

要求範囲や受入条件の確定に必要な人間判断が未回答のまま、要求分析を確定しない。未確定事項には、人間が未回答の重要判断を隠して残すのではなく、人間が明示的に後続へ委ねた事項や、要求分析時点では解消できない外部条件を記録する。

確認履歴はチャット全文の保存ではない。何が未確定で、何を質問し、どの回答によって何が確定したかを必要十分に要約する。個人情報、secret、credential、実案件固有情報、判断に不要な会話はGitへ記録しない。

### Requirement Analysis PR

要求分析書は最新の`develop`をbaseとする専用PRで公開する。PRはRequirement Issueを`Refs #<number>`などの非close形式で参照し、要求分析の内容、主要な判断、未確定事項を人間が確認できる状態にする。AI agentはPRをmergeせず、人間が承認してmergeするまで設計影響確認へ進まない。

Requirement Analysis PRのmerge後は要求分析チャットを終了する。後続は別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`を読み直して開始し、過去チャットを正本にしない。

要求分析書は実装進捗のチェックリストとして更新しない。要求や受入条件そのものを変更する必要が生じた場合だけ、後続工程を止め、専用のRequirement Analysis PRで改訂する。改訂merge後は別チャットで設計影響確認から再開する。

このフローの導入時点で要求分析書が存在しないopen Issueは一括移行せず、そのIssueの次の後続工程へ進む前に要求分析とRequirement Analysis PRを通す。完了済みIssueを遡って移行しない。

既存コードや既存Issueですでに受入条件を満たす場合は、新しい実装をせず、要求分析書の各受入条件に対する根拠を示して完了できる。

## 人間向け文章の言語

人間が読むMarkdown本文・見出し・説明、Issue Formの表示文、Task記録、Skill本文、Pull Request向け説明などは、原則として日本語で記載する。逐語訳ではなく、日本語話者が不要な言語切り替えをせず自然に理解できる表現を優先する。

ファイル名、ディレクトリ名、Skill名と呼び出し名、設定key、enum値、model identifier、branch名、command、package名、frameworkや製品の正式名称、API path、コード識別子など、機械的または技術的に英語を維持すべきものは変更しない。`Draft PR`、`develop`、`Main`、`Worker`、`Reviewer`など、英語のままの方が自然または正確な正式名称・開発用語も文脈に応じて維持する。

日本語化だけを目的としたrenameや、新しい文書カテゴリの追加は行わない。詳細な方針を複数のファイルへ重複させず、この文書を参照する簡潔な案内に留める。

## 設計影響確認

Requirement Analysis PRのmerge後に`$check-design-impact`を使用する。Requirement Issue、merge済みの`requirements/<issue-id>.md`、現在の`develop`、`docs/`、関連コードとテストを読み、次を確認する。

- frontend / backendの責務
- サービス境界と依存方向
- API契約
- 認証・認可・セッション
- 永続化・DBとデータ所有権
- セキュリティ境界
- テスト戦略とCI・品質ゲート
- AI開発フロー
- Agent / Skill責務

Issueは要求原文と事前の思考材料を確認する入力として使い、目的、要件、受入条件、制約、対象外、人間判断の正本にはmerge済み要求分析書を使う。要求分析書が存在しない、またはRequirement Analysis PRが未mergeの場合は設計影響確認を開始せず、要求分析工程へ戻る。

設計判断に必要な影響分析には、責務境界、既存契約、互換性、セキュリティ、データ、品質ゲート、関連ルール間の整合性への影響確認を含める。これは禁止される実装計画ではない。

設計変更が必要と判断したチャットでは、後続の具体的なTask、実装対象ファイル、作業順序、実装手順、Agent割り当てを決めず、`$plan-tasks`を使用しない。設計上必然的に生じる影響範囲は説明できるが、具体的な実装計画へ落とし込まない。

影響がなく、設計文書の変更も不要なら、その理由と根拠を簡潔に示してタスク分解へ進む。単なる事実訂正や明確化も設計PRとして実装と分離でき、設計PRを作成する場合は同じチャット分離の規則を適用する。

新しいアーキテクチャ判断、既存アーキテクチャの変更、新しいサービスや依存関係、認証方式、永続化方式、API契約方式、テスト戦略の大幅変更、新しい設計文書やtop-level文書カテゴリ、AI開発フローの重要変更が必要なら、勝手に決めず選択肢・影響・推奨案を人間へ提示する。承認後に元Issueを`Refs #<number>`で参照する設計PRを作り、mergeまで実装を開始しない。設計PRは要求Issueをcloseしない。

設計PR作成後はタスク分解や実装へ進まず、人間によるmergeを待つ。merge後はその設計チャットを完了する。実装は別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`を改めて入力し、設計影響確認から再開する。

## タスク分解と承認ゲート

Requirement Analysis PRがmerge済みであることを前提とする。設計PRが不要と判断した場合だけ、その設計影響確認を行ったチャットで`$plan-tasks`へ進む。設計PRが必要だった場合は、そのPRがmergeされた後に別の実装チャットを開始し、Requirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`から設計影響を再評価する。追加の設計変更が不要と判断できた場合に初めて`$plan-tasks`を使用する。

`$plan-tasks`ではmerge済み要求分析書の目的、要件、受入条件、制約、対象外を根拠に、1 Task = 1責務のレビュー可能な計画をチャットへ提示する。各Taskは目的、対象範囲、作業内容、対象外、依存、懸念事項、完了条件、優先度、Agent構成、必須レビュー経路を持つ。人間の明示承認前に書き込みを開始しない。

Agent構成（`agent strategy`）は次から選ぶ。通常は `worker-parent-review` を既定とし、Task固有の事情から別の構成が適切な場合だけ切り替える。

| Agent構成 | 選択基準 | 必須経路 |
|---|---|---|
| `parent-only` | ごく小さく責務と挙動が明確で、Workerへ委譲する価値が低い | Mainが実装・セルフレビュー・最終判断 |
| `worker-parent-review` | 通常の既定構成。独立Reviewerを必要とする具体的な理由がない | Workerが実装・セルフレビュー、Mainがレビュー・最終判断 |
| `worker-reviewer-parent` | 独立Reviewerを追加する具体的な理由があり、独立した観点による追加レビューに明確な価値がある | Workerが実装・セルフレビュー、独立Reviewerがレビュー、Mainが最終レビュー |

`worker-reviewer-parent` を選ぶ場合は、タスク計画に独立Reviewerが必要な具体的理由を示す。検討する代表例は次のとおりである。

- 認証・認可・権限・secretなどのセキュリティ境界を変更する
- データ消失、migration、不可逆操作の可能性がある
- public APIや外部契約を重要な形で変更する
- 複数の責務境界やservice境界をまたぐ
- transaction、concurrency、部分失敗など、不具合の検出が難しい処理を扱う
- 複数Workerの成果を統合し、独立した統合レビューに明確な価値がある
- 復旧が難しい、または失敗時の影響が大きい
- 人間が独立Reviewerを明示的に求めている

これらは機械的なチェックリストではなく、追加レビューの価値を判断するための観点である。該当項目があるだけで自動的に独立Reviewerを追加せず、Task固有のリスク、境界の複雑さ、検出したい不具合を説明する。具体的な根拠を説明できなければ `worker-parent-review` を選ぶ。ファイル数、変更行数、または「レビューには一般的に価値がある」という抽象的な理由だけでは `worker-reviewer-parent` を選ばない。軽微な文言・設定・局所的変更も、独立Reviewerを追加する具体的理由がない限り `worker-reviewer-parent` の対象にしない。

どの構成でも、Workerを使用する場合のセルフレビューとMainによる実差分・検証結果の確認、最終レビュー、最終判断は省略しない。独立ReviewerはMainの最終レビューを代替しない。

承認対象はAgent構成と必須経路までであり、人数や担当範囲は固定しない。承認後にMainが責務境界、独立性、依存、ファイル競合、統合コストから必要最小限を決める。目的、アーキテクチャ判断、対象範囲、対象外、完了条件、依存の意味、Agent種別、必須レビュー経路を変える場合は再承認する。検証結果、レビュー結果、Agent割り当て、commit、PRなどの記録更新は、対象範囲を変えない限り追加承認を要しない。

## Requirement Issue単位の実装統合

実装のGit / GitHub上の統合境界はRequirement Issue単位とする。Taskは要求内部のレビュー可能な作業単位として維持するが、Taskの途中成果を直接`develop`へ入れず、Issue branchを共通の親・統合点として扱う。

```text
develop
  |
  +-- issue/<issue-id>
        |
        +-- task/<issue-id>-<task-id> -> Task PR -> issue/<issue-id>
        +-- task/<issue-id>-<task-id> -> Task PR -> issue/<issue-id>
        +-- task/<issue-id>-<task-id> -> Task PR -> issue/<issue-id>
        |
        +-- Issue統合PR -> develop
```

各対象の責務は次のとおりとする。

| 対象 | 責務 |
|---|---|
| Requirement Issue | 要求原文とIssue登録前の補足、および要求を追跡するGitHub上の識別子 |
| Requirement Analysis | 目的、要件、受入条件、制約、対象外、人間判断、未確定事項、確認履歴の正本 |
| Design | 現在有効な設計の正本 |
| Issue統合PR | 1つのRequirement Issueによる実装成果を`develop`へ統合し、要求分析書の受入条件を追跡・レビューする入口 |
| Task / Task PR | Requirement Issue内部の実装・レビュー・検証単位 |
| コードと自動テスト | 実際の振る舞いと正確な実装詳細の正本 |

### branchとPull Requestの開始

タスク分解が人間に承認された後、最新の`develop`から`issue/<issue-id>` branchを作成し、`develop`をbaseとするIssue統合PRをDraftで作成する。Issue統合Draft PRは、Task実装の完了を待たず、要求全体の進行状態をGitHub上から復元する入口として早い段階で用意する。

各Taskは、そのTaskを開始する時点の最新Issue branchから`task/<issue-id>-<task-id>` branchを作成する。Task PRは対応するIssue branchをbaseとするDraftで公開し、`develop`を直接baseにしない。Task fileは従来どおりTaskの実装と同じbranch・Task PRへ含める。

同一Requirement Issue内でTask間に依存がある場合は、先行Task PRをIssue branchへ取り込んだ後、後続Taskを最新のIssue branchから開始する。独立したTaskは、ファイル競合、統合コスト、Agent構成を考慮して並列に進めてよい。Task branch同士を直接依存させることを既定にしない。

### developとの同期とRequirement Issue間の独立性

Issue branchを常に最新の`develop`へ追従させることは要求しない。Issue branch作成時は最新の`develop`を起点とし、全Task完了後のIssue統合レビュー前には最新の`develop`をIssue branchへmergeして、競合解消、統合検証、回帰検証を行う。それ以外でも、`develop`側の変更がTaskや統合判断へ影響するとMainが判断した場合は追加で同期してよい。

同期は`develop`をIssue branchへmergeする方式を基本とし、共有branchをrebaseしたりforce pushしたりしない。途中のdevelop merge履歴はIssue branchに残してよく、最終的にIssue統合PRをSquash mergeすることで`develop`上の履歴をRequirement Issue単位へまとめる。

複数のIssue branchは互いに直接mergeせず、別のIssue branchをbaseにせず、未mergeの実装へ直接依存しない。他のRequirement Issueの成果が必要な場合は、原則としてその成果が`develop`へmergeされた後に`develop`経由で取り込む。同じ領域を変更したIssue間の競合は、Task間の暗黙的な競合ではなく、Requirement Issue単位の統合問題として扱う。

### mergeとbranchの終了

Task PRとIssue統合PRはいずれもSquash mergeを基本とする。Task PRをIssue branchへmergeした後、不要になったTask branchは削除してよい。Issue統合PRを`develop`へmergeした後、不要になったIssue branchは削除してよい。

AI agentはTask PRおよびIssue統合PRをmergeせず、PRの作成・更新、レビュー、検証、状態確認と判断根拠の記録までを担う。AI agentはRequirement Issueをcloseしない。Squash merge、branch削除、Requirement Issueのcloseは人間が行い、Issue統合PRのmergeによってcloseを自動化しない。

### Issue統合Draft PR

Issue統合Draft PRには、本文を複製せず、次の正本と状態を辿れる参照を記録する。

- 対応するRequirement Issue
- merge済み要求分析書とRequirement Analysis PR
- 関連するDesignと設計PR
- 対応するTask、Task file、Task PRとその状態
- Requirement Issue全体の検証状況と未実施項目
- 要求分析書の受入条件ごとの充足根拠
- 最新`develop`の取り込みと、重要な競合・判断の記録

全Taskが完了し、最新の`develop`を取り込んだ状態で必要な統合・回帰検証と受入条件確認が完了した後に、Issue統合PRをReady for reviewへ変更する。Draft状態やPR本文を要求・設計・実装の新しい正本にはせず、各正本と永続的な作業状態を結ぶ索引として扱う。

## Task file

未着手のタスク計画はGitへ保存しない。Taskへ着手した時点で `.issue-tasks/TEMPLATE.md` から `.issue-tasks/active/<date>-<task>.md` を作り、実装と同じTask branch / Task PRへ含める。Task fileだけのPull Requestは作らない。

Task fileは元Issue、merge済み要求分析書、Issue branch、Issue統合PRと現在の設計を参照し、実施結果、検証、CI、Agent割り当て、レビュー、commit、Task PRを記録する。Flow Feedback本文はTask fileへ記録せず、追跡が必要な場合だけ対応するfeedback fileへの参照を持たせる。完了時に `.issue-tasks/completed/` へ移し、同じTask PRの成果としてIssue branchへ取り込む。Task fileだけを後から別branchや別PRで更新しない。

## Main / Worker / Reviewer

- Main: タスク分解、承認境界、Agent割り当て、アーキテクチャ判断、統合判断と調整、最終レビュー、最終判断、およびFlow Feedbackの観測確認と新規記録を所有する。
- Worker: 割り当て範囲の実装、必要な検証、セルフレビューを行い、結果・疑問・フロー改善フィードバックをMainへ返す。
- Reviewer: Workerから独立して、要求充足、回帰、アーキテクチャや責務境界の違反、検証不足を確認し、指摘とフロー改善フィードバックをMainへ返す。

modelとreasoning effortは `.codex/` の責務であり、Skillへ記載しない。

## レビューと検証

WorkerまたはMainは実装後にセルフレビューを行う。承認済みAgent構成のレビュー経路を満たした後、MainがIssue、merge済み要求分析書、設計、Task file、実際のdiff、検証結果を直接確認する。指摘は正しさ、安全性、回帰、責務境界、検証不足を重要度順に扱い、好みだけの指摘を避ける。

検証は `$verify-changes` を使い、共通入口 `sh scripts/verify.sh` でlint、typecheck、Unit Test、build、`git diff --check`を実行する。リスクに応じたTask固有検証を追加し、未実施・失敗は理由と残るリスクを記録して成功扱いにしない。

## Pull RequestとIssue完了

通常の実装は、1 Requirement Issue = 1 Issue branch = 1 Issue統合PR、1 Task = 1 Task branch = 1 Task PRの二階層とする。Task PRは対応するIssue branch、Issue統合PRは`develop`をbaseにする。Requirement Analysis PRと設計PRはこの実装用branch構造から分離し、`develop`をbaseにする。

Requirement Analysis PR、設計PR、Task PR、Issue統合PRの本文では、対応するRequirement Issueを`Refs #<number>`または通常のリンクなど、closeを伴わない形式で参照する。`Closes`、`Fixes`、`Resolves`およびGitHubが同等に扱う自動closeキーワードは使用しない。Requirement Issueとの追跡関係は維持しながら、どのPRのmergeでもIssueを自動closeさせない。

Main、Worker、Reviewerを含むAI agentとSkillは、受入条件の充足状況にかかわらずRequirement Issueをcloseしない。IssueをcloseするGitHub Actionsなどの自動化も導入しない。すべてのPR merge後もRequirement Issueはopenのまま維持し、要求分析書の全受入条件とその根拠を人間が確認した後に限り、人間が明示的にcloseする。

Requirement Analysis PRは、要求分析の内容、主要な選択肢と判断、確認履歴、未確定事項を人間が承認する境界である。設計PRとTask PRには、そのPRの範囲が要求分析書のどの受入条件へ寄与するか、根拠、未対象または未充足の事項を記録する。Issue統合PRとAI agentの完了報告には、要求分析書の受入条件を1件ずつ確認した充足状況と根拠、未実施項目、残るリスクを示し、人間がIssue完了を判断できる状態にする。途中のPRやTaskだけを根拠にRequirement Issue全体を完了扱いにしない。

要求分析書自体を実装進捗の記録場所にせず、受入条件の達成状況と根拠はIssue統合PRへ記録する。

GitHubへのリモート操作はGitHub連携だけを使用し、`git push`、`gh`、GitHub APIの直接呼び出しへ切り替えない。AI agentはPRをmergeしない。

Task PR作成後は、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、Task file、Task PR、diff、レビュー・CI結果から別チャットで再開できる。Issue統合時は、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、取り込み済みTask PR、Task file、最新`develop`との差分、統合検証、受入条件の根拠から状態を復元する。

## チャットと永続状態の境界

- 要求分析チャットはRequirement Issueの要求と補足から開始し、必要な探索、選択肢比較、人間への質問、回答の記録、要求分析書とRequirement Analysis PRの作成までを担う。
- Requirement Analysis PR作成後は設計影響確認へ進まず、人間によるmergeを待つ。merge後に要求分析チャットを完了する。
- 設計影響確認は別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`を読み直して開始する。要求分析書がない場合は要求分析工程へ戻る。
- 設計PRが不要な場合は、その設計影響確認を行ったチャットでタスク分解へ進める。
- 設計変更または既存設計の明確化により設計PRが必要な場合は、そのチャットの責務を影響分析、設計案の承認、設計PRの作成までに限定し、後続のタスク分解や具体的な実装計画を行わない。
- 設計PR作成後は後続へ進まず、merge後にその設計チャットを完了する。
- 実装は別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`を改めて入力し、設計影響確認から再開する。
- 過去チャット上の未永続な要求分析、タスク計画、実装計画を復元・引き継がず、現在の正本から必要な判断と計画を作る。
- タスク分解の承認後、Issue branchとIssue統合Draft PRを作成し、最初のTask PRを公開するまでは同じチャットで継続する。
- Task PR後はRequirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、Task file、Task PR、diff、レビュー・CI結果から別チャットで復元できる。
- Issue統合レビューは、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、取り込み済みTask PR、Task file、最新`develop`との差分と検証結果から別チャットでも復元できる。
- 未着手のタスク計画は復元対象にせず、必要なら現在状態から再計画する。

過去チャットの記憶だけを判断根拠にしない。

## フロー改善フィードバック

Flow Feedbackは監査ログや完全なイベントログではなく、AI開発フローを改善するためのbest-effortな観測情報である。正本は`.flow-feedback/`以下の1件1ファイルとし、Issue Taskの実施記録から分離する。

### ファイルと状態

`.flow-feedback/`は次の構成を持つ。

```text
.flow-feedback/
  TEMPLATE.md
  pending/
  resolved/
  dismissed/
```

| directory | 意味 |
|---|---|
| `pending/` | 未処理。改善または対応不要の最終判断が完了していない |
| `resolved/` | 改善として処理済み |
| `dismissed/` | 根拠を確認し、対応不要として処理済み |

状態はファイルの配置だけを正本とする。`status: pending`のような同一情報を本文へ重複して持たせず、単に読んだだけではファイルを移動しない。

ファイル名は`i<issue-id>-t<task-id>-f<feedback-id>.md`とする。例は`i01-t01-f01.md`である。Issue IDは発生元Requirement Issue、Task IDは同一Issue内で一意なTask識別子、feedback IDは同一Issue / Task内で一意な識別子を使用する。repository全体の連番管理は導入せず、categoryや問題内容をファイル名へ重複して持たせない。

各feedback fileは最低限、次を記録する。

- 発生元Issue
- 発生元Task
- 発生元PR。存在しない場合はその旨
- `category`
- `symptom`（発生事象）
- `impact`
- `evidence`
- `suggestion`（改善候補）

要求や設計の全文、個人情報、secret、credentialは複製しない。Task fileへfeedback本文を複製せず、必要な場合だけfeedback fileへの参照を記録する。

### 通常Taskでの責務

Worker / ReviewerはAI開発フロー上の問題を観測した場合、Task本来の作業を広げずMainへ返す。Mainは観測事実を確認し、必要な場合だけ`.flow-feedback/pending/`へ新しいfeedback fileを追加する。問題がなければfeedback fileを作らない。

通常Taskでは新規feedbackの記録だけを行い、次を行わない。

- 既存feedbackの検索・整理
- 重複feedbackの統合
- 改善要否の判断
- 既存feedbackの更新、削除、`resolved/`または`dismissed/`への移動
- feedbackを理由とする承認範囲外のSkillまたはAI開発フロー変更

同種の問題が複数Taskで観測されても自動統合せず、それぞれを独立した観測として保持する。

### AIフロー改善作業

AIフロー改善は通常Taskとは別のRequirement Issueとして行い、その時点の`.flow-feedback/pending/`をまとめて確認できる。feedbackごとにRequirement Issueを大量作成せず、同種または関連する複数feedbackを1つの改善Requirementで扱ってよい。ただし、元feedback fileは統合または削除しない。

各feedbackは次のいずれかとして処理する。

- 改善が必要: 通常の要求分析、設計影響確認、必要な設計承認、タスク分解、実装、レビュー、検証を通し、改善が完了した後に`resolved/`へ移動する
- 対応不要: 根拠を確認して記録した後に`dismissed/`へ移動する

分析とレビューには複数Agentを利用してよいが、永続状態を変更するwriterは1つに限定する。少なくとも、`.flow-feedback/`内の既存fileの更新・移動、SkillやAI開発フロー文書、改善対象となる共通fileを複数Agentが並行して直接変更しない。lock file、lease、DB、schedulerなどの排他制御基盤は導入しない。

### 収集範囲

Flow Feedbackの完全収集は保証しない。観測漏れを許容し、mergeされず完全に破棄されたTask、branch、Pull Requestだけに存在したfeedbackを救済する特殊フローは導入しない。必要な問題が繰り返し発生する場合は、将来のTaskから再度観測されることを許容する。

中央`feedback.md`、外部DB、GitHub Actionsによる自動集約、scheduler、重複排除、自動改善は導入しない。改善自体がAI開発フローやSkill責務を変える場合は、新しいRequirement Issue、要求分析、設計影響確認を通す。

### 既存Task記録からの移行

この方式の導入時は、既存の`.tasks/`を`.issue-tasks/`へ変更し、既存Task file内のfeedbackを1観測1ファイルのまま`.flow-feedback/pending/`へ移す。重複統合、改善要否の判断、`resolved/`または`dismissed/`への振り分けは行わない。Task fileからfeedback本文を削除し、追跡に必要な場合だけ移行先への参照を残す。

Requirement Issueの運用開始前に記録されたfeedbackは、移行専用のIssue ID `00`をファイル名へ使用し、発生元Issueを「なし（Issue運用開始前）」と明記する。`i00`は既存記録の移行だけに使用し、新しいfeedbackには使用しない。
