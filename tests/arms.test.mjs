// v0.8.1 「무기」 (D-073 §6): gear stars and 단련, town shelves (specialty, premium, elite, Velmar's rare-goods shelf),
// town revisits, treasures, hidden objectives, supply carriers, cut-ins and schema 11 saves.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction,beginEnemyPhase,advanceEnemy,checkOutcome,restartStage} from '../src/core/game.js';
import {findUnit,alive,strikeStats,rangeFor,awardXP,distance} from '../src/core/rules.js';
import {transact,effectiveStats,equipmentBonus,initialEconomy} from '../src/core/economy.js';
import {gearBonus,starFor,temperCost,shelfState,shopGear,rareShelf,featOf,gainGearExp} from '../src/core/arms.js';
import {statusChance} from '../src/core/status.js';
import {enterHub,revisitTowns,travelTo,returnFromTown,currentHub,openCouncil,interactNPC} from '../src/core/frontier.js';
import {GEAR,TOOLS} from '../src/data/frontier-data.js';
import {CATALOG_GEAR,CATALOG_TREASURES} from '../src/data/catalog-v08.js';
import {FEATS,SUPPLY,TOWNS} from '../src/data/arms-v081.js';
import {STORY} from '../src/data/story.js';
import {MISSIONS} from '../src/data/missions.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA} from '../src/data/game-data.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
const upTo=n=>Array.from({length:n},(_,i)=>i+1);
const tx=(s,op,id,hero,slot)=>transact(s,{op,id,hero,slot,token:`tx:${s.economy.nonce}`});
// A camp at a story moment: missions 1…done cleared, standing in the hub of mission `at`.
function hubAt(at,done=at-1,extra={}){const s=newGame(5,camp({completed:upTo(done),...extra}),at);if(done>=at)s.practice=false;enterHub(s,{aftermath:done>=at,story:false});drain(s);s.economy.gold=5000;return s;}
// A quiet M01 board with every enemy down but the ones a test wakes.
function board(level=6){const s=newGame(11,camp({completed:[]}),1);s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='ally'))u.level=level;for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;return s;}
const wake=(s,id,x,y,more={})=>{const e=findUnit(s,id);Object.assign(e,{hp:e.maxHP,x,y,...more});return e;};
const place=(u,x,y)=>{u.x=x;u.y=y;u.moved=false;u.acted=false;};
const own=(s,type,hero)=>{const g={id:`g${s.economy.next++}`,type,star:1,exp:0};s.economy.gear.push(g);if(hero)s.economy.equipped[hero][GEAR[type].slot]=g.id;return g;};

test('the gear table: 11 tier I, 24 tier II, 14 tier III and 18 treasures (v0.9.0 adds six from the capital and two ACT III treasures; v0.9.1 two more; v0.9.2 two more; v0.9.3 a lance for Thea and a mace for Ines), named as in the catalog; every new piece has a town',()=>{
 assert.equal(Object.keys(GEAR).length,67);for(const c of [...CATALOG_GEAR,...CATALOG_TREASURES])assert.equal(GEAR[c.id].name,c.ko,c.id);
 for(const c of CATALOG_GEAR.filter(c=>c.tier>1)){const g=GEAR[c.id];assert.ok(['castletown','velmar','pilgrim','capital'].includes(g.home),c.id);assert.ok(g.after||g.premium||g.trust,c.id);assert.equal(g.price,c.price);}
 for(const c of CATALOG_TREASURES)assert.equal(GEAR[c.id].slot,'treasure');
 const rewards=Object.values(FEATS).map(f=>f.reward);assert.deepEqual(rewards.filter(r=>r!=='elixir').sort(),CATALOG_TREASURES.map(c=>c.id).sort(),'one treasure per hidden objective');assert.equal(rewards.filter(r=>r==='elixir').length,2);
});

