// Legal-rules policy for the v0.5 skirmishes (promotion trials and Legion Drill). Uses the same public
// game API as the UI (moveUnit / performAction / enemy phase), including the class actions when allowed.
import {newGame} from '../src/core/game.js';
import {missionOf} from '../src/data/missions.js';
import {findUnit,alive,movement,validTarget,forecast,distance,terrainCost,awardXP,hostile} from '../src/core/rules.js';
import {moveUnit,performAction,canAct,canMove,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {classActionOf,validClassTarget,classCost} from '../src/core/class-actions.js';
import {skillsOf} from '../src/data/skills.js';
import {drain} from './campaign-policy.mjs';

// ACT I camp with every hero at `level` (or per-hero levels), ready for trials and drills.
export function actOneCamp(seed=20261019,level=6,memory={}){
 const s=newGame(seed,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{act1_completed:true},choices:{m06_oath:'people',act1_seen:'yes'},tacticalMemory:memory},6);
 for(const u of s.units.filter(u=>u.team==='ally')){const want=typeof level==='object'?level[u.id]??6:level;for(let i=0;u.level<want&&i<200;i++)awardXP(s,u,50,'setup');u.xp=0;u.hp=u.maxHP;u.mp=u.maxMP;u.highlights=[];u.earnedXP=0;}
 s.feedback=[];s.log=[];s.campaign.heroes=structuredClone(s.units.filter(u=>u.team==='ally'));s.outcome='victory';s.screen='exploration';enterHub(s,{aftermath:true,story:false});drain(s);s.screen='exploration';return s;}

const m0=(s,x,y)=>missionOf(s).map[y]?.[x];
function bfsTo(s,u,goal){const d=new Map(),q=[];for(const g of goal)if(Number.isFinite(terrainCost(s,u,g.x,g.y))){d.set(`${g.x},${g.y}`,0);q.push({...g,c:0});}
 while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();if(p.c!==d.get(`${p.x},${p.y}`))continue;for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,step=terrainCost(s,u,x,y),k=`${x},${y}`;if(!Number.isFinite(step))continue;const c=p.c+step;if(c<(d.get(k)??Infinity)){d.set(k,c);q.push({x,y,c});}}}return d;}

