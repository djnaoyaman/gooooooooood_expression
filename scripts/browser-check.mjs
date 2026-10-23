import {copyFile,rm} from 'node:fs/promises';
const target=new URL('../dist/_qa.html',import.meta.url);
if(process.argv.includes('--clean')){await rm(target,{force:true});console.log('Removed internal QA page.');}
else{await copyFile(new URL('./browser-check.html',import.meta.url),target);console.log('Open /_qa.html on the local preview. Clean with npm run qa:clean before publishing.');}
