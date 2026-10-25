import {applyTerrainRecovery,recoveryValue} from './terrain-recovery.js';
import {ensureEconomy,commitEconomyReward,useTool,effectiveStats} from './economy.js';
import {VERSION,SCHEMA,HEROES,ENEMIES,REINFORCEMENTS,CIVILIANS,DEPLOYMENTS,BALANCE,partyHeroes,partyIds} from '../data/game-data.js';
import {distance,key,alive,at,findUnit,movement,pathTo,skillCost,validTarget,forecast,strikeStats,guardFor,roll,awardXP,discover,terrainAt,counterBlocked,hostile} from './rules.js';
import {MISSIONS,missionOf,LAST_MISSION} from '../data/missions.js';
import {rulesOf,objectUnit,searchEvidence} from './mission-rules.js';
import {narrativeState,enqueueStory,remember,setStoryFlag,afterBattleEvents} from './narrative.js';
import {proficiencyBonus,commitSkirmish} from './progression.js';
import {isClassMode,applyClassAction,overwatchStop,hazardAt,expireClassEffects} from './class-actions.js';
import {CLASS_ACTIONS} from '../data/classes.js';
export function newGame(seed=20261014,campaign=null,missionId=1){
 const mission=MISSIONS[missionId];
 const spots=(mission.deployments||DEPLOYMENTS).recommended;
 const units=partyHeroes(campaign).map((h,i)=>{const old=campaign?.heroes?.find(a=>a.id===h.id);const u={...structuredClone(h),team:'ally',maxHP:h.hp,maxMP:h.mp,x:spots[i]?.[0]??-1,y:spots[i]?.[1]??-1,xp:0,earnedXP:0,growthHistory:[],clues:[],highlights:[],healTargets:[],moved:false,acted:false,hitThisTurn:false,shadowBonus:0,guardTarget:null};
  if(old){for(const k of ['level','xp','maxHP','maxMP','atk','def','mag','res','spd','growthHistory','clues','appearanceTier','classTier','storyTier','classMovementModifier','movementProfile'])if(old[k]!==undefined)u[k]=structuredClone(old[k]);u.hp=u.maxHP;u.mp=u.maxMP;}u.name=h.name;u.ko=h.ko;u.appearanceTier=u.appearanceTier|| (u.id==='eric'&&u.level>=5?2:1);return u;
 });
 units.push(...mission.enemies.map(e=>({...structuredClone(e),team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,moved:false,acted:false,spawnTurn:0})),...mission.civilians.map(({startHP,...c})=>({...c,team:'civilian',kind:c.kind||'civilian',hp:startHP||c.hp||BALANCE.civilianHP,maxHP:c.hp||BALANCE.civilianHP,mp:0,maxMP:0,atk:0,def:c.def??1,res:c.res??1,mag:0,spd:0,mov:0,range:[0,0],rescued:false})),...(mission.objects||[]).map(objectUnit),...(mission.allies||[]).map(alliedUnit));
 campaign=structuredClone(campaign||{heroes:null,results:[],clears:0});campaign.completed=campaign.completed||[];campaign.flags=campaign.flags||{};campaign.bonds=campaign.bonds||{};campaign.tacticalMemory=campaign.tacticalMemory||{};campaign.choices=campaign.choices||{};campaign.promotions=campaign.promotions||{};campaign.roster=campaign.roster||[];
 const result={missionId,practice:campaign.completed.includes(missionId)&&!mission.skirmish,narrative:{...narrativeState(),seen:campaign.dialogueMemory?.seen||[],history:campaign.dialogueMemory?.history||[]},version:VERSION,schema:SCHEMA,screen:'title',phase:'player',turn:1,rng:seed>>>0,initialSeed:seed>>>0,units,log:[mission.objective,mission.brief],feedback:[],reinforced:false,enemyQueue:[],enemyIndex:0,undo:{},outcome:null,campaign,missionStart:units.filter(u=>u.team==='ally').map(u=>({id:u.id,level:u.level,stats:{maxHP:u.maxHP,atk:u.atk,def:u.def,mag:u.mag}})),potions:2};ensureEconomy(result);placeParty(result);rulesOf(result)?.init(result);return result;
}
// v0.6 (Phase C): AI-led allied troops (team 'allied', D-055) — they fight beside the legion but take no orders and earn no EXP.
export const alliedUnit=a=>({...structuredClone(a),team:'allied',maxHP:a.hp,mp:0,maxMP:0,mag:a.mag||0,moved:false,acted:false});
// Sortie size per mission (D-055 Q2: six from M07; M01–M06 field the five). Recruits beyond the limit start in reserve,
// and any hero without an authored spot takes the first free tile of the deployment zone.
export const deployLimit=s=>missionOf(s).deployLimit??5;
function placeParty(s){const heroes=s.units.filter(u=>u.team==='ally');let out=heroes.length;for(const u of [...heroes].reverse()){if(out<=deployLimit(s))break;if(SORTIE_LOCKED.includes(u.id))continue;u.benched=true;out--;}
 for(const u of heroes){if(u.x>=0&&u.y>=0)continue;const free=[...deployZoneOf(s)].map(k=>k.split(',').map(Number)).find(([x,y])=>!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s)?.cost)&&!s.units.some(o=>o!==u&&o.x===x&&o.y===y));if(free)[u.x,u.y]=free;else{u.benched=true;[u.x,u.y]=[0,0];}}}
