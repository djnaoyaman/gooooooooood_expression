import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
import {all} from '../dist/catalog.js';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
for(const path of ['index.html','catalog.html','author.html','404.html',...all.map(e=>`expressions/${e.id}.html`)]){
 const html=await read('dist/'+path);
 assert.equal((html.match(/src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-3HF4SGP3C6"/g)||[]).length,1,path+': one Google tag');
 assert.equal((html.match(/gtag\('config','G-3HF4SGP3C6'\)/g)||[]).length,1,path+': one config');
 assert.ok(html.includes(`src="${path.startsWith('expressions/')?'../':''}analytics.js"`),path+': analytics module path');
 for(const [,code]of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Script(code);
}
const calls=[],listeners={};
const sandbox={window:{gtag:(...args)=>calls.push(args)},document:{addEventListener:(name,fn)=>listeners[name]=fn},URL,location:{href:'https://example.test/expressions/float.html'},performance:{now:()=>1000}};
const source=(await read('dist/analytics.js')).replaceAll('export ','');
runInNewContext(source+`;track('copy_code',{expression_id:'float',search_term:'private',action:'typed content'});track('unknown_event');`,sandbox);
assert.equal(calls.length,1);assert.equal(calls[0][1],'copy_code');assert.equal(calls[0][2].send_to,'G-3HF4SGP3C6');assert.equal(calls[0][2].expression_id,'float');assert.equal(calls[0][2].search_term,undefined);assert.equal(calls[0][2].action,undefined);
sandbox.window.gtag=()=>{throw Error('blocked')};runInNewContext(source+`;track('copy_code');`,{...sandbox});
console.log(`Passed: GA tag/config/module paths across ${all.length+4} pages, inline JavaScript, event/parameter allowlists, blocked analytics isolation.`);
