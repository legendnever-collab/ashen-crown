// v0.9 ACT III (D-079, docs/v0.9.0/ACT3_DESIGN.md §6.3; names and numbers PROPOSED): Aren's commands. The commander never
// deploys; at the war table he gives the legion one order for the coming battle (Lia stays the only strategist, D-043).
// Orders open as ACT III goes on (v0.9.0: 「지켜라」 from M15). Practice and skirmishes never use them; M01–M14 are untouched.
export const COMMANDS={hold:{ko:'지켜라',effect:'첫 2턴 전군 DEF +2',opens:15}};
export const commandsFor=s=>s?.missionId>=15&&s.missionId<100&&!s.practice?Object.keys(COMMANDS).filter(id=>s.missionId>=COMMANDS[id].opens):[];
// A battle of ACT III starts with the newest order chosen; the deployment screen can change or drop it.
export const defaultCommand=s=>commandsFor(s).at(-1)??null;
export function setCommand(s,id){if(!['warroom','deployment'].includes(s?.screen))return false;if(id!==null&&!commandsFor(s).includes(id))return false;s.command=id;return true;}
// Stat change from the active order (read by effectiveStats). 「지켜라」: DEF +2 for the legion's heroes on turns 1–2.
export function commandBonus(s,u){if(!s?.command||u.team!=='ally')return null;if(s.command==='hold'&&s.turn<=2)return {def:2};return null;}
