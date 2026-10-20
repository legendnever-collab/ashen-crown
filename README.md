# Ashen Crown v0.5.0 — Ranks of the Ashen Legion
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) plus Advanced Class & Character Progression. After the Ashen Oath, Aren's rite promotes each hero (Guardian Knight, Ranger, Arcanist, Ember Cleric, Shadowblade) through a trial battle that teaches a new tactical action; the Legion Drill trains the rest. New in v0.5.0: promotions with potential and proficiency, the world map of Erdia, six painted interlude hubs (village, garrison, night bivouac with a wandering merchant, reclaimed fortress, oath camp), promotion presentation and five new original tracks.

v0.5.0 release candidate approved for merge by the user in chat (2026-10-20 20:45 KST); the PR number, hosted CI run and merge SHA are recorded in the v0.5.0 release notes and on GitHub. v0.4.0 (tag v0.4.0) and earlier features are included and preserved. ACT II is not started.

- [Standalone HTML](releases/Ashen_Crown_v0.5.0.html)
- [Source ZIP](releases/Ashen_Crown_v0.5.0_Source.zip)
- [QA report](releases/Ashen_Crown_v0.5.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.5.0_SHA256SUMS)
- [Release notes](docs/v0.5.0/RELEASE_NOTES.md) / [promotion design](docs/v0.5.0/CLASS_PROGRESSION_DESIGN.md) / [world map & hubs](docs/v0.5.0/WORLD_MAP_AND_HUBS.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.5.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
