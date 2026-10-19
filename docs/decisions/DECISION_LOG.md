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

## 2026-10-18 — Play-test feedback + Phase E
- D-041 Dialogue window — user-directed (chat 13:14 KST). Classic SRPG layout benchmarked from the user's screenshot (layout only, original art): large bust overlapping a translucent box, amber name, tap anywhere to advance, only Auto/Skip at the top-right; all other dialogue buttons removed. Skip now also finishes unseen scenes (lines still go to history) so the requested Skip button works on a first play-through.
- D-042 M06 implementation values — PROPOSED (docs/story/act1/MISSION_06.md 구현 표): refugee escort 2 tiles/turn (1 with the lever, none at ≤50% HP), Sain may heal refugees in M06, no instant Rescue in M06, Oath Banner lasts the phase-3 Player Phase and the next, a TURN 16 safety limit, soldiers prefer heroes over refugees (pursuers excepted). Oath scene wording and the ACT I card text are PROPOSED within D-035/D-037; the three banners of ACT II are only teased, not named.
- D-043 One strategist on the map — user bug report 2026-10-18 20:21 KST. The separate staff aide made Lia appear twice; the aide is removed, Lia's war table is the council interaction point and Lia speaks the briefing openings. Supersedes the aide detail of D-038 (Lia as strategist stays CANON).
- D-044 Sortie selection — user-directed (chat 2026-10-18 21:37 KST). Heroes may stay in reserve before a battle (`benched`, pre-battle only; reserve heroes take no part and earn no battle EXP). Erik is always in the sortie (PROPOSED, D-031 lead); minimum one hero. Mission rules that name a hero simply do not trigger when that hero is in reserve.

## 2026-10-19 — Mobile battle feedback + Phase F
- D-045 Level-relative EXP from M04 — PROPOSED (Phase F balance, within the D-039 re-baseline). The six-mission legal-policy run showed flat EXP snowballing one hero (Lia averaged Lv 20.8 after ACT I while Erik was Lv 4.6). M04–M06 now carry a mission level (5/6/7); a hero more than two levels above it gets −20% EXP per level (floor 20%), one more than two below gets +20% per level (cap 160%). M01–M03 have no mission level, so their EXP is exactly as approved. Result on the same 30 seeds: Lia Lv 13 at ACT I end, all 30 campaigns still clear. Revert = delete the three `level` fields.
- D-046 Battle commands on phones — user-directed (chat 2026-10-18). Tapping a hero only opens the command sheet (이동/공격/스킬/도구/대기/상태); move cells appear only after 이동 (the map overlay and the range list now share one source, so cells are never drawn in a mode that cannot use them). A skill/attack target is previewed on the first tap and executed on a second tap of the same target or 행동 확정. On phones the command sheet sits just above the dock so 턴 종료 stays reachable.

## 2026-10-19 — v0.5.0 Phase B approvals
- D-047 Promotion timing — APPROVED_DIRECTION (user, chat 2026-10-19 12:2x KST, option A). Promotion opens after ACT I in the Ashen Legion camp: Aren holds a promotion rite for a hero who meets the conditions, and a short non-story trial battle per hero confirms it; repeatable Legion Drills let under-levelled heroes catch up. M01–M06 rules, rewards, EXP and balance stay as released in v0.4.0.
- D-048 Promotion content — APPROVED_DIRECTION (user: "설계안대로"). Five Tier 2 classes, each with one new tactical action — Erik Guardian Knight/방벽, Elina Ranger/경계 사격, Lia Arcanist/마력 지형, Sain Ember Cleric/귀환의 기도, Kai Shadowblade/그림자 교환 — and conditions Lv 6 + Potential 3/3 (from tacticalMemory) + ACT I complete. Proficiency ★ (hit +2%/★ or heal +1/★) as designed. Names and numbers may still be tuned after play-tests (docs/v0.5.0/CLASS_PROGRESSION_DESIGN.md).
- D-049 Tier 2 art — user will commission 20 busts + 5 sprite sheets through ChatGPT using docs/v0.5.0/ART_BRIEF_TIER2.md (same spec as v0.4.0). Until then promoted heroes use a recoloured/propped fallback that is never labelled finished. Outfit descriptions are PROPOSED.
- D-050 Tier 2 art applied (2026-10-19). The user's pack Ashen_Crown_v050_Tier2_25_Claude_Pack (20 busts + 5 sheets, SHA256 64/64 verified) was imported from its PNG masters with scripts/import-art.py (same pipeline and size budget as v0.4.0). Promoted heroes (classTier ≥ 2) resolve to `<id>_t2` busts and sprites; tier-1 looks and eric_adv (Guardian Mantle, Lv 5) are unchanged. Pack manifest/SHA256/QA and the before/after preview are kept in docs/v0.5.0/art.
