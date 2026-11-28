// v2.7.0 (D-158, the user's major update of 2026-11-22 22:46): M06 climbs south to north and its refugees walk; 「연속 공격」 is a
// chance from 운 (and 「쌍매듭 팔찌」) shown in the forecast; the request board stands in the square with the county clerk; tavern
// guests in better clothes; dialogue directions that the big maps had turned around. (M06 rules: tests/mission06.test.mjs.)
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,patternNote,performAction} from '../src/core/game.js';
import {findUnit,doubleChance,forecast,DOUBLE_LUCK_CAP,DOUBLE_CAP} from '../src/core/rules.js';
import {refugeeState,refugeeSteps} from '../src/core/mission-rules.js';
import {MISSIONS} from '../src/data/missions.js';import {HUBS,INTERIORS,GEAR} from '../src/data/frontier-data.js';
import {STORY} from '../src/data/story.js';import {TAVERN_PATRONS,TAVERN_DOOR_GUEST} from '../src/data/patrons-v270.js';
import {serialize,deserialize,checksum} from '../src/persistence/save-manager.js';import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {drain} from './campaign-policy.mjs';
const campaign=()=>({heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices:{m04_records_choice:'kept'}});
const m6=()=>{const s=newGame(6006,campaign(),6);s.screen='deployment';startBattle(s);drain(s);return s;};
const endTurn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};

