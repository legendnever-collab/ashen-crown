# Ashen Crown v2.4.0 「ACT III 큰 맵 (1부)」 — Test Report
Updated 2026-11-21 KST. **Release candidate — not merged before the user plays and approves it.**
- Decisions: D-134 (the released builds leave the tree), D-135 (the v2.4 design approved with the recommended answers; this implementation). Notes: docs/v2.4.0/RELEASE_NOTES.md; design docs/v2.4.0/ACT3_MAPS_DESIGN.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.4.0_SHA256SUMS` (`index.html` is identical).

## What changed
- **ACT III M15–M18 on big maps** (src/data/missions-v240.js, maps from scripts/make-act3-maps.py):

  | Mission | Size | Layout | Enemies | TURN limit |
  |---|---|---|---|---|
  | M15 | 28×20 | chase over the canal; gates NW, W, E | 16+6 | 14 |
  | M16 | 30×18 | west → east through the fog; four ward stones | 17+8 | 16 |
  | M17 | 26×22 | keep defence from the south gate and two breaches; six statues | 11+9 | 10 |
  | M18 | 26×22 | the ward in the middle, loggers from four edges; eight keepers | 6+9 | 12 |

  - Objectives, rules, story, duels and awakenings are unchanged. The troops are copies of each mission's own units.
  - The "all" hidden objectives and rewards follow the new counts. The fourth ward stone has no echo scene (no new dialogue).
  - The war council's terrain and intel follow the big maps; the plan line (with Aren's command) stays.
- **Strength:** M15 ×0.94 (was ×0.88), M18 ×0.92; 어려움 uses 보통's numbers at M16 as at M15/M17/M18.
- **Saves:** schema 24 (imports 0–23). M15–M18 battle saves reopen in camp.
- **Repository (D-134):** the builds of the 28 versions released on GitHub (56 files, 1.8 GiB) left the tree; their test reports and checksums stay. .gitignore lists every ARCHIVE.json build. v2.2.1–v2.3.1 joined ARCHIVE.json. scripts/archive-releases.mjs leaves complete releases alone. A removed build was fetched back from its Release with the recorded SHA256 (v0.1.0).

## Results on this build
- **Unit tests on the packaged build: 556 PASS / 0 FAIL / 16 skipped** (docs/v2.4.0/evidence/unit-results.txt). The 16 skipped are the tests pinned on the pre-v2.0 maps (D-115).
  - New or changed: mission15–18 tests on the big maps (sizes, gates, stones, statues, archive, ward, keepers), start positions M07–M18 (renaissance), the 어려움 push (difficulty-hard), strengths (playtest-d126), the tree check for released builds (size-budget), the blockade test on M17's new map (awakening).
- **Browser and balance matrix, 69 suites: every suite's final exit is 0** (docs/v2.4.0/evidence/browser-run-summary.log; 2,394 `PASS` lines).
  - Three failed in the parallel run and passed when rerun alone on the same build:
    - **v200:** its version check still read 2.3.1 (v210 had the same line; both fixed).
    - **act3b:** stale counts (four statues, six keepers), then a click on an M18 keeper's tile that was off screen at 1440; the suite now brings such a tile into view (48 checks).
    - **migration-v040:** a click timeout under load (12 checks).
- **v240 suite (22 checks):** at 1440 and 390, M15–M18 open on 28×20, 30×18, 26×22 and 26×22 with the minimap and every unit inside; a v2.3.1 (schema 23) save made during an M17 battle reopens in the keep's camp. Screenshots: docs/v2.4.0/screenshots.

## Balance (test player, campaign policy)

**보통, ACT I** (act1-balance, 30 campaigns; unchanged): M01 100%, M02 100%, M03 77%, M04 91%, M05 100%, M06 95%.

**보통, first try** (act2-balance, 20 seeds; the gate passes, exit 0 — every mission M01–M30):

| | M15 | M16 | M17 | M18 | M19 | M20 | M21 | M22 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 18/19 | 16/19 | 15/18 | 14/18 | 13/15 | 15/15 | 10/15 | 13/15 |

- Tuning on the way, replaying the camps dumped before each mission (ASHEN_DUMP=15,16,17,18; test-output/tune.mjs):
  - **M15:** ×0.88 38/38 → ×1.0 26/38 → ×0.94 33/38.
  - **M16:** ×1.0 34/38 (kept); ×1.05 22/38.
  - **M17:** 14+12 5/19 → 11+9 28/38.
  - **M18:** 12+14 0/7 (two trees down by TURN 5 every time) → 6+9 12/21 → 6+9 ×0.92 16/21.

**어려움, first try** (act2-balance with ASHEN_DIFFICULTY=hard, 20 seeds):

| | M14 | M15 | M16 | M17 | M18 | M19 | M20 | M21 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 8/17 | 9/14 | 8/13 | 9/12 | 7/12 | 5/12 | 5/9 | 1/8 |

- M16 at full push first-tried 1 of 13 before HARD_SHARE[16]=0.
- **Open:** 어려움 M19–M22 (M21 lowest) are tuned in v2.4.1 with their big maps.

## Not done in this version
- **Three builds stay in the tree:** v2.2.1, v2.3.0 and v2.3.1 joined ARCHIVE.json; after the merge the user reruns Actions → Archive old builds, and the next version removes them.
- **Not tested here:** native phones, Safari/WebKit and Firefox.
