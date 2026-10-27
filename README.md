# Ashen Crown v0.7.1 — The Three Banners
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, and all of ACT II 「세 개의 깃발」: Missions 07–14. After the Ashen Oath the legion marches north to the castle town below Ironhold (M07–M08, Thea), west to Velmar (M09–M10, Dario) and south to the Order of the Sacred Flame (M11–M12, Ines). In M13 검은 사자의 결단 Baldrick comes to break up the refugee camp — persuade him or break his lion formation — and in M14 부서진 동맹 the three leaders' first summit is attacked by masked raiders while the banner that trusts the legion least turns on it. New in v0.7.1: M13–M14, the persuade action, betrayal and recruits who may leave, the ACT II completion card, one original track, a fix that shows 생포 wherever a mission allows capture, and a fix for music still faintly audible when muted.

v0.7.1 was played and approved by the user (2026-10-27, D-072) with one fix: music Mute, BGM 0 and Music Pause are now fully silent. Merged via PR #15. v0.7.0 (merged 2026-10-27, PR #14) and earlier features are included and preserved. Next: ACT III 「왕관의 진실」 on the user's instruction.

- [Standalone HTML](releases/Ashen_Crown_v0.7.1.html)
- [Source ZIP](releases/Ashen_Crown_v0.7.1_Source.zip)
- [QA report](releases/Ashen_Crown_v0.7.1_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.7.1_SHA256SUMS)
- [Release notes](docs/v0.7.1/RELEASE_NOTES.md) / [ACT II part 2 design](docs/v0.7.0/ACT2B_DESIGN.md) / [dialogue script](docs/v0.7.1/DIALOGUE_SCRIPT.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.7.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
