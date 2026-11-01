// v0.8.0 skills (D-073 Q1; numbers PROPOSED). Every hero has three: ① the signature skill (performAction mode 'skill',
// unchanged), ② a new skill (Lv 4 for the five ACT I heroes, on joining for the recruits) and ③ the promotion action
// (the five, unchanged) or a third new skill for the recruits (join level + 3). Names and effects: catalog-v08.js.
import {CATALOG_SKILLS} from './catalog-v08.js';
export const SKILL_LEVEL=4;
// Join levels of the ACT II recruits (mission-rules joinRoster calls); ③ opens three levels later.
export const RECRUIT_JOIN={thea:8,dario:9,ines:10};
// The promotion actions keep their v0.5 modes.
const CLASS_MODE={bulwark:'bulwark',overwatch:'overwatch',arcane:'arcane',recall:'recall',exchange:'exchange'};
export const SKILLS=CATALOG_SKILLS.map(c=>({...c,mode:c.slot===1?'skill':CLASS_MODE[c.id]||c.id}));
// The new skill modes (performAction modes handled by core/tactics.js).
export const NEW_SKILL_MODES=SKILLS.filter(k=>k.slot>1&&!CLASS_MODE[k.id]).map(k=>k.mode);
export const skillByMode=mode=>SKILLS.find(k=>k.mode===mode&&k.slot>1)||null;
// When a skill opens, as a short label for the menu ('' when open).
export function learnRule(u,k){
 if(k.slot===1)return {open:true,label:''};
 const recruit=RECRUIT_JOIN[u.id];
 if(k.slot===2)return recruit?{open:true,label:''}:{open:(u.level||1)>=SKILL_LEVEL,label:`Lv ${SKILL_LEVEL}에 습득`};
 if(recruit)return {open:(u.level||1)>=recruit+3,label:`Lv ${recruit+3}에 습득`};
 return {open:(u.classTier||1)>=2,label:'전직하면 습득'};
}
// The hero's three skills in order, each with its mode, MP and whether it is open.
export function skillsOf(u){if(u?.team!=='ally')return [];return SKILLS.filter(k=>k.hero===u.id).sort((a,b)=>a.slot-b.slot).map(k=>{const r=learnRule(u,k);return {...k,open:r.open,lock:r.label};});}
export const knowsMode=(u,mode)=>skillsOf(u).some(k=>k.mode===mode&&k.open);
