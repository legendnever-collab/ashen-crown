import {missionOf} from '../src/data/missions.js';
import {findUnit,alive,movement,validTarget,forecast,distance,terrainAt,terrainCost,watchCells,hostile} from '../src/core/rules.js';
import {skillsOf,NEW_SKILL_MODES} from '../src/data/skills.js';
import {validClassTarget,forecastClass} from '../src/core/class-actions.js';
import {strikePreview} from '../src/core/tactics.js';
import {moveUnit,performAction,canAct,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';
import {openStory,advanceStory} from '../src/core/narrative.js';
// v0.4 missions: path distance (walls respected, units ignored) toward open evidence, then the boss.
// v0.6 ACT II: M07 escorts the convoy (deserters near a wagon, else the wagons); M08 holds the canyon (northern
// mercenaries); with the rescue order Sain and Kai head for the rear village from TURN 4.
// v0.7 M11: Kai and Elina light the braziers; everyone else guards the pilgrims (raiders near them first).
// M12: Lia and Kai each fetch a record (seal / roster) so the copy choice opens; the rest go for the ledger, then the abbot.
// M13 policy variant: spare Baldrick and rely on persuasion (alternated by the balance harness).
let persuadeFirst=false;export const setPersuadeFirst=v=>{persuadeFirst=!!v;};
// v0.8.0: the new skills are on by default; balance baselines can switch them off to compare.
// Skill usage per mission (printed at exit with SKILL_USAGE=1) to see which skills carry a mission.
export const USAGE={};if(typeof process!=='undefined'&&process.env?.SKILL_USAGE)process.on('exit',()=>{for(const k of Object.keys(USAGE).sort())if(!/ (attack|wait|move)$/.test(k))console.error('usage',k,USAGE[k]);});
let useTactics=true;export const setUseTactics=v=>{useTactics=!!v;};
export function watchRisk(s,x,y){if(!missionOf(s).stealth||(s.missionState?.alert||0)>=2)return false;const k=`${x},${y}`;
 for(const g of s.units.filter(g=>g.watch&&alive(g)&&!g.awake)){if(watchCells(s,g).has(k))return true;const nx=g.turns?.length?{...g,facing:g.turns[((g.turnIndex||0)+1)%g.turns.length]}:g;if(watchCells(s,nx).has(k))return true;}return false;}
function act2Goals(s,u){const live=t=>alive(t)&&t.team==='enemy';
 // v0.7.1 M13: Erik (and Thea once) walk to Baldrick to persuade him; the rest guard the camp. M14: guard the leaders.
 if(s.missionId===13){const boss=s.units.find(t=>t.id==='boss'&&live(t)),camp=s.units.filter(v=>v.team==='civilian'&&alive(v)),near=s.units.filter(e=>live(e)&&camp.some(v=>distance(e,v)<=4));
  if(boss&&(u?.id==='eric'||u?.id==='thea'&&!s.missionState.thea))return [boss];if(near.length)return near;return camp.length?camp:s.units.filter(live);}
 if(s.missionId===14){const lead=s.units.filter(l=>l.leader&&alive(l)&&l.team==='allied'),near=s.units.filter(e=>live(e)&&lead.some(l=>distance(e,l)<=4));if(near.length)return near;return lead.length?lead:s.units.filter(live);}
 if(s.missionId===11){const dark=s.units.filter(b=>b.kind==='brazier'&&!b.lit),flock=s.units.filter(v=>v.team==='civilian'&&alive(v)),near=s.units.filter(e=>live(e)&&flock.some(v=>distance(e,v)<=4));
  if(dark.length&&['kai','elina'].includes(u?.id))return dark;if(near.length)return near;return flock.length?flock:s.units.filter(live);}
 if(s.missionId===12){const rec=t=>s.units.find(o=>o.evidence===t&&alive(o)),ledger=rec('ledger'),boss=s.units.find(t=>t.id==='boss'&&live(t));
  if(u?.id==='lia'&&rec('seal'))return [rec('seal')];if(u?.id==='kai'&&rec('roster'))return [rec('roster')];
  if(ledger)return [ledger];if(boss)return [boss];return s.units.filter(live);}
 if(s.missionId===9){const marks=s.units.filter(v=>v.team==='civilian'&&alive(v)),boss=s.units.find(t=>t.id==='boss'&&live(t)),hunters=s.units.filter(e=>live(e)&&marks.some(v=>distance(e,v)<=4));
  if(marks.length&&['kai','sain','thea','eric','dario'].includes(u?.id))return marks;if(hunters.length)return hunters;return boss?[boss]:s.units.filter(live);}
 if(s.missionId===10){const st=s.campaign.choices?.m10_stance||'mediate',lords=s.units.filter(t=>(st==='a'?['boss2']:st==='b'?['boss']:['boss','boss2']).includes(t.id)&&live(t)),folk=s.units.filter(v=>v.team==='civilian'&&alive(v));
  if(folk.length&&['sain','kai'].includes(u?.id))return folk;const guards=s.units.filter(e=>live(e)&&lords.some(l=>e.faction===l.faction&&distance(e,l)<=3));return lords.length?[...lords,...guards]:s.units.filter(live);}
 if(s.missionId===7){const wagons=s.units.filter(w=>w.kind==='wagon'&&alive(w)),foes=s.units.filter(e=>live(e)&&wagons.some(w=>distance(e,w)<=4));return foes.length?foes:wagons.length?wagons:s.units.filter(live);}
 const villagers=s.units.filter(v=>v.team==='civilian'&&alive(v));if(s.campaign.choices?.m08_order==='rescue'&&villagers.length&&['sain','kai'].includes(u?.id))return villagers;
 const devices=s.units.filter(d=>d.kind==='rockfall'&&!d.rescued&&s.units.filter(e=>live(e)&&e.x>=d.zone[0]&&e.x<=d.zone[1]&&e.y>=d.zone[2]&&e.y<=d.zone[3]).length>=1);if(devices.length&&u?.id===(s.campaign.choices?.m08_order==='rescue'?'elina':'kai'))return devices;
 const north=s.units.filter(e=>live(e)&&!/^s\d/.test(e.id)),rear=s.units.filter(e=>live(e)&&/^s\d/.test(e.id));return north.length?north:rear.length?rear:[{x:7,y:5}];}
function missionGoals(s,u){if(s.missionId>=7)return act2Goals(s,u);if(s.missionId===6){const st=s.missionState,refs=s.units.filter(u=>u.team==='civilian'&&alive(u));
 if(st.phase===3&&refs.length&&!s.units.some(u=>u.team==='civilian'&&u.rescued))return refs;
 if(st.phase===3){const boss=s.units.find(t=>t.id==='boss'&&alive(t));return boss?[boss]:[{x:7,y:1},{x:8,y:0},{x:9,y:0},{x:10,y:1}];}const stones=s.units.filter(o=>o.kind==='sealstone'&&!o.rescued&&!o.locked);return stones.length?[...stones,...refs]:refs.length?refs:[{x:8,y:1}];}
 const open=s.units.filter(o=>o.team==='object'&&o.kind==='evidence'&&alive(o));return open.length?open:s.units.filter(t=>t.id==='boss'&&alive(t));}
function fieldDistance(s,u,goals){const d=new Map(),q=[];for(const g of goals)for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=g.x+dx,y=g.y+dy;if(Number.isFinite(terrainCost(s,u,x,y))){d.set(`${x},${y}`,0);q.push({x,y,c:0});}}while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();if(p.c!==d.get(`${p.x},${p.y}`))continue;for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,step=terrainCost(s,u,x,y),k=`${x},${y}`;if(!Number.isFinite(step))continue;const c=p.c+step;if(c<(d.get(k)??Infinity)){d.set(k,c);q.push({x,y,c});}}}return d;}
export function drain(s){openStory(s);for(let i=0;s.narrative.active&&i<100;i++)advanceStory(s);}
function strikeScore(s,u,t,f,capture){const civ=s.units.filter(v=>v.team==='civilian'&&alive(v));let score=f.damage*f.hit/100*3+(f.after===0?50:0)-f.counter;
   if(s.missionId===2&&t.id==='boss'){score+=100;if(capture&&f.after===0)score=-500;}
   if(s.missionId===10&&(s.campaign.choices?.m10_stance||'mediate')==='mediate'&&['boss','boss2'].includes(t.id)&&f.after===0)score=-500; // mediation: never kill a lord
   if(s.missionId===3){if(civ.length)score+=20;else score+=t.y<u.y?100:10;}
   if(s.missionId===12&&(s.missionState.alert||0)<2&&(t.watch||t.id==='boss'&&s.units.some(o=>o.evidence==='ledger'&&alive(o)))&&f.after>0)score=-500; // never strike a quiet guard without dropping it (the abbot once the ledger is safe)
   if(s.missionId===13&&persuadeFirst&&t.id==='boss')score=-500; // persuasion run: never strike Baldrick
   if(s.missionId>=7)score+=200+(t.id==='boss'?30:0)+(s.missionId===7&&s.units.some(w=>w.kind==='wagon'&&alive(w)&&distance(w,t)<=1)?60:0);
   if(s.missionId===6){if(t.id==='boss'&&s.missionState.phase===3)score+=60;if(/^k\d/.test(t.id))score+=25;if(/^r\d/.test(t.id))score+=30;}
   if(s.missionId===4){if(t.burns&&s.turn<missionOf(s).burnTurn&&s.units.some(o=>o.evidence===t.burns&&alive(o)))score+=80;if(t.id==='boss')score+=60;}
 // v0.8: in M04 and M06 striking the enemy that is the current goal always beats standing beside it (with more ways to spend
 // MP, the old weights let the party wait next to the boss once Lia's bolts were not the ones finishing him).
 if((s.missionId===4||s.missionId===6)&&t.team==='enemy'&&missionGoals(s,u).includes(t))score+=150;
 return score;}
