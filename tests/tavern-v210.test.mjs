// v2.1 「주점과 세계지도」 (D-118, docs/v2.1.0/TAVERN_WORLD_DESIGN.md): the five start alone; officers and later hires
// wait in taverns (one fee, to the ending); M04 opens two small villages with requests (short battles, a hand-over,
// a repeat bounty) and a rescued hero; duels are events between story-linked pairs; v2.0.0 saves keep their officers.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle,nextMission,performAction,moveUnit} from '../src/core/game.js';
import {enterHub,travelTo,enterInterior,exitInterior,currentHub,revisitTowns,interactNPC} from '../src/core/frontier.js';
import {mercsAt,hire,hireLevel,wanderersAt} from '../src/core/tavern.js';
import {requestsAt,startRequest,payRequest} from '../src/core/villages.js';
import {returnToCamp} from '../src/core/skirmish.js';
import {checkDuelEvents,pendingDuelEvent} from '../src/core/duel-events.js';
import {duelOpen,duelPick} from '../src/core/duel.js';
import {findUnit} from '../src/core/rules.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION,heroDef} from '../src/data/game-data.js';
import {MERCS} from '../src/data/mercs-v210.js';
import {HERO_STATS} from '../src/data/classes8.js';
import {HERO_LORE,loreChapters} from '../src/data/hero-lore.js';
import {STORY} from '../src/data/story.js';
import {growthOf} from '../src/core/stats8.js';
import {playBattle} from './player-policy.mjs';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
import {standBeside} from './duel-helper.mjs';

const tavernOf=(s)=>{const d=currentHub(s).places.find(p=>p.interior==='tavern');s.frontier.x=d.x;s.frontier.y=d.y;s.frontier.facing='up';assert.ok(enterInterior(s,d.buildingId),'enter the tavern');return s;};
function campAfter(n,seed=20261014){let s=newGame(seed);s.screen='deployment';startBattle(s);playBattle(s);assert.equal(s.outcome,'victory','M01');
 for(let id=2;id<=n;id++){const camp=nextMission(s);let won=null;for(let t=0;t<6&&!won;t++){const b=structuredClone(camp);b.rng=b.initialSeed=(b.rng+t*7919)>>>0;b.screen='deployment';startBattle(b);drain(b);playCampaignBattle(b,true);if(b.outcome==='victory')won=b;}assert.ok(won,`M0${id}`);s=won;if(id===4)s.campaign.choices.m04_records_choice='kept';}
 enterHub(s,{aftermath:true,story:false});drain(s);return s;}
let after4=null;const camp4=()=>structuredClone(after4??=campAfter(4));

test('a new campaign is the five alone; the ash village tavern holds Bram, Noa and Marta (200 G each), not before the first battle',()=>{
 const s=newGame(3);assert.deepEqual(s.units.filter(u=>u.team==='ally').map(u=>u.id),['eric','elina','lia','sain','kai']);assert.deepEqual(s.campaign.roster,[]);
 enterHub(s,{story:false});drain(s);assert.ok(['lia','sain','kai'].every(id=>s.frontier.affiliation[id]==='affiliated'),'together from the first story');
 tavernOf(s);assert.equal(s.frontier.interior,'tavern');assert.ok(currentHub(s).npcs.some(n=>n.service==='tavern'),'a keeper for 인재 확보');
 assert.deepEqual(mercsAt(s,'ash').map(m=>[m.id,m.price]),[['bram',200],['noa',200],['marta',200]]);
 const r=hire(s,'bram');assert.equal(r.ok,false);assert.match(r.error,/첫 전투/);assert.deepEqual(s.campaign.roster,[]);});

