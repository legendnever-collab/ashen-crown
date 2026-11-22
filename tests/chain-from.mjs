// v2.5.1 (the user's request 2026-11-21 19:02: test only the new maps, not from M01 every time): plays the end of the
// campaign from the camps act2-balance saved before a mission (ASHEN_DUMP=<id> → test-output/camps/m<id>-*.json) instead of
// from M01. Each camp goes on to M30 with the same policy, choices and retries as act2-balance (three tries a battle, the
// first try counted). The full chain from M01 still runs once a version, before packaging.
// Usage: node tests/chain-from.mjs <from mission> [tries per camp]   (ASHEN_DIFFICULTY=hard plays the camps on 어려움)
import fs from 'node:fs';
import {startBattle,nextMission} from '../src/core/game.js';
import {playCampaignBattle} from './campaign-policy.mjs';
import {deserialize,serialize} from '../src/persistence/save-manager.js';
import {chooseLead23} from '../src/core/mission-rules-v0100.js';
import {chooseBanner25} from '../src/core/mission-rules-v0101.js';
import {chooseConfession28} from '../src/core/mission-rules-v0102.js';
import {chooseFate29} from '../src/core/mission-rules-v100.js';
import {openEndings,chooseEnding} from '../src/core/ending.js';
import {MISSIONS} from '../src/data/missions.js';
import {HARD_SHARE,BASE_MUL_AT} from '../src/core/stats8.js';
const FROM=+process.argv[2]||27,TRIES=+process.argv[3]||1,HARD=process.env.ASHEN_DIFFICULTY==='hard';
const files=fs.readdirSync('test-output/camps').filter(f=>f.startsWith(`m${FROM}-`)).sort();
if(!files.length){console.error(`no camps before M${FROM}: run ASHEN_DUMP=${FROM} node tests/act2-balance.mjs first`);process.exit(2);}
// ASHEN_TUNE='<js>' changes MISSIONS, HARD_SHARE or BASE_MUL_AT before the run (for tuning; never used by the gate)
if(process.env.ASHEN_TUNE)new Function('MISSIONS','HARD_SHARE','BASE_MUL_AT',process.env.ASHEN_TUNE)(MISSIONS,HARD_SHARE,BASE_MUL_AT);
const FIRST={},runs=[];
// after a won mission: the same choices act2-balance makes (alternated by the campaign's index)
const AFTER={23:(s,k)=>chooseLead23(s,k%2?'legion':'banners'),25:(s,k)=>chooseBanner25(s,k%2?'forgive':'lower'),28:(s,k)=>chooseConfession28(s,k%2?'all':'eric'),
 29:(s,k)=>chooseFate29(s,s.missionState.words?'offer':k%2?'trial':'exile')};
// v2.6.0: ASHEN_DUMP=<ids> saves the camps before those missions here too (to a separate folder, so the inputs are kept)
const DUMP=new Set((process.env.ASHEN_DUMP||'').split(',').filter(Boolean).map(Number));
function fightCamp(camp){if(DUMP.has(camp.missionId)&&camp.missionId!==FROM){fs.mkdirSync('test-output/camps-next',{recursive:true});fs.writeFileSync(`test-output/camps-next/m${camp.missionId}-${camp.initialSeed}-${k}.json`,serialize(camp));}let s;for(let t=0;t<3;t++){s=structuredClone(camp);s.rng=s.initialSeed=(s.rng+t*7919)>>>0;s.screen='deployment';startBattle(s);
  try{playCampaignBattle(s);}catch(e){s.outcome='error';s.reason=e.message;}
  if(t===0){const r=FIRST[s.missionId]??={w:0,n:0};r.n++;if(s.outcome==='victory')r.w++;}if(s.outcome==='victory')break;}return s;}
let k=0;
for(const f of files)for(let t=0;t<TRIES;t++,k++){
 let camp=deserialize(fs.readFileSync(`test-output/camps/${f}`,'utf8'));if(HARD)camp.campaign.difficulty='hard';camp.rng=(camp.rng+t*104729)>>>0;
 const r={camp:f,try:t};let s=fightCamp(camp);
 while(true){r[`m${s.missionId}`]=s.outcome;r[`t${s.missionId}`]=s.turn;if(s.outcome!=='victory'){r.why=s.reason;break;}
  AFTER[s.missionId]?.(s,k);if(s.missionId>=30){const open=openEndings(s.campaign);r.ending=open[k%open.length];chooseEnding(s,r.ending,new Date('2026-11-21'));deserialize(serialize(s));break;}
  s=fightCamp(nextMission(s));}
 runs.push(r);}
for(const r of runs)console.log(JSON.stringify(r));
const rates=Object.entries(FIRST).sort((a,b)=>a[0]-b[0]).map(([m,r])=>`M${m} ${r.w}/${r.n}`);
console.log(JSON.stringify({from:FROM,difficulty:HARD?'hard':'normal',camps:files.length,tries:TRIES,rates}));
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync(`test-output/chain-from-${FROM}${HARD?'-hard':''}.json`,JSON.stringify({rates,runs},null,1));
