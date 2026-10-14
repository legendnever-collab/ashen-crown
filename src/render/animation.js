export const RANGE_STYLE={move:{fill:'rgba(43,161,232,.62)',border:'#a9e8ff'},attack:{fill:'rgba(228,78,64,.62)',border:'#ffbf89'},support:{fill:'rgba(70,190,117,.60)',border:'#cbf5a6'}};
export function moveDuration(path,mode='step',speed=1){return mode==='instant'||path.length<2?0:(path.length-1)*(mode==='step'?320:210)/speed;}
export function motionAt(path,elapsed,mode='step',speed=1){
 const duration=moveDuration(path,mode,speed),progress=duration?Math.max(0,Math.min(1,elapsed/duration)):1,step=progress*(path.length-1),index=Math.min(path.length-2,Math.floor(step));
 if(index<0)return {...path[0],index:0,done:true};const f=step-index,t=mode==='step'?Math.min(1,f/.78):f;
 return {x:path[index].x+(path[index+1].x-path[index].x)*t,y:path[index].y+(path[index+1].y-path[index].y)*t,index:progress===1?path.length-1:index,done:progress===1};
}
export function attackKind(unit,mode){if(unit.id==='lia'&&mode==='skill')return 'fireball';if(unit.range?.[0]>=2)return 'arrow';if(unit.id==='kai')return 'dagger';return unit.kind==='bandit'||unit.kind==='captain'?'axe':'sword';}
export function presentationPlan(events,units,{movement='step',speed=1,reduced=false}={}){
 const plans=[],hp=[],motions=[];let cursor=0,lastImpact=0;
 for(const event of events){
  if(event.type==='move'){const duration=moveDuration(event.path,movement,speed);motions.push({...event,delay:cursor,duration,movement,speed});cursor+=duration;}
  else if(event.type==='attack'){
   const unit=units.find(u=>u.id===event.id),kind=attackKind(unit,event.mode),duration=(reduced?220:kind==='fireball'?1250:kind==='arrow'?680:720)/speed,impact=cursor+duration*(kind==='fireball'?.56:kind==='arrow'?.65:.46);
   plans.push({...event,kind,delay:cursor,duration,impact});lastImpact=impact;cursor+=duration;
  }else{const delay=['hit','critical','miss','death'].includes(event.type)?lastImpact:Math.max(0,cursor-180/speed),duration=(['level','potential'].includes(event.type)?1400:900)/speed;plans.push({...event,delay,duration});
   if(Number.isFinite(event.toHP))hp.push({id:event.id,delay,hp:event.toHP});
  }
 }
 return {plans,motions,hp,duration:Math.max(cursor,...plans.map(e=>e.delay+Math.min(e.duration,450/speed)),0)};
}
