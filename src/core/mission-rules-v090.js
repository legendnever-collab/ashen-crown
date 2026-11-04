// v0.9.0 ACT III part 1 mission hooks (D-079, docs/v0.9.0/ACT3_DESIGN.md §4.1; rules and numbers PROPOSED).
// M01–M14 never reach this module.
// M15 The Lost Records: chase three clerks to their gates through the lower city; the royal watch stays neutral until the
// legion fights near it twice. M16 The Forgotten Battlefield: fog, ward stones, two memory harvesters, the betraying banner's
// scavengers and their captain's duel with Erik; recruits who left come back as allies.
import {missionOf,scavengerLook16} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust,FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';
import {RECRUIT_OF} from './mission-rules-v071.js';
import {joinRoster,recruitRecord} from './roster.js';
import {startDuel} from './duel.js';
import {TERRAIN_COSTS} from '../data/game-data.js';

// A strike or, failing that, a step toward the goal — scored like the M14 planners. targets: units this enemy may hit.
function strikeOrApproach(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const legionOf=(s,u)=>s.units.filter(t=>alive(t)&&t.team!=='civilian'&&hostile(s,u,t));
const nearest=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0]||null;

// ---------- M15 The Lost Records ----------
const clerks15=s=>s.units.filter(u=>u.clerk);
const watch15=s=>s.units.filter(u=>u.watch);
// Steps from every tile to a gate (terrain only; units ignored), so a clerk always takes its own street.
function gateField(s,exit){const m=missionOf(s),cost=TERRAIN_COSTS.infantry,dist=new Map(),key=(x,y)=>`${x},${y}`,q=[[exit[0],exit[1]]];dist.set(key(...exit),0);
 while(q.length){const [x,y]=q.shift(),d=dist.get(key(x,y));for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=m.width||ny>=m.height||dist.has(key(nx,ny)))continue;const t=m.map[ny][nx];if(!Number.isFinite(cost[t]??terrainAt(nx,ny,s)?.cost))continue;dist.set(key(nx,ny),d+1);q.push([nx,ny]);}}
 return dist;}
const FIELDS=new Map();
const fieldFor=(s,exit)=>{const k=`${s.missionId}:${exit}`;if(!FIELDS.has(k))FIELDS.set(k,gateField(s,exit));return FIELDS.get(k);};
function turnWatch(s){const st=s.missionState;if(st.turned)return;st.turned=true;
 for(const w of watch15(s).filter(w=>w.hp>0)){Object.assign(w,{team:'enemy',turned:true,kind:'bandit',atk:36,def:18,res:10,spd:20,mov:3,range:[1,1],moved:false,acted:false});s.feedback.push({type:'spawn',id:w.id,text:'HOSTILE'});}
 s.log.push('왕도 경비대가 군단을 적으로 여깁니다! 경비대가 칼을 뽑았습니다.');enqueueStory(s,'15:watch');}
