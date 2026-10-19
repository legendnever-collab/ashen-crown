# v0.5.0 Test Matrix (계획)

| 영역 | 검증 | 도구 |
|---|---|---|
| 기존 회귀 | 다음 결과가 불변: 161 unit, balance(M01), campaign-balance, economy-balance, m05/m06/act1-balance (A안 기준), 기존 browser 17 suite | npm test, 기존 suites |
| 잠재력·숙련 | tacticalMemory 소급 판정; practice 기록 제외; 단계별 로그; ★ 구간 경계값 | unit |
| 전직 | 조건 미충족 시 의식 불가; 시련 승리 시 1회만 확정; 재시도·연습 격리; classTier·외형 전환 | unit + `class-e2e` |
| 새 행동 | 방벽 정지 / 경계 사격 반응 1회·이동 종료 / 마력 지형 2턴·화염 연장 / 귀환의 기도 빈칸·회복 / 그림자 교환 대상 제한·반격 봉쇄 | unit (`tests/class-actions.test.mjs`) + `test:class` (1440 마우스 / 390×844 터치) |
| 적 AI | 차단·룬·경계 범위 회피, 교착 0, 결정적 seed 재현 | unit + balance |
| 시련·훈련 | 시련 5종 × 30 seed 승률 ≥ 90%, 새 행동 미사용 시 난이도 상승 측정, 훈련 Lv 6 도달 전투 수 | `class-balance` |
| 저장 | Schema 8 ← 0–7 import; 실제 v0.4.0 저장(M06 이후 진영, 전투 중)으로 이어하기; 백업/복원 | `migration-v040` |
| UI | 스킬 탭 전직 행동; 정보창 전직·숙련; 모바일 3열 메뉴; 1440 / 844×390 / 390×844 / 360×640 / 430×932 넘침 0; 런타임 오류 0 | Playwright |
| 아트 | 아트 팩 SHA256 검증; Tier 2 반신·시트 렌더; fallback 표기 | unit + 스크린샷 |
| 패키지 | 재빌드 byte-identical, verify-release, Source ZIP/SHA256, CI | scripts + CI |
