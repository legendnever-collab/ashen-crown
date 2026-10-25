#!/usr/bin/env python3
"""Build the ChatGPT work pack for v0.6 painted building interiors and environment chests (D-056).

Writes docs/v0.6.0/art/interior-work-pack/{00_START_HERE.md, README_KO.md, jobs.csv, prompts/*.txt,
references/*} including the layout sketches (generated here from INTERIORS below).
Usage: python3 scripts/make-interior-work-pack.py [--zip <out.zip>]
"""
import csv, io, sys, zipfile, shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT/'docs/v0.6.0/art/interior-work-pack'
PACK_NAME = 'Ashen_Crown_v060_Interior_Art_Pack'
OLD_REFS = ROOT/'docs/v0.5.0/art/world-work-pack/references'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
T = 128            # image pixels per tile (the game draws interiors at 64 px per tile)
W, H = 12, 8       # tiles
DOOR = (5, 6)      # bottom-row door tiles

STYLE = ("Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — "
         "hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, "
         "rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, "
         "furniture designs, emblems or layout.")

INT_COMMON = (
 "Attached layout_int_*.png is a LAYOUT SKETCH for a walkable building interior in a classic tactical RPG: a 12x8 grid of 128-pixel tiles "
 "(the game shows it at half size). Keep every labelled area in the same place and roughly the same size; the labels are for you only — paint no text.\n"
 "View: a high three-quarter top-down angle (about 60 degrees) like classic tactical RPG interiors. The front face of the BACK WALL is visible across the top two tile rows "
 "(windows, shelves, hangings, a fireplace may sit on it); thin SIDE WALLS run down the far left and right tile columns; there is NO front wall — the bottom edge is cut away "
 "like a stage set so the whole floor is visible, except a 2-tile-wide doorway / opening at the bottom center (bottom-row tiles 5-6, x 640-896 px) that clearly reads as the way out. "
 "No ceiling, no roof beams across the floor, no perspective vanishing point, no sky.\n"
 "Scale (see scale_reference_interior.png): one tile is 128 px; a standing adult is about 120-140 px tall; a bed is about 2 tiles long; a chest is about 1 tile.\n"
 "The floor marked OPEN must stay flat, evenly lit and uncluttered — characters walk there. Keep furniture inside its labelled box.\n"
 "CHEST tiles (gold boxes): leave each one as EMPTY FLOOR with at most a faint worn patch — the game draws the chest there so it can open. Do NOT paint a chest, box or crate in a CHEST tile.\n"
 "SHOPKEEPER tile (blue circle), if any: leave it as empty floor behind the counter — the game draws the person.\n"
 "Paint NO people and NO animals. No text, letters, numbers or symbols on signs, books, banners or maps (maps show painted terrain only). No UI, no grid lines, no frame, no vignette.")

