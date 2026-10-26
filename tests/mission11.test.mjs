// v0.7.0 — M11 The Flame Procession: four pilgrims walk the night road to the sanctuary, three roadside braziers light
// it (search), light changes hit chances and lets pilgrims walk two tiles; Ines's Sanctuary; the Sacred Flame's trust.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {HUBS} from '../src/data/frontier-data.js';
import {hubFor} from '../src/data/hubs-v05.js';
import {newGame,startBattle,nextMission,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,distance,validTarget,litAt,strikeStats,sanctuaryCut} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseOath} from '../src/core/mission-rules-v070.js';
import {metFactions} from '../src/core/factions.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:10,completed:[1,2,3,4,5,6,7,8,9,10],flags:{act1_completed:true,act2_free_met:true},choices:{m06_oath:'people',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate'},factionTrust:{iron:1,free:2,flame:0},roster:[],...extra});
const battle=(extra)=>{const s=newGame(41,camp(extra),11);s.screen='deployment';startBattle(s);drain(s);return s;};
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=s=>(st,o,r)=>{st.outcome=o;st.reason=r;};
const clearEnemies=s=>{for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;};

test('M11 data: 18×14 night valley, six-hero sortie, level 10, four pilgrims on the road, three braziers, Ines and two flame knights',()=>{
 const m=MISSIONS[11];assert.deepEqual([m.width,m.height],[18,14]);assert.ok(m.map.every(r=>r.length===18));assert.equal(m.deployLimit,6);assert.equal(m.level,10);
 assert.equal(m.civilians.length,4);assert.ok(m.civilians.every(c=>c.look==='pilgrim'&&m.map[c.y][c.x]==='r'));assert.deepEqual(m.allies.map(a=>a.look),['ines','flameKnight','flameKnight']);
 assert.deepEqual(m.objects.map(o=>o.kind),['brazier','brazier','brazier']);assert.equal(m.night.radius,2);assert.ok(m.escortOnly,'pilgrims walk; no instant rescue');
 assert.ok(m.map[0].includes('z')&&m.map[1].includes('z'),'sanctuary floor at the top');
 const zone=m.deployZone();for(const p of [...m.deployments.recommended,...m.deployments.assault,...m.deployments.defense])assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['11:intro','11:turn2','11:lit','11:arrive','11:lost','11:wave','11:flank','11:captain','11:encounter','11:boss','11:end','pre:11','after:11','after:11:sain','after:11:oath','after:11:legion','world:pilgrim','npc:11:preparation:advisor','npc:11:aftermath:advisor','npc:11:preparation:ines','npc:11:preparation:thea','npc:11:aftermath:dario'])assert.ok(STORY[k]?.length,k);
 assert.equal(STORY['world:pilgrim'].at(-1).world.card.region,'성화령');
});

test('M10 → M11: the legion goes south to the pilgrim village; recruits stand there only when they joined',()=>{
 assert.equal(hubFor(11,'preparation'),'pilgrim');assert.equal(hubFor(11,'aftermath'),'pilgrim');assert.equal(hubFor(12,'preparation'),'pilgrim');assert.equal(hubFor(12,'aftermath'),'refuge');
 const s=newGame(5,camp({roster:['thea']}),11);enterHub(s,{story:false});const ids=currentHub(s).npcs.map(n=>n.id);assert.ok(ids.includes('ines')&&ids.includes('thea')&&!ids.includes('dario'),ids.join());
 assert.ok(HUBS.pilgrim.dusk,'temporary painting tinted to dusk until art pack D');assert.deepEqual(metFactions(s.campaign).includes('flame'),false);
});

test('light: sanctuary tiles are lit, the road is dark until a brazier burns; a lit brazier lights radius 2',()=>{
 const s=battle(),m=MISSIONS[11];assert.ok(litAt(s,8,1)&&litAt(s,8,3));assert.ok(!litAt(s,8,9)&&!litAt(s,8,4));
 const br=findUnit(s,'br1'),kai=findUnit(s,'kai');kai.x=br.x;kai.y=br.y+1;assert.ok(validTarget(s,kai,br,'search'));assert.ok(performAction(s,'kai','search','br1').ok);drain(s);
 assert.ok(br.lit&&br.inert&&alive(br),'a lit brazier stays on the map');assert.deepEqual(s.missionState.lit,['br1']);assert.ok(!validTarget(s,findUnit(s,'elina'),br,'search'));
 assert.ok(litAt(s,8,10)&&litAt(s,8,9)&&litAt(s,7,12)&&!litAt(s,8,13),'Manhattan radius 2 around (7,10)');
});

test('light: a legion attacker in light aims +10; any target outside the light is −15 (floor 40)',()=>{
 const s=battle(),e=findUnit(s,'r1'),eric=findUnit(s,'eric');eric.x=e.x+1;eric.y=e.y;const night=MISSIONS[11].night;
 MISSIONS[11].night=null;const base=strikeStats(s,eric,e).hit,back=strikeStats(s,e,eric).hit;MISSIONS[11].night=night;
 assert.ok(!litAt(s,eric.x,eric.y)&&!litAt(s,e.x,e.y));assert.equal(strikeStats(s,eric,e).hit,Math.max(40,base-15));assert.equal(strikeStats(s,e,eric).hit,Math.max(40,back-15));
 s.units.push({...findUnit(s,'br1'),id:'brX',x:eric.x,y:eric.y+1,lit:true});assert.ok(litAt(s,eric.x,eric.y)&&litAt(s,e.x,e.y));
 assert.equal(strikeStats(s,eric,e).hit,Math.min(100,base+10),'legion attacker in light, target lit');assert.equal(strikeStats(s,e,eric).hit,back,'enemies get no light bonus');
});

