import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {all,categories,byId,belongsTo,categoryGroups,inputOptions,engineOptions} from '../dist/catalog.js';
import {crossReferences} from '../dist/taxonomy.js';
import {filterEntries} from '../dist/discovery.js';
const ids=new Set(categories.map(c=>c[0])),grouped=categoryGroups.flatMap(g=>g.categories);
assert.equal(grouped.length,ids.size,'Each category belongs to exactly one area');
assert.equal(new Set(grouped).size,ids.size);assert.ok(grouped.every(id=>ids.has(id)));
for(const id of Object.keys(crossReferences))assert.ok(byId.has(id),`Stale cross-reference: ${id}`);
for(const e of all){
 assert.match(e.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
 assert.ok(e.categories.includes(e.category));assert.equal(new Set(e.categories).size,e.categories.length);
 assert.ok(e.categories.every(id=>ids.has(id)),`${e.id}: invalid category`);
 assert.ok(engineOptions.slice(1).some(x=>x[0]===e.engine));
 assert.ok(e.inputs.length&&e.inputs.every(id=>inputOptions.slice(1).some(x=>x[0]===id)));
}
for(const id of ids){const filtered=filterEntries({category:id});assert.ok(filtered.length,`Empty category ${id}`);assert.deepEqual(new Set(filtered.map(e=>e.id)),new Set(all.filter(e=>belongsTo(e,id)).map(e=>e.id)));}
for(const g of categoryGroups){const rows=filterEntries({area:g.id});assert.equal(new Set(rows.map(e=>e.id)).size,rows.length);assert.ok(rows.every(e=>g.categories.some(id=>belongsTo(e,id))));}
assert.ok(filterEntries({category:'particles',engine:'audio',input:'listen'}).some(e=>e.id==='av-particles'));
assert.ok(filterEntries({query:'重力',category:'physics'}).some(e=>e.id==='physics-gravity'));
assert.ok(filterEntries({query:'マスク'}).some(e=>e.id==='image-mask'));
assert.ok(filterEntries({area:'movement',engine:'canvas',input:'pointer'}).some(e=>e.id==='physics-spring'));
assert.equal(filterEntries({category:'physics',engine:'video'}).length,0);
const report=JSON.parse(await readFile(new URL('../dist/catalogue-data.json',import.meta.url),'utf8'));
assert.equal(report.specimens,all.length);assert.equal(report.categories,categories.length);
assert.deepEqual(report.entries.map(e=>e.id),all.map(e=>e.id));
console.log('Passed: taxonomy coverage, cross-references, unique counts, combined facets, intent search and generated catalogue data.');

assert.equal(existsSync(new URL('../dist/_qa.html',import.meta.url)),false,'Run npm run qa:clean before publishing');
