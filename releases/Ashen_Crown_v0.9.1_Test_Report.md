# Ashen Crown v0.9.1 — The Guardians (수호자) · ACT III part 2 / QA Report
Updated 2026-11-08 KST. **Merged after the user played and approved it (PR #19 → 184536a); the play-test fixes and ACT III art pack F2 in the addenda are not merged before the user approves them (PR #20).** User instruction in chat on 2026-11-05 06:40 KST ("그림은 시켜놓을게 개발은 우선 가안으로 진행해줘"), within the approved ACT III design (D-078/D-079, docs/v0.9.0/ACT3_DESIGN.md §4.1, §5.2, §6); implementation details D-084. Art pack D (returned on 2026-11-05, D-085) and ACT III art pack F1 (returned on 2026-11-06, D-086) are imported; the v0.9.1 places, statues, trees and awakened looks stay temporary until ACT III packs F2–F4.

Baseline main 45d5c0a233ecb1fe38c9b87ac80214592223cfe1 (v0.9.0, PR #18). Branch feature/v0.9.1-guardians (it also carries the art-pack F1 generator, 486cc7e).

HTML SHA256: `4283648bec935098510d39a0ec003eca48726e63226358a9e5a1142b4a876a6b` (35,914,352 bytes, with art packs D and F1). The full validation run below used this build; `verify-release.py` rebuilds it from the Source ZIP and compares the bytes.

## Addendum 2026-11-08 — ACT III art pack F2 (D-088), full matrix on this build
ACT III art pack F2 (seven zips returned 2026-11-06, SHA256 in D-088) is imported on feature/act3-f2-art-pack on top of the play-test fixes below: the awakened Erik, Elina and Sain and the recruits' tier 2 (busts and map sheets), the last guardian and the forest elder, the M16 duel captains of the three banners, the awakened guardian statue, the forest-keepers and the grey captain; the painted keep and forest village (`hub_keep`, `hub_forest` on the fort and village footprints, masks unchanged) with the forest village's six painted rooms and four chest styles; painted props (sleeping statues, ward trees whole, hurt and felled); sheet I icons (the three ④ skills, the two v0.9.1 treasures, the basic potion). The elder speaks as 마지막 수호자 at the keep and 숲지기 장로 in the forest. No rule, reward or save field changed.

HTML SHA256 of this build: `b45ab83b531f28ed63970221fa564bf877943f7ba2f6669bb61ac5d5d3a3d99d` (44,406,984 bytes). On it (headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke):
- 393 unit tests PASS / 0 FAIL (docs/v0.9.1/evidence/unit-results.txt; new tests/act3-art.test.mjs, 4 tests).
- The full browser matrix, 52 suites including the balances (docs/v0.9.1/evidence/browser-run-summary.log): 2,050 browser assertions passed across 51 suites plus the performance suite; no runtime errors. Changed against the table below: act2-hubs-e2e 315 (the painted forest village and its six rooms added), feedback-v091-e2e 5 (the empty chest, narration without a portrait, the M17 and M18 elders' names and portraits, no page errors). item-art-e2e failed on its first run (its check still expected three painted disks in Erik's skills submenu; pack F2 also paints the locked ④ 맹세의 성벽, so four show) and passed 18/18 after the expectation was updated; both runs are in the summary log.
- Balances on this build: act1, act2 (M07–M14 ≥ 90%) and act3 (M15–M18 ≥ 90% each) gates passed; the numbers are in docs/v0.9.1/evidence/act2-balance.json and act3-balance.json.

## Addendum 2026-11-06 — play-test fixes (D-087)
v0.9.1 was played and approved by the user and merged (PR #19 → 184536a). Two fixes from play were rebuilt into the same v0.9.1 files on feature/act3-f2-art-pack: an empty chest shows the room's own painted open chest instead of the game-drawn potion placeholder, and narration lines (연대기) in battle show no placeholder portrait. On the rebuilt HTML (SHA256 `4fc4c6df3655ab036006a8efb03baf289b1d96d15cc77eff185631483c0dfcc8`, 35,915,525 bytes) these were run: 388 unit tests PASS, the new tests/feedback-v091-e2e.mjs (3 checks: the empty-chest window shows the painted open chest of the room, a narration line in battle has no portrait, no page errors), journey-e2e 176, act3-e2e 38, act3b-e2e 48 and frontier-e2e 104 — all PASS — and the CI groups listed in the pull request. The full matrix and balance results below are from the merged build `4283648b…`; the fixes touch only the chest window and the dialogue panel, and no rule, reward or save field changed.

## Outcome
ACT I–II (Missions 01–14), ACT III part 1 (M15–M16), promotions, skills, tools, gear and every story scene unchanged, plus D-084:
- **M17 수호자의 맹세** (the guardians' keep): four sleeping guardian statues — a hero beside one swears the oath (the search action, labelled 맹세) and it fights for the legion; a sleeping statue with an enemy beside it and no hero beside it at the start of a turn wakes for the chancellery. The Book of Oaths on two archive tiles: an enemy on them at the end of two enemy phases in a row is a defeat. Victory at the end of TURN 10 or when the chancellery captain falls (he keeps to the rear until TURN 6). Camp choice: the book (leave / take); Erik's word.
- **M18 불타지 않는 숲**: rain (fire −50%, nothing catches fire), the ward at the forest's heart (fire harmless inside, Heal +50%), three ward trees the betraying banner's loggers go for (two felled is a defeat), six forest-keepers led inside with the rescue action; victory at the end of TURN 12 or when the logging captain (arrives TURN 4) falls. Camp choice: the truth for the elder (tell / keep).
- **Awakening (Tier 3)** for Elina, Erik and Sain: Lv 14, tier 2, their mission (M16/M17/M18) and an awakening trial (106–108); small bonuses and a **④ skill once a battle** — 맹세의 성벽, 퇴로 봉쇄, 새벽의 기도; the awakening card. Lia and Kai follow in v0.9.2.
- **The recruits' tier 2** (trials 111–113): 흑철 창기사 (a killing Charge leaves the rest of the move), 검성 (two counters in Riposte), 성소 수호자 (sanctuary reaches two tiles). The legion panel lists every hero in the legion and the next step (promotion or awakening).
- **Aren's 「나아가라」** (first turn MOV +1) from M17. Guardians' keep and forest-village hubs (temporary art), two world sites, one original track, two treasures and hidden objectives, rewards, supply carriers, schema 13.
- **Art pack D (D-085):** the painted pilgrim village (new walk mask, eight doors including the new chapel and copyists' rooms, eight painted rooms, four chest styles) and the ACT II part 2 cast (Lucien and Ines busts, ten map sheets). The village has two more chests per mission visit under the unchanged chest rule; battle rewards and results are unchanged.
- **ACT III art pack F1 (D-086):** the painted capital (hub_capital over Velmar's footprint with Velmar's mask and doors, the `capital` room family with six rooms, four chest styles), the archivist and Bellard busts, six ACT III map sheets (archivist, Bellard, watchman, grey cloak, clerk, harvester) and sheet H icons (six tier III capital pieces, two treasures). Shopkeepers behind one-row painted counters (pilgrim and capital shops) stand a row back with talk reach 3. Chest count unchanged.
- Fixed while building: a recruit beyond the sortie limit could not take part in its own trial (it stayed benched); trial heroes now take the first deployment spots in trials 106–113 (101–105 unchanged).

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
388 unit tests PASS / 0 FAIL (`npm test` after packaging; docs/v0.9.1/evidence/unit-results.txt). New unit files: tests/mission17.test.mjs (6), tests/mission18.test.mjs (5), tests/awakening.test.mjs (7), tests/migration-v090.test.mjs (4); tests/item-art.test.mjs gained the pack F1 test.

1,986 browser assertions passed across 50 suites, plus the performance suite. No runtime errors were recorded. Summary: docs/v0.9.1/evidence/browser-run-summary.log — 51 suites including the balances, all exit 0.

| Suite | Checks | Result |
|---|---:|---|
| **act2-hubs-e2e (packs D and F1 added):** the castle town, Velmar, the painted pilgrim village and the painted capital at 1440 and 390 touch — each town at Lia's table, Erik walking, every room with chests closed and open, leaving each room by its doorway (screenshots in docs/v0.9.1/screenshots/pilgrim and /capital) | 256 | PASS |
| journey-e2e | 176 | PASS |
| hub-doors-e2e (165 doors at three sizes, the pilgrim village's eight doors among them; 12 house clicks) | 177 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| act1-e2e | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| **act3b-e2e (new; 1440 and 390 touch):** a real v0.9.0 field-camp save offers Mission 17 → the legion panel (Elina → 매의 사수 with ④, the recruits' tier 2, Erik waiting for M17; trials enabled/disabled) → the awakening trial with Elina's ④ in the skills menu → the awakening card → M17 at the keep (「나아가라」 cycled on the deployment bar, seven heroes, four statues, an oath sworn by a hero beside a statue) → the Book of Oaths choice and Erik's word → M18 in the rain (trees, keepers, a forest-keeper led inside) → the truth choice, the M19 scene and no next mission | 48 | PASS |
| arms-e2e | 42 | PASS |
| act3-e2e | 38 | PASS |
| world-e2e | 32 | PASS |
| act2d-campaign-e2e | 30 | PASS |
| class-e2e | 30 | PASS |
| act2-e2e | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2c-campaign-e2e | 26 | PASS |
| tactics-e2e | 26 | PASS |
| act2-campaign-e2e | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e | 22 | PASS |
| restart-stage | 22 | PASS |
| audio-mute-e2e | 20 | PASS |
| legion-e2e | 19 | PASS |
| item-art-e2e | 18 | PASS |
| migration-v02 | 16 | PASS |
| **migration-v090 (new):** shipped v0.9.0 HTML saves (village and battle) and v0.9.0-source fixtures (the field camp after M16, a mid-M16 battle) → schema 13 with every asset kept; the camp goes on to Mission 17; the legion panel; the capital in the revisit list; the M16 battle resumes and Erik shows ④ locked | 14 | PASS |
| migration-v081 · v080 | 14 each | PASS |
| migration-v040 · v050 · v060 · v061 · v070 · v071 | 12 each | PASS |
| migration-v031 · v033 | 11 each | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

Older suites were pointed at the v0.9.1 build (URL, schema 13, version 0.9.1); hub tests include the keep, the forest and the painted pilgrim village and capital (41 painted rooms, 56 chest images, 4 painted town hubs); the item-art suite checks the capital shelf's painted 왕도 근위검; ACT III battle screenshots with the pack F1 figures in docs/v0.9.1/screenshots/act3-f1; the score has 27 tracks; the gear table has 63 entries; the catalog has 27 skills.

## Balance (legal player policy, rules API only, no state edits)
Every ACT I–II balance output of the final build — wins, turns, levels, choices and Gold — is identical to the v0.9.0 evidence (act1-balance.json, act2-balance.json, balance, campaign-balance, economy-balance, class-balance byte for byte), and M15–M16 are the same as in v0.9.0 (27/29 and 27/27, same turns).

ACT III part 2 (test-output/act3-balance.json; the campaigns that win M16 go on, the book and the truth alternated):

| Mission | Result |
|---|---|
| M17 수호자의 맹세 | 27/27 wins in 6–9 turns, all by bringing down the captain; in every run two statues were sworn and two claimed by the chancellery; the archive was never stood on |
| M18 불타지 않는 숲 | 27/27 wins in 5–6 turns, all by bringing down the logging captain; three trees standing in 17, two in 10; four or five forest-keepers led inside |

Trials (a side copy of each camp, the hero forced to the tier below so the trial can run; the policy uses the ④ skills): 매의 시련 23/27, 맹세의 시련 25/27, 새벽의 시련 27/27, 흑철의 시련 19/19, 검성의 시련 27/27, 성소의 시련 27/27.

Gate: M17 ≥ 90% of M16's winners and M18 ≥ 90% of M17's winners — passed. Hidden objectives M17/M18 were won 0 times (the policy does not aim at them). The balance party is never promoted along the way (as in v0.9.0), so the campaign numbers do not include awakened heroes.

## Save compatibility
- Unit tests (tests/migration-v090.test.mjs): real v0.9.0 schema-12 saves (the field camp after M16 and a mid-M16 battle, made with the v0.9.0 merge 45d5c0a) load as schema 13 with completed missions, flags, choices, promotions, trust, roster, feats, economy, heroes, bonds and tactical memory unchanged; the camp continues to M17 (the keep, sortie 7, 「지켜라」 and 「나아가라」); the battle resumes and is won.
- Browser (tests/migration-v090.mjs): see the table.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.9.1/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times.
- Human difficulty: the policy wins M17 and M18 by rushing the captains; holding to TURN 10/12, the statue race and the archive rule were not exercised by it. The trials were tuned to the balance party (Lv 10–20 at M16); a human legion at the minimum Lv 14 may find 매의 시련 and 맹세의 시련 harder.
- The final art: the keep, the forest village, statues, trees, new figures and the awakened looks use temporary art until ACT III packs F2–F4. The deviations of packs D and F1 (D-085, D-086) are listed for a later retouch.
