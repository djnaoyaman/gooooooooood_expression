import {learningOptions,targetOptions,contextOptions} from './coverage.js';
import './common.js';
import {all,categories,categoryGroups,belongsTo,inputOptions,engineOptions} from './catalog.js';
import {filterEntries} from './discovery.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const controls=Object.fromEntries(['search','category','order','area','input','engine','level','target','context'].map(k=>[k,document.querySelector('#index-'+k)]));
const results=document.querySelector('#index-results'),jump=document.querySelector('#index-jump');
const initial=new URLSearchParams(location.search);controls.search.value=initial.get('q')||'';
for(const k of ['category','order','area','input','engine','level','target','context'])if([...controls[k].options].some(o=>o.value===initial.get(k)))controls[k].value=initial.get(k);
function render(){
 const query=controls.search.value,category=controls.category.value,area=controls.area.value,input=controls.input.value,engine=controls.engine.value,level=controls.level.value,target=controls.target.value,context=controls.context.value;
 const items=filterEntries({query,category,area,input,engine,level,target,context,sort:query?'curated':'name'});
 const visibleCategories=categories.filter(c=>(category==='all'||category===c[0])&&(area==='all'||categoryGroups.find(g=>g.id===area).categories.includes(c[0])));
 const groups=controls.order.value==='az'?[...new Set(items.map(e=>e.name[0].toUpperCase()))].sort().map(letter=>({id:'letter-'+letter,name:letter,items:items.filter(e=>e.name[0].toUpperCase()===letter)})):visibleCategories.map(c=>({id:c[0],name:c[2],area:categoryGroups.find(g=>g.categories.includes(c[0])).name,items:items.filter(e=>belongsTo(e,c[0]))}));
 results.innerHTML=items.length?groups.filter(g=>g.items.length).map(g=>`<section class="index-section" id="${g.id}">${g.area?`<p class="document-eyebrow">${g.area}</p>`:''}<h2>${esc(g.name)} <span class="document-kicker">${g.items.length}</span></h2><div class="index-list">${g.items.map(e=>`<a href="expressions/${e.id}.html"><strong>${esc(e.name)}</strong><span>${esc(e.ja)}</span><span class="index-purpose">${esc(e.use)}</span></a>`).join('')}</div></section>`).join(''):'<p class="index-empty">条件に合う表現がありません。言葉を短くするか、条件を解除して探せます。</p>';
 jump.innerHTML=groups.filter(g=>g.items.length).map(g=>`<a href="#${g.id}">${esc(g.name)} ${g.items.length}</a>`).join('');
 document.querySelector('#index-count').textContent=`${items.length} / ${all.length}件 · 同じ表現を関連する複数の分野から引けます`;
 const u=new URL(location.href);for(const [k,v]of Object.entries({q:query,category:category==='all'?'':category,area:area==='all'?'':area,input:input==='all'?'':input,engine:engine==='all'?'':engine,level:level==='all'?'':level,target:target==='all'?'':target,context:context==='all'?'':context,order:controls.order.value==='az'?'az':''})){if(v)u.searchParams.set(k,v);else u.searchParams.delete(k)}history.replaceState(null,'',u);
 const cardLink=document.querySelector('[data-index-explore]');cardLink.href='index.html'+u.search+'#explore';
}
controls.search.addEventListener('input',render);
for(const k of ['category','order','area','input','engine','level','target','context'])controls[k].addEventListener('change',()=>{if(k==='area')controls.category.value='all';if(k==='category')controls.area.value='all';render()});
document.querySelector('#index-clear').onclick=()=>{controls.search.value='';for(const k of ['category','area','input','engine','level','target','context'])controls[k].value='all';render();controls.search.focus()};
addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();controls.search.focus()}});
render();
