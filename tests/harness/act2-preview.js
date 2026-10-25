// Test-only page (never shipped): the real game bundle plus a hook that puts Erik in an ACT II town or room, which
// the story does not reach before Phase D. Built by tests/act2-hubs-e2e.mjs with ASHEN_ENTRY into test-output/.
import {render} from '../../src/ui/app.js';
import {chestKey} from '../../src/core/frontier.js';
function placeIn(id){const f=state.frontier;delete f.interior;delete f.interiorBuilding;delete f.returnPosition;f.hub=id;[f.x,f.y]=HUBS[id].spawn;f.facing='down';state.screen='exploration';state.narrative.active=null;state.narrative.queue=[];}
window.AshenPreview=Object.freeze({
 hub(id){if(!HUBS[id])return false;placeIn(id);render();return true;},
 at(x,y,facing='down'){Object.assign(state.frontier,{x,y,facing});render();return true;},
 room(id,placeId,opened=false){placeIn(id);const p=HUBS[id].places.find(p=>p.id===placeId);if(!p)return false;[state.frontier.x,state.frontier.y]=[p.x,p.y];
  const ok=enterInterior(state,p.action==='enter'?p.buildingId:p.action);if(ok&&opened)for(const c of currentHub(state).buildings.filter(b=>b.type==='chest'))state.economy.chests=[...(state.economy.chests||[]),chestKey(state,c.chestId)];
  render();return ok;}
});
