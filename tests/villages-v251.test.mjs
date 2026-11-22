// v2.5.1 (D-141, docs/v2.5.0/ACT4_MAPS_DESIGN.md §3): the ACT IV small villages. The last border (M24) opens 봉화둔덕, the
// lion's pass (M26) opens 사자샘, each with a request board, a tavern and a shop; 「재 속의 약사」 brings 루카 (healer, a
// rescued hero who grows like a hero; 「등불 손길」 clears one status when he heals); 「도망친 군마」 is won by bringing the
// three grooms back; 「샘터 우물 보수」 takes 10% off at 사자샘, 봉화둔덕 and 왕도 하층가; each village has a bounty.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {deserialize,serialize,checksum} from '../src/persistence/save-manager.js';
import {travelTo,currentHub,revisitTowns,exitInterior} from '../src/core/frontier.js';
import {requestsAt,startRequest,payRequest} from '../src/core/villages.js';
import {returnToCamp} from '../src/core/skirmish.js';
import {wanderersAt} from '../src/core/tavern.js';
import {ensureEconomy,discountAt,shopPrice} from '../src/core/economy.js';
import {growthOf} from '../src/core/stats8.js';
import {performAction,startBattle} from '../src/core/game.js';
import {findUnit} from '../src/core/rules.js';
import {heroDef} from '../src/data/game-data.js';
import {HERO_LORE} from '../src/data/hero-lore.js';
import {MISSIONS} from '../src/data/missions.js';
import {VILLAGES,REQUESTS} from '../src/data/villages-v210.js';
import {SITES} from '../src/data/world.js';
import {MERC_EPILOGUE,MERC_TALK} from '../src/data/mercs-v210.js';
import {drain,playCampaignBattle} from './campaign-policy.mjs';
// v2.6.1: a town with someone worth meeting opens a short rumour the first time; the flows here go on after it
const travelDrained=(s,h)=>{const r=travelTo(s,h);drain(s);return r;};
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/v0102/v0102-m28-camp.json',import.meta.url),'utf8'));
// the v0.10.2 camp after M28: M24 and M26 are won, so both ACT IV villages are open
const camp=()=>{const s=deserialize(fixture.save||fixture);s.economy.gold=s.campaign.economy.gold=3000;return s;};
const sortie=s=>['eric','elina','lia','sain','kai','thea','dario','ines'].filter(id=>s.campaign.roster?.includes(id)||['eric','elina','lia','sain','kai'].includes(id)).slice(0,8);
const fight=(s,id,check)=>{let b,won=false;for(let t=0;t<3&&!won;t++){b=startRequest(s,id,sortie(s));check?.(b);b.rng=(b.rng+t*7919)>>>0;drain(b);playCampaignBattle(b);won=b.outcome==='victory';}return [b,won];};

test('M24 opens 봉화둔덕 and M26 opens 사자샘 on the world map and in the revisit list',()=>{
 assert.deepEqual([VILLAGES.beacon.opens,VILLAGES.lionspring.opens],[24,26]);assert.deepEqual(['beacon','lionspring'].map(id=>SITES.find(x=>x.id===id).opens),[24,26]);
 const s=camp();const towns=revisitTowns(s).map(t=>t.hub);assert.ok(towns.includes('beacon')&&towns.includes('lionspring'),towns.join());
 assert.ok(travelDrained(s,'beacon'));assert.equal(s.frontier.hub,'beacon');assert.ok(currentHub(s).npcs.some(n=>n.service==='requests'),'the request board');
 assert.deepEqual(requestsAt(s,'beacon').map(r=>r.id),['apothecary','beacons','winter','bountyBorder']);
 assert.ok(travelDrained(s,'lionspring'));assert.deepEqual(requestsAt(s,'lionspring').map(r=>r.id),['horses','springwell','passbandits','bountyLion']);
 assert.ok(deserialize(serialize(s)).frontier.hub==='lionspring','the visit survives a save');
});

