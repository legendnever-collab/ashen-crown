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

코드·문서 차이를 보고한다. 스토리 CANON을 소스의 우연한 구현으로 덮어쓰지 않는다. 구현 여부는 코드·테스트가 기준. 기존 Mission01/combat/save/성장 보존, 신규 아이디어 CANON 승격 금지, Aren 필수 출전 금지, 저작물 복제 금지. 사용자 리뷰 전 v0.3 자동 병합 금지. v0.2는 사용자 승인으로 PR #5 병합 완료(fdcdcc4).
작업 단계별 커밋. npm test, balance, browser regression, campaign E2E, migration, offline, documentation audit. 실제 검증만 완료 표시. 모든 PR의 documentation checklist: README, CHANGELOG, CURRENT_STATUS, NEXT_TASKS, ROADMAP, Story Bible review, Decision Log review, tests/evidence, artifacts.


v0.3: 아렌 직접 이동 Hybrid Town/Camp, 방문 후 Fast Travel, Story → Exploration → Preparation → Battle → Aftermath. 경제 원자성·Practice 격리 필수. M04–06은 v0.4, 전직은 v0.5. 4막 30 Mission·인물 정본 보존. 신규 NPC 세부는 PROPOSED. 새 세션은 EXPLORATION_SYSTEM/EQUIPMENT_SYSTEM/ECONOMY_AND_SHOPS도 읽는다.


## v0.3.1 entry
Current branch feature/v0.3.1-classic-srpg-renaissance is stacked on unmerged PR #6 (461abfd), main remains fdcdcc4 unless GitHub says otherwise. Read docs/v0.3.1/IMPLEMENTATION_PLAN.md, design/VISUAL_DESIGN_SYSTEM.md, MAP_ARCHITECTURE.md and TACTICAL_UX.md. Preserve schema4 migration, interior return positions, immediate terrain-cost preview, nonce buy/equip and camera hit-testing. Require 14-row feedback traceability, actual screenshots, campaign and legacy UI evidence, rebuild/checksum verification. Do not merge either PR without user authorization. Future mounted class is reserved data, not a playable promotion.
