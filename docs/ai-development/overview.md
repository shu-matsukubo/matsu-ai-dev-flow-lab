# AI開発フロー

## 目的

この文書は、AI駆動開発の責務、承認境界、再開に必要な永続状態の正本である。アプリケーション固有の実装詳細は扱わない。

## 正本

| 情報 | 正本 | 責務 |
|---|---|---|
| 要求原文と事前の思考材料 | GitHub Issue | 要求者から受け取った要求原文と、Issue登録前に人間から得られた補足を保持する |
| 作業権と次の確認対象 | Requirement Issueのステータスラベル | 4種類のうち1種類で現在の作業権、完成PR、またはタスク計画の確認対象を示す。工程完了の証拠にはしない |
| 要求分析 | `requirements/<issue-id>.md` | Issueを入力として探索・比較し、人間との追加確認を経て確定した目的・要件・受入条件・制約・対象外・判断根拠・未確定事項・確認履歴を保持する |
| 現在有効な設計 | `docs/`内の各設計正本 | 現在有効なアーキテクチャ、責務境界、品質戦略、AI開発フロー |
| Requirement Issueごとの設計判断 | `docs/design-decisions/<issue-id>.md` | 設計影響、確定した判断、現在有効な設計正本への反映有無を保持し、基本設計PRの成果物と工程復元の根拠にする |
| 実装 | コードと自動テスト | 実際の振る舞いと正確な実装詳細 |
| Issue Task | `.issue-tasks/active/` と `.issue-tasks/completed/` | Requirement Issueを分解して着手したTaskの実施・検証・レビュー記録 |
| Flow Feedback | `.flow-feedback/pending/`、`.flow-feedback/resolved/`、`.flow-feedback/dismissed/` | AI開発フロー改善のための観測と処理状態。directory配置を状態の正本とする |

タスク計画はチャット上の承認対象であり、永続的な仕様ではない。要求分析書、設計文書、Task fileの間で同じ内容を正本として重複させない。Task fileへ要求分析や設計の全文を複製しない。

## 基本フロー

要求分析、基本設計、タスク計画、実装を別の成果境界として扱う。要求分析と基本設計は、追加の人間判断が必要な場合だけ進行中のチャットで質問し、回答後は同じ判断への再承認を求めず、完成PRの作成まで同じチャットで継続する。Requirement Issueのステータスラベルは、現在の作業権または完成した確認対象を示し、各工程の詳細や完了証拠は既存の正本から復元する。

```text
Requirement Issue作成
  -> 人間：要求承認待ち
  -> 人間が要求を確認し、AI：作業可能へ切り替えてチャットで指示
  -> 要求分析
      +-- 人間判断が必要 -> 同じチャットで質問・回答 -> 要求分析を継続
      +-- 追加判断なし   -> そのまま要求分析を継続
  -> requirements/<issue-id>.md -> Requirement Analysis PR
  -> 人間：PR確認待ち -> AI作業終了

Requirement Analysis PRを人間がmerge
  -> AI：作業可能へ切り替えて別チャットで指示
  -> 基本設計
      +-- 人間判断が必要 -> 同じチャットで質問・回答 -> 基本設計を継続
      +-- 追加判断なし   -> そのまま基本設計を継続
  -> docs/design-decisions/<issue-id>.md
  -> 現在有効な設計の変更があれば同じ設計PRで設計正本を更新
  -> 設計PR
  -> 人間：PR確認待ち -> AI作業終了

設計PRを人間がmerge
  -> AI：作業可能へ切り替えて別チャットで指示
  -> 最新の正本とmerge済み設計判断を確認 -> タスク計画
  -> 人間：タスク承認待ち -> AI作業終了

タスク計画を人間が承認
  -> AI：作業可能へ切り替えてチャットで指示
  -> Issue branch作成 -> Issue統合Draft PR
  -> Task実装 -> レビュー -> 検証 -> Task PR -> Issue branch
  -> 最新developをmerge -> 統合レビュー・検証 -> 全受入条件確認
  -> Issue統合PRをReady for review
  -> 人間：PR確認待ち -> AI作業終了

人間が最終成果物を確認
  -> Issue統合PRをdevelopへSquash merge
  -> 全受入条件と根拠を確認してRequirement Issueを明示的にclose
```

進行中の質問と回答は正式な引き渡しではないため、ステータスを変更しない。回答は質問で特定した判断について確定済みとして扱い、基本設計案など別の名目で再承認を要求しない。

ステータスラベルを人間承認や成果物完成の証拠として扱わない。完成PRまたはタスク計画を人間へ引き渡した作業指示では次の工程へ進まず、再開には人間による確認、必要なPRのmerge、`AI：作業可能`への切り替え、新しいチャット指示を必要とする。merge済み要求分析書がない状態では基本設計やタスク分解へ進まず、merge済み設計PRと設計判断記録がない状態ではタスク計画へ進まない。

## 要求Issue