test('「재 속의 약사」: hold seven turns and 루카 joins — healer, grows like a hero, his lines, 열전 and epilogue',()=>{
 const s=camp();travelDrained(s,'beacon');const [b,won]=fight(s,'apothecary',b=>{assert.equal(b.missionId,137);assert.ok(b.units.some(u=>u.id==='lukac'&&u.team==='civilian'));});
 assert.ok(won,b.reason);const c=returnToCamp(b);assert.equal(c.requestResult.joined,'luka');assert.ok(c.campaign.roster.includes('luka'));assert.equal(c.frontier.hub,'beacon');
 assert.equal(heroDef('luka').name,'루카');assert.ok(HERO_LORE.luka.bio.includes('수도원'));assert.equal(MERC_TALK.luka.length,3);assert.deepEqual(Object.keys(MERC_EPILOGUE.luka),['A','B','C']);
 assert.ok(growthOf({id:'luka',cls:'healer'}).wil>growthOf({id:'celine',cls:'healer'}).wil,'grows like a hero');
 assert.ok(requestsAt(c,'beacon').find(r=>r.id==='apothecary').done);deserialize(serialize(c));
});

test('「등불 손길」: 루카\'s heal clears one status (poison first); 셀린\'s heal does not',()=>{
 const s=camp();travelDrained(s,'beacon');const [b,won]=fight(s,'apothecary');assert.ok(won);const c=returnToCamp(b);travelDrained(c,'lionspring');
 const r=startRequest(c,'passbandits',['eric','luka','elina','lia']);if(r.screen==='deployment')startBattle(r);drain(r);const l=findUnit(r,'luka'),e=findUnit(r,'eric');assert.ok(l,'루카 sorties');
 e.x=l.x+1;e.y=l.y;e.hp=Math.max(1,e.hp-10);e.status={poison:2,bind:1};l.moved=l.acted=false;l.mp=l.maxMP;
 const res=performAction(r,'luka','skill',e.id);assert.ok(res.ok,res.error);assert.deepEqual(e.status,{bind:1},'poison cleared first');
 const k=findUnit(r,'elina');k.x=l.x-1;k.y=l.y;k.status={silence:1};k.hp=Math.max(1,k.hp-5);l.acted=false;l.moved=false;l.mp=l.maxMP;assert.ok(performAction(r,'luka','skill',k.id).ok);assert.equal(k.status,undefined,'the last status gone');
});

test('「샘터 우물 보수」: 300 G at the board, then 10% off at 사자샘, 봉화둔덕 and 왕도 하층가 (not elsewhere)',()=>{
 const s=camp();travelDrained(s,'lionspring');assert.equal(discountAt(s),1);const gold=s.economy.gold;const r=payRequest(s,'springwell');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold-300);
 assert.equal(discountAt(s),.9);assert.equal(shopPrice(s,100),90);exitInterior(s,true);assert.ok(travelDrained(s,'beacon'));assert.equal(discountAt(s),.9);
 s.frontier.hub='capital';assert.equal(discountAt(s),.9);s.frontier.hub='velmar';assert.equal(discountAt(s),1);
});

test('봉화둔덕: 「피난민 겨울나기」 takes two medium potions; the 사자샘 tavern takes in 실바, 셀린 or 오린 one per story win from M26',()=>{
 const s=camp();assert.ok(travelDrained(s,'beacon'));s.economy.items={medium:1};s.campaign.economy.items={medium:1};assert.equal(payRequest(s,'winter').ok,false,'needs two');
 s.economy.items={medium:2};s.campaign.economy.items={medium:2};const gold=s.economy.gold,r=payRequest(s,'winter');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold+200);assert.equal(s.economy.items.antidote,1);
 const won=s.campaign.completed.filter(id=>id>=26&&id<=30).length;assert.deepEqual(wanderersAt(s.campaign,'lionspring'),['silva','celine','orin'].filter(id=>!s.campaign.roster.includes(id)).slice(0,won));
});

