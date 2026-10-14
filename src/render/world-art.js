import {pixel,pixelOval} from './art.js';
// Original architectural silhouettes; logical half-pixels become native 128 details.
export function drawBuilding(c,b,time=0,state='intact'){
 const x=b.x*64,y=b.y*64,w=b.w*64,h=b.h*64,type=b.type,r=(col,a,d,ww,hh)=>pixel(c,col,x+a,y+d,ww,hh),roof=state==='burned'?'#3a3432':type==='shop'?'#607d72':type==='warroom'?'#435b75':type==='inn'?'#8c5c65':'#a86945';
 pixelOval(c,'rgba(12,24,24,.4)',x+w/2+8,y+h-4,w/2+9,12);
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
 r('#2d3635',w/2-18,h-50,36,46);r('#846749',w/2-15,h-47,30,43);r('#d8b875',w/2+8,h-28,2,3);r('#d2bb90',w/2-23,h-5,46,5);
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
