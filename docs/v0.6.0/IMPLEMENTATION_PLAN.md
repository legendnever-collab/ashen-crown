# v0.6.0 ACT II 「세 개의 깃발」 전반 — Implementation Plan

Branch `feature/v0.6-act2-three-banners` (base: main `33577c4`, official v0.5.0 / tag v0.5.0).
- PR은 사용자가 직접 플레이하고 승인하기 전까지 병합하지 않는다.
- 설계: [ACT2_DESIGN](ACT2_DESIGN.md) (PROPOSED, Q1–Q4 승인 대기).

## 1. 원칙
1. **ACT I과 v0.5 보존.** M01–M06 규칙·보상·EXP·30 seed 결과, 전직·시련·훈련, 경제(상점 품목·가격·상자)를 바꾸지 않는다.
2. **기존 엔진 재사용.**
   - 미션 훅 엔진 (`mission-rules.js`)
   - 출전 보드
   - 거점 마스크 (`hubs-v05.js`)
   - 세계 지도 (`world.js`)
   - 아트 import 스크립트
   - 저장 마이그레이션 체인
3. **원작 비복제.** 이름, 맵, 아트, 음악은 모두 오리지널로 만든다.
4. **실행한 검증만 보고한다.**

## 2. 코드 감사로 확인한 제약 (main 33577c4)

| 위치 | 현재 | v0.6 대응 |
|---|---|---|
| `frontier.js validateFrontier` | `members`가 정확히 5명이어야 함 | schema 9: 5–7명, 고정 다섯 + 신규 id 허용 |
| `game-data.js HEROES` | 5명 고정 | 영입 장수 정의(RECRUITS 확장), 합류 전에는 roster에 없음 |
| 출전 | 다섯 모두 출전(에릭 필수) | 미션별 `deployLimit`(M07+ 6) — 출전 보드 재사용 |
| 팀 | ally / enemy / civilian / object | `team:'allied'`(AI 조종 동맹군), 적끼리 교전하는 `faction` 태그(M10) |
| `game.js planEnemy` | 적 AI는 아군만 노림 | 동맹군 AI(대열·호위 목표), 적 계열 간 표적 지정 |
| 지형 | 기존 타일 세트 | 눈·얼음·지붕·골목·낙석 장치 |
| `hubs-v05.js hubFor` | ACT I 시점표 | M07–M10 시점 추가 (성하 마을 · 벨마르 시장 · 야영) |
| `world.js` | 서부는 비공개 | M09에서 서부 공개, ACT II 행군로 |
| 저장 | SCHEMA 8 | SCHEMA 9 (0–8 import): `campaign.factionTrust`, `members` 확장 |

## 3. 단계

| Phase | 산출물 | 완료 조건 |
|---|---|---|
| A | 코드 감사 + v0.5.0 태그·릴리스 | **완료 2026-10-21** (tag v0.5.0, run 39574780277) |
| B | 설계 승인 (Q1–Q4) | DECISION_LOG 기록 |
| C | 엔진: schema 9, 세력 신뢰, 동맹군 팀·AI, 출전 6, 신규 지형, ACT II 시점표 | unit + ACT I/v0.5 회귀 불변 |
| D | M07 북부의 군령 + M08 협곡 방어전 + 성하 마을(임시) + 테아 | 미션 unit + 30 seed 밸런스 + 브라우저 |
| E | M09 자유의 도시 + M10 두 영주의 전쟁(삼파전) + 벨마르(임시) + 다리오 | 같은 기준 |
| F | ChatGPT 작업 팩(27장) → import, 연출·음악 3곡, 세계 지도 ACT II | 해시 검증, 스크린샷 |
| G | v0.5.0 실제 저장 마이그레이션, 전체 밸런스·회귀, 패키징, PR (승인 전 병합 금지) | 전 suite PASS, CI |

## 4. 리스크

| 리스크 | 대응 |
|---|---|
| 동맹군 AI가 전투를 대신 이김 | 동맹군은 대열·호위만 하고, 승리 조건은 군단 행동에 둔다. 밸런스에서 동맹군 격파 수를 측정 |
| 삼파전에서 적끼리 교착 | 적 계열 간 공격은 사거리 안에서만, 턴 제한 + 지휘관 생포/격파 승리 |
| 출전 6명으로 ACT I 밸런스 변동 | 출전 인원은 미션 데이터로 정해서 M01–M06은 5 유지 |
| HTML 용량 (지금 15.8MB, 그림 27장 추가 시 약 +4MB) | WebP 예산 유지. Source ZIP은 D-054 정책 |
