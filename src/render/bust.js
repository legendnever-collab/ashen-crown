// v0.4 dialogue busts: painted, original character illustrations for the story window.
// Every shape here is authored for Ashen Crown (vector paths + gradients, no traced art). The
// layout follows the classic SRPG dialogue convention: a large three-quarter bust facing the
// text. Drawn once per (character, expression) into a 2× offscreen canvas and cached.
import {CAST,SKIN} from './hd-art.js';
import {appearanceFor} from '../data/appearances.js';

export const BUST_W=360,BUST_H=440;
const bHex=h=>{h=String(h).replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)||0);};
const bMix=(a,b,t)=>{const A=bHex(a),B=bHex(b);return '#'+A.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(B[i]-v)*t))).toString(16).padStart(2,'0')).join('');};
const bDark=(c,t)=>bMix(c,'#1b1220',t),bLight=(c,t)=>bMix(c,'#fff6e6',t);
const bA=(c,a)=>{const [r,g,b]=bHex(c);return `rgba(${r},${g},${b},${a})`;};
function bRng(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return (s%100000)/100000;};}
const bSeed=str=>[...String(str)].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7);
function bLin(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);for(const [o,col]of stops)g.addColorStop(o,col);return g;}
function bRad(c,x0,y0,r0,x1,y1,r1,stops){const g=c.createRadialGradient(x0,y0,r0,x1,y1,r1);for(const [o,col]of stops)g.addColorStop(o,col);return g;}
const bEll=(c,x,y,rx,ry,rot=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);};
// soft painterly strokes inside the current clip
function bBrush(c,rng,x,y,w,h,light,dark,n=40,len=18,width=3){c.save();c.filter='blur(2.5px)';for(let i=0;i<n;i++){const px=x+rng()*w,py=y+rng()*h;c.fillStyle=bA(i%2?light:dark,.07+rng()*.08);bEll(c,px,py,len*(.4+rng()*.5),width*(1.2+rng()*1.5),(rng()-.5)*1.6+1.3);c.fill();}c.restore();}
function bShape(c,draw,fill,stroke=null,lw=2){c.beginPath();draw();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=lw;c.stroke();}}
const INKLINE='#2a1b20';

// ---------- character specs (PROPOSED visual detail, consistent with CHARACTER_BIBLE identity) ----------
const BUST_SPEC={
 aren:{face:'m',age:1,skin:'warm',hair:'#262f38',style:'swept',eye:'#6e5242',outfit:'coat',coat:'#5d6870',shirt:'#2b3036',trim:'#d6b06a',cloak:'#80878b',scarf:'#a8352c',stubble:true},
 eric:{face:'m',skin:'warm',hair:'#6b4630',style:'short',eye:'#2f6f8f',outfit:'plate',metal:'#7fa9ad',under:'#2f6788',trim:'#e1c27a',scar:'cheek',emblem:'shield'},
 eric_adv:{face:'m',skin:'warm',hair:'#6b4630',style:'short',eye:'#2f6f8f',outfit:'plate',metal:'#8cb6b8',under:'#2f6788',trim:'#ecca84',scar:'cheek',emblem:'shield',cape:'#5d425e'},
 elina:{face:'f',skin:'fair',hair:'#a9502c',style:'braid',eye:'#58863e',outfit:'leather',coat:'#4f7a46',leather:'#7a5536',trim:'#d8b46a',freckles:true,hoodDown:'#41683b',quiver:true},
 lia:{face:'f',skin:'fair',hair:'#4c3552',style:'long',eye:'#c8922e',outfit:'robe',coat:'#8467b9',inner:'#e9dcc0',trim:'#e3c37b',hat:'witch',hatColor:'#55407f',gem:'#9ad6ff',earring:'#9ad6ff'},
 sain:{face:'n',skin:'deep',hair:'#efe4c8',style:'short',eye:'#5a4430',outfit:'robe',coat:'#efe6cf',inner:'#d9cba8',trim:'#d6ae55',hood:'#f4ecd8',sigil:true},
 kai:{face:'m',young:true,skin:'tan',hair:'#24404b',style:'spiky',eye:'#86a85a',outfit:'jacket',coat:'#3c4d57',trim:'#d8a35e',scarf:'#e0874a',hoodDown:'#2b3a42',scar:'nose'},
 baldrick:{face:'m',age:3,skin:'warm',hair:'#6f6862',style:'swept',eye:'#8a6c3c',outfit:'plate',metal:'#4a4e57',under:'#1f2026',trim:'#c9a24a',collar:'#a8742e',cape:'#24262c',beard:'full',beardColor:'#7c746c',scar:'brow',emblem:'lion'},
 advisor:{face:'m',skin:'pale',hair:'#2a2430',style:'swept',eye:'#5a4a7a',outfit:'coat',coat:'#3f3a63',shirt:'#e8e0d0',trim:'#c9b07a',glasses:true},
 elder:{face:'m',age:4,skin:'warm',hair:'#e6e1d6',style:'bald',eye:'#5a4a3c',outfit:'robe',coat:'#7b5b42',inner:'#d8c8a8',trim:'#c2a36d',beard:'long',beardColor:'#ebe6dc'},
 smith:{face:'m',age:2,skin:'tan',hair:'#2e2420',style:'bald',eye:'#3a2a20',outfit:'apron',coat:'#8a7a68',apron:'#5a3c2a',trim:'#a07a50',beard:'full'},
 merchant:{face:'m',skin:'fair',hair:'#6a4a30',style:'short',eye:'#4a5a3c',outfit:'vest',coat:'#d7c49a',vest:'#3f7a5a',trim:'#d8b46a',hat:'beret',hatColor:'#3f7a5a'},
 refugee:{face:'f',skin:'warm',hair:'#4a3a30',style:'long',eye:'#4a3a2c',outfit:'shawl',coat:'#8c8a7e',shawl:'#b0866a',trim:'#7a6a54',hood:'#9a8f7c'},
 guard:{face:'m',skin:'fair',hair:'#2f2a26',style:'short',eye:'#4a5060',outfit:'tunic',coat:'#4f6b84',trim:'#c9b07a',hat:'kettle',hatColor:'#9aa4a8',mail:true}
};
// enemy/unknown speakers: derived from their battlefield cast so the bust matches the sprite
function bustFromCast(id){const k=CAST[id]||CAST.bandit,chief=/captain|Captain|quartermaster/.test(id);return {face:'m',age:chief?3:k.big?2:1,stubble:chief&&!k.beard,scar:chief&&!k.beard?'brow':null,skin:k.skin||'warm',hair:k.hair,style:k.style==='braid'?'long':k.style||'short',eye:k.eye||'#3a2a22',
 outfit:k.body==='fur'?'fur':k.body==='plate'?'plate':k.body==='coat'?'coat':k.body==='robe'?'robe':k.body==='leather'?'leather':k.body==='apron'?'apron':'tunic',
 coat:k.coat,metal:k.metal||k.helmColor||'#7d838a',under:k.tabard||k.coat,trim:k.trim||'#a28a5a',shirt:'#3a3436',leather:k.coat,fur:k.fur,apron:k.apron,cape:k.cape,
 hat:k.helm==='kettle'?'kettle':k.helm==='cap'?'cap':k.bandana?'bandana':k.hood?'hood':null,hatColor:k.helmColor||k.bandana||k.hood,
 beard:k.beard,beardColor:k.beardColor,hoodDown:k.hood&&k.helm?k.hood:null,mail:k.helm==='kettle'};}
