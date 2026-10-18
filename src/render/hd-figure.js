// Character sprites v2 (benchmark pass, 2026-10-17). Original art following classic tactical-SRPG
// sprite conventions only: a 48×48 cell, roughly 4½-head proportions, four facings (down, left,
// right, up) and a four-frame march cycle that also plays while standing. Nothing is traced from
// any existing sprite; every figure is assembled from parametric parts below.
import {Pix,ramp,col,CAST,SKIN} from './hd-art.js';
export const FIG_W=48,FIG_H=48,FIG_FOOT=46;
const figCache=new Map();
const darker=r=>[r[0],r[0],r[1],r[2],r[3]];
const INK=col('#1c1820');
// frame 0 = stand; odd frames = step A (near foot forward), even frames = step B
const phaseOf=frame=>frame?((frame-1)%2)*2:-1; // two-pose march (A,B,A,B) like classic SRPG map sprites

export function figureSprite(id,{frame=0,facing='down'}={}){const key=`${id}:${frame}:${facing}`;if(figCache.has(key))return figCache.get(key);
 const S=CAST[id]||CAST.bandit;let p;
 if(facing==='left'){const r=drawFigure2(S,frame,'right');p=new Pix(r.w,r.h);for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++)p.d[y*r.w+(r.w-1-x)]=r.d[y*r.w+x];}
 else p=drawFigure2(S,frame,facing);
 const c=p.canvas();figCache.set(key,c);return c;}

// thick limb between two points, lit from the upper left
// limb between two points: rounded joint, tapered toward the hand/foot, lit from the upper left
function limb(p,x0,y0,x1,y1,w,r,tone=2,taper=.74){const dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy)||1,ux=-dy/len,uy=dx/len,w0=w/2,w1=w*taper/2;
 p.poly([[x0+ux*w0,y0+uy*w0],[x1+ux*w1,y1+uy*w1],[x1-ux*w1,y1-uy*w1],[x0-ux*w0,y0-uy*w0]],r[tone]);if(w>=4)p.fillEllipse(x0,y0+.3,w0,w0*.9,r[tone]);
 const steps=Math.ceil(len);for(let i=0;i<=steps;i++){const t=i/steps,x=x0+dx*t,y=y0+dy*t,h=(w0+(w1-w0)*t)*Math.abs(ux)+(1-Math.abs(ux))*.2;p.set(x-h+.5,y,r[tone+1]);p.set(x+h-1,y,r[Math.max(0,tone-1)]);}}
function boot(p,x,y,r,dir=0){ // dir: 0 front, 1 right-facing profile
 if(dir){p.box(x-3,y-5,9,5,r);p.rect(x-3,y-1,10,1,r[0]);p.rect(x+4,y-3,2,2,r[1]);p.rect(x-3,y-5,6,1,r[3]);}
 else{p.box(x-4,y-5,8,5,r);p.rect(x-4,y-1,8,1,r[0]);p.rect(x-3,y-5,5,1,r[3]);}}

