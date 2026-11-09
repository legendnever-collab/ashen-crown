// v0.10.0 ACT IV 「잿빛 왕관」 part 1 「연합」 mission hooks (D-099/D-100, docs/v0.10.0/ACT4_DESIGN.md §4.1; rules and numbers PROPOSED).
// M01–M22 never reach this module.
// M23 Toward the End of the War: the alliance camp at night. The three leaders fight beside the legion as allied units that take
// orders; three council tents fall to an enemy that ends two enemy phases in a row beside them. A fallen leader costs their
// banner's trust, never the battle.
// M24 The Last Border: the ash tide comes from the north a row a turn; eight refugees walk to the gate; the player closes it.
import {missionOf} from '../data/missions.js';
import {alive,at,distance,findUnit,hostile,strikeStats,key,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {adjustTrust,FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';

function strike100(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const foes100=(s,u)=>s.units.filter(t=>alive(t)&&t.team!=='civilian'&&hostile(s,u,t));
const within100=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));
const nearest100=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0];
const goalOf100=t=>t?{x:t.x,y:t.y,name:t.name}:null;
const idList=(v,ok,max=12)=>Array.isArray(v)&&v.length<=max&&v.every(ok)&&new Set(v).size===v.length;

// ---------- M23 Toward the End of the War ----------
export const TENTS23=['ti','tf','tl'];
export const LEADERS23={cassian:'iron',leonora:'free',lucien:'flame'};
const TENT_OF={iron:'ti',free:'tf',flame:'tl'};
export const tents23=s=>TENTS23.map(id=>findUnit(s,id)).filter(Boolean);
export const standingTents23=s=>tents23(s).filter(t=>!t.inert);
// The enemies that stand beside a tent now (a tent is taken by an enemy that ends two enemy phases in a row beside it).
export const besiegers23=(s,t)=>s.units.filter(u=>u.team==='enemy'&&alive(u)&&distance(u,t)===1);
export const M23={
 init(s){s.missionState={waves:[],siege:Object.fromEntries(TENTS23.map(id=>[id,0])),fallenTents:[],fallenLeaders:[],captain:false};
  for(const a of s.units.filter(u=>u.team==='allied'&&u.faction&&TENT_OF[u.faction])){const t=findUnit(s,TENT_OF[a.faction]);if(t){a.post={x:t.x,y:t.y};a.leash=2;}}},
 clearLabel:'연합 진영의 회의 천막을 지킴',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)
  &&!!m.siege&&typeof m.siege==='object'&&!Array.isArray(m.siege)&&Object.keys(m.siege).length===3&&TENTS23.every(id=>Number.isInteger(m.siege[id])&&m.siege[id]>=0&&m.siege[id]<=2)
  &&idList(m.fallenTents,id=>TENTS23.includes(id),3)&&idList(m.fallenLeaders,id=>!!LEADERS23[id],3)&&typeof m.captain==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,siege=TENTS23.filter(id=>!st.fallenTents.includes(id)&&st.siege[id]>0).length;
  return `천막 ${3-st.fallenTents.length}/3${siege?` · 점거 위기 ${siege}`:''} · 지도자 ${3-st.fallenLeaders.length}/3 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `서 있는 지도자 ${f.mission_23_leaders??(st?3-st.fallenLeaders.length:3)}/3 · 지킨 천막 ${f.mission_23_tents??(st?3-st.fallenTents.length:3)}/3`;},
 // After each enemy phase: a tent with an enemy beside it gains a mark (two marks in a row and it is taken); one without loses them.
 onTurnStart(s){const m=missionOf(s),st=s.missionState;
  for(const t of standingTents23(s)){const n=besiegers23(s,t).length;if(!n){st.siege[t.id]=0;continue;}st.siege[t.id]=Math.min(m.siegeTurns,st.siege[t.id]+1);
   if(st.siege[t.id]<m.siegeTurns){s.feedback.push({type:'guard',id:t.id,text:`점거 ${st.siege[t.id]}/${m.siegeTurns}`});s.log.push(`${t.name} 곁에 적이 버티고 있습니다. 다음 적 턴이 끝날 때도 곁에 있으면 천막을 빼앗깁니다.`);enqueueStory(s,'23:siege');continue;}
   t.inert=true;st.fallenTents.push(t.id);s.feedback.push({type:'death',id:t.id,text:'점거'});s.log.push(`${t.name}을(를) 빼앗겼습니다 (${st.fallenTents.length}/2이면 패배).`);enqueueStory(s,st.fallenTents.length===1?`23:tent:${t.faction}`:'23:tent2');}
  act2Waves(s);},
 beforeEnemyPhase(){},
 // The raid captain (from TURN 4) and the rite knights make for the nearest standing tent and hold beside it;
 // grey cloaks hunt the leaders; crossbows shoot whoever they can.
 planEnemy(s,u,reachable){const foes=foes100(s,u),tents=standingTents23(s),leaderBonus=t=>t.leader?(u.movementProfile==='rogue'?14:6):0;
  if(u.kind==='spear'||u.id==='rk'){const held=tents.find(t=>distance(u,t)===1);
   if(held){const stay=within100(reachable,(x,y)=>distance({x,y},held)===1);return strike100(s,u,stay.size?stay:reachable,foes,{x:u.x,y:u.y,name:held.name},leaderBonus);}
   return strike100(s,u,reachable,foes,goalOf100(nearest100(u,tents)),leaderBonus);}
  if(u.movementProfile==='rogue'){const leaders=foes.filter(t=>t.leader);return strike100(s,u,reachable,foes,goalOf100(nearest100(u,leaders.length?leaders:foes)),leaderBonus);}
  return null;},
 afterDamage(s,v){const st=s.missionState;
  if(v.leader&&LEADERS23[v.id]&&v.hp<=0&&!st.fallenLeaders.includes(v.id)){st.fallenLeaders.push(v.id);s.log.push(`${v.name}이(가) 쓰러졌습니다. ${FACTIONS[LEADERS23[v.id]].name}의 신뢰가 흔들립니다(−1).`);enqueueStory(s,`23:fallen:${v.id}`);}
  if(v.id==='rk'&&v.hp<=0&&!st.captain){st.captain=true;enqueueStory(s,'23:captain:down');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.fallenTents.length>=2)return finish(s,'defeat','회의 천막 두 곳을 빼앗겼습니다. 연합 회의가 흩어졌습니다.');
  if(st.captain)return finish(s,'victory',`재상부 습격대장을 쓰러뜨렸습니다 · 천막 ${3-st.fallenTents.length}/3 · 지도자 ${3-st.fallenLeaders.length}/3.`);
  if(s.turn>m.turnLimit)return finish(s,'victory',`TURN ${m.turnLimit}까지 연합 진영을 지켰습니다 · 천막 ${3-st.fallenTents.length}/3 · 지도자 ${3-st.fallenLeaders.length}/3.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_23_leaders',3-st.fallenLeaders.length);setStoryFlag(s,'mission_23_tents',3-st.fallenTents.length);setStoryFlag(s,'mission_23_captain',st.captain);
  for(const id of Object.keys(LEADERS23))setStoryFlag(s,`mission_23_${id}`,st.fallenLeaders.includes(id)?'fallen':'standing');},
 // A leader who fell in the camp costs their banner's trust (ACT4_DESIGN §8).
 afterVictory(s){if(s.practice)return;for(const id of s.missionState.fallenLeaders)adjustTrust(s.campaign,LEADERS23[id],-1,`M23 · ${({cassian:'카시안',leonora:'레오노라',lucien:'루시안'})[id]}이(가) 연합 진영에서 쓰러졌다`);},
 rewardContext(s){return {leaders23:3-s.missionState.fallenLeaders.length};}
};
// Who leads the final campaign (ACT4_DESIGN §4.1): the legion, or the three banners together. Kept for the endings.
export const LEAD23={legion:'군단이 지휘를 맡는다',banners:'세 깃발이 나눠 맡는다'};
export function chooseLead23(s,id){const c=s.campaign;if(!LEAD23[id]||s.practice||c.choices?.m23_lead||!c.completed?.includes(23))return false;c.choices??={};c.choices.m23_lead=id;setStoryFlag(s,'mission_23_lead',id);return true;}

