#!/usr/bin/env python3
"""Build the ChatGPT work pack G2 for ACT IV part 2 (v0.10.1 「검은 사자」, M25–M26; ACT4_DESIGN.md §10, D-099/D-102): everything
v0.10.1 draws as a temporary placeholder, in two parts that can be ordered one at a time —
  A. things: icon sheet M (Dario's ④, Baldrick's four skills, the two v0.10.1 treasures);
  B. the awakened look (tier 3) of Dario — four busts and a map sheet.
Baldrick keeps his painted bust and sheet as a hero (a major character already painted).
Extras are not painted anew (D-094): the hardliners and the camps of M25 wear their banners' painted soldiers; the riders and
bearers of M26 keep theirs.
Reuses the pack F2 generator (make-act3-f2-art-pack.py) and its templates, so the returned files import with
scripts/import-art.py, scripts/import-interior-art.py (props) and scripts/import-item-art.py --cells.
Usage: python3 scripts/make-act4-g2-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); cp, iwp, ip = f2.cp, f2.iwp, f2.ip
PACK = ROOT/'docs/v0.10.1/art/act4-g2-work-pack'
NAME = 'Ashen_Crown_v0101_ACT4_Art_Pack_G2'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

# ---------- B: the awakened look of Dario (PROPOSED) ----------
AWAKEN = [
 dict(id='dario_t3', base='dario_t2', part='B', name='Dario — Master of the Blade (다리오 · 칼의 주인, awakened)', ref='dario_t2', mounted=False,
  desc=("Dario after M25, where the three banners met for the last time and his blade answered every blow. The sellsword's coat stays, now a "
        "longer dark-wine duelist's coat with a high collar and a single silver clasp, worn open over a fitted black leather jerkin; a wide "
        "belt with two scabbards (one long, one short); fingerless gloves; the same face, stubble and tied-back hair as the approved bust. "
        "A thin trace of silver light runs along the edge of his blade. Easy, sure, a little amused."),
  weapon='a long single-edged sword in the right hand and a short parrying blade in the left; attack pose is a crossing riposte, both blades meeting'),
]
def char_jobs(part):
    f2.AWAKEN = AWAKEN
    return f2.char_jobs('B') if part == 'B' else []

# ---------- A: icon sheet M ----------
ICON_ART = {
 'hundredCounters': ('skill', 'a long sword and a short parrying blade crossed, a ring of many small silver arcs around them like blows turned aside'),
 'lionStrike': ('skill', 'a heavy black-iron lance head striking down with a lion-shaped plume of dark smoke behind it (no emblem)'),
 'lionRoar': ('skill', 'a dark lion-shaped wave of sound rolling outward in rings over a small plain shield, binding chains of light at its edge'),
 'lionBanner': ('skill', 'a black banner with a plain gold border on a lance, its cloth spread like a shelter over two small plain shields'),
 'lastCharge': ('skill', 'a black-armoured rider\'s lance thrust in a full circle, a ring of broken arrows and a dark gold glow around it'),
 'threeSeals': ('treasure', 'three small wax seals in slate-blue, moss-green and flame-red pressed side by side on one pale ribbon (no symbols on the seals)'),
 'blackMane': ('treasure', 'a braided lock of thick black horse mane bound with a plain gold ring, a faint warm glow'),
}

def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet M for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_M.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 ' This is a once-a-battle ultimate skill: make it read as powerful, with a little more light than the other skill icons.' if c['id'] in ('hundredCounters', 'lastCharge') else '')
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)
PROPS = []
def thing_jobs():
    return []

PARTS = {'A': "things — icon sheet M (Dario's ④, Baldrick's four skills, two treasures)",
         'B': 'the awakened look of Dario'}


def start_here(PA, IL, CB):
    L = []; w = L.append; total = len(PA)+1+len(CB)
    w('# Ashen Crown — ACT IV Part 2 Art Work Order (pack G2, v0.10.1)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 7.')
    w(f'The game already plays with temporary game-drawn art for everything in this pack. It has **{total} images in two parts** (A–B). The user may order one part at a time: **do only the parts the user asks for**, in the order B → A unless told otherwise, and return each part as its own zip(s).')
    w('')
    w('| part | what | images |'); w('|---|---|---:|')
    for k, n in (('A', len(PA)+1), ('B', len(CB))): w(f'| **{k}** | {PARTS[k]} | {n} |')
    w(f'| | total | **{total}** |'); w('')
    def table(title, J, start):
        w(f'## {title}'); w('')
        w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
        for i, j in enumerate(J, start):
            stem = Path(j['file']).stem
            w(f"| {i} | `{j['file']}` | {j.get('who', j['id'])} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{stem}.txt` |")
        w('')
    n = 1; table(f'1. Part A — things ({len(PA)+1} images)', PA, n); n += len(PA)
    w(f"Plus job {n}: `icons_M.png` (1024×1024, attach layout_icons_M.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/{n:02d}_icons_M.txt`)."); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IL: w(f"| L{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w(''); n += 1
    table(f'2. Part B — the awakened look of Dario ({len(CB)} images)', CB, n); n += len(CB)
    w('## 4. Global rules'); w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, blades, banners, seals). Banners carry plain cloth colours only.')
    w("- **New looks of existing heroes (part B): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors (Dario dark wine and black leather); only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`).")
    w("- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.")
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.')
    w(f'- Icon sheet M: 4×4 cells of 256 px, cells {len(IL)+1:02d}–16 empty, every icon inside the 80 % safe square of its cell.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **B:** `dario_t3`: neutral bust → concerned / determined / sad → map sheet.')
    w('- **A:** `icons_M.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] `icons_M.png` exactly 1024×1024 (PNG).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere.')
    w("- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Part B: the face matches the attached old bust.")
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w(f'- [ ] Icon sheet: {len(IL)} icons in cells 01–{len(IL):02d}, the other cells fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 7. Return format — one zip per part, **each under 20 MB**'); w('')
    for k in 'AB': w(f'- `{NAME}_{k}.zip` — part {k}: {PARTS[k]}')
    w('')
    w('```')
    w(f'{NAME}_A/   (and _B the same way)')
    w('  png/              # PNG masters')
    w('  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · props: id,kind,path,width,height,bytes,sha256')
    w('  manifest_icons.csv  # part A only: sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt    # sha256  path')
    w('  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations')
    w('  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/     # the exact final prompt per image')
    w('```')
    w('')
    w('- Busts are large: **if a zip would exceed 20 MB, split it** (`_B1`, `_B2`, …), each with its own manifest, checksums and QA report. Do not include WebP.')
    w("- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report each zip's exact size in bytes so a cut-off download can be spotted.")
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 G2 (ACT IV 2부 · v0.10.1 「검은 사자」의 가안 그림 전부, {TOTAL}장)

v0.10.1에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **두 부분(A–B)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** 엑스트라는 새로 그리지 않고 기존 그림을 씁니다(D-094). 발드릭은 이미 그려진 주요 인물이라 장수가 되어도 지금 그림을 씁니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

권장 순서: **B → A**.

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `B` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part B only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_B.zip as described in section 7 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce both parts in the order B, A, run the self-check, and return one zip per part as described in section 7. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.

## A. 아이콘 시트 M (7개, 모두 PROPOSED)
백 번의 반격(다리오 ④) · 사자의 일격 · 사자의 포효 · 사자의 깃발 · 검은 사자의 결의(발드릭 ①–④) · 세 왕가의 인장 · 검은 갈기(보물)

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `dario_t3` 칼의 주인 | 짙은 와인색 결투용 긴 외투(높은 깃, 은 걸쇠 하나), 검은 가죽 조끼, 긴 칼과 짧은 받아치기 칼 두 자루, 칼날을 따라 흐르는 옅은 은빛 |
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    for b in ('dario_t2',): ref_png(ROOT/f'src/assets/portraits/bust_{b}_neutral.webp', refs/f'ref_bust_{b}_neutral.png')
    for s in ('eric', 'dario_t2'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    IL = icon_cells(); ip.grid_sketch(IL, 'M').save(refs/'layout_icons_M.png', optimize=True)
    PA, CB = thing_jobs(), char_jobs('B')
    seq = PA + [dict(id='icons_M', part='A', kind='icons', file='icons_M.png', size='1024x1024',
                     refs='layout_icons_M.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IL))] + CB
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IL, CB), encoding='utf-8')
    rows = '\n'.join(f"| **{k}** | {t} | {n} |" for k, t, n in (('A', '물건 — 아이콘 시트 M', len(PA)+1), ('B', '다리오의 각성 모습', len(CB))))
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IL: wr.writerow(['M', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
    with open(PACK/'props.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['cell', 'id', 'title', 'description'])
        for i, (pid, title, desc) in enumerate(PROPS, 1): wr.writerow([i, pid, title, desc])
    for i, j in enumerate(seq, 1):
        stem = Path(j['file']).stem
        if j['kind'] in ('bust', 'sprite'): body = f"{j['prompt']}\n{cp.STYLE}\nAttach: {j['refs']}.\n"
        elif j['kind'] == 'icons': body = f"{j['prompt']}\n\n{ip.STYLE}\nAttach: {j['refs']}.\n"
        else: body = f"{j['prompt']}\n{iwp.STYLE}\nAttach: {j['refs']}.\nOutput: one PNG with transparency (or pure #00FF00 background), exactly {j['size']} px.\n"
        (PACK/'prompts'/f'{i:02d}_{stem}.txt').write_text(body, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v0101_ACT4_G2_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(PA)+1, 'B', len(CB), 'total', len(seq))

if __name__ == '__main__':
    main()
