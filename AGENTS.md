# Ashen Crown — Required developer entry point

개발 전에 순서대로 읽는다:

1. [docs/handoff/PROJECT_CONTEXT.md](docs/handoff/PROJECT_CONTEXT.md)
2. [docs/vision/PRODUCT_VISION.md](docs/vision/PRODUCT_VISION.md)
3. [docs/vision/GAME_DESIGN_PRINCIPLES.md](docs/vision/GAME_DESIGN_PRINCIPLES.md)
4. [docs/story/STORY_BIBLE.md](docs/story/STORY_BIBLE.md)
5. [docs/story/CHARACTER_BIBLE.md](docs/story/CHARACTER_BIBLE.md)
6. [docs/story/CAMPAIGN_STRUCTURE.md](docs/story/CAMPAIGN_STRUCTURE.md)
7. [docs/vision/DEVELOPMENT_ROADMAP.md](docs/vision/DEVELOPMENT_ROADMAP.md)
8. [docs/handoff/CURRENT_STATUS.md](docs/handoff/CURRENT_STATUS.md)
9. [docs/handoff/NEXT_TASKS.md](docs/handoff/NEXT_TASKS.md)
10. [docs/decisions/DECISION_LOG.md](docs/decisions/DECISION_LOG.md)

코드·문서 차이를 보고한다. 스토리 CANON을 소스의 우연한 구현으로 덮어쓰지 않는다. 구현 여부는 코드·테스트가 기준. 기존 Mission01/combat/save/성장 보존, 신규 아이디어 CANON 승격 금지, Aren 필수 출전 금지, 저작물 복제 금지. 사용자 리뷰 전 현재 개발 버전 자동 병합 금지. v0.2는 사용자 승인으로 PR #5 병합 완료(fdcdcc4).
작업 단계별 커밋. npm test, balance, browser regression, campaign E2E, migration, offline, documentation audit. 실제 검증만 완료 표시. 모든 PR의 documentation checklist: README, CHANGELOG, CURRENT_STATUS, NEXT_TASKS, ROADMAP, Story Bible review, Decision Log review, tests/evidence, artifacts.


## Current v0.5.0 entry (merge approved)
The user received the v0.5.0 release candidate (through Phase F) and approved merging it in chat on 2026-10-20 (20:45 KST); v0.5.0 Ranks of the Ashen Legion goes to main on top of v0.4.0 (tag v0.4.0). Next work starts on a new feature branch from main — create a PR, never merge it before the user plays and approves the release candidate. Do not start ACT II or awakening (Tier 3) without the user's instruction.
Read docs/v0.5.0 (IMPLEMENTATION_PLAN, CLASS_PROGRESSION_DESIGN, TRIALS, WORLD_MAP_AND_HUBS, ART_BRIEF_TIER2, ART_BRIEF_WORLD, RELEASE_NOTES) and the decisions D-045–D-053. D-031/032 stand: stable `eric` explores and fights, Aren is the non-deployable commander; Lia is the single strategist at her war table (D-043). Schema 8 imports 0–7 and nested stageStart; every load re-anchors the frontier to the hub of its story moment (hubFor, spatial only). Preserve five heroes, economy nonce/rollback, recovery markers, reward claims, practice isolation, M01–M03 flat EXP (D-045 from M04), ACT I 30-seed results, shop catalogs/prices and chest doors per hub, and all PROPOSED/CANON labels. Painted art comes from the user's packs (scripts/import-art.py, scripts/import-world-art.py); keep it original.
Tests target the newly built current version; historical HTML only generates migration/baseline fixtures. Execute units, balances, desktop/mobile/campaign/migration/offline/package/document checks. Physical devices/other engines/eviction unverified.
