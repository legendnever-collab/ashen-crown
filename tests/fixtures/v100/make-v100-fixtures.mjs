// Builds real v1.0.0 (schema 19) save files with the v1.0.0 release candidate source, for the v2.0.0 migration test (D-115).
// Usage: git worktree add --detach <dir> feature/v1.0.0-crown (306f3e3) && node tests/fixtures/v100/make-v100-fixtures.mjs <dir> [seed]
// Three moments a v1.0.0 player may stand at: the camp before M02 (ACT I is on new maps in v2.0.0), a battle in progress
// (M05, turn 1: it reopens in camp), and the dawn after M30 with the ending chosen (the whole campaign carried over).
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');const {transact}=await imp('src/core/economy.js');
const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain,setPersuadeFirst}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const {chooseDeserters,chooseOrder}=await imp('src/core/mission-rules-v06.js');const {chooseStance}=await imp('src/core/mission-rules-v061.js');const {chooseOath,chooseRecords}=await imp('src/core/mission-rules-v070.js');const {chooseRecords15,chooseStones16}=await imp('src/core/mission-rules-v090.js');const {chooseOath17,chooseTruth18}=await imp('src/core/mission-rules-v091.js');const {chooseTeacher19,chooseSuperior20,choosePlan20}=await imp('src/core/mission-rules-v092.js');const {chooseKing21,chooseAct3}=await imp('src/core/mission-rules-v093.js');const {chooseConfession28}=await imp('src/core/mission-rules-v0102.js');const {chooseFate29,fateOpen29}=await imp('src/core/mission-rules-v100.js');const {chooseEnding,openEndings}=await imp('src/core/ending.js');const {chooseLead23}=await imp('src/core/mission-rules-v0100.js');const {chooseBanner25}=await imp('src/core/mission-rules-v0101.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId,'outcome',s.outcome,'roster',JSON.stringify(s.campaign.roster),'baldrick',s.campaign.flags.mission_13_baldrick,s.campaign.flags.mission_26_baldrick);};
const tx=(s,op,id,hero,slot)=>{const r=transact(s,{op,id,hero,slot,token:`tx:${s.economy.nonce}`});if(!r.ok)throw Error(`${op} ${id}: ${r.error}`);};
const seed=Number(process.argv[3]||20261015);let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);if(s.outcome!=='victory')throw Error('M01 not won');
s=nextMission(s);enterHub(s,{story:false});drain(s);write('v100-m02-camp',s,'v1.0.0 camp before Mission 02 (after M01, the old 12×10 village)');
for(let id=2;id<=6;id++){if(id>2)s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer='acknowledged';
 if(id===4){enterHub(s,{story:false});drain(s);tx(s,'buy-gear','ironBlade','eric');tx(s,'upgrade',s.economy.gear.at(-1).id);tx(s,'buy-gear','travelCloak','lia');}
 s.screen='deployment';startBattle(s);if(id===5){const mid=structuredClone(s);drain(mid);write('v100-m05-battle',mid,'v1.0.0 Mission 05 battle in progress (turn 1, the border ridge)');}
 playCampaignBattle(s,id===2?false:true);if(s.outcome!=='victory')throw Error(`M0${id} not won`);if(id===4)s.campaign.choices.m04_records_choice='kept';}
s.campaign.choices.m06_oath='people';
const play=(id,pre)=>{s=nextMission(s);s.screen='deployment';pre?.();startBattle(s);if(id===13)setPersuadeFirst(true);playCampaignBattle(s);setPersuadeFirst(false);if(s.outcome!=='victory')throw Error(`M${id} not won`);};
play(7);if(s.missionState.captured)chooseDeserters(s,'legion');play(8,()=>chooseOrder(s,'hold'));play(9);play(10,()=>chooseStance(s,'a'));play(11);chooseOath(s,'oath');
play(12);chooseRecords(s,s.campaign.flags.mission_12_copy_ready?'copy':'return');play(13);play(14);play(15);chooseRecords15(s,'keep');
play(16);chooseStones16(s,'break');play(17);chooseOath17(s,'take');
play(18);chooseTruth18(s,'tell');play(19);chooseTeacher19(s,'take');
play(20);chooseSuperior20(s,'trial');choosePlan20(s,'send');play(21);chooseKing21(s,'promise');
play(22);chooseAct3(s,'council');play(23);chooseLead23(s,'banners');play(24);play(25);chooseBanner25(s,'forgive');
play(26);play(27);play(28);enterHub(s,{aftermath:true});drain(s);s.screen='exploration';drain(s);chooseConfession28(s,'all');drain(s);
play(29);drain(s);if(fateOpen29(s))chooseFate29(s,'trial');drain(s);play(30);drain(s);
{const open=openEndings(s);const pick=open.includes?.('A')?'A':open[0];if(pick)chooseEnding(s,pick);}drain(s);
write('v100-m30-ending',s,'v1.0.0 campaign finished: the dawn after M30 with the ending chosen');