function drawFigure2(S,frame,facing){
 const p=new Pix(FIG_W,FIG_H),view=facing==='up'?'back':facing==='down'?'front':'side',back=view==='back',side=view==='side';
 const sk=ramp(SKIN[S.skin]||S.skin),hr=ramp(S.hair),coat=ramp(S.coat),trim=ramp(S.trim),legs=ramp(S.legs),boots=ramp(S.boots);
 const metal=ramp(S.metal||'#b4c0c6'),big=S.big?1:0,small=S.small?1:0,mounted=!!S.mounted,ph=phaseOf(frame);
 const bob=ph===1||ph===3?-1:0,dy=(small?8:mounted?-6:0)+bob;
 const cx=side?23:24,hy=9+dy+(S.stoop?2:0),hrx=5.5+big*.4-small*.3,hry=5.9,sh=16+dy,sw=11+big-small*2,wy=28+dy-small,ww=7+big-small,hip=32+dy-small*2,G=FIG_FOOT;
 const torso=S.body==='plate'?metal:coat;
 const longSkirt=['robe','shawl'].includes(S.body),coatTail=S.body==='coat';
 // arm swing per phase: [nearHandDX, farHandDX] in profile; [leftDY,rightDY] facing front/back
 const swing=ph===0?1:ph===2?-1:0;
 // ---------------- horse (under the rider) ----------------
 if(mounted){HORSE=ramp(S.horse||'#7a5236');horseBody(p,view,frame,S);}
 // ---------------- items behind ----------------
 const bannerOrStaff=['spear','banner','staff','holy'].includes(S.weapon);
 if(S.cape&&!back){const cr=ramp(S.cape);if(side)p.poly([[cx-3,sh],[cx+2,sh],[cx-2,hip+8],[cx-10-(ph===0||ph===2?2:0),hip+7]],cr[1]);else p.poly([[cx-sw+1,sh+1],[cx+sw-1,sh+1],[cx+sw+2,hip+9],[cx-sw-2,hip+9]],cr[0]);}
 if(S.back==='quiver'&&!back){const q=ramp('#7a5434'),qx=side?cx-7:cx+5;p.box(qx,sh-6,4,13,q);for(let i=0;i<3;i++){p.set(qx+i,sh-8,col('#ece4cc'));p.set(qx+i,sh-7,col('#c9443a'));}}
 if(back)weaponFig(p,S,'back',{cx,sh,sw,wy,hip,sk,swing});
 if(side)weaponFig(p,S,'far',{cx,sh,sw,wy,hip,sk,swing});
 // ---------------- legs ----------------
 let nearFoot={x:cx+1,y:G};
 if(!mounted){
  if(side){
   const stride=ph===0||ph===2?8:0,lift=ph===1||ph===3?3:0;
   // far leg (darker) then near leg; contact A: near leg forward
   const nearFwd=ph===0?1:ph===2?-1:0;
   const footN={x:cx+1+nearFwd*stride,y:G},footF={x:cx+1-nearFwd*stride,y:G-(nearFwd===0?lift:0)};
   if(!longSkirt){limb(p,cx,hip,footF.x,footF.y-3,6,darker(legs));boot(p,footF.x,footF.y,darker(boots),1);}
   nearFoot=footN;
  } else {
   const lA=ph===1?3:ph===0?0:0,lB=ph===3?3:0; // lifted foot on passing frames
   const lx=cx-5-big,rx=cx+5+big;
   if(!longSkirt){limb(p,lx+2,hip,lx,G-3-lA,6,legs);limb(p,rx-2,hip,rx,G-3-lB,6,legs);boot(p,lx,G-lA,boots);boot(p,rx+1,G-lB,boots);}
   else{p.box(lx-2,G-3-lA,6,3,boots);p.box(rx-2,G-3-lB,6,3,boots);}
  }
 }
 // far arm in profile (behind torso)
 if(side){const sx=cx+3,hx2=cx+3-swing*4;limb(p,sx,sh+2,hx2+1,wy-1,4,darker(S.body==='plate'?metal:coat));p.ball(hx2+1,wy+1,2,2,darker(sk));}
 // ---------------- torso ----------------
 torsoFill(p,S,{cx,sh,wy,sw,ww,side,torso});
 // hips / lower garment
 const hemY=mounted?hip+2:longSkirt?G-2:coatTail?hip+9:S.body==='apron'?hip+7:hip+4;
 const lower=S.body==='plate'?metal:longSkirt||coatTail?coat:S.body==='apron'?ramp(S.apron):coat;
 lowerFill(p,S,{cx,wy,ww,hemY,side,lower,trim,longSkirt,back});
 // near leg in profile (in front of hips)
 if(side&&!mounted&&!longSkirt){const f=nearFoot;limb(p,cx+2,hip,f.x,f.y-3,6,legs);boot(p,f.x,f.y,boots,1);}
 if(side&&longSkirt&&!mounted){const f=nearFoot;p.box(f.x-3,G-3,8,3,boots);}
 // body details (front/back/profile)
 bodyDetails(p,S,view,{cx,sh,sw,wy,ww,hip,torso,coat,trim,sk,hemY});
 // ---------------- arms ----------------
 const sleeve=S.body==='plate'?darker(metal):S.body==='apron'||S.body==='vest'?ramp(S.coat):coat;
 if(side&&S.weapon==='bow'){limb(p,cx,sh+2,cx+8,wy-6,5,sleeve);p.ball(cx+8,wy-5,2.2,2.2,sk);}
 else if(side){const sx=cx-1,hx2=cx-1+swing*4;limb(p,sx,sh+2,hx2,wy-1,5,sleeve);if(S.body==='apron')limb(p,(sx+hx2)/2,(sh+wy)/2,hx2,wy-1,4,sk);p.ball(hx2,wy+1,2.2,2.2,sk);if(S.bandage)p.rect(hx2-2,wy-4,4,2,col('#f2ece0'));}
 else{const ly=back?0:-swing,ry=back?0:swing;
  for(const [sx,hx2,dyH] of [[cx-sw+1,cx-sw-1,ly],[cx+sw-1,cx+sw+1,ry]]){limb(p,sx,sh+3,hx2,wy-1+dyH,5,sleeve);if(S.body==='apron')limb(p,(sx+hx2)/2,(sh+wy)/2+1,hx2,wy-1+dyH,4,sk);p.ball(hx2,wy+1+dyH,2.2,2.2,sk);}
  if(S.bandage&&!back)p.rect(cx+sw-1,wy-5,4,2,col('#f2ece0'));}
 // shoulder pieces / collars
 if(S.body==='plate'){if(side)p.ball(cx,sh+2,3.6,3,metal);else{p.ball(cx-sw+1,sh+2,3.6,3,metal);p.ball(cx+sw-1,sh+2,3.6,3,metal);}}
 if(S.collar){const cr=ramp(S.collar);p.ball(cx+(side?1:0),sh+1,sw+2,3.6,cr,{bias:.05});for(let x=cx-sw-1;x<=cx+sw+2;x+=2)p.set(x,sh+4+((x>>1)%2),cr[1]);}
 if(S.body==='fur'){const fr=ramp(S.fur);p.ball(cx,sh+1,sw+2,3.6,fr);for(let x=cx-sw;x<=cx+sw;x+=2)p.set(x,sh+4,fr[1]);}
 if(S.scarf){const sc=ramp(S.scarf);p.ball(cx+(side?1:0),sh,sw-2,2.6,sc);if(side)p.poly([[cx-4,sh],[cx-1,sh],[cx-7-swing,sh+8],[cx-9-swing,sh+6]],sc[2]);else if(!back)p.poly([[cx+2,sh+1],[cx+5,sh+1],[cx+6,sh+9],[cx+3,sh+9]],sc[2]);else p.poly([[cx-1,sh+1],[cx+2,sh+1],[cx+3,sh+9],[cx,sh+9]],sc[2]);}
 // ---------------- head ----------------
 head(p,S,view,{cx,hy,hrx,hry,sk,hr});
 // ---------------- items in front ----------------
 if(back){if(S.cape){const cr=ramp(S.cape);p.poly([[cx-sw+1,sh+1],[cx+sw-1,sh+1],[cx+sw+2,hip+9],[cx-sw-2,hip+9]],cr[2]);for(let y=sh+1;y<hip+9;y++){p.set(cx-sw+1-(y-sh)/6,y,cr[3]);}p.rect(cx-sw+1,sh+1,2*sw-1,1,trim[2]);}
  if(S.back==='quiver'){const q=ramp('#7a5434');limb(p,cx-5,sh-5,cx+3,wy-2,4,q);for(let i=0;i<3;i++)p.set(cx-6+i,sh-7,col('#ece4cc'));}
  if(S.collar){const cr=ramp(S.collar);p.ball(cx,sh+1,sw+2,3.6,cr);}
  if(S.weapon==='bundle')p.ball(cx,sh+6,5,5,ramp('#b8a07a'));
 }
 if(!back)weaponFig(p,S,side?'side':'front',{cx,sh,sw,wy,hip,sk,swing});
 if(mounted)horseFront(p,view,frame,boots,S);
 return p.outline(INK);
}

