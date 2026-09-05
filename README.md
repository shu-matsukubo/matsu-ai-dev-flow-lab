# matsu-ai-dev-flow-lab

AI駆動開発で、要求入力・要求分析・設計・タスク・実装・テスト・レビュー・承認ゲート・Agent / Skillの責務を安全に分離できるか研究するPublicリポジトリです。アプリケーション機能の充実より、再開可能でレビュー可能な開発フローを優先します。

## アプリケーション

- `apps/front`: React + TypeScript + Vite
- `apps/api`: Hono + TypeScript
- 疎通契約: Frontから`GET /api/health`を呼び出す最小構成

DB、認証、認可、外部SaaS、OpenAPI、code generation、shared package、deployment構成は導入していません。

## セットアップ

Docker DesktopとDocker Compose v2が必要です。

~~~sh
sh scripts/setup.sh
docker compose up front api
~~~

Frontは`http://localhost:5173`、API healthは`http://localhost:3000/api/health`で確認できます。リポジトリ更新後は`sh scripts/refresh.sh`、共通品質ゲートは`sh scripts/verify.sh`を使用します。

TLS inspection環境でnpm registry用の追加CAが必要な場合は、local PEM fileのpathを`NPM_CA_FILE`に設定してscriptを実行します。CAはBuildKit secretとしてだけ使用され、repositoryやimageへ保存されません。

## AI開発フロー

AI開発フローは、変更頻度と責務の異なる情報を次の場所へ分離しています。

- 安定した作業原則: [AGENTS.md](AGENTS.md)
- 正本と能力発見の入口: [AI開発フロー](docs/ai-development/overview.md)
- 工程、承認、停止・再開: [Workflow](docs/ai-development/workflows/)
- 複数能力で共有する判断基準: [Reference](docs/ai-development/references/)
- 実行時に発見する単一能力: `.agents/skills/*/SKILL.md`
- Agentの役割と実行設定: `.codex/agents/`

Workflowは必要な能力を意味、入力、期待する出力で指定し、個別Skill名を固定しません。Skillは一つの能力だけを提供し、Referenceは判断知識だけを提供します。詳細な工程をREADMEへ複製せず、作業時点のWorkflowとReferenceを参照してください。

現在のアプリケーション境界は[システム設計](docs/architecture/system.md)、共通品質ゲートは[テスト戦略](docs/quality/testing.md)を正本とします。
