# レポスル 新Webサイト

建設業向け日報・工数管理アプリ「レポスル」（株式会社SIXMATE）の製品サイトです。
静的HTML/CSS/JSのみで構成されており、ビルド不要でそのままGitHub Pagesに公開できます。

## ページ構成

- `index.html` — トップページ（LP）
- `case.html` — 導入事例
- `agent.html` — 代理店募集
- `news.html` — お知らせ

## ローカルでの確認方法

ビルド不要です。リポジトリ直下で簡易サーバーを立てて確認してください。

```
python3 -m http.server 8000
```

`http://localhost:8000/` にアクセス。

## 公開

GitHub Pages（`main`ブランチ / ルート）で公開しています。
