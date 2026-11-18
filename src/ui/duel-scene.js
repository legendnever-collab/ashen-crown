// v2.2.0 (D-123, docs/v2.2.0/DUEL_SCENE_DESIGN.md): the duel plays in its own window as a short fight between the two —
// a 16:9 stage, the pair's busts (VS), three exchanges, a slow-motion finishing blow, the foe down on one knee and our hero's
// LEVEL UP. The duel is already decided in the state (core/duel.js duelWin) before the scene starts; the scene only shows it.
// Art pack I: duel_<id> action sheets (4×2 cells of 512: ready, dash, strike, bind, guard, recoil, finisher, end),
// finisher_<hero> key art and duelbg_<stage> backdrops in ASHEN_DUEL. Until they arrive the map figure is drawn large and
// the dsBackdrop is painted here.
import {drawHDFigure,hdCastFor} from '../render/hd-world.js';
import {drawBust,BUST_W,BUST_H} from '../render/bust.js';

const DS_ART=typeof ASHEN_DUEL!=='undefined'?ASHEN_DUEL:{};
const dsImages=new Map();
function dsImage(id){if(!DS_ART[id]||typeof Image==='undefined')return null;let im=dsImages.get(id);if(!im){im=new Image();im.src=DS_ART[id];dsImages.set(id,im);}return im.complete&&im.naturalWidth?im:null;}
export const DUEL_STAGE={1:'village',5:'road',9:'road',18:'road',10:'fortress',13:'fortress',16:'fortress',25:'fortress',12:'rite',19:'rite',20:'rite',21:'rite',26:'crown',29:'crown'};
export const DUEL_STAGE_KO={village:'불타는 잿빛 마을',road:'국경의 숲길',fortress:'성채 마당',rite:'의식 광장',crown:'왕관의 홀'};
// The duel sheet each duellist uses (heroes switch to the awakened sheet at tier 3).
const DS_FOE_SHEET={'duel:1:garr':'garr','duel:5:baldrick':'baldrick','duel:13:baldrick':'baldrick','26:duel':'baldrick','duel:9:chief':'chief','duel:10:oswin':'oswin','duel:10:brennan':'brennan',
 'duel:12:abbot':'abbot','16:duel':'captain16','duel:18:logger':'logger','duel:19:overseer':'overseer','20:duel':'greyMaster','21:duel':'riteCommander','duel:25:hardliner':'hardliner','29:duel':'bellard'};
export const duelSheetOf=(u,key)=>u?.team==='ally'?(u.classTier>=3&&['eric','elina','kai','lia','thea'].includes(u.id)?`duel_${u.id}_t3`:`duel_${u.id}`):`duel_${DS_FOE_SHEET[key]||u?.id}`;
const DS_POSES=['ready','dash','strike','bind','guard','recoil','finisher','end'];
const DS_W=1280,DS_H=720,DS_FLOOR=600;
const DS_LOOK={village:{sky:['#1c0f18','#6a2a1c','#d0652a'],ground:['#3a2618','#1c120c'],ember:'255,176,80',fx:'fire'},
 road:{sky:['#141c2c','#4a4650','#c88a4a'],ground:['#2c3622','#141a10'],ember:'240,214,150',fx:'trees'},
 fortress:{sky:['#10161f','#28303e','#5e6676'],ground:['#3a3a3c','#18181a'],ember:'255,170,80',fx:'walls'},
 rite:{sky:['#120c1c','#33243f','#6a5478'],ground:['#2a2430','#121016'],ember:'200,160,255',fx:'pillars'},
 crown:{sky:['#0c1220','#22304a','#7d93b4'],ground:['#30323a','#16171c'],ember:'224,232,255',fx:'windows'}};
