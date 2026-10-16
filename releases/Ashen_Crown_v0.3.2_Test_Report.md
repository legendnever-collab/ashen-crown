# Ashen Crown v0.3.2 — Gameplay Quality & Rewards
Review candidate; user play approval and main merge pending. Baseline main b826c49851596398967b36d517270a3f556df94c; PR6/7 merged. PR8: https://github.com/legendnever-collab/ashen-crown/pull/8

## Verified build and evidence
Full hosted validation PASS: https://github.com/legendnever-collab/ashen-crown/actions/runs/38767275479
Verified code commit: 2bc9a31228e5dcbfa91a63f25eb295c164b32c5c.
The current standalone is byte-identical to that commit (Git blob6d57199502bf569ad2d5f6da35318cc2f6551a0d); later changes are test timing, CI orchestration and documentation/evidence/package only.
HTML SHA256: f9949e87d2556f1e6b0883e3583aafe571b40548f1087b38b0c57b1b131e9081
The final packaging commit is checked again through PR CI. Exact JSON reports, screenshots and summary live in docs/v0.3.2/evidence and screenshots.

- 108 unit PASS /0 FAIL, including held input, economy/rollback, phase recovery, reward ledger/overflow and migration.
- 680 browser/scenario checks PASS: E2E60, Mobile80, Tactical26, HTTP4, Post-move8, Restart22, Campaign126, Frontier102, actual v0.2 migration16, actual v0.3.1 migration10, Renaissance/Quest137, new Gameplay Quality89.
- 210 legal-policy mission victories:30 M01;30 complete standard campaigns (90 missions);30 economy-loadout campaigns (90 missions). These are separate from browser assertion counts.
- Standard M03 finishes5–8 turns, deadline remains10. All30 campaigns rescue both civilians; all15 deliberately selected capture cases succeed. No shopping required.
- Zero recorded browser runtime errors/external runtime assets. Headless Chromium145.0.7632.6, desktop/DPR2/touch portrait/landscape plus360×640 regression. Four60-frame synthetic samples have median16.7ms and p95≤16.8ms; not a physical-device benchmark.
- Source ZIP clean extraction passes unit tests, rebuilds byte-identical HTML, and matches all current source/docs/evidence entries. Text/JSON SHA256 manifests checked.

## Delivered behavior
Continuous keyboard and D-pad input with180ms initial delay/100ms interval, keyup/pointerup/cancel/blur/modal stops. Exact doorway confirmation, cancel without a loop, fresh input/Interaction retry, original shop exit/return coordinates.
Owner buy/sell/forge-upgrade choices; weapon-first explicit compatible hero choice and actual stat delta; atomic nonce buy/equip; replaced gear retained; equipped sale protected; complete failed-save rollback including write-then-throw recovery. Pointer compatibility clicks cannot duplicate a direction or activate a new popup.
Own-phase terrain HP/MP recovery, floor/min1/clamp, saved marker, separate green/blue HP/MP numbers, healing aura/log and touch/hover ratios. Enemies recover too, prioritize attacks and only choose local useful recovery when wounded. M02 captain still escapes.
Existing first-clear Gold stays100/120/140. Added supplies, optional capture30 Gold and full-rescue Focus Charm; result screen shows rewards/optional outcome/growth/Potential/relationships. Stable IDs, atomic asset claims, capacity overflow delivery and practice/replay protection.

## Economy and compatibility
Starting Gold180; maximum cumulative570 across three missions with capture bonus. Equipment65–85 and upgrade40 unchanged. Focus Charm adds only RES+1; sale18<buy45. Medium Potion/Ether/Ward supply value totals175 across a full three-mission clear; existing capacities6 tools/24 gear retained, overflow deferred without loss. M01's two civilian rescues are already required for victory, so its Ward supplement is effectively guaranteed on a legal clear.
Schema0–4→5 preserves raw growth, equipment, Gold, story flags, bonds and departure checkpoints. Actual shipped v0.3.1 generates purchased/equipped interior and battle saves, restored via visible text UI; position, inventory, RNG and Stage Restart verified. Progressed actual v0.2 and v0.1.x saves also covered. Legacy completed missions receive only new supplements once; old Gold is not repeated.

## Corrections found during validation
Restored missing consumable sale controls. Suppressed touch compatibility clicks after pointer movement. Tactical tap tests wait for camera settling; navigation observes actual position rather than assuming all touch gestures are shorter than hold threshold. Campaign withdrawal policy uses terrain path distance to avoid the previous Manhattan-only bridge dead end. No victory criteria, turn deadline or raw hero growth was relaxed.

## Limits and next version
Physical phones, Safari/Firefox and long-term storage eviction remain unverified. Small landscape preparation panels require scrolling to lower controls. Offline backup restores its complete timeline; no cross-backup global/server deduplication exists. No M04–06, new hero, crafting system or playable promotion. Story/4-act30-mission canon unchanged. v0.4 The Broken Allegiance design is ready in existing story documents; development excluded here.
