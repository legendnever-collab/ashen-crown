# Ashen Crown v0.1.0 — Test Report

검증일: 2026-10-14 (Asia/Seoul)

Repository: https://github.com/legendnever-collab/ashen-crown

Branch: `feature/v0.1-first-battle`

Authoritative main baseline: `dc161cad06761527e02a8c247fb1beab83f3ce11` (Initial commit, README only)

## 실행 결과

| 검증 | 결과 | 증거 |
|---|---:|---|
| 규칙 / 성장 / 저장 Unit Tests | 35 PASS / 0 FAIL | `docs/unit.log` |
| 배치 × Seed × Guard 전략 완주 | 30 승리 / 0 정체 | `docs/balance.json` |
| 실제 화면 조작 Chromium E2E | 62 PASS / 0 FAIL | `docs/e2e.json`, `docs/winning-trace.json` |
| localhost HTTP 시작 / 새로고침 | PASS | `docs/http.json` |
| 예측 확정 버튼 화면 내 표시 | PASS | `docs/ux.json` |
| 브라우저 저장 실패 안내 | PASS | `docs/ux.json` |
| 개발자 직접 조작 플레이 | 6턴 승리, 전원 생존, Eric 단서 | `docs/developer-playtest.json` |
| Standalone 외부 요청 | 0 | Chromium Offline Context |
| 브라우저 Runtime Error | 0 | Desktop 및 Touch E2E |

환경: Node.js 24.19.0, Playwright 1.58.2, Chromium 143 (headless), Linux. Desktop 1440×900, Touch Emulation 390×844 / DPR 2. 실제 휴대폰 하드웨어와 Firefox/Safari는 검증하지 않았습니다. 파일은 직접 `file://`로 열었으며, 외부 네트워크가 차단된 상태에서 실행했습니다. GitHub Actions에서는 설치한 Playwright Chromium으로 동일 테스트를 실행하도록 구성했습니다. GitHub Pages는 게시하거나 검증하지 않았습니다.

## 규칙 검증 범위

- 12×10 지도, Dijkstra 지형 비용, Kai의 숲 비용 예외, 점유 충돌, Ruin 통과 불가, 직교 경로와 이동 예산.
- 자유 배치 Swap, 정보 보존, 추천/공격/방어 배치, 이동 1회, 행동 이전 이동 취소와 이후 취소 금지.
- Archer 사거리 2–3와 인접 Dead Zone, Fire Bolt 1–3, 물리 DEF / 마법 RES, Hawk Eye, Unstable Mana, Quick Strike 협공.
- 피해, 명중, Critical, 1회 반격, Guard 실제 대행과 잠재력, 저 HP Eric 피해 감소, HP 상한/전투불능.
- Heal, Gentle Hands, 같은 대상 반복 치유 EXP 제한, 고정 성장, 다중 Level Up, 단서 중복 방지.
- 인접 주민 구출, 제거된 점유, 2턴 증원 경고 → 3턴 2명 출현, 5턴 이전 주민 직접 타격 금지, AI의 실제 이동/사거리.
- 주민 구출과 Boss 격파의 결합 승리, 주민 사망/전원 전투불능 패배, Shadow Step 다음 턴 보너스.
- 동일 Seed 재현, 적 Phase 도중 Save Cursor 재개, 현재 HP/MP/RNG/Undo/성장 저장.
- Checksum, 잘못된 데이터 거부, Last-Good 복구, Quota 실패 반환, Schema Migration 진입점, 초기화.
- 승리 후 성장 보존 Replay, 패배 시 전투 전 성장으로 Retry, 새 Level Practice.

## 화면 조작 검증

Title → Intro → War Room → 다섯 장수 확인 → 자유 배치 Swap → 추천 배치 → Battle. 실제 Canvas Tile을 클릭하고 정상 Command/Forecast/Confirm으로만 공격·마법·치유·구출했습니다. Read-only 진단 API로 상태를 확인했으며 HP 조작이나 승리 우회 API를 사용하지 않았습니다.

추천 배치/기본 Seed의 UI 완주는 5턴 승리였습니다. 주민 2명, 증원 2명, Boss 격파, 성장 결과 5장과 Level Up, 일부 장수 전투불능을 확인했습니다. 새로고침 후 같은 저장 상태, 승리 결과의 복원, 성장한 장수 Replay, 정상 텍스트 복원, 잘못된 복원 거부를 확인했습니다.

아무 행동 없이 적 Phase만 진행하면 6턴에 주민 사망으로 패배했습니다. 이후 Retry가 전투 전 성장으로 돌아옵니다. 손상된 최신 저장은 이전 정상 저장에서 복구되며 안내를 표시했습니다. Mouse Wheel Zoom, Pan, 페이지 Overflow 없음, 모바일 패널/터치 이동을 확인했습니다. 초기 모바일 자동화는 패널의 닫힘 Animation 도중 탭해서 실패했으며, 닫힘 완료 후 탭하도록 수정한 뒤 통과했습니다.