export function bustKey(u,missionId=1){
 if(!u)return 'refugee';
 if(u.kind==='lion'||u.id==='baldrick')return 'baldrick';
 if(u.id==='eric'&&(appearanceFor(u)?.tier||1)>=2)return 'eric_adv';
 if(BUST_SPEC[u.id])return u.id;
 if(u.team==='commander')return 'aren';
 if(u.team==='civilian')return 'refugee';
 const look={1:{captain:'captain',archer:'archer'},2:{captain:'deserterCaptain',bandit:'deserter'},3:{captain:'pursuerCaptain',bandit:'pursuer',archer:'pursuerArcher'},4:{captain:'quartermaster',bandit:'fortGuard',archer:'fortArcher'},5:{bearer:'bearer',spear:'ironSpear',archer:'ironArcher',cavalry:'cavalry'},6:{captain:'executor',bandit:'pursuer',archer:'pursuerArcher'}}[missionId]||{};
 return 'cast:'+(look[u.kind]||(u.kind==='captain'?'captain':'bandit'));
}
const bustSpecOf=key=>key.startsWith('cast:')?bustFromCast(key.slice(5)):BUST_SPEC[key];

// ---------- geometry ----------
function bGeom(sp){const f=sp.face==='f',n=sp.face==='n',j=f?0:n?.35:sp.young?.55:1;
 return {f,n,j,chinY:f?250:n?253:255+j*2,eyeY:f?185:184,eyeH:f?9.4:n?8.6:sp.young?8.2:7.4,eyeW:f?30:n?29:28,mouthY:f?229:231,old:(sp.age||0)>=3};}
function bFacePath(c,g){const j=g.j,cy=g.chinY;c.beginPath();c.moveTo(134,120);
 c.bezierCurveTo(129,160,132,196,146-j*3,222+j*4);c.bezierCurveTo(160,242,g.f?184:180,cy,197,cy);
 c.bezierCurveTo(g.f?210:214,cy-1,224+j*2,244-j*3,230+j*2,226);c.bezierCurveTo(236,212,241,196,240,180);
 c.bezierCurveTo(240,160,238,136,232,118);c.bezierCurveTo(214,84,152,84,134,120);c.closePath();}
function bTorsoPath(c){c.beginPath();c.moveTo(-6,446);c.lineTo(-6,372);c.bezierCurveTo(2,330,40,306,104,297);c.bezierCurveTo(130,293,146,286,152,276);c.lineTo(222,276);
 c.bezierCurveTo(230,288,252,295,282,301);c.bezierCurveTo(326,311,356,337,366,380);c.lineTo(366,446);c.closePath();}
// soft-edged shading shape (painted cel shading)
function bSoft(c,blur,draw,fill){c.save();c.filter=`blur(${blur}px)`;c.beginPath();draw();c.fillStyle=fill;c.fill();c.restore();}

// ---------- skin ----------
function bSkin(sp){const base=SKIN[sp.skin]||SKIN.warm,light=bLight(base,.25);return {base,light,shade:bMix(base,'#8a3f4a',.3),deep:bMix(base,'#4a2230',.52),blush:'#e9786e'};}
function bNeck(c,sk,g){c.save();c.beginPath();c.moveTo(152,212);c.bezierCurveTo(155,240,153,266,148,294);c.lineTo(224,294);c.bezierCurveTo(219,266,218,240,222,214);c.closePath();
 c.fillStyle=bLin(c,150,0,224,0,[[0,bMix(sk.base,sk.shade,.45)],[.4,sk.base],[1,sk.shade]]);c.fill();c.clip();
 bSoft(c,2,()=>{c.moveTo(140,222);c.bezierCurveTo(160,244,180,g.chinY+2,198,g.chinY+2);c.bezierCurveTo(214,g.chinY,226,244,234,226);c.lineTo(234,g.chinY+22);c.bezierCurveTo(214,g.chinY+26,180,g.chinY+28,140,g.chinY+16);c.closePath();},bA(sk.deep,.6));
 c.strokeStyle=bA(sk.deep,.3);c.lineWidth=2;c.beginPath();c.moveTo(176,270);c.quadraticCurveTo(184,282,181,294);c.stroke();c.restore();}
function bEar(c,sk){c.save();c.beginPath();c.moveTo(136,170);c.bezierCurveTo(118,164,118,196,128,206);c.bezierCurveTo(132,212,138,210,140,204);c.closePath();
 c.fillStyle=bLin(c,120,0,140,0,[[0,sk.shade],[1,sk.base]]);c.fill();c.strokeStyle=bA(sk.deep,.7);c.lineWidth=1.3;c.stroke();
 c.beginPath();c.moveTo(132,176);c.bezierCurveTo(124,178,124,194,131,200);c.strokeStyle=bA(sk.deep,.5);c.lineWidth=2;c.stroke();c.restore();}
function bFace(c,sp,g,sk,hair){c.save();bFacePath(c,g);c.fillStyle=bRad(c,168,166,8,182,178,92,[[0,sk.light],[.5,sk.base],[1,bMix(sk.base,sk.shade,.45)]]);c.fill();c.clip();
 // far side plane, cheekbone, eye sockets
 bSoft(c,2.2,()=>{c.moveTo(224,104);c.bezierCurveTo(232,140,235,170,229,190);c.bezierCurveTo(224,208,220,226,210,240);c.bezierCurveTo(205,250,200,256,197,264);c.lineTo(262,264);c.lineTo(262,96);c.closePath();},bA(sk.shade,.62));
 bSoft(c,4,()=>c.ellipse(148,218,9,20,.45,0,Math.PI*2),bA(sk.shade,.22));
 bSoft(c,3,()=>c.ellipse(164,177,19,7,0,0,Math.PI*2),bA(sk.shade,.28));bSoft(c,3,()=>c.ellipse(214,175,12,6,0,0,Math.PI*2),bA(sk.shade,.3));
 // hair cast shadow on the forehead, following each lock tip
 c.save();c.filter='blur(1.6px)';c.translate(3,6);c.fillStyle=bA(sk.shade,.62);for(const l of hair.front)if(l[3]>118){bLockPath(c,l);c.fill();}c.restore();
 if(hair.capShadow){bSoft(c,2,()=>{c.moveTo(120,96);c.lineTo(250,96);c.lineTo(250,hair.capShadow+4);c.quadraticCurveTo(186,hair.capShadow-6,120,hair.capShadow+10);c.closePath();},bA(sk.shade,.55));}
 // nose, lips, chin
 bSoft(c,1,()=>{c.moveTo(201,g.eyeY-4);c.bezierCurveTo(206,g.eyeY+8,213,g.eyeY+18,211,g.eyeY+24);c.lineTo(203,g.eyeY+28);c.bezierCurveTo(207,g.eyeY+16,205,g.eyeY+6,201,g.eyeY-4);c.closePath();},bA(sk.shade,.7));
 bSoft(c,1.5,()=>c.ellipse(201,g.eyeY+31,7,2.4,0,0,Math.PI*2),bA(sk.deep,.35));
 bSoft(c,1.2,()=>c.ellipse(203,g.eyeY+20,2.6,3.6,-.2,0,Math.PI*2),bA(sk.light,.7));
 bSoft(c,1.5,()=>c.ellipse(200,g.mouthY+7,7,2.6,0,0,Math.PI*2),g.f?bA('#cf6a68',.4):bA(sk.deep,.28));
 bSoft(c,2,()=>c.ellipse(193,g.chinY-8,9,4,0,0,Math.PI*2),bA(sk.light,.45));
 bSoft(c,3,()=>c.ellipse(158,207,15,7,0,0,Math.PI*2),bA(sk.blush,g.f?.38:g.n?.18:.12));bSoft(c,3,()=>c.ellipse(225,203,8,6,0,0,Math.PI*2),bA(sk.blush,g.f?.3:.1));
 if(g.f){c.strokeStyle=bA('#d0584e',.4);c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(150+i*6,210);c.lineTo(154+i*6,203);c.stroke();}}
 bSoft(c,2,()=>c.ellipse(170,150,22,12,-.2,0,Math.PI*2),bA(sk.light,.35));
 if(sp.stubble||sp.beard==='stubble'){c.fillStyle=bLin(c,0,212,0,g.chinY,[[0,bA(bDark(sp.hair,.1),0)],[1,bA(bDark(sp.hair,.1),.22)]]);c.beginPath();c.moveTo(138,204);c.quadraticCurveTo(160,244,198,g.chinY+2);c.quadraticCurveTo(232,240,240,200);c.lineTo(240,264);c.lineTo(138,264);c.fill();}
 if(sp.freckles){c.fillStyle=bA(bMix(sk.shade,'#9a4a2a',.45),.5);const r=bRng(77);for(let i=0;i<16;i++){const side=i%3===0,x=side?220+r()*12:146+r()*26,y=196+r()*12;bEll(c,x,y,1.2,1);c.fill();}}
 if(g.old){c.strokeStyle=bA(sk.deep,.38);c.lineWidth=1.3;for(const [x0,y0,x1,y1,cx,cy]of[[150,128,190,124,170,121],[156,138,196,134,176,131],[188,210,180,232,183,220],[218,210,226,228,224,218],[141,186,136,193,137,189],[236,182,240,190,239,185]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();}}
 c.restore();
 c.save();bFacePath(c,g);c.strokeStyle=bA(bDark(sk.shade,.45),.75);c.lineWidth=1.8;c.stroke();c.restore();}
