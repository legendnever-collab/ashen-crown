# Development Roadmap
APPROVED_DIRECTION, 2026-10-14 user v0.3 Master Task. Story CANON과 실제 구현 상태를 구분한다.
- v0.1.x First Battle Foundation: M01, free deployment, five heroes, growth/save/restart. Completed.
- v0.2.0 The Burning Frontier: M01–03, narrative, identity, original BGM, schema2. PR #5 merged fdcdcc42e3adaca7c961dd76dd51268b358ce08f.
- v0.3.0 The Living Frontier: Hybrid Town/Camp, pre-battle story, shops, inventory, equipment/one upgrade, affiliation framework, preparation and aftermath. Release Candidate implemented and locally verified, see [status](../handoff/CURRENT_STATUS.md).
- v0.4.0 The Broken Allegiance: M04–06, abandoned fort / royal supply investigation / Baldrick / Ashen Oath, ACT I completion. Previously v0.3 scope moved here, not deleted. Released 2026-10-19 after user play approval (tag v0.4.0).
- v0.5.0 Advanced Class & Character Progression (Ranks of the Ashen Legion): tactical class evolution, advanced growth and hero-specific appearance — promotions after ACT I with trials and the Legion Drill, potential and proficiency, the world map of Erdia and six painted interlude hubs. Merge approved by the user 2026-10-20. Awakening (Tier 3) is reserved for ACT II.
- v0.6.0 The Three Banners (ACT II, part 1): M07 북부의 군령 and M08 협곡 방어전 in the castle town below Ironhold — allied armies, sorties of six, faction trust, Thea as the first recruit; painted rooms and chests, connected dialogue, Hangul names. Merge approved by the user 2026-10-26 (D-065).
- v0.6.1 The Three Banners (ACT II, part 1 complete): M09 자유의 도시 and M10 두 영주의 전쟁 in Velmar — rooftop assassins, a three-way battle with support or mediation, Dario as the second recruit, three original ACT II tracks. Merge approved by the user 2026-10-26 (D-067).
- v0.7.0 The Three Banners (ACT II, part 2a): M11 성화의 행렬 and M12 침묵의 수도원 below the Sacred Flame cathedral — night light and braziers, stealth with watching guards and the bell, Ines as the third recruit, Sain's past, two original tracks. Merge approved by the user 2026-10-27 06:16 KST (D-068/D-069/D-070).
- v0.7.1 The Three Banners (ACT II complete): M13 검은 사자의 결단 (persuasion and Baldrick's resolve) and M14 부서진 동맹 (the summit, masked raiders, betrayal by the lowest-trust banner, recruits who may leave), the ACT II completion card. Merged after the user's play-test with the music mute fix (D-071, D-072).
- v0.8.0 Tactics (전술, D-073/D-074): three skills per hero, status effects, targeted and thrown tools, class matchups, schema 10. Merge approved by the user 2026-11-01 (D-075).
- v0.8.1 Arms (무기, D-073/D-076): regional and elite gear, Velmar's rare-goods shelf, revisiting towns, gear stars and 단련, treasures and hidden objectives, supply carriers, cut-ins, schema 11. Merge approved by the user 2026-11-03 (D-077); item art pack E pending.
- ACT III 「왕관의 진실」 (M15–M22), design approved 2026-11-03 (D-078/D-079, docs/v0.9.0/ACT3_DESIGN.md), four releases:
  - v0.9.0 The Capital (왕도, D-080): M15 사라진 기록, M16 잊힌 전장 — chase and neutral watch, fog, ward stones, the first duel, recruits' return, Aren's command, sortie 7, schema 12; art pack E's 102 icons (D-081). Merged 2026-11-05 (PR #18, D-082).
  - Next: v0.9.1 수호자 (M17–M18, awakening Tier 3, recruits' Tier 2), v0.9.2 그림자 (M19–M20), v0.9.3 잿빛 선택 (M21–M22, ACT III complete).
- Subsequent: ACT III–IV, relationship branches and three endings. Preserve 4 acts / 30 missions.


- v0.3.1 Classic SRPG Renaissance: walkable forge/item interiors; weapon-first buy/equip; natural NPC copy and in-place dialogue; variable maps, native art detail, bounded camera/minimap, contextual tactics, fire states and class MOV. Stacked release candidate on PR #6; later missions remain v0.4, full promotions v0.5.

## Current verified sequence
v0.3.0/v0.3.1 PR6/7 merged. v0.3.2 Gameplay Quality & Rewards implemented as review candidate; validation in docs/v0.3.2. Next remains v0.4.0 The Broken Allegiance, then v0.5.0 Advanced Class.

## v0.3.3 The Hero's Journey
Progression recovery → unified Erik → advisor-driven council → narrative continuity. Incremental candidate on unmerged v0.3.2; no additional missions. Supersedes the older next-release-only-v0.4 statement. v0.4 scope remains unchanged.
