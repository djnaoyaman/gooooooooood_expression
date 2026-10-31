# gooooooooood expression

GA4の測定IDと主要イベントの定義・管理画面の設定手順は [docs/analytics.md](docs/analytics.md) を参照。

見て、触って、覚えて、使えるWeb表現図鑑。宮崎直哉による、フレームワークや外部ランタイムに依存しないHTML・CSS・JavaScriptのサイトです。

**369見本 / 31カテゴリー / 6領域**。モノトーンの画面で表現を探し、実演・解説・用途・コードを結びつけます。

**公開サイト：[gooooooooood expression](https://djnaoyaman.github.io/gooooooooood_expression/)**

- 物理・慣性、時間・リズム、画面遷移、変形、マスク、合成、ジェスチャー、粒子、生成、シェーダー、錯視、音と映像の連動を追加
- 既存のタイポグラフィ、質感・画像、レイアウト、3D、音、映像も拡充。前回75見本を追加。続いてUI・レスポンシブ・完成例を含む60見本を追加
- 6領域で分類し、複数カテゴリーから同じ見本へ到達。領域・操作方法・実装技術を組み合わせて検索
- 一覧はスクロールに応じて続きを自動追加。既存カードとスクロール位置を保持し、末尾で終了
- 検索、比較、ブラウザ内コレクション、コードと依頼文のコピー
- 3つの曲線を同時に比較するイージングラボ、ユーザー操作で再生するWeb Audio
- HEX / RGB / HSL / OKLCH、配色、グラデーション、WCAGコントラスト比
- スマートフォンは1列。狭幅から大画面、キーボード、タッチ、動きを抑える設定に対応
- 作者ページに短い制作意図と親プロフィールへの導線
- 17の探究コースでカテゴリーを横断。各詳細に観察の問いと、理由のある関連リンク
- 複数語・全角半角・かな表記を扱う検索、印象語の別名辞書、カテゴリー／A–Zの索引
- 8つの追加実演：CSS motion path、SVG displacement、TextPath、行のマスク、Skeleton、Container queries、Mask composition、Seamless marquee

## ページ

- `dist/index.html` — インタラクティブな図鑑
- `dist/catalog.html` — JavaScriptなしでも読める全項目の索引
- `dist/expressions/*.html` — 369件の個別解説、実演、コード、固有の共有URL
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

各ページに固有のtitle、description、canonical、OGP、Twitter Card、JSON-LDを出力します。全項目を含むsitemap、robots.txt、llms.txt、llms-full.txt、1200×630のOG画像、SVG/ICO/PNG favicon、180/167/152px Apple Touch Icon、192/512pxアイコンとmaskableアイコン、Web App Manifestを同梱しています。

`site.config.json` の `url` を実際の公開先に変更して `npm run build` を実行すると、canonical・OGP・sitemap・テキスト資料のURLを揃えて再生成できます。現在は `https://djnaoyaman.github.io/gooooooooood_expression` に統一し、GitHub Pagesで公開しています。

認証が必要な非公開サイトでは、外部の検索・SNSクローラーは本文やOG画像を取得できません。SEO/LLMOの設定は順位、掲載、引用を保証しません。llms.txtは補助資料であり、検索エンジンへの登録機能ではありません。

広告出稿、Search Console登録、広告アカウント・GA4等の計測接続は実施していません。広告費や計測IDを仮置きしていません。キャンペーンURLには通常の `utm_source` / `utm_medium` / `utm_campaign` クエリを利用できます。実際の計測を開始する場合は、公開URL、利用する計測サービス、計測ID、対象コンバージョンを決めて接続してください。

Manifestはホーム画面用の名前・アイコンを定義します。オフライン対応やService Workerは含みません。

## ブランド

正式ロゴは **gooooooooood* / expression** の2段組み。簡略版は **g*e**。ヘッダー、favicon、Apple Touch Icon、OGPを共通のタイポグラフィに統一しています。SVGはアウトライン化されているので、端末のフォントに依存しません。

[確認用デザイン](docs/brand-preview.png) / [仕様と共有時のルール](docs/brand-and-sharing.md)

## GitHub Pagesでの公開

所有者の承認を受け、リポジトリとGitHub Pagesを一般公開しました。`.github/workflows/pages.yml` は `dist` をビルド・検査して公開します。リポジトリが非公開の場合はデプロイジョブをスキップします。

Settings → Pages → SourceはGitHub Actionsに設定済みです。mainへのpushで自動更新され、Actionsの `Deploy website to GitHub Pages` から手動実行もできます。canonical・OGP・sitemap・LLM向けテキストは同じ公開URLを使用します。

GitHub Pagesのプロジェクト配下の `robots.txt` は、ホスト直下のクロール制御には使われません。またGoogle検索のfaviconはホスト名単位です。他の作品のルート設定を変更せず、このサイトのHTMLと共有画像を設定しています。

## コンテンツを増やす

[追加と運用の手順](docs/ADDING-EXPRESSIONS.md)を参照。分類は `dist/taxonomy.js` に集約しています。`npm run build` はページと同時に公開収録データ `dist/catalogue-data.json` を生成します。

データは `dist/motions.js`、`expressions.js`、`easings.js`、`sounds.js`、`advanced.js`、`scroll-expressions.js` にあります。`dist/catalog.js` とアプリが同じエントリーを参照します。新項目には固有ID、英語名、日本語名、説明、用途、注意点、タグ、公式資料リンク、完結したコピー用コードを用意してください。

探究コース・検索語彙・関連付けは `dist/discovery.js`。同じ検索ロジックを図鑑と索引で共有します。追加実演は `dist/explorations.js` にまとめています。

スクロール表現はページ全体のスクロールを奪わず、見本の枠内と位置スライダーで操作できます。`destroy()` でイベント・監視・アニメーションを解除し、`setAuto()` で動きを抑えます。音はユーザーの再生操作からのみ鳴らします。

作者紹介の原稿は `dist/author-data.js`。短い制作意図を掲載し、詳しい作者情報は親プロフィールへ案内します。

## 検証

`npm run check` は369件のID・必須項目、373 HTMLページの一意なタイトル/canonical/H1、JSON-LD、内部参照、221本の独立したJavaScriptコード、sitemap・アイコンの存在を検査します。カテゴリーの所属・相互参照・重複しない件数・複合検索・収録データも検査します。

今回のブラウザ検証では、追加75見本の初期描画・スライダーの最小/最大値・Canvasのキーボード操作、320・390・768・1024・1440pxでの横方向の収まり、スマートフォン1列、粒子×Web Audioの複合検索、音の再生/停止、3秒の動画の実再生を確認しています。検証環境はWebGL非対応のためCanvas代替描画を確認しました。実GPU上の描画、ネイティブiOS/Safari、すべての実機・支援技術での検証は未実施です。

WebGL非対応でもシェーダーのパラメーターを試せるCanvas代替描画を実装。動画はWebMとMP4を同梱しています。`npm run qa:prepare` で再実行用の内部検査ページを準備できます（公開前に `npm run qa:clean`）。

コレクションと動きの設定はブラウザ内に保存します。アカウント同期はありません。収録数は実際の統合済み項目数であり、あらゆるWeb表現を網羅済みだと主張するものではありません。

## 収録の管理

`dist/coverage.js` が拡張した23領域・98見本の収録一覧です。カタログには収録マップを表示し、全369見本を学ぶ段階・対象・用途でも絞り込めます。これはWeb表現全体を100%網羅したことを意味しません。3D・物理の一部は簡易モデル、シェーダーの一部はCPUによる原理解説で、各ページに明記しています。マイクは明示的な操作と許可が必要で、保存・外部送信・スピーカー出力を行いません。

新規60見本の単独HTML・分類・参照・コードを自動検査します。iOS実機や全支援技術の確認は未完了です。

## 比較・選択・編集・検索

13見本を追加。画像比較・拡大ルーペ・連動ズーム、色と素材の選択・分解図・注釈、並べ替え・リスト間移動・範囲選択・配置ガイド、入力候補・検索語強調・条件チップを収録しています。分類は31カテゴリーを維持し、目的語と探究コースから到達できます。

## 文字・素材・映像・空間探索

文字の変身4、印刷加工5、光学的な素材感4、映像の乱れ4、コマを使う動き4、空間探索4の計25見本を追加。前段の13見本と合わせ、今回提案した10領域・38見本を実装しています。すべて独立したコピー用HTML、分類、用途、操作方法、参考資料を備えています。光学や素材は現象の視覚的な近似であり、各見本に範囲を明記しています。

今回追加した38見本は、Chromeで埋め込み実演38件、コピー用HTML38件の検証を通過。スライダーの最小・最大、320px幅、動きを減らす設定、並べ替え・リスト移動・キーボードによる入力候補の選択、条件チップの解除を確認しています。iOS/Safari実機の検証は未実施です。


