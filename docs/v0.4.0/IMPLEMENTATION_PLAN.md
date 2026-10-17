# v0.4.0 The Broken Allegiance — Implementation Plan

Branch `feature/v0.4-the-broken-allegiance` (base: main 105148e, official v0.3.3). PR은 사용자가 직접 플레이하고 승인하기 전까지 병합하지 않는다.
서사 설계: [ACT1_NARRATIVE_DESIGN](ACT1_NARRATIVE_DESIGN.md) · 미션 사양: [M04](../story/act1/MISSION_04.md) / [M05](../story/act1/MISSION_05.md) / [M06](../story/act1/MISSION_06.md) · 검증: [TEST_MATRIX](TEST_MATRIX.md)

## 1. 원칙
1. **M01–03 경로 불변.** 기존 `missionId===1/2/3` 분기, 대사, 보상, AI, 밸런스 결과(210 legal victories, 고정 seed)를 바꾸지 않는다. 신규 기능은 M04–06의 미션 데이터 훅으로만 동작한다.
2. 기존 시스템 재사용: 경제·장비·보상 원장·Terrain Recovery·Advisor → War Council → Free Deployment·저장/백업·모바일 Dock을 다시 만들지 않는다.
3. 원작 비복제: 발드릭·신규 적 외형·성채/관문 타일·음악 변주는 모두 기존 절차적 아트·오디오 엔진으로 새로 만든다.
4. 실행한 검증만 보고한다.

## 2. 현재 구조에서 확인한 제약 (코드 감사 결과)
| 위치 | 제약 | v0.4 대응 |
|---|---|---|
| `game.js nextMission` | `missionId>=3`이면 null | 상한을 `MISSIONS`의 최대 ID로 일반화 |
| `app.js` next-mission / 결과 화면 / 캠페인 모달 | `missionId<3`, "04 v0.4 예정" 문구 | 데이터 기반 상한 + M06 이후 ACT I 완료 표시 |
| `game.js checkOutcome / planEnemy / advanceEnemy` | M01–03 하드코딩 분기 | `mission.rules` 훅이 있으면 위임, 없으면 기존 분기 그대로 |
| `game.js setDeployment` | 배치 구역 y7–9, x1–10 고정 | `mission.deployZone` (없으면 기존 값) |
| `rules.js validTarget` capture | `missionId===2` 고정 | 신규 모드 `search`/`unseal`을 별도 분기로 추가 (기존 capture 불변) |
| `narrative.js afterBattleEvents` | M01/M03 특수 처리 | 훅 `mission.rules.events(s)` 추가 |
| `story.js` / `frontier-data.js` | `mission<=3` 루프로 NPC·Advisor 대사 생성 | 루프 상한 6, M04–06 대사 데이터 추가 |
| `frontier.js councilInfo / enterHub` | 3분기 삼항식, M03 aftermath 특수 | `COUNCIL_INFO[id]` 테이블화 (M01–03 문자열 동일 유지), M06 aftermath ACT I 완료 |
| `battle-rewards.js` | `knownRewards` = [1,2,3] | M04–06 보상 정의 추가. 원장 검증이 v040 ID를 인식 |
| `missions.js` | 확장 크기 테이블 `{1:16,2:18,3:14}` 고정 루프 | M04–06은 완성된 격자를 직접 정의하고 확장 루프 대상에서 제외 |
| `save-manager.js` | SCHEMA 6 | SCHEMA 7: 0–6 import, 신규 필드 기본값만 추가 |

