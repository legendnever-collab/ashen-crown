# Regression Results


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


[Full QA report](../../releases/Ashen_Crown_v0.3.3_Test_Report.md)
