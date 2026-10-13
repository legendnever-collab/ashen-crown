# Ashen Crown v0.1.1 — Mobile Command Dock & Hero Identity

검증일: 2026-10-14 (Asia/Seoul)

Repository: https://github.com/legendnever-collab/ashen-crown

Branch: `feature/v0.1.1-mobile-command-dock`

기준선: v0.1.0 Feature Head `65c4bccb78817fb3b5e7c01f5ed1bd12f22146d8`. 개발 시작 시 main은 초기 README Commit에 머물러 있었으며 PR #1은 미병합 상태였습니다. v0.1.1은 검증된 v0.1.0 코드에서 분기했습니다. 신규 PR은 main에 전체 최신 구현을 제안하며 자동 병합하지 않습니다.

## 변경 결과

| 요청 | 구현 |
|---|---|
| 모바일에서 장수를 누르면 즉시 활성화 | Map의 아군을 직접 Tap/Click하면 선택 강조와 하단 얼굴·이름·HP/MP 갱신 |
| 새 창 없이 이동·공격 | Desktop과 Mobile 모두 하단 고정 Command Dock 사용; 전투용 Drawer 제거 |
| 이동 버튼 → 이동 가능 범위 | 기존 Dijkstra의 지형 비용/점유 Rule로 표시 |
| 이동 후 행동 조건 표시 | 이동 완료 후 하단 Action Chooser, 이동 사용 여부·사거리 표시 |
| 같은 자리 재선택 | 이동 범위에서 자기 Tile을 Tap하면 제자리 행동 안내; 이동·MP·RNG 미소모 |
| 공격/스킬 예측 | 동일 Dock에 피해·명중·반격·잔여 HP·Critical 안내와 확정/취소 |
| 화면 안의 Phase 종료 | 남은 행동 확인도 하단 Inline Confirmation |
| 해상도 2배 | Native Tile 32×32 → 64×64, 세부 Pixel을 새로 그림; 전체 Map 원본 768×640 |
| 장수 개성 | 기사 갑옷/방패/흉터, 사수 붉은 땋은 머리/녹색 의상/활, 마법사 보라 모자/수정 지팡이, 치유사 흰 Hood/어두운 피부/성물, 도적 주황 Scarf/단검 |
| 얼굴 표현 | 전신 Sprite 확대 대신 별도의 128×128 Pixel Portrait 5종 |

전투 규칙, 미션, 스킬, 성장 수치, AI, Seeded RNG는 v0.1.0 기준을 유지했습니다. 새 미션이나 성장 시스템은 추가하지 않았습니다. Native Pixel을 Nearest-neighbor 방식으로 표시하며, 모바일의 물리적 화면 크기에 따라 화면상의 Tile은 축소될 수 있습니다. 이는 저해상도 Sprite를 두 배 확대하는 방식과 다릅니다.

## 실행 검증

| 항목 | 결과 | 증거 |
|---|---:|---|
| 기존 Rule / Growth / Persistence | 35 PASS / 0 FAIL | `docs/v0.1.1/unit.log` |
| Desktop·Save·Retry·Touch 기본 E2E | 64 PASS / 0 FAIL | `docs/v0.1.1/e2e.json` |
| 모바일 Command Dock 전용 E2E | 76 PASS / 0 FAIL | `docs/v0.1.1/mobile-dock.json` |
| 추천·공격·방어 배치, Seed 5개, Guard 전략 | 30회 승리 | `docs/v0.1.1/balance.json` |
| 두 손가락 Pinch / Touch Drag | PASS | 모바일 전용 E2E |
| v0.1.0 실제 HTML의 저장 → v0.1.1 복원 | PASS | 모바일 전용 E2E |
| 주요 Runtime Error / 외부 Asset 요청 | 0 / 0 | Offline Chromium Context |

환경: Linux, Node.js 24.19.0, Playwright 1.58.2, Chromium 143. Desktop 1440×900; Touch Emulation 390×844, 360×640, 430×932, 844×390, DPR 2. 파일을 `file://`로 직접 열고 네트워크 Offline Context에서 실행했습니다. 실제 Android/iPhone 기기와 Safari/Firefox는 검증하지 않았습니다. 원격 GitHub Actions 결과는 최종 제공 시 따로 확인합니다.

## 모바일 완주와 조건 검증

네 화면 크기에서 다음을 실제 Touch Event로 확인했습니다.

- 아군 Tap 직후 하단 Portrait와 이름 갱신, HP/MP 및 Command 영역이 Viewport 안에 유지.
- Move로 이동 범위 표시 → 자기 Tile Tap → 제자리 행동 조건. 이때 Game State가 그대로여서 이동·MP·RNG 소모가 없음.
- Attack → Map Enemy Tap → 하단 Forecast → 확정 버튼을 추가 창이나 페이지 Scroll 없이 조작.
- 페이지 Overflow 없음, Battle Command Dialog/Drawer 없음, 정상 Rule에 따른 Enemy HP 감소.
- Inline Phase 종료 확인을 취소하거나 다른 행동을 수행할 때 오래된 확인 상태가 남지 않음.

390×844에서 정상 규칙으로 생성한 완주 Trace를 실제 Map Tap과 Dock Button으로 실행했습니다. 주민 구출, 증원, Boss 격파, 승리, 성장 결과, Reload 후 승리 복원, Replay를 모두 확인했습니다. Game State 주입이나 승리 우회 기능을 사용하지 않았습니다. 테스트 API는 Read-only 상태 및 Camera/Range 진단만 제공합니다.

64×64 Tile / 128×128 Portrait 값과 다섯 Portrait Render의 차이를 확인했습니다. 화면 Capture를 직접 검토하여 Portrait, Tile Detail, 버튼 배치와 하단 Forecast 가독성을 확인했습니다. Frame마다 전체 지형을 다시 그리지 않고 원본 Map을 Cache해서 추가 Detail의 비용을 줄였습니다.

## 저장 호환과 사용 방법

Save Schema 1과 저장 Key를 유지합니다. 실제 이전 HTML에서 생성한 Battle Save를 Menu → Backup/Restore로 붙여넣었고 Unit State, Growth, Schema, RNG가 일치했습니다. 파일 이름이 변경되면 브라우저의 `file://` 저장 영역이 달라질 수 있으므로 이전 파일의 텍스트 백업을 새 파일에 복원할 수 있습니다.

전투: 장수 Tap → 하단 이동/공격/스킬 선택 → Map Tile/Target Tap → 하단 확정. Zoom은 +/- 또는 두 손가락 Pinch, Pan은 Touch Drag / 우클릭 Drag, Journal은 기록 버튼. 시스템 Menu의 백업·안내·초기화 Dialog는 유지하며 전투 행동에는 사용하지 않습니다.

한 전투만 포함하는 v0.1 Patch입니다. Portrait Mode에서 전체 전장과 버튼을 함께 보기 좋게 구성했고, 작은 Landscape 화면은 Pinch/Zoom/Pan으로 세부 위치를 확인할 수 있습니다. 실기기 UX와 미적 선호에 대한 최종 평가는 사용자의 플레이 검토가 필요합니다.
