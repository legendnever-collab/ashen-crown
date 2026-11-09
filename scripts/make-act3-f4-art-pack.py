#!/usr/bin/env python3
"""Build the ChatGPT work pack F4 for ACT III part 4 (v0.9.3, M21–M22; ACT3_DESIGN.md §10, D-093): everything v0.9.3 draws as
a temporary (game-drawn) placeholder, in two parts that can be ordered one at a time —
  A. things: icon sheet K (Thea's capital lance, Ines' capital mace, the two v0.9.3 treasures) and a battle-prop sheet (the
     anchor stone whole and broken);
  B. the last king — busts and map sheet;
Extras are not painted anew (D-094, the user's rule 2026-11-09): the rite knight commander and the guard captain wear the
rite knights' sheet and speak with the executor's bust; the square's heralds are people of the lower city (the refugee look).
Reuses the pack F2 generator (make-act3-f2-art-pack.py) and its templates, so the returned files import with
scripts/import-art.py, scripts/import-interior-art.py (props) and scripts/import-item-art.py --cells.
Usage: python3 scripts/make-act3-f4-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); cp, iwp, ip = f2.cp, f2.iwp, f2.ip
PACK = ROOT/'docs/v0.9.3/art/act3-f4-work-pack'
NAME = 'Ashen_Crown_v093_ACT3_Art_Pack_F4'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

# ---------- B: the last king (his name is OPEN; never named in the game) ----------
PEOPLE = [
 dict(id='king', part='B', name='the last king (마지막 국왕, M21–M22; his name is OPEN until ACT IV)', exprs=['neutral', 'concerned', 'determined', 'sad'], ref='archivist',
  desc=("The last king of the realm, a frail man in his late sixties who has held the kingdom's ward alone since the Ashen Night by giving away his own "
        "memories; he has forgotten his own name and remembers only Aren. Long thin white hair and a long white beard, hollow cheeks, pale tired grey "
        "eyes that are still kind; a heavy deep-violet royal robe with faded dull-gold edging and a dark crimson mantle, worn and dusty, no crown on his "
        "head (a thin plain gold circlet at most); faint threads of violet light rising from his shoulders as if something is being drawn out of him. "
        "Dignified, exhausted, gentle — not a villain, not a ghost.")),
]
FIGURES = [
 dict(id='king', part='B', name='the last king — map figure (M21 throne dais; cannot move)', ref='archivist', bust='bust_king_neutral.png (your approved result)',
  desc=PEOPLE[0]['desc'], weapon='a plain old royal staff of dark wood with a pale-gold head; no attack — the attack column is the staff raised as a pulse of violet light rises from him'),
]

def char_jobs(part):
    J = []
    for c in [c for c in PEOPLE if c['part'] == part]:
        for e in c['exprs']:
            if e == 'neutral':
                refs = f"style_aren_neutral.png, ref_bust_{c['ref']}_neutral.png (the hero they are tied to, for the painting style only)"; prompt = cp.BUST_B.format(desc=c['desc'], expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"; prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
            J.append(dict(id=c['id'], part=part, kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in [c for c in FIGURES if c['part'] == part]:
        refs = f"{c['bust']}, ref_sprite_{c['ref']}.png" if c.get('bust') else f"ref_sprite_{c['ref']}.png, style_aren_neutral.png"
        J.append(dict(id=c['id'], part=part, kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=refs,
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

# ---------- A: icon sheet K and the battle-prop sheet ----------
ICON_ART = {
 'royalLance': ('weapon', "a long cavalry lance of polished steel with a slim leaf-shaped head, a dull-gold royal guard ring below the head and a short pennon of plain slate-blue cloth (Thea's color), no emblem"),
 'royalMace': ('weapon', 'a flanged steel mace with a plain ivory-and-gold grip and a small round guard, clean and bright, a chaplain\'s weapon of the capital, no holy symbol'),
 'kingsSignet': ('treasure', "a heavy old gold signet ring with a plain smooth dark-violet stone (no engraving), a faint warm violet glow around it (the last king's ring)"),
 'heraldHorn': ('treasure', "a curved brass herald's horn with a plain cream cord and a worn leather grip, a soft pale-gold glow at its mouth as if a call still lingers"),
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet K for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_K.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 ' This is a tier III weapon of the capital: fine and well made, but no glow.')
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)
PROPS = [
 ('anchorStone', 'anchor stone — whole', 'a dark stone obelisk of the chancellery rite about 1.2 times a character\'s height, square in section, bound with three bands of plain dull-violet metal that glow faintly pink-violet, a soft violet haze around it, standing on the floor (no letters, no symbols)'),
 ('anchorStone_broken', 'anchor stone — broken', 'the SAME obelisk, same size and position, now broken: split down the middle with the top half fallen beside it in two chunks, the bands dark and cold, no light, a little dust'),
]
PROP_PROMPT = f2.PROP_PROMPT.replace('layout_props_act3b.png', 'layout_props_act3d.png').replace(
    "The trees may fill the whole cell height; the statue on its plinth is about 1.2 times a character's height. "
    "They replace the temporary game-drawn props shown in the attached ref_battle_m18.jpg (trees) and ref_battle_m17.jpg (statues).",
    "The stone stands about 1.2 times a character's height; use cells 1 and 2 only and leave cells 3 and 4 empty. It replaces the temporary game-drawn "
    "anchor stone shown in the attached ref_battle_m21.jpg.")
def props_layout():
    im = Image.new('RGB', (1024, 256), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (pid, title, _) in enumerate(PROPS):
        x0 = i*256; d.rectangle((x0, 0, x0+255, 255), outline=(90, 80, 60), width=2); d.line((x0+20, 240, x0+236, 240), fill=(200, 60, 60), width=2)
        iwp.label(d, (x0, 10, x0+256, 120), f'{i+1}. {pid} — {title}', f)
    return im
def thing_jobs():
    return [dict(id='props_act3d', part='A', kind='props', file='props_act3d.png', size='1024x256',
                 refs='layout_props_act3d.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m21.jpg',
                 prompt=PROP_PROMPT+''.join(f"  {i+1}. {pid} ({title}): {desc}.\n" for i, (pid, title, desc) in enumerate(PROPS)))]

PARTS = {'A': "things — icon sheet K (Thea's lance, Ines' mace, two treasures), battle props (the anchor stone)",
         'B': 'the last king'}

def start_here(PA, IJ, CB, CC):
    L = []; w = L.append; total = len(PA)+1+len(CB)+len(CC)
    w('# Ashen Crown — ACT III Part 4 Art Work Order (pack F4, v0.9.3)')
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
    w(f"Plus job {n}: `icons_K.png` (1024×1024, attach layout_icons_K.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/{n:02d}_icons_K.txt`)."); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IJ: w(f"| K{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w(''); n += 1
    table(f'2. Part B — the last king ({len(CB)} images)', CB, n); n += len(CB)
    w('## 4. Global rules'); w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, papers, rings, horns, banners, the anchor stone). The stone carries plain bands and light only.')
    w("- **The king is frail but dignified** — never a corpse, ghost or monster; the violet light drawn from him is faint.")
    w("- The king has **no name** in the game yet; never write a name on anything.")
    w("- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.")
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.')
    w(f'- Icon sheet K: 4×4 cells of 256 px, cells {len(IJ)+1:02d}–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **B:** `king`: neutral bust → concerned / determined / sad → map sheet.')
    w('- **A:** `props_act3d.png` → `icons_K.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] `icons_K.png` exactly 1024×1024; `props_act3d.png` exactly 1024×256 (PNG).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere.')
    w("- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. ")
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] Prop sheet: the two anchor-stone states line up (same position and size); cells 3–4 empty.')
    w(f'- [ ] Icon sheet: {len(IJ)} icons in cells 01–{len(IJ):02d}, the other cells fully transparent, same finish as the approved icon sheets.')
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

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 F4 (ACT III 4부 · v0.9.3의 가안 그림 전부, {TOTAL}장)

v0.9.3에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **두 부분(A–B)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** 엑스트라(의식 기사단장, 광장의 전령)는 새로 그리지 않고 기존 그림을 씁니다(D-094). GPT용 영문 지시는 `00_START_HERE.md`에 있고, 이 파일은 사용자용 안내입니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

권장 순서: **B → A** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `B` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part B only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_B.zip as described in section 7. Reopen and test the zip before you hand it over and tell me its exact size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce both parts in the order B, A, run the self-check, and return one zip per part as described in section 7. Reopen and test every zip before you hand it over and tell me each zip's exact size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.

## A. 물건 (모두 PROPOSED)
- **아이콘 시트 K (4개)**: 왕도 기병창(테아) · 왕도 사제 철퇴(이네스) · 왕의 인장 · 전령의 뿔피리(보물)
- **전투 소품 시트**: 의식 고정석(멀쩡함 / 깨짐)

## B. 마지막 국왕 — 반신 4표정 + 맵 그림
- 60대 후반의 여윈 국왕. 긴 흰 머리와 흰 수염, 낡은 짙은 보라 왕의 옷과 진홍 망토, 왕관 없이 가는 금 테 정도. 어깨에서 옅은 보랏빛 실이 빠져나가는 모습(기억을 내주는 결계). 이름은 ACT IV까지 미정.

## 엑스트라는 기존 그림 (D-094)
- 의식 기사단장·재상부 근위대장: 의식 기사 맵 그림 + 봉쇄 집행관 초상
- 광장의 전령: 하층가 사람(피난민) 맵 그림과 초상
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    for b in ('archivist',):
        src = ROOT/f'src/assets/portraits/bust_{b}_neutral.webp'
        if src.exists(): ref_png(src, refs/f'ref_bust_{b}_neutral.png')
    for s in ('eric', 'ironSpear', 'archivist'):
        src = ROOT/f'src/assets/sprites/sprite_{s}.webp'
        if src.exists(): ref_png(src, refs/f'ref_sprite_{s}.png')
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    props_layout().save(refs/'layout_props_act3d.png', optimize=True)
    for m, shot in (('m21', 'act3d/m21-heart-1440.png'),):
        src = ROOT/'docs/v0.9.3/screenshots'/shot
        if src.exists(): Image.open(src).convert('RGB').save(refs/f'ref_battle_{m}.jpg', quality=85)
        elif not (refs/f'ref_battle_{m}.jpg').exists(): sys.exit(f'missing {src} (run tests/act3d-e2e.mjs first)')
    IK = icon_cells(); ip.grid_sketch(IK, 'K').save(refs/'layout_icons_K.png', optimize=True)
    PA, CB, CC = thing_jobs(), char_jobs('B'), []
    seq = PA + [dict(id='icons_K', part='A', kind='icons', file='icons_K.png', size='1024x1024',
                     refs='layout_icons_K.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IK))] + CB + CC
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IK, CB, CC), encoding='utf-8')
    rows = '\n'.join(f"| **{k}** | {t} | {n} |" for k, t, n in (('A', '물건 — 아이콘 시트 K, 전투 소품(의식 고정석)', len(PA)+1),
                     ('B', '마지막 국왕', len(CB))))
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IK: wr.writerow(['K', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
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
                if p.is_file(): z.write(p, 'Ashen_Crown_v093_ACT3_F4_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(PA)+1, 'B', len(CB), 'total', len(seq))

if __name__ == '__main__':
    main()
