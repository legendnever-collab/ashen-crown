import {MAP,TERRAIN,WIDTH,HEIGHT,BALANCE,HEROES} from '../data/game-data.js';
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
export function movement(s,u,ignore=false){
 const start=key(u.x,u.y), costs=new Map([[start,0]]),prev=new Map(),queue=[{x:u.x,y:u.y,c:0}];
 const allowance=u.mov+(u.shadowBonus||0);
 while(queue.length){queue.sort((a,b)=>a.c-b.c);const p=queue.shift();if(p.c!==costs.get(key(p.x,p.y)))continue;
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;
   const occupant=at(s,x,y);if(!ignore&&occupant&&occupant.id!==u.id)continue;
   const c=p.c+(u.id==='kai'&&missionOf(s).map[y][x]==='f'?1:t.cost),k=key(x,y);
   if(c<=allowance&&c<(costs.get(k)??Infinity)){costs.set(k,c);prev.set(k,key(p.x,p.y));queue.push({x,y,c});}
  }
 }
 return {costs,prev};
}
export function pathTo(s,u,x,y){const {costs,prev}=movement(s,u);let k=key(x,y);if(!costs.has(k))return null;const path=[];while(k){const [px,py]=k.split(',').map(Number);path.unshift({x:px,y:py});k=prev.get(k);}return path;}
export function skillCost(u){const h=HEROES.find(h=>h.id===u.id);return (h?.cost||0)+(u.id==='lia'&&u.hp<=u.maxHP/2?1:0);}
export function rangeFor(u,mode='attack'){return mode==='skill'&&u.id==='lia'?[1,3]:mode==='skill'&&u.id==='sain'?[0,2]:mode==='skill'&&u.id==='eric'?[1,1]:u.range;}
export function validTarget(s,u,t,mode='attack'){
 if(!u||!t||!alive(u)||!alive(t))return false;
 const d=distance(u,t);if(mode==='capture')return s.missionId===2&&t.id==='boss'&&t.team==='enemy'&&t.hp<=t.maxHP/2&&d===1;
 if(mode==='rescue')return t.team==='civilian'&&d===1;
 if(mode==='skill'&&(u.id==='eric'||u.id==='sain'))return t.team==='ally'&&d>=rangeFor(u,mode)[0]&&d<=rangeFor(u,mode)[1]&&(u.id!=='eric'||u.id!==t.id);
 const [min,max]=rangeFor(u,mode);return u.team!==t.team&&t.team!=='civilian'&&d>=min&&d<=max;
}
export function flank(s,u,t){return s.units.some(a=>a.team===u.team&&alive(a)&&a.id!==u.id&&distance(a,t)===1&&((u.x<t.x&&a.x>t.x)||(u.x>t.x&&a.x<t.x)||(u.y<t.y&&a.y>t.y)||(u.y>t.y&&a.y<t.y)));}
export function strikeStats(s,u,t,mode='attack'){
 const magic=mode==='skill'&&u.id==='lia',aim=mode==='skill'&&u.id==='elina',quick=mode==='skill'&&u.id==='kai';
 const defense=magic?t.res:t.def+terrainAt(t.x,t.y,s).defense;
 let dmg=Math.max(1,(magic?u.mag:u.atk)-defense+(aim?2:0)+(magic&&u.hp<=u.maxHP/2?4:0)+(quick&&flank(s,u,t)?6:0));
 if(t.id==='eric'&&t.hp<=t.maxHP*.3)dmg=Math.max(1,Math.floor(dmg*.85));
 const ground=missionOf(s).map[u.y][u.x];const hawk=u.id==='elina'&&(ground==='f'||ground==='v')?12:0;
 const hit=Math.max(55,Math.min(100,(magic?95:88)+(u.spd-t.spd)*2-terrainAt(t.x,t.y,s).evade+hawk+(aim?18:0)));
 const crit=magic?0:Math.min(18,Math.max(3,u.spd-t.spd+5));
 return {damage:dmg,hit,crit,magic,flank:quick&&flank(s,u,t)};
}
export function guardFor(s,u,t,mode){if(mode==='skill'&&u.id==='lia'||distance(u,t)!==1)return null;return s.units.find(g=>alive(g)&&g.team===t.team&&g.guardTarget===t.id&&distance(g,t)===1);}
export function forecast(s,u,t,mode='attack'){
 if(mode==='skill'&&u.id==='sain')return {heal:Math.min(t.maxHP-t.hp,12+u.mag),hit:100,damage:0,counter:0,after:Math.min(t.maxHP,t.hp+12+u.mag)};
 if(mode==='skill'&&u.id==='eric')return {guard:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='capture')return {capture:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='rescue')return {rescue:true,damage:0,hit:100,counter:0,after:t.hp};
 const guard=guardFor(s,u,t,mode),victim=guard||t,stats=strikeStats(s,u,victim,mode),canCounter=validTarget(s,victim,u,'attack')&&victim.hp>stats.damage;
 const counter=canCounter?strikeStats(s,victim,u).damage:0;
 return {...stats,counter,counterHit:canCounter?strikeStats(s,victim,u).hit:0,after:Math.max(0,victim.hp-stats.damage),guard:guard?.id,victim:victim.id};
}
export function awardXP(s,u,amount,reason){
 if(u.team!=='ally'||!amount)return;
 u.xp+=amount;u.earnedXP+=amount;u.highlights.push(reason);s.feedback.push({type:'xp',id:u.id,text:`+${amount} EXP`});
 while(u.xp>=BALANCE.xpLevel){u.xp-=BALANCE.xpLevel;u.level++;const g=HEROES.find(h=>h.id===u.id).growth;const changes={...g};for(const [stat,n] of Object.entries(g)){if(stat==='hp'){u.maxHP+=n;u.hp=Math.min(u.maxHP,u.hp+n);}else if(stat==='mp'){u.maxMP+=n;u.mp=Math.min(u.maxMP,u.mp+n);}else u[stat]+=n;}if(u.id==='eric'&&u.level>=5)u.appearanceTier=2;u.growthHistory.push({level:u.level,changes});s.feedback.push({type:'level',id:u.id,text:`LEVEL ${u.level}`,toHP:u.hp});s.log.push(`${u.name} → LV ${u.level}. 성장이 새로운 힘으로 이어집니다.`);}
}
export function discover(s,u,clue){if(!u.clues.includes(clue)){u.clues.push(clue);s.feedback.push({type:'potential',id:u.id,text:'POTENTIAL DISCOVERED'});s.log.push(`Potential Clue Discovered — ${clue} (1/3). 각성은 아직 해금되지 않았습니다.`);}}
