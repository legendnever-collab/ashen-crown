# Ashen Crown v2.5.0 「ACT IV 큰 맵 (1부)」 — Test Report
Updated 2026-11-21 KST. **Release candidate** on feature/v2.5.0 (not merged; the user plays and approves it first).
- Decisions: D-141 (the v2.5 design, approved with the recommended answers, and this implementation), D-142 (the earlier builds). Notes: docs/v2.5.0/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.5.0_SHA256SUMS` (`index.html` is identical).

## What changed
- **ACT IV M23–M26 on big maps** (src/data/missions-v250.js, maps from scripts/make-act4-maps.py):

  | Mission | Size | Layout | Enemies |
  |---|---|---|---|
  | M23 | 26×20 | alliance camp inside a palisade with four gates; the three council tents in the middle; north forest, marsh causeways east and west, the river bridge in the south | 5+14 → 8+16 |
  | M24 | 20×24 | the pass (10 rows) under the ash when the tide starts; the refugees walk down the slope to the gate (9–10, 18); the village inside | 3+9 → 6+12 |
  | M25 | 30×20 | the hardliners' north camp; the west and east camps behind fences; the legion at the south crossroads | 7+6 → 11+8 |
  | M26 | 22×24 | the Lion's Pass: the lion camp at the top (no fort tile), the wagon road up the west, the rock path up the east | 7+4 → 10+6 |

  - Objectives, rules, story, allied orders, duels, persuasion and awakenings are unchanged. Troops are copies of each mission's own units; tents, the winch and the gate, allies and refugees are moved by id.
  - M24: m.ashBase (10) rows are under the ash when the tide starts, then a row a turn as before (mission-rules-v0100). The briefing's first sentence says so.
  - M25/M26: m.captainBox keeps the hardliner captain and Baldrick in the camp until their turn (mission-rules-v0101 inBox101).
  - Enemy counts are at the design's cap; see Balance.
- **어려움:** M19, M21 and M23 at 보통's numbers; M24 and M26 half push.
- **Saves:** schema 26 (imports 0–25). M23–M26 battle, result and deployment saves reopen in the camp before the mission.
- **Size:** the build is 49.3 MiB (warn at 80 MiB).
- **Repository (D-142):** the GitHub Releases of v2.2.1, v2.3.0 and v2.3.1 hold every file at its recorded size, so their HTML and source ZIP left the tree; v2.4.0 and v2.4.1 joined releases/ARCHIVE.json and .gitignore.

## Results on this build
- **Unit tests on the packaged build: 562 PASS / 0 FAIL / 16 skipped** (docs/v2.5.0/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - Updated: mission23–26 (the big maps, the ash base, the captain boxes), awaken-v0100 (Ines's and Thea's awakenings on the big M23), renaissance (sizes and start tiles M07–M26), difficulty-hard (the new table), size-budget (31 archived versions), schema and version strings.
- **Browser and balance matrix, 71 suites: every suite's final exit is 0** (docs/v2.5.0/evidence/browser-run-summary.log; 2,442 `PASS` lines).
  - Five failed in the parallel run and passed when rerun alone on the same build:
    - **act4a:** the M24 winch was expected at (11, 9) and the desktop view did not scroll to it; fixed in the test (the winch is at (12, 19), and the tile helper resets the camera on desktop as in act3c). 30 checks.
    - **v200, v210:** the version check was pinned to '2.4.1'; it now reads VERSION.
    - **act4d:** a page read timed out while the other half was running (38 checks alone).
    - **quality:** a keyboard walk at 844×390 under load (98 checks alone).
  - The matrix ran before 어려움 M21 moved from half to 보통's numbers; the unit tests and the 어려움 chain below ran after it.
- **v250 suite (22 checks):** at 1440 and 390, M23–M26 open from a battle save on 26×20, 20×24, 30×20 and 22×24 with the minimap and every unit inside; a v2.4.1 (schema 25) save made during an M24 battle reopens in its camp. Screenshots: docs/v2.5.0/screenshots.

## Balance (test player, campaign policy)

**보통, first try** (act2-balance, 30 campaigns; the gate passes, exit 0 — every mission M01–M30):

| | M19 | M20 | M21 | M22 | M23 | M24 | M25 | M26 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 19/24 | 14/22 | 15/20 | 15/19 | 12/18 | 17/18 | 17/17 | 16/17 |

- Replaying the camps dumped before each mission (test-output/tune.mjs, three tries each):

  | | M23 | M24 | M25 | M26 |
  |---|---:|---:|---:|---:|
  | Big map, the original counts | 53/54 | 51/54 | 51/51 | 51/51 |
  | Big map, the cap (shipped) | 45/54 | 49/54 | 51/51 | 50/51 |

  - M24: three more beasts placed in the side woods beside the refugees lost 7/54 at TURN 3 (three refugees down); they start on the pass instead.
  - M25 ends when Thea reaches the hardliner captain (their duel, always won, D-122), mostly by TURN 3; M26 ends by the persuasion or the duel. More enemies barely change them.
  - M26: a fort tile at the lion camp healed Baldrick above half HP (mission26 test); the camp has tents instead.

**어려움** (replaying the 보통 camps on 어려움; M21 with the 어려움 camps too):

| | M19 | M21 | M23 | M24 | M26 |
|---|---:|---:|---:|---:|---:|
| Full push | — | 26/66 | 3/36 | 14/36 | 16/34 |
| Half | 16/30 | 31/66 | — | 25/36 (set) | 28/34 (set) |
| 보통's numbers | 22/30 (set) | 42/66 (set) | 19/36 (set) | — | — |

- Unchanged: M20 14/28 and M22 14/24 (already at 보통's numbers), M25 34/34.

**어려움, first try** (act2-balance with ASHEN_DIFFICULTY=hard, 30 campaigns):

| | M19 | M20 | M21 | M22 | M23 | M24 | M25 | M26 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| v2.4.1 | 4/12 | 4/9 | 2/5 | 2/3 | 0/3 | | | |
| v2.5.0 | 11/15 | 9/13 | 7/10 | 1/9 | 5/6 | 5/6 | 5/5 | 2/5 |

- **Open:** 어려움 M22 (1/9) and M26 (2/5); few campaigns reach them. To be tuned with the play-test.
- Evidence: docs/v2.5.0/evidence/balance-chains.txt.

## Not done in this version
- ACT IV M27–M30, the villages 봉화둔덕 · 사자샘, 루카 and art pack L are v2.5.1 (D-141).
- **Not tested here:** native phones, Safari/WebKit and Firefox.
