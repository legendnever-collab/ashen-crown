# Ashen Crown v0.1.3

**First Battle — The Ashen Village**. Original fantasy SRPG built around five heroes, tactical choices, fixed character growth and clues to hidden potential. Original procedural pixel art; no borrowed game assets.

## Play

Download [`releases/Ashen_Crown_v0.1.3.html`](releases/Ashen_Crown_v0.1.3.html), then open it directly in a recent browser. All code, graphics and the Korean UI font are inline. No network or installation is needed to play. `index.html` is the same standalone build and can be served over HTTP. GitHub's file viewer shows source; use **Download raw file** to obtain the playable HTML.

Start → Story → War Room → Free Deployment → Battle → Growth Result. Rescue both civilians and defeat Garr. A civilian death or party wipe loses the mission. Each hero moves once and takes one action; actions end that hero's turn. Rescue consumes an action and requires adjacency. The two northern reinforcements are announced on turn 2, arrive on turn 3 and give the player a phase to respond. Civilians cannot be directly targeted until turn 5, announced on turn 4.

| Hero | Role | Main distinction |
|---|---|---|
| Eric | Tank | Guard intercepts first melee hit on an adjacent ally; actual protection discovers Guardian’s Oath |
| Elina | Ranged damage | Range 2–3, forest/village accuracy bonus, Aimed Shot |
| Lia | Magic damage | Fire Bolt range 1–3 against RES; low HP boosts damage and MP cost |
| Sain | Support | Heal range 0–2; Gentle Hands heals another injured neighbor |
| Kai | Mobility | Forest movement cost 1, safe-turn MOV +1, opposite-side allied flank boosts Quick Strike |

## Controls

- Tap or click a hero on the map: its face and HP/MP remain in the bottom dock, and a small map-anchored action menu opens. Choose Move, Attack, Skills, Tools, Traits, Rescue or Wait. Skills and Tools open submenus; Traits shows the talent and potential clues.
- Choose **이동**, then a blue tile. Watch the route, then choose **이동 확정** or **취소** at the destination. The move does not affect rules or saves until confirmed. Cancel walks back without consuming movement or RNG. Tap the current tile to act without moving. A confirmed move can still be undone before an irreversible action.
- Movement consumes only movement, so a hero can attack after confirming a move. The action menu avoids nearby enemies and ally selection tiles where space permits, and a map tap cannot accidentally activate a newly opened menu button. Elina still cannot shoot adjacent targets: her range is 2–3; the dock explains the restriction and suggests undoing the move.
- Choose Attack or a skill, then a target. Damage, hit chance, counterattack and target HP appear in the contextual menu; confirm there. End-phase confirmation stays in the bottom dock.
- In deployment, tap a hero, then **배치 이동**, then a valid southern tile. An occupied ally tile swaps positions. Three preset formations are available.
- `1` Move, `2` Attack, `3` Skill, `4` Rescue, `Z` Undo move, `W` Wait, `Tab` Next available hero, `E` End phase, `Escape` Cancel.
- Mouse wheel zooms; right-button or Shift drag pans. Buttons zoom/reset. On touch devices use tap to select, drag to pan and two-finger pinch to zoom. The command dock stays visible. Use **기록** to toggle the journal.
- Turn objectives remain visible. Terrain costs and bonuses appear under the cursor. Forest costs 2 and gives DEF +1 / evade +12%; Kai pays 1. Village gives DEF +2. Ruins are impassable. Orthogonal distance determines attack range. Terrain does not block ranged line of sight in v0.1.
- Movement options: tile-by-tile walking (default), continuous walking, instant movement. Speed: 1×, 2×, 4×. Weak effects reduce flashes and shorten impacts; prefers-reduced-motion is respected initially. These preferences persist locally. Sword/dagger/axe swings, flying arrows and Fire Bolt cast/projectile/explosion are original pixel effects. There is no audio in this release.

## Save and replay

Every committed screen, confirmed move, action and AI step autosaves current battle, RNG, HP, MP, growth, clues and results. Refresh restores it, including an interrupted enemy phase. Menu → Backup/Restore allows copy/paste transfer. A checksum and schema validation reject malformed data; a last-good snapshot provides fallback. Failures are shown explicitly. Reset requires confirmation.

v0.1.0, v0.1.1 and v0.1.2 Save Schema 1 remain compatible. For a newly named HTML path, export text backup in the previous version and paste it into v0.1.3 through Menu → Backup/Restore. This was tested using the actual previous HTML.

Local storage belongs to a browser/profile and may depend on the local HTML path. Keep the path stable and preserve a text backup before moving files. Storage cannot be guaranteed against browser eviction or user deletion. Offline `file://` storage was tested in Chromium. Safari, Firefox and actual phone hardware were not tested.

Victory commits hero growth; **성장한 군단으로 다시 출전** replays with that growth and replenished resources. Defeat retry restores pre-battle permanent growth and retains the defeat record. **LV 초기 상태로 연습** starts fresh practice. Incapacitated allies recover for a successful replay; this release does not implement permanent death. This release contains only Mission 01, not a second battle or unlocked awakenings.

## Development

Node.js 22+ is supported. Source uses native ES modules and a dependency-free build rather than an engine/toolchain. Game data, pure rules, state transitions, animation schedules, pixel rendering, contextual UI and versioned persistence are separate. Playwright is used only for testing. The bundler processes this project's named imports in dependency order; it is deliberately scoped to these modules, not a general JavaScript bundler.

```sh
npm ci
npm test
npm run test:balance
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:mobile
npm run test:tactical
npm run test:http
npm run test:post-move
npm run serve
```

The E2E suite uses the actual controls, legal moves and combat rules; the browser API is read-only diagnostics. No instant-win or writable state API is shipped. `BROWSER_EXECUTABLE` can select an installed Chromium. `GAME_URL` selects a separately hosted build; default is the local file. CI runs rules, balance, rebuild consistency and Chromium browser flow on the PR and feature branch. Private/public GitHub Pages setup is outside this release; Pages has not been published or verified.

Folders: `src/data`, `src/core`, `src/render`, `src/ui`, `src/persistence`, `src/assets`, `tests`, `scripts`, `releases`, `docs`. See the test report for executed evidence, limitations and developer play observations.

## Art and licensing

A blue-armored knight with a scar, a red-braided green ranger, a violet-hatted novice mage, a calm healer in a white hood, and a dark-haired rogue with an orange scarf give each hero a separate visual identity. All tiles, characters, animations and effects are procedural original pixel drawings on a 64×64 base grid with separately drawn 128×128 facial portraits. Canvas scales with image smoothing disabled. The bundled Korean font is a renamed UI subset of **Nanum Gothic** under SIL Open Font License 1.1; attribution and the full license are in `src/assets/OFL.txt`. The font contains the current game's Korean text; new Korean text may require regenerating or expanding the subset. It is inline and makes no font requests. No third-party music, character sprites, story or game code is included. Original game source is provided under MIT; the font retains OFL.
