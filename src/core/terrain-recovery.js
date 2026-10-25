import {terrainAt,alive} from './rules.js';
export function recoveryAmount(current,max,ratio=0){return ratio>0&&current<max?Math.min(max-current,Math.max(1,Math.floor(max*ratio))):0;}
export function recoveryValue(s,u,x=u.x,y=u.y){const t=terrainAt(x,y,s);return recoveryAmount(u.hp,u.maxHP,t?.hpRecovery)+recoveryAmount(u.mp,u.maxMP,t?.mpRecovery);}
export function applyTerrainRecovery(s){
 if(s.screen!=='battle')return [];
 const teams=s.phase==='player'?['ally']:['enemy','allied'],marker=`${s.turn}:${s.phase}`,events=[];
 for(const u of s.units.filter(u=>teams.includes(u.team)&&alive(u))){if(u.recoveryPhase===marker)continue;u.recoveryPhase=marker;const t=terrainAt(u.x,u.y,s);for(const [stat,max,ratio]of [['hp',u.maxHP,t.hpRecovery],['mp',u.maxMP,t.mpRecovery]]){const n=recoveryAmount(u[stat],max,ratio);if(!n)continue;u[stat]+=n;const text=`${stat.toUpperCase()} +${n}`;events.push({type:'heal',id:u.id,text,resource:stat,...(stat==='hp'?{toHP:u.hp}:{})});s.log.push(`${u.name} · ${t.name} · ${text}`);}}
 s.feedback.push(...events);return events;
}
