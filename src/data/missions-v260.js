// v2.6.0 「지형과 성장」 (D-152, docs/v2.6.0/TERRAIN_XP_DESIGN.md §2): riders cannot enter a forest any more. Every map was checked
// (tests/terrain-v260.test.mjs): where a wave of riders arrived in a forest pocket with no way out, a tile of the forest edge
// becomes open ground (M13's two north-road flanks), and a rider set down in a forest arrives on the open ground beside it
// (M05's third rider). Objectives, rules and story are unchanged.
export const TILES260={13:[[3,4,'g'],[24,4,'g']]};
export const WAVES260={5:{c3:[23,2]}};
export function applyV260(MISSIONS){
 for(const [k,cells] of Object.entries(TILES260)){const m=MISSIONS[+k];for(const [x,y,t] of cells){m.map[y][x]=t;if(m.layers?.collision?.[y])m.layers.collision[y][x]=['x','w'].includes(t);}}
 for(const [k,units] of Object.entries(WAVES260)){const m=MISSIONS[+k];for(const w of m.waves||[])for(const u of w.units||[])if(units[u.id])[u.x,u.y]=units[u.id];}
}
