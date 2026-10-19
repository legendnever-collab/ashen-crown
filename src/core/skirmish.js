// v0.5.0 Phase E (D-047): promotion trials and the Legion Drill, launched from the ACT I camp.
// The camp state is rebuilt on return from the (updated) campaign, so nothing of the M01–M06 flow changes.
import {MISSIONS,LAST_MISSION} from '../data/missions.js';
import {CLASS_TREE} from '../data/classes.js';
import {newGame,startBattle} from './game.js';
import {enterHub} from './frontier.js';
import {findUnit} from './rules.js';
import {promotionStatus,applyClass,act1Complete,classTierOf} from './progression.js';
import {enqueueStory} from './narrative.js';

export const TRIAL_MISSION={eric:101,elina:102,lia:103,sain:104,kai:105},DRILL_MISSION=110;
export const skirmishOf=s=>MISSIONS[s?.missionId]?.skirmish||null;
export function canStartSkirmish(s){return s?.screen==='exploration'&&!s.practice&&!s.narrative?.active&&s.missionId===LAST_MISSION&&s.frontier?.phase==='aftermath'&&act1Complete(s)&&!!s.campaign?.choices?.m06_oath&&Array.isArray(s.campaign.heroes);}
export function trialState(s,id){const st=promotionStatus(s,id);return {...st,available:canStartSkirmish(s)&&st.eligible&&!st.promoted};}

// Builds the battle. `force` is for tests and balance scripts only (skips the promotion conditions).
export function startSkirmish(camp,kind,hero=null,{force=false}={}){
 if(!force&&!canStartSkirmish(camp))return null;
 if(kind==='trial'&&(!TRIAL_MISSION[hero]||!force&&!trialState(camp,hero).available))return null;
 const id=kind==='trial'?TRIAL_MISSION[hero]:DRILL_MISSION,m=MISSIONS[id];
 const tally=camp.campaign.skirmishes||{drills:0,trials:{}},count=(tally.drills||0)+Object.values(tally.trials||{}).reduce((a,b)=>a+b,0)+(camp.campaign.results?.length||0);
 const s=newGame((camp.initialSeed+7919*(count+1)+id)>>>0,structuredClone(camp.campaign),id);
 s.skirmish={kind,hero,returnMission:camp.missionId,returnSeed:camp.initialSeed,returnOutcome:camp.outcome??null,returnReason:camp.reason??null,frontier:structuredClone(camp.frontier)};
 s.economy=structuredClone(camp.campaign.economy||camp.economy);
 const deployed=kind==='drill'?['eric','elina','lia','sain','kai']:[hero,...(m.companions||[])];
 for(const u of s.units.filter(u=>u.team==='ally')){if(!deployed.includes(u.id))u.benched=true;}
 if(kind==='trial'){const u=findUnit(s,hero);applyClass(u,CLASS_TREE[hero].find(c=>c.tier===2));u.hp=u.maxHP;u.mp=u.maxMP;}
 for(const id2 of m.wounded||[]){const u=findUnit(s,id2);u.mov=0;u.hp=Math.max(1,Math.round(u.maxHP*.4));}  // wounded: cannot walk this battle
 s.screen='deployment';startBattle(s);enqueueStory(s,`skirmish:${id}:intro`);return s;
}
// Back to the ACT I camp. A win keeps the battle's campaign (growth, memory, promotion); a loss restores
// the campaign as it was before the battle.
export function returnToCamp(s){const sk=s.skirmish;if(!sk)return null;
 const campaign=structuredClone(s.outcome==='victory'?s.campaign:(s.stageStart?.campaign||s.campaign));if(s.outcome!=='victory'&&s.campaign.dialogueMemory)campaign.dialogueMemory=structuredClone(s.campaign.dialogueMemory);
 const c=newGame(sk.returnSeed,campaign,sk.returnMission);c.practice=false;c.outcome=sk.returnOutcome;c.reason=sk.returnReason;c.economy=structuredClone(campaign.economy);c.frontier=structuredClone(sk.frontier);
 c.narrative.seen=[...(s.narrative?.seen||[])];c.narrative.history=structuredClone(s.narrative?.history||[]);
 enterHub(c,{aftermath:true,story:false});
 const promoted=s.outcome==='victory'&&skirmishOf(s)?.kind==='trial'?skirmishOf(s).hero:null;if(promoted&&classTierOf(c.campaign.heroes.find(h=>h.id===promoted))>=2)enqueueStory(c,`promo:${promoted}`);
 return c;}