// A seeded painter for the temporary backdrops (the same picture each time a stage is used).
function dsRand(seed){let x=seed>>>0||1;return ()=>((x=(x*1664525+1013904223)>>>0)/4294967296);}
const dsBackdrops=new Map();
function dsBackdrop(stage){const art=dsImage(`duelbg_${stage}`);if(art)return art;let cv=dsBackdrops.get(stage);if(cv)return cv;
 cv=document.createElement('canvas');cv.width=DS_W;cv.height=DS_H;const g=cv.getContext('2d'),L=DS_LOOK[stage]||DS_LOOK.road,r=dsRand(stage.length*977);
 let gr=g.createLinearGradient(0,0,0,DS_FLOOR);L.sky.forEach((col,i)=>gr.addColorStop(i/(L.sky.length-1),col));g.fillStyle=gr;g.fillRect(0,0,DS_W,DS_FLOOR);
 const ridge=(base,amp,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,DS_FLOOR);for(let x=0;x<=DS_W;x+=40)g.lineTo(x,base-amp*r());g.lineTo(DS_W,DS_FLOOR);g.closePath();g.fill();};
 ridge(430,90,'rgba(20,18,26,.55)');ridge(500,60,'rgba(12,10,16,.75)');
 g.fillStyle='rgba(8,8,12,.92)';
 if(L.fx==='fire'||L.fx==='walls'){for(let i=0;i<7;i++){const x=i*190+r()*60,w=110+r()*70,h=L.fx==='walls'?150+r()*60:90+r()*50;g.fillRect(x,DS_FLOOR-h,w,h);if(L.fx==='fire'){g.beginPath();g.moveTo(x-10,DS_FLOOR-h);g.lineTo(x+w/2,DS_FLOOR-h-55-r()*30);g.lineTo(x+w+10,DS_FLOOR-h);g.fill();}else for(let k=0;k<w;k+=26)g.fillRect(x+k,DS_FLOOR-h-16,14,16);}}
 if(L.fx==='trees')for(let i=0;i<16;i++){const x=r()*DS_W,h=180+r()*160;g.beginPath();g.moveTo(x,DS_FLOOR-h);g.lineTo(x-34-r()*18,DS_FLOOR);g.lineTo(x+34+r()*18,DS_FLOOR);g.closePath();g.fill();}
 if(L.fx==='pillars')for(let i=0;i<6;i++){const x=80+i*220+r()*40,h=170+r()*170;g.fillRect(x,DS_FLOOR-h,46,h);g.fillRect(x-10,DS_FLOOR-h-14,66,14);}
 if(L.fx==='windows'){for(let i=0;i<5;i++){const x=120+i*250;g.fillStyle='rgba(150,180,230,.25)';g.fillRect(x,150,70,240);g.beginPath();g.arc(x+35,150,35,Math.PI,0);g.fill();}g.fillStyle='rgba(8,8,12,.85)';g.fillRect(560,380,160,220);}
 if(L.fx==='fire'){const glow=g.createRadialGradient(DS_W/2,DS_FLOOR-40,10,DS_W/2,DS_FLOOR-40,620);glow.addColorStop(0,'rgba(255,120,40,.35)');glow.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=glow;g.fillRect(0,0,DS_W,DS_FLOOR);}
 gr=g.createLinearGradient(0,DS_FLOOR-10,0,DS_H);gr.addColorStop(0,L.ground[0]);gr.addColorStop(1,L.ground[1]);g.fillStyle=gr;g.fillRect(0,DS_FLOOR-10,DS_W,DS_H-DS_FLOOR+10);
 g.strokeStyle='rgba(0,0,0,.25)';for(let i=0;i<40;i++){g.beginPath();const y=DS_FLOOR+r()*(DS_H-DS_FLOOR);g.moveTo(r()*DS_W,y);g.lineTo(r()*DS_W,y+r()*4);g.stroke();}
 const vg=g.createRadialGradient(DS_W/2,DS_H*.55,DS_H*.3,DS_W/2,DS_H*.55,DS_W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=vg;g.fillRect(0,0,DS_W,DS_H);
 dsBackdrops.set(stage,cv);return cv;}
// One fighter. A painted duel sheet when pack I has delivered it; otherwise the map figure, large, posed by tilt and squash.
function dsFighter(c,f,pose,x,t,facing,glow){const sheet=dsImage(f.sheet);c.save();
 if(glow){c.shadowColor=glow;c.shadowBlur=28;}
 if(sheet){const i=DS_POSES.indexOf(pose),cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2,sx=(i%4)*cw,sy=Math.floor(i/4)*ch,size=430;c.drawImage(sheet,sx,sy,cw,ch,x-size/2,DS_FLOOR+18-size*480/512,size,size);c.restore();return;}
 const lean={dash:.16,strike:.1,bind:.12,guard:-.06,recoil:-.22,finisher:.18}[pose]||0,dir=facing==='right'?1:-1,kneel=pose==='end'&&f.foe;
 c.translate(x,DS_FLOOR+18);c.rotate(lean*dir+(kneel?-.12*dir:0));if(kneel)c.scale(1,.72);if(pose==='finisher')c.scale(1.08,1.08);
 const frame=pose==='dash'?1+Math.floor(t/90)%4:0,p=['strike','bind','finisher'].includes(pose)?'attack':'idle';
 c.globalAlpha=1;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(0,-6,88,16,0,0,Math.PI*2);c.fill();
 drawHDFigure(c,f.cast,0,0,{facing,frame,pose:p,scale:5.8});c.restore();}
