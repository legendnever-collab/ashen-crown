// v0.9 ACT III (D-079, docs/v0.9.0/ACT3_DESIGN.md §6.3; names and numbers PROPOSED): Aren's commands. The commander never
// deploys; at the war table he gives the legion one order for the coming battle (Lia stays the only strategist, D-043).
// Orders open as ACT III goes on (v0.9.0: 「지켜라」 from M15; v0.9.1: 「나아가라」 from M17; v0.9.2: 「한 사람도 두고 가지 않는다」 from M19). Practice and skirmishes never use them; M01–M14 are untouched.
export const COMMANDS={hold:{ko:'지켜라',effect:'첫 2턴 전군 DEF +2',opens:15},advance:{ko:'나아가라',effect:'첫 턴 전군 MOV +1',opens:17},leaveNoOne:{ko:'한 사람도 두고 가지 않는다',effect:'주민·동맹군이 받는 피해 −30%',opens:19}};
export const commandsFor=s=>s?.missionId>=15&&s.missionId<100&&!s.practice?Object.keys(COMMANDS).filter(id=>s.missionId>=COMMANDS[id].opens):[];
// A battle of ACT III starts with the newest order chosen; the deployment screen can change or drop it.
export const defaultCommand=s=>commandsFor(s).at(-1)??null;
export function setCommand(s,id){if(!['warroom','deployment'].includes(s?.screen))return false;if(id!==null&&!commandsFor(s).includes(id))return false;s.command=id;return true;}
// Stat change from the active order (read by effectiveStats). 「지켜라」: DEF +2 for the legion's heroes on turns 1–2;
// 「나아가라」 (v0.9.1, from M17): MOV +1 on turn 1.
export function commandBonus(s,u){if(!s?.command||u.team!=='ally')return null;if(s.command==='hold'&&s.turn<=2)return {def:2};if(s.command==='advance'&&s.turn===1)return {mov:1};return null;}
// v0.9.2 「한 사람도 두고 가지 않는다」 (from M19): civilians and allied units (the legion's side, not its heroes) take 30% less
// damage (read by rules.strikeStats, so forecasts show it too).
export const commandShield=(s,t)=>s?.command==='leaveNoOne'&&(t?.team==='civilian'||t?.team==='allied')?.7:1;
// v0.9.3 (D-093): Aren's awakening after M21 — 「함께 정한다」, a command given during battle: once a battle, one hero who has
// already acted this player phase acts again (move and action). Open from M21 on once he has awakened; never in practice.
export const TOGETHER={ko:'함께 정한다',effect:'전투 중 한 번 · 행동을 마친 장수 한 명이 다시 움직이고 행동한다'};
export const togetherOpen=s=>!!s&&!s.practice&&s.missionId>=21&&s.missionId<100&&!!s.campaign?.flags?.aren_awakened&&!s.together;