原則1要求1 Issueとし、重複を許容する。Requirement Issueは要求分析前の入力を保持し、要求分析の正本にはしない。Issue Formは次の2項目を中心とする。

| 項目 | 必須 | 内容 |
|---|---|---|
| 要求 | 必須 | 要求者から受け取った内容を、AIによる要約や解釈へ置き換えず、原則として内容を変えずに記載する |
| 補足 | 任意 | Issue登録前の会話・壁打ちで得られた背景、意図、優先順位、検討案、採用・棄却理由、懸念、未確定事項などの思考材料を自由記述で残す |

補足を完成された仕様書や要求分析として整形することを要求せず、補足なしで要求だけを登録できる。人間へ新しい定型文書の手入力を求めず、人間は壁打ち、必要な判断、承認へ集中し、記録の構造化はAIが担う。

Issueの補足はIssue登録前までの思考材料である。要求分析中に発生した質問と回答は要求分析書の確認履歴へ記録し、同じ正本へ混在させない。

Requirement Issueには、完成した要求分析、利用するフレームワークやライブラリ、API endpoint、DB column、対象ファイル、実装手順、Agent構成、タスク一覧などの設計・実装・タスク情報を混在させない。これらはそれぞれ、要求分析書、`docs/`、設計影響確認、タスク分解、`.issue-tasks/`、実装で扱う。

### ステータスラベル

Requirement Issueでは次の4種類だけを有効なステータスラベルとして扱う。

| ラベル | 作業権または確認対象 |
|---|---|
| `人間：要求承認待ち` | Issueへ登録した要求を人間が確認する |
| `AI：作業可能` | 人間のチャット指示を受けたAIが、永続情報から復元した次工程を実施できる |
| `人間：PR確認待ち` | Requirement Analysis PR、設計PR、または人間確認可能になったIssue統合PRを確認する |
| `人間：タスク承認待ち` | チャットへ提示されたタスク計画を人間が確認する |

`人間：PR確認待ち`は完成したPRだけに使用する。Task PRはIssue統合前の中間成果であり、作成またはmergeのたびにステータスを切り替えない。どのPRを確認するかと工程の現在地は、Requirement Issueを参照するPR、merge状態、要求分析書、設計判断記録、Task記録、Issue統合PRから復元する。

定常状態では4種類のうち1種類だけを付与し、ステータス以外のラベルは併用できる。ステータスラベルは作業権と次の確認対象を示す補助的な永続情報であり、要求、要求分析、設計、Task、Pull Request、検証結果の正本を置き換えない。

repositoryの既定branchは`main`とし、開発作業の起点とIssue統合PRのbaseは`develop`とする。4種類のラベルはIssue Formを有効にする前にrepository labelとして用意し、Requirement Issue Formの既定ラベルによって新規Issueへ`人間：要求承認待ち`を自動付与する。Requirement Issue Formは既定branch上の内容がGitHubで利用されるため、変更を`develop`へ取り込んだだけでは有効化完了と扱わない。人間が管理する`develop`から`main`への反映後に、初期ラベルを含む外部動作を確認する。Issue単位で`main`へ直接backportせず、初期付与のためのIssue event orchestrationや、ラベル変更だけを契機とするAIの自動起動も導入しない。

旧契約の`人間：要求分析承認待ち`、`人間：基本設計承認待ち`、`人間：最終成果物承認待ち`は廃止対象とし、有効なステータス以外の通常ラベルへ読み替えない。移行中にいずれかが付与されているIssueは、永続情報から現在地を確認し、人間が有効な4種類のうち適切な1種類へ移行するまで不整合として停止する。新しい契約を有効にする前に`人間：PR確認待ち`を用意し、後続作業を行うopen Issueを個別に移行する。完了済みIssueの履歴ラベルを遡及変更する必要はない。

ラベルの未作成、Issue Formの付与失敗、手動操作の不備によりステータスが未付与、競合、または旧契約のままになった場合は、自動補正によってAIへ作業権を与えず、安全側に停止する。

### AI作業開始ゲート

AIはRequirement Issueに関する作業指示を受けるたびに、成果物作成や工程進行より先にGitHub上の最新Issueを取得し、有効な4種類と廃止対象3種類のステータスラベルを抽出する。次のすべてを満たす場合に限り作業を開始する。

- 有効なステータスラベル集合が`AI：作業可能`の1種類だけである。
- 廃止対象のステータスラベルが付与されていない。
- 人間から対象Issueと作業を示す現在のチャット指示がある。

人間確認待ち、ステータス未付与、複数ステータス競合、または廃止対象ラベルの残存では、確認したラベル状態とAIが作業可能でないことを報告し、成果物作成、工程進行、Issueコメント、ステータス変更を行わず終了する。AIは自ら`AI：作業可能`を付与して作業権を取得せず、過去の作業指示やラベル変更だけを新しい指示として扱わない。

