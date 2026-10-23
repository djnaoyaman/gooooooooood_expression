import {canvasLab} from './lab-kit.js';
export const craftLabs=[];
const c=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
function draw({ctx,time,values:v,state:s,pointer,kind,text,status}){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),noise=n=>{const x=Math.sin(n*127.1+31.7)*43758.5453;return x-Math.floor(x)},reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,t=time*(v.speed||1),progress=reduced?1:clamp((t%5)/3,0,1);
 const canvas=(w,h)=>{const a=document.createElement('canvas');a.width=w;a.height=h;return a};
 const base=(g,w=320,h=180)=>{g.fillStyle='#cce4e7';g.fillRect(0,0,w,h);g.fillStyle='#edaf67';g.beginPath();g.arc(w*.76,h*.26,h*.16,0,Math.PI*2);g.fill();g.fillStyle='#60949d';g.beginPath();g.moveTo(0,h);g.lineTo(w*.31,h*.18);g.lineTo(w*.64,h);g.fill();g.fillStyle='#234956';g.beginPath();g.moveTo(w*.23,h);g.lineTo(w*.72,h*.41);g.lineTo(w,h*.81);g.lineTo(w,h);g.fill();g.strokeStyle='#f1f1df';for(let i=0;i<6;i++){g.lineWidth=1;g.beginPath();g.arc(w*.31,h*.52,8+i*6,0,Math.PI*2);g.stroke()}g.fillStyle='#fff';g.font=`bold ${Math.round(w/16)}px Arial`;g.fillText('FLYING BRAIN',w*.05,h*.9)};
 const paper=()=>{ctx.fillStyle='#e7e2d7';ctx.fillRect(0,0,320,180);ctx.fillStyle='#5f554d0c';for(let i=0;i<600;i++)ctx.fillRect(noise(i)*320,noise(i+900)*180,1,1)};
 const word=(g,label,size=36)=>{g.font=`bold ${size}px Arial`;g.textAlign='center';g.textBaseline='middle';g.fillText(label,160,90)};
 if(kind==='type-scramble'){
  const target='NAOYAMAN',chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';let value='';for(let i=0;i<target.length;i++)value+=progress>=((i+1)/target.length)?target[i]:chars[Math.floor(noise(i+Math.floor(t*14)*11)*chars.length)];ctx.fillStyle='#153c47';word(ctx,value,39);status(progress===1?'NAOYAMAN · 文字が確定':'ランダムな字形から、左から順に確定');return;
 }
 if(kind==='type-odometer'){
  const value=Math.round(progress*v.target),digits=String(v.target).padStart(4,'0');ctx.fillStyle='#213c47';ctx.fillRect(28,48,264,84);
  for(let i=0;i<4;i++){const unit=10**(3-i),n=(reduced||progress===1)?Number(digits[i]):(progress*v.target/unit)%10,integer=Math.floor(n),fraction=n-integer;ctx.save();ctx.beginPath();ctx.rect(30+i*65,54,60,72);ctx.clip();ctx.fillStyle='#eff4e9';ctx.font='bold 55px monospace';ctx.textAlign='center';ctx.textBaseline='middle';for(let j=-1;j<=1;j++)ctx.fillText(String((integer+j+10)%10),60+i*65,90+(j-fraction)*72);ctx.restore()}
  status(`回転する数字 · 到達値 ${v.target} / 表示過程 ${value}`);return;
 }
 if(kind==='type-splitflap'){
  const before='MIXWELL ',after='NAOYAMAN';ctx.fillStyle='#ddd8cd';ctx.fillRect(0,0,320,180);
  for(let i=0;i<8;i++){const p=clamp(progress*1.6-i*.085,0,1),x=6+i*39;ctx.fillStyle='#213b46';ctx.fillRect(x,58,35,64);ctx.font='bold 27px monospace';ctx.textAlign='center';ctx.textBaseline='middle';const glyph=(ch,y,h)=>{ctx.save();ctx.beginPath();ctx.rect(x,y,35,h);ctx.clip();ctx.fillStyle='#f1ead7';ctx.fillText(ch,x+17.5,90);ctx.restore()};glyph(after[i],58,32);glyph(before[i],90,32);if(p<.5){ctx.save();ctx.translate(0,90);ctx.scale(1,Math.cos(p*Math.PI));ctx.translate(0,-90);ctx.fillStyle='#29434e';ctx.fillRect(x,58,35,32);glyph(before[i],58,32);ctx.restore()}else{glyph(after[i],90,32);ctx.save();ctx.translate(0,90);ctx.scale(1,Math.abs(Math.cos(p*Math.PI)));ctx.translate(0,-90);glyph(after[i],90,32);ctx.restore()}ctx.fillStyle='#0c222f';ctx.fillRect(x,89,35,2)}status('一枚ずつめくれる、反転式の文字盤');return;
 }
 if(kind==='type-handwriting'){
  const glyphs={N:[[[0,1],[0,0],[1,1],[1,0]]],A:[[[0,1],[.5,0],[1,1]],[[.22,.6],[.78,.6]]],O:[[[.5,0],[.12,.1],[0,.5],[.12,.9],[.5,1],[.88,.9],[1,.5],[.88,.1],[.5,0]]],Y:[[[0,0],[.5,.5],[1,0]],[[.5,.5],[.5,1]]],M:[[[0,1],[0,0],[.5,.55],[1,0],[1,1]]]};
  const segments=[];[...'NAOYAMAN'].forEach((letter,i)=>glyphs[letter].forEach(path=>path.slice(1).forEach((q,j)=>{const a=path[j];segments.push([12+i*38+a[0]*26,60+a[1]*56,12+i*38+q[0]*26,60+q[1]*56])})));const total=segments.reduce((sum,[x,y,a,b])=>sum+Math.hypot(a-x,b-y),0);let budget=progress*total;ctx.strokeStyle='#203f4b';ctx.lineWidth=v.width;ctx.lineCap='round';ctx.lineJoin='round';for(const [x,y,a,b]of segments){const length=Math.hypot(a-x,b-y),p=clamp(budget/length,0,1);if(p){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(a-x)*p,y+(b-y)*p);ctx.stroke()}budget-=length}status('線の長さに沿って描く · 図鑑オリジナルの一筆ずつの字形');return;
 }
 if(['texture-foil','texture-emboss','texture-letterpress','texture-ink','texture-distress'].includes(kind)){
  paper();const label=kind==='texture-foil'?'MINERALion':'MIXWELL';
  if(kind==='texture-foil'){
   const angle=(v.angle+(reduced?0:time*15))*Math.PI/180,dx=Math.cos(angle)*150,dy=Math.sin(angle)*90,g=ctx.createLinearGradient(160-dx,90-dy,160+dx,90+dy);[[0,'#6b4923'],[.22,'#c7a65c'],[.4,'#fff1b0'],[.46,'#95662e'],[.65,'#f2d28c'],[1,'#795121']].forEach(([p,c])=>g.addColorStop(p,c));ctx.fillStyle=g;word(ctx,label,38);ctx.save();ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=.08;ctx.strokeStyle='#fff';for(let i=0;i<35;i++){ctx.beginPath();ctx.moveTo(i*12,60);ctx.lineTo(i*12+20,120);ctx.stroke()}ctx.restore();status('光の角度で濃淡が変わる、箔押しの見本');return;
  }
  if(kind==='texture-emboss'||kind==='texture-letterpress'){
   const depth=v.depth,sign=kind==='texture-emboss'?1:-1;ctx.save();ctx.translate(-depth*sign,-depth*sign);ctx.fillStyle='#fffdf3';word(ctx,label,43);ctx.restore();ctx.save();ctx.translate(depth*sign,depth*sign);ctx.fillStyle='#948d7e';word(ctx,label,43);ctx.restore();ctx.fillStyle=kind==='texture-emboss'?'#dfd9cc':'#9b9282';word(ctx,label,43);status(kind==='texture-emboss'?'明暗をずらして、文字が浮き上がる':'陰影を反転し、紙へ文字が沈む');return;
  }
  if(!s.layer)s.layer=canvas(320,180);const g=s.layer.getContext('2d');g.clearRect(0,0,320,180);g.fillStyle='#244a57';
  if(kind==='texture-ink'){
   g.save();g.filter=`blur(${v.bleed}px)`;word(g,label,43);g.restore();g.globalAlpha=.55;word(g,label,43);g.globalAlpha=1;ctx.drawImage(s.layer,0,0);status('輪郭へにじみを重ねる · インク浸透の視覚的な近似');
  }else{word(g,label,43);g.globalCompositeOperation='destination-out';for(let i=0;i<v.amount*15;i++){g.fillStyle='#000';g.fillRect(noise(i)*320,55+noise(i+900)*70,.6+noise(i+150)*2,.6+noise(i+350)*4)}g.globalCompositeOperation='source-over';ctx.drawImage(s.layer,0,0);status(`文字のインクを削る · かすれ ${v.amount}%`)}return;
 }
 if(['optical-hologram','optical-pearl'].includes(kind)){
  const angle=v.angle+(pointer.active?(pointer.x-160)/2:0)+(reduced?0:time*8);ctx.fillStyle='#172f3a';ctx.fillRect(0,0,320,180);const g=ctx.createLinearGradient(0,0,320,180);for(let i=0;i<=12;i++)g.addColorStop(i/12,`hsl(${(angle+i*31)%360} ${kind==='optical-pearl'?35:60}% ${kind==='optical-pearl'?82:60}%)`);ctx.fillStyle=g;
  if(kind==='optical-hologram'){ctx.fillRect(35,26,250,128);ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.45;ctx.strokeStyle='#fff';for(let i=-20;i<80;i++){ctx.beginPath();ctx.moveTo(i*7+angle%7,26);ctx.lineTo(i*7+70+angle%7,154);ctx.stroke()}ctx.restore();ctx.fillStyle='#11353a';word(ctx,'MINERALion',34)}else{ctx.beginPath();ctx.ellipse(160,90,91,68,0,0,Math.PI*2);ctx.fill();const light=ctx.createRadialGradient(133,60,2,164,90,95);light.addColorStop(0,'#ffffffdd');light.addColorStop(.5,'#ffffff00');light.addColorStop(1,'#243545bb');ctx.fillStyle=light;ctx.fill();}status('観察角で色が動く · 薄膜干渉を模した配色の近似');return;
 }
 if(kind==='optical-refraction'){
  if(!s.image){s.image=canvas(160,90);base(s.image.getContext('2d'),160,90);s.pixels=s.image.getContext('2d').getImageData(0,0,160,90);s.out=canvas(160,90)}const g=s.out.getContext('2d'),out=g.createImageData(160,90),a=s.pixels.data;const cx=pointer.active?pointer.x/2:80,cy=pointer.active?pointer.y/2:45;
  for(let y=0;y<90;y++)for(let x=0;x<160;x++){const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy),scale=r<36?1-(1-(r/36)**2)*v.strength:.0;const sx=clamp(Math.round(x-dx*scale),0,159),sy=clamp(Math.round(y-dy*scale),0,89),i=(y*160+x)*4,j=(sy*160+sx)*4;out.data.set(a.subarray(j,j+4),i)}g.putImageData(out,0,0);ctx.drawImage(s.out,0,0,320,180);ctx.strokeStyle='#ffffffbb';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx*2,cy*2,72,0,Math.PI*2);ctx.stroke();status('背景を読み取る位置を曲げる · 球形レンズの近似');return;
 }
 if(kind==='optical-caustics'){
  ctx.fillStyle='#236478';ctx.fillRect(0,0,320,180);ctx.save();ctx.globalCompositeOperation='screen';for(let j=0;j<17;j++){ctx.beginPath();for(let x=0;x<=320;x+=3){const y=j*12+Math.sin(x*.04+j*.8+time*.7)*v.strength+Math.sin(x*.077-time*.4)*5;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#76c6cb';ctx.lineWidth=1.6;ctx.stroke()}for(let j=0;j<20;j++){ctx.beginPath();for(let y=0;y<=180;y+=3){const x=j*17+Math.sin(y*.06+j+time*.5)*v.strength;y?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle='#63a8b4';ctx.lineWidth=1.3;ctx.stroke()}ctx.restore();status('水底の集光模様を、交差する波で近似');return;
 }
 if(['film-glitch','film-crt','film-vhs','film-pixelsort'].includes(kind)){
  if(!s.image){s.image=canvas(320,180);base(s.image.getContext('2d'));}ctx.drawImage(s.image,0,0);
  if(kind==='film-glitch'){
   const frame=reduced?4:Math.floor(time*3);for(let i=0;i<8;i++){const y=Math.floor(noise(i+frame)*170),h=3+noise(i+frame+50)*13,shift=(noise(i+frame+100)-.5)*v.amount;ctx.drawImage(s.image,0,y,320,h,shift,y,320,h)}ctx.globalAlpha=.2;ctx.globalCompositeOperation='screen';ctx.fillStyle='#4facba';ctx.fillRect(0,noise(frame)*170,320,4);status('画像の帯を、横にずらすグリッチ');return;
  }
  if(kind==='film-crt'){
   ctx.fillStyle=`rgba(0,0,0,${v.amount/100})`;for(let y=0;y<180;y+=3)ctx.fillRect(0,y,320,1);const g=ctx.createRadialGradient(160,90,40,160,90,175);g.addColorStop(0,'#0000');g.addColorStop(1,'#000b');ctx.fillStyle=g;ctx.fillRect(0,0,320,180);status('走査線と周辺減光で、ブラウン管の画面を模す');return;
  }
  if(kind==='film-vhs'){
   const frame=reduced?3:Math.floor(time*8);for(let y=0;y<180;y+=3){const shift=Math.sin(y*.12+frame)*v.amount*.12+(y>150?Math.sin(y+frame)*v.amount*.6:0);ctx.drawImage(s.image,0,y,320,3,shift,y,320,3)}ctx.fillStyle='#eee7';for(let i=0;i<45;i++)ctx.fillRect(noise(i+frame)*320,noise(i+frame+400)*180,noise(i+frame+80)*8,1);ctx.fillStyle='#fff';ctx.font='12px monospace';ctx.textAlign='left';ctx.fillText('PLAY ▷   00:00:'+String(Math.floor(time)%60).padStart(2,'0'),12,20);status('水平の揺れと追跡ノイズ · VHSの視覚的な近似');return;
  }
  if(s.threshold!==v.threshold){const g=s.image.getContext('2d'),data=g.getImageData(0,0,320,180),a=data.data,lum=i=>a[i]*.2126+a[i+1]*.7152+a[i+2]*.0722;for(let y=0;y<180;y++){let x=0;while(x<320){while(x<320&&lum((y*320+x)*4)<v.threshold)x++;let start=x;while(x<320&&lum((y*320+x)*4)>=v.threshold)x++;const pixels=[];for(let j=start;j<x;j++){const i=(y*320+j)*4;pixels.push([a[i],a[i+1],a[i+2],255])}pixels.sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]));pixels.forEach((p,j)=>a.set(p,(y*320+start+j)*4))}}s.sorted=canvas(320,180);s.sorted.getContext('2d').putImageData(data,0,0);s.threshold=v.threshold}ctx.drawImage(s.sorted,0,0);status('明度の条件に合う連続区間だけ、画素を並べ替える');return;
 }
 if(kind==='frame-sprite'){
  if(!s.sheet){s.sheet=canvas(960,80);const g=s.sheet.getContext('2d');for(let f=0;f<12;f++){const x=f*80,bob=Math.sin(f/12*Math.PI*2)*8;g.save();g.translate(x+40,35+bob);g.fillStyle='#22515f';g.beginPath();g.arc(0,0,22,0,Math.PI*2);g.fill();g.strokeStyle='#eee9d9';g.lineWidth=2;g.beginPath();g.arc(0,0,13,0,Math.PI*2);g.stroke();g.fillStyle='#eee';g.fillRect(-8,-6,4,4);g.fillRect(5,-6,4,4);g.strokeStyle='#22515f';g.lineWidth=4;g.beginPath();g.moveTo(-12,18);g.lineTo(-18,32-bob);g.moveTo(12,18);g.lineTo(18,32+bob);g.stroke();g.restore()}}
  const f=reduced?0:Math.floor(time*v.fps)%12;ctx.drawImage(s.sheet,f*80,0,80,80,100,5,120,120);for(let i=0;i<12;i++){ctx.drawImage(s.sheet,i*80,0,80,80,10+i*25,140,24,24);if(i===f){ctx.strokeStyle='#236478';ctx.strokeRect(10+i*25,138,24,28)}}status(`スプライトシートの ${f+1} / 12 コマ目を切り出す`);return;
 }
 if(kind==='frame-stopmotion'){
  const step=reduced?0:Math.floor(time*v.fps)/v.fps,x=30+(step*55)%260,y=96-Math.abs(Math.sin(step*2))*45;ctx.fillStyle='#ddd8ce';ctx.fillRect(0,0,320,180);ctx.fillStyle='#b9b0a2';ctx.fillRect(0,142,320,2);ctx.save();ctx.translate(x,y);ctx.rotate(Math.floor(step*4)*.12);ctx.fillStyle='#23515f';ctx.fillRect(-22,-22,44,44);ctx.fillStyle='#fff';ctx.font='bold 10px Arial';ctx.textAlign='center';ctx.fillText('MIX',0,4);ctx.restore();status(`${v.fps}コマ/秒 · 時間を区切って、コマ撮りの動きにする`);return;
 }
 if(kind==='frame-turntable'){
  if(!s.frames){s.frames=[];for(let f=0;f<24;f++){const a=canvas(160,160),g=a.getContext('2d'),angle=f/24*Math.PI*2,w=60*Math.abs(Math.cos(angle))+20*Math.abs(Math.sin(angle));g.fillStyle='#a3d2df';g.fillRect(80-w/2,35,w,100);g.fillStyle=Math.sin(angle)>0?'#35616e':'#6c98a5';g.fillRect(80+w/2-10,35,10,100);g.fillStyle='#173e4a';g.font='bold 9px Arial';g.textAlign='center';if(Math.cos(angle)>.3)g.fillText('MINERALion',75,85);else if(Math.cos(angle)<-.3)g.fillText('BACK',80,85);s.frames.push(a)}}const frame=Math.round(v.angle/15)%24;ctx.drawImage(s.frames[frame],80,5,160,160);status(`${frame+1} / 24 コマ · 生成済み連番画像を切り替える`);return;
 }
 if(kind==='frame-lineboil'){
  const frame=reduced?0:Math.floor(time*v.fps)%3;ctx.strokeStyle='#254751';ctx.lineWidth=2.3;ctx.lineJoin='round';for(let pass=0;pass<2;pass++){ctx.beginPath();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2,r=48+(noise(i+frame*100+pass*33)-.5)*v.amount;const x=160+Math.cos(a)*r*1.7,y=86+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}ctx.fillStyle='#254751';word(ctx,'FLYING BRAIN',22);status('三枚の線画を交互に表示 · 線だけが小さく揺らぐ');return;
 }
}
function add(id,category,name,ja,description,controls,extra={}){craftLabs.push(canvasLab({id,category,name,ja,description,use:extra.use||'文字や素材、映像の表情を比較し、意図に合う見せ方を選ぶとき。',tip:extra.tip||'数値を変えて違いを観察してください。動く見本は停止でき、最初から再生できます。',tags:[ja,...(extra.tags||[])],source:extra.source||'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial',categories:extra.categories||[category],level:'applied',targets:extra.targets||[category==='type'?'text':'image'],contexts:extra.contexts||['art','editorial'],support:'Canvas 2D。オリジナルの図形で仕組みを示す見本。動きを減らす設定では静止します。',...extra},draw,controls,{animated:extra.animated??true}))}
add('type-scramble','type','Text scramble resolve','文字の混沌から、言葉が現れる','ランダムな字形を順番に確定させ、NAOYAMANへ変化させます。',[c('speed','確定する速さ',.5,2,1,.1)],{tags:['文字の変身','スクランブル','解読']});
add('type-odometer','type','Rolling digit counter','数字が回転して、値に届く','各桁を縦に回転させ、目標の値へ変化させます。数値の変化を読むための表現です。',[c('target','到達する値',0,9999,331)],{tags:['文字の変身','数字','カウンター','オドメーター'],targets:['text','data'],categories:['type','data']});
add('type-splitflap','type','Split-flap display','文字盤が、一枚ずつめくれる','上下に分かれた文字盤をめくり、MIXWELLからNAOYAMANへ切り替えます。',[c('speed','めくる速さ',.5,2,1,.1)],{tags:['文字の変身','反転式','駅','パタパタ'],categories:['type','transition']});
add('type-handwriting','type','Handwriting stroke sequence','書く順序に沿って、文字を描く','オリジナルの線で組んだNAOYAMANを、線の長さに沿って一筆ずつ描きます。',[c('width','線の太さ',1,8,3),c('speed','書く速さ',.5,2,1,.1)],{tags:['文字の変身','手書き','筆順'],categories:['type','shape']});
add('texture-foil','texture','Foil stamping study','箔の輝きが、文字を走る','文字の内側に金属的な明暗の帯をつくり、照明方向による変化を模します。',[c('angle','光の角度',0,360,45)],{tags:['質感を出したい','印刷','箔押し'],categories:['texture','type','shadow']});
add('texture-emboss','texture','Embossed lettering','紙から、文字が浮き上がる','同じ字形の明暗を逆方向へずらし、紙と一体になった盛り上がりを表します。',[c('depth','浮き上がる深さ',.5,5,2,.5)],{animated:false,tags:['質感を出したい','印刷','エンボス'],categories:['texture','type','shadow']});
add('texture-letterpress','texture','Letterpress impression','紙に、文字が沈み込む','明るい縁と暗い内側を組み合わせ、活版印刷の押し跡を模します。',[c('depth','押し跡の深さ',.5,5,2,.5)],{animated:false,tags:['質感を出したい','印刷','活版'],categories:['texture','type','shadow']});
add('texture-ink','texture','Ink bleed','インクが、輪郭の外へ広がる','文字の周囲へぼかした色を重ね、紙にインクがにじむ印象をつくります。',[c('bleed','にじみの幅 px',0,5,1.5,.1)],{animated:false,tags:['質感を出したい','印刷','にじみ'],categories:['texture','type']});
add('texture-distress','texture','Distressed ink','かすれから、印刷の手触りをつくる','描いた文字のインクを小さく不規則に削り、かすれの量を調整します。',[c('amount','かすれの量 %',0,100,30)],{animated:false,tags:['質感を出したい','印刷','かすれ'],categories:['texture','type','mask']});
add('optical-hologram','texture','Holographic foil','角度で、虹色が入れ替わる','色の帯と細い線を重ね、ホログラム加工に似た色の変化を表します。立体ホログラムの再現ではありません。',[c('angle','観察角',0,360,45)],{inputs:['watch','adjust','pointer'],tags:['質感を出したい','光学','ホログラム'],categories:['texture','gradient','color']});
add('optical-pearl','texture','Pearlescent surface','真珠のように、色をひそませる','淡い虹色と球面の陰影を組み合わせ、真珠のような光沢を模します。薄膜干渉の物理計算は行いません。',[c('angle','観察角',0,360,80)],{inputs:['watch','adjust','pointer'],tags:['質感を出したい','光学','真珠','虹色'],categories:['texture','color','shadow']});
add('optical-refraction','image','Glass lens refraction','透明な面が、背景を曲げる','レンズ内の画像を読む座標を変え、透明な球面による屈折を近似します。指先や矢印キーで位置を変えられます。',[c('strength','屈折の強さ',0,.8,.4,.05)],{animated:false,inputs:['adjust','pointer'],tags:['質感を出したい','光学','屈折','ガラス'],categories:['image','texture']});
add('optical-caustics','texture','Caustic light pattern','水底に、光の網が揺れる','交差する明るい波で、水面が集める光の模様を近似します。光線追跡による計算ではありません。',[c('strength','模様の揺れ',0,18,9)],{tags:['質感を出したい','光学','集光','コースティクス'],categories:['texture','shadow','generative']});
add('film-glitch','image','Slice glitch','映像の一部が、ずれて戻る','横長の帯をずらし、信号が途切れたような表情をつくります。高速な全面点滅は使いません。',[c('amount','ずれの幅',0,60,20)],{tags:['映像の乱れ','グリッチ'],categories:['image','media'],contexts:['art']});
add('film-crt','image','CRT scanlines','走査線を重ねて、画面の記憶をつくる','細い横線と周辺減光を重ね、ブラウン管を思わせる画面へ変えます。',[c('amount','走査線の濃さ %',0,80,35)],{animated:false,tags:['映像の乱れ','ブラウン管','CRT','走査線'],categories:['image','media','texture']});
add('film-vhs','image','VHS tracking drift','水平の揺れで、テープの表情をつくる','横方向のずれと小さな追跡ノイズで、VHS映像の揺らぎを模します。',[c('amount','信号の揺れ',0,30,10)],{tags:['映像の乱れ','VHS','テープ'],categories:['image','media','texture']});
add('film-pixelsort','image','Pixel sorting','画素を並べ替えて、色を流す','明度のしきい値を超える連続区間を選び、その中で画素を明るさ順に並べます。',[c('threshold','明度のしきい値',0,255,100)],{animated:false,tags:['映像の乱れ','ピクセルソート','画素'],categories:['image','generative']});
add('frame-sprite','motion','Sprite sheet animation','一枚の画像から、動きを切り出す','12コマを並べたオリジナルのシートをつくり、順番に切り出して動かします。',[c('fps','一秒のコマ数',2,24,8)],{tags:['コマ','スプライト','アニメーション'],categories:['motion','media']});
add('frame-stopmotion','motion','Stop-motion timing','コマを間引いて、手作りのリズムに','連続する動きの時間を区切り、コマ撮りらしい間隔と手触りを比べます。',[c('fps','一秒のコマ数',2,24,6)],{tags:['コマ','コマ撮り','ストップモーション'],categories:['motion','rhythm','media']});
add('frame-turntable','image','Frame sequence turntable','連番画像で、商品を回して見る','模式的な箱の24方向をCanvas画像として用意し、角度に応じた画像を表示します。実写素材に置き換えられる構造です。',[c('angle','回転角',0,345,0,15)],{animated:false,tags:['コマ','連番画像','商品回転','360度'],contexts:['commerce'],categories:['image','three']});
add('frame-lineboil','motion','Hand-drawn line boil','手描きの線が、小さく息をする','少しずつ異なる三枚の輪郭を交互に表示し、手描きアニメーションの線の揺らぎをつくります。',[c('fps','一秒のコマ数',1,8,3),c('amount','線の揺れ',0,12,5)],{tags:['コマ','手描き','線の揺らぎ','ラインボイル'],categories:['motion','shape','texture']});
