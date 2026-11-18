# Ashen Crown v2.1.0 — 주점과 세계지도
The full four-act, 30-mission campaign (v1.0.0) on the v2.0 battle system (eight classes, six stats, ACT I big maps), with v2.1's feedback pass: duels as story events, the five heroes from the start, taverns and hires, the world map, small villages with requests and a rescued hero.

**v2.1.0 is a release candidate: not merged before the user plays and approves it.** v1.0.0 and v2.0.0 were merged on 2026-11-18 (D-117).

- [Standalone HTML](releases/Ashen_Crown_v2.1.0.html)
- [Source ZIP](releases/Ashen_Crown_v2.1.0_Source.zip)
- [QA report](releases/Ashen_Crown_v2.1.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v2.1.0_SHA256SUMS)
- [Release notes](docs/v2.1.0/RELEASE_NOTES.md) / [v2.1 design](docs/v2.1.0/TAVERN_WORLD_DESIGN.md) / [v2.0 design](docs/v2.0.0/REFORM_DESIGN.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
