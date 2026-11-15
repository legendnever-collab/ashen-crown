# Ashen Crown v0.10.1 「검은 사자」 — Test Report
Updated 2026-11-11 KST. **Release candidate on feature/v0.10.1-banners; not merged before the user plays and approves it.** Decision: D-102 (implementation details, PROPOSED) within D-099 (docs/v0.10.0/ACT4_DESIGN.md), built on main dd81b3e (v0.10.0), with ACT IV art packs G1 (D-103) and G2 (D-105) imported and the play-test minor feedback D-104.

HTML SHA256 of the build under review: `ae945e11db9caef83f201d5bf1009454120c61e8b2fa79c44923445b842b7e48` (49,862,744 bytes; `index.html` identical; also in `releases/Ashen_Crown_v0.10.1_SHA256SUMS`). **The full 60-suite matrix ran on this HTML** (2026-11-11), after art packs G1/G2 and the play-test changes D-104, D-106, D-107 and D-108; only docs and one test changed after it.

## Summary
- **481 unit tests PASS / 0 FAIL** (docs/v0.10.1/evidence/unit-results.txt). New: tests/mission25.test.mjs (4), tests/mission26.test.mjs (5), tests/migration-v0100.test.mjs (4), tests/unit-menu.test.mjs (3), tests/hub-menu.test.mjs (2), tests/hero-lore.test.mjs (3), and the art pack G1/G2 checks in tests/item-art.test.mjs and tests/portraits.test.mjs.
- **Full browser and balance matrix, 60 suites** (docs/v0.10.1/evidence/browser-run-summary.log): 59 passed on the first run; **quality failed once** — its check that holding a D-pad arrow on a touch screen keeps Erik walking found the D-pad hidden, as D-107 now hides it on touch screens. The check now turns the D-pad on the player's way (☰ → 방향패드 켜기) first, and quality passed on rerun (99 checks). 2,086 `PASS` lines in all. No runtime errors.
- Balances: ACT I 30/30; ACT II M07–M14 30/30 each; ACT III M15–M22 30/30 each; ACT IV M23 30/30, M24 30/30, **M25 30/30, M26 30/30** (gate ≥ 90% of the previous mission passed).
- Earlier full runs on intermediate builds of this RC, and what they caught: on the D-106 build, act3c (the smaller forecast covered the second pick of Kai's ④; fixed in positionPopover) and act4b (a stale check for 「사자의 일격」 in the skills menu; check corrected). A run on the D-107 build was stopped when D-108 changed the build.
- Browser tests open a folded town button the way a player does (☰ first) and press a hidden D-pad button like a key (tests/browser-helper.mjs, D-107).

## Play-test changes in this build (D-104, D-106, D-107, D-108)
- D-104: the unit menu's title is one line (15 px, ellipsis); the move confirmation is just 이동 확정 / 취소. Screenshots at 412 px: docs/v0.10.1/screenshots/d104.
- D-106: on a 412 px phone the battle skills menu went from 628 to 296 px tall (one line per skill, no notes, 설명 → 상태 → 기술) and the forecast from 280 to 213 px; the unit sheet's tabs sit on one row and 기술 explains all four skills. Before/after: docs/v0.10.1/screenshots/d106.
- D-107: the town map is clear — the menu folded behind ☰ with only the next story step beside it, no floating place names, gold apart from the quest button, no 에릭 찾기, the D-pad off on touch screens. Before/after at 412 px: docs/v0.10.1/screenshots/d107.
- D-108: the hero sheet — ☰ → 장수 정보 (roster), ◀ ▶ between heroes, 열전 (title, personality, a line, past, chapters opened mission by mission, bonds, records) and 성장 led by the next goal with how to raise each potential step and live progress. Screenshots at 412 px: docs/v0.10.1/screenshots/d108.
- Art packs G1 and G2 load in game: docs/v0.10.1/screenshots/g2 (awakened Dario in M26, Baldrick's painted icons).

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act4b-e2e (new):** a real v0.10.0 Ashen Village save (after M24) offers Mission 25 → the 「세 깃발의 땅」 world card and the alliance camp → M25 (the M14 betrayer's hardliners in the north camp; one camp allied and orderable, one neutral and not) → the objective panel names the camps and counts the leaders → after the win, forgive or lower the betrayed banner; the choice is kept and Mission 26 follows → M26 TURN 2 duel (strike, guard, finisher, refuse) decided → 설득 beside Baldrick → resolve 4: Baldrick yields and joins (ninth hero, Lv 19, tier 3) → the camp below the lion's pass with Baldrick in it → Baldrick's ①–④ → Dario awakened shows ④ 백 번의 반격; no page errors. 1440 and 390 | 32 | PASS |
| **migration-v0100 (new):** shipped v0.10.0 HTML saves (village, battle checkpoint) and v0.10.0-source fixtures (the Ashen Village after M24, a mid-M24 battle) → schema 17 with every asset kept and the roster intact; the camp goes on to Mission 25; the M24 battle resumes at the border; restart works; Erik keeps ② ③ and shows ④; no runtime errors | 13 | PASS |
| act4a-e2e: after M24 the way goes on to Mission 25; the M23 council tents now draw the painted G1 tents | 30 | PASS |
| item-art, portraits, rooms (browser): Ines's and Thea's tier 3 busts and sheets, icon sheet L and the four tents from pack G1 load; icon sheet M from pack G2 | as before | PASS |
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

## Art pack G2 (D-105)
- 6 PNG masters from Ashen_Crown_v0101_ACT4_Art_Pack_G2_A.zip and _B.zip hash-verified against their SHA256SUMS and manifests and imported: Dario's tier 3 busts (4) and map sheet, icon sheet M (백 번의 반격, 사자의 일격, 사자의 포효, 사자의 깃발, 검은 사자의 결의, 세 왕가의 인장, 검은 갈기; 0 QA notes from the importer). QA copies in docs/v0.10.1/art/pack-g2-qa.
- Unit checks: tests/item-art.test.mjs (sheet M: 7 icons, hashes match the import log, every Baldrick skill painted) and tests/portraits.test.mjs (dario_t3: four expressions and a sheet).

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.10.1/evidence and the SHA256 manifest.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390 (p95 16.8 ms). Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox; long-term browser storage eviction; real-PC frame times.
- Human difficulty: guarding the neutral camp's leader on the way north; the pace of the duel and persuasion; how often players push Baldrick to withdraw instead of talking him down; Baldrick in later battles as the ninth hero.
- Baldrick's 「협력」 allied cavalry appears from M27 (next update).