// v0.8.0 (D-073): the policy also plays the new skills (② and the recruits' ③); promotion actions and purchased tools stay
// unused as before. Strike skills are scored like an attack plus the worth of the status they leave.
const STATUS_WORTH={pinningShot:20,venomEdge:25,feint:15,flameBrand:15,breakthrough:5};
function tacticOptions(s,u,a){const out=[];for(const k of skillsOf(a).filter(k=>k.slot>1&&k.open&&NEW_SKILL_MODES.includes(k.mode)&&a.mp>=k.cost)){const m=k.mode;
 if(m==='flameBurst'){for(let y=a.y-3;y<=a.y+3;y++)for(let x=a.x-3;x<=a.x+3;x++){const p=`${x},${y}`;if(!validClassTarget(s,a,p,m))continue;let v=0,n=0;for(const t of s.units.filter(t=>alive(t)&&hostile(s,a,t)&&Math.abs(t.x-x)+Math.abs(t.y-y)<=1)){const f=strikePreview(s,a,t,m);v+=strikeScore(s,u,t,{...f,after:Math.max(0,t.hp-f.damage),counter:0},true);n++;}if(n>=2)out.push({mode:m,target:p,score:v-90});}continue;} // −90: worth more than one bolt (MP and the bolt it replaces)
 if(m==='whirlwind'){if(!validClassTarget(s,a,a.id,m))continue;const foes=s.units.filter(t=>alive(t)&&hostile(s,a,t)&&distance(a,t)===1);if(foes.length<2)continue;let v=0;for(const t of foes){const f=strikePreview(s,a,t,m);v+=strikeScore(s,u,t,{...f,after:Math.max(0,t.hp-f.damage),counter:0},true);}out.push({mode:m,target:a.id,score:v-30});continue;}
 if(m==='rallyCry'){const n=s.units.filter(t=>t.team==='ally'&&alive(t)&&t.id!==u.id&&!t.acted&&distance(a,t)<=2).length;const foesNear=s.units.some(t=>alive(t)&&hostile(s,a,t)&&distance(a,t)<=5);if(n>=2&&foesNear)out.push({mode:m,target:a.id,score:20+n*10,support:true});continue;}
 if(m==='pilgrimLantern'){const n=s.units.filter(t=>t.team==='ally'&&alive(t)&&t.status&&distance(a,t)<=1).length;if(n)out.push({mode:m,target:a.id,score:120*n,support:true});continue;}
 for(const t of s.units.filter(alive)){if(!validClassTarget(s,a,t,m))continue;
  if(m==='purify'){if(t.status)out.push({mode:m,target:t.id,score:150,support:true});continue;}
  if(m==='provoke'){const weak=s.units.filter(v=>(v.team==='civilian'||['lia','sain','elina'].includes(v.id))&&alive(v)&&distance(v,t)<=4);const reach=(t.mov||0)+(t.range?.[1]||1);if(weak.some(v=>distance(v,t)<=reach)&&a.hp>a.maxHP*.6&&!s.units.some(e=>alive(e)&&hostile(s,a,e)&&distance(a,e)===1))out.push({mode:m,target:t.id,score:5,support:true});continue;}
  const f=forecastClass(s,a,t,m),sc=strikeScore(s,u,t,{damage:f.damage,hit:f.hit,after:f.after,counter:f.counter},true);if(sc>-400)out.push({mode:m,target:t.id,score:sc+(f.after>0?STATUS_WORTH[m]||0:0)});}}
 return out;}
