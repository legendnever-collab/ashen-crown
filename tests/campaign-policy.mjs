import {missionOf} from '../src/data/missions.js';
import {findUnit,alive,movement,validTarget,forecast,distance,terrainAt,terrainCost} from '../src/core/rules.js';
import {moveUnit,performAction,canAct,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';
import {openStory,advanceStory} from '../src/core/narrative.js';
// v0.4 missions: path distance (walls respected, units ignored) toward open evidence, then the boss.
function missionGoals(s){if(s.missionId===6){const st=s.missionState,refs=s.units.filter(u=>u.team==='civilian'&&alive(u));
 if(st.phase===3&&refs.length&&!s.units.some(u=>u.team==='civilian'&&u.rescued))return refs;
 if(st.phase===3){const boss=s.units.find(t=>t.id==='boss'&&alive(t));return boss?[boss]:[{x:7,y:1},{x:8,y:0},{x:9,y:0},{x:10,y:1}];}const stones=s.units.filter(o=>o.kind==='sealstone'&&!o.rescued&&!o.locked);return stones.length?[...stones,...refs]:refs.length?refs:[{x:8,y:1}];}
 const open=s.units.filter(o=>o.team==='object'&&o.kind==='evidence'&&alive(o));return open.length?open:s.units.filter(t=>t.id==='boss'&&alive(t));}
function fieldDistance(s,u,goals){const d=new Map(),q=[];for(const g of goals)for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=g.x+dx,y=g.y+dy;if(Number.isFinite(terrainCost(s,u,x,y))){d.set(`${x},${y}`,0);q.push({x,y,c:0});}}while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();if(p.c!==d.get(`${p.x},${p.y}`))continue;for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,step=terrainCost(s,u,x,y),k=`${x},${y}`;if(!Number.isFinite(step))continue;const c=p.c+step;if(c<(d.get(k)??Infinity)){d.set(k,c);q.push({x,y,c});}}}return d;}
export function drain(s){openStory(s);for(let i=0;s.narrative.active&&i<100;i++)advanceStory(s);}
export function campaignAction(s,u,capture=true){
 let best=null;const exitDistance=new Map();if(s.missionId===3){const q=[];for(let y=0;y<=2;y++)for(let x=0;x<14;x++)if(Number.isFinite(terrainCost(s,u,x,y))){exitDistance.set(`${x},${y}`,0);q.push({x,y,c:0});}while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,c=p.c+terrainCost(s,u,p.x,p.y),k=`${x},${y}`;if(Number.isFinite(terrainCost(s,u,x,y))&&c<(exitDistance.get(k)??Infinity)){exitDistance.set(k,c);q.push({x,y,c});}}}}const goalDistance=s.missionId>=4?fieldDistance(s,u,missionGoals(s)):null;const cells=u.moved?new Map([[`${u.x},${u.y}`,0]]):movement(s,u).costs;
 const civ=s.units.filter(t=>t.team==='civilian'&&alive(t));
 for(const [p,c]of cells){const [x,y]=p.split(',').map(Number),a={...u,x,y};
  for(const t of s.units.filter(alive))for(const mode of s.missionId>=4?['search','capture','rescue','skill','attack']:['capture','rescue','skill','attack']){if(!validTarget(s,a,t,mode)||mode==='capture'&&!capture||mode==='skill'&&a.mp<(a.cost+(a.id==='lia'&&a.hp<=a.maxHP/2?1:0)))continue;const f=forecast(s,a,t,mode);let score=-1000;
  if(mode==='search')score=t.kind==='sealstone'?1400:t.kind==='lever'?1100:t.evidence==='ledger'?1500:1300;
  else if(mode==='capture')score=2000;
  else if(mode==='rescue')score=1000;
  else if(f.heal!==undefined)score=t.team==='civilian'&&t.hp<=t.maxHP/2?900:f.heal>=10?80+f.heal:0;
  else if(f.guard===true)score=0;
  else{score=f.damage*f.hit/100*3+(f.after===0?50:0)-f.counter;
   if(s.missionId===2&&t.id==='boss'){score+=100;if(capture&&f.after===0)score=-500;}
   if(s.missionId===3){if(civ.length)score+=20;else score+=t.y<u.y?100:10;}
   if(s.missionId===6){if(t.id==='boss'&&s.missionState.phase===3)score+=60;if(/^k\d/.test(t.id))score+=25;if(/^r\d/.test(t.id))score+=30;}
   if(s.missionId===4){if(t.burns&&s.turn<missionOf(s).burnTurn&&s.units.some(o=>o.evidence===t.burns&&alive(o)))score+=80;if(t.id==='boss')score+=60;}}
  score-=c*.5;if(!best||score>best.score)best={id:u.id,x,y,mode,target:t.id,score};}
  let score;
  if(goalDistance)score=200-(goalDistance.get(`${x},${y}`)??100)*12-c*.1;
  else if(s.missionId===3&&!civ.length)score=200-(exitDistance.get(`${x},${y}`)??100)*15-y*3-c*.1;
  else{const targets=civ.length?civ:s.units.filter(t=>t.id==='boss'&&alive(t));const near=targets.reduce((n,t)=>Math.min(n,distance(a,t)),100);score=80-near*8-c*.1;}
  if(!best||score>best.score)best={id:u.id,x,y,mode:'wait',score};
 }
 return best||{id:u.id,x:u.x,y:u.y,mode:'wait'};
}
export function playCampaignBattle(s,capture=true){const trace=[];let steps=0;drain(s);while(!s.outcome&&steps++<150){for(const id of ['kai','lia','elina','sain','eric']){const u=findUnit(s,id);if(!canAct(s,u))continue;const a=campaignAction(s,u,capture);if(a.x!==u.x||a.y!==u.y){if(!moveUnit(s,id,a.x,a.y))throw Error('illegal move');trace.push({type:'move',id,x:a.x,y:a.y});}const action=performAction(s,id,a.mode,a.target);if(!action.ok)throw Error(action.error);trace.push({type:'action',id,mode:a.mode,target:a.target});drain(s);if(s.outcome)break;}if(!s.outcome){beginEnemyPhase(s);trace.push({type:'phase'});while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);}}return {outcome:s.outcome,turn:s.turn,trace,saved:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,captured:!!s.campaign.flags.mission_02_prisoner_captured};}
