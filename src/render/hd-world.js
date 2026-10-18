// B4 rollout: bridges the 48-pixel original art in hd-art.js to the 64-unit world coordinates
// used by every renderer, hit test and camera. Art is pre-scaled ×3 (nearest) once and drawn
// with smoothing so the 4/3 world ratio never produces uneven pixel widths.
import {wagonSprite,outpostSprite,HD_TILE,paintGround,treeSprite,bushSprite,ruinSprite,cragSprite,houseSprite,bridgeSprite,wellSprite,townBuildingSprite,CAST} from './hd-art.js';
import {figureSprite,FIG_FOOT} from './hd-figure.js';
import {appearanceFor} from '../data/appearances.js';
export const HD_K=64/HD_TILE,HD_UP=3;
const hdUpCache=new WeakMap();
export function hdUp(src){let out=hdUpCache.get(src);if(out)return out;out=document.createElement('canvas');out.width=src.width*HD_UP;out.height=src.height*HD_UP;const g=out.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(src,0,0,out.width,out.height);hdUpCache.set(src,out);return out;}
// draw an hd-art canvas at hd-art pixel coordinates (ax,ay) converted to world units
function hdBlit(c,src,wx,wy){const up=hdUp(src),smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(up,wx,wy,src.width*HD_K,src.height*HD_K);c.imageSmoothingEnabled=smooth;}

// ---------- terrain ----------
const hdGroundCache=new Map();
// bake(o) → true draws that decor into the ground once (static scenery no actor can stand behind)
export function hdGround(key,map,theme='',bake=null){if(hdGroundCache.has(key))return hdGroundCache.get(key);const {pix,objects}=paintGround(map,{theme}),base=pix.canvas(),kept=[];if(bake){const g=base.getContext('2d');g.imageSmoothingEnabled=false;const baked=objects.filter(o=>bake(o)).sort((a,b)=>(a.key??a.y)-(b.key??b.y));for(const o of baked)drawHDObjectRaw(g,o);for(const o of objects)if(!baked.includes(o))kept.push(o);}else kept.push(...objects);const g={canvas:hdUp(base),objects:kept,width:map[0].length,height:map.length};hdGroundCache.set(key,g);if(hdGroundCache.size>6)hdGroundCache.delete(hdGroundCache.keys().next().value);return g;}
// same decor drawn at native hd-art scale (for baking)
function drawHDObjectRaw(g,o){if(o.kind==='tree'){const size=Math.round(o.size*20)/20,s=treeSprite(o.seed%9,size);g.fillStyle='rgba(20,24,30,.32)';g.beginPath();g.ellipse(o.x,o.y-2,11*size,3.5*size,0,0,Math.PI*2);g.fill();g.drawImage(s,Math.round(o.x-20),Math.round(o.y-s.height+3));}else if(o.kind==='bush'){g.drawImage(bushSprite(o.seed%5),o.x-12,o.y-14);}}
// Ground is resampled once per device scale, so each frame is a 1:1 blit (software renderers
// otherwise filter the whole map every frame).
export function drawHDGround(c,g){const t=c.getTransform(),scale=Math.abs(t.a),w=Math.max(1,Math.round(g.width*64*scale)),h=Math.max(1,Math.round(g.height*64*scale));
 if(!g.device||g.device.width!==w||g.device.height!==h){if(w*h>36e6){const smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(g.canvas,0,0,g.width*64,g.height*64);c.imageSmoothingEnabled=smooth;return;}const d=g.device||document.createElement('canvas');d.width=w;d.height=h;const dc=d.getContext('2d');dc.imageSmoothingEnabled=true;dc.imageSmoothingQuality='high';dc.drawImage(g.canvas,0,0,w,h);g.device=d;}
 c.save();c.setTransform(1,0,0,1,Math.round(t.e),Math.round(t.f));c.imageSmoothingEnabled=false;c.drawImage(g.device,0,0);c.restore();}