test('march: from TURN 2 pilgrims walk the road — 1 tile in the dark, 2 in light, none with an enemy beside them, a hero blocks',()=>{
 let s=battle();clearEnemies(s);const p1=findUnit(s,'p1');turn(s);assert.equal(s.turn,2);assert.deepEqual([p1.x,p1.y],[8,9],'dark: one tile');
 s=battle();clearEnemies(s);findUnit(s,'br1').lit=true;const q=findUnit(s,'p1');turn(s);assert.deepEqual([q.x,q.y],[8,8],'light: two tiles');
 s=battle();clearEnemies(s);const r=findUnit(s,'p1'),raider=findUnit(s,'r1');raider.hp=30;raider.x=9;raider.y=10;raider.mov=0;raider.atk=0;turn(s);assert.deepEqual([r.x,r.y],[8,10],'an enemy beside: stop');
 s=battle();clearEnemies(s);const w=findUnit(s,'p1'),eric=findUnit(s,'eric');eric.x=8;eric.y=9;turn(s);assert.deepEqual([w.x,w.y],[8,10],'a hero on the road blocks it');
});

test('pilgrims in light heal 5 at the start of the player phase; braziers stay lit; the sanctuary takes them in',()=>{
 const s=battle();clearEnemies(s);const p=findUnit(s,'p2');p.hp=10;findUnit(s,'br1').lit=true;turn(s);assert.equal(p.hp,15);
 const a=findUnit(s,'p1');a.x=8;a.y=2;turn(s);assert.ok(a.rescued,'reached the sanctuary row');assert.ok(s.log.some(l=>l.includes('성소에 들어섰습니다')));
});

test('M11 outcome: three pilgrims in the sanctuary win; two lost lose; dawn (after TURN 12) wins; rescue is not an action here',()=>{
 let s=battle();const [a,b,c,d]=['p1','p2','p3','p4'].map(id=>findUnit(s,id));const eric=findUnit(s,'eric');eric.x=a.x+1;eric.y=a.y;assert.ok(!validTarget(s,eric,a,'rescue'));
 a.rescued=b.rescued=true;rulesOf(s).checkOutcome(s,finish(s));assert.ok(!s.outcome,'two are not enough');c.rescued=true;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'victory');
 s=battle();findUnit(s,'p1').hp=0;findUnit(s,'p2').hp=0;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'defeat');
 s=battle();s.turn=13;findUnit(s,'p1').hp=0;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'victory');assert.match(s.reason,/새벽/);
});

test('Sanctuary: legion units beside Ines (the escort or the recruit) take 2 less, 4 after her oath (her too)',()=>{
 const s=battle(),ines=findUnit(s,'ines_warden'),fk=findUnit(s,'fk1'),e=findUnit(s,'r1');fk.x=ines.x+1;fk.y=ines.y;e.x=fk.x+1;e.y=fk.y;
 assert.equal(sanctuaryCut(s,fk),2);assert.equal(sanctuaryCut(s,ines),0);assert.equal(sanctuaryCut(s,e),0,'enemies are not covered');
 const MISS=MISSIONS[11].night;MISSIONS[11].night=null;const near=strikeStats(s,e,fk).damage;fk.x=ines.x+4;fk.y=ines.y-2;e.x=fk.x+1;e.y=fk.y;const far=strikeStats(s,e,fk).damage;MISSIONS[11].night=MISS;assert.equal(far-near,2);
 const t=newGame(9,camp({roster:['ines'],completed:[1,2,3,4,5,6,7,8,9,10,11,12]}),12);t.screen='deployment';startBattle(t);drain(t);const i2=findUnit(t,'ines'),k=findUnit(t,'kai');k.x=i2.x+1;k.y=i2.y;
 assert.equal(sanctuaryCut(t,k),2);i2.sanctuary=true;assert.equal(sanctuaryCut(t,k),4);assert.equal(sanctuaryCut(t,i2),2);
});

test('M11 victory: the Order is met; every pilgrim through raises its trust; Lucien\'s offer (oath +1) is chosen once in the camp',()=>{
 const s=battle();for(const id of ['p1','p2','p3','p4'])findUnit(s,id).rescued=true;clearEnemies(s);rulesOf(s).checkOutcome(s,(st,o,r)=>{st.outcome=o;st.reason=r;});
 rulesOf(s).beforeCommit(s);rulesOf(s).afterVictory(s);assert.ok(s.campaign.flags.act2_flame_met);assert.equal(s.campaign.factionTrust.flame,1);assert.equal(s.campaign.flags.mission_11_arrived,4);
 assert.ok(metFactions(s.campaign).includes('flame'));assert.ok(chooseOath(s,'oath'));assert.equal(s.campaign.factionTrust.flame,2);assert.ok(!chooseOath(s,'legion'),'once only');
 const t=battle();assert.ok(chooseOath(t,'legion'));assert.equal(t.campaign.factionTrust.flame,0);assert.ok(!chooseOath(t,'bogus'));
});

test('M11 saves round-trip mid battle with lit braziers and walking pilgrims',()=>{
 const s=battle();findUnit(s,'br2').lit=true;findUnit(s,'br2').inert=true;s.missionState.lit.push('br2');turn(s);const back=deserialize(serialize(s));
 assert.deepEqual(back.missionState,s.missionState);assert.ok(findUnit(back,'br2').lit);assert.deepEqual(['p1','p2'].map(id=>[findUnit(back,id).x,findUnit(back,id).y]),['p1','p2'].map(id=>[findUnit(s,id).x,findUnit(s,id).y]));
 const bad=structuredClone(s);bad.missionState.lit=['br9'];assert.throws(()=>deserialize(serialize(bad)));
});
