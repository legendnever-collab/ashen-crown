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


## Current v0.3.2 entry
PR6/7 are merged. Implementation baseline main b826c49851596398967b36d517270a3f556df94c; main official version v0.3.1. Active feature/v0.3.2-gameplay-quality-rewards / PR8, no approval to merge this version. Earlier versions/evidence are historical; use current refs and schema.
Read [v0.3.2 plan](docs/v0.3.2/IMPLEMENTATION_PLAN.md), [test matrix](docs/v0.3.2/TEST_MATRIX.md), [release validation](docs/v0.3.2/RELEASE_VALIDATION.md), [exploration](docs/design/EXPLORATION_SYSTEM.md), [equipment](docs/design/EQUIPMENT_SYSTEM.md), [economy](docs/design/ECONOMY_AND_SHOPS.md), [recovery](docs/design/TERRAIN_RECOVERY.md), [rewards](docs/design/BATTLE_REWARDS.md).
Preserve Schema5 accepting0–4, interior doorway/actor position, explicit hero/nonce atomic equip, own-phase recovery markers, stable supplemental reward claims and overflow delivery. Canonical/attempt/practice/departure economies stay separate. No pressed keys/modal/pending token persistence. Fixed180/100ms movement; touch capture must survive rerenders.
Newly built v0.3.2 is the current test target. Historical HTML only generates real migration/baseline fixtures. Unit/balance/browser/campaign/migration/offline/package/document audit required; claim only executed results. Four acts/30 missions unchanged. Aren never a mandatory battle hero. M04–06 v0.4; advanced promotions v0.5. Physical phones/other browser engines/eviction unverified.
