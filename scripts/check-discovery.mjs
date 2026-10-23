import assert from 'node:assert/strict';
import {all,byId} from '../dist/catalog.js';
import {trails,normalize,filterEntries,connections} from '../dist/discovery.js';

assert.equal(normalize('ＰＡＲＡＬＬＡＸ'),'parallax');
assert.deepEqual(filterEntries({query:'ﾊﾟﾗﾗｯｸｽ'}).map(e=>e.id),filterEntries({query:'パララックス'}).map(e=>e.id));
const multi=filterEntries({query:'スクロール 文字'});
assert.ok(multi.length>0 && multi.every(e=>e.category==='scroll'));
assert.ok(filterEntries({query:'ふわっと'}).some(e=>e.id==='float'));
assert.equal(filterEntries({query:'not-a-real-expression-z999'}).length,0);
for(const t of trails){
 assert.equal(filterEntries({trail:t.id}).length,t.ids.length);
 assert.equal(t.ids.length,t.prompts.length);
 assert.equal(new Set(t.ids).size,t.ids.length);
 for(const id of t.ids)assert.ok(byId.has(id));
}
assert.equal(filterEntries({category:'sound'}).length,all.filter(e=>e.category==='sound').length);
assert.deepEqual(filterEntries({category:'saved',favorites:new Set(['fade-in'])}).map(e=>e.id),['fade-in']);
for(const e of all){const c=connections(e.id);assert.equal(new Set(c.map(r=>r.entry.id)).size,c.length);assert.ok(c.every(r=>r.entry.id!==e.id));}
assert.equal(connections('scroll-layered-parallax')[0].reason,'遠近感をつくる角度を見る');
console.log('Passed: normalized and multi-word search, intent aliases, filters, six trails, and related expressions.');
