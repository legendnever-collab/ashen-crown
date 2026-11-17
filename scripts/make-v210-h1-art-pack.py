"""v2.1 (D-118): art pack H1 remade for 「주점과 세계지도」 — docs/v2.1.0/art/h1v2-work-pack (50 images).

The v2.0.0 H1 work order (docs/v2.0.0/art/h1-work-pack) had not been drawn yet; this one replaces it. It keeps the 24 class
sheets, the arena and icon sheet P as they were, turns the four officers into tavern hires (busts kept) and adds the rescued
hero Adel, the five later hires (one bust each), the village tavern, the two small villages and icon sheet Q.
Usage: python3 scripts/make-v210-h1-art-pack.py [zip-out]
"""
from pathlib import Path
import csv, shutil, sys, zipfile
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
old = root / 'docs/v2.0.0/art/h1-work-pack'
f2 = root / 'docs/v0.9.1/art/act3-f2-work-pack/references'
out = root / 'docs/v2.1.0/art/h1v2-work-pack'
if out.exists(): shutil.rmtree(out)
(out / 'prompts').mkdir(parents=True); (out / 'references').mkdir()

STYLE_BUST = ("Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art "
 "for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but "
 "slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy "
 "any existing game's character, costume, emblem or logo.")
EXPR = {'neutral': 'calm, neutral expression.', 'determined': 'determined expression, jaw set, eyes forward — ready to fight.', 'concerned': 'concerned expression, brows drawn, worried for someone.'}

# (id, Korean name, who) — the hires and the rescued hero (TAVERN_WORLD_DESIGN §4, §7; data/mercs-v210.js)
PEOPLE = {
 'adel': ('아델', "a man in his late thirties, the last spearknight of a fallen border watch-post who kept guarding a roadside village alone: lean and weathered, short dark hair greying at the temples, a mail coif pushed back, a plain faded watch-post tabard (no emblem) over dented chainmail, a long spear held upright; quiet, steady, stubborn eyes"),
 'sera': ('세라', "a woman in her thirties, a spear captain sent from a northern iron-crowned dominion: braided ash-blond hair, a steel gorget, a fur-trimmed dark northern cloak over plate and mail, a long pike; strict, protective eyes"),
 'orin': ('오린', "a man in his forties, a scholar-mage of a free merchant city's guild: neat dark beard, small round spectacles, a green scholar's robe with many pockets holding rolled papers (blank), a short staff with a plain brass head; a wry, clever smile"),
 'celine': ('셀린', "an adult woman in her early twenties, a travelling pilgrim priest: short auburn hair, a dusty pale travelling habit with a warm orange sash, a small brass oil lamp in her hand; gentle, tired, kind face"),
 'ren': ('렌', "a man in his late twenties, a former archive gatekeeper turned informant: sharp features, dark hair tied back, a dark grey hooded coat with many inner pockets, a ring of old iron keys at the belt, a thin dagger; sardonic, watchful eyes"),
 'silva': ('실바', "a woman in her thirties, a forest keeper who never left an ancient forest: layered green-and-brown leathers, a leaf-coloured hood down on her shoulders, a long bow, a braid with wooden beads; calm, attentive eyes"),
}
OFFICERS = ['bram', 'noa', 'marta', 'rowell']

jobs = []  # (part, kind, id, expression, file, size, references, prompt_name, text)
def job(part, kind, id_, expr, file, size, refs, name, text):
    jobs.append((part, kind, id_, expr, file, size, refs, name, text))

# A–C: the 24 class sheets, unchanged
old_jobs = list(csv.DictReader(open(old / 'jobs.csv', encoding='utf-8')))
for j in old_jobs:
    if j['kind'] != 'sprite': continue
    job(j['part'], 'sprite', j['id'], '', j['file'], j['size'], j['references'], Path(j['prompt_file']).name, (old / j['prompt_file']).read_text(encoding='utf-8'))
# D: the four tavern hires of ACT I (the v2.0.0 officers' prompts) and the rescued hero Adel — three expressions each
for j in old_jobs:
    if j['kind'] == 'bust' and j['id'] in OFFICERS:
        text = (old / j['prompt_file']).read_text(encoding='utf-8').replace('the four new officers', 'the tavern hires')
        job('D', 'bust', j['id'], j['expression'], j['file'], j['size'], j['references'], '', text)
