# Ashen Crown — ChatGPT 일러스트·캐릭터 재제작 지시서 (v0.4.0, 2026-10-18)

ChatGPT(이미지 생성)에게 **대화창 반신 일러스트(bust)**와 **전투 맵 캐릭터 스프라이트**를 다시 그리게 하기 위한 문서입니다.
아래 프롬프트를 순서대로 붙여 넣으면 됩니다. 받은 이미지를 Claude에게 주면 이 문서의 "납품 규격"대로 잘라 게임에 넣습니다.

## 0. 먼저 알아 둘 원칙 (중요)
- **화풍은 참고, 내용은 독자.** 첨부한 레퍼런스 스크린샷은 *렌더링 스타일*(채색·선·조명·밀도)만 참고합니다. 레퍼런스 속 인물·얼굴·의상·문양·로고·UI는 따라 그리지 않습니다. 레퍼런스의 삼국지풍 갑옷이 아니라 Ashen Crown 설정(서양 중세풍 국경 판타지)의 의상을 입힙니다.
- 프롬프트에 원작 게임 이름이나 캐릭터 이름을 쓰지 않습니다. 화풍은 말로 묘사하고 스크린샷을 "style reference"로만 첨부합니다.
- 캐릭터 외형은 `docs/story/CHARACTER_BIBLE.md`의 Visual Identity를 따릅니다. 세인의 성별, 다른 인물들의 나이처럼 OPEN인 항목은 그림에서도 단정하지 않습니다.
- 대화창 틀(검은 먹 패널, 이름 위치 등)은 이번 작업 범위가 아닙니다. 인물 그림만 교체합니다.

## 1. 작업 순서
1. **스타일 고정 (1회)**: 프롬프트 A와 레퍼런스 2장 → 아렌 시험 반신 1장. 마음에 들 때까지 이 단계만 반복합니다.
2. **주인공 반신 (기준 이미지)**: 프롬프트 B로 7명의 *neutral*을 먼저 그립니다. 각 인물마다 승인한 neutral을 다음 단계의 기준 이미지로 씁니다.
3. **표정 3종**: 프롬프트 C로 neutral 이미지를 첨부해 concerned / determined / sad를 만듭니다. 구도·의상·조명은 그대로 두고 얼굴만 바꿉니다.
4. **조연·적 반신**: 프롬프트 B (표의 "표정" 열만큼).
5. **전투 스프라이트 시트**: 프롬프트 D. 인물마다 1장씩 그리고, 반신 neutral을 외형 기준으로 첨부합니다.
6. 이미지를 모아 Claude에게 첨부합니다 (파일명 규칙: §4). 배경 제거, 크기 조정, WebP 변환, 발 기준선 정렬, 게임 삽입, 테스트는 Claude가 합니다.

ChatGPT는 같은 대화 안에서 일관성이 가장 좋습니다. 캐릭터 한 명의 반신·표정·스프라이트는 **한 대화창에서 연속으로** 만드세요.

---

## 2. 프롬프트

### 프롬프트 A — 스타일 고정 (레퍼런스 스크린샷 2장 첨부)
```
I am making an original offline tactical RPG called "Ashen Crown" (Western medieval frontier fantasy).
The two attached screenshots are STYLE REFERENCES ONLY. Study their rendering style and describe it back to me in 8–10 bullet points, then paint one test image.
Do NOT copy any character, face, costume, emblem, logo or UI from the references. Only the painting style is wanted.

Style to match:
- Semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real).
- Three-quarter bust (head, shoulders, upper chest), figure turned slightly to the viewer's RIGHT, eyes looking right, as if speaking to a text box on the right.

Test image: Aren Valter, 27, male commander of a border garrison. Short swept-back black hair, calm intelligent eyes (warm brown), clean-shaven with faint stubble, ash-grey military long coat with gold trim and buttons, gold shoulder epaulettes, a deep red commander's scarf wrapped at the neck with one tail hanging, a grey cloak over the left shoulder. Expression: calm, composed.
Output: one PNG, 1024×1280 portrait, character only on a fully TRANSPARENT background (no frame, no text, no UI), bust cut off cleanly at the bottom edge, top of hair about 8% below the top edge.
```

### 프롬프트 B — 인물 반신 (neutral 또는 지정 표정)
`<CHARACTER>` 칸에 §3 표의 한 줄 묘사를 넣습니다. 스타일이 흔들리면 프롬프트 A의 시험 이미지를 함께 첨부합니다.
```
Same painting style as the approved Aren test image (attached). Original character for "Ashen Crown" — do not copy anything from any existing game.
Paint a three-quarter bust, turned slightly to the viewer's RIGHT, eyes looking right.
Character: <CHARACTER>
Expression: <neutral | concerned | determined | sad>
Output: PNG 1024×1280, transparent background, no text, no frame, no UI, same framing and scale as the Aren image (head top ~8% from top, shoulders filling the width, cut at bottom).
```

