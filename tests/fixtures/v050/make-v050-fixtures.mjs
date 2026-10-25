// Builds real v0.5.0 (schema 8) save files with the released v0.5.0 source, for the v0.6.0 migration test.
// Usage: git worktree add --detach <dir> v0.5.0 (merge 33577c4) && node tests/fixtures/v050/make-v050-fixtures.mjs <dir>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {introStory}=await imp('src/core/narrative.js');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {promote}=await imp('src/core/progression.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'promotions',JSON.stringify(s.campaign.promotions));};
const seed=20261020;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='present';s.screen='deployment';startBattle(s);if(id===6)introStory(s);
 if(id===6){const mid=structuredClone(s);drain(mid);write('v050-m06-battle',mid,'v0.5.0 Mission 06 battle in progress (turn 1)');}
 playCampaignBattle(s,id===2);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='reported';}
enterHub(s,{aftermath:true});drain(s);s.campaign.choices.m06_oath='truth';s.campaign.flags.ashen_oath_focus='truth';s.campaign.choices.act1_seen='yes';
// One hero promoted through the rite (forced: the fixture records the Tier 2 state, not the trial path).
promote(s,'eric',{force:true});s.screen='exploration';write('v050-act1-complete',s,'v0.5.0 campaign with ACT I complete, oath chosen, Eric promoted (oath camp)');