// v0.4 feedback #3: bodies are rounded and tapered (shoulder curve → chest → waist → hips), not boxes.
function torsoHalf(t,sw,ww){const round=t<.3?Math.sqrt(Math.max(0,1-Math.pow((.3-t)/.3,2))):1,k=t*t*(3-2*t);return sw-3.4*(1-round)+(ww-sw)*Math.pow(k,1.15);}
function torsoFill(p,S,{cx,sh,wy,sw,ww,side,torso}){const top=sh+1,plate=S.body==='plate';
 for(let y=top;y<=wy;y++){const t=(y-top)/Math.max(1,wy-top),h=torsoHalf(t,sw,ww)*(side?.84:1),chest=side&&t>.12&&t<.62?1.2*Math.sin((t-.12)/.5*Math.PI):0,l=Math.round(cx-h+(side?.5:0)),r=Math.round(cx+h+(side?.5+chest:0));
  for(let x=l;x<r;x++){const u=(x+.5-cx)/Math.max(1,h);let tone=u<-.6?3:u>.5?1:2;if(y<=top+1&&tone===2)tone=3;if(t>.86&&tone===2)tone=1;if(!side&&t>.18&&t<.5&&Math.abs(u+.25)<.18)tone=3;if(side&&u>.05&&u<.45&&t>.18&&t<.48)tone=3;if(plate&&(y-sh)%4===0&&x>l+1&&x<r-2)tone=1;p.set(x,y,torso[tone]);}
  p.set(l,y,torso[4]);p.set(r-1,y,torso[0]);}}
function lowerFill(p,S,{cx,wy,ww,hemY,side,lower,trim,longSkirt,back}){const flare=2+(longSkirt?3:0),plate=S.body==='plate';
 for(let y=wy;y<=hemY;y++){const t=(y-wy)/Math.max(1,hemY-wy),hip=longSkirt?0:Math.sin(Math.min(1,t*1.6)*Math.PI/2)*1.1,h=ww+flare*Math.pow(t,.8)+hip-(y===hemY?1:0),l=Math.round(cx-h+(side?1:0)),r=Math.round(cx+h+(side?1:0))+1;
  for(let x=l;x<r;x++){const u=(x+.5-cx-(side?1:0))/Math.max(1,h);let tone=u<-.6?3:u>.45?1:2;if(plate&&(y-wy)%3===2)tone=1;if(longSkirt&&!back&&Math.abs(x-cx-1-(side?2:0))<.6&&y%4===0)tone=1;if(y===wy&&tone===2)tone=1;p.set(x,y,lower[tone]);}
  p.set(l,y,lower[3]);p.set(r-1,y,lower[1]);}
 const h=ww+flare-1;p.rect(Math.round(cx-h+(side?1:0)),hemY,Math.round(2*h)+1,1,trim[1]);}

