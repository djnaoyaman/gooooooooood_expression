// An explicit, versioned checklist for the 2026-10 coverage expansion. Not a claim to cover every possible expression.
export const coverageAreas=[
 ['comparison','比較と観察',['compare-wipe','compare-loupe','compare-sync']],
 ['product-details','商品を理解する',['product-config','product-explode','product-hotspots']],
 ['editing','並べ替えと編集',['edit-sort','edit-transfer','edit-lasso','edit-guides']],
 ['finding','探す過程',['search-suggest','search-highlight','search-chips']],
 ['ui-states','UIの状態変化',['ui-dialog','ui-popover','ui-tooltip','ui-menu','ui-validation','ui-submit','ui-empty','ui-undo']],
 ['adaptive','レスポンシブ表現',['layout-fluid','layout-art-direction','layout-subgrid','layout-input']],
 ['choreography','モーション設計',['rhythm-timeline','rhythm-interrupt','rhythm-enter-exit']],
 ['native','ブラウザの表現API',['transition-native','scroll-native','ui-popover']],
 ['typography','文字組み・可変書体',['type-variable-axes','type-ruby','type-kinsoku','type-line-break']],
 ['palette','配色・見え方',['color-palette','color-contrast','color-interpolation','color-theme']],
 ['drawing','画像・描画・アイコン',['image-duotone','image-posterize','image-displacement','svg-freehand','svg-icon-morph']],
 ['simulation','物理・生成',['physics-collisions','physics-cloth','physics-softbody','physics-fluid','generative-boids','generative-reaction']],
 ['spatial','立体・光学表現',['three-model','three-skeleton','three-camera','three-deform','shader-raymarch','shader-bloom','shader-dof']],
 ['time-media','音・映像の連携',['av-beat','sound-crossfade','av-microphone','media-scroll-video','media-composite']],
 ['data','データを伝える',['data-scatter','data-network','data-map','data-treemap','data-time','data-story']],
 ['accessible','アクセシブルな表現',['access-motion','access-feedback','color-contrast']],
 ['composed','組み合わせた完成例',['case-product','case-editorial','case-gallery','case-form']]
].map(([id,name,ids])=>({id,name,ids}));
export const learningOptions=[['all','すべての段階'],['basic','基本例'],['applied','応用例'],['advanced','発展例'],['composition','組み合わせた完成例']];
export const targetOptions=[['all','すべての対象'],['text','文字'],['image','画像'],['layout','配置・余白'],['ui','操作部品'],['shape','形・粒子'],['sound','音'],['video','動画'],['data','データ']];
export const contextOptions=[['all','すべての用途'],['foundation','仕組みを知る'],['navigation','画面・操作の案内'],['forms','入力・フォーム'],['responsive','端末に合わせる'],['editorial','記事・編集'],['commerce','商品紹介'],['portfolio','作品紹介'],['data','データ説明'],['art','表現実験'],['accessibility','伝わり方の配慮']];
