import {all, categories, byId} from './catalog.js';

export const trails = [
 {id:'depth',name:'平面に、奥行きが生まれる。',question:'動く速さが違うだけで、なぜ遠くに見える？',label:'奥行きを探る',ids:['scroll-layered-parallax','three-perspective','shadow-lift','texture-glass','svg-displacement'],prompts:['手前と奥の速さを見比べる','遠近感をつくる角度を見る','影だけで浮いて見えるか試す','重なりと透け方を観察する','輪郭をゆがめて素材感を変える']},
 {id:'rhythm',name:'心地よさには、仕組みがある。',question:'同じ動きでも、止まり方が違うと？',label:'動きの心地よさ',ids:['fade-in','easing-back-out','adv-stagger','squash-stretch','sound-tap'],prompts:['登場の時間を短く、長くする','少し行き過ぎる動きを止めて見る','時間差がつくる順序を感じる','形の変化で重さを感じる','音が加わると印象がどう変わるか聴く']},
 {id:'letters',name:'文字は、どこまで表現できる？',question:'読めることと、見たくなることの間へ。',label:'文字の可能性',ids:['type-outline','letter-spread','type-text-path','scroll-text-fill','type-line-reveal'],prompts:['中を抜いた文字の存在感を見る','文字間を動かして空気を変える','文字を曲線に沿わせる','読む進度と文字の変化を重ねる','一行ずつ現れるリズムを試す']},
 {id:'reveal',name:'隠すことから、見せ方を考える。',question:'最初から全部見えないと、何が気になる？',label:'登場と切り替え',ids:['circle-reveal','image-mask','scroll-pinned-story','scroll-scene-crossfade','ui-skeleton'],prompts:['視線が円の中心へ集まるか見る','境界をぼかして隠す','画面を留めたまま物語を進める','二つの場面が重なる瞬間を見る','待ち時間の見せ方を切り替える']},
 {id:'response',name:'触れた手応えを、デザインする。',question:'動きと音で、操作はどこまで伝わる？',label:'操作の手応え',ids:['interaction-hover','adv-spring-drag','adv-pointer-spotlight','ui-toggle','sound-click'],prompts:['触れたときの距離感を見る','引っ張って、離してみる','光を指先で動かす','状態の違いを目で確かめる','短い音が伝える合図を聴く']},
 {id:'composition',name:'並べ方ひとつで、世界が変わる。',question:'同じ内容を、違う余白で組んだら？',label:'構成と余白',ids:['layout-spacing','layout-grid','layout-bento','layout-container-query','style-editorial'],prompts:['余白がつくるまとまりを見る','縦横の基準線を探す','大きさの違いで視線を誘導する','部品の幅を変えて変化を見る','文字の強弱で読む順番をつくる']}
];

// Intent vocabulary connects everyday language with technical names.
const concepts = [
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
export const suggestions=['ふわっと','弾む','奥行き','文字','反応'];
export function normalize(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/[‐‑–—_-]/g,' ').replace(/\s+/g,' ').trim()}
const fields=new Map(all.map(e=>[e.id,{name:normalize(e.name+' '+e.ja),body:normalize([e.description,e.use,e.tip,...e.tags,...(categories.find(c=>c[0]===e.category)||[])].join(' '))}]));
const aliases=new Map(all.map(e=>[e.id,concepts.filter(c=>c.ids?.includes(e.id)||c.categories?.includes(e.category)).flatMap(c=>c.terms).map(normalize)]));
export function searchScore(e,query){
 const terms=normalize(query).split(' ').filter(Boolean);if(!terms.length)return 1;
 const f=fields.get(e.id);if(!f)return 0;
 let total=0;for(const term of terms){const score=f.name===term?100:f.name.includes(term)?30:aliases.get(e.id).some(a=>a===term)?24:f.body.includes(term)?8:0;if(!score)return 0;total+=score}return total;
}
export function filterEntries({query='',category='all',trail='',favorites=new Set(),sort='curated',entries=all}={}){
 const path=trails.find(t=>t.id===trail);let rows=entries.map((e,i)=>({e,i,score:searchScore(e,query)})).filter(({e,score})=>score&&(category==='all'||category==='saved'&&favorites.has(e.id)||category===e.category)&&(!path||path.ids.includes(e.id)));
 rows.sort((a,b)=>sort==='name'?a.e.name.localeCompare(b.e.name):query?b.score-a.score||a.i-b.i:path?path.ids.indexOf(a.e.id)-path.ids.indexOf(b.e.id):a.i-b.i);
 return rows.map(r=>r.e);
}
export function connections(id){
 const e=byId.get(id);if(!e)return [];
 const routes=trails.filter(t=>t.ids.includes(id));const related=[];
 for(const t of routes){const i=t.ids.indexOf(id),next=byId.get(t.ids[(i+1)%t.ids.length]);if(next)related.push({entry:next,reason:t.prompts[(i+1)%t.ids.length],trail:t});}
 const shared=all.filter(x=>x.id!==id&&x.category!==e.category).map(x=>({entry:x,score:x.tags.filter(tag=>e.tags.includes(tag)).length})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
 for(const x of shared)related.push({...x,reason:`「${x.entry.tags.find(tag=>e.tags.includes(tag))}」を別の方法で表す`});
 const neighbor=all.find(x=>x.category===e.category&&x.id!==id);if(neighbor)related.push({entry:neighbor,reason:'同じ分野の表現と見比べる'});
 return related.filter((r,i)=>related.findIndex(x=>x.entry.id===r.entry.id)===i).slice(0,3);
}
export function promptFor(id){for(const t of trails){const i=t.ids.indexOf(id);if(i>=0)return t.prompts[i]}return 'どこが変わるかを観察して、似た表現と見比べてみよう。'}
