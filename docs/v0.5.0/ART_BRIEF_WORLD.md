# Ashen Crown — 세계 지도·거점 배경 ChatGPT 지시서 (v0.5.0, 2026-10-20)

설계는 [WORLD_MAP_AND_HUBS](WORLD_MAP_AND_HUBS.md)를 따릅니다.
- 배치와 거점 구성은 2026-10-20 승인되었습니다 (D-052). 그림에는 글자를 넣지 않으므로, 지명이 나중에 바뀌어도 그림은 그대로 쓸 수 있습니다.
- 반신 그림을 받을 때 쓴 [ART_BRIEF_CHATGPT](../v0.4.0/ART_BRIEF_CHATGPT.md), [ART_BRIEF_TIER2](ART_BRIEF_TIER2.md)와 같은 원칙을 지킵니다.

| 묶음 | 파일 | 수량 |
|---|---|---|
| 세계 지도 | `world_map.png` | 1 |
| 지도 아이콘 시트 | `world_icons.png` (3×3) | 1 |
| 거점 배경 | `hub_village_day`, `hub_village_raid`, `hub_garrison`, `hub_bivouac_night`, `hub_fortress`, `hub_oathcamp` | 6 |
| (선택) 방랑 상인 스프라이트 | `sprite_npc_merchant.png` | 0–1 |
| **합계** | | **8 (+1)** |

## 0. 원칙
- **화풍은 참고, 내용은 독자.** 조조전 같은 원작 게임의 지도나 마을 스크린샷은 첨부하지 않습니다. 배치를 따라 그리게 되기 때문입니다.
  - 구도는 아래 **배치 스케치**를 따릅니다.
  - 채색은 이미 승인된 **Aren 반신**(화풍 기준)을 따릅니다.
- 프롬프트에 원작 게임 이름, 캐릭터 이름, 문양을 쓰지 않습니다.
- **그림에 글자를 넣지 않습니다.** 지명, 간판, 표지판 글자, 범례, UI, 테두리 모두 금지입니다. 지명과 라벨은 게임이 한글로 얹습니다.
- **거점 배경에는 사람과 동물을 그리지 않습니다** (말 2마리는 예외로 허용). 장수와 NPC는 게임이 걸어 다니는 스프라이트로 올립니다.
- 배치 스케치의 칸 크기는 64px입니다. 그림이 칸에 정확히 맞을 필요는 없습니다. 걸을 수 있는 칸은 그림을 받은 뒤 Claude가 그립니다. **길과 광장만 넓고 비어 있으면 됩니다.**
- 아래 묘사는 모두 **PROPOSED**입니다. 마음에 들지 않는 부분은 바꿔도 됩니다.

## 1. 작업 순서
1. **대화창 A (지도)**
   - 첨부: `art/world_layout_sketch.png`, Aren neutral 반신.
   - 프롬프트 W로 지도를 받습니다. 마음에 들 때까지 고칩니다.
   - 같은 창에서 프롬프트 I로 아이콘 시트를 받습니다.
2. **대화창 B (거점)**
   - 첨부: `art/hub_layout_village.png`, Aren neutral 반신, 지금 게임의 맵 스프라이트 한 장(크기 기준, 예: v0.4.0 팩의 `sprite_eric.png`).
   - 프롬프트 H로 `hub_village_day`를 먼저 받습니다. **이 한 장이 거점 화풍의 기준**이 됩니다.
3. 같은 창에서 나머지 거점 5장을 받습니다. 매번 해당 `hub_layout_<id>.png`와 **승인된 `hub_village_day`**를 첨부합니다.
   - `hub_village_raid`는 `hub_village_day`와 배치가 완전히 같아야 하므로 프롬프트 H2를 씁니다.
4. 파일을 모아 ZIP으로 Claude에게 주세요. `manifest.csv`는 선택이며, 없으면 Claude가 만듭니다.

