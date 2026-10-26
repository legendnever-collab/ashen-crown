# Ashen Crown v0.7.0 — The Three Banners
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, and ACT II 「세 개의 깃발」 Missions 07–12. After the Ashen Oath the legion marches north to the castle town below Ironhold (M07–M08, Thea), west to the free city of Velmar (M09–M10, Dario), then south to the Order of the Sacred Flame: M11 성화의 행렬 escorts pilgrims along a night road lit by braziers, and M12 침묵의 수도원 sneaks past watching guards to save the monastery's records before the abbot burns them. Ines, the Order's pilgrim warden, can join. New in v0.7.0: M11–M12, the pilgrim village (temporary painting until art pack D), light and stealth rules, Ines and Sanctuary, Sain's past, two original tracks.

v0.7.0 approved for merge by the user in chat (2026-10-27 06:16 KST) after receiving the release candidate (design D-068, details D-069, approval D-070); the merge SHA is recorded in the v0.7.0 release notes and on GitHub. v0.6.1 and earlier features are included and preserved. Next: M13–M14 and the ACT II completion in v0.7.1.

- [Standalone HTML](releases/Ashen_Crown_v0.7.0.html)
- [Source ZIP](releases/Ashen_Crown_v0.7.0_Source.zip)
- [QA report](releases/Ashen_Crown_v0.7.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.7.0_SHA256SUMS)
- [Release notes](docs/v0.7.0/RELEASE_NOTES.md) / [ACT II part 2 design](docs/v0.7.0/ACT2B_DESIGN.md) / [dialogue script](docs/v0.7.0/DIALOGUE_SCRIPT.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.7.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