test('stars: ★2 of a tier I piece is exactly the old +1 upgrade; 단련 costs 40 then 70 and scales with EXP already earned',()=>{
 for(const id of ['ironBlade','longbow','heavyShield','trailBoots'])assert.deepEqual(gearBonus({type:id,star:2,exp:30}),Object.fromEntries(Object.entries({...GEAR[id].bonus}).concat([]).map(([k,v])=>[k,v+(GEAR[id].upgrade[k]||0)]).concat(Object.entries(GEAR[id].upgrade).filter(([k])=>!(k in GEAR[id].bonus)))));
 assert.equal(starFor('ironBlade',29),1);assert.equal(starFor('ironBlade',30),2);assert.equal(starFor('ironBlade',80),3);assert.equal(starFor('herbPouch',240),5);
 assert.equal(temperCost({type:'ironBlade',star:1,exp:0}),40);assert.equal(temperCost({type:'ironBlade',star:1,exp:15}),20);assert.equal(temperCost({type:'ironBlade',star:2,exp:30}),70);assert.equal(temperCost({type:'ironBlade',star:3,exp:80}),null);
 assert.equal(temperCost({type:'steelGreatsword',star:1,exp:0}),80);assert.equal(temperCost({type:'herbPouch',star:1,exp:0}),null,'treasures grow by use only');
});

test('Ironhold castle town: tier I everywhere; weapons after M07, armor after M08, the premium blade from the first visit, elite at Iron Crown trust 2',()=>{
 let s=hubAt(7);assert.equal(s.frontier.hub,'castletown');
 assert.equal(shelfState(s,'ironBlade').state,'sale');assert.equal(shelfState(s,'steelGreatsword').state,'locked');assert.equal(shelfState(s,'runeforgedBlade').state,'sale');assert.equal(shelfState(s,'crownGuardLance').state,'locked');assert.equal(shelfState(s,'twinSabers').state,'elsewhere');
 assert.equal(tx(s,'buy-gear','steelGreatsword','eric').ok,false);assert.ok(tx(s,'buy-gear','runeforgedBlade','eric').ok);
 s=hubAt(7,7);assert.equal(s.frontier.hub,'castletown');assert.equal(shelfState(s,'steelGreatsword').state,'sale');assert.equal(shelfState(s,'plateCuirass').state,'locked');assert.ok(tx(s,'buy-gear','steelGreatsword','eric').ok);
 s=hubAt(8);s.campaign.factionTrust={iron:2,free:0,flame:0};assert.equal(shelfState(s,'crownGuardShield').state,'sale');assert.ok(tx(s,'buy-gear','crownGuardShield','eric').ok);
 const velmar=hubAt(9);assert.equal(velmar.frontier.hub,'velmar');assert.equal(tx(velmar,'buy-gear','runeforgedBlade','eric').ok,false,'castle-town goods are not sold in Velmar');
 const listed=shopGear(hubAt(7)).map(r=>r.id);assert.ok(listed.includes('plateCuirass')&&listed.includes('ironBlade')&&!listed.includes('emberRod'),'locked town goods are shown, other towns are not');
});

test("Velmar's rare-goods shelf: one specialty of another town at +25%, bought once, turned by the next clear",()=>{
 const s=hubAt(9),r=rareShelf(s);assert.ok(r&&GEAR[r.id].home!=='velmar'&&!GEAR[r.id].premium);assert.equal(r.price,Math.ceil(GEAR[r.id].price*1.25/5)*5);
 const hero=GEAR[r.id].heroes.find(h=>['eric','elina','lia','sain','kai'].includes(h));const gold=s.economy.gold;assert.ok(tx(s,'buy-rare',r.id,hero).ok);assert.equal(s.economy.gold,gold-r.price);assert.ok(rareShelf(s).sold);assert.equal(tx(s,'buy-rare',r.id,hero).ok,false,'once per turn');
 const later=hubAt(10);assert.notEqual(rareShelf(later).id,r.id);assert.equal(rareShelf(hubAt(7)),null,'only in Velmar');
});

