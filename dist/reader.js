import { track, expressionFromURL } from './analytics.js';
import { sharePage } from './common.js';
const expression=expressionFromURL(location.href);
if(expression.expression_id)track('view_expression',{...expression,placement:'page'});
const status = document.querySelector('[data-share-status]');
const notify = text => { if (status) status.textContent = text; };
const code = document.querySelector('#example-code');
const frame = document.querySelector('#example-frame');
// The sandbox has an opaque origin. Verify the exact iframe window, not origin.
let lastInteraction = -Infinity;
addEventListener('message', event => {
  if (!frame || event.source !== frame.contentWindow || event.data?.type !== 'ge-demo-interaction') return;
  const now = performance.now();
  if (now-lastInteraction < 1000) return;
  lastInteraction = now;
  track('demo_interaction',{...expression,action:'interact'});
});
function loadDemo() {
  if (!frame || !code) return;
  const reset = '<style>html,body{margin:0;min-height:100%;box-sizing:border-box}body{min-height:330px;display:grid;place-items:center;background:#eeeef2;color:#26272e;font-family:Arial,Meiryo,sans-serif}body>.sample{min-height:330px;width:100%}*,*:before,*:after{box-sizing:border-box}</style>';
  const bridge = `<script>for(const type of ['click','input','keydown'])document.addEventListener(type,event=>{if(!event.isTrusted)return;if(type==='keydown'&&!['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;parent.postMessage({type:'ge-demo-interaction'},'*');});</script>`;
  frame.srcdoc = code.textContent + reset + bridge;
}
loadDemo();
document.querySelector('[data-replay]')?.addEventListener('click', () => {loadDemo();track('demo_interaction',{...expression,action:'reset'});});
document.querySelector('[data-copy-code]')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(code.textContent); track('copy_code',expression); notify('実装コードをコピーしました'); }
  catch { const details = code.closest('details'); if(details) details.open=true; const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);notify('コードを選択しました。コピーしてください'); }
});
document.querySelector('[data-entry-share]')?.addEventListener('click', () => sharePage({title:document.title,url:document.querySelector('link[rel=canonical]').href},notify));