開始条件を満たしても、`AI：作業可能`だけを前工程の承認やmergeの証拠として扱わない。Requirement Issue、merge済み要求分析書、設計判断記録、設計PR、Task記録、Task PR、Issue統合PRなどを読み、次工程を一意に復元する。ラベルと永続情報が矛盾する場合、または必要なmergeや承認を確認できない場合は、未承認工程を推測で飛ばさず不整合を報告して停止する。

### 人間への引き渡し

AIが現在工程の正式な確認対象を完成させた場合だけ、`AI：作業可能`を対応する人間確認待ちへ切り替える。切り替えではステータス以外のラベルを保持し、以前の有効または廃止対象ステータスを残さず、変更後のIssueを再取得して目的の有効ステータス1種類だけであることを確認する。変更または確認に失敗した場合は次工程へ進まず、不完全な引き渡しとして報告する。

| AIが完成させた確認対象 | 引き渡し先 |
|---|---|
| 要求分析書とRequirement Analysis PR | `人間：PR確認待ち` |
| 設計判断記録、必要な設計正本の変更、および設計PR | `人間：PR確認待ち` |
| 人間が承認可能なタスク計画 | `人間：タスク承認待ち` |
| 全Task、統合・回帰検証、全受入条件確認を終えたIssue統合PR | `人間：PR確認待ち` |

要求分析または基本設計の途中で人間判断が必要になった場合は、選択肢、影響、推奨案を同じチャットで質問する。この質問ではステータスを変更せず、人間の回答を特定した判断の確定として扱う。回答後は同じ判断への追加承認や新しい開始依頼を求めず、同じチャットで工程成果物とPRの作成まで継続する。

AIは人間確認待ちへ切り替えた同じ作業指示で後続工程を続けない。人間はPRまたはタスク計画を確認し、PRが確認対象の場合は必要なmergeを行った後、以前のステータスを残さず`AI：作業可能`へ切り替え、新しいチャット指示を行う。

Flow Feedback評価案など、タスク分解以降で既存設計が個別に要求する一時的な質問と回答もチャット内で扱う。QA専用または工程別AIステータスを追加せず、正式な引き渡し前に人間確認待ちへ切り替えない。

タスク計画は従来どおりチャット上の正式な確認対象とし、未着手計画をGitへ保存しない。タスク計画と人間の承認を現在のチャットから確認できない場合は、`AI：作業可能`だけを承認の証拠にせず、現在の正本から計画を再提示して承認を取り直す。

Task PRのmerge、設計PRやRequirement Analysis PRのCI確認など、正式な確認対象が完成するまでに必要な中間操作のための追加ステータスは設けない。ラベル遷移によってPull RequestをmergeしたりRequirement Issueをcloseしたりせず、既存の人間確認境界を維持する。

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

要求分析書は最新の`develop`をbaseとする専用PRで公開する。PRはRequirement Issueを`Refs #<number>`などの非close形式で参照し、要求分析の内容、主要な判断、未確定事項を人間が確認できる状態にする。人間判断が必要な場合は同じチャットで質問し、回答後は同じ判断への再承認を求めずPR作成まで継続する。専用PRを作成した後、AIはRequirement Issueを`人間：PR確認待ち`へ切り替えて終了し、PRをmergeせず、基本設計へ進まない。

人間がRequirement Analysis PRをmergeして内容を承認した後、Requirement Issueを`AI：作業可能`へ切り替えて新しいチャット指示を行う。後続は別チャットでRequirement Issue、merge済み要求分析書、最新の`develop`、最新の`docs/`を読み直して開始し、過去チャットを正本にしない。

要求分析書は実装進捗のチェックリストとして更新しない。要求や受入条件そのものを変更する必要が生じた場合だけ、後続工程を止め、専用のRequirement Analysis PRで改訂する。改訂merge後は別チャットで設計影響確認から再開する。

このフローの導入時点で要求分析書が存在しないopen Issueは一括移行せず、そのIssueの次の後続工程へ進む前に要求分析とRequirement Analysis PRを通す。完了済みIssueを遡って移行しない。

既存コードや既存Issueですでに受入条件を満たす場合は、新しい実装をせず、要求分析書の各受入条件に対する根拠を示して完了できる。

## 人間向け文章の言語

人間が読むMarkdown本文・見出し・説明、Issue Formの表示文、Task記録、Skill本文、Pull Request向け説明などは、原則として日本語で記載する。逐語訳ではなく、日本語話者が不要な言語切り替えをせず自然に理解できる表現を優先する。

ファイル名、ディレクトリ名、Skill名と呼び出し名、設定key、enum値、model identifier、branch名、command、package名、frameworkや製品の正式名称、API path、コード識別子など、機械的または技術的に英語を維持すべきものは変更しない。`Draft PR`、`develop`、`Main`、`Worker`、`Reviewer`など、英語のままの方が自然または正確な正式名称・開発用語も文脈に応じて維持する。

日本語化だけを目的としたrenameや、新しい文書カテゴリの追加は行わない。詳細な方針を複数のファイルへ重複させず、この文書を参照する簡潔な案内に留める。

