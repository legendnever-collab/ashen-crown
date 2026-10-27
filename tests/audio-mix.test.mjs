// v0.7.1 fix — Mute, Music Pause and BGM 0 must silence the music completely. Every music track feeds both the dry bus and
// the reverb; the reverb return used to reach the output at a fixed level, so a faint reverb of the music stayed audible.
// A recording fake of the Web Audio graph follows every path from a music track to the output and multiplies the gains
// each path ends at.
import test from 'node:test';import assert from 'node:assert/strict';
import {AudioEngine} from '../src/audio/audio-engine.js';
import {SCORE} from '../src/audio/score.js';

class Param{constructor(v){this.value=v;this.events=[];}
 cancelScheduledValues(t){this.events=this.events.filter(e=>e.t<t);}
 setValueAtTime(v,t){this.events.push({t,v,kind:'set'});}
 setTargetAtTime(v,t){this.events.push({t,v,kind:'target'});}
 linearRampToValueAtTime(v,t){this.events.push({t,v,kind:'ramp'});}
 exponentialRampToValueAtTime(v,t){this.events.push({t,v,kind:'ramp'});}
 // where the parameter settles once every scheduled event has run
 get settled(){const e=[...this.events].sort((a,b)=>a.t-b.t);return e.length?e.at(-1).v:this.value;}
 // a setTargetAtTime toward 0 only approaches 0; it is exactly 0 only when a later event sets it
 get exactZero(){const e=[...this.events].sort((a,b)=>a.t-b.t),last=e.at(-1);return last?last.v===0&&last.kind!=='target':this.value===0;}}
class Node{constructor(kind){this.kind=kind;this.out=[];if(kind==='gain')this.gain=new Param(1);if(kind==='filter'){this.frequency=new Param(350);this.type='lowpass';}if(kind==='comp')for(const k of ['threshold','knee','ratio','attack','release'])this[k]=new Param(0);}
 connect(n){this.out.push(n);return n;}disconnect(){this.out=[];}}
const fakeContext=()=>{const destination=new Node('destination');return {currentTime:10,sampleRate:8000,state:'running',destination,
 createGain:()=>new Node('gain'),createBiquadFilter:()=>new Node('filter'),createDynamicsCompressor:()=>new Node('comp'),createConvolver:()=>new Node('convolver'),
 createBuffer:(ch,len)=>({getChannelData:()=>new Float32Array(len)})};};
// every path from a node to the output, with the product of the settled gains along it
const paths=(node,dest,gain=1,seen=[])=>{if(node===dest)return [{gain,via:seen}];return node.out.flatMap(n=>paths(n,dest,gain*(n.gain?n.gain.settled:1),[...seen,n.kind]));};
const engine=(prefs={})=>{const a=new AudioEngine({getItem:()=>JSON.stringify(prefs),setItem(){}});a.ctx=fakeContext();a.build();a.updateGains();a.select('chronicle',true);return a;};
const track=a=>a.tracks.get('chronicle');
const reaching=a=>paths(track(a),a.ctx.destination,SCORE.chronicle.gain);

test('a music track reaches the output by two paths: the dry bus and the reverb',()=>{
 const a=engine(),p=reaching(a);assert.equal(p.length,2);assert.ok(p.some(x=>x.via.includes('convolver')),'reverb path');assert.ok(p.some(x=>!x.via.includes('convolver')),'dry path');
});

test('Mute, Music Pause and BGM 0 silence both music paths, the reverb included, at an exact 0',()=>{
 for(const prefs of [{muted:true},{paused:true},{music:0}]){const a=engine(prefs);for(const p of reaching(a))assert.equal(p.gain,0,`${JSON.stringify(prefs)} via ${p.via.join('→')}`);
  assert.ok(a.master.gain.exactZero&&a.wet.gain.exactZero,`${JSON.stringify(prefs)} ends at an exact 0`);}
 const a=engine({muted:true});assert.equal(paths(a.sfxGain,a.ctx.destination,a.sfxGain.gain.settled).reduce((n,p)=>n+p.gain,0),0,'Mute silences effects');assert.ok(a.sfxGain.gain.exactZero);
 const b=engine({sfx:0});assert.ok(b.sfxGain.gain.exactZero,'SFX 0 is an exact 0');
});

test('changing the settings while playing: mute, unmute, BGM 0 and back follow at once',()=>{
 const a=engine();const total=()=>reaching(a).reduce((n,p)=>n+p.gain,0);const on=total();assert.ok(on>0);
 a.settings({muted:true});assert.equal(total(),0);a.settings({muted:false});assert.ok(Math.abs(total()-on)<1e-12);
 a.settings({music:0});assert.equal(total(),0);a.settings({music:.45,paused:true});assert.equal(total(),0);a.settings({paused:false});assert.ok(Math.abs(total()-on)<1e-12);
});

test('the default mix is unchanged (dry .225, reverb return .32) and the reverb now follows the BGM level',()=>{
 const a=engine();assert.deepEqual(a.levels(),{music:.225,wet:.32,sfx:.27});assert.ok(Math.abs(a.master.gain.settled-.225)<1e-12);assert.ok(Math.abs(a.wet.gain.settled-.32)<1e-12);
 const dry=x=>x.find(p=>!p.via.includes('convolver')).gain,wet=x=>x.find(p=>p.via.includes('convolver')).gain;
 const ratio=x=>wet(x)/dry(x),def=reaching(a);for(const music of [.05,.2,1]){const r=reaching(engine({music}));assert.ok(Math.abs(ratio(r)-ratio(def))<1e-9,`same reverb balance at BGM ${music}`);assert.ok(Math.abs(dry(r)/dry(def)-music/.45)<1e-9);}
 assert.equal(a.diagnostics().levels.wet,a.levels().wet);
});
