// v0.9.2 ACT III part 3 「그림자」 mission hooks (D-089, docs/v0.9.0/ACT3_DESIGN.md §4.2; rules and numbers PROPOSED).
// M01–M18 never reach this module.
// M19 The Forbidden Rite: four ritual circles under the capital draw the memories of four captive refugees; a hero beside a
// circle breaks its seal. Lia (within 2) or her Arcane Territory runes stall a circle; its ritualist keeps it going.
// M20 The Crown's Shadow: the chancellery archive (three cabinets of the controlled-war plan, clerks with torches) and the
// burning lower city (six residents, a spreading fire), grey cloaks in the shadows, Kai's duel with his old superior.
import {missionOf,scavengerLook16} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats,key,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';
import {startDuel} from './duel.js';

function strike92(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const foes92=(s,u)=>s.units.filter(t=>alive(t)&&t.team!=='civilian'&&hostile(s,u,t));
const within=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));

// ---------- M19 The Forbidden Rite ----------
export const circles19=s=>s.units.filter(u=>u.kind==='ritualCircle');
const CAPTIVES=['p1','p2','p3','p4'],CIRCLES=['rc1','rc2','rc3','rc4'];
// Why a circle is quiet this turn: sealed, its captive already lost, Lia beside it, her runes on it, or no ritualist near.
export function circleState(s,c){const m=missionOf(s),st=s.missionState;if(st.unsealed.includes(c.id))return 'sealed';if((st.memory[c.captive]??0)<=0)return 'spent';
 const lia=findUnit(s,'lia');if(lia&&alive(lia)&&!lia.benched&&distance(lia,c)<=m.liaRadius)return 'lia';
 if((s.runes||[]).some(r=>r.x===c.x&&r.y===c.y&&r.until>=s.turn))return 'runes';
 return s.units.some(r=>r.kind==='ritualist'&&r.team==='enemy'&&alive(r)&&distance(r,c)<=m.drainRadius)?'drawing':'idle';}
