# Ashen Crown v0.2.0 — Test Report

Date: 2026-10-14. Release candidate, user review required before merge.
Authoritative baseline: main 5aa56dd4596246057611606f28ece4643e1d080a / v0.1.3, PR #4 merged. Baseline main CI success and predecessor PR CI success verified. Implementation code: 6b0235b4425de7f00ac0feffbe0ca10afc58a66d on feature/v0.2-burning-frontier. Hosted final status is the branch/PR Checks tab; this document records executed local evidence.

## Implemented scope
- Documentation-first root AGENTS/CLAUDE and complete world/factions/characters/relationships/4-act 30-mission/ending/vision/roadmap/decision/handoff docs. CANON, APPROVED_DIRECTION, PROPOSED, OPEN, DEPRECATED distinguished.
- Existing village combat retained. Narrative before/during/after battles with event deduplication, expressions, history, auto/manual/fast, seen skip, stored flags and input lock. Military-supply mystery remains unresolved.
- Forest capture/escape/elimination outcomes, information and rewards; bridge civilian escort/rescue plus safe withdrawal, 10-turn deadline. Five roles and free deployment preserved.
- First-clear permanent growth, practice, legacy accumulated growth retained, current mission checkpoint rollback, actual Guard/rescue/heal-based Erik–Kai Bond.
- Five strengthened original pixel identities, Aren dialogue portrait, three-tier data model with level/class/story triggers, Erik Advanced armor/cloak/shield at LV5 and preview. Full classes and other advanced assets not implemented.
- Source-composed adaptive oscillator music, original motif/variations, crossfade, loops, stingers/SFX, volume/mute/pause preferences, gesture activation and fail-soft audio. No third-party recordings/samples or AI music service. Provenance in AUDIO_ASSET_REGISTER. OFL UI font expanded for all authored Korean syllables.

## Executed validation
| Check | Result | Evidence |
|---|---:|---|
| Node unit/rules/narrative/save/tier/documentation | 71 PASS / 0 FAIL | unit.log |
| Desktop/general file:// E2E | 64 PASS | e2e.json |
| Touch layout/full battle/actual previous HTML imports | 82 PASS | mobile-dock.json |
| Movement confirmation/cast/projectile/impact/counters/items | 26 PASS | tactical-ui.json |
| Stage restart desktop/touch/legacy/storage denial | 22 PASS | restart-stage.json |
| Post-move attack and touch menu regression | 8 scenarios PASS | post-move-attack.json |
| HTTP standalone play/persistence | 4 PASS | http-smoke.json |
| Desktop + touch 01→02→03 campaign via actual controls | 114 PASS | campaign-e2e.json |
| First mission legal-rule balance | 30 wins | balance.json/winning-trace.json |
| Complete campaign legal-rule balance | 30 wins, 15 captured, 30 perfect rescues; bridge 4–9 turns | campaign-balance.json |
| Source ZIP reconstruction | byte-identical HTML + 71 unit PASS | scripts/verify-release.py, source-rebuild.log |
| Asset audit | code-native art/music; OFL font license retained; no third-party audio | AUDIO_ASSET_REGISTER.md, OFL.txt |

Browser tests use offline Chromium, desktop and touch emulation (390×844, 360×640, 430×932, 844×390 where applicable). Diagnostic API is read-only. Campaign E2E uses real map taps/moves/forecasts/actions/phase transitions; no state-injection or instant-win path is exposed. Unit fixtures alter state to isolate edge cases and are distinguished from browser gameplay.

Verified reload during dialogue and after each victory, growth inheritance, prisoner information, all civilian rescue/survivor withdrawal, audio running/preferences, advanced preview, practice. Save migration imports actual v0.1.0/1/2/3 HTML-generated saves; schema0/1 and malformed/future data checked; last-good fallback/storage errors preserve gameplay. Current-mission flags/actions rewind, viewed history can persist. Previous mission committed growth stays intact.

Visual review caught missing Korean glyphs and modal opening scrolled to the bottom; expanded the font and changed modal focus to keep the initial view at top. Native 64×64 tiles and 128×128 portraits retained because identity/detail improve without uniform upscaling. Two-dimensional original procedural art, no external sprites. Sound instrumentation is retro synthesis; its artistic quality requires listening review.

## Balance/known limitations
- Initial 8-turn bridge candidate needed 9 turns in one legal path. Limit is 10 and deadline failure has precedence over victory after turn 10. Complete rescue requires no forced sacrifice.
- Full class/awakening tactical behaviors, most advanced outfits, M04–06 and all later acts are documented future scope. Tier3 is reserved and unavailable assets fall back to implemented appearance.
- Hero bond needs actual M03 protection of Sain plus Kai rescue/bypass and Sain rescue/healing. It is optional; missing it never blocks campaign.
- Browser audio oscillator synthesis is a working original score foundation, not a recorded orchestral production. No absolute legal originality assurance is asserted.
- Actual phone hardware, Safari/Firefox and long-term browser storage eviction not verified. Browser/profile/path storage differs; text backup remains available.
- Late-game crown mechanics, Bellard's causal responsibility and endings' survival transition remain OPEN/PROPOSED, never silently promoted to canon.

## Release and continuity
Artifacts: Ashen_Crown_v0.2.0.html, Ashen_Crown_v0.2.0_Source.zip, Ashen_Crown_v0.2.0_Test_Report.md, Ashen_Crown_v0.2.0_SHA256SUMS. HTML embeds code/art/font/score and requests zero external assets. Rebuild: extract ZIP → cd ashen-crown → node scripts/build.mjs; checksum/clean-source verification: python scripts/verify-release.py in the release checkout.

New session: AGENTS.md → docs/handoff/PROJECT_CONTEXT.md → ordered vision/story/status/decision documents → NEXT_TASKS.md. Start with user play/listening review; develop ACT I M04–06 only after v0.2 feedback. PR stays open; no automatic main merge.