test('revisiting a town: from the M09 camp to Ironhold and back; heroes stay in camp, no council there, the save keeps the visit',()=>{
 const s=hubAt(9,8);assert.deepEqual(revisitTowns(s).map(t=>t.hub),['village_raid','castletown']);assert.ok(!travelTo(s,'velmar'),'not the camp itself');
 assert.ok(travelTo(s,'castletown'));assert.equal(s.frontier.hub,'castletown');assert.equal(s.frontier.revisit,'velmar');
 const h=currentHub(s);assert.ok(!h.npcs.some(n=>['aren','lia','advisor','eric','thea'].includes(n.id)));assert.ok(h.npcs.some(n=>n.id==='elder'));assert.ok(!h.places.some(p=>p.action==='enter'),'no generic rooms (no chests) on a revisit');
 assert.ok(!openCouncil(s));assert.equal(shelfState(s,'plateCuirass').state,'sale','armor unlocked by M08, bought on the way back');assert.ok(tx(s,'buy-gear','plateCuirass','eric').ok);
 const e=h.npcs.find(n=>n.id==='elder');s.frontier.x=e.x;s.frontier.y=e.y+1;assert.ok(interactNPC(s,'elder'));assert.ok(s.narrative.active?.key.startsWith('revisit:castletown')||s.narrative.queue.some(k=>k.startsWith('revisit:castletown')));drain(s);
 const again=deserialize(serialize(s));assert.equal(again.frontier.hub,'castletown');assert.equal(again.frontier.revisit,'velmar');
 assert.ok(returnFromTown(s));assert.equal(s.frontier.hub,'velmar');assert.equal(s.frontier.revisit,undefined);
 assert.ok(travelTo(s,'village_raid'));enterHub(s,{story:false});assert.equal(s.frontier.hub,'velmar','the next story step brings the legion back');
 for(const t of TOWNS)for(const id of ['elder','refugee','guard'])assert.ok(STORY[`revisit:${t.hub}:${id}`],`${t.hub} ${id}`);
});

test('gear grows in battle: strikes for the weapon, blows for the armor; the stars reach the campaign only on a victory',()=>{
 const s=board(),eric=findUnit(s,'eric'),blade=own(s,'ironBlade','eric'),shield=own(s,'heavyShield','eric');place(eric,5,6);
 for(let i=0;i<20;i++){gainGearExp(s,eric,'strike');}assert.equal(blade.star,2);assert.ok(s.feedback.some(f=>f.type==='gear'&&f.text.includes('★2')));gainGearExp(s,eric,'hit');assert.equal(shield.exp,2);
 assert.ok(effectiveStats(s,eric).atk>=eric.atk+3,'★2 = ATK +2 +1');
 const r=restartStage(s);assert.equal(r.economy.gear.length,0,'the stage start knows nothing of it');
 const p=board();p.practice=true;const pb=own(p,'ironBlade','eric');gainGearExp(p,findUnit(p,'eric'),'strike');assert.equal(pb.exp,0,'no growth in practice');
});

test('treasures in battle: Twin Daggers strike again, Shield of Silence stops counters, Herb Pouch heals once, Mirror Cuirass halves arrows',()=>{
 let s,eric,e,seen=0;for(let seed=1;seed<60&&seen<3;seed++){s=board();s.rng=seed*2654435761>>>0;eric=findUnit(s,'eric');place(eric,5,6);e=wake(s,'b1',5,5,{hp:200,maxHP:200});own(s,'twinDaggers','eric');
  performAction(s,'eric','attack','b1');const counter=s.feedback.findIndex(f=>f.type==='attack'&&f.id==='b1'),landed=counter>=0&&['hit','critical'].includes(s.feedback[counter+1]?.type);if(!landed)continue;seen++;assert.equal(s.feedback.filter(f=>f.type==='attack'&&f.id==='eric').length,2,'struck back, Erik strikes once more');}
 assert.ok(seen>=3,'counters that landed were seen');
 s=board();eric=findUnit(s,'eric');place(eric,5,6);e=wake(s,'b1',5,5,{hp:200,maxHP:200});own(s,'silenceShield','eric');performAction(s,'eric','attack','b1');assert.ok(!s.feedback.some(f=>f.type==='attack'&&f.id==='b1'),'no counter');
 let healed=0;for(let seed=1;seed<40&&!healed;seed++){s=board();s.rng=seed*40503>>>0;const lia=findUnit(s,'lia');place(lia,5,6);own(s,'herbPouch','lia');e=wake(s,'b1',5,5,{atk:lia.def+Math.ceil(lia.maxHP*.6)});
  beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}if(lia.pouchUsed){healed++;assert.ok(s.log.some(l=>l.includes('약초 주머니')));assert.ok(lia.hp>0);}}
 assert.ok(healed,'the pouch fired');
 s=board();eric=findUnit(s,'eric');place(eric,5,6);const a=wake(s,'a1',5,3);const plain=strikeStats(s,a,eric).damage;own(s,'mirrorCuirass','eric');assert.equal(strikeStats(s,a,eric).damage,Math.max(1,Math.round(plain/2)));
});