# ---- interior catalog (PROPOSED). Regions are (label, x, y, w, h) in tiles; chests (id, x, y, style). ----
INTERIORS = [
 dict(id='int_village_house', family='village', kind='house', anchor=True, ext='exterior_village_day.jpg',
  used='village / village_raid: residence-3 (민가)', title='village house — a farming family home',
  scene=("Inside a timber-and-plaster farmhouse in the eastern border village on a clear morning. Plank floor with a woven rug, whitewashed walls "
         "with dark timber beams, a small window with sunlight, a stone cooking hearth with a hanging iron pot, a wooden table with two stools, "
         "a bed with a patchwork quilt, a painted cupboard with plates, dried herbs and onions hanging from the back wall. Warm, simple, lived-in."),
  regions=[('BED (patchwork quilt)', 1, 2, 2, 2), ('TABLE + 2 stools', 4, 3, 2, 1), ('COOKING HEARTH (pot)', 8, 2, 2, 1), ('CUPBOARD', 10, 2, 1, 2)],
  chests=[('a', 1, 4, 'village_chest')]),
 dict(id='int_village_forge', family='village', kind='weapon', ext='exterior_village_day.jpg',
  used='village / village_raid: forge (대장간, 무기점)', title='village blacksmith — weapon shop',
  scene=("Inside the village blacksmith's workshop. A stone forge with glowing coals under a chimney hood and leather bellows, an anvil and a quench tub, "
         "racks of swords, spears and axes and a few round shields on the right wall, an armor stand, a sturdy wooden sales counter with blades laid out on cloth, "
         "the smith's work floor behind the counter. Warm orange forge glow mixed with morning light from a high window; soot on the timber walls."),
  regions=[('FORGE (coals, hood, bellows)', 1, 2, 2, 2), ('ANVIL + quench tub', 3, 2, 1, 2), ("SMITH'S WORK FLOOR (behind counter)", 4, 2, 4, 2),
           ('SALES COUNTER (blades on cloth)', 4, 4, 4, 1), ('WEAPON RACKS', 9, 2, 2, 2), ('ARMOR STAND', 10, 4, 1, 1)],
  npc=(6, 3, 'SMITH stands here'), chests=[]),
 dict(id='int_village_shop', family='village', kind='item', ext='exterior_village_day.jpg',
  used='village / village_raid: shop (도구점)', title='village item shop — herbs, potions and tools',
  scene=("Inside the village item shop. Shelves of colored potion bottles and herb jars on the back wall, bundles of drying herbs hanging from a rack, "
         "a glass-fronted potion cabinet, barrels and sacks, rope coils and lanterns for sale, a polished wooden counter with a small brass scale and a ledger with blank pages. "
         "Cozy and orderly, soft morning light through a window."),
  regions=[('HERB DRYING RACK', 1, 2, 2, 1), ('BARRELS + sacks', 1, 4, 1, 1), ('STOCK FLOOR (behind counter)', 4, 2, 4, 2),
           ('COUNTER (scale, blank ledger)', 4, 4, 4, 1), ('POTION CABINET', 9, 2, 2, 2)],
  npc=(5, 3, 'MERCHANT stands here'), chests=[]),
 dict(id='int_village_barracks', family='village', kind='barracks', ext='exterior_village_day.jpg',
  used='village / village_raid: inn-1 (병영)', title='village militia barracks',
  scene=("Inside the village militia barracks, a long timber room. Three wooden double bunk beds with wool blankets along the back wall, pegs with cloaks and "
         "kettle helmets above them, a long plain table with benches in the middle, a spear rack, a few boots and a water barrel. Plain, practical, morning light."),
  regions=[('BUNK BED', 1, 2, 2, 1), ('BUNK BED', 4, 2, 2, 1), ('BUNK BED', 7, 2, 2, 1), ('LONG TABLE + benches', 4, 4, 3, 1), ('SPEAR RACK', 10, 4, 1, 1)],
  chests=[('a', 1, 4, 'militia_locker'), ('b', 10, 2, 'militia_locker')]),
 dict(id='int_village_hall', family='village', kind='quarters', ext='exterior_village_day.jpg',
  used="village / village_raid: warroom-2 (지휘관 숙소 / elder's hall)", title="elder's hall — council room",
  scene=("Inside the village elder's hall, used as the garrison's command quarters. A long council table with an unrolled painted terrain map (no writing), candles and "
         "wooden markers, high-backed chairs, a tall bookshelf with bound books (no visible titles), a stone fireplace on the back wall, a plain woven tapestry "
         "with an abstract pattern (no emblem), a worn rug. Dignified but rustic."),
  regions=[('BOOKSHELF', 1, 2, 1, 3), ('COUNCIL TABLE (painted map, candles)', 4, 3, 4, 2), ('FIREPLACE', 8, 2, 2, 1)],
  chests=[('a', 10, 4, 'elder_coffer')]),
 dict(id='int_village_store', family='village', kind='store', ext='exterior_village_day.jpg',
  used='village / village_raid: depot-4 (보급 창고)', title='village supply storehouse',
  scene=("Inside the village supply storehouse, a timber barn-like room. Stacked wooden crates, barrels, piled grain sacks, coils of rope, farm tools (hoes, rakes, "
         "scythe) leaning on the right wall, hanging lanterns and dried meats, straw on the plank floor. Dusty sunbeams from a gap in the boards."),
  regions=[('CRATE STACK', 1, 2, 2, 2), ('BARRELS', 4, 2, 2, 1), ('GRAIN SACKS', 7, 2, 2, 1), ('FARM TOOLS', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'grain_bin'), ('b', 3, 4, 'grain_bin')]),

 dict(id='int_tent_soldier', family='tent', kind='barracks', anchor=True, ext='exterior_garrison.jpg',
  used='garrison inn-3 · bivouac inn-1, inn-3 · oathcamp inn-1, inn-3 (병사 천막)', title='soldier tent',
  scene=("Inside a large military canvas tent of the border garrison. Sloping cream canvas walls held by wooden poles and ropes (the back wall is the canvas slope), "
         "a packed-earth floor with rush mats and a worn rug in the middle, three low camp cots with rolled bedrolls along the back, an armor stand with a shield, "
         "helmets and cloaks hanging from the pole, a hanging oil lantern giving warm light with soft daylight glowing through the canvas."),
  regions=[('CAMP COT + bedroll', 1, 2, 2, 1), ('CAMP COT + bedroll', 4, 2, 2, 1), ('CAMP COT + bedroll', 7, 2, 2, 1), ('ARMOR STAND + shield', 10, 4, 1, 1)],
  chests=[('a', 1, 4, 'field_locker'), ('b', 10, 2, 'field_locker')]),
 dict(id='int_tent_triage', family='tent', kind='barracks', ext='exterior_garrison.jpg',
  used='garrison inn-1 (구호 천막 · TRIAGE)', title='triage tent',
  scene=("Inside the garrison triage tent (same canvas tent construction as the approved soldier tent). Three camp cots with clean white sheets along the back, "
         "plain red cloth strips tied on the tent poles (no symbols), a medicine table with rolled bandages, bottles, a mortar and pestle and a wash basin, "
         "bundles of herbs drying on a line, a folding screen. Clean and calm, lantern light and daylight through the canvas."),
  regions=[('COT (white sheets)', 1, 2, 2, 1), ('COT', 4, 2, 2, 1), ('COT', 7, 2, 2, 1), ('MEDICINE TABLE + basin', 9, 4, 2, 1)],
  chests=[('a', 1, 4, 'medic_chest'), ('b', 10, 2, 'medic_chest')]),
 dict(id='int_tent_command', family='tent', kind='quarters', ext='exterior_garrison.jpg',
  used='garrison · bivouac · oathcamp warroom-2 (지휘 천막)', title='command tent',
  scene=("Inside the largest command tent (same canvas construction as the approved soldier tent, taller and richer). A big campaign map table with a painted terrain map "
         "(no writing), wooden unit markers and a brass compass, a folding writing desk with a chair, inkwell and sealed letters, a plain dark cloth banner on a stand "
         "(no emblem, no letters), an armor stand, a rug, two hanging lanterns."),
  regions=[('WRITING DESK + chair', 1, 2, 2, 1), ('MAP TABLE (painted map, markers)', 4, 3, 4, 2), ('PLAIN BANNER STAND', 9, 2, 1, 1)],
  chests=[('a', 10, 4, 'officer_strongbox')]),
 dict(id='int_tent_operations', family='tent', kind='quarters', ext='exterior_garrison.jpg',
  used='garrison · bivouac · oathcamp warroom-4 (작전 천막)', title='operations tent',
  scene=("Inside the operations tent (same canvas construction as the approved soldier tent). A sand table with a small sculpted terrain model of hills and a river "
         "and little wooden flags without symbols, a tall rack of pigeonholes full of rolled scrolls, a long messenger desk with satchels and a candle, "
         "a chalkless slate board on an easel (blank), lantern light."),
  regions=[('SCROLL RACK (pigeonholes)', 1, 2, 1, 3), ('SAND TABLE (terrain model)', 4, 3, 3, 2), ('MESSENGER DESK', 8, 2, 3, 1)],
  chests=[('a', 10, 4, 'document_coffer')]),
 dict(id='int_tent_supply', family='tent', kind='store', ext='exterior_garrison.jpg',
  used='garrison · bivouac · oathcamp depot-5 (보급 천막)', title='supply tent',
  scene=("Inside the quartermaster's supply tent (same canvas construction as the approved soldier tent). Stacked army supply crates, barrels of water and salted "
         "meat, piled sacks of flour, bundles of spears and arrows tied with cord, coils of rope and spare tent stakes, a hanging lantern."),
  regions=[('SUPPLY CRATES', 1, 2, 2, 2), ('BARRELS', 4, 2, 2, 1), ('FLOUR SACKS', 7, 2, 2, 1), ('BUNDLED SPEARS', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'supply_crate'), ('b', 3, 4, 'supply_crate')]),

 dict(id='int_fort_barracks', family='fortress', kind='barracks', anchor=True, ext='exterior_fortress.jpg',
  used='fortress inn-1, inn-3 (병영 · 병영 별채)', title='fortress barracks',
  scene=("Inside a barracks room of an old reclaimed stone fortress. Rough grey stone walls with a narrow arrow-slit window and an iron wall torch, "
         "flagstone floor with some straw, three heavy oak bunk frames with wool blankets along the back wall, a long trestle table with benches, "
         "weapon pegs, damp patches and a little moss in the corners, recently cleaned up by a small garrison. Cold stone greys with warm torch light."),
  regions=[('OAK BUNK', 1, 2, 2, 1), ('OAK BUNK', 4, 2, 2, 1), ('OAK BUNK', 7, 2, 2, 1), ('TRESTLE TABLE + benches', 4, 4, 3, 1)],
  chests=[('a', 1, 4, 'fort_locker'), ('b', 10, 2, 'fort_locker')]),
 dict(id='int_fort_armory', family='fortress', kind='store', ext='exterior_fortress.jpg',
  used='fortress depot-5 (무기고 · ARMORY)', title='fortress armory',
  scene=("Inside the fortress armory (same stone construction as the approved fortress barracks). Long weapon racks of spears and halberds along the back wall, "
         "two armor stands with old mail and helmets, a grindstone, round and kite shields hung on the wall in a row (plain, no emblems), bundles of arrows, "
         "an iron-banded door frame, torch light on stone."),
  regions=[('WEAPON RACKS', 1, 2, 4, 1), ('ARMOR STANDS', 6, 2, 2, 1), ('GRINDSTONE', 9, 2, 1, 1), ('ARROW BUNDLES', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'armory_chest'), ('b', 3, 4, 'armory_chest')]),
 dict(id='int_fort_records', family='fortress', kind='quarters', ext='exterior_fortress.jpg',
  used='fortress warroom-2 (기록실 · RECORDS HALL)', title='fortress records hall',
  scene=("Inside the records hall of the fortress keep (same stone construction as the approved fortress barracks). Tall dark-wood shelves packed with ledgers, "
         "rolled scrolls and document boxes (no readable writing), a reading lectern, cabinets, a long reading desk with candles, an inkwell and loose sheets "
         "(blank or with illegible scribbles only), dust in a shaft of light from a high window. Quiet and secretive."),
  regions=[('TALL LEDGER SHELVES', 1, 2, 4, 1), ('LECTERN', 6, 2, 1, 1), ('CABINETS', 8, 2, 2, 1), ('READING DESK + candles', 4, 4, 3, 1)],
  chests=[('a', 10, 4, 'document_coffer')]),
 dict(id='int_fort_command', family='fortress', kind='quarters', ext='exterior_fortress.jpg',
  used='fortress warroom-4 (지휘관 숙소 · COMMAND QUARTERS)', title="fortress commander's quarters",
  scene=("Inside the commander's quarters of the fortress (same stone construction as the approved fortress barracks). A large stone fireplace with a fire, "
         "a map table with a painted terrain map (no writing) and a candle stand, a plain camp bed with a grey blanket, an armor stand, a fur rug on the flagstones, "
         "a plain dark banner without emblem. Austere, warm firelight against cold stone."),
  regions=[('CAMP BED', 1, 2, 2, 1), ('MAP TABLE (painted map)', 4, 3, 3, 2), ('FIREPLACE', 8, 2, 2, 1)],
  chests=[('a', 10, 4, 'officer_strongbox')]),
]

