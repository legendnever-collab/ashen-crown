# v0.5.0 Advanced Class & Character Progression — Implementation Plan

Branch `feature/v0.5-advanced-class` (base: main `f922a18`, official v0.4.0).
- PR은 사용자가 직접 플레이하고 승인하기 전까지 병합하지 않는다.
- ACT II는 시작하지 않는다.
- 설계: [CLASS_PROGRESSION_DESIGN](CLASS_PROGRESSION_DESIGN.md) · 검증: [TEST_MATRIX](TEST_MATRIX.md)

## 1. 원칙
1. **M01–M06 보존.** 미션 규칙, 대사, 보상, M01–M03 EXP, D-045, ACT I 밸런스 결과를 바꾸지 않는다 (A안 기준).
2. **기존 시스템 재사용.** 다음을 다시 만들지 않는다: tacticalMemory, clues, appearanceTier/classTier resolver, mission hook 엔진, 경제·보상 원장, 저장 백업, 출전 보드, 모바일 명령 메뉴.
3. **새 행동은 새 전술이어야 한다.** 수치만 오르는 전직은 금지다 (GAME_DESIGN_PRINCIPLES).
4. **원작 비복제.** 이름, 맵, 아트, 음악은 오리지널이다.
5. **실행한 검증만 보고한다.**

## 2. Phase A 감사 결과 (main f922a18)

| 위치 | 현재 | v0.5 대응 |
|---|---|---|
| `game-data.js HEROES` | 단일 class, `clue`/`goal` 1개 | `CLASSES` 테이블(tier 1/2), 장수별 전직 경로 |
| `rules.js discover()` | 단서 1개, 로그 "(1/3)" 고정 | 3단계 잠재력 판정 함수 (tacticalMemory 소급) |
| `narrative.js remember()` | 행동 횟수 누적 (practice 제외) | 숙련·잠재력 원천으로 재사용 |
| `appearances.js` | Tier 2/3 슬롯 예약, `classTier` 해석 지원 | 전직 시 `classTier=2`, 아트 팩 import |
| `HERO_CLASS / CLASS_MOVEMENT` | knight/archer/mage/healer/rogue 고정 | 전직 클래스 키 추가 (이동·적성) |
| `action-menu.js` 스킬 탭 | 기술 1개 | 전직 행동 1줄 추가 |
| `game.js performAction / planEnemy` | 모드별 분기, AI는 사거리·위협 평가 | 신규 모드 4종 + 반응형 1종(경계 사격), AI 위험 지도 반영 |
| `frontier.js` ACT I 완료 진영 | M06 aftermath에서 다음 출정 없음 | 아렌 '전직 의식' 대화, 시련/훈련 출정 |
| `save-manager.js` | SCHEMA 7 | SCHEMA 8 (0–7 import) |
| 성능 | 1440 헤드리스 33ms (환경 기준선) | 마력 지형·반응 사격 연출이 이 기준을 넘지 않을 것 |

## 3. 단계

| Phase | 산출물 | 완료 조건 |
|---|---|---|
| A | 코드 감사 + v0.4.0 릴리스 노트 | 커밋·푸시 — **완료 2026-10-19** |
| B | 설계 문서 3종 + 사용자 승인 (Q1–Q5) | 승인 기록 (DECISION_LOG) — **완료 2026-10-19** (D-047 A안, D-048 설계안대로, D-049 아트 지시서 [ART_BRIEF_TIER2](ART_BRIEF_TIER2.md)) |
| C | 엔진: CLASSES·전직 상태·잠재력 3단계·숙련·schema 8 | unit + M01–M06 회귀 결과 불변 — **구현 2026-10-19** (`src/data/classes.js`, `src/core/progression.js`, 장수 정보 '성장' 탭, tests/progression·migration-v040; ACT I 30 seed 결과 seed·미션 단위 동일) |
| D | 새 전술 행동 5종 + 적 AI 대응 | 행동별 unit + tactical E2E (데스크톱·모바일) — **구현 2026-10-19** (`src/core/class-actions.js`, tests/class-actions.test.mjs 8건, `test:class` 브라우저 14×2 검사, ACT I 결과 불변) |
| E | 전직 의식·시련 전투 5개·군단 훈련 (A안) / M03 진영 전직 (B안) | 시련 30 seed 승률 ≥ 90%, act1 회귀 PASS — **구현 2026-10-19** ([TRIALS](TRIALS.md), tests/skirmish.test.mjs, test:class-balance, test:legion) |
| E2 | 세계 지도 + 막간 거점 6종 (사용자 요청 2026-10-20) | [WORLD_MAP_AND_HUBS](WORLD_MAP_AND_HUBS.md) W1–W4 승인 (D-052, 2026-10-20), 그림은 [ART_BRIEF_WORLD](ART_BRIEF_WORLD.md) — **설계 승인, 구현 대기** |
| F | 외형 Tier 2 (아트 팩 import), 정보창 전직 탭, 연출·음악 변주 | 아트 해시 검증, 스크린샷 |
| G | 마이그레이션(v0.4.0 실제 저장)·전체 밸런스·회귀·패키징·PR | 전 suite PASS, CI, PR (승인 전 병합 금지) |

## 4. 사용자 승인 질문

| # | 질문 | 권장안 |
|---|---|---|
| Q1 | 전직 시점: A안(ACT I 이후 진영 + 시련 전투 5 + 군단 훈련) vs B안(M03 이후, M04–M06 재밸런스) | A안 |
| Q2 | 장수별 전직명과 새 행동 5종 (설계 §2) | 제안대로, 이름은 수정 가능 |
| Q3 | Tier 2 손그림: 반신 20장 + 시트 5종을 ChatGPT로 받기 (기존 브리프 규격) | 받기 — 브리프 작성 |
| Q4 | 전직 조건: Lv 6 + 잠재력 3/3 (+ ACT I 완료) | 제안대로 |
| Q5 | 숙련 ★ 효과 크기: 명중 +2%/★ 또는 회복 +1/★ | 제안대로 |

## 5. 리스크

| 리스크 | 대응 |
|---|---|
| 반응형 행동(경계 사격)이 적 Phase 처리 순서를 바꿈 | `advanceEnemy` 이동 단계마다 1회 훅. M01–M06에서는 전직 장수가 없으면 호출 0회임을 unit으로 보장 |
| 방벽 차단 지대로 AI 교착 | 차단 칸을 비용 ∞가 아니라 '정지' 처리하고, 교착 0을 balance 스크립트로 확인 |
| 위치 교환으로 미션 오브젝트 규칙이 깨짐 | 오브젝트·민간인·보스 퇴각 중인 유닛은 교환 대상에서 제외 |
| Source ZIP 크기 (52.5 MB) | 아트 추가 전에 ZIP 정책 검토 (예: 과거 릴리스 HTML 제외) — 사용자 확인 후 변경 |