test('treasures: Hawk Feather +1 bow range, Sage Notebook +20% EXP, Charm of Clarity blocks statuses, Lion Epaulette, Alliance Seal, Wind Horseshoe, Reliquary and Mana Ring',()=>{
 const s=board(),elina=findUnit(s,'elina'),lia=findUnit(s,'lia'),eric=findUnit(s,'eric'),sain=findUnit(s,'sain');const r0=rangeFor(elina,'attack',s)[1];own(s,'hawkFeather','elina');assert.equal(rangeFor(elina,'attack',s)[1],r0+1);
 own(s,'sageNotebook','lia');const xp=lia.xp;awardXP(s,lia,10,'test');assert.equal(lia.xp-xp,12);
 own(s,'clearCharm','eric');assert.equal(statusChance(s,eric,'poison',100),0);assert.ok(statusChance(s,lia,'poison',100)>0);
 place(sain,1,1);place(eric,1,2);const def=effectiveStats(s,sain).def;own(s,'lionEpaulette','eric');assert.equal(effectiveStats(s,sain).def,def+1);
 const mov=effectiveStats(s,lia).mov;own(s,'allianceSeal','sain');assert.equal(effectiveStats(s,lia).mov,mov+1,'turn 1');s.turn=2;assert.equal(effectiveStats(s,lia).mov,mov);
 const kai=findUnit(s,'kai'),km=effectiveStats(s,kai).mov;own(s,'windHorseshoe','kai');assert.equal(effectiveStats(s,kai).mov,km+2);
 const t=board(),l2=findUnit(t,'lia');own(t,'flameReliquary','lia');own(t,'manaRing','sain');l2.hp-=10;findUnit(t,'sain').mp-=4;beginEnemyPhase(t);while(t.phase==='enemy'){advanceEnemy(t);drain(t);}assert.equal(l2.hp,l2.maxHP-5);assert.equal(findUnit(t,'sain').mp,findUnit(t,'sain').maxMP-2);
});

test('regional gear effects: Lucky Coin crits, Iron Tower Shield, Pilgrim Mantle, Chrism Charm, Knight Lance, Sacred Flame Staff',()=>{
 const s=board(),eric=findUnit(s,'eric'),a=wake(s,'a1',5,3),b=wake(s,'b1',6,5);place(eric,5,5);
 const c0=strikeStats(s,eric,b).crit;own(s,'luckyCoin','eric');assert.equal(strikeStats(s,eric,b).crit,c0+5);
 const arrow=strikeStats(s,a,eric).damage;own(s,'towerShield','eric');assert.ok(strikeStats(s,a,eric).damage<=Math.max(1,arrow-2+2),'DEF +2 and −2 from range');
 const lia=findUnit(s,'lia');own(s,'pilgrimMantle','lia');assert.equal(statusChance(s,lia,'confuse',40),30);own(s,'chrismCharm','lia');assert.equal(statusChance(s,lia,'poison',40),0);
 const sain=findUnit(s,'sain'),v=effectiveStats(s,sain).mag;own(s,'flameStaff','sain');assert.equal(effectiveStats(s,sain).heal,3);assert.equal(effectiveStats(s,sain).mag,v+2);
});

