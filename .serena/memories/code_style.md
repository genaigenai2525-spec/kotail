# コードスタイル・規約

## TypeScript
- strict mode 有効
- 型定義は `interface` を使用
- Props の型は `ComponentNameProps` の形式

## React コンポーネント
- 関数コンポーネントを使用
- `export default function ComponentName() {}` 形式
- Client Components には `"use client"` ディレクティブを記述
- hooks は React からインポート（`import { useState } from "react"`）

## インポート
- パスエイリアス `@/` を使用
- 例: `import Header from "@/components/Header"`

## スタイリング
- Tailwind CSS を使用
- インラインで className に記述
- カラースキーム: slate（背景）、teal（アクセント）

## フォーマット
- インデント: 2スペース
- セミコロン: あり
- クォート: ダブルクォート

## コメント
- 日本語でコメントを記述
- JSX 内では `{/* コメント */}` 形式

## SVG アイコン
- インライン SVG として埋め込み
- stroke ベースのアイコンを使用

## 命名規則
- コンポーネント: PascalCase
- 変数・関数: camelCase
- 定数: camelCase（通常の定数）
