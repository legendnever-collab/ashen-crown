"""v2.4.1 (D-135 §4): art pack K — docs/v2.4.1/art/k-work-pack (5 images).

A: the rescued hero 마렌 (Maren), three busts. B: the two ACT III small villages, 등불골 and 이끼다리, painted on the ash village's
footprint like the other small villages. (Not to be confused with F4's "icon sheet K".) Until they return: Maren borrows
Elina's bust, 등불골 stands on the 돌우물 painting and 이끼다리 on the 갈대 나루 painting.
Usage: python3 scripts/make-v241-k-art-pack.py [zip-out]
"""
from pathlib import Path
import csv, shutil, sys, zipfile

root = Path(__file__).resolve().parent.parent
h1 = root / 'docs/v2.1.0/art/h1v2-work-pack'
out = root / 'docs/v2.4.1/art/k-work-pack'
if out.exists(): shutil.rmtree(out)
(out / 'prompts').mkdir(parents=True); (out / 'references').mkdir()

STYLE_BUST = ("Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art "
 "for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but "
 "slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy "
 "any existing game's character, costume, emblem or logo.")
EXPR = {'neutral': 'calm, neutral expression.', 'concerned': 'concerned expression, brows drawn, worried for someone.', 'determined': 'determined expression, jaw set, eyes forward — ready to fight.'}
MAREN = ("a wiry young woman in her mid-twenties, a pathfinder and hunter of an ancient unburning forest who keeps the forest paths in memory for "
 "forest-keepers who slowly forget: sun-browned face with a few freckles, sharp attentive green-brown eyes, dark auburn hair in a practical side braid with a "
 "sprig of moss and a small bone bead tied in, a hooded short cloak of mottled moss-green wool over a fitted leather jerkin, leather bracers, a coil of rope and a "
 "slim hunting knife at the shoulder strap, a short recurve bow on her back; light-footed, wary, quietly stubborn")
jobs = []
def job(part, kind, id_, expr, file, size, refs, text):
    jobs.append([part, kind, id_, expr, file, size, refs, '', text])

for e in ['neutral', 'concerned', 'determined']:
    job('A', 'bust', 'maren', e, f'bust_maren_{e}.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_elina.png, ref_bust_kai.png',
        f"Paint a dialogue bust of Maren (마렌) for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and shoulders down to mid-chest, "
        f"turned slightly to the viewer's right, framed like the attached ref_bust_baldrick_neutral.png. Who: {MAREN}. Expression: {EXPR[e]} "
        f"All three expressions are the same woman in the same clothes; only the face changes.\n{STYLE_BUST}\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_elina.png and ref_bust_kai.png "
        f"(an archer and a rogue of the same legion — Maren must look clearly different from both: different face, hair, colours and cloak).")
