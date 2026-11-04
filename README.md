# Ashen Crown v0.9.0 — The Capital (왕도) · ACT III part 1
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, all of ACT II 「세 개의 깃발」 (Missions 07–14), the v0.8 game pass (three skills per hero, status effects, tools, class matchups, regional gear, gear stars, treasures and hidden objectives) and now the start of ACT III 「왕관의 진실」 (D-078/D-079, docs/v0.9.0/ACT3_DESIGN.md): Mission 15 사라진 기록 — a chase through the capital's lower city after three clerks carrying the Ashen Night's records, with a neutral royal watch that turns hostile if the legion fights beside it twice — and Mission 16 잊힌 전장 — the first weather (fog), ward stones that hold a battlefield's lost memories, memory harvesters, the first 일기토 (duel) and the return of recruits who left after M14. Aren gives a pre-battle command (「지켜라」), the sortie grows to seven, and the capital's forge sells six tier III pieces.

**v0.9.0 is a release candidate: not merged before the user plays and approves it.** v0.8.1 was merged on 2026-11-03 (D-077, PR #17 → 534a25d). New places, characters and enemies use temporary art (packs D, E and the ACT III art come later together). Earlier features are included and preserved. Next: v0.9.1 「수호자」 (M17–M18, awakening) on the user's instruction.

- [Standalone HTML](releases/Ashen_Crown_v0.9.0.html)
- [Source ZIP](releases/Ashen_Crown_v0.9.0_Source.zip)
- [QA report](releases/Ashen_Crown_v0.9.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.9.0_SHA256SUMS)
- [Release notes](docs/v0.9.0/RELEASE_NOTES.md) / [ACT III design](docs/v0.9.0/ACT3_DESIGN.md) / [dialogue script](docs/v0.9.0/DIALOGUE_SCRIPT.md) / v0.8.1: [release notes](docs/v0.8.1/RELEASE_NOTES.md) / [v0.8 design](docs/v0.8.0/GAMEPLAY_DESIGN.md) / [item catalog](docs/v0.8.0/ITEM_CATALOG.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.7.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
