// v0.6 ACT II mission hooks (Phase D, D-055 §3; rules and numbers PROPOSED). M01–M06 never reach this module.
// M07 Northern Orders: a three-wagon convoy drives up the road to Ironhold's gate; Thea's escort (AI allies) keeps to
// the nearest wagon. M08 Canyon Defense: hold the canyon beside Baldrick; two one-shot rockfall devices; the command
// order chosen before battle decides whether the rear village is abandoned (TURN 6) or may be rescued.
import {missionOf} from '../data/missions.js';
import {alive,at,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {spawnWave} from './mission-rules.js';
import {ensureTrust,adjustTrust} from './factions.js';
import {joinRoster} from './roster.js';

export function act2Waves(s){const m=missionOf(s),st=s.missionState;for(const w of m.waves){if(s.turn!==w.turn||st.waves.includes(w.turn))continue;st.waves.push(w.turn);spawnWave(s,w.units);
 if(w.story)enqueueStory(s,w.story);s.log.push(`적 증원 ${w.units.length}명 출현.`);}}
const convoyOf=s=>s.units.filter(u=>u.kind==='wagon');
const throughOf=s=>convoyOf(s).filter(w=>w.rescued).length;
const intactOf=s=>convoyOf(s).filter(w=>w.rescued||w.hp>0).length;
const ROADWAY=['r','i','t'];
// v2.3.0 (D-129): the big M07 road runs east, crosses the ice and climbs north to the gate in the north-east, so a wagon
// follows the road by its distance to the gate (mission.convoyGate) instead of heading straight north. Without
// convoyGate the gate is the top two rows (the v0.6 map). Distances are counted over road tiles only.
const gateOf=m=>m.convoyGate||m.map.flatMap((r,y)=>y<=1?r.map((t,x)=>ROADWAY.includes(t)?[x,y]:null).filter(Boolean):[]);
function roadDist(m){const d=new Map(),q=[];for(const [x,y] of gateOf(m)){d.set(`${x},${y}`,0);q.push([x,y]);}
 while(q.length){const [x,y]=q.shift(),k=d.get(`${x},${y}`);for(const [dx,dy] of [[0,-1],[1,0],[-1,0],[0,1]]){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;if(d.has(key)||!ROADWAY.includes(m.map[ny]?.[nx]))continue;d.set(key,k+1);q.push([nx,ny]);}}
 return d;}
export const convoyDistance=(s,p)=>roadDist(missionOf(s)).get(`${p.x},${p.y}`)??Infinity;
// Each living wagon (the one nearest the gate first) drives up to two tiles along the road toward the gate (one with an
// enemy beside it); a unit in the way blocks it, though it may step across once to the other lane (same distance).
function moveConvoy(s){const m=missionOf(s),dist=roadDist(m),gate=new Set(gateOf(m).map(([x,y])=>`${x},${y}`)),D=p=>dist.get(`${p.x},${p.y}`)??Infinity;
 for(const w of convoyOf(s).filter(u=>alive(u)&&!u.rescued).sort((a,b)=>D(a)-D(b)||a.y-b.y||a.x-b.x)){
  const pressed=s.units.some(e=>e.team==='enemy'&&alive(e)&&distance(e,w)===1),from={x:w.x,y:w.y},path=[];let side=false;
  for(let step=0;step<(pressed?1:2)&&!gate.has(`${w.x},${w.y}`);step++){let moved=false;
   const here=D(w),opts=[[0,-1],[1,0],[-1,0],[0,1]].map(([dx,dy])=>({x:w.x+dx,y:w.y+dy})).filter(p=>Number.isFinite(D(p))&&!at(s,p.x,p.y));
   const fwd=opts.filter(p=>D(p)<here).sort((a,b)=>D(a)-D(b))[0],lane=side?null:opts.find(p=>D(p)===here);
   const next=fwd||lane;if(next){if(!fwd)side=true;w.x=next.x;w.y=next.y;path.push({x:next.x,y:next.y});moved=true;}
   if(!moved)break;}
  if(!path.length){s.log.push(`${w.name}: 길이 막혀 기다립니다.`);continue;}if(pressed)s.log.push(`${w.name}: 습격을 받으며 1칸 전진.`);
  s.feedback.push({type:'move',id:w.id,path:[from,...path]});
  if(gate.has(`${w.x},${w.y}`)){w.rescued=true;s.feedback.push({type:'rescue',id:w.id,text:'GATE'});s.log.push(`${w.name}이(가) 성문을 넘었습니다. (${throughOf(s)}/3)`);enqueueStory(s,'7:through');}
 }}
// Thea's escort keeps to the nearest wagon still on the road (leash 2), and strikes anything that comes close.
function escortPost(s,u){const wagons=convoyOf(s).filter(alive);if(!wagons.length){delete u.post;return;}const w=wagons.sort((a,b)=>distance(u,a)-distance(u,b))[0];u.post={x:w.x,y:w.y};u.leash=2;}

export const M7={
 init(s){s.missionState={waves:[],captured:false};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'북부 수송로 호위',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&typeof m.captured==='boolean';},
 status(s){const m=missionOf(s),boss=findUnit(s,'boss');return `마차 통과 ${throughOf(s)}/${m.convoyGoal} · 남은 마차 ${intactOf(s)}/3${s.missionState.captured?' · 대장 생포':boss&&!alive(boss)?' · 대장 격파':''} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `마차 ${f.mission_07_wagons_through??throughOf(s)}/3 통과${(f.mission_07_deserter_captured||s.missionState?.captured)?' · 탈영병 대장 생포':''}`;},
 onTurnStart(s){act2Waves(s);if(s.turn>=2)moveConvoy(s);},
 beforeEnemyPhase(){},
 // escorts keep beside the nearest wagon (leash 2) and never park on the road just ahead of a wagon (v2.3.0: ahead = nearer the gate along the road)
 planAllied(s,u,reachable){escortPost(s,u);const post=u.post,dist=roadDist(missionOf(s)),D=(x,y)=>dist.get(`${x},${y}`)??Infinity,ahead=(x,y)=>Number.isFinite(D(x,y))&&convoyOf(s).some(w=>alive(w)&&!w.rescued&&D(w.x,w.y)>D(x,y)&&distance(w,{x,y})<=3);
  const cells=[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c};}).filter(p=>(!post||distance(p,post)<=2)&&(!ahead(p.x,p.y)||p.x===u.x&&p.y===u.y));if(!cells.length)return {x:u.x,y:u.y,target:null,reason:'호위 대기'};
  let best=null;for(const p of cells)for(const t of s.units.filter(t=>alive(t)&&hostile(s,u,t))){const d=distance(p,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,{...u,x:p.x,y:p.y},t),score=f.damage+(t.hp<=f.damage?30:0)-p.c*.3;if(!best||score>best.score)best={x:p.x,y:p.y,target:t.id,score,reason:`마차 호위 · ${t.name} 공격`};}
  if(best)return best;const goal=post||u;let dest=cells[0];for(const p of cells)if(distance(p,goal)+p.c*.01<distance(dest,goal)+dest.c*.01)dest=p;return {x:dest.x,y:dest.y,target:null,reason:'마차 곁 호위'};},
 capture(s,u,t){t.rescued=true;t.captured=true;s.missionState.captured=true;setStoryFlag(s,'mission_07_deserter_captured');remember(s,`${u.id}_capture`);
  s.feedback.push({type:'rescue',id:t.id,text:'CAPTURED'});s.log.push(`${u.name}: 탈영병 대장을 생포했습니다.`);enqueueStory(s,'7:capture');},
 checkOutcome(s,finish){
  const m=missionOf(s),through=throughOf(s),intact=intactOf(s),cap=s.missionState.captured?' · 탈영병 대장 생포':'';
  if(intact<m.convoyGoal)return finish(s,'defeat','보급 마차를 두 대 이상 잃었습니다.');
  if(through>=m.convoyGoal)return finish(s,'victory',`수송 완료 · 마차 ${through}/3 성문 통과${cap}.`);
  if(m.waves.every(w=>s.missionState.waves.includes(w.turn))&&s.units.filter(u=>u.team==='enemy').every(u=>!alive(u)))return finish(s,'victory',`탈영병 소탕 · 마차 ${intact}/3 무사${cap}.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 수송을 마치지 못했습니다.`);
 },
 beforeCommit(s){setStoryFlag(s,'mission_07_wagons_through',throughOf(s));setStoryFlag(s,'mission_07_wagons_intact',intactOf(s));setStoryFlag(s,'mission_07_deserter_captured',!!s.missionState.captured);
  setStoryFlag(s,'mission_07_escorts_alive',s.units.filter(u=>u.team==='allied'&&u.hp>0).length);},
 afterVictory(s){if(s.practice)return;if(s.units.filter(u=>u.team==='allied'&&u.hp>0).length>=2)adjustTrust(s.campaign,'iron',1,'M07 · 수송 호위대와 함께 수송로를 지켰다');},
 rewardContext(s){return {convoy:throughOf(s),captured7:!!s.missionState.captured};}
};

// ---------- M08 Canyon Defense ----------
const orderOf=s=>s.campaign.choices?.m08_order||'hold';
const villagersOf=s=>s.units.filter(u=>u.team==='civilian');
const raider=u=>/^s\d/.test(u.id);
export const M8={
 init(s){s.missionState={waves:[],rockfall:[],village:null};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'회색 협곡 사수',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.rockfall)&&m.rockfall.every(id=>['rf1','rf2'].includes(id))&&[null,'hold','rescue'].includes(m.village);},
 status(s){const m=missionOf(s),boss=findUnit(s,'boss'),saved=villagersOf(s).filter(v=>v.rescued).length;return `${orderOf(s)==='rescue'?`구출 ${saved}/3 · `:''}낙석 ${s.missionState.rockfall.length}/2 · 용병단장 HP ${boss?Math.round(100*Math.max(0,boss.hp)/boss.maxHP):0}% · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `${(f.mission_08_order||orderOf(s))==='rescue'?`주민 구출 ${f.mission_08_villagers_saved??villagersOf(s).filter(v=>v.rescued).length}/3`:'명령 준수 · 협곡 사수'}${f.mission_08_captain_defeated?' · 용병단장 격파':''}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);
  if(s.turn===m.orderTurn&&!st.village){st.village=orderOf(s);
   if(st.village==='hold'){for(const v of villagersOf(s).filter(alive)){v.benched=true;v.withdrawn=true;}s.log.push('명령대로 후위 마을을 포기합니다. 주민들은 스스로 남쪽으로 흩어졌습니다.');}
   else s.log.push('구출조 출동: 후위 마을 주민 곁으로 가서 구출하세요. 남쪽 습격조가 주민을 노립니다.');
   enqueueStory(s,`8:village:${st.village}`);}},
 beforeEnemyPhase(){},
 // the mercenary captain holds the northern mouth until TURN 5, striking only what comes into reach
 planEnemy(s,u){if(u.id!=='boss'||s.turn>=u.holdUntil)return null;
  const t=s.units.filter(v=>alive(v)&&hostile(s,u,v)&&distance(u,v)>=u.range[0]&&distance(u,v)<=u.range[1]).sort((a,b)=>strikeStats(s,u,b).damage-strikeStats(s,u,a).damage)[0];
  return {x:u.x,y:u.y,target:t?.id||null,reason:t?'협곡 입구 사수':'협곡 입구에서 대기'};},
 search(s,u,t){if(t.kind!=='rockfall')return false;t.rescued=true;s.missionState.rockfall.push(t.id);remember(s,`m8_rockfall_${u.id}`);
  const [x0,x1,y0,y1]=t.zone;let hit=0;
  for(const e of s.units.filter(e=>e.team==='enemy'&&alive(e)&&e.x>=x0&&e.x<=x1&&e.y>=y0&&e.y<=y1)){const fromHP=e.hp;e.hp=Math.max(0,e.hp-18);hit++;s.feedback.push({type:'hit',id:e.id,text:'ROCKFALL −18',fromHP,toHP:e.hp,damage:fromHP-e.hp});
   if(!alive(e)){s.feedback.push({type:'death',id:e.id,text:'FALLEN'});s.log.push(`${e.name} 전투불능.`);if(e.id==='boss'){setStoryFlag(s,'mission_08_captain_defeated');enqueueStory(s,'8:boss');}}}
  s.feedback.push({type:'rescue',id:t.id,text:'ROCKFALL'});s.log.push(`${u.name}: 낙석 장치 작동 · 적 ${hit}명 피격.`);enqueueStory(s,'8:rockfall');return true;},
 afterDamage(s,v){if(v.id==='baldrick'&&v.hp<Math.ceil(v.maxHP/2)){v.hp=Math.ceil(v.maxHP/2);s.log.push('발드릭은 물러서지 않습니다. 더 이상의 피해는 막아 냅니다.');}
  if(v.id==='boss'&&v.hp<=0)setStoryFlag(s,'mission_08_captain_defeated');},
 checkOutcome(s,finish){
  const m=missionOf(s),boss=findUnit(s,'boss'),saved=villagersOf(s).filter(v=>v.rescued).length,tail=orderOf(s)==='rescue'?` · 주민 ${saved}/3 구출`:'';
  if(s.units.some(e=>e.team==='enemy'&&alive(e)&&!raider(e)&&e.y>=m.breachRow))return finish(s,'defeat','용병단이 아래 목을 넘어 협곡이 뚫렸습니다.');
  if(boss&&!alive(boss))return finish(s,'victory',`용병단장 격파 · 협곡 사수${tail}.`);
  if(s.turn>m.turnLimit)return finish(s,'victory',`TURN ${m.turnLimit}까지 협곡 사수${tail}.`);
 },
 beforeCommit(s){setStoryFlag(s,'mission_08_order',orderOf(s));setStoryFlag(s,'mission_08_villagers_saved',villagersOf(s).filter(v=>v.rescued).length);setStoryFlag(s,'mission_08_rockfalls',s.missionState.rockfall.length);
  const boss=findUnit(s,'boss');setStoryFlag(s,'mission_08_captain_defeated',!!boss&&boss.hp<=0);},
 // Thea asks to join after the canyon when the Iron Crown trusts the legion and the M07 deserters were not handed over.
 afterVictory(s){if(s.practice)return;const ok=theaEligible(s.campaign);setStoryFlag(s,'thea_joined',ok);if(ok){joinRoster(s,'thea',8);s.stageStart=null;}}, // the battle start no longer matches a six-hero legion
 rewardContext(s){return {villagers:villagersOf(s).filter(v=>v.rescued).length,captain8:!!s.campaign.flags.mission_08_captain_defeated};}
};
export const theaEligible=c=>(ensureTrust(c).iron>=1)&&c.choices?.m07_deserters!=='handover';
// Choices (PROPOSED trust effects): handing the captured deserters to the Iron Crown and obeying the canyon order each
// raise its trust by one; taking them into the legion or sending the rescue squad leaves it where it is.
export function chooseDeserters(s,id){if(!['handover','legion'].includes(id)||s.practice||s.campaign.choices?.m07_deserters)return false;s.campaign.choices.m07_deserters=id;setStoryFlag(s,'mission_07_deserters',id);
 if(id==='handover')adjustTrust(s.campaign,'iron',1,'M07 · 탈영병을 통령국 법에 넘겼다');return true;}
export function chooseOrder(s,id){if(!['hold','rescue'].includes(id)||s.practice||s.campaign.choices?.m08_order)return false;s.campaign.choices.m08_order=id;
 if(id==='hold')adjustTrust(s.campaign,'iron',1,'M08 · 사령부 명령대로 협곡을 지켰다');return true;}
export const ACT2_RULES={7:M7,8:M8};
