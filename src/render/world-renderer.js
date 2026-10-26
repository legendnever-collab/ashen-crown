// v0.5.0 world map of Erdia (D-052): painted base map (or a parchment fallback until the art is
// imported), faction tints for regions the story has met, site icons and Korean labels, the ACT I
// march route, and a travel animation from the previous hub to the new one.
import {WORLD_SIZE,CONTINENT,REGIONS,SITES,HUB_SITE,ACT1_ROUTE,FULL_ROUTE,siteById,routeReached,siteKnown} from '../data/world.js';
const WORLD_ART=typeof ASHEN_WORLD!=='undefined'?ASHEN_WORLD:null,worldImages=new Map();
function worldImage(id){if(!WORLD_ART?.[id])return null;let img=worldImages.get(id);if(!img){img=new Image();img.src=WORLD_ART[id];worldImages.set(id,img);}return img.complete&&img.naturalWidth?img:null;}
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const FOCUS={continent:{x:768,y:512,zoom:1},east:{x:1290,y:450,zoom:1.55},north:{x:800,y:260,zoom:1.45},west:{x:380,y:520,zoom:1.45}};
function poly(c,pts){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();}
function fallbackMap(c){
 c.fillStyle='#9fbfc9';c.fillRect(0,0,WORLD_SIZE.w,WORLD_SIZE.h);
 c.fillStyle='#e6d6ad';c.strokeStyle='#6b5838';c.lineWidth=4;poly(c,CONTINENT);c.fill();c.stroke();
 c.save();poly(c,CONTINENT);c.clip();
 c.fillStyle='rgba(255,255,255,.55)';for(let x=380;x<1150;x+=70){c.beginPath();c.moveTo(x,205);c.lineTo(x+30,150);c.lineTo(x+60,205);c.fill();}
 c.strokeStyle='#4f86a8';c.lineWidth=7;c.beginPath();c.moveTo(1300,160);c.bezierCurveTo(1290,250,1330,330,1300,420);c.bezierCurveTo(1270,500,1210,560,1120,600);c.bezierCurveTo(1000,650,900,600,800,560);c.bezierCurveTo(700,520,640,560,560,540);c.bezierCurveTo(470,520,380,560,230,600);c.stroke();
 c.fillStyle='rgba(70,110,60,.55)';for(const [x,y] of [[1220,430],[1245,415],[1265,440],[1240,455],[1200,455],[1280,415]]){c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.fill();}
 c.restore();
 c.fillStyle='rgba(200,200,200,.5)';c.fillRect(1495,140,41,600);
}
// world: {focus, from, to, card}; start: ms when the line appeared; campaign: for reveal/progress.
export function drawWorld(canvas,{campaign,world,time=performance.now(),start=time,hub}){
 const c=canvas.getContext('2d'),box=canvas.getBoundingClientRect(),width=Math.max(1,box.width||1024),height=Math.max(1,box.height||768),dpr=Math.min(2,window.devicePixelRatio||1);
 if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
 c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#0f1c20';c.fillRect(0,0,width,height);
 const t=ease((time-start)/1600),fit=Math.max(width/WORLD_SIZE.w,height/WORLD_SIZE.h)*(width<height?1:.98),base=Math.min(width/WORLD_SIZE.w,height/WORLD_SIZE.h);
 const target=FOCUS[world?.focus]||FOCUS.continent,from=world?.prev==='continent'?FOCUS.continent:target;
 const zoomOf=f=>f===FOCUS.continent?(width<height?base*1.05:base):fit*f.zoom*(width<height?1.1:1),z=zoomOf(from)+(zoomOf(target)-zoomOf(from))*t,cx=from.x+(target.x-from.x)*t,cy=from.y+(target.y-from.y)*t;
 const ox=Math.min(0,Math.max(width-WORLD_SIZE.w*z,width/2-cx*z)),oy=Math.min(0,Math.max(height-WORLD_SIZE.h*z,height/2-cy*z));
 c.save();c.translate(WORLD_SIZE.w*z<width?(width-WORLD_SIZE.w*z)/2:ox,WORLD_SIZE.h*z<height?(height-WORLD_SIZE.h*z)/2:oy);c.scale(z,z);
 const art=worldImage('world_map');if(art)c.drawImage(art,0,0,WORLD_SIZE.w,WORLD_SIZE.h);else fallbackMap(c);
 const camp=campaign||{completed:[]};
 for(const r of REGIONS){if(!r.shown(camp))continue;c.save();poly(c,r.poly);c.fillStyle=r.color+'38';c.fill();c.setLineDash([10,7]);c.lineWidth=3/z+1.5;c.strokeStyle=r.color+'cc';c.stroke();c.restore();
  c.save();c.font=`800 ${Math.round(26)}px "Ashen UI",sans-serif`;c.textAlign='center';c.lineWidth=5;c.strokeStyle='rgba(20,16,10,.65)';c.fillStyle='#fbf1d6';c.strokeText(r.name,...r.label);c.fillText(r.name,...r.label);c.restore();}
 // ACT I route: travelled part solid, rest dashed; travel animation along the leg from→to.
 // v0.6: once ACT I is complete the ACT II legs (oath camp → Ironhold → canyon → Velmar) join the route.
 const ROUTE=camp.choices?.m06_oath||(camp.completed||[]).includes(6)?FULL_ROUTE:ACT1_ROUTE,reached=routeReached(camp,hub||world?.to),pts=ROUTE.map(siteById);
 c.save();c.lineCap='round';c.lineJoin='round';
 c.strokeStyle='rgba(120,40,30,.45)';c.setLineDash([12,10]);c.lineWidth=4;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();
 c.setLineDash([]);c.strokeStyle='#c0392b';c.lineWidth=5;c.beginPath();pts.slice(0,reached+1).forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke();c.restore();
 for(const s of SITES){const known=siteKnown(s,camp);if(s.mission&&!s.icon){c.save();c.fillStyle='#1d140c';c.beginPath();c.arc(s.x,s.y,6,0,Math.PI*2);c.fill();c.fillStyle='#f3e3b0';c.font='700 13px "Ashen UI",sans-serif';c.textAlign='center';c.fillText('⚔',s.x,s.y-10);c.restore();}
  const img=s.icon&&worldImage(`icon_${s.icon}`),size=s.small?44:62;
  if(img)c.drawImage(img,s.x-size/2,s.y-size*.82,size,size);else if(s.icon){c.save();c.fillStyle=known?'#f3e3a4':'#cfc3a5';c.strokeStyle='#2b2118';c.lineWidth=3;c.fillRect(s.x-12,s.y-20,24,20);c.strokeRect(s.x-12,s.y-20,24,20);c.restore();}
  if(known&&!s.small){c.save();c.font='700 15px "Ashen UI",sans-serif';c.textAlign='center';const w=c.measureText(s.name).width+14;c.fillStyle='rgba(24,20,14,.72)';c.fillRect(s.x-w/2,s.y+6,w,21);c.fillStyle='#fbf1d6';c.fillText(s.name,s.x,s.y+22);c.restore();}}
 // Current position flag, moving along the travelled leg.
 const fromSite=world?.from&&siteById(HUB_SITE[world.from]),toSite=siteById(HUB_SITE[world?.to||hub]||'village');
 if(toSite){let x=toSite.x,y=toSite.y;if(fromSite&&t<1){const a=ROUTE.indexOf(fromSite.id),b=ROUTE.indexOf(toSite.id),leg=pts.slice(Math.min(a,b),Math.max(a,b)+1);if(a>b)leg.reverse();const lens=leg.slice(1).map((p,i)=>Math.hypot(p.x-leg[i].x,p.y-leg[i].y)),total=lens.reduce((a,b)=>a+b,0)||1;let d=total*t,i=0;while(i<lens.length-1&&d>lens[i]){d-=lens[i];i++;}const k=lens[i]?d/lens[i]:1;x=leg[i].x+(leg[i+1]?.x-leg[i].x||0)*k;y=leg[i].y+(leg[i+1]?.y-leg[i].y||0)*k;}
  const bob=Math.sin(time/300)*2;c.save();c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(x,y+2,10,4,0,0,Math.PI*2);c.fill();c.strokeStyle='#2b2118';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-46+bob);c.stroke();c.fillStyle='#8a8f96';c.beginPath();c.moveTo(x,y-46+bob);c.lineTo(x+30,y-38+bob);c.lineTo(x,y-28+bob);c.fill();c.fillStyle='#e8732c';c.beginPath();c.arc(x+11,y-37+bob,4,0,Math.PI*2);c.fill();c.restore();}
 c.restore();
 canvas.dataset.worldFocus=world?.focus||'continent';canvas.dataset.worldArt=art?'painted':'fallback';
}
