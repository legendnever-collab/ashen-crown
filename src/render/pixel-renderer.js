import {MAP,WIDTH,HEIGHT} from '../data/game-data.js';
import {alive,movement,validTarget} from '../core/rules.js';
import {TILE,drawTile,drawSprite,pixel} from './art.js';
const rect=pixel;
export class BattleRenderer{
 constructor(canvas,getState,getUI){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;this.getUI=getUI;this.zoom=1;this.pan={x:0,y:0};this.camera={scale:1,x:0,y:0};this.effects=[];this.motion=new Map();this.frame=0;this.terrainCanvas=document.createElement('canvas');this.terrainCanvas.width=WIDTH*TILE;this.terrainCanvas.height=HEIGHT*TILE;const tc=this.terrainCanvas.getContext('2d');for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)drawTile(tc,MAP[y][x],x*TILE,y*TILE,y*WIDTH+x);this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.tick=this.tick.bind(this);requestAnimationFrame(this.tick);}
 resize(){const b=this.canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;this.canvas.width=Math.round(b.width*dpr);this.canvas.height=Math.round(b.height*dpr);this.dpr=dpr;this.w=b.width;this.h=b.height;this.ctx.imageSmoothingEnabled=false;}
 reset(){this.zoom=1;this.pan={x:0,y:0};}
 zoomBy(n){this.zoom=Math.max(.7,Math.min(2.4,this.zoom*n));this.clampPan();}
 clampPan(){this.pan.x=Math.max(-this.w*.6,Math.min(this.w*.6,this.pan.x));this.pan.y=Math.max(-this.h*.6,Math.min(this.h*.6,this.pan.y));}
 tileAt(px,py){const {scale,x,y}=this.camera;return {x:Math.floor((px-x)/scale/TILE),y:Math.floor((py-y)/scale/TILE)};}
 tileCenter(x,y){return {x:this.camera.x+(x+.5)*TILE*this.camera.scale,y:this.camera.y+(y+.5)*TILE*this.camera.scale};}
 ranges(){const s=this.getState(),ui=this.getUI(),u=s.units.find(u=>u.id===ui.selected);if(s.screen==='deployment'&&ui.mode==='deploy')return Array.from({length:30},(_,i)=>({x:1+i%10,y:7+Math.floor(i/10)}));if(s.screen!=='battle'||s.phase!=='player'||!u||!alive(u)||u.acted||ui.busy)return [];if(ui.mode==='move'&&!u.moved)return [...movement(s,u).costs.keys()].map(p=>{const [x,y]=p.split(',').map(Number);return {x,y};});if(!['attack','skill','rescue'].includes(ui.mode))return [];const cells=[];for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){const dummy={x,y,hp:1,team:ui.mode==='skill'&&['sain','eric'].includes(u.id)?'ally':ui.mode==='rescue'?'civilian':'enemy',id:'preview'};if(validTarget(s,u,dummy,ui.mode))cells.push({x,y});}return cells;}
 addEffects(events,duration=500){const now=performance.now();for(const e of events){if(e.type==='move'){this.motion.set(e.id,{path:e.path,start:now,duration:duration*Math.max(1,e.path.length-1)*.45});}else this.effects.push({...e,start:now,duration:Math.max(duration,900)});}}
 tick(now){this.draw(now);requestAnimationFrame(this.tick);}
 draw(now){const c=this.ctx,s=this.getState(),ui=this.getUI();if(!s)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.w,this.h);rect(c,'#172b2b',0,0,this.w,this.h);
  const top=this.w>720?34:8,bottom=30,usable=Math.max(1,this.h-top-bottom);const scale=Math.min((this.w-16)/(WIDTH*TILE),usable/(HEIGHT*TILE))*this.zoom,x=(this.w-WIDTH*TILE*scale)/2+this.pan.x,y=top+(usable-HEIGHT*TILE*scale)/2+this.pan.y;this.camera={scale,x,y};c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);c.imageSmoothingEnabled=false;
  c.drawImage(this.terrainCanvas,0,0);
  const selected=s.units.find(u=>u.id===ui.selected),deploy=s.screen==='deployment';
  if(deploy&&ui.mode==='deploy'){for(let ty=7;ty<10;ty++)for(let tx=1;tx<11;tx++){rect(c,'rgba(105,179,211,.16)',tx*TILE,ty*TILE,TILE,TILE);rect(c,'#77b7c0',tx*TILE,ty*TILE,TILE,2);}}
  if(s.screen==='battle'&&s.phase==='player'&&selected&&alive(selected)&&!selected.acted&&!ui.busy){
   if(ui.mode==='move'&&!selected.moved)for(const p of movement(s,selected).costs.keys()){const [tx,ty]=p.split(',').map(Number);rect(c,'rgba(109,182,218,.32)',tx*TILE+1,ty*TILE+1,60,60);rect(c,'#95cfdb',tx*TILE+1,ty*TILE+1,60,2);}
   else if(['attack','skill','rescue'].includes(ui.mode))for(let ty=0;ty<HEIGHT;ty++)for(let tx=0;tx<WIDTH;tx++){const dummy={x:tx,y:ty,hp:1,team:ui.mode==='skill'&&['sain','eric'].includes(selected.id)?'ally':ui.mode==='rescue'?'civilian':'enemy',id:'preview'};if(validTarget(s,selected,dummy,ui.mode)){rect(c,ui.mode==='rescue'||selected.id==='sain'&&ui.mode==='skill'?'rgba(125,211,150,.24)':'rgba(224,119,99,.27)',tx*TILE+1,ty*TILE+1,60,60);}}
  }
  if(s.turn===2&&s.screen==='battle')for(const tx of [0,11]){rect(c,'#e1af63',tx*TILE,0,TILE,3);rect(c,'#e1af63',tx*TILE,0,3,TILE);c.fillStyle='#ffdb87';c.font='bold 24px monospace';c.fillText('!',tx*TILE+28,34);}
  const actors=s.units.filter(u=>alive(u)).sort((a,b)=>a.y-b.y);for(const u of actors){let ux=u.x*TILE+32,uy=u.y*TILE+37,pose='idle';const m=this.motion.get(u.id);if(m){const p=Math.min(1,(now-m.start)/m.duration),step=p*(m.path.length-1),i=Math.min(m.path.length-2,Math.floor(step)),f=step-i;if(i>=0){ux=(m.path[i].x+(m.path[i+1].x-m.path[i].x)*f)*TILE+32;uy=(m.path[i].y+(m.path[i+1].y-m.path[i].y)*f)*TILE+37;}pose='walk';if(p>=1)this.motion.delete(u.id);}
   const effects=this.effects.filter(e=>e.id===u.id&&now-e.start<e.duration);if(effects.some(e=>e.type==='attack'))pose='attack';
   if(u.team==='ally'&&u.acted&&s.screen==='battle')c.globalAlpha=.5;
   rect(c,u.team==='ally'?'#72aabb':u.team==='enemy'?'#b15d56':'#ddc28b',ux-18,uy+24,36,3);
   if(ui.selected===u.id){c.strokeStyle='#fff0b8';c.lineWidth=2;c.strokeRect(u.x*TILE+1,u.y*TILE+1,60,60);rect(c,'#f4d695',ux-4,uy-37,8,4);}
   drawSprite(c,u,ux,uy,now,pose);c.globalAlpha=1;
   if(u.team!=='civilian'||u.hp<u.maxHP){rect(c,'#18242a',ux-23,uy-31,46,5);rect(c,u.team==='enemy'?'#cc7770':'#99c691',ux-22,uy-30,Math.max(1,Math.floor(44*u.hp/u.maxHP)),3);}
   if(effects.some(e=>['hit','critical'].includes(e.type))&&Math.floor(now/70)%2){rect(c,'rgba(255,224,192,.5)',ux-22,uy-25,40,47);}
  }
  if(ui.hover&&ui.hover.x>=0&&ui.hover.x<12&&ui.hover.y>=0&&ui.hover.y<10){c.strokeStyle='#e4ddbd';c.lineWidth=2;c.strokeRect(ui.hover.x*TILE+1,ui.hover.y*TILE+1,60,60);}
  this.effects=this.effects.filter(e=>now-e.start<e.duration);for(const e of this.effects){const u=s.units.find(u=>u.id===e.id);if(!u||e.type==='move'||e.type==='attack')continue;const age=(now-e.start)/e.duration;if(e.type==='death'){drawSprite(c,u,u.x*TILE+32,u.y*TILE+39,now,'death');}
   c.font=`bold ${e.type==='potential'?16:20}px monospace`;c.textAlign='center';c.fillStyle=e.type==='heal'?'#bdedac':e.type==='level'||e.type==='potential'?'#ffe4a0':e.type==='xp'?'#b4dfe3':'#fff1d2';c.strokeStyle='#172a30';c.lineWidth=2;const py=u.y*TILE-3-age*32-(e.type==='xp'?22:0);c.strokeText(e.text||'',u.x*TILE+32,py);c.fillText(e.text||'',u.x*TILE+32,py);c.textAlign='start';}
 }
}
