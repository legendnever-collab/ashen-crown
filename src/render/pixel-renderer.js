import {MAP,WIDTH,HEIGHT} from '../data/game-data.js';
import {alive,key,movement,validTarget} from '../core/rules.js';
export const TILE=32;
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function tree(c,x,y,variant=0){rect(c,'#172c29',x+6,y+8,19,18);rect(c,'#644c3f',x+14,y+22,4,9);rect(c,'#315b43',x+3,y+10,24,10);rect(c,'#427554',x+7,y+5,16,15);rect(c,'#5c8657',x+11,y+2,9,14);rect(c,'#263f35',x+5,y+19,22,4);rect(c,'#70945c',x+12,y+5,4,3);if(variant)rect(c,'#7f9a60',x+7,y+13,3,3);}
export function drawTile(c,type,x,y,index,time){
 rect(c,type==='f'?'#344d3c':type==='r'?'#927b58':type==='v'?'#82745c':type==='x'?'#474a45':'#566447',x,y,32,32);
 // A deterministic texture, no visual RNG consumes combat randomness.
 for(let k=0;k<6;k++){const px=x+(index*7+k*13)%30,py=y+(index*11+k*7)%30;rect(c,type==='r'?'#a58d66':type==='f'?'#46614c':'#657250',px,py,2+(k%2),1);}
 if(type==='r'){rect(c,'#74654f',x,y,1,32);if(index%3===0){rect(c,'#b7a282',x+13,y+7,6,3);rect(c,'#6c614e',x+14,y+10,6,1);}}
 if(type==='f')tree(c,x,y,index%2);
 if(type==='x'){rect(c,'#262f2d',x+3,y+7,27,23);rect(c,'#72726c',x+5,y+4,23,9);rect(c,'#a39d83',x+6,y+4,20,2);for(let k=0;k<3;k++)rect(c,'#5e635d',x+6+k*8,y+15,6,8);rect(c,'#9e9580',x+5,y+26,6,3);}
 if(type==='v'){rect(c,'#4b3a33',x+2,y+18,28,13);rect(c,'#bb9e70',x+6,y+15,21,14);rect(c,'#5d413b',x+2,y+9,28,8);rect(c,'#a56246',x+6,y+5,20,8);rect(c,'#bd7a51',x+9,y+3,14,6);rect(c,'#492e2e',x+14,y+22,6,9);rect(c,'#d4bb7d',x+9,y+18,3,4);rect(c,'#3b3936',x+24,y+3,3,9);
  const f=Math.floor(time/160+index)%3;rect(c,'#e19a4e',x+25,y+1-f,3,4);rect(c,'#f4d076',x+26,y+1-f,1,3);}
 rect(c,'rgba(16,24,23,.15)',x,y+31,32,1);
}
export function drawSprite(c,u,x,y,time=0,pose='idle',size=1){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(size,size);
 const bob=pose==='walk'?Math.floor(time/90)%2:pose==='idle'&&u.hp>0?Math.floor(time/650)%2:0;const shift=pose==='attack'?2:0;
 if(pose==='death'){c.globalAlpha=.45;c.translate(0,7);c.rotate(-Math.PI/2);}
 c.translate(shift,-bob);rect(c,'rgba(11,20,23,.5)',-10,11,21,4);
 const enemy=u.team==='enemy',civil=u.team==='civilian',color=enemy?u.kind==='captain'?'#9c5753':u.kind==='archer'?'#b29168':'#a87160':civil?'#b7a280':u.color;
 const dark=enemy?'#493b44':'#303e50',skin='#e6ba8b',hair=u.id==='lia'?'#745083':u.id==='elina'?'#ae784e':u.id==='sain'?'#dccbbb':u.id==='kai'?'#483c40':'#5b4640';
 // Boots and walking legs.
 rect(c,dark,-6,5,5,8);rect(c,dark,2,5,5,8);rect(c,'#202b35',-8,11+(pose==='walk'?bob:0),7,3);rect(c,'#202b35',2,11-(pose==='walk'?bob:0),7,3);
 rect(c,dark,-9,-4,17,13);rect(c,color,-7,-4,13,13);rect(c,enemy?'#d39779':'#d1ded0',-5,-3,3,8);rect(c,'#67583f',-7,6,13,2);
 rect(c,dark,-7,-14,13,11);rect(c,skin,-5,-12,9,8);rect(c,hair,-6,-15,11,5);rect(c,hair,3,-12,3,4);rect(c,'#273343',-3,-8,2,2);rect(c,'#273343',2,-8,2,2);rect(c,'#f5d5a0',-3,-11,3,2);
 rect(c,dark,-12,-2,5,7);rect(c,color,-11,-1,4,5);rect(c,skin,-11,3,3,4);rect(c,skin,7,-1,3,5);
 const bow=u.id==='elina'||u.kind==='archer',staff=u.id==='lia'||u.id==='sain';
 if(bow){rect(c,'#503f31',10,-11,2,21);rect(c,'#d4ab6e',12,-8,2,15);rect(c,'#e3c592',14,-3,1,6);rect(c,'#d8dbb5',10,-1,7,1);}
 else if(staff){rect(c,'#6b5341',9,-10,2,23);rect(c,'#ded58c',7,-13,6,4);rect(c,u.id==='lia'?'#df9be3':'#fff1b6',8,-17,4,5);rect(c,'#ffffff',9,-16,1,2);rect(c,color,-7,7,15,4);}
 else if(!civil){rect(c,'#b7c8cf',10,-12,2,17);rect(c,'#e4ecdf',10,-13,2,7);rect(c,'#d6b571',7,1,8,2);rect(c,'#423641',10,3,2,5);if(u.id==='eric'||u.kind==='captain'){rect(c,'#253e51',-15,-1,8,13);rect(c,enemy?'#b37a65':'#b1d2dd',-14,0,6,10);rect(c,'#e8d198',-12,1,2,9);rect(c,'#90a9ad',-6,-15,12,3);rect(c,'#c9dadd',-4,-16,8,2);}if(u.id==='kai'){rect(c,'#454351',-8,-14,15,3);rect(c,'#e49a71',-7,-11,2,5);}}
 if(u.guardTarget){rect(c,'#e1d093',-12,-22,24,2);rect(c,'#e1d093',-12,-22,2,8);rect(c,'#e1d093',10,-22,2,8);}
 c.restore();
}
export class BattleRenderer{
 constructor(canvas,getState,getUI){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;this.getUI=getUI;this.zoom=1;this.pan={x:0,y:0};this.camera={scale:1,x:0,y:0};this.effects=[];this.motion=new Map();this.frame=0;this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.tick=this.tick.bind(this);requestAnimationFrame(this.tick);}
 resize(){const b=this.canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;this.canvas.width=Math.round(b.width*dpr);this.canvas.height=Math.round(b.height*dpr);this.dpr=dpr;this.w=b.width;this.h=b.height;this.ctx.imageSmoothingEnabled=false;}
 reset(){this.zoom=1;this.pan={x:0,y:0};}
 zoomBy(n){this.zoom=Math.max(.7,Math.min(2.4,this.zoom*n));this.clampPan();}
 clampPan(){this.pan.x=Math.max(-this.w*.6,Math.min(this.w*.6,this.pan.x));this.pan.y=Math.max(-this.h*.6,Math.min(this.h*.6,this.pan.y));}
 tileAt(px,py){const {scale,x,y}=this.camera;return {x:Math.floor((px-x)/scale/32),y:Math.floor((py-y)/scale/32)};}
 tileCenter(x,y){return {x:this.camera.x+(x+.5)*32*this.camera.scale,y:this.camera.y+(y+.5)*32*this.camera.scale};}
 addEffects(events,duration=500){const now=performance.now();for(const e of events){if(e.type==='move'){this.motion.set(e.id,{path:e.path,start:now,duration:duration*Math.max(1,e.path.length-1)*.45});}else this.effects.push({...e,start:now,duration:Math.max(duration,900)});}}
 tick(now){this.draw(now);requestAnimationFrame(this.tick);}
 draw(now){const c=this.ctx,s=this.getState(),ui=this.getUI();if(!s)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.w,this.h);rect(c,'#172b2b',0,0,this.w,this.h);
  const top=this.w>720?76:65,bottom=48,usable=this.h-top-bottom;const scale=Math.min((this.w-32)/(WIDTH*32),usable/(HEIGHT*32))*this.zoom,x=(this.w-WIDTH*32*scale)/2+this.pan.x,y=top+(usable-HEIGHT*32*scale)/2+this.pan.y;this.camera={scale,x,y};c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);c.imageSmoothingEnabled=false;
  for(let ty=0;ty<HEIGHT;ty++)for(let tx=0;tx<WIDTH;tx++)drawTile(c,MAP[ty][tx],tx*32,ty*32,ty*WIDTH+tx,now);
  const selected=s.units.find(u=>u.id===ui.selected),deploy=s.screen==='deployment';
  if(deploy){for(let ty=7;ty<10;ty++)for(let tx=1;tx<11;tx++){rect(c,'rgba(105,179,211,.16)',tx*32,ty*32,32,32);rect(c,'#77b7c0',tx*32,ty*32,32,1);}}
  if(s.screen==='battle'&&s.phase==='player'&&selected&&alive(selected)&&!selected.acted&&!ui.busy){
   if(ui.mode==='move'&&!selected.moved)for(const p of movement(s,selected).costs.keys()){const [tx,ty]=p.split(',').map(Number);rect(c,'rgba(109,182,218,.32)',tx*32+1,ty*32+1,30,30);rect(c,'#95cfdb',tx*32+1,ty*32+1,30,1);}
   else for(let ty=0;ty<HEIGHT;ty++)for(let tx=0;tx<WIDTH;tx++){const dummy={x:tx,y:ty,hp:1,team:ui.mode==='skill'&&['sain','eric'].includes(selected.id)?'ally':ui.mode==='rescue'?'civilian':'enemy',id:'preview'};if(validTarget(s,selected,dummy,ui.mode)){rect(c,ui.mode==='rescue'||selected.id==='sain'&&ui.mode==='skill'?'rgba(125,211,150,.24)':'rgba(224,119,99,.27)',tx*32+1,ty*32+1,30,30);}}
  }
  if(s.turn===2&&s.screen==='battle')for(const tx of [0,11]){rect(c,'#e1af63',tx*32,0,32,2);rect(c,'#e1af63',tx*32,0,2,32);c.fillStyle='#ffdb87';c.font='bold 12px monospace';c.fillText('!',tx*32+14,17);}
  const actors=s.units.filter(u=>alive(u)).sort((a,b)=>a.y-b.y);for(const u of actors){let ux=u.x*32+16,uy=u.y*32+18,pose='idle';const m=this.motion.get(u.id);if(m){const p=Math.min(1,(now-m.start)/m.duration),step=p*(m.path.length-1),i=Math.min(m.path.length-2,Math.floor(step)),f=step-i;if(i>=0){ux=(m.path[i].x+(m.path[i+1].x-m.path[i].x)*f)*32+16;uy=(m.path[i].y+(m.path[i+1].y-m.path[i].y)*f)*32+18;}pose='walk';if(p>=1)this.motion.delete(u.id);}
   const effects=this.effects.filter(e=>e.id===u.id&&now-e.start<e.duration);if(effects.some(e=>e.type==='attack'))pose='attack';
   if(u.team==='ally'&&u.acted&&s.screen==='battle')c.globalAlpha=.5;
   rect(c,u.team==='ally'?'#72aabb':u.team==='enemy'?'#b15d56':'#ddc28b',ux-9,uy+12,18,2);
   if(ui.selected===u.id){c.strokeStyle='#fff0b8';c.lineWidth=1;c.strokeRect(u.x*32+1,u.y*32+1,30,30);rect(c,'#f4d695',ux-2,uy-22,5,3);}
   drawSprite(c,u,ux,uy,now,pose);c.globalAlpha=1;
   if(u.team!=='civilian'||u.hp<u.maxHP){rect(c,'#18242a',ux-12,uy-20,24,3);rect(c,u.team==='enemy'?'#cc7770':'#99c691',ux-11,uy-19,Math.max(1,Math.floor(22*u.hp/u.maxHP)),1);}
   if(effects.some(e=>['hit','critical'].includes(e.type))&&Math.floor(now/70)%2){rect(c,'rgba(255,224,192,.5)',ux-11,uy-15,23,27);}
  }
  if(ui.hover&&ui.hover.x>=0&&ui.hover.x<12&&ui.hover.y>=0&&ui.hover.y<10){c.strokeStyle='#e4ddbd';c.lineWidth=1;c.strokeRect(ui.hover.x*32+1,ui.hover.y*32+1,30,30);}
  this.effects=this.effects.filter(e=>now-e.start<e.duration);for(const e of this.effects){const u=s.units.find(u=>u.id===e.id);if(!u||e.type==='move'||e.type==='attack')continue;const age=(now-e.start)/e.duration;if(e.type==='death'){drawSprite(c,u,u.x*32+16,u.y*32+20,now,'death');}
   c.font=`bold ${e.type==='potential'?8:10}px monospace`;c.textAlign='center';c.fillStyle=e.type==='heal'?'#bdedac':e.type==='level'||e.type==='potential'?'#ffe4a0':e.type==='xp'?'#b4dfe3':'#fff1d2';c.strokeStyle='#172a30';c.lineWidth=2;const py=u.y*32-3-age*16-(e.type==='xp'?12:0);c.strokeText(e.text||'',u.x*32+16,py);c.fillText(e.text||'',u.x*32+16,py);c.textAlign='start';}
 }
}
