import {writeFile} from 'node:fs/promises';
import {all,categories,categoryGroups,belongsTo,inputOptions,engineOptions} from '../dist/catalog.js';
import {trails} from '../dist/discovery.js';
export async function writeCatalogueReport(){
 const report={specimens:all.length,categories:categories.length,areas:categoryGroups.length,trails:trails.length,note:'Specimen totals are unique. Category totals include cross-references.',groups:categoryGroups.map(g=>({...g,count:all.filter(e=>g.categories.some(id=>belongsTo(e,id))).length})),categoryCounts:categories.map(c=>({id:c[0],name:c[2],primary:all.filter(e=>e.category===c[0]).length,indexed:all.filter(e=>belongsTo(e,c[0])).length})),engines:engineOptions.slice(1).map(([id,name])=>({id,name,count:all.filter(e=>e.engine===id).length})),inputs:inputOptions.slice(1).map(([id,name])=>({id,name,count:all.filter(e=>e.inputs.includes(id)).length})),entries:all.map(({id,name,ja,category,categories,engine,inputs,source,level,targets,contexts,support})=>({id,name,ja,category,categories,engine,inputs,source,level,targets,contexts,support}))};
 await writeFile(new URL('../dist/catalogue-data.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 return report;
}
if(process.argv[1]===new URL(import.meta.url).pathname){const r=await writeCatalogueReport();console.log(`${r.specimens} specimens / ${r.categories} categories / ${r.areas} areas / ${r.trails} trails`)}
