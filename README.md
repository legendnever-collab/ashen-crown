# Ashen Crown v0.4.0 — The Broken Allegiance
ACT I complete: Missions 01–06 of the original four-act, 30-mission campaign. Erik explores town and camp, meets Lia at her war table for each operation (briefing → War Council with sortie board → Free Deployment) and fights with the five heroes. New in v0.4.0: M04 The Abandoned Fortress (investigation and evidence), M05 The Lion of the Frontier (Baldrick Roen's lion formation, two withdrawal victories), M06 The Ashen Oath (three-phase finale, the Ashen Oath choice and the ACT I completion card), painted dialogue busts and map sprites, classic dialogue window, sortie selection, and mobile battle commands.

Official release v0.4.0 on main (tag v0.4.0), merged after the user played and approved the release candidate (2026-10-19 KST). v0.3.2/v0.3.3 features are included and preserved. Next: v0.5.0 Advanced Class & Character Progression; ACT II is not started.

- [Standalone HTML](releases/Ashen_Crown_v0.4.0.html)
- [Source ZIP](releases/Ashen_Crown_v0.4.0_Source.zip)
- [QA report](releases/Ashen_Crown_v0.4.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.4.0_SHA256SUMS)
- [ACT I balance report](docs/v0.4.0/ACT1_BALANCE_REPORT.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.4.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
