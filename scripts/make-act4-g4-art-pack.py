#!/usr/bin/env python3
"""Build the ChatGPT work pack G4 for ACT IV part 4 (v1.0.0 「왕관 없는 새벽」, M29–M30 and the endings; ACT4_DESIGN.md §10,
D-099 Q8 minimal / D-113): the last pack — what v1.0.0 draws as a temporary (game-drawn) placeholder that is worth painting.
  A. scenes: three ending illustrations (A 하나의 왕국, B 자유로운 대륙, C 새로운 서약) and the epilogue background.
  B. things: icon sheet O (the two v1.0.0 treasures).
Nothing else is painted anew (Q8 minimal, D-094): Bellard's second phase is his painted sheet with a game-drawn crown glow;
the rite points are the painted rite circle lit gold; the heart stone is the painted anchor stone; the ash beasts and the
banner squads keep their sheets. Ending art is used as the header of the epilogue (object-fit: cover, so the centre matters);
the epilogue background heads the ending card.
Reuses the pack F2 generator for the icon sheet, so the returned files import with scripts/import-ending-art.py (scenes) and
scripts/import-item-art.py --cells (icons).
Usage: python3 scripts/make-act4-g4-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); iwp, ip = f2.iwp, f2.ip
PACK = ROOT/'docs/v1.0.0/art/act4-g4-work-pack'
NAME = 'Ashen_Crown_v100_ACT4_Art_Pack_G4'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

SCENE_STYLE = ("Painting style: a finished painted illustration in the same hand as the attached approved busts and the attached painted hub "
    "(hub_capital.png): soft painterly rendering with visible but controlled brushwork, warm dawn light against cool shadows, readable "
    "silhouettes, Western medieval frontier fantasy (no anime, no photo-realism, no 3D render look). The named characters must match the "
    "attached busts exactly (faces, hair, outfits, colours) at a smaller scale; everyone else is an unnamed extra. 16:9, the important "
    "action inside the central 60% (the game crops the top and bottom for a wide banner). No text, letters, numbers, emblems, crests, "
    "holy symbols or logos anywhere.")
SCENES = [
 ('ending_a', 'Ending A — One Kingdom (하나의 왕국)', 'bust_eric_t3_neutral.png, bust_aren_neutral.png, bust_lia_neutral.png, bust_kai_neutral.png, hub_capital.png, ref_ending_epilogue.jpg',
  "The crown's heart hall at dawn, seen from the side of the throne dais. On a plain stone lectern in front of the empty throne rests a "
  "simple iron-and-gold crown on an open charter book (the crown is NOT worn by anyone). In front of it a short line of volunteer "
  "guardians of every kind — a farmer, a soldier, an old woman, a young archer — raise their right hands of their own will; Eric, the "
  "first in that line, kneels with his shield. Aren and Lia stand at the side watching, Kai leans in the shadow of a pillar, watching "
  "the crown. Warm gold light pours from high windows. The cost, shown quietly: the throne's long shadow falls across the whole hall."),
 ('ending_b', 'Ending B — A Free Continent (자유로운 대륙)', 'bust_eric_t3_neutral.png, bust_dario_neutral.png, bust_leonora_neutral.png, hub_capital.png, ref_ending_epilogue.jpg',
  "A wide valley landscape at sunrise. On low hills stand several separate villages, each with its own glowing standing stone (a ward "
  "stone the height of two people) and its own people gathered round it; faint threads of light run between the stones over the "
  "valley. In the foreground at a crossroads Leonora and Dario lean over a map spread on a field table with village elders; Eric rides "
  "a horse along the road towards the next village. The cost, shown quietly: some stones glow bright, one far stone is dim, and its "
  "village is smaller."),
 ('ending_c', 'Ending C — A New Oath (새로운 서약)', 'bust_ines_neutral.png, bust_sain_neutral.png, bust_elina_neutral.png, bust_eric_t3_neutral.png, hub_capital.png, ref_ending_epilogue.jpg',
  "The lower city square at dawn, crowded with ordinary people. Each holds a small lantern or a cupped ember and steps up, one by one, "
  "to a great circle of soft gold light on the paving stones, giving it a little of their light (a small oath of their own will). Ines "
  "stands at the circle's edge welcoming them; Sain holds the hand of a weeping old man; Elina stands among villagers from the Ashen "
  "Village; Eric waits in the line like everyone else. The cost, shown quietly: a few lanterns in the crowd are flickering low."),
 ('epilogue', 'Epilogue background (에필로그 배경)', 'hub_capital.png, ref_ending_epilogue.jpg',
  "The royal capital seen from a hill outside the walls at dawn after the war: roofs of the lower city, the palace towers with no "
  "banner of any one house, smoke from ordinary chimneys, and over the far horizon a faint golden dome of light (the new ward). No "
  "people in the foreground, an empty road leading to the gate. Calm, open, a little melancholy. Keep the lower third darker and "
  "quieter (text is laid over it)."),
]
ICON_ART = {
 'bellardQuill': ('treasure', "a long dark-grey quill pen with a silver nib stained with old ink, lying across a single folded sheet of paper that is sealed "
                  "with plain grey wax (no symbol on the seal), a faint cold-blue glow along the feather"),
 'dawnRing': ('treasure', "a simple gold ring set with one small pale stone that glows like the first light of dawn, warm orange-gold light spilling from it, "
              "resting on a little heap of grey ash"),
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet O for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_O.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}. This is a unique treasure: give it a soft magical glow so it reads as special.")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)

def start_here(seq, IL):
    L = []; w = L.append; nA = len(SCENES); nB = 1
    w('# Ashen Crown — ACT IV Part 4 Art Work Order (pack G4, v1.0.0 — the last pack)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the jobs in order and return the zips described in section 7.')
    w(f'The game already plays with temporary game-drawn art for everything in this pack. It has **{nA+nB} images in two parts** (A, B).')
    w('')
    w('| part | what | images |'); w('|---|---|---:|')
    w(f'| **A** | scenes — three ending illustrations and the epilogue background | {nA} |')
    w(f'| **B** | things — icon sheet O (two treasures) | {nB} |'); w('')
    w(f'## 1. Part A — scenes ({nA} images)'); w('')
    w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
    for i, j in enumerate(seq, 1):
        if j['part'] == 'A': w(f"| {i} | `{j['file']}` | {j['title']} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    w(''); w(f'## 2. Part B — things ({nB} image)'); w('')
    w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
    for i, j in enumerate(seq, 1):
        if j['part'] == 'B': w(f"| {i} | `{j['file']}` | icon sheet O | 1024×1024 | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    w(''); w('| cell | id | icon |'); w('|---|---|---|')
    for c in IL: w(f"| O{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w('')
    w('## 3. What the endings must say (read before painting A)'); w('')
    w('- The three endings are **equal**: none is the right answer. Each shows what it gains and, quietly, what it costs (the prompts say how). Do not make one brighter, holier or happier than the others.')
    w('- No one wears the crown in Ending A. No god, no halo, no angel in Ending C. No army marching in Ending B.')
    w('- What lies beyond the ward stays a mystery: no monsters on the horizon, only the faint golden dome of the new ward.')
    w('')
    w('## 4. Global rules'); w('')
    w(f'- Scenes: {SCENE_STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- Scenes: exactly 1600×900 PNG, opaque. Icon sheet: 4×4 cells of 256 px, cells 03–16 empty, every icon inside the 80 % safe square of its cell, transparent (or `#00FF00`).')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **A:** `ending_a.png` → `ending_b.png` → `ending_c.png` → `epilogue.png`.')
    w('- **B:** `icons_O.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every scene exactly 1600×900 PNG; the icon sheet exactly 1024×1024 PNG with real transparency or pure `#00FF00` (say which).')
    w('- [ ] No text, letters, numbers, emblems, crests, holy symbols or logos anywhere.')
    w('- [ ] Named characters match their attached busts (faces, hair, outfits, colours).')
    w('- [ ] Each ending shows its cost as the prompt says; none of the three looks like the "good" ending; no one wears the crown.')
    w('- [ ] The important action sits in the central 60 % of each scene; the epilogue background keeps its lower third quiet.')
    w(f'- [ ] Icon sheet: {len(IL)} icons in cells 01–{len(IL):02d}, the other cells fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 7. Return format — two zips, **each under 20 MB**'); w('')
    w(f'- `{NAME}_A.zip` — part A: the four scenes')
    w(f'- `{NAME}_B.zip` — part B: icon sheet O')
    w('')
    w('```')
    w(f'{NAME}_<A|B>/')
    w('  png/                # PNG masters')
    w('  manifest.csv        # A: id,kind,path,width,height,bytes,sha256')
    w('  manifest_icons.csv  # B: sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt      # sha256  path')
    w('  QA_REPORT.md        # the checklist above, generation notes, deviations')
    w('  contact_sheet.jpg   # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/       # the exact final prompt per image')
    w('```')
    w('')
    w("- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report each zip's exact size in bytes so a cut-off download can be spotted. Do not include WebP.")
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 G4 (ACT IV 4부 · v1.0.0 「왕관 없는 새벽」, {TOTAL}장 · 마지막 팩)

ACT IV 설계 Q8(최소 범위)과 §10에 따라 **엔딩 일러스트 3장 + 에필로그 배경 1장 + 아이콘 시트 1장**입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 장면 — 엔딩 A·B·C 일러스트, 에필로그 배경 (1600×900) | 4 |
| **B** | 물건 — 아이콘 시트 O (보물 둘) | 1 |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 붙여 넣으세요. `<A|B>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_<A|B>.zip as described in section 7. Reopen and test the zip before handing it over and tell me its size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 받으면 SHA256을 검증하고 가안 그림을 교체합니다(장면: import-ending-art.py, 아이콘: import-item-art.py --cells).

## 장면 (모두 PROPOSED)
| 파일 | 무엇 | 쓰이는 곳 |
|---|---|---|
| `ending_a` | A 하나의 왕국 — 아무도 쓰지 않은 왕관과 헌장, 스스로 맹세하는 수호자단, 옥좌의 긴 그림자(값) | 에필로그 머리 |
| `ending_b` | B 자유로운 대륙 — 마을마다 빛나는 결계석, 지도 위의 협의, 희미한 결계석 하나(값) | 에필로그 머리 |
| `ending_c` | C 새로운 서약 — 광장에서 저마다 작은 빛을 내놓는 사람들, 깜박이는 등불 몇 개(값) | 에필로그 머리 |
| `epilogue` | 새벽의 왕도와 지평선의 옅은 금빛 결계, 사람 없는 길 | 엔딩 카드 머리 |

세 엔딩은 같은 무게로 그립니다(어느 것도 정답처럼 보이지 않게). 결계 너머는 그리지 않습니다(OPEN).

## 아이콘 시트 O (모두 PROPOSED)
벨라드의 깃펜(M29 숨은 전과) · 새벽의 반지(M30 숨은 전과)

## 새로 그리지 않는 것 (Q8 최소 · D-094)
- 벨라드 2단계: 지금 벨라드 그림 + 게임이 그리는 금빛 왕관의 기운
- 의식 지점: 칠한 의식진을 금빛으로, 결계의 심장: 칠한 의식 고정석
- 재의 짐승, 세 깃발의 부대: 기존 그림
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    for b in ['eric_t3', 'aren', 'lia', 'kai', 'dario', 'leonora', 'ines', 'sain', 'elina']:
        Image.open(ROOT/f'src/assets/portraits/bust_{b}_neutral.webp').convert('RGBA').save(refs/f'bust_{b}_neutral.png', optimize=True)
    Image.open(ROOT/'src/assets/hubs/hub_capital.webp').convert('RGB').save(refs/'hub_capital.png', optimize=True)
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    shot = ROOT/'docs/v1.0.0/screenshots/act4d/epilogue-1440.png'
    if shot.exists(): Image.open(shot).convert('RGB').save(refs/'ref_ending_epilogue.jpg', quality=85)
    elif not (refs/'ref_ending_epilogue.jpg').exists(): sys.exit(f'missing {shot} (run tests/act4d-e2e.mjs first)')
    IL = icon_cells(); ip.grid_sketch(IL, 'O').save(refs/'layout_icons_O.png', optimize=True)
    seq = [dict(id=sid, part='A', kind='scene', title=title, file=f'{sid}.png', size='1600x900', refs=r, prompt=desc) for sid, title, r, desc in SCENES]
    seq.append(dict(id='icons_O', part='B', kind='icons', title='icon sheet O', file='icons_O.png', size='1024x1024', refs='layout_icons_O.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IL)))
    (PACK/'00_START_HERE.md').write_text(start_here(seq, IL), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IL: wr.writerow(['O', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
    for i, j in enumerate(seq, 1):
        stem = Path(j['file']).stem
        if j['kind'] == 'icons': body = f"{j['prompt']}\n\n{ip.STYLE}\nAttach: {j['refs']}.\n"
        else: body = f"Paint {j['title']} for Ashen Crown: one opaque PNG, exactly 1600x900 px.\n{j['prompt']}\n\n{SCENE_STYLE}\nAttach: {j['refs']}.\n"
        (PACK/'prompts'/f'{i:02d}_{stem}.txt').write_text(body, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v100_ACT4_G4_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(SCENES), 'B', 1, 'total', len(seq))

if __name__ == '__main__':
    main()
