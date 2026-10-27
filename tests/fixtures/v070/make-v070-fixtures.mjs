// Builds real v0.7.0 (schema 9) save files with the released v0.7.0 source, for the v0.7.1 migration test.
// Usage: git worktree add --detach <dir> 81f11d3 (v0.7.0 merge) && node tests/fixtures/v070/make-v070-fixtures.mjs <dir>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');const {chooseOath,chooseRecords}=await imp('src/core/mission-rules-v070.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'roster',s.campaign.roster,'trust',JSON.stringify(s.campaign.factionTrust));};
const seed=20261014;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='acknowledged';s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='people';
const play=(id,pre)=>{s=nextMission(s);s.screen='deployment';pre?.();startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error(`M${id} not won`);};
play(7);if(s.missionState.captured)chooseDeserters(s,'legion');play(8,()=>chooseOrder(s,'hold'));play(9);play(10,()=>chooseStance(s,'a'));play(11);chooseOath(s,'oath');
s=nextMission(s);s.screen='deployment';startBattle(s);const mid=structuredClone(s);drain(mid);write('v070-m12-battle',mid,'v0.7.0 Mission 12 battle in progress (turn 1, the monastery quiet)');
playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M12 not won');enterHub(s,{aftermath:true});drain(s);s.screen='exploration';chooseRecords(s,s.campaign.flags.mission_12_copy_ready?'copy':'return');drain(s);
write('v070-m12-camp',s,'v0.7.0 campaign at its last moment: the refugee camp after M12, the records decided, Ines joined (if eligible)');
