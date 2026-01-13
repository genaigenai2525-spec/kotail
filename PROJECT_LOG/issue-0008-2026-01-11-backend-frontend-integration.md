# バックエンド実装 & フロントエンド連携

## Goal
- TDDでバックエンドサービス（articleService）を実装
- Supabaseとフロントエンドを連携
- DBにデータを入れると即座にページが表示される仕組みを構築

## Done
### バックエンド（TDD）
- Vitest + Supabase環境構築
- `articleService.ts` 実装
  - `searchArticles(keyword)` - title/contentのilike検索
  - `fetchArticles({companyId, tag?, page?})` - フィルタ＋ページネーション
  - `createArticle(payload)` - バリデーション付き投稿
- ユニットテスト20件（モック）
- 統合テスト8件（実DB）
- **合計28件パス**

### Supabase
- プロジェクト「kotail」作成（東京リージョン）
- `articles`テーブル作成（ENUM tag付き）
- `companies`テーブル作成
- RLSポリシー設定（読み取り専用）
- テストデータ投入（会社1件、記事3件）

### フロントエンド連携
- `companyService.ts`（getCompanyById, getAllCompanies）
- 動的ルート `/company/[companyId]`
  - Server Component（データ取得）
  - Client Component（タブ切替、ページネーション）
  - loading.tsx, not-found.tsx
- APIルート `/api/articles`（ページネーション用）
- `src/app/page.tsx` → リダイレクト化

## Discoveries
- Next.js 16のparamsはPromise型になっている
- company_id/user_idはUUID型のため、テストデータもUUID形式が必要
- dotenvでvitest用の環境変数読み込みが必要

## Decisions
- Server Component + Client Component分離で効率的なデータ取得
- タブ切替はクライアントサイドフィルタ（初期データを全件取得）
- RLSポリシーは読み取り専用（投稿機能は将来対応）

## Notes
- Vercelデプロイは手動対応
- 企業一覧ページは既存ページと後で連携予定
- AI要約は手動入力（後々Claude APIで自動化）

## Files Changed
### 追加
- `backend/types/article.ts`
- `backend/types/company.ts`
- `backend/services/articleService.ts`
- `backend/services/companyService.ts`
- `backend/lib/supabase.ts`
- `backend/tests/setup.ts`
- `backend/tests/features.test.ts`
- `backend/tests/mocks/supabaseMock.ts`
- `backend/tests/integration/articleService.integration.test.ts`
- `src/lib/supabase.ts`
- `src/app/company/[companyId]/page.tsx`
- `src/app/company/[companyId]/CompanyPageClient.tsx`
- `src/app/company/[companyId]/loading.tsx`
- `src/app/company/[companyId]/not-found.tsx`
- `src/app/api/articles/route.ts`
- `vitest.config.ts`
- `.env.local`

### 修正
- `src/app/page.tsx`
- `tsconfig.json`
- `package.json`