CHEST_STYLES = [  # (style id, where, description) — 6 columns x 2 row-pairs on the sheet
 ('village_chest', 'village house', 'a painted pine blanket chest with a faded red-and-ochre folk flower pattern and a simple iron hasp'),
 ('militia_locker', 'village barracks', 'a plain oak footlocker with rope handles and a short wooden club strapped to the lid'),
 ('grain_bin', 'village storehouse', 'a rustic lidded grain bin of rough planks with a burlap sack draped over one corner and loose straw'),
 ('elder_coffer', "elder's hall", 'a carved walnut coffer with brass corners and a small brass lock plate'),
 ('field_locker', 'soldier tent', 'an army field footlocker of dark wood with two leather buckle straps and a rolled bedroll tied on top'),
 ('medic_chest', 'triage tent', 'a pale wooden field medicine chest wrapped with a white cloth band and a plain red cloth tie (no symbol), herb bundles tucked under the strap'),
 ('supply_crate', 'supply tent', 'a sturdy army supply crate of pale planks with rope handles and an iron-hinged lid'),
 ('officer_strongbox', 'command tent / commander quarters', 'a compact black iron-bound strongbox with a heavy padlock and a red wax seal on a cord'),
 ('document_coffer', 'operations tent / records hall', 'a brown leather-covered document coffer with brass clasps and two rolled maps tied to the lid'),
 ('armory_chest', 'fortress armory', 'a long heavy oak armory chest banded with dark iron, studded, with iron ring handles'),
 ('fort_locker', 'fortress barracks', 'an old dark-oak footlocker with iron studs and corner plates, a bit worn and scratched'),
 ('old_chest', 'fallback (anywhere)', 'a classic dusty old wooden treasure chest with a rounded lid, iron bands and a big keyhole'),
]