export function skirmishAction(s,u,{classActions=true}={}){
 const m=missionOf(s),g=m.goal,foes=s.units.filter(t=>t.team==='enemy'&&alive(t)),cells=u.moved||u.acted?new Map([[`${u.x},${u.y}`,0]]):movement(s,u).costs;
 const reach=g.type==='reach'&&g.hero===u.id?bfsTo(s,u,Array.from({length:m.width},(_,x)=>({x,y:g.row}))):null;
 const ca=classActions?classActionOf(u):null;let best=null;const consider=o=>{if(!best||o.score>best.score)best=o;};
 for(const [p,c]of cells){const [x,y]=p.split(',').map(Number),a={...u,x,y};
  if(!u.acted){
   for(const t of s.units.filter(alive))for(const mode of ['rescue','skill','attack']){if(!validTarget(s,a,t,mode))continue;if(mode==='skill'&&a.mp<(a.cost+(a.id==='lia'&&a.hp<=a.maxHP/2&&(a.classTier||1)<2?1:0)))continue;const f=forecast(s,a,t,mode);let score;
    if(mode==='rescue')score=900;else if(f.heal!==undefined)score=f.heal>=10&&!hostile(s,a,t)?80+f.heal:-1000;else if(f.guard===true)score=foes.some(e=>distance(e,a)<=4)?30:-5;
    else{score=60+f.damage*f.hit/100*3+(f.after===0?60:0)-f.counter*1.2;if(g.targets&&!g.targets.includes(t.id))score-=25;}
    const gather=g.type==='gather'&&u.id!==m.skirmish.hero?distance(a,findUnit(s,m.skirmish.hero))*15:0;consider({x,y,mode,target:t.id,score:score-c*.3-gather});}
   if(ca&&u.mp>=classCost(ca)){
    if(ca==='bulwark'&&!u.bulwark&&foes.some(e=>distance(e,a)<=6)){const hold=g.hold;consider({x,y,mode:ca,target:u.id,score:140+(g.type==='survive'?80:0)-(hold?distance(a,{x:hold[0],y:hold[1]})*30:0)-c*.3});}
    if(ca==='overwatch'&&!u.overwatch&&!foes.some(e=>validTarget(s,a,e,'attack'))&&foes.some(e=>distance(e,a)<=8))consider({x,y,mode:ca,target:u.id,score:70-c*.3});
    if(ca==='arcane'&&!(s.runes||[]).length){for(let ty=y-3;ty<=y+3;ty++)for(let tx=x-3;tx<=x+3;tx++){if(!validClassTarget(s,a,{x:tx,y:ty},ca))continue;const covered=foes.filter(e=>Math.abs(e.x-tx)+Math.abs(e.y-ty)<=1&&(!g.targets||g.targets.includes(e.id))).length+(Math.abs(x-tx)+Math.abs(y-ty)<=1?1:0);const self=Math.abs(x-tx)+Math.abs(y-ty)<=1;if(self&&foes.some(e=>distance(e,a)<=5))consider({x,y,mode:ca,target:`${tx},${ty}`,score:90+40*(covered-1)-c*.3});}}
    if(ca==='recall')for(const t of s.units.filter(t=>t.team==='ally'&&alive(t)&&t.id!==u.id)){if(!validClassTarget(s,a,t,ca))continue;const threat=foes.filter(e=>distance(e,t)<=4).length,stray=g.type==='gather'&&distance(t,u)>g.radius?120:0;if(threat||stray||t.hp<=t.maxHP*.6)consider({x,y,mode:ca,target:t.id,score:150+threat*20+stray-c*.3});}
    if(ca==='exchange')for(const t of foes){if(!validClassTarget(s,a,t,ca))continue;if(reach&&t.y<a.y)consider({x,y,mode:ca,target:t.id,score:400-c*.3});}
   }}
  // v0.9.1 ④ (once a battle) in the awakening trials
  if(!u.acted)for(const k of skillsOf(u).filter(k=>k.slot===4&&k.open&&u.mp>=k.cost)){const m=k.mode;
   if(m==='dawnPrayer'&&validClassTarget(s,a,a.id,m))consider({x,y,mode:m,target:a.id,score:900-c*.3});
   if(m==='oathWall'&&validClassTarget(s,a,a.id,m)){const near=s.units.filter(t=>(t.team==='ally'||t.team==='civilian')&&alive(t)&&t.id!==a.id&&distance(a,t)<=2);if(near.length&&foes.some(e=>near.some(t=>distance(e,t)<=5)))consider({x,y,mode:m,target:a.id,score:150+near.length*30-c*.3});}
   // v0.9.2: Little Ward over whoever must be kept (civilians, then heroes) with foes closing in; Shadow Dance drags a foe
   // (an archer first) in among the heroes, where it stands held through the enemy phase.
   if(m==='smallWard')for(let ty=y-4;ty<=y+4;ty++)for(let tx=x-4;tx<=x+4;tx++){const p2=`${tx},${ty}`;if(!validClassTarget(s,a,p2,m))continue;const inside=t=>Math.abs(t.x-tx)<=1&&Math.abs(t.y-ty)<=1,civ=s.units.filter(t=>t.team==='civilian'&&alive(t)&&inside(t)).length,near=foes.filter(e=>Math.abs(e.x-tx)+Math.abs(e.y-ty)<=4).length;
    const gap=['x'].includes(m0(s,tx-1,ty))&&['x'].includes(m0(s,tx+1,ty))?60:0;if(near)consider({x,y,mode:m,target:p2,score:60+civ*30+near*15+gap-c*.3});}
   if(m==='shadowDance')for(const e of foes)for(const b of s.units.filter(b=>b.team==='ally'&&alive(b)&&!b.benched&&b.id!==u.id)){const pair=`${e.id}|${b.id}`;if(!validClassTarget(s,a,pair,m))continue;const around=s.units.filter(h=>h.team==='ally'&&alive(h)&&h.id!==b.id&&Math.abs(h.x-b.x)+Math.abs(h.y-b.y)===1).length;
    const sc=40+around*30+(e.kind==='archer'?50:0)+(m0(s,e.x,e.y)==='o'?40:0)+(g.targets?.includes(e.id)?120:0);if(sc>=90)consider({x,y,mode:m,target:pair,score:sc-c*.3});}
   if(m==='blockade')for(let ty=y-5;ty<=y+5;ty++)for(let tx=x-5;tx<=x+5;tx++){const p2=`${tx},${ty}`;if(!validClassTarget(s,a,p2,m))continue;const n=foes.filter(e=>Math.abs(e.x-tx)+Math.abs(e.y-ty)<=1).length;if(n>=2)consider({x,y,mode:m,target:p2,score:60+n*45-c*.3});}}
  // position only
  let score;const onRune=(s.runes||[]).some(r=>r.x===x&&r.y===y)&&u.id==='lia'?40:0;if(onRune&&best&&best.x===x&&best.y===y)best.score+=onRune;
  if(reach)score=300-(reach.get(p)??100)*20-c*.1;
  else if(g.posts?.[u.id])score=60-distance(a,{x:g.posts[u.id][0],y:g.posts[u.id][1]})*20; // v0.9.2 trial 109: Erik keeps his gap
  else if(g.hold&&g.type==='survive'&&u.id===m.skirmish.hero)score=60-distance(a,{x:g.hold[0],y:g.hold[1]})*20;
  else if(g.type==='gather'){const anchor=findUnit(s,m.skirmish.hero),far=s.units.filter(t=>t.team==='ally'&&alive(t)&&!t.benched&&t.id!==anchor.id&&distance(t,anchor)>g.radius);score=u.id===anchor.id?60-(far.length?Math.min(...far.map(t=>Math.abs(distance(a,t)-3)))*12:0):60-distance(a,anchor)*10;}
  else if(g.type==='survive'){const anchor=findUnit(s,m.skirmish.hero);score=40-(anchor&&anchor.id!==u.id?distance(a,anchor)*10:0)-foes.reduce((n,e)=>n+(distance(e,a)<=2?6:0),0);}
  else{const tg=foes.filter(e=>!g.targets||g.targets.includes(e.id));const near=tg.reduce((n,t)=>Math.min(n,distance(a,t)),100);const ranged=u.range[0]>=2||u.id==='lia'||u.id==='sain';score=80-(ranged?Math.abs(near-3)*10:near*8)-c*.1;}
  consider({x,y,mode:'wait',score});}
 return best;
}

export function playSkirmish(s,opts={}){let steps=0;drain(s);
 while(!s.outcome&&steps++<60){
  for(const id of [s.skirmish?.hero,'kai','lia','elina','sain','eric'].filter((v,i,a)=>v&&a.indexOf(v)===i)){const u=findUnit(s,id);if(!u||u.benched||!(canAct(s,u)||canMove(s,u)))continue;
   for(let pass=0;pass<2&&!s.outcome&&(canAct(s,u)||canMove(s,u));pass++){const a=skirmishAction(s,u,opts);if(!a)break;
    if((a.x!==u.x||a.y!==u.y)&&canMove(s,u)){if(!moveUnit(s,id,a.x,a.y))throw Error(`illegal move ${id}`);}
    if(!canAct(s,u))break;const r=performAction(s,id,a.mode,a.target);if(!r.ok)throw Error(`${id} ${a.mode}: ${r.error}`);drain(s);}
   if(s.outcome)break;}
  if(!s.outcome){beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);}}
 return {outcome:s.outcome,turn:s.turn,reason:s.reason};
}
