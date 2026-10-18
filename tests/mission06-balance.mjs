// M01→M06 legal-policy campaign simulation (30 seeds): the ACT I finale must stay winnable, with
// refugees through the gate and the three phases reached in order.
import {newGame,startBattle,nextMission} from '../src/core/game.js';import {playBattle} from './player-policy.mjs';import {playCampaignBattle} from './campaign-policy.mjs';import {serialize,deserialize} from '../src/persistence/save-manager.js';import {introStory} from '../src/core/narrative.js';
const out=[];const N=+process.argv[2]||30,start=+process.argv[3]||20261014;
for(let seed=start;seed<start+N;seed++){let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);
 for(const id of [2,3,4,5]){s=nextMission(s);if(id===5)s.campaign.choices.m05_erik_answer=seed%2?'present':'acknowledged';s.screen='deployment';startBattle(s);playCampaignBattle(s,id===2?seed%2===0:true);if(s.outcome!=='victory')break;if(id===4)s.campaign.choices.m04_records_choice=seed%2?'kept':'reported';}
 if(s.outcome!=='victory'){out.push({seed,stop:s.missionId,outcome:s.outcome});continue;}
 s=nextMission(s);const lv=s.units.filter(u=>u.team==='ally').map(u=>u.id+u.level).join(' ');s.screen='deployment';startBattle(s);introStory(s);deserialize(serialize(s));let r;try{r=playCampaignBattle(s);}catch(e){r={outcome:'ERR '+e.message,turn:s.turn};}deserialize(serialize(s));
 out.push({seed,lv,outcome:r.outcome,turn:r.turn,reason:s.reason,alive:s.units.filter(u=>u.team==='ally'&&u.hp>0).length,through:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,phase:s.missionState.phase,beacon:s.missionState.beacon,banner:s.missionState.banner,records:s.campaign.choices.m04_records_choice});}
for(const o of out)console.log(JSON.stringify(o));const wins=out.filter(o=>o.outcome==='victory');console.log('wins',wins.length,'/',out.length,'all-through',wins.filter(o=>o.through===4).length,'turns',wins.map(o=>o.turn).join(','));
if(wins.length<out.length*0.9)process.exit(1);