export const M19={
 init(s){const m=missionOf(s);s.missionState={waves:[],memory:Object.fromEntries(CAPTIVES.map(id=>[id,m.memory])),unsealed:[],forgotten:[],stalled:0};
  for(const c of s.units.filter(u=>u.kind==='captive'||u.kind==='teacher'))c.noRescue=true;},
 clearLabel:'왕도 지하 의식장의 의식진 해제',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&!!m.memory&&typeof m.memory==='object'&&Object.keys(m.memory).length===4&&CAPTIVES.every(id=>Number.isInteger(m.memory[id])&&m.memory[id]>=0&&m.memory[id]<=3)
  &&Array.isArray(m.unsealed)&&m.unsealed.every(id=>CIRCLES.includes(id))&&new Set(m.unsealed).size===m.unsealed.length&&Array.isArray(m.forgotten)&&m.forgotten.every(id=>CAPTIVES.includes(id)&&m.memory[id]===0)&&new Set(m.forgotten).size===m.forgotten.length&&Number.isInteger(m.stalled)&&m.stalled>=0;},
 status(s){const m=missionOf(s),st=s.missionState;return `의식진 ${st.unsealed.length}/4 꺼짐 · 포로 기억 ${CAPTIVES.map(id=>st.memory[id]).join('·')}${st.forgotten.length?` · 이름을 잊음 ${st.forgotten.length}`:''} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `의식진 ${f.mission_19_unsealed??st?.unsealed.length??0}/4 · 이름을 지킨 포로 ${f.mission_19_remembered??(st?4-st.forgotten.length:4)}/4`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);if(s.turn<m.drainTurn)return;let drawn=0,stalled=0;
  for(const c of circles19(s)){const why=circleState(s,c);if(why==='lia'||why==='runes'){stalled++;continue;}if(why!=='drawing')continue;
   const p=findUnit(s,c.captive);st.memory[c.captive]--;drawn++;s.feedback.push({type:'guard',id:p.id,text:`기억 −1 (${st.memory[c.captive]})`});
   if(st.memory[c.captive]===0){st.forgotten.push(p.id);p.forgotten=true;s.log.push(`${p.name}이(가) 자기 이름을 잊었습니다.`);enqueueStory(s,st.forgotten.length===1?'19:forgot':'19:forgot2');}}
  if(drawn)s.log.push(`의식진 ${drawn}곳이 포로의 기억을 거둡니다. 의식사를 쓰러뜨리거나 진을 끄세요.`);
  if(stalled){if(!st.stalled)enqueueStory(s,'19:stall');st.stalled+=stalled;s.log.push(`리아의 마력이 의식진 ${stalled}곳을 붙들고 있습니다.`);}
  if(s.turn===m.drainTurn&&drawn)enqueueStory(s,'19:drain');},
 beforeEnemyPhase(){},
 // Ritualists keep beside their circle (within 1; while one stands there the seal cannot be broken) while it burns and strike whoever comes near; the overseer keeps to the
 // dais until TURN 5. Knights and cloaks hunt the legion (the default AI).
 planEnemy(s,u,reachable){const foes=foes92(s,u);
  if(u.kind==='ritualist'){const c=findUnit(s,u.circle);if(c&&!s.missionState.unsealed.includes(c.id)){const near=within(reachable,(x,y)=>distance({x,y},c)<=1);return strike92(s,u,near.size?near:reachable,foes,null);}return strike92(s,u,reachable,foes,foes[0]?{x:foes[0].x,y:foes[0].y,name:foes[0].name}:null);}
  if(u.id==='ov'&&s.turn<5)return strike92(s,u,within(reachable,(x,y)=>y<=3),foes,null);
  return null;},
 search(s,u,t){if(t.kind!=='ritualCircle')return false;const st=s.missionState;t.inert=true;st.unsealed.push(t.id);remember(s,`m19_unseal_${u.id}`);
  const p=findUnit(s,t.captive);if(p&&!p.forgotten)p.freed=true;s.feedback.push({type:'rescue',id:t.id,text:'봉인 해제'});
  s.log.push(`${u.name}이(가) 의식진의 봉인을 끊었습니다 (${st.unsealed.length}/4).${p&&!p.forgotten?` ${p.name}이(가) 정신을 차립니다.`:''}`);
  {const k=u.id==='lia'&&!st.liaUnsealed?'19:unseal:lia':st.unsealed.length===1?'19:unseal':st.unsealed.length===3?'19:unseal3':null;if(k)enqueueStory(s,k);}if(u.id==='lia')st.liaUnsealed=true;return true;},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.forgotten.length>=2)return finish(s,'defeat','포로 두 명이 자기 이름을 잊었습니다. 의식이 사람을 지워 버렸습니다.');
  if(st.unsealed.length===4)return finish(s,'victory',`의식진 4곳을 모두 껐습니다 · 이름을 지킨 포로 ${4-st.forgotten.length}/4.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 의식을 멈추지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_19_unsealed',st.unsealed.length);setStoryFlag(s,'mission_19_remembered',4-st.forgotten.length);setStoryFlag(s,'mission_19_memory',CAPTIVES.reduce((a,id)=>a+st.memory[id],0));},
 rewardContext(s){return {remembered19:4-s.missionState.forgotten.length};}
};
export const TEACHER19={take:'스승을 데려간다',leave:'스승을 두고 간다'};
export function chooseTeacher19(s,id){const c=s.campaign;if(!TEACHER19[id]||s.practice||c.choices?.m19_teacher||!c.completed?.includes(19))return false;c.choices??={};c.choices.m19_teacher=id;setStoryFlag(s,'mission_19_teacher_choice',id);return true;}

