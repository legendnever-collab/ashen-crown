# Next Tasks
0. On feature/act3-f2-art-pack (PR #20): the v0.9.1 play-test fixes (D-087) and ACT III art pack F2 imported (D-088) — every v0.9.1 placeholder image is painted. The user plays the rebuilt v0.9.1 and approves before merging. Next art: pack F3 with v0.9.2 (Lia and Kai awakened, the teacher, the old superior, the rite knights; ACT3_DESIGN.md §10), written when v0.9.2 exists.
1. Art: pack D is imported in the v0.9.1 release candidate (D-085; deviations listed there for a retouch). ACT III pack F1 is imported too (D-086: the capital hub, six rooms, chests, the archivist and Bellard busts, six sheets, sheet H icons via `scripts/import-item-art.py <pack> --cells docs/v0.9.0/art/act3-f1-work-pack/cells.csv`). Next art: ACT III packs F2–F4 (the keep, the forest village, statues, trees, awakened looks, the ④ skill and v0.9.1 treasure icons) — work packs still to be written.
2. Next on the user's instruction: v0.9.2 「그림자」 (M19–M20, Lia's and Kai's awakening, rite circles, the spreading fire, Bellard, duel 2, 「한 사람도 두고 가지 않는다」); art pack F2 (v0.9.1 cast and places) can be made now that M17–M18 exist.

Previous (v0.9.0, merged 2026-11-05 PR #18 → 45d5c0a, D-082):
1. v0.9.0 「왕도」 release candidate (D-080): the user plays it; merge only on approval, then record the merge SHA and main CI in docs/v0.9.0/RELEASE_NOTES.md. Tags and Releases only when the user asks.
2. Play-test watch items: ACT III enemy strength against a human-raised legion (numbers set to the balance party: Lv 9–18), the M15 clerk race (two tiles a turn from TURN 1) and the watch rule, M16 fog readability, harvest MP −3, duel odds, returning recruits.
3. Next on the user's instruction: v0.9.1 「수호자」 — M17 수호자의 맹세, M18 불타지 않는 숲, awakening (Tier 3 ④ for Erik, Elina, Sain), recruits' Tier 2, rain, guardian statues, guardians' keep and forest village hubs, Aren's 「나아가라」.
4. Art: pack E (102 icons) arrived on 2026-11-04 and is imported in the v0.9.0 release candidate (D-081; deviations A10, F12, C09 listed for a retouch). Still with the user: pack D (ACT II cast) and the ACT III art (design §10, F1–F4), including icons for the capital's six tier III pieces and the two v0.9.0 treasures; until then temporary art, never labelled finished.

Previous (ACT III design, 2026-11-03):
0. ACT III design (D-078, docs/v0.9.0/ACT3_DESIGN.md): approved with the recommended answers and temporary art (D-079).
1. v0.8.1 merged (PR #17, D-077): record the merge SHA and the main CI run in docs/v0.8.1/RELEASE_NOTES.md at the start of the next branch. Tags and GitHub Releases only when the user asks.
2. Art work pack E (102 icons): the user returns it after 2026-11-04 (ChatGPT limit); verify and import with `python3 scripts/import-item-art.py <zip>` (src/assets/items, 128-px WebP; the build embeds them and itemIcon prefers them), check the QA log, rebuild and rerun the browser suites; never label the temporary icons finished.
3. Play-test watch items for v0.8.1: hidden-objective difficulty (policy rates in test-output/act2-balance.json featRate), treasure power (Twin Daggers, Shield of Silence, Wind Horseshoe), town prices and unlock pacing, how often players revisit.
4. Next on the user's instruction: ACT III 「왕관의 진실」 design (M15–M22), returning recruits who left after M14, awakening (Tier 3).

Previous (v0.8.0, merged 2026-11-01 PR #16 → 7b8b2e8):
1. v0.8.0 merged (PR #16, D-075): record the merge SHA and the main CI run in docs/v0.8.0/RELEASE_NOTES.md at the start of the next branch. Tags and GitHub Releases only when the user asks.
2. v0.8.1 「무기」 (D-073 Q5/Q6, §6): regional and elite gear (catalog-v08.js tiers II–III, recruit gear), unlocks by mission and trust, the rare-goods shelf, revisiting towns from the world map, gear growth ★ and 단련, treasures and one hidden objective per mission (practice replays win them once), supply-wagon drops, cut-ins.
3. Art work pack E (102 icons, seven sheets) when the user returns it: cut with an import script and replace the SVG icons (never label the temporary icons finished).
4. Art work pack D (28 images) when the user returns it: import and replace the temporary pilgrim village painting and procedural cast (Lucien, Ines, Cassian/Leonora map sheets, flame knight, pilgrim, ash raider, monastery guard, abbot, masked raider).
5. Play-test watch items for v0.8.0: new-skill power (Flame Burst, Provoke), status frequency from ACT II enemies, throw limit, M06 turn margin. v0.7.1 items: M13 persuasion pacing (resolve sources, threshold 6, TURN 5 lion hold), M14 leader escort difficulty and betrayal fairness, recruit departure rule.
4. Next on the user's instruction: ACT III 「왕관의 진실」 design (M15–M22), returning recruits who left after M14, awakening (Tier 3).
5. Physical phones, other browser engines and long-term storage eviction remain unverified.

Previous (v0.7.0, merged 2026-10-27 PR #14 → 81f11d3):
1. v0.7.0: merge approved by the user (2026-10-27 06:16 KST, D-070). Record the merge SHA and main CI in docs/v0.7.0/RELEASE_NOTES.md; tag/Release only when the user asks. v0.7.1 (M13–M14) in development on feature/v0.7.1-lion-and-alliance.
2. Art work pack D (28 images, docs/v0.7.0/art/act2b-work-pack): when the user returns the zips, verify SHA256, import busts/sheets (scripts/import-art.py) and the pilgrim village with its 8 rooms and chest sheet (scripts/import-interior-art.py), author the walk masks over the new painting, and drop the dusk-tinted Ashen Village fallback.
3. Play-test watch items for v0.7.0: M11 pacing (policy wins in 8–10 turns, all four pilgrims in 17/30), M12 stealth difficulty (the policy never triggers the bell before the ledger), Ines's Sanctuary numbers, light hit modifiers (+10 / −15).
4. Next on the user's instruction: v0.7.1 — M13 검은 사자의 결단 (persuasion, resolve threshold 6), M14 부서진 동맹 (betrayal at TURN 4, recruits of the betraying faction may leave), ACT II completion card, one track (검은 사자의 결단). Awakening (Tier 3) not started.
5. Physical phones, other browser engines and long-term storage eviction remain unverified.

Previous (v0.6.1, merged):
1. v0.6.1 The Three Banners: the user approved merging the release candidate in chat on 2026-10-26 20:22 KST. After the merge, record the PR number, hosted CI run and merge SHA (docs/v0.6.1/RELEASE_NOTES.md, GitHub); publish tag v0.6.1 and the GitHub Release only when the user asks (a one-time Actions workflow, as for v0.5.0 and v0.6.0, because the session cannot push tags).
2. Play-test watch items: M09 delegates (the legal policy saves all three in every seed), M10 stance balance (support 5–8 turns, mediation 7), Dario joins in every policy run, M07 convoy pacing, D-045 level-relative EXP (PROPOSED) — adjust only with the user's feedback.
3. In progress (2026-10-26 23:34 KST, user: "설계안 시작해줘"): v0.7 design proposal docs/v0.7.0/ACT2B_DESIGN.md on feature/v0.7-flame-and-lion — waiting for answers to Q1–Q5; no code before approval.
4. Then: v0.7.0 ACT II part 2 — M11 성화의 행렬, M12 침묵의 수도원, M13 검은 사자의 결단, M14 부서진 동맹 (Order of the Sacred Flame, Sain's past, Baldrick's decision); design and approval questions first; awakening (Tier 3) only on the user's instruction.
5. Physical phones, other browser engines and long-term storage eviction remain unverified.
