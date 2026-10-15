# Executed Regression Results

See [Test Report](../../releases/Ashen_Crown_v0.3.1_Test_Report.md). Raw JSON is in evidence/.

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
| Renaissance UI/resolution/shop/camera (four viewports), recovery rerun | 113 | 0 |
| Actual progressed v0.2 campaign import | 16 | 0 |

95 unit + 545 browser/scenario checks; 210 balance mission victories. Local HTTP unavailable; hosted exact-head check is authoritative. Frame samples are synthetic Chromium, not hardware certification.

Recovery reran 95 units and 113 Renaissance checks; other 432 browser/scenario checks, legacy migrations and 210 balance victories are reused unchanged evidence. Historical CI 38587741878 / 38587731729 failed at Quest reload after passing HTTP/migration. Synchronous activation persistence fixes the reproduced race; exact recovery-head CI is on PR #7 Checks/body. See recovery-renaissance-e2e.json, recovery-unit.log and recovery-performance.json under evidence/.
