import {domLab} from './lab-kit.js';
export const spaceLabs=[];
function setup({root,values:v,kind,on}){
 const board=root.querySelector('.space-board'),world=root.querySelector('.space-world'),mini=root.querySelector('.space-mini'),say=s=>root.querySelector('.lab-status').textContent=s,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));let x=0,y=0,z=v.zoom||1,dragging=false,last=[0,0],selected=false;
 const labels=['FLYING BRAIN','MIXWELL','NAOYAMAN','MINERALion'];
 function paint(){
  z=v.zoom||1;const width=board.clientWidth,height=board.clientHeight;world.replaceChildren();const step=155,nodeW=126,nodeH=83;
  const fromX=Math.floor((x-width/2/z)/step)-1,toX=Math.ceil((x+width/2/z)/step)+1,fromY=Math.floor((y-height/2/z)/step)-1,toY=Math.ceil((y+height/2/z)/step)+1;
  for(let row=fromY;row<=toY;row++)for(let col=fromX;col<=toX;col++){
   if(kind!=='space-infinite'&&(Math.abs(col)>2||Math.abs(row)>2))continue;
   const card=document.createElement('div');card.className='space-card';card.style.cssText=`left:${width/2+(col*step-x)*z-nodeW*z/2}px;top:${height/2+(row*step-y)*z-nodeH*z/2}px;width:${nodeW}px;height:${nodeH}px;transform:scale(${z});transform-origin:0 0`;
   const index=((col+row)%4+4)%4;card.style.background=['#bed9dd','#dcd3bb','#b8c8b2','#c6dce7'][index];
   const strong=document.createElement('strong');strong.textContent=kind==='space-semantic'&&z<.7?'●':labels[index];card.append(strong);
   if(kind!=='space-semantic'||z>=.7){const small=document.createElement('small');small.textContent=`${col} / ${row}`;card.append(small)}
   if(kind==='space-semantic'&&z>=1.6){const p=document.createElement('p');p.textContent='近づくと、構図・色・文字の説明が現れます。';card.append(p)}world.append(card);
  }
  board.style.backgroundPosition=`${width/2-x*z}px ${height/2-y*z}px`;board.style.backgroundSize=`${step*z}px ${step*z}px`;
  const text=kind==='space-semantic'?(z<.7?'概要':z<1.6?'名前と座標':'詳しい説明'):`中心 ${Math.round(x)}, ${Math.round(y)}`;say(`${text} · ${z.toFixed(1)}倍`);
  if(mini){const g=mini.getContext('2d');g.clearRect(0,0,120,70);g.fillStyle='#eaf0ec';g.fillRect(0,0,120,70);for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++){g.fillStyle='#7d9da5';g.fillRect(60+c*20-5,35+r*11-3,10,6)}g.strokeStyle='#164e67';g.lineWidth=2;g.strokeRect(60+x/8-width/z/16,35+y/14-height/z/28,width/z/8,height/z/14)}
 }
 function zoom(value){v.zoom=clamp(value,.4,2.5);const range=root.querySelector('[data-key=zoom]');if(range){range.value=v.zoom;range.closest('label').querySelector('output').textContent=v.zoom.toFixed(1)}paint()}
 on(board,'pointerdown',e=>{if(e.target===mini)return;dragging=true;last=[e.clientX,e.clientY];board.setPointerCapture(e.pointerId)});
 on(board,'pointermove',e=>{if(!dragging)return;x-=(e.clientX-last[0])/z;y-=(e.clientY-last[1])/z;last=[e.clientX,e.clientY];if(kind!=='space-infinite'){x=clamp(x,-360,360);y=clamp(y,-360,360)}paint()});on(board,'pointerup',()=>dragging=false);on(board,'pointercancel',()=>dragging=false);
 on(board,'keydown',e=>{const d={ArrowLeft:[-45,0],ArrowRight:[45,0],ArrowUp:[0,-45],ArrowDown:[0,45]}[e.key];if(d){e.preventDefault();x+=d[0]/z;y+=d[1]/z;if(kind!=='space-infinite'){x=clamp(x,-360,360);y=clamp(y,-360,360)}paint()}else if(e.key==='+'||e.key==='='){e.preventDefault();zoom(z+.2)}else if(e.key==='-'){e.preventDefault();zoom(z-.2)}else if(e.key==='Home'){e.preventDefault();x=y=0;zoom(1)}});
 if(mini){on(mini,'pointerdown',e=>{e.stopPropagation();const b=mini.getBoundingClientRect();x=clamp(((e.clientX-b.left)/b.width*120-60)*8,-360,360);y=clamp(((e.clientY-b.top)/b.height*70-35)*14,-360,360);paint()})}
 for(const b of root.querySelectorAll('[data-nav]'))on(b,'click',()=>{const directions={left:[-80,0],right:[80,0],up:[0,-80],down:[0,80]};const d=directions[b.dataset.nav];x+=d[0]/z;y+=d[1]/z;if(kind!=='space-infinite'){x=clamp(x,-360,360);y=clamp(y,-360,360)}paint()});
 const ro=new ResizeObserver(paint);ro.observe(board);
 return {update:paint,action(){if(kind==='space-focus'){selected=!selected;x=selected?155:0;y=selected?155:0;zoom(selected?2: .6)}else{x=y=0;zoom(1)}},destroy(){ro.disconnect()}};
}
const css=`.lab-scene{max-width:430px;height:200px;min-height:170px;border:0}.lab-scene:has(canvas){max-width:430px;height:200px;aspect-ratio:auto;flex-shrink:1}.space-board{height:160px;position:relative;overflow:hidden;touch-action:none;background-color:#edf0e9;background-image:radial-gradient(#829ba6 1px,transparent 1px);outline-offset:-3px;cursor:grab}.space-board:focus-visible{outline:3px solid #235f78}.space-world{position:absolute;inset:0;pointer-events:none}.space-card{position:absolute;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:6px;border:1px solid #607e8b;border-radius:4px;color:#193a47;overflow:hidden}.space-card strong{font:bold 12px Arial;max-width:100%;overflow:hidden}.space-card small{font:10px monospace;margin-top:6px}.space-card p{font:8px/1.4 Arial,Meiryo,sans-serif;margin:4px 0 0;text-align:center}.space-mini{position:absolute;bottom:6px;right:6px;width:100px;height:59px;border:1px solid #335563;touch-action:none;cursor:crosshair}.space-nav{display:flex;justify-content:center;gap:6px;margin-top:4px}.space-nav button{min-width:40px;min-height:36px;background:#fff;border:1px solid #aaa;color:#203e49;font-size:15px;cursor:pointer}.space-nav button:focus-visible{outline:3px solid #235f78}`;
for(const [id,name,ja,description]of[
 ['space-infinite','Infinite canvas','画面の外へ、どこまでも進む','画面の移動に合わせて必要な範囲のカードだけを描き、終端のない座標空間を探索します。'],
 ['space-focus','Overview to detail','全体から、気になる場所へ近づく','一覧で関係を眺め、注目地点へ移動して拡大し、再び全体へ戻ります。'],
 ['space-minimap','Navigable minimap','小さな地図で、現在地を知る','全体図に今見ている範囲を重ねます。地図を押すと、その場所へ視点が移ります。'],
 ['space-semantic','Semantic zoom','近づくほど、説明が詳しくなる','縮小時は点、標準では名前、拡大時は説明へ切り替えます。倍率に応じて情報の密度を変えます。']
])spaceLabs.push(domLab({id,category:'layout',categories:['layout','gesture','data'],name,ja,description,use:'作品群や情報の関係を、空間として探索してもらうとき。',tip:'ドラッグ、矢印ボタン、矢印キーで移動。倍率スライダーや＋／−で拡大できます。Homeで中心に戻ります。',tags:['探索させたい','空間探索','ズーム','FLYING BRAIN',ja],source:'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',level:'applied',targets:['layout','ui'],contexts:['portfolio','navigation'],inputs:['pointer','adjust'],engine:'css',support:'HTML / CSS / Pointer Events。無限キャンバス以外は25枚の範囲を探索します。'},setup,[{key:'zoom',label:'拡大率',min:.4,max:2.5,value:id==='space-focus'?.6:1,step:.1}],`<div class="space-board" tabindex="0" role="group" aria-label="FLYING BRAINの探索空間。矢印キーで移動"><div class="space-world"></div>${id==='space-minimap'?'<canvas class="space-mini" width="120" height="70" role="img" aria-label="全体地図と現在の表示範囲。下の方向ボタンでも移動できます"></canvas>':''}</div><div class="space-nav"><button data-nav="left" aria-label="左へ移動">←</button><button data-nav="up" aria-label="上へ移動">↑</button><button data-nav="down" aria-label="下へ移動">↓</button><button data-nav="right" aria-label="右へ移動">→</button></div>`,css,{static:true,action:id==='space-focus'?'全体／詳細':'中心へ戻る'}));
