// v0.6 Phase D / v0.6.1: M01→M10 legal-policy campaign simulation (30 seeds). M07–M10 must stay winnable (≥ 90%) with
// the choices alternated (M07 deserters handover/legion, M08 order hold/rescue — the rescue runs deploy with the
// 'defense' preset so two heroes start by the rear village); saves round-trip mid-campaign.
import {newGame,startBattle,nextMission,presetDeployment} from '../src/core/game.js';import {playBattle} from './player-policy.mjs';import {playCampaignBattle} from './campaign-policy.mjs';
import {chooseDeserters,chooseOrder} from '../src/core/mission-rules-v06.js';import {chooseStance} from '../src/core/mission-rules-v061.js';import {serialize,deserialize} from '../src/persistence/save-manager.js';import fs from 'node:fs';
const N=+process.argv[2]||30,start=+process.argv[3]||20261014,out=[];
for(let seed=start;seed<start+N;seed++){let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
 for(const id of [2,3,4,5,6]){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer=seed%2?'present':'acknowledged';s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?seed%2===0:true);if(s.outcome!=='victory')break;if(id===4)s.campaign.choices.m04_records_choice=seed%2?'kept':'reported';}
 if(s.outcome!=='victory'){out.push({seed,stop:s.missionId,outcome:s.outcome});continue;}
 s.campaign.choices.m06_oath=['people','comrades','truth'][seed%3];const r={seed,records:s.campaign.choices.m04_records_choice};
 s=nextMission(s);r.lv=s.units.filter(u=>u.team==='ally').map(u=>`${u.id}${u.level}`).join(' ');s.screen='deployment';startBattle(s);let p;try{p=playCampaignBattle(s);}catch(e){p={outcome:'ERR '+e.message};}deserialize(serialize(s));
 Object.assign(r,{m7:p.outcome,t7:s.turn,why7:s.reason,escorts:s.units.filter(u=>u.team==='allied'&&u.hp>0).length,through:s.units.filter(w=>w.kind==='wagon'&&w.rescued).length,captured:s.missionState.captured});
 if(s.outcome!=='victory'){out.push(r);continue;}
 if(s.missionState.captured){chooseDeserters(s,seed%3===0?'handover':'legion');r.deserters=s.campaign.choices.m07_deserters;}
 s=nextMission(s);chooseOrder(s,seed%2?'rescue':'hold');s.screen='deployment';if(seed%2)presetDeployment(s,'defense');startBattle(s);try{p=playCampaignBattle(s);}catch(e){p={outcome:'ERR '+e.message};}deserialize(serialize(s));
 Object.assign(r,{m8:p.outcome,t8:s.turn,why8:s.reason,order:s.campaign.choices.m08_order,saved:s.units.filter(v=>v.team==='civilian'&&v.rescued).length,rockfalls:s.missionState.rockfall.length,iron:s.campaign.factionTrust?.iron,thea:!!s.campaign.roster?.includes('thea')});
 if(s.outcome!=='victory'){out.push(r);continue;}
 // v0.6.1: M09 (Velmar) and M10 (stance rotated by seed: support Oswin / support Brennan / mediate).
 s=nextMission(s);s.screen='deployment';startBattle(s);try{p=playCampaignBattle(s);}catch(e){p={outcome:'ERR '+e.message};}deserialize(serialize(s));
 Object.assign(r,{m9:p.outcome,t9:s.turn,why9:s.reason,delegates:s.units.filter(v=>v.team==='civilian'&&v.hp>0).length,captured9:!!s.missionState.captured});
 if(s.outcome!=='victory'){out.push(r);continue;}
 s=nextMission(s);s.screen='deployment';chooseStance(s,['a','b','mediate'][seed%3]);startBattle(s);try{p=playCampaignBattle(s);}catch(e){p={outcome:'ERR '+e.message};}deserialize(serialize(s));
 Object.assign(r,{m10:p.outcome,t10:s.turn,why10:s.reason,stance:s.campaign.choices.m10_stance,mediated:!!s.campaign.flags.mission_10_mediated,villagers10:s.units.filter(v=>v.team==='civilian'&&v.rescued).length,free:s.campaign.factionTrust?.free,dario:!!s.campaign.roster?.includes('dario')});out.push(r);}
for(const o of out)console.log(JSON.stringify(o));
const w7=out.filter(o=>o.m7==='victory'),w8=out.filter(o=>o.m8==='victory'),w9=out.filter(o=>o.m9==='victory'),w10=out.filter(o=>o.m10==='victory');
const summary={seeds:out.length,m7Wins:w7.length,m8Wins:w8.length,m7Turns:w7.map(o=>o.t7),m8Turns:w8.map(o=>o.t8),theaJoined:out.filter(o=>o.thea).length,captured:out.filter(o=>o.captured).length,fullConvoy:out.filter(o=>o.through===3).length,rescueSaved:out.filter(o=>o.order==='rescue').map(o=>o.saved),m9Wins:w9.length,m9Turns:w9.map(o=>o.t9),delegatesAll:out.filter(o=>o.delegates===3).length,captured9:out.filter(o=>o.captured9).length,m10Wins:w10.length,m10ByStance:Object.fromEntries(['a','b','mediate'].map(k=>[k,{runs:out.filter(o=>o.stance===k).length,wins:w10.filter(o=>o.stance===k).length,turns:w10.filter(o=>o.stance===k).map(o=>o.t10)}])),mediated:out.filter(o=>o.mediated).length,villagers10All:out.filter(o=>o.villagers10===3).length,darioJoined:out.filter(o=>o.dario).length};
console.log(JSON.stringify(summary));fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/act2-balance.json',JSON.stringify({summary,runs:out},null,1));
if(w7.length<out.length*0.9||w8.length<w7.length*0.9||w9.length<w8.length*0.9||w10.length<w9.length*0.9)process.exit(1);