export function setDeployment(s,id,x,y){const zone=missionOf(s).deployZone?.(s);if(s.screen!=='deployment'||(zone?!zone.has(`${x},${y}`):(y<7||y>9||x<1||x>10))||!Number.isFinite(terrainAt(x,y,s)?.cost))return false;const u=findUnit(s,id);if(!u||u.team!=='ally')return false;const other=at(s,x,y);if(other&&other.team!=='ally')return false;if(other){other.x=u.x;other.y=u.y;}u.x=x;u.y=y;return true;}
export function presetDeployment(s,name){if(s.screen!=='deployment')return;const spots=(missionOf(s).deployments||DEPLOYMENTS)[name];partyIds(s.campaign).forEach((id,i)=>{const u=findUnit(s,id);if(u&&spots[i])[u.x,u.y]=spots[i];});}
// Sortie (2026-10-18 feedback): heroes can be left in reserve before battle. Erik, the playable lead, always goes.
export const SORTIE_LOCKED=['eric'];
// deployable tiles: the mission's authored zone, or the legacy M01–M03 band (x 1–10, y 7–9)
export function deployZoneOf(s){const z=missionOf(s).deployZone?.(s);if(z)return z;const out=new Set();for(let y=7;y<=9;y++)for(let x=1;x<=10;x++)out.add(`${x},${y}`);return out;}
export function setSortie(s,id,on){const u=findUnit(s,id);if(!u||u.team!=='ally'||!['exploration','warroom','deployment'].includes(s.screen)||(!on&&SORTIE_LOCKED.includes(id)))return false;
 const out=s.units.filter(a=>a.team==='ally'&&!a.benched).length;if(!on&&out<=1||on&&u.benched&&out>=deployLimit(s))return false;if(on&&u.benched){const zone=deployZoneOf(s);if(at(s,u.x,u.y)||!zone.has(`${u.x},${u.y}`)){const free=[...zone].map(k=>k.split(',').map(Number)).find(([x,y])=>!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s)?.cost));if(free)[u.x,u.y]=free;}}
 if(on)delete u.benched;else u.benched=true;return true;}
