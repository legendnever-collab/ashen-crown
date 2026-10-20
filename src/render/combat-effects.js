import {TILE,pixel,pixelOval} from './art.js';
export function pixelLine(c,color,x1,y1,x2,y2,width=2){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))));for(let i=0;i<=n;i++)pixel(c,color,x1+(x2-x1)*i/n-width/2,y1+(y2-y1)*i/n-width/2,width,width);}
function ring(c,color,x,y,radius,thickness=2){for(let i=0;i<48;i++){const a=i/48*Math.PI*2;pixel(c,color,x+Math.cos(a)*radius,y+Math.sin(a)*radius,thickness,thickness);}}
export function effectPhase(effect,now){const p=(now-effect.start)/effect.duration;if(p<0||p>=1)return null;return effect.kind==='fireball'?(p<.15?'cast':p<.56?'flight':'explosion'):effect.kind==='arrow'?(p<.65?'flight':'impact'):p<.46?'swing':'impact';}
export function drawCombatEffect(c,e,units,now,reduced=false){
 const a=units.find(u=>u.id===e.id),t=units.find(u=>u.id===e.target);if(!a||!t)return;const p=(now-e.start)/e.duration;if(p<0||p>=1)return;
 const sx=a.x*TILE+32,sy=a.y*TILE+26,tx=t.x*TILE+32,ty=t.y*TILE+26,phase=effectPhase(e,now),angle=Math.atan2(ty-sy,tx-sx);
 if(e.kind==='fireball'){
  if(phase==='cast'){ring(c,'#c9a0f0',sx,sy,12+p*65,2);pixelOval(c,'#f0c3ff',sx,sy,4,5);}
  if(phase==='flight'){const f=(p-.15)/.41,x=sx+(tx-sx)*f,y=sy+(ty-sy)*f-Math.sin(f*Math.PI)*16;
   for(let i=5;i>0;i--){const q=Math.max(0,f-i*.038);pixelOval(c,i%2?'#d8553e':'#ee904a',sx+(tx-sx)*q,sy+(ty-sy)*q-Math.sin(q*Math.PI)*16,Math.max(2,8-i),Math.max(2,7-i));}
   pixelOval(c,'#c73d32',x,y,11,10);pixelOval(c,'#f49f42',x-1,y-1,8,7);pixelOval(c,'#ffe79b',x-2,y-2,4,4);pixel(c,'#fff8d0',x-3,y-3,2,2);
  }
  if(phase==='explosion'){const f=(p-.56)/.44,r=8+Math.sin(f*Math.PI)*35;if(!reduced&&f<.24){c.globalAlpha=.15*(1-f/.24);pixel(c,'#fff2c5',tx-55,ty-55,110,110);c.globalAlpha=1;}
   ring(c,'#f8cb7a',tx,ty,12+f*45,3);for(let i=0;i<8;i++){const ang=i*Math.PI/4,dx=Math.cos(ang)*r*.62,dy=Math.sin(ang)*r*.62;pixelOval(c,f>.55?'#816859':'#da573c',tx+dx,ty+dy,r*.45,r*.42);pixelOval(c,f>.55?'#a68b68':'#f4a44c',tx+dx,ty+dy,r*.30,r*.28);if(f<.55)pixelOval(c,'#ffe6a5',tx+dx-2,ty+dy-2,r*.17,r*.15);}
   for(let i=0;i<12;i++){const ang=i*.523,rr=13+f*53;pixel(c,i%2?'#ffd185':'#e68a41',tx+Math.cos(ang)*rr,ty+Math.sin(ang)*rr,2,3);}
  }
 }else if(e.kind==='arrow'){
  if(phase==='flight'){const f=p/.65,x=sx+(tx-sx)*f,y=sy+(ty-sy)*f;pixelLine(c,'#c6a76f',x-Math.cos(angle)*19,y-Math.sin(angle)*19,x,y,2);pixel(c,'#f6edc8',x-2,y-2,4,4);pixelLine(c,'#efe4bd',x-Math.cos(angle)*15,y-Math.sin(angle)*15,x-Math.cos(angle)*20-Math.sin(angle)*4,y-Math.sin(angle)*20+Math.cos(angle)*4,2);}else spark(c,tx,ty,(p-.65)/.35,'#f8dd9b');
 }else{
  if(phase==='swing'){const f=p/.46,theta=angle-1.3+f*2.6,hx=sx+Math.cos(angle)*12,hy=sy+Math.sin(angle)*12;for(let i=0;i<11;i++){const q=theta-i*.10;pixel(c,e.kind==='dagger'?'#b9edf1':'#d1e6d8',hx+Math.cos(q)*31,hy+Math.sin(q)*31,3,3);}pixelLine(c,'#6a5440',hx,hy,hx+Math.cos(theta)*7,hy+Math.sin(theta)*7,4);pixelLine(c,'#f4f1d7',hx+Math.cos(theta)*7,hy+Math.sin(theta)*7,hx+Math.cos(theta)*(e.kind==='dagger'?22:35),hy+Math.sin(theta)*(e.kind==='dagger'?22:35),3);if(e.kind==='axe')pixelOval(c,'#ceddd5',hx+Math.cos(theta)*27,hy+Math.sin(theta)*27,7,5);}else{const f=(p-.46)/.54;pixelLine(c,'#ffefb7',tx-17+f*5,ty-18,tx+16,ty+18-f*5,Math.max(1,4-f*4));spark(c,tx,ty,f,e.counter?'#b8dbe9':'#ffe0a2');}
 }
}
function spark(c,x,y,f,color){for(let i=0;i<8;i++){const a=i*Math.PI/4,r=8+f*22;pixelLine(c,color,x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.5,x+Math.cos(a)*r,y+Math.sin(a)*r,Math.max(1,3-f*2));}}
// v0.5 Phase F: one flourish per promotion action (original effects). e = {action,id,target,from,to,cells,range,at}.
const C5={bulwark:'#f6d27a',overwatch:'#9fe3a8',arcane:'#b58cf0',recall:'#ffe9a8',exchange:'#7b6aa6'};
function fx5Poly(c,x,y,r,n,rot=0){c.beginPath();for(let i=0;i<=n;i++){const a=rot+i/n*Math.PI*2;i?c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r):c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}}
export function drawClassEffect(c,e,units,now,reduced=false){
 const p=(now-e.start)/e.duration;if(p<0||p>=1)return;const u=units.find(x=>x.id===e.id);if(!u)return;
 const fade=p<.15?p/.15:1-(p-.15)/.85,ease=1-Math.pow(1-p,3),T=TILE,mid=(x,y)=>[x*T+32,y*T+32];
 c.save();c.lineCap='round';
 if(e.action==='bulwark'){const [x,y]=mid(u.x,u.y);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){c.globalAlpha=.32*fade;c.fillStyle=C5.bulwark;c.fillRect((u.x+dx)*T+5,(u.y+dy)*T+5,T-10,T-10);c.globalAlpha=.8*fade;c.strokeStyle='#fff1c4';c.lineWidth=2;c.strokeRect((u.x+dx)*T+5,(u.y+dy)*T+5,T-10,T-10);}
  c.globalAlpha=.9*fade;c.strokeStyle=C5.bulwark;c.lineWidth=4;fx5Poly(c,x,y,16+ease*(reduced?28:46),6,Math.PI/6);c.stroke();c.globalAlpha=.18*fade;c.fillStyle=C5.bulwark;c.fill();
  if(!reduced){c.globalAlpha=.6*fade;c.lineWidth=2;fx5Poly(c,x,y,10+ease*30,6,Math.PI/6+p);c.stroke();}}
 else if(e.action==='overwatch'){const [x,y]=mid(u.x,u.y),R=(e.range?.[1]||3)*T;
  c.globalAlpha=.55*fade;c.strokeStyle=C5.overwatch;c.lineWidth=3;c.setLineDash([10,8]);c.beginPath();c.arc(x,y,R*ease,0,Math.PI*2);c.stroke();c.setLineDash([]);
  const r=26-ease*12;c.globalAlpha=.95*fade;c.lineWidth=2.5;c.beginPath();c.arc(x,y-46,r,0,Math.PI*2);c.stroke();for(const a of [0,1,2,3]){const an=a*Math.PI/2+(reduced?0:p*1.5);c.beginPath();c.moveTo(x+Math.cos(an)*(r-6),y-46+Math.sin(an)*(r-6));c.lineTo(x+Math.cos(an)*(r+8),y-46+Math.sin(an)*(r+8));c.stroke();}}
 else if(e.action==='overwatch-fire'){const t=e.at||units.find(x=>x.id===e.target);if(t){const [x,y]=mid(u.x,u.y),[tx,ty]=mid(t.x,t.y);c.globalAlpha=.85*fade;c.strokeStyle=C5.overwatch;c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(x,y-20);c.lineTo(tx,ty);c.stroke();c.setLineDash([]);c.beginPath();c.arc(tx,ty,18-ease*8,0,Math.PI*2);c.stroke();}}
 else if(e.action==='arcane'){for(const [i,cell] of (e.cells||[]).entries()){const [x,y]=mid(cell.x,cell.y),k=Math.max(0,Math.min(1,p*1.8-i*.08)),a=fade*k;
   c.globalAlpha=.3*a;c.fillStyle=C5.arcane;c.fillRect(cell.x*T+3,cell.y*T+3,T-6,T-6);c.globalAlpha=.9*a;c.strokeStyle='#e2ccff';c.lineWidth=2;c.beginPath();c.arc(x,y,20,0,Math.PI*2*k);c.stroke();
   const rot=reduced?0:p*2;fx5Poly(c,x,y,14,3,rot);c.stroke();fx5Poly(c,x,y,14,3,rot+Math.PI);c.stroke();}}
 else if(e.action==='recall'){const [x,y]=mid(u.x,u.y);const g=c.createLinearGradient(0,y-120,0,y+20);g.addColorStop(0,'rgba(255,233,168,0)');g.addColorStop(1,'rgba(255,233,168,.55)');
  c.globalAlpha=fade;c.fillStyle=g;c.fillRect(x-14-ease*6,y-120,28+ease*12,140);
  if(e.from&&e.to){const [fx,fy]=mid(e.from.x,e.from.y),[tx,ty]=mid(e.to.x,e.to.y);c.globalAlpha=.8*fade;c.strokeStyle=C5.recall;c.lineWidth=3;c.beginPath();c.moveTo(fx,fy);c.quadraticCurveTo((fx+tx)/2,Math.min(fy,ty)-40,tx,ty);c.stroke();
   if(!reduced)for(let i=0;i<10;i++){const q=(i/10+p)%1;c.globalAlpha=.9*fade*(1-q);c.fillStyle='#fff6d6';c.beginPath();c.arc(x+Math.sin(i*2.3)*18,y+10-q*90,2.5,0,Math.PI*2);c.fill();}}}
 else if(e.action==='exchange'&&e.from&&e.to){for(const pt of [e.from,e.to]){const [x,y]=mid(pt.x,pt.y);for(let i=0;i<(reduced?3:7);i++){const an=i/7*Math.PI*2+p*2,r=8+ease*24;c.globalAlpha=.55*fade;c.fillStyle=i%2?'#3b2f55':C5.exchange;c.beginPath();c.arc(x+Math.cos(an)*r,y+Math.sin(an)*r*.6,9-ease*4,0,Math.PI*2);c.fill();}}
  const [fx,fy]=mid(e.from.x,e.from.y),[tx,ty]=mid(e.to.x,e.to.y);c.globalAlpha=.7*fade;c.strokeStyle='#cbb8ff';c.lineWidth=2;c.setLineDash([4,7]);c.beginPath();c.moveTo(fx,fy);c.lineTo(tx,ty);c.stroke();c.setLineDash([]);}
 c.restore();
}
