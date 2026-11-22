# Ashen Crown v2.6.0 「지형과 성장」 — Test Report
Updated 2026-11-22 KST. **Release candidate** on feature/v2.6.0 (not merged), built on the v2.5.2 release candidate; the user plays and approves each first (v2.5.2, then v2.6.0).
- Decisions: D-152 (design approved with the recommended answers), D-153 (build, two measured departures, tuning, fixes). Design: docs/v2.6.0/TERRAIN_XP_DESIGN.md. Notes: docs/v2.6.0/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.6.0_SHA256SUMS` (`index.html` is identical).

## What changed
- **Forest by class:** foot soldiers (infantry, spear, archer, mage, healer, shield) stop on entering a forest tile — it takes the rest of their move, one tile a turn inside; rogues pay 1; riders cannot enter. Riders pay 2 in the desert. Gunnar's snow 1 and Maren's swamp 1 stay.
- **Riders never stand in a forest:** the AI's long paths use each mover's own costs (no riders through forest, a forest a whole turn on foot); deployment, the bench, a joining hero and arriving waves put a rider on open ground; skill moves (push, pass-through, exchange, recall) already checked the mover's terrain.
- **Maps:** every mission and request map checked automatically (tests/terrain-v260.test.mjs). M13: two forest-edge tiles opened for the north-road rider waves (they arrived in a pocket with no way out). M05: the third rider arrives on the open ground beside the forest.
- **Fire:** the water's edge (swamp, bridge, ice bridge, or a tile touching deep water) ×0.5, winning over forest ×1.5; no ignition there. The forecast shows 「🔥 숲 +50%」 / 「🔥 물가 −50%」; the tile readout and the war council's terrain line state the forest rule.
- **EXP by the level gap** (enemy − hero): ≥ +5 ×2.0, +1…+4 ×1.2–1.8, 0…−2 ×1, −3…−9 ×0.9–0.3, ≤ −10 ×0.05; hits and kills by the foe struck, the rest by the battle's enemy average. The gap shows on the EXP text when it changed the amount.
- **Measured departures (D-153):** base hit 22 → 15, kill +28 → +20 (the table alone levelled the legion ~6 faster by M15); M15 ×0.94 → ×0.88, M16 ×1 → ×0.92, M17 ×0.97 → ×0.85; 어려움 M14 without the level push.
- **Fixed:** two renamed imports the single-file build could not resolve — `terrainCost as terrainCostOf` in game.js (since v2.0.0 the shield's 「밀치기」 and the cavalry's 「돌파」 into a free tile called an undefined name in the browser) and `betrayer as betrayer14` in mission-rules-v0101.js (M25's camps on a save without the M14 flag); tests/bundle-names.test.mjs now forbids renamed imports.
- Story, dialogue, choices, endings and saves (schema 27) unchanged.

## How it was tested
- The movement and EXP rules touch every battle, so the whole campaign was played from M01 to M30 (30 campaigns, 보통 and 어려움), and the missions that fell were tuned from camps saved before them (tests/chain-from.mjs and a scratch replayer, first try counted).
- Browser: the suites the change touches ran here; the rest run in the PR's CI.

## Results on this build
- **Balance, 보통** (node tests/act2-balance.mjs 30): every mission at or above the 60% gate (Wilson upper bound; the gate's low list is empty). Lowest: M22 19/27, M16 21/29, M21 21/27. ACT I: M03 27/30, M04 26/30, M06 25/30; M01, M02, M05 30/30.
- **Balance, 어려움** (report): M14 15/25, M16 12/20, M17 12/19, M21 9/16, M22 8/15, M24 5/11, M26 5/9 are the lowest; 7–11 campaigns reach ACT IV.
- Full lines and the tuning steps: docs/v2.6.0/evidence/balance-chains.txt.
- **Unit tests on the packaged build:** see docs/v2.6.0/evidence/unit-results.txt.
  - New: tests/terrain-v260.test.mjs (the movement table; the forest stop on M01 for a foot soldier, a rogue and a rider; every map — no rider starts, deploys or arrives in a forest, every rider wave can reach the legion; a rider cannot deploy in M11's forest; fire by the ground on every tile of every map, the wet forest ×0.5, the dry forest ×1.5); tests/xp-scale.test.mjs rewritten for the gap table; tests/bundle-names.test.mjs (no renamed imports).
  - Re-pinned: the old forest-cost tests (act1-v200, rules), Thea's charge in M18 on open ground (awakening), the Sage Notebook level with the enemies (arms), the M28/M30 test heroes held at Lv 40 so they do not level mid-test, the strength and 어려움 tables (playtest-d126, difficulty-hard).
- **Browser suites run here:** docs/v2.6.0/evidence/browser-run-summary.log.
  - **v260 suite** (1440×900, 390×844): Eric's move range reaches the first forest tile and stops there; the readout says 「보병 들어서면 멈춤 · 기병 불가」 and 「에릭: 들어서면 이동 끝」; Lia's fire on the raider in the forest forecasts 「🔥 숲 +50%」; the hit earns EXP; no runtime errors. Screenshots: docs/v2.6.0/screenshots.
- **The other browser suites:** run by CI on the PR.

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox.
- The shield's 「밀치기」 and the cavalry's 「돌파」 were not replayed in the browser; the fix removes the undefined name they called.