CHEST_PROMPT = (
 "Paint a SPRITE SHEET of 12 different treasure chests for the interiors of a classic tactical RPG, in the same painting style and the same high three-quarter top-down "
 "view (about 60 degrees, front face toward the viewer) as the attached approved interiors (int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg).\n"
 "Canvas 1536x1024, a 6-column x 4-row grid of 256x256 cells (see layout_chests.png; paint no grid lines and no text).\n"
 "Rows 1 and 3: each chest CLOSED. Rows 2 and 4: the SAME chest OPEN — lid raised, the inside visible, EMPTY (dark wood, no coins, no items, no glow) — "
 "at exactly the same position, size and angle as the closed chest directly above it.\n"
 "Every chest: centered horizontally in its cell, chest body about 150-190 px wide, the bottom of the chest resting on a baseline 40 px above the cell bottom, "
 "a soft contact shadow, the whole chest and open lid inside the cell. Scale: in the interiors one tile is 128 px, and these chests are drawn at half size there.\n"
 "Background: fully TRANSPARENT (if impossible, flat pure green #00FF00 and nothing else). No text, letters, numbers, emblems or symbols.\n"
 "Cells, left to right:\n")

def font(sz): return ImageFont.truetype(FONT, sz)

def wrap(d, text, f, width):
    words, lines, cur = text.split(), [], ''
    for wd in words:
        t = (cur+' '+wd).strip()
        if d.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

