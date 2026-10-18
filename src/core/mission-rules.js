// v0.4 mission hooks. M01–03 never reach this module, so their rules stay byte-for-byte the same.
import {missionOf} from '../data/missions.js';
import {alive,at,distance,findUnit,terrainAt,strikeStats,isolated} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';

export const objectUnit=o=>({...structuredClone(o),team:'object',hp:1,maxHP:1,mp:0,maxMP:0,atk:0,def:0,mag:0,res:0,spd:0,mov:0,range:[0,0],rescued:false});
export const enemyUnit=(e,spawnTurn=0)=>({...structuredClone(e),team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,moved:false,acted:false,spawnTurn});
const searched=(s,type)=>s.units.some(u=>u.team==='object'&&u.evidence===type&&u.rescued);

export function spawnWave(s,list){
 const m=missionOf(s);
 for(const e of list){let pos={x:e.x,y:e.y};if(at(s,pos.x,pos.y)){const free=[];for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s)?.cost))free.push({x,y});free.sort((a,b)=>distance(a,e)-distance(b,e)||a.y-b.y||a.x-b.x);pos=free[0];}
  s.units.push({...enemyUnit(e,s.turn),...pos});s.feedback.push({type:'spawn',id:e.id,text:'REINFORCEMENT'});}
}

