// v2.1 (D-118): a duel is an event — it starts when the linked hero stands beside the enemy lead on the player's phase.
// Tests move the hero next to the foe (a free, open tile) and let the event rule fire, as a player's move would.
import {findUnit,at,terrainAt} from '../src/core/rules.js';
import {checkDuelEvents} from '../src/core/duel-events.js';
export function standBeside(s,heroId,foeId){const f=findUnit(s,foeId),h=findUnit(s,heroId);if(!f||!h)return null;
 for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]]){const x=f.x+dx,y=f.y+dy;if(Math.abs(dx)+Math.abs(dy)!==1)continue;if(Number.isFinite(terrainAt(x,y,s)?.cost)&&(!at(s,x,y)||at(s,x,y)===h)){h.x=x;h.y=y;return checkDuelEvents(s,heroId);}}return null;}
// v2.2.0 (D-123), browser: play the pair's story lines until the duel window opens (without skipping it). True when it is open.
export async function waitDuelScene(p){for(let i=0;i<60;i++){if(await p.locator('#duel-scene').count())return true;const next=p.locator('[data-do="story-next"]');if(await next.count())await next.first().click({force:true}).catch(()=>{});await p.waitForTimeout(150);}return false;}
