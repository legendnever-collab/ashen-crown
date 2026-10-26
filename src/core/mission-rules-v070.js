// v0.7.0 ACT II part 2 mission hooks (D-068; rules and numbers PROPOSED). M01–M10 never reach this module.
// M11 The Flame Procession: four pilgrims walk the night road to the sanctuary (two tiles a turn in light, one in the
// dark, none with an enemy beside them); three roadside braziers are lit with the search action. Ines and two Sacred
// Flame knights escort as allies. M12 The Silent Monastery: quiet guards watch ahead and turn in a fixed order; being
// seen raises suspicion, a second sighting or noise rings the bell; after the alarm the abbot burns unsecured records.
import {missionOf} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats,litAt,watchCells,key} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {spawnWave} from './mission-rules.js';
import {ensureTrust,adjustTrust} from './factions.js';
import {joinRoster} from './roster.js';
import {act2Waves} from './mission-rules-v06.js';

const outOf=u=>!u||u.hp<=0||u.captured;
// ---------- M11 The Flame Procession ----------
const pilgrimsOf=s=>s.units.filter(u=>u.team==='civilian');
const arrivedOf=s=>pilgrimsOf(s).filter(p=>p.rescued).length;
const lostPilgrims=s=>pilgrimsOf(s).filter(p=>p.hp<=0).length;
const braziersOf=s=>s.units.filter(u=>u.kind==='brazier');
const litCount=s=>braziersOf(s).filter(b=>b.lit).length;
// The road to the sanctuary (pilgrims keep to it); occupants are ignored here, a unit in the way stops the walk.
function roadRoute(s,p){const m=missionOf(s),start=key(p.x,p.y),prev=new Map([[start,null]]),q=[{x:p.x,y:p.y}];let goal=null;
 while(q.length){const c=q.shift();if(c.y<=m.sanctuaryRow&&key(c.x,c.y)!==start){goal=c;break;}
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const x=c.x+dx,y=c.y+dy,k=key(x,y);if(prev.has(k)||!m.road.includes(m.map[y]?.[x]))continue;prev.set(k,key(c.x,c.y));q.push({x,y});}}
 if(!goal)return [];const path=[];let k=key(goal.x,goal.y);while(k&&k!==start){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=prev.get(k);}return path;}
const blocker=(s,x,y)=>s.units.find(u=>alive(u)&&u.x===x&&u.y===y);
function marchPilgrims(s){const m=missionOf(s);
 for(const p of pilgrimsOf(s).filter(alive).sort((a,b)=>a.y-b.y||a.x-b.x)){
  if(s.units.some(e=>e.team==='enemy'&&alive(e)&&distance(e,p)===1)){s.log.push(`${p.name}: 적이 곁에 있어 멈춰 섭니다.`);continue;}
  const steps=litAt(s,p.x,p.y)?2:1,route=roadRoute(s,p),from={x:p.x,y:p.y},path=[];
  for(const c of route.slice(0,steps)){if(blocker(s,c.x,c.y))break;p.x=c.x;p.y=c.y;path.push(c);}
  if(!path.length){s.log.push(`${p.name}: 길이 막혀 기다립니다.`);continue;}
  s.feedback.push({type:'move',id:p.id,path:[from,...path]});
  if(p.y<=m.sanctuaryRow){p.rescued=true;s.feedback.push({type:'rescue',id:p.id,text:'SANCTUARY'});s.log.push(`${p.name}이(가) 성소에 들어섰습니다. (${arrivedOf(s)}/4)`);enqueueStory(s,'11:arrive');}
  else if(steps===2)s.log.push(`${p.name}: 화로 불빛을 따라 2칸 전진.`);}
}
function healLitPilgrims(s){for(const p of pilgrimsOf(s).filter(alive)){if(!litAt(s,p.x,p.y)||p.hp>=p.maxHP)continue;const n=Math.min(5,p.maxHP-p.hp);p.hp+=n;s.feedback.push({type:'heal',id:p.id,text:`+${n}`,toHP:p.hp});}}
// Escorts keep beside the nearest pilgrim still on the road (leash 2), never park on the road ahead of one, and strike
// whatever comes close.
function escortPlan(s,u,reachable,label){const flock=pilgrimsOf(s).filter(alive),m=missionOf(s);
 const post=flock.length?flock.sort((a,b)=>distance(u,a)-distance(u,b))[0]:null,ahead=(x,y)=>m.road.includes(m.map[y]?.[x])&&flock.some(p=>p.x===x&&p.y>y);
 const cells=[...reachable].map(([k,c])=>{const [x,y]=k.split(',').map(Number);return {x,y,c};}).filter(p=>(!post||distance(p,post)<=2)&&(!ahead(p.x,p.y)||p.x===u.x&&p.y===u.y));
 if(!cells.length)return {x:u.x,y:u.y,target:null,reason:`${label} 대기`};
 let best=null;for(const p of cells)for(const t of s.units.filter(t=>alive(t)&&hostile(s,u,t))){const d=distance(p,t);if(d<u.range[0]||d>u.range[1])continue;
  const f=strikeStats(s,{...u,x:p.x,y:p.y},t),score=f.damage+(t.hp<=f.damage?30:0)-p.c*.3;if(!best||score>best.score)best={x:p.x,y:p.y,target:t.id,score,reason:`${label} · ${t.name} 공격`};}
 if(best)return best;const goal=post||u;let dest=cells[0];for(const p of cells)if(distance(p,goal)+p.c*.01<distance(dest,goal)+dest.c*.01)dest=p;
 return {x:dest.x,y:dest.y,target:null,reason:`${label} · 순례자 곁`};}

