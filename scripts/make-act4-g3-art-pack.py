#!/usr/bin/env python3
"""Build the ChatGPT work pack G3 for ACT IV part 3 (v0.10.2 「잿빛 밤」, M27–M28; ACT4_DESIGN.md §10, D-099 Q8 minimal/D-110):
everything v0.10.2 draws as a temporary (game-drawn) placeholder that is worth painting — one part only:
  A. things: a battle-prop sheet (the siege ram, a scaling ladder, a memory fragment glowing and read) and icon sheet N (Aren's
     last order 「끝까지 함께」 and the two v0.10.2 treasures).
Nothing else is painted anew (Q8 minimal, D-094): young Aren in the memory is the present Aren's art recoloured by the game
(sepia), the remnants of the Ashen Night are the rite knights' and royal guards' sheets drawn grey, the gate leaves and the
wall archers keep their art, the palace of memory is the existing stone/wall tiles.
Reuses the pack F2 generator (make-act3-f2-art-pack.py) and its templates, so the returned files import with
scripts/import-interior-art.py (props: PROPS['props_act4c']) and scripts/import-item-art.py --cells.
Usage: python3 scripts/make-act4-g3-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); cp, iwp, ip = f2.cp, f2.iwp, f2.ip
PACK = ROOT/'docs/v0.10.2/art/act4-g3-work-pack'
NAME = 'Ashen_Crown_v0102_ACT4_Art_Pack_G3'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

# ---------- icon sheet N ----------
# lastOrder is a command, not a catalog item: its cell is given here (the menu button shows it once imported).
EXTRA = {'lastOrder': dict(id='lastOrder', en="Aren's Last Order: To the End, Together", ko='아렌의 군령 · 끝까지 함께')}
ICON_ART = {
 'lastOrder': ('skill', "a commander's plain dark-blue cloak held out in one gauntleted hand over a fallen round shield lying on the ground, a thin column of "
               'warm dawn-gold light rising from the shield as if lifting it again (no emblem, no figure\'s face)'),
 'ramHead': ('treasure', 'the iron head of a siege ram — a heavy blunt cast-iron cap shaped like a plain ram\'s brow with curled horns, dented and scarred '
             'from blows, two thick iron bands and a broken stub of dark oak behind it, a faint dull-red glow in the dents'),
 'nightLocket': ('treasure', 'a small oval silver locket on a thin dark chain, its lid half open showing a pinch of grey ash and a single tiny pale-gold '
                 'ember inside, a soft cold-silver glow (no picture or symbol inside)'),
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}; cat.update(EXTRA)
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet N for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_N.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 " This is the commander's once-a-battle order: make it read as solemn and powerful, with a little more light than the other skill icons.")
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)

# ---------- the battle-prop sheet ----------
PROPS = [
 ('ram', 'siege ram', "a covered siege ram seen from the classic three-quarter view, its nose pointing UP the map (toward the top of the cell): a long "
  "dark-oak trunk with an iron head hung on chains under a low pitched roof of wet hides and planks, four solid wooden wheels, no crew; about as long as "
  "1.3 characters' heights, filling most of the cell"),
 ('ladder', 'scaling ladder', 'a tall rough siege ladder of two lashed timber poles and eight rungs leaning straight up against the wall (seen from the '
  'front, upright, its top hooked over a stone parapet edge that is NOT drawn), rope lashings at each rung; it fills the whole cell height'),
 ('memory', 'memory fragment', 'a tall floating shard of pale violet-white crystal, like a splinter of frozen moonlight, hovering a little above a small '
  'round plinth of cracked grey stone, faint grey ash motes and a soft cold glow around it; about 0.9 times a character\'s height'),
 ('memory_read', 'memory fragment — read', 'the SAME plinth and shard, now dark and dull slate-grey with a thin crack through it, no glow, a few ash flakes '
  'settled on the plinth; same size and position'),
]
PROP_PROMPT = f2.PROP_PROMPT.replace('layout_props_act3b.png', 'layout_props_act4c.png').replace(
    "The trees may fill the whole cell height; the statue on its plinth is about 1.2 times a character's height. "
    "They replace the temporary game-drawn props shown in the attached ref_battle_m18.jpg (trees) and ref_battle_m17.jpg (statues).",
    "The ladder may fill the whole cell height; the ram is long and low; the two fragments share one shape (the second is the first after it is read). "
    "They replace the temporary game-drawn ram and ladders in the attached ref_battle_m27.jpg and the fragments in ref_battle_m28.jpg.")
def props_layout():
    im = Image.new('RGB', (1024, 256), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (pid, title, _) in enumerate(PROPS):
        x0 = i*256; d.rectangle((x0, 0, x0+255, 255), outline=(90, 80, 60), width=2); d.line((x0+20, 240, x0+236, 240), fill=(200, 60, 60), width=2)
        iwp.label(d, (x0, 10, x0+256, 120), f'{i+1}. {pid} — {title}', f)
    return im
def thing_jobs():
    return [dict(id='props_act4c', part='A', kind='props', file='props_act4c.png', size='1024x256',
                 refs='layout_props_act4c.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m27.jpg, ref_battle_m28.jpg',
                 prompt=PROP_PROMPT+''.join(f"  {i+1}. {pid} ({title}): {desc}.\n" for i, (pid, title, desc) in enumerate(PROPS)))]

PARTS = {'A': "things — battle props (the siege ram, a scaling ladder, a memory fragment glowing and read), icon sheet N (Aren's last order, two treasures)"}


def start_here(PA, IL):
    L = []; w = L.append; total = len(PA)+1
    w('# Ashen Crown — ACT IV Part 3 Art Work Order (pack G3, v0.10.2)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the jobs in order and return the zip described in section 7.')
    w(f'The game already plays with temporary game-drawn art for everything in this pack. It has **{total} images in one part** (A).')
    w('')
    w('| part | what | images |'); w('|---|---|---:|')
    w(f'| **A** | {PARTS["A"]} | {total} |'); w('')
    w(f'## 1. Part A — things ({total} images)'); w('')
    w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
    for i, j in enumerate(PA, 1):
        w(f"| {i} | `{j['file']}` | {j['id']} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    n = len(PA)+1
    w(f"| {n} | `icons_N.png` | icon sheet N | 1024×1024 | layout_icons_N.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png | `prompts/{n:02d}_icons_N.txt` |"); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IL: w(f"| N{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w('')
    w('| prop cell | id | prop |'); w('|---|---|---|')
    for i, (pid, title, _) in enumerate(PROPS, 1): w(f'| {i} | `{pid}` | {title} |')
    w('')
    w('## 4. Global rules'); w('')
    w(f'- Icons: {ip.STYLE}')
    w(f'- Props: {iwp.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (the ram, the ladder, the locket, the cloak).')
    w('- Prop sheet: exactly 1024×256, 4 cells of 256 px in one row, each prop centered with its base on the red baseline 16 px above the cell bottom, the same scale as the attached map figures (a character is about 150 px tall in a cell), transparent (or `#00FF00`).')
    w(f'- Icon sheet N: 4×4 cells of 256 px, cells {len(IL)+1:02d}–16 empty, every icon inside the 80 % safe square of its cell.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **A:** `props_act4c.png` → `icons_N.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in the zip's QA_REPORT.md)"); w('')
    w('- [ ] `props_act4c.png` exactly 1024×256 and `icons_N.png` exactly 1024×1024 (PNG); real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere.')
    w('- [ ] Props: the ram points up the map; the ladder is upright and fills the cell height; `memory` and `memory_read` are the same shard and plinth at the same size and place (only glow and colour differ); every base on the baseline, nothing cut at cell edges.')
    w(f'- [ ] Icon sheet: {len(IL)} icons in cells 01–{len(IL):02d}, the other cells fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 7. Return format — one zip, **under 20 MB**'); w('')
    w(f'- `{NAME}_A.zip` — part A: {PARTS["A"]}')
    w('')
    w('```')
    w(f'{NAME}_A/')
    w('  png/                # PNG masters (props_act4c.png, icons_N.png)')
    w('  manifest.csv        # props: id,kind,path,width,height,bytes,sha256')
    w('  manifest_icons.csv  # sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt      # sha256  path')
    w('  QA_REPORT.md        # the checklist above, generation notes, deviations')
    w('  contact_sheet.jpg   # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/       # the exact final prompt per image')
    w('```')
    w('')
    w("- **Before you hand the zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report the zip's exact size in bytes so a cut-off download can be spotted. Do not include WebP.")
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 G3 (ACT IV 3부 · v0.10.2 「잿빛 밤」, {TOTAL}장)

ACT IV 설계 Q8(최소 범위)에 따라 v0.10.2에서 **새로 그릴 가치가 있는 가안 그림만** 모았습니다. 한 부분(A) 2장뿐입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

## 시키는 법
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part A: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_A.zip as described in section 7. Reopen and test the zip before handing it over and tell me its size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다(소품: import-interior-art.py `props_act4c`, 아이콘: import-item-art.py --cells).

## 전투 소품 시트 `props_act4c` (4칸, 모두 PROPOSED)
| 칸 | id | 무엇 |
|---|---|---|
| 1 | `ram` | M27 공성추 — 지붕 덮인 파쇄추, 앞이 맵 위쪽(성문)을 향함 |
| 2 | `ladder` | M27 성벽 사다리 — 세 구간에 걸리는 공성 사다리 |
| 3 | `memory` | M28 기억 조각 — 돌 받침 위에 뜬 옅은 보랏빛 수정 |
| 4 | `memory_read` | 같은 조각을 읽은 뒤 — 빛이 꺼지고 금이 간 회색 |

## 아이콘 시트 N (3개, 모두 PROPOSED)
아렌의 군령 · 끝까지 함께 · 성문 파쇄추의 쇠머리(M27 숨은 전과) · 잿빛 밤의 목걸이(M28 숨은 전과)

## 새로 그리지 않는 것 (Q8 최소 · D-094)
- **젊은 아렌(기억 속)**: 지금 아렌 그림을 게임이 세피아로 색만 바꿉니다.
- **잿빛 밤의 잔영**: 의식 기사·왕실 근위 그림을 회색으로 그립니다.
- 성문 문짝, 성벽 궁수, 기억의 궁 바닥·벽: 기존 그림과 타일을 그대로 씁니다.
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    for s in ('eric', 'ironSpear'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    props_layout().save(refs/'layout_props_act4c.png', optimize=True)
    for m, shot in (('m27', 'act4c/m27-field-1440.png'), ('m28', 'act4c/m28-memory-1440.png')):
        src = ROOT/'docs/v0.10.2/screenshots'/shot
        if src.exists(): Image.open(src).convert('RGB').save(refs/f'ref_battle_{m}.jpg', quality=85)
        elif not (refs/f'ref_battle_{m}.jpg').exists(): sys.exit(f'missing {src} (run tests/act4c-e2e.mjs first)')
    IL = icon_cells(); ip.grid_sketch(IL, 'N').save(refs/'layout_icons_N.png', optimize=True)
    PA = thing_jobs()
    seq = PA + [dict(id='icons_N', part='A', kind='icons', file='icons_N.png', size='1024x1024',
                     refs='layout_icons_N.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IL))]
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IL), encoding='utf-8')
    rows = f"| **A** | 물건 — 전투 소품(공성추·사다리·기억 조각), 아이콘 시트 N | {len(seq)} |"
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], '', j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IL: wr.writerow(['N', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
    with open(PACK/'props.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['cell', 'id', 'title', 'description'])
        for i, (pid, title, desc) in enumerate(PROPS, 1): wr.writerow([i, pid, title, desc])
    for i, j in enumerate(seq, 1):
        stem = Path(j['file']).stem
        if j['kind'] == 'icons': body = f"{j['prompt']}\n\n{ip.STYLE}\nAttach: {j['refs']}.\n"
        else: body = f"{j['prompt']}\n{iwp.STYLE}\nAttach: {j['refs']}.\nOutput: one PNG with transparency (or pure #00FF00 background), exactly {j['size']} px.\n"
        (PACK/'prompts'/f'{i:02d}_{stem}.txt').write_text(body, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v0102_ACT4_G3_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(seq), 'total', len(seq))

if __name__ == '__main__':
    main()
