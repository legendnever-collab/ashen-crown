"""v2.5.1 (D-141 §4): art pack L — docs/v2.5.1/art/l-work-pack (5 images).

A: the rescued hero 루카 (Luka), three busts. B: the two ACT IV small villages, 봉화둔덕 and 사자샘, painted on the ash village's
footprint like the other small villages. Until they return: Luka borrows Sain's bust, 봉화둔덕 stands on the border
garrison painting and 사자샘 on the 서리목 painting.
Usage: python3 scripts/make-v251-l-art-pack.py [zip-out]
"""
from pathlib import Path
import csv, shutil, sys, zipfile

root = Path(__file__).resolve().parent.parent
h1 = root / 'docs/v2.1.0/art/h1v2-work-pack'
out = root / 'docs/v2.5.1/art/l-work-pack'
if out.exists(): shutil.rmtree(out)
(out / 'prompts').mkdir(parents=True); (out / 'references').mkdir()

STYLE_BUST = ("Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art "
 "for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but "
 "slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy "
 "any existing game's character, costume, emblem or logo.")
EXPR = {'neutral': 'calm, neutral expression.', 'concerned': 'concerned expression, brows drawn, worried for someone.', 'determined': 'determined expression, jaw set, eyes forward — ready to fight.'}
LUKA = ("a gentle young man of about twenty, a novice apothecary of a border monastery who stayed outside the closed gate to tend the people left behind: "
 "a lean, slightly tired face with soft grey-brown eyes and faint ash smudges on one cheek, short untidy chestnut hair, a plain undyed linen novice robe under a "
 "patched dun-brown travelling cloak, rolled sleeves, a leather satchel of herb bundles and small stoppered bottles across his chest, a small brass hand-lantern hung at his belt, "
 "a wooden prayer bead cord at the wrist; patient, kind, quietly stubborn")
jobs = []
def job(part, kind, id_, expr, file, size, refs, text):
    jobs.append([part, kind, id_, expr, file, size, refs, '', text])

for e in ['neutral', 'concerned', 'determined']:
    job('A', 'bust', 'luka', e, f'bust_luka_{e}.png', '1024x1280', 'style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_sain.png, ref_bust_celine.png',
        f"Paint a dialogue bust of Luka (루카) for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and shoulders down to mid-chest, "
        f"turned slightly to the viewer's right, framed like the attached ref_bust_baldrick_neutral.png. Who: {LUKA}. Expression: {EXPR[e]} "
        f"All three expressions are the same young man in the same clothes; only the face changes.\n{STYLE_BUST}\nAttach: style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_sain.png and ref_bust_celine.png "
        f"(the two other healers of the legion — Luka must look clearly different from both: different face, hair, colours and clothes).")
