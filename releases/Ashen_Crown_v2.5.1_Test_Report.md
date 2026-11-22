# Ashen Crown v2.5.1 「ACT IV 큰 맵 (2부)와 마지막 작은 마을」 — Test Report
Updated 2026-11-22 KST. **Release candidate** on feature/v2.5.1 (not merged; the user plays and approves it first).
- Decisions: D-141 (the v2.5 design), D-144 (the rescued heroes fight), D-145 (this implementation). Notes: docs/v2.5.1/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.5.1_SHA256SUMS` (`index.html` is identical).

## What changed
- **ACT IV M27–M30 on big maps** (src/data/missions-v251.js, maps from scripts/make-act4-maps.py). All 30 missions are now on big maps.

  | Mission | Size | Layout | Enemies |
  |---|---|---|---|
  | M27 | 32×22 | the straight ram road up the west to the gate (8–9, 5); the east field under three ladders; a ridge between | 9+11 → 13+15 |
  | M28 | 26×22 | the great hall (the legion and young Aren); the fragments in the west, east and north wings | 10+4 → 13+6 |
  | M29 | 26×24 | Bellard's dais in the middle, the rite points on the ring (by the M22 path), four doors | 10+6 → 13+8 |
  | M30 | 30×18 | the ward heart in the south middle, five breaches in the broken wall | 6+14 → 9+20 |

  - Objectives, rules, story, allies, the duel, Aren's last words and the endings are unchanged.
  - Rule data from the mission: M27 m.wallTopY, m.sectionNames; M28 the waves roam by id number; M29 m.captainBox.
- **봉화둔덕 (M24) and 사자샘 (M26):** requests 137–142 with two bounties; 「도망친 군마」 is won by bringing three grooms back (구출; the new goal type rescue); 「샘터 우물 보수」 takes 10% off at 사자샘, 봉화둔덕 and 왕도 하층가; the 사자샘 tavern takes in 실바, 셀린 or 오린.
- **루카** joins from 「재 속의 약사」: healer; 「등불 손길」 clears one status when he heals (poison first); camp lines, 열전 and epilogue lines; borrowed art until art pack L.
- **Fix (D-144):** 아델 (since v2.1.0), 군나르 (v2.3.1) and 마렌 (v2.4.1) never appeared in battle — their records carried the battle flag "rescued" (led off the field), so the renderer and the rules left them out. The records now say rescuedHero; older saves are mended when loaded.
- **Art pack L:** work order docs/v2.5.1/art/l-work-pack (scripts/make-v251-l-art-pack.py; 루카 × 3, the two villages).
- **어려움:** M27 and M30 half push.
- **Size:** the build is 49.3 MiB (warn at 80 MiB).
- **Saves:** schema 27 (imports 0–26). M27–M30 battle, result and deployment saves reopen in the camp before the mission.
- **Repository:** the Releases of v2.4.0 and v2.4.1 hold every file at its recorded size; their HTML and source ZIP left the tree. v2.5.0 joined releases/ARCHIVE.json.

## How it was tested (the user's request, 2026-11-21 19:02: test the new maps, not everything from M01 each time)
- The new missions were tuned from the camps saved before M27 (tests/chain-from.mjs plays M27–M30 from them).
- The full campaign chain (act2-balance) ran once for 보통 and once for 어려움.
- In the browser, the suites the change touches ran here; the other suites run in the PR's CI.

## Results on this build
- **Unit tests on the packaged build: 569 PASS / 0 FAIL / 16 skipped** (docs/v2.5.1/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - New: tests/villages-v251.test.mjs (villages open, 루카 joins, 「등불 손길」, the discount, the winter potions and the tavern, every new request won within three tries, the grooms brought back, the rescued heroes on the field and an older save mended).
  - Updated: mission27–30 (the big maps; M30's test heroes hold by armour — on the big map a level-up mid-phase resets max HP), renaissance (sizes and start tiles M07–M30, the request map sizes), difficulty-hard, stats8 and names (루카), hubs, size-budget (33 archived versions), schema and version strings.
- **Browser suites run here (12): every final exit is 0** (docs/v2.5.1/evidence/browser-run-summary.log): act4a, act4b, act4c, act4d, v251, hub-doors, migration-v0100, migration-v0101, migration-v0102, v250, world, v210.
  - Three failed first and passed after test fixes on the same build: act4c (the M27 ram expected at row 4 and Lia beside the old oath fragment; now row 6 and the west wing, and the tile helper resets the camera on desktop), v250 and v251 (the schema check pinned to a number; it now reads SCHEMA).
  - **v251 suite (28 checks):** at 1440 and 390, M27–M30 open on 32×22, 26×22, 26×24 and 30×18 with the minimap and every unit inside; a v2.5.0 save of an M28 battle reopens in its camp; 봉화둔덕 and 사자샘 open; 「재 속의 약사」 opens with 루카 and the ash beasts. Screenshots: docs/v2.5.1/screenshots.
- **The other browser suites:** run by CI on the PR (see the PR's checks).

## Balance (test player, campaign policy)

**보통**
- Replaying the 17 camps saved before M27, three tries each (tests/chain-from.mjs):

  | | M27 | M28 | M29 | M30 |
  |---|---:|---:|---:|---:|
  | Big map, the original counts | 51/51 | 50/51 | 51/51 | 51/51 |
  | Big map, the cap (shipped) | 51/51 | 45/51 | 49/51 | 51/51 |

- **The full chain (act2-balance, 30 campaigns, once): the gate passes, exit 0 — every mission M01–M30.** M27–M30 17/17 each. M01–M26 first-try rates are identical to v2.5.0's run (same seeds).
- **Open:** M27 and M30 are won every time even at the design's cap; to be decided with the play-test.

**어려움**

| | M27 | M28 | M29 | M30 |
|---|---:|---:|---:|---:|
| Full push (replayed) | 29/51 | 41/45 | 39/44 | 14/42 |
| Shipped (replayed; M27, M30 half) | 35/51 | 44/48 | 38/48 | 33/47 |
| Full chain (30 campaigns, once) | 5/5 | 5/5 | 4/5 | 5/5 |

- **Open:** 어려움 M22 (1/9) and M26 (2/5) in the chain, unchanged from v2.5.0; few campaigns reach them.
- Evidence: docs/v2.5.1/evidence/balance-chains.txt.

## Not done in this version
- Art pack L is a work order; until it returns 루카 borrows Sain's bust, 봉화둔덕 the border garrison painting and 사자샘 the 서리목 painting.
- **Not tested here:** native phones, Safari/WebKit and Firefox.
