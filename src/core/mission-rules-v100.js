// v1.0.0 ACT IV 「잿빛 왕관」 part 4 「왕관 없는 새벽」 mission hooks (D-099/D-113, docs/v0.10.0/ACT4_DESIGN.md §3, §4.2, §6, §8;
// rules and numbers PROPOSED). M01–M28 never reach this module.
// M29 The Heart of the Crown: Bellard in two phases; three rite points of the new ward placed by the M22 path; the duel, or
// Aren's last words to Bellard; two rite points standing when Bellard's second phase falls wins. After the win, Bellard's
// fate: a trial, exile, or — only when Aren spoke to him and Bellard asks it himself — his own memory given to the ward.
// M30 The Crownless Dawn: hold the heart stone until the end of TURN 8 against the last wave of ash; then the ending.
import {missionOf,MISSIONS} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust,adjustTrust} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';
import {startDuel} from './duel.js';

function strike1000(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const within1000=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));
const nearest1000=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0];
const goalOf1000=t=>t?{x:t.x,y:t.y,name:t.name}:null;
const heroesOf1000=s=>s.units.filter(u=>u.team==='ally'&&alive(u)&&!u.benched);

// ---------- M29 The Heart of the Crown ----------
export const RITE_IDS=['rp1','rp2','rp3'];
const bellardOf29=s=>findUnit(s,'boss');
export const ritesOf29=s=>RITE_IDS.map(id=>findUnit(s,id)).filter(Boolean);
export const ritesStanding29=s=>ritesOf29(s).filter(alive).length;
// The rite points stand where the path chosen at M22 puts them (king / council / oath; a save without the choice uses council).
export const ritePath29=c=>['king','council','oath'].includes(c?.choices?.act3_choice)?c.choices.act3_choice:'council';
export const squads29=c=>['iron','free','flame'].filter(f=>(ensureTrust(c)[f]??0)>=MISSIONS[29].squadTrust);
export const lion29=c=>c?.flags?.mission_26_baldrick==='cooperate';
export const M29={
 init(s){const c=s.campaign,send=squads29(c),lion=lion29(c),path=ritePath29(c);
  for(const u of s.units.filter(u=>u.banner29&&!send.includes(u.banner29)||u.lion29&&!lion)){u.benched=true;u.absent=true;}
  ritesOf29(s).forEach((r,i)=>{[r.x,r.y]=MISSIONS[29].rites29[path][i];});
  s.missionState={waves:[],path,phase:1,fallen:false,broken:[],words:false,duelDone:false,duelCounted:false,squads:send,lion};
  enqueueStory(s,`29:path:${path}`);if(send.length)enqueueStory(s,'29:squads');if(lion)enqueueStory(s,'29:lion');},
 clearLabel:'벨라드를 꺾고 새 결계의 의식을 지킴',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&['king','council','oath'].includes(m.path)&&[1,2].includes(m.phase)&&typeof m.fallen==='boolean'&&(!m.fallen||m.phase===2)
  &&Array.isArray(m.broken)&&m.broken.length<=3&&m.broken.every(id=>RITE_IDS.includes(id))&&new Set(m.broken).size===m.broken.length&&['words','duelDone','duelCounted','lion'].every(k=>typeof m[k]==='boolean')
  &&Array.isArray(m.squads)&&m.squads.length<=3&&m.squads.every(f=>['iron','free','flame'].includes(f))&&new Set(m.squads).size===m.squads.length;},
 status(s){const m=missionOf(s),st=s.missionState,b=bellardOf29(s);return `의식 지점 ${ritesStanding29(s)}/3 (필요 ${m.needRites}) · 벨라드 ${st.fallen?'쓰러짐':`${st.phase}단계 HP ${b?Math.max(0,b.hp):0}/${b?.maxHP||0}`} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `의식 지점 셋 모두 지킴 ${f.mission_29_rites==null?'—':f.mission_29_rites===3?'예':'아니요'} · 일기토 ${({hero:'승리',foe:'패배',skipped:'아렌의 마지막 말',none:'—'})[f.mission_29_duel]||'—'} · 승리 턴 ${f.mission_29_turn??'—'}`;},
 // Start of the player phase: waves; rite points with a hero beside them mend; on the duel turn Bellard calls Erik out.
 afterDuel(s){countDuel29(s);}, // v2.0.0: counted the moment the duel ends
 onTurnStart(s){const m=missionOf(s),st=s.missionState;act2Waves(s);countDuel29(s);
  for(const r of ritesOf29(s).filter(alive)){if(r.hp<r.maxHP&&heroesOf1000(s).some(h=>distance(h,r)===1)){const n=Math.min(m.riteMend,r.maxHP-r.hp);r.hp+=n;s.feedback.push({type:'heal',id:r.id,text:`의식 +${n}`});}}
  /* v2.1: the duel is an event when the pair stands side by side (core/duel-events.js) */},
 beforeEnemyPhase(s){countDuel29(s);},
 // Bellard holds the dais in his first phase; with the crown's power he goes for the rite points. Ritualists and grey cloaks
 // unbind the rites; knights hold the hall.
 planEnemy(s,u,reachable){const st=s.missionState,rites=ritesOf29(s).filter(alive),foes=[...s.units.filter(t=>alive(t)&&hostile(s,u,t)),...rites],isRite=t=>RITE_IDS.includes(t.id);
  if(u.id==='boss'){if(st.phase===1){const keep=within1000(reachable,(x,y)=>y<=5&&x>=5&&x<=12);return strike1000(s,u,keep.size?keep:reachable,foes,null,t=>isRite(t)?6:0);}
   return strike1000(s,u,reachable,foes,goalOf1000(nearest1000(u,rites)||findUnit(s,'eric')),t=>isRite(t)?20:t.id==='eric'?8:0);}
  if(u.unbinder||u.look==='grayCloak')return strike1000(s,u,reachable,foes,goalOf1000(nearest1000(u,rites)||nearest1000(u,foes)),t=>isRite(t)?(u.unbinder?40:25):0);
  return strike1000(s,u,reachable,foes,goalOf1000(nearest1000(u,foes)),t=>isRite(t)?10:0);},
 afterDamage(s,v){const st=s.missionState,m=missionOf(s);
  if(RITE_IDS.includes(v.id)&&v.hp<=0&&!st.broken.includes(v.id)){st.broken.push(v.id);s.log.push(`${v.name}이(가) 풀렸습니다 (${st.broken.length}/3).`);enqueueStory(s,st.broken.length===1?'29:rite:broken':'29:rite:broken2');}
  if(v.id==='boss'&&v.hp<=0){if(st.phase===1){const c=m.crown29[st.words?'words':'full'];st.phase=2;Object.assign(v,{maxHP:c.hp,hp:c.hp,atk:c.atk,def:c.def,mov:c.mov,crowned:true});delete v.status;
    s.feedback.push({type:'spawn',id:'boss',text:'왕관의 힘'});s.log.push(`벨라드가 왕관의 힘을 빌려 다시 일어섭니다${st.words?' — 그러나 왕관은 그에게 전처럼 답하지 않습니다':''}.`);enqueueStory(s,st.words?'29:crown:words':'29:crown');}
   else if(!st.fallen){st.fallen=true;v.withdrawn=true;enqueueStory(s,'29:fall');}}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;countDuel29(s);
  if(st.broken.length>3-m.needRites)return finish(s,'defeat','의식 지점 두 곳이 풀렸습니다. 새 결계의 의식이 무너졌습니다.');
  if(st.fallen)return finish(s,'victory',`벨라드가 무릎을 꿇었습니다 · 의식 지점 ${ritesStanding29(s)}/3 (TURN ${s.turn}).`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`TURN ${m.turnLimit} 안에 벨라드를 꺾지 못했습니다.`);},
 beforeCommit(s){const st=s.missionState;setStoryFlag(s,'mission_29_turn',s.turn);setStoryFlag(s,'mission_29_rites',ritesStanding29(s));setStoryFlag(s,'mission_29_duel',s.duel?.key==='29:duel'?s.duel.result||'none':'none');setStoryFlag(s,'mission_29_words',st.words);setStoryFlag(s,'mission_29_path',st.path);},
 // The new ward's rite holds: the king can let go and rest (the M21 request, kept whatever was answered then).
 afterVictory(s){if(s.practice)return;setStoryFlag(s,'king_rests',true);},
 rewardContext(s){return {rites29:ritesStanding29(s)};}
};
// Skipping the duel at M29 is not a refusal: Erik steps back and Aren speaks his last words to Bellard (the crown's power
// answers Bellard less in his second phase, and Bellard may later ask to give his own memory to the ward).
function countDuel29(s){const st=s.missionState;if(!st||st.duelCounted||!s.duel?.result||s.duel.key!=='29:duel')return;st.duelCounted=true;
 if(s.duel.result==='skipped'){st.words=true;remember(s,'m29_words');enqueueStory(s,'29:words');}}
// Bellard's fate (ACT4_DESIGN §4.2, §8): a trial (the council's law; Free Cities +1), exile (the Iron Crown's way; +1), or his
// own offer to give his memory to the new ward (the flame's way; +1) — open only when Aren spoke to him and he asks it himself.
export const FATE29={trial:'재판에 세운다',exile:'왕도에서 추방한다',offer:'그의 청을 받아들인다 — 스스로 기억을 결계에 바친다'};
const FATE_TRUST={trial:['free','M29 · 벨라드를 재판에 세웠다'],exile:['iron','M29 · 벨라드를 왕도에서 추방했다'],offer:['flame','M29 · 벨라드가 스스로 기억을 결계에 바쳤다']};
export const fateOpen29=(c,id)=>!!FATE29[id]&&(id!=='offer'||c?.flags?.mission_29_words===true);
export function chooseFate29(s,id){const c=s.campaign;if(!fateOpen29(c,id)||s.practice||c.choices?.m29_bellard||!c.completed?.includes(29))return false;c.choices??={};c.choices.m29_bellard=id;setStoryFlag(s,'mission_29_bellard',id);
 adjustTrust(c,FATE_TRUST[id][0],1,FATE_TRUST[id][1]);return true;}

// ---------- M30 The Crownless Dawn ----------
const heartOf30=s=>findUnit(s,'heart');
export const lion30=c=>c?.flags?.mission_26_baldrick==='cooperate';
export const M30={
 init(s){const lion=lion30(s.campaign);for(const u of s.units.filter(u=>u.lion30&&!lion)){u.benched=true;u.absent=true;}
  s.missionState={waves:[],heartLost:false,down:[],lion};if(lion)enqueueStory(s,'30:lion');},
 clearLabel:'새벽까지 결계의 심장을 지킴',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&typeof m.heartLost==='boolean'&&Array.isArray(m.down)&&m.down.length<=9&&m.down.every(id=>typeof id==='string'&&id.length<20)&&new Set(m.down).size===m.down.length&&typeof m.lion==='boolean';},
 status(s){const m=missionOf(s),h=heartOf30(s);return `결계의 심장 ${h&&alive(h)?`HP ${h.hp}/${h.maxHP}`:'부서짐'} · 새벽까지 ${Math.max(0,m.holdTurn+1-s.turn)}턴`;},
 optional(s){const f=s.campaign.flags;return `아무도 쓰러지지 않고 심장 HP 절반 이상 ${f.mission_30_unbroken==null?'—':f.mission_30_unbroken?'예':'아니요'}`;},
 onTurnStart(s){act2Waves(s);},
 // The ash goes for the heart stone first, then whoever bars the way.
 planEnemy(s,u,reachable){const h=heartOf30(s),heart=h&&alive(h)?[h]:[],foes=[...s.units.filter(t=>alive(t)&&hostile(s,u,t)),...heart];
  return strike1000(s,u,reachable,foes,goalOf1000(heart[0]||nearest1000(u,foes)),t=>t.id==='heart'?30:0);},
 afterDamage(s,v){const st=s.missionState;if(v.id==='heart'&&v.hp<=0&&!st.heartLost){st.heartLost=true;enqueueStory(s,'30:heart:lost');}
  if(v.team==='ally'&&v.hp<=0&&!st.down.includes(v.id))st.down.push(v.id);},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.heartLost)return finish(s,'defeat','결계의 심장이 부서졌습니다. 새 결계가 서지 못했습니다.');
  if(s.turn>m.holdTurn)return finish(s,'victory',`새벽까지 결계의 심장을 지켰습니다 · 새 결계가 섭니다 (TURN ${m.holdTurn}).`);},
 beforeCommit(s){const h=heartOf30(s),half=!!h&&alive(h)&&h.hp>=h.maxHP/2;setStoryFlag(s,'mission_30_turn',Math.min(s.turn,missionOf(s).holdTurn));setStoryFlag(s,'mission_30_heart_half',half);setStoryFlag(s,'mission_30_unbroken',half&&!s.missionState.down.length);},
 afterVictory(s){if(s.practice)return;setStoryFlag(s,'act4_completed',true);},
 rewardContext(s){const h=heartOf30(s);return {heartHalf30:!!h&&alive(h)&&h.hp>=h.maxHP/2};}
};
export const ACT4D_RULES={29:M29,30:M30};
