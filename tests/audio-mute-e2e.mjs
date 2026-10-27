// v0.7.1 fix — browser check that Mute, BGM 0 and Music Pause leave the speakers silent. Before the fix, the music's
// reverb reached the output at a fixed level (measured on the v0.7.1 release candidate: −28 dB muted, −33 dB at BGM 0,
// −30 dB paused, against −12.5 dB playing). The test taps the output with an analyser added by an init script (test
// harness only), plays the music, and uses the game's own 음악 / 효과음 controls at 1440 and at 390 touch.
import fs from 'node:fs';import {pathToFileURL} from 'node:url';
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.7.1.html').href,b=await launchTestBrowser({headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
let fail=0,n=0;const results=[];const check=(name,ok,detail='')=>{n++;results.push({name,ok,detail});console.log(`${ok?'PASS':'FAIL'} ${name}${detail?` · ${detail}`:''}`);if(!ok)fail++;};
const dB=p=>p>0?+(20*Math.log10(p)).toFixed(1):-Infinity;
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{const orig=AudioNode.prototype.connect;AudioNode.prototype.connect=function(t,...r){if(t&&t===this.context?.destination){const c=this.context;if(!c.__tap){c.__tap=c.createAnalyser();c.__tap.fftSize=32768;window.__audioTap=c;}orig.call(this,c.__tap);}return orig.call(this,t,...r);};});
 await p.goto(url);const press=async sel=>{const el=p.locator(sel).first();touch?await el.tap():await el.click();await p.waitForTimeout(200);};
 // peak output over ~1.4 s of music
 const peak=()=>p.evaluate(async()=>{const an=window.__audioTap?.__tap;if(!an)return null;let m=0;for(let k=0;k<12;k++){const d=new Float32Array(an.fftSize);an.getFloatTimeDomainData(d);for(const v of d)m=Math.max(m,Math.abs(v));await new Promise(r=>setTimeout(r,120));}return m;});
 const settle=()=>p.waitForTimeout(2200);
 await press('[data-do="new"]');await drainStory(p);await p.waitForTimeout(2500);
 const playing=await peak();check(`${label} music is playing (context ${await p.evaluate(()=>window.__audioTap?.state)})`,playing>0.01,`${dB(playing)} dB`);
 await press('[data-do="menu"]');await press('[data-do="audio"]');check(`${label} the 음악 / 효과음 window opens`,await p.locator('#music-volume').isVisible());
 await press('#audio-muted');await settle();const muted=await peak();check(`${label} Mute: the output is silent, reverb included`,muted===0,`${dB(muted)} dB`);
 await press('#audio-muted');await settle();const back=await peak();check(`${label} Mute off: the music returns at its level`,back>playing*.5,`${dB(back)} dB`);
 await p.locator('#sfx-volume').fill('0');await p.locator('#music-volume').fill('0');await settle();const zero=await peak();check(`${label} BGM 0 (SFX 0): the output is silent`,zero===0,`${dB(zero)} dB`);
 await p.locator('#music-volume').fill('0.05');await settle();const low=await peak();check(`${label} BGM at its lowest step still plays, quietly`,low>0&&low<playing,`${dB(low)} dB`);
 await p.locator('#music-volume').fill('0.45');await press('#audio-paused');await settle();const paused=await peak();check(`${label} Music Pause: the music is silent`,paused===0,`${dB(paused)} dB`);
 await press('#audio-paused');await p.locator('#sfx-volume').fill('0.45');await settle();const again=await peak();check(`${label} Music Pause off: the music returns`,again>playing*.5,`${dB(again)} dB`);
 const prefs=await p.evaluate(()=>window.AshenCrown.audio().prefs);check(`${label} settings are kept as chosen`,prefs.music===.45&&prefs.sfx===.45&&!prefs.muted&&!prefs.paused,JSON.stringify(prefs));
 check(`${label} no runtime errors`,errors.length===0,errors.join(' | '));results.push({label,levels:{playing:dB(playing),muted:dB(muted),back:dB(back),zero:dB(zero),low:dB(low),paused:dB(paused),again:dB(again)}});
 await ctx.close();}}
finally{await b.close();}
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/audio-mute-e2e.json',JSON.stringify({checks:n,failed:fail,results},null,1));
if(fail){console.log(`audio-mute-e2e: ${fail} of ${n} checks failed`);process.exit(1);}console.log(`audio-mute-e2e: ${n} checks passed`);