## 設計影響確認

Requirement Analysis PRのmerge後に`$check-design-impact`を使用し、この工程を基本設計として完結させる。Requirement Issue、merge済みの`requirements/<issue-id>.md`、現在の`develop`、`docs/`、関連コードとテストを読み、次を確認する。

- frontend / backendの責務
- サービス境界と依存方向
- API契約
- 認証・認可・セッション
- 永続化・DBとデータ所有権
- セキュリティ境界
- テスト戦略とCI・品質ゲート
- AI開発フロー
- Agent / Skill責務

Issueは要求原文と事前の思考材料を確認する入力として使い、目的、要件、受入条件、制約、対象外、人間判断の正本にはmerge済み要求分析書を使う。要求分析書が存在しない、Requirement Analysis PRが未merge、またはRequirement Issueの開始ゲートを満たさない場合は基本設計を開始しない。

### 設計判断記録

基本設計ではRequirement Issueごとに`docs/design-decisions/<issue-id>.md`を作成し、同じIssueで要求分析の改訂または設計変更が生じた場合は最新の判断へ更新する。設計判断記録は少なくとも、元Issueと要求分析書、上記9観点の影響分類と根拠、確定した設計判断、現在有効な設計正本への反映有無、未確定事項、未対象、残るリスクを保持する。

設計判断記録はRequirement Issue単位の基本設計成果物と工程復元の根拠であり、現在有効な設計正本や要求分析書を置き換えない。要求や設計の全文、実装対象ファイル、作業順序、Task、Agent割り当てを複製せず、現在有効な設計は従来どおり各設計正本へ反映する。

現在有効な設計の変更または明確化が必要な場合は、設計判断記録と該当する設計正本を同じ設計PRで更新する。現在有効な設計を変更する必要がない場合も、影響なしの根拠を設計判断記録へ記載し、その記録だけを変更する設計PRを作成する。Issueコメントだけを基本設計の完成成果物とせず、どちらの経路でもPRを人間の最終確認点とする。

### 人間判断と設計PR

新しいアーキテクチャ判断、既存アーキテクチャの変更、新しいserviceや依存関係、認証方式、persistence方式、API契約方式、テスト戦略の大幅変更、新しい設計文書カテゴリ、AI開発フローの重要変更など、人間判断が必要な事項がある場合は、選択肢、影響、推奨案、未決事項を同じチャットで提示する。人間の回答は質問で特定した判断について確定済みとして設計判断記録へ要約し、同じ事項への追加承認を求めず設計PR作成まで継続する。追加の人間判断がなければ途中確認を挟まず設計PRを作成する。

設計PRは最新の`develop`をbaseとし、元Issueを`Refs #<number>`などの非close形式で参照する。設計PR本文には、その変更範囲が寄与する要求分析書の受入条件、根拠、未対象または未充足の事項を記録する。PR作成後はRequirement Issueを`人間：PR確認待ち`へ切り替えて終了し、AIはPRをmergeせず、同じ作業指示でタスク計画や実装へ進まない。

人間が設計PRをmergeし、Requirement Issueを`AI：作業可能`へ切り替えて新しいチャット指示を行った後、後続の別チャットでRequirement Issue、merge済み要求分析書、merge済み設計判断記録、最新の`develop`、最新の`docs/`を読む。要求変更や設計の新たな変化がなければ、回答済みの判断やmerge済み設計を再承認させず、同じチャットで`$plan-tasks`へ進む。新しい設計判断が必要になった場合だけ基本設計へ戻り、新しい設計PRを作成する。

## タスク分解と承認ゲート

Requirement Analysis PRと最新の設計PRがmerge済みで、`docs/design-decisions/<issue-id>.md`から基本設計の完了を確認できることを前提とする。Requirement Issueが`AI：作業可能`で新しいチャット指示を受けた後、Requirement Issue、merge済み要求分析書、merge済み設計判断記録、最新の`develop`、最新の`docs/`を確認する。要求変更または新たな設計影響がなければ、merge済み設計への再承認を求めず、同じチャットで`$plan-tasks`を使用する。新しい設計判断が必要な場合だけ基本設計へ戻る。

`$plan-tasks`ではmerge済み要求分析書の目的、要件、受入条件、制約、対象外を根拠に、1 Task = 1責務のレビュー可能な計画をチャットへ提示する。各Taskは目的、対象範囲、作業内容、対象外、依存、懸念事項、完了条件、優先度、Agent構成、必須レビュー経路を持つ。計画提示後はRequirement Issueを`人間：タスク承認待ち`へ切り替えて終了し、branch、Pull Request、Task fileを作成しない。

人間が計画を明示承認し、Requirement Issueを`AI：作業可能`へ切り替えて新しいチャット指示を行った後にだけ書き込みを開始する。計画または承認を現在のチャットから確認できない場合は再計画・再承認へ戻る。

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
main（repository既定branch）
  ^
  | 人間が管理するdevelopからの反映
  |