function bodyDetails(p,S,view,{cx,sh,sw,wy,ww,hip,torso,coat,trim,sk,hemY}){
 const side=view==='side',back=view==='back',o=side?1:0;
 if(S.body==='plate'){const tb=ramp(S.tabard||S.coat);if(!back){const l=side?cx+1:cx-3,r=side?cx+5:cx+3;p.poly([[l,sh+4],[r,sh+4],[r+1,hemY+2],[l-1,hemY+2]],tb[2]);p.rect(l,sh+4,r-l,1,trim[3]);p.rect(l-1,hemY+2,r-l+2,1,trim[1]);}else p.poly([[cx-4,sh+3],[cx+4,sh+3],[cx+5,hemY+1],[cx-5,hemY+1]],tb[1]);p.rect(cx-ww+o,wy-1,2*ww,2,ramp('#4a3424')[2]);if(!back)p.set(cx+o,wy-1,trim[3]);}
 if(S.body==='leather'){p.rect(cx-ww+o,wy-1,2*ww,2,ramp('#4a3424')[2]);if(!back){p.set(cx+o,wy-1,trim[3]);p.line(cx-sw+2+o,sh+2,cx+ww-1+o,wy-2,ramp('#4a3424')[1]);}else p.line(cx+sw-2,sh+2,cx-ww+1,wy-2,ramp('#4a3424')[1]);}
 if(S.body==='robe'){if(!back)p.rect(cx-1+o*2,sh+2,2,hemY-sh-2,trim[2]);p.rect(cx-ww+o,wy-1,2*ww,2,trim[3]);}
 if(S.body==='jacket'){if(!back)p.poly([[cx-2+o*2,sh+1],[cx+2+o*2,sh+1],[cx+1+o*2,wy],[cx-1+o*2,wy]],ramp('#d9c8a4')[2]);p.rect(cx-ww+o,wy-1,2*ww,2,trim[1]);}
 if(S.body==='coat'){if(!back){p.rect(cx+o*2,sh+2,1,hemY-sh-2,coat[0]);for(let i=0;i<3;i++)p.set(cx+2+o*2,sh+4+i*3,trim[3]);}else p.rect(cx,wy+2,1,hemY-wy-2,coat[0]);p.rect(cx-ww+o,wy-1,2*ww,2,ramp('#3a2a22')[2]);p.rect(cx-sw+o,sh+1,2*sw-o,1,trim[2]);}
 if(S.body==='fur'){p.rect(cx-ww+o,wy-2,2*ww,3,trim[2]);if(!back)p.rect(cx-1+o,wy-2,3,3,col('#e8d48a'));}
 if(S.body==='apron'&&!back){const ap=ramp(S.apron);p.poly([[cx-4+o*2,sh+4],[cx+4+o*2,sh+4],[cx+5+o*2,hemY],[cx-5+o*2,hemY]],ap[2]);p.rect(cx-3+o*2,sh+8,6,3,ap[1]);}
 if(S.body==='apron'&&back){p.line(cx-sw+2,sh+2,cx+ww-1,wy-1,ramp(S.apron)[1]);p.line(cx+sw-2,sh+2,cx-ww+1,wy-1,ramp(S.apron)[1]);}
 if(S.body==='vest'){const v=ramp(S.vest);if(!back){p.poly([[cx-sw+1+o,sh+1],[cx-1+o*2,sh+1],[cx-1+o*2,wy],[cx-ww+o,wy]],v[2]);p.poly([[cx+1+o*2,sh+1],[cx+sw-1,sh+1],[cx+ww+o,wy],[cx+1+o*2,wy]],v[1]);}else p.poly([[cx-sw+1,sh+1],[cx+sw-1,sh+1],[cx+ww,wy],[cx-ww,wy]],v[2]);}
 if(S.body==='shawl'){const sh2=ramp(S.shawl);p.poly([[cx-sw-1+o,sh],[cx+sw+1,sh],[cx+2+o,sh+10],[cx-2+o,sh+10]],sh2[back?1:2]);for(let x=-sw;x<sw;x+=3)p.set(cx+x+o,sh+2,sh2[3]);}
 if(S.body==='tunic'){p.rect(cx-ww+o,wy-1,2*ww,2,ramp('#4a3424')[2]);if(!back)p.rect(cx-1+o*2,sh+1,2,4,coat[1]);}
}

