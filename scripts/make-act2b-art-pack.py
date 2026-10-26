#!/usr/bin/env python3
"""Build the ChatGPT work pack D for v0.7 (ACT II part 2, M11–M14; D-068): 8 busts + 10 sprite sheets (characters) and
the pilgrim village below the Sacred Flame cathedral with 8 rooms and a 4-style chest sheet (places).
Reuses the prompt templates of make-act2-character-pack.py and the sketch drawing of make-interior-work-pack.py /
make-act2-hub-pack.py, so returned files import with scripts/import-art.py and scripts/import-interior-art.py.
Usage: python3 scripts/make-act2b-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
cp = load('cp', 'make-act2-character-pack.py'); hp = load('hp', 'make-act2-hub-pack.py'); iwp = hp.iwp
PACK = ROOT/'docs/v0.7.0/art/act2b-work-pack'
NAME = 'Ashen_Crown_v070_ACT2B_Art_Pack'
OLD = ROOT/'docs/v0.5.0/art/world-work-pack/references'

# ---- characters (all PROPOSED; D-068) ----
LEADER = dict(id='lucien', name='Lucien Arcane — High Flame of the Order of the Sacred Flame (성화 교단의 대사제)', ref='eric', mounted=False,
 desc=("Lucien Arcane, the High Flame who leads the Order of the Sacred Flame from the southern cathedral, a man in his early fifties. Silver-white hair worn shoulder-length "
       "and combed back, a short neat silver beard, warm amber eyes with deep lines of tiredness, gentle but unyielding gaze, weathered hands of someone who still serves the "
       "sick himself. Layered white and ivory vestments with plain gold trim, a long crimson stole over the shoulders, a simple rope belt, travel-worn hem; he carries a tall "
       "wooden staff topped with a small enclosed brass lantern holding a living flame (no symbols on it). Merciful and certain; he believes human greed broke the kingdom."),
 weapon='the tall lantern staff (a small flame inside an enclosed brass lantern); attack pose raises the lantern high')
RECRUIT = dict(id='ines', name='Ines — pilgrim warden of the Sacred Flame (성화 순례 수호자, recruit)', ref='eric', mounted=False,
 desc=("Ines, a pilgrim warden who guards the Order's processions, a woman around thirty. Tawny skin, short black hair with a single thin braid behind one ear, dark brown "
       "eyes, a pale scar across the bridge of the nose, a calm and steady expression. A white wool tabard with plain crimson borders over grey mail, a gold-colored sash, "
       "a short crimson travel cape, sturdy boots dusty from the road, a large round white shield with a plain gold rim (no emblem). She believes in the Order's relief "
       "but openly objects to burning books."),
 weapon='a long-hafted poleaxe (an axe blade with a spike) held in both hands; the round shield on her back when she attacks')
LEADER_SHEETS = [
 dict(id='cassian', name='Cassian Arcane — map figure (M14 summit)', ref='eric', bust='bust_cassian_neutral.png (attached, approved in pack B)',
  desc=cp.LEADERS[0]['desc'], weapon='a sheathed longsword at the hip; attack pose draws and cuts with it'),
 dict(id='leonora', name='Leonora Arcane — map figure (M14 summit)', ref='eric', bust='bust_leonora_neutral.png (attached, approved in pack B)',
  desc=cp.LEADERS[1]['desc'], weapon='a slim rapier; attack pose is a straight lunge'),
]
UNITS = [
 dict(id='flameKnight', name='Sacred Flame knight (allied NPC escort, M11)', ref='ironSpear',
  desc='knight of the Order of the Sacred Flame, polished steel half-plate with white surcoat and plain crimson borders, an open steel helmet with a short white plume, a calm devout bearing',
  weapon='longsword and a white kite shield with a plain gold rim (no emblem)'),
 dict(id='pilgrim', name='pilgrim (civilian to protect, M11)', ref='eric',
  desc='a refugee pilgrim walking with the procession, plain undyed wool robe with a hood, a crimson cord around the waist, a small hand lantern, a bundle on the back, sandals; tired but hopeful',
  weapon='no weapon — the attack column is a flinch holding the lantern up'),
 dict(id='ashRaider', name='ash raider (enemy, M11 night)', ref='eric',
  desc='a night raider who preys on travellers where the old ward has weakened, soot-smeared leather and mismatched scraps of armor, a dark-red cloth tied over the lower face, wild unkempt hair',
  weapon='a heavy cleaver-like falchion'),
 dict(id='monasteryGuard', name='monastery guard (enemy, M12)', ref='ironSpear',
  desc='a guard of the Silent Monastery, a grey hooded habit worn over mail, a plain bronze-colored mask covering the upper face (vow of silence), soft felt boots for silent steps',
  weapon='a long quarterstaff shod with iron'),
 dict(id='abbot', name='the abbot-inquisitor of the Silent Monastery (enemy captain, M12)', ref='eric',
  desc='the stern abbot of the Silent Monastery, an elderly gaunt man in black-and-grey layered habits with a high collar, a plain iron chain belt, a heavy book-shaped iron reliquary hanging at the hip (no symbols), a lit torch in one hand',
  weapon='a flanged iron mace in the other hand; attack pose swings the mace'),
 dict(id='maskedRaider', name='masked raider (enemy, M14 summit)', ref='eric',
  desc='a disciplined masked raider, dark charcoal coat over black lamellar, a smooth featureless pale mask, a grey cord knotted at the wrist, no colors of any faction',
  weapon='a short arming sword and a small round black buckler'),
]

def char_jobs():
    J = []
    for c in (LEADER, RECRUIT):
        for e in cp.EXPR:
            if e == 'neutral':
                refs = 'style_aren_neutral.png, ref_bust_baldrick_neutral.png'
                prompt = cp.BUST_B.format(desc=c['desc'], expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"
                prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
            J.append(dict(id=c['id'], kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768',
                      refs=f"bust_{c['id']}_neutral.png (your approved result), ref_sprite_{c['ref']}.png",
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    for c in LEADER_SHEETS:
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=f"{c['bust']}, ref_sprite_{c['ref']}.png",
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    for c in UNITS:
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=f"ref_sprite_{c['ref']}.png, style_aren_neutral.png",
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

# ---- places: the pilgrim village and its rooms (PROPOSED; D-068 §7) ----
HUB = dict(id='hub_pilgrim', title='pilgrim village below the Sacred Flame cathedral (M11–M12)',
 scene=("A hillside pilgrim village below the great cathedral of the Order of the Sacred Flame in the warm south, at dusk with many lanterns lit. Across the top rows the "
        "pale limestone front of the cathedral with wide steps and tall CLOSED bronze-colored doors (no symbols). Whitewashed houses with red clay roofs and gold-trimmed "
        "wooden balconies, plain crimson cloth banners (no emblems), olive trees and cypresses. Top-left a pilgrims' smithy with an open forge front; top-right a relief "
        "apothecary with herbs and jars by the door. Just below the cathedral steps, left of center a small wayside chapel with a bell gable, right of center a narrow "
        "copyists' house with tall shuttered windows; the cathedral steps come down between them into the plaza. Middle-left a long two-storey pilgrims' hostel; middle-right the Order's hospice (house of relief) with a wide arched door "
        "and benches for the sick outside. In the center a wide paved plaza around a great stone brazier holding a large living flame, with a ring of lantern posts and the "
        "legion's map table under a small canvas awning at one side. Bottom-left a small village house; bottom-center-left a camp of pilgrims' tents with a cook fire; "
        "bottom-right a relief granary with sacks and carts. The road comes up the hill at the bottom center. Peaceful, warm, devout; ivory, gold and crimson with deep blue dusk sky light. "
        "Match the style of the attached approved hubs."),
 regions=[('CATHEDRAL FRONT (wide steps, closed doors)', 0, 0, 24, 2, 'wall'), ('PILGRIM SMITHY (open forge)', 1, 2, 5, 3, 'bldg'), ('RELIEF APOTHECARY (item shop)', 18, 2, 5, 3, 'bldg'),
          ('PILGRIMS HOSTEL (2 storeys)', 1, 7, 5, 3, 'bldg'), ('HOSPICE (house of relief, arched door)', 18, 7, 5, 3, 'bldg'), ('PLAZA (great flame brazier, lantern ring)', 8, 5, 8, 7, 'open'),
          ('GREAT FLAME BRAZIER', 11, 8, 2, 2, 'solid'), ('MAP TABLE under awning', 8, 7, 2, 1, 'solid'), ('HOUSE', 1, 12, 4, 2, 'bldg'), ('PILGRIM TENTS (cook fire)', 6, 12, 4, 2, 'solid'),
          ('RELIEF GRANARY (sacks, carts)', 18, 12, 5, 2, 'bldg'), ('WAYSIDE CHAPEL', 7, 2, 3, 2, 'bldg'), ('COPYISTS HOUSE', 14, 2, 3, 2, 'bldg'), ('hillside edge — low stone wall, cypresses', 0, 15, 24, 1, 'wall')],
 doors=[(3, 4), (20, 4), (3, 9), (20, 9), (2, 13), (20, 13), (8, 3), (15, 3)], entrance=(11, 15, 2))
ROOMS = [
 dict(id='int_pilgrim_hostel', family='pilgrim', kind='barracks', anchor=True, ext='hub_pilgrim.jpg (your approved result)', used='pilgrims hostel', title='pilgrims hostel — common hall',
  scene=("Inside the pilgrims' hostel: whitewashed walls with a band of plain crimson paint, a low timber ceiling, rows of simple straw beds with grey blankets, a long table "
         "with bread and a water jug, a niche with a small oil lamp burning, pilgrims' staffs leaning by the wall. Warm lamplight and blue dusk through a small window."),
  regions=[('ROW OF STRAW BEDS', 1, 2, 3, 1), ('LAMP NICHE', 5, 2, 1, 1), ('WATER JUG + BREAD TABLE', 4, 4, 3, 1), ('STAFF RACK', 9, 2, 2, 1)],
  chests=[('a', 1, 4, 'pilgrim_trunk'), ('b', 10, 2, 'pilgrim_trunk')]),
 dict(id='int_pilgrim_smithy', family='pilgrim', kind='weapon', ext='hub_pilgrim.jpg (your approved result)', used='pilgrim smithy (weapon shop)', title='pilgrim smithy',
  scene=("Inside the pilgrims' smithy (same construction as the approved hostel): a small forge with coals, an anvil, racks of plain maces, poleaxes and round white "
         "shields with gold rims (no emblem), horseshoes and pilgrim staff ferrules on the wall, a sales counter, the smith's floor behind it."),
  regions=[('FORGE', 1, 2, 2, 2), ('ANVIL + quench', 3, 2, 1, 2), ("SMITH'S FLOOR (behind counter)", 4, 2, 4, 2), ('SALES COUNTER', 4, 4, 4, 1), ('POLEAXE + MACE RACKS', 9, 2, 2, 2), ('SHIELD STAND', 10, 4, 1, 1)],
  npc=(6, 3, 'SMITH stands here'), chests=[]),
 dict(id='int_pilgrim_apothecary', family='pilgrim', kind='item', ext='hub_pilgrim.jpg (your approved result)', used='relief apothecary (item shop)', title='relief apothecary',
  scene=("Inside the relief apothecary (same construction as the approved hostel): shelves of clay pots and glass vials, drying herb bundles from the beams, a mortar and "
         "brass scale on the counter, rolled linen bandages, a small oil lamp burning in a niche."),
  regions=[('HERB BUNDLES', 1, 2, 2, 1), ('BANDAGE SHELF', 1, 4, 1, 1), ('STOCK FLOOR (behind counter)', 4, 2, 4, 2), ('COUNTER (mortar, scale)', 4, 4, 4, 1), ('POT SHELVES', 9, 2, 2, 2)],
  npc=(5, 3, 'APOTHECARY stands here'), chests=[]),
 dict(id='int_pilgrim_hospice', family='pilgrim', kind='quarters', ext='hub_pilgrim.jpg (your approved result)', used="the Order's hospice (house of relief)", title='hospice — house of relief',
  scene=("Inside the Order's hospice (same construction as the approved hostel, larger and brighter): clean cots with white sheets separated by linen curtains, a long table "
         "of basins and folded cloths, a tall wall cabinet of medicines, a small brazier with a living flame on a stand, a ledger desk by the entrance (no readable writing)."),
  regions=[('COTS + CURTAINS', 1, 2, 3, 2), ('MEDICINE CABINET', 5, 2, 2, 1), ('BASIN TABLE', 5, 4, 3, 1), ('FLAME BRAZIER on stand', 9, 2, 1, 1), ('LEDGER DESK', 9, 4, 2, 1)],
  chests=[('a', 10, 2, 'relief_chest')]),
 dict(id='int_pilgrim_house', family='pilgrim', kind='house', ext='hub_pilgrim.jpg (your approved result)', used='village house', title='village house',
  scene=("Inside a small whitewashed village house (same construction as the approved hostel): a wooden bed with a woven blanket, a table with olives and a jug, a clay oven, "
         "a loom with half-woven crimson cloth, dried peppers hanging, a small window on the dusk."),
  regions=[('BED', 1, 2, 2, 2), ('TABLE', 4, 3, 2, 1), ('CLAY OVEN', 8, 2, 2, 1), ('LOOM', 10, 2, 1, 2)],
  chests=[('a', 1, 4, 'olive_chest')]),
 dict(id='int_pilgrim_granary', family='pilgrim', kind='store', ext='hub_pilgrim.jpg (your approved result)', used='relief granary', title='relief granary',
  scene=("Inside the relief granary (same construction as the approved hostel): stacked grain sacks, clay storage jars, a hand cart, bundles of firewood, wooden scoops, "
         "a wide loading door with dusk light, a lantern on a hook."),
  regions=[('GRAIN SACKS', 1, 2, 2, 2), ('STORAGE JARS', 4, 2, 2, 1), ('FIREWOOD', 7, 2, 2, 1), ('HAND CART', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'relief_crate'), ('b', 3, 4, 'relief_crate')]),
 dict(id='int_pilgrim_chapel', family='pilgrim', kind='quarters', ext='hub_pilgrim.jpg (your approved result)', used='wayside chapel', title='wayside chapel',
  scene=("Inside a small wayside chapel (same construction as the approved hostel, a little taller): plain wooden benches in two short rows, a simple stone altar table "
         "with a small brazier holding a living flame, rows of votive candles on a stepped shelf, a woven crimson runner down the aisle, a narrow arched window on the dusk. No symbols."),
  regions=[('ALTAR TABLE + FLAME', 5, 2, 2, 1), ('VOTIVE CANDLES', 8, 2, 2, 1), ('BENCHES (left)', 2, 3, 3, 2), ('BENCHES (right)', 7, 3, 3, 2)],
  chests=[('a', 1, 2, 'relief_chest')]),
 dict(id='int_pilgrim_copyists', family='pilgrim', kind='quarters', ext='hub_pilgrim.jpg (your approved result)', used="copyists' house", title="copyists' house",
  scene=("Inside the copyists' house (same construction as the approved hostel): slanted writing desks with blank parchment sheets and ink pots, quills, shelves of "
         "bound books with plain covers (no readable writing), a drying line with blank pages, a lamp on each desk, a press for binding."),
  regions=[('WRITING DESKS', 1, 2, 4, 1), ('BOOK SHELVES', 7, 2, 3, 1), ('DRYING LINE', 1, 4, 3, 1), ('BINDING PRESS', 10, 3, 1, 2)],
  chests=[('a', 6, 4, 'pilgrim_trunk')]),
]
CHESTS = [
 ('pilgrim_trunk', 'pilgrims hostel', "a pilgrim's travel trunk of pale wood with leather straps and a crimson cord tied around it"),
 ('relief_chest', 'hospice', 'a white-painted medicine chest with plain gold-colored corners and a simple brass latch (no symbols)'),
 ('olive_chest', 'village house', 'a small olive-wood chest with a carved vine pattern along the lid edge'),
 ('relief_crate', 'relief granary', 'a sturdy relief crate of rough planks with a crimson cloth band nailed around it (no letters)'),
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
              refs=f"layout_{HUB['id']}.png, scale_reference.png, sprite_eric_sheet.png, approved_hub_castletown.jpg, approved_hub_velmar.jpg",
              prompt=hp.HUB_COMMON+f"\nScene: {HUB['scene']}")]
    anchor = ROOMS[0]
    for r in ROOMS:
        refs = [f"layout_{r['id']}.png", 'scale_reference_interior.png', r['ext']]
        refs += ['approved_int_port_tavern.jpg'] if r is anchor else [f"{anchor['id']}.jpg (your approved result)"]
        cl = ''.join(f" Chest tile {c[0]} at column {c[1]}, row {c[2]} (0-based) stays empty floor." for c in r['chests'])
        J.append(dict(id=r['id'], kind='interior', file=f"{r['id']}.jpg", size='1536x1024', refs=', '.join(refs),
                      prompt=iwp.INT_COMMON+f"\nScene: {r['scene']}{cl}"+("\nThis image becomes the style anchor for this village's rooms." if r is anchor else
                             f"\nMatch the walls, floor, light and scale of the attached approved {anchor['id']}.jpg.")))
    cells = ''.join(f"  {i+1}. {sid} ({where}): {desc}.\n" for i, (sid, where, desc) in enumerate(CHESTS))
    J.append(dict(id='chests_pilgrim', kind='chests', file='chests_pilgrim.png', size='1024x512',
                  refs='layout_chests_pilgrim.png, approved_chests_act2.png, int_pilgrim_hostel.jpg (your approved result)',
                  prompt=iwp.CHEST_PROMPT.replace('12 different', '4 different').replace('Canvas 1536x1024, a 6-column x 4-row grid', 'Canvas 1024x512, a 4-column x 2-row grid')
                         .replace('layout_chests.png', 'layout_chests_pilgrim.png').replace('(int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg)', '(int_pilgrim_hostel.jpg)')
                         + "Row 1 = chests 1-4 closed, row 2 = chests 1-4 open (empty), each open cell lined up exactly with the closed cell above it.\n" + cells))
    return J

def start_here(CJ, PJ):
    L = []; w = L.append
    w('# Ashen Crown — ACT II Part 2 Art Work Order (pack D, v0.7)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs in order and return the zips described in section 6.')
    w('This pack has two parts: **characters** (the Order of the Sacred Flame and the summit of the three banners) and **places** (a pilgrim village below the Sacred Flame cathedral, its rooms and chests).')
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
    w('## 3. Global rules')
    w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Places: {iwp.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, banners, books, signs, crates). The Order is told apart by colors only: ivory/white, gold trim, crimson.')
    w('- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer\'s right.')
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached `ref_sprite_*.png` (shown at half size).')
    w('- Town map and rooms follow the layout sketches (24×16 tiles of 64 px; rooms 12×8 tiles of 128 px). **No people and no animals** in them; every enterable building shows one front door at its DOOR tile; CHEST and SHOPKEEPER tiles stay empty floor.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 4. Order of work')
    w('')
    w('1. `lucien` neutral bust → concerned / determined / sad → `sprite_lucien.png`.')
    w('2. `ines` neutral bust → three expressions → `sprite_ines.png`.')
    w('3. `sprite_cassian.png`, `sprite_leonora.png` from their attached approved busts (pack B).')
    w('4. The six unit sheets. They must be told apart by color at small size: Sacred Flame knight = white and steel with crimson borders; pilgrim = undyed wool with a crimson cord; ash raider = soot-black with a dark-red face cloth; monastery guard = grey habit with a bronze mask; abbot = black-and-grey with a torch; masked raider = charcoal and black with a pale featureless mask.')
    w('5. `hub_pilgrim` (style anchor of the south) → its eight rooms, `int_pilgrim_hostel` first → `chests_pilgrim`.')
    w('')
    w('## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md)')
    w('')
    w('- [ ] 8 busts at exactly 1024×1280 and 10 sheets at exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] The hub and 8 rooms are exactly 1536×1024 RGB JPEG quality 92–95; `chests_pilgrim.png` exactly 1024×512 PNG.')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere. No people or animals in the hub and rooms.')
    w('- [ ] Each character\'s four busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust.')
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] Hub matches its sketch (cathedral front at the top, doors at DOOR tiles, plaza open around the great brazier, road at the bottom center); rooms match their sketches; doorway at bottom-row tiles 5–6.')
    w('- [ ] Chest sheet: 4 chests, open cells lined up with closed cells, open chests empty.')
    w('')
    w('## 6. Return format — **three zips, each under 20 MB**')
    w('')
    w(f'- `{NAME}_D1.zip` — `lucien` and `ines`: 8 busts and 2 sheets, plus `sprite_cassian.png` and `sprite_leonora.png`')
    w(f'- `{NAME}_D2.zip` — the 6 unit sheets')
    w(f'- `{NAME}_D3.zip` — `hub_pilgrim.jpg`, 8 rooms and `chests_pilgrim.png`')
    w('')
    w('```')
    w(f'{NAME}_D1/   (and _D2, _D3 the same way)')
    w('  png/ or img/      # PNG masters for characters (png/), JPEG/PNG for places (img/)')
    w('  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · places: id,kind,path,width,height,bytes,sha256')
    w('  SHA256SUMS.txt    # sha256  path')
    w('  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations')
    w('  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/     # the exact final prompt per image')
    w('```')
    w('')
    w('- If a zip would exceed 20 MB, split it again (`_D3a`, `_D3b`), each with its own manifest and checksums. Do not include WebP.')
    w('- Reopen each zip and verify every file against its SHA256SUMS before finishing; report each zip\'s size.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 D (ACT II 후반, {TOTAL}장)

ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

## A. 한 번에 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all {TOTAL} images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return the three zips {NAME}_D1/_D2/_D3 (each under 20 MB) exactly as described in section 6.
```

## B. 루시안과 이네스를 먼저 보고 결정하기
```
Attached is a work pack. Read 00_START_HERE.md first. Do only the two neutral busts of lucien and ines now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 `Approved. Continue with all remaining jobs and return the zips described in section 6.`를 보냅니다.

## 받은 뒤
- ZIP(_D1, _D2, _D3)을 Claude에게 주세요. 한 개씩 와도 됩니다.
- 그림이 오기 전에는 게임이 그린 임시 인물과 기존 거점 그림으로 먼저 개발합니다. 받으면 SHA256을 검증하고 교체합니다.

## 인물 (모두 PROPOSED — 생김새, 이름 모두 바꿀 수 있습니다)
| id | 인물 | 생김새 요점 |
|---|---|---|
| `lucien` | 루시안 아케인, 성화 교단 대사제 | 50대 초반, 어깨까지 오는 은발과 짧은 은빛 수염, 호박색 눈, 흰·상아색 제의에 금 테두리와 진홍 영대, 작은 불꽃이 든 놋쇠 등불 지팡이 |
| `ines` | 이네스, 성화 순례 수호자 (새 동료) | 30세 전후, 짧은 검은 머리에 가는 땋은 머리 한 가닥, 콧등 흉터, 흰 양모 겉옷에 진홍 테두리, 금빛 띠, 둥근 흰 방패, 도끼창 |
| `cassian`, `leonora` | 카시안·레오노라 맵 그림 | 팩 B에서 승인된 반신을 그대로 맵 인물로 (M14 회담) |

맵 시트만 그리는 병종 6종:
- 성화 기사 (동맹)
- 순례자 (보호 대상)
- 재 약탈단 (M11)
- 수도원 경비 (M12)
- 침묵의 원장 (M12 지휘관)
- 가면 습격대 (M14)

## 장소
| id | 장소 | 건물 |
|---|---|---|
| `hub_pilgrim` | 성화 대성당 아래 순례자 마을 (해 질 녘, 등불) | 순례자 대장간·구호 약재상(상점), 순례자 숙소, 교단 구호원, 길가 예배당, 필사가의 집, 민가, 구호 곡물 창고, 순례자 천막(바깥) |

상자 4종: 순례자 여행 궤, 구호원 약상자, 올리브나무 궤, 구호 상자.
"""

