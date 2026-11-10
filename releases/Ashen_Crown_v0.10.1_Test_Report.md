# Ashen Crown v0.10.1 「검은 사자」 — Test Report
Updated 2026-11-10 KST. **Release candidate on feature/v0.10.1-banners; not merged before the user plays and approves it.** Decision: D-102 (implementation details, PROPOSED) within D-099 (docs/v0.10.0/ACT4_DESIGN.md), built on main dd81b3e (v0.10.0), with ACT IV art pack G1 imported (D-103).

HTML SHA256 of the build under review: `313df1ba2fe2bb92f7cb42a7499a8f3892bcbc06ac21d9a5eaff7bb5c8688e6a` (49,185,404 bytes; `index.html` identical; also in `releases/Ashen_Crown_v0.10.1_SHA256SUMS`). This build adds the play-test minor feedback (D-104: the unit menu's one-line title; the move confirmation as 이동 확정 / 취소 only) to the build `18fe2bb71fc50998b4a6e588a9d7bba913923ed4d8a28af58277d74244c6982c` (49,185,008 bytes) on which the full 60-suite matrix ran. D-104 changes only src/ui/action-menu.js and src/ui/style.css; on the new build the unit tests and the 11 browser suites that open the unit menu or confirm a move were rerun (see below).

## Summary
- **474 unit tests PASS / 0 FAIL** on the build under review (472 on the matrix build; +2 in tests/unit-menu.test.mjs) (docs/v0.10.1/evidence/unit-results.txt). New: tests/mission25.test.mjs (4), tests/mission26.test.mjs (5), tests/migration-v0100.test.mjs, and the art pack G1 checks in tests/item-art.test.mjs and tests/portraits.test.mjs. Updated expectations: schema 17, version 0.10.1, nine heroes, 31 tracks, 36 tactics skills, 73 gear and 24 treasures.
- **Full browser and balance matrix, 60 suites, all passed on the first run** (docs/v0.10.1/evidence/browser-run-summary.log): 2,086 `PASS` lines (2,010 on v0.10.0). No runtime errors.
- Balances: ACT I 30/30; ACT II M07–M14 30/30 each; ACT III M15–M22 30/30 each; ACT IV M23 30/30, M24 30/30, **M25 30/30, M26 30/30** (gate ≥ 90% of the previous mission passed).

## Rerun after D-104 (on the build under review)
- Unit tests: see docs/v0.10.1/evidence/unit-results.txt (adds tests/unit-menu.test.mjs: two buttons, no coordinates; the title rule).
- Browser suites, all exit 0 (docs/v0.10.1/evidence/rerun-d104-*.log; `PASS` lines): mobile-command 25, mobile 80, post-move 1, tactical 28, restart 23, e2e 60, http 1, campaign 121, renaissance 142, legion 20, migration-v02 17.
- Screenshots at 412 px (docs/v0.10.1/screenshots/d104): the unit menu with its one-line title; the move confirmation with only 이동 확정 / 취소. The title stays one line (18 px tall at 15 px type) and also with the menu zoomed 135%.

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act4b-e2e (new):** a real v0.10.0 Ashen Village save (after M24) offers Mission 25 → the 「세 깃발의 땅」 world card and the alliance camp → M25 (the M14 betrayer's hardliners in the north camp; one camp allied and orderable, one neutral and not) → the objective panel names the camps and counts the leaders → after the win, forgive or lower the betrayed banner; the choice is kept and Mission 26 follows → M26 TURN 2 duel (strike, guard, finisher, refuse) decided → 설득 beside Baldrick → resolve 4: Baldrick yields and joins (ninth hero, Lv 19, tier 3) → the camp below the lion's pass with Baldrick in it → Baldrick's ①–④ → Dario awakened shows ④ 백 번의 반격; no page errors. 1440 and 390 | 32 | PASS |
| **migration-v0100 (new):** shipped v0.10.0 HTML saves (village, battle checkpoint) and v0.10.0-source fixtures (the Ashen Village after M24, a mid-M24 battle) → schema 17 with every asset kept and the roster intact; the camp goes on to Mission 25; the M24 battle resumes at the border; restart works; Erik keeps ② ③ and shows ④; no runtime errors | 13 | PASS |
| act4a-e2e: after M24 the way goes on to Mission 25; the M23 council tents now draw the painted G1 tents | 30 | PASS |
| item-art, portraits, rooms (browser): Ines's and Thea's tier 3 busts and sheets, icon sheet L and the four tents from pack G1 load | as before | PASS |
| migration-v02…v093 browser suites: schema 17 after import | as before | PASS |

Screenshots: docs/v0.10.1/screenshots/act4b (M25 field, the banner choice, the world card, the M26 duel and yield, the lion's-pass camp, Baldrick's skills; 1440 and 390).

## Balance (legal player policy, rules API only, no state edits)
| Mission | Result |
|---|---|
| ACT I M01–M06 | 30/30 full clears |
| ACT II M07–M14 | 30/30 each |
| ACT III M15–M22 | 30/30 each |
| M23 전쟁의 끝을 향해 | 30/30 wins in 5–6 turns; no tent taken in 30; all three leaders standing in 2 |
| M24 최후의 국경 | 30/30 wins; the gate shut on TURN 8–9 with six inside in all 30; refugees down 0–2 |
| **M25 세 왕가의 깃발** | **30/30 wins** in 5 turns (25) or 6 (5), all by the hardline captain's fall; no leader fell in 30. The camps by trust: both other banners allied in 5, one neutral in 16, both neutral in 9. Hidden objective 「세 왕가의 인장」 (both leaders at half HP or more, won by TURN 8) 30/30 |
| **M26 검은 사자의 마지막 전투** | **30/30 wins** in 3 turns (6), 4 (23) or 5 (1); Erik never fell. The duel: Erik won 19, Baldrick 11. Baldrick withdrew in 24 and yielded in 6 — all 6 as 「협력」, because no policy campaign halted his army at M13 (the ACT II balance halts him in 0 of 30), so 「합류」 is covered by tests/mission26.test.mjs and act4b-e2e only. Hidden objective 「검은 갈기」 6/30 |

- Policy additions (tests/campaign-policy.mjs): M25 meets hardliners within 4 tiles of a leader first, then the hardline captain from TURN 3, then the rest of the north camp; M26 goes for Baldrick first, then his riders, persuading whenever 설득 is a legal action. Both policies (campaign and skirmish) use ④ 백 번의 반격 when three or more foes are within 5 tiles.
- Trials (balance run, forced at each campaign's levels): Dario's 117 won 60 of 60 (백 번의 반격 used in 30); Ines's 115 54 of 60 (the six losses at Lv 10, below the Lv 14 requirement); Thea's 116 40 of 40.
- Reading: under the policy M25's hidden objective is always met and Baldrick is more often broken than persuaded. How a human weighs talking against fighting at M26, and whether the M25 seal is too easy, is for the play-test.

## Save compatibility
- Unit (tests/migration-v0100.test.mjs): real v0.10.0 schema-16 saves made with dd81b3e (tests/fixtures/v0100, script tests/fixtures/v0100/make-v0100-fixtures.mjs) → schema 17, then into Mission 25.
- Browser (tests/migration-v0100.mjs): see the table. All older migration suites still pass.

## Art pack G1 (D-103)
- 12 PNG masters from Ashen_Crown_v0100_ACT4_Art_Pack_G1_A.zip and _B.zip hash-verified against their SHA256SUMS and imported: Ines's and Thea's tier 3 busts (4 each) and map sheets, icon sheet L (성역의 문, 철의 돌파, 연합의 깃발, 마지막 등불), the council tents (iron, free, flame, taken). QA copies in docs/v0.10.0/art/pack-g1-qa.
- Checked by the unit and browser art suites above and by eye on the M23 camp screenshot and Thea's ④ menu.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.10.1/evidence and the SHA256 manifest.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390 (p95 16.8 ms). Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox; long-term browser storage eviction; real-PC frame times.
- Human difficulty: guarding the neutral camp's leader on the way north; the pace of the duel and persuasion; how often players push Baldrick to withdraw instead of talking him down; Baldrick in later battles as the ninth hero.
- Temporary art until pack G2: Dario's tier 3 look (uses tier 2) and seven new icons (Dario ④, Baldrick ①–④, two treasures).
- Baldrick's 「협력」 allied cavalry appears from M27 (next update).
