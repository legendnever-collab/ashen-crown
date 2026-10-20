# v0.5.0 — Advanced Class & Character Progression (in development)
- World map & interlude hubs (D-052/D-053, before Phase F): a new game opens on the map of Erdia (chronicle narration over the continent, then a zoom to the Eastern March with an ACT I region card); whenever the legion's hub changes the map shows the march from the old hub to the new one. Faction regions are tinted and named only once met (north after M05). ACT I hubs follow the story moment: village (M01), painted Border Camp garrison (M02–M03 prep), night field bivouac with campfire and a wandering merchant who sells items and weapons from one open-air stall (after M03, before M04), reclaimed fortress (after M04 – before M06) and the oath camp beyond the border gate (after M06; promotion rite and drill). All six hubs and the world map use the user's ChatGPT paintings (24×16 tiles, walk masks authored over the art, firelight drawn on top; the village has a morning and an after-the-raid painting with the v0.3.3 shop doors); shop catalogs, prices and chest counts unchanged; saves from v0.4.0 load into the hub of their story moment. Menu → 세계 지도 opens the map any time.
- Phase E (promotion): after ACT I and the Ashen Oath, the camp offers Aren's rite panel (✦ 전직 · 군단 훈련) with each hero's next class, new action and conditions; five promotion trials (Guardian · Watch · Rune · Ember · Shadow, one per hero, the hero provisionally promoted for the battle) and a repeatable Legion Drill (all five, permanent EXP and potential records, mission level 9). A won trial confirms the promotion and plays Aren's rank-granting scene on return; skirmishes never touch completed missions or gold. Bulwark now also pins enemies already next to Erik; Arcane Territory lasts 3 turns (D-051). Trial balance 30/30 each with the legal policy (docs/v0.5.0/TRIALS.md).
- Tier 2 art (user pack, 25 images): 20 promoted busts (Erik Guardian Knight, Elina Ranger, Lia Arcanist, Sain Ember Cleric, Kai Shadowblade × 4 expressions) and 5 map sprite sheets, imported hash-verified from the PNG masters; promoted heroes show them in dialogue, dock/council/unit-sheet head crops, camp and battle; the council tile shows the promoted class name. Standalone HTML grows to about 12.1 MB.
- Phase D (actions): the five promotion actions — 방벽 (enemies stop on entering Erik's adjacent tiles), 경계 사격 (one Enemy Phase shot at the first enemy step inside Elina's range; a hit ends that move), 마력 지형 (5-tile rune for two turns: ally MAG +3, enemy RES −2, fire +1 turn), 귀환의 기도 (pull an ally at 2–4 next to Sain, +10 HP), 그림자 교환 (swap with an ally within 3 or an adjacent enemy that then cannot counter this turn); tier-2 upgrades to Guard/Aimed Shot/Fire Bolt/Heal/Quick Strike; enemy planner treats overwatch ranges and runes as danger; skill tab entry, forecasts, tile targeting with second-tap execute, on-map rune/zone/range overlays. Tier-1 play unchanged (ACT I 30-seed results identical).
- Phase C (engine): class tree (tier 1 → tier 2 per hero) and the five new action definitions; three-step potential read from existing tactical memory (retroactive for v0.2–v0.4 saves); proficiency ★ (bonus only after promotion, so tier-1 ACT I combat is unchanged — 30-seed ACT I results identical); promotion conditions (ACT I + Lv 6 + potential 3/3) and a once-only promotion ledger; Ranger terrain profile, Shadowblade MOV +1, class growth bonuses; new memory keys lia_kill and <hero>_skill; unit sheet '성장' tab (class path, new action, potential checklist, ★, conditions); save schema 8 (imports 0–7) proven with real v0.4.0 saves (ACT I complete camp, mid-M05 battle).
- Phase A/B: v0.4.0 release notes (docs/v0.4.0/RELEASE_NOTES.md); class promotion, awakening actions, proficiency and Tier 2 appearance design (docs/v0.5.0) — design only, PROPOSED until the user approves.