test('v2.7.0 M06: the refugees start south and the gate is north; their state is readable; they pass each other and walk around foes',()=>{
 const s=m6();for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;
 const ally=s.units.filter(u=>u.team==='ally');ally.forEach((u,i)=>{u.x=12+i;u.y=0;});
 const p1=findUnit(s,'p1'),p2=findUnit(s,'p2'),p3=findUnit(s,'p3');
 assert.equal(refugeeState(s,p2),'hurt');assert.equal(refugeeState(s,p1),'wait');
 const eric=findUnit(s,'eric');eric.x=p3.x-1;eric.y=p3.y;assert.equal(refugeeState(s,p3),'follow');assert.ok(refugeeSteps(s,p3)>=13,'about thirteen tiles to the gate');
 // p3 stands right below p1 (9,17 under 9,16): it walks through the older man, never stopping on him
 const o3={x:p3.x,y:p3.y};endTurn(s);assert.ok(p3.y<o3.y&&!(p3.x===p1.x&&p3.y===p1.y),'walked north past p1');
 // an enemy across the road: the refugee takes the free way around or as far as it is free
 const t=m6();for(const u of t.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;const q=findUnit(t,'p1'),e=findUnit(t,'eric');e.x=q.x-1;e.y=q.y;const foe=findUnit(t,'n1');foe.hp=30;foe.x=q.x;foe.y=q.y-1;
 const o={x:q.x,y:q.y};endTurn(t);assert.ok(q.x!==o.x||q.y!==o.y,'it went round');
});
test('v2.7.0 「연속 공격」: a chance from 운 — (own − foe ÷ 2) × 2%, 0–35%, the accessory +15% (at most 50%); no follow-up from 민첩 alone',()=>{
 const s=newGame(3,null,4);s.screen='deployment';startBattle(s);drain(s);const kai=findUnit(s,'kai'),foe=s.units.find(u=>u.team==='enemy'&&u.hp>0);
 kai.stats={...kai.stats,luk:10};foe.stats={...(foe.stats||{}),luk:6};assert.equal(doubleChance(s,kai,foe),14);
 kai.stats.luk=60;assert.equal(doubleChance(s,kai,foe),DOUBLE_LUCK_CAP);kai.stats.luk=1;assert.equal(doubleChance(s,kai,foe),0);
 assert.equal(DOUBLE_LUCK_CAP,35);assert.equal(DOUBLE_CAP,50);
 // the accessory
 assert.equal(GEAR.twinKnot?.slot,'accessory');assert.match(GEAR.twinKnot.description,/연속 공격 \+15%/);assert.deepEqual([GEAR.twinKnot.home,GEAR.twinKnot.after],['velmar',9]);
 s.economy.gear.push({id:'gk',type:'twinKnot',exp:0,star:1});s.economy.equipped.kai.accessory='gk';kai.stats.luk=60;assert.equal(doubleChance(s,kai,foe),50);kai.stats.luk=1;assert.equal(doubleChance(s,kai,foe),15);
 // the forecast shows it; 민첩 far above the foe no longer strikes twice by itself
 kai.x=foe.x-1;kai.y=foe.y;assert.equal(forecast(s,kai,foe,'attack').double,15);
 s.economy.equipped.kai.accessory=null;kai.stats.luk=1;kai.spd=99;let doubled=0;for(let i=0;i<20;i++){const t=structuredClone(s);t.rng=(t.rng+i*977)>>>0;const k=findUnit(t,'kai'),f=t.units.find(u=>u.id===foe.id);k.acted=false;k.moved=true;f.hp=9999;f.maxHP=9999;t.feedback=[];
  const before=t.log.length;performAction(t,'kai','attack',f.id);if(t.log.slice(before).some(l=>l.includes('연속 공격')))doubled++;}
 assert.equal(doubled,0,'no 연속 공격 at 0%');
});
test('v2.7.0: the tier attack is named in the forecast (「2연 베기 ×2」 · 「쌍단검 ×2」 · 「2연사 ×2」); tier 1 has none',()=>{
 const s=newGame(3,null,4);const at=(id,tier)=>{const u=findUnit(s,id);u.classTier=tier;return patternNote(u);};
 assert.equal(at('eric',1),'');assert.equal(at('eric',2),'2연 베기 ×2');assert.equal(at('kai',2),'쌍단검 ×2');assert.equal(at('elina',2),'2연사 ×2');
});
test('v2.7.0: the request board stands in each small village square with the county clerk; tavern guests in better clothes',()=>{
 for(const v of ['reed','stonewell','frost','saltport','lamp','moss','beacon','lionspring']){const h=HUBS[v];assert.deepEqual(h.props,[{type:'board',x:14,y:7}],v);assert.equal(h.mask[7][14],'#',`${v} board is solid`);
  const clerk=h.npcs.find(n=>n.service==='requests');assert.deepEqual([clerk.x,clerk.y,clerk.look],[15,7,'clerk'],v);assert.match(clerk.name,/관청 서기/);
  const g=h.npcs.find(n=>n.id===TAVERN_DOOR_GUEST.id);assert.ok(g&&g.look,v);}
 const t=INTERIORS.tavern.npcs;assert.ok(t.some(n=>n.id==='tavernkeeper'));for(const p of TAVERN_PATRONS){assert.ok(t.some(n=>n.id===p.id&&n.look===p.look),p.id);assert.ok(STORY[`patron:${p.id}:0`]?.length,p.id);}
 assert.ok(STORY[`patron:${TAVERN_DOOR_GUEST.id}:1`]?.length);
});
test('v2.7.0: dialogue directions match the big maps (M02, M03, M05, M16, M19)',()=>{
 const said=k=>STORY[k].map(l=>l.text).join(' ');
 assert.match(said('2:turn2'),/동쪽 출구/);assert.match(said('3:intro'),/북서쪽 출구/);assert.match(said('5:reinforce'),/남동쪽/);
 assert.match(said('16:reinforce'),/북쪽이랑 남쪽/);assert.match(said('19:reinforce'),/남쪽 통로/);
 assert.match(said('6:pursuers'),/남쪽/);const pur=MISSIONS[6].waves.find(w=>w.story==='6:pursuers');assert.ok(pur.units.every(u=>u.y>=20),'the pursuers come from the south');
 const gar=MISSIONS[6].waves.find(w=>w.story==='6:garrison');assert.ok(gar.units.every(u=>u.y<4),'the garrison beyond the north gate');
});
test('v2.7.0 saves: schema 28; an M06 battle of v2.6.1 reopens in its camp on the new map',()=>{
 assert.equal(SCHEMA,28);assert.equal(VERSION,'2.8.0');
 const s=m6();const old=JSON.parse(JSON.stringify(s));old.schema=27;old.version='2.6.1';delete old.stageStart;const data=JSON.stringify(old);
 const back=deserialize(JSON.stringify({format:'AshenCrown',data,checksum:checksum(data)}));assert.equal(back.schema,28);assert.equal(back.missionId,6);assert.notEqual(back.screen,'battle');
 const round=deserialize(serialize(m6()));assert.equal(round.schema,28);
});