test('hidden objective (M01: TURN 6): a campaign victory wins the Herb Pouch once; a cleared mission can win it in practice once',()=>{
 const win=s=>{for(const c of s.units.filter(u=>u.team==='civilian'))c.rescued=true;findUnit(s,'boss').hp=0;checkOutcome(s);};
 let s=newGame(3,camp(),1);s.screen='deployment';startBattle(s);drain(s);s.turn=5;win(s);assert.equal(s.outcome,'victory');assert.deepEqual(s.campaign.feats,[1]);assert.ok(s.campaign.economy.gear.some(g=>g.type==='herbPouch'));assert.equal(s.campaign.results.at(-1).feat.type,'herbPouch');
 let late=newGame(3,camp(),1);late.screen='deployment';startBattle(late);drain(late);late.turn=7;win(late);assert.equal(late.outcome,'victory');assert.ok(!late.campaign.feats?.length,'TURN 7 misses it');
 const p=newGame(3,late.campaign,1);assert.ok(p.practice);p.screen='deployment';startBattle(p);drain(p);p.turn=4;win(p);assert.deepEqual(p.campaign.feats,[1]);assert.ok(p.campaign.economy.gear.some(g=>g.type==='herbPouch'),'practice: the treasure goes to the campaign');
 const p2=newGame(3,p.campaign,1);p2.screen='deployment';startBattle(p2);drain(p2);p2.turn=4;win(p2);assert.equal(p2.campaign.economy.gear.filter(g=>g.type==='herbPouch').length,1,'only once');
 assert.equal(featOf(2).reward,'elixir');for(let id=1;id<=14;id++)assert.ok(featOf(id)?.hint,`M${id} hint`);
});

test('hidden objectives read this battle only: M02 capture without a fall gives an Elixir (a full bag gives its 60 Gold)',()=>{
 const s=newGame(3,camp({completed:[1]}),2);s.screen='deployment';startBattle(s);drain(s);const boss=findUnit(s,'boss');boss.rescued=true;s.battleFlags.mission_02_prisoner_captured=true;checkOutcome(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.economy.items.elixir,1);
 const t=newGame(3,camp({completed:[1]}),2);t.screen='deployment';startBattle(t);drain(t);t.economy.items={medium:4,ether:4};findUnit(t,'boss').rescued=true;t.battleFlags.mission_02_prisoner_captured=true;const gold=t.economy.gold;checkOutcome(t);assert.equal(t.campaign.economy.items.elixir,undefined);assert.ok(t.campaign.economy.gold>=gold+60);
 const u=newGame(3,camp({completed:[1],flags:{mission_02_prisoner_captured:true}}),2);u.screen='deployment';startBattle(u);drain(u);findUnit(u,'boss').hp=0;checkOutcome(u);assert.ok(!u.campaign.feats?.includes(2),'a flag from an earlier run does not count');
});

test('every hidden objective reads flags its mission records, and none needs more than the victory allows (M07 ends when 2 wagons pass)',async()=>{
 const fs=await import('node:fs');const rules=fs.readdirSync('src/core').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(`src/core/${f}`,'utf8')).join('\n');
 for(const f of Object.values(FEATS))for(const [,flag] of String(f.test).matchAll(/bf\.(mission_\w+)/g))assert.ok(rules.includes(`'${flag}'`),`M${f.missionId} reads ${flag}, which no mission rule records`);
 assert.equal(FEATS[7].test({},{mission_07_wagons_through:2,mission_07_wagons_intact:3},false),true,'all three wagons kept, two through the gate, nobody fell');
 assert.equal(FEATS[7].test({},{mission_07_wagons_through:2,mission_07_wagons_intact:2},false),false);
 assert.equal(FEATS[7].test({},{mission_07_wagons_through:2,mission_07_wagons_intact:3},true),false);
});

