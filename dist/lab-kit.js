// Small, scoped laboratory runtime. The same function is embedded in copyable demos.
export const labCSS=`.sample{width:100%;height:100%;min-height:330px;padding:12px!important;display:flex!important;flex-direction:column;justify-content:center;align-items:center;gap:8px!important;background:#f0efeb;color:#232323;font-family:Arial,Meiryo,sans-serif;overflow:hidden;box-sizing:border-box}.sample *{box-sizing:border-box}.lab-scene{width:100%;max-width:430px;height:140px;position:relative;overflow:hidden;border-bottom:1px solid #ccc}.lab-scene:has(canvas){max-width:320px;height:auto;aspect-ratio:16/9;flex-shrink:0}.lab-canvas{display:block;width:100%;height:100%!important;outline-offset:-3px}.lab-canvas:focus-visible{outline:2px solid #222}.lab-controls{width:100%;max-width:390px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 14px}.lab-controls label{display:grid;grid-template-columns:1fr auto;gap:2px;font-size:11px;min-width:0}.lab-controls input{grid-column:1/-1;width:100%;min-width:0;margin:0;accent-color:#333;height:30px}.lab-controls output{font-variant-numeric:tabular-nums}.lab-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}.sample .lab-actions button{color:inherit;font:11px Arial,Meiryo,sans-serif;border:1px solid #aaa;border-radius:99px;background:transparent;min-height:44px;padding:8px 12px;cursor:pointer}.lab-status{font-size:10px;line-height:1.4;min-height:14px;margin:0;text-align:center}.lab-note{font-size:9px;line-height:1.3;color:#666;margin:0;text-align:center}.lab-actions button:focus-visible{outline:2px solid #222;outline-offset:2px}@media(prefers-reduced-motion:reduce){.sample *{animation-play-state:paused!important;transition:none!important}}`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function runCanvasLab(root,cfg,draw){
 const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),status=root.querySelector('.lab-status'),play=root.querySelector('[data-play]'),reset=root.querySelector('[data-reset]'),abort=new AbortController(),mq=matchMedia('(prefers-reduced-motion:reduce)');
 const values=Object.fromEntries(cfg.controls.map(c=>[c.key,c.value]));let state={},time=0,frame=0,last=0,allowed=!mq.matches,userPaused=false,destroyed=false,visible=true;
 const pointer={x:160,y:90,down:false,active:false,dx:0,dy:0};let event='init';
 const on=(el,type,fn,opts={})=>el.addEventListener(type,fn,{...opts,signal:abort.signal});
 const circle=(x,y,r,fill='#292929')=>{ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()};
 const line=(x,y,a,b,color='#aaa',width=1)=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.stroke()};
 const text=(str,x,y,size=12,color='#333',align='center')=>{ctx.fillStyle=color;ctx.font=`${size>25?'700':'400'} ${size}px Arial, sans-serif`;ctx.textAlign=align;ctx.fillText(str,x,y)};
 function render(dt=0){if(destroyed||!ctx)return;ctx.setTransform(canvas.width/320,0,0,canvas.height/180,0,0);ctx.clearRect(0,0,320,180);ctx.save();draw({ctx,w:320,h:180,time,dt,values,state,pointer,event,kind:cfg.kind,circle,line,text,status:s=>{status.textContent=s}});ctx.restore();event='';}
 function tick(now){frame=0;if(!running())return;const dt=Math.min((now-(last||now))/1000,.033);last=now;time+=dt;render(dt);frame=requestAnimationFrame(tick)}
 function running(){return !destroyed&&allowed&&!userPaused&&visible&&!document.hidden&&cfg.animated!==false}
 function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(running())frame=requestAnimationFrame(tick);play.textContent=running()?'停止':'再生';play.setAttribute('aria-pressed',String(userPaused));}
 function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(640*dpr);canvas.height=Math.round(360*dpr);render()}
 on(play,'click',()=>{userPaused=running();if(!userPaused)allowed=true;sync();render()});
 on(reset,'click',()=>{state={};time=0;event='reset';pointer.down=false;render();sync()});
 for(const input of root.querySelectorAll('[data-key]')){on(input,'input',()=>{values[input.dataset.key]=Number(input.value);input.closest('label').querySelector('output').textContent=input.value;event='input';render()})}
 function position(e){const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*320,y=(e.clientY-b.top)/b.height*180;pointer.dx=x-pointer.x;pointer.dy=y-pointer.y;pointer.x=Math.max(0,Math.min(320,x));pointer.y=Math.max(0,Math.min(180,y));pointer.active=true;}
 on(canvas,'pointerdown',e=>{position(e);pointer.down=true;event='down';canvas.setPointerCapture(e.pointerId);render()});
 on(canvas,'pointermove',e=>{position(e);event='move';render()});
 on(canvas,'pointerup',e=>{position(e);pointer.down=false;event='up';render()});
 on(canvas,'pointercancel',()=>{pointer.down=false;event='cancel';render()});
 on(canvas,'pointerleave',()=>{pointer.active=false;if(!pointer.down){event='leave';render()}});
 on(canvas,'keydown',e=>{const keys={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(keys[e.key]){e.preventDefault();pointer.active=true;pointer.x=Math.max(0,Math.min(320,pointer.x+keys[e.key][0]));pointer.y=Math.max(0,Math.min(180,pointer.y+keys[e.key][1]));event='keyboard';render()}if(e.key===' '||e.key==='Enter'){e.preventDefault();pointer.down=!pointer.down;pointer.active=true;event=pointer.down?'down':'up';render()}});
 on(document,'visibilitychange',sync);on(mq,'change',()=>{allowed=!mq.matches;sync();render()});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});observer.observe(canvas);resize();sync();
 if(cfg.animated===false)play.hidden=true;
 return {setAuto(on){allowed=on&&!mq.matches;sync()},destroy(){destroyed=true;cancelAnimationFrame(frame);abort.abort();observer.disconnect();state={}}};
}
export function canvasLab(meta,draw,controls,options={}){
 const cfg={kind:meta.id,controls,...options};
 const html=`<div class="lab-scene"><canvas class="lab-canvas" tabindex="0" role="img" aria-label="${esc(meta.ja)}。${esc(options.instruction||'矢印キーでも位置を変えられます。')}" style="touch-action:${options.drag?'none':'pan-y'}"></canvas></div><div class="lab-controls">${controls.map(c=>`<label>${esc(c.label)}<output>${c.value}</output><input aria-label="${esc(c.label)}" type="range" min="${c.min}" max="${c.max}" step="${c.step||1}" value="${c.value}" data-key="${c.key}"></label>`).join('')}</div><div class="lab-actions"><button type="button" data-play>停止</button><button type="button" data-reset>最初から</button></div><p class="lab-status"></p>`;
 const e={...meta,inputs:meta.inputs||[...(options.animated!==false?['watch']:[]),...(controls.length?['adjust']:[]),...(options.drag||meta.category==='gesture'||(meta.category==='illusion'&&meta.id!=='illusion-moire')||['particles-confetti','particles-attraction'].includes(meta.id)?['pointer']:[])],type:'interactive',html,css:labCSS,mount:root=>runCanvasLab(root,cfg,draw)};
 e.code=`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;min-height:330px}${labCSS}</style><div class="sample">${html}</div><script>const lab=(${runCanvasLab.toString()})(document,${JSON.stringify(cfg)},${draw.toString()});addEventListener('pagehide',()=>lab.destroy(),{once:true});</script></html>`;return e;
}
export function runDomLab(root,cfg,setup){
 const abort=new AbortController(),values=Object.fromEntries(cfg.controls.map(c=>[c.key,c.value])),mq=matchMedia('(prefers-reduced-motion:reduce)');let auto=!mq.matches;
 const on=(el,event,fn)=>el.addEventListener(event,fn,{signal:abort.signal});
 const api=setup({root,values,kind:cfg.kind,on,reduced:mq.matches})||{};
 for(const input of root.querySelectorAll('[data-key]'))on(input,'input',()=>{values[input.dataset.key]=Number(input.value);input.closest('label').querySelector('output').textContent=input.value;api.update?.()});
 const play=root.querySelector('[data-play]');on(play,'click',()=>{auto=!auto;api.setAuto?.(auto);for(const a of root.querySelector('.lab-scene').getAnimations({subtree:true}))auto?a.play():a.pause();play.textContent=auto?'停止':'再生';play.setAttribute('aria-pressed',String(!auto))});
 const reset=root.querySelector('[data-reset]');on(reset,'click',()=>api.action?.());
 on(document,'visibilitychange',()=>api.setAuto?.(auto&&!document.hidden));
 api.update?.();if(cfg.static)play.hidden=true;
 return {setAuto(on){auto=on&&!mq.matches;api.setAuto?.(auto);for(const a of root.querySelector('.lab-scene').getAnimations({subtree:true}))auto?a.play():a.pause();play.textContent=auto?'停止':'再生'},destroy(){abort.abort();api.destroy?.()}};
}
export function domLab(meta,setup,controls,scene,css,options={}){
 const cfg={kind:meta.id,controls,...options};
 const html=`<div class="lab-scene">${scene}</div><div class="lab-controls">${controls.map(c=>`<label>${esc(c.label)}<output>${c.value}</output><input aria-label="${esc(c.label)}" type="range" min="${c.min}" max="${c.max}" step="${c.step||1}" value="${c.value}" data-key="${c.key}"></label>`).join('')}</div><div class="lab-actions"><button data-play>停止</button><button data-reset>${esc(options.action||'切り替える')}</button></div><p class="lab-status" role="status"></p>`;
 const full=labCSS+css;
 return {...meta,type:'interactive',html,css:full,mount:root=>runDomLab(root,cfg,setup),code:`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;min-height:330px}${full}</style><div class="sample">${html}</div><script>const lab=(${runDomLab.toString()})(document,${JSON.stringify(cfg)},${setup.toString()});addEventListener('pagehide',()=>lab.destroy(),{once:true});</script></html>`};
}
