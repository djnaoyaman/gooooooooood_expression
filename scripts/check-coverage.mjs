import assert from 'node:assert/strict';
import {all,byId} from '../dist/catalog.js';
import {coverageAreas,learningOptions,targetOptions,contextOptions} from '../dist/coverage.js';
import {filterEntries,connections} from '../dist/discovery.js';
const covered=new Set(coverageAreas.flatMap(g=>g.ids));
for(const g of coverageAreas){assert.ok(g.ids.length);assert.equal(new Set(g.ids).size,g.ids.length);for(const id of g.ids)assert.ok(byId.has(id),`Missing coverage specimen ${id}`)}
for(const e of all){assert.ok(learningOptions.some(x=>x[0]===e.level));assert.ok(e.targets.length&&e.targets.every(id=>targetOptions.some(x=>x[0]===id)));assert.ok(e.contexts.length&&e.contexts.every(id=>contextOptions.some(x=>x[0]===id)));if(e.level!=='basic')assert.ok(covered.has(e.id),`${e.id} needs a coverage record`);for(const id of e.related||[])assert.ok(byId.has(id));}
assert.deepEqual(filterEntries({level:'composition'}).map(e=>e.id),['case-product','case-editorial','case-gallery','case-form']);
assert.ok(filterEntries({context:'responsive',target:'text'}).some(e=>e.id==='layout-fluid'));
assert.ok(filterEntries({target:'video',input:'scroll'}).some(e=>e.id==='media-scroll-video'));
assert.equal(filterEntries({level:'composition',engine:'webgl'}).length,0);
assert.ok(connections('ui-validation').some(r=>r.entry.id==='case-form'));
assert.ok(filterEntries({query:'スマホ',context:'responsive'}).length>=4);
console.log(`Passed: ${covered.size} expansion specimens / ${coverageAreas.length} coverage areas, levels, targets, contexts and applied-example connections.`);