export const M11={
 init(s){s.missionState={waves:[],lit:[]};if(!s.practice)ensureTrust(s.campaign);},
 clearLabel:'성화의 행렬 호위',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.lit)&&m.lit.every(id=>['br1','br2','br3'].includes(id))&&new Set(m.lit).size===m.lit.length;},
 status(s){const m=missionOf(s);return `성소 도착 ${arrivedOf(s)}/${m.arriveGoal}${lostPilgrims(s)?` · 잃은 순례자 ${lostPilgrims(s)}`:''} · 화로 ${litCount(s)}/3 · ${s.turn>m.turnLimit?'새벽':`새벽까지 ${Math.max(0,m.turnLimit+1-s.turn)}턴`}`;},
 optional(s){const f=s.campaign.flags;return `순례자 ${f.mission_11_arrived??arrivedOf(s)}/4 성소 도착 · 화로 ${f.mission_11_braziers??litCount(s)}/3`;},
 onTurnStart(s){act2Waves(s);healLitPilgrims(s);if(s.turn>=2)marchPilgrims(s);},
 beforeEnemyPhase(){},
 planAllied(s,u,reachable){return escortPlan(s,u,reachable,u.id==='ines_warden'?'성역 호위':'행렬 호위');},
 search(s,u,t){if(t.kind!=='brazier')return false;t.lit=true;t.inert=true;s.missionState.lit.push(t.id);remember(s,`m11_brazier_${u.id}`);
  s.feedback.push({type:'rescue',id:t.id,text:'LIGHT'});s.log.push(`${u.name}: ${t.name}에 불을 붙였습니다. 반경 ${missionOf(s).night.radius}칸이 밝아집니다. (${litCount(s)}/3)`);enqueueStory(s,'11:lit');return true;},
 afterDamage(s,v){if(v.team==='civilian'&&v.hp<=0)enqueueStory(s,'11:lost');},
 checkOutcome(s,finish){const m=missionOf(s),tail=` · 화로 ${litCount(s)}/3`;
  if(lostPilgrims(s)>=2)return finish(s,'defeat','순례자를 두 명 이상 잃었습니다.');
  if(arrivedOf(s)>=m.arriveGoal)return finish(s,'victory',`순례자 ${arrivedOf(s)}/4 성소 도착${tail}.`);
  if(s.turn>m.turnLimit)return finish(s,'victory',`새벽까지 행렬을 지켰습니다 · 순례자 ${4-lostPilgrims(s)}/4 무사${tail}.`);
 },
 beforeCommit(s){setStoryFlag(s,'mission_11_arrived',arrivedOf(s));setStoryFlag(s,'mission_11_safe',4-lostPilgrims(s));setStoryFlag(s,'mission_11_braziers',litCount(s));},
 // Sacred Flame trust (PROPOSED): every pilgrim through the sanctuary gate +1. The Order is met from here on.
 afterVictory(s){if(s.practice)return;setStoryFlag(s,'act2_flame_met');if(arrivedOf(s)===4)adjustTrust(s.campaign,'flame',1,'M11 · 순례자 모두를 성소까지 지켰다');},
 rewardContext(s){return {pilgrims:arrivedOf(s),braziers:litCount(s)};}
};
// Lucien's offer in the camp after M11 (PROPOSED trust): the refugees swear the flame oath and enter the sanctuary (+1)
// or the legion keeps caring for them (no change).
export function chooseOath(s,id){if(!['oath','legion'].includes(id)||s.practice||s.campaign.choices?.m11_oath)return false;s.campaign.choices??={};s.campaign.choices.m11_oath=id;setStoryFlag(s,'mission_11_oath',id);
 if(id==='oath')adjustTrust(s.campaign,'flame',1,'M11 · 피난민이 성화의 맹세를 하고 성소에 들었다');return true;}