function bEye(c,sp,g,x,y,w,h,near,expr){c.save();const look=near?3.5:2.5;let top=h,bottom=h*.72,droop=0;
 if(expr==='determined'){top=h*.8;bottom=h*.66;}if(expr==='sad'){top=h*.84;droop=2.6;}if(expr==='concerned'){top=h*1.08;}
 const L=x-w/2,R=x+w/2,upper=()=>{c.moveTo(L,y+1.5);c.bezierCurveTo(L+w*.2,y-top*.9,R-w*.32,y-top-1.5+droop,R,y-1.5+droop);};
 c.beginPath();upper();c.bezierCurveTo(R-w*.22,y+bottom,L+w*.3,y+bottom+1.2,L,y+1.5);c.closePath();
 c.fillStyle=bLin(c,0,y-top,0,y+bottom,[[0,'#d9cfd2'],[.5,'#f7f1ea'],[1,'#ece2dc']]);c.fill();c.save();c.clip();const ir=h*.9,ix=x+look,iy=y+1+(expr==='sad'?1.6:0),sx=near?1:.84;
 bEll(c,ix,iy,ir*sx,ir);c.fillStyle=bRad(c,ix,iy+ir*.45,.5,ix,iy,ir,[[0,bLight(sp.eye,.55)],[.5,sp.eye],[.85,bDark(sp.eye,.45)],[1,bDark(sp.eye,.75)]]);c.fill();
 bEll(c,ix,iy+.4,ir*.44*sx,ir*.5);c.fillStyle=bDark(sp.eye,.85);c.fill();
 c.fillStyle=bLin(c,0,y-top-1,0,y+1,[[0,'rgba(36,20,28,.7)'],[1,'rgba(36,20,28,0)']]);c.fillRect(L-2,y-top-3,w+4,top+3);
 bEll(c,ix-ir*.36*sx,iy-ir*.36,ir*.27,ir*.25);c.fillStyle='#ffffff';c.fill();bEll(c,ix+ir*.34*sx,iy+ir*.4,ir*.13,ir*.11);c.fillStyle='rgba(255,255,255,.85)';c.fill();c.restore();
 // lid line (thicker toward the outer corner), lash wing, crease, lower lid
 const ink=bMix(INKLINE,sp.hair,.2);c.lineCap='round';c.lineJoin='round';c.strokeStyle=ink;
 c.lineWidth=g.f?2.4:2;c.beginPath();upper();c.stroke();c.lineWidth=g.f?3.8:3.2;c.beginPath();c.moveTo(L+w*.42,y-top-.6+droop*.5);c.bezierCurveTo(R-w*.25,y-top-1.4+droop,R-w*.06,y-top*.6+droop,R+.5,y-1.5+droop);c.stroke();
 if(g.f){c.lineWidth=2.2;c.beginPath();c.moveTo(R-1,y-2+droop);c.quadraticCurveTo(R+4,y-3.5+droop,R+7,y-7+droop);c.stroke();}
 c.strokeStyle=bA(bDark(sp.eye,.2),.0);c.strokeStyle='rgba(70,36,40,.5)';c.lineWidth=1.1;c.beginPath();c.moveTo(x-w*.05,y+bottom+.6);c.quadraticCurveTo(R-w*.18,y+bottom*.8,R-.5,y+.5+droop);c.stroke();
 c.strokeStyle='rgba(96,52,54,.4)';c.lineWidth=1.1;c.beginPath();c.moveTo(L+w*.22,y-top-3.5);c.bezierCurveTo(L+w*.42,y-top-6.5,R-w*.3,y-top-6.5+droop,R-2,y-top-2.5+droop);c.stroke();c.restore();}
function bBrow(c,sp,g,ox,oy,ix,iy,thick){c.save();const col=bMix(bDark(sp.hair,.3),INKLINE,.25),mx=(ox+ix)/2,my=Math.min(oy,iy)-3;c.beginPath();c.moveTo(ox,oy);c.quadraticCurveTo(mx,my-2,ix,iy-thick*.55);c.lineTo(ix,iy+thick*.5);c.quadraticCurveTo(mx,my+thick*.7,ox,oy+1.2);c.closePath();c.fillStyle=col;c.fill();c.restore();}
function bFeatures(c,sp,g,sk,expr){
 const ey=g.eyeY,raise=expr==='concerned'||expr==='sad'?-4:expr==='determined'?4:0,thick=g.f?2.8:g.n?3.3:4.4;
 bBrow(c,sp,g,143,ey-15,179,ey-17+raise,thick);bBrow(c,sp,g,235,ey-18,204,ey-18+raise,thick*.9);
 bEye(c,sp,g,163,ey,g.eyeW,g.eyeH,true,expr);bEye(c,sp,g,216,ey-2,g.eyeW*.76,g.eyeH*.96,false,expr);
 c.save();c.lineCap='round';c.strokeStyle=bA(sk.deep,.8);c.lineWidth=1.7;c.beginPath();c.moveTo(197,ey+28.5);c.quadraticCurveTo(201,ey+31,206,ey+28);c.stroke();
 const my=g.mouthY,cw=g.f?8.5:10;c.strokeStyle=bMix(sk.deep,'#5a1f2a',.45);c.lineWidth=g.f?2:2.3;c.beginPath();
 if(expr==='sad'){c.moveTo(200-cw,my+2.5);c.quadraticCurveTo(200,my-2,200+cw-1,my+2);}else if(expr==='determined'){c.moveTo(200-cw,my+1);c.quadraticCurveTo(200,my+.8,200+cw-1,my-.6);}else if(expr==='concerned'){c.moveTo(200-cw+2,my+1);c.quadraticCurveTo(200,my-1,200+cw-2,my+1.2);}else{c.moveTo(200-cw,my-.5);c.quadraticCurveTo(199,my+2.6,200+cw-1,my-1.2);}
 c.stroke();c.restore();
 c.save();c.lineCap='round';if(sp.scar==='cheek'){c.strokeStyle=bA('#b06060',.8);c.lineWidth=2;c.beginPath();c.moveTo(145,201);c.lineTo(159,213);c.stroke();c.strokeStyle=bA(sk.light,.7);c.lineWidth=.9;c.beginPath();c.moveTo(146,199);c.lineTo(160,211);c.stroke();}
 if(sp.scar==='brow'){c.strokeStyle=bA('#9a5a58',.9);c.lineWidth=2.4;c.beginPath();c.moveTo(223,ey-30);c.lineTo(214,ey+12);c.stroke();c.strokeStyle=bA(sk.light,.5);c.lineWidth=1;c.beginPath();c.moveTo(225,ey-30);c.lineTo(216,ey+12);c.stroke();}
 if(sp.scar==='nose'){c.strokeStyle=bA('#a86a62',.8);c.lineWidth=1.8;c.beginPath();c.moveTo(192,ey+12);c.lineTo(212,ey+8);c.stroke();}
 if(sp.glasses){c.strokeStyle='#c9b07a';c.lineWidth=1.6;c.beginPath();c.roundRect(146,ey-9,32,19,7);c.stroke();c.beginPath();c.roundRect(204,ey-11,25,18,6);c.stroke();c.beginPath();c.moveTo(178,ey-2);c.quadraticCurveTo(191,ey-7,204,ey-3);c.stroke();c.beginPath();c.moveTo(146,ey-3);c.lineTo(133,ey-6);c.stroke();
  c.fillStyle='rgba(220,235,255,.14)';c.beginPath();c.roundRect(146,ey-9,32,19,7);c.fill();}
 if(sp.earring){bEll(c,131,210,3,4.5);c.fillStyle=bRad(c,130,208,0,131,210,5,[[0,'#ffffff'],[.4,sp.earring],[1,bDark(sp.earring,.5)]]);c.fill();}
 c.restore();}

