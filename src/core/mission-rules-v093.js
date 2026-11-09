// v0.9.3 ACT III part 4 「잿빛 선택」 mission hooks (D-093, docs/v0.9.0/ACT3_DESIGN.md §4.2; rules and numbers PROPOSED).
// M01–M20 never reach this module.
// M21 The Last King: the crown's heart. The king cannot leave the throne dais; rite knights come for him. Four anchor stones
// hold the rite (a hero beside one breaks it); the ward pulses in rings around the throne (MP −3 for a hero who ends the
// player phase on a pulsing tile). Erik's duel with the rite knight commander.
// M22 The Ashen Choice: three heralds read to the people of the lower city; the chancellery and the betraying banner come to
// stop them; banners at the 「동맹」 stage send knights; recruits still away come back for the last time.
import {missionOf,scavengerLook16} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats,key,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust,FACTIONS,metFactions} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';
import {RECRUIT_OF} from './mission-rules-v071.js';
import {returningRecruits,rejoinRoster} from './mission-rules-v090.js';
import {recruitRecord} from './roster.js';
import {startDuel} from './duel.js';

function strike93(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const foes93=(s,u)=>s.units.filter(t=>alive(t)&&t.team!=='civilian'&&hostile(s,u,t));
const within93=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));
const nearest93=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0];
const goalOf93=t=>t?{x:t.x,y:t.y,name:t.name}:null;

// ---------- M21 The Last King ----------
const ANCHORS=['as1','as2','as3','as4'];
// Erik, Thea, Dario and Ines break an anchor stone at one blow; the others need two.
export const HEAVY21=['eric','thea','dario','ines'];
export const anchors21=s=>s.units.filter(u=>u.kind==='anchorStone');
// The pulsing ring this turn: the outer ring on odd turns, the inner ring on even turns.
export const pulseRing21=s=>s.turn%2===1?'outer':'inner';
export function pulseCells21(s){const m=missionOf(s),king=findUnit(s,'king');if(!king||s.missionId!==21||!m?.pulseOuter)return [];const [lo,hi]=pulseRing21(s)==='outer'?m.pulseOuter:m.pulseInner,out=[];
 for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const d=Math.abs(x-king.x)+Math.abs(y-king.y),t=terrainAt(x,y,s);if(d>=lo&&d<=hi&&Number.isFinite(t?.cost))out.push({x,y});}return out;}
