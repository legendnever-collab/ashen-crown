// Builds real v2.0.0 (schema 20) save files with the v2.0.0 source (main 316d447), for the v2.1.0 migration test (D-118).
// Usage: git worktree add --detach <dir> 316d447 && node tests/fixtures/v200/make-v200-fixtures.mjs <dir> [seed]
// Two moments: the village camp before M01 (the three ACT I officers already in the legion, Lia/Sain/Kai still to be
// "affiliated" by walking up to them) and the camp after M04 (Rowell has joined) — the officers must stay as hires.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'roster',JSON.stringify(s.campaign.roster));};
const seed=Number(process.argv[3]||20261015);let s=newGame(seed);s.campaign.difficulty='normal';enterHub(s,{story:false});drain(s);write('v200-m01-camp',s,'v2.0.0 village camp before Mission 01 (officers in the legion)');
s.screen='deployment';startBattle(s);playBattle(s);if(s.outcome!=='victory')throw Error('M01 not won');
for(let id=2;id<=4;id++){s=nextMission(s);s.screen='deployment';startBattle(s);drain(s);for(let t=0;t<3&&s.outcome!=='victory';t++){if(t){s=structuredClone(s.stageStart);s.rng=(s.rng+t*7919)>>>0;}playCampaignBattle(s,true);}if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s=nextMission(s);enterHub(s,{story:false});drain(s);write('v200-m05-camp',s,'v2.0.0 camp before Mission 05 (after M04: Rowell joined)');
