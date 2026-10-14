// Original composition, 2026-10-14. MIDI pitch numbers; no sampled recordings.
export const MOTIF=[62,69,67,65,64,65,62,57,60,65,64,62,60,57,60,62,65,72,70,69,67,65,64,62,60,62,65,64,57,60,62,0];
export const SCORE={
 title:{name:'Ashes Before Dawn',tempo:84,melody:MOTIF,instruments:['flute','pad'],bass:[38,34,36,33],gain:.17},
 story:{name:'Secrets Beneath Stone',tempo:84,melody:MOTIF.map((n,i)=>i%2===0?n:0),instruments:['piano','pad'],bass:[38,34,36,33],gain:.14},
 player:{name:'Defenders of the Border',tempo:112,melody:MOTIF,instruments:['horn','strings'],bass:[38,41,36,33],gain:.16},
 enemy:{name:'The Enemy Advances',tempo:112,melody:MOTIF.map((n,i)=>n?n-(i%4===0?12:0):0),instruments:['horn','strings'],bass:[38,34,36,33],gain:.14},
 crisis:{name:'The Last Crossing',tempo:112,melody:MOTIF.map(n=>n?n+12:0),instruments:['strings','piano'],bass:[38,34,36,33],gain:.14}
};
export const musicScene=s=>s.narrative?.active?'story':s.screen==='title'?'title':s.screen!=='battle'?'story':s.missionId===3||s.units.some(u=>u.team==='civilian'&&!u.rescued&&u.hp>0&&u.hp<u.maxHP/2)?'crisis':s.phase==='enemy'?'enemy':'player';