export const M15={
 init(s){s.missionState={waves:[],secured:[],escaped:[],warned:0,turned:false,last:null};},
 clearLabel:'기록 상자 확보',
 validState(m){const ids=['c1','c2','c3'];return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.secured)&&Array.isArray(m.escaped)&&[...m.secured,...m.escaped].every(id=>ids.includes(id))&&new Set([...m.secured,...m.escaped]).size===m.secured.length+m.escaped.length&&Number.isInteger(m.warned)&&m.warned>=0&&m.warned<=2&&typeof m.turned==='boolean'&&(m.last===null||typeof m.last==='string'&&m.last.length<40);},
 status(s){const m=missionOf(s),st=s.missionState,a=findUnit(s,'archivist');return `상자 확보 ${st.secured.length}/3 · 놓침 ${st.escaped.length} · 경비대 ${st.turned?'적대':st.warned?'경고':'중립'} · 기록관 HP ${Math.round(100*Math.max(0,a.hp)/a.maxHP)}% · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `기록 상자 ${f.mission_15_boxes??s.missionState?.secured.length??0}/3 · 왕도 경비대 ${({calm:'중립 유지',warned:'경고 한 번',turned:'적대'})[f.mission_15_watch]||'—'}`;},
 onTurnStart(s){act2Waves(s);if(s.turn===missionOf(s).clerkStart)enqueueStory(s,'15:run');},
 beforeEnemyPhase(){},
 planEnemy(s,u,reachable){const m=missionOf(s);
  if(u.clerk){if(s.turn<m.clerkStart)return {x:u.x,y:u.y,target:null,reason:'상자를 꾸리는 중'};const f=fieldFor(s,u.exit);let best={x:u.x,y:u.y,score:f.get(`${u.x},${u.y}`)??99};
   for(const [k,c] of reachable){const d=f.get(k);if(d!=null&&d+c*.01<best.score)best={x:+k.split(',')[0],y:+k.split(',')[1],score:d+c*.01};}return {x:best.x,y:best.y,target:null,reason:'성문으로 달아남'};}
  const foes=legionOf(s,u),arch=findUnit(s,'archivist');
  // Turned watchmen fight the legion only; cloaks hunt the archivist from TURN 3 and otherwise screen the clerks.
  const targets=!u.turned&&arch&&alive(arch)&&s.turn>=m.threatTurn?[...foes,arch]:foes;
  const screen=nearest(u,clerks15(s).filter(c=>alive(c)));const goal=u.turned?nearest(u,foes):s.turn>=m.threatTurn?(arch&&alive(arch)?arch:nearest(u,foes)):screen||nearest(u,foes);
  return strikeOrApproach(s,u,reachable,targets,goal,t=>t.id==='archivist'?26:0);},
 // Fighting next to the watch: one warning, then the watch turns (once per hero action).
 onAction(s,u,mode,t){const st=s.missionState,m=missionOf(s);if(st.turned||!t||u.team!=='ally'||!hostile(s,u,t))return;const key=`${s.turn}:${u.id}`;if(st.last===key)return;
  const near=watch15(s).some(w=>w.hp>0&&(distance(w,u)<=m.watchRadius||distance(w,t)<=m.watchRadius));if(!near)return;st.last=key;st.warned=Math.min(2,st.warned+1);
  if(st.warned===1){s.log.push('왕도 경비대: "왕도 안에서 칼을 뽑지 마라!" (경고 1회 · 한 번 더 싸우면 경비대가 적이 됩니다)');s.feedback.push({type:'guard',id:u.id,text:'경고'});enqueueStory(s,'15:warn');}else turnWatch(s);},
 afterDamage(s,v){const st=s.missionState;if(v.clerk&&v.hp<=0&&!st.secured.includes(v.id)&&!st.escaped.includes(v.id)){st.secured.push(v.id);s.feedback.push({type:'rescue',id:v.id,text:'상자 확보'});s.log.push(`${v.name}이(가) 쓰러졌습니다. 기록 상자를 확보했습니다 (${st.secured.length}/3).`);enqueueStory(s,st.secured.length===1?'15:box':'15:box2');}
  if(v.id==='archivist'&&v.hp<=0)enqueueStory(s,'15:archivist');},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  for(const c of clerks15(s))if(alive(c)&&c.x===c.exit[0]&&c.y===c.exit[1]){st.escaped.push(c.id);c.benched=true;c.withdrawn=true;s.feedback.push({type:'rescue',id:c.id,text:'ESCAPED'});s.log.push(`${c.name}이(가) 상자를 들고 성문 밖으로 빠져나갔습니다.`);enqueueStory(s,'15:escape');}
  const a=findUnit(s,'archivist');if(a.hp<=0)return finish(s,'defeat','늙은 기록관을 지키지 못했습니다.');
  if(st.escaped.length>=2)return finish(s,'defeat','기록 상자 두 개가 성문 밖으로 나갔습니다.');
  if(st.secured.length+st.escaped.length===3&&st.secured.length>=2)return finish(s,'victory',`기록 상자 ${st.secured.length}/3 확보 · 기록관 무사${st.turned?' · 경비대와 충돌':''}.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 상자를 되찾지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_15_boxes',st.secured.length);setStoryFlag(s,'mission_15_watch',st.turned?'turned':st.warned?'warned':'calm');setStoryFlag(s,'mission_15_archivist',findUnit(s,'archivist').hp>0);},
 rewardContext(s){const st=s.missionState;return {boxes15:st.secured.length,calm15:!st.turned&&!st.warned};}
};
// After M15 the legion decides what to do with the recovered records (ACT3_DESIGN §4.1; feeds the ACT IV endings, OPEN).
export const RECORDS15={archivist:'기록관에게 맡긴다',keep:'군단이 지닌다',post:'하층가에 사본을 붙인다'};
export function chooseRecords15(s,id){const c=s.campaign;if(!RECORDS15[id]||s.practice||c.choices?.m15_records||!c.completed?.includes(15))return false;c.choices??={};c.choices.m15_records=id;setStoryFlag(s,'mission_15_records_choice',id);return true;}

