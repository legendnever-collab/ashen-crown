import {pixel,pixelOval} from './art.js';
// Original architectural silhouettes; logical half-pixels become native 128 details.
export function drawBuilding(c,b,time=0,state='intact'){
 const x=b.x*64,y=b.y*64,w=b.w*64,h=b.h*64,type=b.type,r=(col,a,d,ww,hh)=>pixel(c,col,x+a,y+d,ww,hh),roof=state==='burned'?'#3a3432':type==='shop'?'#607d72':type==='warroom'?'#435b75':type==='inn'?'#8c5c65':'#a86945';
 pixelOval(c,'rgba(12,24,24,.4)',x+w/2+8,y+h-4,w/2+9,12);
 if(INTERIOR_PROPS[type]){INTERIOR_PROPS[type](r,w,h,state,time);return;}
 if(['counter','rack','shelf','furnace'].includes(type)){
  if(type==='counter'){r('#382b2a',0,10,w,45);r('#be9666',0,0,w,12);r('#e3be85',0,0,w,2);for(let i=8;i<w;i+=20)r('#88653f',i,17,1,35);}
  else if(type==='furnace'){r('#4a4543',0,0,w,h);for(let i=0;i<h;i+=12){r('#69645b',2,i,w-4,10);r('#aaa08a',2,i,w-4,1);}r('#252527',12,h-62,w-24,52);r('#d7753c',17,h-52,w-34,35);r('#ffd285',25,h-48,w-50,23);}
  else{r('#483f34',0,0,w,h);for(let i=12;i<h;i+=32){r('#ba9360',0,i,w,5);for(let j=7;j<w-8;j+=15){r(type==='shelf'?'#658784':'#c6d5cf',j,i-19,6,18);r('#e3c68c',j-1,i-20,8,3);}}}return;
 }
 r(state==='burned'?'#564b43':'#d5bd8f',7,36,w-14,h-41);r('#584436',7,36,6,h-39);r('#584436',w-13,36,6,h-39);
 for(let iy=47;iy<h-12;iy+=18)for(let ix=17;ix<w-20;ix+=24){r(state==='burned'?'#423c36':'#bea77d',ix,iy,21,1);r('#9d8663',ix+20,iy,1,16);}
 if(type==='warroom'){for(let i=0;i<6;i++)r(roof,i*3,i*5,w-i*6,10);r('#e5c789',w/2-2,-34,3,36);r('#a5524d',w/2+1,-31,41,23);r('#d7bd82',w/2+13,-26,8,12);}
 else if(type==='inn'){for(let i=0;i<8;i++)r(roof,-6+i*2,i*5,w+12-i*4,8);r('#d5b887',15,10,33,4);r('#e9cd94',16,14,31,22);r('#7e5648',24,18,13,9);}
 else{for(let i=0;i<7;i++){const rr=-10+i*3;r(roof,rr,i*5,w-rr*2,8);for(let j=rr+4;j<w-rr;j+=12)r(state==='burned'?'#242729':'#624c3a',j,i*5+6,1,2);}r('#d6a878',3,31,w-6,2);}
 for(let i=16;i<w-20;i+=42){r('#39454a',i,51,21,24);r(state==='burned'?'#1e292c':'#d4cfab',i+2,53,17,19);r('#685743',i+10,53,2,20);r('#685743',i+2,61,18,2);}
 const doorX=b.entrance?b.entrance.tileX*64+32-x:w/2;
 r('#2d3635',doorX-18,h-50,36,46);r('#846749',doorX-15,h-47,30,43);r('#d8b875',doorX+8,h-28,2,3);r('#d2bb90',doorX-23,h-5,46,5);
 if(type==='forge'){r('#473f36',w-74,54,60,38);r('#d98a46',w-69,62,50,24);r('#f8cf79',w-62,69,32,12);r('#676960',w-31,-14,23,59);r('#aaa78e',w-34,-15,29,5);r('#d4bf88',14,87,43,30);r('#484a44',20,96,32,6);r('#484a44',30,90,7,20);r('#353d3b',w-56,h-26,36,11);r('#728080',w-53,h-29,31,6);}
 if(type==='shop'){for(let i=0;i<w;i+=22)r(i%44?'#f1dbc0':'#4f8b78',i,70,22,15);r('#c9b085',w-67,h-35,50,22);for(let i=0;i<4;i++)r('#78a89c',w-61+i*10,h-45,6,10);r('#dfcb94',13,82,47,36);r('#527f73',31,88,12,23);r('#9ccdb1',33,86,8,5);r('#6f9c88',15,h-24,28,20);r('#b5c383',20,h-29,18,8);}
 if(type==='depot'){r('#8e714b',10,h-38,32,30);r('#d0aa71',10,h-38,32,3);r('#d0aa71',13,h-38,3,30);r('#91704a',w-46,h-47,32,38);}
 if(state==='burned'){r('#252d2b',w/2-15,13,w/3,17);for(let i=0;i<12;i++){r('#393a33',i*17%w,h-6+(i%3)*3,13,4);r('#242a28',i*19%w,20+i*7%(h-32),5,9);}}
 if(state==='burning')drawFire(c,x+w*.64,y+h*.46,time,Math.max(1,w/100));
 c.fillStyle='#f2ddb0';c.font='bold 10px monospace';c.textAlign='center';c.fillText(b.label||'',x+w/2,y+h-11);c.textAlign='left';
}
export function drawFire(c,x,y,time,size=1){
 const flick=Math.floor(time/95)%5;c.save();c.translate(x,y);c.scale(size,size);
 pixelOval(c,'rgba(246,147,62,.18)',0,10,36,22);
 for(let i=0;i<5;i++){const dx=-22+i*10,top=-14-((flick+i*3)%5)*5;pixel(c,'#a83f32',dx,top,10,39-top);pixel(c,'#eb7837',dx+2,top+4,7,31-top);pixel(c,'#ffd375',dx+3,top+13,4,24-top);pixel(c,'#ffefb2',dx+4,13,2,13);}
 for(let i=0;i<6;i++){const age=(time/30+i*19)%100;pixel(c,'rgba(121,129,124,.35)',-20+Math.sin(i+age/20)*11,-35-age,12+i*2,9+i);pixel(c,'#eda35c',-21+i*9,-20-((time/20+i*17)%55),1,2);}c.restore();
}
// Original interior furniture for enterable houses, barracks, stores and quarters.
const INTERIOR_PROPS={
 bed:(r,w,h)=>{r('#5b4030',2,6,w-4,h-10);r('#e9e1cc',6,8,24,18);r('#9c4f45',30,10,w-36,h-18);r('#b8655a',30,10,w-36,4);r('#3c2a20',2,h-8,6,8);r('#3c2a20',w-8,h-8,6,8);},
 bunk:(r,w,h)=>{r('#4d3a2a',2,4,w-4,h-6);r('#d9d2bd',6,7,20,16);r('#5d7a6c',26,8,w-32,h-16);r('#6f8f7f',26,8,w-32,3);r('#2f241b',2,h-6,w-4,3);},
 table:(r,w,h)=>{r('rgba(12,24,24,.35)',6,h-10,w-8,8);r('#7a5636',4,10,w-8,h-24);r('#a57a4c',4,10,w-8,5);r('#4a3322',8,h-16,5,14);r('#4a3322',w-13,h-16,5,14);r('#e7dcc0',w/2-8,14,16,10);r('#c9b48a',w/2-6,16,12,1);},
 maptable:(r,w,h)=>{r('#5a3f29',4,10,w-8,h-20);r('#d8c79a',10,16,w-20,h-34);for(let i=0;i<5;i++)r('#7d8b6a',16+i*30%(w-40),22+i*13%(h-50),14,8);r('#a8463d',w/2-4,h/2-6,8,8);r('#2f4a62',w/2+30,h/2-10,8,8);r('#3e2b1d',8,h-12,6,10);r('#3e2b1d',w-14,h-12,6,10);},
 hearth:(r,w,h,state,time)=>{r('#5d5650',0,4,w,h-4);for(let i=6;i<h;i+=10)r('#7b736a',2,i,w-4,8);r('#2b2524',w/2-20,h-30,40,26);const f=Math.floor((time||0)/120)%3;r('#d8742f',w/2-14,h-24+f,28,18-f);r('#ffc96b',w/2-8,h-20+f,16,10-f);},
 barrel:(r,w,h)=>{r('rgba(12,24,24,.35)',10,h-10,w-20,8);r('#6b4a2c',12,8,w-24,h-16);r('#8c6238',14,8,w-28,h-16);r('#3d3d3a',10,16,w-20,4);r('#3d3d3a',10,h-22,w-20,4);r('#b78b55',16,10,w-32,3);},
 crate:(r,w,h)=>{for(let y=0;y<h;y+=64)for(let x=0;x<w;x+=64){r('rgba(12,24,24,.35)',x+6,y+52,56,8);r('#7a5734',x+6,y+8,52,48);r('#a9804d',x+9,y+11,46,42);r('#6a4a2c',x+9,y+30,46,4);r('#6a4a2c',x+30,y+11,4,42);}},
 shelf:(r,w,h)=>{r('#4a3b2e',2,0,w-4,h);for(let i=14;i<h;i+=30){r('#9c7646',2,i,w-4,4);for(let j=8;j<w-10;j+=12)r(['#b54a3c','#3c6aa5','#d0b05c'][(i+j)%3],j,i-14,8,13);}},
 chest:(r,w,h,state)=>{r('rgba(12,24,24,.35)',8,h-12,w-16,8);if(state==='open'){r('#4b2f1a',10,16,w-20,10);r('#7a4b26',10,26,w-20,26);r('#2a1a10',14,28,w-28,8);r('#c9a24a',10,26,w-20,3);r('#c9a24a',w/2-3,30,6,8);}else{r('#7a4b26',10,18,w-20,34);r('#9a6334',12,18,w-24,12);r('#c9a24a',10,28,w-20,4);r('#c9a24a',w/2-4,26,8,12);r('#fff0b0',w/2-1,30,2,4);r('#5a3518',10,48,w-20,4);}}
};
