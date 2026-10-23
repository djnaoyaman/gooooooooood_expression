import {domLab} from './lab-kit.js';
import {motionVideo,motionPoster,motionWebm} from './media-data.js';
const c=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
function videoSetup({root,values:v,kind,on,reduced}){
 const video=root.querySelector('video'),status=root.querySelector('.lab-status');let playing=false,timer=0,backward=false,dead=false;
 video.muted=true;video.playsInline=true;video.loop=kind!=='media-pingpong';
 function stop(){playing=false;video.pause();clearInterval(timer);status.textContent='停止中';}
 async function start(){if(dead)return;clearInterval(timer);playing=true;if(kind==='media-pingpong'&&backward){video.pause();timer=setInterval(()=>{if(video.currentTime<=.05){backward=false;start();return}video.currentTime=Math.max(0,video.currentTime-.08)},80);}else{try{await video.play();status.textContent=kind==='media-pingpong'?'往復再生中':'再生中 · 無音のオリジナル映像';}catch{playing=false;status.textContent='再生ボタンを押して試してください。';}}}
 on(video,'ended',()=>{if(kind==='media-pingpong'){backward=true;start()}});on(video,'error',()=>{status.textContent='この環境で動画を再生できませんでした。'});
 return{update(){video.playbackRate=v.speed||1;if(kind==='media-scrub'&&Number.isFinite(video.duration)){stop();video.currentTime=video.duration*v.progress/100;}if(kind==='media-cinemagraph')root.querySelector('.video-window').style.clipPath=`inset(0 0 0 ${v.crop}%)`;},action(){if(kind==='media-scrub'){video.currentTime=Math.min(video.duration||3,video.currentTime+1/24);status.textContent='1コマ進む / 24fps';}else playing?stop():start();},setAuto(auto){if(!auto)stop()},destroy(){dead=true;stop();video.removeAttribute('src');video.querySelectorAll('source').forEach(s=>s.remove());video.load();}};
}
export const videoLabs=[];
for(const [id,name,ja,description,tip,controls]of[
 ['media-loop','Looping video','映像を継ぎ目なく繰り返す','円運動の始点と終点をそろえた、3秒のオリジナル映像を繰り返します。','回転が一周する瞬間に、継ぎ目を感じるか観察してください。',[c('speed','再生速度',.25,2,1,.25)]],
 ['media-pingpong','Ping-pong playback','行って、戻る映像','順再生の後、再生位置を少しずつ戻して逆向きに再生します。逆再生側はシークによる近似です。','折り返しの瞬間に、速度の向きがどう変わるかを見る。',[]],
 ['media-speed','Playback speed','速度が映像の印象を変える','同じ動画の再生速度だけを変えて、時間の感じ方を比較します。','0.25倍、1倍、2倍を続けて比較してください。',[c('speed','再生速度',.25,2,1,.25)]],
 ['media-scrub','Frame scrubbing','映像を一コマずつ読む','動画の再生位置を指定して、動きの途中を止めて観察します。','スライダーで場所を選び、1コマずつ進めてください。',[c('progress','再生位置 %',0,99,0)]],
 ['media-cinemagraph','Cinemagraph window','一部分だけが動く','静止画と動画を重ね、動画の表示領域を切り抜いて一部だけ動かします。','動く領域を狭め、静止した部分との関係を観察する。',[c('crop','動く窓の左端 %',40,85,55)]]
]){const scene=id==='media-cinemagraph'?`<img class="still-video" src="${motionPoster}" alt="映像の最初のフレーム"><video class="video-window" muted playsinline preload="metadata" poster="${motionPoster}" aria-label="無音のオリジナル動画"><source src="${motionWebm}" type="video/webm"><source src="${motionVideo}" type="video/mp4"></video>`:`<video muted playsinline preload="metadata" poster="${motionPoster}" aria-label="無音のオリジナル動画"><source src="${motionWebm}" type="video/webm"><source src="${motionVideo}" type="video/mp4"></video>`;videoLabs.push(domLab({id,category:'media',categories:id==='media-cinemagraph'?['media','mask','image']:['media','rhythm'],name,ja,description,use:'短い映像の編集、再生方法、静と動の組み合わせ。',tip,prompt:tip,tags:['映像','動画','時間','再生'],source:'https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement'},videoSetup,controls,scene,'.lab-scene{height:140px;max-width:320px}.lab-scene video{width:100%;height:140px;display:block;object-fit:cover}.video-window{position:absolute;inset:0}.still-video{position:absolute;inset:0;width:100%;height:140px;object-fit:cover}.still-video b{font:bold 40px Arial;letter-spacing:-2px}.still-video i{position:absolute;right:30px;top:25px;width:90px;height:90px;border:1px solid #bab8b0;border-radius:50%}',{static:true,action:id==='media-scrub'?'1コマ進む':'再生／停止'}));}
