# Ashen Crown v0.8.0 — Tactics (전술) / QA Report
Updated 2026-11-01 KST. The user approved the merge in chat on 2026-11-01 23:23 KST ("병합을 해줘", D-075). Hosted CI on PR #16 head 24eb15c: run 41313533757, 7/7 on attempt 1. Design approved in chat on 2026-10-28 06:24 KST ("권장안대로 진행해", D-073, docs/v0.8.0/GAMEPLAY_DESIGN.md §11); implementation details and tuning D-074.

Baseline main 762bc75036b0a9ecc2e24cef6e6af3a34cfb37e3 (v0.7.1, PR #15). Branch feature/v0.8-tactics-and-arms.

HTML SHA256: `d69f736c8360fd24b8b6e09a7e619af00bd57c10af943231a0f7b91011d0a8fb` (27,220,483 bytes). The validation run below used this build; rebuilding from the release commit produces the same bytes (`verify-release.py`).

## Outcome
ACT I–II (Missions 01–14), the promotions and every story scene unchanged, plus D-073/D-074:
- **Three skills per hero:** ① signature skill, ② a new skill at Lv 4 (Thea, Dario, Ines on joining), ③ the promotion action (recruits: a third new skill at join level + 3). Eleven new skills: 도발, 속박 사격, 화염진, 정화, 독날, 돌파, 기병의 함성, 회전 베기, 허점 찌르기, 성화 낙인, 순례자의 등불. The skill menu lists all three with their MP and when a locked one opens. Tile skills and throws mark the cells they will cover while their forecast is open.
- **Status effects:** poison, confusion, bind, silence. Commanders take half the chance and one phase at most. Chips over units. ACT II enemies inflict them (assassins and ash raiders poison, monastery guards bind, the abbot silence, masked raiders confusion).
- **Tools:** 13 tools. Recovery and cures work on the user or an adjacent ally. Throwables fly 2–3 tiles (Powder Bomb, Smoke Bomb, Weighted Net, Bewildering Powder, Caltrops), three per battle. War Drum. Bag 6 → 8. The stock opens with progress (specialty tools first in their home town's mission, then from every quartermaster).
- **Class matchups:** cavalry → infantry → archers → cavalry ±20%, spears +20% against cavalry. Bandits, assassins, rogues, commanders and the monastery's quarterstaff guards are neutral.
- **Tuning:** Flame Burst 50% / 8 MP (70% / 7 MP carried every mission); an area strike earns one attack's EXP with at most one kill bonus. Enemy stats and maps unchanged.
- **Saves:** schema 10 imports 0–9.
- Art work pack E (102 icons on seven sheets) generated for the user; new tools use temporary game-drawn icons until it returns.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
323 unit tests PASS / 0 FAIL (`npm test` after packaging; docs/v0.8.0/evidence/unit-results.txt). New unit files: tests/tactics.test.mjs (15), tests/migration-v071.test.mjs (4), tests/bundle-names.test.mjs (1).

1,656 browser assertions passed across 35 suites, plus the performance suite. No runtime errors were recorded. Summary: docs/v0.8.0/evidence/browser-run-summary.log — 44 suites including the balances, all exit 0.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| hub-doors-e2e (159 doors at three sizes; 12 house clicks) | 171 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e (M01–M03 played through the UI by the policy, new skills included) | 128 | PASS |
| act2-hubs-e2e | 120 | PASS |
| act1-e2e | 113 | PASS |
| frontier-e2e (a bought tool now targeted on Erik) | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| world-e2e | 32 | PASS |
| act2d-campaign-e2e | 30 | PASS |
| class-e2e | 30 | PASS |
| act2-e2e | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2c-campaign-e2e | 26 | PASS |
| **tactics-e2e (new; 1440 and 390 touch):** the three-skill menu, Provoke, Flame Burst with its cross, a herb handed to an adjacent ally, a Powder Bomb thrown (throws 1/3), statuses kept across a reload, the camp merchant's stock and bag 0/8 | 26 | PASS |
| act2-campaign-e2e | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e | 22 | PASS |
| restart-stage | 22 | PASS |
| audio-mute-e2e | 20 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 · v050 · v060 · v061 · v070 | 12 each | PASS |
| **migration-v071 (new):** shipped v0.7.1 HTML saves + v0.7.1-source fixtures → schema 10; the summit camp after ACT II keeps every asset; Erik of a migrated M14 battle has ② 도발 | 12 | PASS |
| migration-v031 · v033 | 11 each | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

Four older suites failed in the full run because their steps still followed the v0.7.1 interface: campaign-e2e (the UI driver did not open the skill menu for a new skill), frontier-e2e (the one-tap tool button is now a targeted tool), gameplay-quality-e2e (the bag held 6) and journey-e2e (the stall sold 3 tools). Their steps were updated and each suite was run again on the same build: all pass. In frontier-e2e an inline `//` comment of the first update hid the rest of its line, so eight checks did not run (96 of 104); the comment was replaced and the suite was run again: 104/104.

## Balance (legal player policy, rules API only, no state edits)
The policy now plays the new skills (② and the recruits' ③); promotion actions and bought tools stay unused as before. Comparison with the v0.7.1 evidence:

| Suite / mission | v0.7.1 | v0.8.0 |
|---|---|---|
| M01 (`test:balance`) | 30 wins, 4–6 turns | 30 wins, 4–6 turns |
| M01–M03 (`test:campaign-balance`) | 30 campaigns, bridge turn 5–9 | 30 campaigns, bridge turn 5–8 |
| Economy (`test:economy-balance`) | 90 victories | 90 victories |
| Promotion trials and drills (`test:class-balance`) | 30/30 each | 30/30 each, identical lines |
| M05 (`test:m05-balance`) | 30/30, broken 25 | 30/30, broken 22 |
| M06 (`test:m06-balance`) | 30/30 | 29/30 (one 17-turn finish; limit 16) |
| ACT I campaign M01 / M02 / M03 | 30/30, avg 5.0 / 3.0 / 5.9 turns | 30/30, avg 5.0 / 3.0 / 5.2 |
| ACT I campaign M04 / M05 / M06 | 30/30, 9.1 / 9.1 / 13.9 | 30/30, 30/30, 29/30, 7.8 / 8.7 / 12.8 |
| ACT II M07 / M08 / M09 | 30/30, avg 7.3 / 7.5 / 7.4 | 29/29, avg 7.0 / 9.0 / 6.1 |
| ACT II M10 support Oswin / Brennan / mediate | 10/10 each, 6.5 / 6.2 / 7.0 | 9/9, 10/10, 10/10, 6.7 / 4.9 / 7.1 |
| ACT II M11 / M12 / M13 / M14 | 30/30, avg 9.6 / 9.5 / 5.0 / 5.7 | 29/29, avg 8.0 / 9.4 / 5.1 / 5.9 |

- ACT II runs 29 campaigns: the one seed whose M06 ran out of turns stops there.
- Story results on those 29: Thea 20, Dario 29, Ines 29 joined. Records copied 28. All four pilgrims through 29. Baldrick halted 5 / broken 24. Betrayer Iron Crown 27 / Sacred Flame 2. Recruit stayed 20 / left 2 / none 7.
- M06 is the tightest mission: in v0.7.1 the slowest seed finished on turn 16 of 16. Its turn limit was not changed.
- With the new skills most missions finish about one turn sooner (M04 −1.3, M09 −1.3, M10 Brennan −1.3, M11 −1.6); M08 is 1.5 turns slower (cause not analysed). Human difficulty is for the user's play-test.

## Save compatibility
- Unit tests (tests/migration-v071.test.mjs): real v0.7.1 schema-9 saves (the summit camp after M14 and a mid-M14 battle, made with the v0.7.1 merge 762bc75) load as schema 10 with completed missions, economy, flags, choices, promotions, trust and roster unchanged. Every hero has ② open, every tool except the Elixir is on sale, the bag fills at 8, and the mid-M14 battle resumes unchanged and is won.
- Browser (tests/migration-v071.mjs): saves made by the shipped v0.7.1 HTML (village and Mission 01 battle) restore with their checkpoint and restart; the source fixtures restore; a reload shows v0.8.0.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.8.0/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two. During packaging the first comparison failed: the font subset script had been run again after the tested build and rewrote `src/assets/AshenUI.woff` with the same glyphs but a new timestamp in its `head` table. The font bytes embedded in the tested HTML were restored into the source; the rebuild is then byte-identical to the tested build.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times (performance numbers are headless: medians 16.7 ms at both sizes).
- Human difficulty with promotion actions and bought tools (the policy does not use them).
