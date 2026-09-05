# Requirement Issueライフサイクル

## 目的

Requirement Issueの開始条件、永続状態からの工程復元、承認対象、停止・再開を所有する。個別能力の処理方法や識別名、共有判断基準の詳細は所有しない。

## ステータス契約

Requirement Issueでは次の4種類だけをステータスラベルとして扱い、定常状態では1種類だけを付与する。

| ラベル | 意味 |
|---|---|
| `人間：要求承認待ち` | Issueへ登録した要求を人間が確認する |
| `AI：作業可能` | 現在のチャット指示を受けたAIが、永続状態から復元した次工程を実施できる |
| `人間：PR確認待ち` | 完成したRequirement Analysis PR、設計PR、またはIssue統合PRを人間が確認する |
| `人間：タスク承認待ち` | チャットに提示されたTask計画を人間が確認する |

`人間：要求分析承認待ち`、`人間：基本設計承認待ち`、`人間：最終成果物承認待ち`は旧状態である。旧状態、未付与、複数の現行状態、現行と旧状態の競合がある場合は、移行完了まで安全停止する。ステータス以外のラベルは併用できる。

## AI作業開始ゲート

Requirement Issueに関する指示を受けたMainは、成果物、コメント、branch、Pull Request、ラベルを変更する前にGitHub上の最新Issueを取得する。次の両方を満たす場合だけ作業を開始する。

- ステータス集合が`AI：作業可能`の1種類だけである。
- 人間から対象Issueと作業を示す現在のチャット指示がある。

Mainは`AI：作業可能`を自ら付与して作業権を取得しない。過去のチャット指示、ラベル変更、Agentへの委譲だけを現在の指示として扱わない。開始条件を満たさない場合は確認した状態を報告し、永続状態を変更しない。

## 永続状態からの工程復元

開始条件を満たした後、次の情報を直接確認する。

- Requirement Issueの要求、補足、open / closed状態
- `requirements/<issue-id>.md`と、そのRequirement Analysis PRのmerge状態
- 現在の`develop`、`docs/`、設計判断記録、設計PRのmerge状態
- 承認済みTask計画を確認できる現在のチャット
- `.issue-tasks/`、Issue branch、Task branch、Task PR、Issue統合PR
- review、verification、CI、受入条件の根拠、未実施項目、残るリスク

ラベルは工程完了やmergeの証拠にしない。ラベルと永続情報が矛盾する、必要な承認を確認できない、または工程が一意に復元できない場合は、未承認工程を推測で飛ばさず停止する。

## 工程

### 要求分析

要求分析書が存在しないopen Issueでは、要求とIssue登録前の補足を入力に、要求を分析する能力を選択する。出力には目的、要件、受入条件、制約、対象外、重要な人間判断、未確定事項、確認履歴を含める。

要求範囲または受入条件に必要な人間判断が未確定な場合だけ、同じチャットで選択肢と影響を質問する。回答後は同一事項を再承認せず、要求分析書とRequirement Analysis PRの完成まで継続する。

Requirement Analysis PRは最新`develop`をbaseとし、要求分析だけを扱う。完成後は`人間：PR確認待ち`へ引き渡し、同じ指示で設計影響確認へ進まない。人間がmergeし、`AI：作業可能`へ切り替え、新しいチャット指示を行うまで停止する。

### 設計影響確認

merge済み要求分析書がある別チャットで、Requirement Issue、要求分析書、最新`develop`、最新`docs/`、関連実装とテストを入力に、設計影響を評価する能力を選択する。次の9観点を扱う。

- frontend / backend責務
- service境界と依存方向
- API契約
- authentication / authorization / session
- persistence / DBとdata ownership
- security境界
- testing strategyとCI / 品質ゲート
- AI開発フロー
- Agent / Skill責務

影響の有無にかかわらず`docs/design-decisions/<issue-id>.md`と設計PRを完成させる。新しい設計判断が必要な場合だけ選択肢、影響、推奨案を質問し、回答後は同一事項を再承認しない。

設計PR完成後は`人間：PR確認待ち`へ引き渡し、同じ指示でTask計画へ進まない。人間によるmerge後、`AI：作業可能`への切り替えと新しいチャット指示を受けた別チャットで正本を読み直す。

### Task計画

merge済み設計PRを確認した別チャットで設計影響を再評価する。追加の設計変更が不要な場合だけ、要求と設計から単一責務のTask案を作る能力を選択する。

Task計画にはTask ID、目的、scope、作業内容、対象外、寄与する受入条件、依存、停止条件、懸念、完了条件、優先度、Agent構成、必須review経路を含める。未着手計画はGitへ保存せず、branch、Pull Request、Task fileを作成しない。

人間が確認可能な計画を提示した後は`人間：タスク承認待ち`へ引き渡し、同じ指示で実装へ進まない。人間が計画を明示承認し、`AI：作業可能`へ切り替え、新しいチャット指示を行った場合だけ着手する。

### Task実装とIssue統合

承認済みTask計画を現在のチャットで確認し、[Taskと提出](task-submission.md)および[成果物作成パターン](artifact-patterns.md)から構成を選ぶ。各Taskで成果物作成、self review、必要な独立review、verification、提出を完了し、Task PRをIssue branchへ取り込む判断は人間に残す。

全Task完了後、最新`develop`をIssue branchへ取り込み、統合review、共通品質ゲート、必要な回帰検証、要求分析書の全受入条件を確認する。Issue統合PRへ各受入条件の状態と根拠、未実施項目、残るリスクを記録し、Ready for reviewにする。

完成したIssue統合PRを`人間：PR確認待ち`へ引き渡して終了する。AIはIssue統合PRをmergeせず、Requirement Issueをcloseしない。

## 人間への正式な引き渡し

正式な承認対象が完成した場合だけ、Mainが次の対応を行う。

1. 最新Issueを再取得する。
2. ステータス以外のラベルを保持する。
3. 以前のステータスを残さず、目的の人間承認待ち1種類へ置き換える。
4. 更新後のIssueを再取得し、目的の1種類だけであることを確認する。
5. 同じ作業指示では次工程へ進まず停止する。

Worker、Reviewer、個別能力はステータスを変更しない。質問への回答、CI待ち、Task PRの公開などの中間操作に新しいステータスを追加しない。

## 自動化しない境界

ラベル変更だけを契機とするAI起動、Pull Requestの自動merge、branchの自動削除、Requirement Issueの自動closeを追加しない。Issue統合PRのmerge後もIssueをopenで維持し、全受入条件と根拠を確認した人間だけが明示的にcloseする。
