# Ashen Crown v0.9.0 — The Capital (왕도) · ACT III part 1 / QA Report
Updated 2026-11-04 KST (art work pack E imported, D-081; full validation rerun on the new build). **Release candidate — not merged before the user plays and approves it.** ACT III design D-078 (docs/v0.9.0/ACT3_DESIGN.md) approved in chat on 2026-11-03 18:21 KST with the recommended answers and temporary art (D-079); implementation details D-080.

Baseline main 534a25df2cb00a6d75262a24f169fc9a9c4988c0 (v0.8.1, PR #17). Branch feature/v0.9-act3-crown.

HTML SHA256: `9d0a44cd249335a301b2b36bfb6dc39733be67441bca340cb41295120a646d20` (28,007,509 bytes; 27,342,278 before the icons). The full validation run below used this build; `verify-release.py` rebuilds it from the Source ZIP and compares the bytes.

## Outcome
ACT I–II (Missions 01–14), promotions, skills, tools, gear and every story scene unchanged, plus D-080:
- **M15 사라진 기록** (capital's lower city): three clerks run to their gates from TURN 1 (two tiles a turn); knocked down, their boxes are secured; all three settled with two or more boxes wins, two gone loses; grey cloaks hunt the old archivist from TURN 3; the royal watch is neutral and warns once, then turns hostile. Camp choice: the records (archivist / keep / post).
- **M16 잊힌 전장**: fog (bows and spells −1 range, enemies beyond three tiles hidden), three ward stones (search: an echo, the fog cleared around it, the harvest stopped), two memory harvesters (MP −3 near an unsearched stone), the betraying banner's scavengers, the TURN 3 duel; recruits kept aside after M14 and a missed Ines walk in on TURN 2 and rejoin if they live. Camp choice: the stones (break / leave).
- **일기토** (strike / guard / finisher, best of three, loser −30% max HP, refusable), **Aren's command** 「지켜라」 (DEF +2 on turns 1–2) on the deployment bar, **sortie 7**, capital and field camp hubs (temporary art), capital forge (six tier III pieces), two treasures and hidden objectives, two original tracks, schema 12.
- ACT III enemy numbers are set to the party that finishes ACT II (balance party Lv 9–18 at M14).
- **Art work pack E** (D-081): the user's 102 painted icons (ZIP SHA256 a2fc8676…f288; all seven sheets match SHA256SUMS.txt) cut by `scripts/import-item-art.py --strict` with the work order's cells.csv — 102 WebP, 0 QA notes. Tools, gear and treasures everywhere; the battle command menu (공격·대기·설득·생포); the three skill disks in the skills submenu and the tactics tab; painted status chips over units. Shop cards draw icons at 44 px, equipment and compare views at 40 px. The capital's tier III pieces and the two v0.9.0 treasures keep game-drawn icons. The pack's own QA deviations (A10, F12, C09, similar blades) are accepted and listed for a retouch.
- Fixed: chests in hubs from Mission 10 on and in the raided village could not be opened (the chest id pattern took a one-digit mission and no underscore; present since chests arrived in v0.4). A unit test fails on the old pattern and passes on the new one.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
365 unit tests PASS / 0 FAIL (`npm test` after packaging; docs/v0.9.0/evidence/unit-results.txt). New unit files: tests/mission15.test.mjs (9), tests/mission16.test.mjs (7), tests/migration-v081.test.mjs (4), tests/item-art.test.mjs (2: every icon's hash against the import log, one per work-order cell; coverage of all 24 skills, statuses, commands, tools, gear and treasures).

1,782 browser assertions passed across 48 suites, plus the performance suite. No runtime errors were recorded. Summary: docs/v0.9.0/evidence/browser-run-summary.log — 49 suites including the balances, all exit 0.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| hub-doors-e2e (159 doors at three sizes; 12 house clicks) | 171 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| act2-hubs-e2e | 120 | PASS |
| act1-e2e | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| arms-e2e | 42 | PASS |
| **act3-e2e (new; 1440 and 390 touch):** a real v0.8.1 summit-camp save → the ACT III card → M15 preparation in the capital → Aren's 「지켜라」 on the deployment bar (dropped and given again) → M15 with seven heroes, three clerks, the neutral watch and the archivist → the records choice (posted) → M16 on TURN 3 with the duel modal and Thea (set aside with the M14 departure rule) fighting beside the legion → the duel decided → a hidden enemy in the fog → after M16 Thea back in the legion, the ward-stone choice (broken) and the next-step scene | 38 | PASS |
| world-e2e | 32 | PASS |
| **item-art-e2e (new; 1440 and 390 touch):** Ironhold's forge shelf (21 painted icons, all decoded at 128 px), the treasure in the equipment sheet, the capital shelf's game-drawn tier III icon, 공격 and 대기 in the command menu, Erik's three skill disks, painted chips over a poisoned and bound enemy (no pixel of the old flat letter squares in the chip area), the tactics tab; no page errors | 18 | PASS |
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
| migration-v02 | 16 | PASS |
| **migration-v081 (new):** shipped v0.8.1 HTML saves (village and battle) and v0.8.1-source fixtures (summit camp after ACT II with a ★2 sword, mid-M14 battle) → schema 12 with every asset kept; the camp goes on to Mission 15; the M14 battle resumes with its bag | 14 | PASS |
| migration-v080 (its camp check now expects Mission 15 next) | 14 | PASS |
| migration-v040 · v050 · v060 · v061 · v070 · v071 | 12 each | PASS |
| migration-v031 · v033 | 11 each | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

Older suites were pointed at the v0.9.0 build (URL, schema 12, version 0.9.0); hub tests include the capital and field camp hubs; the score has 26 tracks; the gear table has 61 entries.

## Balance (legal player policy, rules API only, no state edits)
Every balance output of the final build (ACT I–III) is byte for byte the same as the first v0.9.0 run, and every ACT I–II balance output — wins, turns, levels, choices and Gold — is identical to the v0.8.1 evidence (act1-balance.json, act2-balance.json, balance, campaign-balance, economy-balance, class-balance byte for byte; M05 and M06 logs the same).

ACT III (test-output/act3-balance.json; the 29 campaigns that finish ACT II continue, records and stones choices alternated):

| Mission | Result |
|---|---|
| M15 사라진 기록 | 27/29 wins in 5–7 turns (both losses: two clerks out of the gates); three boxes 7, two boxes 20; the watch warned in every run, never turned |
| M16 잊힌 전장 | 27/27 wins in 6–10 turns; all three stones searched in every win; duel won 9, lost 18; two runs had a returning recruit (Ines, who had not joined) and both rejoined |

Gate: M15 ≥ 90% of the campaigns that reach it and M16 ≥ 90% of M15's winners — passed. Hidden objectives M15/M16 were won 0 times (the policy does not aim at them).

## Save compatibility
- Unit tests (tests/migration-v081.test.mjs): real v0.8.1 schema-11 saves (the summit camp after M14 and a mid-M14 battle, made with the v0.8.1 merge 534a25d) load as schema 12 with completed missions, flags, choices, promotions, trust, roster, feats, economy, heroes, bonds and tactical memory unchanged; the camp continues to M15 (capital hub, sortie 7, 「지켜라」); the battle resumes and is won.
- Browser (tests/migration-v081.mjs): see the table.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.9.0/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times.
- Human difficulty: ACT III enemies are set to the balance party, which outgrew ACT II's last enemies; a human-raised legion may find M15–M16 harder.
- The final art: places, characters and enemies of ACT III use temporary art until the user's art packs return (pack D and the ACT III art; pack E is in).
- Icon legibility at 20 px on real phones (the status chips) was checked in headless screenshots only.