HUB_HEAD = (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Scene:')[0] if (h1 / 'prompts/41_hub_reed.txt').exists() else ''
if not HUB_HEAD:
    reed = next(p for p in (h1 / 'prompts').iterdir() if p.name.endswith('_hub_reed.txt'))
    HUB_HEAD = reed.read_text(encoding='utf-8').split('Scene:')[0]
    REED_TAIL = 'Keep exactly the same footprint' + reed.read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
else:
    REED_TAIL = 'Keep exactly the same footprint' + (h1 / 'prompts/41_hub_reed.txt').read_text(encoding='utf-8').split('Keep exactly the same footprint', 1)[1]
job('B', 'hub', 'hub_beacon', '', 'hub_beacon.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_garrison.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 봉화둔덕 (Beacon Mound), a refugee village on a low grassy mound just inside a great border wall, under a stone beacon tower, grey morning after a long night. "
    "A tall round stone beacon tower with a brazier of smouldering fire and pale smoke at the edge of the map, rows of patched canvas tents and lean-to shelters between a few old stone cottages, "
    "cook fires with iron pots, bundles of firewood and blankets on carts, a fenced pen with a few goats, a strip of the grey border wall along one edge, a thin dusting of pale ash on the roofs. "
    "Cool grey light with warm firelight. No people.\n" + REED_TAIL)
job('B', 'hub', 'hub_lionspring', '', 'hub_lionspring.jpg', '1536x1024', 'layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_frost.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png',
    HUB_HEAD + "Scene: 사자샘 (Lionspring), a small mountain village around a stone spring basin at the foot of a high rocky pass, clear afternoon. "
    "A round stone well-house over a spring pool with a carved stone trough, long timber stables and hay barns, hitching rails and water buckets, saddles and harness on racks, "
    "stone cottages with steep timber roofs, the rocky slopes of the pass rising behind the roofs at the edge of the map, a few pines. Warm clear light. No people.\n" + REED_TAIL)

for n, j in enumerate(jobs, 1):
    pn = f"{n:02d}_{Path(j[4]).stem}.txt"; (out / 'prompts' / pn).write_text(j[8], encoding='utf-8'); j[7] = pn
for name in ['layout_hub_village.png', 'approved_hub_village_day.jpg', 'approved_hub_capital.jpg', 'scale_reference.png', 'sprite_eric_sheet.png', 'ref_bust_baldrick_neutral.png']:
    shutil.copy(h1 / 'references' / name, out / 'references' / name)
for src in (h1 / 'references').glob('style_aren_neutral.*'): shutil.copy(src, out / 'references' / src.name)
from PIL import Image
for key, name in [('hub_garrison', 'approved_hub_garrison.jpg'), ('hub_frost', 'approved_hub_frost.jpg')]:
    Image.open(root / f'src/assets/hubs/{key}.avif').convert('RGB').save(out / 'references' / name, quality=90)
for hero in ['sain', 'celine']:
    Image.open(root / f'src/assets/portraits/bust_{hero}_neutral.avif').save(out / f'references/ref_bust_{hero}.png')

with open(out / 'jobs.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
    for n, j in enumerate(jobs, 1): w.writerow([n, j[0], j[1], j[2], j[3], j[4], j[5], j[6], f'prompts/{j[7]}'])
parts = {'A': 'the rescued hero Luka (루카) × three expressions', 'B': 'the ACT IV small villages 봉화둔덕 (Beacon Mound) and 사자샘 (Lionspring)'}
count = {p: sum(1 for j in jobs if j[0] == p) for p in parts}
glob = (h1 / '00_START_HERE.md').read_text(encoding='utf-8')
rules = glob[glob.index('## 1. The magenta rule'):glob.index('## 3. Jobs')]
start = ("# Ashen Crown — v2.5.1 Art Work Order (pack L: Luka and the ACT IV villages)\n\n"
 "You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file first, then do one part per run and return the zips described in section 6.\n\n"
 "| part | what | images |\n|---|---|---:|\n" + ''.join(f"| **{p}** | {d} | {count[p]} |\n" for p, d in parts.items()) + f"| | **total** | **{len(jobs)}** |\n\n" + rules +
 "## 3. Jobs\n\n| # | part | file | what | size | attach | prompt |\n|---|---|---|---|---|---|---|\n" + ''.join(
 f"| {n} | {j[0]} | `{j[4]}` | {j[2]}{(' · ' + j[3]) if j[3] else ''} | {j[5].replace('x', '×')} | {j[6]} | `prompts/{j[7]}` |\n" for n, j in enumerate(jobs, 1)) +
 "\n## 4. Global rules\n- Exact pixel sizes as listed. PNGs use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md. Hubs (part B) are opaque JPEG.\n"
 "- Hubs keep the attached village footprint exactly (the same buildings, door tiles, square and paths as approved_hub_village_day.jpg); no people.\n"
 "- No text, letters, numbers, emblems or logos. No blood or gore. Nothing may imitate an existing game.\n\n"
 "## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)\n"
 "- [ ] Every file at its exact size and format; the alpha method stated.\n- [ ] Style: beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).\n"
 "- [ ] Part A: the three expressions are the same young man; he does not look like Sain or Celine.\n- [ ] Part B: the footprint matches the village layout; the beacon tower and tents (봉화둔덕) and the spring well-house with stables (사자샘) read at a glance; no people.\n\n"
 "## 6. Return format — one zip per part, each under 20 MB\n" + ''.join(f"- `Ashen_Crown_v251_Art_Pack_L_{p}.zip`\n" for p in parts) +
 "\n```\nAshen_Crown_v251_Art_Pack_L_<A–B>/\n  png/ or jpg/        # the masters, file names exactly as in section 3\n  manifest.csv        # id,kind,expression,file,width,height,sha256\n  SHA256SUMS.txt\n  QA_REPORT.md\n  contact_sheet.jpg   # under 1 MB\n  prompts_used/\n```\n\n"
 "- Before you hand a zip over, reopen it and test it (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.\n"
 "- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md.\n")
(out / '00_START_HERE.md').write_text(start, encoding='utf-8')
(out / 'README_KO.md').write_text(f"""# 사용 방법 (사용자용) — 그림팩 L (v2.5.1, {len(jobs)}장)

v2.5 설계 §4(D-141)의 그림팩 L입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 구출 영웅 루카 초상 × 표정 셋(기본 · 걱정 · 결의) | {count['A']} |
| **B** | ACT IV 작은 마을 배경: 봉화둔덕(봉화대 아래 천막과 돌집), 사자샘(고개 아래 샘터와 마구간) | {count['B']} |
| | **합계** | **{len(jobs)}** |

- 루카의 전장 그림은 병종 그림(치유사)을 그대로 씁니다.

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 아래를 붙여 넣으세요. `<A|B>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v251_Art_Pack_L_<A|B>.zip as described in section 6.
```

## 받기 전까지 게임이 쓰는 그림
- 루카: 세인 초상
- 봉화둔덕: 국경 수비대 진영 그림
- 사자샘: 서리목 마을 그림

ZIP을 Claude에게 주시면 SHA256을 검증하고 AVIF로 바꿔 넣습니다.
""", encoding='utf-8')
zip_out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if zip_out:
    with zipfile.ZipFile(zip_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob('*')):
            if p.is_file(): z.write(p, 'Ashen_Crown_v251_L_Work_Pack/' + p.relative_to(out).as_posix())
print(len(jobs), 'jobs;', count)