// ---------- M24 The Last Border ----------
export const refugees24=s=>s.units.filter(u=>u.refugee);
// Rows covered by the ash tide (from the north): none before TURN 2, then one more each turn up to the wall.
export const ashRows24=s=>s.missionId===24&&s.missionState?Math.max(0,s.missionState.ash|0):0;
export const onAsh24=(s,u)=>!!u&&u.y<ashRows24(s);
export const gateClosed24=s=>s.missionId===24&&Number.isInteger(s.missionState?.closedTurn);
export const gateOpen24=s=>s.missionId===24&&!!s.missionState&&!gateClosed24(s)&&s.missionState.inside.length>=missionOf(s).needInside;
// Steps to the gate's inner side for every open tile, around the units standing in the way (the refugee itself excepted).
function gateField24(s,self){const m=missionOf(s),dist=new Map(),queue=[],held=new Set(s.units.filter(u=>u!==self&&alive(u)).map(u=>key(u.x,u.y)));
 for(const [gx,gy] of m.gate){const k=key(gx,gy+1);if(held.has(k))continue;dist.set(k,0);queue.push([gx,gy+1]);}
 while(queue.length){const [x,y]=queue.shift(),d=dist.get(key(x,y));for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||ny<0||nx>=m.width||ny>=m.height||dist.has(k)||held.has(k)||!Number.isFinite(terrainAt(nx,ny,s)?.cost))continue;dist.set(k,d+1);queue.push([nx,ny]);}}return dist;}
