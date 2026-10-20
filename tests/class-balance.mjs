// v0.5.0 Phase E balance: each promotion trial over 30 seeds with the legal skirmish policy, with and
// without the class action (the action should matter), plus Legion Drills from Lv 4 to Lv 6.
// Usage: node tests/class-balance.mjs [seeds=30]
import fs from 'node:fs';import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startSkirmish,returnToCamp} from '../src/core/skirmish.js';import {classTierOf} from '../src/core/progression.js';
import {actOneCamp,playSkirmish} from './skirmish-policy.mjs';
const N=+process.argv[2]||30,heroes=(process.argv[3]||'eric,elina,lia,sain,kai').split(','),out={trials:{},drill:{}};
for(const hero of heroes){const row={wins:0,winsNoAction:0,turns:[],reasons:{},promoted:0,errors:[]};
 for(let i=0;i<N;i++){for(const classActions of [true,false]){try{const camp=actOneCamp(20261019+i,6),s=startSkirmish(camp,'trial',hero,{force:true});deserialize(serialize(s));const r=playSkirmish(s,{classActions});deserialize(serialize(s));
   if(classActions){if(r.outcome==='victory'){row.wins++;row.turns.push(r.turn);const back=returnToCamp(s);if(classTierOf(back.campaign.heroes.find(h=>h.id===hero))===2)row.promoted++;}else row.reasons[r.reason]=(row.reasons[r.reason]||0)+1;}
   else if(r.outcome==='victory')row.winsNoAction++;}catch(e){row.errors.push(e.message);}}}
 out.trials[hero]=row;console.log(`trial ${hero}: ${row.wins}/${N} wins (without the action ${row.winsNoAction}/${N}), promoted ${row.promoted}, turns ${row.turns.length?Math.min(...row.turns)+'–'+Math.max(...row.turns):'—'}${Object.keys(row.reasons).length?' · losses '+JSON.stringify(row.reasons):''}${row.errors.length?' · ERRORS '+row.errors.slice(0,2).join(' | '):''}`);}
if(process.argv[4]==='nodrill'){console.log('drill skipped');process.exit(0);}
// Drills: from Lv 4 everywhere, how many drills until every hero is Lv 6 (cap 10 drills).
const drills=[];for(let i=0;i<N;i++){let camp=actOneCamp(20261119+i,4),n=0,wins=0;for(;n<10&&camp.campaign.heroes.some(h=>h.level<6);n++){const s=startSkirmish(camp,'drill',null,{force:true});const r=playSkirmish(s);if(r.outcome==='victory')wins++;camp=returnToCamp(s);}drills.push({drills:n,wins,levels:camp.campaign.heroes.map(h=>h.level)});}
out.drill={runs:drills};const ds=drills.map(d=>d.drills);console.log(`drill: Lv 4 → 6 for all five in ${Math.min(...ds)}–${Math.max(...ds)} drills (avg ${(ds.reduce((a,b)=>a+b,0)/ds.length).toFixed(1)}), drill wins ${drills.reduce((a,d)=>a+d.wins,0)}/${ds.reduce((a,b)=>a+b,0)}`);
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/class-balance.json',JSON.stringify(out,null,1));
const failing=heroes.filter(h=>out.trials[h].wins<N*0.9||out.trials[h].errors.length);if(failing.length){console.log('below 90% or errors:',failing.join(', '));process.exit(1);}
