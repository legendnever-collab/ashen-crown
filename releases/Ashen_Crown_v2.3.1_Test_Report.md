# Ashen Crown v2.3.1 「ACT II 큰 맵 (2부)와 작은 마을」 — Test Report
Updated 2026-11-20 KST. **Release candidate on feature/v2.3.1-act2 — not merged before the user plays and approves it.**
- Decisions: D-128 (design), D-130 (v2.3.0 approved; v2.3.1 requested), D-131 (this implementation). Notes: docs/v2.3.1/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.3.1_SHA256SUMS` (`index.html` is identical). Build 152785ad…, 46.5 MiB (budget: warn 80, fail 90).

## What changed
- **ACT II M11–M14 on big maps** (src/data/missions-v231.js):

  | Mission | Size | Layout | Enemies | TURN limit |
  |---|---|---|---|---|
  | M11 | 24×20 | switchback; five braziers; pilgrims +10 HP | 8+9 | 14 |
  | M12 | 24×20 | cloister | 14 guards + the abbot; five on the bell | 16 |
  | M13 | 28×18 | pincer | 18+8 | 12 |
  | M14 | 24×18 | escape south; the hall door widened | 7+9 | 12 |

  - Objectives, rules, story and duels are unchanged.
  - The M11 escorts' "ahead" follows the pilgrim's road route.
  - The war council shows the big-map intel for M07–M14 (v2.3.0's M07–M10 still showed the small-map counts).
- **ACT II villages:**
  - 서리목 opens with M08 and 소금항 with M09. Each has requests, a tavern and shops.
  - Requests 125–130 plus two bounties.
  - The ice-bridge discount takes 10% off at 철관성 성하 마을 and 서리목.
- **군나르** joins from 「눈보라 속 도끼잡이」: infantry; snow costs him 1; he grows like a hero; he has camp lines, a 열전 and epilogue lines.
- **Wolves:** drawn by the game until art pack J part C.
- **Balance:** 어려움 keeps 보통's numbers at M11. M15's enemy strength drops from ×0.95 to ×0.88.
- **Saves:** schema 23 (imports 0–22). M11–M14 battle saves reopen in camp.
- **Art pack J work order:** docs/v2.3.1/art/j-work-pack, 7 images.

## Results on this build (152785ad…, confirmed by a rebuild after the run)
- **Unit tests, before packaging: 553 PASS / 1 FAIL / 16 skipped** (docs/v2.3.1/evidence/unit-results.txt).
  - The one failure is the documentation link check: README links to the v2.3.1 release files, which only packaging creates.
  - **After packaging: 554 PASS / 0 FAIL / 16 skipped.** scripts/verify-release.py passes (manifests, ZIP, byte-identical rebuild, unit tests).
  - New tests:
    - tests/villages-v231.test.mjs: the villages open; 군나르 joins; the discount; the salt cart and the taverns; every new request is won within three tries; the bounties.
    - difficulty-hard: the push for M11.
    - renaissance: start positions on M07–M14 and the request map sizes.
    - mission11–14: updated for the big maps.
- **Browser and balance matrix, 68 suites (with the new v231): every suite's final exit is 0** (docs/v2.3.1/evidence/browser-run-summary.log; 2,370 `PASS` lines).
  - Seven suites failed in the parallel run, each for one of these reasons:
    - stale counts for the new content: act2c-campaign (five braziers, fourteen guards); migration-v080 and migration-v081 (the revisit lists now include the two new villages);
    - a syntax slip in the new v231 suite;
    - click timeouts under parallel load: quality, migration-v040 and migration-v0102.
  - After the fixes, each of the seven passed when rerun alone on the same build.
- **v231 suite (24 checks):** at 1440 and 390, M11–M14 open on 24×20, 24×20, 28×18 and 24×18 with the minimap; 서리목 opens with its board; the blizzard request opens with 군나르 and the wolves. Screenshots are in docs/v2.3.1/screenshots.

## Balance (test player, campaign policy)

**보통, ACT I** (act1-balance, 30 campaigns; the band gate passes):

| | M01 | M02 | M03 | M04 | M05 | M06 |
|---|---:|---:|---:|---:|---:|---:|
| Win rate | 100% | 100% | 77% | 91% | 100% | 95% |

**보통, first try** (act2-balance, 30 seeds; the gate passes, exit 0):

| | M07 | M08 | M09 | M10 | M11 | M12 | M13 | M14 | M15 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 26/30 | 29/29 | 29/29 | 29/29 | 26/29 | 29/29 | 29/29 | 26/29 | 20/29 |

- Every mission M01–M30 passes.
- Tuning on the way, measured by replaying the camps dumped before each mission (ASHEN_DUMP):
  - **M11:** 8/22 with 12 raiders at the start → 17/22 with 8 → 19/22 with the pilgrims at +10 HP.
  - **M14:** 2/15 with 10+14 → 10/15 with 8+10 → 13/15 with 7+9.
  - **M15:** 12/29 at ×0.95 → 15/29 at ×0.90 → 20/29 at ×0.88 (×0.85 gave 26/29).

**어려움, first try** (act2-balance, 30 seeds):

| | M11 | M12 | M13 | M14 | M15 | M16 | M17 | M18 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 19/23 | 23/23 | 23/23 | 10/23 | 16/17 | 14/16 | 13/16 | 11/16 |

- M11 at full push lost 23 of 23 before HARD_SHARE[11]=0.
- **Open:** on 어려움, M19–M21 stay low (3/13, 3/9, 0/8).

## Not done in this version
- **The archived builds stay in the tree:** 11 of 28 ARCHIVE.json versions have a Release, and the archive workflow has not been rerun.
- **Art pack J has not been drawn:** only the work order exists.
- **Not tested here:** native phones, Safari/WebKit and Firefox.
