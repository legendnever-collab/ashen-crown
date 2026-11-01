// v0.8.1 「무기」 rules (D-073 §6; numbers PROPOSED): gear stars and EXP, 단련, the town shelves (specialty, premium, elite,
// Velmar's rare-goods shelf), treasure effects, hidden objectives and supply carriers.
import {GEAR,TOOLS} from '../data/frontier-data.js';
import {STAR_EXP,TEMPER_PRICE,FEATS,SUPPLY,RARE_MARKUP,CUTIN} from '../data/arms-v081.js';
import {trustStage} from './factions.js';
export const isTreasure=type=>!!GEAR[type]?.treasure;
export const maxStar=type=>isTreasure(type)?5:3;
const starTable=type=>isTreasure(type)?STAR_EXP.treasure:STAR_EXP.gear;
export const expCap=type=>starTable(type).at(-1);
export function starFor(type,exp){const t=starTable(type);let n=1;while(n<t.length&&exp>=t[n])n++;return n;}
// EXP still needed for the next star (0 at the top).
export const expToNext=g=>g.star>=maxStar(g.type)?0:starTable(g.type)[g.star]-g.exp;
// Bonus of one owned item: its base bonus, one `grow` per star above ★1, and a treasure's effect power at its star.
export function gearBonus(g){const def=GEAR[g?.type];if(!def)return {};const b={...def.bonus};for(const [k,v] of Object.entries(def.grow||{}))b[k]=(b[k]||0)+v*((g.star||1)-1);if(def.fx)b[def.fx]=def.power[(g.star||1)-1];return b;}
// 단련: pay to fill the current star (normal gear only). The price scales with the EXP still missing.
export function temperCost(g){const def=GEAR[g?.type];if(!def||def.treasure||g.star>=3)return null;const table=STAR_EXP.gear,need=table[g.star]-table[g.star-1],left=table[g.star]-g.exp;return Math.max(5,Math.ceil(TEMPER_PRICE[def.tier][g.star-1]*left/need/5)*5);}
export function temper(g){g.exp=STAR_EXP.gear[g.star];g.star=starFor(g.type,g.exp);return g;}
// Battle use: the weapon learns from strikes and heals, the armor from blows taken; accessories and treasures from both.
// Only the battle copy of the economy changes, so a defeat or a practice run leaves the campaign's gear as it was.
export function gainGearExp(s,u,kind,n=2){if(!u||u.team!=='ally'||s.practice||!s.economy?.equipped?.[u.id]||s.missionId==null)return;
 const slots=kind==='strike'?['weapon','accessory','treasure']:['armor','accessory','treasure'];
 for(const slot of slots){const id=s.economy.equipped[u.id][slot],g=id&&s.economy.gear.find(a=>a.id===id);if(!g||g.star>=maxStar(g.type))continue;
  const add=slot==='weapon'||slot==='armor'?n:Math.max(1,n>>1);g.exp=Math.min(expCap(g.type),g.exp+add);const star=starFor(g.type,g.exp);
  if(star>g.star){g.star=star;s.feedback.push({type:'gear',id:u.id,text:`${GEAR[g.type].name} ★${star}`});s.log.push(`${u.name}: ${GEAR[g.type].name} ★${star}로 성장.`);}}}
// Treasure effect on a hero (0 when none is worn).
export function fx(s,u,key){if(u?.team!=='ally')return 0;const e=s?.economy,id=e?.equipped?.[u.id]?.treasure,g=id&&e.gear.find(a=>a.id===id);return g&&GEAR[g.type].fx===key?gearBonus(g)[key]:0;}
// ---------- town shelves ----------
const reachedTown=(c,home,missionId)=>({castletown:7,velmar:9,pilgrim:11})[home]<=Math.max(missionId||0,...(c?.completed||[]).map(n=>n+1));
// Why an item is or is not on this town's shelf. state: 'sale' | 'locked' | 'elsewhere'.
export function shelfState(s,id){const g=GEAR[id],c=s.campaign,hub=s.frontier?.hub;if(!g||g.treasure)return {state:'elsewhere'};
 if(g.tier===1)return {state:'sale'};if(g.home!==hub)return {state:'elsewhere'};
 if(g.premium)return reachedTown(c,g.home,s.missionId)?{state:'sale',label:'고급품'}:{state:'locked',label:'고급품'};
 if(g.trust){const v=c?.factionTrust?.[g.trust]??0;return v>=2?{state:'sale',label:'정예'}:{state:'locked',label:`정예 · ${trustName(g.trust)} 신뢰 2 이상 (지금 ${trustStage(v).ko})`};}
 return (c?.completed||[]).includes(g.after)?{state:'sale',label:'특산'}:{state:'locked',label:`특산 · M${String(g.after).padStart(2,'0')} 클리어 후`};}
