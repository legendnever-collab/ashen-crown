#!/usr/bin/env python3
"""Build the ChatGPT work pack F1 for ACT III part 1 (v0.9.0, M15–M16; ACT3_DESIGN.md §10, D-079/D-080):
characters (Marquess Bellard, the old archivist, the royal watch, the grey cloaks, the chancellery clerks, the memory
harvesters), the royal lower city hub on the footprint the game already uses (Velmar's layout, so the walk mask and doors
stay), its six rooms on the port room footprints, a four-style chest sheet, and icon sheet H (the capital's six tier III
pieces and the two v0.9.0 treasures, which came after pack E).
Reuses the prompt templates of make-act2b-art-pack.py / make-act2-hub-pack.py / make-item-art-pack.py, so the returned
files import with scripts/import-art.py, scripts/import-interior-art.py and scripts/import-item-art.py.
Usage: python3 scripts/make-act3-art-pack.py [--zip <out.zip>] [--icons <dir with the approved pack E icons_B.png, icons_D.png>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
cp = load('cp', 'make-act2-character-pack.py'); hp = load('hp', 'make-act2-hub-pack.py'); iwp = hp.iwp; ip = load('ip', 'make-item-art-pack.py')
PACK = ROOT/'docs/v0.9.0/art/act3-f1-work-pack'
NAME = 'Ashen_Crown_v090_ACT3_Art_Pack_F1'
OLD = ROOT/'docs/v0.5.0/art/world-work-pack/references'

# ---- characters (all PROPOSED; ACT3_DESIGN.md §5) ----
BELLARD = dict(id='bellard', name='Marquess Bellard — Chancellor of the realm (재상 벨라드)', ref='eric', exprs=list(cp.EXPR),
 desc=("Marquess Bellard, the realm's chancellor, a tall lean man of about sixty. Close-cropped iron-grey hair receding at the temples, clean-shaven, a long "
       "narrow face with sharp cheekbones and deep lines beside the mouth, pale grey eyes that measure everything, a calm and courteous half-smile. A high-collared "
       "long robe of deep plum-black wool with fine silver trim, a dark grey under-coat buttoned to the throat, a heavy chain of office of plain silver links with "
       "a smooth blank oval medallion (no emblem), black leather gloves, a slim straight court sword at the hip. He holds a folded letter closed with a blank "
       "grey wax seal. Capable, logical, quietly certain that someone's memory must be given so that the people can live — never a monster, never sneering."),
 weapon='the slim straight court sword; attack pose is a single precise thrust')
ARCHIVIST = dict(id='archivist', name='the old archivist of the royal archive (늙은 기록관)', ref='eric', exprs=['neutral', 'concerned'],
 desc=("The old archivist who still keeps the royal archive honestly, a stooped man in his seventies. Bald on top with a fringe of white hair, a short white "
       "beard, kind tired blue-grey eyes behind small round wire spectacles, ink-stained fingertips. A long slate-blue scholar's robe with faded gold trim at the "
       "cuffs, a brown leather satchel stuffed with loose papers across the chest, a small brass hand lantern on a cord at the belt. Brave in a quiet way; he "
       "risks his post to show the legion the records."),
 weapon='no weapon — the attack column is a flinch, holding the satchel and lantern close')
UNITS = [
 dict(id='archivist', name='the old archivist — map figure (civilian to protect, M15)', ref='eric', bust='bust_archivist_neutral.png (your approved result)',
  desc=ARCHIVIST['desc'], weapon=ARCHIVIST['weapon']),
 dict(id='bellard', name='Marquess Bellard — map figure', ref='eric', bust='bust_bellard_neutral.png (your approved result)', desc=BELLARD['desc'], weapon=BELLARD['weapon']),
 dict(id='watchman', name='royal watch guard (neutral, may turn hostile, M15)', ref='ironSpear',
  desc=("a guard of the royal capital watch, polished brass-colored half-plate over a deep crimson gambeson, a gold-yellow tabard with a plain crimson border "
        "(no emblem), an open brass helmet with a short crimson plume, a round gold-painted shield; upright, proud, not hostile by default"),
  weapon='a long spear held upright; the round gold shield on the other arm'),
 dict(id='grayCloak', name='grey cloak — chancellery agent (enemy, M15)', ref='eric',
  desc=("an agent of the chancellery's quiet service, a long ash-grey hooded cloak over close-fitting dark grey leather, a grey scarf hiding the lower face, "
        "pale eyes in the hood's shadow, soft boots, no colors and no badges of any kind"),
  weapon='a short straight sword held low; attack pose is a quick lunge'),
 dict(id='clerk', name='chancellery clerk carrying a record box (fleeing target, M15)', ref='eric',
  desc=("a young chancellery clerk in a neat dark plum coat with thin gold piping, a white collar, ink-stained cuffs, hair tied back; he hugs a heavy dark wooden "
        "document box with iron corners and a blank lock plate against his chest; hurried and frightened, not a fighter"),
  weapon='no weapon — the attack column is a flinch, turning his shoulder to shield the record box'),
 dict(id='harvester', name='memory harvester (enemy, M16)', ref='eric',
  desc=("an eerie but human ward-keeper who draws memories out of the dying field, very tall and thin in layered violet-black robes with pale lavender hems, "
        "long straight white hair, the lower face covered by a sheer grey veil, pale skin, lavender-glowing eyes; around the wrists faint lavender motes drift"),
  weapon='a tall dark staff topped with a pale violet glass orb holding swirling mist; attack pose raises the orb and a lavender glow flares'),
]

def char_jobs():
    J = []
    for c in (BELLARD, ARCHIVIST):
        for e in c['exprs']:
            if e == 'neutral':
                refs = 'style_aren_neutral.png, ref_bust_baldrick_neutral.png'; prompt = cp.BUST_B.format(desc=c['desc'], expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"; prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
            J.append(dict(id=c['id'], kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in UNITS:
        refs = f"{c['bust']}, ref_sprite_{c['ref']}.png" if c.get('bust') else f"ref_sprite_{c['ref']}.png, style_aren_neutral.png"
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=refs,
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

# ---- places: the royal lower city on the footprint the game uses for it (Velmar's layout and doors) ----
VELMAR = next(h for h in hp.HUBS if h['id'] == 'hub_velmar')
RELABEL = {'rooftops / city beyond': ('rooftops — the upper city and palace towers far beyond', 'wall'), 'HARBOR (sea, piers, ships)': ('CANAL (stone quays, moored barges)', 'water'),
 'APOTHECARY (item shop)': ('APOTHECARY (item shop)', 'bldg'), 'COUNCIL HALL (columns, bell tower)': ('OLD RECORDS HOUSE (archivist; columns, small bell tower)', 'bldg'),
 'MERCENARY ARMORY (weapon shop)': ('GUARD ARMORER (weapon shop)', 'bldg'), 'TOWNHOUSE (flower boxes)': ('TENEMENT HOUSE (narrow, washing lines)', 'bldg'),
 'MARKET SQUARE (fountain; stalls at edges)': ('LOWER SQUARE (old fountain; lamp posts at edges)', 'open'), 'fountain': ('old fountain', 'solid'),
 'HARBOR TAVERN': ('CANAL TAVERN', 'bldg'), 'HARBOR WAREHOUSE (crane, crates)': ('CANAL WAREHOUSE (hoist, crates)', 'bldg'),
 'COVERED MARKET STALLS': ('NIGHT STALLS (covered, lanterns)', 'solid'), 'city edge — low wall': ('low wall — steps up toward the upper city', 'wall')}
HUB = dict(id='hub_capital', title='the royal lower city of the capital at dusk (M15–M16)',
 regions=[(RELABEL[r[0]][0],)+tuple(r[1:5])+(RELABEL[r[0]][1],) for r in VELMAR['regions']], doors=VELMAR['doors'], entrance=VELMAR['entrance'],
 scene=("The lower city of the royal capital at dusk, lamps just lit: the old crowded quarter below the palace, where clerks, porters and refugees live. "
        "Tall narrow houses of soot-darkened sandstone and dark timber, three and four storeys, slate roofs, washing lines between upper windows, iron lamp brackets "
        "with warm lanterns, worn cobbles. Along the whole left edge a wide stone CANAL with quays, mooring rings and two moored flat barges with crates under canvas. "
        "Top center the OLD RECORDS HOUSE where the archivist works — a narrow stone building with four plain columns and a small bell tower, shutters half closed, "
        "a lamp in one high window; top-left an apothecary with herb pots and a hanging lantern; top-right the guard armorer with racks of sabres and round "
        "gold-painted shields by the door. Middle-left a narrow tenement with washing lines; middle-right a canal tavern with barrels and warm windows. In the center "
        "the LOWER SQUARE: an old worn fountain with a ring of lamp posts at its edges (keep the square itself open). Bottom-left a canal warehouse with a hoist "
        "beam and crates; bottom-right a row of covered night stalls with lanterns. The road comes in at the bottom center. Far beyond the rooftops at the top, "
        "the pale towers of the upper city catch the last light. Crowded, tired, watchful but alive; deep blue dusk, warm amber lamplight, sandstone, slate and "
        "plum-grey. Keep exactly the same footprint as the attached approved_hub_velmar.jpg (the same building positions, door tiles, square and streets) — it is "
        "a different city painted on the same layout. Match the style of the attached approved hubs."))
PORT = {r['id']: r for r in hp.P_INT}
ROOMS = [
 dict(PORT['int_port_tavern'], id='int_capital_tavern', family='capital', used='canal tavern', title='canal tavern', ext='hub_capital.jpg (your approved result)', anchor=True,
  scene=("Inside a lower-city canal tavern at night: soot-darkened sandstone walls and heavy timber beams, small leaded windows with canal lamplight outside, "
         "barrels behind a worn bar, round tables and stools, porters' hooks and coils of barge rope on the wall, hanging iron lamps with warm light, a sawdust "
         "plank floor. Crowded-feeling but empty of people."),
  regions=[('BAR + barrels', 1, 2, 3, 1), ('ROUND TABLE', 4, 4, 1, 1), ('ROUND TABLE', 7, 4, 1, 1), ('BARGE ROPES + hooks on wall', 6, 2, 3, 1)],
  chests=[('a', 1, 4, 'canal_chest'), ('b', 10, 2, 'canal_chest')]),
 dict(PORT['int_port_armory'], id='int_capital_armory', family='capital', used='guard armorer (weapon shop)', title='guard armorer', ext='hub_capital.jpg (your approved result)',
  scene=("Inside the guard armorer (same construction as the approved tavern): racks of sabres and long spears, round gold-painted shields and brass helmets with "
         "crimson plumes on stands, a grinding wheel, a counter with a sabre on a crimson cloth, the armorer's floor behind it.")),
 dict(PORT['int_port_apothecary'], id='int_capital_apothecary', family='capital', used='lower-city apothecary (item shop)', title='lower-city apothecary', ext='hub_capital.jpg (your approved result)',
  scene=("Inside the lower-city apothecary (same construction as the approved tavern): crooked shelves of brown and green glass bottles, drying herbs from the "
         "beams, a small copper still, many little drawers, a counter with a mortar and brass scale, a lamp burning low.")),
 dict(PORT['int_port_council'], id='int_capital_records', family='capital', kind='quarters', used="the old records house (the archivist's room)", title='old records house', ext='hub_capital.jpg (your approved result)',
  scene=("Inside the old records house (same construction as the approved tavern, taller): floor-to-ceiling shelves of bound ledgers and tied bundles of papers "
         "with plain covers (no readable writing), a long reading table with a lamp, rolled maps, a tall ladder on a rail, dust in the lamplight, a narrow "
         "high window on the dusk."),
  regions=[('LEDGER LECTERN', 1, 2, 1, 2), ('LONG READING TABLE', 4, 3, 4, 2), ('SHELVES + ladder', 8, 2, 2, 1)],
  chests=[('a', 10, 4, 'archive_coffer')]),
 dict(PORT['int_port_house'], id='int_capital_house', family='capital', used='tenement room', title='tenement room', ext='hub_capital.jpg (your approved result)',
  scene=("Inside a cramped lower-city tenement room (same construction as the approved tavern): a narrow bed with a patched blanket, a small table with bread and "
         "a candle, a window on the washing lines and lamps, a little iron stove, a worn painted wardrobe, a plank floor."),
  regions=[('BED', 1, 2, 2, 2), ('SMALL TABLE', 4, 3, 2, 1), ('WINDOW (washing lines, lamps)', 7, 2, 2, 1), ('WARDROBE', 10, 2, 1, 2)],
  chests=[('a', 1, 4, 'tenement_box')]),
 dict(PORT['int_port_warehouse'], id='int_capital_warehouse', family='capital', used='canal warehouse', title='canal warehouse', ext='hub_capital.jpg (your approved result)',
  scene=("Inside the canal warehouse (same construction as the approved tavern): stacks of crates and grain sacks under rope nets, barrels, a hoist chain hanging "
         "from a beam, a wide loading door open onto the dark canal with a lantern on a hook."),
  regions=[('CRATE STACKS', 1, 2, 2, 2), ('GRAIN SACKS', 4, 2, 2, 1), ('BARRELS', 7, 2, 2, 1), ('HOIST + bales', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'barge_crate'), ('b', 3, 4, 'barge_crate')]),
]
CHESTS = [
 ('canal_chest', 'canal tavern', "a bargeman's chest of dark oak with iron corners, a coil of tarred rope tied around it"),
 ('archive_coffer', 'old records house', 'a narrow archive coffer of pale walnut with brass hinges and a plain brass lock plate (no letters), a ribbon of paper sticking out'),
 ('tenement_box', 'tenement room', 'a small battered painted wooden box, faded blue with chipped edges and a simple hasp'),
 ('barge_crate', 'canal warehouse', 'a sturdy cargo crate of rough planks with rope handles and a plain dark band painted around it (no letters)'),
]

def chest_layout():
    im = Image.new('RGB', (1024, 512), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (sid, where, _) in enumerate(CHESTS):
        for st in (0, 1):
            x0, y0 = i*256, st*256
            d.rectangle((x0, y0, x0+255, y0+255), outline=(90, 80, 60), width=2); d.line((x0+20, y0+216, x0+236, y0+216), fill=(200, 60, 60), width=2)
            d.rectangle((x0+48, y0+120, x0+208, y0+216), outline=(150, 110, 40), width=3)
            iwp.label(d, (x0, y0+10, x0+256, y0+110), f"{i+1}. {sid} ({'CLOSED' if st == 0 else 'OPEN, empty'}) — {where}", f)
    return im

def place_jobs():
    J = [dict(id=HUB['id'], kind='hub', file=f"{HUB['id']}.jpg", size='1536x1024',
              refs=f"layout_{HUB['id']}.png, approved_hub_velmar.jpg (same footprint), scale_reference.png, sprite_eric_sheet.png, approved_hub_castletown.jpg",
              prompt=hp.HUB_COMMON+f"\nScene: {HUB['scene']}")]
    anchor = ROOMS[0]
    for r in ROOMS:
        refs = [f"layout_{r['id']}.png", 'scale_reference_interior.png', r['ext']]
        refs += ['approved_int_port_tavern.jpg'] if r is anchor else [f"{anchor['id']}.jpg (your approved result)"]
        cl = ''.join(f" Chest tile {c[0]} at column {c[1]}, row {c[2]} (0-based) stays empty floor." for c in r['chests'])
        J.append(dict(id=r['id'], kind='interior', file=f"{r['id']}.jpg", size='1536x1024', refs=', '.join(refs),
                      prompt=iwp.INT_COMMON+f"\nScene: {r['scene']}{cl}"+("\nThis image becomes the style anchor for the lower city's rooms." if r is anchor else
                             f"\nMatch the walls, floor, light and scale of the attached approved {anchor['id']}.jpg.")))
    cells = ''.join(f"  {i+1}. {sid} ({where}): {desc}.\n" for i, (sid, where, desc) in enumerate(CHESTS))
    J.append(dict(id='chests_capital', kind='chests', file='chests_capital.png', size='1024x512',
                  refs='layout_chests_capital.png, approved_chests_act2.png, int_capital_tavern.jpg (your approved result)',
                  prompt=iwp.CHEST_PROMPT.replace('12 different', '4 different').replace('Canvas 1536x1024, a 6-column x 4-row grid', 'Canvas 1024x512, a 4-column x 2-row grid')
                         .replace('layout_chests.png', 'layout_chests_capital.png').replace('(int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg)', '(int_capital_tavern.jpg)')
                         + "Row 1 = chests 1-4 closed, row 2 = chests 1-4 open (empty), each open cell lined up exactly with the closed cell above it.\n" + cells))
    return J

# ---- icon sheet H: the capital's tier III pieces and the v0.9.0 treasures (after pack E) ----
ICON_ART = {
 'royalSaber': 'a fine curved sabre of bright steel with a gilded basket guard and a crimson-wrapped grip, the blade catching a gleam (tier III, elite)',
 'archiveBow': 'a tall elegant longbow of dark polished wood with brass tips and slim leather wraps, a pale ribbon bound near the grip (tier III, elite)',
 'wardRod': 'a slender rod of pale silver-grey wood capped with a small clear crystal that holds a faint swirl of lavender mist (tier III, elite)',
 'courtVestment': 'a folded court priest vestment of ivory silk with a deep plum stole and fine silver edging, laid neatly (tier III, elite)',
 'greyMantle': 'a long ash-grey hooded mantle folded over itself, soft wool with a plain dark clasp (tier III, elite)',
 'oathRing': 'a heavy plain gold band with a smooth dark-blue stone set flush, a faint warm glow around it (tier III, elite)',
 'archivistLens': "a round brass reading lens on a short wooden handle lying on a page of blank parchment, the glass catching a bright glint",
 'mistLantern': 'a small old brass lantern with frosted glass panes, pale silver-lavender mist and a soft steady light curling inside it',
}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet H for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_H.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_B.png and approved_icons_D.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = ' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else ''
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']]}.{extra}")
    lines.append('Cells 09–16: leave empty.')
    return '\n'.join(lines)

def start_here(CJ, PJ, IJ):
    L = []; w = L.append; n = len(CJ)+len(PJ)+1
    w('# Ashen Crown — ACT III Part 1 Art Work Order (pack F1, v0.9.0)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs in order and return the zips described in section 7.')
    w('ACT III takes the legion into the royal capital. This pack has three parts: **characters** (the chancellor, the old archivist and four battle-map figures), **places** (the capital\'s lower city, six rooms and their chests) and **one icon sheet** (eight new items).')
    w('')
    w(f'## 1. Characters ({len(CJ)} images)')
    w('')
    w('| # | file | who | size (px) | attach | prompt |')
    w('|---|---|---|---|---|---|')
    for i, j in enumerate(CJ, 1): w(f"| {i} | `{j['file']}` | {j['who']} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    w('')
    w(f'## 2. Places ({len(PJ)} images)')
    w('')
    w('| # | id | file | size (px) | attach | prompt |')
    w('|---|---|---|---|---|---|')
    for k, j in enumerate(PJ, len(CJ)+1): w(f"| {k} | `{j['id']}` | `{j['file']}` | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{k:02d}_{j['id']}.txt` |")
    w('')
    w('## 3. Icon sheet (1 image, 8 icons)')
    w('')
    w('| # | file | size (px) | attach | prompt |')
    w('|---|---|---|---|---|')
    w(f"| {n} | `icons_H.png` | 1024×1024 | layout_icons_H.png, approved_icons_B.png, approved_icons_D.png, style_aren_neutral.png, ref_ui_shop.jpg | `prompts/{n:02d}_icons_H.txt` |")
    w('')
    w('| cell | id | item |')
    w('|---|---|---|')
    for c in IJ: w(f"| H{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w('')
    w('## 4. Global rules')
    w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Places: {iwp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, banners, books, seals, signs, crates, papers). Factions are told apart by colors only: the royal watch = brass, crimson and gold-yellow; the chancellery = deep plum with silver or thin gold; the grey cloaks = ash grey without any color; the memory harvesters = violet-black with lavender.')
    w('- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer\'s right.')
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached `ref_sprite_*.png` (shown at half size).')
    w('- The town map and rooms follow the layout sketches (24×16 tiles of 64 px; rooms 12×8 tiles of 128 px). **The lower city keeps exactly the footprint of the attached `approved_hub_velmar.jpg`** (same building positions, doors, square, streets and the water strip on the left) — the game already walks on that layout; paint a different city on it. **No people and no animals** in the town and rooms; every enterable building shows one front door at its DOOR tile; CHEST and SHOPKEEPER tiles stay empty floor.')
    w('- The icon sheet: 4×4 cells of 256 px, cells 09–16 empty, every icon inside the 80 % safe square of its cell.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 5. Order of work')
    w('')
    w('1. `bellard` neutral bust → concerned / determined / sad.')
    w('2. `archivist` neutral bust → concerned.')
    w('3. The six map sheets: `archivist` and `bellard` from their approved busts, then `watchman`, `grayCloak`, `clerk`, `harvester`. They must be told apart by color at small size: archivist = slate-blue robe with a brown satchel; Bellard = plum-black with silver; watch = brass and crimson with a gold shield; grey cloak = ash grey only; clerk = dark plum coat hugging a dark box; harvester = violet-black with a glowing violet orb.')
    w('4. `hub_capital` (style anchor of the capital) → its six rooms, `int_capital_tavern` first → `chests_capital`.')
    w('5. `icons_H.png`.')
    w('')
    w('## 6. Self-check (record PASS/FAIL per item in QA_REPORT.md)')
    w('')
    w(f'- [ ] {sum(1 for j in CJ if j["kind"] == "bust")} busts at exactly 1024×1280 and {sum(1 for j in CJ if j["kind"] == "sprite")} sheets at exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] The hub and 6 rooms are exactly 1536×1024 RGB JPEG quality 92–95; `chests_capital.png` exactly 1024×512 PNG; `icons_H.png` exactly 1024×1024 PNG.')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere. No people or animals in the hub and rooms.')
    w('- [ ] Each character\'s busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust.')
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] The hub keeps the footprint of `approved_hub_velmar.jpg` (doors at the same DOOR tiles, the square open, the road at the bottom center, the canal on the left); rooms match their sketches; doorway at bottom-row tiles 5–6.')
    w('- [ ] Chest sheet: 4 chests, open cells lined up with closed cells, open chests empty.')
    w('- [ ] Icon sheet: 8 icons in cells 01–08, cells 09–16 fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 7. Return format — **two zips, each under 20 MB**')
    w('')
    w(f'- `{NAME}_1.zip` — characters: {sum(1 for j in CJ if j["kind"] == "bust")} busts and {sum(1 for j in CJ if j["kind"] == "sprite")} sheets')
    w(f'- `{NAME}_2.zip` — `hub_capital.jpg`, 6 rooms, `chests_capital.png` and `icons_H.png`')
    w('')
    w('```')
    w(f'{NAME}_1/   (and _2 the same way)')
    w('  png/ or img/      # PNG masters for characters and icons (png/), JPEG/PNG for places (img/)')
    w('  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · places: id,kind,path,width,height,bytes,sha256 · icons: sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt    # sha256  path')
    w('  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations')
    w('  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/     # the exact final prompt per image')
    w('```')
    w('')
    w(f'- If a zip would exceed 20 MB, split it again (`_2a`, `_2b`), each with its own manifest and checksums. Do not include WebP.')
    w('- Reopen each zip and verify every file against its SHA256SUMS before finishing; report each zip\'s size.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 F1 (ACT III 1부, {TOTAL}장)

ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

## A. 한 번에 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all {TOTAL} images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return the two zips {NAME}_1 and {NAME}_2 (each under 20 MB) exactly as described in section 7.
```

## B. 벨라드와 기록관을 먼저 보고 결정하기
```
Attached is a work pack. Read 00_START_HERE.md first. Do only the two neutral busts of bellard and archivist now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 `Approved. Continue with all remaining jobs and return the zips described in section 7.`를 보냅니다.

## 받은 뒤
- ZIP(_1, _2)을 Claude에게 주세요. 한 개씩 와도 됩니다.
- 받으면 SHA256을 검증하고 지금의 가안(벨마르 그림 + 황혼 색조, 게임이 그린 인물)을 교체합니다.

## 인물 (모두 PROPOSED — 생김새, 이름 모두 바꿀 수 있습니다)
| id | 인물 | 생김새 요점 |
|---|---|---|
| `bellard` | 재상 벨라드 (ACT III–IV 핵심 인물, M20에 직접 등장) | 60세 전후, 키 크고 마른 체격, 짧은 철회색 머리, 면도한 얼굴, 회색 눈, 은 테두리의 짙은 자흑색 장포, 무늬 없는 은 직인 목걸이, 가는 궁정검, 회색 봉랍 편지 |
| `archivist` | 늙은 기록관 (M15 안내자) | 70대, 굽은 등, 정수리 대머리와 흰 짧은 수염, 동그란 철테 안경, 바랜 금 테두리의 청회색 학자 장포, 종이가 삐져나온 가죽 가방, 놋쇠 손등불 |

맵 시트만 그리는 인물 4종 (+ 위 두 사람의 맵 그림):
- 왕도 경비대 (중립, M15) — 놋쇠 갑옷, 진홍, 금빛 둥근 방패, 창
- 회색 망토 (재상부 요원, M15) — 색 없는 잿빛 망토와 가죽, 짧은 검
- 재상부 서기 (M15 추격 대상) — 짙은 자주 외투, 기록 상자를 끌어안음
- 기억 수확자 (M16) — 보라·검정 장포, 흰 긴 머리, 보랏빛 구슬 지팡이

## 장소
| id | 장소 | 건물 |
|---|---|---|
| `hub_capital` | 왕도 하층가 (해 질 녘, 등불) — 게임이 이미 쓰는 벨마르 배치 위에 다른 도시로 그림 | 경비대 무기점·약재상(상점), 옛 기록원(기록관), 운하 주점, 셋집, 운하 창고, 밤 노점(바깥), 운하 |

상자 4종: 바지선꾼 궤, 기록원 서류함, 셋집 상자, 화물 상자.

## 아이콘 시트 H (8개)
왕도 근위검 · 기록원 장궁 · 결계 지팡이 · 궁정 사제복 · 회색 외투 · 맹세의 반지 · 기록관의 확대경(보물) · 잔영의 등불(보물). 그림팩 E와 같은 솜씨로 맞춥니다(승인된 E 시트 두 장을 참고로 넣었습니다).
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    for n in ('style_aren_neutral.png', 'scale_reference.png', 'sprite_eric_sheet.png'): Image.open(OLD/n).save(refs/n, optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    ref_png(ROOT/'src/assets/portraits/bust_baldrick_neutral.webp', refs/'ref_bust_baldrick_neutral.png')
    for s in ('eric', 'ironSpear'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    hp.hub_sketch(HUB).save(refs/f"layout_{HUB['id']}.png", optimize=True)
    for r in ROOMS: iwp.layout_sketch(r).save(refs/f"layout_{r['id']}.png", optimize=True)
    chest_layout().save(refs/'layout_chests_capital.png', optimize=True)
    iwp.scale_reference().save(refs/'scale_reference_interior.png', optimize=True)
    for hub in ('hub_castletown', 'hub_velmar'): iwp.ext_jpg(ROOT/f'src/assets/hubs/{hub}.webp', refs/f'approved_{hub}.jpg')
    iwp.ext_jpg(ROOT/'src/assets/rooms/int_port_tavern.webp', refs/'approved_int_port_tavern.jpg')
    sheet = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    for i, f in enumerate(sorted((ROOT/'src/assets/chests').glob('*_closed.webp'))[:16]):
        im = Image.open(f).convert('RGBA').resize((256, 256)); sheet.paste(im, ((i % 4)*256, (i//4)*256), im)
    sheet.save(refs/'approved_chests_act2.png', optimize=True)
    # icon references: the approved pack E sheets B and D (as returned), the shop UI reference of pack E
    icons = Path(sys.argv[sys.argv.index('--icons')+1]) if '--icons' in sys.argv else None
    for k in 'BD':
        src = icons/f'icons_{k}.png' if icons else None
        if src and src.exists(): Image.open(src).save(refs/f'approved_icons_{k}.png', optimize=True)
        elif not (refs/f'approved_icons_{k}.png').exists(): sys.exit(f'approved_icons_{k}.png: pass --icons <dir with the returned pack E sheets>')
    ip_ref = ROOT/'docs/v0.8.0/art/item-work-pack/references/ref_ui_shop.jpg'; (refs/'ref_ui_shop.jpg').write_bytes(ip_ref.read_bytes())
    IJ = icon_cells()
    ip.grid_sketch(IJ, 'H').save(refs/'layout_icons_H.png', optimize=True)
    CJ, PJ = char_jobs(), place_jobs(); n = len(CJ)+len(PJ)+1
    (PACK/'00_START_HERE.md').write_text(start_here(CJ, PJ, IJ), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(n)), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(CJ+PJ, 1):
            stem = Path(j['file']).stem if j in CJ else j['id']
            wr.writerow([i, j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{stem}.txt"])
        wr.writerow([n, 'icons', 'icons_H', '', 'icons_H.png', '1024x1024', 'layout_icons_H.png, approved_icons_B.png, approved_icons_D.png, style_aren_neutral.png, ref_ui_shop.jpg', f'prompts/{n:02d}_icons_H.txt'])
    # cells.csv for scripts/import-item-art.py --cells (same columns as pack E's)
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IJ: wr.writerow(['H', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']]}."])
    for i, j in enumerate(CJ, 1):
        (PACK/'prompts'/f"{i:02d}_{Path(j['file']).stem}.txt").write_text(f"{j['prompt']}\n{cp.STYLE}\nAttach: {j['refs']}.\n", encoding='utf-8')
    for i, j in enumerate(PJ, len(CJ)+1):
        fmt = 'one PNG with transparency (or pure #00FF00 background)' if j['kind'] == 'chests' else 'one JPEG (quality 92-95)'
        st = iwp.STYLE if j['kind'] != 'hub' else iwp.STYLE.replace("rooms, furniture designs", "map, town")
        (PACK/'prompts'/f"{i:02d}_{j['id']}.txt").write_text(f"{j['prompt']}\n{st}\nAttach: {j['refs']}.\nOutput: {fmt}, exactly {j['size']} px.\n", encoding='utf-8')
    (PACK/'prompts'/f'{n:02d}_icons_H.txt').write_text(f"{icon_prompt(IJ)}\n\n{ip.STYLE}\nAttach: style_aren_neutral.png, approved_icons_B.png, approved_icons_D.png, ref_ui_shop.jpg, layout_icons_H.png.\n", encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v090_ACT3_F1_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK, len(CJ), 'character jobs +', len(PJ), 'place jobs + 1 icon sheet')

if __name__ == '__main__':
    main()