develop（開発統合branch）
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
| Requirement Issue | 要求原文とIssue登録前の補足、および要求を追跡するGitHub上の識別子。ステータスラベルは現在の作業権と次の人間承認対象を示す |
| Requirement Analysis | 目的、要件、受入条件、制約、対象外、人間判断、未確定事項、確認履歴の正本 |
| Design | 現在有効な設計の正本 |
| Issue統合PR | 1つのRequirement Issueによる実装成果を`develop`へ統合し、要求分析書の受入条件を追跡・レビューする入口 |
| Task / Task PR | Requirement Issue内部の実装・レビュー・検証単位 |
| コードと自動テスト | 実際の振る舞いと正確な実装詳細の正本 |

### branchとPull Requestの開始

タスク分解が人間に承認された後、最新の`develop`から`issue/<issue-id>` branchを作成し、`develop`をbaseとするIssue統合PRをDraftで作成する。repositoryの既定branchが`main`であっても、Requirement Issueの作業branchを`main`から開始しない。PR作成時はGitHub UIの既定候補に依存せず、Issue統合PRのbaseが`develop`、Task PRのbaseが対応するIssue branchであることを明示的に確認する。Issue統合Draft PRは、Task実装の完了を待たず、要求全体の進行状態をGitHub上から復元する入口として早い段階で用意する。

各Taskは、そのTaskを開始する時点の最新Issue branchから`task/<issue-id>-<task-id>` branchを作成する。Task PRは対応するIssue branchをbaseとするDraftで公開し、`develop`を直接baseにしない。Task fileは従来どおりTaskの実装と同じbranch・Task PRへ含める。

同一Requirement Issue内でTask間に依存がある場合は、先行Task PRをIssue branchへ取り込んだ後、後続Taskを最新のIssue branchから開始する。独立したTaskは、ファイル競合、統合コスト、Agent構成を考慮して並列に進めてよい。Task branch同士を直接依存させることを既定にしない。

### developとの同期とRequirement Issue間の独立性

Issue branchを常に最新の`develop`へ追従させることは要求しない。Issue branch作成時は最新の`develop`を起点とし、全Task完了後のIssue統合レビュー前には最新の`develop`をIssue branchへmergeして、競合解消、統合検証、回帰検証を行う。それ以外でも、`develop`側の変更がTaskや統合判断へ影響するとMainが判断した場合は追加で同期してよい。

同期は`develop`をIssue branchへmergeする方式を基本とし、共有branchをrebaseしたりforce pushしたりしない。途中のdevelop merge履歴はIssue branchに残してよく、最終的にIssue統合PRをSquash mergeすることで`develop`上の履歴をRequirement Issue単位へまとめる。

複数のIssue branchは互いに直接mergeせず、別のIssue branchをbaseにせず、未mergeの実装へ直接依存しない。他のRequirement Issueの成果が必要な場合は、原則としてその成果が`develop`へmergeされた後に`develop`経由で取り込む。同じ領域を変更したIssue間の競合は、Task間の暗黙的な競合ではなく、Requirement Issue単位の統合問題として扱う。

### mergeとbranchの終了

Task PRとIssue統合PRはいずれもSquash mergeを基本とする。Task PRをIssue branchへmergeした後、不要になったTask branchは削除してよい。Issue統合PRを`develop`へmergeした後、不要になったIssue branchは削除してよい。`develop`から`main`への反映は個別Task PRやIssue統合PRから分離し、人間が管理する。Issue単位のbranchから`main`へ直接backportしない。既定branchだけで有効になるGitHub設定を変更したRequirement Issueは、`main`への反映と外部動作の確認前に該当する受入条件を充足扱いにしない。

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

- Main: タスク分解、承認境界、Agent割り当て、アーキテクチャ判断、統合判断と調整、最終レビュー、最終判断、およびFlow Feedbackの観測確認と新規記録を所有する。Requirement Issue作業の開始時には最新ステータスと永続情報を確認し、工程完了時には対応する人間承認待ちへの引き渡しを所有する。承認済みのFlow Feedback処理では、処理対象、評価の統合、人間承認の境界、既存fileと共通fileの単一writer責務を所有する。
- Worker: 割り当て範囲の実装、必要な検証、セルフレビューを行い、結果・疑問・フロー改善フィードバックをMainへ返す。Requirement Issueのステータスを変更しない。
- Reviewer: Workerから独立して、要求充足、回帰、アーキテクチャや責務境界の違反、検証不足を確認し、指摘とフロー改善フィードバックをMainへ返す。Requirement Issueのステータスを変更しない。

Mainも`AI：作業可能`を自ら付与せず、WorkerまたはReviewerへの委譲を開始ゲートの代替にしない。modelとreasoning effortは `.codex/` の責務であり、Skillへ記載しない。

## レビューと検証

