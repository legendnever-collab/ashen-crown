// v2.1 주점 「인재 확보」 (D-118, TAVERN_WORLD_DESIGN §4, §7): every town's tavern lists the hires who wait there. A hire is
// paid once (economy op 'hire') and stays to the ending: they join at the legion's average level −1 (at least 1) and
// promote at once to that level's tier. The stonewell tavern takes in a wanderer from the ash village after each story win.
import {MERCS,WANDERERS,TAVERN_HUBS,HIRE_LINES} from '../data/mercs-v210.js';
import {heroDef} from '../data/game-data.js';
import {joinRoster} from './roster.js';
import {transact,ensureEconomy} from './economy.js';
import {autoPromoteOfficers} from './progression.js';
import {syncFrontier} from './frontier.js';

export const townOfHub=hub=>Object.entries(TAVERN_HUBS).find(([,hubs])=>hubs.includes(hub))?.[0]||null;
const storyWins=c=>(c?.completed||[]).filter(id=>id<=30);
// The wanderers who have moved to stonewell: one per story win after M04 (the village opens with M04), never one hired.
export function wanderersAt(c){const after=storyWins(c).filter(id=>id>=4).length,left=WANDERERS.filter(id=>!c?.roster?.includes(id));return left.slice(0,Math.max(0,after));}
// The hires waiting in this town's tavern (not yet in the legion).
export function mercsAt(s,town){const c=s.campaign,done=new Set(storyWins(c)),roster=c?.roster||[];
 const here=Object.entries(MERCS).filter(([id,m])=>m.town===town&&(m.from===0||done.has(m.from))&&!roster.includes(id)).map(([id])=>id);
 if(town==='stonewell')for(const id of wanderersAt(c))if(!here.includes(id))here.push(id);
 return here.map(id=>({id,...MERCS[id],price:MERCS[id].price,name:heroDef(id)?.name||id,wandering:town==='stonewell'&&MERCS[id].town!=='stonewell'}));}
export const inTavern=s=>s?.screen==='exploration'&&!s.practice&&!s.narrative?.active&&s.frontier?.interior==='tavern';
export const tavernTown=s=>inTavern(s)?townOfHub(s.frontier.hub):null;
// The level a hire joins at: the legion's average level −1 (at least 1).
export function hireLevel(c){const levels=(c?.heroes||[]).map(h=>h?.level||1);return Math.max(1,Math.round(levels.length?levels.reduce((a,b)=>a+b,0)/levels.length:1)-1);}
export function canHire(s,id){const town=tavernTown(s);if(!town)return {ok:false,error:'주점에서 고용할 수 있습니다.'};const m=mercsAt(s,town).find(x=>x.id===id);if(!m)return {ok:false,error:'이 주점에 없는 인재입니다.'};
 if(!Array.isArray(s.campaign.heroes))return {ok:false,error:'첫 전투를 마친 뒤 고용할 수 있습니다.'};
 if(ensureEconomy(s).gold<m.price)return {ok:false,error:`Gold가 부족합니다 (${m.price} G).`};return {ok:true,price:m.price};}
// Pays and brings the hire into the legion. Returns {ok, line} or {ok:false,error}.
export function hire(s,id){const can=canHire(s,id);if(!can.ok)return can;const e=ensureEconomy(s);
 const r=transact(s,{op:'hire',id,price:can.price,token:`tx:${e.nonce}`});if(!r.ok)return r;
 const c=s.campaign,level=hireLevel(c);if(!joinRoster(s,id,level))return {ok:false,error:'이미 군단에 있습니다.'};s.stageStart=null; /* the legion changed: the won battle's start record no longer applies (as when Thea joins) */
 c.hires={...(c.hires||{}),[id]:Math.max(0,...storyWins(c))};autoPromoteOfficers(s);
 const rec=c.heroes?.find(h=>h.id===id),u=s.units?.find(u=>u.id===id);if(rec&&u)Object.assign(u,{...structuredClone(rec),x:u.x,y:u.y,benched:true});
 s.log.push(`${heroDef(id)?.name||id}을(를) 고용했습니다. (LV ${level})`);syncFrontier(s);return {ok:true,line:HIRE_LINES[id]||'잘 부탁하오.'};}
