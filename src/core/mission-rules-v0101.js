// v0.10.1 ACT IV 「잿빛 왕관」 part 2 「검은 사자」 mission hooks (D-099/D-102, docs/v0.10.0/ACT4_DESIGN.md §4.1, §5.2; rules and
// numbers PROPOSED). M01–M24 never reach this module.
// M25 The Banners of the Three Houses: the banner that betrayed at M14 holds the north camp under its hardline captain; the
// other two hold the west and east camps — as allies when the legion is their 「동맹」 (trust 3), otherwise neutral (they
// fight only the betrayers and the legion cannot strike them). The captain falls with both leaders standing: victory.
// M26 The Black Lion's Last Battle: Baldrick's duel and persuasion; he joins, rides beside the legion, or withdraws.
import {missionOf} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust,FACTIONS} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';
import {betrayer as betrayer14} from './mission-rules-v071.js';
import {joinRoster} from './roster.js';
import {startDuel} from './duel.js';

function strike101(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const within101=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));
const nearest101=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0];
const goalOf101=t=>t?{x:t.x,y:t.y,name:t.name}:null;

// ---------- M25 The Banners of the Three Houses ----------
export const BANNERS=['iron','free','flame'];
export const LEADER_OF={iron:'cassian',free:'leonora',flame:'lucien'};
const LEADER_NAME={iron:'카시안 · 철왕관 통령',free:'레오노라 · 연맹 의장',flame:'루시안 · 성화 대사제'};
const SHORT={iron:'철왕관',free:'연맹',flame:'성화'};
// Each banner's soldiers keep the painted figures they already have (D-094).
const LOOK25={iron:{spear:'ironInfantry',archer:'ironArcher',cavalry:'cavalry',captain:'ironSpear',guard:'ironInfantry'},free:{spear:'mercSpear',archer:'archer',cavalry:'cavalry',captain:'mercSpear',guard:'guard'},flame:{spear:'flameKnight',archer:'flameKnight',cavalry:'cavalry',captain:'flameKnight',guard:'flameKnight'}};
export const ALLY_TRUST25=3;
// Which banner holds which camp: the north is the M14 betrayer; the west and east the other two in Iron → Free → Flame order.
export function camps25(c){const b=c?.flags?.mission_14_betrayer&&BANNERS.includes(c.flags.mission_14_betrayer)?c.flags.mission_14_betrayer:betrayer14(c),rest=BANNERS.filter(f=>f!==b);return {north:b,west:rest[0],east:rest[1]};}
export const allied25=(c,f)=>(ensureTrust(c)[f]??0)>=ALLY_TRUST25;
const leaders25=s=>['lw','le'].map(id=>findUnit(s,id)).filter(Boolean);
export const M25={
 init(s){const c=s.campaign,camps=camps25(c),neutral=[];
  for(const u of s.units.filter(u=>u.camp)){const f=camps[u.camp],look=LOOK25[f];u.banner=f;
   if(u.camp==='north'){u.faction=f;u.look=look[u.kind]||look.spear;if(u.id==='hc')u.name=`${SHORT[f]} 강경파 대장`;else u.name=`${SHORT[f]} 강경파 ${u.kind==='archer'?'궁수':u.kind==='cavalry'?'기병':'병사'}`;continue;}
   if(u.leader){u.look=LEADER_OF[f];u.name=LEADER_NAME[f];}else{u.look=u.kind==='archer'?look.archer:look.guard;u.name=`${SHORT[f]} ${u.kind==='archer'?'궁수':'호위병'}`;}
   u.post={x:u.x,y:u.y};u.leash=u.leader?1:3;
   if(allied25(c,f)){u.faction=f;u.orderable=true;}else{u.team='enemy';u.faction='neutral';u.neutral=true;neutral.push(u.id);}}
  s.missionState={waves:[],camps,neutral,captain:false,fallenLeader:null};enqueueStory(s,`25:reason:${camps.north}`);if(neutral.length<8)enqueueStory(s,'25:allied');if(neutral.length)enqueueStory(s,'25:neutral');},
 clearLabel:'세 깃발의 마지막 대결을 끝냄',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&!!m.camps&&BANNERS.includes(m.camps.north)&&BANNERS.includes(m.camps.west)&&BANNERS.includes(m.camps.east)&&new Set([m.camps.north,m.camps.west,m.camps.east]).size===3
  &&Array.isArray(m.neutral)&&m.neutral.length<=8&&m.neutral.every(id=>/^(lw|le|w[1-3]|e[1-3])$/.test(id))&&new Set(m.neutral).size===m.neutral.length&&typeof m.captain==='boolean'&&(m.fallenLeader===null||['lw','le'].includes(m.fallenLeader));},
 status(s){const m=missionOf(s),st=s.missionState,hc=findUnit(s,'hc'),side=f=>allied25(s.campaign,f)?'동맹':'중립';
  return `북쪽 ${SHORT[st.camps.north]} 강경파 대장 ${hc&&alive(hc)?`HP ${hc.hp}/${hc.maxHP}`:'격파'} · 서쪽 ${SHORT[st.camps.west]} ${side(st.camps.west)} · 동쪽 ${SHORT[st.camps.east]} ${side(st.camps.east)} · 지도자 ${leaders25(s).filter(alive).length}/2 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `두 지도자 HP 절반 이상 ${f.mission_25_leaders_half==null?'—':f.mission_25_leaders_half?'예':'아니요'} · 승리 턴 ${f.mission_25_turn??'—'}`;},
 onTurnStart(s){act2Waves(s);for(const u of s.units.filter(u=>u.camp==='north'&&alive(u)&&!u.banner)){const f=s.missionState.camps.north,look=LOOK25[f];u.banner=f;u.faction=f;u.look=look[u.kind]||look.spear;u.name=`${SHORT[f]} 강경파 ${u.kind==='archer'?'궁수':u.kind==='cavalry'?'기병':'병사'}`;}},
 // The hardliners make for the nearest leader of the other two banners (the captain keeps to the north camp until TURN 4);
 // the neutral camps hold within three tiles of their post and strike only the hardliners.
 planEnemy(s,u,reachable){const st=s.missionState,leaders=leaders25(s).filter(alive);
  if(u.neutral){const foes=s.units.filter(t=>alive(t)&&t.camp==='north'),keep=within101(reachable,(x,y)=>!u.post||Math.abs(x-u.post.x)+Math.abs(y-u.post.y)<=(u.leader?1:3));
   const near=foes.filter(t=>u.post&&distance(t,u.post)<=6);return strike101(s,u,keep.size?keep:reachable,foes,goalOf101(nearest101(u,near))||goalOf101(u.post&&{...u.post,name:'진영'}));}
  if(u.camp==='north'){const foes=s.units.filter(t=>alive(t)&&hostile(s,u,t)),bonus=t=>t.leader?10:0;
   if(u.id==='hc'&&s.turn<5)return strike101(s,u,within101(reachable,(x,y)=>y<=3),foes,null,bonus);
   return strike101(s,u,reachable,foes,goalOf101(nearest101(u,leaders.length?leaders:foes)),bonus);}
  return null;},
 afterDamage(s,v){const st=s.missionState;if(v.id==='hc'&&v.hp<=0&&!st.captain){st.captain=true;enqueueStory(s,'25:captain:down');}
  if(['lw','le'].includes(v.id)&&v.hp<=0&&!st.fallenLeader){st.fallenLeader=v.id;enqueueStory(s,'25:leader:down');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.fallenLeader){const l=findUnit(s,st.fallenLeader);return finish(s,'defeat',`${l.name}이(가) 쓰러졌습니다. 세 깃발의 마지막 자리가 무너졌습니다.`);}
  if(st.captain)return finish(s,'victory',`${SHORT[st.camps.north]} 강경파 대장을 쓰러뜨렸습니다 · 두 지도자 생존 (TURN ${s.turn}).`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`TURN ${m.turnLimit} 안에 강경파 대장을 쓰러뜨리지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_25_betrayer',st.camps.north);setStoryFlag(s,'mission_25_turn',s.turn);setStoryFlag(s,'mission_25_allied',[st.camps.west,st.camps.east].filter(f=>allied25(s.campaign,f)).length);
  setStoryFlag(s,'mission_25_leaders_half',leaders25(s).every(l=>l.hp>=l.maxHP/2));},
 rewardContext(s){return {leadersHalf25:leaders25(s).every(l=>alive(l)&&l.hp>=l.maxHP/2)};}
};
// The banner that betrayed (ACT4_DESIGN §4.1): forgive it and take it in (its trust +2), or make it lower its banner (its trust
// −1, the other two +1). Kept for the endings.
export const BANNER25={forgive:'용서하고 받아들인다',lower:'깃발을 내리게 한다'};
export function chooseBanner25(s,id){const c=s.campaign;if(!BANNER25[id]||s.practice||c.choices?.m25_banner||!c.completed?.includes(25))return false;const b=c.flags?.mission_25_betrayer||camps25(c).north;
 c.choices??={};c.choices.m25_banner=id;setStoryFlag(s,'mission_25_banner',id);
 if(id==='forgive')adjustTrust(c,b,2,`M25 · 등을 돌렸던 ${FACTIONS[b].name}을(를) 용서하고 받아들였다`);
 else{adjustTrust(c,b,-1,`M25 · ${FACTIONS[b].name}의 깃발을 내리게 했다`);for(const f of BANNERS.filter(f=>f!==b))adjustTrust(c,f,1,`M25 · ${FACTIONS[b].name}의 깃발을 내리게 했다`);}
 return true;}

