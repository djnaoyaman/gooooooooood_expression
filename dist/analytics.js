// Fixed event names and public catalogue IDs only. Never send copied or typed text.
const events = new Set(['view_section','view_expression','demo_interaction','copy_code','copy_brief','copy_color','add_to_collection','remove_from_collection','compare_expressions','share','select_filter']);
const fields = new Set(['section','expression_id','expression_ids','placement','action','method','item_count','filter_name','filter_value']);
export function track(name, params = {}) {
  if (!events.has(name)) return;
  try {
    const safe = {send_to:'G-3HF4SGP3C6'};
    for (const [key,value] of Object.entries(params)) {
      if (fields.has(key) && (typeof value === 'number' || (typeof value === 'string' && /^[a-zA-Z0-9_,.-]{1,100}$/.test(value)))) safe[key] = value;
    }
    window.gtag?.('event', name, safe);
  } catch { /* Measurement must never interrupt the experience. */ }
}
export function expressionFromURL(value) {
  try {
    const url = new URL(value, location.href);
    const id = url.pathname.match(/\/expressions\/([a-z0-9-]+)\.html$/)?.[1];
    return id ? {expression_id:id} : {};
  } catch { return {}; }
}
const observed = new WeakMap();
export function observeDemo(host, id) {
  if (observed.has(host)) { observed.get(host).id = id; return; }
  const state = {id,last:-Infinity};
  observed.set(host,state);
  const interact = event => {
    if (!event.isTrusted || (event.type === 'keydown' && !['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))) return;
    const now = performance.now();
    if (now-state.last < 1000) return;
    state.last = now;
    track('demo_interaction',{expression_id:state.id,action:'interact'});
  };
  for (const type of ['click','input','keydown']) host.addEventListener(type,interact);
}
// Public, fixed filter values; search boxes and editable sample text are excluded.
document.addEventListener('change',event => {
  const el = event.target;
  if (!event.isTrusted || el.tagName !== 'SELECT' || !/^(facet-|index-(category|area|input|engine|level|target|context|order)$|category-select$|sort$)/.test(el.id)) return;
  track('select_filter',{filter_name:el.id,filter_value:el.value});
});
document.addEventListener('click',event => {
  const el = event.target.closest?.('[data-category],[data-trail]');
  if (!event.isTrusted || !el) return;
  track('select_filter',{filter_name:el.hasAttribute('data-trail')?'trail':'category',filter_value:el.dataset.trail || el.dataset.category});
});
