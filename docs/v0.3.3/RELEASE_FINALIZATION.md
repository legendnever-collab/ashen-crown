# v0.3.3 Release Finalization
Date: 2026-10-16 KST. Authority: the user play-tested v0.3.3 and approved, in chat, merging PR9, publishing tag/release v0.3.3 and recording it as official.

| Item | Value |
|---|---|
| PR8 (v0.3.2) | merged, merge commit 4a66a2f53c94ee98d97f47d90033c0598c7d0ea5, push CI 38863433099 success |
| PR9 source head | c87be4293bddfc60c1ea90c27bf728fbe53c6039, PR CI 38863386451 success 4/4 |
| CI-tested merge tree | c0c95f414757ae314ee7c6e7c0e21cea65f836c1 (equal to merge result onto 4a66a2f) |
| Standalone HTML SHA256 | 672a24e9c675f0eccb7f812732149df9a93254b2e77ec68bb0b9ad73092538a1 (unchanged by finalization) |
| Finalization commit | documentation + Source ZIP/SHA256 repackage only; CI on that head is authoritative |
| Tag / Release | v0.3.3 → PR9 merge commit on main; assets HTML, Source ZIP, Test Report, SHA256SUMS |

Local re-execution during finalization: 112 unit, byte-identical rebuild, verify-release, journey 206, migration-v032 9, migration-v031 10, gameplay-quality 92 — all PASS.
Publication route: release-v031.yml is hard-coded to v0.3.1 and no-ops for later versions, so v0.3.3 assets are published directly after exact-main CI success and checksum verification. The final merge SHA and exact-main CI run are recorded in the GitHub Release notes for v0.3.3.
