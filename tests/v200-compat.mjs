// v2.0.0 (D-115, REFORM_DESIGN §8): what "every asset kept" means after schema 20. The reform changes three things by
// design — hero records gain the six stats (recomputed from level and tier), the economy gains the two start treasures and
// the officers' slots (and lets go of pieces a hero's class can no longer hold), the roster gains the officers earned so
// far. Everything else must be byte-for-byte the same. Shared by the older migration tests.
import assert from 'node:assert/strict';
import {START_TREASURES} from '../src/core/economy.js';
import {OFFICER_IDS} from '../src/core/stats8.js';
import {GEAR} from '../src/data/frontier-data.js';
const STARTS=new Set(Object.values(START_TREASURES));
export function econV200(e){if(!e)return e;const v=structuredClone(e),starts=new Set(v.gear.filter(g=>STARTS.has(g.type)).map(g=>g.id));
 v.gear=v.gear.filter(g=>!starts.has(g.id));for(const id of OFFICER_IDS)delete v.equipped?.[id];
 for(const [hero,slots] of Object.entries(v.equipped||{}))for(const [k,gid] of Object.entries(slots)){if(starts.has(gid)){slots[k]=null;continue;}const g=v.gear.find(a=>a.id===gid);if(g&&!GEAR[g.type]?.heroes.includes(hero))slots[k]=null;}
 delete v.next;return v;}
const heroView=h=>h&&({id:h.id,level:h.level,xp:h.xp,classTier:h.classTier,storyTier:h.storyTier,appearanceTier:h.appearanceTier,clues:h.clues,growthHistory:h.growthHistory});
export function keptV200(after,before,k){
 if(k==='economy')return assert.deepEqual(econV200(after[k]),econV200(before[k]),k);
 if(k==='heroes'){const a=(after.heroes||[]).filter(h=>!OFFICER_IDS.includes(h.id));assert.deepEqual(a.map(heroView),(before.heroes||[]).map(heroView),k);for(const h of a)assert.ok(h.stats&&h.cls,`${h.id} has the six stats`);return;}
 if(k==='roster'){const b=before.roster||[];assert.deepEqual((after.roster||[]).filter(id=>!OFFICER_IDS.includes(id)),b,k);assert.ok(['bram','noa','marta'].every(id=>after.roster.includes(id)),'the ACT I officers joined');return;}
 assert.deepEqual(after[k],before[k],k);}
// v2.0.0 (D-115, REFORM_DESIGN §8): a save made in the middle of a battle reopens in the camp before that battle (the
// enemies, the stats and some maps changed under it); the campaign is untouched and the battle can be fought again and won.
import {startBattle} from '../src/core/game.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
export function reopensInCamp(s,before,id,{win=true}={}){
 assert.equal(s.screen,'exploration','reopens in camp');assert.equal(s.missionId,id);assert.equal(s.migrated200,'battle');assert.equal(s.stageStart,undefined);
 const bc=before.campaign;assert.deepEqual(s.campaign.completed,bc.completed);assert.deepEqual(s.campaign.flags,bc.flags);assert.equal(s.campaign.economy.gold,bc.economy.gold);
 for(const h of bc.heroes||[]){const now=s.campaign.heroes.find(x=>x.id===h.id);assert.ok(now,h.id);assert.equal(now.level,h.level,h.id);assert.equal(now.classTier??1,h.classTier??1,h.id);}
 if(!win)return s;drain(s);s.screen='deployment';assert.ok(startBattle(s));drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory',s.reason);return s;}
