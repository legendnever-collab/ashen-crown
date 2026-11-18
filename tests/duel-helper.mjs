// v2.1 (D-118): a duel is an event — it starts when the linked hero stands beside the enemy lead on the player's phase.
// Tests move the hero next to the foe (a free, open tile) and let the event rule fire, as a player's move would.
import {findUnit,at,terrainAt} from '../src/core/rules.js';
import {checkDuelEvents} from '../src/core/duel-events.js';
export function standBeside(s,heroId,foeId){const f=findUnit(s,foeId),h=findUnit(s,heroId);if(!f||!h)return null;
 for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1]]){const x=f.x+dx,y=f.y+dy;if(Math.abs(dx)+Math.abs(dy)!==1)continue;if(Number.isFinite(terrainAt(x,y,s)?.cost)&&(!at(s,x,y)||at(s,x,y)===h)){h.x=x;h.y=y;return checkDuelEvents(s,heroId);}}return null;}
