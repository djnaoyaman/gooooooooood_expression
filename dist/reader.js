import { sharePage } from './common.js';
const status = document.querySelector('[data-share-status]');
const notify = text => { if (status) status.textContent = text; };
const code = document.querySelector('#example-code');
const frame = document.querySelector('#example-frame');
function loadDemo() {
  if (!frame || !code) return;
  const reset = '<style>html,body{margin:0;min-height:100%;box-sizing:border-box}body{min-height:330px;display:grid;place-items:center;background:#eeeef2;color:#26272e;font-family:Arial,Meiryo,sans-serif}body>.sample{min-height:330px;width:100%}*,*:before,*:after{box-sizing:border-box}</style>';
  frame.srcdoc = code.textContent + reset;
}
loadDemo();
document.querySelector('[data-replay]')?.addEventListener('click', loadDemo);
document.querySelector('[data-copy-code]')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(code.textContent); notify('実装コードをコピーしました'); }
  catch { const details = code.closest('details'); if(details) details.open=true; const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);notify('コードを選択しました。コピーしてください'); }
});
document.querySelector('[data-entry-share]')?.addEventListener('click', () => sharePage({title:document.title,url:document.querySelector('link[rel=canonical]').href},notify));
