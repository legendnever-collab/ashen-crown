#!/usr/bin/env python3
"""Build the ChatGPT work pack for the v0.6.0 ACT II hubs (castle town, Velmar market), their 12 interiors and
the ACT II chest sheet (D-055 §6–7, D-056). Reuses the interior frame and sketch drawing of make-interior-work-pack.py.
Usage: python3 scripts/make-act2-hub-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('iwp', ROOT/'scripts/make-interior-work-pack.py'); iwp = importlib.util.module_from_spec(spec); spec.loader.exec_module(iwp)
PACK = ROOT/'docs/v0.6.0/art/act2-hub-work-pack'
NAME = 'Ashen_Crown_v060_ACT2_Hub_Art_Pack'
OLD = ROOT/'docs/v0.5.0/art/world-work-pack/references'

HUB_COMMON = ("Attached layout_hub_*.png is a LAYOUT SKETCH for a walkable town map in a classic tactical RPG: a 24x16 grid of 64-pixel tiles. "
 "Keep every labelled area in the same place and roughly the same size; the labels are for you only — paint no text. "
 "Attached scale_reference.png and sprite_eric_sheet.png show the walking characters: a standing adult is about 60-70 px tall and a doorway about 64 px wide, "
 "so buildings, doors and props must be in that scale. Each enterable building has ONE clearly visible front door on its bottom side at the tile marked DOOR. "
 "View: a high three-quarter top-down angle (about 60 degrees) like classic tactical RPG town maps — flat readable ground, objects showing their front faces, "
 "no perspective vanishing toward a horizon, no sky band. Keep all streets and the central open area wide, flat and uncluttered so characters can walk there "
 "(streets at least 2 tiles = 128 px wide). Paint NO people and NO animals. No text, no letters on signs, no UI, no grid lines, no frame, no vignette border.")

# Hubs: regions (label, x, y, w, h, kind) with kind in wall/bldg/solid/open/water; doors (x, y) inside a bldg's bottom row.
HUBS = [
 dict(id='hub_castletown', title='castle town below Ironhold — snowy Iron Crown military town (M07–M08)',
  scene=("The lower town beneath Ironhold, the mountain stronghold of the Iron Crown Dominion, on a cold clear winter day with light snow on roofs and streets. "
         "Across the top two tile rows the dark grey stone curtain wall of the castle with a great CLOSED iron-bound gate at the top center reached by a few wide steps. "
         "Steep-roofed houses of dark stone and dark timber with snow on the roofs and icicles, smoking chimneys, iron braziers on posts. "
         "Top-left a smithy with a glowing forge visible through a wide open front; top-right a provisioner's shop with crates and lanterns by the door. "
         "Middle-left a two-storey inn with warm windows; middle-right the Iron Crown checkpoint office — a sober stone building with steel-blue cloth hangings (no emblem). "
         "In the center a swept stone plaza with a frozen fountain, a covered map table under a small canvas awning, and braziers. Bottom-left a small stone house; "
         "bottom-center-left a refugee shelter of a few canvas tents and a cook fire on trampled snow; bottom-right a storehouse with a sled and stacked crates. "
         "The town road leaves at the bottom center. Orderly, cold, disciplined; steel-blue and dark grey with warm firelight. Match the style of the attached approved hubs."),
  regions=[('CASTLE WALL', 0, 0, 24, 2, 'wall'), ('GREAT CLOSED GATE + wide steps', 9, 0, 6, 2, 'solid'), ('SMITHY (open forge front)', 1, 2, 5, 3, 'bldg'), ('PROVISIONER (item shop)', 18, 2, 5, 3, 'bldg'),
           ('INN (2 storeys)', 1, 7, 5, 3, 'bldg'), ('CHECKPOINT OFFICE (steel-blue hangings)', 18, 7, 5, 3, 'bldg'), ('PLAZA (frozen fountain, braziers)', 8, 6, 8, 6, 'open'),
           ('frozen fountain', 11, 8, 2, 2, 'solid'), ('MAP TABLE under awning', 8, 7, 2, 1, 'solid'), ('HOUSE', 1, 12, 4, 2, 'bldg'), ('REFUGEE SHELTER (tents, cook fire)', 6, 12, 4, 2, 'solid'),
           ('STOREHOUSE (sled, crates)', 18, 12, 5, 2, 'bldg'), ('town edge — snowbank / low wall', 0, 15, 24, 1, 'wall')],
  doors=[(3, 4), (20, 4), (3, 9), (20, 9), (2, 13), (20, 13)], entrance=(11, 15, 2)),
 dict(id='hub_velmar', title='Velmar market — free port city of the west (M09–M10)',
  scene=("The market quarter of Velmar, the free port city on the west coast, on a bright breezy afternoon. Whitewashed stone houses with terracotta roofs, "
         "colorful striped awnings and bunting (plain colors, no letters). Along the whole left edge the harbor: green-blue sea, wooden piers with moored small ships "
         "and stacked cargo. Top center the council hall — a broad pale stone building with columns and a bell tower; top-left an apothecary with herb pots; "
         "top-right a mercenary armory with racks of blades by the door. Middle-left a narrow townhouse with flower boxes; middle-right a harbor tavern with barrels "
         "and a hanging lantern. In the center a cobbled market square with a round fountain and a ring of market stalls at its edges (leave the square itself open). "
         "Bottom-left a large harbor warehouse with crane and crates; bottom-right a row of covered market stalls. The road enters at the bottom center. "
         "Lively, sunlit, a little chaotic; sea-green, cream, terracotta and many bright accents. Match the style of the attached approved hubs."),
  regions=[('rooftops / city beyond', 0, 0, 24, 1, 'wall'), ('HARBOR (sea, piers, ships)', 0, 1, 3, 15, 'water'), ('APOTHECARY (item shop)', 4, 2, 4, 3, 'bldg'),
           ('COUNCIL HALL (columns, bell tower)', 9, 1, 6, 4, 'bldg'), ('MERCENARY ARMORY (weapon shop)', 17, 2, 5, 3, 'bldg'), ('TOWNHOUSE (flower boxes)', 4, 7, 4, 3, 'bldg'),
           ('MARKET SQUARE (fountain; stalls at edges)', 9, 6, 6, 6, 'open'), ('fountain', 11, 8, 2, 2, 'solid'), ('HARBOR TAVERN', 17, 7, 5, 3, 'bldg'),
           ('HARBOR WAREHOUSE (crane, crates)', 4, 12, 5, 2, 'bldg'), ('COVERED MARKET STALLS', 17, 12, 5, 2, 'solid'), ('city edge — low wall', 3, 15, 21, 1, 'wall')],
  doors=[(5, 4), (11, 4), (19, 4), (5, 9), (19, 9), (6, 13)], entrance=(11, 15, 2)),
]

N_INT = [  # north (castle town) rooms
 dict(id='int_north_inn', family='north', kind='barracks', anchor=True, ext='hub_castletown.jpg (your approved result)', used='castle town inn',
  title='castle town inn — common room',
  scene=("Inside the inn of the snowy castle town: dark timber and stone walls, a big stone fireplace with a roaring fire, heavy wooden tables, fur throws on benches, "
         "iron chandeliers with candles, frost on a small window, snow-dusted boots by the wall, a staircase up on one side. Warm firelight against blue winter light."),
  regions=[('FIREPLACE', 1, 2, 2, 1), ('STAIRS UP', 4, 2, 2, 1), ('BAR COUNTER + kegs', 7, 2, 3, 1), ('HEAVY TABLE + benches', 4, 4, 3, 1)],
  chests=[('a', 1, 4, 'fur_trunk'), ('b', 10, 2, 'fur_trunk')]),
 dict(id='int_north_smithy', family='north', kind='weapon', ext='hub_castletown.jpg (your approved result)', used='castle town smithy (weapon shop)', title='castle town smithy',
  scene=("Inside the castle town smithy (same construction as the approved inn): a big stone forge with coals, an anvil, racks of steel-blue lacquered spears and "
         "lances, cavalry shields (plain), horseshoes on the wall, a sales counter with blades on fur, the smith's floor behind it; forge glow and cold daylight."),
  regions=[('FORGE', 1, 2, 2, 2), ('ANVIL + quench', 3, 2, 1, 2), ("SMITH'S FLOOR (behind counter)", 4, 2, 4, 2), ('SALES COUNTER', 4, 4, 4, 1),
           ('LANCE + SPEAR RACKS', 9, 2, 2, 2), ('SHIELD STAND', 10, 4, 1, 1)],
  npc=(6, 3, 'SMITH stands here'), chests=[]),
 dict(id='int_north_provisioner', family='north', kind='item', ext='hub_castletown.jpg (your approved result)', used='castle town provisioner (item shop)', title='castle town provisioner',
  scene=("Inside the provisioner's shop (same construction as the approved inn): shelves of jars, tinned rations and medicine bottles, hanging smoked fish and sausages, "
         "bundles of furs and wool blankets, snowshoes and lanterns, a counter with a scale; a small iron stove keeps it warm."),
  regions=[('IRON STOVE', 1, 2, 1, 1), ('FURS + BLANKETS', 1, 4, 1, 1), ('STOCK FLOOR (behind counter)', 4, 2, 4, 2), ('COUNTER (scale)', 4, 4, 4, 1), ('SHELVES', 9, 2, 2, 2)],
  npc=(5, 3, 'MERCHANT stands here'), chests=[]),
 dict(id='int_north_office', family='north', kind='quarters', ext='hub_castletown.jpg (your approved result)', used='Iron Crown checkpoint office', title='Iron Crown checkpoint office',
  scene=("Inside the Iron Crown checkpoint office (same construction as the approved inn, more austere): a long desk with neat stacks of blank papers, stamps and a seal press "
         "(no readable marks), a wall map of painted terrain (no writing), steel-blue cloth hangings without emblem, a rack of confiscated weapons, an iron stove, "
         "orderly benches for waiting travellers. Strict and tidy."),
  regions=[('WEAPON RACK (confiscated)', 1, 2, 2, 1), ('LONG DESK (papers, seal press)', 4, 3, 4, 1), ('IRON STOVE', 9, 2, 1, 1), ('WAITING BENCH', 1, 5, 2, 1)],
  chests=[('a', 10, 4, 'iron_lockbox')]),
 dict(id='int_north_house', family='north', kind='house', ext='hub_castletown.jpg (your approved result)', used='castle town house', title='castle town house',
  scene=("Inside a small stone-and-timber house of the castle town (same construction as the approved inn): a box bed with thick furs, a stone hearth with a kettle, "
         "a table with bread and a candle, a spinning wheel, frost on the window, a cradle; modest but warm."),
  regions=[('BOX BED (furs)', 1, 2, 2, 2), ('TABLE', 4, 3, 2, 1), ('HEARTH (kettle)', 8, 2, 2, 1), ('SPINNING WHEEL', 10, 2, 1, 2)],
  chests=[('a', 1, 4, 'frost_chest')]),
 dict(id='int_north_store', family='north', kind='store', ext='hub_castletown.jpg (your approved result)', used='castle town storehouse', title='castle town storehouse',
  scene=("Inside the storehouse (same construction as the approved inn): a cold stone hall with stacked crates and barrels rimed with frost, sacks of grain, "
         "a wooden sled, firewood stacks, ropes and chains, ice on the floor edges, lantern light."),
  regions=[('CRATES', 1, 2, 2, 2), ('BARRELS', 4, 2, 2, 1), ('FIREWOOD', 7, 2, 2, 1), ('SLED', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'sled_crate'), ('b', 3, 4, 'sled_crate')]),
]
P_INT = [  # port (Velmar) rooms
 dict(id='int_port_tavern', family='port', kind='barracks', anchor=True, ext='hub_velmar.jpg (your approved result)', used='Velmar harbor tavern', title='Velmar harbor tavern',
  scene=("Inside a harbor tavern of Velmar: whitewashed walls with blue-green trim, round windows looking on the sea, fishing nets and a ship's wheel as decoration, "
         "barrels behind a bar, round tables and stools, a sunlit plank floor, hanging oil lamps. Lively and bright."),
  regions=[('BAR + barrels', 1, 2, 3, 1), ('ROUND TABLE', 4, 4, 1, 1), ('ROUND TABLE', 7, 4, 1, 1), ('NET + SHIP WHEEL on wall', 6, 2, 3, 1)],
  chests=[('a', 1, 4, 'sea_chest'), ('b', 10, 2, 'sea_chest')]),
 dict(id='int_port_armory', family='port', kind='weapon', ext='hub_velmar.jpg (your approved result)', used='Velmar mercenary armory (weapon shop)', title='Velmar mercenary armory',
  scene=("Inside the mercenary armory (same construction as the approved tavern): racks of sabres, rapiers, pikes and crossbows, brigandines on stands, "
         "a fencing dummy, a glass case of daggers, a counter with a blade on velvet, the armorer's floor behind it."),
  regions=[('BLADE RACKS', 1, 2, 2, 2), ('FENCING DUMMY', 3, 2, 1, 2), ("ARMORER'S FLOOR (behind counter)", 4, 2, 4, 2), ('COUNTER', 4, 4, 4, 1), ('PIKE + CROSSBOW RACKS', 9, 2, 2, 2), ('BRIGANDINE STAND', 10, 4, 1, 1)],
  npc=(6, 3, 'ARMORER stands here'), chests=[]),
 dict(id='int_port_apothecary', family='port', kind='item', ext='hub_velmar.jpg (your approved result)', used='Velmar apothecary (item shop)', title='Velmar apothecary',
  scene=("Inside the apothecary (same construction as the approved tavern): shelves of colored glass bottles catching the sea light, potted herbs, a still with copper tubes, "
         "drawers of spices, a counter with a mortar and brass scale."),
  regions=[('POTTED HERBS', 1, 2, 2, 1), ('COPPER STILL', 1, 4, 1, 1), ('STOCK FLOOR (behind counter)', 4, 2, 4, 2), ('COUNTER (mortar, scale)', 4, 4, 4, 1), ('BOTTLE SHELVES', 9, 2, 2, 2)],
  npc=(5, 3, 'APOTHECARY stands here'), chests=[]),
 dict(id='int_port_council', family='port', kind='quarters', ext='hub_velmar.jpg (your approved result)', used='Velmar council hall antechamber', title='Velmar council antechamber',
  scene=("Inside the antechamber of the Velmar council hall (same construction as the approved tavern, grander): pale stone columns, a long table for delegates with "
         "many different chairs (each lord brings his own), banners in many plain colors without emblems, a big window over the harbor, a speaker's lectern."),
  regions=[("SPEAKER'S LECTERN", 1, 2, 1, 2), ('DELEGATES TABLE', 4, 3, 4, 2), ('COLUMNS + plain banners', 8, 2, 2, 1)],
  chests=[('a', 10, 4, 'council_strongbox')]),
 dict(id='int_port_house', family='port', kind='house', ext='hub_velmar.jpg (your approved result)', used='Velmar townhouse', title='Velmar townhouse',
  scene=("Inside a narrow Velmar townhouse (same construction as the approved tavern): a bed with a light blue cover, a small table with a bowl of lemons, "
         "a balcony door with sea light, potted plants, a painted wardrobe, tiled floor."),
  regions=[('BED', 1, 2, 2, 2), ('SMALL TABLE', 4, 3, 2, 1), ('BALCONY DOOR (sea light)', 7, 2, 2, 1), ('WARDROBE', 10, 2, 1, 2)],
  chests=[('a', 1, 4, 'merchant_coffer')]),
 dict(id='int_port_warehouse', family='port', kind='store', ext='hub_velmar.jpg (your approved result)', used='Velmar harbor warehouse', title='Velmar harbor warehouse',
  scene=("Inside the harbor warehouse (same construction as the approved tavern): tall stacks of cargo crates and bales with rope nets, amphora-like jars of oil, "
         "barrels of wine, a hoist chain hanging from a beam, a wide loading door letting in sea light."),
  regions=[('CARGO STACKS', 1, 2, 2, 2), ('OIL JARS', 4, 2, 2, 1), ('WINE BARRELS', 7, 2, 2, 1), ('HOIST + bales', 10, 2, 1, 2)],
  chests=[('a', 10, 4, 'cargo_crate'), ('b', 3, 4, 'cargo_crate')]),
]
CHESTS2 = [
 ('frost_chest', 'castle town house', 'a northern pine chest with iron corners, a fur pelt thrown over its lid, a dusting of frost'),
 ('fur_trunk', 'castle town inn', "a traveller's trunk covered in grey fur and leather with iron studs"),
 ('sled_crate', 'castle town storehouse', 'a low wide crate on short sled runners, rimed with frost, rope lashing'),
 ('iron_lockbox', 'Iron Crown checkpoint office', 'a squat blackened-iron lockbox with steel-blue painted bands and a heavy lock (no emblem)'),
 ('sea_chest', 'Velmar tavern', "a sailor's sea chest of tarred wood with brass corners and rope beckets"),
 ('merchant_coffer', 'Velmar townhouse', 'a lacquered green-and-gold merchant coffer with a domed lid and brass feet'),
 ('cargo_crate', 'Velmar warehouse', 'a harbor cargo crate with a rope net and a painted plain color band (no letters)'),
 ('council_strongbox', 'Velmar council hall', 'an ornate strongbox of pale wood and silver with several different locks, one per lord'),
]

def hub_sketch(h):
    T = 64; im = Image.new('RGB', (1536, 1024), (156, 178, 128)); d = ImageDraw.Draw(im); f, fs = iwp.font(15), iwp.font(13)
    col = {'wall': (124, 96, 66), 'bldg': (226, 214, 184), 'solid': (205, 196, 170), 'open': (232, 222, 190), 'water': (110, 160, 180)}
    for (lab, x, y, w, hh, kind) in h['regions']:
        if kind == 'open': d.rectangle((x*T, y*T, (x+w)*T, (y+hh)*T), fill=col[kind])
    # streets: everything not covered is ground; draw a lighter street cross
    for (lab, x, y, w, hh, kind) in h['regions']:
        if kind == 'open': continue
        d.rectangle((x*T+2, y*T+2, (x+w)*T-2, (y+hh)*T-2), fill=col[kind], outline=(40, 30, 24), width=3)
        iwp.label(d, (x*T, y*T, (x+w)*T, (y+hh)*T), lab, f if kind == 'bldg' else fs, (30, 24, 20) if kind != 'wall' else (245, 235, 210))
    for (lab, x, y, w, hh, kind) in h['regions']:
        if kind == 'open': iwp.label(d, (x*T, y*T, (x+w)*T, y*T+40), lab, fs, (90, 75, 50))
    for (x, y) in h['doors']:
        d.rectangle((x*T+8, y*T+8, (x+1)*T-8, (y+1)*T), fill=(140, 190, 120), outline=(30, 60, 30), width=3); iwp.label(d, (x*T, y*T, (x+1)*T, (y+1)*T), 'DOOR', fs)
    ex, ey, ew = h['entrance']
    d.rectangle((ex*T, ey*T, (ex+ew)*T, (ey+1)*T), fill=(214, 199, 160), outline=(30, 60, 30), width=3); iwp.label(d, (ex*T, ey*T, (ex+ew)*T, (ey+1)*T), 'ROAD IN / OUT', fs)
    for gx in range(25): d.line((gx*T, 0, gx*T, 1024), fill=(120, 130, 100), width=1)
    for gy in range(17): d.line((0, gy*T, 1536, gy*T), fill=(120, 130, 100), width=1)
    d.rectangle((0, 0, 1536, 22), fill=(236, 228, 210)); d.text((16, 3), f"{h['id']} — {h['title']} · layout sketch, 24x16 tiles of 64 px — green = open ground / streets — composition guide only", font=fs, fill=(30, 24, 20))
    return im

def chest_sheet_layout():
    im = Image.new('RGB', (1024, 1024), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (sid, where, _) in enumerate(CHESTS2):
        col, pair = i % 4, i // 4
        for st in (0, 1):
            x0, y0 = col*256, (pair*2+st)*256
            d.rectangle((x0, y0, x0+255, y0+255), outline=(90, 80, 60), width=2); d.line((x0+20, y0+216, x0+236, y0+216), fill=(200, 60, 60), width=2)
            d.rectangle((x0+48, y0+120, x0+208, y0+216), outline=(150, 110, 40), width=3)
            iwp.label(d, (x0, y0+10, x0+256, y0+110), f"{i+1}. {sid} ({'CLOSED' if st == 0 else 'OPEN, empty'}) — {where}", f)
    return im

def jobs():
    J = []
    def hub_job(h, extra):
        J.append(dict(id=h['id'], kind='hub', file=f"{h['id']}.jpg", size='1536x1024',
                      refs=f"layout_{h['id']}.png, scale_reference.png, sprite_eric_sheet.png, approved_hub_village_day.jpg, approved_hub_fortress.jpg{extra}",
                      prompt=HUB_COMMON+f"\nScene: {h['scene']}"))
    def int_jobs(rooms):
        anchor = next(r for r in rooms if r.get('anchor'))
        for r in [anchor]+[r for r in rooms if r is not anchor]:
            refs = [f"layout_{r['id']}.png", 'scale_reference_interior.png', r['ext']]
            refs += ['approved_int_village_house.jpg'] if r is anchor else [f"{anchor['id']}.jpg (your approved result)"]
            cl = ''.join(f" Chest tile {c[0]} at column {c[1]}, row {c[2]} (0-based) stays empty floor." for c in r['chests'])
            J.append(dict(id=r['id'], kind='interior', file=f"{r['id']}.jpg", size='1536x1024', refs=', '.join(refs),
                          prompt=iwp.INT_COMMON+f"\nScene: {r['scene']}{cl}"+("\nThis image becomes the style anchor for this town's rooms." if r is anchor else
                                 f"\nMatch the walls, floor, light and scale of the attached approved {anchor['id']}.jpg.")))
    hub_job(HUBS[0], ''); int_jobs(N_INT); hub_job(HUBS[1], ', hub_castletown.jpg (your approved result)'); int_jobs(P_INT)
    cells = ''.join(f"  {i+1}. {sid} ({where}): {desc}.\n" for i, (sid, where, desc) in enumerate(CHESTS2))
    J.append(dict(id='chests_act2', kind='chests', file='chests_act2.png', size='1024x1024',
                  refs='layout_chests_act2.png, approved_chests_act1.png if you have it, int_north_inn.jpg, int_port_tavern.jpg (your approved results)',
                  prompt=iwp.CHEST_PROMPT.replace('12 different', '8 different').replace('Canvas 1536x1024, a 6-column x 4-row grid', 'Canvas 1024x1024, a 4-column x 4-row grid')
                         .replace('layout_chests.png', 'layout_chests_act2.png').replace('(int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg)', '(int_north_inn.jpg, int_port_tavern.jpg)')
                         + "Row 1 = chests 1-4 closed, row 2 = chests 1-4 open, row 3 = chests 5-8 closed, row 4 = chests 5-8 open.\n" + cells))
    return J

def start_here(J):
    L = []; w = L.append
    w('# Ashen Crown — ACT II Towns, Rooms & Chests Art Work Order (v0.6.0)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return the zip described in section 5.')
    w('Two new walkable town maps for ACT II — a snowy castle town of the northern Iron Crown Dominion and the market quarter of Velmar, a free port city — the rooms inside their buildings, and a sheet of chests that suit those rooms.')
    w('')
    w(f'## 1. Deliverables ({len(J)} images)')
    w('')
    w('| # | id | file | size (px) | attach | prompt |')
    w('|---|---|---|---|---|---|')
    for i, j in enumerate(J, 1): w(f"| {i} | `{j['id']}` | `{j['file']}` | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{j['id']}.txt` |")
    w('')
    w('## 2. Global rules')
    w('')
    w(f'- {iwp.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text anywhere** (signs, banners, books, maps, crates) and **no emblems or crests**. No watermarks, UI, frames or grid lines.')
    w('- **No people and no animals** in the town maps and rooms (gulls far out at sea are fine). The game draws the characters.')
    w('- Town maps follow the 24×16-tile / 64 px layout sketches, like the approved hubs (`approved_hub_*.jpg`). Every enterable building shows one front door at its DOOR tile.')
    w('- Rooms follow the 12×8-tile / 128 px layout sketches and the same frame as the approved village house (`approved_int_village_house.jpg`, if attached): back wall across the top two rows, thin side walls, no front wall, a 2-tile doorway at the bottom center (x 640–896). **CHEST tiles and SHOPKEEPER tiles stay empty floor.**')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and center-crop or pad; never stretch.')
    w('')
    w('## 3. Order of work')
    w('')
    w('1. `hub_castletown` — style anchor of the north. 2. its six rooms, `int_north_inn` first (the anchor of those rooms).')
    w('3. `hub_velmar` — attach your castle town too. 4. its six rooms, `int_port_tavern` first.')
    w('5. `chests_act2` — eight chests, closed and open, open row lined up exactly with the closed row.')
    w('')
    w('If `approved_int_village_house.jpg` / `approved_chests_act1.png` are not in references/ (the ACT I interiors may still be in progress), use `scale_reference_interior.png` and the layout sketches alone.')
    w('')
    w('## 4. Self-check (record PASS/FAIL per item in QA_REPORT.md)')
    w('')
    w('- [ ] 2 town maps and 12 rooms: exactly 1536×1024 RGB JPEG quality 92–95. `chests_act2.png`: exactly 1024×1024 PNG, real transparency or pure `#00FF00` (say which).')
    w('- [ ] No text, letters, numbers, emblems, crests, watermarks or UI. Zoom in on signs, banners, ships and crates.')
    w('- [ ] No people or animals.')
    w('- [ ] Town maps match their sketches: buildings in place, one door per enterable building at its DOOR tile, plaza/square open, streets at least 2 tiles wide, road at the bottom center; Velmar\'s harbor along the left edge.')
    w('- [ ] Rooms match their sketches; doorway at bottom-row tiles 5–6; CHEST and SHOPKEEPER tiles empty.')
    w('- [ ] Each town\'s rooms match that town (snowy dark stone and timber / whitewashed port).')
    w('- [ ] Chest sheet: 8 different chests, open cells lined up with closed cells (evidence image blending rows 1 and 2 at 50%), open chests empty.')
    w('')
    w(f'## 5. Return format — one zip **under 20 MB**: `{NAME}.zip`')
    w('')
    w('```')
    w(f'{NAME}/')
    w('  img/hub_castletown.jpg  img/hub_velmar.jpg  img/int_north_*.jpg (6)  img/int_port_*.jpg (6)  img/chests_act2.png')
    w('  manifest.csv        # id,kind,path,width,height,bytes,sha256   (kind = hub, interior or chests)')
    w('  SHA256SUMS.txt')
    w('  QA_REPORT.md')
    w('  contact_sheet.jpg   # thumbnails with ids, JPEG under 1 MB')
    w('  evidence/chests_open_closed_blend.jpg')
    w('  prompts_used/')
    w('```')
    w('')
    w(f'- If the zip would exceed 20 MB, split it into `{NAME}_C1.zip` (castle town + its rooms) and `{NAME}_C2.zip` (Velmar + its rooms + chests), each with its own manifest and checksums.')
    w('- Do not include WebP. Reopen the zip(s) and verify every file against SHA256SUMS before finishing; report the final sizes.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO = f"""# 사용 방법 (사용자용) — ACT II 거점 2곳 + 내부 12곳 + 상자 시트

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요.

