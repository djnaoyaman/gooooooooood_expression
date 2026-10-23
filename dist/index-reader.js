import './common.js';
import {all,categories} from './catalog.js';
import {filterEntries} from './discovery.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const search=document.querySelector('#index-search'),category=document.querySelector('#index-category'),mode=document.querySelector('#index-order'),results=document.querySelector('#index-results'),jump=document.querySelector('#index-jump');
const initial=new URLSearchParams(location.search);search.value=initial.get('q')||'';if(categories.some(c=>c[0]===initial.get('category')))category.value=initial.get('category');if(initial.get('order')==='az')mode.value='az';
function render(){
 const items=filterEntries({query:search.value,category:category.value,sort:search.value?'curated':'name'});
 const groups=mode.value==='az'?[...new Set(items.map(e=>e.name[0].toUpperCase()))].sort().map(letter=>({id:'letter-'+letter,name:letter,items:items.filter(e=>e.name[0].toUpperCase()===letter)})):categories.map(c=>({id:c[0],name:c[2],items:items.filter(e=>e.category===c[0])}));
 results.innerHTML=items.length?groups.filter(g=>g.items.length).map(g=>`<section class="index-section" id="${g.id}"><h2>${esc(g.name)} <span class="document-kicker">${g.items.length}</span></h2><div class="index-list">${g.items.map(e=>`<a href="expressions/${e.id}.html"><strong>${esc(e.name)}</strong><span>${esc(e.ja)}</span><span class="index-purpose">${esc(e.use)}</span></a>`).join('')}</div></section>`).join(''):'<p class="index-empty">条件に合う表現がありません。言葉を短くするか、カテゴリーを解除して探せます。</p>';
 jump.innerHTML=groups.filter(g=>g.items.length).map(g=>`<a href="#${g.id}">${esc(g.name)} ${g.items.length}</a>`).join('');
 document.querySelector('#index-count').textContent=`${items.length} / ${all.length}件 · ${search.value?'「'+search.value+'」の検索結果':'名前から、使いどころから。'}`;
 const u=new URL(location.href);for(const [k,v]of Object.entries({q:search.value,category:category.value==='all'?'':category.value,order:mode.value==='az'?'az':''})){if(v)u.searchParams.set(k,v);else u.searchParams.delete(k)}history.replaceState(null,'',u);
}
search.addEventListener('input',render);category.addEventListener('change',render);mode.addEventListener('change',render);
document.querySelector('#index-clear').onclick=()=>{search.value='';category.value='all';render();search.focus()};
addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();search.focus()}});
render();
