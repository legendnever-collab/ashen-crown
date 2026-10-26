// Builds real v0.6.1 (schema 9) save files with the released v0.6.1 source, for the v0.7.0 migration test.
// Usage: git worktree add --detach <dir> dcafb73 (v0.6.1 merge) && node tests/fixtures/v061/make-v061-fixtures.mjs <dir>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'roster',s.campaign.roster,'trust',JSON.stringify(s.campaign.factionTrust));};
const seed=20261014;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='present';s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='comrades';
s=nextMission(s);s.screen='deployment';startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M07 not won');if(s.missionState.captured)chooseDeserters(s,'legion');
s=nextMission(s);s.screen='deployment';chooseOrder(s,'hold');startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M08 not won');
s=nextMission(s);s.screen='deployment';startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M09 not won');
s=nextMission(s);s.screen='deployment';chooseStance(s,'mediate');startBattle(s);
const mid=structuredClone(s);drain(mid);write('v061-m10-battle',mid,'v0.6.1 Mission 10 battle in progress (turn 1, stance: mediate)');
playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M10 not won');
enterHub(s,{aftermath:true});drain(s);s.screen='exploration';write('v061-m10-camp',s,'v0.6.1 campaign at its last moment: Velmar after M10, Thea and Dario joined (if eligible)');
