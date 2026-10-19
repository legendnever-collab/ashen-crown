// v0.5.0 progression: potential (3 steps), proficiency ★ and promotion state (D-047/D-048).
// Pure functions over campaign data; nothing here changes M01–M06 rules for tier-1 heroes.
import {CLASS_TREE,POTENTIAL,PROFICIENCY_STEPS,PROFICIENCY_SOURCE,PROFICIENCY_EFFECT,PROMOTION_LEVEL} from '../data/classes.js';
import {LAST_MISSION} from '../data/missions.js';

export const classTierOf=u=>Math.max(1,u?.classTier||1);
export function classOf(u){const tree=CLASS_TREE[u?.id];if(!tree)return null;return tree.find(c=>c.tier===classTierOf(u))||tree[0];}
export function nextClassOf(u){return CLASS_TREE[u?.id]?.find(c=>c.tier===classTierOf(u)+1)||null;}
// The campaign record of a hero (growth/clues live there between missions); falls back to the live unit.
export function heroRecord(s,id){return s.campaign?.heroes?.find(h=>h.id===id)||s.units?.find(u=>u.id===id&&u.team==='ally')||null;}
export function potentialOf(campaign,hero){
 const steps=POTENTIAL[hero?.id];if(!steps)return {step:0,max:0,steps:[]};
 const m=campaign?.tacticalMemory||{},h={clues:[],...hero},done=[];
 for(const st of steps){const ok=done.length===done.filter(Boolean).length&&!!st.done(m,h);done.push(ok);}  // steps unlock in order
 return {step:done.filter(Boolean).length,max:steps.length,steps:steps.map((st,i)=>({label:st.label,done:done[i]}))};
}
export function proficiencyOf(campaign,id){const count=PROFICIENCY_SOURCE[id]?.(campaign?.tacticalMemory||{})||0;return {count,stars:PROFICIENCY_STEPS.filter(t=>count>=t).length,next:PROFICIENCY_STEPS.find(t=>count<t)??null};}
// Bonus is live only for promoted heroes, so tier-1 combat stays identical to v0.4.0.
export function proficiencyBonus(s,u){if(u?.team!=='ally'||classTierOf(u)<2)return {};const {stars}=proficiencyOf(s.campaign,u.id),e=PROFICIENCY_EFFECT[u.id]||{};return Object.fromEntries(Object.entries(e).map(([k,v])=>[k,v*stars]));}
export const act1Complete=s=>!!s.campaign?.flags?.act1_completed||(s.campaign?.completed||[]).includes(LAST_MISSION);
export function promotionStatus(s,id){
 const h=heroRecord(s,id),next=nextClassOf(h);if(!h||!next)return {id,eligible:false,promoted:classTierOf(h)>=2,next:null,checks:[]};
 const pot=potentialOf(s.campaign,h),checks=[
  {key:'act1',label:'ACT I 완료',ok:act1Complete(s)},
  {key:'level',label:`Lv ${PROMOTION_LEVEL} 이상 (현재 ${h.level})`,ok:h.level>=PROMOTION_LEVEL},
  {key:'potential',label:`잠재력 ${pot.step}/${pot.max}`,ok:pot.step>=pot.max}];
 return {id,eligible:checks.every(c=>c.ok),promoted:false,next,potential:pot,checks};
}
// Applies the class change to one hero object (campaign record or live unit). Idempotent per tier.
export function applyClass(u,cls){if(!u||!cls||classTierOf(u)>=cls.tier)return false;u.classTier=cls.tier;
 for(const [k,v]of Object.entries(cls.bonus||{})){u[k]=(u[k]||0)+v;if(k==='maxHP'&&'hp'in u)u.hp=Math.min(u.maxHP,(u.hp||0)+v);if(k==='maxMP'&&'mp'in u)u.mp=Math.min(u.maxMP,(u.mp||0)+v);}
 if(cls.movBonus)u.classMovementModifier=(u.classMovementModifier||0)+cls.movBonus;if(cls.profile)u.movementProfile=cls.profile;return true;}
// Confirms a promotion in the campaign (called after a won trial, Phase E). Returns false when not eligible.
export function promote(s,id,{force=false}={}){const st=promotionStatus(s,id);if(!st.next||(!st.eligible&&!force)||s.practice)return false;
 const rec=s.campaign.heroes?.find(h=>h.id===id);if(!rec)return false;applyClass(rec,st.next);const live=s.units?.find(u=>u.id===id&&u.team==='ally');if(live&&live!==rec)applyClass(live,st.next);
 s.campaign.promotions??={};s.campaign.promotions[id]={tier:st.next.tier,key:st.next.key,mission:s.missionId,turn:s.turn};return true;}
export function classGrowth(u){return classOf(u)?.growth||{};}