for e in ['neutral', 'determined', 'concerned']:
    ko, who = PEOPLE['adel']
    job('D', 'bust', 'adel', e, f'bust_adel_{e}.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png', '',
        f"Paint a dialogue bust of Adel ({ko}) for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and shoulders down to mid-chest, turned slightly to the viewer's right, framed exactly like the attached style_aren_neutral.png. {who}. {EXPR[e]} The same person in all three expressions (neutral, determined, concerned). {STYLE_BUST}\n\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png.\n")
# E: the later hires — one neutral bust each
for id_ in ['sera', 'orin', 'celine', 'ren', 'silva']:
    ko, who = PEOPLE[id_]
    job('E', 'bust', id_, 'neutral', f'bust_{id_}_neutral.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png', '',
        f"Paint a dialogue bust of {id_.capitalize()} ({ko}) for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and shoulders down to mid-chest, turned slightly to the viewer's right, framed exactly like the attached style_aren_neutral.png. {who}. {EXPR['neutral']} {STYLE_BUST}\n\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png.\n")
# F: the village tavern room and the two small villages (painted on the ash village's footprint)
HUB_HEAD = (f2.parent / 'prompts/01_hub_forest.txt').read_text(encoding='utf-8').split('Scene:')[0]
HUB_TAIL = ("Keep exactly the same footprint as the attached approved_hub_village_day.jpg (the same building positions, door tiles, square, paths and well) — it is a different village painted on the same layout. Match the style of the attached approved hubs.\n"
 "Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's map, town, emblems or layout.\n"
 "Attach: layout_hub_village.png, approved_hub_village_day.jpg (same footprint), approved_hub_capital.jpg (latest style), scale_reference.png, sprite_eric_sheet.png.\nOutput: one JPEG (quality 92-95), exactly 1536x1024 px.\n")
ROOM = (f2.parent / 'prompts/02_int_forest_longhouse.txt').read_text(encoding='utf-8').split('Scene:')[0]
job('F', 'room', 'int_village_tavern', '', 'int_village_tavern.jpg', '1536x1024', 'layout_int_village_tavern.png, scale_reference_interior.png, approved_int_village_barracks.jpg, approved_int_capital_tavern.jpg', '',
    ROOM.replace('layout_int_*.png', 'layout_int_village_tavern.png') + "Scene: Inside a frontier village tavern where sellswords wait for work: a long bar counter along the back wall with barrels and plain mugs, a wide stone hearth with a warm fire, sturdy plank tables and benches, a wooden notice board on the back wall with pinned papers that are blank (no writing), lanterns, a mounted pair of old spears (no emblem). Warm, busy-looking but empty of people. Chest tile a at column 1, row 4 (0-based) stays empty floor. Chest tile b at column 10, row 2 (0-based) stays empty floor. The KEEPER tile at column 5, row 5 (0-based) stays empty floor in front of the counter — the game draws the tavern keeper there.\n"
    "Keep the walk areas where the attached approved_int_village_barracks.jpg has them (the same footprint), but furnish it as a tavern.\n"
    "Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.\n"
    "Attach: layout_int_village_tavern.png, scale_reference_interior.png, approved_int_village_barracks.jpg (same room footprint), approved_int_capital_tavern.jpg.\nOutput: one JPEG (quality 92-95), exactly 1536x1024 px.\n")
job('F', 'hub', 'hub_reed', '', 'hub_reed.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png', '',
    HUB_HEAD + "Scene: 갈대 나루 (Reed Ferry), a small ferry village on a reed-lined river below an abandoned frontier fortress, late morning. Timber houses on low stone footings with reed-thatched roofs, fishing nets drying on poles, a short wooden landing with tied flat ferry boats along the map's edge (water only outside the walkable paths), baskets of river fish, a well. The buildings: a smithy (weapon shop), a provisioner (item shop), the ferry tavern (the inn building), the ferry warden's hall, a family house, a net-and-rope store. Calm, a little poor, recovering after the bandits left.\n" + HUB_TAIL)
job('F', 'hub', 'hub_stonewell', '', 'hub_stonewell.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png', '',
    HUB_HEAD + "Scene: 돌우물 마을 (Stonewell), a dusty roadside village on the frontier highway, golden afternoon. Stone-and-timber houses with slate roofs, a big old stone well at the heart of the square (half its stones fallen and propped with timber — it needs mending), wagon ruts on the road, a roadside shrine stone with no symbols, hay carts and a watch platform of logs. The buildings: a smithy (weapon shop), a general store (item shop), the highway tavern (the inn building), the village hall with a notice board of blank papers, a family house, a granary. Weathered, friendly, used to travellers.\n" + HUB_TAIL)
