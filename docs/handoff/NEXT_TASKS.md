# Next Tasks
1. v0.7.1 release candidate (feature/v0.7.1-lion-and-alliance): send the build, open the PR (CI), never merge before the user plays and approves it. After approval record the PR, CI run and merge SHA in docs/v0.7.1/RELEASE_NOTES.md.
2. Art work pack D (28 images) when the user returns it: import and replace the temporary pilgrim village painting and procedural cast (Lucien, Ines, Cassian/Leonora map sheets, flame knight, pilgrim, ash raider, monastery guard, abbot, masked raider).
3. Play-test watch items for v0.7.1: M13 persuasion pacing (resolve sources, threshold 6, TURN 5 lion hold), M14 leader escort difficulty and betrayal fairness, recruit departure rule.
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
