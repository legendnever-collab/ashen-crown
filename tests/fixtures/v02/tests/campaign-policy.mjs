import {findUnit,alive,movement,validTarget,forecast,distance,terrainAt} from '../src/core/rules.js';
import {moveUnit,performAction,canAct,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';
import {openStory,advanceStory} from '../src/core/narrative.js';
export function drain(s){openStory(s);for(let i=0;s.narrative.active&&i<100;i++)advanceStory(s);}
export function campaignAction(s,u,capture=true){
 let best=null;const cells=u.moved?new Map([[`${u.x},${u.y}`,0]]):movement(s,u).costs;
 const civ=s.units.filter(t=>t.team==='civilian'&&alive(t));
 for(const [p,c]of cells){const [x,y]=p.split(',').map(Number),a={...u,x,y};
  for(const t of s.units.filter(alive))for(const mode of ['capture','rescue','skill','attack']){if(!validTarget(s,a,t,mode)||mode==='capture'&&!capture||mode==='skill'&&a.mp<(a.cost+(a.id==='lia'&&a.hp<=a.maxHP/2?1:0)))continue;const f=forecast(s,a,t,mode);let score=-1000;
  if(mode==='capture')score=2000;
  else if(mode==='rescue')score=1000;
  else if(f.heal!==undefined)score=f.heal>=10?80+f.heal:0;
  else if(f.guard===true)score=0;
  else{score=f.damage*f.hit/100*3+(f.after===0?50:0)-f.counter;
   if(s.missionId===2&&t.id==='boss'){score+=100;if(capture&&f.after===0)score=-500;}
   if(s.missionId===3){if(civ.length)score+=20;else score+=t.y<u.y?100:10;}}
  score-=c*.5;if(!best||score>best.score)best={id:u.id,x,y,mode,target:t.id,score};}
  let score;
  if(s.missionId===3&&!civ.length)score=100+(u.y-y)*15-c*.1;
  else{const targets=civ.length?civ:s.units.filter(t=>t.id==='boss'&&alive(t));const near=targets.reduce((n,t)=>Math.min(n,distance(a,t)),100);score=80-near*8-c*.1;}
  if(!best||score>best.score)best={id:u.id,x,y,mode:'wait',score};
 }
 return best||{id:u.id,x:u.x,y:u.y,mode:'wait'};
}
export function playCampaignBattle(s,capture=true){const trace=[];let steps=0;drain(s);while(!s.outcome&&steps++<150){for(const id of ['kai','lia','elina','sain','eric']){const u=findUnit(s,id);if(!canAct(s,u))continue;const a=campaignAction(s,u,capture);if(a.x!==u.x||a.y!==u.y){if(!moveUnit(s,id,a.x,a.y))throw Error('illegal move');trace.push({type:'move',id,x:a.x,y:a.y});}const action=performAction(s,id,a.mode,a.target);if(!action.ok)throw Error(action.error);trace.push({type:'action',id,mode:a.mode,target:a.target});drain(s);if(s.outcome)break;}if(!s.outcome){beginEnemyPhase(s);trace.push({type:'phase'});while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);}}return {outcome:s.outcome,turn:s.turn,trace,saved:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,captured:!!s.campaign.flags.mission_02_prisoner_captured};}
