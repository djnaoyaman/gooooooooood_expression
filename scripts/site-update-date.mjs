import {execFileSync} from 'node:child_process';

export function formatSiteDate(value){
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(value))throw new Error('Missing or invalid source commit timestamp');
  const instant=new Date(value);
  if(!Number.isFinite(instant.getTime()))throw new Error('Invalid source commit timestamp');
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(instant);
  const get=type=>parts.find(p=>p.type===type).value;
  const date=`${get('year')}-${get('month')}-${get('day')}`;
  const label=`${get('year')}年${Number(get('month'))}月${Number(get('day'))}日（JST）`;
  return {date,label,markup:`<time data-site-updated datetime="${date}">${label}</time>`};
}

export function readSiteUpdate(readCommit=()=>execFileSync('git',['log','-1','--format=%cI','--','dist','scripts/build-pages.mjs','scripts/site-update-date.mjs','site.config.json'],{encoding:'utf8'}).trim()){
  // Requires Git history: absence is an error, never a fallback to build/visit time.
  return formatSiteDate(readCommit());
}