```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 15 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}.zip (under 20 MB, or split into _C1/_C2) exactly as described in section 5.
```

- **팩 A(ACT I 내부)를 먼저 끝낸 같은 대화창에서 하면 가장 좋습니다.** 방 틀과 상자 화풍이 이어집니다. 새 창이라도 작업할 수 있습니다.
- 결과 ZIP을 Claude에게 주면 SHA256을 검증한 뒤 반영합니다.
  - 걸을 수 있는 칸, 문, NPC 자리를 그림에 맞춰 작성합니다.
  - 방과 상자를 넣습니다.

## 거점 (PROPOSED)
| id | 거점 | 시점 | 건물 |
|---|---|---|---|
| `hub_castletown` | 철관성 아래 성하 마을 (눈, 겨울 낮) | M07–M08 | 대장간·잡화점(상점 내부), 여관, 통령국 검문소, 민가, 창고, 피난민 천막(바깥) |
| `hub_velmar` | 자유도시 벨마르 시장 (항구, 오후) | M09–M10 | 용병 무기점·약재상(상점 내부), 의회 회관, 항구 주점, 연립주택, 항구 창고, 노점 줄(바깥) |

## 상자 8종
| 거점 | 상자 |
|---|---|
| 성하 마을 | 털 덮인 북부 상자, 털가죽 여행 궤, 썰매 상자, 통령국 쇠 금고 |
| 벨마르 | 선원 궤, 상인 함, 화물 상자, 의회 금고(영주마다 자물쇠) |
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    for h in HUBS: hub_sketch(h).save(refs/f"layout_{h['id']}.png", optimize=True)
    for r in N_INT+P_INT: iwp.layout_sketch(r).save(refs/f"layout_{r['id']}.png", optimize=True)
    chest_sheet_layout().save(refs/'layout_chests_act2.png', optimize=True)
    iwp.scale_reference().save(refs/'scale_reference_interior.png', optimize=True)
    for n in ('scale_reference.png', 'sprite_eric_sheet.png', 'style_aren_neutral.png'):
        Image.open(OLD/n).save(refs/n, optimize=True)
    for hub in ('hub_village_day', 'hub_fortress'): iwp.ext_jpg(ROOT/f'src/assets/hubs/{hub}.webp', refs/f'approved_{hub}.jpg')
    J = jobs()
    (PACK/'00_START_HERE.md').write_text(start_here(J), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO, encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'id', 'kind', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(J, 1): wr.writerow([i, j['id'], j['kind'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{j['id']}.txt"])
    for i, j in enumerate(J, 1):
        fmt = 'one PNG with transparency (or pure #00FF00 background)' if j['kind'] == 'chests' else 'one JPEG (quality 92-95)'
        st = iwp.STYLE if j['kind'] != 'hub' else iwp.STYLE.replace("rooms, furniture designs", "map, town")
        (PACK/'prompts'/f"{i:02d}_{j['id']}.txt").write_text(f"{j['prompt']}\n{st}\nAttach: {j['refs']}.\nOutput: {fmt}, exactly {j['size']} px.\n", encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v060_ACT2_Hub_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK, len(J), 'jobs')

if __name__ == '__main__':
    main()