// The refugees walk (end of the player phase): two steps each along the shortest open way to the gate, the nearest first;
// one with no open way waits. One who reaches row 9 is inside.
export function walkRefugees24(s){const m=missionOf(s),st=s.missionState,far=r=>Math.abs(r.x-m.gate[0][0])+Math.abs(r.y-m.gate[0][1]);
 for(const r of refugees24(s).filter(alive).sort((a,b)=>far(a)-far(b)||a.id.localeCompare(b.id))){
  for(let step=0;step<m.refugeeSteps&&r.y<m.insideRow;step++){const field=gateField24(s,r),here=field.get(key(r.x,r.y));if(here==null)break;let next=null;
   for(const [dx,dy] of [[0,1],[-1,0],[1,0],[0,-1]]){const nx=r.x+dx,ny=r.y+dy,d=field.get(key(nx,ny));if(d==null||d>=here)continue;if(!next||d<next.d)next={x:nx,y:ny,d};}
   if(!next)break;r.x=next.x;r.y=next.y;}
  if(r.y>=m.insideRow){r.rescued=true;st.inside.push(r.id);s.feedback.push({type:'rescue',id:r.id,text:'관문 안'});s.log.push(`피난민이 관문 안으로 들어왔습니다 (${st.inside.length}/8).`);
   if(st.inside.length===m.needInside)enqueueStory(s,'24:six');}}
 lever24(s);}