// world-space sort key (feet / base line) for decor objects
export const hdObjectKey=o=>o.key!=null?o.key*HD_K:o.y*HD_K;
const shadowAt=(c,x,y,w,h)=>{c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();};
export function drawHDObject(c,o,time=0){const K=HD_K;
 if(o.kind==='tree'){const size=Math.round(o.size*20)/20,s=treeSprite(o.seed%9,size);shadowAt(c,o.x*K,(o.y-2)*K,11*size*K,3.5*size*K);hdBlit(c,s,(o.x-20)*K,(o.y-s.height+3)*K);}
 if(o.kind==='bush'){shadowAt(c,o.x*K,o.y*K,9*K,3*K);hdBlit(c,bushSprite(o.seed%5),(o.x-12)*K,(o.y-14)*K);}
 if(o.kind==='ruin')hdBlit(c,ruinSprite(o.seed%4),o.x*K,(o.y-40)*K);
 if(o.kind==='crag'){shadowAt(c,(o.x+24)*K,(o.y-3)*K,20*K,5*K);hdBlit(c,cragSprite(o.seed%3),o.x*K,(o.y-56)*K);}
 if(o.kind==='bridge')hdBlit(c,bridgeSprite(o.map,o.tx,o.ty),o.x*K,o.y*K);
 if(o.kind==='well')hdBlit(c,wellSprite(),o.x*K,(o.y-48)*K);
 if(o.kind==='outpost'){shadowAt(c,(o.x+24)*K,(o.y-4)*K,20*K,5*K);hdBlit(c,outpostSprite(),o.x*K,(o.y-56)*K);}
 if(o.kind==='house'){const s=houseSprite(o.seed%6,o.w||1,o.h||1,o.state||'intact');c.fillStyle='rgba(20,24,30,.28)';c.fillRect((o.x+6)*K,(o.y-4)*K,(s.width-4)*K,6*K);hdBlit(c,s,o.x*K,(o.y-s.height+2)*K);if(o.state==='burning')hdHouseFire(c,o.x*K,(o.y-s.height+2)*K,s.width*K,(o.w||1),time);}
}
export function hdHouseFire(c,x,y,w,tiles,time){for(let i=0;i<tiles*2;i++){const fx=x+16+i*(w-28)/Math.max(1,tiles*2-1),fy=y+22+(i%2)*10;for(let k=0;k<5;k++){const ph=time/120+k*1.7+i,h=(13+8*Math.sin(ph)),wd=5;c.fillStyle=k%2?'#ffcf6a':'#f07a32';c.fillRect(Math.round(fx-10+k*5),Math.round(fy-h),wd,Math.round(h));}c.fillStyle='#fff2b0';c.fillRect(Math.round(fx-2),Math.round(fy-10),5,6);}
 for(let i=0;i<7;i++){const r=Math.round(5+i*1.8),px=Math.round(x+w/2-6+i*4+Math.sin(i*1.3+time/500)*4),py=Math.round(y-4-i*10-(time/40)%10);c.fillStyle=`rgba(70,66,72,${Math.max(0,.30-i*.035)})`;c.fillRect(px-r,py-r+2,r*2,r*2-4);c.fillRect(px-r+2,py-r,r*2-4,r*2);}}
// M01 layer buildings: one-wide buildings become stacked cottages, wider ones a single house
export function hdLayerBuildings(buildings,stateOf){const out=[];for(const b of buildings){const st=stateOf(b);if(b.w===1){for(let j=0;j<b.h;j++)out.push({kind:'house',x:b.x*HD_TILE,y:(b.y+j+1)*HD_TILE,w:1,h:1,state:j===0?st:st==='burning'?'intact':st,seed:b.x*5+(b.y+j)*11});}else out.push({kind:'house',x:b.x*HD_TILE,y:(b.y+b.h)*HD_TILE,w:b.w,h:b.h,state:st,seed:b.x*5+b.y*11});}return out;}
export const hdCovered=buildings=>{const set=new Set();for(const b of buildings)for(let j=0;j<b.h;j++)for(let i=0;i<b.w;i++)set.add((b.x+i)+','+(b.y+j));return set;};
export function drawTownBuilding(c,b,tone,state){const s=townBuildingSprite(b,tone,state),K=HD_K,x=b.x*64,bottom=(b.y+b.h)*64;c.fillStyle='rgba(12,24,24,.35)';c.beginPath();c.ellipse(x+b.w*32+6,bottom-3,b.w*32+6,10,0,0,Math.PI*2);c.fill();hdBlit(c,s,x,bottom-s.height*K+2*K);
 if(b.label){c.font='bold 11px sans-serif';c.textAlign='center';const tx=x+b.w*32,ty=bottom-s.height*K+28*K;const w=c.measureText(b.label).width+10;c.fillStyle='rgba(30,22,16,.78)';c.fillRect(tx-w/2,ty-11,w,15);c.fillStyle='#f2ddb0';c.fillText(b.label,tx,ty);c.textAlign='left';}}

