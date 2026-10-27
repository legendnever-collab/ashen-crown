import {SCORE} from './score.js';
// Soft, layered Web Audio synthesis (v0.4): detuned pads through low-pass filters, harp/pluck
// voices, breathy flute with vibrato, FM celesta, gentle percussion, a generated stereo reverb
// and a bus compressor. Everything is synthesized at runtime — no samples or external files.
const hz=p=>440*2**((p-69)/12);
const MUSIC=.5,SFX=.6,WET=.32/(.45*MUSIC); // output levels; WET keeps the v0.4 reverb mix at the default BGM .45
const TRIADS={M:[0,4,7],m:[0,3,7],'7':[0,4,7,10],sus:[0,5,7]};
export class AudioEngine{
 constructor(storage){this.storage=storage;this.prefs={music:.45,sfx:.45,muted:false,paused:false};try{Object.assign(this.prefs,JSON.parse(storage.getItem('ashen-crown:audio:v1')||'{}'));}catch{}for(const k of ['music','sfx'])this.prefs[k]=Number.isFinite(this.prefs[k])?Math.max(0,Math.min(1,this.prefs[k])):.45;this.scene='title';this.tracks=new Map();this.notes=0;this.transitions=0;this.status='상호작용 후 활성화';this.nextAt=0;this.pos=new Map();}
 async activate(){try{if(!this.ctx){const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C){this.status='오디오 미지원';return false;}this.ctx=new C();this.build();this.updateGains();this.nextAt=this.ctx.currentTime+.08;this.timer=setInterval(()=>this.schedule(),60);}if(this.ctx.state==='suspended')await this.ctx.resume();this.status='재생 준비';this.select(this.scene,true);return true;}catch{this.status='오디오 없이 계속';return false;}}
 build(){const c=this.ctx;this.comp=c.createDynamicsCompressor();this.comp.threshold.value=-20;this.comp.knee.value=18;this.comp.ratio.value=3;this.comp.attack.value=.02;this.comp.release.value=.3;this.comp.connect(c.destination);
  this.master=c.createGain();this.tone_=c.createBiquadFilter();this.tone_.type='lowpass';this.tone_.frequency.value=7200;this.master.connect(this.tone_);this.tone_.connect(this.comp);
  this.reverb=c.createConvolver();this.reverb.buffer=this.impulse(2.6,2.4);this.wet=c.createGain();this.wet.gain.value=.32;this.reverb.connect(this.wet);this.wet.connect(this.comp);
  this.sfxGain=c.createGain();this.sfxGain.connect(this.comp);}
 impulse(seconds,decay){const c=this.ctx,len=Math.floor(c.sampleRate*seconds),buf=c.createBuffer(2,len,c.sampleRate);let seed=1234567;const rnd=()=>{seed=(seed*1103515245+12345)>>>0;return seed/4294967296*2-1;};for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<len;i++)d[i]=rnd()*Math.pow(1-i/len,decay)*(i<c.sampleRate*.012?i/(c.sampleRate*.012):1);}return buf;}
 // v0.7.1 fix: every music track also feeds the reverb, and the reverb return went straight to the compressor at a fixed
 // level, so Mute, Music Pause and BGM 0 still let a faint reverb of the music through. The return now follows the BGM
 // level (identical mix at every volume: wet = dry level × WET, which is the old .32 at the default .45), and a level of
 // 0 ends at an exact 0 instead of an asymptotic glide.
 levels(){const music=this.prefs.muted||this.prefs.paused?0:this.prefs.music*MUSIC;return {music,wet:music*WET,sfx:this.prefs.muted?0:this.prefs.sfx*SFX};}
 updateGains(){if(!this.ctx)return;const now=this.ctx.currentTime,l=this.levels();for(const [param,v,tc] of [[this.master.gain,l.music,.08],[this.wet.gain,l.wet,.08],[this.sfxGain.gain,l.sfx,.03]]){param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);param.setTargetAtTime(v,now,tc);if(v===0)param.setValueAtTime(0,now+tc*12);}}
 settings(values){Object.assign(this.prefs,values);this.updateGains();try{this.storage.setItem('ashen-crown:audio:v1',JSON.stringify(this.prefs));}catch{} }
 select(scene,force=false){if(!SCORE[scene])return;const changed=scene!==this.scene;this.scene=scene;if(!this.ctx||!changed&&!force)return;const now=this.ctx.currentTime;if(!this.tracks.has(scene)){const g=this.ctx.createGain();g.gain.value=0;g.connect(this.master);const send=this.ctx.createGain();send.gain.value=.55;g.connect(send);send.connect(this.reverb);this.tracks.set(scene,g);this.pos.set(scene,{eighth:0,mi:0,left:0});}for(const [id,g]of this.tracks){g.gain.cancelScheduledValues(now);g.gain.setTargetAtTime(id===scene?SCORE[id].gain:0,now,id===scene?.6:.45);}if(changed)this.transitions++;}
 // ---- voices -------------------------------------------------------------------------
 env(g,at,a,peak,hold,release){g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(peak,at+a);g.gain.setTargetAtTime(peak*.7,at+a,hold*.4+.01);g.gain.setTargetAtTime(0,at+a+hold,release/3);}
 osc(type,freq,at,end,dest,detune=0){const o=this.ctx.createOscillator();o.type=type;o.frequency.value=freq;o.detune.value=detune;o.connect(dest);o.start(at);o.stop(end);o.onended=()=>o.disconnect();return o;}
 voice(kind,pitch,at,dur,vel,dest){if(!pitch||!this.ctx)return;const c=this.ctx,f=hz(pitch),g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.connect(g);g.connect(dest);this.notes++;
  const end=at+dur+2;const done=()=>{try{g.disconnect();lp.disconnect();}catch{}};setTimeout(done,(end-c.currentTime+.5)*1000);
  if(kind==='flute'){lp.frequency.value=2600;this.env(g,at,.08,.16*vel,dur,.35);const o=this.osc('sine',f,at,end,lp);this.osc('triangle',f*2,at,end,lp).detune.value=4;const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=5.2;lg.gain.value=f*.006;lfo.connect(lg);lg.connect(o.frequency);lfo.start(at+.25);lfo.stop(end);}
  else if(kind==='horn'){lp.frequency.setValueAtTime(700,at);lp.frequency.linearRampToValueAtTime(1700,at+.12);lp.frequency.setTargetAtTime(1100,at+.2,.3);this.env(g,at,.07,.12*vel,dur,.3);this.osc('sawtooth',f,at,end,lp,-5);this.osc('triangle',f,at,end,lp,5);}
  else if(kind==='strings'||kind==='lowpad'){lp.frequency.value=kind==='lowpad'?700:1500;this.env(g,at,kind==='lowpad'?.35:.16,.055*vel,dur,.6);for(const d of [-9,0,8])this.osc('sawtooth',f,at,end,lp,d);}
  else if(kind==='pad'||kind==='softpad'){lp.frequency.value=kind==='softpad'?800:1100;lp.Q.value=.6;this.env(g,at,.5,.045*vel,dur,1.1);for(const d of [-12,0,11])this.osc(kind==='softpad'?'triangle':'sawtooth',f,at,end,lp,d);}
  else if(kind==='harp'||kind==='pluck'){lp.frequency.setValueAtTime(kind==='harp'?3200:2200,at);lp.frequency.exponentialRampToValueAtTime(500,at+.6);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.13*vel,at+.004);g.gain.exponentialRampToValueAtTime(.0008,at+(kind==='harp'?1.6:.9));this.osc('triangle',f,at,at+1.8,lp);this.osc('sine',f*2,at,at+1.8,lp,3);}
  else if(kind==='celesta'){g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.11*vel,at+.005);g.gain.exponentialRampToValueAtTime(.0008,at+1.4);lp.frequency.value=6000;const car=this.osc('sine',f,at,at+1.5,lp),mod=c.createOscillator(),mg=c.createGain();mod.frequency.value=f*3.5;mg.gain.setValueAtTime(f*1.2,at);mg.gain.exponentialRampToValueAtTime(1,at+.6);mod.connect(mg);mg.connect(car.frequency);mod.start(at);mod.stop(at+1.5);}
  else if(kind==='bass'){lp.frequency.value=420;this.env(g,at,.03,.16*vel,dur,.2);this.osc('sine',f,at,end,lp);this.osc('triangle',f,at,end,lp,2);}
 }
 drum(kind,at,dest,vel=1){const c=this.ctx;this.notes++;if(kind==='kick'||kind==='timp'){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(kind==='timp'?110:95,at);o.frequency.exponentialRampToValueAtTime(kind==='timp'?62:42,at+.25);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.32*vel,at+.005);g.gain.exponentialRampToValueAtTime(.001,at+(kind==='timp'?.7:.35));o.connect(g);g.connect(dest);o.start(at);o.stop(at+.8);o.onended=()=>{o.disconnect();g.disconnect();};return;}
  const len=Math.floor(c.sampleRate*.2),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let seed=99;for(let i=0;i<len;i++){seed=(seed*1664525+1013904223)>>>0;d[i]=(seed/4294967296*2-1)*(1-i/len);}const src=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain();src.buffer=b;bp.type=kind==='snare'?'bandpass':'highpass';bp.frequency.value=kind==='snare'?1800:6500;g.gain.setValueAtTime((kind==='snare'?.13:.05)*vel,at);g.gain.exponentialRampToValueAtTime(.001,at+(kind==='snare'?.18:.06));src.connect(bp);bp.connect(g);g.connect(dest);src.start(at);src.stop(at+.2);src.onended=()=>{src.disconnect();bp.disconnect();g.disconnect();};}
 // ---- sequencer ----------------------------------------------------------------------
 tick(id,t,eighth,dest){const sc=SCORE[id],p=this.pos.get(id),bar=Math.floor(p.eighth/8)%sc.chords.length,step=p.eighth%8,ch=sc.chords[bar],tones=TRIADS[ch.q].map(i=>i+ch.root);
  if(p.left<=0){const [n,d]=sc.melody[p.mi%sc.melody.length];if(n)this.voice(sc.lead,n,t,d*eighth*.92,1,dest);p.left=d;p.mi++;}p.left--;
  if(step===0&&sc.pad)for(const [k,i]of tones.slice(0,3).entries())this.voice(sc.pad,48+i+(k?12:0)+(i<5?12:0),t,eighth*7.6,1,dest);
  if(step%4===0)this.voice('bass',36+ch.root,t,eighth*3.6,step?0.7:1,dest);
  if(sc.arp==='harp'&&step%2===0)this.voice('harp',60+tones[(step/2)%3]+(step>=4?12:0),t,eighth*2,.8,dest);
  if(sc.arp==='pluck'&&step%2===1)this.voice('pluck',60+tones[(step>>1)%3],t,eighth,.7,dest);
  if(sc.arp==='ostinato')this.voice('pluck',48+ch.root+(step%2?12:0),t,eighth*.9,.65,dest);
  const dr=sc.drums;if(dr==='battle'){if(step===0||step===4)this.drum('timp',t,dest,step?0.7:1);if(step===2||step===6)this.drum('snare',t,dest,.7);if(step%2)this.drum('hat',t,dest,.6);}
  else if(dr==='heavy'){if(step%4===0)this.drum('timp',t,dest,1);if(step===3||step===7)this.drum('kick',t,dest,.7);if(step===4)this.drum('snare',t,dest,.8);}
  else if(dr==='march'){if(step===0)this.drum('kick',t,dest,.8);if(step===4)this.drum('snare',t,dest,.5);if(step===6||step===7)this.drum('snare',t,dest,.25);}
  else if(dr==='heart'){if(step===0||step===1)this.drum('kick',t,dest,step?0.4:.65);}
  else if(dr==='light'){if(step%4===0)this.drum('hat',t,dest,.7);}
  p.eighth++;}
 schedule(){if(!this.ctx||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(this.nextAt<now-.3)this.nextAt=now+.03;
  while(this.nextAt<now+.25){const t=this.nextAt,eighth=60/SCORE[this.scene].tempo/2;for(const [id,dest]of this.tracks){if(id!==this.scene&&dest.gain.value<.01)continue;this.tick(id,t,60/SCORE[id].tempo/2,dest);}this.nextAt+=eighth;}}
 effect(kind){if(!this.ctx||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(kind==='heal'){[72,76,79].forEach((p,i)=>this.voice('celesta',p,now+i*.06,.3,.9,this.sfxGain));return;}if(kind==='attack'){this.drum('snare',now,this.sfxGain,.8);this.voice('pluck',52,now,.12,.8,this.sfxGain);return;}if(kind==='hit'){this.drum('kick',now,this.sfxGain,.6);return;}if(kind==='death'){this.voice('lowpad',38,now,.5,1.2,this.sfxGain);return;}if(kind==='move'||kind==='miss'){this.drum('hat',now,this.sfxGain,kind==='move'?.5:.9);return;}if(kind==='ignite'){this.drum('snare',now,this.sfxGain,.5);this.voice('pluck',45,now,.2,.6,this.sfxGain);return;}if(kind==='guard'){this.voice('horn',55,now,.25,.8,this.sfxGain);return;}if(kind==='spawn'){this.drum('timp',now,this.sfxGain,.9);return;}if(kind==='rescue'){[67,72,76].forEach((p,i)=>this.voice('harp',p,now+i*.05,.3,.8,this.sfxGain));return;}this.voice('celesta',79,now,.2,.8,this.sfxGain);}
 stinger(outcome){if(!this.ctx)return;const t=this.ctx.currentTime+.05,notes=outcome==='victory'?[62,66,69,74]:[62,60,57,50];notes.forEach((p,i)=>{this.voice('horn',p,t+i*.16,i===3?.9:.2,1,this.sfxGain);this.voice('harp',p+12,t+i*.16,.4,.7,this.sfxGain);});}
 diagnostics(){return {status:this.status,scene:this.scene,track:SCORE[this.scene].name,context:this.ctx?.state||'uninitialized',notes:this.notes,transitions:this.transitions,prefs:{...this.prefs},levels:this.levels(),original:true};}
}
