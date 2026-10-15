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


## Current v0.3.3 entry
Branch feature/v0.3.3-erik-advisor-campaign is stacked on unmerged PR8 HEAD c0a5fc1fdfe6b64c58815c0c4a189e5bbd46a29d. Main b826c49 remains v0.3.1. No merge authorization for PR8 or v0.3.3.
Read docs/v0.3.3/IMPLEMENTATION_PLAN.md and design EXPLORATION_SYSTEM, TOWN_AND_CAMP, EQUIPMENT_SYSTEM, ECONOMY_AND_SHOPS, TERRAIN_RECOVERY, BATTLE_REWARDS. D-031/032 supersede the Aren avatar / building gate: stable `eric` exploration + battle data; Aren remains non-deployable commander with his own past. Functional advisor at8,7, no invented personal canon. Shared door anchors / front-only interaction; schema6 imports0–5 and nested stageStart. Preserve five heroes, economy transaction nonce/rollback, phase recovery markers, reward claims, practice isolation and M03 ten-turn deadline.
Tests target newly built v0.3.3; historical HTML only generates migration/baseline fixtures. Execute units, balances, desktop/mobile/campaign/migration/offline/package/document checks. Physical devices/other engines/eviction unverified. M04–06 v0.4; promotions v0.5.