// ---------- figures ----------
const ENEMY_LOOK={6:{bandit:'pursuer',archer:'pursuerArcher',captain:'pursuerCaptain'},5:{lion:'lion',bearer:'bearer',spear:'ironSpear',archer:'ironArcher',cavalry:'cavalry',captain:'lion'},1:{bandit:'bandit',archer:'archer',captain:'captain'},2:{bandit:'deserter',archer:'archer',captain:'deserterCaptain'},3:{bandit:'pursuer',archer:'pursuerArcher',captain:'pursuerCaptain'},4:{bandit:'fortGuard',archer:'fortArcher',captain:'quartermaster'}};
export function hdCastFor(u,missionId=1){
 if(CAST[u.id]&&u.team!=='enemy')return u.id==='eric'&&appearanceFor(u)?.tier>=2?'eric_adv':u.id;
 if(u.team==='commander'||u.id==='aren')return 'aren';
 if(u.id==='advisor')return 'aide';
 if(u.kind==='wagon')return 'wagon';
 if(u.kind==='beacon')return 'beacon';
 if(missionId===6&&u.team==='enemy'&&/^g\d/.test(u.id))return 'fortGuard';
 if(missionId===6&&u.id==='i1')return 'quartermaster';
 if(u.team==='civilian'){const n=String(u.name||'');return /Mira/.test(n)?'mira':/Tomas/.test(n)?'farmer':CAST[u.id]?u.id:'refugee';}
 if(u.burns)return 'torch';
 if(missionId===4&&/^r\d/.test(u.id))return 'storeman';
 return (ENEMY_LOOK[missionId]||ENEMY_LOOK[1])[u.kind]||'bandit';
}
// draws a figure with its feet at world (x, footY); pose 'attack' leans toward the facing.
export function drawHDFigure(c,castId,x,footY,{facing='down',frame=0,pose='idle',alpha=1}={}){
 if(castId==='beacon'){drawBeacon(c,x,footY,pose==='death',alpha);return;}
 if(castId==='wagon'){const w=wagonSprite();c.save();c.globalAlpha*=pose==='death'?.4:alpha;hdBlit(c,w,x-24*HD_K,footY-50*HD_K);c.restore();return;}
 const s=figureSprite(castId,{facing,frame}),K=HD_K,lean=pose==='attack'?{left:[-6,0],right:[6,0],up:[0,-6],down:[0,5]}[facing]:[0,0];
 c.save();c.globalAlpha*=alpha;if(pose==='death'){c.globalAlpha*=.45;c.translate(x,footY-8);c.rotate(-Math.PI/2);hdBlit(c,s,-24*K,-FIG_FOOT*K);c.restore();return;}
 hdBlit(c,s,x-24*K+lean[0],footY-FIG_FOOT*K+lean[1]);c.restore();}
export const hdDirection=(dx,dy,fallback='down')=>Math.abs(dx)<.001&&Math.abs(dy)<.001?fallback:Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');

// M06 watchtower beacon (original): stone brazier on a timber stand; the fire animates, a fallen beacon smokes.
function drawBeacon(c,x,footY,dead,alpha=1){const t=performance.now(),K=HD_K;c.save();c.globalAlpha*=alpha;const y=footY,R=(col,a,b,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x+a*K),Math.round(y+b*K),Math.round(w*K),Math.round(h*K));};
 c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y-2,16*K,4*K,0,0,Math.PI*2);c.fill();
 for(const dx of [-11,8])R('#5a3e28',dx,-30,3,30);R('#6e4c30',-12,-18,24,3);R('#3a281a',-12,-16,24,1);
 R('#6b6d6a',-13,-38,26,9);R('#8c8f8a',-13,-38,26,2);R('#45474a',-13,-31,26,2);R('#5a5c5a',-9,-29,18,2);
 if(dead){for(let i=0;i<5;i++){const py=-44-i*7-(t/60)%7,px=Math.sin(t/500+i)*3;c.fillStyle=`rgba(70,68,72,${.35-i*.06})`;c.beginPath();c.ellipse(x+px*K,y+py*K,(4+i)*K,(3+i*.6)*K,0,0,Math.PI*2);c.fill();}R('#2a2224',-10,-40,20,3);}
 else{for(let i=0;i<6;i++){const ph=t/110+i*1.3,h=9+5*Math.sin(ph);R(i%2?'#ffcf6a':'#f07a32',-10+i*3.4,-38-h,3.4,h);}R('#fff2b0',-3,-46,6,6);c.fillStyle='rgba(255,180,90,.18)';c.beginPath();c.ellipse(x,y-44*K,22*K,14*K,0,0,Math.PI*2);c.fill();}
 c.restore();}
