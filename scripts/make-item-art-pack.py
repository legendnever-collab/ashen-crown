#!/usr/bin/env python3
"""Build ChatGPT work pack E for v0.8 (D-073): painted icons for every tool, piece of gear, treasure, skill, status and
battle command in src/data/catalog-v08.js, drawn as seven 4x4 icon sheets (1024x1024, 256 px cells) in the style of the
approved busts, hubs and chests. Returned sheets are cut by scripts/import-item-art.py (v0.8.1).
Usage: python3 scripts/make-item-art-pack.py [--zip <out.zip>]
"""
import csv, json, subprocess, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT/'docs/v0.8.0/art/item-work-pack'
NAME = 'Ashen_Crown_v080_Item_Art_Pack'
OLD = ROOT/'docs/v0.5.0/art/world-work-pack/references'
CELL, GRID = 256, 4

def catalog():
    js = "import('./src/data/catalog-v08.js').then(m=>console.log(JSON.stringify(m.CATALOG)))"
    return json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT, text=True))

HERO_COLOR = {'eric': 'steel blue', 'elina': 'moss green', 'lia': 'soft violet', 'sain': 'pale gold', 'kai': 'burnt orange',
              'thea': 'slate blue', 'dario': 'deep crimson', 'ines': 'ivory and gold'}

