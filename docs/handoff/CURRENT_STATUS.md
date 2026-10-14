# Current Status
Last Updated: 2026-10-14
Current Version: v0.3.0 Release Candidate — The Living Frontier
Baseline main: v0.2.0 fdcdcc42e3adaca7c961dd76dd51268b358ce08f / user-approved merged PR #5.
Active Branch: feature/v0.3-living-frontier
Open PR: [#6](https://github.com/legendnever-collab/ashen-crown/pull/6), unmerged; final current-head CI is authoritative in PR Checks.
Hosted implementation preflight PASS: 392080d5a361bc8b62a42100e6bf8dcc8ba13524, [hosted run](https://github.com/legendnever-collab/ashen-crown/actions/runs/38564228835). Final hardening/assets/docs follow this commit; do not infer final CI from a previous head.
Implemented: Aren-controlled Village/Camp, keyboard/map click/touch movement/collision/camera, visited Fast Travel, NPC/affiliation decisions, expanded staged pre-battle scenes and reactive aftermath, Gold shops / buy-sell / comparisons / equipment / +1 upgrade, three purchased tools and actual combat bonuses, War Council/checklist/return/final confirmation, schema3 migration and canonical/attempt/practice isolation, original audio variants/art/font.
Local verification: 87 unit PASS, 64 general browser, 82 mobile/actual v0.1.x imports, 26 tactical, 8 post-move scenarios, 22 restart, 4 HTTP, 120 full-campaign UI, 100 Frontier UI, 16 actual progressed v0.2 migration checks. 30 M01 balance wins, 30 original complete campaigns, 30 additional economy-loadout campaigns/90 mission victories. Exact evidence docs/v0.3.0 and release Test Report.
Remaining: M04–06 v0.4; advanced classes v0.5; sixth/new recruits, hero-specific full Tier2/3, ACT II–IV. Shops use illustrated modals, no freely walkable interiors or sprite per equipment combination.
Limitations: physical hardware/Safari/Firefox/long-term eviction and subjective story/music quality not verified. Chromium touch emulation is not physical-device proof. No main merge, no GitHub Pages publication.
Release: standalone HTML, Source ZIP, Test Report and SHA256 manifest under releases. Verify clean source with scripts/verify-release.py. Check final head/CI in PR #6 before merge. No writable game debug API.
