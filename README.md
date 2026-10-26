# Ashen Crown v0.6.1 — The Three Banners
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, and the first half of ACT II 「세 개의 깃발」: Missions 07–10. After the Ashen Oath the legion marches north to the castle town below Ironhold (M07 북부의 군령, M08 협곡 방어전, Thea), then west to the free city of Velmar: M09 자유의 도시 defends the council's delegates from rooftop assassins, and M10 두 영주의 전쟁 puts the legion between two lords' armies — support one, or mediate by capturing both. Dario, a Velmar sellsword, can join. New in v0.6.1: M09–M10, Velmar in the story, Dario and Riposte, three original ACT II tracks, Velmar city ground.

v0.6.1 approved for merge by the user in chat (2026-10-26 20:22 KST); the PR number, hosted CI run and merge SHA are recorded in the v0.6.1 release notes and on GitHub. v0.6.0 (tag v0.6.0) and earlier features are included and preserved. Next: ACT II part 2 (M11–M14) in v0.7.0.

- [Standalone HTML](releases/Ashen_Crown_v0.6.1.html)
- [Source ZIP](releases/Ashen_Crown_v0.6.1_Source.zip)
- [QA report](releases/Ashen_Crown_v0.6.1_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.6.1_SHA256SUMS)
- [Release notes](docs/v0.6.1/RELEASE_NOTES.md) / [ACT II design](docs/v0.6.0/ACT2_DESIGN.md) / [dialogue script](docs/v0.6.1/DIALOGUE_SCRIPT.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.6.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