# What to paint in each cell. Plain objects, no text/letters/numbers/emblems anywhere.
ART = {
 # tools
 'herb': 'a small bundle of fresh green healing leaves tied with twine, a few leaves loose',
 'medium': 'a stoppered round glass flask of glowing red liquid with a cork and a little twine around the neck',
 'ether': 'a stoppered slim glass vial of luminous blue liquid with a cork',
 'elixir': 'an ornate small crystal bottle with gold filigree holding radiant golden-white liquid, a faint glow around it (rare)',
 'antidote': 'a sprig of pale green herb with small white flowers beside a tiny clay pot of green salve',
 'clarity': 'a small brass incense burner releasing a thin calm lavender smoke curl',
 'ward': 'a stoppered square glass bottle of green tonic with a small leather tag (blank)',
 'drum': 'a small war drum of wood and stretched hide with crossed drumsticks resting on it',
 'bomb': 'a round black iron powder bomb with a short lit fuse sparking, rope binding around it',
 'smoke': 'a clay smoke bomb ball wrapped in cloth with grey smoke seeping from a crack',
 'bewilder': 'a small open leather pouch spilling shimmering violet powder in a swirl',
 'net': 'a folded weighted rope net with small iron weights at its edges',
 'caltrops': 'a handful of four-pointed iron caltrops scattered on the ground',
 'gold': 'a small stack of worn gold coins with one coin standing on its edge (coins plain, no markings)',
 'supplyCrate': 'a small wooden supply crate with rope handles and a sack on top',
 # gear tier I
 'ironBlade': 'a plain tempered steel arming sword with a leather-wrapped grip, shown diagonally',
 'huntingBow': 'a simple wooden hunting bow with a leather grip and a taut string, shown diagonally',
 'longbow': 'a tall dark yew longbow with a waxed string and a green grip wrap, shown diagonally',
 'crystalStaff': 'a wooden staff topped with a clear pale-blue crystal held by brass prongs',
 'mercyStaff': 'a pale ash-wood staff with a small brass sun-disc head and a white ribbon',
 'daggers': 'two balanced daggers crossed, steel blades, worn leather grips',
 'heavyShield': 'a heavy teal-blue wooden kite shield with an iron rim and a plain gold cross-band (no emblem)',
 'lightShield': 'a small round light buckler of pale steel with a leather rim',
 'travelCloak': 'a folded green wool travel cloak with a simple brass clasp',
 'trailBoots': 'a pair of sturdy brown leather marching boots',
 'focusCharm': 'a small violet gem pendant on a brass chain',
 # gear tier II — Iron Crown (heavy steel, dark blue-grey and iron)
 'steelGreatsword': 'a broad two-handed steel greatsword with a squared crossguard, dark blue-grey wrapped hilt',
 'knightLance': 'a long cavalry lance with a steel tip and a dark blue pennant (plain), shown diagonally',
 'ironwoodBow': 'a recurved bow of dark ironwood reinforced with iron fittings at the tips',
 'plateCuirass': 'a polished steel plate breastplate with riveted edges and leather straps',
 'towerShield': 'a tall rectangular steel tower shield with a dark blue-grey face and iron studs (no emblem)',
 'lancerMail': 'a chainmail shirt with a dark blue-grey cloth tabard folded over it',
 'steelGauntlets': 'a pair of articulated steel gauntlets',
 'runeforgedBlade': 'a fine longsword whose steel shows a faint wavy forge pattern and a soft cold-blue glow along the edge (no runes or letters drawn)',
 # gear tier II — Velmar (merchant city, crimson and brass, imported goods)
 'twinSabers': 'two curved sabers with brass guards crossed, crimson grip wraps',
 'repeatingCrossbow': 'a compact wooden repeating crossbow with a brass bolt magazine on top',
 'emberRod': 'a short dark wooden rod tipped with a glowing ember-orange stone in brass claws',
 'shadowStiletto': 'a slim black-bladed stiletto with a dark leather grip',
 'merchantCoat': 'a folded long coat of crimson and dark brown cloth with brass buttons',
 'luckyCoin': 'a single large old brass coin on a leather cord, plain worn face (no markings)',
 'windCharm': 'a small charm of white feathers and a pale blue bead on a thin cord',
 'duelistRapier': 'an elegant rapier with a swept brass cup hilt and a long slender blade',
 # gear tier II — pilgrim village (ivory, gold trim, crimson)
 'flameStaff': 'a white wooden staff topped with a small brass cage holding a gentle flame',
 'pilgrimMace': 'a flanged iron mace with a white-wrapped handle and a crimson tassel',
 'pilgrimMantle': 'a folded ivory wool mantle with a crimson border',
 'sanctumTome': 'a thick leather-bound book with brass corners and a crimson ribbon, closed (blank cover)',
 'wardenShield': 'a large round white shield with a plain gold rim (no emblem)',
 'chrismCharm': 'a tiny glass vial of golden oil hung as a pendant on a crimson cord',
 'votiveBand': 'a woven bracelet of crimson and gold threads with small ivory beads',
 'cathedralStaff': 'a tall ornate staff of white wood and gold with a brass lantern head holding a bright flame',
 # gear tier III — faction elite (finest make, a subtle sheen)
 'crownGuardLance': 'an ornate guard lance with a steel leaf-shaped head and a dark blue and silver pennant (plain)',
 'crownGuardShield': 'a great kite shield of polished steel with dark blue enamel and silver rim (no emblem)',
 'leagueSaber': 'a fine curved saber with a crimson and gold basket hilt',
 'leagueLongbow': 'a tall elegant longbow of pale wood with crimson and gold string wraps',
 'paladinMace': 'a heavy ornate war mace of white steel with gold flanges',
 'flameVestment': 'a folded white and gold vestment with a crimson stole on top',
 # treasures (unique; each with a soft magical glow so they read as special)
 'herbPouch': 'a small embroidered green cloth pouch overflowing with healing leaves, soft green glow',
 'hawkFeather': 'a single long brown-and-white hawk feather with a faint golden shimmer',
 'sageNotebook': 'a small worn leather notebook with a ribbon and a quill tucked in, faint warm glow (blank cover)',
 'windHorseshoe': 'a silver horseshoe with swirling pale wind wisps around it',
 'twinDaggers': 'a matched pair of ornate daggers, one silver one gold, crossed, soft glow',
 'silenceShield': 'a dark round shield of black steel with a smooth silver center, faint cold aura (no emblem)',
 'mirrorCuirass': 'a breastplate polished like a mirror reflecting light, soft white glint',
 'clearCharm': 'a clear crystal teardrop pendant glowing pale blue-white',
 'flameReliquary': 'a small golden reliquary box with a tiny living flame visible through a window, warm glow (no symbols)',
 'manaRing': 'a silver ring set with a glowing blue stone',
 'lionEpaulette': 'a heavy gold-and-black shoulder epaulette shaped like a lion\'s mane (no face, no emblem)',
 'allianceSeal': 'a heavy round wax-seal stamp of brass with three colored cords tied around its handle (dark blue, crimson, ivory); the stamp face is plain',
}
SKILL_ART = {
 'guard': 'a raised shield taking a blow, a small spark at the impact', 'provoke': 'a knight\'s gauntlet pointing forward with a red-orange shout wave around it',
 'bulwark': 'a wall of interlocked shields with a pale blue barrier glow', 'aimedShot': 'an arrow flying straight with a faint target ring of light ahead of it',
 'pinningShot': 'an arrow pinning a cloth to the ground with a short binding rope around it', 'overwatch': 'a watchful eye shape formed by a drawn bow and arrow at rest, dusk sky',
 'fireBolt': 'a single bolt of fire streaking diagonally', 'flameBurst': 'a cross-shaped burst of flame spreading in four directions from the center',
 'arcane': 'glowing violet runic circles on the ground (abstract light patterns, no letters)', 'heal': 'warm golden light flowing from an open hand',
 'purify': 'a clear water-like light washing away dark wisps from a small figure silhouette', 'recall': 'a beam of golden light pulling a distant silhouette closer',
 'quickStrike': 'two fast slash trails crossing with motion lines', 'venomEdge': 'a dagger edge dripping green venom',
 'exchange': 'two silhouettes swapping places with curved shadow arrows between them', 'charge': 'a lance tip thrusting forward with dust and speed lines',
 'breakthrough': 'a lance knocking a shield backward with a burst', 'rallyCry': 'a raised pennant on a lance with golden sound waves spreading',
 'riposte': 'two blades meeting with a bright parry spark', 'whirlwind': 'a circular sword slash trail spinning around a center point',
 'feint': 'a rapier thrust slipping past a shield edge', 'sanctuaryOath': 'a white round shield glowing with a warm protective dome',
 'flameBrand': 'a mace head glowing with a crimson-gold brand of light', 'pilgrimLantern': 'a small brass lantern shedding a wide soft light circle',
}
STATUS_ART = {
 'poison': 'a green poison drop over a wilting leaf', 'confuse': 'swirling violet spirals and small sparks circling',
 'bind': 'a coil of rope with a binding knot tied tight', 'silence': 'a closed book bound shut with cord and a blank wax seal',
 'buff': 'three golden upward chevrons glowing', 'debuff': 'three dull grey downward chevrons, cracked',
 'attack': 'a single sword striking diagonally', 'wait': 'a small brass hourglass with sand falling',
 'persuade': 'two open hands reaching toward each other with a warm light between them', 'capture': 'iron manacles linked by a short chain',
}

