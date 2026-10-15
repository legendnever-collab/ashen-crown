// Runtime-only input: never serialized. One step per frame avoids catch-up overshoot.
export function createHeldMovement(step,{delay=180,interval=100}={}){
 let held=new Map(),next=Infinity;
 return {
  press(source,direction,now){if(held.has(source))return;held.set(source,direction);next=now+delay;if(!step(...direction))this.clear();},
  release(source,now){const active=[...held.keys()].at(-1);held.delete(source);if(active===source)next=now+interval;},
  tick(now,enabled){if(!enabled){this.clear();return;}if(held.size&&now>=next){next=now+interval;if(!step(...[...held.values()].at(-1)))this.clear();}},
  clear(){held.clear();next=Infinity;}
 };
}
