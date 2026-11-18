// Runtime-only input: never serialized. One step per frame avoids catch-up overshoot.
// v2.1 play-test (D-120): one tile per 210 ms when a direction is held (was 100 ms), the same pace as a tap-walk.
export function createHeldMovement(step,{delay=230,interval=210}={}){
 let held=new Map(),next=Infinity;
 return {
  press(source,direction,now){if(held.has(source))return;held.set(source,direction);next=now+delay;if(!step(...direction))this.clear();},
  release(source,now){const active=[...held.keys()].at(-1);held.delete(source);if(active===source)next=now+interval;},
  tick(now,enabled){if(!enabled){this.clear();return;}if(held.size&&now>=next){next=now+interval;if(!step(...[...held.values()].at(-1)))this.clear();}},
  clear(){held.clear();next=Infinity;}
 };
}
