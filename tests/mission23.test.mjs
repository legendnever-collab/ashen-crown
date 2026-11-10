// v0.10.0 — M23 Toward the End of the War: the alliance camp at night. The three leaders and their guards fight as allied
// units that take orders (따르라 / 지켜라 / 자유); an enemy that ends two enemy phases in a row beside a council tent takes it;
// two tents taken is a defeat; the raid captain (TURN 4) falling or TURN 10 ending is a victory; a fallen leader costs their
// banner's trust; who leads the final campaign; the feat and the rewards.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,canOrderAlly,setAllyOrder,ALLY_ORDERS} from '../src/core/game.js';
import {findUnit,alive,distance} from '../src/core/rules.js';
import {M23,LEAD23,chooseLead23,TENTS23,LEADERS23,besiegers23} from '../src/core/mission-rules-v0100.js';
import {ensureTrust} from '../src/core/factions.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
export const camp23=(extra={})=>({heroes:null,results:[],clears:22,completed:[...Array(22).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',aren_awakened:true},
 choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell',m19_teacher:'take',m20_superior:'trial',m20_plan:'keep',m21_king:'notyet',act3_choice:'council'},factionTrust:{iron:1,free:3,flame:2},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(100,camp23(extra),23);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// Clear the field: every enemy down (waves too, as they come), the heroes out of the way in the south.
const quiet=(s,keep=[])=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u.id)))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=2+i;u.y=12;u.maxHP=u.hp=999;u.def=u.res=99;});};
const turn=(s,keep)=>{quiet(s,keep);enemyPhase(s);};