export function startBattle(s){if(s.screen!=='deployment'||s.units.filter(a=>a.team==='ally'&&!a.benched).length>deployLimit(s))return false;s.screen='battle';applyTerrainRecovery(s);s.log.push(missionOf(s).brief);const {stageStart,...initial}=s;s.stageStart=structuredClone({...initial,feedback:[]});return true;}
export function canAct(s,u){return s.screen==='battle'&&s.phase==='player'&&!s.narrative?.active&&u?.team==='ally'&&alive(u)&&!u.acted;}
// v0.5: a promoted Kai may still move after Quick Strike (strikeMove = this turn); otherwise moving needs an unspent action.
export function canMove(s,u){return s.screen==='battle'&&s.phase==='player'&&!s.narrative?.active&&u?.team==='ally'&&alive(u)&&!u.moved&&(!u.acted||u.strikeMove===s.turn);}
export function moveUnit(s,id,x,y){const u=findUnit(s,id);if(!canMove(s,u)||(u.x===x&&u.y===y))return null;const path=pathTo(s,u,x,y);if(!path)return null;if(u.acted){delete u.strikeMove;delete s.undo[id];}else s.undo[id]={x:u.x,y:u.y};u.x=x;u.y=y;u.moved=true;s.feedback.push({type:'move',id,path});return path;}
export function undoMove(s,id){const u=findUnit(s,id),origin=s.undo[id];if(!canAct(s,u)||!origin||at(s,origin.x,origin.y))return false;u.x=origin.x;u.y=origin.y;u.moved=false;delete s.undo[id];return true;}
function consumeAction(s,u){u.acted=true;delete s.undo[u.id];}
function damage(s,u,t,mode,counter=false){
 let victim=guardFor(s,u,t,mode)||t;s.feedback.push({type:'attack',id:u.id,target:victim.id,mode,counter});const fromHP=victim.hp;const stats=strikeStats(s,u,victim,mode),hit=roll(s)*100<stats.hit,critical=roll(s)*100<stats.crit;
 if(!hit){s.feedback.push({type:'miss',id:victim.id,text:'MISS'});s.log.push(`${u.name} → ${victim.name}: MISS (${stats.hit}%).`);return {hit:false,damage:0,victim};}
 const dealt=stats.damage+(critical?Math.ceil(stats.damage*.5):0);victim.hp=Math.max(0,victim.hp-dealt);rulesOf(s)?.afterDamage?.(s,victim);victim.hitThisTurn=true;s.feedback.push({type:critical?'critical':'hit',id:victim.id,text:`${critical?'CRITICAL ':''}−${dealt}`,fromHP,toHP:victim.hp,damage:dealt});
 s.log.push(`${counter?'반격 · ':''}${u.name} → ${victim.name}: ${dealt} 피해${critical?' / Critical':''}${victim!==t?' / Guard':''}.`);
 if(victim!==t){remember(s,`guard_${victim.id}_${t.id}`);if(s.missionId===3&&t.id==='sain')enqueueStory(s,'3:guard');victim.guardTarget=null;victim.guardUsed=true;awardXP(s,victim,BALANCE.guardXP,'Guard로 동료 보호');discover(s,victim,"Guardian’s Oath");}
 if(mode==='skill'&&u.id==='lia')ignite(s,victim);
 if(!alive(victim)){if(victim.id==='boss'){setStoryFlag(s,`mission_0${s.missionId}_garr_defeated`);enqueueStory(s,`${s.missionId}:boss`);}s.feedback.push({type:'death',id:victim.id,text:'FALLEN'});s.log.push(`${victim.name} 전투불능.`);}
 return {hit:true,damage:dealt,victim};
}
export function performAction(s,id,mode,targetId){
 const u=findUnit(s,id),t=findUnit(s,targetId);if(!canAct(s,u))return {ok:false,error:'행동할 수 없는 장수입니다.'};
 s.feedback=[];
 if(mode==='wait'){consumeAction(s,u);if(s.missionId===3&&u.id==='kai'&&u.y<=4)remember(s,'kai_bypass');s.log.push(`${u.name}: 대기.`);if(missionOf(s).skirmish){checkOutcome(s);afterBattleEvents(s);}return {ok:true};}
 if(mode?.startsWith('tool:')){const result=useTool(s,u,mode.slice(5));if(result.ok)consumeAction(s,u);return result;}
 if(mode==='item'){if(!s.potions||u.hp===u.maxHP)return {ok:false,error:'회복약을 사용할 수 없습니다.'};s.potions--;const n=Math.min(20,u.maxHP-u.hp);u.hp+=n;s.feedback.push({type:'heal',id,text:`+${n}`,toHP:u.hp});consumeAction(s,u);if(s.missionId===3&&u.id==='kai'&&u.y<=4)remember(s,'kai_bypass');s.log.push(`${u.name}: 회복약으로 ${n} HP 회복.`);return {ok:true};}
 if(isClassMode(mode)){const r=applyClassAction(s,u,targetId,mode);if(!r.ok)return r;consumeAction(s,u);awardXP(s,u,20,CLASS_ACTIONS[mode].ko);rulesOf(s)?.onAction?.(s,u,mode,t);checkOutcome(s);afterBattleEvents(s);return {ok:true};}
 if(!validTarget(s,u,t,mode))return {ok:false,error:'대상 또는 사거리가 올바르지 않습니다.'};
 if(mode==='skill'&&u.mp<skillCost(u))return {ok:false,error:'MP가 부족합니다.'};
 if(t?.id==='boss'&&['attack','skill','capture'].includes(mode))enqueueStory(s,`${s.missionId}:encounter`);
 if(mode==='skill'){u.mp-=skillCost(u);remember(s,`${u.id}_skill`);}
 consumeAction(s,u);if(s.missionId===3&&u.id==='kai'&&u.y<=4)remember(s,'kai_bypass');
 if(mode==='skill'&&u.id==='kai'&&(u.classTier||1)>=2&&!u.moved)u.strikeMove=s.turn;
 if(mode==='search'){const custom=rulesOf(s)?.search?.(s,u,t);if(!custom)searchEvidence(s,u,t);awardXP(s,u,30,`${t.name} ${custom?'작동':'조사'}`);}
 else if(mode==='capture'){t.rescued=true;setStoryFlag(s,'mission_02_prisoner_captured');setStoryFlag(s,'mission_02_supply_route_discovered');remember(s,`${u.id}_capture`);awardXP(s,u,50,'도주 대장 생포');enqueueStory(s,'2:capture');s.log.push('포로 확보 · 보급로 진술을 얻었습니다.');}
 else if(mode==='rescue'){t.rescued=true;remember(s,`${u.id}_rescue`);awardXP(s,u,BALANCE.rescueXP,`${t.name} 구출`);s.log.push(`${u.name}: ${t.name}을 안전한 피난로로 구출했습니다.`);s.feedback.push({type:'rescue',id:t.id,text:'RESCUED'});if(u.id==='kai')discover(s,u,'Shadow Exchange');}
 else if(mode==='skill'&&u.id==='eric'){u.guarding=true;u.guardUsed=false;u.guardTarget=null;awardXP(s,u,12,'방어 태세');s.log.push('에릭: 방어 태세. 다음 아군 턴까지 DEF +3, 인접 동료가 받는 첫 근접 공격을 대신 받습니다.');s.feedback.push({type:'guard',id:u.id,text:'GUARD'});}
 else if(mode==='skill'&&u.id==='sain'){
  const heal=Math.min(12+effectiveStats(s,u).mag+(proficiencyBonus(s,u).heal||0),t.maxHP-t.hp);t.hp+=heal;s.feedback.push({type:'heal',id:t.id,text:`+${heal}`,toHP:t.hp});
  const extra=s.units.filter(a=>a.team==='ally'&&alive(a)&&a.id!==t.id&&distance(a,t)===1&&a.hp<a.maxHP).sort((a,b)=>a.hp/a.maxHP-b.hp/b.maxHP)[0];let splash=0;if(extra){splash=Math.min(4,extra.maxHP-extra.hp);extra.hp+=splash;s.feedback.push({type:'heal',id:extra.id,text:`+${splash}`,toHP:extra.hp});}
  if(heal||splash)remember(s,'sain_heal');
  if(heal||splash){if(!u.healTargets.includes(t.id))u.healTargets.push(t.id);awardXP(s,u,Math.min(BALANCE.healXP,10+Math.floor((heal+splash)/2)),`${t.name} 치유`);}if(extra&&splash)discover(s,u,'Divine Recall');s.log.push(`세인: ${t.name} +${heal} HP${extra?`, Gentle Hands → ${extra.name} +${splash}`:''}. 치유할 때마다 EXP를 얻습니다.`);
 }else{
  const r=damage(s,u,t,mode);if(r.hit){awardXP(s,u,BALANCE.attackXP+(!alive(r.victim)?BALANCE.killXP:0),`${r.victim.name} ${alive(r.victim)?'공격':'격파'}`);if(u.id==='elina'&&['f','v'].includes(sTerrain(s,u))){discover(s,u,'Overwatch');remember(s,'elina_forest_shot');}if(u.id==='lia'&&!alive(r.victim)){discover(s,u,'Arcane Territory');remember(s,'lia_kill');}}
  if(alive(r.victim)&&validTarget(s,r.victim,u)&&!counterBlocked(s,r.victim))damage(s,r.victim,u,'attack',true);
 }
 rulesOf(s)?.onAction?.(s,u,mode,t);
 checkOutcome(s);afterBattleEvents(s);return {ok:true};
}
function sTerrain(s,u){return terrainAt(u.x,u.y,s).name==='Forest'?'f':terrainAt(u.x,u.y,s).name==='Village'?'v':'g';}
export function beginEnemyPhase(s){if(s.screen!=='battle'||s.phase!=='player'||s.narrative?.active)return false;s.phase='enemy';s.undo={};rulesOf(s)?.beforeEnemyPhase?.(s);burnUnits(s,'enemy');burnUnits(s,'allied');s.enemyQueue=[...s.units.filter(u=>u.team==='allied'&&alive(u)),...s.units.filter(u=>u.team==='enemy'&&alive(u))].map(u=>u.id);s.enemyIndex=0;s.feedback=[];applyTerrainRecovery(s);s.log.push(`TURN ${s.turn} · ENEMY PHASE`);return true;}
export function planEnemy(s,u){
 const reachable=movement(s,u).costs;
 const custom=rulesOf(s)?.planEnemy?.(s,u,reachable);if(custom)return custom;
 if(s.missionId===2&&u.id==='boss'){const cells=[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c};}).sort((a,b)=>a.y-b.y||Math.abs(a.x-5)-Math.abs(b.x-5)||a.c-b.c);const d=cells[0];return {...d,target:null,reason:'북쪽 출구로 도주'};}