WorkerまたはMainは実装後にセルフレビューを行う。承認済みAgent構成のレビュー経路を満たした後、MainがIssue、merge済み要求分析書、設計、Task file、実際のdiff、検証結果を直接確認する。指摘は正しさ、安全性、回帰、責務境界、検証不足を重要度順に扱い、好みだけの指摘を避ける。

検証は `$verify-changes` を使い、共通入口 `sh scripts/verify.sh` でlint、typecheck、Unit Test、build、`git diff --check`を実行する。リスクに応じたTask固有検証を追加し、未実施・失敗は理由と残るリスクを記録して成功扱いにしない。

ステータスラベルと工程境界を変更するTaskでは、共通品質ゲートに加えて少なくとも次を確認する。

- 有効な4種類のラベル名、廃止対象3種類の扱い、Requirement Issue Formの初期ラベル、repositoryの既定branchが`main`であること、作業branchとIssue統合PRが`develop`を起点・baseとしていること、Issue Formが`main`へ反映された後の外部動作が設計と一致する
- `AI：作業可能`だけの場合、人間確認待ち、未付与、複数競合、廃止対象ラベル残存の場合の開始判定が設計どおりである
- 要求分析と基本設計について、追加判断なしの経路と同一チャットで質問・回答する経路の双方が、途中ステータス変更や同一判断への再承認なしでPR作成まで到達する
- Requirement Analysis PR、設計PR、Issue統合PRの完成時は`人間：PR確認待ち`、タスク計画の完成時は`人間：タスク承認待ち`へ、以前のステータスを残さず非ステータスラベルを保持して移行する
- 設計変更の有無にかかわらず設計判断記録と設計PRが作成され、merge済み成果物から後続工程を復元できる
- Task PRなどの中間操作、チャット内の質問、回答済み判断の継続で不要なステータス遷移が発生しない
- ラベル変更だけでAI実行、Pull Request merge、Requirement Issue closeが起きない
- GitHub上で新しいラベルの用意、open Issueの移行、初期付与、遷移を確認する必要がある場合、その実確認を未実施のまま成功扱いにしない

共通品質ゲート自体は変更せず、repository外部状態を伴う確認はTask固有検証とIssue統合検証へ明示する。

## Pull RequestとIssue完了

通常の実装は、1 Requirement Issue = 1 Issue branch = 1 Issue統合PR、1 Task = 1 Task branch = 1 Task PRの二階層とする。Task PRは対応するIssue branch、Issue統合PRは`develop`をbaseにする。Requirement Analysis PRと設計PRはこの実装用branch構造から分離し、`develop`をbaseにする。

Requirement Analysis PR、設計PR、Task PR、Issue統合PRの本文では、対応するRequirement Issueを`Refs #<number>`または通常のリンクなど、closeを伴わない形式で参照する。`Closes`、`Fixes`、`Resolves`およびGitHubが同等に扱う自動closeキーワードは使用しない。Requirement Issueとの追跡関係は維持しながら、どのPRのmergeでもIssueを自動closeさせない。

Main、Worker、Reviewerを含むAI agentとSkillは、受入条件の充足状況にかかわらずRequirement Issueをcloseしない。IssueをcloseするGitHub Actionsなどの自動化も導入しない。全Task、最新`develop`との統合、回帰検証、全受入条件確認を終えてIssue統合PRを人間が確認可能な状態にした後、MainはRequirement Issueを`人間：PR確認待ち`へ切り替えて終了する。人間がIssue統合PRをmergeした後もRequirement Issueはopenのまま維持し、要求分析書の全受入条件とその根拠を人間が確認した後に限り、人間が明示的にcloseする。

Requirement Analysis PRは、要求分析の内容、主要な選択肢と判断、確認履歴、未確定事項を人間が承認する境界である。設計PRとTask PRには、そのPRの範囲が要求分析書のどの受入条件へ寄与するか、根拠、未対象または未充足の事項を記録する。Issue統合PRとAI agentの完了報告には、要求分析書の受入条件を1件ずつ確認した充足状況と根拠、未実施項目、残るリスクを示し、人間がIssue完了を判断できる状態にする。途中のPRやTaskだけを根拠にRequirement Issue全体を完了扱いにしない。

要求分析書自体を実装進捗の記録場所にせず、受入条件の達成状況と根拠はIssue統合PRへ記録する。

GitHubへのリモート操作はGitHub連携だけを使用し、`git push`、`gh`、GitHub APIの直接呼び出しへ切り替えない。AI agentはPRをmergeしない。

Task PR作成後は、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、Task file、Task PR、diff、レビュー・CI結果から別チャットで再開できる。Issue統合時は、Requirement Issue、merge済み要求分析書、現在の設計、Issue統合PR、取り込み済みTask PR、Task file、最新`develop`との差分、統合検証、受入条件の根拠から状態を復元する。

## チャットと永続状態の境界

