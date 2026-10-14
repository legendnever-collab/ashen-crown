# Ashen Crown v0.1.3 — Post-move Attack Soft Update

검증일: 2026-10-14, Asia/Seoul

Repository: https://github.com/legendnever-collab/ashen-crown

기준선: v0.1.2 PR #3을 사용자 지시에 따라 병합. main Merge Commit `525c664b0c866412b1be6040fe061e2b6e6d3341`. v0.1.2 PR CI Run `38492784048` success 확인 후 병합했으며 이전 PR #1/#2도 merged 상태입니다.

v0.1.3 Branch: `fix/v0.1.3-post-move-attack`. 이번 패치는 PR로 제공하며 자동 병합하지 않습니다.

## 재현된 문제

이전 v0.1.2 Standalone HTML을 실제 `file://` 브라우저로 실행하고 정상 배치/이동/확정/Map Tap을 사용했습니다. State 주입 없이 Eric을 (5,8)에서 (4,5)로 이동하고 인접한 Rook (3,5)을 눌렀습니다. 좌표는 0 기반입니다.

360×640 Touch에서 두 문제가 재현됐습니다.

1. Eric 선택 Pointer Up에서 행동 메뉴를 삽입한 뒤, 같은 Touch의 후속 Click이 새로 생성된 ‘구출’ Button에 전달됐습니다. 선택만 했는데 `mode=rescue`, `menu=null` 상태가 됐습니다.
2. 이동 확정 후 작은 메뉴가 인접 Rook의 Tile을 덮었습니다. `elementFromPoint` 결과가 Canvas가 아니라 메뉴의 Button이었으며, Enemy Tap 후 공격 예측이 열리지 않았습니다.

Desktop 1440×900, Touch 390×844 / 844×390에서는 같은 공격 재현이 정상 동작해 화면 크기에 따른 간헐적 오류임을 확인했습니다. 증거: `docs/v0.1.3/post-move-baseline.json`. `BASELINE=1 npm run test:post-move`로 이전 HTML에서 재현할 수 있습니다.

## 수정 범위

- Pointer Down에서 실제 누른 Command Element를 기록합니다. Map 선택 도중 Pointer Up에 새로 만들어진 메뉴 버튼은 같은 Gesture의 Click을 받더라도 실행하지 않습니다. Keyboard Enter/Space 등 Click Detail 0은 계속 허용합니다.
- 메뉴 위치를 고정 방향 하나가 아니라 화면 안의 여러 후보에서 계산합니다. 가까운 Enemy Target을 우선 보호하고 다른 Ally 선택 위치도 고려합니다. 현재 Viewport에서 가능한 범위 내에서 Map 클릭을 가리지 않도록 배치하며 메뉴 내부 Scroll을 유지합니다.
- 인접 궁수 사격, 사거리 초과, 이미 사용한 행동은 구체적인 이유를 하단에 표시합니다. Elina의 2–3칸 사거리를 유지하고 인접 사격 실패 시 이동 취소 후 거리 확보를 안내합니다.
- 이동 확정은 이동권만 사용합니다. 기존 이동 확정/취소, 공격 예측/확정, Undo, HP/MP, 반격, RNG, 성장, AI, 지형 수치와 Save Schema 1을 유지했습니다. 전투 규칙 파일은 변경하지 않았습니다.

## 최종 검증

| 항목 | 결과 | 증거 / 실행 |
|---|---|---|
| 단위 테스트: 기존 43 + 메뉴 위치 3 | 46 PASS / 0 FAIL | `npm test`, `docs/v0.1.3/unit.log` |
| Title→전투→승리/패배→성장→저장→Retry | 64 PASS / 0 FAIL | `npm run test:e2e`, `docs/v0.1.3/e2e.json` |
| 4개 모바일 크기·터치 완주·이전 저장 | 80 PASS / 0 FAIL | `npm run test:mobile`, `docs/v0.1.3/mobile-dock.json` |
| 이동 미확정/취소·메뉴·Fire Bolt·도구 | 26 PASS / 0 FAIL | `npm run test:tactical`, `docs/v0.1.3/tactical-ui.json` |
| HTTP 시작/이동 확인/Reload | 4 PASS / 0 FAIL | `npm run test:http`, `docs/v0.1.3/http-smoke.json` |
| 새 이동 후 공격 회귀 | 8 시나리오 PASS | `npm run test:post-move`, `docs/v0.1.3/post-move-attack.json` |
| 추천/공격/방어 배치·Seed·Guard 전략 | 30회 정상 규칙 승리 | `npm run test:balance`, `docs/v0.1.3/balance.json` |

새 회귀는 Desktop 1440×900, Touch 390×844 / 360×640 / 844×390에서 각각 다음을 확인합니다.

- Map Tap은 장수 선택/메뉴 열기만 수행하고 잘못된 Command를 추가로 실행하지 않습니다.
- Eric 이동 확정 후 행동권이 남아 있고, 인접 Rook의 중심점 Hit Test가 Canvas입니다. 적을 Tap하면 예측이 열리고 확정하면 정상 공격·RNG·행동권이 반영됩니다.
- Elina를 자유 배치 후 인접 위치로 이동합니다. 인접 공격은 안내와 함께 거절되고 Game State/MP/RNG/행동권이 그대로입니다. 이동 Undo → 정상 사거리로 재이동 → Keyboard Enter로 Attack 선택 → 실제 공격을 확인합니다.

모바일 전용 E2E는 v0.1.0 / v0.1.1 / v0.1.2의 실제 이전 HTML에서 만든 전투 백업을 복원하고 유닛/성장/RNG가 일치함을 확인합니다. 일반/모바일 E2E의 외부 Asset 요청과 Runtime Error는 0입니다. 브라우저 API는 Read-only Diagnostics이며 승리 우회나 쓰기 가능한 State 주입은 없습니다.

환경: Linux, Node.js 24.19.0, Playwright 1.58.2, Chromium 143. 파일 직접 실행 및 Offline Context, 별도 HTTP 스모크. 실제 Android/iPhone 하드웨어와 Safari/Firefox는 검증하지 않았습니다. 모바일은 Touch Emulation 기준입니다. GitHub Pages는 게시/검증하지 않았습니다.

최종 화면 Capture에서 작은 화면의 이동 후 메뉴와 공격 접근성을 시각 검수했습니다. 자동 테스트는 재미 평가를 대신하지 않으며, 이번 작업은 기존 전투 경험의 조작 안정화 패치입니다.

## 전달

`Ashen_Crown_v0.1.3.html`은 모든 코드·원본 픽셀 아트·폰트가 Inline이며 오프라인 실행 가능합니다. `index.html`과 동일합니다. Source ZIP의 추출 후 동일 HTML 재빌드와 46개 단위 테스트를 검증합니다. 이전 실행 파일과 회귀 증거는 보존합니다.

파일 이름이 바뀌면 브라우저별 저장 경로가 달라질 수 있습니다. 이전 HTML의 메뉴 → 텍스트 백업을 복사해 새 HTML 메뉴 → 복원에 붙여넣을 수 있습니다. GitHub Actions 결과는 신규 PR Checks와 최종 안내에서 별도로 확인합니다.
