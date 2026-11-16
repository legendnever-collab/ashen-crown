// v0.10.2 ACT IV 「잿빛 왕관」 part 3 「잿빛 밤」 mission hooks (D-099/D-110, docs/v0.10.0/ACT4_DESIGN.md §3, §4.2, §7; rules and
// numbers PROPOSED). M01–M26 never reach this module.
// M27 The Royal Gate: two fronts — the escorted battering ram breaks the gate in three blows, and heroes take the wall at its
// three ladders; the gate broken with two sections held wins. The banners at trust 2 or more send squads; Baldrick rides
// beside the legion when he chose to cooperate at M26.
// M28 The Truth of the Ashen Night: the king's last memory. Three fragments open the night's truth (ACT4_DESIGN §3); the
// remnants stand again three turns after they fall; young Aren fights inside the memory; after the third fragment the legion
// holds until the night ends. Then Aren's confession is told to all, or to Erik alone (chosen in the camp).
import {missionOf,MISSIONS} from '../data/missions.js';
import {alive,distance,findUnit,hostile,strikeStats,at,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';
import {ensureTrust} from './factions.js';
import {act2Waves} from './mission-rules-v06.js';

function strike102(s,u,reachable,targets,goal,bonus=()=>0){let best=null;
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),a={...u,x,y};for(const t of targets){const d=distance(a,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,a,t),score=f.damage+bonus(t)+(t.hp<=f.damage?30:0)-c*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 · ${t.name}`};}}
 if(best)return best;if(!goal)return {x:u.x,y:u.y,target:null,reason:'대기'};let dest={x:u.x,y:u.y,score:distance(u,goal)};
 for(const [k,c] of reachable){const [x,y]=k.split(',').map(Number),d=distance({x,y},goal)+c*.01;if(d<dest.score)dest={x,y,score:d};}return {x:dest.x,y:dest.y,target:null,reason:`${goal.name||'목표'} 쪽으로`};}
const within102=(reachable,ok)=>new Map([...reachable].filter(([k])=>{const [x,y]=k.split(',').map(Number);return ok(x,y);}));
const nearest102=(u,list)=>[...list].sort((a,b)=>distance(u,a)-distance(u,b))[0];
const goalOf102=t=>t?{x:t.x,y:t.y,name:t.name}:null;
const heroesOf102=s=>s.units.filter(u=>u.team==='ally'&&alive(u));

// ---------- M27 The Royal Gate ----------
const ramOf27=s=>findUnit(s,'ram');
export const sectionsTaken27=s=>(s.missionState?.sections||[]).filter(Boolean).length;
// A banner sends its squad at trust 2 or more; Baldrick's riders come when he chose to ride beside the legion (M26 「협력」).
export const squads27=c=>['iron','free','flame'].filter(f=>(ensureTrust(c)[f]??0)>=MISSIONS[27].squadTrust);
export const lion27=c=>c?.flags?.mission_26_baldrick==='cooperate';
const SECTION_KO=['서쪽 성벽','서쪽 망루','동쪽 성벽'];
// Each player phase the ram rolls up to two tiles north on the road while a hero stands beside it (one with an enemy beside
// it); at the gate it strikes once a turn — three blows break the gate.
function moveRam27(s){const m=missionOf(s),st=s.missionState,r=ramOf27(s);if(!r||!alive(r)||st.broken)return;
 if(r.y<=m.ramRow){st.gate++;s.feedback.push({type:'hit',id:'gl1',text:`성문 ${st.gate}/${m.gateBlows}`});s.log.push(`공성추가 성문을 칩니다 (${st.gate}/${m.gateBlows}).`);
  if(st.gate>=m.gateBlows){st.broken=true;st.brokenTurn=s.turn;for(const id of ['gl1','gl2']){const g=findUnit(s,id);if(g)g.benched=true;}s.feedback.push({type:'rescue',id:'ram',text:'성문 돌파'});enqueueStory(s,'27:gate');}else if(st.gate===1)enqueueStory(s,'27:blow');return;}
 const escorted=heroesOf102(s).some(h=>distance(h,r)===1);if(!escorted){s.log.push('공성추: 곁에 장수가 없어 멈춰 있습니다.');return;}
 const pressed=s.units.some(e=>e.team==='enemy'&&alive(e)&&distance(e,r)===1),from={x:r.x,y:r.y},path=[];
 const road=(x,y)=>missionOf(s).map[y]?.[x]==='r'&&!at(s,x,y);let side=false;
 for(let i=0;i<(pressed?1:m.ramSteps)&&r.y>m.ramRow;i++){let moved=false;for(const [dx,dy] of [[0,-1],...(side?[]:[[1,0],[-1,0]])]){const x=r.x+dx,y=r.y+dy;if(!road(x,y))continue;if(dx)side=true;r.x=x;r.y=y;path.push({x,y});moved=true;break;}if(!moved)break;} /* it may step across to the other road lane once, like the M07 wagons */
 if(path.length){s.feedback.push({type:'move',id:'ram',path:[from,...path]});s.log.push(`공성추가 ${path.length}칸 전진합니다${pressed?' (습격을 받으며)':''}.`);}else s.log.push('공성추: 길이 막혀 기다립니다.');}
export const M27={
 init(s){const c=s.campaign,send=squads27(c),lion=lion27(c);
  for(const u of s.units.filter(u=>u.banner27&&!send.includes(u.banner27)||u.lion27&&!lion)){u.benched=true;u.absent=true;} /* a squad that did not come stays off the field (kept in the save, never drawn) */
  for(const u of s.units.filter(u=>u.wall))u.post={x:u.x,y:u.y};
  s.missionState={waves:[],gate:0,broken:false,brokenTurn:null,sections:[false,false,false],ramLost:false,squads:send,lion};
  if(send.length)enqueueStory(s,'27:squads');if(lion)enqueueStory(s,'27:lion');},
 clearLabel:'왕도의 성문을 열고 성벽에 오름',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Number.isInteger(m.gate)&&m.gate>=0&&m.gate<=3&&typeof m.broken==='boolean'&&(m.brokenTurn===null||Number.isInteger(m.brokenTurn))
  &&Array.isArray(m.sections)&&m.sections.length===3&&m.sections.every(v=>typeof v==='boolean')&&typeof m.ramLost==='boolean'&&Array.isArray(m.squads)&&m.squads.length<=3&&m.squads.every(f=>['iron','free','flame'].includes(f))&&new Set(m.squads).size===m.squads.length&&typeof m.lion==='boolean';},
 status(s){const m=missionOf(s),st=s.missionState,r=ramOf27(s);return `성문 ${st.broken?'돌파':`${st.gate}/${m.gateBlows}`} · 성벽 ${sectionsTaken27(s)}/${m.needSections} 장악 · 공성추 ${r&&alive(r)?`HP ${r.hp}/${r.maxHP}`:'부서짐'} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `성벽 장악 ${f.mission_27_sections??'—'}/3 · 공성추 HP 절반 이상 ${f.mission_27_ram_half==null?'—':f.mission_27_ram_half?'예':'아니요'} · 승리 턴 ${f.mission_27_turn??'—'}`;},
 onTurnStart(s){act2Waves(s);for(const u of s.units.filter(u=>u.wall&&!u.post))u.post={x:u.x,y:u.y};moveRam27(s);},
 // The wall's guards and archers hold their posts on the rampart; the rite knights hold the gatehouse until it breaks, then
 // go for the ram; the grey cloaks hunt the ram from the flanks.
 planEnemy(s,u,reachable){const st=s.missionState,r=ramOf27(s),ram=r&&alive(r)?[r]:[],foes=[...s.units.filter(t=>alive(t)&&hostile(s,u,t)),...ram],bonus=t=>t.id==='ram'?25:0;
  if(u.wall){const keep=within102(reachable,(x,y)=>Math.abs(x-u.post.x)+Math.abs(y-u.post.y)<=1);return strike102(s,u,keep.size?keep:reachable,foes,goalOf102({...u.post,name:'성벽'}),bonus);}
  if(u.look==='ritualKnight'&&!st.broken){const keep=within102(reachable,(x,y)=>y<=2);return strike102(s,u,keep.size?keep:reachable,foes,goalOf102(nearest102(u,heroesOf102(s).filter(h=>h.y<=2))||{x:u.x,y:u.y,name:'성문 안'}),bonus);}
  if(u.look==='grayCloak'&&ram.length)return strike102(s,u,reachable,foes,goalOf102(r),t=>t.id==='ram'?40:0);
  return strike102(s,u,reachable,foes,goalOf102(ram[0]||nearest102(u,foes)),bonus);},
 afterDamage(s,v){if(v.id==='ram'&&v.hp<=0&&!s.missionState.ramLost){s.missionState.ramLost=true;enqueueStory(s,'27:ram:lost');}},
 // A hero who ends the player phase on the rampart above a ladder takes that section of the wall (it stays taken).
 beforeEnemyPhase(s){const m=missionOf(s),st=s.missionState;m.sections.forEach(([x,y],i)=>{if(st.sections[i])return;const h=heroesOf102(s).find(h=>h.x===x&&h.y===y);if(!h)return;st.sections[i]=true;remember(s,`m27_section_${h.id}`);
  s.feedback.push({type:'rescue',id:h.id,text:`${SECTION_KO[i]} 장악`});s.log.push(`${h.name}: ${SECTION_KO[i]}을(를) 장악했습니다 (${sectionsTaken27(s)}/${m.needSections}).`);enqueueStory(s,`27:section:${sectionsTaken27(s)}`);});},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState;
  if(st.ramLost)return finish(s,'defeat','공성추가 부서졌습니다. 성문을 열 길이 사라졌습니다.');
  if(st.broken&&sectionsTaken27(s)>=m.needSections)return finish(s,'victory',`왕도의 성문을 부수고 성벽 ${sectionsTaken27(s)}곳을 장악했습니다 (TURN ${s.turn}).`);
  if(s.turn>m.turnLimit)return finish(s,'defeat',`TURN ${m.turnLimit} 안에 성문과 성벽을 열지 못했습니다.`);},
 beforeCommit(s){const r=ramOf27(s);setStoryFlag(s,'mission_27_turn',s.turn);setStoryFlag(s,'mission_27_sections',sectionsTaken27(s));setStoryFlag(s,'mission_27_ram_half',!!r&&alive(r)&&r.hp>=r.maxHP/2);setStoryFlag(s,'mission_27_squads',s.missionState.squads.length);},
 rewardContext(s){const r=ramOf27(s);return {ramHalf27:!!r&&alive(r)&&r.hp>=r.maxHP/2};}
};