function head(p,S,view,{cx,hy,hrx,hry,sk,hr}){
 const side=view==='side',back=view==='back',hx=cx+(side?1:0),brow=hy-2;
 p.rect(hx-2,hy+4,4,3,sk[1]); // neck
 if(!side&&!back){p.set(hx-hrx-.5,hy+1,sk[2]);p.set(hx+hrx,hy+1,sk[1]);}
 p.ball(hx,hy,hrx,hry,sk,{flat:.45,clean:true,hi:false});
 if(side){p.set(hx+Math.round(hrx)+1,hy+1,sk[2]);p.set(hx+Math.round(hrx),hy+2,sk[1]);p.set(hx-1,hy+1,sk[1]);p.set(hx-1,hy+2,sk[0]);}
 // face
 if(!back){
  if(S.beard==='full'||S.beard==='long'){const br=ramp(S.beardColor||S.hair),bot=hy+(S.beard==='long'?9:6);if(side)p.poly([[hx-1,hy+2],[hx+hrx+.5,hy+2],[hx+hrx-1,bot],[hx,bot-1]],br[2]);else{p.poly([[hx-hrx+.5,hy+2],[hx-1,hy+3],[hx+1,hy+3],[hx+hrx-.5,hy+2],[hx+2,bot],[hx-2,bot]],br[2]);for(let y=hy+2;y<bot;y+=2)p.set(hx+((y>>1)%2?1:-1),y,br[3]);}}
  if(S.beard==='stubble')for(let y=hy+2;y<hy+5;y++)for(let x=hx-3;x<=hx+3;x++)if((x+y)%2===0&&!side||side&&x>hx&&(x+y)%2===0)p.set(x,y,sk[1]);
  if(S.beard==='mustache'){if(side)p.rect(hx+2,hy+2,3,1,hr[1]);else p.rect(hx-2,hy+2,5,1,hr[1]);}
  const eye=col('#1c1418'),iris=col(S.eye);
  if(side){p.set(hx+2,hy,eye);p.set(hx+3,hy,eye);p.set(hx+2,hy+1,iris);p.set(hx+3,hy+1,eye);p.set(hx,hy-1,hr[0]);p.set(hx+1,hy-1,hr[0]);p.set(hx+4,hy-1,hr[0]);if(S.beard!=='full'&&S.beard!=='long')p.set(hx+3,hy+3,col('#9a5048'));}
  else{for(const ex of [hx-3,hx+2]){p.set(ex,hy,eye);p.set(ex+1,hy,eye);p.set(ex,hy+1,iris);p.set(ex+1,hy+1,eye);p.set(ex,hy-2,hr[0]);p.set(ex+1,hy-2,hr[0]);}p.set(hx,hy+2,sk[1]);if(S.beard!=='full'&&S.beard!=='long'){p.set(hx,hy+3,col('#9a5048'));p.set(hx-1,hy+3,col('#b86a5e'));}}
 }
 // hair
 if(S.style!=='bald'){
  for(let y=Math.floor(hy-hry-1);y<=hy+5;y++)for(let x=Math.floor(hx-hrx-1);x<=Math.ceil(hx+hrx+1);x++){const dx=(x+.5-hx)/(hrx+.8),dy=(y+.5-(hy-.8))/(hry+.3);if(dx*dx+dy*dy>1)continue;
   let cover;if(back)cover=y<=hy+4;else if(side)cover=y<=brow||(x<hx&&y<=hy+3)||(x<hx+2&&y<=hy-1);else cover=y<=brow||(Math.abs(x+.5-hx)>hrx-1.2&&y<=hy+2);
   if(!cover)continue;let t=x<hx-1?3:x>hx+2?1:2;if(y<hy-hry+1&&x<hx)t=4;if(back&&y>hy+2)t=1;p.set(x,y,hr[t]);}
  if(!back&&!side)for(let x=Math.round(hx-hrx+1);x<=Math.round(hx+hrx-1);x+=2)p.set(x,brow+1,hr[2]);
  const locks=S.style==='long'?10:S.style==='braid'?5:0;
  if(locks){if(side)p.box(Math.round(hx-hrx),hy,3,locks,hr);else if(back)p.box(Math.round(hx-hrx+1),hy+2,Math.round(2*hrx-1),locks-1,hr);else{p.box(Math.round(hx-hrx-1),hy,2,locks,hr);p.box(Math.round(hx+hrx-1),hy,2,locks,hr);}}
  if(S.style==='braid'){const bx=side?hx-hrx+.5:back?hx:hx-hrx-.5;for(let i=0;i<5;i++)p.ball(bx,hy+6+i*2,1.5,1.2,hr);}
  if(S.style==='spiky')for(let i=0;i<4;i++){const x=hx-5+i*3-(side?1:0);p.poly([[x,hy-hry+1],[x+3,hy-hry+1],[x+1.5+(i%2),hy-hry-3]],hr[i<2?3:2]);}
  if(S.style==='mohawk'){for(let y=Math.floor(hy-hry-1);y<=brow;y++)for(let x=Math.floor(hx-hrx-1);x<=hx+hrx+1;x++){if(Math.abs(x+.5-hx)>1.6&&hr.includes(p.get(x,y)))p.set(x,y,sk[x<hx?3:2]);}p.box(hx-1,hy-hry-3,3,4,hr);if(back)p.box(hx-1,hy-hry,3,6,hr);}
  if(S.style==='swept'&&!back)p.poly(side?[[hx-hrx,brow],[hx+hrx,brow-2],[hx+hrx-1,brow+1]]:[[hx-hrx,brow],[hx+hrx+1,brow-3],[hx+hrx+1,brow+1]],hr[2]);
 } else {p.set(hx-2,hy-4,sk[4]);p.set(hx-1,hy-4,sk[4]);if(S.hair){if(back){for(let x=Math.round(hx-hrx+1);x<Math.round(hx+hrx);x++)for(let y=hy+1;y<hy+4;y++)if(p.get(x,y))p.set(x,y,hr[x<hx?3:2]);}else if(side)p.box(Math.round(hx-hrx),hy,3,3,hr);else{p.box(Math.round(hx-hrx-.5),hy,2,3,hr);p.box(Math.round(hx+hrx-1),hy,2,3,hr);}}}
 // headgear
 const capY=brow,W2=Math.round(2*hrx);
 if(S.helm==='knight'){const m=ramp(S.helmMetal||'#c4d0d4');p.ball(hx,hy-2,hrx+1,hry+.5,m,{maxY:back?hy+3:capY});if(!back)p.rect(Math.round(hx-hrx-1),capY,W2+3,1,m[1]);p.box(hx-1,hy-hry-4,2,4,ramp(S.trim));if(!side&&!back){p.box(Math.round(hx-hrx-1),capY,2,5,m);p.box(Math.round(hx+hrx),capY,2,5,m);}if(side)p.box(Math.round(hx-hrx-1),capY,4,5,m);}
 if(S.helm==='kettle'){const m=ramp(S.helmColor);p.ball(hx,hy-2,hrx+.6,hry,m,{maxY:capY});p.box(Math.round(hx-hrx-2),capY,W2+5,2,m);}
 if(S.helm==='cap'){const m=ramp(S.helmColor);p.ball(hx,hy-2,hrx+.6,hry,m,{maxY:back?hy+1:capY});}
 if(S.helm==='beret'){const m=ramp(S.helmColor);p.ball(hx-1,hy-3,hrx+1.6,3,m,{maxY:capY});p.set(hx+3,hy-6,col('#d8b46a'));}
 if(S.helm==='straw'){const m=ramp(S.helmColor);p.ball(hx,hy-4,hrx-.5,3,m);p.ball(hx,capY,hrx+4,1.8,m,{flat:.5});p.rect(Math.round(hx-hrx+1),capY-2,W2-1,1,col('#a2463a'));}
 if(S.bandana){const b=ramp(S.bandana);p.ball(hx,hy-2,hrx+.6,hry,b,{maxY:back?hy+1:capY});const kx=side?hx-hrx:back?hx:hx+hrx-1,kd=side?-1:1;p.poly([[kx,capY],[kx+kd*4,capY+2],[kx+kd*3,capY+4],[kx,capY+1]],b[2]);}
 const wrap=(r,topR,bottom,widen,tones)=>{for(let y=Math.floor(hy-topR);y<=hy+bottom;y++)for(let x=Math.floor(hx-hrx-widen);x<=Math.ceil(hx+hrx+widen);x++){const dx=(x+.5-hx)/(hrx+widen),dy=(y+.5-(hy-1))/((topR+bottom)/2+.5);const face=back?false:side?(x+.5>hx-.5&&y>brow-1&&y<hy+5):(Math.abs(x+.5-hx)<hrx-.8&&y>brow-1&&y<hy+5);if(dx*dx+dy*dy<=1&&!face)p.set(x,y,r[tones(x,y)]);}};
 if(S.hood){const hd=ramp(S.hood);wrap(hd,hry+2,7,2,(x,y)=>x<hx-2?3:y>hy+3?1:2);}
 if(S.veil){const v=ramp(S.veil);wrap(v,hry+2,8,2,(x)=>x<hx-2?4:x>hx+3?2:3);if(!back)p.rect(side?hx:Math.round(hx-hrx+1),brow-1,side?Math.round(hrx):W2-1,1,ramp(S.trim)[2]);p.box(hx-1,hy-hry-2,2,2,ramp(S.trim));}
 if(S.scarfHead){const v=ramp(S.scarfHead);wrap(v,hry+1,back?5:3,1.5,(x)=>x<hx?3:2);}
 if(S.hat==='witch'){const h=ramp(S.hatColor),tip=side?-1:1;p.ball(hx,capY,hrx+5,2,h,{flat:.5});p.poly([[hx-hrx+1,capY-1],[hx+hrx,capY-1],[hx+4*tip,capY-9],[hx+8*tip,capY-13],[hx+1*tip,capY-8]],h[2]);for(let y=capY-8;y<capY-1;y++)p.set(hx-hrx+2+(capY-1-y)*.4,y,h[3]);if(!back)p.rect(Math.round(hx-hrx+1),capY-2,W2-1,1,ramp(S.trim)[2]);}
}

