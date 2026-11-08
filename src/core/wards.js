// v0.9.2 (D-089; numbers PROPOSED): Lia's Little Ward (her ④). A 3×3 ward around s.smallWard {by,x,y,until}: enemies cannot
// step into it, legion units inside have RES +5. It lasts through the enemy phase of turn `until` (the turn after casting).
// No imports, so the movement rules, the stats and the renderer can all read it.
export const smallWardOn=s=>!!s?.smallWard&&Number.isInteger(s.turn)&&s.turn<=s.smallWard.until;
export const inSmallWard=(s,p)=>smallWardOn(s)&&!!p&&Math.abs(p.x-s.smallWard.x)<=1&&Math.abs(p.y-s.smallWard.y)<=1;
