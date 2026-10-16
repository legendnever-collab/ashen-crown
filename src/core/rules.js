import {effectiveStats} from './economy.js';
import {MAP,TERRAIN,WIDTH,HEIGHT,BALANCE,HEROES,CLASS_MOVEMENT,HERO_CLASS,TERRAIN_COSTS} from '../data/game-data.js';
import {missionOf} from '../data/missions.js';
import {remember} from './narrative.js';
export const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export const key=(x,y)=>`${x},${y}`;
export const alive=u=>u.hp>0&&!u.rescued;
export const terrainAt=(x,y,s)=>TERRAIN[(s?missionOf(s).map:MAP)[y]?.[x]];
export const findUnit=(s,id)=>s.units.find(u=>u.id===id);
export const at=(s,x,y)=>s.units.find(u=>alive(u)&&u.x===x&&u.y===y);
export function nextRandom(state){const next=(Math.imul(state>>>0,1664525)+1013904223)>>>0;return {state:next,value:next/4294967296};}
export function roll(s){const r=nextRandom(s.rng);s.rng=r.state;return r.value;}
export function terrainCost(s,u,x,y){const type=missionOf(s).map[y]?.[x];if(!type||missionOf(s).layers.collision[y]?.[x]||!Number.isFinite(TERRAIN[type]?.cost))return Infinity;const profile=u.movementProfile||CLASS_MOVEMENT[HERO_CLASS[u.id]]?.profile||'infantry';return TERRAIN_COSTS[profile]?.[type]??TERRAIN[type].cost;}
export function movement(s,u,ignore=false){
 const start=key(u.x,u.y), costs=new Map([[start,0]]),prev=new Map(),queue=[{x:u.x,y:u.y,c:0}];
 const allowance=effectiveStats(s,u).mov+(u.shadowBonus||0);
 while(queue.length){queue.sort((a,b)=>a.c-b.c);const p=queue.shift();if(p.c!==costs.get(key(p.x,p.y)))continue;
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;
   const occupant=at(s,x,y);if(!ignore&&occupant&&occupant.id!==u.id&&occupant.team!==u.team)continue;
   const c=p.c+terrainCost(s,u,x,y),k=key(x,y);
   if(c<=allowance&&c<(costs.get(k)??Infinity)){costs.set(k,c);prev.set(k,key(p.x,p.y));queue.push({x,y,c});}
  }
 }
 if(!ignore)for(const p of [...costs.keys()]){const [x,y]=p.split(',').map(Number),occupant=at(s,x,y);if(occupant&&occupant.id!==u.id)costs.delete(p);}
 return {costs,prev};
}
export function pathTo(s,u,x,y){const {costs,prev}=movement(s,u);let k=key(x,y);if(!costs.has(k))return null;const path=[];while(k){const [px,py]=k.split(',').map(Number);path.unshift({x:px,y:py});k=prev.get(k);}return path;}
export function skillCost(u){const h=HEROES.find(h=>h.id===u.id);return (h?.cost||0)+(u.id==='lia'&&u.hp<=u.maxHP/2?1:0);}
export function rangeFor(u,mode='attack'){return mode==='skill'&&u.id==='lia'?[1,3]:mode==='skill'&&u.id==='sain'?[0,2]:mode==='skill'&&u.id==='eric'?[0,0]:u.range;}
export function validTarget(s,u,t,mode='attack'){
 if(!u||!t||!alive(u)||!alive(t))return false;
 const d=distance(u,t);if(t.team==='object')return mode==='search'&&u.team==='ally'&&d===1;if(mode==='search')return false;if(mode==='capture')return s.missionId===2&&t.id==='boss'&&t.team==='enemy'&&t.hp<=t.maxHP/2&&d===1;
 if(mode==='rescue')return t.team==='civilian'&&d===1;
 if(mode==='skill'&&u.id==='eric')return t.id===u.id;
 if(mode==='skill'&&u.id==='sain')return t.team==='ally'&&d>=rangeFor(u,mode)[0]&&d<=rangeFor(u,mode)[1];
 const [min,max]=rangeFor(u,mode);return u.team!==t.team&&t.team!=='civilian'&&d>=min&&d<=max;
}
export function flank(s,u,t){return s.units.some(a=>a.team===u.team&&alive(a)&&a.id!==u.id&&distance(a,t)===1&&((u.x<t.x&&a.x>t.x)||(u.x>t.x&&a.x<t.x)||(u.y<t.y&&a.y>t.y)||(u.y>t.y&&a.y<t.y)));}
export function strikeStats(s,u,t,mode='attack'){
 u=effectiveStats(s,u);t=effectiveStats(s,t);
 const magic=mode==='skill'&&u.id==='lia',aim=mode==='skill'&&u.id==='elina',quick=mode==='skill'&&u.id==='kai';
 const ground=terrainAt(t.x,t.y,s),defense=magic?t.res:t.def,burning=!!s.burning?.[key(t.x,t.y)];
 let raw=Math.max(1,(magic?u.mag:u.atk)-defense+(aim?2:0)+(magic&&u.hp<=u.maxHP/2?4:0)+(quick&&flank(s,u,t)?6:0));
 let dmg=Math.max(1,Math.round(magic?raw*(ground.fire??1):raw*(1-(ground.phys||0))));
 if(t.id==='eric'&&t.hp<=t.maxHP*.3)dmg=Math.max(1,Math.floor(dmg*.85));
 const standing=missionOf(s).map[u.y][u.x];const hawk=u.id==='elina'&&(standing==='f'||standing==='v')?12:0;
 const hit=Math.max(70,Math.min(100,(magic?100:97)+Math.round((u.spd-t.spd)*1.5)-(ground.evade||0)+hawk+(aim?18:0)+(u.hit||0)-(t.dodge||0)));
 const crit=magic?0:Math.min(12,Math.max(3,Math.round((u.spd-t.spd)/2)+5));
 return {damage:dmg,hit,crit,magic,fire:magic,terrainMul:magic?(ground.fire??1):1-(ground.phys||0),flank:quick&&flank(s,u,t),burning};
}
export function guardFor(s,u,t,mode){if(mode==='skill'&&u.id==='lia'||distance(u,t)!==1)return null;return s.units.find(g=>alive(g)&&g.team===t.team&&g.id!==t.id&&(g.guarding&&!g.guardUsed||g.guardTarget===t.id)&&distance(g,t)===1);}
export function forecast(s,u,t,mode='attack'){
 if(mode==='skill'&&u.id==='sain')return {heal:Math.min(t.maxHP-t.hp,12+effectiveStats(s,u).mag),hit:100,damage:0,counter:0,after:Math.min(t.maxHP,t.hp+12+effectiveStats(s,u).mag)};
 if(mode==='skill'&&u.id==='eric')return {guard:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='capture')return {capture:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='rescue')return {rescue:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='search')return {search:true,damage:0,hit:100,counter:0,after:t.hp};
 const guard=guardFor(s,u,t,mode),victim=guard||t,stats=strikeStats(s,u,victim,mode),canCounter=validTarget(s,victim,u,'attack')&&victim.hp>stats.damage;
 const counter=canCounter?strikeStats(s,victim,u).damage:0;
 return {...stats,counter,counterHit:canCounter?strikeStats(s,victim,u).hit:0,after:Math.max(0,victim.hp-stats.damage),guard:guard?.id,victim:victim.id};
}
export function awardXP(s,u,amount,reason){
 if(u.team!=='ally'||!amount)return;
 u.xp+=amount;u.earnedXP+=amount;u.highlights.push(reason);s.feedback.push({type:'xp',id:u.id,text:`+${amount} EXP`});
 let leveled=false;while(u.xp>=BALANCE.xpLevel){leveled=true;u.xp-=BALANCE.xpLevel;u.level++;const g=HEROES.find(h=>h.id===u.id).growth;const changes={...g};for(const [stat,n] of Object.entries(g)){if(stat==='hp'){u.maxHP+=n;u.hp=Math.min(u.maxHP,u.hp+n);}else if(stat==='mp'){u.maxMP+=n;u.mp=Math.min(u.maxMP,u.mp+n);}else u[stat]+=n;}if(u.id==='eric'&&u.level>=5)u.appearanceTier=2;u.growthHistory.push({level:u.level,changes});s.feedback.push({type:'level',id:u.id,text:`LEVEL ${u.level}`,toHP:u.hp});s.log.push(`${u.name} → LV ${u.level}. 성장이 새로운 힘으로 이어집니다.`);}
 if(leveled){u.hp=u.maxHP;u.mp=u.maxMP;s.log.push(`${u.name}: 레벨업으로 HP/MP 전부 회복.`);}
}
export function discover(s,u,clue){if(!u.clues.includes(clue)){u.clues.push(clue);s.feedback.push({type:'potential',id:u.id,text:'POTENTIAL DISCOVERED'});s.log.push(`Potential Clue Discovered — ${clue} (1/3). 각성은 아직 해금되지 않았습니다.`);}}
// One-line tactical summary of a tile, shown when the player taps terrain.
export function terrainSummary(s,x,y,u=null){const type=missionOf(s).map[y]?.[x],t=TERRAIN[type];if(!t)return '전장 밖';
 if(!Number.isFinite(t.cost))return `${t.ko} · 통행 불가`;
 const costs=['infantry','rogue','cavalry'].map(p=>TERRAIN_COSTS[p]?.[type]??t.cost),cost=c=>Number.isFinite(c)?c:'불가';
 const move=costs.every(c=>c===costs[0])?`이동 ${cost(costs[0])}`:`이동 보병 ${cost(costs[0])} · 도적 ${cost(costs[1])} · 기병 ${cost(costs[2])}`;
 const parts=[t.ko,move];if(t.phys)parts.push(`일반공격 ${Math.round(t.phys*100)}%↓`);if(t.evade)parts.push(`회피 ${Math.abs(t.evade)}%${t.evade>0?'↑':'↓'}`);
 if(t.fire&&t.fire!==1)parts.push(`화공 ${Math.round(Math.abs(t.fire-1)*100)}%${t.fire>1?'↑':'↓'}`);if(t.hpRecovery)parts.push(`턴 시작 HP ${t.hpRecovery*100}% 회복`);
 if(s.burning?.[key(x,y)])parts.push('🔥 불타는 중');if(u&&u.team==='ally'){const c=terrainCost(s,u,x,y);parts.push(`${u.name}: ${Number.isFinite(c)?`비용 ${c}`:'진입 불가'}`);}
 return parts.join(' · ');}
