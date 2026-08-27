# matsu-ai-dev-flow-lab

AI駆動開発で、要求・設計・タスク・実装・テスト・レビュー・承認ゲート・Agent / Skillの責務を安全に分離できるか研究するPublicリポジトリです。アプリケーション機能の充実より、再開可能でレビュー可能な開発フローを優先します。

## アプリケーション

- `apps/front`: React + TypeScript + Vite
- `apps/api`: Hono + TypeScript
- 疎通契約: Frontから `GET /api/health` を呼び出す最小構成

DB、認証、認可、外部SaaS、OpenAPI、code generation、shared package、deployment構成は導入していません。

## セットアップ

Docker DesktopとDocker Compose v2が必要です。

```sh
sh scripts/setup.sh
docker compose up front api
```

Frontは `http://localhost:5173`、API healthは `http://localhost:3000/api/health` で確認できます。リポジトリ更新後は `sh scripts/refresh.sh`、共通品質ゲートは `sh scripts/verify.sh` を使用します。

TLS inspection環境でnpm registry用の追加CAが必要な場合は、local PEM fileのpathを `NPM_CA_FILE` に設定してscriptを実行します。CAはBuildKit secretとしてだけ使用され、repositoryやimageへ保存されません。

## AI開発フロー

```text
設計変更なし
要求Issue -> 設計影響確認 -> タスク分解 -> 承認
          -> 実装 -> レビュー -> 検証 -> Draft PR -> 要求確認

設計PRが必要（設計変更または既存設計の明確化）
要求Issue -> 設計影響確認 -> 影響分析 -> 設計案提示 -> 承認
          -> 設計PR -> merge -> 別チャットで設計影響確認から再開
```

設計の検討は常に行います。設計変更または既存設計の明確化により設計PRが必要な場合は、mergeまで具体的なタスク分解や実装計画へ進まず、merge後に元Issue・最新の`develop`・最新の`docs/`から別チャットで再評価します。設計文書の変更は影響がある場合だけ行います。

詳細は次を参照してください。

- [現在のシステム設計](docs/architecture/system.md)
- [テスト戦略](docs/quality/testing.md)
- [AI開発フロー](docs/ai-development/overview.md)
