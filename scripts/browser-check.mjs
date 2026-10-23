import {copyFile,rm} from 'node:fs/promises';
const pages=[['browser-check.html','_qa.html'],['check-extensions.html','qa-extensions.html']];
for(const [source,destination] of pages){const target=new URL('../dist/'+destination,import.meta.url);if(process.argv.includes('--clean'))await rm(target,{force:true});else await copyFile(new URL('./'+source,import.meta.url),target);}
console.log(process.argv.includes('--clean')?'Removed internal QA pages.':'Open /_qa.html?subset=extensions and /qa-extensions.html on the local preview. Clean with npm run qa:clean before publishing.');
