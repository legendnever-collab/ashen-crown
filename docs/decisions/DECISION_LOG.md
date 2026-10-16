# Decision Log
2026-10-14; source: user Master Task (prior explicit approvals restated). CANON changes require user approval record.
| ID | Title | Status | Rationale |
|---|---|---|---|
| D-001 | Commander/Battle Hero separation | CANON | 장수 육성 중심, Aren 비출전 |
| D-002 | Classic Fantasy SRPG + 조조전형 전술 | CANON | 전술·병종·성장 애착, 오리지널 IP |
| D-003 | Classic Pixel Art | CANON | 16-bit identity, pixel-perfect |
| D-004 | 장수 육성 중심 | CANON | 전쟁 경험과 장수 이야기 연결 |
| D-005 | 혼합 관계 B안 | CANON | 전우/정찰병/마도사/치유사/여행자 |
| D-006 | 4막 30 Mission / 3 endings | CANON | 장기 서사 연속성 |
| D-007 | ACT I 국경 전쟁 | CANON | 마을 보호에서 왕국 의심으로 |
| D-008 | 성장·전직 외형 변화 | CANON | 성장 체감, 상세 임계값 유동 |
| D-009 | Original BGM | CANON | 자체 제작·provenance, offline |
| D-010 | GitHub Documentation-first | CANON | 새 세션의 복원성 |
| D-011 | Erik LV5 Tier2 시범 | PROPOSED | 3 Mission 내 체감, 전직 자체 아님 |
| D-012 | 최초 클리어 성장 확정/연습 비확정 | PROPOSED | 반복 EXP 인플레이션 억제, legacy 보존 |
| D-013 | 왕관 희생 작동·재상 책임 세부 | OPEN | 정치·결계 인과 검증 필요 |

2026-10-14 implementation decisions (PROPOSED, not story canon): M03 initial 8-turn candidate expanded to 10 after 30 legal-rule campaign seeds required 4–9 turns. First-clear rewards/practice and Erik LV5 outfit sample retain old growth; full class behavior moves to v0.5. Source synthesis selected to avoid external audio dependencies. Native 64/128 art retained because silhouette/detail improve readability without a uniform 2× asset increase.


## 2026-10-14 — explicit user v0.3 Master Task
- D-014 Hybrid Town Exploration — CANON (actor clause superseded by D-031): Aren 직접 이동, 방문 후 Fast Travel, keyboard/mouse/touch, 전투와 별도 mode, 육성에 기여.
- D-015 Pre-Battle RPG Loop — CANON: Story → Town/Camp → NPC → shops/upgrade → preparation → War Council → battle → aftermath.
- D-016 Recruitment Through Story — CANON: encounter/personal event/decision. 세부 영입 분기는 PROPOSED. 초기 5명 출전 유지, affiliation만 시범 구현.
- D-017 Version Scope Revision — APPROVED_DIRECTION: v0.3 Living Frontier, v0.4 Broken Allegiance M04–06, v0.5 Advanced Class, 이후 ACT II–IV. 과거 일정 항목을 대체한다.
- D-018 Economic checkpoint — implementation policy: canonical campaign assets; attempt working copy at departure; practice isolated. First clear commits inventory and bounded Gold, retry/restart restores departure assets. No reward farming. Existing legacy heroes/results preserved. Default gear zero bonus, purchases additive and class checked; one upgrade per instance.



## 2026-10-14 — v0.3.1 user Master Task
- D-019 Walkable shop lifecycle: separate maps/owners/exit; durable doorway return; no automatic exterior relocation on transactions.
- D-020 Weapon-first atomic buy/equip: exact effective-stat comparison, eligibility and idempotent nonce, save failure rolls back both assets and equipment.
- D-021 Rendering: retain logical TILE=64; native 128 terrain/sprite detail, 256 portrait backing; standard desktop density 2.1 to meet ≥4× baseline pixels even with different font/viewport metrics. Mobile backing follows device scale. Cache terrain and preserve pixelated/no-smoothing rendering.
- D-022 Geometry: preserve old core and all save coordinates; add distinct rectangular side routes/facilities, shared camera and minimap. Existing deployment/bridge safe zone coordinates intentionally preserved.
- D-023 Tactical identity: class MOV 2/3/3/3/4, explicit terrain profiles, allied traversal/no allied landing, reserved mounted modifier. M03 deadline remains 10.
- D-024 Popup placement: center obstruction has higher penalty than sprite-edge overlap; protects reachable cells and targets, prioritizes enemy input on constrained screens. Informational quest text passes map clicks through.
No new story facts promoted to CANON. Reference screenshots were mentioned in the task but not attached in this execution; no direct copyrighted image comparison claimed.

