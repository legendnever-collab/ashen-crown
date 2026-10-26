// v0.7.1 ACT II part 2 mission hooks (D-068 §3–§6, D-071; rules and numbers PROPOSED). M01–M12 never reach this module.
// M13 The Black Lion's Decision: Baldrick's lion formation marches on the refugee camp; resolve (ACT I–II choices, Erik's
// persuasion, Thea's word, turns the camp is kept unharmed) halts him at 6 — or break the formation, or hold to TURN 12.
// M14 The Broken Alliance: escort the three leaders to the southern exit while masked raiders hunt them; on TURN 4 the
// banner that trusts the legion least turns on it (its leader leaves, its guards attack).
import {missionOf} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust,FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';

// ---------- M13 The Black Lion's Decision ----------
const campOf=s=>s.units.filter(u=>u.team==='civilian');
const campLost=s=>campOf(s).filter(v=>v.hp<=0).length;
const bearers13=s=>missionOf(s).formation.bearers.map(id=>findUnit(s,id)).filter(Boolean);
const lionFloor13=b=>Math.ceil(b.maxHP/2);
// Resolve carried in from ACT I–II (PROPOSED, D-068 §6): Erik's answer at the ridge, the canyon order kept, the Iron Crown's trust.
export function resolveSources(c){const out=[];if(c?.choices?.m05_erik_answer==='acknowledged')out.push('m05');if(c?.choices?.m08_order==='hold')out.push('m08');if((c?.factionTrust?.iron??0)>=2)out.push('iron');return out;}
const RESOLVE_KO={m05:'M05 "구해 주신 목숨입니다"',m08:'M08 협곡 사수 명령',iron:'철왕관 신뢰 2 이상',eric:'에릭의 설득',thea:'테아의 말',camp:'야영지를 지킨 턴'};
function addResolve(s,why){const st=s.missionState,m=missionOf(s);if(st.halted)return;st.resolve++;st.sources.push(why);s.feedback.push({type:'potential',id:'boss',text:`결단 ${st.resolve}/${m.persuade.threshold}`});
 s.log.push(`발드릭의 결단 +1 (${RESOLVE_KO[why]||why}) · ${st.resolve}/${m.persuade.threshold}`);
 if(st.resolve>=m.persuade.threshold){st.halted=true;for(const e of s.units.filter(u=>u.team==='enemy'&&alive(u))){e.benched=true;e.withdrawn=true;}enqueueStory(s,'13:halt');s.log.push('발드릭이 손을 들어 군을 멈춥니다. 철왕관 병사들이 무기를 내립니다.');}
 else if(st.resolve===m.persuade.threshold-1)enqueueStory(s,'13:waver');}