// ---------- M16 The Forgotten Battlefield ----------
const RETURNERS={rthea:'thea',rdario:'dario',rines:'ines'};
// Who wanders back: a recruit who left after M14, or Ines when she never joined after M12 (and did not leave).
export function returningRecruits(c){const out=[];for(const id of ['thea','dario','ines']){if(c?.roster?.includes(id))continue;if(c?.departed?.[id])out.push(id);else if(id==='ines'&&c?.completed?.includes(12))out.push(id);}return out;}
const stones16=s=>s.units.filter(u=>u.kind==='wardStone');
const harvesters16=s=>s.units.filter(u=>u.kind==='harvester');
export const M16={
 init(s){const c=s.campaign,m=missionOf(s),f=c.flags?.mission_14_betrayer||'iron',back=s.practice?[]:returningRecruits(c);
  s.missionState={waves:[],searched:[],clear:[],harvested:0,banner:f,returning:back,duelDone:false};
  for(const u of s.units.filter(u=>u.scav)){u.look=scavengerLook16(f,u.scav);if(u.scav==='soldier'&&f==='flame')u.kind='bandit';u.name=u.scav==='captain'?`${FACTIONS[f]?.name||'배신한 깃발'} 기사대장`:`${FACTIONS[f]?.name||'배신한 깃발'} 약탈대`;u.faction=null;}
  for(const a of s.units.filter(u=>RETURNERS[u.id])){const id=RETURNERS[a.id];if(!back.includes(id)){a.benched=true;a.withdrawn=true;continue;}
   const rec=c.departed?.[id]||recruitRecord(id,13),keep=['level','maxHP','maxMP','atk','def','mag','res','spd','mov','range','movementProfile','classTier'];for(const k of keep)if(rec[k]!==undefined)a[k]=structuredClone(rec[k]);a.hp=a.maxHP;a.mp=a.maxMP;a.benched=true;a.kind=id==='thea'?'cavalry':id==='ines'?'soldier':'soldier';}},
 clearLabel:'잊힌 전장의 수확자 격파',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.searched)&&m.searched.every(id=>['st1','st2','st3'].includes(id))&&new Set(m.searched).size===m.searched.length&&Array.isArray(m.clear)&&m.clear.length===m.searched.length&&m.clear.every(c=>Array.isArray(c)&&c.length===3&&c.every(Number.isInteger))&&Number.isInteger(m.harvested)&&m.harvested>=0&&!!FACTIONS[m.banner]&&Array.isArray(m.returning)&&m.returning.every(id=>['thea','dario','ines'].includes(id))&&typeof m.duelDone==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,down=harvesters16(s).filter(h=>!alive(h)).length,back=st.returning.map(id=>s.units.find(u=>RETURNERS[u.id]===id)).filter(u=>u&&!u.benched);
  return `수확자 격파 ${down}/2 · 결계석 조사 ${st.searched.length}/3${back.length?` · 돌아온 동료 ${back.filter(u=>u.hp>0).length}/${back.length}`:''} · 안개 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `결계석 ${f.mission_16_echoes??s.missionState?.searched.length??0}/3 · 일기토 ${({hero:'승리',foe:'패배',skipped:'거절'})[f.mission_16_duel]||'—'}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);
  if(s.turn===m.returnTurn)for(const a of s.units.filter(u=>RETURNERS[u.id]&&st.returning.includes(RETURNERS[u.id])&&u.benched&&!u.withdrawn&&u.hp>0)){a.benched=false;a.moved=false;a.acted=false;if(s.units.some(o=>o!==a&&alive(o)&&o.x===a.x&&o.y===a.y)){for(let y=m.height-1;y>=0;y--){const t=terrainAt(0,y,s);if(Number.isFinite(t?.cost)&&!s.units.some(o=>alive(o)&&o.x===0&&o.y===y)){a.x=0;a.y=y;break;}}}
   s.feedback.push({type:'spawn',id:a.id,text:'돌아옴'});s.log.push(`${a.name}이(가) 안개 속에서 나타났습니다. 군단 곁에서 싸웁니다.`);enqueueStory(s,`16:return:${RETURNERS[a.id]}`);}
  if(s.turn===m.duelTurn&&!st.duelDone){st.duelDone=true;const cap=findUnit(s,'cap'),e=findUnit(s,'eric');if(cap&&alive(cap)&&e&&alive(e)&&startDuel(s,'eric','cap','16:duel'))enqueueStory(s,'16:duel');}
  // Harvest: a harvester beside an unsearched stone draws on the memories of the heroes near that stone.
  let drained=0;for(const h of harvesters16(s).filter(alive)){const st1=stones16(s).find(t=>!t.inert&&distance(t,h)<=1);if(!st1)continue;
   for(const u of s.units.filter(u=>u.team==='ally'&&alive(u)&&distance(u,st1)<=m.harvestRadius)){const n=Math.min(u.mp,m.harvestMP);if(n>0){u.mp-=n;drained+=n;s.feedback.push({type:'guard',id:u.id,text:`MP −${n}`});}}}
  if(drained){st.harvested+=drained;s.log.push(`결계석이 기억을 빨아들입니다. 가까운 장수들의 MP가 줄었습니다 (−${drained}).`);enqueueStory(s,'16:harvest');}},
 beforeEnemyPhase(){},
 planEnemy(s,u,reachable){if(u.kind!=='harvester')return null;const stone=findUnit(s,u.stone),foes=legionOf(s,u);
  // A harvester keeps to its stone (within one tile) and strikes whoever comes near.
  const near=new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return !stone||stone.inert||distance({x,y},stone)<=1;}));
  return strikeOrApproach(s,u,near.size?near:reachable,foes,null);},
 search(s,u,t){if(t.kind!=='wardStone')return false;const st=s.missionState,m=missionOf(s);t.inert=true;st.searched.push(t.id);st.clear.push([t.x,t.y,m.clearRadius]);remember(s,`m16_echo_${u.id}`);
  s.feedback.push({type:'rescue',id:t.id,text:'잔영'});s.log.push(`${u.name}이(가) 결계석에 손을 댑니다. 잊힌 기억의 잔영이 떠오르고, 주위의 안개가 걷힙니다.`);
  enqueueStory(s,t.id==='st3'&&u.id==='elina'?'16:echo:st3:elina':`16:echo:${t.id}`);return true;},
 afterDamage(s,v){if(RETURNERS[v.id]&&v.hp<=0)enqueueStory(s,`16:fallen:${RETURNERS[v.id]}`);},
 checkOutcome(s,finish){const m=missionOf(s);
  if(harvesters16(s).every(h=>!alive(h)))return finish(s,'victory',`기억 수확자 격파 · 결계석 ${s.missionState.searched.length}/3 조사.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 수확자를 막지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_16_echoes',st.searched.length);setStoryFlag(s,'mission_16_duel',s.duel?.result||'none');
  for(const id of st.returning){const a=s.units.find(u=>RETURNERS[u.id]===id);setStoryFlag(s,`mission_16_return_${id}`,a&&a.hp>0&&!a.benched?'joined':'lost');}},
 // The returning recruits who stood to the end rejoin with the record they left with; their banner hears of it (+1).
 afterVictory(s){if(s.practice)return;const c=s.campaign;for(const id of s.missionState.returning){if(c.flags[`mission_16_return_${id}`]!=='joined')continue;rejoinRoster(s,id);
  const f=Object.entries(RECRUIT_OF).find(([,r])=>r===id)?.[0];if(f)adjustTrust(c,f,1,`M16 · ${({thea:'테아',dario:'다리오',ines:'이네스'})[id]}가 군단으로 돌아왔다`);}},
 rewardContext(s){return {echoes16:s.missionState.searched.length};}
};
// A recruit comes back: the record kept aside after M14 returns to the roster (Ines, who never joined, joins at Lv 13).
export function rejoinRoster(s,id){const c=s.campaign,rec=c.departed?.[id];if(rec){delete c.departed[id];if(!Object.keys(c.departed).length)delete c.departed;}
 // the kept record may still carry its last battle's phase marks; the hero comes back rested
 const clean=rec?(({recoveryPhase,status,statusTurns,moved,acted,hitThisTurn,guarding,guardTarget,benched,x,y,...r})=>({...r,hp:r.maxHP,mp:r.maxMP}))(rec):null;
 const ok=joinRoster(s,id,13,clean);s.stageStart=null;return ok;}
export const RECORDS16={break:'결계석을 부순다',leave:'결계석을 남긴다'};
export function chooseStones16(s,id){const c=s.campaign;if(!RECORDS16[id]||s.practice||c.choices?.m16_stones||!c.completed?.includes(16))return false;c.choices??={};c.choices.m16_stones=id;setStoryFlag(s,'mission_16_stones_choice',id);return true;}
export const ACT3A_RULES={15:M15,16:M16};