// ---------- hair: layered locks over a skull cap ----------
// lock = [rootX, rootY, tipX, tipY, width, bend]
const HAIR_STYLES={
 short:{cap:[120,160,250,158,100],front:[[238,112,250,178,18,4],[228,102,240,160,22,4],[214,94,230,152,24,6],[200,90,212,160,26,5],[186,90,192,164,26,2],[170,92,168,158,26,-3],[155,98,150,152,24,-5],[142,106,132,178,22,-6],[136,124,128,206,16,-4]]},
 swept:{cap:[116,150,252,150,92],capShadow:118,front:[[238,128,250,170,14,3],[134,138,112,112,22,4],[146,124,108,84,28,6],[164,114,120,66,30,8],[184,108,142,56,32,8],[204,106,166,54,32,8],[222,110,192,58,30,8],[236,120,218,68,26,7],[206,106,216,158,13,7]]},
 spiky:{cap:[118,160,252,158,98],front:[[146,96,90,120,30,-6],[160,84,104,58,32,-8],[186,78,150,28,32,-10],[212,82,214,30,30,6],[230,96,270,74,26,8],[238,120,268,170,20,5],[136,110,100,162,22,-5],[216,96,236,160,22,6],[202,92,214,170,24,4],[186,92,186,164,24,0],[170,94,160,160,24,-4],[154,102,138,156,22,-6],[140,118,128,194,18,-4]]},
 long:{cap:[118,170,254,168,100],front:[[240,140,262,306,20,10],[236,110,254,232,24,7],[220,96,232,156,24,5],[206,92,214,164,24,4],[192,92,194,168,24,1],[177,94,173,164,24,-2],[161,98,152,160,24,-5],[146,106,132,206,22,-7],[138,130,116,306,20,-12]]},
 braid:{cap:[118,166,252,164,98],front:[[238,112,248,184,18,4],[228,98,206,152,28,9],[210,92,184,154,28,9],[192,92,164,150,28,8],[174,96,146,148,26,7],[158,104,132,158,24,5],[142,114,128,198,18,-4]]}
};
function bHairDef(sp){return HAIR_STYLES[sp.style]||(sp.style==='bald'||sp.style==='mohawk'?{front:[]}:HAIR_STYLES.short);}
function bLockPath(c,[rx,ry,tx,ty,w,bend]){const dx=tx-rx,dy=ty-ry,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,mx=(rx+tx)/2+nx*bend,my=(ry+ty)/2+ny*bend;
 c.beginPath();c.moveTo(rx+nx*w/2,ry+ny*w/2);c.quadraticCurveTo(mx+nx*w*.42,my+ny*w*.42,tx,ty);c.quadraticCurveTo(mx-nx*w*.42,my-ny*w*.42,rx-nx*w/2,ry-ny*w/2);c.closePath();}
function bLockFill(c,sp,l,i){const [rx,ry,tx,ty]=l,base=i%3===1?bDark(sp.hair,.12):i%3===2?bLight(sp.hair,.04):sp.hair;bLockPath(c,l);c.fillStyle=bLin(c,rx,ry,tx,ty,[[0,bA(base,0)],[.28,bA(base,.85)],[.6,base],[1,bDark(base,.4)]]);c.fill();}
function bLockEdge(c,sp,[rx,ry,tx,ty,w,bend]){const dx=tx-rx,dy=ty-ry,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,mx=(rx+tx)/2+nx*bend,my=(ry+ty)/2+ny*bend,q=(t,o)=>{const a=(1-t)*(1-t),b=2*(1-t)*t,d=t*t;return [a*(rx+nx*o)+b*(mx+nx*o*.84)+d*tx,a*(ry+ny*o)+b*(my+ny*o*.84)+d*ty];};
 c.beginPath();let [x,y]=q(.38,w/2);c.moveTo(x,y);for(let t=.46;t<=1.001;t+=.08){[x,y]=q(t,w/2);c.lineTo(x,y);}c.stroke();}
function bCapPath(c,[x0,y0,x1,y1,top]){c.moveTo(x0,y0);c.bezierCurveTo(x0-10,top-10,(x0+x1)/2-40,top-48,(x0+x1)/2,top-40);c.bezierCurveTo((x0+x1)/2+44,top-44,x1+12,top-6,x1,y1);c.quadraticCurveTo((x0+x1)/2,top-20,x0,y0);c.closePath();}
function bHairUnion(c,hair){c.beginPath();bCapPath(c,hair.cap);for(const l of hair.front){const [rx,ry,tx,ty,w,bend]=l,dx=tx-rx,dy=ty-ry,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,mx=(rx+tx)/2+nx*bend,my=(ry+ty)/2+ny*bend;c.moveTo(rx+nx*w/2,ry+ny*w/2);c.quadraticCurveTo(mx+nx*w*.42,my+ny*w*.42,tx,ty);c.quadraticCurveTo(mx-nx*w*.42,my-ny*w*.42,rx-nx*w/2,ry-ny*w/2);c.closePath();}}
// one inked silhouette, clumped locks inside, and a single glossy band (anime-style hair)
function bFrontHair(c,sp,hair){if(!hair.cap)return;const ink=bMix(INKLINE,sp.hair,.25),t=hair.cap[4];c.save();c.lineJoin='round';
 bHairUnion(c,hair);c.strokeStyle=ink;c.lineWidth=3;c.stroke();
 c.beginPath();bCapPath(c,hair.cap);c.fillStyle=bLin(c,0,t-50,0,hair.cap[1],[[0,bLight(sp.hair,.1)],[.6,sp.hair],[1,bDark(sp.hair,.35)]]);c.fill();
 hair.front.forEach((l,i)=>bLockFill(c,sp,l,i));
 c.strokeStyle=bA(bDark(sp.hair,.7),.55);c.lineWidth=1.2;c.lineCap='round';for(const l of hair.front)bLockEdge(c,sp,l);
 bHairUnion(c,hair);c.clip();
 bSoft(c,1.6,()=>{c.moveTo(118,t+6);c.quadraticCurveTo(186,t-50,256,t);for(let i=0;i<=20;i++){const x=256-i*6.9,y=t+6-Math.sin(i/20*Math.PI)*42+(i%2?6:0);c.lineTo(x,y);}c.closePath();},bA(bLight(sp.hair,.6),.36));
 bSoft(c,3,()=>{c.moveTo(118,t-40);c.lineTo(256,t-40);c.lineTo(256,t-10);c.quadraticCurveTo(186,t-60,118,t-4);c.closePath();},bA(bLight(sp.hair,.3),.25));
 c.restore();}
function bBackHair(c,sp){c.save();if(sp.style==='long'){c.beginPath();c.moveTo(118,116);c.bezierCurveTo(66,190,48,320,62,430);c.bezierCurveTo(140,440,240,440,312,430);c.bezierCurveTo(318,320,300,190,256,120);c.closePath();c.fillStyle=bLin(c,0,116,0,430,[[0,sp.hair],[1,bDark(sp.hair,.5)]]);c.fill();
  c.strokeStyle=bA(bDark(sp.hair,.6),.6);c.lineWidth=1.2;for(let i=0;i<9;i++){c.beginPath();c.moveTo(110+i*18,140);c.quadraticCurveTo(80+i*24,280,66+i*28,430);c.stroke();}}
 if(sp.style==='braid'||sp.style==='swept'){bEll(c,150,146,38,52,.25);c.fillStyle=bDark(sp.hair,.25);c.fill();}c.restore();}