export function campaignAction(s,u,capture=true){
 let best=null;const exitDistance=new Map();if(s.missionId===3){const q=[];for(let y=0;y<=2;y++)for(let x=0;x<14;x++)if(Number.isFinite(terrainCost(s,u,x,y))){exitDistance.set(`${x},${y}`,0);q.push({x,y,c:0});}while(q.length){q.sort((a,b)=>a.c-b.c);const p=q.shift();for(const [dx,dy]of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,c=p.c+terrainCost(s,u,p.x,p.y),k=`${x},${y}`;if(Number.isFinite(terrainCost(s,u,x,y))&&c<(exitDistance.get(k)??Infinity)){exitDistance.set(k,c);q.push({x,y,c});}}}}const goalDistance=s.missionId>=4?fieldDistance(s,u,missionGoals(s,u)):null;const cells=u.moved?new Map([[`${u.x},${u.y}`,0]]):movement(s,u).costs;
 const civ=s.units.filter(t=>t.team==='civilian'&&alive(t));
 for(const [p,c]of cells){const [x,y]=p.split(',').map(Number),a={...u,x,y};
  for(const t of s.units.filter(alive))for(const mode of s.missionId>=4?['search','capture','rescue','persuade','skill','attack']:['capture','rescue','skill','attack']){if(!validTarget(s,a,t,mode)||mode==='capture'&&!capture||mode==='skill'&&a.mp<(a.cost+(a.id==='lia'&&a.hp<=a.maxHP/2?1:0)))continue;const f=forecast(s,a,t,mode);let score=-1000;
  if(mode==='search')score=t.kind==='rockfall'?s.units.filter(e=>e.team==='enemy'&&alive(e)&&e.x>=t.zone[0]&&e.x<=t.zone[1]&&e.y>=t.zone[2]&&e.y<=t.zone[3]).length*500-100:t.kind==='sealstone'?1400:t.kind==='lever'?1100:t.evidence==='ledger'?1500:1300;
  else if(mode==='capture')score=2000;
  else if(mode==='persuade')score=1800;
  else if(mode==='rescue')score=1000;
  else if(f.heal!==undefined)score=t.team==='civilian'&&t.hp<=t.maxHP/2?900:f.heal>=10?80+f.heal:0;
  else if(f.guard===true)score=0;
  else score=strikeScore(s,u,t,f,capture);
  score-=c*.5;if(s.missionId===11&&missionOf(s).map[y][x]==='r'&&s.units.some(p=>p.team==='civilian'&&alive(p)&&p.x===x&&p.y>y))score-=80;if(s.missionId===12&&watchRisk(s,x,y)&&!(mode==='attack'&&f.after===0))score-=900;if(!best||score>best.score)best={id:u.id,x,y,mode,target:t.id,score};}
  let score;
  if(goalDistance)score=200-(goalDistance.get(`${x},${y}`)??100)*12-c*.1-(s.missionId===7&&['r','i'].includes(missionOf(s).map[y][x])&&s.units.some(w=>w.kind==='wagon'&&alive(w)&&Math.abs(w.x-x)<=1&&w.y>y)?60:0)-(s.missionId===11&&missionOf(s).map[y][x]==='r'&&s.units.some(p=>p.team==='civilian'&&alive(p)&&p.x===x&&p.y>y)?80:0)-(s.missionId===12&&watchRisk(s,x,y)?900:0);
  else if(s.missionId===3&&!civ.length)score=200-(exitDistance.get(`${x},${y}`)??100)*15-y*3-c*.1;
  else{const targets=civ.length?civ:s.units.filter(t=>t.id==='boss'&&alive(t));const near=targets.reduce((n,t)=>Math.min(n,distance(a,t)),100);score=80-near*8-c*.1;}
  if(!best||score>best.score)best={id:u.id,x,y,mode:'wait',score};
  // Strike skills compete with attacks; support skills (rally, provoke, purify, lantern) add to the worth of standing here.
  if(useTactics)for(const o of tacticOptions(s,u,a)){const sc=o.support?score+o.score:o.score-c*.5;if(!best||sc>best.score)best={id:u.id,x,y,mode:o.mode,target:o.target,score:sc};}
 }
 return best||{id:u.id,x:u.x,y:u.y,mode:'wait'};
}
export function playCampaignBattle(s,capture=true){const trace=[];let steps=0;drain(s);while(!s.outcome&&steps++<150){for(const id of ['kai','lia','elina','sain','eric','thea','dario','ines']){const u=findUnit(s,id);if(!canAct(s,u))continue;const a=campaignAction(s,u,capture);if(a.x!==u.x||a.y!==u.y){if(!moveUnit(s,id,a.x,a.y))throw Error('illegal move');trace.push({type:'move',id,x:a.x,y:a.y});}const action=performAction(s,id,a.mode,a.target);if(!action.ok)throw Error(action.error);USAGE[`M${String(s.missionId).padStart(2,'0')} ${a.mode}`]=(USAGE[`M${String(s.missionId).padStart(2,'0')} ${a.mode}`]||0)+1;trace.push({type:'action',id,mode:a.mode,target:a.target});drain(s);if(s.outcome)break;}if(!s.outcome){beginEnemyPhase(s);trace.push({type:'phase'});while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);}}return {outcome:s.outcome,turn:s.turn,trace,saved:s.units.filter(u=>u.team==='civilian'&&u.rescued).length,captured:!!s.campaign.flags.mission_02_prisoner_captured};}