const M4={
 init(s){s.missionState={alerted:false,burned:[],waves:[]};},
 clearLabel:'성채 조사 완수',
 validState(m){return !!m&&typeof m==='object'&&typeof m.alerted==='boolean'&&Array.isArray(m.burned)&&m.burned.every(v=>['seal','orders'].includes(v))&&new Set(m.burned).size===m.burned.length&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0);},
 status(s){const found=['ledger','seal','orders'].filter(t=>searched(s,t)).length,left=Math.max(0,missionOf(s).burnTurn-s.turn);return `증거 ${found}/3${s.missionState?.burned.length?` · 소각 ${s.missionState.burned.length}`:left&&s.turn<missionOf(s).burnTurn?` · 소각까지 ${left}턴`:''} · ${Math.max(0,missionOf(s).turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `증거 ${['mission_04_ledger_recovered','mission_04_seal_notes','mission_04_transfer_orders'].filter(k=>f[k]).length}/3 확보${f.mission_04_evidence_burned?` · 소각 ${f.mission_04_evidence_burned}`:''}`;},
 alert(s){const boss=findUnit(s,'boss');if(s.missionState.alerted||!alive(boss))return;if(s.turn>=6||s.units.some(u=>u.team==='ally'&&alive(u)&&distance(u,boss)<=4)){s.missionState.alerted=true;boss.mov=boss.alertMov;enqueueStory(s,'4:alert');s.log.push('성채 병참관이 보관실을 떠나 직접 움직입니다.');}},
 beforeEnemyPhase(s){M4.alert(s);},
 onTurnStart(s){
  const m=missionOf(s);
  for(const w of m.waves)if(s.turn===w.turn&&!s.missionState.waves.includes(w.turn)){s.missionState.waves.push(w.turn);spawnWave(s,w.units);if(w.story)enqueueStory(s,w.story);s.log.push(`적 증원 ${w.units.length}명 출현.`);}
  if(s.turn===m.burnTurn-1){const torches=s.units.filter(u=>u.burns&&alive(u)&&!searched(s,u.burns));if(torches.length){enqueueStory(s,'4:burn-warn');s.log.push('횃불 병참병이 기록고에 불을 붙일 준비를 합니다. 이번 TURN이 마지막 기회입니다.');}}
  if(s.turn===m.burnTurn){for(const t of s.units.filter(u=>u.burns&&alive(u))){const o=s.units.find(u=>u.team==='object'&&u.evidence===t.burns);if(o&&alive(o)){o.hp=0;o.burned=true;s.missionState.burned.push(o.evidence);s.feedback.push({type:'death',id:o.id,text:'BURNED'});s.log.push(`${o.name}이(가) 불타 사라졌습니다.`);}}if(s.missionState.burned.length)enqueueStory(s,'4:burn');}
  M4.alert(s);
 },
 checkOutcome(s,finish){
  if(s.turn>missionOf(s).turnLimit)return finish(s,'defeat','제한 14턴 안에 장부 확보와 병참관 격파를 마치지 못했습니다.');
  if(searched(s,'ledger')&&findUnit(s,'boss').hp<=0)finish(s,'victory',`보급 장부 확보 · 성채 병참관 격파 · 증거 ${['ledger','seal','orders'].filter(t=>searched(s,t)).length}/3.`);
 },
 beforeCommit(s){
  setStoryFlag(s,'mission_04_ledger_recovered');
  if(searched(s,'seal'))setStoryFlag(s,'mission_04_seal_notes');
  if(searched(s,'orders'))setStoryFlag(s,'mission_04_transfer_orders');
  setStoryFlag(s,'mission_04_evidence_burned',s.missionState.burned.length);
 },
 afterVictory(s){
  if(s.practice)return;const m=s.campaign.tacticalMemory,prior=s.stageStart?.campaign.tacticalMemory||{},did=k=>(m[k]||0)>(prior[k]||0);
  if(did('lia_search')&&did('kai_search')){s.campaign.bonds.lia_kai=true;setStoryFlag(s,'bond_lia_kai');enqueueStory(s,'4:bond');}
 },
 rewardContext(s){return {seal:!!s.campaign.flags.mission_04_seal_notes,orders:!!s.campaign.flags.mission_04_transfer_orders};}
};

// ---------- M05 The Lion of the Frontier ----------
const wagonsOf=s=>s.units.filter(u=>u.kind==='wagon');
const bearersOf=s=>missionOf(s).formation.bearers.map(id=>findUnit(s,id)).filter(Boolean);
const formationIntact=s=>bearersOf(s).some(alive);
const lionFloor=b=>Math.ceil(b.maxHP/2);
function runWaves(s){for(const w of missionOf(s).waves)if(s.turn===w.turn&&!s.missionState.waves.includes(w.turn)){s.missionState.waves.push(w.turn);spawnWave(s,w.units);if(w.story)enqueueStory(s,w.story);s.log.push(`적 증원 ${w.units.length}명 출현.`);}}
function lionCells(s,u,reachable){
 const form=missionOf(s).formation,boss=findUnit(s,'boss'),live=bearersOf(s).filter(alive);
 let cells=[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c};});
 if(u.id==='boss'&&live.length)cells=cells.filter(p=>live.some(b=>distance(p,b)<=form.leash));
 if(form.bearers.includes(u.id)&&boss&&alive(boss))cells=cells.filter(p=>distance(p,boss)<=form.leash);
 return cells.length?cells:[{x:u.x,y:u.y,c:0}];
}
const M5={
 init(s){s.missionState={waves:[],broken:false,withdrew:null};},
 clearLabel:'국경 이동로 사수',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&typeof m.broken==='boolean'&&[null,'broken','held'].includes(m.withdrew);},
 status(s){const b=findUnit(s,'boss'),bearers=bearersOf(s).filter(u=>!alive(u)).length,w=wagonsOf(s).filter(alive).length;return `기수 격파 ${bearers}/2 · 발드릭 HP ${Math.round(100*b.hp/b.maxHP)}% · 마차 ${w}/2 · ${Math.max(0,missionOf(s).turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `${f.mission_05_baldrick_withdrew==='broken'?'대형 붕괴':'이동로 사수'} · 마차 ${f.mission_05_wagons_saved??wagonsOf(s).filter(alive).length}/2`;},
 checkFormation(s){if(!s.missionState.broken&&!formationIntact(s)){s.missionState.broken=true;enqueueStory(s,'5:formation-broken');s.log.push('사자 기수가 모두 쓰러졌습니다. 오라가 사라지고 발드릭이 대형을 버리고 전진합니다.');}},
 afterDamage(s,v){
  if(v.id==='boss'&&v.hp<lionFloor(v)){v.hp=lionFloor(v);s.log.push('발드릭은 쓰러지지 않습니다. 더 이상의 피해는 막아 냅니다.');}
  if(missionOf(s).formation.bearers.includes(v.id)&&!alive(v))M5.checkFormation(s);
 },
 onAction(s,u,mode,t){
  if(s.practice||!t)return;
  if(u.id==='sain'&&mode==='skill'&&t.id==='elina')remember(s,'m5_sain_heals_elina');
  if(u.id==='elina'&&t.team==='enemy'&&!alive(t)&&s.units.some(a=>a.id==='sain'&&alive(a)&&distance(a,t)===1))remember(s,'m5_elina_guards_sain');
 },
 onTurnStart(s){runWaves(s);M5.checkFormation(s);},
 beforeEnemyPhase(){},
 // ally ids Baldrick can charge next enemy phase (isolated and within his reach)
 threats(s){const b=findUnit(s,'boss');if(!b||!alive(b)||s.outcome)return [];const reach=movementCells(s,b);return s.units.filter(t=>t.team==='ally'&&alive(t)&&isolated(s,t)&&reach.some(p=>distance(p,t)===1)).map(t=>t.id);},
 auraCells(s){const out=[];for(const b of bearersOf(s).filter(alive))for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])out.push({x:b.x+dx,y:b.y+dy});return out;},
 planEnemy(s,u,reachable){
  const form=missionOf(s).formation,lion=u.id==='boss'||form.bearers.includes(u.id),rider=u.kind==='cavalry';
  if(!lion&&!rider)return null;
  const cells=lion?lionCells(s,u,reachable):[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c};});
  const wagons=wagonsOf(s).filter(alive),targets=[...s.units.filter(t=>t.team==='ally'&&alive(t)),...(rider?wagons:[])];let best=null;
  for(const p of cells)for(const t of targets){if(at(s,p.x,p.y)&&!(p.x===u.x&&p.y===u.y))continue;const d=distance(p,t);if(d<u.range[0]||d>u.range[1])continue;
   const f=strikeStats(s,{...u,x:p.x,y:p.y},t);const score=f.damage+(t.hp<=f.damage?30:0)+(u.id==='boss'&&isolated(s,t)?20:0)+(rider&&t.kind==='wagon'?40:0)+(t.id==='sain'?8:0)-p.c*.3;
   if(!best||score>best.score)best={x:p.x,y:p.y,target:t.id,score,reason:u.id==='boss'&&isolated(s,t)?`사자의 돌격 · 고립된 ${t.name}`:rider&&t.kind==='wagon'?'보급 마차 습격':`공격 가능 · 거리 ${d}`};}
  if(best)return best;
  const goals=rider&&wagons.length?wagons:s.units.filter(t=>t.team==='ally'&&alive(t));if(!goals.length)return {x:u.x,y:u.y,target:null,reason:'대상 없음'};
  let dest=null;for(const p of cells){if(at(s,p.x,p.y)&&!(p.x===u.x&&p.y===u.y))continue;const d=Math.min(...goals.map(g=>distance(p,g)))+p.c*.01;if(!dest||d<dest.d)dest={...p,d};}
  return {x:dest.x,y:dest.y,target:null,reason:lion&&formationIntact(s)?'사자 대형 유지':rider?'보급 마차로 돌진':'전진'};
 },
 checkOutcome(s,finish){
  const wagons=wagonsOf(s),saved=wagons.filter(alive).length,boss=findUnit(s,'boss'),m=missionOf(s);
  if(!saved)return finish(s,'defeat','보급 마차를 모두 잃었습니다.');
  const answer=s.campaign.choices?.m05_erik_answer;
  const withdraw=mode=>{s.missionState.withdrew=mode;boss.withdrawn=true;enqueueStory(s,`5:withdraw:${mode}`);if(answer)enqueueStory(s,`5:farewell:${answer}`);};
  if(!formationIntact(s)&&boss.hp<=lionFloor(boss)){withdraw('broken');return finish(s,'victory',`사자 대형 붕괴 · 발드릭 퇴각 · 마차 ${saved}/2.`);}
  if(s.turn>m.turnLimit){withdraw('held');return finish(s,'victory',`TURN ${m.turnLimit}까지 이동로 사수 · 마차 ${saved}/2 · 발드릭이 시한 초과로 퇴각.`);}
 },
 beforeCommit(s){setStoryFlag(s,'mission_05_baldrick_withdrew',s.missionState.withdrew);setStoryFlag(s,'mission_05_wagons_saved',wagonsOf(s).filter(alive).length);},
 afterVictory(s){
  if(s.practice)return;const m=s.campaign.tacticalMemory,prior=s.stageStart?.campaign.tacticalMemory||{},did=k=>(m[k]||0)>(prior[k]||0);
  if(did('m5_sain_heals_elina')&&did('m5_elina_guards_sain')){s.campaign.bonds.elina_sain=true;setStoryFlag(s,'bond_elina_sain');enqueueStory(s,'5:bond');}
 }
};
function movementCells(s,u){const out=[];const mov=u.mov,seen=new Map([[`${u.x},${u.y}`,0]]),q=[{x:u.x,y:u.y,c:0}];while(q.length){const p=q.shift();out.push(p);for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,y=p.y+dy,t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;const o=at(s,x,y);if(o&&o.team!==u.team)continue;const c=p.c+t.cost;if(c>mov||c>=(seen.get(`${x},${y}`)??Infinity))continue;seen.set(`${x},${y}`,c);q.push({x,y,c});}}const live=bearersOf(s).filter(alive);return u.id==='boss'&&live.length?out.filter(p=>live.some(b=>distance(p,b)<=missionOf(s).formation.leash)):out;}

