# Ashen Crown v0.9.2 「그림자」 — Test Report
Updated 2026-11-09 KST. **Merged after the user's approval (PR #20 → 5fc1392, PR #21 → 31c31c6, 2026-11-08, D-090). ACT III art pack F3 in the addendum is on feature/act3-f3-art-pack and is not merged before the user plays and approves it.** Decisions: D-089 (implementation details, PROPOSED), D-091 (F3).

HTML SHA256 of the tested build: `c0d205077dc6ca992991afc88527f26cd21fec093be9c1ff8c4ab9a45a0c61d8` (44,484,985 bytes; `index.html` identical). Headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke.

## Addendum 2026-11-09 — ACT III art pack F3 (D-091), full matrix on this build
All 24 images of pack F3 (three zips returned 2026-11-09, SHA256 in D-091) are imported on top of the merged v0.9.2: the awakened Lia and Kai (busts and sheets), Lia's teacher and Kai's old superior (busts and sheets), the rite knight (scaled 1.06) and the ritualist sheets, icon sheet J and the prop sheet (ritual circle lit / sealed, archive cabinet whole / burned). Also: the provoke / debuff / buff chips over units on the map are drawn again (hidden since v0.8.1 by a `//` comment that swallowed the rest of a line in statusChips), and an item-art test line lost the same way is restored. No rule, reward or save field changed.

HTML SHA256 of this build: `5a0412da7406cbe6f60c93bf845c062f120b058717d5386dc5799a158eff495f` (47,022,083 bytes; `index.html` identical). On it:
- 413 unit tests PASS / 0 FAIL (new: the pack F3 test in tests/act3-art.test.mjs and the sheet J test in tests/item-art.test.mjs; counts in portraits, rooms and item-art updated).
- The full browser matrix, 54 suites, **all passed on their first run** (docs/v0.9.2/evidence/browser-run-summary.log): 2,113 assertions across 53 suites plus the performance suite, every suite with the same number of checks as on the v0.9.2 build below; no runtime errors.
- Balance outputs (act1, act2, act3, balance, campaign, economy, class) are byte-identical to the v0.9.2 run below. Performance medians 16.7 ms at 1440 and 390.

The rest of this report describes the v0.9.2 release candidate as merged.

## Summary
- **411 unit tests PASS / 0 FAIL** (docs/v0.9.2/evidence/unit-results.txt). New: tests/shadow-v092.test.mjs (5), tests/mission19.test.mjs (4), tests/mission20.test.mjs (5), tests/migration-v091.test.mjs (4).
- **Full browser matrix, 54 suites including the balances** (docs/v0.9.2/evidence/browser-run-summary.log): **2,113 browser assertions passed across 53 suites plus the performance suite**; no runtime errors on the final runs.
- Two suites failed on their first run for test reasons and passed on a rerun; both runs are in the summary log:
  - **e2e** (63 checks) read `test-output/winning-trace.json`, which the balance suite writes; this fresh worktree had none yet because e2e runs first. It passed 63/63 after the matrix.
  - **legion-e2e** (19 checks) still expected Kai's row in the legion panel to read "done" once promoted. In v0.9.2 his awakening is the next step, so the check now looks for 그림자 추적자 → 그림자 군주. It passed 19/19.
- Balances: ACT I–II outputs byte-identical to v0.9.1; M15–M18 unchanged; M19 27/27 and M20 27/27 (gate ≥ 90% passed).

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act3c-e2e (new):** a real v0.9.1 forest-village save → M19 in the capital (the return scene, 「한 사람도 두고 가지 않는다」 on the deployment bar, four lit circles and full memory, the objective panel, 봉인 해제 on a circle) → the teacher choice and Lia's word → the legion panel and Lia's trial (④ 작은 결계 from the skills menu, forecast, the ward over the gap) → M20 (three cabinets, six residents, fire, cloaks in the shadows, the objective panel; ④ 그림자 군무 with two taps, the swap and the held cloak) → the superior and plan choices, Kai's word, Baldrick and the M21 teaser, no next mission → Kai's awakening card; no page errors; 1440 and 390 touch | 50 | PASS |
| **migration-v091 (new):** shipped v0.9.1 HTML saves (village, battle checkpoint) and v0.9.1-source fixtures (the forest village after M18, a mid-M18 battle) → schema 14 with every asset kept; the camp goes on to Mission 19; the legion panel; the M18 battle resumes and Erik shows ④ | 13 | PASS |
| act3b-e2e: after M18 the camp now goes on to Mission 19 | 48 | PASS |
| legion-e2e: a promoted Kai shows his awakening as the next step (rerun) | 19 | PASS |
| e2e (rerun after the balance suite wrote its trace) | 63 | PASS |

