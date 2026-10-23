import {learningOptions,targetOptions,contextOptions} from './coverage.js';
import {all, categories, byId, categoryGroups, belongsTo, inputOptions, engineOptions} from './catalog.js';

export const trails = [
 {id:'compare-choose',name:'比べると、違いが見えてくる。',question:'同じ場所を、同じ条件で観察したら？',label:'比較から選択へ',ids:['compare-wipe','compare-loupe','compare-sync','product-config','product-hotspots'],prompts:['境界を動かして違いを見る','小さな違いを拡大する','同じ倍率と位置で比べる','色と素材を選ぶ','注目した場所から説明を読む']},
 {id:'find-edit',name:'見つけて、選んで、並べ替える。',question:'自分の操作で、情報が整っていく。',label:'探す・編集する',ids:['search-suggest','search-highlight','search-chips','edit-sort','edit-transfer'],prompts:['候補から言葉を選ぶ','一致した場所を確かめる','条件を外して戻る','順序を組み替える','別の場所へ移す']},
 {id:'practical',name:'ひとつの操作を、最後まで。',question:'迷わず触れて、安心して終えるには？',label:'UIから完成例へ',ids:['ui-dialog','ui-validation','ui-submit','access-feedback','case-form'],prompts:['操作する場所を絞る','直す場所を案内する','待ち時間と結果を伝える','色以外でも意味を伝える','一つの流れとして使う']},
 {id:'adaptive',name:'幅が変わると、何を変える？',question:'縮めるだけでは届かない表現へ。',label:'端末と構図',ids:['layout-fluid','layout-art-direction','layout-subgrid','layout-input','case-product'],prompts:['文字と余白の関係を見る','主役の構図を変える','基準線を揃える','触れる大きさを比べる','商品紹介として組み合わせる']},
 {id:'living',name:'規則から、生命感へ。',question:'小さな計算が、複雑な世界になる。',label:'群れ・流れ・模様',ids:['physics-collisions','physics-cloth','generative-boids','physics-fluid','generative-reaction'],prompts:['衝突を見比べる','点のつながりを見る','個体の判断が群れになる','流れを指でつくる','模様が育つのを待つ']},
 {id:'depth',name:'平面に、奥行きが生まれる。',question:'動く速さが違うだけで、なぜ遠くに見える？',label:'奥行きを探る',ids:['scroll-layered-parallax','three-perspective','shadow-lift','texture-glass','svg-displacement'],prompts:['手前と奥の速さを見比べる','遠近感をつくる角度を見る','影だけで浮いて見えるか試す','重なりと透け方を観察する','輪郭をゆがめて素材感を変える']},
 {id:'rhythm',name:'心地よさには、仕組みがある。',question:'同じ動きでも、止まり方が違うと？',label:'動きの心地よさ',ids:['fade-in','easing-back-out','adv-stagger','squash-stretch','sound-tap'],prompts:['登場の時間を短く、長くする','少し行き過ぎる動きを止めて見る','時間差がつくる順序を感じる','形の変化で重さを感じる','音が加わると印象がどう変わるか聴く']},
 {id:'letters',name:'文字は、どこまで表現できる？',question:'読めることと、見たくなることの間へ。',label:'文字の可能性',ids:['type-outline','letter-spread','type-text-path','scroll-text-fill','type-line-reveal'],prompts:['中を抜いた文字の存在感を見る','文字間を動かして空気を変える','文字を曲線に沿わせる','読む進度と文字の変化を重ねる','一行ずつ現れるリズムを試す']},
 {id:'reveal',name:'隠すことから、見せ方を考える。',question:'最初から全部見えないと、何が気になる？',label:'登場と切り替え',ids:['circle-reveal','image-mask','scroll-pinned-story','scroll-scene-crossfade','ui-skeleton'],prompts:['視線が円の中心へ集まるか見る','境界をぼかして隠す','画面を留めたまま物語を進める','二つの場面が重なる瞬間を見る','待ち時間の見せ方を切り替える']},
 {id:'response',name:'触れた手応えを、デザインする。',question:'動きと音で、操作はどこまで伝わる？',label:'操作の手応え',ids:['interaction-hover','adv-spring-drag','adv-pointer-spotlight','ui-toggle','sound-click'],prompts:['触れたときの距離感を見る','引っ張って、離してみる','光を指先で動かす','状態の違いを目で確かめる','短い音が伝える合図を聴く']},
 {id:'composition',name:'並べ方ひとつで、世界が変わる。',question:'同じ内容を、違う余白で組んだら？',label:'構成と余白',ids:['layout-spacing','layout-grid','layout-bento','layout-container-query','style-editorial'],prompts:['余白がつくるまとまりを見る','縦横の基準線を探す','大きさの違いで視線を誘導する','部品の幅を変えて変化を見る','文字の強弱で読む順番をつくる']},
 {id:'forces',name:'動きに、重さを感じる。',question:'速さの曲線と、力の計算は何が違う？',label:'力と時間',ids:['easing-back-out','physics-spring','physics-gravity','physics-inertia','rhythm-anticipation'],prompts:['決まった曲線を観察する','ばねの強さと減衰を変える','反発を小さくして落とす','投げた後の減速を比べる','動き出す前の予備動作を見る']},
 {id:'rules',name:'小さなルールから、世界が生まれる。',question:'数式を少し変えると、どんな模様になる？',label:'生成のルール',ids:['particles-phyllotaxis','generative-fractal','generative-voronoi','generative-automaton','shader-ripple'],prompts:['点の数と間隔を変える','枝の数と深さを変える','点の数を増やす','ルール番号を変える','ゆがみの強さを変える']},
 {id:'perception',name:'見えているものを、疑ってみる。',question:'同じ色、同じ長さなのに違って見える？',label:'見え方の不思議',ids:['illusion-contrast','illusion-length','illusion-figure','illusion-moire','blend-difference'],prompts:['背景を揃えて確かめる','補助線で長さを確かめる','図と地を入れ替える','角度を少し変える','重なる部分の明暗を見る']},
 {id:'listening',name:'音が、形になる。',question:'波の違いは、耳と目でどう伝わる？',label:'音と映像',ids:['sound-envelope','sound-timbre','av-waveform','av-spectrum','av-amplitude'],prompts:['音の立ち上がりを変える','波形ごとの音色を聴く','音の振動を見る','周波数の分布を見る','音量が形になる様子を見る']}

];