export const M13={
 init(s){const src=resolveSources(s.campaign);s.missionState={waves:[],resolve:src.length,sources:[...src],persuadedTurn:null,thea:false,calm:0,campHP:null,halted:false,withdrew:null};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'피난민 야영지 사수',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Number.isInteger(m.resolve)&&m.resolve>=0&&m.resolve<=12&&Array.isArray(m.sources)&&m.sources.every(v=>RESOLVE_KO[v])&&(m.persuadedTurn===null||Number.isInteger(m.persuadedTurn))&&typeof m.thea==='boolean'&&[0,1,2].includes(m.calm)&&(m.campHP===null||Number.isInteger(m.campHP))&&typeof m.halted==='boolean'&&[null,'broken','held'].includes(m.withdrew);},
 status(s){const m=missionOf(s),st=s.missionState,b=findUnit(s,'boss'),down=bearers13(s).filter(u=>!alive(u)).length;
  return `결단 ${st.resolve}/${m.persuade.threshold}${st.halted?' · 군을 멈춤':''} · 기수 격파 ${down}/3 · 발드릭 HP ${Math.round(100*Math.max(0,b.hp)/b.maxHP)}% · 피난민 ${campOf(s).filter(v=>v.hp>0).length}/4 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,r=f.mission_13_baldrick;return `${r==='halted'?'발드릭이 군을 멈춤':r==='broken'?'사자 대형 붕괴 · 퇴각':r==='held'?'야영지 사수 · 퇴각':'결단 '+(s.missionState?.resolve??0)} · 피난민 ${f.mission_13_refugees??campOf(s).filter(v=>v.hp>0).length}/4`;},
 // Calm: from TURN 4, every enemy phase in which no one in the camp is hurt adds 1 (at most 2).
 beforeEnemyPhase(s){s.missionState.campHP=campOf(s).reduce((a,v)=>a+Math.max(0,v.hp),0);},
 onTurnStart(s){const st=s.missionState,m=missionOf(s);act2Waves(s);
  if(st.campHP!==null&&s.turn-1>=m.threatTurn&&st.calm<2&&!st.halted&&campOf(s).reduce((a,v)=>a+Math.max(0,v.hp),0)>=st.campHP){st.calm++;addResolve(s,'camp');}st.campHP=null;},
 persuade(s,u,t){const st=s.missionState;if(u.id==='eric'){st.persuadedTurn=s.turn;remember(s,'m13_persuade');enqueueStory(s,'13:persuade');}else if(u.id==='thea'){st.thea=true;remember(s,'m13_thea');enqueueStory(s,'13:thea');}
  s.feedback.push({type:'guard',id:u.id,text:'설득'});addResolve(s,u.id);},
 afterDamage(s,v){if(v.id==='boss'&&v.hp<lionFloor13(v)){v.hp=lionFloor13(v);s.log.push('발드릭은 쓰러지지 않습니다. 더 이상의 피해는 막아 냅니다.');}if(v.team==='civilian'&&v.hp<=0)enqueueStory(s,'13:lost');},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState,boss=findUnit(s,'boss'),tail=` · 피난민 ${campOf(s).filter(v=>v.hp>0).length}/4 · 결단 ${st.resolve}`;
  if(campLost(s)>=2)return finish(s,'defeat','야영지 피난민을 두 명 이상 잃었습니다.');
  if(st.halted)return finish(s,'victory',`발드릭이 카시안의 명령을 거두고 군을 멈췄습니다${tail}.`);
  if(bearers13(s).every(b=>!alive(b))&&boss.hp<=lionFloor13(boss)&&s.turn>=(m.lionHold||1)){st.withdrew='broken';boss.withdrawn=true;return finish(s,'victory',`사자 대형 붕괴 · 발드릭 퇴각${tail}.`);}
  if(s.turn>m.turnLimit){st.withdrew='held';boss.withdrawn=true;return finish(s,'victory',`TURN ${m.turnLimit}까지 야영지 사수 · 발드릭 퇴각${tail}.`);}
 },
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_13_baldrick',st.halted?'halted':st.withdrew||'held');setStoryFlag(s,'mission_13_resolve',st.resolve);setStoryFlag(s,'mission_13_refugees',campOf(s).filter(v=>v.hp>0).length);},
 // Baldrick halting the army breaks Cassian's order: Iron Crown trust −1 (PROPOSED). A withdrawal changes nothing.
 afterVictory(s){if(s.practice)return;if(s.missionState.halted)adjustTrust(s.campaign,'iron',-1,'M13 · 발드릭이 카시안의 명령을 거두었다');},
 rewardContext(s){return {halted13:!!s.missionState.halted,refugees13:campOf(s).filter(v=>v.hp>0).length};}
};

// ---------- M14 The Broken Alliance ----------
export const LEADERS={iron:'cassian',free:'leonora',flame:'lucien'};
export const RECRUIT_OF={iron:'thea',free:'dario',flame:'ines'};
const leaders14=s=>Object.values(LEADERS).map(id=>findUnit(s,id)).filter(Boolean);
// The banner that betrays: the lowest trust; ties go Iron Crown → Free Lords → Sacred Flame (D-068 §4).
export function betrayer(c){const t=ensureTrust(c);return ['iron','free','flame'].reduce((a,f)=>t[f]<t[a]?f:a,'iron');}
const loyal=s=>leaders14(s).filter(l=>l.faction!==s.missionState.betrayer);
const arrived14=s=>loyal(s).filter(l=>l.rescued&&!l.withdrawn).length;
function turnCoat(s){const st=s.missionState,m=missionOf(s);if(st.betrayer)return;const f=betrayer(s.campaign);st.betrayer=f;
 for(const u of s.units.filter(u=>u.team==='allied'&&u.faction===f&&alive(u))){if(u.leader){u.benched=true;u.withdrawn=true;s.feedback.push({type:'rescue',id:u.id,text:'LEAVES'});}else{u.team='enemy';u.betrayed=true;u.moved=false;u.acted=false;delete u.post;}}
 s.log.push(`${FACTIONS[f].name}의 깃발이 군단에 칼을 돌립니다! ${FACTIONS[f].leader}은(는) 전장을 떠나고 호위병이 적이 됩니다.`);enqueueStory(s,`14:betray:${f}`);}
// Leaders walk to the exit (south), striking what blocks them; guards keep beside their leader.
function exitPlan(s,u,reachable){const m=missionOf(s),foes=s.units.filter(t=>alive(t)&&hostile(s,u,t));let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),danger=foes.filter(e=>distance(e,{x,y})<=1).length,score=y*10-danger*6-c*.1+(y>=m.exitRow?100:0);if(!best||score>best.score)best={x,y,score};}
 const at={...u,x:best.x,y:best.y},t=foes.filter(e=>distance(at,e)>=u.range[0]&&distance(at,e)<=u.range[1]).sort((a,b)=>a.hp-b.hp)[0];
 return {x:best.x,y:best.y,target:t?.id||null,reason:t?`출구로 · ${t.name} 공격`:'남쪽 출구로'};}
function guardPlan(s,u,reachable){const lead=findUnit(s,LEADERS[u.faction]),foes=s.units.filter(t=>alive(t)&&hostile(s,u,t)),goal=lead&&alive(lead)?lead:{x:u.x,y:missionOf(s).exitRow};let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal);if(d>3&&goal===lead)continue;
  for(const t of foes){const r=distance({x,y},t);if(r<u.range[0]||r>u.range[1])continue;const f=strikeStats(s,{...u,x,y},t),score=f.damage+(t.hp<=f.damage?30:0)+(t.masked&&lead&&distance(t,lead)<=2?20:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`지도자 호위 · ${t.name} 공격`};}}
 if(best)return best;let dest={x:u.x,y:u.y,score:Infinity};for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=Math.abs(distance({x,y},goal)-1)+c*.01-(goal!==lead?y*.1:0);if(d<dest.score)dest={x,y,score:d};}
 return {x:dest.x,y:dest.y,target:null,reason:'지도자 곁 호위'};}
export const M14={
 init(s){s.missionState={waves:[],betrayer:null,arrived:[]};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'세 지도자 호위',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&(m.betrayer===null||!!FACTIONS[m.betrayer])&&Array.isArray(m.arrived)&&m.arrived.every(id=>Object.values(LEADERS).includes(id));},
 status(s){const m=missionOf(s),st=s.missionState,b=st.betrayer;const row=id=>{const l=findUnit(s,id);return `${l.name.split(' · ')[0]} ${l.faction===b?'이탈':l.rescued?'도착':l.hp<=0?'쓰러짐':`HP ${Math.round(100*l.hp/l.maxHP)}%`}`;};
  return `${Object.values(LEADERS).map(row).join(' · ')}${b?'':` · 배신 TURN ${m.betrayTurn}`} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `배신한 깃발: ${FACTIONS[f.mission_14_betrayer||s.missionState?.betrayer]?.name||'—'} · 출구 도착 ${f.mission_14_arrived??arrived14(s)}/2`;},
 onTurnStart(s){const m=missionOf(s);act2Waves(s);if(s.turn===m.betrayTurn)turnCoat(s);},
 beforeEnemyPhase(){},
 // Masked raiders hunt the leaders first (the ledger cord's men; no faction).
 planEnemy(s,u,reachable){if(!u.masked)return null;const marks=leaders14(s).filter(l=>alive(l)&&l.team==='allied');if(!marks.length)return null;let best=null;
  for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of s.units.filter(t=>alive(t)&&hostile(s,u,t))){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+(t.leader?25:0)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:t.leader?`지도자 습격 · ${t.name}`:`공격 · ${t.name}`};}}
  if(best)return best;const goal=marks.sort((a,b)=>distance(u,a)-distance(u,b))[0];let dest={x:u.x,y:u.y,score:distance(u,goal)};
  for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name} 추적`};},
 planAllied(s,u,reachable){if(s.turn<2&&u.leader)return {x:u.x,y:u.y,target:null,reason:'회담장 정리'};return u.leader?exitPlan(s,u,reachable):guardPlan(s,u,reachable);},
 afterDamage(s,v){if(v.leader&&v.hp<=0)enqueueStory(s,`14:fallen:${v.id}`);},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  // a leader on the exit row leaves the field safely
  for(const l of leaders14(s))if(alive(l)&&l.team==='allied'&&l.y>=m.exitRow&&!l.rescued){l.rescued=true;st.arrived.push(l.id);s.feedback.push({type:'rescue',id:l.id,text:'EXIT'});s.log.push(`${l.name}이(가) 출구를 빠져나갔습니다.`);enqueueStory(s,'14:arrive');}
  const fallen=leaders14(s).filter(l=>l.hp<=0).length,live=loyal(s).filter(l=>l.rescued||alive(l)).length;
  if(fallen>=2||(st.betrayer&&live<2))return finish(s,'defeat','지도자를 지키지 못했습니다.');
  if(st.betrayer&&arrived14(s)>=2)return finish(s,'victory',`지도자 ${arrived14(s)}명 출구 도착${st.betrayer?` · ${FACTIONS[st.betrayer].name} 이탈`:''}.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 지도자들을 출구로 보내지 못했습니다.`);
 },
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_14_betrayer',st.betrayer||betrayer(s.campaign));setStoryFlag(s,'mission_14_arrived',arrived14(s));
  setStoryFlag(s,'mission_14_escort',s.units.filter(u=>u.team==='allied'&&!u.betrayed&&(u.hp>0)&&u.faction!==s.missionState.betrayer).length);},
 // Trust (PROPOSED, D-068 §4): the betraying banner −1, each banner that stood by the legion +1. A recruit of the betraying
 // banner stays when they fought in this battle and stood to the end, or when their banner still trusts the legion;
 // otherwise they leave (kept aside for ACT III).
 afterVictory(s){if(s.practice)return;const c=s.campaign,f=s.missionState.betrayer||betrayer(c);setStoryFlag(s,'act2_completed');
  for(const g of ['iron','free','flame'])adjustTrust(c,g,g===f?-1:1,g===f?'M14 · 회담장에서 군단에 칼을 돌렸다':'M14 · 습격 속에서 군단과 함께 물러났다');
  const r=RECRUIT_OF[f];if(!c.roster?.includes(r)){setStoryFlag(s,'mission_14_recruit','none');return;}
  const u=findUnit(s,r),fought=!!u&&!u.benched&&u.hp>0,stays=fought||ensureTrust(c)[f]>=1;setStoryFlag(s,'mission_14_recruit',stays?'stayed':'left');if(!stays)departRoster(s,r);},
 rewardContext(s){return {arrived14:arrived14(s)};} // economy reads the committed flags
};
// A recruit leaves the legion: the record is kept aside (campaign.departed) for a later return; equipment slots stay.
export function departRoster(s,id){const c=s.campaign;c.roster=(c.roster||[]).filter(x=>x!==id);c.departed??={};const rec=c.heroes?.find(h=>h.id===id)||findUnit(s,id);
 if(rec)c.departed[id]=structuredClone({...rec,x:undefined,y:undefined});if(Array.isArray(c.heroes))c.heroes=c.heroes.filter(h=>h.id!==id);
 for(const f of [s.frontier,c.frontier])if(f){f.members=f.members.filter(x=>x!==id);delete f.affiliation[id];}
 const u=findUnit(s,id);if(u){u.benched=true;}s.missionStart=s.missionStart?.filter(m=>m.id!==id);s.units=s.units.filter(x=>x.id!==id);s.stageStart=null;}
export const ACT2D_RULES={13:M13,14:M14};
