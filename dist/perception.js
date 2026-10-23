import {canvasLab,domLab} from './lab-kit.js';
const c=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
const meta=(id,category,name,ja,description,use,tip,tags,categories=[category])=>({id,category,name,ja,description,use,tip,prompt:tip,tags,categories,source:category==='gesture'?'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events':'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes'});
export const perception=[];
function gestures({ctx,time,dt,values:v,state:s,pointer:p,event,kind,circle,line,text,status}){
 if(!s.ready)Object.assign(s,{ready:true,x:160,y:90,points:[]});
 if(kind==='gesture-magnetic'){const dx=p.x-160,dy=p.y-90,d=Math.hypot(dx,dy),on=p.active&&d<v.radius,target=on?{x:160+dx*v.strength,y:90+dy*v.strength}:{x:160,y:90};s.x+=(target.x-s.x)*Math.min(1,dt*12);s.y+=(target.y-s.y)*Math.min(1,dt*12);ctx.strokeStyle='#ccc';ctx.beginPath();ctx.arc(160,90,v.radius,0,Math.PI*2);ctx.stroke();circle(s.x,s.y,28);text('g*e',s.x,s.y+5,16,'white');status('指先・矢印キーを近づけると吸いつく');}
 else if(kind==='gesture-trail'){if(event==='move'||event==='down'||event==='keyboard')s.points.push({x:p.x,y:p.y,age:0});s.points=s.points.filter(q=>q.age<v.life);s.points.forEach((q,i)=>{q.age+=dt;circle(q.x,q.y,v.size*(1-q.age/v.life),'#555')});if(!s.points.length)text('draw a little.',160,98,24);status('軌跡の大きさと寿命を変えてなぞる');}
 else{for(let y=20;y<180;y+=v.grid)for(let x=20;x<320;x+=v.grid)circle(x,y,1,'#bbb');if(p.down||event==='keyboard'){s.x=p.x;s.y=p.y}if(event==='up'){s.x=20+Math.round((s.x-20)/v.grid)*v.grid;s.y=20+Math.round((s.y-20)/v.grid)*v.grid;s.x=Math.max(20,Math.min(300,s.x));s.y=Math.max(20,Math.min(160,s.y))}circle(s.x,s.y,14);status('移動して離すと格子にそろう · Spaceでつかむ／離す');}
}
perception.push(canvasLab(meta('gesture-magnetic','gesture','Magnetic attraction','近づくと吸いつく','中心からの距離に応じて、要素を指先へ少し引き寄せます。','小さな操作対象への誘導。','範囲と引力を変え、反応が強すぎないところを探してください。',['指先','追従','磁石','反応'],['gesture','interaction']),gestures,[c('radius','反応する範囲',30,85,70),c('strength','引き寄せる割合',.1,.9,.4,.05)]));
perception.push(canvasLab(meta('gesture-trail','gesture','Pointer trail','軌跡が少しだけ残る','通過した位置へ寿命のある点を置き、時間とともに小さくします。','手の動きを見せる描画、探索。','素早く動かした時と、ゆっくり動かした時の密度を比べる。',['軌跡','なぞる','指先','粒子'],['gesture','particles']),gestures,[c('life','軌跡の寿命 秒',.2,3,1,.1),c('size','点の大きさ',2,18,8)],{drag:true}));
perception.push(canvasLab(meta('gesture-snap','gesture','Drag & snap','離すと、位置がそろう','操作中は自由に動き、離した時だけ最寄りの格子へ位置をそろえます。','配置編集、整列するドラッグ操作。','格子の間隔を変え、自由さと整いやすさを比べる。',['ドラッグ','スナップ','整列','操作'],['gesture','interaction','layout']),gestures,[c('grid','格子の間隔',20,70,40)],{animated:false,drag:true}));
function transformGesture({root,values:v,on}){const stage=root.querySelector('.lab-scene'),object=root.querySelector('.touch-object'),status=root.querySelector('.lab-status'),points=new Map();let initial=null,scale=1,angle=0;
 function paint(){object.style.transform=`scale(${scale}) rotate(${angle}deg)`;status.textContent=`${scale.toFixed(2)}× / ${Math.round(angle)}°`;}
 function measure(){const [a,b]=[...points.values()];return{distance:Math.hypot(a.x-b.x,a.y-b.y),angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}};
 on(stage,'pointerdown',e=>{stage.setPointerCapture(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2)initial={...measure(),scale,rotation:angle};});
 on(stage,'pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2&&initial){const m=measure();scale=Math.max(.4,Math.min(1.8,initial.scale*m.distance/Math.max(1,initial.distance)));angle=initial.rotation+m.angle-initial.angle;paint()}});
 for(const event of ['pointerup','pointercancel'])on(stage,event,e=>{points.delete(e.pointerId);initial=null});
 return{update(){scale=v.scale;angle=v.rotation;paint()},action(){scale=1;angle=0;paint()},destroy(){points.clear()}};
}
perception.push(domLab(meta('gesture-pinch','gesture','Pinch & rotate','二本の指で拡大・回転','二つの接点の距離と角度を、拡大率と回転角へ変換します。','写真、地図、制作ツールの操作。','二本指、または二つのスライダーで同じ変化を試せます。',['ピンチ','回転','タッチ','拡大'],['gesture','interaction']),transformGesture,[c('scale','拡大率',.4,1.8,1,.05),c('rotation','回転角',-180,180,0)],'<div class="touch-object">g*e</div>','.lab-scene{touch-action:none;display:grid;place-items:center}.touch-object{display:grid;place-items:center;width:100px;height:90px;background:#292929;color:white;font-size:32px}',{static:true,action:'位置を戻す'}));
function illusions({ctx,values:v,state:s,event,kind,circle,line,text,status}){
 if(event==='down'){if(kind==='illusion-contrast')s.hide=!s.hide;if(kind==='illusion-figure')s.invert=!s.invert;if(kind==='illusion-length')s.guide=!s.guide;}
 if(kind==='illusion-moire'){ctx.save();ctx.translate(160,90);for(let layer=0;layer<2;layer++){ctx.save();ctx.rotate(layer*v.angle*Math.PI/180);for(let x=-250;x<250;x+=v.gap)line(x,-250,x,250,layer?'#777':'#aaa',1);ctx.restore()}ctx.restore();status('角度の違いが、大きな縞を生む');}
 else if(kind==='illusion-contrast'){ctx.fillStyle=s.hide?'#999':'#222';ctx.fillRect(0,0,160,180);ctx.fillStyle=s.hide?'#999':'#e5e5e5';ctx.fillRect(160,0,160,180);const g=Math.round(v.gray);circle(80,90,25,`rgb(${g},${g},${g})`);circle(240,90,25,`rgb(${g},${g},${g})`);text('同じ RGB '+g,160,165,11,s.hide?'#222':'#999');status('画面をタップすると背景を同じ色にする');}
 else if(kind==='illusion-figure'){ctx.fillStyle=s.invert?'#222':'#eee';ctx.fillRect(0,0,320,180);ctx.beginPath();ctx.moveTo(130,0);ctx.bezierCurveTo(70,35,155,45,130,75);ctx.bezierCurveTo(95,110,150,125,110,180);ctx.lineTo(210,180);ctx.bezierCurveTo(170,125,225,110,190,75);ctx.bezierCurveTo(165,45,250,35,190,0);ctx.closePath();ctx.fillStyle=s.invert?'#eee':'#222';ctx.fill();status('中央の器と、両側の横顔。タップで白黒を反転');}
 else{const length=v.length;for(let row=0;row<2;row++){const y=55+row*75,start=160-length/2,end=160+length/2;line(start,y,end,y,'#333',2);for(const x of[start,end]){const dir=(x===start?1:-1)*(row?1:-1);line(x,y,x+dir*22,y-20,'#333',2);line(x,y,x+dir*22,y+20,'#333',2)}}if(s.guide){line(160-length/2,15,160-length/2,160,'#999');line(160+length/2,15,160+length/2,160,'#999')}status('二本は同じ長さ。タップで補助線を表示');}
}
for(const [id,name,ja,description,controls]of[
 ['illusion-moire','Moiré interference','細い線から、大きな縞が生まれる','似た間隔の線を少し回して重ねると、干渉する大きな模様が見えます。',[c('angle','重ねる角度',0,20,5,.1),c('gap','線の間隔',4,15,8)]],
 ['illusion-contrast','Simultaneous contrast','同じ灰色が違って見える','周囲の明るさによって、同じ色の見え方が変わる現象を比べます。',[c('gray','円の明るさ',40,210,128)]],
 ['illusion-figure','Figure & ground','器と横顔を行き来する','どこを図として見るかで、同じ輪郭が別の対象として見えてきます。',[]],
 ['illusion-length','Müller-Lyer illusion','同じ長さを見比べる','線の端に付く向きの違いが、長さの見え方へ影響する錯視です。',[c('length','実際の線の長さ',80,180,130)]]
])perception.push(canvasLab(meta(id,'illusion',name,ja,description,'視覚の観察、コントラストや輪郭の理解。','見え方は人によって異なります。数値や補助線と、感じる見え方を比べてください。',['錯視','知覚','見え方','比較'],['illusion',...(id==='illusion-moire'?['generative']:[])]),illusions,controls,{animated:false}));
