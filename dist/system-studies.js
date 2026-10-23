import {canvasLab} from './lab-kit.js';
const c=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
function systems({ctx,kind,values:v,state:s,time,dt,pointer:p,event,circle,line,text,status}){
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rand=i=>{const a=Math.sin(i*127.1+41.7)*43758.5453;return a-Math.floor(a)},step=dt?Math.min(dt,.025):0;
 if(kind==='physics-collisions'){
  s.balls??=Array.from({length:14},(_,i)=>({x:20+i%7*45,y:35+Math.floor(i/7)*80,vx:(rand(i)-.5)*110,vy:(rand(i+20)-.5)*80,r:8+rand(i+50)*4}));
  for(const b of s.balls){b.x+=b.vx*step*v.speed;b.y+=b.vy*step*v.speed;if(b.x<b.r||b.x>320-b.r){b.vx*=-v.bounce;b.x=clamp(b.x,b.r,320-b.r)}if(b.y<b.r||b.y>180-b.r){b.vy*=-v.bounce;b.y=clamp(b.y,b.r,180-b.r)}}
  for(let i=0;i<s.balls.length;i++)for(let j=i+1;j<s.balls.length;j++){const a=s.balls[i],b=s.balls[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,over=a.r+b.r-d;if(over>0){const nx=dx/d,ny=dy/d;a.x-=nx*over/2;a.y-=ny*over/2;b.x+=nx*over/2;b.y+=ny*over/2;const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const imp=-(1+v.bounce)*rel/2;a.vx-=imp*nx;a.vy-=imp*ny;b.vx+=imp*nx;b.vy+=imp*ny}}}s.balls.forEach(b=>circle(b.x,b.y,b.r));status('等質量の円 · 反発係数を変えて衝突を比較');return;
 }
 if(kind==='physics-cloth'){
  const nx=14,ny=8;s.points??=Array.from({length:nx*ny},(_,i)=>({x:40+i%nx*18,y:20+Math.floor(i/nx)*15,px:40+i%nx*18,py:20+Math.floor(i/nx)*15,pin:i===0||i===nx-1}));
  if(step)for(const a of s.points){if(a.pin)continue;const x=a.x,y=a.y;a.x+=(a.x-a.px)*.98+Math.sin(time+a.y*.02)*v.wind*.018;a.y+=(a.y-a.py)*.98+.12;a.px=x;a.py=y;}
  if(p.down){const nearest=s.points.filter(a=>!a.pin).reduce((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)<Math.hypot(b.x-p.x,b.y-p.y)?a:b);nearest.x=p.x;nearest.y=p.y;}
  for(let pass=0;pass<5;pass++)for(let i=0;i<s.points.length;i++)for(const [j,len]of[[i%nx<nx-1?i+1:-1,18],[i<nx*(ny-1)?i+nx:-1,15]]){if(j<0)continue;const a=s.points[i],b=s.points[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-len)/d*.5;if(!a.pin){a.x+=dx*f;a.y+=dy*f}if(!b.pin){b.x-=dx*f;b.y-=dy*f}}
  for(let i=0;i<s.points.length;i++){const a=s.points[i];a.y=Math.min(173,a.y);if(i%nx<nx-1){const b=s.points[i+1];line(a.x,a.y,b.x,b.y,'#555')}if(i<s.points.length-nx){const b=s.points[i+nx];line(a.x,a.y,b.x,b.y,'#999')}}status('距離制約でつなぐ布 · 風とドラッグで変形');return;
 }
 if(kind==='physics-softbody'){
  const n=24;s.points??=Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return{x:160+Math.cos(a)*53,y:90+Math.sin(a)*53,vx:0,vy:0}});
  let cx=s.points.reduce((sum,b)=>sum+b.x,0)/n,cy=s.points.reduce((sum,b)=>sum+b.y,0)/n;
  if(step)for(let i=0;i<n;i++){const a=s.points[i],angle=i/n*Math.PI*2,tx=cx+Math.cos(angle)*53,ty=cy+Math.sin(angle)*53;a.vx+=(tx-a.x)*v.stiffness*step;a.vy+=(ty-a.y)*v.stiffness*step;if(p.down){const d=Math.hypot(a.x-p.x,a.y-p.y);if(d<70){a.vx+=(a.x-p.x)*step*12;a.vy+=(a.y-p.y)*step*12}}a.vx*=.94;a.vy*=.94;a.x=clamp(a.x+a.vx*step,10,310);a.y=clamp(a.y+a.vy*step,10,170)}
  ctx.beginPath();s.points.forEach((a,i)=>i?ctx.lineTo(a.x,a.y):ctx.moveTo(a.x,a.y));ctx.closePath();ctx.fillStyle='#333';ctx.fill();status('形状を戻すばねの簡易モデル · 押して変形');return;
 }
 if(kind==='physics-fluid'){
  const W=40,H=24,N=W*H,ix=(x,y)=>clamp(Math.round(y),0,H-1)*W+clamp(Math.round(x),0,W-1);
  if(!s.u){s.u=new Float32Array(N);s.v=new Float32Array(N);s.dye=new Float32Array(N);s.pressure=new Float32Array(N)}
  if(step){const x=p.active?p.x/320*(W-1):20+Math.sin(time)*9,y=p.active?p.y/180*(H-1):12+Math.cos(time*.7)*5;for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i,dist=Math.hypot(x-i,y-j);if(dist<3){s.dye[k]=1;s.u[k]+=(p.active?p.dx*.08:Math.cos(time)*.3)*v.force;s.v[k]+=(p.active?p.dy*.08:Math.sin(time)*.3)*v.force}}
   const u=s.u.slice(),vel=s.v.slice(),d=s.dye.slice(),div=new Float32Array(N);for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i,k0=ix(i-u[k]*.4,j-vel[k]*.4);s.u[k]=u[k0]*.99;s.v[k]=vel[k0]*.99;s.dye[k]=d[k0]*.995;div[k]=(s.u[k+1]-s.u[k-1]+s.v[k+W]-s.v[k-W])*.5}
   for(let n=0;n<12;n++)for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i;s.pressure[k]=(s.pressure[k-1]+s.pressure[k+1]+s.pressure[k-W]+s.pressure[k+W]-div[k])*.25}
   for(let j=1;j<H-1;j++)for(let i=1;i<W-1;i++){const k=j*W+i;s.u[k]-=(s.pressure[k+1]-s.pressure[k-1])*.5;s.v[k]-=(s.pressure[k+W]-s.pressure[k-W])*.5}
  }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=240-s.dye[y*W+x]*210;ctx.fillStyle=`rgb(${g},${g},${g})`;ctx.fillRect(x*8,y*7.5,9,8)}status('低解像度の移流・圧力補正 · 指で流れを加える');return;
 }
 if(kind==='generative-boids'){
  s.birds??=Array.from({length:45},(_,i)=>({x:rand(i)*320,y:rand(i+80)*180,vx:Math.cos(i)*30,vy:Math.sin(i)*30}));const old=s.birds.map(b=>({...b}));
  if(step)s.birds.forEach((b,i)=>{let ax=0,ay=0,cx=0,cy=0,sx=0,sy=0,n=0;old.forEach((a,j)=>{if(i===j)return;const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<48&&d>0){ax+=a.vx;ay+=a.vy;cx+=a.x;cy+=a.y;n++;if(d<18){sx-=dx/d;sy-=dy/d}}});if(n){b.vx+=((ax/n-b.vx)*.5+(cx/n-b.x)*.25+sx*v.separation)*step;b.vy+=((ay/n-b.vy)*.5+(cy/n-b.y)*.25+sy*v.separation)*step}const speed=Math.hypot(b.vx,b.vy)||1;b.vx=b.vx/speed*30;b.vy=b.vy/speed*30;b.x=(b.x+b.vx*step+320)%320;b.y=(b.y+b.vy*step+180)%180});
  for(const b of s.birds){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-4,-3);ctx.lineTo(-2,0);ctx.lineTo(-4,3);ctx.closePath();ctx.fillStyle='#222';ctx.fill();ctx.restore()}status('分離・整列・結合の三つの規則で群れをつくる');return;
 }
 if(kind==='generative-reaction'){
  const W=64,H=36,N=W*H;if(!s.a){s.a=new Float32Array(N).fill(1);s.b=new Float32Array(N);for(let y=14;y<22;y++)for(let x=25;x<39;x++)s.b[y*W+x]=.5+rand(x+y)*.4}
  if(step)for(let pass=0;pass<5;pass++){const a=s.a.slice(),b=s.b.slice();for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const k=y*W+x,lapA=a[k-1]+a[k+1]+a[k-W]+a[k+W]-4*a[k],lapB=b[k-1]+b[k+1]+b[k-W]+b[k+W]-4*b[k],reaction=a[k]*b[k]*b[k];s.a[k]=clamp(a[k]+.2*lapA-reaction+v.feed*(1-a[k]),0,1);s.b[k]=clamp(b[k]+.1*lapB+reaction-(v.kill+v.feed)*b[k],0,1)}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=Math.round(clamp((s.a[y*W+x]-s.b[y*W+x]),0,1)*230);ctx.fillStyle=`rgb(${g},${g},${g})`;ctx.fillRect(x*5,y*5,5,5)}status('Gray–Scott反応拡散 · 模様は時間をかけて育ちます');return;
 }
 if(kind.startsWith('three-')){
  const project=([x,y,z])=>{const angle=v.angle*Math.PI/180,a=x*Math.cos(angle)-z*Math.sin(angle),b=x*Math.sin(angle)+z*Math.cos(angle),f=(v.zoom||130)/(4+b);return[160+a*f,95-y*f,b]};let vertices=[],faces=[];
  if(kind==='three-model'){
   if(!s.model){const positions=[0,1.3,0,-1,-.8,1,1,-.8,1,1,-.8,-1,-1,-.8,-1],indices=[0,1,2,0,2,3,0,3,4,0,4,1,1,4,3,1,3,2],buf=new ArrayBuffer(positions.length*4+indices.length*2);new Float32Array(buf,0,positions.length).set(positions);new Uint16Array(buf,positions.length*4).set(indices);const uri='data:application/octet-stream;base64,'+btoa(String.fromCharCode(...new Uint8Array(buf)));s.gltf={asset:{version:'2.0',generator:'g*e original'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0},indices:1}]}],buffers:[{byteLength:buf.byteLength,uri}],bufferViews:[{buffer:0,byteOffset:0,byteLength:60},{buffer:0,byteOffset:60,byteLength:36}],accessors:[{bufferView:0,componentType:5126,count:5,type:'VEC3',min:[-1,-.8,-1],max:[1,1.3,1]},{bufferView:1,componentType:5123,count:18,type:'SCALAR'}]};const raw=Uint8Array.from(atob(s.gltf.buffers[0].uri.split(',')[1]),x=>x.charCodeAt(0)).buffer,pa=new Float32Array(raw,0,15),ia=new Uint16Array(raw,60,18);s.model={vertices:Array.from({length:5},(_,i)=>Array.from(pa.slice(i*3,i*3+3))),faces:Array.from({length:6},(_,i)=>Array.from(ia.slice(i*3,i*3+3)))}}
   vertices=s.model.vertices;faces=s.model.faces;status('埋め込みglTF 2.0の位置・索引を読む · Canvas投影');
  }else if(kind==='three-skeleton'){
   const angle=Math.sin(time*1.6)*v.bend*.01745,bones=[[0,-1,0],[Math.sin(angle)*.6,-.3,0],[Math.sin(angle)*1.2,.4,0],[Math.sin(angle)*1.5,1.1,0]];
   for(let j=0;j<18;j++){const t=j/17*3,k=Math.min(2,Math.floor(t)),f=t-k,b=bones[k],n=bones[k+1];for(let i=0;i<10;i++){const a=i/10*Math.PI*2;vertices.push([b[0]*(1-f)+n[0]*f+Math.cos(a)*.22,b[1]*(1-f)+n[1]*f,Math.sin(a)*.22])}}for(let j=0;j<17;j++)for(let i=0;i<10;i++)faces.push([j*10+i,j*10+(i+1)%10,(j+1)*10+(i+1)%10,(j+1)*10+i]);status('隣り合うボーンの重みで頂点を変形 · 簡易スキニング');
  }else{
   for(let j=0;j<16;j++)for(let i=0;i<20;i++){const a=i/20*Math.PI*2,y=j/15*2-1,twist=kind==='three-deform'?y*v.twist:0,r=kind==='three-camera'?.7:.55+.18*Math.cos(y*5);vertices.push([Math.cos(a+twist)*r,y,Math.sin(a+twist)*r])}for(let j=0;j<15;j++)for(let i=0;i<20;i++)faces.push([j*20+i,j*20+(i+1)%20,(j+1)*20+(i+1)%20,(j+1)*20+i]);status(kind==='three-camera'?'視点の回転と画角を比較 · Canvas透視投影':'高さに応じて頂点をねじる · メッシュ変形');
  }
  const projected=vertices.map(project);faces.sort((a,b)=>b.reduce((sum,i)=>sum+projected[i][2],0)/b.length-a.reduce((sum,i)=>sum+projected[i][2],0)/a.length);for(const f of faces){ctx.beginPath();f.forEach((id,i)=>{const q=projected[id];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});ctx.closePath();const shade=90+Math.round((projected[f[0]][2]+1)*50);ctx.fillStyle=`rgb(${shade},${shade},${shade})`;ctx.fill();ctx.strokeStyle='#777';ctx.lineWidth=.4;ctx.stroke()}return;
 }
 if(kind==='shader-raymarch'){
  const W=80,H=45;if(!s.off){s.off=document.createElement('canvas');s.off.width=W;s.off.height=H;s.g=s.off.getContext('2d')}const image=s.g.createImageData(W,H),angle=v.angle*.01745;
  const sdf=(x,y,z)=>{const a=x*Math.cos(angle)-z*Math.sin(angle),b=x*Math.sin(angle)+z*Math.cos(angle),sphere=Math.hypot(a+.65,y,b)-.6,torus=Math.hypot(Math.hypot(a-.55,b)-.5,y)-.17;return Math.min(sphere,torus)};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let dx=(x/W-.5)*2.8,dy=(.5-y/H)*1.6,dz=1,len=Math.hypot(dx,dy,dz);dx/=len;dy/=len;dz/=len;let t=0,hit=false;for(let n=0;n<64;n++){const d=sdf(dx*t,dy*t,-3+dz*t);if(d<.005){hit=true;break}t+=d;if(t>8)break}let gray=235;if(hit){const X=dx*t,Y=dy*t,Z=-3+dz*t,e=.005,nx=sdf(X+e,Y,Z)-sdf(X-e,Y,Z),ny=sdf(X,Y+e,Z)-sdf(X,Y-e,Z),nz=sdf(X,Y,Z+e)-sdf(X,Y,Z-e),nl=Math.hypot(nx,ny,nz)||1;gray=35+160*Math.max(0,(nx*.4+ny*.7-nz*.6)/nl)}const k=(y*W+x)*4;image.data[k]=image.data[k+1]=image.data[k+2]=gray;image.data[k+3]=255}s.g.putImageData(image,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(s.off,0,0,320,180);status('SDFの距離だけ進むレイマーチング · CPU教材');return;
 }
 if(kind==='shader-bloom'){ctx.fillStyle='#161616';ctx.fillRect(0,0,320,180);for(let i=0;i<3;i++){ctx.save();ctx.filter=`blur(${v.amount*(i+1)/2}px)`;ctx.globalCompositeOperation='screen';circle(160,90,24,'#eee');ctx.restore()}circle(160,90,20,'#fff');text('LIGHT',160,156,12,'#888');status('明るい層をぼかして加算合成 · Canvas教材');return;}
 if(kind==='shader-dof'){for(let i=0;i<7;i++){ctx.save();const depth=i/6;ctx.filter=`blur(${Math.abs(depth-v.focus)*v.blur}px)`;circle(40+i*40,90+Math.sin(i)*30,10+depth*12,i%2?'#888':'#333');ctx.restore()}status('焦点から離れた層ほどぼかす · 深度レイヤーの近似');return;}
 if(kind.startsWith('data-')){
  const points=Array.from({length:22},(_,i)=>({x:30+rand(i)*260,y:25+rand(i+60)*120,r:3+rand(i+21)*8}));
  if(kind==='data-scatter'){line(25,150,300,150);line(25,20,25,150);for(const q of points)circle(q.x,150-(q.x-30)*.35+(q.y-80)*v.noise,q.r*.6);text('X →',280,172,10);status('横・縦の位置と点の大きさへ、値を割り当てる');}
  if(kind==='data-network'){for(let i=0;i<points.length;i++){const a=points[i];for(let j=i+1;j<points.length;j++){const b=points[j];if(Math.hypot(a.x-b.x,a.y-b.y)<v.radius)line(a.x,a.y,b.x,b.y,'#bbb')}}points.forEach(q=>circle(q.x,q.y,q.r*.65));status('ノードとエッジ · 接続距離を変えて関係を読む');}
  if(kind==='data-map'){ctx.fillStyle='#ddd';ctx.beginPath();[[30,50],[85,25],[130,45],[185,30],[280,70],[260,130],[200,145],[145,125],[85,150],[40,100]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();points.slice(0,9).forEach((q,i)=>circle(q.x,q.y,q.r*v.scale,'#5559'));text('SCHEMATIC MAP',160,170,9);status('架空の地域図 · 地点と値の大きさを結びつける');}
  if(kind==='data-treemap'){const weights=[v.weight,22,18,14,10,8],total=weights.reduce((a,b)=>a+b);let x=15;weights.forEach((n,i)=>{const w=n/total*290;ctx.fillStyle=i%2?'#bcb9b1':'#777';ctx.fillRect(x,25,w-2,120);text(String(n),x+w/2,91,13,i%2?'#222':'#fff');x+=w});status('面積へ数量を割り当てる · 一段のslice-and-dice treemap');}
  if(kind==='data-time'){line(25,145,300,145);ctx.beginPath();const count=Math.max(2,Math.round(v.progress/100*35));for(let i=0;i<count;i++){const x=25+i*8,y=100-Math.sin(i*.25)*30-i; i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.stroke();text('TIME →',270,168,9);status('時間の進行に沿って、値の推移を見せる');}
  if(kind==='data-story'){const step=Math.round(v.chapter);for(let i=0;i<5;i++){const height=(20+i*14)*(step===0?.5:1);ctx.fillStyle=step===2&&i!==4?'#ddd':'#444';ctx.fillRect(35+i*53,135-height,30,height)}text(['全体を見る','変化を見る','注目点を示す'][step],160,165,12);status('章を進めると、データの読み方が変わる');}return;
 }
}
export const systemStudies=[];
function add(id,category,name,ja,description,controls,extra={}){systemStudies.push(canvasLab({id,category,categories:extra.categories||[category],name,ja,description,use:extra.use||'動きや模様を生む規則を理解し、表現の設計に使うとき。',tip:extra.tip||'値を変え、全体の振る舞いがどのように変わるか観察してください。簡略化した学習用モデルです。',tags:[ja,category,...(extra.tags||[])],source:extra.source||'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial',level:'advanced',targets:extra.targets||['shape'],contexts:extra.contexts||['art'],support:'Canvas 2D。負荷を抑えるため点数・解像度を制限。',...extra},systems,controls,{animated:extra.animated??true,drag:extra.drag||false}));}
add('physics-collisions','physics','Multi-body collisions','ぶつかる物体の力を読む','等質量の円同士の衝突を解決し、速度と反発係数の関係を比べます。',[c('speed','時間の速さ',.2,2,1,.1),c('bounce','反発係数',0,1,.9,.05)]);
add('physics-cloth','physics','Constraint cloth','点と線から、布が生まれる','Verlet積分と距離制約で格子をつなぎ、固定した二点から布を垂らします。',[c('wind','風の強さ',0,10,3,.5)],{drag:true,categories:['physics','gesture']});
add('physics-softbody','physics','Shape-matching soft body','押すと変わり、元の形へ戻る','輪郭の点に復元力を与え、指先の力で押し広げます。圧力流体ではない簡易弾性モデルです。',[c('stiffness','形を戻す強さ',5,100,40,5)],{drag:true,categories:['physics','morph']});
add('physics-fluid','physics','Fluid advection study','流れが、次の流れを運ぶ','粗い格子上で速度と濃度を移流し、圧力補正で発散を減らす流体の入門です。',[c('force','加える力',.2,3,1,.1)],{drag:true,categories:['physics','generative'],tip:'指で流れを加えてください。粗い格子の近似であり、科学計測向けのシミュレーターではありません。'});
add('generative-boids','generative','Boids flocking','個体のルールから、群れが生まれる','近くの個体から離れる・向きを揃える・中心へ集まる三つの力を組み合わせます。',[c('separation','離れる力',0,80,35,5)],{categories:['generative','particles'],source:'https://www.red3d.com/cwr/boids/'});
add('generative-reaction','generative','Reaction–diffusion','反応する二つの量が、模様をつくる','Gray–Scottモデルで二つの物質量の反応と拡散を計算し、自己組織化する模様を観察します。',[c('feed','供給率',.02,.06,.035,.001),c('kill','除去率',.045,.07,.06,.001)]);
add('three-model','three','Embedded glTF mesh','モデルのデータから立体を描く','オリジナルのglTF 2.0データから頂点と三角形を読み、透視投影で描きます。対応はこの埋め込みモデルの構成に限定しています。',[c('angle','見る角度',-180,180,25)],{animated:false,source:'https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html'});
add('three-skeleton','three','Weighted skeletal deformation','骨の動きを、表面へ伝える','四つのボーンの位置を隣接ウェイトで混ぜ、筒の頂点を連続して変形させます。',[c('angle','見る角度',-180,180,20),c('bend','曲げる振幅',0,75,35)],{categories:['three','morph']});
add('three-camera','three','Camera framing','同じ立体を、違う距離感で見る','視点の回転と投影倍率を変え、立体の見え方とフレーミングを比較します。',[c('angle','視点の角度',-180,180,30),c('zoom','投影倍率',70,200,130)],{animated:false});
add('three-deform','three','Mesh twist','頂点をねじって、面を変える','高さに比例する角度で頂点を回し、メッシュのつながりを保ったまま変形します。',[c('angle','見る角度',-180,180,30),c('twist','ねじる強さ',-3,3,1,.1)],{animated:false,categories:['three','morph']});
add('shader-raymarch','shader','SDF ray marching','距離の関数から、立体を見つける','球とトーラスの符号付き距離を使い、視線上を進んで表面を探します。仕組みをCPUで描く教材です。',[c('angle','形の向き',-180,180,25)],{animated:false,categories:['shader','three'],engine:'canvas'});
add('shader-bloom','shader','Bloom compositing','強い光が、周りへにじむ','明るい形をぼかしてスクリーン合成し、光のにじみをつくります。Canvasで仕組みを再現します。',[c('amount','光のにじみ',0,30,12)],{animated:false,categories:['shader','blend','shadow']});
add('shader-dof','shader','Depth-of-field layers','焦点を、奥行きの中で選ぶ','焦点面からの距離に応じて各層をぼかし、見せたい奥行きを選びます。レンズ光学の簡略表現です。',[c('focus','焦点の深さ',0,1,.5,.05),c('blur','ぼけの強さ',0,15,9)],{animated:false,categories:['shader','three','image']});
for(const [id,name,ja,description,controls]of[
 ['data-scatter','Scatter plot','二つの量の関係を、点で読む','二軸の位置へ値を割り当て、ばらつきの違いを見比べます。',[c('noise','ばらつき',0,1,1,.1)]],
 ['data-network','Network diagram','つながりを、線で読む','点の関係を線で結び、まとまりと離れた点を観察します。',[c('radius','接続する距離',20,130,65)]],
 ['data-map','Proportional symbol map','場所と量を、重ねて読む','架空の地図上の地点に、大きさの異なる記号を配置します。実在地域の統計ではありません。',[c('scale','記号の倍率',.3,2,1,.1)]],
 ['data-treemap','Slice-and-dice treemap','面積で、内訳を読む','合計に対する比率を長方形の面積に割り当てます。一段の分割方式です。',[c('weight','先頭の数量',5,80,28)]],
 ['data-time','Time-series reveal','変化を、時間に沿って読む','横軸に時間を取り、進行度とともに折れ線を描きます。',[c('progress','時間の進行 %',5,100,70)]],
 ['data-story','Data storytelling','全体から、注目点へ導く','同じグラフを三つの章で見せ、比較と強調で読み方を導きます。',[c('chapter','章',0,2,0)]]
])add(id,'data',name,ja,description,controls,{animated:false,level:'applied',contexts:['data'],targets:['data'],tip:'データは説明用の架空値です。変化させる条件と、伝わる情報の違いを見てください。'});