// ---------- M20 The Crown's Shadow ----------
export const cabinets20=s=>s.units.filter(u=>u.kind==='cabinet');
export const residents20=s=>s.units.filter(u=>u.kind==='resident');
const CABINETS=['cb1','cb2','cb3'],RESIDENTS=['h1','h2','h3','h4','h5','h6'];
const houseAt=(s,x,y)=>terrainAt(x,y,s)?.name==='Village';
// The fire is kept in missionState.fire (cells "x,y") and mirrored into s.burning each turn, so the board draws it and heroes
// standing in it take the usual burn; residents in a burning house take fireDamage each turn (it can kill).
function lightFire(s,cells){const st=s.missionState;for(const [x,y] of cells){const k=key(x,y);if(!st.fire.includes(k)&&houseAt(s,x,y))st.fire.push(k);}}
function syncFire(s){s.burning??={};for(const k of s.missionState.fire)s.burning[k]=2;}
function banner20(s){const f=s.missionState.banner;for(const u of s.units.filter(u=>u.scav&&!u.bannered)){u.look=scavengerLook16(f,u.scav);u.name=`${FACTIONS[f]?.name||'배신한 깃발'} ${u.scav==='archer'?'궁병':'병사'}`;u.faction=null;u.bannered=true;}}
export const M20={
 init(s){const m=missionOf(s),f=s.campaign.flags?.mission_14_betrayer||'iron';s.missionState={waves:[],banner:f,searched:[],lit:{},burned:[],evacuated:[],lost:[],fire:[],duelDone:false};
  for(const w of m.fires.filter(w=>w.turn<=1))lightFire(s,w.cells);syncFire(s);banner20(s);},
 clearLabel:'재상부 문서고와 하층가',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&!!FACTIONS[m.banner]
  &&['searched','burned'].every(k=>Array.isArray(m[k])&&m[k].every(id=>CABINETS.includes(id))&&new Set(m[k]).size===m[k].length)&&!m.searched.some(id=>m.burned.includes(id))
  &&!!m.lit&&typeof m.lit==='object'&&!Array.isArray(m.lit)&&Object.entries(m.lit).every(([id,t])=>CABINETS.includes(id)&&Number.isInteger(t)&&t>0)
  &&['evacuated','lost'].every(k=>Array.isArray(m[k])&&m[k].every(id=>RESIDENTS.includes(id))&&new Set(m[k]).size===m[k].length)&&!m.evacuated.some(id=>m.lost.includes(id))
  &&Array.isArray(m.fire)&&m.fire.length<=60&&m.fire.every(k=>/^\d{1,2},\d{1,2}$/.test(k))&&new Set(m.fire).size===m.fire.length&&typeof m.duelDone==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,lit=Object.keys(st.lit).length;return `계획서 ${st.searched.length}/${m.plan} 확보${lit?` · 불붙은 서가 ${lit}`:''}${st.burned.length?` · 탄 서가 ${st.burned.length}`:''} · 대피 ${st.evacuated.length}/${m.needed}${st.lost.length?` · 잃은 주민 ${st.lost.length}`:''} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `서가 ${f.mission_20_cabinets??st?.searched.length??0}/3 · 대피한 주민 ${f.mission_20_residents??st?.evacuated.length??0}/6 · 일기토 ${({hero:'승리',foe:'패배',skipped:'거절'})[f.mission_20_duel]||'—'}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState,prev=s.turn-1;act2Waves(s);banner20(s);
  if(s.turn===1)return;
  // the archive: a cabinet lit at the end of the enemy phase before last burns now; then clerks beside a cabinet light it
  for(const [id,t] of Object.entries(st.lit))if(t<prev){delete st.lit[id];const cb=findUnit(s,id);if(cb&&!st.searched.includes(id)){st.burned.push(id);cb.inert=true;cb.burned=true;s.feedback.push({type:'ignite',id,text:'재'});s.log.push('서가 하나가 불타 재가 되었습니다. 그 안의 계획서도 함께 사라졌습니다.');if(st.burned.length===1)enqueueStory(s,'20:burned');}}
  if(prev>=m.burnTurn)for(const c of s.units.filter(u=>u.clerk&&u.team==='enemy'&&alive(u))){const cb=cabinets20(s).find(o=>!o.inert&&!st.lit[o.id]&&distance(o,c)===1);if(!cb)continue;st.lit[cb.id]=prev;s.feedback.push({type:'ignite',id:cb.id,text:'불씨'});s.log.push(`${c.name}이(가) 서가에 불을 붙였습니다. 다음 적 턴이 끝나기 전에 조사해 꺼내세요.`);if(Object.keys(st.lit).length===1&&!st.burned.length)enqueueStory(s,'20:torch');}
  // the lower city: the fire spreads through the houses it touches and leaps on set turns
  const spread=[];for(const k of st.fire){const [x,y]=k.split(',').map(Number);for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]])if(houseAt(s,x+dx,y+dy))spread.push([x+dx,y+dy]);}lightFire(s,spread);
  for(const w of m.fires.filter(w=>w.turn===s.turn))lightFire(s,w.cells);syncFire(s);
  for(const r of residents20(s).filter(r=>alive(r)&&st.fire.includes(key(r.x,r.y)))){const n=Math.min(r.hp,m.fireDamage),fromHP=r.hp;r.hp-=n;s.feedback.push({type:'hit',id:r.id,text:`🔥 −${n}`,fromHP,toHP:r.hp,damage:n});s.log.push(`${r.name}: 불길에 ${n} 피해.`);M20.afterDamage(s,r);}
  if(s.turn===m.duelTurn&&!st.duelDone){st.duelDone=true;const sup=findUnit(s,'sup'),k=findUnit(s,'kai');if(sup&&alive(sup)&&k&&alive(k)&&startDuel(s,'kai','sup','20:duel'))enqueueStory(s,'20:duel');}},
 beforeEnemyPhase(){},
 // Clerks walk to the nearest cabinet still standing and stay beside it; the old superior keeps to the archive until
 // TURN 5; the grey cloaks fight the legion; the banner's soldiers (from the south gate) also go for the residents from TURN 4.
 planEnemy(s,u,reachable){const foes=foes92(s,u),st=s.missionState;
  if(u.clerk){const left=cabinets20(s).filter(o=>!o.inert);if(!left.length)return {x:u.x,y:u.y,target:null,reason:'문서고를 지킴'};const mine=findUnit(s,u.cabinet),cb=mine&&!mine.inert?mine:[...left].sort((a,b)=>distance(u,a)-distance(u,b))[0];
   if(distance(u,cb)===1)return {x:u.x,y:u.y,target:null,reason:'서가에 불을 붙임'};let best=null;for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},cb);if(!best||d<best.d||d===best.d&&c<best.c)best={x,y,d,c};}return {x:best.x,y:best.y,target:null,reason:`${cb.name} 쪽으로`};}
  if(u.id==='sup'&&s.turn<5)return strike92(s,u,within(reachable,(x,y)=>y<=4),foes,null);
  if(u.scav){const folk=s.turn>=missionOf(s).threatTurn?residents20(s).filter(alive):[];const goal=[...folk,...foes].sort((a,b)=>distance(u,a)-distance(u,b))[0];return strike92(s,u,reachable,[...foes,...folk],goal?{x:goal.x,y:goal.y,name:goal.name}:null,t=>t.kind==='resident'?6:0);}
  const near=[...foes].sort((a,b)=>distance(u,a)-distance(u,b))[0];return strike92(s,u,reachable,foes,near?{x:near.x,y:near.y,name:near.name}:null);},
 search(s,u,t){if(t.kind!=='cabinet')return false;const st=s.missionState;t.inert=true;st.searched.push(t.id);const wasLit=!!st.lit[t.id];delete st.lit[t.id];remember(s,`m20_archive_${u.id}`);
  s.feedback.push({type:'rescue',id:t.id,text:'계획서'});s.log.push(`${u.name}이(가) 서가에서 계획서 묶음을 꺼냈습니다${wasLit?' (불길을 끄고)':''} (${st.searched.length}/3).`);
  if(st.searched.length===1)enqueueStory(s,'20:plan');else if(st.searched.length===missionOf(s).plan)enqueueStory(s,'20:plan2');return true;},
 onAction(s,u,mode,t){if(mode!=='rescue'||t?.kind!=='resident')return;const st=s.missionState;if(!st.evacuated.includes(t.id))st.evacuated.push(t.id);remember(s,`m20_evacuate_${u.id}`);s.log.push(`${t.name}이(가) 다리 건너로 대피했습니다 (${st.evacuated.length}/6).`);if(st.evacuated.length===1)enqueueStory(s,'20:evacuate');},
 afterDamage(s,v){const st=s.missionState;if(v.kind==='resident'&&v.hp<=0&&!st.lost.includes(v.id)){st.lost.push(v.id);s.log.push(`${v.name}을(를) 잃었습니다.`);if(st.lost.length===1)enqueueStory(s,'20:lost');}
  if(v.id==='sup'&&v.hp<=0&&!st.yielded){st.yielded=true;enqueueStory(s,'20:yield');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.burned.length>=2)return finish(s,'defeat','서가 두 곳이 불타 계획서를 잃었습니다.');
  if(st.lost.length>=3)return finish(s,'defeat','하층가 주민 세 명을 잃었습니다.');
  if(st.searched.length>=m.plan&&st.evacuated.length>=m.needed)return finish(s,'victory',`계획서 확보 (서가 ${st.searched.length}/3) · 주민 ${st.evacuated.length}/6 대피.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 계획서와 주민을 모두 지키지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_20_cabinets',st.searched.length);setStoryFlag(s,'mission_20_residents',st.evacuated.length);setStoryFlag(s,'mission_20_duel',s.duel?.result||'none');},
 rewardContext(s){return {cabinets20:s.missionState.searched.length,residents20:s.missionState.evacuated.length};}
};
export const SUPERIOR20={release:'옛 상관을 놓아준다',trial:'재판에 넘긴다'};
export function chooseSuperior20(s,id){const c=s.campaign;if(!SUPERIOR20[id]||s.practice||c.choices?.m20_superior||!c.completed?.includes(20))return false;c.choices??={};c.choices.m20_superior=id;setStoryFlag(s,'mission_20_superior_choice',id);return true;}
export const PLAN20={send:'계획서 사본을 세 깃발에 보낸다',keep:'군단이 지닌다'};
export function choosePlan20(s,id){const c=s.campaign;if(!PLAN20[id]||s.practice||c.choices?.m20_plan||!c.completed?.includes(20))return false;c.choices??={};c.choices.m20_plan=id;setStoryFlag(s,'mission_20_plan_choice',id);return true;}
export const ACT3C_RULES={19:M19,20:M20};
