// v0.9.1 ACT III part 2 mission hooks (D-084, docs/v0.9.0/ACT3_DESIGN.md §4.1; rules and numbers PROPOSED).
// M01–M16 never reach this module.
// M17 The Guardians' Oath: four sleeping guardian statues around the keep (an oath wakes one for the legion; an enemy left
// beside a sleeping one wakes it for the chancellery), the Book of Oaths in the archive at the keep's back.
// M18 The Unburning Forest: rain, the ward at the forest's heart, three ward trees the loggers come for, six forest-keepers.
import {missionOf,scavengerLook16} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';

function strike91(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const foes91=(s,u)=>s.units.filter(t=>alive(t)&&t.team!=='civilian'&&hostile(s,u,t));

// ---------- M17 The Guardians' Oath ----------
export const statues17=s=>s.units.filter(u=>u.kind==='statue');
const onArchive=(s,u)=>missionOf(s).archive.some(([x,y])=>u.x===x&&u.y===y);
// A statue wakes: it takes the guardian's numbers and stands for one side (`side`: 'ally' → allied, 'enemy').
function wake17(s,t,side,by){const m=missionOf(s),st=s.missionState;if(t.team!=='object')return false;Object.assign(t,{...m.statue,maxHP:m.statue.hp,range:[1,1],team:side==='ally'?'allied':'enemy',woke:side,name:side==='ally'?'수호 석상':'깨어난 석상',moved:false,acted:false,post:{x:t.x,y:t.y},leash:2});
 delete t.inert;(side==='ally'?st.sworn:st.claimed).push(t.id);s.feedback.push({type:side==='ally'?'rescue':'spawn',id:t.id,text:side==='ally'?'맹세':'재상부 편'});
 s.log.push(side==='ally'?`${by.name}이(가) 맹세하자 ${t.name}이 눈을 뜹니다. 군단 편에서 싸웁니다.`:`석상 곁에 선 재상부 병사가 무언가를 읊습니다. 석상이 재상부 편으로 깨어납니다.`);
 enqueueStory(s,side==='ally'?(by.id==='ines'?'17:oath:ines':'17:oath'):'17:claimed');return true;}
export const M17={
 init(s){s.missionState={waves:[],sworn:[],claimed:[],held:0,heldMax:0};},
 clearLabel:'수호자 성채의 서고 사수',
 validState(m){const ids=['st1','st2','st3','st4'];return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&['sworn','claimed'].every(k=>Array.isArray(m[k])&&m[k].every(id=>ids.includes(id)))&&new Set([...m.sworn,...m.claimed]).size===m.sworn.length+m.claimed.length&&Number.isInteger(m.held)&&m.held>=0&&m.held<=2&&Number.isInteger(m.heldMax)&&m.heldMax>=m.held;},
 status(s){const m=missionOf(s),st=s.missionState;return `서고 사수 · 맹세한 석상 ${st.sworn.length}/4${st.claimed.length?` · 빼앗긴 석상 ${st.claimed.length}`:''}${st.held?` · 서고 점거 ${st.held}/2`:''} · ${Math.max(0,m.holdTurn+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `석상 맹세 ${f.mission_17_sworn??s.missionState?.sworn.length??0}/4 · 서고 ${(f.mission_17_archive??(s.missionState?.heldMax?'touched':'clean'))==='clean'?'한 번도 밟히지 않음':'밟힘'}`;},
 onTurnStart(s){const st=s.missionState;act2Waves(s);
  // the archive: an enemy standing on it after the enemy phase counts; two in a row and the book is lost
  if(s.turn>1){const on=s.units.some(u=>u.team==='enemy'&&alive(u)&&onArchive(s,u));st.held=on?st.held+1:0;st.heldMax=Math.max(st.heldMax,st.held);if(st.held===1){s.log.push('재상부 병사가 서고에 들어섰습니다. 다음 적 턴이 끝날 때까지 몰아내세요.');enqueueStory(s,'17:archive');}}
  // a sleeping statue with an enemy beside it and no hero beside it wakes for the chancellery
  for(const t of statues17(s).filter(t=>t.team==='object')){const foe=s.units.find(u=>u.team==='enemy'&&alive(u)&&!u.kind?.startsWith('statue')&&distance(u,t)===1),hero=s.units.some(u=>u.team==='ally'&&alive(u)&&!u.benched&&distance(u,t)===1);if(foe&&!hero)wake17(s,t,'enemy',foe);}},
 beforeEnemyPhase(){},
 planEnemy(s,u,reachable){if(u.woke)return null;const foes=foes91(s,u),sleeping=statues17(s).filter(t=>t.team==='object');
  // the chancellery goes for the archive; on the way it stops beside a sleeping statue it can reach
  const nearStatue=sleeping.find(t=>[...reachable.keys()].some(k=>{const [x,y]=k.split(',').map(Number);return distance({x,y},t)===1;}));
  // the captain keeps to the rear with his guard until TURN 6
  if(u.kind==='captain'&&s.turn<6)return strike91(s,u,new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return y>=11;})),foes,null);
  const goal={x:missionOf(s).archive[0][0],y:missionOf(s).archive[0][1],name:'서고'};
  const strike=strike91(s,u,reachable,foes,null,t=>onArchive(s,u)?0:t.id==='sain'?6:0);if(strike.target)return strike;
  if(nearStatue&&u.kind!=='captain'&&u.range[1]===1){let best=null;for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number);if(distance({x,y},nearStatue)===1&&(!best||c<best.c))best={x,y,c};}if(best)return {x:best.x,y:best.y,target:null,reason:'잠든 석상 곁으로'};}
  return strike91(s,u,reachable,foes,goal);},
 search(s,u,t){if(t.kind!=='statue')return false;remember(s,`m17_oath_${u.id}`);return wake17(s,t,'ally',u);},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState,cap=findUnit(s,'gcap');
  if(st.held>=2)return finish(s,'defeat','재상부가 서고를 점거했습니다. 「맹세의 서」를 빼앗겼습니다.');
  if(cap&&!alive(cap))return finish(s,'victory',`재상부 대장 격파 · 맹세한 석상 ${st.sworn.length}/4.`);
  if(s.turn>m.holdTurn)return finish(s,'victory',`TURN ${m.holdTurn}까지 서고를 지켰습니다 · 맹세한 석상 ${st.sworn.length}/4.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_17_sworn',st.sworn.length);setStoryFlag(s,'mission_17_claimed',st.claimed.length);setStoryFlag(s,'mission_17_archive',st.heldMax?'touched':'clean');},
 rewardContext(s){return {sworn17:s.missionState.sworn.length};}
};
export const OATH17={leave:'맹세의 서를 수호자에게 남긴다',take:'군단이 가져간다'};
export function chooseOath17(s,id){const c=s.campaign;if(!OATH17[id]||s.practice||c.choices?.m17_oath||!c.completed?.includes(17))return false;c.choices??={};c.choices.m17_oath=id;setStoryFlag(s,'mission_17_oath_choice',id);return true;}

// ---------- M18 The Unburning Forest ----------
export const trees18=s=>s.units.filter(u=>u.kind==='wardTree');
// The loggers (and those arriving later) wear the look of the banner that betrayed the legion at the summit.
function banner18(s){const f=s.missionState.banner;for(const u of s.units.filter(u=>u.scav&&!u.bannered)){u.look=scavengerLook16(f,u.scav==='captain'?'captain':u.scav);u.name=u.scav==='captain'?`${FACTIONS[f]?.name||'배신한 깃발'} 벌목대장`:u.scav==='archer'?`${FACTIONS[f]?.name||'배신한 깃발'} 횃불병`:`${FACTIONS[f]?.name||'배신한 깃발'} 벌목대`;u.faction=null;u.bannered=true;}}
export const M18={
 init(s){const f=s.campaign.flags?.mission_14_betrayer||'iron';s.missionState={waves:[],sheltered:[],banner:f};banner18(s);},
 clearLabel:'불타지 않는 숲의 고목 수호',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.sheltered)&&m.sheltered.every(id=>/^f[1-6]$/.test(id))&&new Set(m.sheltered).size===m.sheltered.length&&!!FACTIONS[m.banner];},
 status(s){const m=missionOf(s),st=s.missionState,up=trees18(s).filter(alive).length;return `결계 고목 ${up}/3 · 숲지기 ${st.sheltered.length}/6 결계 안 · 비 · ${Math.max(0,m.holdTurn+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `고목 ${f.mission_18_trees??trees18(s).filter(alive).length}/3 · 숲지기 ${f.mission_18_keepers??s.missionState?.sheltered.length??0}/6`;},
 onTurnStart(s){act2Waves(s);banner18(s);},
 beforeEnemyPhase(){},
 // Loggers go for the nearest standing ward tree and strike it before anything else; torchbearers shoot heroes.
 planEnemy(s,u,reachable){const foes=foes91(s,u);
  // the logging captain directs from the southern road until TURN 6
  if(u.kind==='captain'&&s.turn<6)return strike91(s,u,new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return y>=11;})),foes,null);
  if(!u.logger)return strike91(s,u,reachable,[...foes.filter(t=>t.kind!=='wardTree'),...(s.turn>=missionOf(s).threatTurn?s.units.filter(c=>c.kind==='forester'&&alive(c)&&!c.rescued):[])],null,t=>t.kind==='forester'?10:0);
  const trees=trees18(s).filter(alive),tree=[...trees].sort((a,b)=>distance(u,a)-distance(u,b))[0];
  return strike91(s,u,reachable,foes,tree?{x:tree.x,y:tree.y,name:'결계 고목'}:null,t=>t.kind==='wardTree'?24:0);},
 planAllied(s,u){if(u.kind==='wardTree')return {x:u.x,y:u.y,target:null,reason:'뿌리를 내린 고목'};return null;},
 onAction(s,u,mode,t){if(mode!=='rescue'||t?.kind!=='forester')return;const st=s.missionState;if(!st.sheltered.includes(t.id))st.sheltered.push(t.id);remember(s,`m18_keeper_${u.id}`);s.log.push(`${u.name}이(가) ${t.name}을(를) 결계 안으로 이끌었습니다 (${st.sheltered.length}/6).`);if(st.sheltered.length===1)enqueueStory(s,'18:keeper');},
 afterDamage(s,v){if(v.kind==='wardTree'&&v.hp<=0){s.log.push('결계 고목 한 그루가 쓰러졌습니다.');enqueueStory(s,'18:tree');}},
 checkOutcome(s,finish){const m=missionOf(s),down=trees18(s).filter(t=>!alive(t)).length,cap=findUnit(s,'lcap');
  if(down>=2)return finish(s,'defeat','결계 고목 두 그루가 쓰러졌습니다. 숲의 결계가 무너집니다.');
  if(cap&&!alive(cap))return finish(s,'victory',`벌목대장 격파 · 고목 ${3-down}/3 · 숲지기 ${s.missionState.sheltered.length}/6.`);
  if(s.turn>m.holdTurn)return finish(s,'victory',`TURN ${m.holdTurn}까지 숲을 지켰습니다 · 고목 ${3-down}/3 · 숲지기 ${s.missionState.sheltered.length}/6.`);},
 beforeCommit(s){setStoryFlag(s,'mission_18_trees',trees18(s).filter(alive).length);setStoryFlag(s,'mission_18_keepers',s.missionState.sheltered.length);},
 rewardContext(s){return {trees18:trees18(s).filter(alive).length,keepers18:s.missionState.sheltered.length};}
};
export const TRUTH18={tell:'장로에게 잃는 기억의 진실을 말한다',keep:'말하지 않는다'};
export function chooseTruth18(s,id){const c=s.campaign;if(!TRUTH18[id]||s.practice||c.choices?.m18_truth||!c.completed?.includes(18))return false;c.choices??={};c.choices.m18_truth=id;setStoryFlag(s,'mission_18_truth_choice',id);return true;}
export const ACT3B_RULES={17:M17,18:M18};
