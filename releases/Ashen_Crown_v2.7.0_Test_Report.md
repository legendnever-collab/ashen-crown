# Ashen Crown v2.7.0 「맞는 길, 운, 마을의 얼굴」 — Test Report
Updated 2026-11-23 KST. **Release candidate** on feature/v2.7.0 (not merged), built on v2.6.1 (merged, D-156); the user plays and approves it first.
- Decisions: D-157 (design proposed), D-158 (approved with the recommended answers), D-159 (build and tests). Design: docs/v2.7.0/MAJOR_UPDATE_DESIGN.md. Notes: docs/v2.7.0/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.7.0_SHA256SUMS` (`index.html` is identical).

## What changed
- **M06 south to north** (22×24, sortie 7): the legion and the refugees start in the burning south, the gate is in the north wall; pursuers from the south, the garrison beyond the gate, the beacon east, the lever west — the dialogue unchanged. Refugees walk 3 tiles beside a hero, pass heroes and each other, go round foes; a state label over each and a sheet when pressed. M06 strength ×1.8.
- **「연속 공격」:** (own 운 − foe 운 ÷ 2) × 2%, 0–35%, plus 「쌍매듭 팔찌」 (+15%, Velmar from M09), at most 50%; it replaced the hidden 민첩 +8 follow-up; shown in the forecast, the dock and the hero sheet. Tier attacks named in the forecast. Bosses' 운 +3.
- **Small villages:** the request board in the square (drawn until art pack M) with the county clerk; a traveller by the tavern door; two guests in every tavern (existing art). Painted rooms move only the service person to the counter.
- **Dialogue directions** fixed to the big maps in M02, M03, M05, M16, M19.
- Saves: schema 28 (M06 battle saves reopen in camp). Story, choices and endings otherwise unchanged.

## How it was tested
- M06 was measured from the 30 camps saved before it (refugees through, refugees fallen, the turn of the first crossing) and its strength tuned there; then the whole campaign ran from M01 to M30 (30 campaigns, 보통 and 어려움).
- Browser: the suites the change touches ran here; the rest run in the PR's CI.

## Results on this build
- **M06 (30 camps):** first refugee through at TURN 7–8 (29 runs; was 13–17), 2.3 of 4 through on average (was 1), no refugee fallen in 15 runs; 26/30 won at ×1.8.
- **Balance, 보통** (node tests/act2-balance.mjs 30): every mission at or above the 60% gate (the gate's low list is empty). Lowest: M26 20/26, M16 24/29, M22 24/27. ACT I: M03 27/30, M04 27/30, M06 26/30; M01, M02, M05 30/30.
- **Balance, 어려움** (report): M06 15/30 (the ×1.8 strength applies there too), M03 17/30, M26 11/16, M22 14/18 are the lowest; 13–15 campaigns reach M27–M30 (v2.6.1: 6).
- Full lines: docs/v2.7.0/evidence/balance-chains.txt.
- **Unit tests: 590 PASS / 0 FAIL / 16 skipped** (docs/v2.7.0/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - New: tests/v270.test.mjs (M06 start south/gate north, refugee states, passing a refugee, going round a foe; the 연속 공격 formula, caps and accessory, the forecast, no follow-up at 0% however fast; the tier-attack names; the board, clerk, door traveller and tavern guests; the direction fixes; schema 28 migration).
  - Re-pinned: tests/mission06.test.mjs on the new map (escort 3 tiles north, the seal stones by the north gate, the lever west, outcomes beyond the gate); schema 28 and version 2.7.0 pins; the gear table (84, one more tier II); M06 ×1.8 (playtest-d126); the map sizes (renaissance); the besieged request gets up to three tries like the other request battles (20 tries: 15 won).
- **Browser suites run here (19): every final exit is 0** (docs/v2.7.0/evidence/browser-run-summary.log): balance (M01 30/30), e2e 80, v270 16, v261 15, v252 42, v210 46, v231 26, v241 26, v251 28, frontier 90, journey 176, world 32, quality 98, act1 113, tactics 26, class 30, mobile 91, hub-doors, act2-hubs 315 checks.
  - v210 and act1 first failed on the old ground: v210 opened the board from the hall (the clerk now stands in the square — the test presses him and uses his menu); act1 unsealed M06 at the old south-west stones (now the stone before the north gate). Both passed after.
  - **v270 suite** (1440×900, 390×844): M06 opens with the refugees in the south; the injured refugee's sheet says 「치유 필요」 and how far the gate is; Eric's attack forecast shows 「연속 공격 n%」; 갈대 나루's clerk opens 「대화 · 의뢰 게시판」; the tavern opens with its guests; no runtime errors. Screenshots: docs/v2.7.0/screenshots.
- **The other browser suites:** run by CI on the PR.

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox.
- The large towns' dialogue (철관성, 벨마르, 왕도 and the like) was not reviewed against their paintings this time.
- The request board is a drawn placeholder until art pack M returns.