const trustName=f=>({iron:'철왕관',free:'자유 영주',flame:'성화 교단'})[f];
// Every item this shop shows: the tier I basics everywhere, the town's own goods (on sale or locked) at home.
export const shopGear=s=>Object.keys(GEAR).map(id=>({id,...shelfState(s,id)})).filter(r=>r.state!=='elsewhere');
export const gearOnSale=(s,id)=>shelfState(s,id).state==='sale';
// Velmar's rare-goods shelf: one specialty of another town (never premium or elite), turned with every clear, +25%.
const RARE_POOL=Object.keys(GEAR).filter(id=>GEAR[id].tier===2&&!GEAR[id].premium&&GEAR[id].home!=='velmar');
export function rareShelf(s){if(s.frontier?.hub!=='velmar'||!reachedTown(s.campaign,'velmar',s.missionId))return null;const turn=(s.campaign?.completed||[]).length,id=RARE_POOL[(turn*7+3)%RARE_POOL.length];
 return {id,turn,price:Math.ceil(GEAR[id].price*RARE_MARKUP/5)*5,sold:(s.economy?.rareBought||[]).includes(turn)};}
// ---------- hidden objectives ----------
export const featOf=missionId=>FEATS[missionId]||null;
export const featDone=(c,missionId)=>(c?.feats||[]).includes(missionId);
// At a victory (campaign or practice of a cleared mission): test this battle's own record and grant the reward once.
export function checkFeat(s){const f=featOf(s.missionId);if(!f||featDone(s.campaign,s.missionId))return null;const bf=s.battleFlags||{},fell=s.units.some(u=>u.team==='ally'&&!u.benched&&u.hp<=0);
 if(!f.test(s,bf,fell))return null;s.campaign.feats??=[];s.campaign.feats.push(s.missionId);
 const targets=s.practice?[s.campaign.economy]:[s.economy];let got;
 for(const e of targets){if(f.reward==='elixir'){if(Object.values(e.items).reduce((a,b)=>a+b,0)<8){e.items.elixir=(e.items.elixir||0)+1;got={kind:'item',type:'elixir'};}else{e.gold+=TOOLS.elixir.sell;got={kind:'gold',amount:TOOLS.elixir.sell,type:'elixir'};}}
  else{e.gear.push({id:`g${e.next++}`,type:f.reward,star:1,exp:0});got={kind:'treasure',type:f.reward};}}
 if(!s.practice)s.campaign.economy=structuredClone(s.economy);
 s.feat={missionId:s.missionId,...got};s.log.push(`숨은 전과 달성 · ${got.kind==='gold'?`가방이 가득해 엘릭서 대신 ${got.amount} Gold`:(GEAR[got.type]||TOOLS[got.type]).name}`);return got;}
// ---------- supply carriers ----------
export function markCarrier(s){const sp=SUPPLY[s.missionId];if(!sp)return;const u=s.units.find(u=>u.id===sp[0]&&u.team==='enemy');if(u)u.carrier=sp[1];}
export function dropSupply(s,victim){if(!victim?.carrier||victim.hp>0)return;const tool=victim.carrier;delete victim.carrier;const e=s.economy;
 if(Object.values(e.items).reduce((a,b)=>a+b,0)<8){e.items[tool]=(e.items[tool]||0)+1;s.feedback.push({type:'drop',id:victim.id,text:`보급 · ${TOOLS[tool].name}`});s.log.push(`보급병이 ${TOOLS[tool].name}을(를) 떨어뜨렸습니다. 가방에 넣었습니다 (승리하면 그대로 남습니다).`);}
 else s.log.push(`보급병이 ${TOOLS[tool].name}을(를) 떨어뜨렸지만 가방이 가득 찼습니다.`);}
// ---------- cut-ins ----------
export function cutIn(s,u,kind){if(u?.team!=='ally'||!CUTIN[u.id]||s.feedback.some(e=>e.type==='cutin'))return;s.feedback.unshift({type:'cutin',id:u.id,kind,text:CUTIN[u.id][kind]});}
