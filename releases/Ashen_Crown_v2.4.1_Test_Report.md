# Ashen Crown v2.4.1 「ACT III 큰 맵 (2부)와 왕도 둘레의 작은 마을」 — Test Report
Updated 2026-11-21 KST. **Release candidate — not merged before the user plays and approves it.**
- Decisions: D-135 (the v2.4 design), D-137 (this implementation), D-138 (v2.4.0 merged). Notes: docs/v2.4.1/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.4.1_SHA256SUMS` (`index.html` is identical).

## What changed
- **ACT III M19–M22 on big maps** (src/data/missions-v241.js, maps from scripts/make-act3-maps.py):

  | Mission | Size | Layout | Enemies |
  |---|---|---|---|
  | M19 | 28×20 | rite vault; the legion starts in the central gallery; four circles in four chambers | 10+4 |
  | M20 | 28×22 | archive north of the canal, lower city south; four cabinets (three clerks), eight residents | 10+6, ×0.82 |
  | M21 | 24×24 | palace; the king at the centre; anchors where the wings meet the hall | 12+7, ×0.97 |
  | M22 | 28×22 | square; three daises in the middle | 6+12 |

  - Objectives, rules, story, duels and awakenings are unchanged. Troops are copies of each mission's own units.
  - m.captainBox keeps each captain inside a box until his turn; m.arriveCols places M22's arrivals.
  - The "all" hidden objectives and rewards follow M20's new counts.
- **ACT III villages:** 등불골 opens with M16 and 이끼다리 with M18 (requests, tavern, shops). Requests 131–136 with two bounties; the 이끼다리 bridge discount at 왕도 하층가, 이끼다리 and 등불골 (discounts are read from the request data); the 등불골 tavern's wanderers (세라, 오린, 셀린).
- **마렌** joins from 「잿빛 안개 속 약초꾼」: rogue; swamp costs her 1; she grows like a hero; camp lines, 열전 and epilogue lines. Borrowed art (Elina's bust; the 돌우물 and 갈대 나루 paintings) until art pack K.
- **Art pack K work order:** docs/v2.4.1/art/k-work-pack (5 images), made by scripts/make-v241-k-art-pack.py.
- **어려움:** M19 half push, M20 and M22 at 보통's numbers.
- **Saves:** schema 25 (imports 0–24). M19–M22 battle saves reopen in camp.
- **Font:** two syllables added to the embedded font (scripts/font-subset.py).

## Results on this build
- **Unit tests before packaging: 561 PASS / 0 FAIL / 16 skipped.** See docs/v2.4.1/evidence/unit-results.txt for the packaged build.
  - New: tests/villages-v241.test.mjs (villages open, 마렌 joins, the discount, the lamp oil and the tavern, every new request won within three tries, the bounties).
  - Updated: mission19–22 for the big maps; start positions on M07–M22 and the request map sizes (renaissance); the 어려움 push (difficulty-hard); strengths (playtest-d126); names, stats8 and hubs for 마렌 and the villages.
- **Browser and balance matrix, 70 suites: every suite's final exit is 0** (docs/v2.4.1/evidence/browser-run-summary.log; 2,420 `PASS` lines).
  - Three failed in the parallel run and passed when rerun alone on the same build:
    - **act3c:** stale counts (three cabinets, six residents) and Kai's Shadow Dance placed in a wall on the new M20. After those fixes, one solo rerun timed out reading the page while the other half of the matrix was still running. The final rerun on an idle machine passed 50 checks.
    - **act3d:** the king was expected at x 8 on the old M21 (44 checks).
    - **migration-v0102:** a click timeout under load (13 checks).
- **v241 suite (26 checks):** at 1440 and 390, M19–M22 open on 28×20, 28×22, 24×24 and 28×22 with the minimap and every unit inside; 등불골 and 이끼다리 open; the herbalist request opens with 마렌 and the loggers. Screenshots: docs/v2.4.1/screenshots.

## Balance (test player, campaign policy)

**보통, first try** (act2-balance, 20 seeds; the gate passes, exit 0 — every mission M01–M30):

| | M19 | M20 | M21 | M22 | M23 | M24 | M25 | M26 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 12/15 | 10/14 | 10/13 | 11/12 | 10/12 | 12/12 | 12/12 | 11/12 |

- Tuning on the way (replaying the camps dumped before each mission, test-output/tune.mjs):
  - **M19:** 16+8 0/15 (two captives forgot by TURN 5) → circles nearer, start in the gallery: still 0/15 → 12+5 7/30 → 10+4 22/30.
  - **M20:** 16+10 0/14 (four lit at once) → three clerks, old counts, residents by the bridges: 0/14 → ×0.9 6/14 → ×0.85 16/28 → ×0.82 21/28.
  - **M21:** anchors at the far corners 0/13 (the king fell) → anchors at the wing mouths, 9+6 12/13; 14+10 6/26; 12+8 17/26; 12+7 ×0.95 22/26 (set to ×0.97).
  - **M22:** 12+16 0/12 (two heralds down by TURN 3) → daises in the middle: 6+11 11/12, 12+16 4/12, 7+12 15/24, 6+12 20/24.

**어려움, first try** (act2-balance with ASHEN_DIFFICULTY=hard, 20 seeds): see the table below once the run ends.

## Not done in this version
- **Art pack K** is a work order only; the game borrows art until it returns.
- **Three builds stay in the tree:** v2.2.1, v2.3.0 and v2.3.1 (ARCHIVE.json); after the user reruns Actions → Archive old builds, the next version removes them.
- **Not tested here:** native phones, Safari/WebKit and Firefox.
