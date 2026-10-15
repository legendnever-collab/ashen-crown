# Ashen Crown v0.3.1

**Classic SRPG Renaissance — Story, Exploration, Preparation & Recruitment**

Original offline pixel fantasy SRPG. 아렌은 이야기와 군단 운영의 주인공이고, 다섯 장수는 전투의 주인공입니다. 장수를 만나고 함께 준비하며 전쟁을 통해 그들의 이야기를 완성합니다.

## Play

Download [Ashen_Crown_v0.3.1.html](releases/Ashen_Crown_v0.3.1.html) using GitHub's **Download raw file**, then open it in a browser. `index.html` is byte-identical. Code, original pixel art, Korean font and original synthesized music are embedded; no network or installation is required.

Story → Town / Camp → NPC / Affiliation → Shop / Equipment → War Council → Free Deployment → Battle → Growth → Aftermath → Next Story.

- **Ashen Village** before/after M01; **Border Camp** before M02/M03 and after their battles. Aren walks with WASD/arrows, clickable map destinations (including walking to NPCs), or touch D-pad. E/Enter interacts; visible buttons let you choose among nearby people/places. Buildings and people block movement.
- **Town Map / Fast Travel** unlocks landmarks after a visit. The Council button walks Aren to the command entrance. Optional conversations and shopping never gate the battle.
- Meet Erik, Elina, Lia, Sain and Kai. Lia/Sain/Kai offer explicit affiliation choices; all five remain deployable even if you defer. No sixth hero is added. NPC responses reflect mission/aftermath, supply evidence and the actual Erik–Kai battle bond.
- Shops show prices, ownership and hero-specific stat comparisons. Buy/sell, equip/unequip and **one +1 upgrade for 40 Gold** require confirmation. Weapon/Armor/Accessory compatibility is enforced. Starter gear has zero bonus; equipment is added to existing growth without rewriting it.
- Starting **180 Gold**, first-clear rewards **100/120/140**. Purchased tools share a **6-item capacity**. Medium Potion restores self HP +30; Ether self MP +8; Ward Tonic grants self DEF/RES +2 until the next Player Phase. All consume one action and can be used after moving. The existing free two-potion field kit remains. No shopping is required to finish the campaign.
- War Council shows essential victory conditions, terrain, known/unknown intelligence, equipment and supplies. Return to exploration before departure. Free deployment is preserved; **출전 확정** is required to start combat.
- Victory/defeat results return to a hub through **마을 / 야영지로 돌아가기** or **야영지에서 다시 준비**. M03 aftermath reacts to rescue results and bond state; M04 is previewed as future content only.

Downloads: [HTML](releases/Ashen_Crown_v0.3.1.html) · [Source ZIP](releases/Ashen_Crown_v0.3.1_Source.zip) · [Test Report](releases/Ashen_Crown_v0.3.1_Test_Report.md) · [SHA256SUMS](releases/Ashen_Crown_v0.3.1_SHA256SUMS)

## Tactical campaign

| Mission | Essential objective | Preparation focus |
|---|---|---|
| 01 Ashen Village | Rescue both civilians and defeat Garr; any civilian death loses | Guard, range, rescue paths; T3 reinforcements / T5 civilian threats |
| 02 Forest Pursuit | Captain captured, eliminated or escaped ends the pursuit successfully | HP≤half + adjacent Capture for optional testimony; forest routes |
| 03 Broken Bridge | Within 10 turns rescue ≥1 civilian and withdraw every surviving hero to northern three rows y≤2 | Escort/Heal/Guard, bypass; perfect rescue optional |

| Hero | Tactical identity |
|---|---|
| Erik | Knight / Tank, adjacent Guard, actual protection discovers Guardian’s Oath |
| Elina | Archer, range 2–3 (cannot shoot adjacent), forest/village accuracy |
| Lia | Mage, Fire Bolt against RES, low-HP talent |
| Sain | Healer, range 0–2 Heal plus Gentle Hands neighbor healing |
| Kai | Rogue, forest cost 1, safe-turn movement bonus, opposite-side flank |

Tap a hero → contextual menu → Move → destination → confirm/cancel → Attack/Skill/Tool/Rescue/Wait. One move + one action; confirmed moves can be undone before an action. Forecast shows damage, hit and counter before confirmation. No counterattack chains. Keyboard in battle: 1 Move / 2 Attack / 3 Skill / 4 Rescue / Z Undo / W Wait / Tab Next / E End phase / Escape Cancel. Wheel/pinch zoom, drag pan, 1×/2×/4× and reduced motion remain available.

Dialogue reuses the narrative engine with portraits, expressions, manual/auto, seen Skip, Fast timing and history. New scenes stage pixel actors on Village/Camp backdrops with facing/focus/position changes. Essential objectives remain available in Council if dialogue is skipped. Music settings include independent BGM/SFX, pause and mute; five new motif variations join the existing score with crossfades. Gesture activation and fail-soft audio remain.