const targets=s.units.filter(t=>alive(t)&&(hostile(s,u,t)||t.team==='civilian'&&s.turn>=missionOf(s).threatTurn));let best=null;
 const hazards=!!s.runes||s.units.some(a=>a.team==='ally'&&a.overwatch&&alive(a)),hz=(x,y)=>hazards?hazardAt(s,u,x,y):0; // v0.5 overwatch/runes; 0 in ACT I
 for(const [pos,cost] of reachable){const [x,y]=pos.split(',').map(Number),actor={...u,x,y};for(const t of targets){const d=distance(actor,t);if(d<u.range[0]||d>u.range[1])continue;
   const f=strikeStats(s,actor,t);const priority=t.team==='civilian'?38:u.kind==='captain'?16-t.def:t.id==='sain'?12:t.id==='lia'?8:0;
   const score=f.damage+priority+(t.hp<=f.damage?30:0)+(u.kind==='archer'?Math.min(d,3)*3:0)-cost*.3+recoveryValue(s,u,x,y)*.35-hz(x,y); if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 가능 · ${t.team==='civilian'?'주민 위협':t.id==='sain'?'지원 장수 견제':'유효 피해'} · 거리 ${d}`};
 }}
 if(best)return best;
 // Attack and the M02 escape objective always win over retreat. Only local, useful recovery.
 if(u.hp/u.maxHP<.5){const sites=[...reachable].map(([p,c])=>{const [x,y]=p.split(',').map(Number);return {x,y,c,value:recoveryValue(s,u,x,y)};}).filter(p=>p.value>0&&targets.some(t=>distance(p,t)<=3)).sort((a,b)=>b.value-a.value||a.c-b.c);if(sites.length)return {...sites[0],target:null,reason:'인근 보급 거점 확보'};}
 const objectives=s.units.filter(t=>alive(t)&&(hostile(s,u,t)||t.team==='civilian'&&s.turn>=missionOf(s).threatTurn));if(!objectives.length)return {x:u.x,y:u.y,target:null,reason:'대상 없음'};
 // Path distance respects blocked ruins and units; ignore occupancy only for strategic pursuit.
 const ranked=objectives.map(t=>({t,d:distance(u,t)-(u.kind==='captain'&&t.team==='civilian'?3:0)})).sort((a,b)=>a.d-b.d);const t=ranked[0].t;
 const mapDist=new Map([[key(t.x,t.y),0]]),q=[{x:t.x,y:t.y,c:0}];while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,ter=terrainAt(x,y,s);if(!ter||!Number.isFinite(ter.cost))continue;const c=p.c+terrainAt(p.x,p.y,s).cost,k=key(x,y);if(c<(mapDist.get(k)??Infinity)){mapDist.set(k,c);q.push({x,y,c});}}}
 let dest={x:u.x,y:u.y,score:Infinity};for(const [p,c]of reachable){const [x,y]=p.split(',').map(Number),d=mapDist.get(p)??1000;const score=d+c*.01+hz(x,y)*.25;if(score<dest.score)dest={x,y,score};}return {...dest,target:null,reason:`${t.name} 방향으로 지형 경로 이동`};
}
// v0.6 allied AI (D-055 M07–M08): allied troops keep their post (u.post, within u.leash tiles) and strike the best
// hostile target in reach; with no post they advance on the nearest foe. Missions may override (rules.planAllied).
export function planAllied(s,u){
 const reachable=movement(s,u).costs;const custom=rulesOf(s)?.planAllied?.(s,u,reachable);if(custom)return custom;
 const post=u.post,leash=u.leash??0,ok=(x,y)=>!post||Math.abs(x-post.x)+Math.abs(y-post.y)<=leash;
 const foes=s.units.filter(t=>alive(t)&&hostile(s,u,t));let best=null;
 for(const [pos,cost] of reachable){const [x,y]=pos.split(',').map(Number);if(!ok(x,y))continue;const actor={...u,x,y};for(const t of foes){const d=distance(actor,t);if(d<u.range[0]||d>u.range[1])continue;const f=strikeStats(s,actor,t);const score=f.damage+(t.hp<=f.damage?30:0)-cost*.3;if(!best||score>best.score)best={x,y,target:t.id,score,reason:`대열 유지 · ${t.name} 공격`};}}
 if(best)return best;
 if(post){let dest={x:u.x,y:u.y,score:Infinity};for(const [p,c] of reachable){const [x,y]=p.split(',').map(Number),d=Math.abs(x-post.x)+Math.abs(y-post.y);if(d+c*.01<dest.score)dest={x,y,score:d+c*.01};}return {...dest,target:null,reason:'명령대로 대열 유지'};}
 if(!foes.length)return {x:u.x,y:u.y,target:null,reason:'대상 없음'};
 const t=foes.sort((a,b)=>distance(u,a)-distance(u,b))[0];let dest={x:u.x,y:u.y,score:distance(u,t)};for(const [p] of reachable){const [x,y]=p.split(',').map(Number),d=Math.abs(x-t.x)+Math.abs(y-t.y);if(d<dest.score)dest={x,y,score:d};}return {...dest,target:null,reason:`${t.name} 방향으로 전진`};
}
export function advanceEnemy(s){
 if(s.screen!=='battle'||s.phase!=='enemy'||s.narrative?.active)return false;s.feedback=[];
 if(s.enemyIndex<s.enemyQueue.length){const u=findUnit(s,s.enemyQueue[s.enemyIndex++]);if(!u||!alive(u))return true;const p=u.team==='allied'?planAllied(s,u):planEnemy(s,u);let path=pathTo(s,u,p.x,p.y),shots=[],stopped=false;
  if(u.team==='enemy'&&path&&path.length>1&&s.units.some(a=>a.team==='ally'&&a.overwatch&&alive(a))){const start={x:u.x,y:u.y},mark=s.feedback.length,stop=overwatchStop(s,u,path,(a,e)=>{s.feedback.push({type:'class',action:'overwatch-fire',id:a.id,target:e.id,text:'경계 사격',at:{x:e.x,y:e.y}});const r=damage(s,a,e,'attack');if(r.hit)awardXP(s,a,BALANCE.attackXP+(!alive(e)?BALANCE.killXP:0),`${e.name} 경계 사격`);return r;});
   shots=s.feedback.splice(mark);u.x=start.x;u.y=start.y;if(stop<path.length-1){stopped=true;path=path.slice(0,stop+1);p.x=path.at(-1).x;p.y=path.at(-1).y;}}
  if(path){u.x=p.x;u.y=p.y;if(path.length>1)s.feedback.push({type:'move',id:u.id,path});}s.feedback.push(...shots);
  if(stopped){s.log.push(`${u.name}: 경계 사격에 발이 묶였습니다.`);if(!alive(u)){checkOutcome(s);afterBattleEvents(s);return true;}if(p.target&&!validTarget(s,u,findUnit(s,p.target)))p.target=null;}
  s.log.push(`AI · ${u.name}: ${p.reason}.`);if(p.target){const t=findUnit(s,p.target);const r=damage(s,u,t,'attack');if((t.team==='ally'||t.team==='allied'||t.team==='enemy')&&alive(r.victim)&&validTarget(s,r.victim,u)){const counter=damage(s,r.victim,u,'attack',true);if(counter.hit)awardXP(s,r.victim,!alive(u)?BALANCE.attackXP+BALANCE.killXP:10,`${u.name} 반격`);}}
  checkOutcome(s);afterBattleEvents(s);return true;
 }
 s.turn++;s.phase='player';s.enemyQueue=[];s.enemyIndex=0;
 for(const u of s.units.filter(u=>u.team==='ally')){u.shadowBonus=u.id==='kai'&&!u.hitThisTurn?1:0;u.hitThisTurn=false;u.ward=false;u.guardTarget=null;u.guarding=false;u.guardUsed=false;u.moved=false;u.acted=false;}
 expireClassEffects(s);
 if(s.missionId===1&&s.turn===2)s.log.push('북쪽 숲에서 발소리가 들립니다. TURN 3에 북서·북동 모서리로 산적 2명이 진입합니다.');
 if(s.turn>=3&&!s.reinforced&&missionOf(s).reinforcements.length){for(const e of missionOf(s).reinforcements){let pos={x:e.x,y:e.y};if(at(s,pos.x,pos.y)){const free=[];for(let y=0;y<missionOf(s).height;y++)for(let x=0;x<missionOf(s).width;x++)if(!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s).cost))free.push({x,y});free.sort((a,b)=>distance(a,e)-distance(b,e));pos=free[0];}s.units.push({...structuredClone(e),...pos,team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,spawnTurn:s.turn});s.feedback.push({type:'spawn',id:e.id,text:'REINFORCEMENT'});}s.reinforced=true;s.log.push('적 증원 2명 출현. 이번 Player Phase 동안 먼저 대응할 수 있습니다.');}
 rulesOf(s)?.onTurnStart?.(s);
 ageFires(s);burnUnits(s,'ally');
 if(s.missionId===1&&s.turn===4)s.log.push('가르: “피난민을 잡아라!” 다음 TURN 5부터 산적이 주민을 직접 공격합니다.');
 applyTerrainRecovery(s);
 if(s.missionId===3)escortCivilians(s);
 checkOutcome(s);afterBattleEvents(s);
 s.log.push(`TURN ${s.turn} · PLAYER PHASE${s.turn>=5?' · 주민이 직접 공격받습니다!':''}`);return true;
}
export function checkOutcome(s){
 if(s.outcome)return s.outcome;
 const civ=s.units.filter(u=>u.team==='civilian'),heroes=s.units.filter(u=>u.team==='ally');
 if(heroes.every(u=>!alive(u)))finish(s,'defeat','모든 장수가 전투불능입니다.');
 else if(rulesOf(s))rulesOf(s).checkOutcome(s,finish);
 else if(s.missionId===2){const boss=findUnit(s,'boss');if(boss.rescued||boss.hp<=0||boss.y===0||s.turn>8||s.units.filter(u=>u.team==='enemy').every(u=>!alive(u)))finish(s,'victory',boss.rescued?'포로와 보급로 진술 확보.':'추격 종료. 상자의 흔적은 남았지만 진술은 얻지 못했습니다.');}
 else if(s.missionId===3){const saved=civ.filter(c=>c.rescued).length;if(s.turn>10)finish(s,'defeat','제한 10턴 안에 철수하지 못했습니다.');else if(saved>0&&heroes.filter(alive).every(u=>u.y<=2)){setStoryFlag(s,'mission_03_bridge_held');setStoryFlag(s,'mission_03_refugees_saved',saved);finish(s,'victory',`${saved}/2 주민 구조, 생존 장수 철수 완료.`);}else if(civ.every(c=>c.hp<=0))finish(s,'defeat','구조와 안전한 철수를 제한 턴 안에 완료하지 못했습니다.');}
 else if(civ.some(c=>c.hp<=0))finish(s,'defeat','주민을 잃어 필수 구출 목표를 달성할 수 없습니다.');
 else if(civ.every(c=>c.rescued)&&findUnit(s,'boss').hp<=0)finish(s,'victory','두 주민이 무사히 탈출했고 가르를 격파했습니다.');
 return s.outcome;
}
function finish(s,outcome,reason){
 s.outcome=outcome;s.screen='result';s.reason=reason;s.undo={};
 if(outcome==='victory')for(const u of s.units.filter(u=>u.team==='ally'&&alive(u)))awardXP(s,u,BALANCE.clearXP,rulesOf(s)?.clearLabel||'마을 구출 완수');
 const result={missionId:s.missionId,practice:s.practice,outcome,turn:s.turn,rescued:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,allAlive:s.units.filter(u=>!u.benched&&u.team==='ally').every(alive),swift:s.turn<=missionOf(s).par,potential:findUnit(s,'eric').clues.includes("Guardian’s Oath"),seed:s.initialSeed,heroes:s.units.filter(u=>u.team==='ally').map(u=>({id:u.id,level:u.level,earnedXP:u.earnedXP,clues:[...u.clues]}))};
 s.campaign.results.push(result);s.campaign.results=s.campaign.results.slice(-30);
 if(outcome==='victory')rulesOf(s)?.beforeCommit?.(s);
 if(outcome==='victory'&&missionOf(s).skirmish)commitSkirmish(s);
 else if(outcome==='victory'){if(!s.practice){commitEconomyReward(s);s.campaign.clears++;s.campaign.completed.push(s.missionId);s.campaign.heroes=structuredClone(s.units.filter(u=>u.team==='ally'));setStoryFlag(s,`mission_0${s.missionId}_completed`);if(s.missionId===1){setStoryFlag(s,'royal_supply_evidence');setStoryFlag(s,'mission_01_civilians_rescued',2);}}}
 if(outcome==='victory'&&s.missionId===3&&!s.practice){const m=s.campaign.tacticalMemory,prior=s.stageStart?.campaign.tacticalMemory||{},did=k=>(m[k]||0)>(prior[k]||0);if(did('guard_eric_sain')&&(did('kai_rescue')||did('kai_bypass'))&&(did('sain_rescue')||did('sain_heal'))){s.campaign.bonds.erik_kai=true;setStoryFlag(s,'bond_erik_kai');enqueueStory(s,'3:bond');}}
 if(outcome==='victory')rulesOf(s)?.afterVictory?.(s);
 afterBattleEvents(s);
 s.log.push(`${outcome==='victory'?'VICTORY':'DEFEAT'} · ${reason}`);
}
export function replay(s,fresh=false){
 let campaign=structuredClone(s.campaign);
 if(s.outcome==='defeat'&&s.stageStart){campaign=structuredClone(s.stageStart.campaign);campaign.results=structuredClone(s.campaign.results);if(s.campaign.dialogueMemory)campaign.dialogueMemory=structuredClone(s.campaign.dialogueMemory);}
 if(fresh){const initial=newGame(s.initialSeed,null,s.missionId);initial.campaign=campaign;initial.economy=structuredClone(campaign.economy);initial.practice=true;initial.narrative.seen=campaign.dialogueMemory?.seen||[];initial.narrative.history=campaign.dialogueMemory?.history||[];return initial;}
 return newGame(s.initialSeed,campaign,s.missionId);
}

export function restartStage(s){if(!['battle','result'].includes(s.screen))return null;if(s.stageStart){const initial=structuredClone(s.stageStart);initial.stageStart=structuredClone(s.stageStart);initial.narrative.seen=[...s.narrative.seen];initial.narrative.history=structuredClone(s.narrative.history);return initial;}const initial=newGame(s.initialSeed,structuredClone(s.campaign),s.missionId);initial.screen='deployment';return initial;}

export function nextMission(s){if(s.outcome!=='victory'||s.missionId>=LAST_MISSION||!s.campaign.completed.includes(s.missionId))return null;return newGame(s.initialSeed+1,structuredClone(s.campaign),s.missionId+1);}
function escortCivilians(s){for(const c of s.units.filter(u=>u.team==='civilian'&&alive(u))){if(!s.units.some(u=>u.team==='ally'&&alive(u)&&distance(u,c)===1))continue;const options=[[0,-1],[-1,0],[1,0]].map(([dx,dy])=>({x:c.x+dx,y:c.y+dy})).filter(p=>terrainAt(p.x,p.y,s)&&Number.isFinite(terrainAt(p.x,p.y,s).cost)&&!at(s,p.x,p.y));options.sort((a,b)=>a.y-b.y||Math.abs(a.x-5.5)-Math.abs(b.x-5.5));if(options.length){const p=options[0];c.x=p.x;c.y=p.y;s.log.push(`${c.name} 호위 이동.`);if(c.y<=2){c.rescued=true;setStoryFlag(s,'mission_03_escorted');}}}}
// Fire tactics (v0.4 benchmark pass): Fire Bolt ignites grass/forest/village for two turns.
// Units standing in fire at the start of their side's phase take 10% max HP (min 3), never lethal.
function ignite(s,victim){const {x,y}=victim,t=terrainAt(x,y,s);if(!t||(t.fire??1)<1.25)return;s.burning??={};const k=key(x,y),fresh=!s.burning[k];s.burning[k]=2;if(fresh){s.feedback.push({type:'ignite',id:victim.id,text:'FIRE'});s.log.push(`${t.ko||t.name}에 불길이 번졌습니다. 2턴 동안 그 위의 유닛이 화상을 입습니다.`);}}
function ageFires(s){if(!s.burning)return;for(const k of Object.keys(s.burning)){s.burning[k]--;if(s.burning[k]<=0)delete s.burning[k];}}
function burnUnits(s,team){if(!s.burning)return;for(const u of s.units.filter(u=>u.team===team&&alive(u)&&s.burning[key(u.x,u.y)])){const n=Math.min(u.hp-1,Math.max(3,Math.floor(u.maxHP*.1)));if(n<=0)continue;const fromHP=u.hp;u.hp-=n;s.feedback.push({type:'hit',id:u.id,text:`🔥 −${n}`,fromHP,toHP:u.hp,damage:n});s.log.push(`${u.name}: 불길에 ${n} 피해.`);}}
