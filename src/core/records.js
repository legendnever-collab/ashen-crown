// v0.9.3 장수 열전 (D-093, ACT3_DESIGN §7): each hero's record — sorties, foes defeated, people rescued, HP healed for
// others. A battle keeps its own tally (s.tally); a won story battle (not practice, not a skirmish) adds it to the
// campaign's record (campaign.records). Counting starts with v0.9.3; older saves begin at zero.
export const RECORD_KEYS=['sorties','kills','rescues','heals'];
export const RECORD_KO={sorties:'출전',kills:'격파',rescues:'구출',heals:'치유'};
const blankRecord=()=>({sorties:0,kills:0,rescues:0,heals:0});
function bumpTally(s,u,k,n=1){if(!s||!u||u.team!=='ally'||!n)return;s.tally??={};const t=s.tally[u.id]??={kills:0,rescues:0,heals:0};t[k]=(t[k]||0)+n;}
export const tallyKill=(s,u,victim)=>{if(victim?.team==='enemy'&&victim.hp<=0)bumpTally(s,u,'kills');};
export const tallyRescue=(s,u)=>bumpTally(s,u,'rescues');
export const tallyHeal=(s,u,n)=>bumpTally(s,u,'heals',n);
// Called once on a won story battle: every hero who stood on the field (not benched) gains a sortie.
export function commitRecords(s){if(s.practice)return;const c=s.campaign;c.records??={};
 for(const u of s.units.filter(u=>u.team==='ally'&&!u.benched)){const r=c.records[u.id]??=blankRecord();r.sorties++;const t=s.tally?.[u.id];if(t)for(const k of ['kills','rescues','heals'])r[k]+=t[k]||0;}
 delete s.tally;}
// A save's tally (battle) or records (campaign): hero ids → non-negative integers, nothing else.
export function validTally(v,party,campaign){if(v==null)return true;if(typeof v!=='object'||Array.isArray(v)||Object.keys(v).length>12)return false;
 const keys=campaign?RECORD_KEYS:['kills','rescues','heals'];
 return Object.entries(v).every(([id,r])=>typeof id==='string'&&id.length<20&&(!party||party.includes(id))&&!!r&&typeof r==='object'&&!Array.isArray(r)&&Object.keys(r).every(k=>keys.includes(k))&&keys.every(k=>r[k]==null||Number.isInteger(r[k])&&r[k]>=0&&r[k]<1e6));}
// The one line that stands for a hero on the ACT III card: the deed they did most (healing counted per 10 HP).
export function signatureDeed(r){if(!r||!r.sorties)return null;const options=[['kills',r.kills||0,r.kills||0],['rescues',r.rescues||0,(r.rescues||0)*2],['heals',r.heals||0,(r.heals||0)/10]].sort((a,b)=>b[2]-a[2]);
 const [k,n,w]=options[0];return w>0?`${RECORD_KO[k]} ${n}${k==='heals'?' HP':''}`:`${RECORD_KO.sorties} ${r.sorties}`;}
export const recordOf=(c,id)=>c?.records?.[id]||null;
