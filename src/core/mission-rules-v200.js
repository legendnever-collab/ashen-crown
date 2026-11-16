// v2.0.0 전장 개편 (D-115, REFORM_DESIGN §2.4): ACT I M01–M03 on big maps move from the old hard-wired branches of
// core/game.js into rule objects. Objectives and story are the same; the directions change: M01 raiders from the north
// road and the east road (two houses to reach), M02 the runner flees to the east edge, M03 the broken bridge forces a
// U-turn — east along the south bank, across the ford, back west to the north-west exit. M04–M06 keep their rules
// (core/mission-rules.js), reading the new map data (M06's safe ground beyond the south-west gate: mission.safe).
import {missionOf} from '../data/missions.js';
import {alive,at,distance,findUnit,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag} from './narrative.js';
import {act2Waves} from './mission-rules-v06.js';
export const inSafe2000=(s,p)=>{const r=missionOf(s)?.safe;return !!r&&!!p&&p.x>=r[0]&&p.y>=r[1]&&p.x<=r[2]&&p.y<=r[3];};
const civiliansOf=s=>s.units.filter(u=>u.team==='civilian');
const left=s=>Math.max(0,(missionOf(s).turnLimit||0)+1-s.turn);
const validWaves=m=>!!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0);
// M01 다방향 방어
const M1V={
 init(s){s.missionState={waves:[]};},
 clearLabel:'잿빛 마을 방어',
 validState:validWaves,
 status(s){const c=civiliansOf(s),boss=findUnit(s,'boss');return `주민 구출 ${c.filter(u=>u.rescued).length}/${c.length} · 가르 ${boss&&alive(boss)?'건재':'격파'} · ${left(s)}턴 남음`;},
 optional(s){return '주민 2명 무사';},
 onTurnStart(s){act2Waves(s);},
 beforeEnemyPhase(){},
 checkOutcome(s,finish){const civ=civiliansOf(s),boss=findUnit(s,'boss');
  if(civ.some(c=>c.hp<=0))return finish(s,'defeat','주민을 잃어 필수 구출 목표를 달성할 수 없습니다.');
  if(civ.every(c=>c.rescued)&&boss&&boss.hp<=0)return finish(s,'victory','두 주민이 무사히 탈출했고 가르를 격파했습니다.');
  if(s.turn>missionOf(s).turnLimit)return finish(s,'defeat',`제한 ${missionOf(s).turnLimit}턴 안에 구출과 격파를 마치지 못했습니다.`);},
 beforeCommit(){},afterVictory(){}
};
// M02 추격 → : the runner makes for the east edge along the road
const M2V={
 init(s){s.missionState={waves:[]};},
 clearLabel:'숲길 추격',
 validState:validWaves,
 status(s){const b=findUnit(s,'boss');return `도주 대장 ${b?.rescued?'생포':b&&alive(b)?`출구까지 ${Math.max(0,missionOf(s).escapeX-b.x)}칸`:'격파'} · ${left(s)}턴 남음`;},
 optional(s){return s.campaign.flags.mission_02_prisoner_captured?'포로 확보':'추격';},
 onTurnStart(){},beforeEnemyPhase(){},
 planEnemy(s,u,reachable){if(u.id!=='boss')return null;const X=missionOf(s).escapeX;let best=null;for(const [p,c] of reachable){const [x,y]=p.split(',').map(Number);if(at(s,x,y)&&!(x===u.x&&y===u.y))continue;const road=terrainAt(x,y,s)?.name==='Road'?.5:0,sc=x+road-c*.01;if(!best||sc>best.sc)best={x,y,sc};}return best?{x:best.x,y:best.y,target:null,reason:'동쪽 출구로 도주'}:{x:u.x,y:u.y,target:null,reason:'포위됨'};},
 checkOutcome(s,finish){const boss=findUnit(s,'boss');if(!boss)return;if(boss.rescued||boss.hp<=0||boss.x>=missionOf(s).escapeX||s.turn>missionOf(s).turnLimit||s.units.filter(u=>u.team==='enemy').every(u=>!alive(u)))finish(s,'victory',boss.rescued?'포로와 보급로 진술 확보.':'추격 종료. 상자의 흔적은 남았지만 진술은 얻지 못했습니다.');},
 beforeCommit(){},afterVictory(){}
};
// M03 유턴: civilians beside a hero follow the open route to the exit, two tiles a turn
function routeToSafe(s,c){const start=`${c.x},${c.y}`,prev=new Map([[start,null]]),q=[{x:c.x,y:c.y}];let goal=null;
 while(q.length){const p=q.shift();if(inSafe2000(s,p)&&`${p.x},${p.y}`!==start){goal=p;break;}
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;if(prev.has(k))continue;const t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;const o=at(s,x,y);if(o&&o.team!=='ally')continue;prev.set(k,`${p.x},${p.y}`);q.push({x,y});}}
 if(!goal)return [];const path=[];let k=`${goal.x},${goal.y}`;while(k&&k!==start){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=prev.get(k);}return path;}
function escort3(s){for(const c of civiliansOf(s).filter(u=>alive(u)&&!u.rescued)){if(!s.units.some(u=>u.team==='ally'&&alive(u)&&distance(u,c)===1))continue;const path=routeToSafe(s,c);let dest=-1;for(let i=0;i<Math.min(2,path.length);i++)if(!at(s,path[i].x,path[i].y))dest=i;if(dest<0)continue;
 const from={x:c.x,y:c.y};c.x=path[dest].x;c.y=path[dest].y;s.feedback.push({type:'move',id:c.id,path:[from,...path.slice(0,dest+1)]});s.log.push(`${c.name} 호위 이동.`);
 if(inSafe2000(s,c)){c.rescued=true;setStoryFlag(s,'mission_03_escorted');s.feedback.push({type:'rescue',id:c.id,text:'SAFE'});}}}
const M3V={
 init(s){s.missionState={waves:[]};},
 clearLabel:'무너진 다리 · 철수',
 validState:validWaves,
 status(s){const c=civiliansOf(s),h=s.units.filter(u=>u.team==='ally'&&alive(u)&&!u.benched);return `구조 ${c.filter(u=>u.rescued).length}/${c.length} · 출구 도착 ${h.filter(u=>inSafe2000(s,u)).length}/${h.length} · ${left(s)}턴 남음`;},
 optional(s){return `주민 ${s.campaign.flags.mission_03_refugees_saved??0}/2 구조`;},
 onTurnStart(s){act2Waves(s);escort3(s);},
 beforeEnemyPhase(){},
 checkOutcome(s,finish){const civ=civiliansOf(s),saved=civ.filter(c=>c.rescued).length,heroes=s.units.filter(u=>u.team==='ally'&&!u.benched);
  if(s.turn>missionOf(s).turnLimit)return finish(s,'defeat',`제한 ${missionOf(s).turnLimit}턴 안에 철수하지 못했습니다.`);
  if(saved>0&&heroes.filter(alive).every(u=>inSafe2000(s,u))){setStoryFlag(s,'mission_03_bridge_held');setStoryFlag(s,'mission_03_refugees_saved',saved);return finish(s,'victory',`${saved}/2 주민 구조, 생존 장수 철수 완료.`);}
  if(civ.every(c=>c.hp<=0))return finish(s,'defeat','구조와 안전한 철수를 제한 턴 안에 완료하지 못했습니다.');},
 beforeCommit(){},afterVictory(){}
};
export const ACT1_V200_RULES={1:M1V,2:M2V,3:M3V};
