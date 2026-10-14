# Ashen Crown v0.3.1 — Test Report

2026-10-14 · Classic SRPG Renaissance · Release Candidate

## Baseline and dependency
Verified main fdcdcc42e3adaca7c961dd76dd51268b358ce08f (v0.2). PR #6 remains unmerged at development start; its v0.3 head 461abfddd0a3a84a224781cff022dd58cc9afc5f passed hosted CI 38565695436 / 38565689422. Branch feature/v0.3.1-classic-srpg-renaissance is stacked on that head. No merge performed/authorized. Exact new-head hosted status is maintained in PR Checks and PR body; local results below do not imply a hosted pass.

## Implemented changes
Walkable forge/item interiors, owners/counters/exits and durable return coordinates; weapon-first compatible hero comparison and atomic buy/equip; in-place NPC/battle portrait dialogue/copy review; no council readiness checkboxes; collapsible persistent Quest with informational click-through body; immediate legal movement and target-protecting contextual commands; distinct architecture, variable maps/camera/minimaps; native 128 tile/sprite detail/256 portraits; animated burning and charred village; class MOV 2/3/3/3/4, terrain profiles/allied traversal/future mounted metadata. Three missions, growth, audio and canon preserved.

## Executed local verification

| Suite | PASS | FAIL |
|---|---:|---:|
| Unit / documentation / invariant | 95 | 0 |
| General browser/offline/recovery | 60 | 0 |
| Mobile/touch and actual v0.1.0–0.1.3 imports | 80 | 0 |
| Tactical animation/VFX/confirmation | 26 | 0 |
| Post-move melee/archer scenarios (four viewports) | 8 | 0 |
| Stage restart/defeat/legacy/storage failure | 22 | 0 |
| Actual M01–03 campaign controls (desktop/touch) | 118 | 0 |
| Frontier/recruitment/economy/storage failure | 102 | 0 |
| Renaissance UI/resolution/shop/camera (four viewports) | 109 | 0 |
| Actual progressed v0.2 campaign import | 16 | 0 |

Total: **95 unit checks + 541 browser/scenario checks**, zero recorded runtime errors and zero external runtime requests. Node test and browser suite counts are separate. Original v0.2 source/rules fixtures are retained for playing the actual older HTML, avoiding use of new geometry/rules in old-save generation.

Balance: 30 M01 victories across recommended/assault/defense, 30 standard complete campaigns (90 mission wins), plus 30 complete campaigns across standard/reinforced/purchased tools (90 mission wins): **210 mission victories**. Standard bridge completion 5–10 turns; 10-turn deadline unchanged. Optional prisoner branch verified alongside non-capture progression. Natural defeat, retry and rollback remain possible; these policy results are not a guarantee every strategy wins or all heroes survive.

## Resolution and native art
Measured standard desktop at viewport 1440×1000/DPR1: v0.3 battle 1440×695 = 1,000,800 pixels; v0.3.1 CSS 1440×689, buffer 3024×1447 = 4,375,728 pixels: **4.372×**. Terrain caches draw at native 128; half-world-pixel seams/facial/weapon detail extend procedural sprites to native128; portraits draw at256 with additional face/hair/garment detail. New architecture/shelves/furnace/fire/terrain changes are visible; not just CSS or DPR enlargement. Pixelated rendering and no smoothing retained; fractional zoom can have unequal physical pixel widths.

Viewports executed: 1440×1000/DPR1, 1440×900/DPR2, 390×844/DPR2 and 844×390/DPR1; additional battle touch views 360×640 and430×932. Camera follows/focus/pan/zoom/fit and real two-finger pinch, boundaries and target input verified. Quest body and popup sprite-edge overlap never imply a blocked target center.

## Frame samples
Software Chromium133, 60 requestAnimationFrame samples per scene, pipe-only local runner; medians near60Hz. These are synthetic renderer observations, not physical-phone performance claims.

| Viewport | Scene | Median | P95 |
|---|---|---:|---:|
| 1440×900 | town | 16.7 ms | 16.8 ms |
| 1440×900 | battle | 16.7 ms | 33.3 ms |
| 390×844 | town | 16.7 ms | 16.8 ms |
| 390×844 | battle | 16.7 ms | 16.8 ms |

## Save / transaction compatibility
Schema0–3→4 preserves raw earned growth/XP/clues/appearance, results, flags/bonds, gear/Gold and stage checkpoints. Base class MOV intentionally rebalanced; gear remains additive and not baked into growth. Interior and doorway/facing survive reload. Nonce double-click rejection and failed-save rollback verified through real UI; atomic purchase creates/equips exactly one instance. Practice remains isolated; restart/retry restores departure inventory. Actual v0.1.x battle backups and fully progressed actual v0.2 campaigns imported through paste/restore.

## Visual review
23 before/after/current screenshots under docs/v0.3.1/screenshots (desktop/touch town, shops, comparisons, dialogues, contextual commands, each mission, burned village). Direct comparison with the six referenced Cao Cao screenshots cannot be claimed because those files were not attached here; original assets only. Traceability and visual review identify limitations.

## Reproduction and hosted checks
Run npm ci, npm test, test:balance, test:campaign-balance, test:economy-balance, npm run build, scripts/verify-release.py and the browser scripts in .github/workflows/ci.yml. Source ZIP extraction must regenerate byte-identical HTML and pass units; SHA256 manifest covers HTML/ZIP/this report. The release pipeline includes HTTP smoke on GitHub Actions; local socket restrictions prevented local HTTP serving, so local HTTP PASS is not claimed. Exact-head hosted Checks are authoritative.

## Known scope limits
Real phones/Safari/Firefox, long-term browser storage eviction and human story/music/art preferences remain unverified. Context menus can move away from the actor in tightly crowded views to keep target centers clickable. Legacy battle core/deployment/safe-zone coordinates preserved; new appendages are conservative rather than a full campaign geography replacement. Flame/smoke/embers are visual only, with no damage/spread. Native fine detail supplements established procedural silhouettes, not a wholly new hand-painted sprite catalogue. Future mounted class is metadata; playable promotions and sixth recruits not available. M04–06 remain v0.4; full class progression v0.5. No main merge or publishing.
