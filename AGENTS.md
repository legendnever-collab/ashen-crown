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


## Current v0.6.1 entry (merge approved)
The user received the v0.6.1 release candidate and approved merging it in chat on 2026-10-26 (20:22 KST); v0.6.1 The Three Banners (ACT II M07–M10) goes to main on top of v0.6.0 (tag v0.6.0). Next work — v0.7.0 ACT II part 2 (M11 성화의 행렬, M12 침묵의 수도원, M13 검은 사자의 결단, M14 부서진 동맹) — starts on a new feature branch from main only on the user's instruction; create a PR, never merge it before the user plays and approves the release candidate. Do not start awakening (Tier 3) without the user's instruction.
Read docs/v0.6.0 (ACT2_DESIGN, IMPLEMENTATION_PLAN, INTERIORS_AND_CHESTS, ART_PACKS, RELEASE_NOTES), docs/v0.6.1 (RELEASE_NOTES, DIALOGUE_SCRIPT) and the decisions D-055–D-067. D-031/032 stand: stable `eric` explores and fights, Aren is the non-deployable commander; Lia is the single strategist at her war table (D-043). Schema 9 imports 0–8 and nested stageStart; a schema-9 save from an earlier build loads as the current version; every load re-anchors the frontier to the hub of its story moment (hubFor → act2HubFor from M07, spatial only). Preserve the five ACT I heroes and recruits by roster (Thea after M08, Dario after M10), economy nonce/rollback, recovery markers, reward claims, practice isolation (no trust change), M01–M03 flat EXP (D-045 from M04), ACT I 30-seed results, shop catalogs/prices and chest doors per hub, and all PROPOSED/CANON labels (royal command identity, crown mechanics and Bellard's role stay OPEN; Sain's order past is v0.7 material). Painted art comes from the user's packs (scripts/import-art.py, scripts/import-world-art.py, scripts/import-interior-art.py); keep it original. In app.js, values read by render() are function declarations, not consts (a const read before initialisation crashed reloads in the v0.6.1 candidate).
Tests target the newly built current version; historical HTML only generates migration/baseline fixtures. Execute units, balances, desktop/mobile/campaign/migration/offline/package/document checks. Physical devices/other engines/eviction unverified.
