# Google Analytics 4

測定ID: `G-3HF4SGP3C6`。`scripts/build-pages.mjs` の共通headでGoogleタグと `analytics.js` を全公開HTMLへ出力する。生成済みHTMLだけを編集しない。

## イベントの定義

| イベント | 送信条件 | パラメータ |
|---|---|---|
| `page_view` | Googleタグによる通常のページ表示 | GA4標準 |
| `view_section` | アプリの explore / easing / sound / colors 画面を表示。初回を含む | section |
| `view_expression` | 表現の詳細ダイアログ、または個別ページを開く | expression_id, placement |
| `demo_interaction` | 利用者による見本操作、再生・停止・再生し直し、設定の調整。自動再生・スクロールによる自動再開は除外 | expression_id, action |
| `copy_code` | クリップボードまたはコピー用の代替APIでコードのコピーが成功 | expression_id |
| `copy_brief` | 詳細の依頼文のコピーが成功 | expression_id |
| `copy_color` | 色コード・パレット・グラデーションのコピーが成功 | なし |
| `add_to_collection` / `remove_from_collection` | マイコレクションへ追加／削除 | expression_id |
| `compare_expressions` | 2〜3表現の比較画面を開く | expression_ids, item_count |
| `share` | OSの共有処理が正常終了、または共有リンクのコピーが成功 | method, expression_id（表現の場合） |
| `select_filter` | カテゴリー・探究コース・選択式の条件を変更 | filter_name, filter_value |

見本内の連続操作は同じ見本で1秒につき最大1件。クリックとキー操作を二重に数えない。共有のキャンセル、コピー失敗、手動コピー用の文字選択だけでは成功イベントを送らない。`share` の native は共有APIの正常終了を示し、受信者の受領を保証しない。個別ページの見本は分離したiframeから、対応する親だけへ操作通知を送る。

独自イベントには検索語、入力テキスト、コピー内容、共有文章を含めない。GA4の標準イベント・拡張計測のURLやサイト内検索はプロパティ側の設定に従う。

## GA4管理画面での設定

サイト側のイベント実装と、GA4プロパティ側の「キーイベント」指定は別設定。管理者として対象プロパティを開き、`copy_code`、`add_to_collection`、`share` をキーイベントに指定する。`copy_brief` は依頼文の利用も成果とする場合に追加する。通常の閲覧・自動再生はキーイベントにしない。

イベントスコープのカスタムディメンション候補: expression_id、placement、section、action、method、filter_name、filter_value。大量の組合せを生む expression_ids は通常登録しない。

画面内移動は `view_section` と `view_expression` で測定する。独自の仮想page_viewは送らない。ページビューを実ページ単位で揃える場合は、拡張計測のページビュー詳細にあるブラウザ履歴イベントによるページ変更をオフにする。GA4側への反映と実際の受信はRealtime / DebugViewで別途確認する。

公式資料: https://developers.google.com/analytics/devguides/collection/ga4/views 、https://support.google.com/analytics/answer/13128484