function bBraid(c,sp){c.save();for(let i=0;i<11;i++){const t=i/10,x=124-t*30+Math.sin(i*1.3)*2,y=212+i*17;c.save();c.translate(x,y);c.rotate(i%2?.5:-.5);bEll(c,i%2?3:-3,0,13-t*3.5,10);c.fillStyle=bLin(c,-12,-10,12,10,[[0,bLight(sp.hair,.28)],[.5,sp.hair],[1,bDark(sp.hair,.45)]]);c.fill();c.strokeStyle=bA(bDark(sp.hair,.7),.8);c.lineWidth=1.2;c.stroke();
  c.fillStyle=bA(bLight(sp.hair,.6),.5);bEll(c,(i%2?3:-3)-3,-3.5,4.5,2);c.fill();c.restore();}
 c.beginPath();c.roundRect(86,384,18,9,3);c.fillStyle=sp.coat;c.fill();c.beginPath();c.moveTo(88,392);c.quadraticCurveTo(82,412,86,432);c.lineTo(100,432);c.quadraticCurveTo(104,412,102,392);c.fillStyle=bDark(sp.hair,.15);c.fill();c.restore();}
function bBald(c,sp,sk){c.save();bEll(c,186,124,58,48);c.fillStyle=bRad(c,166,98,4,186,124,62,[[0,sk.light],[.6,sk.base],[1,sk.shade]]);c.fill();c.strokeStyle=bA(sk.deep,.6);c.lineWidth=1.5;c.stroke();
 bEll(c,170,96,16,8,-.3);c.fillStyle=bA('#ffffff',.25);c.fill();
 if(sp.style==='mohawk'){for(let i=6;i>=0;i--){const l=[146+i*15,104-i*3,128+i*15,62-i*3+(i%2)*10,22,-6];bLockPath(c,l);c.fillStyle=bLin(c,l[0],l[1],l[2],l[3],[[0,bDark(sp.hair,.2)],[1,bLight(sp.hair,.25)]]);c.fill();c.strokeStyle=bA(bDark(sp.hair,.7),.8);c.lineWidth=1.3;c.stroke();}}
 for(const [x,y,rx,ry]of[[136,160,10,26],[240,154,7,22]]){bEll(c,x,y,rx,ry);c.fillStyle=bA(sp.hair,sp.age>=3?.9:.6);c.fill();}c.restore();}
function bBeard(c,sp,g,sk){if(!sp.beard||sp.beard==='stubble')return;const col=sp.beardColor||sp.hair,long=sp.beard==='long',bot=long?332:284;c.save();if(sp.beard==='mustache'){c.restore();bMustache(c,col,g);return;}c.beginPath();c.moveTo(136,192);c.bezierCurveTo(138,236,160,long?300:270,198,bot);
 c.bezierCurveTo(234,long?300:268,242,236,240,192);c.bezierCurveTo(234,216,224,238,214,244);c.quadraticCurveTo(200,250,184,244);c.bezierCurveTo(170,236,152,220,136,192);c.closePath();
 c.fillStyle=bLin(c,0,200,0,bot,[[0,bLight(col,.12)],[1,bDark(col,.38)]]);c.fill();c.strokeStyle=bA(bDark(col,.6),.7);c.lineWidth=1.3;c.stroke();c.clip();
 c.lineCap='round';for(let i=0;i<30;i++){const x=138+i*3.5;c.strokeStyle=i%3?bA(bDark(col,.45),.55):bA(bLight(col,.4),.5);c.lineWidth=1.3;c.beginPath();c.moveTo(x,214+Math.abs(i-15)*.8);c.quadraticCurveTo(x+2,250,x+(i-15)*.7,bot+4);c.stroke();}c.restore();
 bMustache(c,col,g);}
function bMustache(c,col,g){c.save();c.beginPath();c.moveTo(178,g.mouthY-3);c.bezierCurveTo(188,g.mouthY-10,212,g.mouthY-10,222,g.mouthY-3);c.bezierCurveTo(216,g.mouthY+9,207,g.mouthY-1,200,g.mouthY-2);c.bezierCurveTo(193,g.mouthY-1,184,g.mouthY+9,178,g.mouthY-3);c.fillStyle=bLin(c,0,g.mouthY-10,0,g.mouthY+8,[[0,bLight(col,.1)],[1,bDark(col,.3)]]);c.fill();c.restore();}

// ---------- headwear ----------
function bHoodBack(c,sp){const col=sp.hood;c.save();c.beginPath();c.moveTo(70,330);c.bezierCurveTo(90,200,96,70,186,58);c.bezierCurveTo(276,52,288,190,300,320);c.bezierCurveTo(250,300,140,300,70,330);c.closePath();
 c.fillStyle=bLin(c,80,0,300,0,[[0,bDark(col,.2)],[.5,col],[1,bDark(col,.35)]]);c.fill();c.restore();}
function bHoodFront(c,sp){const col=sp.hood;c.save();c.lineCap='round';c.beginPath();c.moveTo(118,250);c.bezierCurveTo(100,150,126,72,186,66);c.bezierCurveTo(250,62,272,150,254,250);
 c.strokeStyle=bLight(col,.2);c.lineWidth=16;c.stroke();if(sp.trim&&sp.sigil){c.strokeStyle=sp.trim;c.lineWidth=2.4;c.stroke();}c.restore();}
function bHat(c,sp,rng){const h=sp.hat,col=sp.hatColor||'#6b6d6a';c.save();
 if(h==='witch'){c.beginPath();c.moveTo(118,104);c.bezierCurveTo(150,60,168,30,214,4);c.bezierCurveTo(226,-2,240,6,232,14);c.bezierCurveTo(222,30,236,60,258,98);c.closePath();c.fillStyle=bLin(c,120,0,260,0,[[0,bLight(col,.15)],[.6,col],[1,bDark(col,.45)]]);c.fill();
  c.beginPath();c.moveTo(126,92);c.quadraticCurveTo(190,80,252,88);c.lineTo(256,104);c.quadraticCurveTo(190,94,122,108);c.closePath();c.fillStyle=sp.trim;c.fill();
  bEll(c,188,108,140,24,-.06);c.fillStyle=bLin(c,0,84,0,132,[[0,bLight(col,.1)],[1,bDark(col,.5)]]);c.fill();c.strokeStyle=bA(bDark(col,.6),.8);c.lineWidth=1.5;c.stroke();
  bEll(c,262,96,7,7);c.fillStyle=bRad(c,260,94,0,262,96,8,[[0,'#ffffff'],[.4,sp.gem||'#9ad6ff'],[1,bDark(sp.gem||'#9ad6ff',.5)]]);c.fill();}
 if(h==='kettle'){bEll(c,186,112,96,22);c.fillStyle=bLin(c,0,90,0,134,[[0,bLight(col,.3)],[1,bDark(col,.5)]]);c.fill();c.beginPath();c.moveTo(124,112);c.bezierCurveTo(124,56,248,56,248,112);c.closePath();c.fillStyle=bRad(c,166,74,4,186,100,70,[[0,bLight(col,.5)],[.6,col],[1,bDark(col,.4)]]);c.fill();c.strokeStyle=bDark(col,.5);c.lineWidth=1.5;c.stroke();}
 if(h==='cap'){c.beginPath();c.moveTo(126,128);c.bezierCurveTo(124,62,250,60,250,126);c.quadraticCurveTo(188,112,126,128);c.fillStyle=bLin(c,0,70,0,128,[[0,bLight(col,.25)],[1,bDark(col,.35)]]);c.fill();}
 if(h==='beret'){bEll(c,176,94,74,30,-.15);c.fillStyle=bLin(c,0,64,0,124,[[0,bLight(col,.25)],[1,bDark(col,.35)]]);c.fill();bEll(c,186,112,60,8,-.05);c.fillStyle=bDark(col,.35);c.fill();}
 if(h==='bandana'){c.beginPath();c.moveTo(128,128);c.quadraticCurveTo(188,104,248,124);c.lineTo(246,140);c.quadraticCurveTo(188,122,130,146);c.closePath();c.fillStyle=col;c.fill();c.beginPath();c.moveTo(130,138);c.lineTo(104,150);c.lineTo(112,166);c.closePath();c.fill();}
 if(h==='hood'){bHoodFront(c,{hood:col});}
 c.restore();}

