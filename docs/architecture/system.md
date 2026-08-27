# システム設計

## 目的と範囲

この文書は現在有効なシステム境界と依存方向の正本である。実装の細部や将来案は重複して記載しない。

## 現在の構成

```text
Browser
  | HTTP
  v
React / Vite (`apps/front`)
  | HTTP JSON
  v
Hono / Node.js (`apps/api`)
```

1 repository内に2 applicationを置き、npm workspacesでdependency installationと品質コマンドをまとめる。monorepo frameworkやshared packageは使用しない。

## 責務と依存方向

| 境界 | 現在の責務 | 依存方向 |
|---|---|---|
| Browser | UIの表示とユーザー操作 | Frontの公開HTTP endpointだけを利用する |
| Front | UI状態、API呼び出し、API responseの最低限の検証 | APIのHTTP契約へ依存する |
| API | HTTP requestの受付とresponse生成 | Frontへ依存しない |

FrontからAPIへソースコードを共有しない。共有が必要に見える場合も、shared packageを先に導入せず設計影響確認で契約とownershipを再検討する。

## 現在のHTTP契約

`GET /api/health` は疎通確認だけを所有し、成功時にHTTP 200と `{ "status": "ok" }` を返す。Vite development serverは `/api` をAPI containerへproxyする。本格的なAPI契約管理やcode generationは未導入である。

## セキュリティとデータ境界

- authentication / authorization / sessionは存在しない。
- persistence、DB、cache、message queueは存在しない。
- 外部SaaSおよび外部credentialは使用しない。
- 現在のhealth endpointは機密情報を返さない。
- この構成はlocalのフロー検証用であり、production公開・deployment・運用securityを定義しない。

## 設計判断が必要になる変更

service境界、dependency方向、API契約方式、認証・認可・session、persistence・data ownership、security boundary、testing strategy、CI gate、AI開発フロー、Agent / Skill責務を変える要求は、実装前に [AI開発フロー](../ai-development/overview.md) の設計影響確認を行う。現在存在しない仕組みを将来の便宜だけで追加しない。