def ref_png(src, dst, size=None):
    im = Image.open(src).convert('RGBA')
    if size: im = im.resize(size, Image.LANCZOS)
    im.save(dst, optimize=True)

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    for n in ('style_aren_neutral.png', 'scale_reference.png', 'sprite_eric_sheet.png'): Image.open(OLD/n).save(refs/n, optimize=True)
    ref_png(ROOT/'src/assets/portraits/bust_baldrick_neutral.webp', refs/'ref_bust_baldrick_neutral.png')
    for who in ('cassian', 'leonora'): ref_png(ROOT/f'src/assets/portraits/bust_{who}_neutral.webp', refs/f'bust_{who}_neutral.png')
    for s in ('eric', 'ironSpear'): ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    hp.hub_sketch(HUB).save(refs/f"layout_{HUB['id']}.png", optimize=True)
    for r in ROOMS: iwp.layout_sketch(r).save(refs/f"layout_{r['id']}.png", optimize=True)
    chest_layout().save(refs/'layout_chests_pilgrim.png', optimize=True)
    iwp.scale_reference().save(refs/'scale_reference_interior.png', optimize=True)
    for hub in ('hub_castletown', 'hub_velmar'): iwp.ext_jpg(ROOT/f'src/assets/hubs/{hub}.webp', refs/f'approved_{hub}.jpg')
    iwp.ext_jpg(ROOT/'src/assets/rooms/int_port_tavern.webp', refs/'approved_int_port_tavern.jpg')
    sheet = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    for i, f in enumerate(sorted((ROOT/'src/assets/chests').glob('*_closed.webp'))[:16]):
        im = Image.open(f).convert('RGBA').resize((256, 256)); sheet.paste(im, ((i % 4)*256, (i//4)*256), im)
    sheet.save(refs/'approved_chests_act2.png', optimize=True)
    CJ, PJ = char_jobs(), place_jobs()
    (PACK/'00_START_HERE.md').write_text(start_here(CJ, PJ), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(CJ)+len(PJ))), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(CJ+PJ, 1):
            stem = Path(j['file']).stem if j in CJ else j['id']
            wr.writerow([i, j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{stem}.txt"])
    for i, j in enumerate(CJ, 1):
        (PACK/'prompts'/f"{i:02d}_{Path(j['file']).stem}.txt").write_text(f"{j['prompt']}\n{cp.STYLE}\nAttach: {j['refs']}.\n", encoding='utf-8')
    for i, j in enumerate(PJ, len(CJ)+1):
        fmt = 'one PNG with transparency (or pure #00FF00 background)' if j['kind'] == 'chests' else 'one JPEG (quality 92-95)'
        st = iwp.STYLE if j['kind'] != 'hub' else iwp.STYLE.replace("rooms, furniture designs", "map, town")
        (PACK/'prompts'/f"{i:02d}_{j['id']}.txt").write_text(f"{j['prompt']}\n{st}\nAttach: {j['refs']}.\nOutput: {fmt}, exactly {j['size']} px.\n", encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v070_ACT2B_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK, len(CJ), 'character jobs +', len(PJ), 'place jobs')

if __name__ == '__main__':
    main()
