# 成果物作成パターン

## 目的

成果物の規模とリスクに応じてAgent構成と必要能力の順序を選ぶ。個別Skill名やmodel identifierは所有しない。

## パターン

| パターン | 構成 | 適用の目安 |
|---|---|---|
| 標準 | 必要に応じたTask分解、Workerによる作成とself review、Mainによる成果物・review・verification結果の確認、提出 | Workerへ委譲する価値があり、独立Reviewerを必要とする具体的リスクがない |
| 高リスク | Task分解、Workerによる作成とself review、独立Reviewerによるreview、Mainによる最終reviewとverification確認、提出 | 独立した観点で検出したい具体的な境界リスクがある |
| 小規模 | Mainによる作成、self review、verification、提出 | 責務と挙動が明確で、Workerへ委譲する価値が低い |

どのパターンでも、Mainが実成果物、要求と設計、review結果、verification結果、未実施項目、残るリスクを直接確認して最終判断する。

## Agent構成の判断

高リスク構成は、次のような具体的な失敗を独立reviewで検出する価値がある場合に選ぶ。

- authentication、authorization、permission、secretなどのsecurity境界を変更する
- data loss、migration、不可逆操作、復旧困難な操作を扱う
- public APIや外部契約を重要な形で変更する
- 複数のserviceまたは責務境界をまたぐ
- transaction、concurrency、部分失敗、統合の複雑性を扱う
- 複数Workerの成果を統合し、相互作用の独立確認が必要である
- 人間が独立Reviewerを明示的に要求した

ファイル数、変更行数、一般的にreviewが有用という理由だけでは高リスク構成を選ばない。軽微な文言、設定、局所変更は、具体的な独立reviewの価値がなければ標準または小規模を選ぶ。

## 役割

- MainはWorkflow選択、開始ゲート、永続状態の復元、能力とReferenceの発見、Agent構成、承認、停止・再開、統合、最終判断を所有する。
- Workerは割り当てscopeで成果物を作り、self reviewと必要なverificationを行い、結果、疑問、未実施、残るリスクをMainへ返す。
- Reviewerは実装担当から独立し、指定された対象とreview criteriaに従ってfinding、確認範囲、未確認事項、remaining riskをMainへ返す。

WorkerとReviewerはWorkflowの状態、承認scope、能力選択、次工程、提出を独断で変更しない。Agentのmodelとreasoning effortは`.codex/`だけが所有する。

## 構成変更

承認後に目的、scope、対象外、依存の意味、完了条件、Agent種別、必須review経路を変える場合は再計画と人間承認へ戻る。人数や同じ構成内の担当範囲は、ファイル競合、独立性、統合コストからMainが必要最小限に調整できる。
