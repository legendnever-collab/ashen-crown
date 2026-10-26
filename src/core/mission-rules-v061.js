// v0.6.1 ACT II mission hooks (D-067; rules and numbers PROPOSED). M01–M08 never reach this module.
// M09 The Free City: escort the three delegates into the council hall (rescue); assassins on the rooftops hunt them;
// the assassin leader can be captured. M10 Two Lords' War: Oswin's blue-white army (faction a) and Brennan's orange
// army (faction b) fight each other; before battle the legion supports one of them (that army fights beside it and its
// lord does not fall) or mediates (capture both commanders: a captured lord's army stands down; both captured = truce).
import {missionOf} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust} from './factions.js';
import {joinRoster} from './roster.js';
import {act2Waves} from './mission-rules-v06.js';

const delegatesOf=s=>s.units.filter(u=>u.team==='civilian');
const lostOf=s=>delegatesOf(s).filter(v=>v.hp<=0).length;
const savedOf=s=>delegatesOf(s).filter(v=>v.hp>0).length; // rescued into the hall or still standing
const downOf=u=>!u||u.hp<=0||u.captured;
// Strike the best target in reach from the reachable cells; prefer the given targets.
function strikeFrom(s,u,reachable,targets,reason){let best=null;
 for(const [pos,c] of reachable){const [x,y]=pos.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;
  const f=strikeStats(s,a,t),score=f.damage+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`${reason} · ${t.name}`};}}
 return best;}
function holdPlan(s,u,reason){const t=s.units.filter(v=>alive(v)&&hostile(s,u,v)&&distance(u,v)>=u.range[0]&&distance(u,v)<=u.range[1]).sort((a,b)=>strikeStats(s,u,b).damage-strikeStats(s,u,a).damage)[0];
 return {x:u.x,y:u.y,target:t?.id||null,reason:t?`${reason} · 반격`:reason};}

