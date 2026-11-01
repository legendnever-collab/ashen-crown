// v0.8.0 status effects (D-073 Q3; numbers PROPOSED): poison, confusion, bind, silence.
// u.status = {poison:n, confuse:n, bind:n, silence:n} counts the unit's own phases left. Poison hurts at the start of
// each of them; every count drops at the end of the unit's side phase (player phase for the legion's heroes, enemy
// phase for enemies and allied troops). Bosses and commanders: half the chance, one phase at most.
import {alive,roll} from './rules.js';
export const STATUS=['poison','confuse','bind','silence'];
export const STATUS_KO={poison:'독',confuse:'혼란',bind:'속박',silence:'침묵'};
export const STATUS_TURNS={poison:3,confuse:1,bind:1,silence:2};
export const isCommander=u=>!!u&&(u.id==='boss'||u.id==='boss2'||['captain','lion'].includes(u.kind)||!!u.leader||!!u.commander);
export const hasStatus=(u,k)=>!!u?.status?.[k];
export const immune=(s,u)=>u?.immuneUntil!=null&&s.turn<=u.immuneUntil;
// Chance in percent that a status lands on this target (0 when immune).
export function statusChance(s,t,k,base){if(!t||!alive(t)||t.team==='object'||t.team==='civilian'||immune(s,t))return 0;let c=base;if(isCommander(t))c=Math.floor(c/2);if(t.statusResist)c=Math.round(c*(1-t.statusResist));return Math.max(0,Math.min(100,c));}
// Rolls and applies; returns true when it landed. `turns` defaults to the status length.
export function inflict(s,t,k,base,turns=STATUS_TURNS[k]){const c=statusChance(s,t,k,base);if(!c)return false;if(c<100&&roll(s)*100>=c){s.feedback.push({type:'miss',id:t.id,text:`${STATUS_KO[k]} 저항`});return false;}
 const n=isCommander(t)?1:turns;t.status??={};t.status[k]=Math.max(t.status[k]||0,n);s.feedback.push({type:'status',id:t.id,status:k,text:STATUS_KO[k]});s.log.push(`${t.name}: [${STATUS_KO[k]}] ${n}턴.`);return true;}
export function cure(s,t,kinds=STATUS){if(!t?.status)return 0;let n=0;for(const k of kinds)if(t.status[k]){delete t.status[k];n++;}if(!Object.keys(t.status).length)delete t.status;if(n){s.feedback.push({type:'heal',id:t.id,text:'정화'});}return n;}
const sideTeams=side=>side==='legion'?['ally']:['enemy','allied'];
// Start of a side's phase: poison bites (10% of max HP, 3–8, never below 1).
export function poisonTick(s,side){for(const u of s.units.filter(u=>sideTeams(side).includes(u.team)&&alive(u)&&u.status?.poison)){const n=Math.min(u.hp-1,Math.max(3,Math.min(8,Math.floor(u.maxHP*.1))));if(n<=0)continue;const fromHP=u.hp;u.hp-=n;s.feedback.push({type:'hit',id:u.id,text:`독 −${n}`,fromHP,toHP:u.hp,damage:n});s.log.push(`${u.name}: 독으로 ${n} 피해.`);}}
// End of a side's phase: every count drops by one.
export function statusAge(s,side){for(const u of s.units.filter(u=>sideTeams(side).includes(u.team)&&u.status)){for(const k of Object.keys(u.status)){u.status[k]--;if(u.status[k]<=0)delete u.status[k];}if(!Object.keys(u.status).length)delete u.status;}}
export function validStatus(st){return st==null||typeof st==='object'&&!Array.isArray(st)&&Object.entries(st).every(([k,n])=>STATUS.includes(k)&&Number.isInteger(n)&&n>=1&&n<=3);}
