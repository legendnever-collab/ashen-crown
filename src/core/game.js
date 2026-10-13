import {VERSION,SCHEMA,HEROES,ENEMIES,REINFORCEMENTS,CIVILIANS,DEPLOYMENTS,BALANCE} from '../data/game-data.js';
import {distance,key,alive,at,findUnit,movement,pathTo,skillCost,validTarget,forecast,strikeStats,guardFor,roll,awardXP,discover,terrainAt} from './rules.js';
export function newGame(seed=20261014,campaign=null){
 const units=HEROES.map((h,i)=>{const old=campaign?.heroes?.find(a=>a.id===h.id);const u={...structuredClone(h),team:'ally',maxHP:h.hp,maxMP:h.mp,x:DEPLOYMENTS.recommended[i][0],y:DEPLOYMENTS.recommended[i][1],xp:0,earnedXP:0,growthHistory:[],clues:[],highlights:[],healTargets:[],moved:false,acted:false,hitThisTurn:false,shadowBonus:0,guardTarget:null};
  if(old){for(const k of ['level','xp','maxHP','maxMP','atk','def','mag','res','spd','growthHistory','clues'])u[k]=structuredClone(old[k]);u.hp=u.maxHP;u.mp=u.maxMP;}return u;
 });
 units.push(...ENEMIES.map(e=>({...structuredClone(e),team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,moved:false,acted:false,spawnTurn:0})),...CIVILIANS.map(c=>({...c,team:'civilian',kind:'civilian',hp:BALANCE.civilianHP,maxHP:BALANCE.civilianHP,mp:0,maxMP:0,atk:0,def:1,res:1,mag:0,spd:0,mov:0,range:[0,0],rescued:false})));
 return {version:VERSION,schema:SCHEMA,screen:'title',phase:'player',turn:1,rng:seed>>>0,initialSeed:seed>>>0,units,log:['국경 마을이 불타고 있습니다. 두 주민을 구출하고 Garr를 격파하세요.'],feedback:[],reinforced:false,enemyQueue:[],enemyIndex:0,undo:{},outcome:null,campaign:campaign||{heroes:null,results:[],clears:0},missionStart:units.filter(u=>u.team==='ally').map(u=>({id:u.id,level:u.level,stats:{maxHP:u.maxHP,atk:u.atk,def:u.def,mag:u.mag}})),potions:2};
}
export function setDeployment(s,id,x,y){if(s.screen!=='deployment'||y<7||y>9||x<1||x>10||!Number.isFinite(terrainAt(x,y)?.cost))return false;const u=findUnit(s,id);if(!u||u.team!=='ally')return false;const other=at(s,x,y);if(other&&other.team!=='ally')return false;if(other){other.x=u.x;other.y=u.y;}u.x=x;u.y=y;return true;}
export function presetDeployment(s,name){if(s.screen!=='deployment')return;HEROES.forEach((h,i)=>{const u=findUnit(s,h.id);[u.x,u.y]=DEPLOYMENTS[name][i];});}
export function startBattle(s){if(s.screen!=='deployment')return false;s.screen='battle';s.log.push('TURN 1 · 먼저 남쪽 산적을 저지하세요. 주민은 TURN 5부터 직접 공격받을 수 있습니다. 인접한 장수로 구출하세요.');return true;}
export function canAct(s,u){return s.screen==='battle'&&s.phase==='player'&&u?.team==='ally'&&alive(u)&&!u.acted;}
export function moveUnit(s,id,x,y){const u=findUnit(s,id);if(!canAct(s,u)||u.moved||(u.x===x&&u.y===y))return null;const path=pathTo(s,u,x,y);if(!path)return null;s.undo[id]={x:u.x,y:u.y};u.x=x;u.y=y;u.moved=true;s.feedback.push({type:'move',id,path});return path;}
export function undoMove(s,id){const u=findUnit(s,id),origin=s.undo[id];if(!canAct(s,u)||!origin||at(s,origin.x,origin.y))return false;u.x=origin.x;u.y=origin.y;u.moved=false;delete s.undo[id];return true;}
function consumeAction(s,u){u.acted=true;delete s.undo[u.id];}
function damage(s,u,t,mode,counter=false){
 let victim=guardFor(s,u,t,mode)||t;const stats=strikeStats(s,u,victim,mode),hit=roll(s)*100<stats.hit,critical=roll(s)*100<stats.crit;
 if(!hit){s.feedback.push({type:'miss',id:victim.id,text:'MISS'});s.log.push(`${u.name} → ${victim.name}: MISS (${stats.hit}%).`);return {hit:false,damage:0,victim};}
 const dealt=stats.damage+(critical?Math.ceil(stats.damage*.5):0);victim.hp=Math.max(0,victim.hp-dealt);victim.hitThisTurn=true;s.feedback.push({type:critical?'critical':'hit',id:victim.id,text:`${critical?'CRITICAL ':''}−${dealt}`});
 s.log.push(`${counter?'반격 · ':''}${u.name} → ${victim.name}: ${dealt} 피해${critical?' / Critical':''}${victim!==t?' / Guard':''}.`);
 if(victim!==t){victim.guardTarget=null;awardXP(s,victim,BALANCE.guardXP,'Guard로 동료 보호');discover(s,victim,"Guardian’s Oath");}
 if(!alive(victim)){s.feedback.push({type:'death',id:victim.id,text:'FALLEN'});s.log.push(`${victim.name} 전투불능.`);}
 return {hit:true,damage:dealt,victim};
}
export function performAction(s,id,mode,targetId){
 const u=findUnit(s,id),t=findUnit(s,targetId);if(!canAct(s,u))return {ok:false,error:'행동할 수 없는 장수입니다.'};
 s.feedback=[];
 if(mode==='wait'){consumeAction(s,u);s.log.push(`${u.name}: 대기.`);return {ok:true};}
 if(mode==='item'){if(!s.potions||u.hp===u.maxHP)return {ok:false,error:'회복약을 사용할 수 없습니다.'};s.potions--;const n=Math.min(20,u.maxHP-u.hp);u.hp+=n;s.feedback.push({type:'heal',id,text:`+${n}`});consumeAction(s,u);s.log.push(`${u.name}: 회복약으로 ${n} HP 회복.`);return {ok:true};}
 if(!validTarget(s,u,t,mode))return {ok:false,error:'대상 또는 사거리가 올바르지 않습니다.'};
 if(mode==='skill'&&u.mp<skillCost(u))return {ok:false,error:'MP가 부족합니다.'};
 if(mode==='skill')u.mp-=skillCost(u);
 consumeAction(s,u);
 if(mode==='rescue'){t.rescued=true;awardXP(s,u,BALANCE.rescueXP,`${t.name} 구출`);s.log.push(`${u.name}: ${t.name}을 안전한 피난로로 구출했습니다.`);s.feedback.push({type:'rescue',id:t.id,text:'RESCUED'});if(u.id==='kai')discover(s,u,'Shadow Exchange');}
 else if(mode==='skill'&&u.id==='eric'){u.guardTarget=t.id;s.log.push(`Eric: ${t.name}에게 Guard. 다음 적 Phase 동안 첫 인접 근접 피해를 대신 받습니다.`);s.feedback.push({type:'guard',id:u.id,text:'GUARD'});}
 else if(mode==='skill'&&u.id==='sain'){
  const heal=Math.min(12+u.mag,t.maxHP-t.hp);t.hp+=heal;s.feedback.push({type:'heal',id:t.id,text:`+${heal}`});
  const extra=s.units.filter(a=>a.team==='ally'&&alive(a)&&a.id!==t.id&&distance(a,t)===1&&a.hp<a.maxHP).sort((a,b)=>a.hp/a.maxHP-b.hp/b.maxHP)[0];let splash=0;if(extra){splash=Math.min(4,extra.maxHP-extra.hp);extra.hp+=splash;s.feedback.push({type:'heal',id:extra.id,text:`+${splash}`});}
  if((heal||splash)&&!u.healTargets.includes(t.id)){u.healTargets.push(t.id);awardXP(s,u,BALANCE.healXP,`${t.name} 치유`);}if(extra&&splash)discover(s,u,'Divine Recall');s.log.push(`Sain: ${t.name} +${heal} HP${extra?`, Gentle Hands → ${extra.name} +${splash}`:''}. 동일 대상 치유 EXP는 미션당 1회.`);
 }else{
  s.feedback.push({type:'attack',id:u.id,target:t.id});const r=damage(s,u,t,mode);if(r.hit){awardXP(s,u,BALANCE.attackXP+(!alive(r.victim)?BALANCE.killXP:0),`${r.victim.name} ${alive(r.victim)?'공격':'격파'}`);if(u.id==='elina'&&['f','v'].includes(sTerrain(u)))discover(s,u,'Overwatch');if(u.id==='lia'&&!alive(r.victim))discover(s,u,'Arcane Territory');}
  if(alive(r.victim)&&validTarget(s,r.victim,u))damage(s,r.victim,u,'attack',true);
 }
 checkOutcome(s);return {ok:true};
}
function sTerrain(u){return terrainAt(u.x,u.y).name==='Forest'?'f':terrainAt(u.x,u.y).name==='Village'?'v':'g';}
export function beginEnemyPhase(s){if(s.screen!=='battle'||s.phase!=='player')return false;s.phase='enemy';s.undo={};s.enemyQueue=s.units.filter(u=>u.team==='enemy'&&alive(u)).map(u=>u.id);s.enemyIndex=0;s.log.push(`TURN ${s.turn} · ENEMY PHASE`);return true;}
export function planEnemy(s,u){
 const reachable=movement(s,u).costs;const targets=s.units.filter(t=>alive(t)&&(t.team==='ally'||t.team==='civilian'&&s.turn>=BALANCE.civilianThreatTurn));let best=null;
 for(const [pos,cost] of reachable){const [x,y]=pos.split(',').map(Number),actor={...u,x,y};for(const t of targets){const d=distance(actor,t);if(d<u.range[0]||d>u.range[1])continue;
   const f=strikeStats(s,actor,t);const priority=t.team==='civilian'?38:u.kind==='captain'?16-t.def:t.id==='sain'?12:t.id==='lia'?8:0;
   const score=f.damage+priority+(t.hp<=f.damage?30:0)+(u.kind==='archer'?Math.min(d,3)*3:0)-cost*.3; if(!best||score>best.score)best={x,y,target:t.id,score,reason:`공격 가능 · ${t.team==='civilian'?'주민 위협':t.id==='sain'?'지원 장수 견제':'유효 피해'} · 거리 ${d}`};
 }}
 if(best)return best;
 const objectives=s.units.filter(t=>alive(t)&&(t.team==='ally'||t.team==='civilian'&&s.turn>=BALANCE.civilianThreatTurn));if(!objectives.length)return {x:u.x,y:u.y,target:null,reason:'대상 없음'};
 // Path distance respects blocked ruins and units; ignore occupancy only for strategic pursuit.
 const ranked=objectives.map(t=>({t,d:distance(u,t)-(u.kind==='captain'&&t.team==='civilian'?3:0)})).sort((a,b)=>a.d-b.d);const t=ranked[0].t;
 const mapDist=new Map([[key(t.x,t.y),0]]),q=[{x:t.x,y:t.y,c:0}];while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,ter=terrainAt(x,y);if(!ter||!Number.isFinite(ter.cost))continue;const c=p.c+terrainAt(p.x,p.y).cost,k=key(x,y);if(c<(mapDist.get(k)??Infinity)){mapDist.set(k,c);q.push({x,y,c});}}}
 let dest={x:u.x,y:u.y,score:Infinity};for(const [p,c]of reachable){const [x,y]=p.split(',').map(Number),d=mapDist.get(p)??1000;const score=d+c*.01;if(score<dest.score)dest={x,y,score};}return {...dest,target:null,reason:`${t.name} 방향으로 지형 경로 이동`};
}
export function advanceEnemy(s){
 if(s.screen!=='battle'||s.phase!=='enemy')return false;s.feedback=[];
 if(s.enemyIndex<s.enemyQueue.length){const u=findUnit(s,s.enemyQueue[s.enemyIndex++]);if(!u||!alive(u))return true;const p=planEnemy(s,u),path=pathTo(s,u,p.x,p.y);if(path){u.x=p.x;u.y=p.y;if(path.length>1)s.feedback.push({type:'move',id:u.id,path});}
  s.log.push(`AI · ${u.name}: ${p.reason}.`);if(p.target){const t=findUnit(s,p.target);s.feedback.push({type:'attack',id:u.id,target:t.id});const r=damage(s,u,t,'attack');if(t.team==='ally'&&alive(r.victim)&&validTarget(s,r.victim,u)){const counter=damage(s,r.victim,u,'attack',true);if(counter.hit)awardXP(s,r.victim,!alive(u)?BALANCE.attackXP+BALANCE.killXP:10,`${u.name} 반격`);}}
  checkOutcome(s);return true;
 }
 s.turn++;s.phase='player';s.enemyQueue=[];s.enemyIndex=0;
 for(const u of s.units.filter(u=>u.team==='ally')){u.shadowBonus=u.id==='kai'&&!u.hitThisTurn?1:0;u.hitThisTurn=false;u.guardTarget=null;u.moved=false;u.acted=false;}
 if(s.turn===2)s.log.push('북쪽 숲에서 발소리가 들립니다. TURN 3에 북서·북동 모서리로 산적 2명이 진입합니다.');
 if(s.turn>=3&&!s.reinforced){for(const e of REINFORCEMENTS){let pos={x:e.x,y:e.y};if(at(s,pos.x,pos.y)){const free=[];for(let y=0;y<10;y++)for(let x=0;x<12;x++)if(!at(s,x,y)&&Number.isFinite(terrainAt(x,y).cost))free.push({x,y});free.sort((a,b)=>distance(a,e)-distance(b,e));pos=free[0];}s.units.push({...structuredClone(e),...pos,team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,spawnTurn:s.turn});s.feedback.push({type:'spawn',id:e.id,text:'REINFORCEMENT'});}s.reinforced=true;s.log.push('적 증원 2명 출현. 이번 Player Phase 동안 먼저 대응할 수 있습니다.');}
 if(s.turn===4)s.log.push('Garr: “피난민을 잡아라!” 다음 TURN 5부터 산적이 주민을 직접 공격합니다.');
 s.log.push(`TURN ${s.turn} · PLAYER PHASE${s.turn>=5?' · 주민이 직접 공격받습니다!':''}`);return true;
}
export function checkOutcome(s){
 if(s.outcome)return s.outcome;
 const civ=s.units.filter(u=>u.team==='civilian'),heroes=s.units.filter(u=>u.team==='ally');
 if(civ.some(c=>c.hp<=0)){finish(s,'defeat','주민을 잃어 필수 구출 목표를 달성할 수 없습니다.');}
 else if(heroes.every(u=>!alive(u)))finish(s,'defeat','모든 장수가 전투불능입니다.');
 else if(civ.every(c=>c.rescued)&&findUnit(s,'boss').hp<=0)finish(s,'victory','두 주민이 무사히 탈출했고 Garr를 격파했습니다.');
 return s.outcome;
}
function finish(s,outcome,reason){
 s.outcome=outcome;s.screen='result';s.reason=reason;s.undo={};
 if(outcome==='victory')for(const u of s.units.filter(u=>u.team==='ally'&&alive(u)))awardXP(s,u,BALANCE.clearXP,'마을 구출 완수');
 const result={outcome,turn:s.turn,rescued:s.units.filter(u=>u.rescued).length,allAlive:s.units.filter(u=>u.team==='ally').every(alive),swift:s.turn<=BALANCE.parTurn,potential:findUnit(s,'eric').clues.includes("Guardian’s Oath"),seed:s.initialSeed,heroes:s.units.filter(u=>u.team==='ally').map(u=>({id:u.id,level:u.level,earnedXP:u.earnedXP,clues:[...u.clues]}))};
 s.campaign.results.push(result);s.campaign.results=s.campaign.results.slice(-30);
 if(outcome==='victory'){s.campaign.clears++;s.campaign.heroes=structuredClone(s.units.filter(u=>u.team==='ally'));}
 s.log.push(`${outcome==='victory'?'VICTORY':'DEFEAT'} · ${reason}`);
}
export function replay(s,fresh=false){return newGame(s.initialSeed,fresh?null:structuredClone(s.campaign));}
