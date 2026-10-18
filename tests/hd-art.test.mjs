import test from 'node:test';import assert from 'node:assert/strict';
globalThis.document??={createElement(){return {width:0,height:0,getContext(){return {imageSmoothingEnabled:false,createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},putImageData(){},drawImage(){},beginPath(){},ellipse(){},fill(){}};}};}};
const {CAST,paintGround,HD_TILE}=await import('../src/render/hd-art.js');const {figureSprite}=await import('../src/render/hd-figure.js');
const {hdCastFor,hdDirection}=await import('../src/render/hd-world.js');
const {MISSIONS}=await import('../src/data/missions.js');
test('B4: every figure renders in four facings and the walk cycle',()=>{for(const id of Object.keys(CAST))for(const facing of ['down','up','left','right'])for(const frame of [0,1,2,3,4])assert.ok(figureSprite(id,{facing,frame}));});
test('B4: movement direction picks the facing',()=>{assert.equal(hdDirection(1,0),'right');assert.equal(hdDirection(-.2,0),'left');assert.equal(hdDirection(0,-1),'up');assert.equal(hdDirection(0,1),'down');assert.equal(hdDirection(0,0,'up'),'up');});
test('B4: units map to distinct looks per mission',()=>{
 assert.equal(hdCastFor({id:'eric',team:'ally',level:1}),'eric');assert.equal(hdCastFor({id:'eric',team:'ally',level:5}),'eric_adv');
 assert.equal(hdCastFor({id:'boss',team:'enemy',kind:'captain'},1),'captain');assert.equal(hdCastFor({id:'boss',team:'enemy',kind:'captain'},4),'quartermaster');
 assert.equal(hdCastFor({id:'t1',team:'enemy',kind:'bandit',burns:'seal'},4),'torch');assert.equal(hdCastFor({id:'r1',team:'enemy',kind:'bandit'},4),'storeman');
 assert.equal(hdCastFor({id:'c1',team:'civilian',name:'부상한 Mira'},3),'mira');assert.equal(hdCastFor({id:'advisor',team:'civilian'}),'aide');assert.equal(hdCastFor({id:'aren',team:'commander'}),'aren');
 const looks=new Set([1,2,3,4].map(m=>hdCastFor({id:'b1',team:'enemy',kind:'bandit'},m)));assert.equal(looks.size,4);});
test('B4: every mission map paints at 48 px per tile',()=>{for(const m of Object.values(MISSIONS)){const {pix,objects}=paintGround(m.map,{theme:m.map.some(r=>r.includes('k'))?'fortress':''});assert.equal(pix.w,m.map[0].length*HD_TILE);assert.equal(pix.h,m.map.length*HD_TILE);assert.ok(Array.isArray(objects));}});
