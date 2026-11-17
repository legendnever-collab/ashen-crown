// v2.1 일기토 이벤트 (D-118, TAVERN_WORLD_DESIGN §2): a hero beside a story-linked enemy lead starts the duel — after a
// move on the player's phase, or when the player's phase opens with the two already side by side. One time per pair and
// battle (s.duelEvents). The arena opens with 받는다 / 물러선다 (duel.js 'skip' = 물러선다).
import {DUEL_EVENTS} from '../data/duel-events-v210.js';
import {findUnit,alive,distance} from './rules.js';
import {startDuel,duelOpen} from './duel.js';
import {enqueueStory} from './narrative.js';
import {missionOf} from '../data/missions.js';

export const duelEventsOf=s=>missionOf(s)?.skirmish?[]:DUEL_EVENTS[s?.missionId]||[];
const ready=(s,ev)=>{if((s.duelEvents||[]).includes(ev.key)||s.turn<(ev.from||1)||ev.phase&&s.missionState?.phase!==ev.phase)return null;const f=findUnit(s,ev.foe);if(!f||f.team!=='enemy'||!alive(f)||f.benched||f.withdrawing||f.withdrew)return null;
 for(const id of ev.heroes){const h=findUnit(s,id);if(h&&h.team==='ally'&&alive(h)&&!h.benched&&distance(h,f)===1)return h;}return null;};
// The event that would fire now for this hero (or any hero), or null.
export function pendingDuelEvent(s,heroId=null){if(s?.screen!=='battle'||s.phase!=='player'||duelOpen(s)||s.outcome)return null;
 for(const ev of duelEventsOf(s)){const h=ready(s,ev);if(h&&(!heroId||h.id===heroId))return {ev,hero:h};}return null;}
// Fires the first ready event: the pair's words, then the arena. Returns the event key or null.
export function checkDuelEvents(s,heroId=null){const p=pendingDuelEvent(s,heroId);if(!p)return null;const {ev,hero}=p;
 if(!startDuel(s,hero.id,ev.foe,ev.key))return null;s.duelEvents=[...(s.duelEvents||[]),ev.key];if(ev.flag&&s.missionState)s.missionState[ev.flag]=true;
 delete s.undo?.[hero.id];enqueueStory(s,ev.key);return ev.key;}
