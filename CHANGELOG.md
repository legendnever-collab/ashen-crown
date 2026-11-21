# v2.4.1 — ACT III 큰 맵 (2부)와 왕도 둘레의 작은 마을
- Merged (PR #39; approved 2026-11-21 15:01 with art pack K, D-140). Built under D-137. Notes docs/v2.4.1/RELEASE_NOTES.md.
- ACT III M19–M22 on big maps (src/data/missions-v241.js): M19 rite vault 28×20 from the central gallery (10+4), M20 archive and lower city 28×22 (four cabinets, three clerks, eight residents, 10+6, ×0.82), M21 palace 24×24 with the anchors at the wing mouths (12+7, ×0.97), M22 square 28×22 with the daises in the middle (6+12). Rules, story, duels unchanged; m.captainBox replaces the captains' fixed rows; m.arriveCols for M22's arrivals.
- ACT III villages 등불골 (M16) and 이끼다리 (M18): six requests and two bounties (missions 131–136), the 이끼다리 bridge discount at the capital, 이끼다리 and 등불골 (discounts now read from the request data), the 등불골 tavern's wanderers.
- 마렌 joins from 「잿빛 안개 속 약초꾼」: rogue, swamp costs her 1, camp lines, 열전, epilogue lines. Art pack K (docs/v2.4.1/art/k-work-pack, 5 images) returned and imported (D-139): 마렌's busts, 등불골 and 이끼다리 (scripts/import-art-pack-k.py).
- 어려움: M19 half push, M20 and M22 at 보통's numbers.
- Schema 25 (imports 0–24). Font glyphs extended (scripts/font-subset.py).
- Tests: tests/villages-v241.test.mjs, tests/v241-e2e.mjs, mission19–22 on the big maps.
- Version 2.4.1.

# v2.4.0 — ACT III 큰 맵 (1부)
- Merged (PR #35; approved 2026-11-21 10:37 「병합만 해줘」, D-136). Built under D-134, D-135. Design approved 2026-11-21 with the recommended answers (docs/v2.4.0/ACT3_MAPS_DESIGN.md, D-135). Notes docs/v2.4.0/RELEASE_NOTES.md.
- ACT III M15–M18 on big maps (src/data/missions-v240.js, maps from scripts/make-act3-maps.py): M15 chase from the canal 28×20 (16+6, TURN 14), M16 west → east through the fog 30×18 (17+8, four ward stones, TURN 16), M17 keep defence from three sides 26×22 (11+9, six statues), M18 the ward in the middle 26×22 (6+9, eight forest-keepers). Objectives, rules, story, duels unchanged; troops copied from each mission's own by id. The "all" hidden objectives and rewards follow the new counts (data ACT3_COUNTS); M17/M18 captains wait behind m.rearY; council lines may be functions (M16 names the returning recruits).
- Strength: M15 ×0.94 (was ×0.88), M18 ×0.92; 어려움 at 보통's numbers for M16 too (HARD_SHARE).
- Schema 24 (imports 0–23): M15–M18 battle saves reopen in camp (reform240).
- Repository (D-134): the builds of the 28 versions released on GitHub (56 files, 1.8 GiB) leave the tree; .gitignore lists every ARCHIVE.json build; v2.2.1–v2.3.1 join ARCHIVE.json; scripts/archive-releases.mjs skips complete releases.
- Tests: tests/v240-e2e.mjs; mission15–18 tests on the new maps; start positions M07–M18.
- Version 2.4.0.

# v2.3.1 — ACT II 큰 맵 (2부)와 작은 마을
- Merged (PR #34; approved 2026-11-21 07:55, D-133). Built under D-131 (asked for with the v2.3.0 merge, D-130). Notes docs/v2.3.1/RELEASE_NOTES.md.
- ACT II M11–M14 on big maps (src/data/missions-v231.js): M11 switchback 24×20 (five braziers, pilgrims +10 HP, TURN 14), M12 cloister 24×20 (14 guards, five on the bell, TURN 16), M13 pincer 28×18, M14 escape south 24×18. Rules, story and duels unchanged.
- The war council's terrain and intel follow the big maps (M07–M14).
- ACT II villages 서리목 (M08) and 소금항 (M09): six requests and two bounties (missions 125–130), taverns, shops; the ice-bridge discount at the north shops.
- 군나르 joins from 「눈보라 속 도끼잡이」: infantry, snow costs him 1. The wolves are drawn by the game until art pack J.
- 어려움: M11 at 보통's numbers. M15 ×0.88 (보통).
- Schema 23 (imports 0–22): M11–M14 battle saves reopen in camp.
- Art pack J (docs/v2.3.1/art/j-work-pack, 7 images) returned and imported (D-132): 군나르's busts, 서리목 and 소금항, the wolf's sheet (collar tinted by side) and portrait. Tests: tests/villages-v231.test.mjs, tests/v231-e2e.mjs; act2-balance takes ASHEN_DUMP for camp dumps.
- Version 2.3.1.

# v2.3.0 — ACT II 큰 맵 (1부)
- Merged (PR #33; approved 2026-11-20 18:02, D-130). Design approved 2026-11-20 06:21 (D-129). Notes docs/v2.3.0/RELEASE_NOTES.md; design docs/v2.3.0/ACT2_MAPS_DESIGN.md (D-128).
- ACT II M07–M10 on big maps (src/data/missions-v230.js): M07 convoy east 30×14 (16+6, TURN limit 20), M08 two fronts 22×20 (12+14), M09 street fight from the SW docks 26×20 (15+8), M10 march east among three sides 30×18 (24+8). Objectives, rules, story and duels unchanged.
- The M07 wagons follow the road network to the gate (convoyDistance; one sideways step to an equal lane).
- 어려움 re-measured (ASHEN_DIFFICULTY=hard for act1-balance / act2-balance): the M06 stage-start record with the inspector's wave was refused on 어려움 (fixed); full +1 level ×1.1 in ACT II; 보통's numbers at M15, M17 and M18 (core/stats8.js HARD_SHARE). M19–M22 on 어려움 left for a later pass.
- scripts/archive-releases.mjs: a tag on the default branch when GitHub refuses one on an older commit; goes on past failures.
- Schema 22 (imports 0–21): M07–M10 battle, result and deployment saves reopen in camp; camp positions on new walls are moved.
- Tests: tests/v230-e2e.mjs (the four maps at 1440 and 390, the 어려움 M06 save), tests/difficulty-hard.test.mjs, start positions on the big maps (renaissance).
- Version 2.3.0.

# v2.2.1 — 용량 관리
- D-125, on the user's word (2026-11-19 16:09); play-test changes D-126; merged on the user's approval (2026-11-19 22:53, D-127). Plan docs/v2.2.1/SIZE_PLAN.md.
- Paintings as AVIF: 382 portraits, duel images, map sprites (q60), rooms, hubs and world (q65), same resolution, each SSIM-checked against the WebP it replaced (scripts/convert-art-avif.py, src/assets/avif-conversion-log.csv); the 24 class sheets stay WebP (their magenta sash is recoloured by threshold); the import scripts convert new art. 63.7 → 46.5 MiB.
- Size budget: build/size-report.json; warn above 80 MiB, fail above 90 MiB (scripts/size-budget.mjs).
- Builds go to build/Ashen_Crown.html (git-ignored); index.html and the release HTML are committed only by scripts/package.py; verify-release.py skips until packaged; CI builds first.
- A notice when the browser cannot open AVIF.
- Earlier builds: releases/ARCHIVE.json, the manual workflow "Archive old builds" (scripts/archive-releases.mjs) and scripts/fetch-releases.mjs.
- Play-test (D-126): rogues MOV 4; heals halved; move/attack tiles drawn again above buildings and trees; M06's seal guards hold their posts; enemy strength M03 ×0.95, M04 ×0.97, M06 ×1.02, M15 ×0.95, M17 ×0.97.
- Version 2.2.1; schema 21 unchanged.

# v2.2.0 — 일기토 장면과 새 주점
- Merged 2026-11-19 on the user's word ("그림까지 넣은뒤 병합해줘", D-124) with art pack I complete. Design docs/v2.2.0/DUEL_SCENE_DESIGN.md (D-122); RC D-123.
- Duels are always won by our hero (core/duel.js duelWin): three scripted exchanges, +1 level (awardXP, so HP/MP refill), the foe's treasure claimed. No choice and no stepping back — except M29, which keeps the story choice to leave the duel to Aren's last words (the 「제안」 fate).
- The beaten foe leaves the field (D-124; core/game.js setDuelFall, mission rule duelFall): struck down (M01 Garr counts as defeated; M16, M18–M21, M25), captured where the mission has a capture rule (M09, M10, M12), Baldrick withdraws at M05/M13 (victory) and lays down his sword at M26 (victory; joins or rides beside by the M13 flag), Bellard turns to phase 2 at M29.
- Difficulty (D-124; core/stats8.js): enemy stats ×1.08 from M02 on both difficulties, on top of the sortie push; M03 ×1.01, M04 ×1.03; M15, M16 and M22 unchanged (a box race, the returning Thea, the heralds).
- The duel window (ui/duel-scene.js): a 16:9 stage with the pair's busts (VS), three exchanges, a slow-motion finisher, the foe on one knee and LEVEL UP; ~9.4 s; skip by button or Esc/Enter/Space; reduced effects drop shake and flash; a taller cropped stage on a phone held upright. Drawn with art pack I B–G (ASHEN_DUEL: 24 duel_<id> sheets, six finisher_<hero>, five duelbg_<stage>, duel_vfx with glowing effects; scripts/import-duel-art-v220.py).
- Art pack I part A: the village tavern repainted, with its own mask, chests at (1,6)/(10,3) and the keeper behind the bar. Parts H/I: 20 painted busts of the hires and Adel, icon sheets P/Q (14 icons; the tavern, request board and elite hires show theirs).
- Version 2.2.0; schema 21 unchanged.

# v2.1.0 — 주점과 세계지도: duel events, the five alone, taverns and hires, the world map, small villages and requests
- Merged 2026-11-18 on the user's word ("이미지 적용해주고 병합해줘", D-121) after the play-test fixes (D-120) and art pack H1 A–C/F.
- Play-test (D-120): the town walk is one tile per 210 ms with a gliding walker (was 100/75 ms); M01 ≥ 95% on 보통 (looters atk 8, villagers HP 36, east reinforcement TURN 7; act1-balance gates M01 at 95%); on the battlefield only armour and cloth take the side's colour, heads and skin keep the painting.
- Art pack H1 (D-121): 24 class sheets and the village tavern, 갈대 나루 and 돌우물 마을 imported; busts (D, E), arena and icon sheets (G) kept out — vector drafts — by the user's choice. The user's five feedback items of 2026-11-18 05:41, eight answers all recommended (D-118, docs/v2.1.0/TAVERN_WORLD_DESIGN.md). No new story mission.
- Duels are events (src/data/duel-events-v210.js, src/core/duel-events.js): the challenge command and its odds are gone; a story-linked hero beside the foe's lead (after a move, or when the player's phase opens) starts a short exchange of lines, then the arena (받는다) or 물러선다 (fight on). Once per pair per battle. Fourteen missions carry pairs; the story duels of M16/M20/M21/M26/M29 keep their keys and results and open from their old turn by adjacency.
- The five start alone (Erik, Elina, Lia, Sain, Kai, already together — the camp's 「동료의 약속」 step is gone); Thea, Dario, Ines and Baldrick still join after their scenes. The four v2.0 officers became tavern hires. 「👥 출전 장수」 on the deployment screen picks who goes (Erik always).
- Taverns (src/core/tavern.js, src/data/mercs-v210.js): each town's inn is a tavern with 「인재 확보」; one fee, kept to the ending, joins at the legion's average level −1, from after M01. Nine hires: 브람·노아·마르타 (ash village, 200 G), 로웰 (elite, reed, 450), 세라 (castletown, M07, 600), 오린 (Velmar, M09, 650), 셀린 (pilgrim village, M11, 700), 렌 (elite, capital, M15, 900), 실바 (forest, M18, 950); elites +2 main stat; one wanderer per story win at stonewell. Talks, 열전 and epilogue lines for each.
- The world map (src/ui/tavern-ui.js worldTravelHTML): a town's or camp's exit opens the painted map cropped to the places in reach — the camp, towns already reached, opened small villages — tap to travel; the same list below.
- Small villages 갈대 나루 and 돌우물 마을 (src/data/villages-v210.js, src/core/villages.js), opened by clearing M04: request boards with battle requests (missions 120–124: ferry bandits, the barge escort, the besieged spearknight, roadside raiders, a repeating bounty after each story win) and hand-over requests (herbs, the well). The chosen sortie fights at its level; a loss changes nothing. The rescued hero of ACT I, 아델 (spear, hero growth, 「마지막 초소」), joins after the besieged request.
- Schema 21 (imports 0–20): v2.0.0 officers stay as hires; the five's affiliation is set; challenge records are dropped. Real v2.0.0 saves in tests/fixtures/v200.
- Art pack H1 remade (50 images, docs/v2.1.0/art/h1v2-work-pack, scripts/make-v210-h1-art-pack.py): class sheets 24, hire busts 15+5 (Adel included), the tavern interior and the two villages on the ash village layout, the arena, icon sheets P and Q. Replaces the v2.0.0 H1 work order.
- Tests: tavern-v210 unit suite; v210 browser suite; suites moved off the challenge command and onto the five-hero start.

# v2.0.0 — 전장 개편 「병종과 대군」 stage 1: the whole system + ACT I on big maps (release candidate)
- Release candidate on feature/v2.0.0-reform (base feature/v2.0-design ← v1.0.0 RC 306f3e3); not merged before the user plays and approves it. D-115 (docs/v2.0.0/REFORM_DESIGN.md, Q1–Q10 recommended), implementation details D-116; v1.0.0 stays a separate release candidate (PR #28).
- Stat engine (src/core/stats8.js, src/data/classes8.js): eight classes × three tiers with world-original names; six stats 무력·지혜·의지·강인·민첩·운 derive HP, ATK, MAG, DEF, RES, SPD, heal power and crit; ratio damage P·P/(P+D) × skill × matchup (±25%) × terrain; heals, skills and curses (50% + 2 × will difference, 10–90%) scale with the stats; class growth (heroes ×1.15 over officers), promotions +2/+3 main and +1 rest; tier attacks (multi-arrow, double and spinning cuts).
- Enemies fight at the sortie's level: average × (1 + mission share) + rank (+3 boss, +2 elite), never below authored − 2; troops scale proportionally along their class's reference curve; their attack tier is capped by the sortie's (bosses one above); trials keep authored numbers. Mission shares M03 .55, M04 .53, M05 .3, M15 −.21, M16 −.1, M17 −.1, M22 −.14.
- Difficulty 보통 / 어려움 (asked for a new campaign, changeable in camp): 어려움 +2 levels and ×1.15 stats growing in with the legion (full from a Lv 8 sortie), waves +25% (never commanders), one potion instead of two. Stronger AI: focus the wounded, weigh counters, flank with riders and rogues, hold posts, fall back to the healer, a fallen commander shakes its squad.
- Class gear, item tabs (전체·무기·방어구·장신구·보물·도구) with the usable-only filter, comparison and the treasure codex; 34 treasures as stats (ten legendaries keep their effect); start treasures 아렌의 방패 문장 (Erik) and 스승의 마도서 (Lia); ACT I commanders carry treasures (drop by luck, sure on capture or a won duel).
- Four officers: 브람 (spear), 노아 (archer), 마르타 (shield) from M01, 로웰 (cavalry) after M04 — class skills, camp talks, battle lines, 열전 and epilogue lines; ACT I holds 8–9, sorties 5, officers start on the bench.
- ACT I on big maps (src/data/missions-v200.js, src/core/mission-rules-v200.js): M01 22×16 two fronts (villagers threatened from T6), M02 28×14 pursuit east (the runner leaves the cart at T4 or a hero within 4), M03 26×18 U-turn by the ford (16 turns), M04 24×20 siege by the gate or the fallen wall, M05 28×16 march west, M06 24×20 break-out south-west; drag, minimap, zoom buttons, the camera follows enemies.
- 잿빛 결투장 (src/core/duel.js): our own duel screen, five exchanges (first to three), 베기·막기·노리기 decided by 무력·민첩·운; duel challenges on big maps twice a battle (boss-rank or treasure carriers, accepted 20–90% by strength), a win takes the treasure; story duels (M26, M29) are counted the moment they end.
- Schema 20 (imports 0–19): campaigns kept, heroes recomputed from the six stats, gear a class can no longer hold goes to the bag, start treasures added, earned officers join; a battle in progress reopens in that mission's camp, a won result in its aftermath (real v1.0.0 saves in tests/fixtures/v100).
- Art pack H1 work order: docs/v2.0.0/art/h1-work-pack (38 images — 24 class sheets with magenta side cloth, 12 officer busts, the arena, icon sheet P); until it returns, class figures are the existing art tinted by side.
- Tests: stats8, act1-v200, migration-v200 unit suites; v200 browser suite; balance gates rewritten as bands (보통 ≥ 60% per mission, ACT I 60–85%); every older suite moved onto the big maps and the v2 rules.

# v1.0.0 — 왕관 없는 새벽 · ACT IV part 4: M29 왕관의 심장, M30 왕관 없는 새벽, the endings, epilogue and ending card (release candidate)
- Release candidate on feature/v1.0.0-crown; not merged before the user plays and approves it. D-113 (within D-099 / docs/v0.10.0/ACT4_DESIGN.md §3 Q2, §4.2, §6, §8, §10–§13); v0.10.2 merged as D-112.
- M29 (src/core/mission-rules-v100.js): Bellard in two phases (the crown's power at the first fall); three rite points of the new ward placed by the M22 path (king / council / oath), mended +10 beside a hero; TURN 2 the duel, or Aren's last words (the crown answers Bellard less; his own offer opens); the second phase down with two rite points standing wins, two broken or TURN 14 loses; the king rests. Bellard's fate after the win: trial / exile / his own offer (only after Aren's words).
- M30: hold the heart stone to the end of TURN 8 against the last wave of ash with all three banners' squads; flags.act4_completed.
- Endings (src/core/ending.js, src/data/ending-v100.js): the M22 path's ending always open, the others by trust ≥ 2 and one story choice; chosen once after M30's aftermath scene; its scene, the epilogue (every hero, Aren, the king, Bellard, Baldrick, the leaders) and the ending card; campaign.ending; the camp stays open with the epilogue and card to see again.
- Lower city talks for M29–M30, sites heartbattle/crownlessdawn, the original track 「The Crownless Dawn」 (33 tracks), rewards 660/700, treasures 벨라드의 깃펜 and 새벽의 반지, feats to 30, 장수 열전 chapters 29/30; schema 19 (imports 0–18; real v0.10.2 saves in tests/fixtures/v0102).
- Tests: mission29, mission30 (with the endings), migration-v0102 unit suites; act4d-e2e and migration-v0102 browser suites; the balance chain through M30 and the ending choice.
- Art pack G4 work order (Q8 minimal, the last pack): scripts/make-act4-g4-art-pack.py → docs/v1.0.0/art/act4-g4-work-pack (part A four scenes: three ending illustrations and the epilogue background, imported by scripts/import-ending-art.py; part B icon sheet O).

# v0.10.2 — 잿빛 밤 · ACT IV part 3: M27 왕도의 성문, M28 잿빛 밤의 진실, Aren's confession and his last order (release candidate)
- Release candidate on feature/v0.10.2-ashen-night; not merged before the user plays and approves it. D-110 (within D-099 / docs/v0.10.0/ACT4_DESIGN.md §3, §4.2, §7, §10); v0.10.1 merged as D-109.
- M27 (src/core/mission-rules-v0102.js): two fronts, sortie of eight. The escorted siege ram rolls up the road (two tiles with a hero beside it, one when pressed, none without an escort, one lane sidestep), three blows break the gate; a hero ending the player phase on the rampart above a ladder takes that section for good; gate broken + two sections wins, the ram lost or TURN 14 loses. Squads from banners at trust ≥ 2 and Baldrick's lion after the M26 「협력」 (orderable; absent ones benched).
- M28: the king's last memory — three fragments (oath, king, order) read in any order with 「기억 보기」 tell the §3 truths; remnants stand again at their post three turns after falling, reading a fragment releases those within three tiles; young Aren fights as an orderable ally (sepia); after the third fragment two enemy phases end the night; Erik falling or TURN 14 loses.
- Aren's confession after M28 (to all / to Erik alone, chooseConfession28, app.js showConfession28). Aren's last order 「끝까지 함께」 (command.js LAST_ORDER, game.js useLastOrder): from M28, once a battle, a fallen hero stands with 1 HP at the next player phase.
- Lower city hub again (Baldrick present after joining), the world card 「왕도의 성문」, sites royalgate/ashenpalace, the variation 「잿빛 밤」 (32 tracks), rewards 620/640, treasures 성문 파쇄추의 쇠머리 and 잿빛 밤의 목걸이, feats to 28, 장수 열전 chapters 27/28; schema 18 (imports 0–17; real v0.10.1 saves in tests/fixtures/v0101).
- Tests: mission27, mission28, migration-v0101 unit suites; act4c-e2e and migration-v0101 browser suites; the ACT III–IV balance extended through M28 with the ≥ 90% gate.
- Art pack G3 returned and imported (D-111): the ram, ladder, memory/memory_read props and icon sheet N (the 「끝까지 함께」 button shows its painted icon).
- Art pack G3 work order (Q8 minimal): scripts/make-act4-g3-art-pack.py → docs/v0.10.2/art/act4-g3-work-pack (2 images: prop sheet props_act4c — ram, ladder, memory, memory_read; icon sheet N — lastOrder, ramHead, nightLocket).

# v0.10.1 — 검은 사자 · ACT IV part 2: M25 세 왕가의 깃발, M26 검은 사자의 마지막 전투, Dario's awakening, Baldrick the ninth hero (release candidate)
- Release candidate on feature/v0.10.1-banners; not merged before the user plays and approves it. D-102 (within D-099 / docs/v0.10.0/ACT4_DESIGN.md §4.1, §5.1–§5.2, §8–§10); v0.10.0 merged as D-101.
- M25 (src/core/mission-rules-v0101.js): the M14 betrayer's hardliners in the north camp; the other two banners in the west and east camps — allied and orderable at trust 3, otherwise neutral (they fight only the hardliners; rules.js hostile keeps them and the legion apart); the hardline captain falling with both leaders standing wins; then the betrayed banner forgiven (+2) or lowered (−1, the others +1).
- M26: Baldrick's duel on TURN 2 (a win is two of resolve), Erik's persuasion (once a turn) and Thea's word; four of resolve and he yields — joins when he halted at M13, otherwise cooperates; broken at half HP with both bearers down from TURN 4 he withdraws alive; Erik falling loses.
- Baldrick, the ninth hero: Lv 19, tier 3, skills 사자의 일격 / 사자의 포효 / 사자의 깃발 / 검은 사자의 결의 (tactics.js), Thea's lances and armour, every accessory and treasure; his painted bust and sheet.
- Dario → 칼의 주인 with ④ 백 번의 반격 (every blow answered, any range, +30%) after M25; trial 117.
- Hubs (alliance camp; the oath camp below the lion's pass, NPCs with fromMission), two world cards and sites, the original track 「검은 사자」, rewards 580/600, treasures 세 왕가의 인장 and 검은 갈기, feats to 26; schema 17 (imports 0–16; real v0.10.0 saves in tests/fixtures/v0100).
- Tests: mission25, mission26, migration-v0100 unit suites; act4b-e2e and migration-v0100 browser suites; the ACT III–IV balance extended through M26 with the ≥ 90% gate; the policies play ④ 백 번의 반격, guard the leaders in M25 and walk Erik to Baldrick in M26.
- Art pack G2 work order: scripts/make-act4-g2-art-pack.py → docs/v0.10.1/art/act4-g2-work-pack (6 images: icon sheet M; Dario's tier 3 busts and sheet).
- ACT IV art pack G1 imported (D-103): Ines's and Thea's tier 3 busts and map sheets, icon sheet L (성역의 문, 철의 돌파, 연합의 깃발, 마지막 등불) and the four council tents (iron / free / flame / taken) — 12 images hash-verified; the M23 tents now draw the painted art.
- ACT IV art pack G2 imported (D-105): Dario's tier 3 busts and map sheet, icon sheet M (백 번의 반격, Baldrick's four skills, 세 왕가의 인장, 검은 갈기) — 6 images hash-verified; v0.10.1 has no temporary art left.
- Play-test: the hero sheet (D-108): ☰ → 장수 정보 (roster → sheet with ◀ ▶); 열전 with title, personality, a line, past, chapters opened mission by mission, bonds and records; 성장 leads with the next goal and shows how to raise each potential step with live progress (src/data/hero-lore.js).
- Play-test: a clear town map (D-107): the town menu folds behind ☰ (only the next story step stays), no floating place names, gold no longer under the quest button, 에릭 찾기 removed, the D-pad off on touch screens unless turned on (tap to walk).
- Play-test: compact panels (D-106): the battle skills menu is one line per skill (no notes; 설명 opens 상태 → 기술, which now explains all four skills); the forecast is tighter without the long note; the unit sheet's tabs on one row.
- Play-test minor feedback (D-104): the unit menu's title is one compact line (15px, no wrapping, ellipsis); the move confirmation is just 이동 확정 / 취소, with no coordinates.

# v0.10.0 — 연합 · ACT IV part 1: M23 전쟁의 끝을 향해, M24 최후의 국경, allied orders, Ines's and Thea's awakening (release candidate)
- Release candidate on feature/v0.10-act4-design; not merged before the user plays and approves it. D-100 (within D-099 / docs/v0.10.0/ACT4_DESIGN.md §4.1, §5.1, §8–§10).
- Allied orders: tap an orderable allied unit in the player phase for 「따르라 · 지켜라 · 자유」 (game.js ALLY_ORDERS / setAllyOrder, app.js); the order is saved and validated.
- M23 (src/core/mission-rules-v0100.js): the alliance camp at night — Cassian, Leonora and Lucien with their guards as orderable allied units, three council tents (an enemy that ends two enemy phases in a row beside one takes it; two taken is a defeat), the raid captain on TURN 4 (his fall ends the raid) or TURN 10; a fallen leader costs that banner one trust; then who leads the final campaign (군단 / 세 깃발).
- M24: the last border by the Ashen Village — the ash tide a row a turn from TURN 2 (10% max HP at the end of the player phase; never felling a hero), eight refugees walking to the gate around whoever stands in the way, the gate winch (「관문 닫기」 once six are inside; whoever is outside stays outside), the gate shuts by itself after TURN 10; the gate turn and those left outside are kept for the epilogues.
- Ines → 새벽 성기사 (④ 성역의 문: half damage within 3 until the next player turn, statuses cleared) after M23; Thea → 흑철 기병대장 (④ 철의 돌파: a 2–4 tile straight run through foes, no counter, then 3 more tiles) after M24; trials 115/116 (now under the skirmish rules).
- Hubs: the alliance camp (summit camp painting, world card 「ACT IV · 잿빛 왕관」) and the Ashen Village after the raid (recruits there); two world sites; two original tracks 「연합의 행군」, 「재의 폭풍」; rewards 540/560, treasures 연합의 깃발 and 마지막 등불, feats to 24; schema 16 (imports 0–15; real v0.9.3 saves in tests/fixtures/v093).
- Tests: mission23, mission24, awaken-v0100, migration-v093 unit suites; act4a-e2e and migration-v093 browser suites; the ACT III–IV balance extended through M24 with the ≥ 90% gate; the skirmish policy plays ④ 성역의 문 and 철의 돌파 and moves recruit companions.
- Art pack G1 work order: scripts/make-act4-g1-art-pack.py → docs/v0.10.0/art/act4-g1-work-pack (12 images: icon sheet L, the council tents; Ines's and Thea's tier 3 busts and sheets). Extras reuse painted art (D-094); the tents, winch and gate are game-drawn until then.

# v0.9.3 + ACT III art pack F4 (feature/act3-f4-art-pack, not merged before the user approves; D-096)
- The last king's four busts and map sheet, icon sheet K (Thea's capital lance, Ines' capital mace, 왕의 인장, 전령의 뿔피리) and the anchor stone (whole / broken) — all 7 images hash-verified; v0.9.3 has no temporary art left.
- scripts/import-interior-art.py reads per-prop manifest rows (pack F4's prop_sheet form).

# v0.9.3 — The Ashen Choice · ACT III part 4: M21 마지막 국왕, M22 잿빛 선택, Aren's awakening, the ACT III choice (release candidate)
- Release candidate on feature/v0.9.3-crown; not merged before the user plays and approves it. D-093 (within D-079 / docs/v0.9.0/ACT3_DESIGN.md §4.2, §5–§7); the king and the anchor stone use temporary art until ACT III art pack F4.
- The user's play-test notes (D-092): zone of control for both sides with rogues and civilians exempt (rules.js controlZone); Heal and Purify on anyone, no EXP for a foe (rules.js supportable); tap an empty tile to cancel an aimed action (app.js); Thea's 왕도 기병창 and Ines' 왕도 사제 철퇴 in the lower city. M06 limit 16 → 18 and the policy's M05 wagon guard keep ACT I at its win rates.
- M21 (src/core/mission-rules-v093.js): the king on the throne dais, four anchor stones (고정석 깨기 — one blow for Erik/Thea/Dario/Ines, two for the rest; +10 king HP each), the ward pulse rings (MP −3), Erik's duel with the rite knight commander; victory by the stones or by holding to TURN 12; the king's request (지금은 아님 / 약속함) and Aren's awakening card.
- 「함께 정한다」: once a battle from M21 on, an acted hero moves and acts again (command.js, game.js useTogether, the unit menu).
- M22: three heralds read four times each from TURN 2 (a hurt herald loses that turn; a hero on a fallen herald's dais reads instead), the chancellery and the betraying banner, allied banners' knights at the 「동맹」 stage, the recruits' last chance to return; the ACT III choice (국왕에게 / 세 깃발의 회의에 / 모든 사람의 서약에, one banner up and one down each) and the ACT III completion card.
- 장수 열전 (src/core/records.js): sorties, foes defeated, rescues and HP healed per hero, in the unit sheet's bio tab and on the ACT III card.
- Two treasures and hidden objectives, rewards, supply carriers, two world sites, the new track 「왕관의 심장」, schema 15 (imports 0–14; real v0.9.2 saves in tests/fixtures/v092).
- Tests: feedback-v093, mission21, mission22, migration-v092 unit suites; act3d-e2e and migration-v092 browser suites (CI group act3); the act3 balance extended through M22 with the ≥ 90% gate.
- Extras reuse painted art (D-094): the rite knight commander and the guard captain wear the rite knights' sheet and the executor's bust (bust.js BUST_REUSE); the heralds use the refugee look.
- ACT III art pack F4 work order: scripts/make-act3-f4-art-pack.py → docs/v0.9.3/art/act3-f4-work-pack (7 images in two parts: icon sheet K and the anchor stone; the last king).

# v0.9.2 + ACT III art pack F3 (release candidate on feature/act3-f3-art-pack, D-091)
- v0.9.2 and PR #20 merged after the user's approval (D-090).
- Pack F3 (24 images, parts A–C, hash-verified): awakened Lia and Kai (busts and sheets), Lia's teacher and Kai's old superior (busts and sheets), the rite knight and the ritualist sheets, icon sheet J (작은 결계, 그림자 군무, 스승의 깃펜, 회색 장부), painted ritual circles (lit / sealed) and archive cabinets (whole / burned). Importers read BOM manifests (utf-8-sig); the rite knight scaled 1.06.
- Fix: the provoke / debuff / buff chips over units on the map are drawn again (hidden since v0.8.1 by a comment that swallowed the rest of a line); an item-art test line lost the same way is restored.

# v0.9.2 — The Shadow · ACT III part 3: M19 금지된 의식, M20 왕관의 그림자, Lia's and Kai's awakening (release candidate)
- Release candidate on feature/v0.9.2-shadow, built on PR #20; not merged before the user plays and approves it. D-089 (within D-079 / docs/v0.9.0/ACT3_DESIGN.md §4.2); the new people, props and awakened looks use temporary art until ACT III art pack F3.
- M19 (src/core/mission-rules-v092.js): four ritual circles drain their captives' memory from TURN 3 (a ritualist within 3); Lia within 2 or her runes stall a circle; a ritualist beside its circle keeps the seal shut; 봉인 해제 (search) on all four wins; two captives forgotten lose; camp choice on Lia's teacher (take / leave), Lia's word.
- M20: the archive (clerks light cabinets from TURN 3; a lit cabinet burns after the next enemy phase unless searched) and the burning lower city (spread and leaps on TURNs 3/5/7, residents hurt in the fire, evacuation by rescue); grey cloaks' shade (first blow misses); Kai's duel at TURN 2; Bellard's first lines; camp choices on the old superior (release / trial) and the plan (send / keep); Kai's word, Baldrick at the gate, the M21 teaser.
- Awakening of Lia (결계술사, ④ 작은 결계 — src/core/wards.js) and Kai (그림자 군주, ④ 그림자 군무 — two-tap pair targeting); trials 109 and 114.
- Aren's 「한 사람도 두고 가지 않는다」 (civilians and allied units −30% damage) from M19 (command.js commandShield in strikeStats).
- The capital as the M19–M20 hub (world:capital:return, two world sites, the archivist's own bust and figure), two treasures and hidden objectives, rewards, supply carriers, music mapping, schema 14 (imports 0–13; real v0.9.1 saves in tests/fixtures/v091).
- Tests: shadow-v092, mission19, mission20, migration-v091 unit suites; act3c-e2e and migration-v091 browser suites (CI group act3); act3 balance extended through M20 with the ≥ 90% gate; trials record ④ use.
- ACT III art pack F3 work order: scripts/make-act3-f3-art-pack.py → docs/v0.9.2/art/act3-f3-work-pack (24 images in three parts).

# v0.9.1 play-test fixes and the ACT III art pack F2 work order (D-087)
- v0.9.1 played and approved by the user; PR #19 merged to main as 184536a.
- An empty chest shows the room's own painted chest, open and empty, instead of the game-drawn potion placeholder (src/ui/app.js, src/render/chest-art.js).
- Narration lines of the chronicle in battle (M16's echoes) show no portrait instead of a game-drawn placeholder face.
- New browser suite tests/feedback-v091-e2e.mjs (CI group act3).
- ACT III art pack F2 work order: scripts/make-act3-f2-art-pack.py → docs/v0.9.1/art/act3-f2-work-pack (58 images in four parts: places and things, the awakened looks, the recruits' tier 2 looks, the people of the keep and the forest with the M16 captains).
- ACT III art pack F2 imported (D-088): the awakened looks of Erik, Elina and Sain and the recruits' tier 2 looks (busts, sheets, the awakening card); the forest village and the keep painted on their footprints, the `forest` room family with six rooms and four chest styles; the last guardian and the forest elder (portraits, map figures, their names in dialogue); the M16 duel captains; the awakened guardian statue, forest-keepers and grey captain sheets; icon sheet I (three ④ ultimates, two treasures, the basic potion); battle props (ward tree standing / wounded / felled stump, sleeping statue; scripts/import-interior-art.py `props`, src/render/prop-art.js).
- tests/act3-art.test.mjs; feedback-v091-e2e now 5 checks; act2-hubs-e2e covers the forest village.
- On feature/act3-f2-art-pack; not merged before the user plays and approves it.

# v0.9.1 — The Guardians · ACT III part 2: M17 수호자의 맹세, M18 불타지 않는 숲, the first awakenings (release candidate)
- Release candidate on feature/v0.9.1-guardians; not merged before the user plays and approves it. D-084 (within D-079 / docs/v0.9.0/ACT3_DESIGN.md); the v0.9.1 places and figures use temporary art (the ACT III packs are with the user).
- ACT III art pack F1 (D-086): the painted capital (hub_capital over Velmar's footprint, the `capital` room family with six rooms, four chest styles), the archivist and Bellard busts, six ACT III map sheets and sheet H icons (six capital pieces, two treasures; scripts/import-item-art.py --cells). Shopkeepers behind one-row painted counters stand a row back (reach 3).
- Art work pack D (D-085): the painted pilgrim village (hub_pilgrim with an authored walk mask; eight doors, the chapel and the copyists' house are new rooms of the quarters kind; the `pilgrim` room family with eight painted rooms; four chest styles) and the ACT II part 2 cast (Lucien and Ines busts, ten map sheets). Two more chests per visit in the pilgrim village (same chest rule); pack QA deviations listed in D-085, the QA reports in docs/v0.9.1/art/pack-d-qa.
- M17 (src/core/mission-rules-v091.js): four sleeping guardian statues (an oath beside one wakes it for the legion; an enemy left beside one wakes it for the chancellery), the Book of Oaths on two archive tiles (two enemy phases on them lose it), hold to TURN 10 or bring down the captain; camp choice on the book; Erik's word.
- M18: rain (fire −50%, no ignition, rules.js), the ward at the forest's heart (fire harmless, heals +50%), three ward trees the betraying banner's loggers go for (two felled lose), six forest-keepers led inside; hold to TURN 12 or bring down the logging captain (arrives TURN 4); camp choice on the truth.
- Awakening (Tier 3; classes.js, progression.js, skirmish.js): Lv 14 + tier 2 + the hero's mission, trials 106–108, the ④ skills once a battle (tactics.js): 맹세의 성벽, 퇴로 봉쇄, 새벽의 기도; the awakening card.
- Recruits' tier 2 (trials 111–113): 흑철 창기사 (a killing Charge leaves the rest of the move), 검성 (two counters in Riposte), 성소 수호자 (sanctuary reaches two tiles). The legion panel lists every hero in the legion.
- Aren's 「나아가라」 (first turn MOV +1) from M17. Guardians' keep and forest-village hubs (temporary art), world sites, one original track, two treasures and hidden objectives, rewards and supply carriers.
- Saves: schema 13 imports 0–12; real v0.9.0 saves verified (shipped HTML and source fixtures). Tests: mission17/18, awakening, migration-v090 unit suites; act3b and migration-v090 browser suites (CI group act3).

# v0.9.0 — The Capital · ACT III part 1: M15 사라진 기록, M16 잊힌 전장 (release candidate)
- Release candidate on feature/v0.9-act3-crown; not merged before the user plays and approves it. Design D-078 (docs/v0.9.0/ACT3_DESIGN.md), approved with the recommended answers and temporary art (D-079, chat 2026-11-03 18:21 KST); details D-080.
- M15 (src/core/mission-rules-v090.js): three clerks run to their gates from TURN 1; knocked down, their boxes are secured; all three settled with two boxes wins; grey cloaks hunt the archivist from TURN 3; the royal watch warns once and turns hostile the second time the legion fights within two tiles of it. Camp choice m15_records (archivist / keep / post).
- M16: fog (rules.js weatherOf/fogClear/foggedFor/fogHidden: bows and spells −1 range, far enemies hidden), ward stones (search clears the fog around them and stops the harvest), memory harvesters (MP −3 near an unsearched stone), the betraying banner's scavengers, the TURN 3 duel, departed recruits (and a missed Ines) returning as allies and rejoining if alive. Camp choice m16_stones (break / leave).
- 일기토 (src/core/duel.js): strike / guard / finisher, best of three, the loser −30% max HP, refusable; the battle waits while it is open; saved and validated.
- Aren's commands (src/core/command.js): 「지켜라」 (DEF +2, turns 1–2) on the deployment bar from M15.
- Sortie 7; capital (Velmar painting under dusk, temporary) and field camp hubs; world sites capital and 잊힌 전장, ACT III card; two original tracks; capital forge with six tier III pieces; two treasures and hidden objectives; gold 380/400; supply carriers.
- ACT III enemy numbers are set to the party that finishes ACT II (far stronger than ACT II's last enemies).
- Art work pack E (D-081): 102 painted icons from the user's pack, verified and cut by scripts/import-item-art.py (src/assets/items); tools, gear and treasures everywhere, plus the battle command menu, the skill disks (skills submenu, tactics tab) and the status chips over units; larger icons in shop cards (44 px) and equipment views (40 px). The capital's tier III pieces and the two v0.9.0 treasures keep game-drawn icons until the ACT III art. Tests: tests/item-art.test.mjs, tests/item-art-e2e.mjs (CI group act3).
- Fixed: chests in hubs from Mission 10 on and in the raided village could not be opened (chest id pattern).
- Saves: schema 12 imports 0–11; real v0.8.1 saves verified (shipped HTML and source fixtures). Tests: mission15/16, migration-v081 unit suites; act3 and migration-v081 browser suites (CI group act3); the campaign balance run continues into M15–M16 (test-output/act3-balance.json).

# v0.8.1 — Arms · regional gear, revisits, gear stars, treasures and hidden objectives (merge approved by the user, 2026-11-03)
- Release: the user approved the merge in chat (2026-11-03 07:56 KST, "병합 진행해 주고", D-077); PR #17 CI run 41470788485 7/7; item art pack E still pending (temporary icons). Started on the user's instruction (chat 2026-11-02 07:08 KST); design D-073 §6 (Q5/Q6), details D-076.
- Shelves (src/core/arms.js, src/data/arms-v081.js): tier I everywhere; 24 regional tier II pieces sold only in their town and unlocked by its missions (locked ones shown with what opens them); a premium piece per town from the first visit; six elite pieces at faction trust 2; Velmar's rare-goods shelf (another town's specialty, +25%, turned by each clear). Recruits get their first gear.
- Revisits: the world map lists the towns passed (잿빛 마을, 철관성 성하 마을, 벨마르, 순례자 마을); travel is free; shops, forge and townsfolk only; the story continues in the camp.
- Gear stars: ★1–3 (treasures ★1–5) from strikes, heals and blows; kept on a victory only; 단련 replaces the +1 upgrade (a +1 is ★2 with the same numbers); four slots with the treasure slot; gear limit 30.
- Treasures and hidden objectives: one 숨은 전과 per mission (Lia's hint, mission list marks), twelve treasures and two Elixirs; a cleared mission's practice wins it once. M07 asks for all three wagons kept (the mission ends once two pass the gate).
- Supply carriers (one per battle, 보 chip) drop a tool; cut-ins for heroes' critical hits and ③ skills.
- Saves: schema 11 imports 0–10; real v0.8.0 saves verified (shipped HTML and source fixtures). Art pack E importer (scripts/import-item-art.py); temporary icons until the art arrives.
- Forge shelf headings span the whole row of the two-column grid.
- Tests: arms and migration-v080 unit suites, arms and migration-v080 browser suites; the ACT II balance run records the hidden objectives the policy wins.

# v0.8.0 — Tactics · three skills, status effects, tools, matchups (merge approved by the user, 2026-11-01)
- Release: the user approved the merge in chat (2026-11-01 23:23 KST, "병합을 해줘", D-075); PR #16 CI run 41313533757 7/7. Design approved 2026-10-28 06:24 KST (D-073); details D-074.
- Skills: three per hero (src/data/skills.js) — ① signature, ② new at Lv 4 (recruits on joining), ③ promotion action (recruits: a third new skill at join level + 3). Eleven new skills: 도발, 속박 사격, 화염진, 정화, 독날, 돌파, 기병의 함성, 회전 베기, 허점 찌르기, 성화 낙인, 순례자의 등불.
- Status effects (src/core/status.js): poison, confusion, bind, silence; commanders half chance and one phase; chips over units; ACT II enemy weapons inflict them.
- Tools (src/core/tactics.js): 13 tools; recovery and cures on self or an adjacent ally; throwables 2–3 tiles (Powder Bomb, Smoke Bomb, Weighted Net, Bewildering Powder, Caltrops), three a battle; War Drum; bag 8; stock opens with progress.
- Class matchups: cavalry → infantry → archers → cavalry (±20%), spears beat cavalry; irregulars neutral. Tile skills and throws preview their cells; the battle guide explains the new rules.
- Tuning: Flame Burst 50% / 8 MP; one kill bonus per area strike. Enemy stats unchanged. The balance policy plays the new skills.
- Saves: schema 10 imports 0–9; real v0.7.1 saves verified (shipped HTML and source fixtures).
- Catalog of 102 items/skills/statuses (docs/v0.8.0/ITEM_CATALOG.md) and art work pack E (seven icon sheets) for the user's ChatGPT work.
- Tests: tactics and migration-v071 unit suites, tactics and migration-v071 browser suites, a guard against duplicate top-level names in the bundle.

# v0.7.1 — The Three Banners · ACT II complete, Missions 13–14 (merge approved by the user, 2026-10-27)
- Release: the user played the release candidate and approved the merge with one fix (chat 2026-10-27 18:34 KST, D-072). Started with the v0.7.0 merge approval (2026-10-27 06:16 KST, D-070); details D-071.
- Fix (D-072): music was still faintly audible with Mute, Music Pause or BGM 0 — the reverb return bypassed the music volume (since v0.4.0). It now follows the BGM level and reaches an exact 0; the default mix is unchanged. Tests: audio-mix unit suite, audio-mute browser suite.
- M13 검은 사자의 결단: Baldrick's lion formation marches on the refugee camp; resolve from ACT I–II choices, the new 설득 action (Erik beside Baldrick once a turn, Thea once) and calm enemy phases; 6 halts his army (Iron Crown trust −1); otherwise break the formation from TURN 5 or hold to TURN 12. Baldrick parts in every outcome.
- M14 부서진 동맹: escort Cassian, Leonora and Lucien with their guards to the exit while masked raiders hunt them; on TURN 4 the lowest-trust banner turns on the legion; trust after the summit; the betraying banner's recruit stays or leaves (kept for ACT III).
- ACT II completion card; summit camp; world route to the ruined waystation; one original track (The Black Lion's Decision).
- Fix: the battle menu offered 생포 only in M02, so captures in M07/M09/M10 (mediation)/M12 could not be chosen; it now appears wherever a mission has a capture rule.
- Saves: schema 9; real v0.7.0 saves (shipped HTML and source fixtures) continue to M13. Tests: mission13/14 and migration-v070 unit suites, act2d-campaign and migration-v070 browser suites, act2-balance M01→M14.

# v0.7.0 — The Three Banners · ACT II Missions 11–12 (merged 2026-10-27, PR #14 → 81f11d3)
- Release: the user approved the merge in chat (2026-10-27 06:16 KST, "병합하고 다음버전 진행해줘", D-070) after receiving the release candidate. Design approved 2026-10-26 23:47 KST (D-068); implementation details D-069. PR #14 hosted CI run 40363637648 6/6 (attempt 2).
- M11 성화의 행렬: four pilgrims walk a night road to the sanctuary (two tiles in light, one in the dark); three roadside braziers are lit by search; light changes hit chances (legion in light +10, any target in the dark −15) and heals pilgrims; Ines and two Sacred Flame knights escort; raider waves on TURN 3/5/7; Lucien's offer in the camp (the flame oath).
- M12 침묵의 수도원: seven guards watch ahead and turn in order; suspicion and the bell (all guards wake, three from the dormitory, the abbot burns unsecured records three turns later); sneak attacks; three records (ledger, seal study, Order roll); the abbot can be captured; the records choice in the camp (return / take / copy).
- Ines (pilgrim warden): Sanctuary (adjacent allies take −2) and Sanctuary Oath; joins at Lv 10 after M12 when the Order trusts the legion or the records were copied; eight-hero roster with sorties of six.
- Story and world: south region and route (pilgrim village, Silent Monastery, refugee camp), Sacred Flame trust row, Lucien, Sain's past up to her excommunication, the ledger cord in the Order's relief supplies (no name).
- Art and music: art work pack D generator (28 images, scripts/make-act2b-art-pack.py); until the pack arrives the pilgrim village uses the Ashen Village painting tinted to dusk and the new cast is drawn by the game. Two original tracks: Procession of the Sacred Flame, The Silent Monastery.
- Saves: schema 9 unchanged; real v0.6.1 saves (shipped HTML and v0.6.1-source fixtures) continue to M11.
- Tests: mission11/12 and migration-v061 unit suites; act2c-campaign and migration-v061 browser suites; act2-balance runs M01→M12 over 30 seeds.

# v0.6.1 — The Three Banners · ACT II Missions 09–10 (merge approved by the user, 2026-10-26)
- Release: the user approved the merge in chat (2026-10-26 20:22 KST, "좋아 병합해줘") after receiving the release candidate. Build description names ACT II Missions 07–10; release notes, Test Report, Source ZIP (D-066: without the built HTML) and SHA256 manifests.
- v0.6.0 wrap-up: tag v0.6.0 and its GitHub Release published (one-time workflow, removed); PR #12, CI runs and merge SHA recorded in docs/v0.6.0/RELEASE_NOTES.md; War Council headings use the mission title (M07+ showed only the number); the Source ZIP leaves out the built HTML, which verify-release rebuilds and compares (D-066).
- M09 자유의 도시 (D-067): Velmar's market district — rooftops and alleys, three council delegates to bring into the hall while assassins hunt them over the roofs, the assassin leader on TURN 5 (capture: the coins carry the same cord knot as the M04 ledger), Dario and harbour guards as allies; every delegate safe raises Free Lords trust.
- M10 두 영주의 전쟁 (D-067): two lords' armies fight each other around a mill village; before battle support Lord Oswin, support Lord Brennan, or mediate by capturing both (a captured lord's army stands down; both captured = truce). Dario joins after M10 when the League trusts the legion or the truce held; Riposte strengthens his counters.
- Velmar in the story: Free Lords world card and west map focus, Leonora, hub talk for M09–M10, Thea in Velmar only when she joined (roster-conditional hub NPCs).
- Music: three original tracks — Banners in the Snow (castle town, M07–M08), Lanterns over Velmar, Two Banners, One Field (M10). Velmar battle ground paints roof tiles and cobbles.
- Tests: mission09/10 and migration-v060 unit suites; act2b-campaign and migration-v060 browser suites (real v0.6.0 saves continue to M09); act2-balance runs M01→M10 over 30 seeds.

# v0.6.0 — The Three Banners · ACT II Missions 07–08 (merge approved by the user, 2026-10-26)
- Release: the user approved merging after one fix (chat 2026-10-26 05:56 KST). v0.6.0 ships ACT II Missions 07–08; M09–M10, Velmar in the story, Dario and the new tracks follow in the next version (D-065). Browser migration with real v0.5.0 saves (shipped HTML village/battle saves, ACT I complete with a promotion and a mid-M06 battle) — each opens in the hub of its story moment and a finished ACT I continues to Mission 7; build title 'The Three Banners'; release notes, Test Report, Source ZIP and SHA256 manifests.
- Town doors (D-065): the bottom houses of a town could sit under the HUD (at 1440×900 the castle town's bottom-right warehouse door was covered by the 소지품 button). The town camera now scrolls past the map edge by the HUD's size, and clicking any part of a house walks Erik to its door; 111 doors checked at three screen sizes.
- Phase D (D-064): the story continues after M06 — ACT II card on the world map, the castle town below Ironhold for M07–M08, the canyon bivouac after M08. M07 북부의 군령: a supply convoy of three wagons on a snowy road with Thea and two Iron Crown soldiers as allied escort, deserter ambushes, the deserter captain can be taken alive; camp choice: hand the deserters over or take them into the legion. M08 협곡 방어전: Baldrick holds the upper choke, two rockfall devices, raiders on the rear village, the mercenary captain on TURN 7; Baldrick's order (hold / rescue) chosen at deployment. Faction trust from ACT I and ACT II choices; Thea joins after M08 when the Iron Crown trusts the legion and the deserters were not handed over (Charge: no counter after a 3-tile run). Snow and ice battle ground, rockfall art, briefings, staged scenes and hub talk for both missions; sorties of six from M07. ACT I 30-seed results unchanged.
- ACT II hub pack C (D-063): castle town and Velmar market painted hubs with 12 rooms and ACT II chest styles.
- Dialogue (D-062): ACT I scenes reworded so each line answers the one before; hub talk written per story moment; townsfolk named as in their hub. Enemy and NPC figures sized to the hero cast (D-061).
- Characters (D-059/D-060): pack B busts and map sheets for Thea, Dario, Cassian, Leonora and ACT II enemies; every character name shown in Hangul.
- Interiors (D-056–D-058): painted rooms for every ACT I building (pack A, 15 rooms) with environment chests drawn per room style; figures outside battle drawn 1.5×.
- Phase C (engine): schema 9 (imports 0–8) with the legion roster and faction trust; recruits, sortie limits, allied AI armies, faction hostility, new terrain (snow, ice bridge, rooftops, alleys), faction relations panel after ACT I.

# v0.5.0 — Ranks of the Ashen Legion · Advanced Class & Character Progression (merge approved by the user, 2026-10-20)
- Phase G (release): browser migration with real v0.4.0 saves (shipped HTML village/battle saves, ACT I complete and mid-M05 fixtures) — each save opens in the hub of its story moment with assets kept; build title 'Ranks of the Ashen Legion'; release notes, Test Report, Source ZIP and SHA256 manifests.
- Phase F (presentation): each promotion action now has its own battle flourish that plays before the moves it causes — Bulwark's golden shield and four held tiles, Overwatch's range sweep and reticle (and a tracer when it fires), Arcane Territory's rune circles, Prayer of Return's light pillar and arc, Shadow Exchange's smoke at both ends (shorter with reduced motion). After a promotion scene a one-time rank card shows the hero before → after, the new action and the class bonuses. Five new original variations: Embers Under Pines (night bivouac), Beneath the Ash Banner (oath camp), The Rank of Embers (promotion), Trial of the Legion (trials) and A Map of Erdia (world map). A unit test now checks every shipped painted image against its hash-verified import.
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