// Light effects, painted with the canvas until pack I's effect sheet arrives.
function dsSpark(c,x,y,k,col='255,220,150'){c.save();c.globalCompositeOperation='lighter';const r=dsRand(Math.round(x*7+y));for(let i=0;i<22;i++){const a=r()*Math.PI*2,len=(30+r()*90)*k;c.strokeStyle=`rgba(${col},${(1-k*.6).toFixed(2)})`;c.lineWidth=2+r()*3;c.beginPath();c.moveTo(x+Math.cos(a)*len*.25,y+Math.sin(a)*len*.25);c.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len);c.stroke();}
 const g=c.createRadialGradient(x,y,0,x,y,90*k+20);g.addColorStop(0,`rgba(255,255,240,${(.9-k*.7).toFixed(2)})`);g.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,90*k+20,0,Math.PI*2);c.fill();c.restore();}
function dsSlash(c,x,y,k,dir,col='255,250,235'){c.save();c.globalCompositeOperation='lighter';c.translate(x,y);c.scale(dir,1);c.lineCap='round';
 for(const [w,a] of [[26,.25],[12,.6],[4,1]]){c.strokeStyle=`rgba(${col},${(a*(1-k)).toFixed(2)})`;c.lineWidth=w;c.beginPath();c.arc(-40,40,170,-2.3+k*.4,-.3+k*.9);c.stroke();}c.restore();}
function dsRing(c,x,y,k){c.save();c.globalCompositeOperation='lighter';c.strokeStyle=`rgba(255,236,190,${(1-k).toFixed(2)})`;c.lineWidth=10*(1-k)+2;c.beginPath();c.ellipse(x,y,40+400*k,14+120*k,0,0,Math.PI*2);c.stroke();c.restore();}
function dsSpeed(c,dir,k){c.save();c.strokeStyle=`rgba(255,255,255,${(.35*(1-k)).toFixed(2)})`;const r=dsRand(7);for(let i=0;i<26;i++){const y=120+r()*460,x=r()*DS_W,len=120+r()*260;c.lineWidth=1+r()*3;c.beginPath();c.moveTo(x,y);c.lineTo(x-dir*len,y);c.stroke();}c.restore();}
function dsEmbers(c,t,col){c.save();c.globalCompositeOperation='lighter';const r=dsRand(11);for(let i=0;i<60;i++){const sx=r()*DS_W,sp=20+r()*40,y=(DS_H-((t/1000*sp+r()*DS_H)%DS_H)),x=sx+Math.sin(t/700+i)*18;c.fillStyle=`rgba(${col},${(.25+r()*.5).toFixed(2)})`;c.fillRect(x,y,2+r()*2,2+r()*2);}c.restore();}
function dsColumn(c,x,k){c.save();c.globalCompositeOperation='lighter';const g=c.createLinearGradient(x-90,0,x+90,0);g.addColorStop(0,'rgba(255,210,90,0)');g.addColorStop(.5,`rgba(255,226,140,${(.75*Math.min(1,k*3)*(1-Math.max(0,k-.7)/.3)).toFixed(2)})`);g.addColorStop(1,'rgba(255,210,90,0)');c.fillStyle=g;c.fillRect(x-90,0,180,DS_FLOOR+20);
 const r=dsRand(3);for(let i=0;i<30;i++){const y=DS_FLOOR-((k*900+r()*DS_FLOOR)%DS_FLOOR),xx=x+(r()-.5)*150;c.fillStyle='rgba(255,240,180,.8)';c.fillRect(xx,y,3,3);}c.restore();}
const dsEase=k=>k<0?0:k>1?1:k*k*(3-2*k);
const dsLerp=(a,b,k)=>a+(b-a)*dsEase(k);
// The choreography: [start ms, end ms] for each beat. Reduced effects: no shake or flash, a shorter slow motion.
const DS_BEATS={intro:[0,1500],enter:[1500,2000],dash1:[2000,2400],bind1:[2400,2900],recoil1:[2900,3400],foeAtk:[3400,3800],guard:[3800,4200],counter:[4200,4600],recoil2:[4600,5100],
 rush:[5100,5700],finisher:[5700,6700],down:[6700,7200],level:[7200,9200]};