### 프롬프트 C — 표정 변형 (승인한 neutral 첨부)
```
Using the attached image as the exact model sheet: same character, same outfit, same pose, same framing, same lighting and same style.
Change ONLY the facial expression to: <concerned — brows raised and pulled together, slight frown | determined — brows lowered, firm mouth, intense eyes | sad — downcast eyes, inner brows raised, mouth turned down>.
Output: PNG 1024×1280, transparent background, nothing else changed.
```

### 프롬프트 D — 전투 맵 스프라이트 시트 (반신 neutral 첨부)
```
Using the attached portrait as the costume and color reference, draw the same character as a small full-body battle-map figure for a classic tactical RPG, in the same painted style simplified for small size (clean dark outline, readable silhouette, about 3.5 heads tall — slightly heroic, not chibi).
Camera: classic top-down three-quarter SRPG map view (looking down ~45°, no isometric rotation).
Make ONE sprite sheet, PNG, transparent background, exactly 1024×768, a 4-column × 3-row grid of 256×256 cells, no grid lines, no text:
- Row 1: facing DOWN (toward the camera)
- Row 2: facing RIGHT (side view; the left-facing view will be mirrored by the game)
- Row 3: facing UP (back view)
- Column 1: standing idle · Column 2: walking step A (left foot forward) · Column 3: walking step B (right foot forward) · Column 4: attack pose with the weapon swung/aimed in the facing direction
Every frame: same scale, character centered horizontally in its cell, FEET ON THE SAME BASELINE 16 px above the cell bottom, the whole figure including weapon inside the cell, consistent colors in all 12 frames.
Character: <CHARACTER + weapon>
```
기병(철왕관 기병)은 말 포함 전체가 칸 안에 들어가도록 "mounted on a horse, the horse fills most of the cell width"를 덧붙입니다.

---

## 3. 인물 목록과 묘사 (`<CHARACTER>`에 넣을 문장)
공통 세계관: 서양 중세풍 국경 판타지. 왕실 수비대가 명령을 거부하고 "재의 군단(Ashen Legion)"이 되는 이야기입니다.

### 3-1. 주인공·아군 (반신 4표정 + 스프라이트)
| id | 묘사 (영문, 그대로 붙여 넣기) | 무기 (스프라이트) |
|---|---|---|
| `aren` | 프롬프트 A의 Aren 묘사 그대로 (non-combat commander, sword sheathed) | sheathed longsword at the hip |
| `eric` | Erik, young adult male knight and shield-bearer, warm brown messy short hair, blue eyes, a small diagonal scar on the left cheek, teal-blue steel plate armor with gold trim, blue tabard with a small shield emblem, serious and protective | longsword and a large teal kite shield; open-face knight helmet on the battle sprite |
| `eric_adv` | Same Erik (attach his neutral), upgraded "Guardian Mantle": brighter polished teal plate, richer gold trim, a deep purple cape | same as eric, plus the purple cape |
| `elina` | Elina, young adult woman archer and scout, auburn-red hair in one long braid over her shoulder, green eyes, light freckles, green hooded cloak (hood down), brown leather jerkin, quiver strap across the chest, sharp observant eyes | longbow and quiver of red-fletched arrows |
| `lia` | Lia, young woman mage and legion strategist, long dark plum-purple hair, amber eyes, tall wide-brimmed purple witch hat with a small pale-blue crystal, violet robe with gold trim and a pale-blue gem brooch, curious bright expression | staff topped with a pale-blue crystal orb |
| `sain` | Sain, gentle healer from a sun order, dark brown skin, short cream-white hair, androgynous face (gender intentionally ambiguous), light cream hooded robe with the hood up, gold sun sigil and gold trim, kind calm eyes | golden holy staff with a sun-disc head |
| `kai` | Kai, young adult male rogue, spiky dark teal-black hair, green eyes, tanned skin, small scar across the nose, dark hooded jacket (hood down), large orange scarf wrapped around the neck, crossed dagger straps, wry half-smile | twin daggers |

### 3-2. 주요 인물·보스 (반신 + 스프라이트)
| id | 묘사 | 표정 | 무기 |
|---|---|---|---|
| `baldrick` | Baldrick Roen, "the Black Lion", veteran supreme commander of the Iron Crown army, late 40s, grey swept-back hair, short grey full beard, a vertical scar through the right eyebrow, black-and-gunmetal plate armor with gold edging, a golden lion-mane fur collar, dark cloak, stern and dignified | 4종 | long spear |
| `advisor` | Staff aide of the legion, young man, neat dark hair, thin gold-rimmed glasses, dark indigo officer's coat with gold trim, holding papers | neutral, concerned | papers / map case |
| `garr` (M01 boss) | Garr, bandit chief, big burly man, mohawk, thick dark full beard, tanned, red-brown leather with a shaggy fur mantle | neutral, determined | huge two-handed axe |
| `deserterCaptain` (M02 boss) | Leader of army deserters, weathered man with a full beard, olive-green hood and cloak, worn leather armor | neutral, determined | axe |
| `pursuerCaptain` (M03 boss) | Royal pursuit commander, pale cold-faced man in his 40s, dark slicked hair, scar through the eyebrow, plate armor over a dark purple tabard | neutral, determined | longsword |
| `quartermaster` (M04 boss) | Fortress quartermaster, thin pale older man, grey swept hair, neat moustache, dark grey officer's coat, clutching a ledger | neutral, sad | ledger (no weapon) |
| `executor` (M06 boss, 신규) | Royal blockade executor, imposing officer in dark royal-purple plate with a sealed-order scroll case on the belt, cold expression, older, short grey hair | neutral, determined | halberd |