HUB_HEAD = (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Scene:')[0] if (h1 / 'prompts/41_hub_reed.txt').exists() else ''
if not HUB_HEAD:
    reed = next(p for p in (h1 / 'prompts').iterdir() if p.name.endswith('_hub_reed.txt'))
    HUB_HEAD = reed.read_text(encoding='utf-8').split('Scene:')[0]
    REED_TAIL = 'Keep exactly the same footprint' + reed.read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
else:
    REED_TAIL = 'Keep exactly the same footprint' + (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
job('B', 'hub', 'hub_lamp', '', 'hub_lamp.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_stonewell.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 등불골 (Lampvale), a quiet village of lantern-keepers beside an old soldiers' graveyard at the edge of a forgotten battlefield, misty dusk. Low grey stone cottages with dark slate roofs, "
    "iron lanterns on tall posts glowing warm amber along the paths and over rows of simple weathered grave markers and cairns at the edge of the map, a small chapel-like lantern house with a stack of oil jars, "
    "rusted spear tips and a broken old banner pole reused as a fence, thin ground mist between the doors. Cool blue-grey light with warm lantern glow. No people.\n" + REED_TAIL)
job('B', 'hub', 'hub_moss', '', 'hub_moss.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_reed.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 이끼다리 (Mossbridge), a small village of herbalists and hunters around an old arched stone bridge thick with moss at the eastern edge of an ancient forest, soft green morning. "
    "Timber-framed cottages with moss-covered thatch, herb gardens in raised beds, drying racks with bundles of leaves and roots, a hunter's rack with snares and a bow, the mossy bridge over a slow brook along one edge of the map, "
    "tall old trees close behind the roofs. Dappled green-gold light. No people.\n" + REED_TAIL)

for n, j in enumerate(jobs, 1):
    pn = f"{n:02d}_{Path(j[4]).stem}.txt"; (out / 'prompts' / pn).write_text(j[8], encoding='utf-8'); j[7] = pn
for name in ['layout_hub_village.png', 'approved_hub_village_day.jpg', 'approved_hub_capital.jpg', 'scale_reference.png', 'sprite_eric_sheet.png', 'ref_bust_baldrick_neutral.png']:
    shutil.copy(h1 / 'references' / name, out / 'references' / name)
for src in (h1 / 'references').glob('style_aren_neutral.*'): shutil.copy(src, out / 'references' / src.name)
from PIL import Image
for key, name in [('hub_stonewell', 'approved_hub_stonewell.jpg'), ('hub_reed', 'approved_hub_reed.jpg')]:
    Image.open(root / f'src/assets/hubs/{key}.avif').convert('RGB').save(out / 'references' / name, quality=90)
for hero in ['elina', 'kai']:
    Image.open(root / f'src/assets/portraits/bust_{hero}_neutral.avif').save(out / f'references/ref_bust_{hero}.png')

with open(out / 'jobs.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
    for n, j in enumerate(jobs, 1): w.writerow([n, j[0], j[1], j[2], j[3], j[4], j[5], j[6], f'prompts/{j[7]}'])
parts = {'A': 'the rescued hero Maren (마렌) × three expressions', 'B': 'the ACT III small villages 등불골 (Lampvale) and 이끼다리 (Mossbridge)'}
count = {p: sum(1 for j in jobs if j[0] == p) for p in parts}
glob = (h1 / '00_START_HERE.md').read_text(encoding='utf-8')
rules = glob[glob.index('## 1. The magenta rule'):glob.index('## 3. Jobs')]
start = ("# Ashen Crown — v2.4.1 Art Work Order (pack K: Maren and the ACT III villages)\n\n"
 "You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file first, then do one part per run and return the zips described in section 6.\n\n"
 "| part | what | images |\n|---|---|---:|\n" + ''.join(f"| **{p}** | {d} | {count[p]} |\n" for p, d in parts.items()) + f"| | **total** | **{len(jobs)}** |\n\n" + rules +
 "## 3. Jobs\n\n| # | part | file | what | size | attach | prompt |\n|---|---|---|---|---|---|---|\n" + ''.join(
 f"| {n} | {j[0]} | `{j[4]}` | {j[2]}{(' · ' + j[3]) if j[3] else ''} | {j[5].replace('x', '×')} | {j[6]} | `prompts/{j[7]}` |\n" for n, j in enumerate(jobs, 1)) +
 "\n## 4. Global rules\n- Exact pixel sizes as listed. PNGs use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md. Hubs (part B) are opaque JPEG.\n"
 "- Hubs keep the attached village footprint exactly (the same buildings, door tiles, square and paths as approved_hub_village_day.jpg); no people.\n"
 "- No text, letters, numbers, emblems or logos. No blood or gore. Nothing may imitate an existing game.\n\n"
 "## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)\n"
 "- [ ] Every file at its exact size and format; the alpha method stated.\n- [ ] Style: beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).\n"
 "- [ ] Part A: the three expressions are the same woman; she does not look like Elina or Kai.\n- [ ] Part B: the footprint matches the village layout; the lanterns and graves (등불골) and the mossy bridge with herb gardens (이끼다리) read at a glance; no people.\n\n"
 "## 6. Return format — one zip per part, each under 20 MB\n" + ''.join(f"- `Ashen_Crown_v241_Art_Pack_K_{p}.zip`\n" for p in parts) +
 "\n```\nAshen_Crown_v241_Art_Pack_K_<A–B>/\n  png/ or jpg/        # the masters, file names exactly as in section 3\n  manifest.csv        # id,kind,expression,file,width,height,sha256\n  SHA256SUMS.txt\n  QA_REPORT.md\n  contact_sheet.jpg   # under 1 MB\n  prompts_used/\n```\n\n"
 "- Before you hand a zip over, reopen it and test it (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.\n"
 "- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md.\n")
(out / '00_START_HERE.md').write_text(start, encoding='utf-8')
(out / 'README_KO.md').write_text(f"""# 사용 방법 (사용자용) — 그림팩 K (v2.4.1, {len(jobs)}장)

v2.4 설계 §4(D-135)의 그림팩 K입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다. F4의 「아이콘 시트 K」와는 다른 묶음입니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 구출 영웅 마렌 초상 × 표정 셋(기본 · 걱정 · 결의) | {count['A']} |
| **B** | ACT III 작은 마을 배경: 등불골(등불 걸린 묘지 마을), 이끼다리(이끼 낀 돌다리와 약초밭) | {count['B']} |
| | **합계** | **{len(jobs)}** |

- 마렌의 전장 그림은 병종 그림(도적)을 그대로 씁니다.

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 아래를 붙여 넣으세요. `<A|B>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v241_Art_Pack_K_<A|B>.zip.
```

## 받기 전까지 게임이 쓰는 그림
- 마렌: 엘리나 초상
- 등불골: 돌우물 마을 그림
- 이끼다리: 갈대 나루 그림

ZIP을 Claude에게 주시면 SHA256을 검증하고 AVIF로 바꿔 넣습니다.
""", encoding='utf-8')
zip_out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if zip_out:
    with zipfile.ZipFile(zip_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob('*')):
            if p.is_file(): z.write(p, 'Ashen_Crown_v241_K_Work_Pack/' + p.relative_to(out).as_posix())
print(len(jobs), 'jobs;', count)