export const DUEL_SCENE_MS=9400;
let dsCurrent=null;
export const duelSceneOpen=()=>!!dsCurrent;
export function finishDuelScene(){const s=dsCurrent;if(!s)return;dsCurrent=null;cancelAnimationFrame(s.raf);s.root.remove();s.onDone?.();}
// opts: {hero:{unit,name}, foe:{unit,name}, key, missionId, levelFrom, levelTo, reduced, root, onDone}
export function playDuelScene(opts){if(dsCurrent)finishDuelScene();const {hero,foe,key,missionId,levelFrom,levelTo,reduced}=opts,stage=DUEL_STAGE[missionId]||'road',look=DS_LOOK[stage];
 const root=document.createElement('div');root.id='duel-scene';root.className='duel-scene';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label',`일기토 · ${hero.name} 대 ${foe.name}`);
 root.innerHTML=`<div class="ds-stage"><canvas width="${DS_W}" height="${DS_H}"></canvas><div class="ds-vs"><div class="ds-card left"><canvas width="${BUST_W}" height="${BUST_H}"></canvas><b>${hero.nameHTML}</b></div><div class="ds-title"><small>${DUEL_STAGE_KO[stage]}</small><strong>일기토</strong><span>VS</span></div><div class="ds-card right"><canvas width="${BUST_W}" height="${BUST_H}"></canvas><b>${foe.nameHTML}</b></div></div>
  <div class="ds-level" style="display:none"><strong>LEVEL UP</strong><span>${hero.nameHTML} · LV ${levelFrom} → ${levelTo}</span></div><button class="ds-skip" data-do="duel-scene-skip" type="button">건너뛰기 ›</button></div>`;
 (opts.root||document.body).append(root);const cv=root.querySelector('.ds-stage>canvas'),c=cv.getContext('2d'),[bh,bf]=root.querySelectorAll('.ds-card canvas'),vs=root.querySelector('.ds-vs'),lvl=root.querySelector('.ds-level');
 const H0={cast:hdCastFor(hero.unit,missionId),sheet:duelSheetOf(hero.unit,key)},F0={cast:hdCastFor(foe.unit,missionId),sheet:duelSheetOf(foe.unit,key),foe:true};
 const fin=dsImage(`finisher_${hero.unit.id}`)||null,t0=performance.now(),slow=reduced?1:1.6;
 const paintBusts=()=>{for(const [cv2,u,flip] of [[bh,hero.unit,false],[bf,foe.unit,true]]){const g=cv2.getContext('2d');g.clearRect(0,0,BUST_W,BUST_H);g.save();if(flip){g.translate(BUST_W,0);g.scale(-1,1);}drawBust(g,u,{expression:'determined',missionId});g.restore();}};
 const state={root,raf:0,onDone:opts.onDone};dsCurrent=state;
 const at=(t,name)=>{const [a,b]=DS_BEATS[name];return (t-a)/(b-a);},inBeat=(t,name)=>t>=DS_BEATS[name][0]&&t<DS_BEATS[name][1];
 function frame(now){if(dsCurrent!==state)return;let t=now-t0;
  // the finishing blow plays slower (slow motion): stretch the finisher beat
  const fa=DS_BEATS.finisher[0],fb=DS_BEATS.finisher[1];if(t>fa)t=t<fa+(fb-fa)*slow?fa+(t-fa)/slow:t-(fb-fa)*(slow-1);
  if(t>=DUEL_SCENE_MS){finishDuelScene();return;}
  let hx=-200,fx=DS_W+200,hp='ready',fp='ready',shake=0,flash=0;
  if(t>=DS_BEATS.enter[0]){hx=dsLerp(-200,420,at(t,'enter'));fx=dsLerp(DS_W+200,860,at(t,'enter'));}
  if(t>=DS_BEATS.dash1[0]){hp='dash';fp='dash';hx=dsLerp(420,575,at(t,'dash1'));fx=dsLerp(860,705,at(t,'dash1'));}
  if(t>=DS_BEATS.bind1[0]){hp='bind';fp='bind';const w=Math.sin(t/60)*6;hx=575+w;fx=705+w;if(at(t,'bind1')<.35)shake=8;}
  if(t>=DS_BEATS.recoil1[0]){hp='ready';fp='recoil';hx=dsLerp(575,560,at(t,'recoil1'));fx=dsLerp(705,840,at(t,'recoil1'));}
  if(t>=DS_BEATS.foeAtk[0]){fp=at(t,'foeAtk')<.5?'dash':'strike';fx=dsLerp(840,690,at(t,'foeAtk'));}
  if(t>=DS_BEATS.guard[0]){hp='guard';fp='strike';if(at(t,'guard')<.3)shake=5;}
  if(t>=DS_BEATS.counter[0]){hp='strike';fp='guard';}
  if(t>=DS_BEATS.recoil2[0]){hp='ready';fp='recoil';fx=dsLerp(690,860,at(t,'recoil2'));}
  if(t>=DS_BEATS.rush[0]){hp='dash';fp='ready';hx=dsLerp(560,700,at(t,'rush'));}
  if(t>=DS_BEATS.finisher[0]){hp='finisher';fp='recoil';hx=700;const k=at(t,'finisher');if(k<.12)flash=1-k/.12;if(k>.55&&k<.75)shake=12;fx=dsLerp(860,900,k);}
  if(t>=DS_BEATS.down[0]){hp='end';fp='end';fx=900;}
  if(reduced){shake=0;flash=Math.min(flash,.25);}
  c.save();c.clearRect(0,0,DS_W,DS_H);if(shake)c.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  c.drawImage(dsBackdrop(stage),0,0,DS_W,DS_H);dsEmbers(c,t,look.ember);
  if(inBeat(t,'dash1')||inBeat(t,'rush'))dsSpeed(c,1,inBeat(t,'rush')?at(t,'rush'):at(t,'dash1'));
  const glowHero=t>=DS_BEATS.level[0]?'rgba(255,220,120,.9)':null;
  dsFighter(c,F0,fp,fx,t,'left',null);dsFighter(c,H0,hp,hx,t,'right',glowHero);
  if(inBeat(t,'bind1'))dsSpark(c,(hx+fx)/2,DS_FLOOR-190,at(t,'bind1'));
  if(inBeat(t,'guard'))dsSpark(c,hx+70,DS_FLOOR-170,at(t,'guard'),'190,220,255');
  if(inBeat(t,'counter'))dsSlash(c,(hx+fx)/2,DS_FLOOR-210,at(t,'counter'),1);
  if(inBeat(t,'finisher')){const k=at(t,'finisher');dsSlash(c,fx-40,DS_FLOOR-230,Math.min(1,k*1.4),1,'255,226,150');if(k>.5)dsRing(c,fx,DS_FLOOR,(k-.5)/.5);if(k>.5)dsSpark(c,fx-30,DS_FLOOR-170,(k-.5)/.5,'255,236,170');}
  if(t>=DS_BEATS.level[0])dsColumn(c,hx,at(t,'level'));
  c.restore();
  // the finisher key art (pack I part F) flashes full frame; until then a radial burst frames the hero
  if(inBeat(t,'finisher')){const k=at(t,'finisher');if(k>.12&&k<.55){const a=Math.min(1,(k-.12)/.08)*Math.min(1,(.55-k)/.08);c.save();c.globalAlpha=a;
   if(fin)c.drawImage(fin,0,0,DS_W,DS_H);else{c.fillStyle='rgba(10,8,6,.55)';c.fillRect(0,0,DS_W,DS_H);c.translate(DS_W*.42,DS_H*.5);c.globalCompositeOperation='lighter';for(let i=0;i<48;i++){c.rotate(Math.PI*2/48);c.fillStyle=`rgba(255,220,150,${i%2?.10:.18})`;c.fillRect(60,-3,DS_W,6);}}c.restore();}}
  if(flash){c.fillStyle=`rgba(255,250,235,${flash.toFixed(2)})`;c.fillRect(0,0,DS_W,DS_H);}
  // letterbox bars sliding in and the VS cards
  const bar=Math.min(1,t/400)*54;c.fillStyle='#000';c.fillRect(0,0,DS_W,bar);c.fillRect(0,DS_H-bar,DS_W,bar);
  if(t<DS_BEATS.intro[1]+200){paintBusts();const k=t<300?t/300:t>DS_BEATS.intro[1]-200?Math.max(0,(DS_BEATS.intro[1]+200-t)/400):1;vs.style.opacity=k.toFixed(2);vs.style.setProperty('--slide',`${((1-Math.min(1,t/400))*40).toFixed(1)}%`);vs.style.display='';}else vs.style.display='none';
  lvl.style.display=t<DS_BEATS.level[0]+200?'none':'';
  state.raf=requestAnimationFrame(frame);}
 state.raf=requestAnimationFrame(frame);return state;}
