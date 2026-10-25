# v0.6.0 ACT II 「세 개의 깃발」 전반 — Implementation Plan

Branch `feature/v0.6-act2-three-banners` (base: main `33577c4`, official v0.5.0 / tag v0.5.0).
- PR은 사용자가 직접 플레이하고 승인하기 전까지 병합하지 않는다.
- 설계: [ACT2_DESIGN](ACT2_DESIGN.md) (Q1–Q4 승인, D-055).

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
| B | 설계 승인 (Q1–Q4) | DECISION_LOG 기록 — **완료 2026-10-21 (D-055)** |
| C | 엔진: schema 9, 세력 신뢰, 동맹군 팀·AI, 출전 6, 신규 지형, ACT II 시점표 + (D-056) 방 계열·장소별 상자 | unit + ACT I/v0.5 회귀 불변 — **진행 2026-10-21** (§5) |
| D | M07 북부의 군령 + M08 협곡 방어전 + 성하 마을(임시) + 테아 | 미션 unit + 30 seed 밸런스 + 브라우저 |
| E | M09 자유의 도시 + M10 두 영주의 전쟁(삼파전) + 벨마르(임시) + 다리오 | 같은 기준 |
| F | ChatGPT 작업 팩 A·B·C(56장: 인물 25, 거점 2, 방 27, 상자 시트 2) → import, 연출·음악 3곡, 세계 지도 ACT II | 해시 검증, 스크린샷. 팩은 2026-10-21에 사용자에게 전달 ([ART_PACKS](ART_PACKS.md)) |
| G | v0.5.0 실제 저장 마이그레이션, 전체 밸런스·회귀, 패키징, PR (승인 전 병합 금지) | 전 suite PASS, CI |

## 5. Phase C 구현 내용 (2026-10-21)

| 영역 | 구현 | 위치 |
|---|---|---|
| 저장 | schema 9입니다. schema 8 → 9로 `campaign.roster`(빈 배열)를 더합니다. 세력 신뢰는 ACT II가 시작될 때 ACT I 선택으로 정하므로, ACT I 중간 저장의 M04 선택도 그대로 열려 있습니다. 검증은 5–7명 군단, 동맹군, 신뢰 범위를 확인합니다 | `save-manager.js` |
| 영입 장수 | 테아·다리오 정의(`RECRUIT_HEROES`, PROPOSED 수치)와 `partyIds/partyHeroes/heroDef`를 만들었습니다. `joinRoster`는 지정 레벨 기록, 장비 칸, 거점 명단을 만듭니다 | `game-data.js`, `roster.js` |
| 출전 | 미션 `deployLimit`(기본 5)입니다. 한도를 넘는 영입 장수는 예비로 시작하고, 자리가 없는 장수는 배치 구역의 빈칸에 둡니다. `setSortie`와 `startBattle`이 한도를 지킵니다. 회의 화면은 `출전 n/한도`로 표시합니다 | `game.js`, `frontier-ui.js` |
| 진영과 적대 | `sideOf/hostile`: 장수(ally)와 동맹군(allied)은 같은 편입니다. 서로 다른 `faction`의 적끼리 싸우고, `s.truce`면 멈춥니다. ACT I 팀 구성에서는 '팀이 다르면 적대'와 같습니다 | `rules.js` |
| 동맹군 AI | `team:'allied'`(미션 `allies`)는 적 Phase에 적보다 먼저 움직입니다. `post`/`leash` 안에서 사거리 안의 적을 치고, 아니면 대열로 돌아갑니다. 적은 동맹군도 노리고, 반격 규칙은 같습니다. 동맹군은 EXP를 받지 않습니다 | `game.js` `planAllied` |
| 지형 | 눈 `n`(보병 2, 도적 1, 기병 2), 얼음 다리 `i`, 지붕 `o`(이동 2, 방어 +2, 회피 +10, 활 사거리 +1, 기병 불가), 골목 `l`(기병 2) | `game-data.js`, `rules.js` |
| 세력 신뢰 | −2…+3을 단계(경계/중립/신뢰/동맹)로 보여 줍니다. M04 보고 → 철왕관 −1입니다. 메뉴 '세력 관계' 패널은 ACT I 완료 뒤에 나오고, 만난 세력만 표시합니다 | `factions.js`, `app.js` |
| ACT II 시점표와 지도 | `act2HubFor`(M07–M08 성하 마을, M08 후 야영, M09–M10 벨마르)는 거점이 생기는 Phase D에서 `hubFor`에 연결합니다. 서부는 M08 완료 뒤 공개되고, `ACT2_ROUTE`를 추가했습니다 | `hubs-v05.js`, `world.js` |
| 방과 상자 (D-056) | 거점 종류에 맞는 방 계열(마을/천막/성채/북부/항구)과 방마다 맞는 상자 스타일 20종을 정했습니다. 손그림 상자 시트가 없으면 코드로 그린 임시 상자를 씁니다. 손그림 방은 팩 A가 오면 `ROOM_LAYOUTS`에 넣습니다 | `rooms-v06.js`, `chest-art.js` |

## 4. 리스크

| 리스크 | 대응 |
|---|---|
| 동맹군 AI가 전투를 대신 이김 | 동맹군은 대열·호위만 하고, 승리 조건은 군단 행동에 둔다. 밸런스에서 동맹군 격파 수를 측정 |
| 삼파전에서 적끼리 교착 | 적 계열 간 공격은 사거리 안에서만, 턴 제한 + 지휘관 생포/격파 승리 |
| 출전 6명으로 ACT I 밸런스 변동 | 출전 인원은 미션 데이터로 정해서 M01–M06은 5 유지 |
| HTML 용량 (지금 15.8MB, 그림 27장 추가 시 약 +4MB) | WebP 예산 유지. Source ZIP은 D-054 정책 |
