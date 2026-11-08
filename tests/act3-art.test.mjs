// v0.9.1 — ACT III art pack F2 (D-088): the awakened (tier 3) and recruits' tier 2 looks, the elders of the keep and the
// forest, the M16 duel captains, the awakened guardian statue and the painted props are picked by the game.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
// the build registers the painted portraits as ASHEN_PORTRAITS {id:{expression:dataURL}}; the file names are enough here
const P={};for(const f of fs.readdirSync('src/assets/portraits')){const m=/^bust_(.+)_(neutral|concerned|determined|sad)\.webp$/.exec(f);if(m)(P[m[1]]??={})[m[2]]='x';}
globalThis.ASHEN_PORTRAITS=P;
const {bustKey}=await import('../src/render/bust.js');const {hdCastFor,spriteIdFor}=await import('../src/render/hd-world.js');
const {CAST}=await import('../src/render/hd-art.js');const {wardTreeProp}=await import('../src/render/prop-art.js');
const {HUBS}=await import('../src/data/frontier-data.js');const {roomId,ROOM_LAYOUTS}=await import('../src/data/rooms-v06.js');
const roomsOf=hubs=>hubs.flatMap(hub=>[...HUBS[hub].places.filter(p=>p.action==='enter').map(p=>[hub,p.interior,p.buildingId]),[hub,'weapon',undefined],[hub,'item',undefined]]);
const sprites=new Set(fs.readdirSync('src/assets/sprites').map(f=>f.replace(/^sprite_|\.webp$/g,'')));
const props=new Set(fs.readdirSync('src/assets/props').map(f=>f.replace('.webp','')));

test('tier 3 heroes and the recruits at tier 2 use their pack F2 busts and sheets; below that the earlier looks',()=>{
 for(const id of ['eric','elina','sain']){assert.equal(bustKey({id,team:'ally',classTier:3},17),`${id}_t3`);assert.equal(hdCastFor({id,team:'ally',classTier:3},17),`${id}_t3`);assert.ok(sprites.has(`${id}_t3`));
  assert.equal(bustKey({id,team:'ally',classTier:2},17),`${id}_t2`);}
 for(const id of ['lia','kai']){assert.equal(bustKey({id,team:'ally',classTier:3},19),`${id}_t3`,'pack F3');assert.equal(hdCastFor({id,team:'ally',classTier:3},19),`${id}_t3`);assert.ok(sprites.has(`${id}_t3`));assert.equal(bustKey({id,team:'ally',classTier:2},19),`${id}_t2`);}
 for(const id of ['thea','dario','ines']){assert.equal(bustKey({id,team:'ally',classTier:2},17),`${id}_t2`);assert.equal(hdCastFor({id,team:'ally',classTier:2},17),`${id}_t2`);assert.ok(sprites.has(`${id}_t2`));
  assert.equal(bustKey({id,team:'ally',classTier:1},17),id);assert.equal(hdCastFor({id,team:'ally',classTier:1},17),id);}
});

test('the elder speaks with the last guardian\'s face at the keep (M17) and the forest elder\'s in the forest (M18); the village elder elsewhere',()=>{
 assert.equal(bustKey({id:'elder',team:'civilian'},17),'guardianElder');assert.equal(bustKey({id:'elder',team:'civilian'},18),'forestElder');
 assert.notEqual(bustKey({id:'elder',team:'civilian'},3),'guardianElder');
 const keep=HUBS.keep.npcs.find(n=>n.id==='elder'),forest=HUBS.forest.npcs.find(n=>n.id==='elder'),keeper=HUBS.forest.npcs.find(n=>n.id==='refugee');
 assert.equal(hdCastFor({...keep,team:'civilian'}),'guardianElder');assert.equal(hdCastFor({...forest,team:'civilian'}),'forestElder');assert.equal(hdCastFor({...keeper,team:'civilian'}),'forester');
 for(const id of ['guardianElder','forestElder','forester'])assert.ok(sprites.has(spriteIdFor(id))&&CAST[id],id);
});

test('the M16 duel captain wears the betraying banner\'s face; the painted hubs and the forest rooms',()=>{
 for(const [look,k] of [['ironInfantry','iron'],['lordA','free'],['flameKnight','flame']]){assert.equal(bustKey({id:'cap',team:'enemy',look,scav:'captain'},16),`captain16_${k}`);assert.deepEqual(Object.keys(P[`captain16_${k}`]).sort(),['determined','sad']);}
 assert.equal(HUBS.keep.art,'hub_keep');assert.equal(HUBS.forest.art,'hub_forest');assert.ok(!HUBS.forest.grove&&!HUBS.forest.dusk);
 const forest=roomsOf(['forest']).map(r=>roomId(...r));assert.equal(new Set(forest).size,6);for(const id of forest)assert.ok(id.startsWith('int_forest_')&&ROOM_LAYOUTS[id],id);
});

test('an awakened guardian statue is the painted statue figure; sleeping statues and ward trees are painted props',()=>{
 assert.equal(hdCastFor({id:'s1',kind:'statue',team:'allied',woke:'ally'},17),'guardianStatue');assert.ok(sprites.has('guardianStatue'));
 for(const id of ['wardTree','wardTree_hurt','wardTree_felled','guardianStatue_sleeping'])assert.ok(props.has(id),id);
 assert.equal(wardTreeProp({hp:90,maxHP:90}),'wardTree');assert.equal(wardTreeProp({hp:40,maxHP:90}),'wardTree_hurt');assert.equal(wardTreeProp({hp:0,maxHP:90}),'wardTree_felled');
});

// v0.9.2 — ACT III art pack F3 (D-091): Lia's teacher and Kai's old superior speak and stand with their own faces and sheets;
// the rite knights and ritualists of M19 are painted; the ritual circles and the archive cabinets are painted props.
test('pack F3: the teacher, the old superior, the rite knight and the ritualist; the circles and the cabinets',()=>{
 for(const id of ['liaTeacher','greyMaster'])assert.deepEqual(Object.keys(P[id]).sort(),['concerned','determined','neutral','sad'],id);
 assert.equal(bustKey({id:'teacher',team:'civilian',look:'liaTeacher'},19),'liaTeacher');assert.equal(bustKey({id:'sup',team:'enemy',look:'greyMaster'},20),'greyMaster');
 for(const id of ['liaTeacher','greyMaster','ritualKnight','ritualist'])assert.ok(sprites.has(id)&&CAST[id],id);
 assert.equal(hdCastFor({id:'teacher',team:'civilian'}),'liaTeacher');assert.equal(hdCastFor({id:'sup',team:'enemy'}),'greyMaster');
 for(const id of ['ritualCircle','ritualCircle_sealed','cabinet','cabinet_burned'])assert.ok(props.has(id),id);
});
