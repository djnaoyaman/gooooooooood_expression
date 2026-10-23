// Original easing catalogue. CSS and graph are evaluated from the same curve data.
const ROOT='https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function';
const round=(v,n=6)=>Number(v.toFixed(n));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const bz=points=>({kind:'bezier',points});
function bounceOut(t){const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375;}
const bounceIn=t=>1-bounceOut(1-t);
const bounceInOut=t=>t<.5?bounceIn(t*2)/2:(1+bounceOut(t*2-1))/2;
const bounceKnots=[1/2.75,1.5/2.75,2/2.75,2.25/2.75,2.5/2.75,2.625/2.75];
const elasticOut=t=>t===0||t===1?t:Math.pow(2,-10*t)*Math.sin((10*t-.75)*(2*Math.PI/3))+1;
const elasticIn=t=>1-elasticOut(1-t);
function elasticInOut(t){if(t===0||t===1)return t;const c=2*Math.PI/4.5;return t<.5?-(Math.pow(2,20*t-10)*Math.sin((20*t-11.125)*c))/2:Math.pow(2,-20*t+10)*Math.sin((20*t-11.125)*c)/2+1;}
function sampled(fn,extra=[]){const times=[...new Set([...Array.from({length:121},(_,i)=>round(i/120,7)),...extra.map(t=>round(t,7))])].sort((a,b)=>a-b);return{kind:'sampled',points:times.map(t=>[t,round(fn(t))])};}
function cssCurve(c){if(c.kind==='linear')return'linear';if(c.kind==='bezier')return`cubic-bezier(${c.points.join(', ')})`;if(c.kind==='steps')return`steps(${c.count}, jump-end)`;return`linear(${c.points.map(([t,y])=>`${y} ${round(t*100,5)}%`).join(', ')})`;}
const approximation='名称は曲線の系統を示します。この見本は同名の数式そのものではなく、3次ベジェ曲線による近似です。';
function entry(id,name,ja,description,use,tip,curve,tags=[],keyword){const easing=keyword||cssCurve(curve);return{id:`easing-${id}`,category:'easing',type:'motion',name,ja,description,use,tip,tags:['イージング','速度','加速','減速',...tags],visual:'orb',frames:[{transform:'translateX(-80px)'},{transform:'translateX(80px)'}],duration:1800,easing,curve,source:curve.kind==='sampled'?`${ROOT}/linear`:curve.kind==='steps'?`${ROOT}/steps`:curve.kind==='bezier'?`${ROOT}/cubic-bezier`:ROOT,code:`/* 同じ距離・時間で、速度の変化だけを比較します。 */\n.demo {\n  width: 32px; height: 32px; border-radius: 50%;\n  background: #202124;\n  animation: easing-travel 1800ms both;\n  animation-timing-function: ${easing};\n}\n@keyframes easing-travel {\n  from { transform: translateX(-80px); }\n  to { transform: translateX(80px); }\n}\n@media (prefers-reduced-motion: reduce) {\n  .demo { animation: none; }\n}`};}
export const easings=[
entry('linear','Linear','ずっと、同じ速さ','始めから終わりまで、一定の速さで進みます。','進捗表示、回転、一定速度を伝える表現に。','時間が半分なら、移動距離もちょうど半分です。',{kind:'linear'},['等速','一定']),
entry('ease','Ease','すっと進み、ゆっくり止まる','ゆっくり動き始め、すぐに加速した後、長めに減速します。','ボタンやカードなど、自然な変化を添えたい場面に。','CSS標準のeaseです。ease-in-outよりも前半で速く進みます。',bz([.25,.1,.25,1]),['自然','標準'],'ease'),
entry('ease-in','Ease in','ゆっくり始め、速く終わる','動き始めはゆっくりで、終わりに向かって加速します。','画面外へ去る要素など、勢いをつけたい場面に。','最後は減速せず終わります。到着を見せたい場面ではease-outとも比べてください。',bz([.42,0,1,1]),['退場'],'ease-in'),
entry('ease-out','Ease out','速く始め、静かに止まる','動き始めが速く、終わりに向かって減速します。','メニューや通知など、すぐ反応して定位置に収まる場面に。','操作直後の反応と、到着時の落ち着きを両立しやすい曲線です。',bz([0,0,.58,1]),['登場'],'ease-out'),
entry('ease-in-out','Ease in out','ゆっくり、速く、ゆっくり','ゆっくり始まり、中間で速くなり、終わりに再び減速します。','状態間の移動や、視線を追わせる連続した変化に。','始点と終点で落ち着く、左右対称の曲線です。',bz([.42,0,.58,1]),['加減速','対称'],'ease-in-out'),
entry('sine-in','Sine in','穏やかに加速する','加速の変化を穏やかに抑えながら、前へ進みます。','控えめな移動や、静かな演出の退場に。',approximation,bz([.12,0,.39,0]),['サイン','穏やか']),
entry('sine-out','Sine out','穏やかに減速する','大きく勢いをつけすぎず、滑らかに減速します。','小さな移動や、軽い操作への反応に。',approximation,bz([.61,1,.88,1]),['サイン','穏やか']),
entry('sine-in-out','Sine in out','波のように、滑らかに','加速と減速が、波のように穏やかにつながります。','浮遊感を出す動きや、繰り返す揺れに。',approximation,bz([.37,0,.63,1]),['サイン','波','滑らか']),
entry('quad-in','Quad in','少しずつ、速くなる','序盤の進み方を抑え、後半へ向けて穏やかに加速します。','控えめな退場や、自然に勢いがつく動きに。',approximation,bz([.11,0,.5,0]),['2乗','クアッド','quadratic']),
entry('quad-out','Quad out','少しずつ、ゆっくりになる','早めに動き始め、終点へ向かって穏やかに減速します。','リストの移動や、小さな操作への落ち着いた反応に。',approximation,bz([.5,1,.89,1]),['2乗','クアッド','quadratic']),
entry('quad-in-out','Quad in out','ほどよい緩急で進む','加速と減速を半分ずつ使い、中央を滑らかにつなぎます。','控えめな画面遷移や、移動先を追いやすくしたいとき。',approximation,bz([.45,0,.55,1]),['2乗','クアッド','quadratic']),
entry('cubic-in','Cubic in','じわりと始まり、一気に進む','序盤の動きを小さく抑え、後半で強く加速します。','引き込まれるような退場や、勢いのある移動に。',approximation,bz([.32,0,.67,0]),['3乗','キュービック']),
entry('cubic-out','Cubic out','すばやく進み、余韻を残す','前半で大きく進み、残りの距離をゆっくり詰めます。','カードやパネルを、きびきび表示したいとき。',approximation,bz([.33,1,.68,1]),['3乗','キュービック','余韻']),
entry('cubic-in-out','Cubic in out','前後をためて、中央で加速','始まりと終わりをゆっくりにし、中央付近で強く動きます。','画面の切り替えや、はっきりした移動の表現に。',approximation,bz([.65,0,.35,1]),['3乗','キュービック','緩急']),
entry('quart-in','Quart in','深くためて、勢いをつける','序盤の進みを小さく抑え、後半で大きく加速します。','力をためるような動きや、強い退場の演出に。',approximation,bz([.5,0,.75,0]),['4乗','クォート','quartic']),
entry('quart-out','Quart out','素早く移動し、長く減速','初めに大きく距離を進み、終わりをゆっくり仕上げます。','すぐに操作へ応えつつ、到着を滑らかに見せたいとき。',approximation,bz([.25,1,.5,1]),['4乗','クォート','quartic']),
entry('quart-in-out','Quart in out','静かな両端、速い中央','始点と終点の動きを小さくし、中央付近の速度を上げます。','大きなパネルや、切り替わりを印象づける移動に。',approximation,bz([.76,0,.24,1]),['4乗','クォート','quartic']),
entry('quint-in','Quint in','じっくりためて、駆け出す','長めに動きをため、終点へ向かって強く加速します。','一気に画面外へ出す演出や、ためを強調する動きに。',approximation,bz([.64,0,.78,0]),['5乗','クイント','quintic']),
entry('quint-out','Quint out','すぐに届き、そっと収まる','序盤でほとんどの距離を進み、最後に長く減速します。','操作への素早い反応と、滑らかな着地を見せたいとき。',approximation,bz([.22,1,.36,1]),['5乗','クイント','quintic']),
entry('quint-in-out','Quint in out','中央で一気に切り替わる','始まりと終わりを強く抑え、中央の移動を際立たせます。','はっきりした切り替えや、緩急を比較する教材に。',approximation,bz([.83,0,.17,1]),['5乗','クイント','quintic']),
entry('expo-in','Expo in','静かな始まりから、急加速','始めの動きは小さく、後半で急に速度を増します。','鋭い退場や、強く引き込まれるような移動に。',approximation,bz([.7,0,.84,0]),['指数','エクスポ','exponential']),
entry('expo-out','Expo out','勢いよく進み、細かく近づく','強い初速から、急速に速度を落として終点へ近づきます。','短い操作反応や、鋭い登場演出に。',approximation+'指定時間の終わりに必ず到着します。',bz([.16,1,.3,1]),['指数','エクスポ','exponential']),
entry('expo-in-out','Expo in out','中央を鋭く、前後を静かに','前後の動きを抑え、中央付近を鋭く通過します。','短い画面遷移や、動きのコントラストをつけたいとき。',approximation,bz([.87,0,.13,1]),['指数','エクスポ','exponential']),
entry('circ-in','Circ in','円弧のように加速する','序盤は穏やかに、終点付近では強く加速します。','動きの後半に勢いを集めたい、短い退場に。',approximation+'移動経路が円になるわけではありません。',bz([.55,0,1,.45]),['円弧','サーク','circular']),
entry('circ-out','Circ out','勢いをすぐ抑えて収まる','速い出だしから速度を落とし、最後は静かに収まります。','すばやく出したい小さなパネルや、選択への反応に。',approximation+'円弧を描く軌道ではなく、時間に対する進み方です。',bz([0,.55,.45,1]),['円弧','サーク','circular']),
entry('circ-in-out','Circ in out','中央に勢いが集まる','両端は穏やかにし、中央で動きを大きく変えます。','変化の中心を際立たせたい、往復や切り替えの演出に。',approximation,bz([.85,0,.15,1]),['円弧','サーク','circular']),
entry('back-in','Back in','少し引いてから進む','一度進行方向と逆へ引き、そこから前へ進みます。','力をためてから動く、予備動作をつくりたいとき。',approximation+'値が0を下回るため、始点側にも余白を確保します。',bz([.36,0,.66,-.56]),['予備動作','引く','ため']),
entry('back-out','Back out','少し行き過ぎ、戻って止まる','終点を少し超え、戻ることで弾力を感じさせます。','小さな通知や、選択された要素を軽快に示すとき。',approximation+'値が一時的に1を超えるため、終点側に余白を確保します。',bz([.34,1.56,.64,1]),['行き過ぎる','反動','弾力']),
entry('back-in-out','Back in out','引いて、行き過ぎて、収まる','始めに逆方向へ引き、終わりには終点を超えて戻ります。','予備動作と反動の両方で、弾力を伝えたいとき。',approximation+'進み具合が0未満・1超になるので、両側に余白を確保します。',bz([.68,-.6,.32,1.6]),['引く','行き過ぎる','反動']),
entry('bounce-in','Bounce in','小さな跳ねから、駆け出す','始点付近で小さく跳ね、跳ね幅を広げてから終点へ進みます。','小さな跳ね返りを、動き始めの予備動作に使うとき。','Bounce outを反転した曲線を、CSS linear()で近似しています。物理計算ではありません。',sampled(bounceIn,bounceKnots.map(t=>1-t)),['跳ねる','予備動作','バウンド']),
entry('bounce-out','Bounce out','着地して、跳ね返る','終点に届いた後、小さな跳ね返りを繰り返して収まります。','ボールやキャラクターなど、着地を感じさせたいとき。','Bounce系の曲線を細かく採った点で近似し、CSS linear()で結んでいます。物理計算ではありません。',sampled(bounceOut,bounceKnots),['跳ね返る','着地','バウンド']),
entry('bounce-in-out','Bounce in out','跳ねて出発、跳ねて着地','始点付近の小さな跳ねから出発し、終点付近でも跳ね返ります。','始まりと終わりの両方に、跳ねる感触をつけたいとき。','Bounce inとBounce outを半分ずつつないだ曲線を、CSS linear()で近似しています。',sampled(bounceInOut,[...bounceKnots.map(t=>(1-t)/2),.5,...bounceKnots.map(t=>.5+t/2)]),['跳ねる','着地','往復']),
entry('elastic-in','Elastic in','揺れをためて、飛び出す','始点の前後で揺れを大きくし、最後に終点へ飛び出します。','引き絞るような動きや、柔らかい物体の出発に。','Elastic outを反転した曲線を、CSS linear()で近似しています。逆方向への移動に備えて余白を確保します。',sampled(elasticIn),['ばね','ため','びよん','spring']),
entry('elastic-out','Elastic out','ばねのように、揺れて収まる','終点の前後を行き来しながら、揺れ幅を小さくして止まります。','柔らかい質感や、遊び心のある操作反応に。','Elastic系の曲線をCSS linear()の折れ線で近似しています。ばねの物理シミュレーションではありません。',sampled(elasticOut),['ばね','びよん','弾力','spring']),
entry('elastic-in-out','Elastic in out','前後で弾み、中央を抜ける','始点側で揺れをため、中央を通り、終点側で揺れを収めます。','伸び縮みする素材や、ばねらしい動きを強調するとき。','Elastic系の数式を細かい折れ線で近似しています。動きの両側に余白を確保してください。',sampled(elasticInOut),['ばね','前後に揺れる','弾力','spring']),
entry('steps-4','Steps','4段階で、かくっと進む','滑らかに移動せず、時間を4つに区切って段階的に進みます。','コマ送り、スプライト、段階のある変化を見せるとき。','jump-endは各区間の終わりで進みます。開始直後は動かず、最後の瞬間に終点へ到着します。',{kind:'steps',count:4},['段階','かくかく','コマ送り'])
];
const byId=new Map(easings.map(e=>[e.id,e]));
function resolve(e){return typeof e==='string'?byId.get(e)||easings.find(x=>x.name===e||x.easing===e)||easings[0]:e||easings[0];}
const cubicAt=(p1,p2,s)=>3*(1-s)**2*s*p1+3*(1-s)*s*s*p2+s**3;
export function easingValue(entry,t){const c=resolve(entry).curve;t=clamp(Number.isFinite(t)?t:0,0,1);if(t===0||t===1)return t;if(c.kind==='linear')return t;if(c.kind==='steps')return Math.floor(t*c.count)/c.count;if(c.kind==='bezier'){const[x1,y1,x2,y2]=c.points;let lo=0,hi=1;for(let i=0;i<42;i++){const s=(lo+hi)/2;if(cubicAt(x1,x2,s)<t)lo=s;else hi=s;}return cubicAt(y1,y2,(lo+hi)/2);}const p=c.points;let lo=0,hi=p.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(p[mid][0]<=t)lo=mid;else hi=mid;}const[x0,y0]=p[lo],[x1,y1]=p[hi];return y0+(y1-y0)*(t-x0)/(x1-x0);}
// viewBox 0 0 240 180. x=24..216; y=142 at progress 0, y=42 at progress 1.
export function easingPath(entry){const e=resolve(entry),xy=(t,y)=>`${round(24+192*t,3)} ${round(142-100*y,3)}`;if(e.curve.kind==='steps'){let d=`M ${xy(0,0)}`;for(let i=1;i<=e.curve.count;i++)d+=` L ${xy(i/e.curve.count,(i-1)/e.curve.count)} L ${xy(i/e.curve.count,i/e.curve.count)}`;return d;}const ts=e.curve.kind==='sampled'?e.curve.points.map(p=>p[0]):Array.from({length:241},(_,i)=>i/240);return ts.map((t,i)=>`${i?'L':'M'} ${xy(t,easingValue(e,t))}`).join(' ');}
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/** Load easings.css before mounting. Destroy on route change. */
export function mountEasingLab(container,{autoMotion=false}={}){
 let dead=false,playing=false,duration=1800,progress=0,start=0,raf=0;
 const ac=new AbortController(),signal=ac.signal;
 const defaults=['easing-linear','easing-ease-out','easing-elastic-out'];
 const graph=e=>`<svg class="el-graph" viewBox="0 0 240 180" role="img" aria-label="${escapeHTML(e.name)}の時間と進み具合"><path class="el-grid" d="M24 42H216 M24 92H216 M24 142H216 M24 22V155 M120 22V155 M216 22V155"/><path class="el-reference" d="M24 142L216 42"/><path class="el-curve" d="${easingPath(e)}"/><circle class="el-marker" cx="24" cy="142" r="5"/><text x="24" y="173">0</text><text x="184" y="173">100%</text><text x="1" y="47">1</text><text x="1" y="147">0</text></svg>`;
 container.innerHTML=`<section class="easing-lab" aria-label="イージング比較ラボ"><header class="el-header"><div><p class="el-eyebrow">EASING LAB</p><h2>同じ距離。同じ時間。<br>違うのは、進み方。</h2><p>3つの曲線を一緒に再生。加速と減速が、動きの印象を変えます。</p></div><p class="el-definition">横軸は時間、縦軸は進み具合。<br>曲線が急なところほど、速く進みます。</p></header><div class="el-controls"><div class="el-buttons"><button class="el-play" type="button">▶ 一緒に再生</button><button class="el-restart" type="button">最初から</button></div><label class="el-duration">再生時間 <output>1.8秒</output><input type="range" min="600" max="4000" step="100" value="1800" aria-label="共通の再生時間"></label></div><div class="el-cards">${defaults.map((id,i)=>{const e=byId.get(id);return`<article class="el-card"><div class="el-card-top"><span>${String(i+1).padStart(2,'0')}</span><output class="el-progress-output">0%</output></div><label class="el-choose">進み方を選ぶ<select aria-label="${i+1}つ目のイージング">${easings.map(item=>`<option value="${item.id}"${item.id===id?' selected':''}>${escapeHTML(item.name)} — ${escapeHTML(item.ja)}</option>`).join('')}</select></label><div class="el-graph-wrap">${graph(e)}</div><div class="el-track" aria-hidden="true"><div class="el-rail"></div><i class="el-start"></i><i class="el-finish"></i><span class="el-orb"></span><span class="el-start-label">START</span><span class="el-finish-label">GOAL</span></div><h3>${escapeHTML(e.ja)}</h3><p class="el-description">${escapeHTML(e.description)}</p><p class="el-tip">${escapeHTML(e.tip)}</p><details class="el-code"><summary>この曲線のCSSを見る</summary><pre><code>${escapeHTML(e.easing)}</code></pre><button type="button" class="el-copy">CSSをコピー</button></details></article>`}).join('')}</div><div class="el-scrub"><label>時間を動かして比べる <output>0%</output><input type="range" min="0" max="1000" step="1" value="0" aria-label="共通の時間進捗"></label></div><p class="el-footnote">同じ黒い球が、同じ距離を移動します。Sine・Quad・Cubic・Quart・Quint・Expo・Circ・Backはベジェ曲線による近似、Bounce・Elasticは折れ線による近似です。</p><p class="el-status" role="status" aria-live="polite"></p></section>`;
 const root=container.querySelector('.easing-lab'),playBtn=root.querySelector('.el-play'),scrub=root.querySelector('.el-scrub input'),scrubOutput=root.querySelector('.el-scrub output'),dur=root.querySelector('.el-duration input'),status=root.querySelector('.el-status');
 const tracks=[...root.querySelectorAll('.el-card')].map((card,i)=>({card,entry:byId.get(defaults[i]),dot:card.querySelector('.el-marker'),orb:card.querySelector('.el-orb'),output:card.querySelector('.el-progress-output')}));
 function draw(){if(dead)return;for(const t of tracks){const y=easingValue(t.entry,progress);t.dot.setAttribute('cx',String(24+192*progress));t.dot.setAttribute('cy',String(142-100*y));t.orb.style.left=`${25+50*y}%`;t.output.textContent=`${Math.round(y*100)}%`;}scrub.value=String(Math.round(progress*1000));scrubOutput.textContent=`${Math.round(progress*100)}%`;}
 function pause(){playing=false;cancelAnimationFrame(raf);raf=0;if(!dead){playBtn.textContent=progress>=1?'▶ もう一度再生':progress>0?'▶ 続きから再生':'▶ 一緒に再生';playBtn.setAttribute('aria-pressed','false');}}
 function tick(now){if(dead||!playing)return;progress=clamp((now-start)/duration,0,1);draw();if(progress>=1)pause();else raf=requestAnimationFrame(tick);}
 function play(){if(dead)return;cancelAnimationFrame(raf);if(progress>=1)progress=0;playing=true;start=performance.now()-progress*duration;playBtn.textContent='Ⅱ 一時停止';playBtn.setAttribute('aria-pressed','true');raf=requestAnimationFrame(tick);}
 playBtn.addEventListener('click',()=>playing?pause():play(),{signal});
 root.querySelector('.el-restart').addEventListener('click',()=>{pause();progress=0;draw();play();},{signal});
 dur.addEventListener('input',()=>{duration=Number(dur.value);root.querySelector('.el-duration output').textContent=`${(duration/1000).toFixed(1)}秒`;if(playing)start=performance.now()-progress*duration;},{signal});
 scrub.addEventListener('input',()=>{pause();progress=Number(scrub.value)/1000;draw();},{signal});
 for(const t of tracks){
  t.card.querySelector('select').addEventListener('change',event=>{t.entry=byId.get(event.target.value)||easings[0];const e=t.entry;t.card.querySelector('.el-curve').setAttribute('d',easingPath(e));t.card.querySelector('.el-graph').setAttribute('aria-label',`${e.name}の時間と進み具合`);t.card.querySelector('h3').textContent=e.ja;t.card.querySelector('.el-description').textContent=e.description;t.card.querySelector('.el-tip').textContent=e.tip;t.card.querySelector('code').textContent=e.easing;draw();},{signal});
  t.card.querySelector('.el-copy').addEventListener('click',async()=>{const css=`animation-duration: ${duration}ms;\nanimation-timing-function: ${t.entry.easing};`;try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(css);if(!dead)status.textContent=`${t.entry.name}のCSSをコピーしました。`;}catch{if(dead)return;const code=t.card.querySelector('code');code.textContent=css;t.card.querySelector('details').open=true;const range=document.createRange();range.selectNodeContents(code);const selection=window.getSelection();selection?.removeAllRanges();selection?.addRange(range);status.textContent='CSSを選択しました。選択した文字をコピーできます。';}},{signal});
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();},{signal});draw();
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(autoMotion&&!reduced())play();
 return{destroy(){if(dead)return;pause();dead=true;ac.abort();if(root.parentNode===container)root.remove();},setAuto(value){if(value&&!reduced())play();else pause();}};
}
