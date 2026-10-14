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
