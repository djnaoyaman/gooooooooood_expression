import {canvasLab} from './lab-kit.js';
const source='https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations';
const c=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
function physics({ctx,time,dt,values:v,state:s,pointer:p,event,kind,circle,line,text,status}){
 if(!s.ready){Object.assign(s,{ready:true,x:85,y:45,vx:100,vy:0,angle:.8,omega:0});}
 const k=kind.split('-')[1];
 if(k==='spring'){
  const target=p.down||event==='keyboard'?p.x:160;if(p.down||event==='keyboard'){s.x=p.x;s.vx=0}else{const a=(target-s.x)*v.stiffness-s.vx*v.damping;s.vx+=a*dt;s.x+=s.vx*dt;s.x=Math.max(18,Math.min(302,s.x))}
  line(35,90,285,90,'#ccc');line(160,60,160,120,'#bbb');circle(s.x,90,17);text('spring',70,150);const progress=(time%2)/2;circle(35+250*(1-Math.pow(1-progress,3)),34,5,'#999');text('ease-out',280,39,9);status('球をつかんで離す · Spaceでつかむ／離す');
 }else if(k==='gravity'){
  if(event==='down'||event==='keyboard'){s.x=p.x;s.y=Math.min(p.y,140);s.vy=0}
  if(!p.down){s.vy+=v.gravity*dt;s.y+=s.vy*dt;if(s.y>146){s.y=146;s.vy=-Math.abs(s.vy)*v.bounce}}else{s.x=p.x;s.y=Math.min(p.y,146)}
  line(15,162,305,162);circle(s.x,s.y,16);text('gravity / restitution',160,22,10);status('高さと跳ね返りを比べる · タップで落とす');
 }else if(k==='pendulum'){
  if(p.down||event==='keyboard'){s.angle=Math.atan2(p.x-160,Math.max(5,p.y-12));s.omega=0}else{s.omega+=(-v.gravity/100*Math.sin(s.angle)-v.damping*s.omega)*dt;s.angle+=s.omega*dt}
  const x=160+125*Math.sin(s.angle),y=20+125*Math.cos(s.angle);line(160,20,x,y,'#555',2);circle(160,20,4);circle(x,y,15);status('振れ幅を変えて、戻る速さを見る');
 }else{
  if(event==='down'||event==='keyboard'){s.x=p.x;s.y=p.y;s.vx=0;s.vy=0}
  if(p.down){s.vx=p.dx*25;s.vy=p.dy*25;s.x=p.x;s.y=p.y}else{s.vx*=Math.exp(-v.friction*dt);s.vy*=Math.exp(-v.friction*dt);s.x+=s.vx*dt;s.y+=s.vy*dt;for(const [pos,vel,min,max] of [['x','vx',15,305],['y','vy',15,160]]){if(s[pos]<min||s[pos]>max){s[pos]=Math.max(min,Math.min(max,s[pos]));s[vel]*=-v.bounce}}}
  ctx.strokeStyle='#ccc';ctx.strokeRect(1,1,318,173);circle(s.x,s.y,14);status('つかんで投げる · 摩擦0なら速度が保たれる');
 }
}
function rhythm({time,values:v,kind,circle,line,text,status}){
 const k=kind.split('-')[1],t=time*v.speed;
 for(let i=0;i<7;i++){
  const phase=k==='stagger'?t-i*v.gap:k==='wave'?t-i*.4:k==='alternate'?t+(i%2)*Math.PI:t;
  let y=92,r=10;
  if(k==='anticipation'){const p=(t/3)%1;y=92+(p<.25?Math.sin(p/.25*Math.PI)*18:p<.6?-Math.sin((p-.25)/.35*Math.PI)*55:0);r=10+(p<.25?Math.sin(p/.25*Math.PI)*3:0)}
  else y=92-Math.max(0,Math.sin(phase))*(v.height??45);
  line(25+i*45,155,25+i*45,160);circle(25+i*45,y,r,i%2?'#888':'#222');text(String(i+1),25+i*45,176,9);
 }status(k==='anticipation'?'沈む → 跳ぶ → 余韻。準備が方向を伝える':'間隔と速さを変え、まとまり方を見る');
}
function particles({ctx,time,dt,values:v,state:s,pointer:p,kind,circle,line,text,status}){
 const k=kind.split('-')[1];if(!s.points||s.points.length!==v.count){s.points=Array.from({length:v.count},(_,i)=>({x:160+Math.cos(i*2.399)*Math.sqrt(i)*8,y:90+Math.sin(i*2.399)*Math.sqrt(i)*5,vx:Math.cos(i*2.399)*55,vy:Math.sin(i*2.399)*55,age:i/v.count*3}));}
 const target=p.active?p:{x:160,y:90};
 s.points.forEach((q,i)=>{
  if(k==='constellation'){q.x=160+Math.sin(i*2.4+time*.22)*143;q.y=85+Math.cos(i*1.7+time*.17)*69;if(i>0){const a=s.points[i-1],d=Math.hypot(a.x-q.x,a.y-q.y);if(d<v.reach)line(a.x,a.y,q.x,q.y,'#bbb')}circle(q.x,q.y,2);}
  else if(k==='confetti'){q.age+=dt;q.vy+=v.gravity*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.y>185||q.age>3.5){q.x=target.x;q.y=target.y;q.vx=Math.cos(i*2.399)*90;q.vy=-30-Math.abs(Math.sin(i*4))*100;q.age=0}ctx.save();ctx.translate(q.x,q.y);ctx.rotate(time*2+i);ctx.fillStyle=i%2?'#999':'#222';ctx.fillRect(-3,-2,6,4);ctx.restore();}
  else if(k==='attraction'){const dx=target.x-q.x,dy=target.y-q.y,d=Math.max(20,Math.hypot(dx,dy));q.vx+=(dx/d*v.force-q.vx*.9)*dt;q.vy+=(dy/d*v.force-q.vy*.9)*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;circle(q.x,q.y,2);}
  else {const angle=i*2.399,r=Math.sqrt(i)*v.spread;const tx=160+Math.cos(angle+time*.3)*r,ty=90+Math.sin(angle+time*.3)*r*.53;q.x+=(tx-q.x)*Math.min(1,dt*3);q.y+=(ty-q.y)*Math.min(1,dt*3);circle(q.x,q.y,2,i%3?'#333':'#999');}
 });status(`${v.count} particles · ${k==='attraction'?'指先・矢印キーへ集まる':'数を変えて、集まり方を観察'}`);
}
function generative({ctx,time,values:v,state:s,kind,circle,line,text,status}){
 const k=kind.split('-')[1];
 if(k==='flow'){for(let y=12;y<180;y+=12)for(let x=10;x<320;x+=12){const a=Math.sin(x/v.scale+time*.25)*Math.cos(y/v.scale-time*.15)*v.turn;line(x,y,x+Math.cos(a)*9,y+Math.sin(a)*9,'#555')}}
 else if(k==='fractal'){function branch(x,y,len,a,depth){if(depth<=0)return;const nx=x+Math.cos(a)*len,ny=y+Math.sin(a)*len;line(x,y,nx,ny,depth>3?'#222':'#888',Math.max(.5,depth*.4));branch(nx,ny,len*.69,a-v.angle,depth-1);branch(nx,ny,len*.69,a+v.angle,depth-1)}branch(160,175,55,-Math.PI/2,v.depth);}
 else if(k==='voronoi'){const points=Array.from({length:v.count},(_,i)=>({x:160+Math.sin(i*5.4+v.seed)*145,y:90+Math.cos(i*3.2+v.seed)*78}));for(let y=0;y<180;y+=5)for(let x=0;x<320;x+=5){let min=Infinity,which=0;points.forEach((p,i)=>{const d=(x-p.x)**2+(y-p.y)**2;if(d<min){min=d;which=i}});const shade=80+which*19%150;ctx.fillStyle=`rgb(${shade},${shade},${shade})`;ctx.fillRect(x,y,5,5)}points.forEach(p=>circle(p.x,p.y,2,'#fff'));}
 else{const cols=64,rows=36;let row=Array(cols).fill(0);row[32]=1;for(let y=0;y<rows;y++){for(let x=0;x<cols;x++)if(row[x]){ctx.fillStyle='#333';ctx.fillRect(x*5,y*5,5,5)}row=row.map((_,x)=>(v.rule>>((row[(x+cols-1)%cols]<<2)|(row[x]<<1)|row[(x+1)%cols]))&1)}text('rule '+v.rule,275,17,10,'#888');}status(k==='flow'?'各点の向きを、同じ数式で決める':'規則を少し変えて、全体の変化を見る');
}
export const worlds=[];
function add(id,category,name,ja,description,use,tip,tags,draw,controls,options={}){worlds.push(canvasLab({id,category,name,ja,description,use,tip,tags,source,prompt:options.prompt||tip,categories:options.categories||[category]},draw,controls,options))}
add('physics-spring','physics','Spring dynamics','重さを感じるばね','位置と速度から、ばねの力と抵抗を毎フレーム計算します。上の小さな点は決めた曲線で動くイージングです。','ドラッグ後の復帰、追従するUI。','抵抗を小さくして離すと、何度も行き過ぎます。上の等しい時間で終わる動きと比較してください。',['ばね','物理','イージング','弾む','操作'],physics,[c('stiffness','ばねの強さ',5,90,30),c('damping','抵抗',0,20,4,.5)],{drag:true,categories:['physics','interaction']});
add('physics-gravity','physics','Gravity & restitution','重力と跳ね返り','加速度で落下させ、床に触れた瞬間に速度を反転・減衰させます。','落ちる物体、ボールの運動。','球を持ち上げて離す。跳ね返り0と0.9の違いを見てください。',['重力','落下','バウンド','物理'],physics,[c('gravity','重力',30,600,240),c('bounce','跳ね返り',0,.95,.7,.05)],{drag:true});
add('physics-pendulum','physics','Damped pendulum','振り子の減衰','重力の接線方向の成分と角速度から、振り子の往復を計算します。','揺れる吊り札や、振動の理解。','球を横に動かして離す。抵抗を0にすると揺れが続きます。',['振り子','揺れ','減衰','物理'],physics,[c('gravity','重力',100,1500,700),c('damping','抵抗',0,2,.15,.05)],{drag:true});
add('physics-inertia','physics','Inertial throw','投げて、滑って、止まる','操作中の移動から速度を受け取り、離した後は摩擦で速度を減らします。','ドラッグ操作の手応え、物体の投擲。','速くなぞって離す。摩擦を増やすと移動距離が短くなります。',['慣性','摩擦','投げる','ドラッグ'],physics,[c('friction','摩擦',0,5,1,.1),c('bounce','壁の反発',0,1,.8,.05)],{drag:true,categories:['physics','gesture','interaction']});
add('rhythm-stagger','rhythm','Stagger interval','時間差が順序をつくる','同じ動きを少しずつ遅らせると、ひとまとまりの流れが生まれます。','一覧、見出し、段階的な登場。','時間差を0にしてから広げてください。',['時間差','stagger','順番','リズム'],rhythm,[c('gap','位相差',0,1.2,.35,.05),c('speed','速さ',.2,4,1.5,.1)],{categories:['rhythm','motion']});
add('rhythm-wave','rhythm','Traveling wave','波が順番に伝わる','隣り合う要素の位相をずらし、波が横へ移動するように見せます。','ローディング、音の気配、流れ。','高さを0から増やし、波の輪郭を見てください。',['波','同期','リズム','位相'],rhythm,[c('height','振れ幅',0,65,45),c('speed','速さ',.2,4,1.4,.1)],{categories:['rhythm','motion']});
add('rhythm-alternate','rhythm','Alternating rhythm','交互の動きで拍を刻む','隣同士を半周期ずらすと、交互に動く拍が生まれます。','リズムを持つ装飾、待機表示。','速さを変えて、落ち着きと忙しさの境目を探してください。',['交互','拍','リズム','反復'],rhythm,[c('height','振れ幅',0,65,40),c('speed','速さ',.2,4,1.7,.1)]);
add('rhythm-anticipation','rhythm','Anticipation & follow-through','動き出す前に、少しためる','跳ぶ前に沈み、跳んだ後に休む。動作の前後を含めてひとつの動きにします。','キャラクター、ボタン、視線誘導。','準備・跳躍・休止の三つの時間を観察してください。',['予備動作','余韻','ため','リズム'],rhythm,[c('speed','再生速度',.2,3,1,.1)],{categories:['rhythm','motion']});
add('particles-constellation','particles','Particle network','距離でつながる星座','近い点同士だけを線で結び、点の移動でつながりが変わる模様をつくります。','静かな背景、ネットワークの比喩。','接続距離を変え、点が線の集まりに変わる境目を見る。',['星座','粒子','線','距離'],particles,[c('count','点の数',12,80,40),c('reach','接続距離',10,160,65)],{categories:['particles','generative']});
add('particles-confetti','particles','Confetti emitter','小さな紙片が舞う','放出位置、初速、重力、回転をそれぞれの紙片に与えます。','達成を祝う短い演出。','放出位置をタップで変えてください。色を使わなくても祝祭感が生まれます。',['紙吹雪','粒子','重力','回転'],particles,[c('count','紙片の数',10,100,55),c('gravity','重力',10,180,65)],{categories:['particles','physics']});
add('particles-attraction','particles','Attraction field','指先へ集まる粒子','目標点への力と抵抗で、それぞれの粒子が追いかけます。','指先に反応する背景、集合の演出。','引力を強くすると、目標を通り過ぎる動きも変わります。',['粒子','引力','指先','群れ'],particles,[c('count','粒子の数',15,150,75),c('force','引力',10,180,65)],{categories:['particles','physics','gesture']});
add('particles-phyllotaxis','particles','Phyllotaxis arrangement','黄金角で点を並べる','点ごとに約137.5度ずつ回し、中心からの距離を平方根で増やします。','花のような模様、規則的な散布。','間隔と数を変え、渦が浮かぶところを探してください。',['粒子','黄金角','規則','植物'],particles,[c('count','点の数',20,180,100),c('spread','点の間隔',2,12,10,.5)],{categories:['particles','generative']});
add('generative-flow','generative','Flow field','数式で向きを配る','座標を三角関数に渡し、各場所の向きが連続して変わる場をつくります。','流れるような模様や、粒子の進路。','模様の大きさを変え、局所と全体のつながりを見る。',['流れ','数式','フローフィールド','生成'],generative,[c('scale','模様の大きさ',15,130,55),c('turn','曲がり',.2,6,3,.1)]);
add('generative-fractal','generative','Recursive tree','同じ規則で枝を増やす','枝分かれの規則を、小さくしながら繰り返します。','樹木の模様、再帰の理解。','枝の角度と深さを変えて、同じ規則の広がりを見る。',['フラクタル','再帰','樹木','生成'],generative,[c('angle','枝の角度',.1,1.1,.5,.05),c('depth','繰り返す深さ',2,9,7)],{animated:false});
add('generative-voronoi','generative','Voronoi regions','いちばん近い点で区切る','各位置を最も近い点の領域に分けます。見本は5px単位の近似描画です。','細胞状の模様、領域の分割。','点の数と配置を変え、境界の位置を比べてください。',['ボロノイ','領域','細胞','生成'],generative,[c('count','基準点の数',3,20,10),c('seed','配置',0,10,2,.1)],{animated:false});
add('generative-automaton','generative','Elementary cellular automaton','三つの隣から、次を決める','左右と自分の状態から、次の行を決める一次元セル・オートマトンです。','規則から生まれる模様の探究。','ルール30、90、110を比較してください。ランダムに見える模様にも規則があります。',['セルオートマトン','ルール','生成','模様'],generative,[c('rule','ルール番号',0,255,90)],{animated:false});
