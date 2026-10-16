# Current Status
Updated 2026-10-16 KST. Current Version: v0.3.3 — The Hero's Journey (official release).
User play validation: complete. The user play-tested v0.3.3, judged gameplay satisfactory, and approved in chat (2026-10-16 16:31 KST) merging PR9, tagging/publishing v0.3.3 and recording it as the official release.

main: v0.3.2 PR8 merged at 4a66a2f53c94ee98d97f47d90033c0598c7d0ea5 (push CI 38863433099 success 4/4). v0.3.3 PR9 merged on top; the final merge SHA, tag v0.3.3 and GitHub Release are recorded in the v0.3.3 GitHub Release notes and docs/v0.3.3/RELEASE_FINALIZATION.md.
PR9 source head c87be4293bddfc60c1ea90c27bf728fbe53c6039 passed hosted CI 38863386451 (4/4); its merge tree onto main equals the CI-tested tree c0c95f414757ae314ee7c6e7c0e21cea65f836c1. Finalization changes documentation and the Source ZIP/SHA256 manifest only; the standalone HTML is byte-identical (SHA256 672a24e9c675f0eccb7f812732149df9a93254b2e77ec68bb0b9ad73092538a1).

Implemented (v0.3.3): shared shop door anchors/front-only confirmation, command input settling, shared council API, Erik exploration using battle entity/armor tier, Aren NPC commander, advisor mission-aware briefings → War Council → Free Deployment, schema6 legacy spatial migration. v0.3.2 economy/recovery/rewards/tactical engine preserved.
Validation: 112 unit / 898 browser-scenario / 210 legal mission victories (hosted CI on the final tree). Finalization re-executed locally: 112 unit, byte-identical rebuild, verify-release, journey 206, migration-v032 9, migration-v031 10, gameplay-quality 92 — all PASS.

Known limits: physical phones, Safari/Firefox, long-term storage eviction unverified. release-v031.yml is a historical v0.3.1-only publisher that no-ops for later versions; v0.3.3 assets were published directly after exact-main CI and checksum verification. v0.3.2 has no separate tag/release (not requested).
Next: v0.4.0 The Broken Allegiance (M04–06) on feature/v0.4-the-broken-allegiance. No merge before user play approval.