## 3. 엔진 확장 (M04–06 전용 훅)
```
MISSIONS[n] = { id, title, en, map, width, height, enemies, civilians, objects, deployZone,
  waves:[{turn|phase, units}], phases:[{id, when, onEnter}], par, objective, brief,
  rules:{ checkOutcome(s), planEnemy(s,u)?, onTurnStart(s), onAction(s,u,mode,t), events(s), objectiveText(s) } }
```
| 기능 | 사용 미션 | 구현 위치 |
|---|---|---|
| 지도 오브젝트 레이어 (증거·봉인석·레버·마차·봉화) | 4·5·6 | `missions.js objects`, 렌더러 오브젝트 그리기 |
| `search` 행동 | 4·6 | `rules.validTarget/forecast`, `game.performAction`, action-menu 표시 |
| `unseal` 행동 (리아 1회, 타 장수 2회 누적) | 6 | 동일 |
| 다중 증원 wave / phase 트리거 | 4·5·6 | `advanceEnemy` 턴 시작 처리 |
| 사자 대형 오라 (기수 인접 DEF+2/HIT+10) | 5 | `rules.strikeStats` 보정 (mission 훅이 있을 때만) |
| 보스 HP 하한 + 퇴각 | 5 | `damage()` 후 훅 |
| 고립 목표 우선 AI · 대형 유지 AI | 5 | `mission.rules.planEnemy` |
| 일반화 호위 (방향·안전 구역 데이터화, 부상 피난민 대기) | 6 | 신규 함수. M03은 기존 `escortCivilians` 유지 |
| 파괴 가능 오브젝트 (반격 없음) | 6 | 적 팀 `kind:'object'`, mov 0, atk 0 |
| 미션 효과 "맹세의 깃발" | 6 | phase 3 onEnter |
| 서사 선택지 (C1–C3) | 4·5·6 | 기존 modal + `campaign.choices` |

## 4. 저장 (Schema 7)
- `campaign.choices = {}` (`m04_records_choice`, `m05_erik_answer`, `ashen_oath_focus`)
- `campaign.flags` 신규 키는 additive. `campaign.bonds`에 `lia_kai`, `elina_sain` 추가
- 전투 중 상태: `s.missionState = {phase, searched:[], unseal:{}, wagons, burned:[], banner:false}` — 체크포인트(`stageStart`)에 포함
- `frontier.phase` 값 범위 유지. M04–06 hub = camp
- 마이그레이션: 실제 v0.3.3 세이브(탐색·전투·체크포인트·M03 완료 후 aftermath)를 fixture로 생성 → v0.4에서 M04 진입 가능 확인

## 5. 아트 / 오디오
- 발드릭 전투 스프라이트·초상화 (검은 판금, 사자 갈기 망토, 장창 — 독자 디자인), 사자 기수, 철왕관 창병·기병, 왕실 봉인대, 봉쇄 집행관
- 타일·오브젝트: 성채 석벽/복도, 증거 상자, 봉인석(활성/해제), 관문, 레버, 마차, 봉화
- 음악: 기존 score 엔진의 motif 변주 — `fortress`(M04 긴장), `lion`(M05 보스), `oath`(M06 Phase 3/맹세)

## 6. 단계와 커밋 지점
| Phase | 산출물 | 완료 조건 |
|---|---|---|
| B | 이 문서들 + 사용자 승인 (Q1–Q5) | 커밋·푸시, 승인 기록 |
| C | 엔진 훅 + M04 | unit + M04 E2E + M01–03 회귀 불변 |
| D | M05 | 대형/퇴각/AI unit + E2E — **완료 2026-10-17** (tests/mission05.test.mjs, act1-e2e §4–5, test:m05-balance) |
| E | M06 + ACT I 종결 | phase 전환 E2E + ACT I 완료 화면 |
| F | Schema 7 마이그레이션, 캠페인 6미션 밸런스 (legal policy 30 seed), 데스크톱/모바일 회귀 | 전 suite PASS |
| G | standalone HTML, Source ZIP, Test Report, SHA256, PR | CI 4/4, PR 생성 (병합 금지) |

## 7. 리스크
| 리스크 | 대응 |
|---|---|
| `app.js`(68KB) 단일 파일 회귀 | 기존 분기 수정 최소화, 신규 UI는 데이터 기반 함수로 추가 |
| M01–03 밸런스 결과 변화 | 신규 훅은 `mission.rules` 존재 시에만 실행. 기존 balance JSON과 비교 |
| 6미션 legal-policy 시뮬레이션 시간 증가 (CI 15분 제한) | M04–06 정책을 별도 suite로 분리하고 browser matrix 그룹 재배치 |
| 발드릭 HP 하한이 승리 조건 교착 유발 | 이동로 사수(승리 B) 상시 보장, 시뮬레이션에서 교착 0 확인 |
| 한글 글리프 누락 | 기존 documentation test가 신규 대사의 글리프를 검사 → font-glyphs 갱신 |
