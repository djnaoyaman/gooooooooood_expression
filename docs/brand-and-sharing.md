# ロゴと共有アセット

正式ロゴは `gooooooooood*` と `expression` の2段組み。簡略版は `g*e`。2026年10月24日に作者が指定した表記に統一しています。

文字はNimbus Sans BoldをアウトラインにしたSVG。端末にこのフォントが入っていなくても同じ形で表示します。黒 `#171717` とオフホワイト `#f3f2ed` が基本色です。文字列・改行・比率を維持し、長体・斜体・装飾記号の追加はしません。余白は用途に応じて調整します。

| 用途 | 納品ファイル・仕様 | デザインの扱い |
| --- | --- | --- |
| サイトのロゴ | `dist/assets/logo.svg`、反転版 `logo-light.svg` | 指定された2段組み。アウトライン化済み |
| 簡略版 | `dist/assets/logo-short.svg` | `g*e` の順序を保持 |
| favicon | `favicon.svg`、16/32/48px PNG、16/32/48pxを含むICO | `g*e`。小サイズでは同じ字形を少し大きくして可読性を確保。角の外側は透過 |
| Apple Touch Icon | 180/167/152px PNG | 黒の不透明な正方形に `g*e`。ファイル自体には角丸を焼き込まない |
| Web App Manifest | 192/512px PNG、512px maskable | `g*e`。maskableの主要文字は中央の安全領域に収める |
| OGP | `og-expression-v2.png`、1200×630px PNG | 正式ロゴと余白を主役にする。画像内に小さな説明を詰め込まない |
| X用画像 | `social-expression-v2.png`、1200×600px PNG | 同じレイアウトを2:1に調整。`summary_large_image` を使用 |

`docs/brand-preview.png` が確認用の一覧です。16/32pxのfaviconは確認図の原寸で配置しています。画像が画面に合わせて縮小表示される場合は、原寸で開いて確認してください。

## 外部仕様とこのサイトの採用方針

- AppleのWeb ClipガイドはPNGと `apple-touch-icon`、解像度ごとの `sizes` を説明しています。180/167/152pxを用意します。不透明背景・角丸を焼き込まないことは、このサイトの書き出し方針です。
- Metaは共有画像に1200×630px以上を推奨しています。このサイトでは1200×630pxを採用します。これはOGP全体の必須寸法ではありません。
- Open Graphでは `og:title`、`og:type`、`og:image`、`og:url` が基本情報です。画像の幅・高さ・形式・代替テキストも設定します。公開後にSNSが取得できるHTTPS絶対URLを使います。
- 共有画像は静止PNGを基準にします。`og:video` は動画を記述する追加情報ですが、設定だけで全SNSのリンクプレビューが動画になるものではありません。Xでは動画等のカードにHTTPS、停止／一時停止操作、自動再生時の消音などのルールがあります。現時点では動画カードを実装・検証していません。
- X旧カード仕様ページは調査時点で総合ドキュメントへ転送され、詳細仕様を直接確認できませんでした。1200×600pxはこのサイトで採用する画像サイズであり、Xの現在の必須寸法と断定しません。
- SNSは画像をキャッシュすることがあります。今回の共有画像は新しいファイル名、アイコンは版番号付き参照に更新します。すでにシェアされた投稿の見え方が即時に変わる保証はありません。
- Google検索のfaviconはホスト名単位です。`djnaoyaman.github.io` の各作品フォルダに、検索結果専用の別アイコンを割り当てることはできません。ブラウザタブやホーム画面のアイコンはこのサイトの指定を利用できます。
- GitHub PagesのプロジェクトURLで配信する `robots.txt` はホスト直下のrobots.txtにはなりません。他の作品への影響を避けるため、アカウントのルートリポジトリは変更していません。

## 再生成

`scripts/design-brand.py` は任意のデザイン用ツールです。Python、Pillow、fontTools、Inkscape、Nimbus Sansが必要です。通常のサイトビルド・GitHub Actionsはコミット済みアセットを使うので、これらは不要です。文字のアウトライン化により配信されるSVGにフォント依存はありません。

## 公式資料（2026年10月24日確認）

- Apple: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
- Open Graph: https://ogp.me/
- Meta: https://developers.facebook.com/documentation/sharing/webmasters/images
- X: https://docs.x.com/developer-terms/policy
- Google: https://developers.google.com/search/docs/appearance/favicon-in-search

実際のSNSカード表示・iOS実機上のホーム画面は、公開後に別途確認する必要があります。
