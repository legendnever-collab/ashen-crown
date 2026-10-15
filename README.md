# Ashen Crown v0.3.3 — The Hero's Journey
Erik explores town and camp, speaks with comrades and prepares with the Operations Advisor before fighting with the existing five heroes. Front-facing shop doors share a visual/collision anchor. Offline standalone, Missions01–03, classic original pixel art/music. No M04–06.

Current candidate branch: feature/v0.3.3-erik-advisor-campaign, based on unmerged PR8 c0a5fc1. Main remains official v0.3.1; no merge without user play approval. v0.3.2 features are included and preserved.

- [Standalone HTML](releases/Ashen_Crown_v0.3.3.html)
- [Source ZIP](releases/Ashen_Crown_v0.3.3_Source.zip)
- [QA report](releases/Ashen_Crown_v0.3.3_Test_Report.md)
- [SHA256 manifest](releases/Ashen_Crown_v0.3.3_SHA256SUMS)
- [Developer entry](AGENTS.md) / [current status](docs/handoff/CURRENT_STATUS.md) / [plan](docs/v0.3.3/IMPLEMENTATION_PLAN.md)

Play: WASD/arrows or held D-pad. Click map/NPC/door. Approach the visible shop front → Enter/Cancel; inside, talk to the owner for Buy/Sell/Upgrade. Erik is the same eric battle hero, including equipped gear and armor tier. Find the advisor east of the square → briefing → discuss operation → War Council → Free Deployment → confirm battle. Return/cancel preserves position and equipment. M03 aftermath has no unreleased departure.

Save schema6 migrates0–5, including blocked exterior/interior returns and nested battle checkpoints. Gold, growth, inventory, equipment, rewards, story and relationships remain preserved. Text backup/restore in menu. Query ?debugMap=1 enables developer map diagnostics; absent in ordinary play.

Build `npm ci && npm run build`. Verify `npm test`, balance/campaign-balance, browser suites and `python scripts/verify-release.py`. Native phones, other browser engines and storage eviction are not yet verified. Documentation and four-act canon are in docs/.