SHEETS = 'ABCDEFG'

def layout(items):
    """Seven sheets in the catalog order: A tools+misc, B–D gear (+treasures), E treasures+status, F–G skills."""
    order = [c for c in items if c['kind'] in ('tool', 'misc')]
    sheets = [order]
    gear = [c for c in items if c['kind'] == 'gear']; tre = [c for c in items if c['kind'] == 'treasure']
    rest = gear + tre
    sheets += [rest[0:16], rest[16:32], rest[32:48]]
    sheets.append(rest[48:] + [c for c in items if c['kind'] in ('status', 'command')])
    sk = [c for c in items if c['kind'] == 'skill']
    sheets += [sk[0:16], sk[16:]]
    assert all(len(s) <= 16 for s in sheets) and sum(map(len, sheets)) == len(items), [len(s) for s in sheets]
    return sheets

def describe(c):
    if c['kind'] == 'skill':
        return (f"skill icon for {c['en']} ({c['ko']}): {SKILL_ART[c['id']]}. Painted as a vignette inside a round dark disk "
                f"(deep charcoal-brown) with a thin {HERO_COLOR[c['hero']]} rim of light; the motif fills the disk.")
    if c['kind'] in ('status', 'command'):
        return f"{c['kind']} icon for {c['en']} ({c['ko']}): {STATUS_ART[c['id']]}. Bold simple silhouette, readable at 24 px; no disk."
    what = ART[c['id']]
    extra = ' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else ''
    return f"{c['en']} ({c['ko']}): {what}.{extra}"

STYLE = ("Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but "
         "controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval "
         "frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling "
         "about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at "
         "40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, "
         "holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.")

