# Ashen Crown v0.3.0 — Test Report

2026-10-14. Release Candidate; user review required before main merge.
Baseline: main v0.2.0, PR #5 merged fdcdcc42e3adaca7c961dd76dd51268b358ce08f. Active feature/v0.3-living-frontier.

## Implemented

Hybrid Aren-controlled Ashen Village and Border Camp: WASD/arrows, mouse destination/NPC approach, touch D-pad, solid buildings/NPC collision, camera follow, nearby interactions and visited Fast Travel. Existing Narrative Engine stages original pixel actors/portraits/expressions against Town/Camp backgrounds. New pre-battle scenes, phase/evidence/bond-responsive NPCs, optional newcomer affiliation decisions and M01–03 aftermath. Initial five battle heroes preserved; no new hero/mission.

Gold, class-compatible Weapon/Armor/Accessory, purchase/sell/compare/equip/unequip, instance-based one +1 upgrade. Three purchased usable tools: Medium Potion / Ether / Ward Tonic; six-tool shared cap plus unchanged two free legacy potions. Effective gear stats feed damage/defense/hit/movement/healing without baking into growth. Idempotent atomic transactions rollback on storage failure. Canonical campaign/attempt/practice assets are separated; departure checkpoint restores consumables/Gold/gear on restart/retry. Legacy schema0/1/2→3 retains progress and bounded one-time catchup rewards.

War Council shows mission objectives, terrain and evidence-aware intelligence, roster stats/gear, inventory/readiness. Return to hub before departure; final confirm/cancel before battle. Five original music variants, crossfade/settings, original procedural Aren/NPC/hub/interior artwork and expanded embedded OFL font.

## Executed local verification

| Suite | Result | Evidence |
|---|---:|---|
| Node rules/save/narrative/economy/frontier/documentation | 87 PASS / 0 FAIL | unit.log |
| General file:// desktop + touch browser | 64 PASS | e2e.json |
| Mobile combat / actual v0.1.0–v0.1.3 HTML save imports | 82 PASS | mobile-dock.json |
| Tactical menu / walking / VFX | 26 PASS | tactical-ui.json |
| Post-move attack | 8 scenarios PASS | post-move-attack.json |
| Stage restart / legacy / quota denial | 22 PASS | restart-stage.json |
| HTTP smoke / movement / persistence | 4 PASS | http-smoke.json |
| Actual-control desktop + touch M01→03 campaign | 120 PASS | campaign-e2e.json |
| Frontier/shop/equipment/affiliation/tools UI | 100 PASS | frontier-e2e.json |
| Actual v0.2 completed three-mission HTML save → v0.3 UI restore | 16 PASS | migration-v02.json |
| Original M01 legal-rule balance | 30 wins | balance.json |
| Original complete campaigns | 30 wins, 15 captures, 30 perfect rescues | campaign-balance.json |
| Economy loadouts, 10 seeds each: default/reinforced/purchased tools | 90 mission victories / 30 full campaigns | economy-balance.json |
| Clean Source ZIP + checksums + byte-identical build + unit suite | PASS | source-rebuild.log |

Browser tests use offline Chromium, desktop and touch emulation (390×844, 360×640, 430×932, 844×390 in applicable regression suites). New exploration/shopping uses 1440×1000 and 390×844. Read-only diagnostics choose legal actions; visible map taps/button presses actually execute them. No writable game API or instant-win hook. Unit fixtures change state only for isolated edge-case tests.

Real UI economic evidence includes confirmation cancellation, repeated/double activation, class denial, upgrade cap, insufficient funds, buy/sell spread, save/reload, purchased tool action/buff, stage restart, natural defeat/return and primary-storage-denial rollback. Migration compares all old units and campaign heroes/results/clears/completed/flags/bonds/tacticalMemory, then verifies catchup Gold remains 540 after reload and completed players enter aftermath without mandatory old prologues. Default loadout still completes all missions without shopping. Practice units and canonical assets checked independently.

## Documentation / canon audit

Updated developer entry points, vision, principles, roadmap, Story/Character Bibles, relationships, campaign structure, design docs, decisions and handoff. Added six RPG systems, pre-battle/NPC content docs and plan/test/design review. Preserved 30 mission rows, Erdia/Ashen Crown/잿빛 밤, Aren history, three factions, Baldrick/Bellard, initial five and three endings. Local NPC details remain PROPOSED. Old M04–06 scope moved to v0.4; advanced class v0.5.

## Limits / review

Physical phones, Safari/Firefox and long-term storage eviction remain untested. Music is working original synthesized score, not recorded orchestral production; human pacing/art/listening review remains. Shops use illustrated modals rather than fully walkable interiors. Gear is visible in inventory/comparison; no sprite for every combination. Full advanced classes, other Tier2/3 art, sixth recruit, M04–06 and ACT II–IV are not implemented. M04 is future v0.4, never selectable as playable. Hosted CI and exact final head will be linked on the PR; local results above do not substitute for it.

## Rebuild

Open releases/Ashen_Crown_v0.3.0.html directly. Extract Source ZIP → ashen-crown → node scripts/build.mjs. `python scripts/verify-release.py` checks SHA256, clean reconstruction byte identity and extracted-source unit tests. Source includes original code art/score and existing OFL font/license, no runtime network dependency. Project source license MIT. No borrowed game graphics, dialogue or recordings.

Final hardening adds interrupted affiliation/reload and post-failed-save reload assertions. Final unit count 87; Frontier UI 100; campaign UI 120. Hosted implementation preflight PASS (head 392080d): https://github.com/legendnever-collab/ashen-crown/actions/runs/38564228835. Final current-head results are in PR #6 Checks and its description. Screenshots are in docs/v0.3.0/.
