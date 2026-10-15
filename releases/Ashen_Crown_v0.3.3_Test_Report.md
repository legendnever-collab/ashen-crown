# Ashen Crown v0.3.3 — The Hero's Journey / QA Report
Updated2026-10-16 KST. Candidate only; user play approval required. Main and PR8 were not merged.

Baseline main b826c49851596398967b36d517270a3f556df94c; PR8 c0a5fc1fdfe6b64c58815c0c4a189e5bbd46a29d (unmerged). Source checkpoint afb28564f8cb1dfda3ed930f824a57af70761ea1. Final artifacts/evidence are added in the release packaging commit; see PR for exact final HEAD and CI. Original v0.3.2 CI success does not stand in for new validation.

HTML SHA256: `672a24e9c675f0eccb7f812732149df9a93254b2e77ec68bb0b9ad73092538a1`

## Outcome
Shared door anchors fix half-tile facade/trigger mismatch and rear activation. Existing council API is restored and guarded; stable eric explores and fights, Aren keeps command and his past. Advisor dialogue opens council/deployment through existing battle APIs. Quest summary was proven to intercept the landscape shop doorway, and now lives outside the map. No additional missions or tactical engine rewrite.

## Executed validation
112 unit PASS /0 FAIL. 898 browser/scenario assertions PASS;0 recorded runtime errors,0 external asset requests. Headless Chromium, offline file URLs and HTTP smoke. Touch emulated at390×844/360×640/430×932 and landscape844×390 where suites specify. Final screenshots are from the manifest HTML; local suites ran incrementally during v0.3.3 implementation. CI on the final PR tree reruns every listed suite and is authoritative for exact final-build coverage.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 206 | PASS |
| gameplay-quality-e2e | 92 | PASS |
| frontier-e2e | 102 | PASS |
| renaissance-e2e | 137 | PASS |
| campaign-e2e | 126 | PASS |
| e2e | 60 | PASS |
| mobile-dock | 80 | PASS |
| tactical-ui | 26 | PASS |
| http-smoke | 4 | PASS |
| post-move-attack | 8 | PASS |
| restart-stage | 22 | PASS |
| migration-v02 | 16 | PASS |
| migration-v031 | 10 | PASS |
| migration-v032 | 9 | PASS |

4 performance samples: median~16.7ms, p95~16.7–16.8ms in the local headless environment; not a physical-device benchmark.

210 legal-policy mission victories:30 M01 baseline runs +90 missions in30 complete standard campaigns +90 economy/loadout missions. Standard campaign:30 full rescues,15 selected captures; M03 completes5–8 turns against unchanged ten-turn deadline. Battle rewards/recovery, continuous keyboard/touch hold, shop services/atomic auto-equip/storage-failure rollback, practice isolation and restart are preserved.

## Save compatibility
Actual shipped v0.3.1/v0.3.2 equipped interiors and battle checkpoints import through visible backup UI, preserving units/assets. v0.3.2 blocked War Room position fixture recovers and departs via advisor with its equipment. Actual v0.2 complete campaign and v0.1.x browser saves migrate; schema0–5 unit migration/nested checkpoints also pass. Complete timeline backups preserve their own reward claims, not a server-wide anti-rollback ledger.

## Packaging / documentation
Standalone has embedded code/art/fonts/music and no external runtime files. `npm run build` regenerates it; `python scripts/verify-release.py` checks text+JSON hashes, exact ZIP/current-tree source/docs/evidence coverage, clean byte-identical rebuild and unit tests. No personal advisor lore is canonized. D-031/032 are user-approved changes, existing D-014/015 IDs were occupied. Original four acts/30 missions, Aren's past and relationships remain intact.

## Limits / next
Physical phones, Safari/Firefox and long-term browser storage eviction unverified. Small landscape preparation/council panels require scrolling. M04–06 and playable promotions are intentionally absent. v0.4 can begin after user approval, covering The Broken Allegiance/Baldrick/royal supply/ACT I ending. Neither main nor PR8 is auto-merged.

Evidence: docs/v0.3.3/evidence and screenshots. CI status and final commit: GitHub PR checks on feature/v0.3.3-erik-advisor-campaign.
