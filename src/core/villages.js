// v2.1 작은 마을과 의뢰 (D-118, TAVERN_WORLD_DESIGN §7): the request board of a small village. Battle requests are short
// skirmishes (missions 120–124) fought by the sortie the legion picks; a win pays the reward into the legion's purse and,
// for the besieged spearknight, brings Adel into the legion. Requests without a battle trade items or gold at the board.
// The bounty opens again after every story mission won.
import {REQUESTS,VILLAGES,requestVillages} from '../data/villages-v210.js';
import {MISSIONS} from '../data/missions.js';
import {newGame,startBattle,deployLimit} from './game.js';
import {findUnit} from './rules.js';
import {transact,ensureEconomy,itemCount,CARRY_CAPACITY} from './economy.js';
import {joinRoster} from './roster.js';
import {hireLevel} from './tavern.js';
import {autoPromoteOfficers} from './progression.js';
import {enqueueStory} from './narrative.js';

const winsOf=c=>(c?.completed||[]).filter(id=>id<=30);
export const villageOpen=(c,v)=>!!VILLAGES[v]&&winsOf(c).includes(VILLAGES[v].opens);
export const atVillage=s=>s?.screen==='exploration'&&!s.practice&&!s.narrative?.active&&!s.frontier?.interior&&!!VILLAGES[s.frontier?.hub]?s.frontier.hub:null;
// The record key a request leaves when done (a bounty: one per story win count).
export const requestKey=(c,id)=>REQUESTS[id]?.repeat?`${id}:${winsOf(c).length}`:id;
export function requestState(s,id){const r=REQUESTS[id],c=s.campaign,e=ensureEconomy(s);if(!r)return null;
 const done=(e.requests||[]).includes(requestKey(c,id)),rescued=r.rescue&&c.roster?.includes(r.rescue);
 return {id,...r,done:done||!!rescued,again:r.repeat&&!done&&(e.requests||[]).some(k=>k.startsWith(`${id}:`))};}
export function requestsAt(s,v){return Object.keys(REQUESTS).filter(id=>requestVillages(REQUESTS[id]).includes(v)).map(id=>requestState(s,id));}
export function canStartRequest(s,id){const v=atVillage(s),r=REQUESTS[id];if(!v||!r||r.kind!=='battle')return false;if(!requestVillages(r).includes(v))return false;
 return Array.isArray(s.campaign?.heroes)&&!requestState(s,id).done;}
// A request without a battle: hand over items or gold at the board (economy op 'request-pay').
export function payRequest(s,id){const v=atVillage(s),r=REQUESTS[id];if(!v||!r||r.kind!=='pay'||!requestVillages(r).includes(v))return {ok:false,error:'이 마을의 의뢰가 아닙니다.'};
 const e=ensureEconomy(s);return transact(s,{op:'request-pay',id,token:`tx:${e.nonce}`});}
// Builds the request battle with the chosen sortie (ids, Erik first if there is room). Returns the battle state or null.
export function startRequest(camp,id,sortie=[]){if(!canStartRequest(camp,id))return null;const r=REQUESTS[id],mid=r.mission,m=MISSIONS[mid];
 const count=(ensureEconomy(camp).requests||[]).length+(camp.campaign.results?.length||0);
 const s=newGame((camp.initialSeed+7919*(count+11)+mid)>>>0,structuredClone(camp.campaign),mid);
 s.skirmish={kind:'request',request:id,village:camp.frontier.hub,returnMission:camp.missionId,returnSeed:camp.initialSeed,returnOutcome:camp.outcome??null,returnReason:camp.reason??null,frontier:structuredClone(camp.frontier)};
 s.economy=structuredClone(camp.campaign.economy||camp.economy);
 const allies=s.units.filter(u=>u.team==='ally'),chosen=(sortie.length?sortie:allies.map(u=>u.id)).filter(pid=>allies.some(u=>u.id===pid)).slice(0,deployLimit(s));
 const spots=m.deployments.recommended;let i=0;for(const u of allies){if(chosen.includes(u.id)){delete u.benched;const p=spots[i++];if(p)[u.x,u.y]=p;}else u.benched=true;}
 s.screen='deployment';startBattle(s);enqueueStory(s,`request:${id}:intro`);return s;}
// After the battle (called by skirmish.returnToCamp on the rebuilt camp `c`): pay the reward, bring the rescued hero.
export function settleRequest(c,battle){const sk=battle.skirmish;if(sk?.kind!=='request'||battle.outcome!=='victory')return null;const r=REQUESTS[sk.request];if(!r)return null;
 const e=c.campaign.economy,key=requestKey(c.campaign,sk.request);if((e.requests||[]).includes(key))return null;
 e.requests=[...(e.requests||[]),key];e.gold+=r.reward?.gold||0;for(const [item,n] of Object.entries(r.reward?.items||{}))for(let k=0;k<n;k++){if(itemCount(e)<CARRY_CAPACITY)e.items[item]=(e.items[item]||0)+1;else e.gold+=20;}
 let joined=null;if(r.rescue&&!c.campaign.roster?.includes(r.rescue)){if(joinRoster(c,r.rescue,hireLevel(c.campaign)+1)){joined=r.rescue;c.campaign.hires={...(c.campaign.hires||{}),[r.rescue]:Math.max(0,...winsOf(c.campaign))};autoPromoteOfficers(c);}}
 c.economy=structuredClone(e);return {gold:r.reward?.gold||0,joined};}
export const villageName=v=>VILLAGES[v]?.name||v;