// ---------- M06 The Ashen Oath (ACT I finale) ----------
const SAFE_Y=2;
const refugeesOf=s=>s.units.filter(u=>u.team==='civilian');
const passedOf=s=>refugeesOf(s).filter(u=>u.rescued).length;
const stonesOf=s=>s.units.filter(u=>u.kind==='sealstone');
const GUARD_STONE={k1:'seal1',k2:'seal1',k3:'seal2',k4:'seal2'};
function triggerWaves(s,trigger){const m=missionOf(s),st=s.missionState;m.waves.forEach((w,i)=>{if(w.trigger!==trigger||st.waves.includes(i+1))return;
 if(w.when==='reported'&&s.campaign.choices?.m04_records_choice!=='reported')return;st.waves.push(i+1);
 if(w.unlessBeacon&&!alive(findUnit(s,'beacon'))){s.log.push('봉화가 꺼져 관문 수비대 증원이 오지 않습니다.');return;}
 spawnWave(s,w.units);if(w.story)enqueueStory(s,w.story);s.log.push(`적 증원 ${w.units.length}명 출현.`);});}
// refugees walk the shortest open route north; they may pass through heroes but never stop on anyone
function refugeeRoute(s,c){const start=`${c.x},${c.y}`,prev=new Map([[start,null]]),q=[{x:c.x,y:c.y}];let goal=null;
 while(q.length){const p=q.shift();if(p.y<=SAFE_Y&&`${p.x},${p.y}`!==start){goal=p;break;}
  for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,k=`${x},${y}`;if(prev.has(k))continue;const t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;const o=at(s,x,y);if(o&&o.team!=='ally')continue;prev.set(k,`${p.x},${p.y}`);q.push({x,y});}}
 if(!goal)return [];const path=[];let k=`${goal.x},${goal.y}`;while(k&&k!==start){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=prev.get(k);}return path;}
