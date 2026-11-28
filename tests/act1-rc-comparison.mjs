// Runs against this checkout, or a specified earlier source checkout with its own policies.
import path from 'node:path';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]||'.');
const use=file=>import(pathToFileURL(path.join(root,file)).href);
const {newGame,startBattle,nextMission}=await use('src/core/game.js');
const {playBattle}=await use('tests/player-policy.mjs');
const {playCampaignBattle}=await use('tests/campaign-policy.mjs');
const {serialize}=await use('src/persistence/save-manager.js');
const difficulty=process.argv[3]||'normal',rows=[];
for(let seed=20261014;seed<20261044;seed++){
 let camp=newGame(seed);
 camp.campaign.difficulty=difficulty;
 for(let mission=1;mission<=6;mission++){
  if(mission===5)camp.campaign.choices.m05_erik_answer=seed%2?'present':'acknowledged';
  if(mission===6&&process.env.DUMP_M06){
   fs.mkdirSync(process.env.DUMP_M06,{recursive:true});
   fs.writeFileSync(path.join(process.env.DUMP_M06,'camp-'+seed+'.json'),serialize(camp));
  }
  let battle;
  for(let attempt=0;attempt<3;attempt++){
   battle=structuredClone(camp);battle.rng=battle.initialSeed=(battle.rng+attempt*7919)>>>0;
   battle.screen='deployment';startBattle(battle);
   if(mission===1)playBattle(battle);else playCampaignBattle(battle,mission!==2||seed%2===0);
   if(mission===6&&attempt===0){
    let turn=1,firstPassTurn=null;
    for(const line of battle.log){
     const phase=/^TURN (\d+) · (ENEMY|PLAYER) PHASE/.exec(line);
     if(phase)turn=Number(phase[1])+(phase[2]==='ENEMY');
     if(line.includes('관문을 넘었')){firstPassTurn=turn;break;}
    }
    rows.push({campaignSeed:seed,battleSeed:battle.initialSeed,outcome:battle.outcome,
     through:battle.units.filter(u=>u.team==='civilian'&&u.rescued).length,firstPassTurn});
   }
   if(battle.outcome==='victory'||mission===6)break;
  }
  if(battle.outcome!=='victory'||mission===6)break;
  if(mission===4)battle.campaign.choices.m04_records_choice=seed%2?'kept':'reported';
  camp=nextMission(battle);
 }
}
console.log(JSON.stringify(rows,null,1));