Every other suite passed with the same number of checks as on the PR #20 build (see that test report): act2-hubs 315, hub-doors 177, journey 176, renaissance 141, campaign 128, act1 113, frontier 104, quality 98, mobile 81, act3 38, act2d 30, class 30, act2 28, tactical 27, tactics 26, act2c 26, act2-campaign 24, mobile-command 24, act2b 22, restart 22, audio-mute 20, item-art 18, world 32, arms 42, feedback-v091 5, migrations v02–v090 and the others. Older suites were pointed at the v0.9.2 build (URL, schema 14, version 0.9.2).

## Balance (legal player policy, rules API only, no state edits)
- Every ACT I–II output — wins, turns, levels, choices and Gold — is identical to the v0.9.1 evidence byte for byte (act1-balance.json, act2-balance.json, balance, campaign-balance, economy-balance, class-balance).
- ACT III (test-output/act3-balance.json, 29 campaigns): M15 27/29, M16 27/27, M17 27/27, M18 27/27 — as in v0.9.1.

| Mission | Result |
|---|---|
| M19 금지된 의식 | 27/27 wins in 4–8 turns; all four captives kept their names in 13, one forgot in 14 |
| M20 왕관의 그림자 | 27/27 wins in 6–8 turns; two cabinets every time (the policy stops at two), none burned; residents evacuated 4 in 19 runs, 5 in 1, all 6 in 7; Kai won the duel 20 times, lost 7 |

Trials (a side copy of each camp, the hero forced to the tier below so the trial can run; the policy uses the ④ skills): 결계의 시련 27/27 (작은 결계 used in 27), 그림자 군주의 시련 27/27 (그림자 군무 used in 2 — the balance party's Kai is Lv 22 and usually wins outright). A separate run with a Lv 14 party (scratch script, not in the matrix): 결계의 시련 8/10, 그림자 군주의 시련 10/10 with 그림자 군무 used in 9–10. The v0.9.1 trials are unchanged (매 23/27, 맹세 25/27, 새벽 27/27, 흑철 19/19, 검성 27/27, 성소 27/27).

Gate: M19 ≥ 90% of M18's winners and M20 ≥ 90% of M19's winners — passed. Hidden objectives: M19 13 times, M20 0 (the policy does not aim at the third cabinet). The balance party is never promoted along the way, so the campaign numbers do not include awakened heroes.

## Save compatibility
- Unit (tests/migration-v091.test.mjs): real v0.9.1 schema-13 saves made with the v0.9.1 merge 184536a (tests/fixtures/v091: the forest village after M18 with the truth told; a mid-M18 battle) load as schema 14 with completed missions, flags, choices, promotions, trust, roster, feats, economy, heroes, bonds and tactical memory unchanged; the camp continues to M19 in the capital (sortie 7, three orders with 「한 사람도 두고 가지 않는다」 chosen); the battle resumes and is won under v0.9.2 rules.
- Browser (tests/migration-v091.mjs): see the table. All older migration suites (v0.2–v0.9.0) still pass.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.9.2/evidence and the SHA256 manifest. The Source ZIP leaves out the built HTML (D-066) and the work packs' reference images; verify-release rebuilds the HTML from the ZIP and compares the two.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox; long-term browser storage eviction; real-PC frame times.
- Human difficulty: the policy breaks the circles after removing the ritualists and splits north/south in M20; it never tries for the third cabinet or all six residents on purpose. The trials were checked at the balance party's levels (Lv 21–22) and at Lv 14 in a side run only.
- Final art: Lia's and Kai's awakened looks, the teacher, the old superior, the rite knights, the ritualists, the circles and the cabinets use temporary art until ACT III pack F3 (work order in docs/v0.9.2/art/act3-f3-work-pack).