// ---------- M26 The Black Lion's Last Battle ----------
export const RESOLVE26={eric:'에릭의 설득',thea:'테아의 말',duel:'일기토 승리'};
const baldrickOf26=s=>findUnit(s,'boss');
// Yielding: Baldrick joins the legion when he halted his army at M13; otherwise he leads his riders beside it (cooperate).
export const yieldOutcome26=c=>c?.flags?.mission_13_baldrick==='halted'?'join':'cooperate';
export const BALDRICK_LEVEL=19;
const floor26=b=>Math.ceil(b.maxHP/2);
export const M26={
 init(s){s.missionState={waves:[],resolve:0,sources:[],persuadedTurn:null,thea:false,duelDone:false,duelCounted:false,halted:false,broken:false,outcome:null};},
 clearLabel:'검은 사자의 마지막 전투를 끝냄',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Number.isInteger(m.resolve)&&m.resolve>=0&&m.resolve<=12&&Array.isArray(m.sources)&&m.sources.length<=12&&m.sources.every(v=>RESOLVE26[v])
  &&(m.persuadedTurn===null||Number.isInteger(m.persuadedTurn))&&['thea','duelDone','duelCounted','halted','broken'].every(k=>typeof m[k]==='boolean')&&(m.outcome===null||['join','cooperate','withdraw'].includes(m.outcome));},
 status(s){const m=missionOf(s),st=s.missionState,b=baldrickOf26(s);return `결단 ${st.resolve}/${m.persuade.threshold}${st.halted?' · 칼을 내림':''} · 발드릭 HP ${b?Math.round(100*Math.max(0,b.hp)/b.maxHP):0}% · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `발드릭 ${({join:'합류',cooperate:'협력',withdraw:'물러남'})[f.mission_26_baldrick]||'—'} · 일기토 ${({hero:'승리',foe:'패배',skipped:'거절',none:'—'})[f.mission_26_duel]||'—'}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);
  if(s.turn===m.duelTurn&&!st.duelDone){st.duelDone=true;const b=baldrickOf26(s),e=findUnit(s,'eric');if(b&&alive(b)&&e&&alive(e)&&!e.benched&&s.duel==null){if(startDuel(s,'eric','boss','26:duel'))enqueueStory(s,'26:duel');}}},
 beforeEnemyPhase(s){countDuel26(s);},
 // Baldrick keeps to the north until the duel turn, then rides at Erik; his riders hunt the legion; the bearers stay by him.
 planEnemy(s,u,reachable){const foes=s.units.filter(t=>alive(t)&&hostile(s,u,t)),e=findUnit(s,'eric'),b=baldrickOf26(s);
  if(u.id==='boss'){if(s.turn<missionOf(s).duelTurn)return strike101(s,u,within101(reachable,(x,y)=>y<=3),foes,null);return strike101(s,u,reachable,foes,goalOf101(e&&alive(e)&&!e.benched?e:nearest101(u,foes)),t=>t.id==='eric'?8:0);}
  if(u.kind==='bearer'&&b&&alive(b)){const keep=within101(reachable,(x,y)=>Math.abs(x-b.x)+Math.abs(y-b.y)<=2);return strike101(s,u,keep.size?keep:reachable,foes,goalOf101(b));}
  return null;},
 persuade(s,u,t){const st=s.missionState;if(u.id==='eric'){st.persuadedTurn=s.turn;remember(s,'m26_persuade');addResolve26(s,'eric');}else if(u.id==='thea'){st.thea=true;remember(s,'m26_thea');enqueueStory(s,'26:thea');addResolve26(s,'thea');}s.feedback.push({type:'guard',id:u.id,text:'설득'});},
 // Baldrick never falls below half his HP here; with both bearers down from TURN 4, at that floor he withdraws alive (broken).
 afterDamage(s,v){if(v.id==='boss'&&v.hp<floor26(v)){v.hp=floor26(v);s.log.push('발드릭은 쓰러지지 않습니다. 사자는 무릎을 꿇지 않습니다.');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState,e=findUnit(s,'eric');countDuel26(s);
  if(e&&e.hp<=0&&!e.benched)return finish(s,'defeat','에릭이 쓰러졌습니다.');
  if(st.halted){st.outcome=st.outcome||yieldOutcome26(s.campaign);return finish(s,'victory',`발드릭이 칼을 내렸습니다 · 결단 ${st.resolve} · ${st.outcome==='join'?'군단에 합류합니다':'마지막 작전에 함께합니다'}.`);}
  if(!st.broken&&!st.halted){const b=baldrickOf26(s),bear=missionOf(s).formation.bearers.map(id=>findUnit(s,id)).filter(Boolean);if(b&&b.hp<=floor26(b)&&bear.every(x=>!alive(x))&&s.turn>=(m.lionHold||1)){st.broken=true;enqueueStory(s,'26:broken');}}
  if(st.broken){st.outcome='withdraw';const b=baldrickOf26(s);if(b)b.withdrawn=true;return finish(s,'victory','발드릭이 무릎을 꿇었다가 일어나 물러납니다. 그는 살아서 고개를 넘어갑니다.');}
  if(s.turn>m.turnLimit){st.outcome='withdraw';const b=baldrickOf26(s);if(b)b.withdrawn=true;return finish(s,'victory',`TURN ${m.turnLimit}까지 버텼습니다 · 발드릭이 기병을 거두어 물러납니다.`);}},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_26_baldrick',st.outcome||'withdraw');setStoryFlag(s,'mission_26_resolve',st.resolve);setStoryFlag(s,'mission_26_duel',s.duel?.result||'none');},
 // Iron Crown trust (ACT4_DESIGN §8): Baldrick leaving the field reconciled (join or ride beside the legion) +1; a withdrawal 0.
 // Joining: Baldrick enters the roster at Lv 19, already awakened (tier 3), as the legion's ninth hero.
 afterVictory(s){if(s.practice)return;const o=s.missionState.outcome;if(o==='join'||o==='cooperate')adjustTrust(s.campaign,'iron',1,o==='join'?'M26 · 발드릭이 군단에 합류했다':'M26 · 발드릭이 마지막 작전에 함께하기로 했다');
  if(o==='join'&&!s.campaign.roster?.includes('baldrick')){joinRoster(s,'baldrick',BALDRICK_LEVEL);s.stageStart=null;const rec=s.campaign.heroes?.find(h=>h.id==='baldrick');if(rec){rec.classTier=3;rec.appearanceTier=3;}const u=findUnit(s,'baldrick');if(u){u.classTier=3;u.appearanceTier=3;}}},
 rewardContext(s){return {baldrick26:s.missionState.outcome||'withdraw'};}
};
function addResolve26(s,why){const st=s.missionState,m=missionOf(s);if(st.halted)return;const n=why==='duel'?2:1;st.resolve+=n;st.sources.push(why);
 s.feedback.push({type:'rescue',id:'boss',text:`결단 ${st.resolve}/${m.persuade.threshold}`});s.log.push(`발드릭의 결단 +${n} (${RESOLVE26[why]}) · ${st.resolve}/${m.persuade.threshold}`);
 if(st.resolve>=m.persuade.threshold){st.halted=true;for(const u of s.units.filter(u=>u.team==='enemy'&&alive(u))){u.benched=true;u.withdrawn=true;}enqueueStory(s,yieldOutcome26(s.campaign)==='join'?'26:yield:join':'26:yield:cooperate');}
 else enqueueStory(s,why==='duel'?'26:duel:won':'26:waver');}
function countDuel26(s){const st=s.missionState;if(st&&!st.duelCounted&&s.duel?.result){st.duelCounted=true;if(s.duel.result==='hero'&&s.duel.key==='26:duel')addResolve26(s,'duel');}}
export const ACT4B_RULES={25:M25,26:M26};
