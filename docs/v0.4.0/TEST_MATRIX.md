# v0.4.0 Test Matrix (계획)

상태: Phase B 계획. 아래 항목은 **아직 실행되지 않았다.** 실행 결과는 Phase C–G에서 `docs/v0.4.0/evidence/`와 Test Report에 기록한다.

| 영역 | 검증 | 도구 |
|---|---|---|
| 기존 회귀 | 112 unit, balance(M01), campaign-balance(M01–03 210 victories), 기존 browser suites 14종 결과 불변 | npm test, 기존 suites |
| M04 | Search 인접·1행동·이동 후 사용, 소각 TURN 7, 측면 배치 구역(M02 생포 Flag 분기), 장부 비소각, 승패 조건, bond_lia_kai | unit + `m04-e2e` |
| M05 | 기수 오라 수치, 대형 유지·고립 목표 AI, 발드릭 HP 하한/퇴각 2경로, 마차 파괴 패배, 기병 지형 제한, bond_elina_sain, C2 분기 | unit + `m05-e2e` |
| M06 | Phase 1→2→3 전환 조건, 부상 피난민 대기, Unseal 리아 1회/타 장수 2회, 봉화 파괴 증원 취소, TURN 11 봉인 패배, 맹세의 깃발 1회, C1·C3 분기 대사 | unit + `m06-e2e` |
| 캠페인 | 신규 게임 → M06 → ACT I 완료 연속 플레이, Advisor → Council → Deployment 6회, 결과 화면 진행 버튼, aftermath 정직 표시 | `campaign-act1-e2e` |
| 밸런스 | legal-policy 30 seed × M04–06 승리, 교착 0, 평균 턴/생존 수 기록 | `act1-balance` |
| 저장 | Schema 7 ← 0–6 import, 실제 v0.3.3 세이브(탐색/전투/체크포인트/M03 aftermath) → M04 진입, 백업/복원, 전투 중 새로고침 복원 | `migration-v033` |
| 보상 | v040 ID 1회 지급, 재플레이 비지급, 용량 초과 지연 지급, 원장 검증 | unit |
| 서사 | 신규 Flag/선택 저장, 금지 공개(재상·왕관 원리·명령 서명자) 문자열 검사, 한글 글리프 | documentation test 확장 |
| UI | 1440 / 844×390 / 390×844 / 360×640 / 430×932 가로 넘침 0, 신규 행동 버튼 터치, 런타임 오류 0, 외부 요청 0 | Playwright |
| 패키지 | 재빌드 byte-identical, verify-release, Source ZIP/SHA256 | scripts |

미검증으로 남는 항목 (계속 명시): 실기기 휴대폰, Safari/Firefox, 장기 저장소 eviction.
