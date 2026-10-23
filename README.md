# gooooooooood expression

見て、触って、覚えて、使えるWeb表現図鑑。宮崎直哉による、フレームワークや外部ランタイムに依存しないHTML・CSS・JavaScriptのサイトです。

**188種類 / 19カテゴリー**。モノトーンの画面で表現を探し、実演・解説・用途・コードを結びつけます。

- 48種類のモーション、64種類の視覚表現、36種類のイージング、16種類の合成音
- 8種類の操作デモ、16種類のスクロール・パララックス表現
- 一覧はスクロールに応じて続きを自動追加。既存カードとスクロール位置を保持し、末尾で終了
- 検索、比較、ブラウザ内コレクション、コードと依頼文のコピー
- 3つの曲線を同時に比較するイージングラボ、ユーザー操作で再生するWeb Audio
- HEX / RGB / HSL / OKLCH、配色、グラデーション、WCAGコントラスト比
- スマートフォンは1列。狭幅から大画面、キーボード、タッチ、動きを抑える設定に対応
- 作者ページにプロフィールと公開済みの9作品

## ページ

- `dist/index.html` — インタラクティブな図鑑
- `dist/catalog.html` — JavaScriptなしでも読める全項目の索引
- `dist/expressions/*.html` — 188件の個別解説、実演、コード、固有の共有URL
- `dist/author.html` — 作者・作品紹介

## ローカルで動かす

Node.js 20以降。npmパッケージのインストールは不要です。

```sh
npm run build
npm run check
python3 -m http.server 8080 --directory dist
```

`http://localhost:8080` を開きます。ES Modulesを使うため、HTMLを `file://` で直接開かず、HTTPで配信してください。公開対象は **distディレクトリ** です。

## 検索・共有対応

各ページに固有のtitle、description、canonical、OGP、Twitter Card、JSON-LDを出力します。全項目を含むsitemap、robots.txt、llms.txt、llms-full.txt、1200×630のOG画像、SVG/ICO/PNG favicon、180px Apple Touch Icon、192/512pxアイコンとmaskableアイコン、Web App Manifestを同梱しています。

`site.config.json` の `url` を実際の公開先に変更して `npm run build` を実行すると、canonical・OGP・sitemap・テキスト資料のURLを揃えて再生成できます。現在の値は既存のSites URLです。GitHubへのソース保存だけではGitHub Pagesは公開されません。

認証が必要な非公開サイトでは、外部の検索・SNSクローラーは本文やOG画像を取得できません。SEO/LLMOの設定は順位、掲載、引用を保証しません。llms.txtは補助資料であり、検索エンジンへの登録機能ではありません。

広告出稿、Search Console登録、広告アカウント・GA4等の計測接続は実施していません。広告費や計測IDを仮置きしていません。キャンペーンURLには通常の `utm_source` / `utm_medium` / `utm_campaign` クエリを利用できます。実際の計測を開始する場合は、公開URL、利用する計測サービス、計測ID、対象コンバージョンを決めて接続してください。

Manifestはホーム画面用の名前・アイコンを定義します。オフライン対応やService Workerは含みません。

## コンテンツを増やす

データは `dist/motions.js`、`expressions.js`、`easings.js`、`sounds.js`、`advanced.js`、`scroll-expressions.js` にあります。`dist/catalog.js` とアプリが同じエントリーを参照します。新項目には固有ID、英語名、日本語名、説明、用途、注意点、タグ、公式資料リンク、完結したコピー用コードを用意してください。

スクロール表現はページ全体のスクロールを奪わず、見本の枠内と位置スライダーで操作できます。`destroy()` でイベント・監視・アニメーションを解除し、`setAuto()` で動きを抑えます。音はユーザーの再生操作からのみ鳴らします。

作者・作品情報は `dist/author-data.js`。公開リポジトリのREADME、canonical、プロフィールファイルを根拠に整理しています。農園紹介などの制作対象と、作者自身の職業・所有物を混同しない構成です。

## 検証

`npm run check` は188件のID・必須項目、192 HTMLページの一意なタイトル/canonical/H1、JSON-LD、5,556本の内部参照、40本の独立したJavaScriptコード、sitemap・アイコンの存在を検査します。

今回のブラウザ検証では、スクロールによる24→48件の自動追加、スクロールカテゴリー16件、パララックスの位置操作、個別ページの独立実演、320・390・768・1024・1440px幅で横方向にはみ出さないこと、スマートフォン1列・中画面2列・大画面3列、個別ページの音の再生開始/終了を確認しています。以前の版で検索・比較・イージングの時間操作・音の再生開始/終了も確認しています。ネイティブiOS/Safariやすべての実機・支援技術での検証は未実施です。

コレクションと動きの設定はブラウザ内に保存します。アカウント同期はありません。収録数は実際の統合済み項目数であり、あらゆるWeb表現を網羅済みだと主張するものではありません。