## 2. 프롬프트 W — 세계 지도 (첨부: 배치 스케치, Aren 반신)
```
Attached image 1 is a rough LAYOUT SKETCH of an original fantasy continent called Erdia. Follow its coastline, the five regions, the mountain range, the main river and the site positions closely. Attached image 2 is the approved painting-style reference (use its colors, brushwork and warm lighting only).
Paint a hand-painted fantasy campaign map for a classic tactical RPG: a top-down view of the whole continent on aged parchment with soft painted terrain, gentle relief shading, painted coastlines with light waves, and a subtle vignette at the edges.
Terrain by region (follow the sketch positions):
- North: a long snowy mountain range with dark pine forests and grey stone foothills; a narrow grey canyon cutting south-west out of the mountains.
- West: green rolling plains, small woods, windmill fields, a wide river mouth with a natural harbor on the west coast.
- Center: golden farmland and gentle hills along the great river, a wide open plain around the site of a royal city.
- South: warm red-ochre cliffs, high plateaus and sun-baked valleys reaching the southern coast.
- East: ash-tinted conifer forests, rolling hills and a deep river gorge running north to south; a border wall ridge at the far north-east.
- Far east edge: the land fades into drifting mist (unknown lands).
Do NOT draw any cities, castles, icons, borders, roads, labels, letters, compass, legend, frame or UI — terrain only. Leave the site positions from the sketch as clear open ground so icons can be placed on top later.
Output: one PNG, 1536×1024 landscape.
```

## 3. 프롬프트 I — 지도 아이콘 시트 (지도 창에서 이어서)
```
Same painting style as the approved map. Paint a 3×3 sheet of small map icons for this campaign map, each centered in its own 341×341 cell, seen from the same top-down three-quarter angle, with a soft drop shadow, on a fully TRANSPARENT background (or flat #00FF00 if transparency is not possible). No text, no labels, no frames.
Row 1: (1) a small border village of thatched houses, (2) a cluster of military tents with a pennant, (3) a stone border gate set in a wall.
Row 2: (4) a ruined, partly broken hill fortress, (5) a grand royal castle with tall towers and gold-trimmed roofs, (6) a dark grey iron-and-stone mountain stronghold.
Row 3: (7) a walled free city with a small harbor and windmill, (8) a tall cathedral with a glowing ember-orange rose window, (9) a quiet cliffside monastery.
Every icon must read clearly at 64×64 px.
Output: one PNG, 1024×1024.
```

## 4. 프롬프트 H — 거점 배경 (첨부: 해당 배치 스케치, 화풍 기준, 스프라이트 한 장)
`<SCENE>` 칸에 §5 표의 문장을 그대로 붙여 넣습니다.
```
Attached image 1 is a LAYOUT SKETCH for a walkable town map in a classic tactical RPG: a 24×16 grid of 64-pixel tiles. Keep every labelled area in the same place and roughly the same size; the labels are for you only — do not paint any text.
Attached image 2 is the approved painting-style reference. Attached image 3 is a character sprite that will walk on this map: buildings, doors, tents and props must be in scale with it (a standing adult is about 80 px tall; a doorway is about 64 px wide).
Paint the map as one finished hand-painted background, seen from a high three-quarter top-down angle (about 60°), like classic tactical RPG town maps: flat readable ground, objects drawn with their front faces visible, soft painted textures, warm rim light, no perspective vanishing toward the horizon.
Scene: <SCENE>
Rules: keep all paths and the central open area wide, flat and uncluttered so characters can walk there; no people (except where stated), no text, signs with letters, UI, grid lines or frame.
Output: one PNG, 1536×1024 landscape.
```

### 프롬프트 H2 — 습격 후 마을 (첨부: 승인된 `hub_village_day`)
```
Attached is the approved village map. Repaint the EXACT same map — identical layout, buildings, paths and camera — as it looks the same evening right after a bandit raid:
<SCENE for hub_village_raid>
Output: one PNG, 1536×1024, same framing pixel for pixel as the attached map.
```

## 5. 거점 장면 목록 (`<SCENE>`에 붙여 넣기)