// ---------- M09 The Free City ----------
export const M9={
 init(s){s.missionState={waves:[],captured:false};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'벨마르 의회 사수',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&typeof m.captured==='boolean';},
 status(s){const m=missionOf(s),boss=findUnit(s,'boss'),hall=delegatesOf(s).filter(v=>v.rescued).length;return `대표 피신 ${hall}/3${lostOf(s)?` · 잃은 대표 ${lostOf(s)}`:''} · ${s.missionState.captured?'우두머리 생포':boss&&!alive(boss)?'우두머리 격파':`우두머리 HP ${boss?Math.round(100*Math.max(0,boss.hp)/boss.maxHP):0}%`} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `의회 대표 ${f.mission_09_delegates_saved??savedOf(s)}/3 무사${(f.mission_09_assassin_captured||s.missionState?.captured)?' · 자객 우두머리 생포':''}`;},
 onTurnStart(s){act2Waves(s);if(s.turn===missionOf(s).threatTurn)enqueueStory(s,'9:threat');},
 beforeEnemyPhase(){},
 // Assassins hunt the delegates over the rooftops; the leader keeps to his roof until TURN 4, striking what comes close.
 planEnemy(s,u,reachable){if(!u.hunter)return null;
  if(u.id==='boss'&&s.turn<u.holdUntil)return holdPlan(s,u,'지붕 위에서 대기');
  const marks=delegatesOf(s).filter(alive);if(!marks.length)return null;
  const hit=strikeFrom(s,u,reachable,marks,'대표 암살 시도');if(hit)return hit;
  const goal=marks.sort((a,b)=>distance(u,a)-distance(u,b))[0];let dest={x:u.x,y:u.y,score:distance(u,goal)};
  for(const [p,c] of reachable){const [x,y]=p.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}
  return {x:dest.x,y:dest.y,target:null,reason:`지붕을 타고 ${goal.name} 쪽으로`};},
 onAction(s,u,mode,t){if(mode==='rescue'&&t?.team==='civilian'){enqueueStory(s,'9:hall');s.log.push(`${t.name}이(가) 의회 회관 안으로 피신했습니다.`);}},
 capture(s,u,t){t.rescued=true;t.captured=true;s.missionState.captured=true;setStoryFlag(s,'mission_09_assassin_captured');remember(s,`${u.id}_capture`);
  s.feedback.push({type:'rescue',id:t.id,text:'CAPTURED'});s.log.push(`${u.name}: 그림자 자객 우두머리를 생포했습니다.`);enqueueStory(s,'9:capture');},
 afterDamage(s,v){if(v.team==='civilian'&&v.hp<=0)enqueueStory(s,'9:lost');},
 checkOutcome(s,finish){const m=missionOf(s),boss=findUnit(s,'boss'),tail=` · 대표 ${savedOf(s)}/3 무사`;
  if(lostOf(s)>=2)return finish(s,'defeat','의회 대표를 두 명 이상 잃었습니다.');
  if(downOf(boss))return finish(s,'victory',`${s.missionState.captured?'자객 우두머리 생포':'자객 우두머리 격파'} · 습격대 퇴각${tail}.`);
  if(s.turn>m.turnLimit)return finish(s,'victory',`TURN ${m.turnLimit}까지 의회 사수${tail}.`);
 },
 beforeCommit(s){setStoryFlag(s,'mission_09_delegates_saved',savedOf(s));setStoryFlag(s,'mission_09_assassin_captured',!!s.missionState.captured);},
 afterVictory(s){if(s.practice)return;setStoryFlag(s,'act2_free_met');if(savedOf(s)===3)adjustTrust(s.campaign,'free',1,'M09 · 의회 대표 세 명을 모두 지켰다');},
 rewardContext(s){return {delegates:savedOf(s),captured9:!!s.missionState.captured};}
};

// ---------- M10 Two Lords' War ----------
const LORD={a:'boss',b:'boss2'},LORD_NAME={a:'오스윈 경',b:'브레넌 경'};
export const stanceOf=s=>s.campaign.choices?.m10_stance||null;
const armyOf=(s,side)=>s.units.filter(u=>u.faction===side);
// A supported lord's army fights beside the legion as allied troops (wave units too, when they arrive).
function applyStance(s){const st=stanceOf(s);if(st!=='a'&&st!=='b')return;for(const u of armyOf(s,st))if(u.team==='enemy'){u.team='allied';u.moved=false;u.acted=false;}}
function standDown(s,side){for(const u of armyOf(s,side))if(alive(u)){u.benched=true;u.withdrawn=true;}s.log.push(`${LORD_NAME[side]}의 군대가 무기를 내려놓았습니다.`);}
export const M10={
 init(s){s.missionState={waves:[],captured:[],failed:false};if(!s.practice)ensureTrust(s.campaign);applyStance(s);},
 clearLabel:'두 영주의 전쟁 종결',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.captured)&&m.captured.every(id=>['boss','boss2'].includes(id))&&typeof m.failed==='boolean';},
 status(s){const m=missionOf(s),st=stanceOf(s),c=s.missionState.captured,lord=id=>{const u=findUnit(s,id);return c.includes(id)?'생포':downOf(u)?'격파':`HP ${Math.round(100*Math.max(0,u.hp)/u.maxHP)}%`;};
  const saved=s.units.filter(v=>v.team==='civilian'&&v.rescued).length;
  return `${st==='a'?'오스윈 경 지원':st==='b'?'브레넌 경 지원':s.missionState.failed?'중재 실패':'중재'} · 오스윈 ${lord('boss')} · 브레넌 ${lord('boss2')} · 주민 ${saved}/3 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;const st=f.mission_10_stance||stanceOf(s);return `${st==='mediate'?(f.mission_10_mediated?'중재 성공 · 휴전':'중재 실패'):`${LORD_NAME[st]||''} 지원`} · 주민 ${f.mission_10_villagers_saved??0}/3 구출`;},
 onTurnStart(s){const m=missionOf(s);act2Waves(s);applyStance(s);if(s.turn===m.threatTurn)enqueueStory(s,'10:village');},
 beforeEnemyPhase(){},
 // Both lords hold their camps until TURN 5 (they strike what comes close).
 planEnemy(s,u){if(!['boss','boss2'].includes(u.id)||s.turn>=u.holdUntil)return null;return holdPlan(s,u,'본진 사수');},
 planAllied(s,u){if(!['boss','boss2'].includes(u.id)||s.turn>=u.holdUntil)return null;return holdPlan(s,u,'본진 사수');},
 afterDamage(s,v){const st=stanceOf(s);
  if(st&&v.id===LORD[st]&&v.team==='allied'&&v.hp<Math.ceil(v.maxHP/2)){v.hp=Math.ceil(v.maxHP/2);s.log.push(`${LORD_NAME[st]}의 친위대가 영주를 감싸 물러납니다.`);}
  if(st==='mediate'&&['boss','boss2'].includes(v.id)&&v.hp<=0&&!s.missionState.failed){s.missionState.failed=true;setStoryFlag(s,'mission_10_mediation_failed');enqueueStory(s,'10:mediate:fail');}},
 capture(s,u,t){t.rescued=true;t.captured=true;s.missionState.captured.push(t.id);remember(s,`${u.id}_capture`);const side=t.faction;
  s.feedback.push({type:'rescue',id:t.id,text:'CAPTURED'});s.log.push(`${u.name}: ${LORD_NAME[side]}을(를) 생포했습니다.`);standDown(s,side);enqueueStory(s,`10:capture:${side}`);
  if(stanceOf(s)==='mediate'&&s.missionState.captured.length===2&&!s.missionState.failed){s.truce=true;enqueueStory(s,'10:truce');}},
 checkOutcome(s,finish){const m=missionOf(s),st=stanceOf(s)||'mediate',a=findUnit(s,'boss'),b=findUnit(s,'boss2'),saved=s.units.filter(v=>v.team==='civilian'&&v.rescued).length,tail=` · 주민 ${saved}/3 구출`;
  if(st==='a'&&downOf(b))return finish(s,'victory',`오스윈 경 지원 · 브레넌 경 ${b.captured?'생포':'격파'}${tail}.`);
  if(st==='b'&&downOf(a))return finish(s,'victory',`브레넌 경 지원 · 오스윈 경 ${a.captured?'생포':'격파'}${tail}.`);
  if(st==='mediate'&&a.captured&&b.captured&&!s.missionState.failed)return finish(s,'victory',`중재 성공 · 두 영주 생포, 휴전${tail}.`);
  if(st==='mediate'&&downOf(a)&&downOf(b))return finish(s,'victory',`전투 종결 · 중재 실패${tail}.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 두 영주의 전쟁을 멈추지 못했습니다.`);
 },
 beforeCommit(s){const st=stanceOf(s)||'mediate';setStoryFlag(s,'mission_10_stance',st);setStoryFlag(s,'mission_10_mediated',st==='mediate'&&!s.missionState.failed&&s.missionState.captured.length===2);
  setStoryFlag(s,'mission_10_villagers_saved',s.units.filter(v=>v.team==='civilian'&&v.rescued).length);},
 // Free Lords trust (PROPOSED): ending the war for one lord +1, a truce +2, a failed mediation 0. Dario joins when the
 // League trusts the legion or the mediation held.
 afterVictory(s){if(s.practice)return;const f=s.campaign.flags,st=f.mission_10_stance;setStoryFlag(s,'act2_free_met');
  if(st==='a'||st==='b')adjustTrust(s.campaign,'free',1,`M10 · ${LORD_NAME[st]}을 도와 전쟁을 끝냈다`);else if(f.mission_10_mediated)adjustTrust(s.campaign,'free',2,'M10 · 두 영주를 생포해 휴전을 끌어냈다');
  const ok=darioEligible(s.campaign);setStoryFlag(s,'dario_joined',ok);if(ok){joinRoster(s,'dario',9);s.stageStart=null;}},
 rewardContext(s){return {villagers10:s.units.filter(v=>v.team==='civilian'&&v.rescued).length,mediated:!!s.campaign.flags.mission_10_mediated};}
};
export const darioEligible=c=>ensureTrust(c).free>=1||!!c.flags?.mission_10_mediated;
// The stance is chosen once, on the deployment screen (PROPOSED: the trust change comes with the victory).
export function chooseStance(s,id){if(!['a','b','mediate'].includes(id)||s.practice||s.campaign.choices?.m10_stance)return false;s.campaign.choices.m10_stance=id;setStoryFlag(s,'mission_10_stance',id);applyStance(s);return true;}
export const ACT2B_RULES={9:M9,10:M10};
