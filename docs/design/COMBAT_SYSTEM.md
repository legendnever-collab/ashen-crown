# Combat System
실제 기준: src/core/rules.js / game.js, 기존 v0.1.3 회귀 tests. 12×10, 직교 이동, 점유 Tile 통과 불가, Forest cost 2(Kai 1), Village DEF+2, Forest evade+12, Ruin 통과 불가. 캐릭터당 이동 1+행동 1, 행동 전 Undo. 확인 이동·반격·예측·Guard·Heal·Quick Strike 유지. M01 증원 T3/주민 위협 T5.
M02 Capture는 인접+절반 HP 이하 도주 대장. M03 호위/즉시 구조+안전지대 철수. Mission 데이터는 src/data/missions.js, 결과 로직은 game.js. RNG 저장·재시작 결정성.

Effective stats/consumables: see EQUIPMENT_SYSTEM and ECONOMY_AND_SHOPS. Core mission rules, free deployment and seeded RNG preserved.


## v0.3.1 movement and interaction
Select an active hero → immediate Dijkstra range + contextual action menu → destination preview → confirm/cancel → walk → resolve. Preserve post-move attacks, undo before an action, skills/tools/rescue/capture and counter rules. MOV: Knight 2, Archer/Mage/Healer 3, Rogue 4. Equipment adds MOV, Shadow Step still adds 1 when earned. Allies may be crossed, never occupied as destinations; enemies/civilians block movement. Terrain profiles include forest/mountain/desert/swamp and retain impassable walls/deep water. Use core/rules.js terrainCost for both displayed range and path execution. Future mounted modifier/profile stored but no promotion button. M03 remains 10 turns; 30 standard campaign seeds completed in 5–10 bridge turns. Full balance metrics in v0.3.1 report.

## v0.3.2
Phase-once friendly/enemy terrain recovery, floor/min1/clamp, saved per-unit marker; Village10/5,Fort15/10,Recovery10/10 percent HP/MP. See TERRAIN_RECOVERY.md. No new mission, deadline or growth stat changes.

## v0.3.3 preservation
Advisor calls shared openCouncil → existing Free Deployment → explicit Confirm → startBattle. No direct NPC battle mutations. Stable eric entity supplies exploration appearance and battle effectiveStats. Existing recovery, victory claims, practice isolation, missions01–03 and M03 ten-turn deadline unchanged.