// ---------- outfits ----------
function bMetal(c,x0,y0,x1,y1,m){return bLin(c,x0,y0,x1,y1,[[0,bLight(m,.55)],[.35,m],[.7,bDark(m,.35)],[1,bDark(m,.6)]]);}
function bPauldron(c,x,y,rx,ry,rot,m,trim){bEll(c,x-6*Math.sign(rot),y+26,rx*.86,ry*.62,rot);c.fillStyle=bMetal(c,x-rx,y,x+rx,y+ry*1.6,bDark(m,.12));c.fill();c.strokeStyle=trim;c.lineWidth=2.5;c.stroke();
 bEll(c,x,y,rx,ry,rot);c.fillStyle=bRad(c,x-rx*.35,y-ry*.4,4,x,y,rx*1.05,[[0,bLight(m,.7)],[.45,m],[1,bDark(m,.55)]]);c.fill();c.strokeStyle=trim;c.lineWidth=3;c.stroke();
 for(const k of [-.55,0,.55]){bEll(c,x+Math.cos(rot)*rx*k*.9,y+ry*.72+Math.sin(rot)*rx*k*.9,2.2,2.2);c.fillStyle=bLight(trim,.3);c.fill();}}
function bOutfit(c,sp,rng,sk){const o=sp.outfit,coat=sp.coat||'#6b6d6a',trim=sp.trim||'#c9a24a';c.save();
 const cloth=(col)=>{bTorsoPath(c);c.fillStyle=bLin(c,0,280,0,446,[[0,bLight(col,.12)],[1,bDark(col,.45)]]);c.fill();c.save();bTorsoPath(c);c.clip();c.fillStyle=bLin(c,0,0,366,0,[[0,bA('#000',.1)],[.4,bA('#fff',.06)],[1,bA('#000',.35)]]);c.fillRect(0,270,366,180);bBrush(c,rng,0,290,366,150,bLight(col,.25),bDark(col,.5),22,30,3);c.restore();};
 if(sp.cape){c.beginPath();c.moveTo(-6,446);c.bezierCurveTo(-10,360,20,300,90,292);c.lineTo(290,296);c.bezierCurveTo(350,310,372,380,370,446);c.closePath();c.fillStyle=bLin(c,0,290,0,446,[[0,sp.cape],[1,bDark(sp.cape,.5)]]);c.fill();}
 if(o==='plate'){const m=sp.metal||'#8a9096';cloth(sp.under||coat);
  c.beginPath();c.moveTo(108,306);c.bezierCurveTo(140,292,232,290,266,306);c.lineTo(254,446);c.lineTo(118,446);c.closePath();c.fillStyle=bMetal(c,108,0,266,0,m);c.fill();c.strokeStyle=trim;c.lineWidth=3;c.stroke();
  c.save();c.clip();c.fillStyle=bLin(c,0,300,0,446,[[0,bA('#fff',.18)],[1,bA('#000',.35)]]);c.fillRect(100,290,170,160);c.strokeStyle=bA(bLight(m,.7),.8);c.lineWidth=2;c.beginPath();c.moveTo(186,300);c.lineTo(190,446);c.stroke();c.strokeStyle=bA(bDark(m,.6),.6);c.beginPath();c.moveTo(192,300);c.lineTo(196,446);c.stroke();
  c.strokeStyle=trim;c.lineWidth=2;c.beginPath();c.moveTo(118,360);c.quadraticCurveTo(188,344,260,360);c.stroke();c.restore();
  if(sp.emblem==='shield'){c.beginPath();c.moveTo(176,372);c.lineTo(204,372);c.lineTo(204,392);c.quadraticCurveTo(200,404,190,410);c.quadraticCurveTo(180,404,176,392);c.closePath();c.fillStyle=sp.under;c.fill();c.strokeStyle=trim;c.lineWidth=2;c.stroke();}
  if(sp.emblem==='lion'){bEll(c,190,384,16,16);c.fillStyle=bRad(c,186,378,2,190,384,18,[[0,bLight(trim,.4)],[1,bDark(trim,.3)]]);c.fill();c.fillStyle=bDark(trim,.6);for(const [x,y]of[[184,382],[196,382]]){bEll(c,x,y,2,1.5);c.fill();}c.fillRect(186,390,8,2);}
  if(sp.collar){for(let i=0;i<16;i++){const a=Math.PI*(1.05+i/15*.9),x=186+Math.cos(a)*-70,y=300+Math.sin(a)*-22;c.beginPath();c.moveTo(x-10,y+6);c.quadraticCurveTo(x,y-22,x+10,y+6);c.closePath();c.fillStyle=i%2?sp.collar:bDark(sp.collar,.25);c.fill();}}
  c.beginPath();c.moveTo(138,292);c.bezierCurveTo(150,268,222,268,234,292);c.lineTo(230,306);c.bezierCurveTo(212,292,160,292,142,306);c.closePath();c.fillStyle=bMetal(c,138,0,234,0,m);c.fill();c.strokeStyle=trim;c.lineWidth=2;c.stroke();
  bPauldron(c,70,326,62,38,-.36,m,trim);bPauldron(c,300,322,50,32,.34,m,trim);}
 else if(o==='coat'){cloth(coat);
  c.beginPath();c.moveTo(160,282);c.lineTo(214,282);c.lineTo(190,392);c.closePath();c.fillStyle=sp.shirt||'#2b3036';c.fill();
  for(const [a,b,d,e]of[[150,282,112,348],[226,282,262,340]]){c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.lineTo(188,430);c.lineTo(a<188?172:206,300);c.closePath();c.fillStyle=bLin(c,a,b,188,430,[[0,bDark(coat,.08)],[1,bDark(coat,.45)]]);c.fill();c.strokeStyle=trim;c.lineWidth=2.2;c.stroke();}
  for(let i=0;i<4;i++){bEll(c,214-i*5,330+i*26,3.4,3.4);c.fillStyle=bRad(c,213-i*5,329+i*26,0,214-i*5,330+i*26,4,[[0,'#fff2c0'],[1,bDark(trim,.3)]]);c.fill();}
  for(const [x,y,rot,w]of[[70,312,-.28,46],[300,310,.28,36]]){bEll(c,x,y,w,12,rot);c.fillStyle=bLin(c,0,y-12,0,y+12,[[0,bLight(trim,.35)],[1,bDark(trim,.35)]]);c.fill();c.strokeStyle=bA(bDark(trim,.6),.8);c.lineWidth=1;for(let k=-4;k<=4;k++){c.beginPath();c.moveTo(x+k*w/5,y+8+Math.sin(rot)*k*w/5);c.lineTo(x+k*w/5,y+18+Math.sin(rot)*k*w/5);c.stroke();}}
  for(const [x0,x1]of[[146,160],[228,214]]){c.beginPath();c.moveTo(x0,256);c.lineTo(x1,296);c.lineTo((x0+x1)/2+(x0<x1?-10:10),300);c.lineTo(x0+(x0<x1?-8:8),266);c.closePath();c.fillStyle=bDark(coat,.18);c.fill();c.strokeStyle=trim;c.lineWidth=1.5;c.stroke();}
  if(sp.cloak){c.beginPath();c.moveTo(-6,446);c.lineTo(-6,360);c.bezierCurveTo(6,318,60,296,128,294);c.bezierCurveTo(118,330,92,380,96,446);c.closePath();c.fillStyle=bLin(c,0,294,120,446,[[0,bLight(sp.cloak,.15)],[1,bDark(sp.cloak,.45)]]);c.fill();c.strokeStyle=bA(bDark(sp.cloak,.5),.8);c.lineWidth=1.5;c.stroke();c.save();c.clip();bBrush(c,rng,0,300,130,150,bLight(sp.cloak,.4),bDark(sp.cloak,.5),20,30,5);c.restore();}
  if(sp.scarf)bScarf(c,sp.scarf,rng,false);}
 else if(o==='robe'||o==='shawl'){cloth(coat);
  c.beginPath();c.moveTo(152,284);c.lineTo(222,284);c.lineTo(192,380);c.closePath();c.fillStyle=sp.inner||bLight(coat,.4);c.fill();
  for(const side of [-1,1]){c.beginPath();c.moveTo(188+side*44,286);c.quadraticCurveTo(188+side*30,330,192,392);c.lineTo(192,410);c.quadraticCurveTo(188+side*44,340,188+side*60,290);c.closePath();c.fillStyle=bLin(c,0,286,0,410,[[0,bLight(trim,.3)],[1,bDark(trim,.3)]]);c.fill();}
  c.strokeStyle=bA(bDark(coat,.5),.4);c.lineWidth=2;for(const [x0,x1]of[[60,40],[100,92],[280,300],[318,340]]){c.beginPath();c.moveTo(x0,320);c.quadraticCurveTo((x0+x1)/2+6,380,x1,446);c.stroke();}
  if(sp.gem){bEll(c,192,384,10,12);c.fillStyle=bRad(c,189,380,1,192,384,13,[[0,'#ffffff'],[.35,sp.gem],[1,bDark(sp.gem,.55)]]);c.fill();c.strokeStyle=sp.trim;c.lineWidth=2;c.stroke();}
  if(sp.sigil){c.save();c.translate(104,384);c.strokeStyle=sp.trim;c.fillStyle=sp.trim;c.lineWidth=2;bEll(c,0,0,11,11);c.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;c.beginPath();c.moveTo(Math.cos(a)*14,Math.sin(a)*14);c.lineTo(Math.cos(a)*(i%2?19:23),Math.sin(a)*(i%2?19:23));c.stroke();}bEll(c,0,0,4,4);c.fill();c.restore();}
  if(o==='shawl'){c.beginPath();c.moveTo(-6,350);c.bezierCurveTo(40,296,120,290,160,286);c.lineTo(218,286);c.bezierCurveTo(280,292,340,310,366,350);c.lineTo(366,392);c.bezierCurveTo(260,380,230,420,190,446);c.bezierCurveTo(150,420,100,380,-6,400);c.closePath();c.fillStyle=bLin(c,0,286,0,446,[[0,bLight(sp.shawl,.1)],[1,bDark(sp.shawl,.4)]]);c.fill();c.strokeStyle=bA(bDark(sp.shawl,.5),.7);c.lineWidth=1.5;c.stroke();}}
 else if(o==='leather'){cloth(coat);
  c.beginPath();c.moveTo(128,300);c.bezierCurveTo(160,290,220,290,250,300);c.lineTo(244,446);c.lineTo(134,446);c.closePath();c.fillStyle=bLin(c,128,0,250,0,[[0,bLight(sp.leather||'#7a5536',.2)],[.6,sp.leather||'#7a5536'],[1,bDark(sp.leather||'#7a5536',.45)]]);c.fill();c.strokeStyle=bDark(sp.leather||'#7a5536',.5);c.lineWidth=1.5;c.stroke();
  c.strokeStyle=bLight(trim,.1);c.lineWidth=1.6;for(let i=0;i<5;i++){c.beginPath();c.moveTo(182,318+i*22);c.lineTo(198,330+i*22);c.moveTo(198,318+i*22);c.lineTo(182,330+i*22);c.stroke();}
  c.beginPath();c.moveTo(60,296);c.lineTo(84,290);c.lineTo(330,446);c.lineTo(296,446);c.closePath();c.fillStyle=bLin(c,60,290,330,446,[[0,'#6a4a30'],[1,'#3e2a1c']]);c.fill();c.strokeStyle='#2a1c12';c.lineWidth=1;c.stroke();
  c.beginPath();c.roundRect(170,356,20,16,3);c.strokeStyle=trim;c.lineWidth=2.4;c.stroke();
  bEll(c,188,292,10,8);c.fillStyle=bRad(c,186,290,0,188,292,10,[[0,'#fff2c0'],[1,bDark(trim,.3)]]);c.fill();}
 else if(o==='jacket'){cloth(coat);c.strokeStyle=bA(bDark(coat,.6),.7);c.lineWidth=2;c.beginPath();c.moveTo(214,300);c.quadraticCurveTo(200,360,176,446);c.stroke();
  for(const [x0,y0,x1,y1]of[[100,300,270,446],[270,300,110,446]]){c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.strokeStyle='#2a221c';c.lineWidth=7;c.stroke();c.strokeStyle=bA(trim,.6);c.lineWidth=1;c.stroke();}
  bScarf(c,sp.scarf,rng,true);}
 else if(o==='fur'){cloth(coat);for(let i=0;i<70;i++){const t=i/69,x=-6+t*372,y=300+Math.abs(t-.5)*-40+Math.sin(i*1.7)*6+(t<.5?(0.5-t)*70:(t-.5)*70)*.6;c.beginPath();c.moveTo(x-12,y+20);c.quadraticCurveTo(x+(i%2?4:-4),y-22,x+12,y+20);c.closePath();c.fillStyle=i%3?bMix(sp.fur||'#8a7558','#000',rng()*.3):bLight(sp.fur||'#8a7558',.25);c.fill();}}
 else if(o==='apron'){cloth(coat);c.beginPath();c.moveTo(132,330);c.lineTo(246,330);c.lineTo(254,446);c.lineTo(124,446);c.closePath();c.fillStyle=bLin(c,0,330,0,446,[[0,sp.apron||'#5a3c2a'],[1,bDark(sp.apron||'#5a3c2a',.4)]]);c.fill();for(const x of [140,238]){c.beginPath();c.moveTo(x,332);c.lineTo(x<188?160:216,282);c.strokeStyle=bDark(sp.apron||'#5a3c2a',.2);c.lineWidth=7;c.stroke();}}
 else if(o==='vest'){cloth(coat);for(const side of [-1,1]){c.beginPath();c.moveTo(188+side*30,286);c.lineTo(188+side*6,380);c.lineTo(188+side*8,446);c.lineTo(188+side*120,446);c.lineTo(188+side*96,300);c.closePath();c.fillStyle=bLin(c,0,286,0,446,[[0,sp.vest],[1,bDark(sp.vest,.45)]]);c.fill();c.strokeStyle=trim;c.lineWidth=1.6;c.stroke();}}
 else {cloth(coat);if(sp.mail){for(const [cx,cy]of[[70,320],[300,316]]){c.save();bEll(c,cx,cy,64,36,cx<180?-.3:.3);c.clip();c.fillStyle='#8a9096';c.fillRect(cx-70,cy-40,140,80);c.strokeStyle='#5a6066';c.lineWidth=1;for(let y=cy-40;y<cy+40;y+=5)for(let x=cx-70+(y%10?2.5:0);x<cx+70;x+=5){c.beginPath();c.arc(x,y,2,0,Math.PI);c.stroke();}c.restore();}}
  c.beginPath();c.moveTo(150,282);c.quadraticCurveTo(188,312,226,282);c.strokeStyle=trim;c.lineWidth=4;c.stroke();}
 c.restore();}