## 배치와 밸런스

추천/공격/방어 배치 × Seed 5개 (`1`, `42`, `20261014`, `77`, `313`) × Guard 추구 여부 2종의 정상 규칙 기반 정책으로 30회 완주했습니다.

| 항목 | 결과 |
|---|---:|
| 승리 턴 | 3–5 |
| Eric 잠재력 획득 | 9회 |
| Eric 잠재력 미획득 | 21회 |
| 일부 장수 전투불능 후 승리 | 9회 |
| 전원 생존 승리 | 21회 |
| 무행동 전략의 주민 구출 실패 | 6턴 패배 |

기본 Seed에서 추천 배치는 5턴, 공격 중심은 4턴, 방어 중심은 3턴(공격 정책)/4턴(Guard 정책)이었습니다. 배치 차이가 첫 두 턴의 실제 도달 칸과 사격/구출 순서에 반영됐습니다. 정책은 완주 가능성 검증이며 초보 사용자 난이도나 재미를 수치로 증명하지 않습니다.

## 개발자 직접 플레이 평가

방어 중심 배치를 선택하고 자동 정책 없이 화면 버튼과 Tile을 직접 지정했습니다. 첫 턴 Lia를 전진시켜 Fire Bolt, Elina의 우회 사격, Kai의 공격, Eric의 Guard를 사용했습니다. Enemy Phase에서 Guard가 실제로 Lia를 보호해 Guardian’s Oath 단서가 기록됐습니다.

이후 원거리 유닛의 인접 Dead Zone을 피해 위치를 바꾸고, 저 HP Lia를 후퇴시켜 마법 반격을 피한 다음 Sain으로 치유했습니다. 좁은 중앙 진입로에서 동료의 점유와 Ruin 때문에 이동이 실패하는 경험도 확인했습니다. 산적 대장을 먼저 격파한 뒤 Kai의 숲 이동을 활용해 마지막 주민을 구출하여 **6턴, 전원 생존, 잠재력 단서 획득**으로 승리했습니다. Eric LV 3, Elina LV 3, Lia LV 2, Sain LV 3, Kai LV 2를 결과 화면에서 확인했습니다.

관찰과 판정:

- **장수 역할:** Archer의 거리 유지, Mage의 RES 공격, Healer의 회복 순서, Knight의 보호, Rogue의 구출 경로가 실제 선택을 바꿨습니다.
- **전술 선택:** 혼잡한 중앙 길에서는 이동 순서가 중요했습니다. 빠른 구출은 쉬운 필수 목표를 확보하고, 보호·협공은 다른 성장 경험을 만들었습니다.
- **예측:** 피해/명중/반격/잔여 HP를 확인한 후 결정할 수 있습니다. Critical과 Miss로 오차가 생긴다는 설명을 함께 표시했습니다.
- **성장:** 실제 전투 중 Level Up과 종료 시 성장/활약/다음 목표를 표시합니다. 성장한 군단 Replay가 가능합니다.
- **UI 개선:** 초기 화면의 안내가 Tile을 가렸으므로 별도 여백에 배치했습니다. Forecast를 선택하면 상세 Stats와 Commands를 접어 확정 버튼이 바로 보이도록 했습니다. 한글 Font를 인라인으로 포함했습니다. 최종 UI는 62개 E2E와 별도 화면 검증을 다시 통과했습니다.
- **남은 게임성 한계:** 숙련 정책에는 짧고 관대한 첫 미션입니다. 새 미션과 전직은 아직 없으므로 장기 반복 재미는 판단할 수 없습니다. 외부 초보 사용자 테스트도 아직 수행하지 않았습니다.

## 저장 / 배포 판정

`Ashen_Crown_v0.1.0.html`은 외부 Asset 없이 실행됩니다. Canvas의 픽셀 확대에는 Smoothing을 사용하지 않습니다. Font는 OFL을 포함한 명칭 변경 Subset입니다. Save Schema 1에 HP, MP, 성장, 결과, 전투 상태, 턴/Phase, RNG와 AI Cursor가 포함됩니다. Schema 0 Migration 구조가 있지만 이전 Ashen Crown 릴리스는 존재하지 않아 실제 이전 사용자 데이터 Migration은 검증 대상이 아닙니다.

브라우저 저장은 경로/프로필 변경이나 Eviction에 영구 보장되지 않습니다. 실패 안내, Last-Good 복구와 텍스트 백업으로 대응합니다. Source ZIP에는 코드, 테스트, 문서, 실행 HTML과 증거 JSON을 포함합니다. 로컬의 임시 Browser 파일 및 Screen Capture는 포함하지 않습니다.

GitHub PR/CI 상태는 최종 제공 시 실제 원격 결과를 별도로 확인합니다. 이 문서의 로컬 PASS를 원격 CI PASS로 대체하지 않습니다. 자동 병합하지 않습니다.
