# Current Status
Last Updated: 2026-10-14
Current Version: v0.2.0 Release Candidate
Main Commit SHA: 5aa56dd4596246057611606f28ece4643e1d080a (v0.1.3 / merged PR #4)
Active Branch: feature/v0.2-burning-frontier
Open PR: #5 — https://github.com/legendnever-collab/ashen-crown/pull/5 (open, not merged)
Implementation Commit: 8fe22c0450929c4f21008d8826afdfe014c21029
Completed Features: full developer/story documentation; M01 narrative upgrade; M02 capture/escape pursuit; M03 rescue/escort/withdrawal; dialogue queue/history/skip/auto/fast/expressions; campaign growth/flags/action memory/bond; original adaptive Web Audio; hero identity, tier metadata and Erik LV5 outfit; schema2 migration and restart; standalone offline build.
Known Bugs: no reproducible fatal issue in executed checks. Browser/physical-device/audio subjective limitations below are not claimed fixed.
CI Status: baseline main / PR #4 success verified. v0.2 preflight CI SUCCESS (before final practice/retry hardening) — https://github.com/legendnever-collab/ashen-crown/actions/runs/38534109776 (all build, unit, balance and browser/campaign steps). Final artifact/docs commit checks are visible on PR #5; confirm the current head before delivery.
Validation Evidence: docs/v0.2.0/ and releases/Ashen_Crown_v0.2.0_Test_Report.md. 73 unit, 64 desktop/general browser, 82 mobile/legacy, 26 tactical UI/VFX, 22 restart, 8 post-move scenarios, 4 HTTP, 118 campaign browser checks. 30 M01 wins + 30 full campaign wins. Real v0.1.0–v0.1.3 imports. Offline zero external asset requests.
Remaining: M04–06; other Tier2/3 artwork; class/awakening/proficiency abilities; expanded camp/relationships; later acts and ending causality. Actual phone hardware, Safari/Firefox and human audio timbre preference not verified.
Release Artifacts: HTML, Source ZIP, Test Report, SHA256SUMS. Source reconstruction is verified by scripts/verify-release.py; no external font/audio services required for build/play.

Final persistence audit: level-one practice keeps the canonical campaign heroes/progress instead of replacing them. Defeat Retry rewinds current-battle flags/bonds/action memory to the mission checkpoint while retaining the defeat record and viewed history. Two before-fix failing regressions are retained as rollback-before-fix.log; the final 73-unit suite passes. Desktop/touch full campaign adds practice+reload assertions (118 PASS). Final current-head CI is authoritative in PR #5 Checks.