test('hiring: one fee, the legion\'s average level −1, kept to the ending; never twice, never without the gold; the save keeps it',()=>{
 const s=campAfter(1);assert.ok(travelTo(s,'village_raid')||s.frontier.hub==='village_raid');tavernOf(s);const gold=s.economy.gold,lv=hireLevel(s.campaign);
 const r=hire(s,'noa');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold-200);assert.ok(s.campaign.roster.includes('noa'));assert.equal(s.campaign.heroes.find(h=>h.id==='noa').level,lv);
 assert.deepEqual(s.economy.hired,['noa']);assert.equal(hire(s,'noa').ok,false,'once');assert.ok(!mercsAt(s,'ash').some(m=>m.id==='noa'));
 s.economy.gold=50;s.campaign.economy.gold=50;assert.match(hire(s,'marta').error,/부족/);
 const back=deserialize(serialize(s));assert.ok(back.campaign.roster.includes('noa'));assert.equal(back.schema,SCHEMA);assert.equal(SCHEMA,27);assert.equal(VERSION,'2.5.2');
 assert.ok(STORY['officer:noa:0'],'camp talk');assert.deepEqual(loreChapters('noa',back.campaign).open.map(c=>c.after).filter(a=>a<=1),[],'chapters start after the hire');});

test('M04 opens 갈대 나루 and 돌우물 마을 on the world map; Rowell waits at the reed tavern as an elite hire; a wanderer moves to stonewell',()=>{
 const s=camp4();assert.deepEqual(revisitTowns(s).map(t=>t.hub).filter(h=>['reed','stonewell'].includes(h)),['reed','stonewell']);
 assert.ok(travelTo(s,'reed'));assert.equal(s.frontier.hub,'reed');assert.ok(currentHub(s).npcs.some(n=>n.service==='requests'),'the request board');
 tavernOf(s);const m=mercsAt(s,'reed');assert.deepEqual(m.map(x=>x.id),['rowell']);assert.ok(m[0].elite);assert.equal(m[0].price,450);assert.equal(HERO_STATS.rowell.str,10,'elite: +2 main');
 assert.ok(exitInterior(s,true));assert.ok(travelTo(s,'stonewell'));assert.deepEqual(wanderersAt(s.campaign),['bram']);tavernOf(s);assert.deepEqual(mercsAt(s,'stonewell').map(x=>[x.id,x.wandering]),[['bram',true]]);
 assert.ok(deserialize(serialize(s)).frontier.hub==='stonewell','the visit survives a save');});

test('a battle request: the chosen sortie fights, a win pays once and is marked done; a loss changes nothing',()=>{
 const s=camp4();travelTo(s,'reed');const gold=s.economy.gold;assert.deepEqual(requestsAt(s,'reed').map(r=>r.id),['ferry','barge','herbs','bounty']);
 const b=startRequest(s,'ferry',['eric','lia','kai']);assert.equal(b.missionId,120);assert.deepEqual(b.units.filter(u=>u.team==='ally'&&!u.benched).map(u=>u.id).sort(),['eric','kai','lia']);
 const lost=structuredClone(b);lost.outcome='defeat';const l=returnToCamp(lost);assert.equal(l.frontier.hub,'reed');assert.equal(l.economy.gold,gold);assert.ok(!requestsAt(l,'reed').find(r=>r.id==='ferry').done);
 drain(b);playCampaignBattle(b);assert.equal(b.outcome,'victory');const c=returnToCamp(b);assert.equal(c.frontier.hub,'reed','back at the board');assert.ok(c.economy.gold>=gold+180);assert.ok(requestsAt(c,'reed').find(r=>r.id==='ferry').done);
 assert.equal(startRequest(c,'ferry',['eric']),null,'done once');deserialize(serialize(c));});

test('the besieged spearknight: hold six turns and Adel joins the legion (hero growth, his own 열전 and epilogue line)',()=>{
 const s=camp4();travelTo(s,'stonewell');const b=startRequest(s,'besieged',['eric','elina','lia','sain','kai']);assert.ok(b.units.some(u=>u.id==='adelc'&&u.team==='civilian'));
 drain(b);playCampaignBattle(b);assert.equal(b.outcome,'victory',b.reason);const c=returnToCamp(b);assert.deepEqual(c.requestResult.joined,'adel');assert.ok(c.campaign.roster.includes('adel'));
 assert.equal(heroDef('adel').name,'아델');assert.ok(HERO_LORE.adel.bio.includes('초소'));assert.ok(growthOf({id:'adel',cls:'spear'}).str>growthOf({id:'bram',cls:'spear'}).str,'grows like a hero');
 assert.ok(requestsAt(c,'stonewell').find(r=>r.id==='besieged').done);deserialize(serialize(c));});