function bScarf(c,col,rng,big){c.save();const fill=bLin(c,0,256,0,320,[[0,bLight(col,.2)],[1,bDark(col,.35)]]);
 c.beginPath();c.moveTo(138,big?256:266);c.bezierCurveTo(150,big?300:296,226,big?302:298,238,big?258:268);c.lineTo(244,big?286:290);c.bezierCurveTo(226,big?330:318,148,big?332:318,132,big?288:292);c.closePath();c.fillStyle=fill;c.fill();
 c.strokeStyle=bA(bDark(col,.5),.7);c.lineWidth=1.5;c.stroke();for(let i=0;i<4;i++){c.beginPath();c.moveTo(150+i*24,big?286:290);c.quadraticCurveTo(160+i*24,(big?300:300)+i%2*4,168+i*24,big?316:308);c.stroke();}
 c.beginPath();c.moveTo(big?150:220,big?306:300);c.bezierCurveTo(big?136:236,360,big?120:250,400,big?112:262,446);c.lineTo(big?146:290,446);c.bezierCurveTo(big?152:276,400,big?168:256,350,big?176:244,304);c.closePath();c.fillStyle=bLin(c,0,300,0,446,[[0,col],[1,bDark(col,.45)]]);c.fill();c.stroke();c.restore();}
