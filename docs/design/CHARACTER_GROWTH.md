# Character Growth
기존 반고정 성장·재능·Guardian’s Oath 유지. Talent/Class/Proficiency/Hidden Potential/Tactical Awakening은 장기 계층이며 전체 전직·각성은 미구현.
v0.2 정책: 최초 미션 승리만 군단 성장 확정. 재도전은 시작 체크포인트, 이미 클리어한 미션 연습은 임시 EXP만 표시하고 campaign.heroes를 갱신하지 않는다. v0.1에서 축적한 영구 성장·clears/results 보존, mission ID 없는 승리 기록은 M01 완료로 이관.
Tactical Memory: 실제 Guard 피격, Forest 사격, 구조, 치유, Kai 우회 행동을 기록. M03 Bond는 실제 행동을 요구, 실패해도 진행 가능.
Appearance: Erik LV5 시 Tier2 시범(3개 미션 안에 체감 가능하도록 후보 10에서 조정); story/class key 구조 지원, Tier3 예약. 전직 능력을 임의로 해금하지 않는다.

LV 초기 연습은 초기 장수 수치를 사용하되 기존 campaign.heroes/flags/completed/results를 보존하고 practice=true로 확정 보상을 차단한다. 패배 후 Retry는 stageStart.campaign으로 현재 전투의 Flag/Bond/Memory를 되돌리되 패배 기록과 viewed dialogue는 남긴다.

Equipment bonus lives outside growth stats, never compounds on reload. Full tactical classes v0.5. First-clear growth and isolated practice unchanged.