export const onPulse21=(s,u)=>pulseCells21(s).some(c=>c.x===u.x&&c.y===u.y);
export const M21={
 init(s){s.missionState={waves:[],broken:[],progress:{},duelDone:false,pulsed:0,kingHalf:true};const king=findUnit(s,'king');if(king)king.noRescue=true;},
 clearLabel:'왕관의 심장에서 국왕을 지킴',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.broken)&&m.broken.every(id=>ANCHORS.includes(id))&&new Set(m.broken).size===m.broken.length
  &&!!m.progress&&typeof m.progress==='object'&&!Array.isArray(m.progress)&&Object.entries(m.progress).every(([id,n])=>ANCHORS.includes(id)&&Number.isInteger(n)&&n>=0&&n<=2)&&typeof m.duelDone==='boolean'&&Number.isInteger(m.pulsed)&&m.pulsed>=0&&typeof m.kingHalf==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,king=findUnit(s,'king');return `고정석 ${st.broken.length}/4 · 국왕 HP ${Math.max(0,king?.hp||0)}/${king?.maxHP||0} · 맥동 ${pulseRing21(s)==='outer'?'바깥':'안쪽'} 고리 · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `고정석 ${f.mission_21_anchors??st?.broken.length??0}/4 · 국왕 ${(f.mission_21_king_half??st?.kingHalf??true)?'HP 절반 이상':'HP 절반 아래로 떨어짐'} · 일기토 ${({hero:'승리',foe:'패배',skipped:'거절'})[f.mission_21_duel]||'—'}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);
  if(s.turn===m.duelTurn&&!st.duelDone){st.duelDone=true;const rc=findUnit(s,'rc'),e=findUnit(s,'eric');if(rc&&alive(rc)&&e&&alive(e)&&startDuel(s,'eric','rc','21:duel'))enqueueStory(s,'21:duel');}
  if(s.turn===2)enqueueStory(s,'21:pulse:inner');},
 // A hero who ends the player phase on a pulsing tile loses MP.
 beforeEnemyPhase(s){const m=missionOf(s),st=s.missionState,cells=new Set(pulseCells21(s).map(c=>key(c.x,c.y)));let n=0;
  for(const u of s.units.filter(u=>u.team==='ally'&&alive(u)&&!u.benched&&cells.has(key(u.x,u.y)))){const d=Math.min(u.mp,m.pulseMP);if(d>0){u.mp-=d;n++;s.feedback.push({type:'guard',id:u.id,text:`맥동 MP −${d}`});}}
  if(n){if(!st.pulsed)enqueueStory(s,'21:pulse');st.pulsed+=n;s.log.push(`결계가 맥동합니다. 맥동 칸의 장수 ${n}명 MP −${m.pulseMP}.`);}},
 // Rite knights go for the king (the commander keeps to the dais until TURN 4); ritualists keep near the throne and strike
 // whoever comes near; grey cloaks hunt the legion (the default AI).
 planEnemy(s,u,reachable){const foes=foes93(s,u),king=findUnit(s,'king'),kingIn=king&&alive(king)?[king]:[];
  if(u.id==='rc'&&s.turn<4)return strike93(s,u,within93(reachable,(x,y)=>y<=3),foes,null);
  if(u.kind==='spear'||u.id==='rc')return strike93(s,u,reachable,[...foes,...kingIn],goalOf93(king),t=>t.id==='king'?10:0);
  if(u.kind==='ritualist'){const near=king?within93(reachable,(x,y)=>distance({x,y},king)<=3):reachable;return strike93(s,u,near.size?near:reachable,foes,goalOf93(nearest93(u,foes)));}
  return null;},
 search(s,u,t){if(t.kind!=='anchorStone')return false;const m=missionOf(s),st=s.missionState,step=HEAVY21.includes(u.id)?2:1;st.progress[t.id]=Math.min(2,(st.progress[t.id]||0)+step);remember(s,`m21_anchor_${u.id}`);
  if(st.progress[t.id]<2){t.cracked=true;s.feedback.push({type:'guard',id:t.id,text:'금 1/2'});s.log.push(`${u.name}이(가) 고정석에 금을 냈습니다. 한 번 더 치면 깨집니다.`);if(!st.cracked){st.cracked=true;enqueueStory(s,'21:crack');}return true;}
  t.inert=true;st.broken.push(t.id);const king=findUnit(s,'king');let healed=0;if(king&&alive(king)){healed=Math.min(m.kingHeal,king.maxHP-king.hp);king.hp+=healed;if(healed)s.feedback.push({type:'heal',id:king.id,text:`+${healed}`,toHP:king.hp});}
  s.feedback.push({type:'rescue',id:t.id,text:'고정석 파괴'});s.log.push(`${u.name}이(가) 의식 고정석을 깨뜨렸습니다 (${st.broken.length}/4).${healed?` 국왕이 숨을 돌립니다 (HP +${healed}).`:''}`);
  enqueueStory(s,st.broken.length===1?'21:anchor':st.broken.length===3?'21:anchor3':st.broken.length===4?'21:anchor4':'21:anchor2');return true;},
 afterDamage(s,v){const st=s.missionState;if(v.id==='king'){if(st.kingHalf&&v.hp<v.maxHP/2){st.kingHalf=false;enqueueStory(s,'21:king:low');}}
  if(v.id==='rc'&&v.hp<=0&&!st.commander){st.commander=true;enqueueStory(s,'21:commander');}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState,king=findUnit(s,'king');
  if(!king||king.hp<=0)return finish(s,'defeat','국왕이 쓰러졌습니다. 의식이 마지막 기억을 거둬 갔습니다.');
  if(st.broken.length===4)return finish(s,'victory',`의식 고정석 4개를 모두 깼습니다 · 국왕 HP ${king.hp}/${king.maxHP}.`);
  if(s.turn>m.turnLimit)return finish(s,'victory',`TURN ${m.turnLimit}까지 국왕을 지켰습니다 · 고정석 ${st.broken.length}/4.`);},
 beforeCommit(s){const st=s.missionState,king=findUnit(s,'king');setStoryFlag(s,'mission_21_anchors',st.broken.length);setStoryFlag(s,'mission_21_king_half',!!st.kingHalf&&!!king&&king.hp>=king.maxHP/2);setStoryFlag(s,'mission_21_duel',s.duel?.result||'none');},
 // Aren remembers what the king remembered of him: his command 「함께 정한다」 opens for the battles that follow (D-093).
 afterVictory(s){if(s.practice)return;setStoryFlag(s,'aren_awakened',true);},
 rewardContext(s){return {anchors21:s.missionState.broken.length};}
};
export const KING21={notyet:'지금은 아니라고 답한다',promise:'쉬게 해 주겠다고 약속한다'};
export function chooseKing21(s,id){const c=s.campaign;if(!KING21[id]||s.practice||c.choices?.m21_king||!c.completed?.includes(21))return false;c.choices??={};c.choices.m21_king=id;setStoryFlag(s,'mission_21_king_choice',id);return true;}

