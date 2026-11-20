"""v2.3.1 (D-128 §4, D-131): art pack J — docs/v2.3.1/art/j-work-pack (7 images).

A: the rescued hero 군나르 (Gunnar), three busts. B: the two ACT II small villages, 서리목 마을 and 소금항, painted on the ash
village's footprint like 갈대 나루 and 돌우물 마을. C: the hungry wolves of 서리목 — one map sheet (class-sheet format, the collar
in magenta for the side colour) and one bust. Until they return: Gunnar borrows Dario's bust, the villages stand on the
돌우물/갈대 나루 paintings, the wolves are drawn by the game.
Usage: python3 scripts/make-v231-j-art-pack.py [zip-out]
"""
from pathlib import Path
import csv, shutil, sys, zipfile

root = Path(__file__).resolve().parent.parent
h1 = root / 'docs/v2.1.0/art/h1v2-work-pack'
out = root / 'docs/v2.3.1/art/j-work-pack'
if out.exists(): shutil.rmtree(out)
(out / 'prompts').mkdir(parents=True); (out / 'references').mkdir()

STYLE_BUST = ("Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art "
 "for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but "
 "slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy "
 "any existing game's character, costume, emblem or logo.")
EXPR = {'neutral': 'calm, neutral expression.', 'concerned': 'concerned expression, brows drawn, worried for someone.', 'determined': 'determined expression, jaw set, eyes forward — ready to fight.'}
GUNNAR = ("a broad man in his early forties, an axeman of a northern iron-crowned garrison who lost his unit in a blizzard and stayed to guard a snowbound "
 "woodcutters' village: weathered ruddy face, short dark-brown beard with frost-grey streaks, shaggy hair under a fur-lined iron cap, a heavy grey wool cloak with a "
 "wolf-fur collar over a dented mail shirt and a leather jerkin, a long-handled woodsman's axe resting on his shoulder; tired, steady, plain-spoken")

jobs = []
def job(part, kind, id_, expr, file, size, refs, text):
    jobs.append([part, kind, id_, expr, file, size, refs, '', text])

for e in ['neutral', 'concerned', 'determined']:
    job('A', 'bust', 'gunnar', e, f'bust_gunnar_{e}.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_dario.png',
        f"Paint a dialogue bust of Gunnar (군나르) for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and shoulders down to mid-chest, "
        f"turned slightly to the viewer's right, framed like the attached ref_bust_baldrick_neutral.png. Who: {GUNNAR}. Expression: {EXPR[e]} "
        f"All three expressions are the same man in the same clothes; only the face changes.\n{STYLE_BUST}\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_dario.png (a close soldier of the same calling — Gunnar must look clearly different from him).\n")