| 파일 | 배치 스케치 | 게임 쓰임 | `<SCENE>` (영문) |
|---|---|---|---|
| `hub_village_day` | `hub_layout_village.png` | M01 전 | A peaceful border village in the eastern frontier on a clear morning. Timber-and-plaster houses with thatched and shingled roofs. Top-left a blacksmith with an open forge, anvil and a weapon rack outside; top-right an item shop with a striped awning, crates and bottles. A small inn on the left, the elder's hall with a war-room table visible through an open door on the right. A cobbled square with a stone well in the center; vegetable plots, fences, a supply depot with barrels at the bottom-right, conifers around the edges, a dirt road leaving at the bottom center. |
| `hub_village_raid` | (H2) | M01 후 | Dusk after the raid: several houses at the bottom-left are burnt to charred beams with thin smoke; scorch marks on the item shop awning; the inn has become a makeshift infirmary with cots and bandages outside; a smouldering broken cart and a few sealed wooden supply crates in the square; scattered debris, trampled fences; warm orange sunset light mixed with grey smoke. |
| `hub_garrison` | `hub_layout_garrison.png` | M02 전 – M03 전 | A royal border garrison camp on an overcast day, enclosed by a sharpened wooden palisade with a gate at the bottom center. Top-left an open-air field forge (anvil, coal forge, grindstone, racks of spears and shields — no building). Top-right a quartermaster tent with a counter, crates and barrels. Left a triage tent marked with a plain red cloth, cots inside. Right the largest command tent with a tall plain grey banner pole. A packed-earth parade ground in the center with a small fire and a map table. Bottom-left a wooden watchtower, bottom-right a training yard with straw dummies, rows of small soldier tents. Orderly and military, muted teal-grey and canvas tones. |
| `hub_bivouac_night` | `hub_layout_bivouac.png` | M03 후, M04 전 | A marching camp in a forest clearing at NIGHT. A large campfire in the exact center with a ring of log seats and open trampled ground around it, casting warm orange light; the rest of the scene in cool moonlit blue. Canvas tents at the top; the command tent at the top-right has a lantern and a map table under its awning. On the left a wandering merchant's covered wagon with hanging lanterns, its goods spread on a cloth: potion bottles, crates, a rack of swords, spears and bows, shields leaning on the wheel — clearly both an item shop and a weapon shop. A triage tent at the bottom-left, a supply cart and two tethered horses at the bottom-right, a sentry torch at the entrance at the bottom center, dark pines all around. |
| `hub_fortress` | `hub_layout_fortress.png` | M04 후 – M06 전 | The courtyard of an old abandoned stone fortress, now reclaimed by a small garrison, on a windy grey day. Weathered curtain walls with ramparts and stone stairs on the left and right. Top-left an armory with an iron-banded door and weapon racks; top-center the keep door leading to a records hall; top-right a storehouse with sacks and barrels. A smithy corner under a wooden lean-to on the right. Flagstone courtyard with an old well in the center, moss and rubble in corners, the broken main gate at the bottom center under repair with wooden scaffolding. Cold stone greys with warm torch accents. |
| `hub_oathcamp` | `hub_layout_oathcamp.png` | M06 후, 전직 의식, 군단 훈련 | A new legion camp just beyond a great stone border gate, at dusk. Across the whole top of the map stands the massive grey border wall with its gate standing open in the middle, a path leading down from it. In the center an open oath ground with a tall new banner — plain ash-grey cloth with a single ember-orange flame mark — and a stone brazier burning beside it. Left: a wandering merchant's covered wagon with a small open-air forge. Right: a training yard with straw dummies and a roped sparring ring. Canvas tents at the corners, the command tent at the top-right. Purple-orange dusk sky light, the first lanterns being lit. |

## 6. (선택) 방랑 상인 스프라이트
- v0.4.0 지시서의 **프롬프트 D**(스프라이트 시트)를 그대로 씁니다.
- 인물 묘사: `a middle-aged wandering merchant in a patched brown travelling coat and wide hat, a large pack with pots and bundles on the back, a lantern on a pole`
- 파일 이름: `sprite_npc_merchant.png`
- 없으면 지금 쓰는 상인 그림을 그대로 씁니다.

## 7. 납품 규격

| 종류 | ChatGPT 출력 | 게임 반영 |
|---|---|---|
| `world_map` | 1536×1024 PNG | WebP q80 (약 300KB). 세력 영역 다각형과 아이콘 위치는 Claude가 그림에 맞춰 작성 |
| `world_icons` | 1024×1024, 3×3, 투명 또는 `#00FF00` | 아이콘 9개로 잘라 128px WebP |
| `hub_*` | 1536×1024 PNG | WebP q80 (장당 약 250–400KB). 걷기 마스크·문·NPC 자리는 Claude가 작성 |
| `sprite_npc_merchant` | 1024×768, 4×3 | 기존 시트 규격 (512×384 WebP) |

- 그림이 오기 전까지는 게임이 유형별 임시 배치(텐트, 모닥불, 마차)를 절차 생성으로 보여 줍니다. 이 임시 그림은 '완성'으로 표시하지 않습니다.
- 8장을 모두 넣으면 HTML이 약 2.5MB 늘어납니다 (지금 12.1MB → 약 14.5MB).