// ---------- M12 The Silent Monastery ----------
const ALERT_KO=['조용','의심','경보'];
const sentries=s=>s.units.filter(u=>u.team==='enemy'&&(u.watch||u.id==='boss'));
const recordsOf=s=>s.units.filter(u=>u.team==='object'&&u.kind==='evidence');
const securedOf=s=>recordsOf(s).filter(r=>r.rescued&&!r.burned);
const ledgerOf=s=>recordsOf(s).find(r=>r.evidence==='ledger');
// Which quiet guard sees a hero right now (first match), for the log and the story.
function sighting(s){for(const g of s.units.filter(u=>u.watch&&alive(u)&&!u.awake)){const seen=watchCells(s,g);const h=s.units.find(u=>u.team==='ally'&&alive(u)&&seen.has(key(u.x,u.y)));if(h)return {g,h};}return null;}
function turnGuards(s){for(const g of s.units.filter(u=>u.watch&&alive(u)&&!u.awake&&u.turns?.length)){g.turnIndex=((g.turnIndex||0)+1)%g.turns.length;g.facing=g.turns[g.turnIndex];}}
const faceToward=(g,h)=>{const dx=h.x-g.x,dy=h.y-g.y;g.facing=Math.abs(dx)>=Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');};
function ringBell(s,why){const st=s.missionState;if(st.alarmTurn!==null)return;st.alert=2;st.alarmTurn=s.turn;st.burnTurn=s.turn+missionOf(s).burnDelay;
 for(const g of sentries(s))if(alive(g)){g.awake=true;g.mov=g.alertMov??3;}
 for(const w of missionOf(s).waves.filter(w=>w.alarm&&!st.waves.includes(w.turn))){st.waves.push(w.turn);spawnWave(s,w.units);if(w.story)enqueueStory(s,w.story);}
 s.log.push(`종이 울립니다! (${why}) 경비가 모두 깨어나고 숙소에서 셋이 나옵니다. TURN ${st.burnTurn}에 원장이 기록을 태웁니다.`);enqueueStory(s,'12:alarm');}
function spotted(s,{g,h}){const st=s.missionState;faceToward(g,h);
 if(st.alert>=1)return ringBell(s,`${g.name}이(가) ${h.name}을(를) 보았습니다`);st.alert=1;
 s.log.push(`${g.name}: "…누구냐?" ${h.name}의 그림자를 보았습니다. 수도원이 의심합니다 (감시 3칸).`);enqueueStory(s,'12:suspicion');}

export const M12={
 init(s){s.missionState={waves:[],alert:0,alarmTurn:null,burnTurn:null,burned:[],captured:false,quiet:false};},
 clearLabel:'침묵의 수도원 기록 확보',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&[0,1,2].includes(m.alert)&&(m.alarmTurn===null||Number.isInteger(m.alarmTurn))&&(m.burnTurn===null||Number.isInteger(m.burnTurn))&&Array.isArray(m.burned)&&m.burned.every(v=>['ledger','seal','roster'].includes(v))&&typeof m.captured==='boolean'&&typeof m.quiet==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,boss=findUnit(s,'boss');
  return `${ALERT_KO[st.alert]}${st.burnTurn&&!outOf(boss)&&s.turn<st.burnTurn?` · 소각까지 ${st.burnTurn-s.turn}턴`:''} · 기록 ${securedOf(s).length}/3${st.burned.length?` · 소각 ${st.burned.length}`:''} · 원장 ${st.captured?'생포':outOf(boss)?'격파':`HP ${Math.round(100*Math.max(0,boss.hp)/boss.maxHP)}%`} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `기록 ${f.mission_12_records??securedOf(s).length}/3 확보${(f.mission_12_quiet??s.missionState?.quiet)?' · 경보 전에 장부 확보':''}${(f.mission_12_abbot_captured||s.missionState?.captured)?' · 원장 생포':''}`;},
 // The bell: while the monastery is not yet alarmed, the guards look (then turn, then look again) at the start of the
 // enemy phase; one sighting per phase raises the alert one step.
 beforeEnemyPhase(s){if(s.missionState.alert>=2)return;let seen=sighting(s);turnGuards(s);seen=seen||sighting(s);if(seen)spotted(s,seen);},
 onTurnStart(s){const st=s.missionState,boss=findUnit(s,'boss');if(!st.burnTurn||outOf(boss))return;
  if(s.turn===st.burnTurn-1&&recordsOf(s).some(r=>!r.rescued)){enqueueStory(s,'12:burn-warn');s.log.push('원장이 기록 보관소에 불을 붙일 준비를 합니다. 이번 TURN이 마지막 기회입니다.');}
  if(s.turn>=st.burnTurn){let n=0;for(const r of recordsOf(s).filter(r=>!r.rescued&&!r.burned)){r.hp=0;r.burned=true;st.burned.push(r.evidence);n++;s.feedback.push({type:'death',id:r.id,text:'BURNED'});s.log.push(`${r.name}이(가) 불타 사라졌습니다.`);}if(n)enqueueStory(s,'12:burn');}},
 // Quiet guards and the abbot keep their places until the bell; then everyone hunts the legion.
 planEnemy(s,u){if(!(u.watch||u.id==='boss')||u.awake)return null;return {x:u.x,y:u.y,target:null,reason:u.id==='boss'?'기록 보관소에서 기도':`감시 · ${({up:'북',down:'남',left:'서',right:'동'})[u.facing]||''}쪽`};},
 // Noise: striking a guard or the abbot without dropping them in one blow rings the bell.
 onAction(s,u,mode,t){if(mode==='search'&&t?.evidence==='ledger'&&s.missionState.alert<2){s.missionState.quiet=true;s.log.push('경보가 울리기 전에 장부 기록을 확보했습니다.');}
  if(s.missionState.alert>=2||!t||t.team!=='enemy'||!['attack','skill'].includes(mode))return;if(!(t.watch||t.id==='boss'))return;
  if(alive(t))ringBell(s,`${t.name}이(가) 소리쳤습니다`);else{remember(s,`m12_silent_${u.id}`);s.log.push(`${u.name}: ${t.name}을(를) 소리 없이 쓰러뜨렸습니다.`);enqueueStory(s,'12:silent');}},
 capture(s,u,t){t.rescued=true;t.captured=true;s.missionState.captured=true;setStoryFlag(s,'mission_12_abbot_captured');remember(s,`${u.id}_capture`);
  s.feedback.push({type:'rescue',id:t.id,text:'CAPTURED'});s.log.push(`${u.name}: 침묵의 원장을 생포했습니다. 소각은 멈춥니다.`);enqueueStory(s,'12:capture');},
 checkOutcome(s,finish){const m=missionOf(s),boss=findUnit(s,'boss'),ledger=ledgerOf(s),tail=` · 기록 ${securedOf(s).length}/3${s.missionState.quiet?' · 경보 전에 장부 확보':''}`;
  if(ledger?.burned)return finish(s,'defeat','장부 기록이 불타 버렸습니다.');
  if(ledger?.rescued&&outOf(boss))return finish(s,'victory',`장부 기록 확보 · 원장 ${s.missionState.captured?'생포':'격파'}${tail}.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 장부 기록과 원장을 확보하지 못했습니다.`);
 },
 beforeCommit(s){const r=recordsOf(s),by=id=>r.some(x=>x.rescued&&!x.burned&&x.searchedBy===id);
  setStoryFlag(s,'mission_12_records',securedOf(s).length);for(const x of r)setStoryFlag(s,`mission_12_${x.evidence}`,!!(x.rescued&&!x.burned));
  setStoryFlag(s,'mission_12_alarm',s.missionState.alert>=2);setStoryFlag(s,'mission_12_quiet',!!s.missionState.quiet);setStoryFlag(s,'mission_12_abbot_captured',!!s.missionState.captured);setStoryFlag(s,'mission_12_copy_ready',by('lia')&&by('kai'));},
 afterVictory(){},
 rewardContext(s){return {records12:securedOf(s).length,silent12:!!s.missionState.quiet,abbot12:!!s.missionState.captured};}
};
export const inesEligible=c=>(ensureTrust(c).flame>=1)||c.choices?.m12_records==='copy';
// The forbidden records, decided in the camp after M12 (PROPOSED trust): return them to the Order (+1), keep them in the
// legion (−1), or let Lia and Kai copy them and return them (0; only when both searched a record in the battle). Ines
// asks to join when the Order trusts the legion or the records went back whole.
export function chooseRecords(s,id){const c=s.campaign;if(!['return','take','copy'].includes(id)||s.practice||c.choices?.m12_records||!c.completed?.includes(12))return false;if(id==='copy'&&!c.flags?.mission_12_copy_ready)return false;
 c.choices??={};c.choices.m12_records=id;setStoryFlag(s,'mission_12_records_choice',id);
 if(id==='return')adjustTrust(c,'flame',1,'M12 · 금지 기록을 교단에 돌려주었다');if(id==='take')adjustTrust(c,'flame',-1,'M12 · 금지 기록을 군단이 가져갔다');
 const ok=inesEligible(c);setStoryFlag(s,'ines_joined',ok);if(ok){joinRoster(s,'ines',10);s.stageStart=null;}return true;}
export const ACT2C_RULES={11:M11,12:M12};