- AIはRequirement Issueに関する各作業指示の開始時に最新ステータスを確認し、開始ゲートを満たさなければ永続状態を変更せず終了する。
- 要求分析チャットはRequirement Issueの要求と補足から開始し、必要な探索、選択肢比較、人間への質問、回答の記録、要求分析書とRequirement Analysis PRの作成までを担う。質問中はステータスを変更せず、回答後は同じ判断への再承認を求めない。PR作成後は`人間：PR確認待ち`へ引き渡して終了する。
- Requirement Analysis PRを人間がmergeし、`AI：作業可能`への切り替えと新しい指示を行った後、基本設計を別チャットで開始する。
- 基本設計は設計変更の有無にかかわらず設計判断記録と設計PRを作成する。人間判断が必要な場合だけ同じチャットで質問し、回答後は設計PR作成まで継続する。PR作成後は`人間：PR確認待ち`へ引き渡し、タスク分解や実装へ進まない。
- 設計PRのmerge後、人間が`AI：作業可能`への切り替えと新しい指示を行った別チャットで、merge済み設計判断記録と最新の正本を確認する。新しい設計判断がなければ、merge済み設計を再承認させずタスク計画へ進む。
- タスク計画を提示した後は`人間：タスク承認待ち`へ引き渡して終了する。未着手計画はGitへ保存しない。
- 人間がタスク計画を承認し、`AI：作業可能`への切り替えと新しい指示を行った後、Issue branch、Issue統合Draft PR、Task file、Task branchを開始する。
- 過去チャット上の未永続な要求分析、タスク計画、実装計画を正本として復元しない。タスク計画と承認を現在のチャットから確認できない場合は再計画・再承認へ戻る。
- Task PR後はRequirement Issue、merge済み要求分析書、merge済み設計判断記録、現在の設計、Issue統合PR、Task file、Task PR、diff、レビュー・CI結果から別チャットで復元できる。
- Issue統合レビューは、Requirement Issue、merge済み要求分析書、merge済み設計判断記録、現在の設計、Issue統合PR、取り込み済みTask PR、Task file、最新`develop`との差分と検証結果から別チャットでも復元できる。
- Issue統合PRを人間が確認可能な状態にした後は`人間：PR確認待ち`へ引き渡して終了し、AIはmergeまたはIssue closeを行わない。
- Flow Feedback処理は専用Requirement Issue、merge済み要求分析書、merge済み設計判断記録、現在の設計、処理対象の`pending/` file、Task file、Pull Request、評価案への人間承認から別チャットでも復元できる。
- 改善Requirement Issueまたは別Issueへ引き継いだfeedbackは、そのIssueの最終結果が確定するまで`pending/`を維持する。引き継ぎ先は別チャットで通常フローを開始する。

過去チャットの記憶やステータスラベルだけを判断根拠にしない。

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

### Flow Feedback処理

Flow Feedbackの一括処理は、通常Taskでの新規観測記録や改善実装から分離し、専用のRequirement Issueを単位として行う。1回の処理Issueで複数の`pending/` fileを扱い、feedback 1件ごとのIssue作成を前提にしない。処理Issueも既存の要求分析、設計影響確認、必要な設計承認、タスク承認、二階層PR、レビュー、検証、Issue完了の境界を省略しない。

`$record-flow-feedback`は通常Taskで新しい観測を記録する責務だけを持ち、既存feedbackを処理しない。`$process-flow-feedback`は承認済みのFlow Feedback処理Taskでだけ使用し、既存feedbackの一括収集、評価案の作成、人間承認後の処理記録、file移動、Requirement Issueへの引き継ぎを担う。通常Taskから`$process-flow-feedback`を使用しない。

#### 処理対象と評価

処理開始時に対象とする`pending/` file群を識別し、その集合を処理単位として固定する。対象確定後に追加されたfeedbackを暗黙に処理範囲へ含めず、別の処理単位へ残す。

各feedbackについて、次を確認する。

- 必須項目、発生元Issue、Task、PR、観測根拠
- 現在有効な要求分析、設計、実装、テストとの整合性
- 同じ原因または改善候補を持つ他のfeedbackとの関係
- 重複、既存対応、前提変更、既に解消済みの内容
- 対応効果、影響範囲、独立した承認や優先順位判断の必要性

複数Agentを評価へ利用する場合も、WorkerとReviewerは読み取り分析と提案に限定し、Mainが評価を統合する。既存feedback、AI開発フロー文書、Skill、その他の共通fileを変更するwriterはMainだけに限定する。

Mainは各feedbackの分類、判断根拠、関連feedbackのまとめ方、作成または参照するRequirement Issueを評価案として提示する。人間が評価案を承認するまで、既存feedbackの更新・移動、引き継ぎ先Requirement Issueの作成・更新、改善実装を行わない。分類、まとめ方、対象範囲を変更する場合は再承認を受ける。

#### 処理記録と正本

元の観測内容はfeedback fileに維持し、処理のたびに必要十分な記録を同じfileへ追記する。処理記録は少なくとも次を辿れるようにする。