// hand-held items. view: 'front' | 'side' (near hand, held forward) | 'far' (profile, far hand) | 'back'
function weaponFig(p,S,view,{cx,sh,sw,wy,hip,sk,swing}){
 const w=S.weapon,front=view==='front',side=view==='side',far=view==='far',back=view==='back';
 const longArms=['sword','staff','holy','axe','greataxe','torch','cane','hammer','spear','banner'];
 if(far&&!longArms.includes(w)&&S.off!=='shield')return;
 const forward=w==='spear'||(w==='banner'&&false);
 if(side&&longArms.includes(w)&&w!=='spear'&&w!=='banner'&&S.off!=='shield'){} // drawn by far hand
 // main hand position
 let hx,hy2;if(front){hx=cx+sw+1;hy2=wy+1+swing;}else if(back){hx=cx-sw-1;hy2=wy+1;}else if(far){hx=cx+4-swing*4;hy2=wy+1;}else if(w==='bow'){hx=cx+8;hy2=wy+1;}else{hx=cx-1+swing*4;hy2=wy+1;}
 const R=c=>ramp(c);
 const pole=(x0,y0,x1,y1,c='#6a4a30')=>{p.line(x0,y0,x1,y1,R(c)[2]);p.line(x0+1,y0,x1+1,y1,R(c)[1]);};
 const drawMain=()=>{
  if(w==='spear'){if(front||back){pole(hx-10,hy2+9,hx+7,hy2-20);p.poly([[hx+6,hy2-21],[hx+10,hy2-25],[hx+8,hy2-20]],R('#d0d8dc')[3]);}else{pole(hx-6,hy2+8,hx+8,hy2-22);p.poly([[hx+7,hy2-23],[hx+11,hy2-28],[hx+9,hy2-21]],R('#d0d8dc')[3]);}}
  if(w==='banner'){pole(hx,hy2+8,hx,hy2-30,'#5a4030');const bf=R('#24262c'),bx=back?hx-11:hx+1;p.poly([[bx,hy2-29],[bx+10,hy2-29],[bx+10,hy2-17],[bx+5,hy2-20],[bx,hy2-17]],bf[2]);p.rect(bx,hy2-29,10,1,R('#c9a24a')[3]);if(!back)p.ball(bx+5,hy2-24,2.4,2.2,R('#c9a24a'));}
  if(w==='sword'){const bl=R('#d9e2e6');if(side){limb(p,hx,hy2,hx+8,hy2-10,2,bl);p.box(hx-1,hy2-1,4,2,R('#c9a24a'));}else{p.box(hx,hy2-13,2,12,bl);p.set(hx,hy2-13,col('#ffffff'));p.box(hx-2,hy2-2,6,2,R('#c9a24a'));}}
  if(w==='axe'){pole(hx,hy2+3,hx,hy2-13);const bl=R('#c5ccc8');p.poly([[hx+1,hy2-13],[hx+6,hy2-15],[hx+6,hy2-7],[hx+1,hy2-8]],bl[2]);}
  if(w==='greataxe'){pole(hx,hy2+6,hx,hy2-20,'#5a3a24');const bl=R('#b8c0bc');p.poly([[hx+2,hy2-20],[hx+9,hy2-23],[hx+10,hy2-12],[hx+2,hy2-14]],bl[2]);p.poly([[hx-1,hy2-20],[hx-7,hy2-22],[hx-7,hy2-13],[hx-1,hy2-14]],bl[3]);}
  if(w==='staff'){pole(hx,hy2+10,hx,hy2-18,'#7a5232');p.ball(hx+.5,hy2-20,2.8,2.8,R(S.orb));p.set(hx,hy2-21,col('#ffffff'));}
  if(w==='holy'){pole(hx,hy2+10,hx,hy2-16,'#c8b47c');p.ball(hx+.5,hy2-18,2.6,2.6,R('#e8b84a'));for(const [a,b]of[[0,-4],[0,3],[-4,0],[3,0]])p.set(hx+a,hy2-18+b,col('#fff3b0'));}
  if(w==='torch'){pole(hx,hy2+2,hx,hy2-9);p.ball(hx+.5,hy2-11,2.4,3,R('#f08a3a'),{bias:.3});p.ball(hx+.5,hy2-12,1.2,1.8,R('#ffd27a'),{bias:.4});}
  if(w==='cane'){pole(hx+1,hy2-2,hx+2,hy2+14,'#7a5a3a');}
  if(w==='hammer'){pole(hx,hy2+2,hx,hy2-8);p.box(hx-3,hy2-11,7,4,R('#8a9094'));}
  if(w==='daggers'){p.box(hx,hy2-6,2,6,R('#d5dde0'));p.rect(hx-1,hy2-1,4,1,R('#c26a36')[2]);}
  if(w==='bow'){const b=R('#8a5a32'),bx=front?hx+2:back?hx-2:hx+3;for(let i=0;i<20;i++){const y=hy2-14+i,x=bx+Math.round(Math.sin(i/19*Math.PI)*(back?-3:3));p.set(x,y,b[i<10?3:2]);}p.line(bx,hy2-14,bx,hy2+5,col('#efe6c8'));}
 };
 if(far){if(longArms.includes(w)&&w!=='spear')drawMain();return;}
 if(side){
  if(S.off==='shield'){const sh2=R(S.shield),x=cx-2,y=wy-6;p.poly([[x-3,y-4],[x+4,y-4],[x+4,y+5],[x,y+9],[x-3,y+5]],sh2[2]);p.rect(x,y-2,1,9,R('#e1c27a')[2]);p.rect(x-2,y+1,5,1,R('#e1c27a')[2]);}
  if(w==='spear'||w==='bow'||w==='daggers')drawMain();
  if(w==='ledger'||w==='papers')p.box(hx,hy2-5,4,6,w==='ledger'?R('#6a3a2a'):R('#efe6cf'));
  if(w==='satchel')p.box(cx-7,hip-3,5,6,R('#8a5a34'));if(w==='bundle')p.ball(cx-7,sh+5,4,4,R('#b8a07a'));
  if(w==='sheathed'){p.line(cx-1,hip,cx-6,hip+7,R('#3a2a22')[2]);p.box(cx-1,hip-1,2,2,R('#c9a24a'));}
  return;}
 drawMain();
 // off hand / extras
 const ox=back?cx+sw+1:cx-sw-1,oy=wy+1;
 if(S.off==='shield'){const sh2=R(S.shield);p.poly([[ox-5,oy-9],[ox+4,oy-9],[ox+4,oy+1],[ox,oy+6],[ox-5,oy+1]],sh2[back?1:2]);if(!back){p.rect(ox-5,oy-9,10,1,R('#d6b25e')[3]);p.rect(ox-1,oy-7,2,10,R('#e1c27a')[2]);p.rect(ox-4,oy-4,8,2,R('#e1c27a')[2]);}else p.rect(ox-1,oy-6,2,7,R('#6a4a30')[2]);}
 if(w==='daggers')p.box(ox-1,oy-6,2,6,R('#d5dde0'));
 if(w==='ledger'&&front){p.box(ox-2,oy-6,6,7,R('#6a3a2a'));p.rect(ox-1,oy-5,4,1,col('#e8dcc0'));}
 if(w==='papers'&&front){p.box(ox-2,oy-5,5,7,R('#efe6cf'));p.rect(ox-1,oy-3,3,1,col('#8a7a5a'));}
 if(w==='satchel'){const b=R('#8a5a34'),sx=back?cx+sw-4:cx-sw-2;p.box(sx,hip-4,6,6,b);}
 if(w==='bundle'&&front)p.ball(cx+sw+3,sh+4,4,4,R('#b8a07a'));
 if(w==='sheathed'&&front){p.line(cx-sw,hip-1,cx-sw-4,hip+7,R('#3a2a22')[2]);p.box(cx-sw,hip-2,2,2,R('#c9a24a'));}
}

