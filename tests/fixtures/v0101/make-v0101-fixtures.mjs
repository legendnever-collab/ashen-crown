// Builds real v0.10.1 (schema 17) save files with the released v0.10.1 source, for the v0.10.2 migration test.
// Usage: git worktree add --detach <dir> 6adba79 (v0.10.1 merge) && node tests/fixtures/v0101/make-v0101-fixtures.mjs <dir> [seed]
// The campaign goes through ACT IV part 2 (M25 the betrayed banner, M26 Baldrick), so the schema 17 → 18 step and the
// continuation (M27 at the capital's southern gate, from the lower city) are exercised on real v0.10.1 data. At M13 the
// policy speaks first (persuasion), the way a player who halts Baldrick's army does, so that M26 can end with his joining.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');const {transact}=await imp('src/core/economy.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain,setPersuadeFirst}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');const {chooseOath,chooseRecords}=await imp('src/core/mission-rules-v070.js');const {chooseRecords15,chooseStones16}=await imp('src/core/mission-rules-v090.js');const {chooseOath17,chooseTruth18}=await imp('src/core/mission-rules-v091.js');const {chooseTeacher19,chooseSuperior20,choosePlan20}=await imp('src/core/mission-rules-v092.js');const {chooseKing21,chooseAct3}=await imp('src/core/mission-rules-v093.js');const {chooseLead23}=await imp('src/core/mission-rules-v0100.js');const {chooseBanner25}=await imp('src/core/mission-rules-v0101.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'roster',JSON.stringify(s.campaign.roster),'baldrick',s.campaign.flags.mission_13_baldrick,s.campaign.flags.mission_26_baldrick);};
const tx=(s,op,id,hero,slot)=>{const r=transact(s,{op,id,hero,slot,token:`tx:${s.economy.nonce}`});if(!r.ok)throw Error(`${op} ${id}: ${r.error}`);};
const seed=Number(process.argv[3]||20261015);let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
for(let id=2;id<=6;id++){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='acknowledged';
 if(id===4){enterHub(s,{story:false});drain(s);tx(s,'buy-gear','ironBlade','eric');tx(s,'upgrade',s.economy.gear.at(-1).id);tx(s,'buy-gear','travelCloak','lia');}
 s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='people';
const play=(id,pre)=>{s=nextMission(s);s.screen='deployment';pre?.();startBattle(s);if(id===13)setPersuadeFirst(true);playCampaignBattle(s);setPersuadeFirst(false);if(s.outcome!=='victory')throw Error(`M${id} not won`);};
play(7);if(s.missionState.captured)chooseDeserters(s,'legion');play(8,()=>chooseOrder(s,'hold'));play(9);play(10,()=>chooseStance(s,'a'));play(11);chooseOath(s,'oath');
play(12);chooseRecords(s,s.campaign.flags.mission_12_copy_ready?'copy':'return');play(13);play(14);play(15);chooseRecords15(s,'keep');
play(16);chooseStones16(s,'break');play(17);chooseOath17(s,'take');
play(18);chooseTruth18(s,'tell');play(19);chooseTeacher19(s,'take');
play(20);chooseSuperior20(s,'trial');choosePlan20(s,'send');play(21);chooseKing21(s,'promise');
play(22);chooseAct3(s,'council');play(23);chooseLead23(s,'banners');play(24);play(25);chooseBanner25(s,'forgive');
s=nextMission(s);enterHub(s,{story:false});drain(s);s.screen='deployment';startBattle(s);const mid=structuredClone(s);drain(mid);write('v0101-m26-battle',mid,'v0.10.1 Mission 26 battle in progress (turn 1, the lion\'s pass)');
playCampaignBattle(s);if(s.outcome!=='victory')throw Error('M26 not won');enterHub(s,{aftermath:true});drain(s);s.screen='exploration';drain(s);
write('v0101-m26-camp',s,'v0.10.1 campaign at its last moment: the oath camp below the lion\'s pass after M26');
