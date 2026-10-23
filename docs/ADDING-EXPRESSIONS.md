# 表現を追加・編集する

分類の正本は `dist/taxonomy.js`、収録の正本は `dist/catalog.js` です。生成済みの `dist/expressions/*.html` は直接編集しません。

1. 適切な見本モジュールに項目を追加します。既存の ID はリンクと保存情報に使うため変更しません。
2. `id / name / ja / category / description / use / tip / tags / source` を必ず設定します。対話型の見本は `prompt`、実演、単独で動く `code` も用意します。
3. 主分類は `category`、複数の索引先は `categories` で指定します。大分類は taxonomy 内の `categoryGroups` で管理します。旧見本の横断分類は `crossReferences` に追記できます。
4. `engine` と `inputs` はHTMLとコードから推定します。推定が適さない見本には明示指定します。独自の分類値を増やす場合は taxonomy の選択肢も更新します。
5. 共通実演は `lab-kit.js` の `canvasLab` / `domLab` を使います。埋め込まれる関数は外部の変数に依存させません。音は操作後にのみ開始し、停止・画面外・破棄時の資源解放に対応します。タッチに加えてキーボードや数値による代替操作を提供します。
6. `npm run build && npm run check` を実行します。個別ページ・索引・件数・構造化データ・sitemap・LLM向けテキスト・`catalogue-data.json` が同じ収録データから生成されます。
7. 追加した実演をブラウザで確認します。狭い幅、モーション停止、入力の最小・最大、キーボード、見本の閉じ直し、コピーした単独HTMLを確認してください。APIや端末の制約は解説に明記します。

検査はID重複、分類漏れ、古い相互参照、複合検索、全ページの内部リンク、掲載コードの構文、メタ情報を確認します。件数は重複しない見本数。カテゴリー別件数には相互参照が含まれるため、合計しません。

`npm run catalog:report` で機械可読の収録状況を更新できます。生成された `dist/catalogue-data.json` は公開対象です。草稿、認証情報、非公開データを追加しないでください。

映像素材は `scripts/build-lab-media.py` で生成したオリジナルです（再生成には Pillow / ffmpeg）。可変フォントは Inter、ライセンスは `dist/assets/Inter-OFL.txt`。それ以外の通常のビルド・検査は Node.js だけで実行できます。

mainへのpushでGitHub Pagesがビルド・検査・公開します。検査失敗時は公開されません。公開後に不具合が見つかった場合は修正、または該当コミットをrevertして同じ経路で公開します。

ブラウザで共通ラボを一括確認するには `npm run qa:prepare` を実行し、ローカルプレビューの `/_qa.html` を開きます。初期描画、スライダーの最小・最大、Canvasの非有限数、キーボード代替を検査し、幅を切り替えて実ページを確認できます。`npm run qa:clean` で内部検査画面を削除してから公開してください。残っている場合は検査が失敗します。WebGLを利用できない環境では同じパラメーターを使うCanvas描画へ切り替えます。動画はWebMとMP4を同梱します。
