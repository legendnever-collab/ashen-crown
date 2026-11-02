# Ashen Crown v0.8.1 — Arms (무기)
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, and all of ACT II 「세 개의 깃발」: Missions 07–14. v0.8 raises the game before ACT III (D-073, benchmarking 삼국지 조조전). v0.8.0 「전술」 gave every hero three skills, four status effects, thrown and shared tools and class matchups. v0.8.1 「무기」 adds the arms: each town sells its own gear (Ironhold's castle town, Velmar, the pilgrim village; locked pieces show what opens them, a premium piece from the first visit, elite gear at faction trust 2, Velmar's rare-goods shelf), the towns passed can be revisited from the world map, gear grows by use (★1–3, treasures ★1–5) and the forge's 단련 fills a star, every mission has a hidden objective (숨은 전과) that wins one of twelve treasures (a fourth equipment slot), one enemy per battle carries supplies, and critical hits and ③ skills show a cut-in.

**v0.8.1 is a release candidate: not merged before the user plays and approves it.** v0.8.0 was merged on 2026-11-01 (D-075, PR #16 → 7b8b2e8). Earlier features are included and preserved. Next: ACT III 「왕관의 진실」 on the user's instruction.

- [Standalone HTML](releases/Ashen_Crown_v0.8.1.html)
- [Source ZIP](releases/Ashen_Crown_v0.8.1_Source.zip)
- [QA report](releases/Ashen_Crown_v0.8.1_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.8.1_SHA256SUMS)
- [Release notes](docs/v0.8.1/RELEASE_NOTES.md) / [v0.8 design](docs/v0.8.0/GAMEPLAY_DESIGN.md) / [item, skill and status catalog](docs/v0.8.0/ITEM_CATALOG.md) / v0.8.0: [release notes](docs/v0.8.0/RELEASE_NOTES.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.7.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
