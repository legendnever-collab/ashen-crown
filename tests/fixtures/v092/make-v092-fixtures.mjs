// Builds real v0.9.2 (schema 14) save files with the released v0.9.2 source, for the v0.9.3 migration test.
// Usage: git worktree add --detach <dir> 78f30f0 (v0.9.2 + art pack F3 merge) && node tests/fixtures/v092/make-v092-fixtures.mjs <dir>
// The campaign goes through ACT III part 3 (M19 teacher, M20 superior and plan), so the schema 14 → 15 step and the
// continuation (M21 from the capital's lower city) are exercised on real v0.9.2 data.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');const {transact}=await imp('src/core/economy.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');const {chooseOath,chooseRecords}=await imp('src/core/mission-rules-v070.js');const {chooseRecords15,chooseStones16}=await imp('src/core/mission-rules-v090.js');const {chooseOath17,chooseTruth18}=await imp('src/core/mission-rules-v091.js');const {chooseTeacher19,chooseSuperior20,choosePlan20}=await imp('src/core/mission-rules-v092.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'roster',JSON.stringify(s.campaign.roster),'gear',s.campaign.economy.gear.length);};
const tx=(s,op,id,hero,slot)=>{const r=transact(s,{op,id,hero,slot,token:`tx:${s.economy.nonce}`});if(!r.ok)throw Error(`${op} ${id}: ${r.error}`);};
const seed=20261014;let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='acknowledged';
 if(id===4){enterHub(s,{story:false});drain(s);tx(s,'buy-gear','ironBlade','eric');tx(s,'upgrade',s.economy.gear.at(-1).id);tx(s,'buy-gear','travelCloak','lia');}
 s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='people';
const play=(id,pre)=>{s=nextMission(s);s.screen='deployment';pre?.();startBattle(s);playCampaignBattle(s);if(s.outcome!=='victory')throw Error(`M${id} not won`);};
play(7);if(s.missionState.captured)chooseDeserters(s,'legion');play(8,()=>chooseOrder(s,'hold'));play(9);play(10,()=>chooseStance(s,'a'));play(11);chooseOath(s,'oath');
play(12);chooseRecords(s,s.campaign.flags.mission_12_copy_ready?'copy':'return');play(13);play(14);play(15);chooseRecords15(s,'keep');
play(16);chooseStones16(s,'break');play(17);chooseOath17(s,'take');
play(18);chooseTruth18(s,'tell');play(19);chooseTeacher19(s,'take');
s=nextMission(s);enterHub(s,{story:false});drain(s);s.screen='deployment';startBattle(s);const mid=structuredClone(s);drain(mid);write('v092-m20-battle',mid,'v0.9.2 Mission 20 battle in progress (turn 1, the archive and the lower city)');
playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M20 not won');chooseSuperior20(s,'trial');choosePlan20(s,'send');enterHub(s,{aftermath:true});drain(s);s.screen='exploration';drain(s);
write('v092-m20-camp',s,'v0.9.2 campaign at its last moment: the capital\'s lower city after M20, the superior to trial, the plan sent, ACT III part 3 complete');