HUB_HEAD = (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Scene:')[0] if (h1 / 'prompts/41_hub_reed.txt').exists() else ''
if not HUB_HEAD:
    reed = next(p for p in (h1 / 'prompts').iterdir() if p.name.endswith('_hub_reed.txt'))
    HUB_HEAD = reed.read_text(encoding='utf-8').split('Scene:')[0]
    REED_TAIL = 'Keep exactly the same footprint' + reed.read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
else:
    REED_TAIL = 'Keep exactly the same footprint' + (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
job('B', 'hub', 'hub_frost', '', 'hub_frost.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_stonewell.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 서리목 마을 (Frostneck), a snowbound woodcutters' village at the foot of a grey canyon, overcast winter morning. Low log houses with steep snow-laden roofs and smoking chimneys, "
    "stacked firewood under the eaves, an axe-scarred chopping block and a sledge by the square, a wooden palisade with a gap where wolves pushed through (half mended), trampled snow paths between the doors, "
    "a frozen well with a timber cover, pine forest dark behind the roofs. Cold blue light with warm window glow. No people.\n" + REED_TAIL)
job('B', 'hub', 'hub_saltport', '', 'hub_saltport.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_reed.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 소금항 (Saltport), a small fishing and salt-pan harbour south of a great free merchant city, bright windy noon. Whitewashed stone cottages with sun-bleached blue doors and clay-tile roofs, "
    "shallow square salt pans with white heaps and wooden rakes along the edge of the map, a short stone quay with two small fishing boats and coiled ropes, gulls on the posts, "
    "nets drying on frames, a squat stone lighthouse on a low rock in the far corner (unlit by day). No people.\n" + REED_TAIL)
SHEET = (h1 / 'prompts/01_class_infantry_1.txt').read_text(encoding='utf-8')
head = SHEET.split('Character:')[0].replace('draw the same character as a small full-body battle-map figure', 'draw a creature as a small full-body battle-map figure').replace('(clean dark outline, readable silhouette, about 3.5 heads tall — slightly heroic, not chibi)', '(clean dark outline, readable silhouette)').replace('Match the scale and layout of the attached ref_sprite_ironInfantry.png exactly.', 'Match the cell layout and baseline of the attached ref_sprite_ironInfantry.png exactly; the wolf is about as long as a soldier is tall.')
job('C', 'sprite', 'wolf', '', 'sprite_wolf.png', '1024x768', 'ref_sprite_ironInfantry.png, style_aren_neutral.png, ref_wolf_ingame.png',
    head + "Character: a lean, hungry grey wolf of a snowbound northern forest — thick grey-brown winter fur, pale belly, yellow eyes, a ragged ear, hackles raised. Columns 2–3: a loping trot; column 4: a snapping lunge forward with jaws open (no blood). "
    "SIDE COLOUR (important): the wolf wears one thin rope collar painted in shades of PURE MAGENTA only (#FF00FF midtone, #B000B0 shadow, #FF80FF highlight); nothing else may be magenta or pink — fur, eyes and nose keep natural colours. The game replaces the magenta with red for a foe. "
    "Original design: a natural wolf, not a monster, no armour, no emblem. Do not imitate the sprites of any existing game.\n\nAttach: ref_sprite_ironInfantry.png, style_aren_neutral.png, ref_wolf_ingame.png (the game's stand-in drawing, for pose and colour only).\n")
job('C', 'bust', 'wolf', 'neutral', 'bust_wolf_neutral.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_wolf_ingame.png',
    "Paint a portrait of a hungry grey wolf for Ashen Crown's unit panel: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), the head and the top of the shoulders, "
    "three-quarter view turned slightly to the viewer's right, framed like the attached ref_bust_baldrick_neutral.png (head in the upper half). Thick grey-brown winter fur with frost on the tips, yellow eyes, ears forward, "
    "lips drawn back a little over the teeth (no blood). A natural wolf, not a monster.\n" + STYLE_BUST.replace('character art', 'creature art').replace('expressive mature faces ', '') + "\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_wolf_ingame.png.\n")

for n, j in enumerate(jobs, 1):
    pn = f"{n:02d}_{Path(j[4]).stem}.txt"; (out / 'prompts' / pn).write_text(j[8], encoding='utf-8'); j[7] = pn
for name in ['layout_hub_village.png', 'approved_hub_village_day.jpg', 'approved_hub_capital.jpg', 'scale_reference.png', 'sprite_eric_sheet.png', 'ref_bust_baldrick_neutral.png', 'ref_sprite_ironInfantry.png']:
    shutil.copy(h1 / 'references' / name, out / 'references' / name)
for src in (h1 / 'references').glob('style_aren_neutral.*'): shutil.copy(src, out / 'references' / src.name)
from PIL import Image
for key, name in [('hub_stonewell', 'approved_hub_stonewell.jpg'), ('hub_reed', 'approved_hub_reed.jpg')]:
    Image.open(root / f'src/assets/hubs/{key}.avif').convert('RGB').save(out / 'references' / name, quality=90)
Image.open(root / 'src/assets/portraits/bust_dario_neutral.avif').save(out / 'references/ref_bust_dario.png')
shot = root / 'docs/v2.3.1/screenshots/request-blizzard.png'   # tests/v231-e2e.mjs, 1440×900, the whole field
if shot.exists():
    im = Image.open(shot).convert('RGB'); crop = im.crop((430, 160, 1010, 460)); crop.resize((crop.width * 2, crop.height * 2), Image.NEAREST).save(out / 'references/ref_wolf_ingame.png')

with open(out / 'jobs.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
    for n, j in enumerate(jobs, 1): w.writerow([n, j[0], j[1], j[2], j[3], j[4], j[5], j[6], f'prompts/{j[7]}'])
parts = {'A': 'the rescued hero Gunnar (군나르) × three expressions', 'B': 'the ACT II small villages 서리목 (Frostneck) and 소금항 (Saltport)', 'C': 'the hungry wolf: one map sheet and one portrait'}
count = {p: sum(1 for j in jobs if j[0] == p) for p in parts}
glob = (h1 / '00_START_HERE.md').read_text(encoding='utf-8')
rules = glob[glob.index('## 1. The magenta rule'):glob.index('## 3. Jobs')]
start = ("# Ashen Crown — v2.3.1 Art Work Order (pack J: Gunnar, the ACT II villages, the wolf)\n\n"
 "You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file first, then do one part per run and return the zips described in section 6.\n\n"
 "| part | what | images |\n|---|---|---:|\n" + ''.join(f"| **{p}** | {d} | {count[p]} |\n" for p, d in parts.items()) + f"| | **total** | **{len(jobs)}** |\n\n" + rules +
 "## 3. Jobs\n\n| # | part | file | what | size | attach | prompt |\n|---|---|---|---|---|---|---|\n" + ''.join(
 f"| {n} | {j[0]} | `{j[4]}` | {j[2]}{(' · ' + j[3]) if j[3] else ''} | {j[5].replace('x', '×')} | {j[6]} | `prompts/{j[7]}` |\n" for n, j in enumerate(jobs, 1)) +
 "\n## 4. Global rules\n- Exact pixel sizes as listed. PNGs use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md. Hubs (part B) are opaque JPEG.\n"
 "- Hubs keep the attached village footprint exactly (the same buildings, door tiles, square and paths as approved_hub_village_day.jpg); no people.\n"
 "- The wolf sheet (part C) follows the class-sheet grid: 4 columns × 3 rows of 256×256, rows DOWN / RIGHT / UP, columns idle / step A / step B / attack; the paws on the same baseline 16 px above each cell's bottom; only the collar is magenta.\n"
 "- No text, letters, numbers, emblems or logos. No blood or gore. Nothing may imitate an existing game.\n\n"
 "## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)\n"
 "- [ ] Every file at its exact size and format; the alpha method stated.\n- [ ] Style: beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).\n"
 "- [ ] Part A: the three expressions are the same man; he does not look like Dario.\n- [ ] Part B: the footprint matches the village layout; snow (서리목) and salt pans with a quay (소금항) read at a glance; no people.\n"
 "- [ ] Part C: twelve consistent frames, paws on the baseline, only the collar magenta; the portrait is a natural wolf.\n\n"
 "## 6. Return format — one zip per part, each under 20 MB\n" + ''.join(f"- `Ashen_Crown_v231_Art_Pack_J_{p}.zip`\n" for p in parts) +
 "\n```\nAshen_Crown_v231_Art_Pack_J_<A–C>/\n  png/ or jpg/        # the masters, file names exactly as in section 3\n  manifest.csv        # id,kind,expression,file,width,height,sha256\n  SHA256SUMS.txt\n  QA_REPORT.md\n  contact_sheet.jpg   # under 1 MB\n  prompts_used/\n```\n\n"
 "- Before you hand a zip over, reopen it and test it (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.\n"
 "- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md.\n")
(out / '00_START_HERE.md').write_text(start, encoding='utf-8')
(out / 'README_KO.md').write_text(f"""# 사용 방법 (사용자용) — 그림팩 J (v2.3.1, {len(jobs)}장)

v2.3 설계 §4(D-128)의 그림팩 J입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 구출 영웅 군나르 초상 × 표정 셋(기본 · 걱정 · 결의) | {count['A']} |
| **B** | ACT II 작은 마을 배경: 서리목 마을(눈 덮인 나무꾼 마을), 소금항(염전과 포구) | {count['B']} |
| **C** | 굶주린 늑대: 전장 그림 1장, 초상 1장 | {count['C']} |
| | **합계** | **{len(jobs)}** |

- 설계에는 A·B 다섯 장만 있었습니다.
- C(늑대)는 「굶주린 늑대 떼」와 「눈보라 속 도끼잡이」의 늑대 때문에 더했습니다. 사람 그림을 돌려 쓸 수 없어서입니다.

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 아래를 붙여 넣으세요. `<A|B|C>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B|C> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v231_Art_Pack_J_<A|B|C>.zip.
```

## 받기 전까지 게임이 쓰는 그림
- 군나르: 다리오 초상
- 서리목: 돌우물 마을 그림
- 소금항: 갈대 나루 그림
- 늑대: 게임이 직접 그리는 회색 늑대

ZIP을 Claude에게 주시면 SHA256을 검증하고 AVIF로 바꿔 넣습니다.
""", encoding='utf-8')
zip_out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if zip_out:
    with zipfile.ZipFile(zip_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob('*')):
            if p.is_file(): z.write(p, 'Ashen_Crown_v231_J_Work_Pack/' + p.relative_to(out).as_posix())
print(len(jobs), 'jobs;', count)
