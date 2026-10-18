// Builds real v0.3.3 (schema 6) save files with the v0.3.3 source itself, for the v0.4.0 migration test.
// Usage: git worktree add <dir> v0.3.3 && node tests/fixtures/v033/make-v033-fixtures.mjs <dir>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const old=path.resolve(process.argv[2]),imp=f=>import(pathToFileURL(path.join(old,f)).href),out=path.dirname(new URL(import.meta.url).pathname);
const {newGame,startBattle,nextMission,moveUnit,performAction}=await imp('src/core/game.js');const {enterHub}=await imp('src/core/frontier.js');const {serialize}=await imp('src/persistence/save-manager.js');
const {transact,ensureEconomy}=await imp('src/core/economy.js');const {playBattle}=await imp('tests/player-policy.mjs');const {playCampaignBattle,drain}=await imp('tests/campaign-policy.mjs');const {VERSION,SCHEMA}=await imp('src/data/game-data.js');
const write=(name,s,note)=>{fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify({version:VERSION,schema:SCHEMA,note,save:serialize(s)},null,1));console.log(name,s.screen,'mission',s.missionId);};
// 1. fresh campaign in the village (exploration, M01 preparation)
let s=newGame(20261016);enterHub(s);drain(s);write('v033-camp-m01',s,'v0.3.3 new campaign, village preparation');
// 2. M01–M03 cleared with the v0.3.3 legal policies, a purchase equipped, then the M03 aftermath camp
s=newGame(20261016);s.screen='deployment';startBattle(s);playBattle(s);
for(const capture of [true,true]){s=nextMission(s);s.screen='deployment';startBattle(s);playCampaignBattle(s,capture);}
enterHub(s,{aftermath:true});drain(s);s.screen='exploration';
const buy=req=>{const r=transact(s,{...req,token:`tx:${ensureEconomy(s).nonce}`});console.log('purchase',req.op,req.id,r.ok?'ok':r.error);};buy({op:'buy-gear',id:'ironBlade',hero:'eric',slot:'weapon'});buy({op:'buy-item',id:'medium'});
write('v033-m03-aftermath',s,'v0.3.3 campaign with M01–M03 cleared, M03 aftermath camp');
// 3. mid-battle M02 save (battle screen, one move made, stage checkpoint present)
s=newGame(20261016);s.screen='deployment';startBattle(s);playBattle(s);s=nextMission(s);s.screen='deployment';startBattle(s);drain(s);
const e=s.units.find(u=>u.id==='eric');for(const [dx,dy]of [[0,-1],[1,0],[-1,0],[0,1]])if(moveUnit(s,'eric',e.x+dx,e.y+dy))break;performAction(s,'eric','wait');write('v033-m02-battle',s,'v0.3.3 Mission 02 in progress');