- Flow Feedback処理のRequirement Issue、Task、PR
- 「対応する」「対応不要」「別Issueとして扱う」の分類
- 分類と最終結果の根拠
- 関連するfeedback file
- まとめて扱う改善Requirement Issueまたは独立した別Issue
- 必要な対応の完了、または対応不要の確定を示す最終結果

分類や関連Issueは判断履歴であり、fileの処理状態ではない。処理状態は`pending/`、`resolved/`、`dismissed/`の配置だけを正本とし、本文へ`status`などの状態metadataを追加しない。中央一覧fileを新設せず、IssueやTask fileへfeedback本文を大量に複製しない。IssueとTaskはfeedback fileへの参照を持ち、feedback fileは処理Issueと引き継ぎ先Issueへの参照を持つ。

#### 分類と状態遷移

| 分類 | 処理 | fileの状態 |
|---|---|---|
| 対応する | 関連するfeedbackを責務、影響範囲、依存関係から可能な範囲でまとめ、改善Requirement Issueへ引き継ぐ。引き継ぎ先でも通常の要求分析以降の承認境界を通す | 必要な対応の最終結果が確定するまで`pending/` |
| 対応不要 | 重複、既存対応、前提変更、効果とコストなどの根拠を記録する | 根拠を記録した同じ変更で`dismissed/`へ移動 |
| 別Issueとして扱う | 大きな設計変更、独立した要求、異なる承認や優先順位判断が必要な内容を独立したRequirement Issueへ引き継ぐ | Issueを作成しただけでは完了とせず`pending/` |

改善Requirement Issueまたは別Issueで必要な対応が完了し、その根拠を確認できた場合は、最終結果を記録して`resolved/`へ移動する。引き継ぎ先で対応不要と確定した場合は、その根拠を記録して`dismissed/`へ移動する。関連Issueが未完了、結果が確認できない、またはIssueを作成しただけの場合は`pending/`を維持する。Flow Feedback処理Issue自体の完了を、引き継いだfeedbackの処理完了とは扱わない。

元の観測fileは統合または削除しない。同じ改善Requirement Issueへ複数feedbackを引き継ぐ場合も、各fileから共通のIssueを辿れる状態を維持する。

#### 既存フローとの統合

```text
Flow Feedback処理用Requirement Issue
  -> 要求分析 -> Requirement Analysis PR -> 人間がmerge
  -> 別チャットで設計影響確認
  -> 必要な設計承認 -> タスク承認
  -> $process-flow-feedbackでpending群を収集・評価
  -> 人間が評価案を承認
  +-- 対応不要 -> 根拠を記録 -> dismissed/
  +-- 対応する -> まとめた改善Requirement Issue -> 通常フロー
  |                                      +-- 対応完了 -> resolved/
  |                                      +-- 対応不要 -> dismissed/
  +-- 別Issue -> 独立Requirement Issue -> 通常フロー
                                         +-- 対応完了 -> resolved/
                                         +-- 対応不要 -> dismissed/
```

引き継ぎ先のRequirement Issueは要求原文とIssue登録前の補足だけを保持し、feedback fileの詳細を複製せず参照で結ぶ。要求分析書、設計、Task、Task PR、Issue統合PRの責務は既存フローと同じとする。AI agentは処理Issue、引き継ぎ先Issue、Pull Requestをmergeまたはcloseしない。

共通品質ゲートは`sh scripts/verify.sh`を維持する。Flow Feedback処理の変更リスクに応じて、対象file集合、命名規則、必須項目、状態metadataの不在、処理記録、Issue参照、移動前後の欠落・重複を確認する追加検証を選ぶ。CI gate、外部DB、scheduler、lock service、自動Issue作成、自動改善は追加しない。
### 収集範囲

Flow Feedbackの完全収集は保証しない。観測漏れを許容し、mergeされず完全に破棄されたTask、branch、Pull Requestだけに存在したfeedbackを救済する特殊フローは導入しない。必要な問題が繰り返し発生する場合は、将来のTaskから再度観測されることを許容する。

中央`feedback.md`、外部DB、GitHub Actionsによる自動集約、scheduler、重複排除、feedbackごとの自動Issue作成、自動改善は導入しない。改善自体がAI開発フローやSkill責務を変える場合は、新しいRequirement Issue、要求分析、設計影響確認を通す。

### 既存Task記録からの移行

この方式の導入時は、既存の`.tasks/`を`.issue-tasks/`へ変更し、既存Task file内のfeedbackを1観測1ファイルのまま`.flow-feedback/pending/`へ移す。重複統合、改善要否の判断、`resolved/`または`dismissed/`への振り分けは行わない。Task fileからfeedback本文を削除し、追跡に必要な場合だけ移行先への参照を残す。

Requirement Issueの運用開始前に記録されたfeedbackは、移行専用のIssue ID `00`をファイル名へ使用し、発生元Issueを「なし（Issue運用開始前）」と明記する。`i00`は既存記録の移行だけに使用し、新しいfeedbackには使用しない。
