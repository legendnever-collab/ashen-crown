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
- **Unit tests:** BROWSER_UNIT_RESULTS
- **Browser suites run here:** BROWSER_SUITE_RESULTS

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox; full screen was checked only where headless Chromium allows it (the button and its label).
- The music was checked by its engine values (intensity, voices), not by listening.