## Save / migration / economy

Autosave/checksum/last-good/text backup remain. **Schema 0–3 → 4** preserves existing growth, results, tiers, bonds and story flags; class base MOV is intentionally rebalanced. Actual v0.1.0–v0.1.3 battle saves and an actual v0.2 three-mission completed save were imported through the UI. Legacy completion grants the new economy's initial allowance and unique first-clear rewards once. Completed players are not forced into the new old-mission prologues.

Canonical campaign assets live in `campaign.economy`; the current attempt uses `economy`. Purchases made in preparation commit atomically with an idempotent confirmation token. A failed save rolls the entire transaction back. Battle consumption commits only on a first victory; **Stage Restart** and **Defeat Retry** restore departure inventory, equipment, Gold and growth. Practice copies assets and cannot trade or change canonical assets/growth; level-one practice changes only temporary hero growth. Returning to a hub ends the restart window for that attempt. Campaign selection is blocked during an active battle/deployment.

A stable HTML path/browser/profile is recommended. To move versions, export text in the old version and paste via Menu → Backup/Restore. Storage eviction and user deletion cannot be prevented. Source/report explain exact tested platforms.

## Develop / verify

Node 22+, Python 3. Native ES modules with a dependency-free offline build; Playwright is test-only. `window.AshenCrown` exposes **read-only** snapshots/diagnostics; no writable state or instant-win hook.

```sh
npm ci
npm test
npm run test:balance
npm run test:campaign-balance
npm run test:economy-balance
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:mobile
npm run test:tactical
npm run test:post-move
npm run test:restart
npm run test:http
npm run test:campaign
npm run test:frontier
npm run test:migration-v02
python scripts/package.py
python scripts/verify-release.py
```

`BROWSER_EXECUTABLE` optionally selects an installed Chromium. Browser tests operate visible controls and legal rules. Unit fixtures modify state only to isolate edge cases. Source ZIP extraction recreates byte-identical HTML and passes unit tests. Evidence: [Test Report](releases/Ashen_Crown_v0.3.1_Test_Report.md), [test matrix](docs/v0.3.1/REGRESSION_RESULTS.md), `docs/v0.3.0/`.

## Canon and next work

Start with [AGENTS.md](AGENTS.md), [PROJECT_CONTEXT](docs/handoff/PROJECT_CONTEXT.md), [Story Bible](docs/story/STORY_BIBLE.md), [CURRENT_STATUS](docs/handoff/CURRENT_STATUS.md), [NEXT_TASKS](docs/handoff/NEXT_TASKS.md). The approved 4 acts / 30 missions, three factions/endings and initial cast are preserved. Local NPC details remain PROPOSED. The old v0.3 M04–06 plan is moved to **v0.4 The Broken Allegiance**; full advanced classes move to **v0.5**. v0.2 PR #5 is merged; **v0.3 PR #6 and v0.3.1 PR #7 are merged with user approval**.

## Art / audio / limits

Original procedural native-128 tile/sprite details and 256px portraits; Aren walking/scarf, local NPCs, map buildings, campfire and shop vignettes are code-native. Weapon ownership/upgrade is visible in Party UI; individual gear combinations do not have separate battle sprites. Erik LV5 Advanced appearance is retained; full class abilities and other advanced outfits remain future work.

Original source-composed Web Audio scores use oscillator synthesis and no third-party recordings. Existing renamed Nanum Gothic UI subset retains SIL OFL attribution in [OFL.txt](src/assets/OFL.txt); expanded glyphs cover authored Korean text. Project source remains MIT. Safari/Firefox, physical phone hardware, long-term storage eviction and subjective story/music quality require separate review. Shops now have walkable interiors and interactive owners. GitHub Pages publication is outside this release.


## v0.3.1 — Classic SRPG Renaissance
Walk into independent shops, approach the owner, select equipment then a compatible hero and compare actual stats before atomic purchase/equip. NPC dialogue retains the town. Select a tactical hero for immediate terrain-cost range and contextual commands. Variable maps, bounded camera/minimaps, persistent Quest panel, role-specific MOV, new native detail and burning/burned buildings preserve all three missions.
Artifacts: [HTML](releases/Ashen_Crown_v0.3.1.html), [Source ZIP](releases/Ashen_Crown_v0.3.1_Source.zip), [Test Report](releases/Ashen_Crown_v0.3.1_Test_Report.md), [SHA256](releases/Ashen_Crown_v0.3.1_SHA256SUMS). Exact changes [feedback traceability](docs/v0.3.1/FEEDBACK_TRACEABILITY.md). Schema4 migrates 0–3; growth/assets retained, base class MOV intentionally rebalanced. PR #6 and PR #7 merged with user approval; official v0.3.1 release authorized.