def label(d, box, text, f, fill=(30, 24, 20)):
    x0, y0, x1, y1 = box
    lines = wrap(d, text, f, x1-x0-16)
    lh = f.size+4; y = (y0+y1)/2-len(lines)*lh/2
    for ln in lines:
        d.text(((x0+x1)/2-d.textlength(ln, font=f)/2, y), ln, font=f, fill=fill); y += lh

def layout_sketch(j):
    im = Image.new('RGB', (W*T, H*T), (232, 220, 190)); d = ImageDraw.Draw(im)
    f, fs = font(22), font(18)
    # floor
    d.rectangle((T, 2*T, (W-1)*T, (H-1)*T), fill=(214, 199, 160))
    # walls
    wall = (124, 96, 66)
    d.rectangle((0, 0, W*T, 2*T), fill=wall); d.rectangle((0, 0, T, H*T), fill=wall); d.rectangle(((W-1)*T, 0, W*T, H*T), fill=wall)
    d.rectangle((0, (H-1)*T, W*T, H*T), fill=(170, 150, 120))
    d.rectangle((DOOR[0]*T, (H-1)*T, (DOOR[1]+1)*T, H*T), fill=(140, 190, 120), outline=(30, 60, 30), width=4)
    label(d, (DOOR[0]*T, (H-1)*T, (DOOR[1]+1)*T, H*T), 'DOORWAY / EXIT (2 tiles)', f)
    label(d, (0, 0, W*T, 2*T), 'BACK WALL — its front face is visible (2 tile rows). Windows, shelves, hangings may be painted on it.', f, (245, 235, 210))
    label(d, (T, (H-1)*T, DOOR[0]*T, H*T), 'no front wall — low floor edge only', fs, (60, 50, 40))
    label(d, ((DOOR[1]+1)*T, (H-1)*T, (W-1)*T, H*T), 'no front wall — low floor edge only', fs, (60, 50, 40))
    for i, txt in ((0, 'SIDE WALL'), (W-1, 'SIDE WALL')):
        tmp = Image.new('RGBA', (5*T, T), (0, 0, 0, 0)); td = ImageDraw.Draw(tmp); label(td, (0, 0, 5*T, T), txt, f, (245, 235, 210))
        tmp = tmp.rotate(90, expand=True); im.paste(tmp, (i*T, 2*T), tmp)
    # open floor label
    label(d, (T, 5*T, (W-1)*T, 7*T), 'OPEN FLOOR — keep flat, clear and evenly lit', f, (110, 95, 70))
    for (lab, x, y, w, h) in j['regions']:
        d.rectangle((x*T+4, y*T+4, (x+w)*T-4, (y+h)*T-4), fill=(236, 226, 200), outline=(40, 30, 24), width=4)
        label(d, (x*T, y*T, (x+w)*T, (y+h)*T), lab, fs)
    for (cid, x, y, style) in j['chests']:
        d.rectangle((x*T+6, y*T+6, (x+1)*T-6, (y+1)*T-6), fill=(246, 214, 120), outline=(150, 100, 20), width=5)
        label(d, (x*T, y*T, (x+1)*T, (y+1)*T), f'CHEST {cid} — leave empty floor', fs)
    if j.get('npc'):
        x, y, lab = j['npc']
        d.ellipse((x*T+14, y*T+14, (x+1)*T-14, (y+1)*T-14), fill=(170, 200, 235), outline=(30, 60, 120), width=5)
        label(d, (x*T-40, y*T, (x+1)*T+40, (y+1)*T), lab, fs, (20, 40, 90))
    for gx in range(W+1): d.line((gx*T, 0, gx*T, H*T), fill=(0, 0, 0, 40) if False else (120, 110, 90), width=1)
    for gy in range(H+1): d.line((0, gy*T, W*T, gy*T), fill=(120, 110, 90), width=1)
    cap = f"{j['id']} — {j['title']} · layout sketch, 12x8 tiles of 128 px — composition guide only"
    d.rectangle((0, H*T-40, W*T, H*T), fill=(236, 228, 210)); d.text((16, H*T-34), cap, font=fs, fill=(30, 24, 20))
    return im

def chest_layout():
    im = Image.new('RGB', (1536, 1024), (236, 230, 214)); d = ImageDraw.Draw(im); f = font(17)
    for i, (sid, where, _) in enumerate(CHEST_STYLES):
        col, pair = i % 6, i // 6
        for state in (0, 1):
            r = pair*2+state; x0, y0 = col*256, r*256
            d.rectangle((x0, y0, x0+255, y0+255), outline=(90, 80, 60), width=2)
            d.line((x0+20, y0+216, x0+236, y0+216), fill=(200, 60, 60), width=2)
            d.rectangle((x0+48, y0+120, x0+208, y0+216), outline=(150, 110, 40), width=3)
            label(d, (x0, y0+10, x0+256, y0+110), f"{i+1}. {sid}  ({'CLOSED' if state == 0 else 'OPEN, empty'})  — {where}", f)
    d.text((10, 1000), 'layout_chests — red line = chest baseline (40 px above cell bottom). Composition guide only; paint no text.', font=font(15), fill=(40, 30, 20))
    return im