// Intent vocabulary connects everyday language with technical names.
const concepts = [
 {terms:['比較したい','比較','見比べる'],ids:['compare-wipe','compare-loupe','compare-sync','product-config']},
 {terms:['選びたい','選ぶ','商品紹介'],ids:['product-config','product-explode','product-hotspots']},
 {terms:['編集したい','編集','並べ替え'],ids:['edit-sort','edit-transfer','edit-lasso','edit-guides']},
 {terms:['探したい','検索','探す'],ids:['search-suggest','search-highlight','search-chips']},
 {terms:['完成例','組み合わせ','実例'],ids:['case-product','case-editorial','case-gallery','case-form']},
 {terms:['スマホ','レスポンシブ','端末'],ids:['layout-fluid','layout-art-direction','layout-subgrid','layout-input']},
 {terms:['アクセシビリティ','誰にでも'],ids:['access-motion','access-feedback','color-contrast']},
 {terms:['粒子','粒','群れ','particle'],categories:['particles']},
 {terms:['重力','ばね','慣性','物理','physics'],categories:['physics']},
 {terms:['リズム','時間差','順番'],categories:['rhythm']},
 {terms:['変形','モーフ','morph'],categories:['morph']},
 {terms:['隠す','出現','切り抜き','mask'],categories:['mask']},
 {terms:['切り替え','遷移','transition'],categories:['transition']},
 {terms:['合成','重ねる','blend'],categories:['blend']},
 {terms:['追従','ドラッグ','タッチ','gesture'],categories:['gesture']},
 {terms:['錯視','知覚','illusion'],categories:['illusion']},
 {terms:['生成','アルゴリズム','フラクタル'],categories:['generative']},
 {terms:['シェーダー','gpu','shader'],categories:['shader']},
 {terms:['音楽','音に反応','ビジュアライザー'],categories:['audiovisual']},
 {terms:['動画','ビデオ','video'],categories:['media']},
 {terms:['ふわっと','ふわふわ','やわらかい','柔らかい','ソフト'],ids:['fade-in','float','shadow-soft','easing-sine-in-out','sound-tap','blur-in']},
 {terms:['ぷるぷる','ぷるん','弾む','はずむ','バネ','ばね','バウンス'],ids:['jelly','rubber-band','bounce','squash-stretch','elastic-in','adv-spring-drag','easing-back-out','easing-elastic-out','easing-bounce-out']},
 {terms:['パララックス','parallax','視差'],ids:['scroll-layered-parallax','scroll-depth-parallax','scroll-counter-parallax']},
 {terms:['奥行き','立体','3d','遠近感'],ids:['three-perspective','three-cube','three-isometric','tilt-3d','scroll-layered-parallax','scroll-depth-parallax','shadow-lift','layout-overlap']},
 {terms:['ぬるぬる','なめらか','滑らか','スムーズ'],ids:['easing-ease','easing-sine-in-out','easing-cubic-out','adv-flip-layout','adv-spring-drag']},
 {terms:['ガラス','glass','透明','透ける'],ids:['texture-glass','color-alpha','image-mask']},
 {terms:['ローディング','loading','読み込み','待機'],ids:['ui-skeleton','spin','pulse','data-donut']},
 {terms:['スクロール','scroll'],categories:['scroll'],ids:['adv-scroll-scrub','adv-scroll-reveal','interaction-scroll-snap']},
 {terms:['文字','タイポ','タイポグラフィ','typography'],categories:['type'],ids:['letter-spread','tracking-in','typewriter','adv-stagger','scroll-text-fill','scroll-split-typography']},
 {terms:['反応','手応え','フィードバック'],categories:['interaction','ui'],ids:['sound-click','sound-tap','sound-success']},
 {terms:['音','サウンド','効果音','se'],categories:['sound']},
 {terms:['紙','印刷','レトロ'],ids:['texture-halftone','style-retro','style-editorial','shadow-hard']}
];
export const suggestions=['ふわっと','比較したい','編集したい','文字','反応'];
export function normalize(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[‐‑–—_-]/g,' ').replace(/\s+/g,' ').trim()}
const fields=new Map(all.map(e=>[e.id,{name:normalize(e.name+' '+e.ja),body:normalize([e.description,e.use,e.tip,...e.tags,...e.targets,...e.contexts,...learningOptions.filter(x=>x[0]===e.level).flat(),...targetOptions.filter(x=>e.targets.includes(x[0])).flat(),...contextOptions.filter(x=>e.contexts.includes(x[0])).flat(),...categories.filter(c=>belongsTo(e,c[0])).flat(),...inputOptions.filter(x=>e.inputs.includes(x[0])).flat(),...engineOptions.find(x=>x[0]===e.engine)].join(' '))}]));
const aliases=new Map(all.map(e=>[e.id,concepts.filter(c=>c.ids?.includes(e.id)||c.categories?.some(id=>belongsTo(e,id))).flatMap(c=>c.terms).map(normalize)]));
export function searchScore(e,query){
 const terms=normalize(query).split(' ').filter(Boolean);if(!terms.length)return 1;
 const f=fields.get(e.id);if(!f)return 0;
 let total=0;for(const term of terms){const score=f.name===term?100:f.name.includes(term)?30:aliases.get(e.id).some(a=>a===term)?24:f.body.includes(term)?8:0;if(!score)return 0;total+=score}return total;
}
export function filterEntries({query='',category='all',area='all',input='all',engine='all',level='all',target='all',context='all',trail='',favorites=new Set(),sort='curated',entries=all}={}){
 const path=trails.find(t=>t.id===trail);let rows=entries.map((e,i)=>({e,i,score:searchScore(e,query)})).filter(({e,score})=>score&&(category==='all'||category==='saved'&&favorites.has(e.id)||belongsTo(e,category))&&(area==='all'||categoryGroups.find(g=>g.id===area)?.categories.some(id=>belongsTo(e,id)))&&(input==='all'||e.inputs.includes(input))&&(engine==='all'||e.engine===engine)&&(level==='all'||e.level===level)&&(target==='all'||e.targets.includes(target))&&(context==='all'||e.contexts.includes(context))&&(!path||path.ids.includes(e.id)));
 rows.sort((a,b)=>sort==='name'?a.e.name.localeCompare(b.e.name):query?b.score-a.score||a.i-b.i:path?path.ids.indexOf(a.e.id)-path.ids.indexOf(b.e.id):a.i-b.i);
 return rows.map(r=>r.e);
}
export function connections(id){
 const e=byId.get(id);if(!e)return [];
 const routes=trails.filter(t=>t.ids.includes(id));const related=[];
 for(const other of all){if(e.related?.includes(other.id))related.push({entry:other,reason:'この完成例を構成する技法を試す'});else if(other.related?.includes(e.id))related.push({entry:other,reason:'この技法を使った完成例を見る'});} 
 for(const t of routes){const i=t.ids.indexOf(id),next=byId.get(t.ids[(i+1)%t.ids.length]);if(next)related.push({entry:next,reason:t.prompts[(i+1)%t.ids.length],trail:t});}
 const shared=all.filter(x=>x.id!==id&&x.category!==e.category).map(x=>({entry:x,score:x.tags.filter(tag=>e.tags.includes(tag)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
 for(const x of shared)related.push({...x,reason:`「${x.entry.tags.find(tag=>e.tags.includes(tag))}」を別の方法で表す`});
 const neighbor=all.find(x=>x.category===e.category&&x.id!==id);if(neighbor)related.push({entry:neighbor,reason:'同じ分野の表現と見比べる'});
 return related.filter((r,i)=>related.findIndex(x=>x.entry.id===r.entry.id)===i).slice(0,3);
}
export function promptFor(id){if(byId.get(id)?.prompt)return byId.get(id).prompt;for(const t of trails){const i=t.ids.indexOf(id);if(i>=0)return t.prompts[i]}return 'どこが変わるかを観察して、似た表現と見比べてみよう。'}
