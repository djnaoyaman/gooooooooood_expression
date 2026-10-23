import { track, expressionFromURL } from './analytics.js';
export async function sharePage(data, notify = () => {}) {
  if (navigator.share) {
    try { await navigator.share(data); track('share', {method:'native', ...expressionFromURL(data.url)}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(data.url); track('share', {method:'copy_link', ...expressionFromURL(data.url)}); notify('リンクをコピーしました'); }
  catch {
    const field = document.createElement('textarea');
    field.value = data.url; field.setAttribute('aria-label', '共有リンク');
    field.style.cssText = 'position:fixed;bottom:20px;left:5%;width:90%;z-index:99999;padding:12px';
    document.body.append(field); field.focus(); field.select();
    notify('共有リンクを選択しました。コピーしてください');
    field.addEventListener('blur', () => field.remove(), { once: true });
  }
}
const back = document.querySelector('[data-back-top]');
if (back) {
  const update = () => { back.hidden = scrollY < 700; };
  addEventListener('scroll', update, { passive: true }); update();
  back.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'instant' }); document.querySelector('.brand')?.focus({ preventScroll: true }); });
}
for (const button of document.querySelectorAll('[data-share-page]')) {
  button.addEventListener('click', () => sharePage({ title: document.title, url: document.querySelector('link[rel=canonical]')?.href || location.href }, text => {
    const status = document.querySelector('[data-share-status]'); if (status) status.textContent = text;
  }));
}