function lever24(s){const l=findUnit(s,'lever');if(l)l.locked=!gateOpen24(s);}
export const M24={
 init(s){s.missionState={waves:[],ash:0,inside:[],lost:[],ashLost:[],closedTurn:null};for(const r of refugees24(s))r.noRescue=true;lever24(s);},
 clearLabel:'최후의 국경에서 관문을 닫음',
 validState(m){const ids=['p1','p2','p3','p4','p5','p6','p7','p8'];return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Number.isInteger(m.ash)&&m.ash>=0&&m.ash<=8
  &&idList(m.inside,id=>ids.includes(id),8)&&idList(m.lost,id=>ids.includes(id),8)&&idList(m.ashLost,id=>m.lost.includes(id),8)&&m.inside.every(id=>!m.lost.includes(id))&&(m.closedTurn===null||Number.isInteger(m.closedTurn)&&m.closedTurn>=1);},
 status(s){const m=missionOf(s),st=s.missionState,out=refugees24(s).filter(alive).length;
  return `관문 안 ${st.inside.length}/8 (필요 ${m.needInside}) · 밖 ${out} · 쓰러짐 ${st.lost.length}/${m.lostLimit} · 재 ${st.ash}줄 · ${gateOpen24(s)?'관문을 닫을 수 있음':'관문 열림'} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `관문 안 ${f.mission_24_inside??st?.inside.length??0}/8 · 관문을 닫은 턴 ${f.mission_24_gate_turn??st?.closedTurn??'—'}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);
  if(s.turn>=m.ashTurn&&st.ash<m.ashRows){st.ash=Math.min(m.ashRows,s.turn-m.ashTurn+1);s.log.push(`재의 조수가 밀려옵니다 (북쪽 ${st.ash}줄).`);if(st.ash===1)enqueueStory(s,'24:ash');if(st.ash===5)enqueueStory(s,'24:ash5');}
  lever24(s);},
 // End of the player phase: the refugees walk, then the ash bites whoever stands in it (the ash beasts are at home there).
 beforeEnemyPhase(s){const m=missionOf(s),st=s.missionState;walkRefugees24(s);let n=0;
  for(const u of s.units.filter(u=>alive(u)&&!u.ashBorn&&u.team!=='object'&&onAsh24(s,u))){const d=Math.max(1,Math.ceil(u.maxHP*.1));
   if(u.team==='ally'){const cut=Math.min(d,u.hp-1);if(cut>0){u.hp-=cut;n++;s.feedback.push({type:'hit',id:u.id,text:`재 −${cut}`,toHP:u.hp});}continue;}
   u.hp=Math.max(0,u.hp-d);n++;s.feedback.push({type:'hit',id:u.id,text:`재 −${d}`,toHP:u.hp});if(u.refugee&&u.hp<=0&&!st.lost.includes(u.id)){st.lost.push(u.id);st.ashLost.push(u.id);s.log.push('피난민 한 명이 재 속에 쓰러졌습니다.');enqueueStory(s,'24:lost');}}
  if(n)s.log.push(`재 칸의 ${n}명이 최대 HP의 10%를 잃었습니다.`);},
 // The ash beasts go for the refugees first, then whoever bars the way.
 planEnemy(s,u,reachable){if(!u.ashBorn)return null;const foes=foes100(s,u),walkers=refugees24(s).filter(alive);
  return strike100(s,u,reachable,[...foes,...walkers],goalOf100(nearest100(u,walkers.length?walkers:foes)),t=>t.refugee?10:0);},
 // The lever (beside it, once six are inside): the gate shuts. Whoever is still outside stays outside — the Ashen Night's mirror.
 search(s,u,t){if(t.kind!=='gateLever')return false;const m=missionOf(s),st=s.missionState;if(!gateOpen24(s))return false;st.closedTurn=s.turn;t.inert=true;remember(s,`m24_gate_${u.id}`);
  for(const g of s.units.filter(o=>o.kind==='gateLeaf')){if(!at(s,g.x,g.y))g.benched=false;}
  const left=refugees24(s).filter(alive).length;s.feedback.push({type:'rescue',id:t.id,text:'관문 닫힘'});s.log.push(`${u.name}이(가) 관문을 닫았습니다 (TURN ${s.turn}). 관문 안 ${st.inside.length}명 · 밖에 남은 사람 ${left}명.`);
  enqueueStory(s,left?'24:closed:left':'24:closed:all');return true;},
 afterDamage(s,v){const st=s.missionState;if(v.refugee&&v.hp<=0&&!st.lost.includes(v.id)){st.lost.push(v.id);s.log.push('피난민 한 명이 쓰러졌습니다.');enqueueStory(s,st.lost.length===1?'24:lost':'24:lost2');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.lost.length>=m.lostLimit)return finish(s,'defeat',`피난민 ${st.lost.length}명이 쓰러졌습니다. 국경이 무너졌습니다.`);
  if(gateClosed24(s))return finish(s,'victory',`TURN ${st.closedTurn}에 관문을 닫았습니다 · 관문 안 ${st.inside.length}/8.`);
  if(s.turn>m.turnLimit){if(st.inside.length<m.needInside)return finish(s,'defeat',`관문이 저절로 닫혔지만 안에 든 피난민이 ${st.inside.length}명뿐입니다 (${m.needInside}명 필요).`);
   st.closedTurn=m.turnLimit;for(const g of s.units.filter(o=>o.kind==='gateLeaf'))if(!at(s,g.x,g.y))g.benched=false;return finish(s,'victory',`TURN ${m.turnLimit}이 끝나 관문이 저절로 닫혔습니다 · 관문 안 ${st.inside.length}/8.`);}},
 beforeCommit(s){const st=s.missionState,left=refugees24(s).filter(alive).length;setStoryFlag(s,'mission_24_inside',st.inside.length);setStoryFlag(s,'mission_24_left',left);setStoryFlag(s,'mission_24_lost',st.lost.length);setStoryFlag(s,'mission_24_gate_turn',st.closedTurn??0);},
 rewardContext(s){return {inside24:s.missionState.inside.length};}
};
export const ACT4A_RULES={23:M23,24:M24};