test('requests without a battle trade at the board; the bounty opens again after each story mission',()=>{
 const s=camp4();travelTo(s,'reed');s.economy.items.herb=0;s.campaign.economy.items.herb=0;assert.equal(payRequest(s,'herbs').ok,false,'needs two herbs');
 s.economy.items={herb:2};s.campaign.economy.items={herb:2};const gold=s.economy.gold;const r=payRequest(s,'herbs');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold+100);assert.equal(s.economy.items.herb,0);assert.equal(s.economy.items.antidote,1);
 assert.equal(payRequest(s,'herbs').ok,false,'once');
 const k=s.campaign.completed.filter(id=>id<=30).length;assert.ok(requestsAt(s,'reed').find(r=>r.id==='bounty').done===false);
 s.economy.requests=[...(s.economy.requests||[]),`bounty:${k}`];assert.ok(requestsAt(s,'reed').find(r=>r.id==='bounty').done);s.campaign.completed.push(5);assert.ok(!requestsAt(s,'reed').find(r=>r.id==='bounty').done,'a new band after the next story win');});

test('duels are events: Erik beside Garr starts it once (two lines); v2.2: always won, a level for Erik, Garr falls and leaves the field (D-124); no challenge command remains',()=>{
 const s=newGame(5);s.screen='deployment';startBattle(s);drain(s);assert.equal(pendingDuelEvent(s),null);assert.equal(performAction(s,'eric','challenge','boss').ok,false,'the menu is gone');
 assert.equal(standBeside(s,'eric','boss'),'duel:1:garr');assert.ok(duelOpen(s));assert.equal(STORY['duel:1:garr'].length,2);assert.ok(s.narrative.queue.includes('duel:1:garr')||s.narrative.active?.key==='duel:1:garr');
 assert.equal(duelPick(s,'skip'),false,'v2.2: no stepping back');const garr=findUnit(s,'boss'),eric=findUnit(s,'eric'),hp=garr.hp,lv=eric.level;assert.ok(duelPick(s,'strike'));assert.equal(s.duel.result,'hero','always won');assert.equal(eric.level,lv+1,'a level');assert.equal(garr.hp,0,'Garr falls');assert.equal(s.duel.fall,'down');assert.ok(hp>0);assert.equal(checkDuelEvents(s,'eric'),null,'one time per pair');
 const t=newGame(5);t.screen='deployment';startBattle(t);drain(t);assert.equal(standBeside(t,'lia','boss'),null,'Lia has no tie to Garr');deserialize(serialize(s));});

test('v2.0.0 saves (real, schema 20) load as schema 21: the officers stay as hires, the five are together, nothing else changes',()=>{
 for(const [name,officers] of [['m01-camp',['bram','noa','marta']],['m05-camp',['bram','noa','marta','rowell']]]){const f=JSON.parse(fs.readFileSync(new URL(`./fixtures/v200/v200-${name}.json`,import.meta.url),'utf8'));assert.equal(f.schema,20);assert.equal(f.version,'2.0.0');
  const before=JSON.parse(JSON.parse(f.save).data),s=deserialize(f.save);assert.equal(s.schema,27);assert.equal(s.version,VERSION);assert.deepEqual(s.campaign.roster,before.campaign.roster);assert.deepEqual(s.campaign.economy.hired,officers);
  assert.equal(s.campaign.economy.gold,before.campaign.economy.gold);assert.deepEqual(s.campaign.completed,before.campaign.completed);assert.ok(['lia','sain','kai'].every(id=>s.frontier.affiliation[id]==='affiliated'));assert.equal(s.frontier.pendingRecruit,null);
  for(const id of officers)assert.ok(MERCS[id]&&(s.campaign.heroes==null||s.campaign.heroes.some(h=>h.id===id)),id);assert.deepEqual(deserialize(serialize(s)).campaign,s.campaign,'round trip');}});