D-025 v0.3.1 final audit: reinforcement warning locations derive from authored mission spawns (M01 north/M03 rear, none in M02), not fixed village corners. Root developer/readme/changelog documents are included in the same release tree.

## 2026-10-16 — approved v0.3.2 task
D-026 runtime held input and transient explicit doors; no serialized pressed keys/modal. D-027 owner menus preserve weapon-first atomic equip. D-028 own-phase terrain recovery with saved marker, attack-first bounded enemy preference. D-029 preserve base Gold; additive stable reward IDs and deferred capacity delivery, Schema5 catchup. D-030 legal campaign test withdrawal uses actual terrain path distance; old Manhattan-only policy could stall beside bridge obstacles after healing changed combat state. Story canon unchanged.

## 2026-10-16 — explicit user v0.3.3 Master Task
- D-031 Erik as Unified Player Protagonist — CANON. 에릭은 마을/야영지 직접 조작 인물이자 기존 `eric` 전투 장수다. 성장/장비는 같은 battle entity를 읽는다. D-014의 Aren avatar 조항을 대체한다. 아렌은 비출전 군단장, 에릭의 오랜 전우, 정치적 책임/잿빛 밤/왕관 서사 담당을 유지한다. D-001의 지휘관/전투 장수 분리는 유지한다.
- D-032 Advisor-driven Campaign Progression — CANON. 군사 NPC 대화 → War Council → Free Deployment → Confirm → Battle. War Room 건물은 필수 gate가 아니다. D-015의 준비 loop를 구체화한다. 신규 기능 NPC의 개인 이름/과거는 PROPOSED이며 확정하지 않는다.
- D-033 Door geometry / migration — implementation policy. Single facade threshold anchor and exact front approach; pointer uses existing inverse camera transform. Schema6 migrates legacy exterior/interior/return/nested checkpoint positions, preserving all non-spatial payloads. Advisor request persists across dialogue reload; input/camera animation remains runtime only.
Requested D-014/015 IDs were occupied; D-031/032 are assigned without renumbering historical decisions.

## 2026-10-16 — v0.4.0 Phase B user approvals (chat, 18:5x KST)
- D-034 Erik–Baldrick past — CANON (user chose option B "구출된 생존자"). 에릭이 발드릭 휘하에 있던 시절, 발드릭은 명령을 어기고 에릭만 전장에서 끌어냈고 남겨진 에릭의 동료들은 희생되었다. 에릭은 발드릭에게 목숨의 빚과 함께 동료를 지키지 못한 자책을 진다. 시기·장소·부대명·희생자 이름은 OPEN.
- D-035 M06 royal order — CANON (approved). 왕실 명의 국경 봉쇄 명령 = 관문 봉인 + 피난민 통행 금지 + 성채 기록 회수, 잿빛 밤 봉인 명령과 같은 형식. 서명은 '왕실 군령부'로만 표기한다. 재상 관여·실제 서명자는 비공개(ACT III).
- D-036 Lia's teacher clue in M04 — CANON (approved). 봉인술 기록에서 스승과 같은 표기 방식만 발견한다. 스승 이름·정체·생사는 OPEN 유지.
- D-037 Legion name — CANON (approved). ACT I 종료 시 독립 군단의 이름은 재의 군단 (Ashen Legion).
- Not asked / still PROPOSED: Q4 성채 병참관 기능 이름, Q5 발드릭 외형(검은 판금·사자 갈기 망토·장창, 독자 디자인), C1–C3 선택지 세부, 미션 수치.

## 2026-10-16 — Cao Cao's Legend benchmark pass (user feedback, chat 21:13–21:16 KST)
- D-038 Lia as Legion Strategist — CANON (user chose option A). 리아가 군단의 군사(작전 참모)를 겸임하고 계속 출전한다. 작전 회의를 리아가 주재하며, 기존 기능 NPC "작전 참모"는 리아의 보좌로 바뀐다(개인 이름·과거 없음). D-032 진행 흐름(군사 대화 → War Council → Free Deployment)은 유지한다.
- D-039 Balance re-baseline — approved. Guard·지형 보정·EXP·레벨업 회복 변경으로 M01–03 결과는 v0.3.3과 달라진다. 6개 미션 전체를 legal-policy 시뮬레이션으로 재검증해 클리어 가능성과 난이도를 확인한다.
- D-040 Benchmark scope: gameplay conventions, information layout and presentation density of classic tactical SRPGs (Cao Cao's Legend) are benchmarked; all art, UI chrome, characters and text remain original. Order: B1 controls/bugs → B2 systems → B3 dialogue/strategist → B4 graphics sample → approval → rollout → Phase D (M05).
