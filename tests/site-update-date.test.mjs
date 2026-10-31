import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {formatSiteDate,readSiteUpdate} from '../scripts/site-update-date.mjs';
test('JST rolls over at 15:00 UTC, independently of visitor timezone',()=>{
 assert.equal(formatSiteDate('2026-10-31T14:59:59Z').date,'2026-10-31');
 assert.equal(formatSiteDate('2026-10-31T15:00:00Z').date,'2026-11-01');
 assert.equal(formatSiteDate('2026-11-01T00:00:00+09:00').date,'2026-11-01');
 assert.throws(()=>formatSiteDate(''));
 assert.throws(()=>readSiteUpdate(()=>'not a commit timestamp'));
});
test('all generated footer dates use the same source date',async()=>{
 const expected=readSiteUpdate();
 const config=JSON.parse(await readFile('dist/site-update.json','utf8'));
 assert.equal(config.date,expected.date);
 const htmls=['index.html','catalog.html','author.html','404.html',...(await readdir('dist/expressions')).filter(x=>x.endsWith('.html')).map(x=>'expressions/'+x)];
 for(const file of htmls){
  const html=await readFile('dist/'+file,'utf8');
  assert.equal((html.match(/data-site-updated/g)||[]).length,1,file);
  assert.ok(html.includes(expected.markup),file);
  assert.ok(html.indexOf('<footer')<html.indexOf(expected.markup)&&html.indexOf(expected.markup)<html.indexOf('</footer>'),file);
 }
 const author=await readFile('dist/author.html','utf8');
 assert.match(author,/<time datetime="2026-10-31">2026年10月31日（日本時間）<\/time>/,'separate author review date preserved');
 console.log('Verified '+htmls.length+' generated footers');
});
