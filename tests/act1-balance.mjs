// Phase F: full ACT I (M01→M06) legal-policy campaign balance report. Same rules API as the UI, no shopping,
// no state edits; story choices alternate by seed. Writes test-output/act1-balance.{json,md}.
// Usage: node tests/act1-balance.mjs [seeds=30] [firstSeed=20261014]
import fs from 'node:fs';import {newGame,startBattle,nextMission} from '../src/core/game.js';import {playBattle} from './player-policy.mjs';import {playCampaignBattle} from './campaign-policy.mjs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';import {introStory} from '../src/core/narrative.js';import {MISSIONS} from '../src/data/missions.js';
const N=+process.argv[2]||30,first=+process.argv[3]||20261014,runs=[];
const allies=s=>s.units.filter(u=>u.team==='ally'&&!u.benched);
for(let seed=first;seed<first+N;seed++){
 const run={seed,missions:[]};let s=newGame(seed);
 for(let id=1;id<=6;id++){
  if(id>1){s=nextMission(s);if(!s)break;}
  if(id===5)s.campaign.choices.m05_erik_answer=seed%2?'present':'acknowledged';
  const goldBefore=s.campaign.economy.gold,levels=allies(s).map(u=>u.level);s.screen='deployment';startBattle(s);if(id===6)introStory(s);
  let r;try{r=id===1?playBattle(s):playCampaignBattle(s,id===2?seed%2===0:true);}catch(e){r={outcome:'error: '+e.message};}
  deserialize(serialize(s));const m=MISSIONS[id],ms=s.missionState||{};
  const row={id,outcome:s.outcome||r.outcome||'unfinished',turn:s.turn,par:m.par??null,limit:m.turnLimit??null,reason:s.reason||null,
   standing:allies(s).filter(u=>u.hp>0).length,deployed:allies(s).length,avgLevelIn:+(levels.reduce((a,b)=>a+b,0)/levels.length).toFixed(2),
   goldIn:goldBefore,goldOut:s.campaign.economy.gold,
   civilians:s.units.filter(u=>u.team==='civilian').length,rescued:id===5?s.units.filter(u=>u.kind==='wagon'&&u.hp>0).length:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,civLost:s.units.filter(u=>u.team==='civilian'&&u.hp<=0).length,
   captured:id===2?!!s.campaign.flags.mission_02_prisoner_captured:undefined,phase:id===6?ms.phase:undefined,wagons:id===5?s.units.filter(u=>u.kind==='wagon'&&u.hp>0).length:undefined};
  run.missions.push(row);if(s.outcome!=='victory')break;
  if(id===4)s.campaign.choices.m04_records_choice=seed%2?'kept':'reported';
 }
 run.finalLevels=Object.fromEntries((s.campaign.heroes||allies(s)).map(u=>[u.id,u.level]));run.finalGold=s.campaign.economy.gold;run.complete=run.missions.length===6&&run.missions.every(m=>m.outcome==='victory');runs.push(run);
}
const by=id=>runs.map(r=>r.missions.find(m=>m.id===id)).filter(Boolean),pct=(a,b)=>b?Math.round(100*a/b):0,range=a=>a.length?`${Math.min(...a)}–${Math.max(...a)}`:'—',avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):'—';
const table=[1,2,3,4,5,6].map(id=>{const rows=by(id),wins=rows.filter(r=>r.outcome==='victory');return {id,title:MISSIONS[id].title,played:rows.length,wins:wins.length,winRate:pct(wins.length,rows.length),turns:range(wins.map(r=>r.turn)),avgTurn:avg(wins.map(r=>r.turn)),par:MISSIONS[id].par??'—',limit:MISSIONS[id].turnLimit??'—',
 avgStanding:avg(wins.map(r=>r.standing)),deployed:avg(rows.map(r=>r.deployed)),avgLevelIn:avg(rows.map(r=>r.avgLevelIn)),goldIn:avg(rows.map(r=>r.goldIn)),goldOut:avg(wins.map(r=>r.goldOut)),
 rescued:rows[0]?.civilians?`${avg(wins.map(r=>r.rescued))}/${rows[0].civilians}`:'—',losses:rows.filter(r=>r.outcome!=='victory').map(r=>`${r.seed??''}${r.reason||r.outcome}`)};});
for(const t of table)t.losses=by(t.id).filter(r=>r.outcome!=='victory').map(r=>r.reason||r.outcome);
const complete=runs.filter(r=>r.complete).length,heroes=['eric','elina','lia','sain','kai'],done=runs.filter(r=>r.complete);
const md=[`# ACT I balance report (M01→M06, legal policy)`,'',`Executed ${new Date().toISOString().slice(0,16).replace("T"," ")} UTC with \`node tests/act1-balance.mjs ${N} ${first}\` — ${N} seeds, rules API only, no shopping, no state edits.`,'',
 `**Full ACT I clears: ${complete}/${N} (${pct(complete,N)}%)**`,'',
 '| Mission | Played | Wins | Win % | Win turns (avg) | Par / Limit | Heroes standing | Avg level in | Gold in → out | Civilians safe (M05: wagons) |','|---|---|---|---|---|---|---|---|---|---|',
 ...table.map(t=>`| M0${t.id} ${t.title} | ${t.played} | ${t.wins} | ${t.winRate}% | ${t.turns} (${t.avgTurn}) | ${t.par} / ${t.limit} | ${t.avgStanding}/${t.deployed} | ${t.avgLevelIn} | ${t.goldIn} → ${t.goldOut} | ${t.rescued} |`),'',
 '## Losses','',...(table.some(t=>t.losses.length)?table.filter(t=>t.losses.length).map(t=>`- M0${t.id}: ${t.losses.length} — ${[...new Set(t.losses)].join(', ')}`):['- none']),'',
 '## Levels after ACT I (completed runs)','','| Hero | Min | Avg | Max |','|---|---|---|---|',...heroes.map(h=>{const l=done.map(r=>r.finalLevels[h]).filter(Number.isFinite);return `| ${h} | ${l.length?Math.min(...l):'—'} | ${avg(l)} | ${l.length?Math.max(...l):'—'} |`;}),'',
 `Final gold (completed runs): ${range(done.map(r=>r.finalGold))}, avg ${avg(done.map(r=>r.finalGold))}.`,''].join('\n');
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/act1-balance.json',JSON.stringify({seeds:N,first,table,runs},null,1));fs.writeFileSync('test-output/act1-balance.md',md);console.log(md);
if(complete<N*0.9)process.exit(1);