### 3-3. 마을·야영지 NPC (반신 neutral + 스프라이트)
| id | 묘사 | 소품 |
|---|---|---|
| `elder` | Village elder, bald, long white beard, brown robe, kind tired eyes | walking cane |
| `smith` | Blacksmith, bald, strong arms, dark full beard, leather apron over a rolled-sleeve shirt | hammer |
| `merchant` | Tool merchant, cheerful man, green beret, cream shirt with a green vest | satchel |
| `refugee` | Refugee woman, worn headscarf and shawl, tired but hopeful | bundle |
| `guard` | Garrison guard, young man, round kettle helmet, blue-grey tunic over chainmail | spear |
| `mira` (스프라이트만) | Injured young woman refugee, headscarf, bandaged arm | — |
| `farmer` (스프라이트만) | Farmer Tomas, straw hat, tunic | — |
| `child` (스프라이트만) | Village child, short brown hair, orange tunic, small | — |

### 3-4. 일반 병사 (스프라이트만, 우선순위 낮음)
| id | 묘사 | 무기 |
|---|---|---|
| `bandit` | Bandit, red bandana, stubble, brown leather | hand axe |
| `archer` | Bandit archer, brown hood, leather | bow |
| `torch` | Torch-bearing supply soldier, grey cap helmet, grey-green tunic | burning torch |
| `deserter` | Deserter soldier, worn olive tunic, stubble | sword |
| `pursuer` | Royal pursuer / seal-corps soldier, kettle helmet, dark purple tunic | sword |
| `pursuerArcher` | Royal pursuer archer, purple cap, leather | bow |
| `fortGuard` | Fortress guard, grey kettle helmet, grey-green tunic | spear |
| `fortArcher` | Wall archer, grey cap, leather | bow |
| `storeman` | Cellar storeman, bandana, apron, stubble | hammer |
| `bearer` | Black-lion standard bearer, gunmetal kettle helmet | black banner with a gold lion |
| `ironSpear` | Iron Crown spearman, gunmetal plate, dark tabard | spear |
| `ironArcher` | Iron Crown archer, dark cap, leather | bow |
| `cavalry` | Iron Crown cavalryman, knight helmet, gunmetal plate, red tabard, on a brown horse with dark barding | lance |
| `inspector` | Royal inspector, dark grey coat, scroll case | short sword |

**권장 우선순위:** ① 3-1 반신 4표정 (28장) → ② 3-1 스프라이트 7장 → ③ baldrick·보스 반신 → ④ 나머지 스프라이트. ①만 끝나도 Claude가 먼저 반영할 수 있습니다.

## 4. 납품 규격 (Claude가 게임에 넣는 기준)
| 종류 | 파일명 | ChatGPT 출력 | 게임 반영 |
|---|---|---|---|
| 반신 | `bust_<id>_<neutral\|concerned\|determined\|sad>.png` | 1024×1280, 투명 배경, 오른쪽을 보는 3/4 반신 | 720×880 WebP로 축소. 표정이 없으면 neutral로 대체 |
| 스프라이트 | `sprite_<id>.png` | 1024×768, 4열×3행 그리드, 칸 256×256, 발 기준선이 칸 아래에서 16px | 칸마다 잘라 발 기준선을 정렬한 뒤 타일 크기로 축소. 왼쪽 방향은 오른쪽 행을 좌우 반전. 사망·피격 연출은 기존 코드 재사용 |

- 배경이 투명하지 않게 나오면 단색 배경(크로마 그린 `#00FF00`)으로 요청하세요. 배경 제거는 Claude가 합니다.
- 오프라인 단일 HTML에 이미지가 모두 들어가므로 용량 목표는 반신 80KB, 스프라이트 시트 60KB 내외(WebP)입니다. 전체 반영 시 HTML이 약 5–8MB 늘어납니다.
- 일러스트가 아직 없는 인물은 현재 코드로 그린 반신과 스프라이트를 그대로 씁니다. 그래서 일부만 먼저 넣어도 됩니다.
- ChatGPT가 그린 이미지를 쓰게 되므로, 사용 조건이 이 프로젝트의 배포 방식(공개 저장소의 오프라인 HTML)과 맞는지 OpenAI 이용약관을 한 번 확인해 두세요.
