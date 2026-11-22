# Ashen Crown v2.6.1 「한 칸에 한 사람」 — Test Report
Updated 2026-11-23 KST. **Release candidate** on feature/v2.6.1 (not merged), built on v2.6.0 (merged, D-154); the user plays and approves it first.
- Decision: D-155 (the user's ten requests of 2026-11-22 22:33). Notes: docs/v2.6.1/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.6.1_SHA256SUMS` (`index.html` is identical).

## What changed
- **Figures one tile tall:** each painted figure's head-to-foot alpha box is measured once and drawn 54 px tall in a 64 px tile, feet on the tile's lower edge (allies, enemies, allied troops, townsfolk). The duel window does the same (320 px; a per-duelist factor for anyone the story calls huge — none yet).
- **Music:** instruments panned, alternate passes with a harmony voice and the bass fifth, a resting pass in towns, slight human timing; battle music follows an intensity of 0–1 (foes within 3, the most wounded hero, the turn limit, the enemy phase).
- **EXP text:** the amount only (the level gap still scales it).
- **Fire:** a fire spell leaves flames only in a forest — always, unless at the water's edge or in rain — for two turns; a unit on it takes 20% of the igniting hit at its side's turn start, never below 1 HP.
- **Camera:** a press or drag on the minimap moves the view there; a drag on the field pans; full-screen button in the top bar.
- **Choices:** all options of every story choice and of the town person's menu drawn alike.
- **Town rumours:** the first walk into six towns with a hero to rescue or notable wanderers brings a line from one of the five; once per town, not once the hero has joined.
- **Sortie 6–8 by map area** (≤450 tiles 6, ≤560 7, else 8; never fewer than before). 어려움 M26 without the level push.
- Story, dialogue, choices, endings and saves (schema 27) unchanged; the rumours are new lines.

## How it was tested
- The sortie and fire rules touch every battle, so the whole campaign was played from M01 to M30 (30 campaigns, 보통 and 어려움); 어려움 M26 was tuned from the 24 camps saved before it (first try counted).
- Browser: the suites the change touches ran here; the rest run in the PR's CI.

## Results on this build
- **Balance, 보통** (node tests/act2-balance.mjs 30): every mission at or above the 60% gate (the gate's low list is empty). Lowest: M15 21/29, M26 18/24, M23 19/24, M21 21/26. ACT I: M03 27/30, M04 26/30, M06 27/30; M01, M02, M05 30/30.
- **Balance, 어려움** (report): M26 1/12 with the half push → none (14/24 from saved camps; 5/24 with the half push). Lowest otherwise: M23 8/17, M24 8/14, M14 18/29, M22 14/19.
- Full lines: docs/v2.6.1/evidence/balance-chains.txt.
- **Unit tests on the packaged build: 584 PASS / 0 FAIL / 16 skipped** (docs/v2.6.1/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - New: tests/v261.test.mjs (the sortie 6–8 by map size and never fewer than before; the EXP text; the town rumours once, not after the hero joined, silent elsewhere; the music intensity clamp; every story choice and the person menu drawn alike); the fire test in tests/act1-v200.test.mjs (no flames on grass; always in a forest; 20% of the hit; never below 1 HP).
  - Re-pinned: the sortie limits (act2-engine, migration-v060/v090/v092/v0100), the awakening board (the eighth hero parks beside M17's statues), the 어려움 table (difficulty-hard); tests that travel to a town and act there drain the new rumour first (arms, migration-v080, tavern-v210, villages-v231/v241/v251 and the v231/v241/v251 browser suites); rules.js's spell fire renamed lightSpellFire (bundle-names found it clashing with M20's lightFire).
- **Browser suites run here (24): every final exit is 0** (docs/v2.6.1/evidence/browser-run-summary.log): v261 15, e2e 85, v252 42, act1 113, tactics 26, mobile 90, class 30, quality 98, frontier 90, journey 176, world 32, v210 46, v231 26, v241 26, v251 28, audio-mute 20, v260 13, act3 36, act3b 48, act3c 50, act3d 44, act4a 30, act2-campaign 24, v200 18 checks; balance (M01 30/30) regenerated the winning trace e2e replays.
  - v210 first failed: its sortie-board check expected M02's old five out of six; with M02's six the board now holds seven (Bram and Noa hired) and sends six, and it passed. act3b/act3d/act4b now expect eight in M17/M21/M25 (act4b was found by CI on the PR, then the ACT IV group ran here too).
  - **v261 suite** (1440×900, 390×844): a press on the minimap's north-east corner moves the camera there; a 400 px left-button drag pans the view; the full-screen button is in the top bar (and turns into 「창 모드」 where headless Chromium allows full screen); the tavern keeper's menu draws 대화 and 인재 확보 alike; no runtime errors. Screenshots: docs/v2.6.1/screenshots (M27's mixed line-up, a line of heroes, the duel sizes, the keeper's menu).
- **The other browser suites:** run by CI on the PR.

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox; full screen was checked only where headless Chromium allows it (the button and its label).
- The music was checked by its engine values (intensity, voices), not by listening.
