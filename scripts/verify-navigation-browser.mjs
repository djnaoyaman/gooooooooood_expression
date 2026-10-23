const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
try{
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='local.test')return route.fulfill({body:'',contentType:'text/javascript'});try{const file=resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));await route.fulfill({body:await readFile(file),contentType:({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[extname(file)]||'text/plain'});}catch{await route.fulfill({status:404,body:'missing'});}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)});
 const base='http://local.test';
 const opened=()=>page.waitForSelector('#detail-dialog[open] #copy-detail',{state:'attached'});
 await page.goto(base+'/?q=physics#explore');await page.waitForSelector('.card-title');
 await page.locator('.card-title').first().click();await opened();assert.match(page.url(),/#explore\/physics-/);
 const first=page.url();await page.goBack();await page.waitForSelector('#detail-dialog:not([open])',{state:'attached'});assert.equal(await page.locator('#search').inputValue(),'physics');
 await page.goForward();await opened();assert.equal(page.url(),first);
 await page.keyboard.press('Escape');await page.waitForURL(u=>u.hash==='#explore');
 await page.goto(base+'/#explore/float');await opened();await page.locator('#detail-dialog .close-button').click();await page.waitForURL(u=>u.hash==='#explore');assert.equal(await page.locator('#detail-dialog').evaluate(n=>n.open),false);
 await page.locator('[data-route=easing]').click();await page.waitForSelector('#easing-lab');await page.locator('[data-route=sound]').click();await page.waitForSelector('[data-sound]');
 const count=await page.evaluate(()=>window.dataLayer.filter(e=>e[1]==='view_section').length);await page.goBack();await page.waitForSelector('#easing-lab');assert.equal(await page.evaluate(()=>window.dataLayer.filter(e=>e[1]==='view_section').length),count+1,'one render per history traversal');
 await page.goto(base+'/?area=type&level=advanced&q=not-matching#explore');await page.waitForSelector('#search');await page.locator('#nav-saved').click();await page.waitForURL(u=>u.search==='?category=saved');assert.equal(await page.locator('#search').inputValue(),'');assert.equal(await page.locator('#facet-area').inputValue(),'all');assert.equal(await page.locator('#facet-level').inputValue(),'all');
 await page.locator('[data-route=explore]').click();await page.waitForSelector('.card-title');assert.equal(new URL(page.url()).searchParams.has('category'),false,'Explore exits collection');
 await page.locator('.card-title').first().click();await opened();await page.locator('[data-discover]').first().click();await opened();await page.locator('#detail-dialog .close-button').click();await page.waitForURL(u=>u.hash==='#explore');assert.equal(await page.locator('#detail-dialog').evaluate(n=>n.open),false);
 await page.goto(base+'/#explore/not-existing');await page.waitForSelector('.card-title');assert.equal(new URL(page.url()).hash,'#explore');
 await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#explore');
 await page.setViewportSize({width:390,height:844});await page.locator('#nav-saved').click();await page.waitForURL(u=>u.searchParams.get('category')==='saved');await page.locator('[data-route=explore]').click();await page.waitForSelector('.card-title');await page.locator('.card-title').first().click();await opened();await page.goBack();await page.waitForSelector('#detail-dialog:not([open])',{state:'attached'});
 await page.goto(base+'/catalog.html?order=az');await page.waitForSelector('[data-index-explore]');const atlasURL=new URL(await page.locator('[data-index-explore]').getAttribute('href'));assert.equal(atlasURL.searchParams.get('sort'),'name');assert.equal(atlasURL.searchParams.has('order'),false);
 await page.goto(base+'/#explore');await page.waitForSelector('.card-title');
 assert.deepEqual(errors,[]);console.log('Passed desktop/mobile navigation: detail Back/Forward/Escape, direct links, related details, route transitions, deduplicated history, collection reset/exit, invalid routes, skip link, index ordering.');
 const ids=await page.evaluate(async()=> (await import('/catalog.js')).all.map(e=>e.id));
 for(const id of ids){await page.evaluate(id=>{history.replaceState(null,'','#explore/'+id);dispatchEvent(new PopStateEvent('popstate'));},id);await opened();}
 assert.deepEqual(errors,[]);console.log('Mounted all '+ids.length+' expression demos without uncaught errors.');
}finally{await browser.close();}