# v0.4.0 — The Broken Allegiance (official release, 2026-10-19)
- Released after user play approval; PR #10 merged at f922a18 (hosted CI 5/5 on the PR head and on main).
- Phase F: v0.3.3 save compatibility proven with real saves made by the v0.3.3 source (village, mid-M02 battle, M03 aftermath with purchases) and by the shipped v0.3.3 HTML; full ACT I (M01→M06) balance report over 30 seeds; level-relative EXP from M04 (D-045) stops one hero from running away with the levels.
- Mobile battle (play-test 2026-10-18): tapping a hero opens 이동/공격/스킬/도구/대기/상태 without showing any cells; 이동 shows the reachable cells; tapping the previewed skill/attack target again carries it out; hero taps hit the painted figure, not just its tile; large 3-column command buttons beside the hero on phones.
- Sortie selection and a picture-first pre-battle flow: reserve/sortie board with drag-and-drop or arrows (Erik always deploys), portrait panel and blue deployable tiles on the deployment map, recommended preset kept, attack/defence presets removed; walking figures now alternate their feet.
- Painted art complete: 49 dialogue busts (heroes, Baldrick, bosses, NPCs) and 36 painted map sprite sheets (four directions, walk and attack/action frames) for every battle and town look; busts about 35% smaller in the dialogue window; fixed the duplicate Lia in camp (war table instead of a separate aide).
- Painted portraits: 28 user-supplied busts (Aren, Erik, Erik Guardian Mantle, Elina, Lia, Sain, Kai × 4 expressions) in the dialogue window, with head crops in the dock, War Council and unit sheet; embedded WebP, offline.
- Phase E — M06 The Ashen Oath (ACT I finale): border-gate map with walls, central and side gates, seal stones, wall archers and a watchtower beacon; three phases (escort four refugees → unseal two stones before TURN 11 ends → break out north), Sain heals refugees, Lia unseals in one action, Kai's side-gate lever opens a bypass, the beacon cancels the phase-3 garrison, Erik's Oath Banner (MOV +1 near him), records-choice variants (inspector and order wording), the Ashen Oath choice (people / comrades / truth), bond lines and the ACT I completion card (Ashen Legion, Baldrick's letter, ACT II teaser). New track 'The Ashen Oath', M06 rewards (Trail Boots / 60 Gold optional).
- Play-test feedback 2026-10-18: mobile attack/skill taps now register when the command menu re-renders between touch and click; rounded, tapered figure bodies and limbs; classic dialogue window — painted three-quarter busts (new original vector portraits for the cast and enemy speakers, four expressions) overlapping a translucent box, amber name, tap anywhere to advance, only Auto/Skip at the top-right; Skip also works on first viewing.
- Character pass v2: every map figure redrawn in a 48×48 cell that fills the tile (≈3.6-head proportions, larger faces), two-pose march in four directions that also plays while standing, wider side strides and forward-held bows, full-width mounted cavalry. Proportions and motion follow the user's benchmark sheets; the art is original.
- Phase D — M05 The Lion of the Frontier: Baldrick Roen's lion formation (bearer aura, leash, isolated-target charge with on-map warning), HP floor and two withdrawal victories (formation broken / road held through TURN 10), refugee wagons and TURN 4 cavalry, C2 parley choice on the deployment screen with matching withdrawal/camp scenes, Elina–Sain bond, M05 rewards, new Iron Crown looks (Baldrick, bearers, spearmen, archers, mounted cavalry, wagons) and the 'The Black Lion' track.
- Benchmark pass B4: new original 48-pixel art for every battle map, town and interior (shaded, outlined terrain/objects; 30 figure looks incl. per-mission enemies and civilians); units turn toward their travel direction with a walk cycle, face their target when attacking; NPCs pace and turn toward Erik. Rules, coordinates and saves unchanged; ground blit cached per device scale.
- Benchmark pass B3 + play-test feedback: spoken-Korean rewrite of all ACT I dialogue with distinct character voices (facts unchanged); Lia stands at the war table as strategist with a staff aide; new 11-track original layered synth score with reverb; command list 공격/기술/도구/정보/이동 취소; full-screen town map with scroll/Q quest card; icon-based result screen; early end-turn confirmation card; bottom-row interior exits; fewer misses (hit floor 70%, base 97%) with rare ×1.5 crits; depth-sorted town sprites, pacing villagers with role props, faced NPC first.
- Benchmark pass B2: every ordinary building is enterable with seeded once-per-mission chests; class terrain aptitude (rogue/cavalry cross forest and desert normally), percentage terrain combat modifiers and fire multipliers with a one-line tile summary; Fire Bolt ignites grass/forest/village for two turns; tabbed unit sheet (grades, equipment, tactics, biography, class/terrain aptitude, range grid); `턴 n / 제한` turn display. See docs/v0.4.0/BENCHMARK_PASS.md.
- Benchmark pass B1 (user feedback): shop doors prompt only when Erik steps into the doorway; Guard is a self stance usable anywhere (DEF +3 until the next player turn, intercepts the first melee hit on an adjacent ally); a centred "다음 턴으로 넘어가겠습니까?" card appears once every hero has acted; compact icon command list anchored beside the selected unit; level-up restores HP/MP; every heal grants EXP (10 + half the amount, max 24); visual bag, gear storage and paper-doll equipment screens.
- M04 The Abandoned Fortress: investigation battle with Search, torch-bearer burn timer, quartermaster alert, courtyard wave, M02-capture side deployment, Lia–Kai bond and records decision.
- Data-driven mission hooks for M04+; M01–03 rules and balance results unchanged. Save schema 7 (imports 0–6).
- New fortress terrain (Keep Floor, Rampart) and evidence art; font subset extended from the same Noto Sans CJK KR source.

# v0.3.3 — The Hero's Journey (official release, 2026-10-16)
- Released after user play approval; PR8 and PR9 merged sequentially. Finalization changed documentation/package manifests only; standalone HTML unchanged.
- Unified door anchors/front-only approach; facade click walks to the real entrance, cancellation does not loop.
- Recover council progression through shared API; settle held/path input before commands.
- Stable eric exploration hero reads battle appearance/growth; Aren remains commander NPC.
- Advisor briefings → War Council → deployment → existing battle; old building gate retired, M03 aftermath honest.
- Schema6 legacy spatial migration and nested checkpoints; preserve economy, story, growth, recovery and rewards.
- NPC/pre-battle viewpoint corrections; no M04–06 or new personal story canon.

## v0.3.2 — Gameplay Quality & Rewards (merged via PR8, 2026-10-16)
Continuous keyboard/pointer movement, doorway confirmation and owner service menus. Existing auto-equip retained with explicit hero choice. Phase-once HP/MP recovery, enemy supply tactics, first-clear/optional reward ledger, overflow delivery and schema5 catchup. Merged to main with user approval.

# v0.3.1 — Release recovery (2026-10-15 KST)
- Fix Quest preference loss on immediate reload by saving in summary activation before the deferred toggle event. Keep summary Enter/Space from triggering town interaction.
- Add same-event persistence coverage to all four Renaissance viewports; preserve existing game/save migration behavior.
- Verify checksum manifests agree and every Source ZIP entry matches current source/docs/evidence before the clean HTML rebuild and unit test gate.
- Refresh release evidence/status and PR #7 for user review; keep the unmerged PR #6 dependency and no automatic main merge.

# v0.3.0 — The Living Frontier (Release Candidate)
- Hybrid Aren-controlled Village/Camp with path navigation, collision, touch D-pad, visited Fast Travel and contextual NPCs.
- Pixel-actor pre-battle scenes and aftermath, optional Lia/Sain/Kai affiliation; five existing heroes preserved.
- Atomic Gold shops, three purchased tools, class-compatible equipment slots, comparisons, buy/sell and one +1 upgrade.
- Effective equipment stats in real combat/movement/healing; departure checkpoints, isolated practice, schema3 legacy migration and storage-failure rollback.
- War Council, readiness checklist, return-to-hub and explicit final departure confirmation. Original audio motif variants and embedded Korean glyph expansion.
- Roadmap revised: M04–06 v0.4, tactical advanced classes v0.5. Existing story canon preserved. No main merge before review.

# v0.2.0 — The Burning Frontier (2026-10-14)

- Establish AGENTS/CLAUDE and complete vision/story/characters/30-mission/decision/handoff documents with canon taxonomy.
- Preserve M01 rules; add narrative events, saved flags, skip/log/auto/fast, input isolation and three connected missions.
- Forest pursuit supports capture/escape/elimination; bridge supports escort/rescue and safe withdrawal, 10-turn balance.
- Strengthen hero identities/expressions; implement Erik LV5 Advanced outfit and preview.
- Compose five original adaptive Web Audio tracks, stingers/SFX and persisted audio controls, with provenance.
- Final persistence hardening: level-one practice preserves permanent progress; defeat retry rolls back current-battle narrative consequences.
- Schema2 backwards migration, first-clear growth commitment, practice, checkpoint rollback and conditional action-based bond.
- Expand embedded OFL UI font to all authored Korean syllables; preserve offline standalone and regression suite.

# Changelog

## v0.1.3 — Post-move Attack Soft Update

- Added Menu → Stage Reset with confirmation. A saved start checkpoint restores exact deployment, pre-stage hero growth, resources, objectives and seeded RNG; current-stage progress/result rolls back. Earlier campaign history stays. Legacy saves without a checkpoint return safely to recommended deployment with an explanation.

- Prevent the pointer gesture selecting a hero from also clicking a menu button inserted at pointerup. Reproduced accidental Rescue activation on 360×640 in v0.1.2.
- Reposition the contextual menu to keep nearby attack targets and ally selections clear where space permits. Reproduced a menu button covering an adjacent enemy after a confirmed move in v0.1.2.
- Show specific messages for an archer's adjacent dead zone, targets beyond range and already completed actions. Preserve Elina range 2–3 and all combat/growth/save rules.
- Add four-viewport selection/move/adjacent-attack regression, archer invalid-target/undo/legal-attack scenarios and keyboard-button coverage.
- Retain Save Schema 1 and test actual v0.1.2 saves in addition to v0.1.0/v0.1.1.

## v0.1.2 — Tactical Action Menus & Battle Impacts

- More vivid blue movement, red attack and green support ranges.
- Tile-by-tile walking, continuous walking and instant movement options, with persistent speed and weak-effect preferences.
- Destination confirmation after a movement preview. Rules, RNG and saves remain unchanged until confirmed; cancel follows the route back. Confirmed moves retain pre-action undo.
- Map-anchored hero action window with Move, Attack, Skills, Tools, Traits, Rescue and Wait; nested skill/tool menus, forecasts and confirmations.
- Original sword, dagger and axe swings, flying arrows, Fire Bolt casting/projectile/explosion, impact-timed HP and damage feedback, sequential counters.
- Responsive menu clamping/scrolling, 44px main action targets, compact persistent face/HP/MP dock, touch pan/pinch and disabled browser tap tint.
- Save Schema 1 retained; actual v0.1.0 and v0.1.1 battle backup import tests. Added movement-presentation unit tests and dedicated tactical UI/VFX regression.

## v0.1.1 — Mobile Command Dock & Hero Identity

- Map taps activate a hero immediately; a persistent bottom dock shows a dedicated face portrait, HP/MP and actions on desktop and mobile.
- Movement is explicitly selected, displays the authoritative terrain-cost range and ends at the action chooser. Tapping the current tile enables stationary action without consuming movement, MP or RNG.
- Attack, skill, rescue and end-phase previews/confirmation stay inside the dock. The battle command drawer has been removed.
- Native tile resolution increased from 32×32 to 64×64 with new fine detail; sprites were redrawn with distinct silhouettes, clothes and weapons. Facial portraits are original 128×128 pixel drawings.
- Responsive dock controls, touch drag and two-finger pinch; battle journal can be toggled. Save Schema 1 and previous text backups remain compatible.
- Dedicated mobile regression covers four portrait/landscape sizes and a full touch-only first battle.

## v0.1.0 — The Ashen Village

- Title, original story, war room, five character previews, three starting formations and free deployment with swapping.
- 12×10 pixel battlefield, terrain-cost paths, ruins, player/enemy turns, free hero order, attack forecasts, seeded hit/critical rolls, single counterattacks, undo before an action, two healing potions.
- Eric Guard/Indomitable Will, Elina Aimed Shot/Hawk Eye, Lia Fire Bolt/Unstable Mana, Sain Heal/Gentle Hands, Kai Quick Strike/Shadow Step.
- Two civilian rescues, announced reinforcements, captain battle, victory/defeat, optional objectives.
- Fixed level growth, highlights, potential clues without awakening unlocks, victory persistence and defeat retry.
- Local autosave, last-good recovery, checksum/schema validation, text backup/restore and reset confirmation.
- Original 32×32 procedural art, movement/idle/attack/hit/death feedback, damage and healing numbers, growth and discovery feedback; zoom/pan, keyboard and touch controls, animation speeds.
- Self-contained offline HTML, source ZIP, test report and GitHub Actions validation. No audio or second mission.


## v0.3.1 — 2026-10-14
Independent walkable forge/item interiors and durable doorway return; weapon-first hero eligibility and effective-stat delta; atomic buy/equip retaining shop UI; in-place NPC/battle portraits/history and copy review; council checkbox removal; persistent collapsible objectives; immediate terrain-aware movement and target-protecting popup; variable rectangular maps/shared bounded camera/minimaps; native128 terrain/sprite detail and256 portraits; animated fire/charred village; class MOV2/3/3/3/4, terrain profiles/allied traversal and future modifier metadata. Save schema4 migration preserves growth/checkpoints/economy. All actual evidence in v0.3.1 report; no new missions or canon changes.