# G: the arena and icon sheet P (unchanged) and icon sheet Q (tavern, requests, world map, duel events)
for j in old_jobs:
    if j['kind'] in ('scene', 'icons') or j['id'] in ('arena', 'icons_P'):
        job('G', j['kind'], j['id'], '', j['file'], j['size'], j['references'], Path(j['prompt_file']).name, (old / j['prompt_file']).read_text(encoding='utf-8'))
Q = [('tavern', '주점', 'a heavy wooden tavern mug with foam, beside a small hanging tavern sign board that is blank'),
     ('requestBoard', '의뢰 게시판', 'a small wooden notice board on two posts with three pinned papers that are blank'),
     ('bounty', '현상금', 'a rolled bounty paper tied with cord and a plain red wax seal (no mark), a small stack of silver coins'),
     ('worldTravel', '세계 지도 이동', 'a folded travel map with painted hills and a river, a brass compass resting on it'),
     ('duelEvent', '일기토', 'two longswords crossed blade to blade with a bright spark where they meet'),
     ('eliteHire', '엘리트 용병', 'a polished steel gauntlet gripping a short sword hilt, with a thin gold edge on the cuff'),
     ('hire', '고용', 'a leather coin purse on top of a rolled contract (blank) tied with string'),
     ('rescue', '구출', 'a cut rope and an opened iron shackle lying on grass')]
q_text = ("Paint icon sheet Q for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, no labels. Follow references/layout_icons_Q.png for which icon goes in which cell. Match the finish, light and scale of the attached approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).\n\n"
 + ''.join(f"Cell {i:02d}: {en} ({ko}): {desc}.\n" for i, (en, ko, desc) in enumerate([(q[0], q[1], q[2]) for q in Q], 1)) + "Cells 09–16: leave empty.\n\n"
 + (old / 'prompts/38_icons_P.txt').read_text(encoding='utf-8').split('Cells 07–16: leave empty.')[1].replace('layout_icons_P.png', 'layout_icons_Q.png'))
job('G', 'icons', 'icons_Q', '', 'icons_Q.png', '1024x1024', 'layout_icons_Q.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', '', q_text)

# prompt files
for n, j in enumerate(jobs, 1):
    part, kind, id_, expr, file, size, refs, name, text = j
    pn = f"{n:02d}_{Path(file).stem}.txt"
    (out / 'prompts' / pn).write_text(text, encoding='utf-8')
    jobs[n - 1] = (part, kind, id_, expr, file, size, refs, pn, text)

# references: the v2.0.0 pack's, the forest pack's hub/room anchors, and two generated layouts
for p in (old / 'references').iterdir(): shutil.copy(p, out / 'references' / p.name)
for name in ['layout_hub_village.png', 'approved_hub_village_day.jpg', 'approved_hub_capital.jpg', 'scale_reference.png', 'sprite_eric_sheet.png',
             'scale_reference_interior.png', 'approved_int_village_barracks.jpg', 'approved_int_capital_tavern.jpg']:
    shutil.copy(f2 / name, out / 'references' / name)
font = ImageFont.load_default()
def layout_room(path):
    im = Image.new('RGB', (1536, 1024), '#20262a'); d = ImageDraw.Draw(im); T = 128
    for y in range(8):
        for x in range(12): d.rectangle([x*T, y*T, x*T+T-1, y*T+T-1], outline='#3c464c')
    d.rectangle([0, 0, 1535, 2*T-1], fill='#4a3b2c'); d.text((20, 20), 'BACK WALL (bar counter, shelves, notice board with blank papers, hearth)', fill='white', font=font)
    d.rectangle([0, 2*T, T-1, 1023], fill='#3a2f25'); d.rectangle([11*T, 2*T, 1535, 1023], fill='#3a2f25')
    d.text((2*T+10, 2*T+10), 'OPEN FLOOR (tables and benches at the sides, keep the middle clear)', fill='white', font=font)
    for (cx, cy, lab, col) in [(1, 4, 'CHEST a', '#c8a23c'), (10, 2, 'CHEST b', '#c8a23c')]:
        d.rectangle([cx*T+6, cy*T+6, cx*T+T-6, cy*T+T-6], outline=col, width=6); d.text((cx*T+14, cy*T+50), lab, fill=col, font=font)
    d.ellipse([5*T+14, 5*T+14, 5*T+T-14, 5*T+T-14], outline='#4aa3ff', width=6); d.text((5*T+20, 5*T+56), 'KEEPER', fill='#4aa3ff', font=font)
    d.rectangle([5*T, 7*T, 7*T-1, 1023], fill='#6b5a3a'); d.text((5*T+20, 7*T+50), 'DOOR (way out)', fill='white', font=font)
    im.save(path)
