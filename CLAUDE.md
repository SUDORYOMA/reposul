# レポスル 製品サイト（reposul.com のLP）

建設業向け日報・工数管理アプリ「レポスル」（株式会社SIXMATE）の製品サイト。静的HTML/CSS/JS、ビルドなし、GitHub Pages で公開（`CNAME` を消さない）。

## 構成
- `index.html` トップ（LP）、`case.html` 導入事例、`agent.html` 代理店募集
- `blog/` ブログ記事（連番で公開中）
- `llms.txt` — AI検索（AEO/GEO）向け。ページ・記事を足したら更新
- 詳細は README.md

## ルール
- main に push すると即公開。表示（PC・スマホ）を確認してから push
- 盛った表現・誇大広告はしない。機能は実装済みのものだけ書く
- アプリ本体は別リポジトリ `reposul-next`。機能名・画面名はそちらに合わせる
