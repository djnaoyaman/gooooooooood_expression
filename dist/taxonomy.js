// Stable category IDs are public URL contracts. A specimen may belong to several.
export const categoryDefinitions = [
 ['motion','↗','アニメーション','MOTION'],['easing','⌁','イージング','EASING'],['physics','↝','物理・慣性','PHYSICS'],['rhythm','⋯','時間・リズム','RHYTHM'],['transition','⇄','画面遷移','TRANSITION'],['morph','◌','モーフィング・変形','MORPH'],['scroll','↕','スクロール・視差','SCROLL'],
 ['shape','◇','形・線・輪郭','SHAPE'],['color','◉','色・配色','COLOR'],['gradient','◒','グラデーション','GRADIENT'],['shadow','◐','影・光・奥行き','SHADOW'],['texture','▧','質感・印刷表現','TEXTURE'],['image','▣','写真・画像表現','IMAGE'],['mask','◩','マスク・出現','MASK'],['blend','⊗','合成・ブレンド','BLEND'],
 ['type','Aa','タイポグラフィ','TYPOGRAPHY'],['layout','▦','レイアウト・余白','LAYOUT'],['style','✳','デザイン様式','STYLE'],['ui','⊞','UIパーツ','UI'],['interaction','☝','UIの反応','INTERACTION'],['gesture','↔','ジェスチャー・追従','GESTURE'],
 ['particles','⁙','粒子・群れ','PARTICLES'],['generative','❋','生成・アルゴリズム','GENERATIVE'],['shader','≈','シェーダー・映像変形','SHADER'],['illusion','◍','錯視・知覚','ILLUSION'],['svg','⌘','SVG・アイコン','SVG'],['three','⬡','3D・立体表現','3D'],['data','▥','データの見せ方','DATA'],['sound','♪','音・サウンド','SOUND'],['audiovisual','♫','音と映像の連動','AUDIOVISUAL'],['media','▷','映像の見せ方','MEDIA']
];
export const categoryGroups = [
 {id:'movement',name:'動きと時間',categories:['motion','easing','physics','rhythm','transition','morph','scroll']},
 {id:'surface',name:'形・色・質感',categories:['shape','color','gradient','shadow','texture','image','mask','blend']},
 {id:'composition',name:'文字と構成',categories:['type','layout','style']},
 {id:'response',name:'操作と反応',categories:['ui','interaction','gesture']},
 {id:'systems',name:'生成と空間',categories:['particles','generative','shader','illusion','svg','three','data']},
 {id:'listening',name:'音と映像',categories:['sound','audiovisual','media']}
];
export const inputOptions=[['all','すべての体験'],['watch','動きを見る'],['adjust','数値を変える'],['pointer','触って動かす'],['scroll','スクロールする'],['listen','音を聴く']];
export const engineOptions=[['all','すべての作り方'],['css','HTML / CSS'],['svg','SVG'],['canvas','Canvas 2D'],['webgl','WebGL'],['audio','Web Audio'],['video','HTML Video']];
export const crossReferences={
 'adv-stagger':['rhythm','type'],'adv-flip-layout':['transition','layout'],'adv-spring-drag':['physics','gesture'],'adv-pointer-spotlight':['gesture','mask'],
 'adv-scroll-scrub':['scroll'],'adv-scroll-reveal':['scroll','mask'],'blob-morph':['morph'],'circle-reveal':['mask'],'diamond-reveal':['mask'],'curtain-open':['mask','transition'],'wipe-right':['mask','transition'],'wipe-up':['mask','transition'],
 'type-line-reveal':['mask','rhythm'],'type-text-path':['svg'],'svg-displacement':['shader','texture'],'shape-composite-mask':['mask','blend'],'image-mask':['mask'],'scroll-scene-crossfade':['transition'],'motion-seamless-loop':['rhythm','type']
};
export function belongsTo(e,id){return e.categories?.includes(id)||e.category===id}
export function enrichEntry(e){
 const categories=[...new Set([e.category,...(e.categories||[]),...(crossReferences[e.id]||[])])];
 const code=e.code||'',html=e.html||'';
 const engine=e.engine||(/AudioContext/.test(code)?'audio':/<video/.test(html)?'video':/getContext\(['"]webgl/.test(code)?'webgl':/<canvas/.test(html)?'canvas':/<svg/.test(html)?'svg':'css');
 const inputs=e.inputs||[...(e.type==='motion'||engine==='video'||engine==='audio'||/animation/.test(e.css||'')?['watch']:[]),...(/<input/.test(html)||e.type==='motion'?['adjust']:[]),...(categories.some(c=>['gesture','physics'].includes(c))?['pointer']:[]),...(categories.includes('scroll')?['scroll']:[]),...(engine==='audio'||e.type==='sound'?['listen']:[])];
 const targets=e.targets||[e.category==='type'?'text':e.category==='data'?'data':e.category==='media'?'video':categories.includes('sound')?'sound':e.category==='layout'?'layout':['ui','interaction','gesture','transition'].includes(e.category)?'ui':['image','texture','gradient','color','blend','mask'].includes(e.category)?'image':'shape'];
 const contexts=e.contexts||['foundation'];
 return {...e,level:e.level||'basic',targets,contexts,support:e.support||'対応状況は使用する機能と端末により異なります。公式資料も参照してください。',categories,engine,inputs:inputs.length?[...new Set(inputs)]:['watch']};
}