def layout_icons(path, names):
    im = Image.new('RGB', (1024, 1024), '#202020'); d = ImageDraw.Draw(im)
    for i in range(16):
        x, y = (i % 4) * 256, (i // 4) * 256; d.rectangle([x, y, x+255, y+255], outline='#666')
        d.text((x+10, y+10), f"{i+1:02d} {names[i] if i < len(names) else '(empty)'}", fill='white' if i < len(names) else '#777', font=font)
    im.save(path)
layout_room(out / 'references/layout_int_village_tavern.png')
layout_icons(out / 'references/layout_icons_Q.png', [q[0] for q in Q])

with open(out / 'jobs.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
    for n, j in enumerate(jobs, 1): w.writerow([n, j[0], j[1], j[2], j[3], j[4], j[5], j[6], f'prompts/{j[7]}'])
cells = list(csv.DictReader(open(old / 'cells.csv', encoding='utf-8')))
with open(out / 'cells.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
    for c in cells: w.writerow([c[k] for k in ['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description']])
    for i, (id_, ko, desc) in enumerate(Q, 1): w.writerow(['Q', i, id_, 'ui', id_, ko, desc])

parts = {'A': 'class map sheets, tier 1 (eight classes)', 'B': 'class map sheets, tier 2', 'C': 'class map sheets, tier 3',
         'D': 'busts of the ACT I tavern hires (Bram, Noa, Marta, Rowell) and the rescued hero Adel × three expressions', 'E': 'busts of the later hires (Sera, Orin, Celine, Ren, Silva), neutral',
         'F': 'the village tavern room and the two small villages (Reed Ferry, Stonewell)', 'G': 'the duel arena, icon sheet P (treasures) and icon sheet Q (tavern, requests, world map, duel)'}
count = {p: sum(1 for j in jobs if j[0] == p) for p in parts}
old_start = (old / '00_START_HERE.md').read_text(encoding='utf-8')
rules = old_start[old_start.index('## 1. The magenta rule'):old_start.index('## 3. Jobs')]
glob = old_start[old_start.index('## 4. Global rules'):old_start.index('## 5. Order of work')]
glob = glob.replace('- Busts: exactly 1024×1280', '- Rooms and hubs (part F): exactly 1536×1024 JPEG, opaque, no people; hubs keep the attached village footprint, rooms keep the barracks footprint and leave CHEST and KEEPER tiles as empty floor.\n- Busts: exactly 1024×1280').replace('All three expressions of one officer are the same person. Noa is an adult.', 'All expressions of one person are the same person. Noa and Celine are adults.')
start = f"""# Ashen Crown — v2.1.0 Art Work Order (pack H1, remade for taverns and the world map)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the parts in order and return the zips described in section 7.
This order **replaces** the earlier H1 order. The battlefield draws **every soldier of a class with the same figure** and shows the side by **colour**. New in this version: the legion hires sellswords in **taverns**, small villages open on the world map with **requests**, and a besieged spearknight (Adel) can be rescued and join. This pack paints the class figures, the hires' and Adel's portraits, the village tavern, the two small villages, the duel arena and two icon sheets.

| part | what | images |
|---|---|---:|
""" + ''.join(f"| **{p}** | {d} | {count[p]} |\n" for p, d in parts.items()) + f"| | **total** | **{len(jobs)}** |\n\n" + rules + "## 3. Jobs\n\n| # | part | file | what | size | attach | prompt |\n|---|---|---|---|---|---|---|\n" + ''.join(
    f"| {n} | {j[0]} | `{j[4]}` | {j[2]}{(' · ' + j[3]) if j[3] else ''} | {j[5].replace('x', '×')} | {j[6]} | `prompts/{j[7]}` |\n" for n, j in enumerate(jobs, 1)) + "\n| cell | id | icon |\n|---|---|---|\n" + ''.join(
    f"| P{int(c['cell']):02d} | `{c['id']}` | {c['name_en']} ({c['name_ko']}) |\n" for c in cells) + ''.join(f"| Q{i:02d} | `{q[0]}` | {q[1]} |\n" for i, q in enumerate(Q, 1)) + "\n" + glob + """## 5. Order of work

- **A → B → C:** class by class in the table order (keep each class consistent across its three tiers).
- **D:** person by person, neutral first. **E:** one bust each.
- **F:** `int_village_tavern.jpg` → `hub_reed.jpg` → `hub_stonewell.jpg`.
- **G:** `arena.png` → `icons_P.png` → `icons_Q.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every file at its exact size; real transparency or pure `#00FF00` (say which) — part F is opaque JPEG.
- [ ] Parts A–C: side-colour cloth is pure magenta shades only; no other magenta or pink; the 12 frames of a sheet are consistent; the attack frame matches the tier.
- [ ] Tier 3 sheets carry the ash-grey and ward-gold mark.
- [ ] Parts D–E: the expressions of each person are the same person; Noa and Celine read as adults.
- [ ] Part F: hubs keep the village footprint (buildings, doors, square, paths); the tavern keeps the barracks footprint; CHEST and KEEPER tiles are empty floor; no people.
- [ ] No text, emblems or logos; nothing imitates an existing game.

## 7. Return format — one zip per part, **each under 20 MB**

""" + ''.join(f"- `Ashen_Crown_v210_Art_Pack_H1_{p}.zip`\n" for p in parts) + """
```
Ashen_Crown_v210_Art_Pack_H1_<A–G>/
  png/                # PNG masters (part F: jpg/)
  manifest.csv        # A–E: id,kind,expression,file,sha256   (kind = sprite or bust)
  manifest_scene.csv  # F, G: id,file,width,height,sha256 (rooms, hubs, arena)
  manifest_icons.csv  # G: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # under 1 MB
  prompts_used/
```

- **Before you hand a zip over, reopen it and test it** (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.
- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
"""
(out / '00_START_HERE.md').write_text(start, encoding='utf-8')
ko_rows = ''.join(f"| **{p}** | {d} | {count[p]} |\n" for p, d in {'A': '병종 전장 그림 1단계 (8병종)', 'B': '병종 전장 그림 2단계', 'C': '병종 전장 그림 3단계',
    'D': 'ACT I 용병(브람·노아·마르타·로웰)과 구출 영웅 아델 × 표정 셋', 'E': '나중 용병(세라·오린·셀린·렌·실바) 기본 표정', 'F': '마을 주점 실내, 작은 마을 둘(갈대 나루·돌우물 마을)',
    'G': '잿빛 결투장 배경, 아이콘 시트 P(보물 여섯), 아이콘 시트 Q(주점·의뢰·세계지도·일기토)'}.items())
(out / 'README_KO.md').write_text(f"""# 사용 방법 (사용자용) — 그림팩 H1 다시 만들기 (v2.1.0, {len(jobs)}장)

v2.0.0의 H1 지시서를 **대신합니다**(그쪽은 아직 그리지 않았으므로 이것만 주시면 됩니다). 「주점과 세계지도」 설계 §9(D-118)에 맞췄습니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{ko_rows}| | **합계** | **{len(jobs)}** |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 아래를 붙여 넣으세요. `<A–G>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B|C|D|E|F|G> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v210_Art_Pack_H1_<A|B|C|D|E|F|G>.zip.
```

## 바뀐 점 (v2.0.0 H1과 비교)
- 부장 넷(브람·노아·마르타·로웰)은 **주점 용병**으로 바뀌었고 초상은 그대로 그립니다.
- 새로 그릴 것:
  - 구출 영웅 **아델**의 초상(표정 셋)
  - 나중 용병 다섯의 초상
  - **마을 주점** 실내
  - **작은 마을 둘**: 잿빛 마을과 같은 배치에 다른 마을을 그림
  - **아이콘 시트 Q**
- 병종 그림 24장, 결투장, 아이콘 시트 P는 그대로입니다.

## 진영 색(마젠타) 규칙
병종 그림에서 진영을 나타내는 천만 순수한 마젠타로 칠합니다. 게임이 그 부분을 아군 파랑·적 빨강·동맹 깃발 색으로 바꿉니다.

## 받은 뒤
ZIP을 Claude에게 주세요. SHA256을 검증하고 넣습니다.
- 병종·초상: import-art.py
- 주점·마을: import-interior-art.py, import-art.py
- 결투장: import-duel-art.py
- 아이콘: import-item-art.py --cells

받기 전까지는 게임이 기존 그림을 씁니다.
- 용병과 아델: 비슷한 장수 그림
- 주점: 병영 실내
- 작은 마을: 잿빛 마을 그림
""", encoding='utf-8')
zip_out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if zip_out:
    with zipfile.ZipFile(zip_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob('*')):
            if p.is_file(): z.write(p, 'Ashen_Crown_v210_H1_Work_Pack/' + p.relative_to(out).as_posix())
print(len(jobs), 'jobs;', {p: count[p] for p in parts})
