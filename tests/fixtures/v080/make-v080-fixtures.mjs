// Builds real v0.8.0 (schema 10) save files with the released v0.8.0 source, for the v0.8.1 migration test.
// Usage: git worktree add --detach <dir> 7b8b2e8 (v0.8.0 merge) && node tests/fixtures/v080/make-v080-fixtures.mjs <dir>
// The campaign buys and upgrades gear (+1) and carries v0.8.0 tools, so the schema 10 → 11 step (+1 → ★2, the treasure
// slot) is exercised on real data.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');const {transact}=await imp('src/core/economy.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');const {chooseOath,chooseRecords}=await imp('src/core/mission-rules-v070.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'gear',JSON.stringify(s.campaign.economy.gear),'items',JSON.stringify(s.campaign.economy.items));};
const tx=(s,op,id,hero,slot)=>{const r=transact(s,{op,id,hero,slot,token:`tx:${s.economy.nonce}`});if(!r.ok)throw Error(`${op} ${id}: ${r.error}`);};
const seed=20261014;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='acknowledged';
 if(id===4){enterHub(s,{story:false});drain(s);tx(s,'buy-gear','ironBlade','eric');tx(s,'upgrade',s.economy.gear.at(-1).id);tx(s,'buy-gear','travelCloak','lia');}
 s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='people';
const play=(id,pre)=>{s=nextMission(s);s.screen='deployment';pre?.();startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error(`M${id} not won`);};
play(7);if(s.missionState.captured)chooseDeserters(s,'legion');play(8,()=>chooseOrder(s,'hold'));play(9);play(10,()=>chooseStance(s,'a'));play(11);chooseOath(s,'oath');
play(12);chooseRecords(s,s.campaign.flags.mission_12_copy_ready?'copy':'return');
play(13);s=nextMission(s);enterHub(s,{story:false});drain(s);s.economy.gold=Math.max(s.economy.gold,400);for(let i=0;i<2&&s.economy.items.ether;i++)tx(s,'sell-item','ether');for(const id of ['bomb','net'])tx(s,'buy-item',id);
s.screen='deployment';startBattle(s);const mid=structuredClone(s);drain(mid);write('v080-m14-battle',mid,'v0.8.0 Mission 14 battle in progress (turn 1, the summit; a +1 sword and bought tools)');
playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M14 not won');enterHub(s,{aftermath:true});drain(s);s.screen='exploration';drain(s);
write('v080-m14-camp',s,'v0.8.0 campaign at its last moment: the summit camp after M14, ACT II complete, a +1 sword equipped');
