# Ashen Crown v0.8.0 — Tactics (전술)
ACT I (Missions 01–06 of the original four-act, 30-mission campaign) with promotions, and all of ACT II 「세 개의 깃발」: Missions 07–14. v0.8.0 raises the tactics before ACT III (D-073, benchmarking 삼국지 조조전): every hero now has three skills (a new one at Lv 4, recruits on joining), four status effects (poison, confusion, bind, silence), tools that heal an adjacent ally or are thrown 2–3 tiles (Powder Bomb, Smoke Bomb, Weighted Net, Bewildering Powder, Caltrops, War Drum; three throws a battle, bag 8), and class matchups (cavalry → infantry → archers → cavalry). Regional gear, revisiting towns, gear growth and treasures follow in v0.8.1.

v0.8.0 was approved for merge by the user on 2026-11-01 (D-075, PR #16). v0.7.1 (merged 2026-10-27, PR #15 → 762bc75) and earlier features are included and preserved. Next: v0.8.1 「무기」, then ACT III 「왕관의 진실」 on the user's instruction.

- [Standalone HTML](releases/Ashen_Crown_v0.8.0.html)
- [Source ZIP](releases/Ashen_Crown_v0.8.0_Source.zip)
- [QA report](releases/Ashen_Crown_v0.8.0_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.8.0_SHA256SUMS)
- [Release notes](docs/v0.8.0/RELEASE_NOTES.md) / [v0.8 design](docs/v0.8.0/GAMEPLAY_DESIGN.md) / [item, skill and status catalog](docs/v0.8.0/ITEM_CATALOG.md) / v0.7.1: [release notes](docs/v0.7.1/RELEASE_NOTES.md), [dialogue script](docs/v0.7.1/DIALOGUE_SCRIPT.md)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.7.0/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad in town; click map/NPC/door. Talk to Lia's war table to start the next operation; in the War Council drag heroes between reserve and sortie (or select + arrow; Erik always deploys), then place them on the blue tiles. In battle tap a hero → 이동/공격/스킬/도구/대기/상태; 이동 shows the reachable cells; tap a target to preview and tap it again (or 행동 확정) to act.

Save schema 7 migrates 0–6 (real v0.3.3 saves are tested: village, mid-battle, M03 aftermath). Gold, growth, inventory, equipment, rewards, story flags, choices and relationships are preserved. Text backup/restore in the menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, the balance scripts (balance, campaign-balance, m05/m06/act1-balance), the browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.