function escortRefugees(s){const st=s.missionState;
 for(const c of refugeesOf(s).filter(alive)){
  if(c.hp<=c.maxHP/2){s.log.push(`${c.name}: 부상이 심해 움직이지 못합니다. 세인의 치유가 필요합니다.`);continue;}
  const escorted=s.units.some(u=>u.team==='ally'&&alive(u)&&distance(u,c)===1),steps=escorted?2:st.lever?1:0;if(!steps)continue;
  const path=refugeeRoute(s,c);let dest=-1;for(let i=0;i<Math.min(steps,path.length);i++)if(!at(s,path[i].x,path[i].y))dest=i;if(dest<0)continue;
  const from={x:c.x,y:c.y};c.x=path[dest].x;c.y=path[dest].y;s.feedback.push({type:'move',id:c.id,path:[from,...path.slice(0,dest+1)]});
  if(c.y<=SAFE_Y){c.rescued=true;s.feedback.push({type:'rescue',id:c.id,text:'SAFE'});s.log.push(`${c.name}이(가) 관문을 넘었습니다. (${passedOf(s)}/4)`);enqueueStory(s,'6:through');}
  else s.log.push(`${c.name} ${escorted?'호위 이동':'우회로 이동'}.`);}}
// civBias < 0: soldiers prefer heroes and only strike refugees when nothing better is in reach
function plan6(s,u,cells,{civBias=-20,goal=null,reason='전진'}={}){
 const targets=s.units.filter(t=>alive(t)&&(t.team==='ally'||t.team==='civilian'&&s.turn>=missionOf(s).threatTurn));let best=null;
 for(const p of cells)for(const t of targets){if(at(s,p.x,p.y)&&!(p.x===u.x&&p.y===u.y))continue;const d=distance(p,t);if(d<u.range[0]||d>u.range[1])continue;
  const f=strikeStats(s,{...u,x:p.x,y:p.y},t);const score=f.damage+(t.hp<=f.damage?30:0)+(t.team==='civilian'?civBias:0)+(t.id==='sain'?8:0)-p.c*.3;
  if(!best||score>best.score)best={x:p.x,y:p.y,target:t.id,score,reason:t.team==='civilian'?'피난민 위협':`공격 가능 · 거리 ${d}`};}
 if(best)return best;
 const goals=goal?[goal]:targets;if(!goals.length)return {x:u.x,y:u.y,target:null,reason:'대상 없음'};
 let dest=null;for(const p of cells){if(at(s,p.x,p.y)&&!(p.x===u.x&&p.y===u.y))continue;const d=Math.min(...goals.map(g=>distance(p,g)))+p.c*.01;if(!dest||d<dest.d)dest={...p,d};}
 return dest?{x:dest.x,y:dest.y,target:null,reason}:{x:u.x,y:u.y,target:null,reason:'대기'};}
