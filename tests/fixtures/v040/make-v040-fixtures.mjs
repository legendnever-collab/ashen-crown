// Builds real v0.4.0 (schema 7) save files with the released v0.4.0 source, for the v0.5.0 migration test.
// Usage: git worktree add --detach <dir> f922a18 (v0.4.0 merge) && node tests/fixtures/v040/make-v040-fixtures.mjs <dir>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {introStory}=await imp('src/core/narrative.js');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome);};
const seed=20261019;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='present';s.screen='deployment';startBattle(s);if(id===6)introStory(s);
 if(id===5){const mid=structuredClone(s);drain(mid);write('v040-m05-battle',mid,'v0.4.0 Mission 05 battle in progress (turn 1)');}
 playCampaignBattle(s,id===2);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
enterHub(s,{aftermath:true});drain(s);s.screen='exploration';write('v040-act1-complete',s,'v0.4.0 campaign with ACT I complete (M06 aftermath camp)');
