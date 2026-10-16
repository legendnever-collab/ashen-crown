# Current Status
Updated 2026-10-16 KST. Current Version: v0.3.3 — The Hero's Journey (official release).
User play validation: complete. The user play-tested v0.3.3, judged gameplay satisfactory, and approved in chat (2026-10-16 16:31 KST) merging PR9, tagging/publishing v0.3.3 and recording it as the official release.

main: v0.3.2 PR8 merged at 4a66a2f53c94ee98d97f47d90033c0598c7d0ea5 (push CI 38863433099 success 4/4). v0.3.3 PR9 merged on top; the final merge SHA, tag v0.3.3 and GitHub Release are recorded in the v0.3.3 GitHub Release notes and docs/v0.3.3/RELEASE_FINALIZATION.md.
PR9 source head c87be4293bddfc60c1ea90c27bf728fbe53c6039 passed hosted CI 38863386451 (4/4); its merge tree onto main equals the CI-tested tree c0c95f414757ae314ee7c6e7c0e21cea65f836c1. Finalization changes documentation and the Source ZIP/SHA256 manifest only; the standalone HTML is byte-identical (SHA256 672a24e9c675f0eccb7f812732149df9a93254b2e77ec68bb0b9ad73092538a1).

Implemented (v0.3.3): shared shop door anchors/front-only confirmation, command input settling, shared council API, Erik exploration using battle entity/armor tier, Aren NPC commander, advisor mission-aware briefings → War Council → Free Deployment, schema6 legacy spatial migration. v0.3.2 economy/recovery/rewards/tactical engine preserved.
Validation: 112 unit / 898 browser-scenario / 210 legal mission victories (hosted CI on the final tree). Finalization re-executed locally: 112 unit, byte-identical rebuild, verify-release, journey 206, migration-v032 9, migration-v031 10, gameplay-quality 92 — all PASS.

Known limits: physical phones, Safari/Firefox, long-term storage eviction unverified. release-v031.yml is a historical v0.3.1-only publisher that no-ops for later versions; v0.3.3 assets were published directly after exact-main CI and checksum verification. v0.3.2 has no separate tag/release (not requested).
Next: v0.4.0 The Broken Allegiance (M04–06) on feature/v0.4-the-broken-allegiance. No merge before user play approval.

## v0.4.0 The Broken Allegiance — in progress (2026-10-16 KST)
v0.3.3 publication verified: main 105148e1f4e94502389f1570fc9c966907a96ce8 (PR9 merge), main CI Game validation success, tag/Release v0.3.3 with HTML/Source ZIP/Test Report/SHA256SUMS; release asset SHA256 digests equal the repository manifest.
Branch feature/v0.4-the-broken-allegiance created from 105148e. Phase B (design only, no code) committed: docs/v0.4.0/ACT1_NARRATIVE_DESIGN.md, IMPLEMENTATION_PLAN.md, TEST_MATRIX.md and docs/story/act1/MISSION_04–06.md. All new story details are PROPOSED; user approval questions Q1–Q5 are pending. No tests have been executed for v0.4 yet. The v0.3.3 Source ZIP intentionally does not cover the new design docs until Phase G repackaging.

### Phase C — M04 The Abandoned Fortress (implemented, 2026-10-16 KST)
Version 0.4.0, save schema 7 (imports 0–6). Mission hook engine (src/core/mission-rules.js) is used only by M04+; M01–03 paths are unchanged and their balance (30 runs) and campaign-balance (30 campaigns) outputs are byte-identical to docs/v0.3.3/evidence.
Executed locally (headless Chromium 1194, v0.4.0 build): 122 unit PASS; act1 53, journey 212, gameplay-quality 92, migration-v031 10, migration-v032 9, frontier 102, renaissance 137, e2e 60, mobile-dock 80, tactical 26, http 4, post-move 8, restart 22, campaign 126, economy-balance 90 legal victories, migration-v02 16 — all PASS. Performance: 390px p95 16.8 ms; 1440px p95 33.4 ms, identical to the v0.3.3 build measured in the same environment.
M04 legal-policy simulation (30 seeds through M01–M04): 30/30 victories, turns 4–9 (avg 6.1), surviving heroes 3–5 (avg 3.8). Balance tuning is a Phase F item.
Not yet done: M05, M06, ACT I completion, Phase F six-mission balance and v0.3.3 save-fixture migration test, Phase G packaging (the v0.3.3 Source ZIP/CI pin are still the release pins on this branch).

### Benchmark pass B1 (controls/bugs) — implemented 2026-10-16 KST
User feedback #2 #5 #6 #8 #10 #11 implemented (D-038–040 recorded). Balance re-baselined per D-039: M01 balance 30/30 wins (turns 3–6), campaign-balance 30/30 (capture 15, perfect rescues 30, bridge turns 5–8), economy-balance 90 legal victories. Browser suites re-run and passing: act1 53, journey 212, quality 95, frontier 102, renaissance 137, tactical 26, e2e 60, mobile 80, campaign 124 (two conditional Sain-forecast checks are no longer reached by the policy path), restart 22, http 4, migration-v02 16 / v031 10 / v032 9. 123 unit PASS.

### Benchmark pass B2 (systems) — implemented 2026-10-16 KST
Enterable buildings + seeded chests, terrain aptitude/modifiers/fire, unit sheet, turn display (docs/v0.4.0/BENCHMARK_PASS.md). 126 unit PASS. Browser: quality 95, frontier 102, tactical 27, e2e 64, journey 212, act1 53, renaissance 137, mobile 82, campaign 128, restart 22, http 4, post-move 8, migration-v02 16 / v031 10 / v032 9 — all PASS. Balance: M01 30/30, campaign 30/30, economy 90/90, M04 30/30.
Next: B3 dialogue rewrite + Lia as strategist (D-038), then B4 graphics sample for approval.