const M6={
 init(s){s.missionState={phase:1,waves:[],lever:false,beacon:false,banner:false};triggerWaves(s,'start');},
 clearLabel:'재의 맹세 · 관문 돌파',
 validState(m){return !!m&&typeof m==='object'&&[1,2,3].includes(m.phase)&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0&&n<=3)&&new Set(m.waves).size===m.waves.length&&['lever','beacon','banner'].every(k=>typeof m[k]==='boolean');},
 status(s){const st=s.missionState,m=missionOf(s),open=stonesOf(s).filter(o=>o.rescued).length;return `${st.phase}단계 · 피난민 통과 ${passedOf(s)}/4 · 봉인석 ${open}/2${st.phase<3?` · 봉인까지 ${Math.max(0,m.sealTurn+1-s.turn)}턴`:' · 관문 돌파!'}`;},
 optional(s){const f=s.campaign.flags;return `피난민 ${f.mission_06_refugees_through??passedOf(s)}/4 통과${f.mission_06_beacon_destroyed||s.missionState?.beacon?' · 봉화 파괴':''}`;},
 phaseCheck(s){const st=s.missionState;if(s.outcome)return;
  if(st.phase===1&&(passedOf(s)>=2||s.turn>=5)){st.phase=2;for(const o of stonesOf(s))o.locked=false;enqueueStory(s,'6:phase2');s.log.push('2단계 · 봉인 해제: 봉인석에 인접해 해제하세요 (리아 1회, 다른 장수 2회 누적).');triggerWaves(s,'phase2');}
  if(st.phase===2&&stonesOf(s).every(o=>o.rescued)){st.phase=3;const boss=findUnit(s,'boss');if(alive(boss))boss.mov=boss.breakMov;enqueueStory(s,'6:phase3');s.log.push('3단계 · 탈출: 봉쇄 집행관 격파 또는 생존 장수 전원 관문 북쪽(y≤2) 철수.');
   const erik=findUnit(s,'eric');if(erik&&alive(erik)){st.banner=true;for(const a of s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,erik)<=2))a.oathUntil=s.turn+1;enqueueStory(s,'6:banner');s.log.push('맹세의 깃발: 에릭 2칸 이내 동료는 이번과 다음 Player Phase에 MOV +1.');s.feedback.push({type:'guard',id:'eric',text:'OATH'});}
   triggerWaves(s,'phase3');}},
 search(s,u,t){
  if(t.kind==='sealstone'){t.progress=(t.progress||0)+(u.id==='lia'?2:1);remember(s,`m6_unseal_${u.id}`);
   if(t.progress>=2){t.rescued=true;s.feedback.push({type:'rescue',id:t.id,text:'UNSEALED'});s.log.push(`${u.name}: 봉인석 해제.`);enqueueStory(s,'6:unseal');}
   else{s.feedback.push({type:'rescue',id:t.id,text:'1/2'});s.log.push(`${u.name}: 봉인 해제 진행 1/2.`);}
   M6.phaseCheck(s);return true;}
  if(t.kind==='lever'){t.rescued=true;s.missionState.lever=true;const gate=findUnit(s,'sidegate');if(gate)gate.rescued=true;if(u.id==='kai')remember(s,'m6_kai_lever');s.feedback.push({type:'rescue',id:t.id,text:'OPEN'});s.log.push('측면 관문이 열렸습니다. 피난민은 호위가 없어도 매 턴 1칸씩 우회로로 이동합니다.');enqueueStory(s,'6:lever');return true;}
  return false;},
 afterDamage(s,v){if(v.id==='beacon'&&!alive(v)&&!s.missionState.beacon){s.missionState.beacon=true;enqueueStory(s,'6:beacon');s.log.push('감시탑 봉화가 꺼졌습니다. 3단계 관문 수비대 증원이 취소됩니다.');}},
 onAction(s,u,mode,t){if(s.practice)return;if(u.id==='sain'&&mode==='skill'&&t?.team==='civilian')remember(s,'m6_sain_refugee');if(u.id==='elina'&&t?.id==='beacon'&&!alive(t))remember(s,'m6_elina_beacon');M6.phaseCheck(s);},
 onTurnStart(s){escortRefugees(s);M6.phaseCheck(s);},
 beforeEnemyPhase(){},
 planEnemy(s,u,reachable){
  const cells=[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c};}),st=s.missionState;
  if(u.kind==='beacon')return {x:u.x,y:u.y,target:null,reason:'봉화 신호 대기'};
  if(u.id==='boss'){if(st.phase<3)return plan6(s,u,[{x:u.x,y:u.y,c:0}],{reason:'관문 북쪽 지휘'});const hold=cells.filter(p=>p.y<=SAFE_Y);return plan6(s,u,hold.length?hold:cells,{goal:{x:8,y:2},reason:'관문을 직접 막는다'});}
  if(GUARD_STONE[u.id]){const stone=findUnit(s,GUARD_STONE[u.id]);if(stone&&!stone.rescued){const near=cells.filter(p=>distance(p,stone)<=2);return plan6(s,u,near.length?near:[{x:u.x,y:u.y,c:0}],{goal:stone,reason:'봉인석 사수'});}}
  if(/^r\d/.test(u.id))return plan6(s,u,cells,{civBias:40,goal:refugeesOf(s).filter(alive).sort((a,b)=>distance(u,a)-distance(u,b))[0]||null,reason:'피난민 추격'});
  return plan6(s,u,cells,{reason:'공격 대상으로 이동'});},
 checkOutcome(s,finish){
  const st=s.missionState,m=missionOf(s),passed=passedOf(s),boss=findUnit(s,'boss');
  if(!passed&&refugeesOf(s).every(c=>!alive(c)))return finish(s,'defeat','피난민을 모두 잃었습니다.');
  if(st.phase<3&&s.turn>m.sealTurn)return finish(s,'defeat',`TURN ${m.sealTurn}이 끝나 관문이 봉인되었습니다.`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`제한 ${m.turnLimit}턴 안에 관문을 넘지 못했습니다.`);
  if(st.phase===3&&passed>=1){const heroes=s.units.filter(u=>u.team==='ally'&&alive(u));
   if(!alive(boss))return finish(s,'victory',`봉쇄 집행관 격파 · 피난민 ${passed}/4 통과.`);
   if(heroes.length&&heroes.every(u=>u.y<=SAFE_Y))return finish(s,'victory',`관문 돌파 · 생존 장수 전원 철수 · 피난민 ${passed}/4 통과.`);}
 },
 beforeCommit(s){setStoryFlag(s,'mission_06_refugees_through',passedOf(s));setStoryFlag(s,'mission_06_beacon_destroyed',!!s.missionState.beacon);setStoryFlag(s,'act1_completed');setStoryFlag(s,'legion_independent');},
 afterVictory(){},
 rewardContext(s){return {refugees:passedOf(s),beacon:!!s.missionState.beacon};}
};
export const MISSION_RULES={4:M4,5:M5,6:M6};
export const rulesOf=s=>MISSION_RULES[s?.missionId]||null;

export function searchEvidence(s,u,t){
 t.rescued=true;t.searchedBy=u.id;remember(s,`${u.id}_search`);
 s.feedback.push({type:'rescue',id:t.id,text:'SEARCHED'});s.log.push(`${u.name}: ${t.name} 조사 완료.`);
 enqueueStory(s,`${s.missionId}:search:${t.evidence}`);
 if(t.evidence==='seal'&&u.id==='lia')enqueueStory(s,`${s.missionId}:search:seal:lia`);
 if(t.evidence==='orders'&&u.id==='kai')enqueueStory(s,`${s.missionId}:search:orders:kai`);
}
export const missionUnitIds=m=>[...m.enemies,...m.reinforcements,...m.civilians,...(m.objects||[]),...(m.waves||[]).flatMap(w=>w.units)].map(u=>u.id);
export const maxUnits=m=>5+missionUnitIds(m).length;