// ---------- M28 The Truth of the Ashen Night ----------
export const MEMORY28={oath:'맹세의 단',king:'국왕의 자리',order:'봉인 명령'};
const remnantsOf28=s=>s.units.filter(u=>u.remnant);
export const M28={
 init(s){s.missionState={waves:[],found:[],dawnFrom:null};for(const u of remnantsOf28(s))u.post??={x:u.x,y:u.y};},
 clearLabel:'잿빛 밤의 끝까지 함께 봄',
 validState(m){return !!m&&typeof m==='object'&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0)&&Array.isArray(m.found)&&m.found.length<=3&&m.found.every(k=>MEMORY28[k])&&new Set(m.found).size===m.found.length&&(m.dawnFrom===null||Number.isInteger(m.dawnFrom)&&m.found.length===3);},
 status(s){const m=missionOf(s),st=s.missionState,e=findUnit(s,'eric'),standing=remnantsOf28(s).filter(alive).length;
  return `기억 조각 ${st.found.length}/3${st.dawnFrom!=null?` · 그 밤의 끝까지 ${Math.max(0,st.dawnFrom+m.dawnHold-s.turn)}턴`:''} · 잔영 ${standing} · 에릭 ${e&&alive(e)?`HP ${e.hp}/${e.maxHP}`:'쓰러짐'} · ${Math.max(0,m.turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `젊은 아렌 끝까지 섬 ${f.mission_28_aren_stood==null?'—':f.mission_28_aren_stood?'예':'아니요'} · 승리 턴 ${f.mission_28_turn??'—'}`;},
 // Remnants struck down three turns ago stand again at their post (or the nearest open tile) with full HP.
 onTurnStart(s){act2Waves(s);for(const u of remnantsOf28(s)){if(!u.post)u.post={x:u.x,y:u.y};if(u.reformAt==null||u.released||s.turn<u.reformAt)continue;const m=missionOf(s);let pos=u.post;
  if(at(s,pos.x,pos.y)){const free=[];for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s)?.cost)&&!s.units.some(o=>o.team==='object'&&!o.benched&&o.x===x&&o.y===y))free.push({x,y});free.sort((a,b)=>distance(a,u.post)-distance(b,u.post));pos=free[0]||u.post;}
  u.x=pos.x;u.y=pos.y;u.hp=u.maxHP;delete u.reformAt;delete u.status;u.moved=false;u.acted=false;s.feedback.push({type:'spawn',id:u.id,text:'잔영이 다시 섬'});s.log.push(`${u.name}: 흩어졌던 잔영이 다시 섭니다.`);}},
 // Remnants keep within three tiles of their post until the last fragment is read; then the night closes in on Erik. Those
 // that came later go for the nearest hero.
 planEnemy(s,u,reachable){const st=s.missionState,foes=s.units.filter(t=>alive(t)&&hostile(s,u,t)),e=findUnit(s,'eric'),onEric=t=>t.id==='eric'?10:0;
  if(st.dawnFrom!=null)return strike102(s,u,reachable,foes,goalOf102(e&&alive(e)?e:nearest102(u,foes)),onEric);
  if(u.remnant&&u.post&&!/^r1[1-4]$/.test(u.id)){const keep=within102(reachable,(x,y)=>Math.abs(x-u.post.x)+Math.abs(y-u.post.y)<=3);return strike102(s,u,keep.size?keep:reachable,foes,goalOf102(nearest102(u,foes.filter(t=>distance(t,u.post)<=5)))||goalOf102({...u.post,name:'제자리'}));}
  return strike102(s,u,reachable,foes,goalOf102(nearest102(u,foes)));},
 // Reading a fragment opens its scene and releases the remnants beside it (they do not stand again).
 search(s,u,t){if(t.kind!=='memory'||t.inert)return false;const st=s.missionState,m=missionOf(s);t.inert=true;st.found.push(t.memory);remember(s,`m28_memory_${t.memory}`);
  s.feedback.push({type:'rescue',id:t.id,text:`기억 ${st.found.length}/3`});s.log.push(`${u.name}: 기억 조각 「${MEMORY28[t.memory]}」을(를) 엽니다 (${st.found.length}/3).`);enqueueStory(s,`28:memory:${t.memory}`);
  for(const r of remnantsOf28(s).filter(r=>!r.released&&distance(r.reformAt!=null?r.post:r,t)<=m.releaseRadius)){r.released=true;if(alive(r)){r.hp=0;s.feedback.push({type:'death',id:r.id,text:'흩어짐'});}delete r.reformAt;}
  if(st.found.length===3){st.dawnFrom=s.turn;enqueueStory(s,'28:dawn');}return true;},
 afterDamage(s,v){if(v.remnant&&v.hp<=0&&!v.released&&v.reformAt==null){v.reformAt=s.turn+missionOf(s).reformTurns;s.log.push(`${v.name}: 흩어졌습니다. ${missionOf(s).reformTurns}턴 뒤 다시 섭니다.`);}},
 checkOutcome(s,finish){const m=missionOf(s),st=s.missionState,e=findUnit(s,'eric');
  if(e&&e.hp<=0&&!e.benched)return finish(s,'defeat','에릭이 쓰러졌습니다. 기억이 닫힙니다.');
  if(st.dawnFrom!=null&&s.turn>=st.dawnFrom+m.dawnHold){setStoryFlag(s,'mission_28_dawn_turn',s.turn);return finish(s,'victory',`잿빛 밤의 끝까지 지켜보았습니다 · 기억 조각 3/3 (TURN ${s.turn}).`);}
  if(s.turn>m.turnLimit)return finish(s,'defeat',`TURN ${m.turnLimit}이 지나 기억이 닫혔습니다.`);},
 beforeCommit(s){const a=findUnit(s,'aren');setStoryFlag(s,'mission_28_turn',s.turn);setStoryFlag(s,'mission_28_aren_stood',!!a&&alive(a));setStoryFlag(s,'mission_28_found',s.missionState.found.join(','));},
 rewardContext(s){const a=findUnit(s,'aren');return {arenStood28:!!a&&alive(a)};}
};
// Aren's confession (ACT4_DESIGN §4.2): to the whole legion, or to Erik alone. Kept for the endings; no trust changes.
export const CONFESSION28={all:'군단 모두에게 말한다',eric:'에릭에게만 말한다'};
export function chooseConfession28(s,id){const c=s.campaign;if(!CONFESSION28[id]||s.practice||c.choices?.m28_confession||!c.completed?.includes(28))return false;c.choices??={};c.choices.m28_confession=id;setStoryFlag(s,'mission_28_confession',id);return true;}
export const ACT4C_RULES={27:M27,28:M28};
