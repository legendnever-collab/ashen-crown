import {MapCamera,drawMinimap} from './camera.js';
import {drawBuilding,drawFire} from './world-art.js';
import {MAP,WIDTH,HEIGHT} from '../data/game-data.js';
import {missionOf} from '../data/missions.js';
import {alive,movement,validTarget} from '../core/rules.js';
import {TILE,drawTile,drawSprite,pixel,pixelOval} from './art.js';
import {RANGE_STYLE,moveDuration,motionAt,presentationPlan} from './animation.js';
import {drawCombatEffect,effectPhase} from './combat-effects.js';
import {rulesOf} from '../core/mission-rules.js';
import {hdGround,drawHDGround,drawHDObject,hdObjectKey,hdLayerBuildings,hdCovered,hdCastFor,drawHDFigure,hdDirection,HD_K} from './hd-world.js';
const rect=pixel;
export class BattleRenderer{
 constructor(canvas,getState,getUI){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;this.getUI=getUI;this.mapCamera=new MapCamera();this.zoom=1;this.pan={x:0,y:0};this.camera={scale:1,x:0,y:0};this.effects=[];this.motion=new Map();this.frame=0;this.terrainCanvas=document.createElement('canvas');this.terrainCanvas.width=WIDTH*TILE;this.terrainCanvas.height=HEIGHT*TILE;const tc=this.terrainCanvas.getContext('2d');for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)drawTile(tc,MAP[y][x],x*TILE,y*TILE,y*WIDTH+x);this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.tick=this.tick.bind(this);requestAnimationFrame(this.tick);}
 resize(){const b=this.canvas.getBoundingClientRect(),dpr=b.width<600?Math.max(1,window.devicePixelRatio||1):Math.max(2.1,window.devicePixelRatio||1);this.canvas.width=Math.round(b.width*dpr);this.canvas.height=Math.round(b.height*dpr);this.dpr=dpr;this.w=b.width;this.h=b.height;this.ctx.imageSmoothingEnabled=false;}
 clearPresentation(){this.effects=[];this.motion.clear();this.hpStart=null;this.hpEvents=[];this.visualUntil=0;this.lastWalk=null;this.lastPresentation=[];}
 reset(){this.pan={x:0,y:0};this.mapCamera.reset();const m=missionOf(this.getState()),base=this.w<600||this.h<300?40:64;this.zoom=Math.min(1,(this.w-12)/(m.width*base),(this.h-12)/(m.height*base));}
 focus(x,y){this.mapCamera.focus(x,y);this.pan={x:0,y:0};}
 zoomBy(n){this.zoom=Math.max(.35,Math.min(2.4,this.zoom*n));this.clampPan();}
 clampPan(){this.pan.x=Math.max(-this.w*.6,Math.min(this.w*.6,this.pan.x));this.pan.y=Math.max(-this.h*.6,Math.min(this.h*.6,this.pan.y));}
 tileAt(px,py){const {scale,x,y}=this.camera;return {x:Math.floor((px-x)/scale/TILE),y:Math.floor((py-y)/scale/TILE)};}
 tileCenter(x,y){return {x:this.camera.x+(x+.5)*TILE*this.camera.scale,y:this.camera.y+(y+.5)*TILE*this.camera.scale};}
 ranges(){const s=this.getState(),ui=this.getUI(),{width:WIDTH,height:HEIGHT}=missionOf(s),u=s.units.find(u=>u.id===ui.selected);if(s.screen==='deployment'&&ui.mode==='deploy')return Array.from({length:30},(_,i)=>({x:1+i%10,y:7+Math.floor(i/10)}));if(s.screen!=='battle'||s.phase!=='player'||!u||!alive(u)||u.acted||ui.busy)return [];if(['move','choose'].includes(ui.mode)&&!u.moved)return [...movement(s,u).costs.keys()].map(p=>{const [x,y]=p.split(',').map(Number);return {x,y};});if(!['attack','skill','rescue','capture'].includes(ui.mode))return [];const cells=[];for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){const dummy={x,y,hp:1,team:ui.mode==='skill'&&['sain','eric'].includes(u.id)?'ally':ui.mode==='rescue'?'civilian':ui.mode==='search'?'object':'enemy',id:ui.mode==='capture'?'boss':'preview'};if(validTarget(s,u,dummy,ui.mode))cells.push({x,y});}return cells;}
 walk(id,path,movement='step',speed=1){const duration=moveDuration(path,movement,speed);this.lastWalk={id,path:structuredClone(path),movement,speed,duration};if(duration)this.motion.set(id,{path,start:performance.now(),duration,movement,speed});else this.motion.delete(id);return duration;}
 displayHP(u,now=performance.now()){if(!this.hpStart||now>=this.visualUntil)return u.hp;let hp=this.hpStart.get(u.id)??u.hp;for(const e of this.hpEvents||[])if(e.id===u.id&&now>=e.at)hp=e.hp;return hp;}
 addEffects(events,before,settings){const now=performance.now(),plan=presentationPlan(events,this.getState().units,settings);this.hpStart=new Map(before.units.map(u=>[u.id,u.hp]));this.hpEvents=plan.hp.map(e=>({...e,at:now+e.delay}));this.visualUntil=now+plan.duration;this.reduced=settings.reduced;this.effects=plan.plans.map(e=>({...e,start:now+e.delay}));this.lastPresentation=plan.plans.filter(e=>e.type==='attack').map(e=>({id:e.id,target:e.target,kind:e.kind,counter:!!e.counter}));for(const m of plan.motions)this.motion.set(m.id,{...m,start:now+m.delay});return plan.duration;}
 diagnostics(now=performance.now()){return {motion:[...this.motion].map(([id,m])=>({id,...motionAt(m.path,now-m.start,m.movement,m.speed)})),active:this.effects.filter(e=>now>=e.start&&now<e.start+e.duration).map(e=>({type:e.type,kind:e.kind,phase:e.kind?effectPhase(e,now):'feedback',id:e.id,target:e.target})),lastWalk:this.lastWalk||null,lastPresentation:this.lastPresentation||[],rangeStyle:RANGE_STYLE};}
 tick(now){this.draw(now);requestAnimationFrame(this.tick);}
 draw(now){const c=this.ctx,s=this.getState(),ui=this.getUI();if(!s||!['battle','deployment','result','title'].includes(s.screen))return;const {width:WIDTH,height:HEIGHT}=missionOf(s);c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.w,this.h);rect(c,'#172b2b',0,0,this.w,this.h);
  if(this.mapId!==s.missionId){this.mapId=s.missionId;const m=missionOf(s),map=m.id===3?m.map.map(r=>r.map(t=>t==='x'?'w':t)):m.map;this.hd=hdGround('m'+m.id,map,map.some(r=>r.includes('k'))?'fortress':'');this.hdCovered=hdCovered(m.layers.buildings);this.facing=new Map();this.lastPos=new Map();}
  const follow=ui.pendingMove||s.units.find(u=>u.id===ui.selected);if(this.mapCamera.key!==String(s.missionId)){this.mapCamera.layout(this.w,this.h,WIDTH,HEIGHT,{key:String(s.missionId),follow});}this.mapCamera.zoom=this.zoom;this.mapCamera.offset={...this.pan};const camera=this.mapCamera.layout(this.w,this.h,WIDTH,HEIGHT,{key:String(s.missionId),follow});this.camera=camera;const {x,y,scale}=camera;c.translate(x,y);c.scale(scale,scale);c.imageSmoothingEnabled=false;
  drawHDGround(c,this.hd);
  const selected=s.units.find(u=>u.id===ui.selected),deploy=s.screen==='deployment';
  if(deploy&&ui.mode==='deploy'){for(let ty=7;ty<10;ty++)for(let tx=1;tx<11;tx++){rect(c,RANGE_STYLE.move.fill,tx*TILE,ty*TILE,TILE,TILE);rect(c,RANGE_STYLE.move.border,tx*TILE,ty*TILE,TILE,2);}}
  if(s.screen==='battle'&&s.phase==='player'&&selected&&alive(selected)&&!selected.acted&&!ui.busy){
   if(['move','choose'].includes(ui.mode)&&!selected.moved)for(const p of movement(s,selected).costs.keys()){const [tx,ty]=p.split(',').map(Number);rect(c,RANGE_STYLE.move.fill,tx*TILE+1,ty*TILE+1,60,60);rect(c,RANGE_STYLE.move.border,tx*TILE+1,ty*TILE+1,60,2);}
   else if(['attack','skill','rescue','capture'].includes(ui.mode))for(let ty=0;ty<HEIGHT;ty++)for(let tx=0;tx<WIDTH;tx++){const dummy={x:tx,y:ty,hp:1,team:ui.mode==='skill'&&['sain','eric'].includes(selected.id)?'ally':ui.mode==='rescue'?'civilian':ui.mode==='search'?'object':'enemy',id:ui.mode==='capture'?'boss':'preview'};if(validTarget(s,selected,dummy,ui.mode)){rect(c,ui.mode==='rescue'||selected.id==='sain'&&ui.mode==='skill'?RANGE_STYLE.support.fill:RANGE_STYLE.attack.fill,tx*TILE+1,ty*TILE+1,60,60);}}
  }
  const lion=rulesOf(s);if(lion?.auraCells&&s.screen==='battle'){for(const p of lion.auraCells(s)){if(p.x<0||p.y<0||p.x>=WIDTH||p.y>=HEIGHT)continue;rect(c,'rgba(201,162,74,.16)',p.x*TILE,p.y*TILE,TILE,TILE);c.strokeStyle='rgba(232,198,110,.55)';c.lineWidth=1;c.setLineDash([4,4]);c.strokeRect(p.x*TILE+2,p.y*TILE+2,TILE-4,TILE-4);c.setLineDash([]);}}
  for(const k of Object.keys(s.burning||{})){const [fx,fy]=k.split(',').map(Number);rect(c,'rgba(226,108,48,.28)',fx*TILE,fy*TILE,TILE,TILE);drawFire(c,fx*TILE+32,fy*TILE+44,now,.78);}
  if(s.turn===2&&s.screen==='battle')for(const spawn of missionOf(s).reinforcements){const sx=spawn.x*TILE,sy=spawn.y*TILE;rect(c,'#e1af63',sx,sy,TILE,3);rect(c,'#e1af63',sx,sy,3,TILE);c.fillStyle='#ffdb87';c.font='bold 24px monospace';c.fillText('!',sx+28,sy+34);}
  const threatIds=new Set(s.screen==='battle'&&s.phase==='player'&&lion?.threats?lion.threats(s):[]);
  const drawables=[];const stateOf=b=>s.screen==='result'&&s.outcome==='victory'?'burned':b.state;
  for(const o of this.hd.objects){if(o.kind==='house'&&this.hdCovered.has((o.x/48)+','+(o.y/48-1)))continue;drawables.push({key:hdObjectKey(o),draw:()=>drawHDObject(c,o,now)});}
  for(const o of hdLayerBuildings(missionOf(s).layers.buildings,stateOf))drawables.push({key:hdObjectKey(o),draw:()=>drawHDObject(c,o,now)});
  for(const o of s.units.filter(u=>u.team==='object'&&u.rescued&&!u.evidence)){const ox=o.x*TILE+32,oy=o.y*TILE+37;drawables.push({key:oy+27.5,draw:()=>drawMissionObject(c,o,ox,oy,now)});}
  const actors=s.units.filter(u=>(alive(u)||this.displayHP(u,now)>0)&&!u.rescued);for(const u of actors){let ux=u.x*TILE+32,uy=u.y*TILE+37,pose='idle';let facing=this.facing.get(u.id);if(!facing){const foes=s.units.filter(v=>alive(v)&&(u.team==='enemy'?v.team==='ally':v.team==='enemy'));const t=foes.sort((a,b)=>Math.abs(a.x-u.x)+Math.abs(a.y-u.y)-Math.abs(b.x-u.x)-Math.abs(b.y-u.y))[0];facing=t?hdDirection(t.x-u.x,t.y-u.y,'down'):'down';}const m=this.motion.get(u.id);if(m){const p=motionAt(m.path,now-m.start,m.movement,m.speed),prev=this.lastPos.get(u.id);if(prev)facing=hdDirection(p.x-prev.x,p.y-prev.y,facing);this.lastPos.set(u.id,{x:p.x,y:p.y});ux=p.x*TILE+32;uy=p.y*TILE+37;pose=p.done?'idle':'walk';if(p.done&&!ui.pendingMove){this.motion.delete(u.id);this.lastPos.delete(u.id);}}else if(ui.pendingMove?.id===u.id){ux=ui.pendingMove.x*TILE+32;uy=ui.pendingMove.y*TILE+37;const path=ui.pendingMove.path||[];if(path.length>1){const a=path[path.length-2],b=path[path.length-1];facing=hdDirection(b.x-a.x,b.y-a.y,facing);}}
   const effects=this.effects.filter(e=>e.id===u.id&&now>=e.start&&now-e.start<e.duration),atk=effects.find(e=>e.type==='attack');if(atk){pose='attack';const t=s.units.find(v=>v.id===atk.target);if(t&&t.id!==u.id)facing=hdDirection(t.x-u.x,t.y-u.y,facing);}
   this.facing.set(u.id,facing);
   drawables.push({key:uy+27.5,draw:()=>{
   if(u.team==='ally'&&u.acted&&s.screen==='battle')c.globalAlpha=.5;
   c.fillStyle=u.team==='ally'?'rgba(80,160,255,.5)':u.team==='enemy'?'rgba(230,70,60,.5)':u.team==='object'?'rgba(233,196,106,.5)':'rgba(240,210,110,.55)';c.beginPath();c.ellipse(ux,uy+23,17,5.5,0,0,Math.PI*2);c.fill();
   if(ui.selected===u.id){c.strokeStyle='#fff0b8';c.lineWidth=2;c.strokeRect(ux-31,uy-36,60,60);rect(c,'#f4d695',ux-4,uy-37,8,4);}
   if(u.team==='object')(u.evidence?drawEvidence:drawMissionObject)(c,u,ux,uy,now);else{c.fillStyle='rgba(20,24,30,.3)';c.beginPath();c.ellipse(ux,uy+23,13,4,0,0,Math.PI*2);c.fill();drawHDFigure(c,hdCastFor(u,s.missionId),ux,uy+24,{facing,pose,frame:pose==='walk'?1+Math.floor(now/120)%4:(u.team==='ally'&&u.acted)||u.team==='civilian'||s.screen!=='battle'?0:1+Math.floor((now+u.x*97+u.y*53)/280)%4});}c.globalAlpha=1;
   if(threatIds.has(u.id)&&Math.floor(now/400)%2){c.fillStyle='#e8594a';c.beginPath();c.moveTo(ux-9,uy-50);c.lineTo(ux+9,uy-50);c.lineTo(ux,uy-38);c.closePath();c.fill();c.fillStyle='#fff2d0';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText('!',ux,uy-41);c.textAlign='start';}
   if(u.guarding&&!u.guardUsed){rect(c,'#2a3a44',ux+12,uy-44,13,15);rect(c,'#e7c783',ux+13,uy-43,11,13);rect(c,'#3f7fa3',ux+15,uy-41,7,9);}
   if(u.team!=='object'&&(u.team!=='civilian'||u.hp<u.maxHP)){rect(c,'#18242a',ux-23,uy+27,46,5);rect(c,u.team==='enemy'?'#e8594a':u.team==='civilian'?'#f0cf6a':'#5fd38a',ux-22,uy+28,Math.max(1,Math.floor(44*this.displayHP(u,now)/u.maxHP)),3);}
   if(effects.some(e=>['hit','critical'].includes(e.type))&&Math.floor(now/70)%2){rect(c,'rgba(255,224,192,.5)',ux-22,uy-40,44,62);}
   }});
  }
  drawables.sort((a,b)=>a.key-b.key);for(const d of drawables)d.draw();
  if(ui.pendingMove){for(const [i,p] of ui.pendingMove.path.entries()){rect(c,i===ui.pendingMove.path.length-1?'#ffe5a0':'#d2ebdf',p.x*TILE+28,p.y*TILE+29,8,5);}c.strokeStyle='#ffe0a2';c.lineWidth=3;c.strokeRect(ui.pendingMove.x*TILE+2,ui.pendingMove.y*TILE+2,60,60);}
  if(ui.hover&&ui.hover.x>=0&&ui.hover.x<WIDTH&&ui.hover.y>=0&&ui.hover.y<HEIGHT){c.strokeStyle='#e4ddbd';c.lineWidth=2;c.strokeRect(ui.hover.x*TILE+1,ui.hover.y*TILE+1,60,60);}
  this.effects=this.effects.filter(e=>now<e.start+e.duration);for(const e of this.effects){const u=s.units.find(u=>u.id===e.id);if(!u||now<e.start||e.type==='move')continue;if(e.type==='attack'){drawCombatEffect(c,e,s.units,now,this.reduced);continue;}const age=(now-e.start)/e.duration;if(e.type==='heal'||e.type==='guard'){const radius=8+age*22;pixelOval(c,e.type==='heal'?'rgba(147,219,164,.35)':'rgba(151,205,237,.35)',u.x*TILE+32,u.y*TILE+32,radius,radius/2);}if(e.type==='death'){drawHDFigure(c,hdCastFor(u,s.missionId),u.x*TILE+32,u.y*TILE+61,{pose:'death',facing:this.facing?.get(u.id)||'down'});}
   c.font=`bold ${e.type==='potential'?16:20}px monospace`;c.textAlign='center';c.fillStyle=e.type==='heal'?(e.resource==='mp'?'#b4dfe3':'#bdedac'):e.type==='level'||e.type==='potential'?'#ffe4a0':e.type==='xp'?'#b4dfe3':'#fff1d2';c.strokeStyle='#172a30';c.lineWidth=2;const py=u.y*TILE-3-age*32-(e.type==='xp'?22:0)-(e.resource==='mp'?22:0);c.strokeText(e.text||'',u.x*TILE+32,py);c.fillText(e.text||'',u.x*TILE+32,py);c.textAlign='start';}const mini=document.querySelector('#battle-minimap');if(mini)drawMinimap(mini,missionOf(s).map,s.units,camera,s.units.filter(u=>u.team==='civilian'||u.team==='object'||u.id==='boss'));this.canvas.dataset.backingPixels=String(this.canvas.width*this.canvas.height);if(this.onCamera)this.onCamera();
 }
}
// M06 mission objects (original): rune seal stones, the side-gate lever and the side gate itself.
function drawMissionObject(c,u,x,y,now){const done=u.rescued,glow=.5+.3*Math.sin(now/300+u.x);
 if(u.kind==='sealstone'){c.fillStyle='rgba(20,24,30,.35)';c.beginPath();c.ellipse(x,y+22,15,5,0,0,Math.PI*2);c.fill();
  if(done){rect(c,'#3c3f48',x-13,y+8,12,14);rect(c,'#4c505a',x+2,y+2,11,20);rect(c,'#5d616c',x-13,y+8,12,2);rect(c,'#6a6f7a',x+2,y+2,11,2);rect(c,'#9fd1e6',x-2,y+12,3,3);return;}
  rect(c,'#2e3038',x-13,y-26,26,48);rect(c,'#4a4d58',x-12,y-25,24,46);rect(c,'#5d616c',x-12,y-25,24,3);rect(c,'#3c3f48',x+8,y-22,4,43);
  const rune=u.locked?`rgba(170,120,230,${.35+glow*.4})`:u.progress?`rgba(150,220,255,${.5+glow*.4})`:`rgba(240,200,110,${.45+glow*.4})`;c.fillStyle=rune;for(const [a,b,w,h]of[[-2,-18,4,14],[-7,-12,14,3],[-6,0,12,3],[-2,4,4,10]])c.fillRect(x+a,y+b,w,h);
  if(u.progress){rect(c,'#e9f6ff',x-12,y-2,24,2);}
  if(!u.locked){c.fillStyle=`rgba(240,200,110,${glow*.25})`;c.fillRect(x-20,y-30,40,56);}return;}
 if(u.kind==='lever'){c.fillStyle='rgba(20,24,30,.35)';c.beginPath();c.ellipse(x,y+20,13,4,0,0,Math.PI*2);c.fill();rect(c,'#5a5c5a',x-12,y+8,24,12);rect(c,'#7c7f7c',x-12,y+8,24,2);
  c.save();c.translate(x,y+10);c.rotate(done?.8:-.8);rect(c,'#3a281a',-2,-24,4,24);rect(c,'#c9a24a',-4,-28,8,6);c.restore();
  if(!done){c.fillStyle=`rgba(240,206,120,${glow*.4})`;c.fillRect(x-18,y-22,36,46);}return;}
 if(u.kind==='gate'){if(done){rect(c,'#4a3424',x-30,y-26,8,48);rect(c,'#4a3424',x+22,y-26,8,48);return;}
  rect(c,'#3a281a',x-30,y-30,60,54);for(let i=0;i<5;i++)rect(c,i%2?'#6b4a30':'#5a3e28',x-28+i*11.5,y-28,11,50);rect(c,'#8a8f94',x-30,y-14,60,4);rect(c,'#8a8f94',x-30,y+8,60,4);return;}
 drawEvidence(c,u,x,y,now);}
// Original evidence markers: a strapped document chest with a pulsing seal glow (no external art).
function drawEvidence(c,u,x,y,now){const glow=.45+.25*Math.sin(now/320+u.x);c.fillStyle=`rgba(240,206,120,${glow*.45})`;c.fillRect(x-22,y-6,44,30);
 const box=u.evidence==='ledger'?'#7a5534':u.evidence==='seal'?'#4f4a78':'#6d4a3b';rect(c,'#2a1d16',x-17,y-2,34,24);rect(c,box,x-16,y-1,32,22);rect(c,'#b98d52',x-16,y+6,32,3);rect(c,'#b98d52',x-3,y-1,6,22);
 rect(c,'#efe2bf',x-11,y-9,22,9);rect(c,'#c9b48a',x-11,y-2,22,2);rect(c,u.evidence==='seal'?'#9fd1e6':'#c8473d',x-3,y-7,6,5);rect(c,'#fff4d0',x-1,y-6,2,2);}