test('every ACT IV request battle is winnable by the test policy; 「도망친 군마」 is won by bringing the three grooms back; the bounties open again',()=>{
 for(const [id,v] of [['beacons','beacon'],['bountyBorder','beacon'],['horses','lionspring'],['passbandits','lionspring'],['bountyLion','lionspring']]){
  const s=camp();travelDrained(s,v);const [b,won]=fight(s,id);assert.ok(won,`${id} won within three tries (${b.reason})`);
  if(id==='horses')assert.ok(['gr1','gr2','gr3'].every(g=>findUnit(b,g).rescued),'the three grooms brought back');
  const c=returnToCamp(b);assert.ok(requestsAt(c,v).find(r=>r.id===id).done,id);}
 const s=camp();const k=s.campaign.completed.filter(id=>id<=30).length;s.economy.requests=[...(s.economy.requests||[]),`bountyLion:${k}`];travelDrained(s,'lionspring');
 assert.ok(requestsAt(s,'lionspring').find(r=>r.id==='bountyLion').done);s.campaign.completed.push(29);assert.ok(!requestsAt(s,'lionspring').find(r=>r.id==='bountyLion').done);
 assert.deepEqual(Object.keys(REQUESTS).filter(id=>REQUESTS[id].mission>=137).map(id=>REQUESTS[id].mission),[137,138,139,140,141,142]);
 assert.equal(MISSIONS[139].goal.type,'rescue');
});

test('the rescued heroes fight: 아델, 군나르, 마렌 and 루카 are on the field when they sortie; a v2.5.0 save is mended',async()=>{
 const {NEW_HEROES}=await import('../src/data/mercs-v210.js');
 for(const id of ['adel','gunnar','maren','luka']){const h=NEW_HEROES.find(x=>x.id===id);assert.ok(h.rescuedHero&&!h.rescued,`${id}: the record must not carry the battle flag`);}
 // an older save (the v0.10.2 fixture) whose 마렌 record carries the old flag: loading it mends the record
 const env=JSON.parse(fixture.save),data=JSON.parse(env.data),kai=data.campaign.heroes.find(h=>h.id==='kai');
 data.campaign.roster.push('maren');data.campaign.heroes.push({...structuredClone(kai),...NEW_HEROES.find(x=>x.id==='maren'),level:kai.level,rescuedHero:undefined,rescued:true});
 const text=JSON.stringify(data),back=deserialize(JSON.stringify({...env,checksum:checksum(text),data:text}));back.economy.gold=back.campaign.economy.gold=3000;
 const rec=back.campaign.heroes.find(h=>h.id==='maren');assert.ok(!rec.rescued&&rec.rescuedHero,'mended');assert.equal(back.schema,27);
 travelDrained(back,'lionspring');const r=startRequest(back,'passbandits',['eric','maren','elina','lia']);if(r.screen==='deployment')startBattle(r);drain(r);const m=findUnit(r,'maren');
 assert.ok(m&&!m.rescued&&!m.benched&&m.hp>0,'마렌 on the field');
});

test('art pack L (D-146): 루카\'s three busts and the two villages come from hash-verified masters, as AVIF',async()=>{
 const {artFile,imageSize}=await import('./art-file.mjs');const {ART_HUBS}=await import('../src/data/hubs-v05.js');
 const log=fs.readFileSync('src/assets/art-import-log.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
 for(const e of ['neutral','concerned','determined']){assert.ok(log.some(r=>r[0]==='bust'&&r[1]==='luka'&&r[2]===e),e);const a=artFile('portraits',`bust_luka_${e}.webp`);assert.equal(a.format,'avif');assert.deepEqual(imageSize(a.bytes),[720,880]);}
 const hubs=fs.readFileSync('src/assets/room-art-import-log.csv','utf8');for(const id of ['hub_beacon','hub_lionspring']){assert.ok(hubs.includes(`hub,${id},`),id);assert.deepEqual(imageSize(artFile('hubs',`${id}.webp`).bytes),[1536,1024]);}
 assert.equal(ART_HUBS.beacon.art,'hub_beacon');assert.equal(ART_HUBS.lionspring.art,'hub_lionspring');
});
