# Kai2親ページの統合方針と移植

## Goal
- 親ページ(Kai2)と子ページ(kotail_)を統合し、/company/[companyId] へ遷移する導線を作る

## Done
- kotail_ を統合ベースに決定
- 企業一覧を Supabase 取得に統一（kotail_ の companyService）
- 親ページの企業リンクを /company/{UUID} に統一
- Kai2 の構成を参考に親ページ UI を kotail_ に移植
- RecentActivity の一覧を kotail_ の articles から取得する形で追加

## Discoveries
- kotail_ 側の company 取得は UUID 前提（slug 未実装）

## Decisions
- 統合アプリは 1 リポジトリ（kotail_）で運用
- 子ページUIは kotail_ 版を採用
- URL は /company/{UUID} で運用（当面）
- 親ページの一覧データは kotail_ の Supabase から取得

## Notes
- Kai2 は手動で削除する運用
- 検索は UI のみで未接続