def grid_sketch(sheet, letter):
    im = Image.new('RGB', (CELL*GRID, CELL*GRID), (236, 230, 214)); d = ImageDraw.Draw(im)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18); big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    except OSError: font = big = ImageFont.load_default()
    for i in range(GRID*GRID):
        x, y = (i % GRID)*CELL, (i//GRID)*CELL
        d.rectangle([x, y, x+CELL-1, y+CELL-1], outline=(90, 70, 50), width=2)
        d.rectangle([x+26, y+26, x+CELL-27, y+CELL-27], outline=(170, 150, 120), width=1)
        if i < len(sheet):
            c = sheet[i]; d.text((x+10, y+8), f"{letter}{i+1:02d}", fill=(120, 40, 30), font=big)
            words, lines, cur = c['en'].split(), [], ''
            for wd in words:
                if len(cur)+len(wd) > 18: lines.append(cur); cur = wd
                else: cur = (cur+' '+wd).strip()
            lines.append(cur)
            for k, ln in enumerate(lines): d.text((x+14, y+110+k*24), ln, fill=(40, 30, 20), font=font)
            d.text((x+14, y+CELL-40), c['id'], fill=(110, 100, 90), font=font)
        else:
            d.line([x, y, x+CELL, y+CELL], fill=(190, 175, 150)); d.text((x+14, y+110), 'leave empty', fill=(150, 130, 110), font=font)
    return im

def start_here(sheets):
    L = []; w = L.append; total = sum(map(len, sheets))
    w('# Ashen Crown — Item, Skill and Status Icon Work Order (pack E, v0.8)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). '
      'Read this whole file first, then paint the seven icon sheets in order and return the zip described in section 6.')
    w(f'The pack holds **{total} icons** on **7 sheets**: tools, gear, unique treasures, status effects, battle commands and hero skills. '
      'Today the game draws these as tiny flat pixel rectangles, which clash with the painted portraits and towns; your icons replace them.')
    w('')
    w('## 1. Sheets')
    w('')
    w('| # | file | contents | layout | prompt |')
    w('|---|---|---|---|---|')
    titles = ['tools and supplies', 'gear (basic and regional)', 'gear (regional)', 'gear (regional and elite) and treasures',
              'treasures, status effects and commands', 'hero skills 1', 'hero skills 2']
    for i, s in enumerate(sheets):
        w(f"| {i+1} | `icons_{SHEETS[i]}.png` | {titles[i]} ({len(s)}) | `references/layout_icons_{SHEETS[i]}.png` | `prompts/{i+1:02d}_icons_{SHEETS[i]}.txt` |")
    w('')
    w('## 2. Sheet format')
    w('')
    w('- Exactly **1024×1024 px PNG**, a 4×4 grid of 256×256 px cells, read left to right, top to bottom (cell 01 top-left, cell 16 bottom-right).')
    w('- **Real transparency**, or a flat pure `#00FF00` background if transparency is not possible (say which in QA_REPORT.md). No grid lines, cell numbers, labels or frames in the output; the layout sketches are only a guide.')
    w('- Keep every icon inside the inner safe square of its cell (about 26 px margin on each side). Nothing may cross into a neighbouring cell.')
    w('- Cells marked "leave empty" in a layout sketch stay fully empty (transparent or `#00FF00`).')
    w('- One shared light direction (upper left) and one scale logic per sheet: small objects (coins, rings) are drawn large enough to fill their cell.')
    w('')
    w('## 3. Style (all sheets)')
    w('')
    w(f'- {STYLE}')
    w('- Match the approved painted chests (`approved_chests_act2.png`) for material rendering (wood, iron, brass, cloth) and the bust (`style_aren_neutral.png`) for palette and finish.')
    w('- `ref_ui_shop.jpg` shows where icons appear: on dark parchment-and-wood UI panels, often at 40–64 px. Check each icon at that size.')
    w('- Regional families must be told apart at a glance: Iron Crown gear = dark blue-grey and polished steel; Velmar gear = crimson, dark brown and brass; Sacred Flame gear = ivory, gold trim and crimson.')
    w('- Skill icons (sheets F–G) are painted vignettes inside a round dark disk with a thin rim of light in the hero\'s color (given per cell). Status and command icons (sheet E) are bold simple shapes without a disk.')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('')
    w('## 4. Order of work')
    w('')
    w('1. Sheet A (tools) first: it sets the finish for the whole pack.')
    w('2. Sheets B–D (gear and treasures), keeping the three regional color families distinct.')
    w('3. Sheet E (treasures, statuses, commands).')
    w('4. Sheets F–G (skills), one hero color per rim as listed.')
    w('')
    w('## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md)')
    w('')
    w('- [ ] 7 PNG files, each exactly 1024×1024, transparent or pure `#00FF00` (say which per file).')
    w('- [ ] Every cell matches its id in the layout sketch and its description in the prompt; empty cells are empty.')
    w('- [ ] No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere; no grid lines or labels.')
    w('- [ ] Every icon sits inside its safe square; nothing crosses a cell edge.')
    w('- [ ] Each icon is recognisable when the sheet is scaled to 160×160 px (each icon about 40 px).')
    w('- [ ] Consistent light direction, palette and finish across all sheets; regional gear families readable by color.')
    w('')
    w('## 6. Return format — **one zip under 20 MB**')
    w('')
    w('```')
    w(f'{NAME}_E/')
    w('  png/              # icons_A.png … icons_G.png')
    w('  manifest.csv      # sheet,file,width,height,background(transparent|00FF00),bytes,sha256')
    w('  SHA256SUMS.txt    # sha256  path')
    w('  QA_REPORT.md      # the checklist above, generation notes, deviations, any cell you are unsure about')
    w('  contact_sheet.jpg # all 7 sheets side by side with their letters, JPEG under 1 MB')
    w('  prompts_used/     # the exact final prompt per sheet')
    w('```')
    w('')
    w('- Reopen the zip and verify every file against SHA256SUMS before finishing; report the zip size.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 E (아이템·스킬·상태 아이콘 {TOTAL}개, 시트 7장)

ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

## A. 한 번에 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: paint all seven icon sheets in the listed order using the prompts in prompts/, the layout sketches and the reference images in references/, run the self-check, and return {NAME}_E.zip (under 20 MB) exactly as described in section 6.
```

## B. 시트 A(도구)를 먼저 보고 결정하기
```
Attached is a work pack. Read 00_START_HERE.md first. Paint only sheet A (icons_A.png) now, show it to me, and wait for my approval before doing the rest.
```
마음에 들면 `Approved. Continue with sheets B to G and return the zip described in section 6.`를 보냅니다.

## 받은 뒤
- `{NAME}_E.zip`을 Claude에게 주세요. 시트를 칸별로 잘라 게임에 넣습니다(v0.8.1).
- 그림이 오기 전에는 게임이 그린 임시 아이콘으로 개발하고, 완성본이라고 하지 않습니다.

## 시트 구성
{TABLE}
"""

def main():
    items = catalog(); sheets = layout(items)
    refs = PACK/'references'; prompts = PACK/'prompts'
    prompts.mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list(prompts.glob('*.txt'))+list(refs.glob('*')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    sheet = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    for i, f in enumerate(sorted((ROOT/'src/assets/chests').glob('*_closed.webp'))[:16]):
        im = Image.open(f).convert('RGBA').resize((256, 256)); sheet.paste(im, ((i % 4)*256, (i//4)*256), im)
    sheet.save(refs/'approved_chests_act2.png', optimize=True)
    ui = Image.open(ROOT/'docs/v0.6.0/screenshots/act2-hubs/castletown-shop-open-1440.png').convert('RGB'); ui.thumbnail((1280, 1280)); ui.save(refs/'ref_ui_shop.jpg', quality=85)
    for i, s in enumerate(sheets): grid_sketch(s, SHEETS[i]).save(refs/f'layout_icons_{SHEETS[i]}.png', optimize=True)
    (PACK/'00_START_HERE.md').write_text(start_here(sheets), encoding='utf-8')
    rows = ['| 시트 | 칸 | 내용 |', '|---|---:|---|']
    for i, s in enumerate(sheets): rows.append(f"| {SHEETS[i]} | {len(s)} | {', '.join(c['ko'] for c in s)} |")
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(items))).replace('{TABLE}', '\n'.join(rows)), encoding='utf-8')
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for i, s in enumerate(sheets):
            for k, c in enumerate(s): wr.writerow([SHEETS[i], k+1, c['id'], c['kind'], c['en'], c['ko'], describe(c)])
    for i, s in enumerate(sheets):
        L = [f"Paint icon sheet {SHEETS[i]} for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background "
             "(or flat pure #00FF00), no grid lines, no labels. Follow references/layout_icons_" + SHEETS[i] + ".png for which icon goes in which cell.", '']
        for k in range(16):
            L.append(f"Cell {k+1:02d}: " + (describe(s[k]) if k < len(s) else 'leave empty.'))
        L += ['', STYLE, 'Attach: style_aren_neutral.png, approved_chests_act2.png, ref_ui_shop.jpg, layout_icons_' + SHEETS[i] + '.png.']
        (prompts/f"{i+1:02d}_icons_{SHEETS[i]}.txt").write_text('\n'.join(L)+'\n', encoding='utf-8')
    print('sheets', [len(s) for s in sheets], 'icons', len(items))
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, NAME+'/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)

if __name__ == '__main__':
    main()