// ---------- M22 The Ashen Choice ----------
export const HERALDS=['hr','hp','hk'];
const RETURNERS93={rthea:'thea',rdario:'dario',rines:'ines'},BANNER_UNITS={iron:['bi1','bi2'],free:['bf1','bf2'],flame:['bl1','bl2']};
export const heralds22=s=>s.units.filter(u=>u.kind==='herald');
// The banners that stand by the legion in the square: met, at the 「동맹」 stage (trust 3), and not the one that betrayed it.
export function supportBanners22(c){if(!c)return [];const t=ensureTrust(c),bad=c.flags?.mission_14_betrayer;return metFactions(c).filter(f=>t[f]>=3&&f!==bad);}
// Who reads on a herald's dais this turn: the herald, or (once the herald has fallen) a hero standing on the dais.
export function reader22(s,h){if(alive(h))return h;return s.units.find(u=>u.team==='ally'&&alive(u)&&!u.benched&&u.x===h.x&&u.y===h.y)||null;}
function bannerLooks22(s){const f=s.missionState.banner;for(const u of s.units.filter(u=>u.scav&&!u.bannered)){u.look=scavengerLook16(f,u.scav);u.name=`${FACTIONS[f]?.name||'배신한 깃발'} ${u.scav==='archer'?'궁병':'병사'}`;u.faction=null;u.bannered=true;}}
function arrive22(s,a,text){a.benched=false;a.moved=false;a.acted=false;const m=missionOf(s);if(s.units.some(o=>o!==a&&alive(o)&&!o.benched&&o.x===a.x&&o.y===a.y)){for(let y=m.height-1;y>=0;y--){let done=false;for(let x=6;x<=11;x++){const t=terrainAt(x,y,s);if(Number.isFinite(t?.cost)&&!s.units.some(o=>o!==a&&alive(o)&&!o.benched&&o.x===x&&o.y===y)){a.x=x;a.y=y;done=true;break;}}if(done)break;}}
 s.feedback.push({type:'spawn',id:a.id,text});}