// ---------------- horse ----------------
let HORSE=ramp('#7a5236');const MANE=ramp('#2e221c'),HOOF=ramp('#3a2e26');
function horseLegs(frame){const ph=phaseOf(frame);return ph===0?[3,-3]:ph===2?[-3,3]:[0,0];}
function horseBody(p,view,frame,S){const [a,b]=horseLegs(frame),H=HORSE,cloth=ramp(S.barding||'#7a2e2a');
 if(view==='side'){ // facing right
  for(const [x,d,dark] of [[11,b,1],[33,a,1],[14,a,0],[30,b,0]]){const r=dark?darker(H):H;limb(p,x,35,x+d,44,4,r);p.rect(x+d-2,44,5,2,HOOF[1]);}
  p.ball(22,31,16,8,H);p.poly([[30,29],[34,14],[40,12],[40,29]],H[2]);for(let y=14;y<29;y++){p.set(31+Math.round((29-y)*.2),y,H[3]);}p.poly([[37,11],[45,14],[47,20],[43,21],[37,17]],H[2]);p.set(46,19,H[0]);p.set(41,14,col('#1a1418'));p.poly([[36,11],[37,7],[39,12]],H[1]);
  for(let y=12;y<29;y++){p.set(34+Math.round((29-y)*.3),y,MANE[2]);p.set(35+Math.round((29-y)*.3),y,MANE[1]);}p.poly([[7,27],[1,33],[3,43],[7,35]],MANE[2]);
  p.poly([[13,24],[29,24],[31,36],[11,36]],cloth[2]);p.rect(11,36,21,1,cloth[0]);p.rect(13,24,16,1,cloth[3]);}
 else if(view==='front'){for(const [x,d] of [[16,a],[32,b]]){limb(p,x,36,x,45-Math.max(0,d),5,H);p.rect(x-2,45-Math.max(0,d),5,2,HOOF[1]);}p.ball(24,31,14,8,H);p.poly([[11,26],[37,26],[36,33],[12,33]],cloth[2]);p.rect(12,33,25,1,cloth[0]);}
 else{for(const [x,d] of [[15,a],[33,b]]){limb(p,x,37,x,45-Math.max(0,d),6,H);p.rect(x-3,45-Math.max(0,d),6,2,HOOF[1]);}p.ball(24,33,15,10,H);p.ball(19,32,6,6,H,{bias:.1});p.ball(29,32,6,6,H);p.poly([[22,31],[26,31],[29,46],[19,46]],MANE[2]);p.rect(23,31,2,14,MANE[1]);p.poly([[10,23],[38,23],[37,28],[11,28]],cloth[2]);}}
function horseFront(p,view,frame,boots,S){const H=HORSE,L=ramp(S.legs);
 if(view==='side'){limb(p,22,24,24,34,5,L);boot(p,25,37,boots,1);}
 else if(view==='front'){p.ball(24,35,6.5,10.5,H,{bias:.15});p.ball(24,43,4.5,3.2,ramp('#c9a58a'));p.set(22,43,col('#1a1418'));p.set(26,43,col('#1a1418'));p.set(20,32,col('#1a1418'));p.set(28,32,col('#1a1418'));p.poly([[18,28],[19,22],[21,29]],H[3]);p.poly([[30,28],[29,22],[27,29]],H[2]);p.rect(22,26,5,4,MANE[2]);p.rect(23,33,3,8,col('#f0e6d8'));
  limb(p,14,23,11,32,5,L);boot(p,11,36,boots);limb(p,34,23,37,32,5,L);boot(p,38,36,boots);}
 else{limb(p,13,22,10,31,5,L);boot(p,10,35,boots);limb(p,35,22,38,31,5,L);boot(p,38,35,boots);}}
