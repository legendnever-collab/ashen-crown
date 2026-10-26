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


## Current v0.7.0 entry (merge approved) / v0.7.1 in development
The user approved merging v0.7.0 The Three Banners (ACT II M07–M12) in chat on 2026-10-27 06:16 KST ("병합하고 다음버전 진행해줘", D-070) and asked to continue with the next version. v0.7.1 (M13 검은 사자의 결단, M14 부서진 동맹, persuasion, betrayal, ACT II completion card, one track; design D-068 §3–§6, Q3–Q4) is developed on feature/v0.7.1-lion-and-alliance from main; never merge its PR before the user plays and approves the release candidate. Do not start awakening (Tier 3) without the user's instruction. Art work pack D (28 images) is with the user; until it arrives the pilgrim village uses a dusk-tinted Ashen Village painting and the new cast is procedural — never label those finished.
Read docs/v0.7.0 (ACT2B_DESIGN, IMPLEMENTATION_PLAN, RELEASE_NOTES, DIALOGUE_SCRIPT), docs/v0.6.0–v0.6.1 and the decisions D-055–D-069. D-031/032 stand: stable `eric` explores and fights, Aren is the non-deployable commander; Lia is the single strategist at her war table (D-043). Schema 9 imports 0–8 and nested stageStart; a schema-9 save from an earlier build loads as the current version; every load re-anchors the frontier to the hub of its story moment (hubFor → act2HubFor from M07, spatial only). Preserve the five ACT I heroes and recruits by roster (Thea, Dario, Ines), ACT I and M07–M10 balance, v0.3.2 recovery/rewards/economy and M01–M03 EXP.
Tests target the newly built current version; historical HTML only generates migration/baseline fixtures. Execute units, balances, desktop/mobile/campaign/migration/offline/package/document checks. Physical devices/other engines/eviction unverified.
