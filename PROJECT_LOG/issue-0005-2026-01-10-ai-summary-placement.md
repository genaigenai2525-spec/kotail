# Title
AIサマリーカードを企業詳細ページに配置

Goal:
- AISummaryCardを企業詳細ページのQ&A前に表示して、サマリーの導線を確保する

Done:
- `AISummaryCard` を `page.tsx` に追加し、タブ直下に表示
- サンプルデータと `hasQAContent` を接続

Open:
- 実データ連携時の文言/数のチューニング

Notes:
- Q&Aが存在する場合はデフォルトで閉じる仕様を維持
