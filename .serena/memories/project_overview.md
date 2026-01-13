# プロジェクト概要: kotail_

## 目的
企業への口コミと公式回答を掲載するプラットフォームの企業ページを作成するプロジェクト。

## 技術スタック
- **フレームワーク**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3
- **言語**: TypeScript 5 (strict mode)
- **CSS**: Tailwind CSS 4
- **Linting**: ESLint 9 + eslint-config-next
- **その他**: babel-plugin-react-compiler 1.0.0

## ディレクトリ構造
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── Header.tsx
    ├── HeroBanner.tsx
    ├── CompanyHeader.tsx
    ├── AISummaryCard.tsx
    ├── StickyTabs.tsx
    ├── ReviewCard.tsx
    └── Sidebar.tsx
```

## 主要コンポーネント
- **Header**: サイト全体のヘッダー
- **HeroBanner**: 企業ページのヒーローバナー
- **CompanyHeader**: 企業情報カード
- **AISummaryCard**: AIによる口コミサマリー
- **StickyTabs**: スクロール時に固定されるタブナビゲーション
- **ReviewCard**: 口コミ（Q&A形式）カード（もっと見る機能付き）
- **Sidebar**: 会社情報サイドバー

## パスエイリアス
- `@/*` → `./src/*`
