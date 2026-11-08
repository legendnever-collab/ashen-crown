#!/usr/bin/env python3
"""Build the ChatGPT work pack F3 for ACT III part 3 (v0.9.2, M19–M20; ACT3_DESIGN.md §10, D-089): everything v0.9.2 draws as
a temporary (game-drawn) placeholder, in three parts that can be ordered one at a time —
  A. things: icon sheet J (Lia's and Kai's ④ skills, the two v0.9.2 treasures) and a battle-prop sheet (the ritual circle lit
     and sealed, the archive cabinet whole and burned);
  B. the awakened looks (tier 3) of Lia and Kai — busts and map sheets;
  C. the people of M19–M20: Lia's teacher and Kai's old superior (busts and map sheets), the chancellery's rite knight and
     ritualist (map sheets).
Reuses the pack F2 generator (make-act3-f2-art-pack.py) and its templates, so the returned files import with
scripts/import-art.py, scripts/import-interior-art.py (props) and scripts/import-item-art.py --cells.
Usage: python3 scripts/make-act3-f3-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); cp, iwp, ip = f2.cp, f2.iwp, f2.ip
PACK = ROOT/'docs/v0.9.2/art/act3-f3-work-pack'
NAME = 'Ashen_Crown_v092_ACT3_Art_Pack_F3'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

# ---------- B: the awakened looks of Lia and Kai (PROPOSED) ----------
AWAKEN = [
 dict(id='lia_t3', base='lia_t2', part='B', name='Lia — Barrier Mage (리아 · 결계술사, awakened)', ref='lia_t2',
  desc=("Lia after M19, where she found her teacher and chose to use the same knowledge to protect people. The deep navy-violet arcanist robe and caped "
        "collar stay, now with pale silver-gold edging, and a short shoulder cape of layered translucent pale-gold cloth that looks like folded light; "
        "her wide-brimmed pointed hat stays (her signature), its gem ornaments replaced by one plain pale-gold band; a small leather-bound notebook of her "
        "teacher's on a cord at the belt. Around her free hand a faint square of pale-gold light hangs in the air like a small window of a ward (subtle, "
        "not a big aura). Determined, older in the eyes, warm."),
  weapon=('the arcanist staff, its head now a simple open square frame of pale silver holding a soft pale-gold light; attack pose raises the staff and a '
          'small square of light flares in front of it')),
 dict(id='kai_t3', base='kai_t2', part='B', name='Kai — Shadow Lord (카이 · 그림자 군주, awakened)', ref='kai_t2',
  desc=("Kai after M20, where he faced his old superior of the royal intelligence network and took responsibility for what he once carried. The dark "
        "leather harness and teal-lined layers become a long close-fitting coat of charcoal leather with deep teal lining and dull bronze buckles, a soft dark "
        "half-hood down on the shoulders; his burnt-orange scarf stays (his signature) but is pulled down below the chin, his face now uncovered; thin "
        "wisps of shadow trail from the coat hem and the blades (subtle). A plain grey ledger strap across the chest, empty of papers — he no longer carries anyone's orders. Calm, sharp, self-assured."),
  weapon='two short curved daggers with dark steel blades; attack pose is a quick crossing slash with a trail of shadow'),
]
# ---------- C: the people of M19–M20 (names OPEN; never named in the game) ----------
PEOPLE = [
 dict(id='liaTeacher', part='C', name="Lia's teacher (리아의 스승, a scholar of ward-sealing, M19)", exprs=['neutral', 'concerned', 'determined', 'sad'], ref='lia',
  desc=("Lia's long-lost teacher, a scholar of ward-sealing in his sixties who designed the chancellery's memory rite but refused to write its last page. "
        "Swept-back grey hair, a short grey beard, tired intelligent blue-grey eyes behind thin round spectacles, a slight stoop; a worn deep-blue scholar's "
        "coat-robe with pale-gold edging (the same family of colors as Lia's robe — she learned from him), ink stains on the fingers, a satchel of papers. "
        "Not a villain: a learned man carrying guilt, gentle and grave.")),
 dict(id='greyMaster', part='C', name="Kai's old superior (회색 장부의 우두머리, head of the royal intelligence network 'the Grey Ledger', M20)", exprs=['neutral', 'concerned', 'determined', 'sad'], ref='kai',
  desc=("The head of the royal intelligence network known as the Grey Ledger, Kai's old superior, a lean man in his fifties. Short iron-grey hair, a "
        "neat short beard, pale cold grey eyes, a thin old scar across the chin; a close-fitting charcoal leather coat with an ash-grey hooded mantle, "
        "plain pale bone-white edging, black gloves; no badges. Controlled, watchful, quietly proud of Kai despite himself.")),
]
FIGURES = [
 dict(id='liaTeacher', part='C', name="Lia's teacher — map figure (M19 witness, camp NPC)", ref='archivist', bust='bust_liaTeacher_neutral.png (your approved result)',
  desc=PEOPLE[0]['desc'], weapon='a rolled bundle of papers and a slim staff; no weapon — the attack column is a raised hand shaping a small square of light'),
 dict(id='greyMaster', part='C', name="Kai's old superior — map figure (M20 enemy commander, duels Kai)", ref='grayCloak', bust='bust_greyMaster_neutral.png (your approved result)',
  desc=PEOPLE[1]['desc'], weapon='two long daggers; attack pose is a fast double thrust'),
 dict(id='ritualKnight', part='C', name='chancellery rite knight (의식 기사, enemy, M19)', ref='ironSpear',
  desc=("a knight of the chancellery's rite order: dark plum-grey plate armor with dull gold edging, a closed helm with a narrow slit, a short deep-purple "
        "tabard (no symbol), a dark grey cape; heavy and silent"),
  weapon='a long sword and a plain dark shield; attack pose is a heavy forward cut'),
 dict(id='ritualist', part='C', name='chancellery ritualist (재상부 의식사, enemy caster, M19)', ref='harvester',
  desc=("a ritualist of the chancellery: a long deep-plum hooded robe with dull gold edging, the hood up over a pale thin face, black gloves, a belt of small "
        "sealed glass vials of faint pink light; quiet and eerie, not monstrous"),
  weapon='a slim dark staff topped with a small cage holding a faint pink-violet light; attack pose thrusts the staff forward and the light flares'),
]

def char_jobs(part):
    f2.AWAKEN = AWAKEN
    if part == 'B': return f2.char_jobs('B')
    J = []
    for c in PEOPLE:
        for e in c['exprs']:
            if e == 'neutral':
                refs = f"style_aren_neutral.png, ref_bust_{c['ref']}_neutral.png (the hero they are tied to, for the painting style only)"; prompt = cp.BUST_B.format(desc=c['desc'], expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"; prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
            J.append(dict(id=c['id'], part='C', kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in FIGURES:
        refs = f"{c['bust']}, ref_sprite_{c['ref']}.png" if c.get('bust') else f"ref_sprite_{c['ref']}.png, style_aren_neutral.png"
        J.append(dict(id=c['id'], part='C', kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=refs,
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

# ---------- A: icon sheet J and the battle-prop sheet ----------
ICON_ART = {
 'smallWard': ('skill', 'a small square ward of pale-gold light standing in the air like a glowing window frame, a few motes of light drifting inside it'),
 'shadowDance': ('skill', 'two dark silhouettes of figures swapping places along a curved trail of shadow, a faint burnt-orange glint between them'),
 'teacherQuill': ('treasure', "a long grey-white quill pen with a plain silver nib, a drop of glowing pale-gold ink at its tip (Lia's teacher's quill)"),
 'greyLedger': ('treasure', 'a slim closed ledger bound in grey leather with a plain iron clasp, a faint cold silver sheen on its cover, no writing'),
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet J for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_J.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 ' This is a once-a-battle ultimate skill: make it read as powerful, with a little more light than the other skill icons.')
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)
PROPS = [
 ('ritualCircle', 'ritual circle — lit', 'a ritual circle drawn on a dark stone floor: two concentric rings of faint pink-violet light with small plain marks around them (no letters, no symbols), a soft glow rising from it; flat on the floor, seen from the same three-quarter view, filling about 80% of the cell width'),
 ('ritualCircle_sealed', 'ritual circle — sealed', 'the SAME circle, same size and position, now dead: the rings are cold grey scratches on the stone with a few cracks across them, no light'),
 ('cabinet', 'archive cabinet — whole', 'a tall dark-wood archive shelf of the chancellery packed with tied bundles of papers and scrolls, a plain iron lock plate, standing on the floor; about 1.3 times a character\'s height'),
 ('cabinet_burned', 'archive cabinet — burned', 'the SAME shelf after a fire: charred black wood, collapsed shelves, ash and a few curled burnt pages, thin smoke, same size and position'),
]
PROP_PROMPT = f2.PROP_PROMPT.replace('layout_props_act3b.png', 'layout_props_act3c.png').replace(
    "The trees may fill the whole cell height; the statue on its plinth is about 1.2 times a character's height. "
    "They replace the temporary game-drawn props shown in the attached ref_battle_m18.jpg (trees) and ref_battle_m17.jpg (statues).",
    "The circles lie flat on the floor; the shelves stand about 1.3 times a character's height. They replace the temporary game-drawn props shown in the "
    "attached ref_battle_m19.jpg (circles) and ref_battle_m20.jpg (shelves).")
def props_layout():
    im = Image.new('RGB', (1024, 256), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (pid, title, _) in enumerate(PROPS):
        x0 = i*256; d.rectangle((x0, 0, x0+255, 255), outline=(90, 80, 60), width=2); d.line((x0+20, 240, x0+236, 240), fill=(200, 60, 60), width=2)
        iwp.label(d, (x0, 10, x0+256, 120), f'{i+1}. {pid} — {title}', f)
    return im
def thing_jobs():
    return [dict(id='props_act3c', part='A', kind='props', file='props_act3c.png', size='1024x256',
                 refs='layout_props_act3c.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m19.jpg, ref_battle_m20.jpg',
                 prompt=PROP_PROMPT+''.join(f"  {i+1}. {pid} ({title}): {desc}.\n" for i, (pid, title, desc) in enumerate(PROPS)))]

PARTS = {'A': "things — icon sheet J (Lia's and Kai's ④, two treasures), battle props (ritual circle, archive cabinet)",
         'B': 'the awakened looks of Lia and Kai', 'C': "Lia's teacher, Kai's old superior, the rite knight and the ritualist"}

def start_here(PA, IJ, CB, CC):
    L = []; w = L.append; total = len(PA)+1+len(CB)+len(CC)
    w('# Ashen Crown — ACT III Part 3 Art Work Order (pack F3, v0.9.2)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 7.')
    w(f'The game already plays with temporary game-drawn art for everything in this pack. It has **{total} images in three parts** (A–C). The user may order one part at a time: **do only the parts the user asks for**, in the order B → C → A unless told otherwise, and return each part as its own zip(s).')
    w('')
    w('| part | what | images |'); w('|---|---|---:|')
    for k, n in (('A', len(PA)+1), ('B', len(CB)), ('C', len(CC))): w(f'| **{k}** | {PARTS[k]} | {n} |')
    w(f'| | total | **{total}** |'); w('')
    def table(title, J, start):
        w(f'## {title}'); w('')
        w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
        for i, j in enumerate(J, start):
            stem = Path(j['file']).stem
            w(f"| {i} | `{j['file']}` | {j.get('who', j['id'])} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{stem}.txt` |")
        w('')
    n = 1; table(f'1. Part A — things ({len(PA)+1} images)', PA, n); n += len(PA)
    w(f"Plus job {n}: `icons_J.png` (1024×1024, attach layout_icons_J.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/{n:02d}_icons_J.txt`)."); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IJ: w(f"| J{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w(''); n += 1
    table(f'2. Part B — awakened looks of Lia and Kai ({len(CB)} images)', CB, n); n += len(CB)
    table(f'3. Part C — the people of M19–M20 ({len(CC)} images)', CC, n); n += len(CC)
    w('## 4. Global rules'); w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, books, ledgers, seals, banners, the ritual circles). The circles carry plain marks and light only.')
    w("- **New looks of existing heroes (part B): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors (Lia soft violet, Kai burnt orange); only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`).")
    w("- Lia's teacher and Kai's old superior have **no names** in the game yet; never write a name on anything.")
    w("- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.")
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.')
    w(f'- Icon sheet J: 4×4 cells of 256 px, cells {len(IJ)+1:02d}–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work'); w('')
    w('- **B:** for each of `lia_t3`, `kai_t3`: neutral bust → concerned / determined / sad → map sheet.')
    w('- **C:** `liaTeacher` busts (neutral first) → `greyMaster` busts → the four map sheets.')
    w('- **A:** `props_act3c.png` → `icons_J.png`.')
    w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] `icons_J.png` exactly 1024×1024; `props_act3c.png` exactly 1024×256 (PNG).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere.')
    w("- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Part B: the face matches the attached old bust.")
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] Prop sheet: the two circle states and the two cabinet states line up (same position and size).')
    w(f'- [ ] Icon sheet: {len(IJ)} icons in cells 01–{len(IJ):02d}, the other cells fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 7. Return format — one zip per part, **each under 20 MB**'); w('')
    for k in 'ABC': w(f'- `{NAME}_{k}.zip` — part {k}: {PARTS[k]}')
    w('')
    w('```')
    w(f'{NAME}_A/   (and _B, _C the same way)')
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

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 F3 (ACT III 3부 · v0.9.2의 가안 그림 전부, {TOTAL}장)

v0.9.2에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **세 부분(A–C)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

권장 순서: **B → C → A** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `B` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part B only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_B.zip as described in section 7 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all parts in the order B, C, A, run the self-check, and return one zip per part as described in section 7. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.

## A. 물건 (모두 PROPOSED)
- **아이콘 시트 J (4개)**: 작은 결계 · 그림자 군무(④) · 스승의 깃펜 · 회색 장부(보물)
- **전투 소품 시트**: 의식진(빛남 / 꺼짐), 문서고 서가(멀쩡함 / 불탐)

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `lia_t3` 결계술사 | 짙은 남보라 겉옷에 옅은 은금 테, 접힌 빛 같은 반투명 금빛 어깨 망토, 챙 넓은 모자는 그대로(보석 장식 대신 옅은 금 띠), 스승의 수첩, 손끝의 작은 네모 결계 빛 |
| `kai_t3` 그림자 군주 | 숯빛 가죽 긴 코트에 짙은 청록 안감, 내린 반두건, 주황 목도리는 턱 아래로 내려 얼굴을 드러냄, 옷자락의 옅은 그림자, 서류가 빈 회색 장부 끈, 쌍단검 |

## C. 사람과 맵 그림
- 반신(표정 4개씩): **리아의 스승**(60대 봉인술 학자, 둥근 안경, 리아와 같은 계열의 짙은 파랑 학자 겉옷 — 이름 없음), **회색 장부의 우두머리**(카이의 옛 상관, 50대, 철회색 머리와 턱 흉터, 숯빛 가죽 코트와 잿빛 망토 — 이름 없음)
- 맵 그림: 리아의 스승, 회색 장부의 우두머리, 의식 기사, 재상부 의식사
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    for b in ('lia_t2', 'kai_t2', 'lia', 'kai'): ref_png(ROOT/f'src/assets/portraits/bust_{b}_neutral.webp', refs/f'ref_bust_{b}_neutral.png')
    for s in ('eric', 'ironSpear', 'lia_t2', 'kai_t2', 'archivist', 'grayCloak', 'harvester'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    for n in ('approved_icons_D.png',): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    elif not (refs/'approved_icons_H.png').exists(): sys.exit(f'missing {h}')
    props_layout().save(refs/'layout_props_act3c.png', optimize=True)
    for m, shot in (('m19', 'act3c/m19-rite-1440.png'), ('m20', 'act3c/m20-night-1440.png')):
        src = ROOT/'docs/v0.9.2/screenshots'/shot
        if src.exists(): Image.open(src).convert('RGB').save(refs/f'ref_battle_{m}.jpg', quality=85)
        elif not (refs/f'ref_battle_{m}.jpg').exists(): sys.exit(f'missing {src} (run tests/act3c-e2e.mjs first)')
    IJ = icon_cells(); ip.grid_sketch(IJ, 'J').save(refs/'layout_icons_J.png', optimize=True)
    PA, CB, CC = thing_jobs(), char_jobs('B'), char_jobs('C')
    seq = PA + [dict(id='icons_J', part='A', kind='icons', file='icons_J.png', size='1024x1024',
                     refs='layout_icons_J.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IJ))] + CB + CC
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IJ, CB, CC), encoding='utf-8')
    rows = '\n'.join(f"| **{k}** | {t} | {n} |" for k, t, n in (('A', '물건 — 아이콘 시트 J, 전투 소품(의식진, 문서고 서가)', len(PA)+1),
                     ('B', '리아·카이의 각성 모습', len(CB)), ('C', '리아의 스승, 카이의 옛 상관, 의식 기사, 의식사', len(CC))))
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IJ: wr.writerow(['J', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
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
                if p.is_file(): z.write(p, 'Ashen_Crown_v092_ACT3_F3_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(PA)+1, 'B', len(CB), 'C', len(CC), 'total', len(seq))

if __name__ == '__main__':
    main()