def scale_reference():
    im = Image.new('RGBA', (1536, 512), (218, 205, 168, 255)); d = ImageDraw.Draw(im); f = font(20)
    for gx in range(13): d.line((gx*T, 0, gx*T, 512), fill=(120, 110, 90), width=1)
    for gy in range(5): d.line((0, gy*T, 1536, gy*T), fill=(120, 110, 90), width=1)
    sheet = Image.open(OLD_REFS/'sprite_eric_sheet.png').convert('RGBA')
    fr = sheet.crop((0, 0, 128, 128)); fr = fr.resize((148, 148), Image.LANCZOS)  # figure ~130 px tall
    im.alpha_composite(fr, (T+(T-148)//2, 2*T+T-148+8))
    d.text((T+4, 2*T-28), 'adult ~130 px', font=f, fill=(20, 20, 20))
    d.rectangle((3*T, T, 5*T, 3*T), outline=(140, 30, 30), width=4); d.text((3*T+6, T+6), 'doorway 2 tiles (256 px)', font=f, fill=(140, 30, 30))
    d.rectangle((6*T, 2*T, 8*T, 3*T), outline=(30, 60, 140), width=4); d.text((6*T+6, 2*T+6), 'bed / cot ~2x1 tiles', font=f, fill=(30, 60, 140))
    d.rectangle((9*T, 2*T, 10*T, 3*T), outline=(150, 100, 20), width=4); d.text((9*T+6, 2*T+6), 'chest ~1 tile', font=f, fill=(150, 100, 20))
    d.text((10, 10), 'scale_reference_interior: 1 tile = 128 px in the interior painting (the game shows it at half size)', font=f, fill=(20, 20, 20))
    return im

def ext_jpg(src, dst):
    Image.open(src).convert('RGB').save(dst, 'JPEG', quality=88)

def jobs():
    J = []
    anchors = {j['family']: j['id'] for j in INTERIORS if j.get('anchor')}
    order = [j for j in INTERIORS if j.get('anchor')] + [j for j in INTERIORS if not j.get('anchor')]
    for j in order:
        refs = [f"layout_{j['id']}.png", 'scale_reference_interior.png', j['ext']]
        if j.get('anchor'): refs += ['style_aren_neutral.png'] + ([] if j['id'] == 'int_village_house' else ['int_village_house.jpg (your approved result)'])
        else: refs += [f"{anchors[j['family']]}.jpg (your approved result)"]
        cl = ''.join(f" Chest tile {c[0]} at column {c[1]}, row {c[2]} (0-based) stays empty floor." for c in j['chests'])
        J.append(dict(id=j['id'], kind='interior', file=f"{j['id']}.jpg", size='1536x1024', refs=', '.join(refs),
                      prompt=INT_COMMON+f"\nScene: {j['scene']}{cl}" + ("\nThis image becomes the style anchor for its family; later rooms of the same family must match its materials, light and scale." if j.get('anchor') else
                             f"\nMatch the walls, floor, light and scale of the attached approved {anchors[j['family']]}.jpg so the family reads as one place.")))
    cells = ''.join(f"  {i+1}. {sid} ({where}): {desc}.\n" for i, (sid, where, desc) in enumerate(CHEST_STYLES))
    J.append(dict(id='chests_act1', kind='chests', file='chests_act1.png', size='1536x1024',
                  refs='layout_chests.png, int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg (your approved results)',
                  prompt=CHEST_PROMPT+"Row 1 = chests 1-6 closed, row 2 = chests 1-6 open, row 3 = chests 7-12 closed, row 4 = chests 7-12 open.\n"+cells+
                  "Each chest must clearly fit its room and differ in silhouette and material, yet all twelve belong to one painted world."))
    return J

def start_here(J):
    L = []; w = L.append
    w('# Ashen Crown — Building Interiors & Chests Art Work Order (v0.6.0)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return the zip described in section 5.')
    w('Everything you need is in this pack: `jobs.csv` (job list), `prompts/` (the full prompt for each job) and `references/` (images to attach).')
    w('When the player walks into a building on a town map, the game now shows a painted room. There are three families of rooms — a timber village, canvas army tents and an old stone fortress — and a sheet of treasure chests that suit each room.')
    w('')
    w(f'## 1. Deliverables ({len(J)} images)')
    w('')
    w('| # | id | file | size (px) | attach these references | prompt |')
    w('|---|---|---|---|---|---|')
    for i, j in enumerate(J, 1):
        w(f"| {i} | `{j['id']}` | `{j['file']}` | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{j['id']}.txt` |")
    w('')
    w('## 2. Global rules (apply to every image)')
    w('')
    w(f'- {STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text anywhere**: no lettering on signs, books, maps, banners or crates; no watermarks, signatures, UI, frames or grid lines. The game draws all labels itself in Korean.')
    w('- **No people and no animals** in the rooms. The game draws the characters (and the shopkeepers) on top.')
    w('- **Chest tiles stay empty.** The game draws the chests from `chests_act1.png`, so it can show them opened. Furniture crates and barrels elsewhere are fine.')
    w('- The layout sketches are composition guides on a 128 px grid. The painting does not have to snap to the grid, but every labelled area must stay in place, and the open floor and the doorway must stay clear.')
    w('- Every room has the same frame: back wall across the top two rows, thin side walls, no front wall, a 2-tile doorway at the bottom center (x 640–896).')
    w('- Final sizes must be exact. If the generator returns another size, resize (keeping the aspect ratio) and center-crop or pad to the exact size. Do not stretch.')
    w('- Generate each image individually. Regenerate when an image breaks a rule (text appears, people appear, a chest is painted into a chest tile, the doorway moves, the layout drifts).')
    w('')
    w('## 3. Order of work')
    w('')
    w('1. `int_village_house` — the **style anchor for every interior**. Attach `exterior_village_day.jpg` so the room matches the village outside.')
    w('2. `int_tent_soldier` — anchor of the tent family. Attach `exterior_garrison.jpg` and your `int_village_house.jpg`.')
    w('3. `int_fort_barracks` — anchor of the fortress family. Attach `exterior_fortress.jpg` and your `int_village_house.jpg`.')
    w('4. The other rooms of each family, each with its family anchor attached.')
    w('5. `chests_act1` — attach the three anchors. The open row must line up exactly with the closed row.')
    w('')
    w('Room list (the game uses each room for these buildings; for your information):')
    w('')
    w('| id | family | used for |')
    w('|---|---|---|')
    for j in INTERIORS: w(f"| `{j['id']}` | {j['family']} | {j['used']} |")
    w('')
    w('## 4. Self-check before packaging (record the result of each item in QA_REPORT.md)')
    w('')
    w(f'- [ ] {len(J)-1} interiors: exactly 1536×1024, RGB JPEG quality 92–95. `chests_act1.png`: exactly 1536×1024 PNG with real transparency, or a pure `#00FF00` background (say which).')
    w('- [ ] No text, letters, numbers, emblems, watermarks or UI anywhere. Zoom in on books, maps, banners and crates.')
    w('- [ ] No people or animals in the rooms.')
    w('- [ ] Each room matches its layout sketch: furniture in its boxes, open floor clear, doorway at bottom-row tiles 5–6, back wall across the top two rows.')
    w('- [ ] Every CHEST tile and SHOPKEEPER tile is empty floor.')
    w('- [ ] Each family looks like one place (same walls, floor and light as its anchor), and matches its exterior hub map.')
    w('- [ ] Chest sheet: 12 different chests, each OPEN cell lined up with its CLOSED cell (include an evidence image blending row 1 over row 2 at 50%), open chests empty.')
    w('- [ ] Scale fits `scale_reference_interior.png` (adult about 130 px, chest about 1 tile).')
    w('')
    w(f'## 5. Return format — one zip **under 20 MB**: `{PACK_NAME}.zip`')
    w('')
    w('```')
    w(f'{PACK_NAME}/')
    w('  img/int_village_house.jpg  img/int_village_forge.jpg  ... (all 15 rooms, JPEG)')
    w('  img/chests_act1.png')
    w('  manifest.csv        # id,kind,path,width,height,bytes,sha256   (one row per image; kind = interior or chests)')
    w('  SHA256SUMS.txt      # sha256  path')
    w('  QA_REPORT.md        # the checklist above with PASS/FAIL, generation notes, any deviations')
    w('  contact_sheet.jpg   # all 16 images as thumbnails with their ids (JPEG, under 1 MB)')
    w('  evidence/chests_open_closed_blend.jpg   # JPEG, under 1 MB')
    w('  prompts_used/       # the exact final prompt text used for each image (txt)')
    w('```')
    w('')
    w('- **Size limit:** the whole zip must be under 20 MB, because larger uploads get cut off. If it would exceed 20 MB, split it into '
      f'`{PACK_NAME}_A1.zip` (village + tent rooms) and `{PACK_NAME}_A2.zip` (fortress rooms + chests), each with its own manifest and checksums.')
    w('- Do not include WebP or other runtime conversions. The game team converts the masters.')
    w('- Before finishing, reopen the zip you produced and verify every file against SHA256SUMS. Report the final zip size(s) in the reply.')
    w('- If an item cannot be met, still deliver your best image, and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO = f"""# 사용 방법 (사용자용) — 건물 내부 15곳 + 상자 시트

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. 나머지 지시는 ZIP 안의 `00_START_HERE.md`(GPT가 읽는 영문 지시서)에 있습니다.

## A. 한 번에 16장 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 16 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {PACK_NAME}.zip (under 20 MB, or split into _A1/_A2) exactly as described in section 5.
```

## B. 기준 3장을 먼저 보고 결정하기
마을 민가, 병사 천막, 성채 병영(각 계열의 기준 그림)을 먼저 확인하고 싶을 때 쓰세요.
```
Attached is a work pack. Read 00_START_HERE.md first. Do only jobs 1-3 (the three family anchors) now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 이어서 이렇게 보냅니다.
```
Approved. Continue with all remaining jobs and return the zip described in section 5.
```

## 받은 뒤
- 결과 ZIP을 그대로 Claude에게 주세요. 20MB를 넘으면 GPT가 두 개(_A1, _A2)로 나눕니다. 그때는 둘 다 주세요.
- Claude가 SHA256을 검증한 뒤 이렇게 반영합니다.
  - WebP로 변환합니다.
  - 방마다 걸을 수 있는 칸, 문, 상자 자리를 그림에 맞춰 작성합니다.
  - 상자 시트를 잘라 방마다 어울리는 상자를 놓습니다(열림/닫힘).
  - 테스트와 스크린샷으로 확인합니다.
- 그림이 오기 전에도 게임은 지금처럼 동작합니다. 상자는 장소에 맞춘 임시 그림으로 먼저 바뀝니다.

## 파일 구성
| 파일 | 내용 |
|---|---|
| `00_START_HERE.md` | GPT용 작업 지시서 (16장, 규칙, 순서, 자체 점검, 반환 형식) |
| `jobs.csv` | 작업 목록 (순서, 파일명, 크기, 첨부할 참고 그림) |
| `prompts/01–16_*.txt` | 그림마다 완성된 프롬프트 |
| `references/layout_int_*.png` | 방 15곳의 배치 스케치 (12×8칸, 칸당 128px) |
| `references/layout_chests.png` | 상자 시트 배치 (6열×4행) |
| `references/exterior_*.jpg` | 이미 게임에 들어간 바깥 거점 그림 (재질·빛 맞추기용) |
| `references/scale_reference_interior.png`, `style_aren_neutral.png` | 크기·화풍 기준 |

## 방 목록 (PROPOSED — 마음에 들지 않는 방은 빼거나 바꿔도 됩니다)
| 계열 | 방 | 쓰이는 건물 | 상자 |
|---|---|---|---|
| 마을 | 민가 | 민가 | 꽃무늬 혼수함 |
| 마을 | 대장간 | 무기점 | — (대장장이) |
| 마을 | 도구점 | 도구점 | — (상인) |
| 마을 | 민병 병영 | 병영 | 민병 사물함 ×2 |
| 마을 | 촌장 회관 | 지휘관 숙소 | 호두나무 함 |
| 마을 | 보급 창고 | 보급 창고 | 곡식 궤 ×2 |
| 천막 | 병사 천막 | 수비대·야영지·맹세 진영 병사 천막 | 야전 사물함 ×2 |
| 천막 | 구호 천막 | 수비대 구호 천막 | 의약 상자 ×2 |
| 천막 | 지휘 천막 | 세 진영의 지휘 천막 | 장교 금고 |
| 천막 | 작전 천막 | 세 진영의 작전 천막 | 문서함 |
| 천막 | 보급 천막 | 세 진영의 보급 천막 | 보급 상자 ×2 |
| 성채 | 병영 | 병영, 병영 별채 | 성채 사물함 ×2 |
| 성채 | 무기고 | 무기고 | 무기고 궤 ×2 |
| 성채 | 기록실 | 기록실 | 문서함 |
| 성채 | 지휘관 숙소 | 지휘관 숙소 | 장교 금고 |
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    for j in INTERIORS: layout_sketch(j).save(refs/f"layout_{j['id']}.png", optimize=True)
    chest_layout().save(refs/'layout_chests.png', optimize=True)
    scale_reference().save(refs/'scale_reference_interior.png', optimize=True)
    shutil.copy(OLD_REFS/'style_aren_neutral.png', refs/'style_aren_neutral.png')
    for hub, name in (('hub_village_day', 'exterior_village_day'), ('hub_garrison', 'exterior_garrison'), ('hub_fortress', 'exterior_fortress')):
        ext_jpg(ROOT/f'src/assets/hubs/{hub}.webp', refs/f'{name}.jpg')
    J = jobs()
    (PACK/'00_START_HERE.md').write_text(start_here(J), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO, encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'id', 'kind', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(J, 1): wr.writerow([i, j['id'], j['kind'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{j['id']}.txt"])
    for i, j in enumerate(J, 1):
        fmt = 'one JPEG (quality 92-95)' if j['kind'] == 'interior' else 'one PNG with transparency (or pure #00FF00 background)'
        text = f"{j['prompt']}\n{STYLE}\nAttach: {j['refs']}.\nOutput: {fmt}, exactly {j['size']} px landscape.\n"
        (PACK/'prompts'/f"{i:02d}_{j['id']}.txt").write_text(text, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v060_Interior_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK, len(J), 'jobs')

if __name__ == '__main__':
    main()
