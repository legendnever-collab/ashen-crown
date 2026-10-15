import {findUnit,alive,movement,validTarget,forecast,distance,terrainAt} from '../src/core/rules.js';
import {moveUnit,performAction,canAct,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';
import {HEROES} from '../src/data/game-data.js';
export function chooseAction(s,u,{guard=false}={}){
 const civ=s.units.filter(t=>t.team==='civilian'&&alive(t)),enemies=s.units.filter(t=>t.team==='enemy'&&alive(t));
 let best=null;const reachable=u.moved?new Map([[`${u.x},${u.y}`,0]]):movement(s,u).costs;
 for(const [p,c]of reachable){const [x,y]=p.split(',').map(Number),a={...u,x,y};
  for(const t of s.units.filter(alive))for(const mode of ['rescue','skill','attack']){if(!validTarget(s,a,t,mode))continue;if(mode==='skill'&&a.mp<(a.cost+(a.id==='lia'&&a.hp<=a.maxHP/2?1:0)))continue;
   const f=forecast(s,a,t,mode);let score=-1000;
   if(mode==='rescue')score=1000-c;
   else if(f.heal!==undefined){score=f.heal>=12?90+f.heal:0;}
   else if(f.guard===true){score=guard&&u.id==='eric'&&!u.clues.includes("Guardian’s Oath")&&enemies.some(e=>distance(a,e)<=e.mov+1)?105:0;}
   else{score=f.damage*f.hit/100*3+(f.after===0?90:0)+(t.id==='boss'?35:0)-f.counter*.8+(mode==='skill'&&u.id==='lia'?8:0);}
   score-=c*.5;if(!best||score>best.score)best={id:u.id,x,y,mode,target:t.id,score};
  }
  // Advance toward a civilian or captain when no immediate productive action is available.
  const targets=civ.length?civ:enemies.filter(e=>e.id==='boss').length?enemies.filter(e=>e.id==='boss'):enemies;
  const nearest=targets.reduce((acc,t)=>Math.min(acc,distance(a,t)),100);const score=30-nearest*4+terrainAt(x,y,s).defense-c*.1;
  if(!best||score>best.score)best={id:u.id,x,y,mode:'wait',score};
 }
 return best||{id:u.id,x:u.x,y:u.y,mode:'wait'};
}
export function playBattle(s,options={}){
 const trace=[],states=[];let steps=0;
 while(!s.outcome&&s.turn<=30&&steps++<500){
  // Rescue specialist first; archer and mage before front line leaves occupied corridors.
  for(const id of ['kai','lia','elina','sain','eric']){const u=findUnit(s,id);if(!canAct(s,u))continue;const a=chooseAction(s,u,options);if(a.x!==u.x||a.y!==u.y){const path=moveUnit(s,id,a.x,a.y);if(!path)throw Error('Policy chose illegal move');trace.push({type:'move',id,x:a.x,y:a.y});}const r=performAction(s,id,a.mode,a.target);if(!r.ok)throw Error(r.error);trace.push({type:'action',id,mode:a.mode,target:a.target});if(s.outcome)break;}
  states.push({turn:s.turn,hp:s.units.filter(u=>u.team==='ally').map(u=>({id:u.id,hp:u.hp})),rescued:s.units.filter(u=>u.rescued).length});
  if(!s.outcome){beginEnemyPhase(s);trace.push({type:'phase'});while(s.phase==='enemy'&&!s.outcome)advanceEnemy(s);}
 }
 return {outcome:s.outcome,turn:s.turn,trace,states,alive:s.units.filter(u=>u.team==='ally'&&alive(u)).length,potential:findUnit(s,'eric').clues.includes("Guardian’s Oath"),levels:s.units.filter(u=>u.team==='ally').map(u=>({id:u.id,level:u.level,earnedXP:u.earnedXP}))};
}