export const M22={
 init(s){const c=s.campaign,f=c.flags?.mission_14_betrayer||'iron',support=s.practice?[]:supportBanners22(c),back=s.practice?[]:returningRecruits(c);
  s.missionState={waves:[],banner:f,read:Object.fromEntries(HERALDS.map(id=>[id,0])),hurt:[],fallen:[],support,returning:back};
  for(const [fid,ids] of Object.entries(BANNER_UNITS))for(const id of ids){const a=findUnit(s,id);if(!a)continue;a.benched=true;if(!support.includes(fid))a.withdrawn=true;}
  for(const a of s.units.filter(u=>RETURNERS93[u.id])){const id=RETURNERS93[a.id];a.benched=true;if(!back.includes(id)){a.withdrawn=true;continue;}
   const rec=c.departed?.[id]||recruitRecord(id,13),keep=['level','maxHP','maxMP','atk','def','mag','res','spd','mov','range','movementProfile','classTier'];for(const k of keep)if(rec[k]!==undefined)a[k]=structuredClone(rec[k]);a.hp=a.maxHP;a.mp=a.maxMP;a.kind=id==='thea'?'cavalry':'soldier';}
  for(const h of heralds22(s))h.noRescue=true;bannerLooks22(s);},
 clearLabel:'하층가 광장의 세 낭독',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&!!FACTIONS[m.banner]
  &&!!m.read&&typeof m.read==='object'&&Object.keys(m.read).length===3&&HERALDS.every(id=>Number.isInteger(m.read[id])&&m.read[id]>=0&&m.read[id]<=4)
  &&['hurt','fallen'].every(k=>Array.isArray(m[k])&&m[k].length<=12&&m[k].every(id=>typeof id==='string'&&id.length<20)&&new Set(m[k]).size===m[k].length)&&m.fallen.every(id=>HERALDS.includes(id))
  &&Array.isArray(m.support)&&m.support.every(f=>!!FACTIONS[f])&&new Set(m.support).size===m.support.length&&Array.isArray(m.returning)&&m.returning.every(id=>['thea','dario','ines'].includes(id));},
 status(s){const m=missionOf(s),st=s.missionState;return `낭독 ${HERALDS.map(id=>`${({hr:'기록',hp:'계획서',hk:'국왕의 말'})[id]} ${st.read[id]}/${m.reads}`).join(' · ')}${st.fallen.length?` · 쓰러진 전령 ${st.fallen.length}`:''} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags,st=s.missionState;return `서 있는 전령 ${f.mission_22_heralds??(st?3-st.fallen.length:3)}/3 · 곁에 선 깃발 ${f.mission_22_support??st?.support.length??0}`;},
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);bannerLooks22(s);
  if(s.turn===m.bannerTurn)for(const fid of st.support)for(const id of BANNER_UNITS[fid]){const a=findUnit(s,id);if(a&&a.benched&&!a.withdrawn&&a.hp>0){arrive22(s,a,'지원');s.log.push(`${FACTIONS[fid].name}의 기사가 광장으로 들어옵니다.`);}}
  if(s.turn===m.bannerTurn&&st.support.length)enqueueStory(s,`22:support:${st.support[0]}`);
  if(s.turn===m.returnTurn)for(const a of s.units.filter(u=>RETURNERS93[u.id]&&st.returning.includes(RETURNERS93[u.id])&&u.benched&&!u.withdrawn&&u.hp>0)){arrive22(s,a,'돌아옴');s.log.push(`${a.name}이(가) 광장의 사람들 사이에서 나타났습니다. 군단 곁에서 싸웁니다.`);enqueueStory(s,`22:return:${RETURNERS93[a.id]}`);}
  if(s.turn>=m.readTurn){let done=0;for(const h of heralds22(s)){if(st.read[h.id]>=m.reads)continue;const r=reader22(s,h);if(!r)continue;
    if(st.hurt.includes(r.id)){s.feedback.push({type:'miss',id:r.id,text:'낭독 멈춤'});continue;}
    st.read[h.id]++;done++;s.feedback.push({type:'guard',id:r.id,text:`낭독 ${st.read[h.id]}/${m.reads}`});if(r!==h)remember(s,`m22_read_${r.id}`);
    if(st.read[h.id]===m.reads){s.log.push(`${h.name}의 낭독이 끝났습니다.`);enqueueStory(s,`22:read:${h.id}`);}}
   if(done&&s.turn===m.readTurn)enqueueStory(s,'22:reading');}
  st.hurt=[];},
 beforeEnemyPhase(){},
 // The chancellery and the betraying banner go for the heralds (the guard captain keeps to the north until TURN 5).
 planEnemy(s,u,reachable){const foes=foes93(s,u),readers=s.turn<2?[]:heralds22(s).filter(alive),goal=nearest93(u,readers.length?readers:foes); /* TURN 1: the crowd stands between them and the heralds */
  if(u.id==='gc'&&s.turn<5)return strike93(s,u,within93(reachable,(x,y)=>y<=4),[...foes,...readers],null,t=>t.kind==='herald'?8:0);
  return strike93(s,u,reachable,[...foes,...readers],goalOf93(goal),t=>t.kind==='herald'?(u.movementProfile==='rogue'?14:10):0);},
 afterDamage(s,v){const st=s.missionState;if(v.kind==='herald'||v.team==='ally'&&heralds22(s).some(h=>!alive(h)&&h.x===v.x&&h.y===v.y)){if(!st.hurt.includes(v.id)&&v.hp>0)st.hurt.push(v.id);}
  if(v.kind==='herald'&&v.hp<=0&&!st.fallen.includes(v.id)){st.fallen.push(v.id);s.log.push(`${v.name}이(가) 쓰러졌습니다. 그 단에 장수가 서면 대신 읽을 수 있습니다.`);enqueueStory(s,st.fallen.length===1?'22:fallen':'22:fallen2');}
  if(RETURNERS93[v.id]&&v.hp<=0)enqueueStory(s,`22:fallen:${RETURNERS93[v.id]}`);},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.fallen.length>=2)return finish(s,'defeat','전령 두 명이 쓰러졌습니다. 광장의 낭독이 끊겼습니다.');
  if(HERALDS.every(id=>st.read[id]>=m.reads))return finish(s,'victory',`세 낭독을 모두 마쳤습니다 · 서 있는 전령 ${3-st.fallen.length}/3.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 세 낭독을 마치지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_22_heralds',3-st.fallen.length);setStoryFlag(s,'mission_22_support',st.support.length);setStoryFlag(s,'mission_22_reads',HERALDS.reduce((a,id)=>a+st.read[id],0));
  for(const id of st.returning){const a=s.units.find(u=>RETURNERS93[u.id]===id);setStoryFlag(s,`mission_22_return_${id}`,a&&a.hp>0&&!a.benched?'joined':'lost');}},
 // The last chance (ACT3_DESIGN §5): a recruit who stood to the end in the square rejoins; their banner hears of it (+1).
 afterVictory(s){if(s.practice)return;const c=s.campaign;setStoryFlag(s,'act3_completed',true);for(const id of s.missionState.returning){if(c.flags[`mission_22_return_${id}`]!=='joined')continue;rejoinRoster(s,id);
  const f=Object.entries(RECRUIT_OF).find(([,r])=>r===id)?.[0];if(f)adjustTrust(c,f,1,`M22 · ${({thea:'테아',dario:'다리오',ines:'이네스'})[id]}가 군단으로 돌아왔다`);}},
 rewardContext(s){return {heralds22:3-s.missionState.fallen.length};}
};
// The ACT III choice (Q8): to whom the legion entrusts the truth and the ward. None is the right answer; each moves two
// banners (one up, one down) and is kept for the ACT IV endings (weights OPEN).
export const ACT3_CHOICE={king:'국왕에게 맡긴다',council:'세 깃발의 회의에 맡긴다',oath:'모든 사람의 서약에 맡긴다'};
export const ACT3_TRUST={king:[['iron',1,'국왕에게 맡겼다 · 왕관이 다시 서길 바란다'],['flame',-1,'국왕에게 맡겼다 · 교단은 왕관을 의심한다']],
 council:[['free',1,'세 깃발의 회의에 맡겼다 · 연맹은 회의를 믿는다'],['iron',-1,'세 깃발의 회의에 맡겼다 · 철왕관은 하나의 왕관을 원한다']],
 oath:[['flame',1,'모든 사람의 서약에 맡겼다 · 교단은 서약을 믿는다'],['free',-1,'모든 사람의 서약에 맡겼다 · 영주들은 자기 몫을 걱정한다']]};
export function chooseAct3(s,id){const c=s.campaign;if(!ACT3_CHOICE[id]||s.practice||c.choices?.act3_choice||!c.completed?.includes(22))return false;c.choices??={};c.choices.act3_choice=id;setStoryFlag(s,'act3_choice',id);
 for(const [f,d,why] of ACT3_TRUST[id])adjustTrust(c,f,d,`ACT III · ${why}`);return true;}
export const ACT3D_RULES={21:M21,22:M22};