test('M23 data: 18×14 alliance camp, level 18, sortie of seven, TURN 10; three tents, three orderable leaders and guards; scenes',()=>{
 const m=MISSIONS[23];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,18);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,10);assert.equal(m.siegeTurns,2);
 assert.deepEqual(m.objects.map(o=>[o.id,o.kind,o.faction]),[['ti','tent','iron'],['tf','tent','free'],['tl','tent','flame']]);
 assert.deepEqual(m.allies.filter(a=>a.leader).map(a=>a.id),Object.keys(LEADERS23));assert.ok(m.allies.every(a=>a.orderable));assert.ok(m.waves.some(w=>w.units.some(u=>u.id==='rk')&&w.turn===4),'the raid captain comes on TURN 4');
 for(const k of ['23:intro','23:flank','23:south','23:siege','23:tent:iron','23:tent:free','23:tent:flame','23:tent2','23:captain','23:captain:down','23:fallen:cassian','23:fallen:leonora','23:fallen:lucien','23:end','pre:23','after:23','after:23:legion','after:23:banners','npc:23:preparation:aren','npc:23:aftermath:advisor','world:alliance'])assert.ok(STORY[k]?.length,k);
});
test('an enemy that ends two enemy phases in a row beside a tent takes it; one that steps away clears the mark',()=>{
 const s=battle(),st=s.missionState,tent=findUnit(s,'tl'),k=findUnit(s,'k1');assert.deepEqual(st.siege,{ti:0,tf:0,tl:0});
 Object.assign(k,{x:7,y:10,mov:0,hp:999,maxHP:999,def:99,res:99,atk:0});assert.equal(distance(k,tent),1);
 turn(s,['k1']);assert.equal(s.turn,2);assert.equal(st.siege.tl,1);assert.deepEqual(besiegers23(s,tent).map(u=>u.id),['k1']);assert.ok(!tent.inert);
 turn(s,['k1']);assert.equal(s.turn,3);assert.ok(tent.inert,'taken');assert.deepEqual(st.fallenTents,['tl']);assert.ok(!s.outcome);assert.ok(s.narrative.events.includes('23:tent:flame'));
 const t=battle(),g=findUnit(t,'k1');Object.assign(g,{x:5,y:4,mov:0,hp:999,maxHP:999,def:99,res:99,atk:0});turn(t,['k1']);assert.equal(t.missionState.siege.ti,1);g.x=1;g.y=10;turn(t,['k1']);assert.equal(t.missionState.siege.ti,0);
});
test('two tents taken is a defeat; the raid captain falling is a victory; TURN 10 ending is a victory',()=>{
 const s=battle();s.missionState.fallenTents=['ti','tf'];turn(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/천막 두 곳/);
 const c=battle();for(let i=0;i<3;i++)turn(c);assert.equal(c.turn,4);const rk=findUnit(c,'rk');assert.ok(rk&&alive(rk),'the captain is on the field');rk.hp=0;M23.afterDamage(c,rk);enemyPhase(c);assert.equal(c.outcome,'victory');assert.match(c.reason,/습격대장/);
 const t=battle();while(!t.outcome&&t.turn<20)turn(t);assert.equal(t.outcome,'victory');assert.equal(t.turn,11);assert.match(t.reason,/TURN 10/);assert.equal(t.campaign.flags.mission_23_tents,3);
});
test('a fallen leader costs their banner one trust on a win (never the battle); the reward and the feat follow the leaders',()=>{
 const s=battle(),before=ensureTrust(s.campaign).flame,l=findUnit(s,'lucien');l.hp=0;M23.afterDamage(s,l);assert.deepEqual(s.missionState.fallenLeaders,['lucien']);
 while(!s.outcome)turn(s);assert.equal(s.outcome,'victory');assert.equal(ensureTrust(s.campaign).flame,before-1);assert.equal(s.campaign.flags.mission_23_lucien,'fallen');assert.equal(s.campaign.flags.mission_23_leaders,2);
 assert.ok(s.narrative.events.includes('23:fallen:lucien'));
 assert.deepEqual(supplementalRewards(23,{leaders23:3}).map(r=>r.kind+':'+(r.type||r.amount)),['item:medium','item:ether','item:elixir']);assert.equal(supplementalRewards(23,{leaders23:2}).length,2);
 assert.equal(FEATS[23].reward,'allianceBanner');assert.ok(FEATS[23].test({turn:9},{mission_23_leaders:3,mission_23_tents:3}));assert.ok(!FEATS[23].test({turn:9},{mission_23_leaders:2,mission_23_tents:3}));
});
test('allied orders: tap an orderable allied unit in the player phase — 따르라 keeps beside the nearest hero, 지켜라 holds its tile; saved and checked',()=>{
 assert.deepEqual(Object.keys(ALLY_ORDERS),['follow','hold','free']);
 const s=battle(),c=findUnit(s,'cassian');assert.ok(canOrderAlly(s,c));assert.ok(!canOrderAlly(s,findUnit(s,'k1')),'not an enemy');assert.ok(!canOrderAlly(s,findUnit(s,'eric')),'not a hero');assert.ok(!setAllyOrder(s,'cassian','charge'));
 assert.ok(setAllyOrder(s,'cassian','hold'));assert.deepEqual(c.orderPost,{x:c.x,y:c.y});const post={x:c.x,y:c.y};
 const l=findUnit(s,'leonora');assert.ok(setAllyOrder(s,'leonora','follow'));quiet(s);const e=findUnit(s,'eric');e.x=12;e.y=9;
 enemyPhase(s);assert.deepEqual({x:c.x,y:c.y},post,'지켜라: stays');const near=s.units.filter(h=>h.team==='ally'&&alive(h)).sort((a,b)=>distance(l,a)-distance(l,b))[0];assert.ok(distance(l,near)<=2,'따르라: beside a hero');
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'cassian').order,'hold');assert.deepEqual(findUnit(back,'cassian').orderPost,post);assert.equal(findUnit(back,'leonora').order,'follow');
 const bad=structuredClone(s);findUnit(bad,'cassian').order='charge';assert.throws(()=>serialize(bad));const bad2=structuredClone(s);findUnit(bad2,'k1').order='hold';assert.throws(()=>serialize(bad2));
 s.phase='enemy';assert.ok(!canOrderAlly(s,c),'only in the player phase');
});
test('who leads the final campaign: once, after M23, never in practice; the camp scene follows',()=>{
 assert.deepEqual(Object.keys(LEAD23),['legion','banners']);const s=battle();assert.ok(!chooseLead23(s,'legion'),'not before the win');
 while(!s.outcome)turn(s);assert.ok(chooseLead23(s,'banners'));assert.ok(!chooseLead23(s,'legion'));assert.equal(s.campaign.choices.m23_lead,'banners');assert.equal(s.campaign.flags.mission_23_lead,'banners');
 const p=battle({completed:[...Array(23).keys()].map(i=>i+1)});assert.ok(p.practice);assert.ok(!chooseLead23(p,'legion'));
 assert.deepEqual(deserialize(serialize(s)).missionState,s.missionState);
});
