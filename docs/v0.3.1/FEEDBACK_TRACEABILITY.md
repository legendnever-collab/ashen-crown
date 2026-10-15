# Feedback Traceability — v0.3.1
Fourteen categories derived from the attached Master Task. The six original reference screenshots were not supplied here; comparison uses written requirements and actual before/after game captures. All implemented behaviors are available in the standalone HTML.

| ID | Requirement | Implementation location | Status | Test evidence | Screenshot | Remaining |
|---|---|---|---|---|---|---|
| F01 | Enter shops/owner inside, stay after buy/exit explicitly | frontier-data/core frontier/app | Implemented | renaissance/interior and Frontier UI | forge-interior-1440.png, item-interior-1440.png | More furnishings optional |
| F02 | Distinct functional building silhouettes | world-art/frontier renderer | Implemented | visual review | town-1440.png | No gear-combination sprite catalogue |
| F03 | Variable town/battle dimensions/layers | missions/frontier/camera/rules/save | Implemented | unit bounds, campaign, four viewports | town, mission-1/2/3-1440.png | Legacy battle core retained |
| F04 | Collapsible right-top objectives/preference | app/style | Implemented | renaissance collapse/reload/expand | context-menu-390.png | Body intentionally click-through |
| F05 | ≥4× desktop pixels with new native detail | art/renderers/world-art | Implemented | measured 4.372×, native128/256 | before-battle-1440.png, mission-1-1440.png | Fractional zoom may have uneven pixel size |
| F06 | Weapon→hero→actual delta→purchase | frontier-ui/app/economy | Implemented | eligibility, compare, cancel, consecutive/failed-save | equipment-comparison-1440.png | Current gear has no range-changing bonus |
| F07 | NPC dialogue without teleportation | story/app/frontier renderer | Implemented | camera/actor equality, reload | dialogue-1440.png | Authored cutscenes still staged |
| F08 | Natural character dialogue/portraits/history | frontier-data/story/app | Implemented | history, interrupted dialogue, full campaigns | dialogue-390.png | Human style preference pending |
| F09 | Council without forced checkboxes | frontier-ui/app | Implemented | council/departure cancel-confirm | mission-1-1440.png | Final departure confirmation kept |
| F10 | Immediate actual movement range | app/rules/pixel-renderer | Implemented | selection/range and terrain unit invariants | context-menu-1440.png | None |
| F11 | Context menu near actor with target clearance | popover-position/action-menu/app | Implemented | post-move four screens, tactical, mobile | context-menu-390.png | Crowded views prioritize target centers |
| F12 | Animated Burning vs Burned linked to story | world-art/frontier/pixel-renderer | Implemented | campaign flag/reload + visual review | battle-fire-1440.png, burned-village-1440.png | No fire damage/spread |
| F13 | Class MOV/terrain costs, actual path/AI | game-data/rules/game/economy | Implemented | 95 units, standard/purchased balance runs | mission-2-1440.png | Balance is seeded legal-policy evidence |
| F14 | Future class movement extension | CLASS_MOVEMENT/modifier/profile/save | Foundation implemented | modifier + save test | Current class in comparison UI | Playable promotion deferred v0.5 |

Screenshots in screenshots/. All exact counts and hosted CI in REGRESSION_RESULTS/Test Report. Story Bible and Character Bible reviewed; canon unchanged.
