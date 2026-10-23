import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {all,categories} from '../dist/catalog.js';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const config=JSON.parse(await readFile(new URL('../site.config.json',import.meta.url),'utf8'));
assert.equal(new Set(all.map(e=>e.id)).size,all.length,'Duplicate catalogue IDs');
assert.equal(new Set(categories.map(c=>c[0])).size,categories.length);
const files=['index.html','author.html','catalog.html','404.html',...all.map(e=>`expressions/${e.id}.html`)];
const titles=new Set(),canonical=new Set();let linkCount=0,scriptCount=0;
for(const e of all){
 for(const field of ['id','name','ja','category','description','use','tip','source','tags']) assert.ok(e[field],`${e.id}: missing ${field}`);
 assert.ok(categories.some(c=>c[0]===e.category));
 if(e.type!=='motion')assert.ok(e.code,`${e.id}: missing standalone code`);
 for(const match of (e.code||'').matchAll(/<script>([\s\S]*?)<\/script>/g)){new vm.Script(match[1],{filename:e.id});scriptCount++;}
}
for(const file of files){
 const html=await readFile(resolve(root,file),'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one H1`);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title);assert.ok(!titles.has(title),`${file}: duplicate title`);titles.add(title);
 const canon=html.match(/rel="canonical" href="([^"]+)"/)?.[1];assert.ok(canon?.startsWith(config.url));assert.ok(!canonical.has(canon),`${file}: duplicate canonical`);canonical.add(canon);
 assert.match(html,/name="description" content="[^"]+"/);assert.match(html,/property="og:image"/);assert.match(html,/name="twitter:card"/);assert.match(html,/rel="apple-touch-icon"/);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const ref=match[1].split(/[?#]/)[0];if(!ref||/^(?:[a-z]+:|\/\/)/i.test(ref))continue;
  await access(resolve(dirname(resolve(root,file)),ref));linkCount++;
 }
}
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,all.length+3);
assert.equal((await readdir(resolve(root,'expressions'))).filter(x=>x.endsWith('.html')).length,all.length);
for(const icon of ['favicon.svg','favicon.ico','favicon-16.png','favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png','assets/og-image.png'])await access(resolve(root,icon));
console.log(`Passed: ${all.length} specimens, ${files.length} HTML pages, ${linkCount} local links, ${scriptCount} standalone scripts, metadata, sitemap and icons.`);