test('supply carriers: one per mission, marked on the map; defeating it drops its tool into the bag (none when full)',()=>{
 for(let id=1;id<=14;id++){const [carrier,tool]=SUPPLY[id];assert.ok(MISSIONS[id].enemies.some(e=>e.id===carrier),`M${id} ${carrier}`);assert.ok(TOOLS[tool]);const s=newGame(2,camp({completed:upTo(id-1)}),id);assert.equal(findUnit(s,carrier).carrier,tool);}
 let dropped=0;for(let seed=1;seed<20&&!dropped;seed++){const s=board();s.rng=seed*977>>>0;const eric=findUnit(s,'eric');place(eric,5,6);const c=wake(s,'b3',5,5,{hp:1});const before=s.economy.items.herb||0;performAction(s,'eric','attack','b3');if(!alive(c)){dropped++;assert.equal(s.economy.items.herb,before+1);assert.ok(s.feedback.some(f=>f.type==='drop'));assert.equal(c.carrier,undefined);}}
 assert.ok(dropped);
 for(let seed=1;seed<20;seed++){const t=board();t.rng=seed*977>>>0;const e2=findUnit(t,'eric');place(e2,5,6);t.economy.items={medium:8};const c=wake(t,'b3',5,5,{hp:1});performAction(t,'eric','attack','b3');if(!alive(c)){assert.equal(t.economy.items.herb,undefined);break;}}
});

test('cut-ins: a hero critical hit and a ③ skill carry one line; enemies never do',()=>{
 const s=board(),eric=findUnit(s,'eric');place(eric,5,6);wake(s,'b1',5,5,{hp:200,maxHP:200});let crit=false;for(let i=0;i<80&&!crit;i++){eric.acted=false;eric.hp=eric.maxHP;eric.spd=30;findUnit(s,'b1').hp=200;s.rng=(s.rng+i*7919)>>>0;performAction(s,'eric','attack','b1');crit=s.feedback.some(f=>f.type==='critical'&&f.id==='b1');if(crit)assert.ok(s.feedback.some(f=>f.type==='cutin'&&f.id==='eric'&&f.kind==='crit'));else assert.ok(!s.feedback.some(f=>f.type==='cutin'));}
 assert.ok(crit,'a critical hit was seen');
 const t=board(),e2=findUnit(t,'eric');e2.classTier=2;place(e2,5,6);wake(t,'b1',5,5);assert.ok(performAction(t,'eric','bulwark','eric').ok);assert.ok(t.feedback.some(f=>f.type==='cutin'&&f.kind==='third'));
});

test('schema 11: stars, treasure slot, hidden objectives and battle flags round-trip; damaged records are rejected; treasures are never sold or tempered',()=>{
 assert.equal(SCHEMA,14);const s=hubAt(9,8);assert.ok(tx(s,'buy-gear','twinSabers').ok===false||true);own(s,'herbPouch');s.campaign.feats=[1];
 const blade=s.economy.gear.at(-1);assert.equal(tx(s,'sell-gear',blade.id).ok,false);assert.equal(tx(s,'upgrade',blade.id).ok,false);assert.ok(tx(s,'equip',blade.id,'eric','treasure').ok);
 const again=deserialize(serialize(s));assert.equal(again.economy.equipped.eric.treasure,blade.id);assert.deepEqual(again.campaign.feats,[1]);
 for(const bad of [x=>{x.economy.gear.at(-1).star=3;},x=>{x.economy.gear.push({...x.economy.gear.at(-1),id:`g${x.economy.next++}`});},x=>{x.campaign.feats=[1,1];},x=>{x.economy.gear.at(-1).level=0;},x=>{delete x.economy.equipped.eric.treasure;}]){const c=structuredClone(s);bad(c);assert.throws(()=>serialize(c));}
 const b=board();b.battleFlags.x=true;assert.equal(deserialize(serialize(b)).battleFlags.x,true);const bad=structuredClone(b);bad.battleFlags.y={};assert.throws(()=>serialize(bad));
 const e=initialEconomy();assert.deepEqual(Object.keys(e.equipped.eric),['weapon','armor','accessory','treasure']);
});
