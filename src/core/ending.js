// v1.0.0 (D-113, docs/v0.10.0/ACT4_DESIGN.md §6 Q5–Q6): which endings are open, the choice, the epilogue and the ending card.
// The path chosen at M22 always opens its ending; the other two open by a banner's trust (2 or more) and one choice of the
// story. The player picks among the open ones after M30. campaign.ending = {id, at, path, bellard, confession}; the save
// stays open after the ending (the camp, practice, training and revisits go on).
import {OFFICER_EPILOGUE} from '../data/talk-v200.js';
import {MERC_EPILOGUE} from '../data/mercs-v210.js';
const HIRE_EPILOGUE={...OFFICER_EPILOGUE,...MERC_EPILOGUE};
import {ENDINGS,ENDING_IDS,BY_END,BY_CHOICE,BELLARD,BALDRICK_OUT,HERO_NAME,STAGE_LINE} from '../data/ending-v100.js';
import {ensureTrust,trustStage,FACTIONS} from './factions.js';
import {setStoryFlag} from './narrative.js';
import {partyHeroes} from '../data/game-data.js';
import {recordOf,signatureDeed} from './records.js';
export {ENDINGS,ENDING_IDS};
const SIDE={A:c=>(ensureTrust(c).iron??0)>=2&&c.choices?.m21_king==='promise',B:c=>(ensureTrust(c).free??0)>=2&&c.choices?.m20_plan==='send',C:c=>(ensureTrust(c).flame??0)>=2&&c.choices?.m17_oath==='leave'};
export const endingOpen=(c,id)=>!!ENDINGS[id]&&(c?.choices?.act3_choice===ENDINGS[id].path||!!SIDE[id](c||{}));
// At least one ending is always open: a save without the M22 choice (never in play) falls back to B, the council's.
export function openEndings(c){const open=ENDING_IDS.filter(id=>endingOpen(c,id));return open.length?open:['B'];}
export const endingReady=s=>!!s&&!s.practice&&s.campaign?.completed?.includes(30)&&s.campaign.flags?.act4_completed===true&&!s.campaign.ending;
export function chooseEnding(s,id,at=new Date()){const c=s.campaign;if(!endingReady(s)||!openEndings(c).includes(id))return false;
 c.ending={id,at:at.toISOString().slice(0,10),path:c.choices?.act3_choice||null,bellard:c.choices?.m29_bellard||null,confession:c.choices?.m28_confession||null};
 c.choices??={};c.choices.ending=id;setStoryFlag(s,'ending',id);return true;}
export function validEnding(c){const e=c?.ending;if(e==null)return true;return !!e&&typeof e==='object'&&!Array.isArray(e)&&ENDINGS[e.id]&&typeof e.at==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(e.at)&&c.completed?.includes(30)
 &&[null,'king','council','oath'].includes(e.path)&&[null,'trial','exile','offer'].includes(e.bellard)&&[null,'all','eric'].includes(e.confession)&&Object.keys(e).length===5;}
// Epilogue cards: every hero in the legion (ending, a choice of their own, their record's deed, their awakening), Aren, the
// king, Bellard, Baldrick when he did not join, and the three banners' leaders.
export function epilogue(c,id=c?.ending?.id){if(!ENDINGS[id])return [];const cards=[],f=c.flags||{};
 for(const h of partyHeroes(c)){const lines=[BY_END[h.id]?.[id],BY_CHOICE[h.id]?.(c)].filter(Boolean),rec=(c.heroes||[]).find(u=>u.id===h.id),deed=signatureDeed(recordOf(c,h.id));
  if(deed)lines.push(`장수 열전 · 대표 전과 「${deed}」.`);if((rec?.classTier||1)>=3)lines.push(`${HERO_NAME[h.id]||h.name}의 각성은 새 결계를 세우는 날에도 함께였다.`);
  if(HIRE_EPILOGUE[h.id])lines.unshift(HIRE_EPILOGUE[h.id][id]); /* v2.0.0 부장: one line each */
  cards.push({id:h.id,name:HERO_NAME[h.id]||h.name,kind:HIRE_EPILOGUE[h.id]?'officer':'hero',lines:lines.slice(0,5)});}
 cards.push({id:'aren',name:HERO_NAME.aren,kind:'commander',lines:[BY_END.aren[id],BY_CHOICE.aren(c)].filter(Boolean)});
 cards.push({id:'king',name:HERO_NAME.king,kind:'king',lines:[BY_END.king[id],BY_CHOICE.king(c)].filter(Boolean)});
 cards.push({id:'bellard',name:HERO_NAME.bellard,kind:'bellard',lines:BELLARD[c.choices?.m29_bellard]||BELLARD.trial});
 if(!(c.roster||[]).includes('baldrick')&&BALDRICK_OUT[f.mission_26_baldrick])cards.push({id:'baldrick',name:HERO_NAME.baldrick,kind:'baldrick',lines:BALDRICK_OUT[f.mission_26_baldrick]});
 const t=ensureTrust(c);for(const [fid,lid] of [['iron','cassian'],['free','leonora'],['flame','lucien']])cards.push({id:lid,name:HERO_NAME[lid],kind:'leader',faction:fid,lines:[BY_END[lid][id],`${FACTIONS[fid].name}은(는) ${STAGE_LINE[trustStage(t[fid]??0).id]}`]});
 return cards;}
// The ending card's numbers: missions cleared, battles fought (the last 30 kept in the save) and the turns of the winning ones.
export function campaignTotals(c){const r=(c.results||[]).filter(x=>x&&!x.practice),won=r.filter(x=>x.outcome==='victory');return {missions:(c.completed||[]).length,battles:r.length,turns:won.reduce((n,x)=>n+(Number.isInteger(x.turn)?x.turn:0),0)};}
