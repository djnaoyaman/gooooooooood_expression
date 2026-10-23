// Original interface sounds. No context or audio is created before explicit playback.
function createSoundEngine(){
 let context=null,active=null,serial=0,pendingOwner=null;
 const clamp=v=>Math.min(.5,Math.max(0,Number(v)||0));
 function stop(owner){if(pendingOwner===owner){serial++;pendingOwner=null}if(active?.owner===owner)active.stop()}
 function volume(owner,value){if(active?.owner===owner)active.master.gain.setTargetAtTime(clamp(value),context.currentTime,.015)}
 async function play(preset,level=.2,onEnd=()=>{},owner={}){
  const token=++serial;pendingOwner=owner;if(active)active.stop();
  const AC=globalThis.AudioContext||globalThis.webkitAudioContext;
  if(!AC)throw new Error('このブラウザではWeb Audioを利用できません。');
  context ||= new AC();if(context.state==='suspended')await context.resume();if(token!==serial)return null;pendingOwner=null;
  const master=context.createGain(),analyser=context.createAnalyser();master.gain.value=clamp(level);analyser.fftSize=256;master.connect(analyser);analyser.connect(context.destination);
  const start=context.currentTime+.012,nodes=[],sources=[];let end=.1,finished=false,timer;
  const keep=n=>(nodes.push(n),n);
  function tone(frequency,delay,duration,type='sine',amplitude=.35,endFrequency=null,attack=.006){
   const osc=keep(context.createOscillator()),gain=keep(context.createGain());sources.push(osc);const t=start+delay,a=Math.min(attack,duration*.4);
   osc.type=type;osc.frequency.setValueAtTime(frequency,t);if(endFrequency)osc.frequency.exponentialRampToValueAtTime(endFrequency,t+duration);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,amplitude),t+a);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
   osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.015);end=Math.max(end,delay+duration+.03);
  }
  function noise(delay,duration,amplitude,filterType,frequency,endFrequency=null,attack=.004){
   const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);let seed=9631;
   for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;data[i]=((seed>>>0)/4294967296)*2-1}
   const source=keep(context.createBufferSource()),filter=keep(context.createBiquadFilter()),gain=keep(context.createGain());sources.push(source);const t=start+delay;
   source.buffer=buffer;filter.type=filterType;filter.Q.value=.7;filter.frequency.setValueAtTime(frequency,t);if(endFrequency)filter.frequency.exponentialRampToValueAtTime(endFrequency,t+duration);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(amplitude,t+Math.min(attack,duration*.4));gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
   source.connect(filter);filter.connect(gain);gain.connect(master);source.start(t);source.stop(t+duration+.015);end=Math.max(end,delay+duration+.03);
  }
  switch(preset){
   case 'click':noise(0,.035,.5,'highpass',1800);tone(1600,0,.025,'sine',.16);break;
   case 'pop':tone(650,0,.18,'sine',.65,170,.004);break;
   case 'tap':tone(180,0,.12,'sine',.48,115,.004);noise(0,.055,.12,'lowpass',900);break;
   case 'notify-up':tone(440,0,.25,'sine',.42);tone(660,.14,.36,'sine',.42);break;
   case 'notify-down':tone(660,0,.25,'sine',.42);tone(440,.16,.38,'sine',.42);break;
   case 'success':tone(523.25,0,.22,'sine',.32);tone(659.25,.11,.23,'sine',.32);tone(783.99,.22,.24,'sine',.32);tone(1046.5,.34,.5,'sine',.36);break;
   case 'error':tone(196,0,.23,'triangle',.38);tone(146.83,.2,.37,'triangle',.38);break;
   case 'warning':tone(740,0,.15,'triangle',.28);tone(740,.24,.15,'triangle',.28);break;
   case 'switch':noise(0,.022,.42,'highpass',2200);noise(.065,.038,.36,'bandpass',1700);break;
   case 'bell':tone(660,0,1.45,'sine',.4);tone(1326,0,.85,'sine',.13);tone(1848,0,.52,'sine',.07);break;
   case 'chime':tone(783.99,0,.65,'sine',.29);tone(1046.5,.2,.8,'sine',.29);tone(1318.51,.4,1,'sine',.25);break;
   case 'shimmer':[988,1480,1175,1760,1319,1976,1568,2093].forEach((f,i)=>tone(f,i*.07,.46,'sine',.11,null,.018));break;
   case 'sweep':tone(160,0,.72,'triangle',.27,1300,.1);break;
   case 'whoosh':noise(0,.85,.7,'bandpass',400,4200,.23);break;
   case 'pulse':[0,.24,.48].forEach(t=>tone(440,t,.1,'sine',.4,null,.01));break;
   case 'heartbeat':[0,.19,.75,.94].forEach((t,i)=>tone(i%2?67:83,t,.17,'sine',i%2?.42:.6,45,.01));break;
   default:master.disconnect();analyser.disconnect();throw new Error('音の種類が見つかりません。');
  }
  const handle={owner,master,analyser,duration:end,stop(){if(finished)return;finished=true;clearTimeout(timer);sources.forEach(s=>{try{s.stop()}catch{}});nodes.forEach(n=>{try{n.disconnect()}catch{}});master.disconnect();analyser.disconnect();if(active===handle)active=null;onEnd()}};
  active=handle;timer=setTimeout(()=>handle.stop(),(end+.08)*1000);return handle;
 }
 return{play,stop,volume};
}
const engine=createSoundEngine();
const definitions=[
 ['click','Click','小さなクリック','高いノイズを短く切り、軽く硬いクリックをつくります。','ボタンを押した瞬間の、ごく短い反応。','連打される操作では、音の重なりや頻度も確認します。',['クリック','tick','硬い','短い'],.04],
 ['pop','Pop','はじけるポップ','高い音から低い音へ素早く落とし、丸くはじける感触をつくります。','小さな要素の登場や、軽快な操作。','音程の落ちる速さで、弾力の印象が変わります。',['ポップ','ぽん','弾む'],.18],
 ['tap','Soft tap','柔らかなタップ','低めの音に短いノイズを重ね、柔らかく触れる音にします。','控えめな選択や、落ち着いた画面の反応。','小型スピーカーでは低い音の聞こえ方が変わります。',['タップ','柔らかい','ことん'],.12],
 ['notify-up','Ascending notification','上がる通知音','二つの音を低い順に鳴らし、上向きの変化を感じさせます。','新しい情報の到着を軽く知らせる場面。','通知の意味は、音だけでなく文字や表示でも伝えます。',['通知','上がる','到着'],.5],
 ['notify-down','Descending notification','下がる通知音','二つの音を高い順に鳴らし、落ち着くような変化をつくります。','画面を閉じる操作や、区切りの演出。','音の印象は、実際の画面と一緒に確認します。',['通知','下がる','閉じる'],.54],
 ['success','Success phrase','完了を知らせるフレーズ','四つの音を順に上げ、短い達成のフレーズにします。','送信完了や、ひと区切りついたとき。','毎回鳴らす必要があるかも含め、使用場面を選びます。',['成功','完了','達成'],.84],
 ['error','Low double tone','低い二音のサイン','三角波の二つの音を下げ、ほかの通知と違う音色にします。','入力内容の確認など、操作の見直しを促す場面。','エラーの理由と直し方は、見える場所にも示します。',['エラー','低い','注意'],.57],
 ['warning','Double reminder','二回のリマインド','間を空けて同じ音を二回鳴らし、気づきのきっかけをつくります。','短い確認や、見落としを減らしたい場面。','このサンプルは一度だけ再生し、自動で繰り返しません。',['警告','リマインド','二回'],.39],
 ['switch','Switch snap','スイッチの切り替え','質感の違う二つの短いノイズで、機械的な切り替えを表します。','設定を切り替えたことへの補助的な反応。','現在の状態はラベルや形でもわかるようにします。',['スイッチ','切り替え','カチッ'],.1],
 ['bell','Soft bell','柔らかなベル','複数の高さの音を重ね、余韻のあるベルを合成します。','ゆっくり気づいてほしい通知や、静かな区切り。','高音の成分と減衰の長さで、金属らしさが変わります。',['ベル','余韻','澄んだ'],1.45],
 ['chime','Three-note chime','三音のチャイム','三つの音を重ねるように鳴らし、余韻をつなぎます。','開始や完了を少し丁寧に知らせる場面。','長めの音は操作の邪魔にならない場面に絞ります。',['チャイム','三音','きらん'],1.4],
 ['shimmer','Shimmer','きらめく粒','高い音を小刻みに重ね、光の粒のような響きをつくります。','特別な達成や、装飾的な演出。','短い高音を重ねるため、小さい音量で印象を確かめます。',['きらめき','キラキラ','粒'],.95],
 ['sweep','Pitch sweep','音程のスイープ','ひとつの音の高さを連続的に上げます。','上昇や、次の段階への移動を表す演出。','音程が飛び飛びに変わるフレーズとの違いを聴き比べられます。',['スイープ','上昇','連続'],.72],
 ['whoosh','Filtered whoosh','風のような通過音','ノイズの通る周波数を変え、風が抜けるような音をつくります。','大きめの移動や、画面転換の演出。','風の録音ではなく、フィルターをかけたノイズの合成です。',['風','シュッ','通過'],.85],
 ['pulse','Even pulse','等間隔のパルス','短い音を等間隔に三回鳴らし、一定のリズムをつくります。','リズムや間隔を感じさせたい短い演出。','継続的なループではなく、三回で止まるサンプルです。',['パルス','リズム','等間隔'],.58],
 ['heartbeat','Double beat','二連の鼓動','低い二連の音を二組鳴らし、鼓動を思わせるリズムをつくります。','身体的なリズムや、静かな緊張感の演出。','心音の録音や測定結果ではなく、合成した表現です。',['鼓動','低音','どくん'],1.11]
];
function standalone(preset){return `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sound specimen</title><style>body{font:16px system-ui;padding:32px;max-width:540px;margin:auto;background:#fafaf7;color:#222}button{font:inherit;padding:10px 20px;background:#222;color:#fff;border:0;border-radius:999px;margin-right:8px}label{display:block;margin-top:24px}input{accent-color:#222}p{font-size:14px}</style><button id="play">聴いてみる</button><button id="stop">停止</button><label>音量 <input id="volume" type="range" min="0" max="0.5" step="0.01" value="0.2"></label><p id="status" aria-live="polite">再生ボタンを押すと音が出ます。</p><script>const createSoundEngine=${createSoundEngine.toString()};const engine=createSoundEngine(),owner={},status=document.querySelector('#status'),volume=document.querySelector('#volume');document.querySelector('#play').addEventListener('click',async()=>{try{status.textContent='再生中';await engine.play(${JSON.stringify(preset)},Number(volume.value),()=>status.textContent='再生終了',owner)}catch(error){status.textContent=error.message}});document.querySelector('#stop').addEventListener('click',()=>engine.stop(owner));volume.addEventListener('input',()=>engine.volume(owner,Number(volume.value)));addEventListener('pagehide',()=>engine.stop(owner),{once:true});</script></html>`}
export const sounds=definitions.map(([preset,name,ja,description,use,tip,tags,length],index)=>({id:'sound-'+preset,category:'sound',type:'sound',name,ja,description,use,tip,tags,source:'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques',code:standalone(preset),preset,length,soundIndex:index}));
const CSS=`:host{display:block;width:100%;height:100%;color:#252525;font-family:Arial,Meiryo,sans-serif}.sound{height:100%;width:100%;min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;padding:24px;box-sizing:border-box;background:transparent}.sound *{box-sizing:border-box}.wave{width:min(100%,300px);height:75px;overflow:visible}.wave path{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.wave line{stroke:#b9b9b5;stroke-width:.5}.kicker{font:9px monospace;letter-spacing:.16em;color:#777}.time{font:10px monospace;color:#777}.sound button{font:600 12px Arial,Meiryo,sans-serif;background:#232323;color:#fff;border:1px solid #232323;border-radius:999px;padding:11px 24px;cursor:pointer;min-width:135px;min-height:44px;touch-action:manipulation}.sound button:hover{background:#444}.sound button:focus-visible,.sound input:focus-visible{outline:2px solid #555;outline-offset:4px}.volume{display:flex;align-items:center;justify-content:center;gap:12px;font-size:10px;color:#777;width:min(240px,100%)}.volume input{width:120px;accent-color:#333}.volume output{font:10px monospace;min-width:25px}.status{font-size:11px;min-height:17px;color:#777;text-align:center;line-height:1.5}.compact{gap:14px;padding:28px}.compact .wave{height:66px}.hint{font-size:11px;color:#666}.playing .wave{color:#111}@media(max-width:400px){.sound{padding:18px;gap:12px}}`;
export function mountSound(host,entry,{compact=false}={}){
 const shell=document.createElement('div');shell.style.cssText='height:100%;width:100%';host.append(shell);const root=shell.attachShadow({mode:'open'}),owner={},controller=new AbortController();
 root.innerHTML=`<style>${CSS}</style><div class="sound ${compact?'compact':''}"><span class="kicker">SOUND EXPRESSION / ${String((entry.soundIndex||0)+1).padStart(2,'0')}</span><svg class="wave" viewBox="0 0 300 75" role="img" aria-label="音のイメージ"><line x1="0" y1="37.5" x2="300" y2="37.5"/><path/></svg>${compact?'<span class="hint">開いて聴く ↗</span>':'<button type="button" class="play">▶ 聴いてみる</button><label class="volume">音量<input type="range" min="0" max="0.5" step="0.01" value="0.2" aria-label="再生音量"><output>20%</output></label><span class="status" aria-live="polite">再生ボタンを押すと音が出ます。</span>'}<span class="time"></span></div>`;
 const stage=root.querySelector('.sound'),wave=root.querySelector('.wave'),path=root.querySelector('path'),button=root.querySelector('.play'),range=root.querySelector('input'),output=root.querySelector('output'),status=root.querySelector('.status');root.querySelector('.time').textContent=`${entry.length.toFixed(2)} SEC`;
 let disposed=false,playing=false,frame=0,handle=null,localToken=0;
 function idle(){let d='';const seed=(entry.soundIndex||0)+1;for(let i=0;i<=120;i++){const x=i/120,env=Math.sin(Math.PI*x)**.8,curve=Math.sin(x*(24+seed*1.8))*Math.sin(x*(11+seed*.6)+.8),y=37.5+curve*env*25;d+=(i?'L':'M')+(x*300).toFixed(1)+' '+y.toFixed(1)+' '}path.setAttribute('d',d);wave.setAttribute('aria-label','音のイメージ')}
 function stopUI(){cancelAnimationFrame(frame);frame=0;handle=null;playing=false;stage.classList.remove('playing');if(button)button.textContent='▶ もう一度聴く';if(status)status.textContent='停止しました。';idle()}
 function draw(){if(disposed||!playing||!handle)return;const values=new Uint8Array(handle.analyser.fftSize);handle.analyser.getByteTimeDomainData(values);let d='';for(let i=0;i<values.length;i+=2){const x=i/(values.length-1)*300,y=37.5+(values[i]-128)/128*82;d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '}path.setAttribute('d',d);frame=requestAnimationFrame(draw)}
 async function play(){if(disposed||compact)return;const token=++localToken;playing=true;stage.classList.add('playing');if(button)button.textContent='■ 停止';if(status)status.textContent='再生中';try{const next=await engine.play(entry.preset,Number(range?.value??.2),()=>{if(disposed||token!==localToken)return;stopUI();if(status)status.textContent='再生が終わりました。'},owner);if(disposed||token!==localToken){engine.stop(owner);return}if(!next){stopUI();return}handle=next;wave.setAttribute('aria-label','再生中の音の波形');cancelAnimationFrame(frame);draw()}catch(error){if(disposed||token!==localToken)return;stopUI();if(status)status.textContent=error.message}}
 function pause(){++localToken;engine.stop(owner);if(!disposed)stopUI()}
 button?.addEventListener('click',()=>playing?pause():play(),{signal:controller.signal});range?.addEventListener('input',()=>{output.textContent=Math.round(Number(range.value)*100)+'%';engine.volume(owner,Number(range.value))},{signal:controller.signal});idle();
 return{play,pause,destroy(){if(disposed)return;pause();disposed=true;controller.abort();shell.remove()},setAuto(){/* Audio never autoplays. */}};
}
