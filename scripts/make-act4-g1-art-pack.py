#!/usr/bin/env python3
"""Build the ChatGPT work pack G1 for ACT IV part 1 (v0.10.0 「연합」, M23–M24; ACT4_DESIGN.md §10, D-099/D-100): everything
v0.10.0 draws as a temporary (game-drawn) placeholder, in two parts that can be ordered one at a time —
  A. things: icon sheet L (Ines's and Thea's ④ skills, the two v0.10.0 treasures) and a battle-prop sheet (the council tent in
     the three banners' colours, and a tent taken);
  B. the awakened looks (tier 3) of Ines and Thea — busts and map sheets.
Extras are not painted anew (D-094): the raid captain wears the rite knights' sheet, the ash beasts the ash raiders', the
border refugees the refugee/pilgrim/child figures; the leaders and their guards keep their sheets; the gate winch and the gate
leaves stay game-drawn.
Reuses the pack F2 generator (make-act3-f2-art-pack.py) and its templates, so the returned files import with
scripts/import-art.py, scripts/import-interior-art.py (props) and scripts/import-item-art.py --cells.
Usage: python3 scripts/make-act4-g1-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); cp, iwp, ip = f2.cp, f2.iwp, f2.ip
PACK = ROOT/'docs/v0.10.0/art/act4-g1-work-pack'
NAME = 'Ashen_Crown_v0100_ACT4_Art_Pack_G1'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

# ---------- B: the awakened looks of Ines and Thea (PROPOSED) ----------
AWAKEN = [
 dict(id='ines_t3', base='ines_t2', part='B', name='Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened)', ref='ines_t2', mounted=False,
  desc=("Ines after M23, where she kept the council of the three banners standing through the night raid. The white-and-gold tabard with crimson borders "
        "stays, now over brighter plate pauldrons and a gorget edged in pale dawn-gold; the long crimson cloak gains a short inner lining of soft dawn-rose; "
        "the short black hair with the thin braid and the pale scar across the nose unchanged. A faint arch of warm dawn-gold light stands behind her "
        "shoulders like the outline of an open gate (subtle, not a halo). Steady, protective, warm."),
  weapon=('the long-hafted poleaxe with gold binding and the large round white shield, its broad rim now glowing faintly dawn-gold; attack pose plants the '
          'shield and a thin arch of light rises from its rim')),
 dict(id='thea_t3', base='thea_t2', part='B', name='Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened)', ref='thea_t2', mounted=True,
  desc=("Thea after M24, where she broke through the ash beasts at the last border. The blackened-iron plate with steel-blue edging becomes a captain's "
        "harness: a longer layered black-iron skirt of plates, a steel-blue sash across the chest, a dark grey wolf-fur mantle, a plain black iron helm with "
        "a short steel-blue plume (carried under one arm in the bust, worn on the map); copper-brown ponytail and the small chin scar unchanged. Fierce, "
        "sure, a leader of riders."),
  weapon='a long black lance with a steel-blue pennant (no emblem); on the map she rides a dark grey horse in heavier black iron barding with steel-blue cloth; attack pose is a straight charging thrust'),
]
def char_jobs(part):
    f2.AWAKEN = AWAKEN
    return f2.char_jobs('B') if part == 'B' else []

# ---------- A: icon sheet L and the battle-prop sheet ----------
ICON_ART = {
 'sanctumGate': ('skill', 'a tall arched gateway of soft dawn-gold light standing open over a round white shield laid on the ground, a few motes of rose-gold light drifting through the arch'),
 'ironBreak': ('skill', 'a black lance with a steel-blue pennant driving straight through a broken line of three small plain shields, a streak of speed lines behind it'),
 'allianceBanner': ('treasure', 'three short plain pennants of slate-blue, moss-green and flame-red cloth tied together on one small staff with a pale-gold cord, a soft warm glow around the knot (no emblems)'),
 'lastLantern': ('treasure', 'a small old iron lantern with a warm amber flame inside and a little grey ash on its cap, a soft warm glow around it (the lantern of the last border)'),
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet L for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_L.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 ' This is a once-a-battle ultimate skill: make it read as powerful, with a little more light than the other skill icons.')
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)
PROPS = [
 ('tent_iron', 'council tent — Iron Crown', 'a square canvas command tent with a peaked roof of slate-blue cloth and darker blue side panels, one door flap tied open showing a warm lamp-lit inside, a short plain slate-blue pennant on the centre pole (no emblem); about 1.4 times a character\'s height, filling most of the cell'),
 ('tent_free', 'council tent — Free Lords', 'the SAME tent shape, size and position in moss-green and dark green cloth with a plain moss-green pennant'),
 ('tent_flame', 'council tent — Sacred Flame', 'the SAME tent shape, size and position in flame-red and deep red cloth with a plain flame-red pennant'),
 ('tent_taken', 'council tent — taken', 'the SAME tent collapsed and torn: the roof fallen in, the pole snapped and leaning, the cloth dark and smoke-stained (no clear colour), thin grey smoke rising, same footprint'),
]
PROP_PROMPT = f2.PROP_PROMPT.replace('layout_props_act3b.png', 'layout_props_act4a.png').replace(
    "The trees may fill the whole cell height; the statue on its plinth is about 1.2 times a character's height. "
    "They replace the temporary game-drawn props shown in the attached ref_battle_m18.jpg (trees) and ref_battle_m17.jpg (statues).",
    "The tents stand about 1.4 times a character's height and share one shape; only the cloth colour changes (and the last is the same tent taken). "
    "They replace the temporary game-drawn tents shown in the attached ref_battle_m23.jpg.")
def props_layout():
    im = Image.new('RGB', (1024, 256), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (pid, title, _) in enumerate(PROPS):
        x0 = i*256; d.rectangle((x0, 0, x0+255, 255), outline=(90, 80, 60), width=2); d.line((x0+20, 240, x0+236, 240), fill=(200, 60, 60), width=2)
        iwp.label(d, (x0, 10, x0+256, 120), f'{i+1}. {pid} — {title}', f)
    return im
def thing_jobs():
    return [dict(id='props_act4a', part='A', kind='props', file='props_act4a.png', size='1024x256',
                 refs='layout_props_act4a.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m23.jpg',
                 prompt=PROP_PROMPT+''.join(f"  {i+1}. {pid} ({title}): {desc}.\n" for i, (pid, title, desc) in enumerate(PROPS)))]

PARTS = {'A': "things — icon sheet L (Ines's and Thea's ④, two treasures), battle props (the council tents)",
         'B': 'the awakened looks of Ines and Thea'}


def start_here(PA, IL, CB):
    L = []; w = L.append; total = len(PA)+1+len(CB)
    w('# Ashen Crown — ACT IV Part 1 Art Work Order (pack G1, v0.10.0)')
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
    w(f"Plus job {n}: `icons_L.png` (1024×1024, attach layout_icons_L.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/{n:02d}_icons_L.txt`)."); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IL: w(f"| L{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w(''); n += 1
    table(f'2. Part B — awakened looks of Ines and Thea ({len(CB)} images)', CB, n); n += len(CB)
    w('## 4. Global rules'); w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, pennants, tents, the lantern). Banners and tents carry plain cloth colours only.')
    w("- **New looks of existing heroes (part B): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors (Ines white-gold and crimson, Thea black iron and steel blue); only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`); Thea stays mounted.")
    w("- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.")
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.')
    w(f'- Icon sheet L: 4×4 cells of 256 px, cells {len(IL)+1:02d}–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **B:** for each of `ines_t3`, `thea_t3`: neutral bust → concerned / determined / sad → map sheet.')
    w('- **A:** `props_act4a.png` → `icons_L.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] `icons_L.png` exactly 1024×1024; `props_act4a.png` exactly 1024×256 (PNG).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere.')
    w("- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Part B: the face matches the attached old bust.")
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] Prop sheet: the four tents share one shape, size and position; only the cloth colour changes (and the fourth is taken).')
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

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 G1 (ACT IV 1부 · v0.10.0 「연합」의 가안 그림 전부, {TOTAL}장)

v0.10.0에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **두 부분(A–B)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** 엑스트라는 새로 그리지 않고 기존 그림을 씁니다(D-094: 습격대장 = 의식 기사, 재의 짐승 = 재 약탈단, 국경 피난민 = 피난민·순례자·아이). GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

권장 순서: **B → A** (눈에 많이 띄는 순서).

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
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.

## A. 물건 (모두 PROPOSED)
- **아이콘 시트 L (4개)**: 성역의 문(이네스 ④) · 철의 돌파(테아 ④) · 연합의 깃발 · 마지막 등불(보물)
- **전투 소품 시트**: 회의 천막 — 철왕관(청회색) / 연맹(이끼색) / 성화(불꽃빛) / 빼앗긴 천막

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `ines_t3` 새벽 성기사 | 흰·금 휘장 겉옷과 진홍 테는 그대로, 새벽 금빛 테의 견갑과 목가리개, 진홍 망토 안쪽의 옅은 장밋빛, 어깨 뒤의 옅은 아치 모양 빛(열린 문), 테두리가 새벽 금빛으로 빛나는 흰 원방패 |
| `thea_t3` 흑철 기병대장 | 흑철 판금에 길어진 판 치마, 가슴을 가로지르는 강청색 띠, 짙은 회색 늑대 털 망토, 짧은 강청색 깃 장식의 흑철 투구(반신은 옆구리에), 강청색 깃발 창, 더 무거운 흑철 마갑의 짙은 회색 말 |

## 기존 그림을 쓰는 것 (D-094)
- 습격대장·의식 기사: 의식 기사 맵 그림 + 봉쇄 집행관 초상 · 재의 짐승: 재 약탈단 · 국경 피난민: 피난민·순례자·아이 · 세 지도자와 호위: 기존 그림
- 관문 권양기와 관문 문짝은 게임이 그린 그림을 그대로 둡니다.
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    for b in ('ines_t2', 'thea_t2'): ref_png(ROOT/f'src/assets/portraits/bust_{b}_neutral.webp', refs/f'ref_bust_{b}_neutral.png')
    for s in ('eric', 'ironSpear', 'ines_t2', 'thea_t2', 'cavalry'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    props_layout().save(refs/'layout_props_act4a.png', optimize=True)
    for m, shot in (('m23', 'act4a/m23-camp-1440.png'),):
        src = ROOT/'docs/v0.10.0/screenshots'/shot
        if src.exists(): Image.open(src).convert('RGB').save(refs/f'ref_battle_{m}.jpg', quality=85)
        elif not (refs/f'ref_battle_{m}.jpg').exists(): sys.exit(f'missing {src} (run tests/act4a-e2e.mjs first)')
    IL = icon_cells(); ip.grid_sketch(IL, 'L').save(refs/'layout_icons_L.png', optimize=True)
    PA, CB = thing_jobs(), char_jobs('B')
    seq = PA + [dict(id='icons_L', part='A', kind='icons', file='icons_L.png', size='1024x1024',
                     refs='layout_icons_L.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IL))] + CB
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IL, CB), encoding='utf-8')
    rows = '\n'.join(f"| **{k}** | {t} | {n} |" for k, t, n in (('A', '물건 — 아이콘 시트 L, 전투 소품(회의 천막)', len(PA)+1), ('B', '이네스·테아의 각성 모습', len(CB))))
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IL: wr.writerow(['L', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
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
                if p.is_file(): z.write(p, 'Ashen_Crown_v0100_ACT4_G1_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(PA)+1, 'B', len(CB), 'total', len(seq))

if __name__ == '__main__':
    main()