function bQuiver(c){c.save();c.translate(64,262);c.rotate(-.5);c.fillStyle='#5a3e28';c.fillRect(-10,0,22,70);for(let i=0;i<4;i++){c.save();c.translate(-6+i*6,0);c.fillStyle=i%2?'#e9e2cf':'#b8483a';c.beginPath();c.moveTo(0,0);c.lineTo(-4,-18);c.lineTo(2,-26);c.lineTo(5,-14);c.closePath();c.fill();c.restore();}c.restore();}
function bHoodDown(c,col){c.save();bEll(c,188,286,74,24);c.fillStyle=bLin(c,0,262,0,312,[[0,bLight(col,.12)],[1,bDark(col,.4)]]);c.fill();c.strokeStyle=bA(bDark(col,.6),.7);c.lineWidth=1.5;for(let i=0;i<5;i++){c.beginPath();c.moveTo(126+i*30,278);c.quadraticCurveTo(132+i*30,292,128+i*30,306);c.stroke();}c.restore();}

// ---------- composition ----------
function paintBust(c,key,expr){const sp=bustSpecOf(key),g=bGeom(sp),sk=bSkin(sp),rng=bRng(bSeed(key)),hair=bHairDef(sp);
 c.save();if(sp.face==='f'){c.translate(188,0);c.scale(.92,1);c.translate(-188,0);}
 if(sp.hood)bHoodBack(c,sp);bBackHair(c,sp);if(sp.quiver)bQuiver(c);bNeck(c,sk,g);bOutfit(c,sp,rng,sk);if(sp.hoodDown)bHoodDown(c,sp.hoodDown);if(sp.outfit==='leather'&&sp.hoodDown){bEll(c,188,292,10,8);c.fillStyle=sp.trim;c.fill();}
 c.restore();c.save();c.translate(186,270);c.scale(1.1,1.1);c.translate(-186,-262);
 if(sp.style==='bald'||sp.style==='mohawk')bBald(c,sp,sk);bEar(c,sk);bFace(c,sp,g,sk,hair);bFeatures(c,sp,g,sk,expr);bBeard(c,sp,g,sk);bFrontHair(c,sp,hair);
 if(sp.style==='braid')bBraid(c,sp);if(sp.hood)bHoodFront(c,sp);if(sp.hat)bHat(c,sp,rng);c.restore();}
const bustCache=new Map();
export function bustCanvas(key,expr='neutral',scale=2){const id=`${key}|${expr}|${scale}`;let out=bustCache.get(id);if(out)return out;
 const raw=document.createElement('canvas');raw.width=BUST_W*scale;raw.height=BUST_H*scale;const r=raw.getContext('2d');r.scale(scale,scale);r.translate(0,16);paintBust(r,key,expr);
 // a warm rim of shadow so the bust reads over any scene, like an inked illustration edge
 out=document.createElement('canvas');out.width=raw.width;out.height=raw.height;const o=out.getContext('2d');o.shadowColor='rgba(8,6,12,.75)';o.shadowBlur=6*scale;o.drawImage(raw,0,0);o.shadowColor='transparent';o.drawImage(raw,0,0);
 bustCache.set(id,out);if(bustCache.size>40)bustCache.delete(bustCache.keys().next().value);return out;}
// Painted portraits (ChatGPT-made pack r2, user-supplied 2026-10-18): 720×880 WebP, embedded by the
// build as ASHEN_PORTRAITS {id:{expression:dataURL}}. Missing expression → neutral; missing id or a
// failed decode → the vector bust above. Images are created once and redrawn when decoded.
const PAINTED=typeof ASHEN_PORTRAITS!=='undefined'?ASHEN_PORTRAITS:null;
const paintedImages=new Map();
export const hasPainted=key=>!!PAINTED?.[paintedId(key)];
const PAINTED_ALIAS={'cast:captain':'garr','cast:deserterCaptain':'deserterCaptain','cast:pursuerCaptain':'pursuerCaptain','cast:quartermaster':'quartermaster','cast:executor':'executor'};
export const paintedId=key=>PAINTED_ALIAS[key]||key;
export function paintedImage(key,expr='neutral'){key=paintedId(key);const set=PAINTED?.[key];if(!set||typeof Image==='undefined')return null;const e=set[expr]?expr:'neutral';if(!set[e])return null;const id=`${key}|${e}`;let img=paintedImages.get(id);if(!img){img=new Image();img.decoding='async';img.src=set[e];paintedImages.set(id,img);}return img.failed?null:img;}
function whenPainted(c,img,token,paint,fallback){const canvas=c.canvas;canvas.dataset.painting=token;if(img.complete&&img.naturalWidth){paint();return;}c.clearRect(0,0,canvas.width,canvas.height);
 img.addEventListener('load',()=>{if(canvas.isConnected!==false&&canvas.dataset.painting===token)paint();},{once:true});img.addEventListener('error',()=>{img.failed=true;if(canvas.dataset.painting===token)fallback();},{once:true});}
function drawVectorBust(c,key,expression){const src=bustCanvas(key,expression,Math.max(1,Math.round(c.canvas.width/BUST_W)));c.clearRect(0,0,c.canvas.width,c.canvas.height);c.imageSmoothingEnabled=true;c.drawImage(src,0,0,c.canvas.width,c.canvas.height);}
export function drawBust(c,u,{expression='neutral',missionId=1}={}){const key=bustKey(u,missionId),img=paintedImage(key,expression);
 if(img){const W=c.canvas.width,H=c.canvas.height;whenPainted(c,img,`bust|${key}|${expression}`,()=>{c.clearRect(0,0,W,H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';const k=Math.min(W/img.naturalWidth,H/img.naturalHeight),w=img.naturalWidth*k,h=img.naturalHeight*k;c.drawImage(img,(W-w)/2,H-h,w,h);},()=>drawVectorBust(c,key,expression));return key;}
 drawVectorBust(c,key,expression);return key;}
// Head-and-shoulders crop of the painted bust for small square portraits (dock, unit sheet, council…).
const HEAD_CROP={lia:[150,150,430],sain:[140,70,440],default:[150,40,420]};
export function drawPaintedHead(c,u,{expression='neutral',missionId=1}={}){const key=bustKey(u,missionId),img=paintedImage(key,expression);if(!img)return false;const W=c.canvas.width,H=c.canvas.height,[sx,sy,ss]=HEAD_CROP[paintedId(key)]||HEAD_CROP.default;
 whenPainted(c,img,`head|${key}|${expression}`,()=>{c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.fillStyle='#22383c';c.fillRect(0,0,W,H);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,230,180,.10)');g.addColorStop(1,'rgba(0,0,0,.25)');c.fillStyle=g;c.fillRect(0,0,W,H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';const f=img.naturalWidth/720;c.drawImage(img,sx*f,sy*f,ss*f,ss*f,0,0,W,H);c.restore();},()=>{});return true;}
