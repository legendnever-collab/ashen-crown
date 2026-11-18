"""v2.2 (D-122, PROPOSED): art pack I — the duel scene and the village tavern redone — docs/v2.2.0/art/duel-work-pack.

The user's request of 2026-11-18 22:44: the village tavern does not look like a tavern (redo the background); a duel that
happens is always won by our hero, who levels up, and plays in its own window as a fight between the two — "more action,
like a finely drawn video". This order asks for the tavern, a duel action sheet for every duellist (8 painted poses), a
cinematic finishing-blow key art per hero, five duel backdrops and a VFX sheet; the engine animates them (camera, motion,
slow-motion, shake, effects) — see docs/v2.2.0/DUEL_SCENE_DESIGN.md. It also re-orders, painterly this time, the H1 busts
and icon sheets that came back as vector drafts (D-121).
Usage: python3 scripts/make-v220-duel-art-pack.py [zip-out]
"""
from pathlib import Path
import csv, shutil, sys, zipfile
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
h1 = root / 'docs/v2.1.0/art/h1v2-work-pack'
assets = root / 'src/assets'
out = root / 'docs/v2.2.0/art/duel-work-pack'
if out.exists(): shutil.rmtree(out)
(out / 'prompts').mkdir(parents=True); (out / 'references').mkdir()
ref = out / 'references'

STYLE = ("Painting style: match the attached approved art (style_aren_neutral.png and the attached busts) — semi-realistic hand-painted fantasy "
         "illustration for a classic tactical RPG: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich "
         "saturated but slightly earthy colours, detailed metal, leather and cloth textures, mature expressive faces. NOT flat vector art, NOT chibi, NOT a "
         "western cartoon, NOT photo-real, NOT 3D render. Original world: do not copy any existing game's characters, costumes, emblems, logos or poses.")
NOTEXT = "No text, letters, numbers, runes, emblems or logos anywhere; no UI, no frame, no watermark, no signature."

jobs = []  # part, kind, id, expression, file, size, refs(list), text
def job(part, kind, id_, expr, file, size, refs, text):
    jobs.append([part, kind, id_, expr, file, size, refs, text])

def png(src, name, box=None):
    """Copy a runtime WebP (or the first cell row of a sprite sheet) into references/ as PNG."""
    im = Image.open(src).convert('RGBA')
    if box: im = im.crop(box)
    if name.endswith('.jpg'): im.convert('RGB').save(ref / name, quality=86); return name  # painted rooms and hubs: opaque
    if 'bust' in name: im.thumbnail((640, 800))  # references only need the look, not the full master
    im.save(ref / name, optimize=True); return name

# ---------------------------------------------------------------- A: the village tavern, redone
png(assets / 'rooms/int_village_tavern.webp', 'rejected_int_village_tavern.jpg')
png(assets / 'rooms/int_capital_tavern.webp', 'approved_int_capital_tavern.jpg')
png(assets / 'rooms/int_north_inn.webp', 'approved_int_north_inn.jpg')
png(assets / 'rooms/int_port_tavern.webp', 'approved_int_port_tavern.jpg')
png(assets / 'rooms/int_village_house.webp', 'approved_int_village_house.jpg')
shutil.copy(h1 / 'references/scale_reference_interior.png', ref / 'scale_reference_interior.png')
shutil.copy(h1 / 'references/style_aren_neutral.png', ref / 'style_aren_neutral.png')
shutil.copy(h1 / 'references/ref_bust_baldrick_neutral.png', ref / 'ref_bust_baldrick_neutral.png')
font = ImageFont.load_default()
T = 128
# The new footprint (rows 2-6 of the walk mask; '#' solid, '.' floor) — the import authors the same mask.
TAVERN_MASK = ['############', '############', '######..####', '######....##', '#......##..#', '#.##.......#', '##........##', '#####..#####']
def layout_tavern(path):
    im = Image.new('RGB', (1536, 1024), '#20262a'); d = ImageDraw.Draw(im)
    for y, row in enumerate(TAVERN_MASK):
        for x, ch in enumerate(row):
            d.rectangle([x*T, y*T, x*T+T-1, y*T+T-1], fill='#2e3a33' if ch == '.' else '#20262a', outline='#3c464c')
    d.rectangle([0, 0, 1535, 2*T-1], fill='#4a3b2c')
    d.text((16, 16), 'BACK WALL (rows 0-1): shelves of bottles and kegs behind the bar (left), notice board (middle), big stone FIREPLACE (right)', fill='white', font=font)
    box = lambda x0, y0, x1, y1, col, lab: (d.rectangle([x0*T+4, y0*T+4, x1*T-4, y1*T-4], outline=col, width=6), d.text((x0*T+14, y0*T+14), lab, fill=col, font=font))
    box(1, 2, 6, 3, '#e0a050', 'BACK OF BAR: keg rack, taps')
    box(1, 3, 6, 4, '#e0a050', 'BAR COUNTER (long, wooden, mugs on it)')
    box(8, 0, 11, 3, '#ff7040', 'STONE FIREPLACE + hearth (fire burning)')
    box(7, 4, 9, 5, '#c0a070', 'ROUND TABLE + stools')
    box(2, 5, 4, 6, '#c0a070', 'LONG TABLE + benches')
    d.rectangle([10*T+4, 6*T+4, 11*T-4, 7*T-4], outline='#c0a070', width=6); d.text((10*T+10, 6*T+14), 'BARRELS', fill='#c0a070', font=font)
    for cx, cy, lab in [(10, 3, 'CHEST b'), (1, 6, 'CHEST a')]:
        d.rectangle([cx*T+10, cy*T+10, cx*T+T-10, cy*T+T-10], outline='#ffd700', width=6); d.text((cx*T+16, cy*T+54), lab, fill='#ffd700', font=font)
    d.ellipse([3*T+14, 2*T+14, 3*T+T-14, 2*T+T-14], outline='#4aa3ff', width=6); d.text((3*T+18, 2*T+56), 'KEEPER (behind bar)', fill='#4aa3ff', font=font)
    d.rectangle([5*T, 7*T, 7*T-1, 1023], fill='#6b5a3a'); d.text((5*T+20, 7*T+50), 'DOORWAY (way out)', fill='white', font=font)
    d.text((2*T+20, 4*T+50), 'OPEN FLOOR (green) - characters walk here', fill='#9fd29f', font=font)
    im.save(path)
layout_tavern(ref / 'layout_int_village_tavern_v2.png')
job('A', 'room', 'int_village_tavern', '', 'int_village_tavern.jpg', '1536x1024',
    ['layout_int_village_tavern_v2.png', 'rejected_int_village_tavern.jpg', 'approved_int_capital_tavern.jpg', 'approved_int_north_inn.jpg', 'approved_int_port_tavern.jpg', 'approved_int_village_house.jpg', 'scale_reference_interior.png', 'style_aren_neutral.png'],
    "Paint the inside of the Ashen Village tavern for Ashen Crown — one JPEG (quality 92-95), exactly 1536x1024 px, a walkable building interior on a 12x8 grid of "
    "128-px tiles (the game shows it at half size). Follow the attached LAYOUT SKETCH layout_int_village_tavern_v2.png exactly: every labelled box stays where it is and "
    "about that size; the labels are for you only.\n"
    "View: a high three-quarter top-down angle (about 60 degrees), like the attached approved interiors. The back wall's front face fills the top two tile rows; thin side "
    "walls run down the far left and right columns; NO front wall — the bottom edge is cut away like a stage set, except the 2-tile doorway at bottom centre (tiles 5-6). "
    "No ceiling, no roof beams across the floor.\n"
    "THIS MUST READ AT A GLANCE AS A LIVELY FRONTIER TAVERN (the previous attempt, rejected_int_village_tavern.jpg, did not: it looked like an empty hall with a flat rug "
    "and cartoon flames, a city canal painting and flat paper squares). Required, all clearly painted in the approved style:\n"
    "- a long, heavy wooden BAR COUNTER across the left half (tile rows 3, columns 1-5) with brass-banded mugs and a jug on it, a few tall stools in front of it;\n"
    "- behind the bar (row 2) a keg rack with taps and, on the back wall above, shelves crowded with bottles, jars, hanging sausages and herbs, a small slate (blank);\n"
    "- a big rough STONE FIREPLACE built into the back wall at the right (columns 8-10, rows 0-2) with a real crackling log fire, an iron cauldron on a hook, a stack of "
    "split logs and a warm orange glow spilling onto the floor;\n"
    "- a wooden notice board on the back wall between them with a few pinned papers (blank, no writing);\n"
    "- a round table with stools (columns 7-8, row 4) and a long trestle table with benches (columns 2-3, row 5), with mugs, a candle stub, bread, a dropped cloak, a "
    "deck of plain cards — signs of sellswords waiting for work;\n"
    "- hanging oil lanterns, a mounted pair of old crossed spears (no emblem), a mounted antlered skull, smoke-darkened timber beams on the walls, barrels stacked in the "
    "front-right corner (column 10, row 6), sawdust on worn plank floor.\n"
    "The OPEN FLOOR (green tiles) stays flat, evenly lit and uncluttered. CHEST tiles (gold boxes: column 1 row 6, column 10 row 3): leave EMPTY floor — the game draws the "
    "chest. KEEPER tile (blue circle, column 3 row 2, behind the bar): empty floor — the game draws the keeper. Paint NO people and NO animals.\n"
    "Lighting: warm evening interior — firelight and lanterns, deep amber and brown with cool shadows by the walls.\n"
    + STYLE + "\n" + NOTEXT + "\n")

# ---------------------------------------------------------------- B-E: duel action sheets
POSES = [('ready', 'READY — combat stance, weapon drawn, eyes on the foe'),
         ('dash', 'DASH — lunging forward low and fast, cloak and hair streaming back, one foot off the ground'),
         ('strike', 'STRIKE — the attack at full extension (swing, thrust, shot or spell released)'),
         ('bind', 'BIND — weapons locked against the foe\'s (blade on blade / staff on staff), leaning in, straining, teeth set'),
         ('guard', 'GUARD — blocking or parrying a blow coming from the front, braced'),
         ('recoil', 'RECOIL — knocked back off balance by a hit, one arm out, grimacing (no blood, no wounds shown)'),
         ('finisher', 'FINISHER — the signature finishing technique at the instant of impact, the most dynamic pose of the sheet'),
         ('end', 'END — see the character note (heroes: victory pose; foes: beaten to one knee, alive)')]
def layout_duel(path):
    im = Image.new('RGB', (2048, 1024), '#1d2226'); d = ImageDraw.Draw(im); C = 512
    for i, (pid, desc) in enumerate(POSES):
        x, y = (i % 4) * C, (i // 4) * C
        d.rectangle([x, y, x+C-1, y+C-1], outline='#5a646c', width=2)
        d.line([x+20, y+480, x+C-20, y+480], fill='#c08040', width=3); d.text((x+24, y+486), 'FEET ON THIS LINE (y=480 in the cell)', fill='#c08040', font=font)
        d.line([x+20, y+60, x+C-20, y+60], fill='#406080', width=1); d.text((x+24, y+44), 'top of head about here (tallest ~420 px)', fill='#6090c0', font=font)
        d.text((x+16, y+12), f'{i+1}. {pid.upper()}', fill='white', font=font)
        d.text((x+16, y+26), desc.split(' — ')[1][:70] if ' — ' in desc else desc[:70], fill='#b0b8c0', font=font)
    im.save(path)
layout_duel(ref / 'layout_duel_sheet.png')

HEROES = {  # id, ko, look (base), finisher, weapon
 'eric': ('에릭', "a young knight in his twenties: short brown hair, steel plate with gold trim over a blue tabard with a plain white shield shape, longsword and kite shield",
          "Indomitable Will — he bashes upward with the shield, then brings the longsword down in a huge two-handed overhead cleave, a white-gold arc trailing the blade"),
 'elina': ('엘리나', "a young woman ranger: a long red braid, green hooded cloak over brown leathers, a longbow and a long hunting knife (in a duel she fights with both)",
           "Point-blank Shot — she slides under the foe's swing and looses a glowing charged arrow at a step's distance, the bowstring snapping, wind ripping her cloak"),
 'kai': ('카이', "a young man rogue: spiky black hair, a long red-orange scarf, a dark leather coat with many straps, twin daggers held reverse-grip",
         "Shadow Cross — he vanishes in a burst of grey smoke and reappears behind the foe mid-air, both daggers crossing in an X cut, scarf whipping"),
 'lia': ('리아', "a young woman mage, the legion's strategist: a wide-brimmed violet witch hat with a gold star clasp, long wavy dark hair, violet layered robes, a slender staff",
         "Starfall Barrage — staff thrust forward, a ring of violet arcane sigil-light (abstract circles, no runes) behind her firing a storm of violet bolts"),
 'sain': ('세인', "a young woman healer-priestess with dark brown skin: a white-and-gold hood and long white robes with a gold sun motif, a staff topped with a sunburst",
          "Dawnbreak — she raises the staff and a blinding burst of golden light erupts, then she strikes with the staff's head through the light, robes flaring"),
 'thea': ('테아', "a young woman cavalry knight on foot: auburn ponytail, steel armour with a thick grey fur collar, a blue cloak, a long lance",
          "Breaking Charge — a full-body lance thrust delivered running, the lance tip flashing, ground cracking under her front boot, cloak streaming"),
}
AWAKENED = {
 'eric': "the awakened Eric: older-looking and grave, grey-steel plate with heavy fur-trimmed pauldrons, a grey tabard with a small gold flame mark, a tall tower shield and longsword",
 'elina': "the awakened Elina: a mantle of layered brown feathers over her leathers, a red-fletched quiver, the same red braid, a recurved longbow and hunting knife",
 'kai': "the awakened Kai: a longer near-black coat, the same red-orange scarf, darker straps and bracers, twin daggers",
 'lia': "the awakened Lia: violet robes with sheer gold-edged layers, the wide violet hat, a faintly glowing blank card floating at her hand, a slender staff",
 'thea': "the awakened Thea: dark blued plate, a heavy grey fur mantle, a closed helm hanging at her hip, a long lance",
}
FOES = {  # id, ko, mission(s), look, refs (bust, sprite)
 'garr': ('가르', 'M01', "Garr, the bandit chief: a huge burly man, a mohawk and thick black beard, a shaggy brown fur mantle over red leather, a heavy two-handed axe", ('garr', 'garr')),
 'baldrick': ('발드릭', 'M05 · M13 · M26', "Baldrick Roen, the Black Lion: a grey-haired veteran general, short grey beard, black plate with gold trim and lion-shaped pauldrons (sculpted, no emblem), a thick gold fur collar, a long war-spear", ('baldrick', 'baldrick')),
 'chief': ('그림자 자객 우두머리', 'M09', "the Shadow Assassin chief: a lean hooded figure in dark olive-brown leathers, a cloth mask over the lower face, two curved blades", ('pursuerCaptain', 'assassin')),
 'oswin': ('오스윈 경', 'M10', "Sir Oswin of the blue-and-white banner: a knight in plate under a blue-and-white quartered tabard, a white plume, a round blue-and-white shield and a spear", (None, 'lordA')),
 'brennan': ('브레넌 경', 'M10', "Sir Brennan of the orange banner: a knight in plate under an orange-and-black tabard, an orange plume, a long halberd", (None, 'lordB')),
 'abbot': ('침묵의 원장', 'M12', "the Silent Abbot: a gaunt old man with a grey beard, layered grey-black monk robes bound with iron chains, a flanged mace and a burning censer-torch; he never speaks", (None, 'abbot')),
 'captain16': ('배신한 깃발의 기사대장', 'M16', "the turncoat knight-captain: a hard-faced man in a steel open helm with a blue plume, plate with a grey fur collar, a longsword and buckler", ('captain16_iron', 'greyCaptain')),
 'logger': ('벌목대장', 'M18', "the logging chief: a weathered bearded man in an olive hooded cloak and patched leathers, a double-bladed felling axe", ('deserterCaptain', 'forester')),
 'overseer': ('의식 감독관', 'M19', "the Rite Overseer: a heavy-set grey-haired man in violet-and-black plate with gold trim, a wide executioner's greatsword", ('executor', 'ritualKnight')),
 'greyMaster': ('회색 장부의 우두머리', 'M20', "the master of the Grey Ledger: a grey-haired man with a stubbled jaw, a long grey cloak over dark leather, a thin rapier and an iron chain with a small locked ledger at his belt", ('greyMaster', 'greyCaptain')),
 'riteCommander': ('의식 기사단장', 'M21', "the Rite Knight-Commander: a towering knight in full violet-and-gold plate, a closed great helm with a tall violet crest, a long sword and a tower shield (taller and grander than the Overseer)", ('executor', 'ritualKnight')),
 'hardliner': ('강경파 대장', 'M25', "the hardliner captain: a scarred, shaven-headed officer in heavy dented iron plate and a stained grey surcoat, a long-hafted warhammer", (None, 'ironInfantry')),
 'bellard': ('재상 벨라드', 'M29', "Chancellor Bellard: a thin older man with slicked grey hair, dark violet robes with a heavy gold chain of office, a slim sword in one hand and black-violet ash-magic coiling from the other", ('bellard', 'bellard')),
}
def bust_ref(id_):
    for e in ('neutral', 'determined'):
        p = assets / f'portraits/bust_{id_}_{e}.webp'
        if p.exists(): return png(p, f'ref_bust_{id_}.png')
def sheet_ref(id_):
    p = assets / f'sprites/sprite_{id_}.webp'
    return png(p, f'ref_sprite_{id_}.png') if p.exists() else None

def duel_prompt(name_line, look, facing, finisher, end_line, refs):
    return (f"Paint a DUEL ACTION SHEET of {name_line} for Ashen Crown's one-on-one duel scene: one PNG, exactly 2048x1024, transparent background (or flat pure #00FF00), "
            "a 4x2 grid of 512x512 cells, no grid lines, no labels. Follow references/layout_duel_sheet.png for which pose goes in which cell.\n"
            f"Character (match the attached references exactly — face, hair, costume, colours, weapon): {look}.\n"
            f"Every pose shows the whole body, FACING SCREEN {facing}, feet on the line at y=480 of the cell, the same height and proportions in all eight cells "
            "(about 380-420 px from feet to top of head; weapons may reach the cell edges but not past them). Strong dynamic action-illustration poses with motion in the "
            "cloth and hair, like the key frames of a finely drawn animated fight. Lighting: dramatic, from torches and a dusk sky behind — warm rim light on the edges.\n"
            + ''.join(f"Cell {i+1}: {d}.\n" for i, (_, d) in enumerate(POSES[:6]))
            + f"Cell 7: FINISHER — {finisher}.\nCell 8: END — {end_line}.\n"
            "Draw only the character and their own weapon (spell light, smoke or sparks that belong to the pose may be included close to the body). No opponent, no floor, "
            "no shadow, no background.\n" + STYLE + "\n" + NOTEXT + "\n")
for hid, (ko, look, fin) in HEROES.items():
    refs = [r for r in (bust_ref(hid), sheet_ref(hid)) if r] + ['layout_duel_sheet.png', 'style_aren_neutral.png']
    job('B', 'duel', hid, '', f'duel_{hid}.png', '2048x1024', refs,
        duel_prompt(f"{hid.capitalize()} ({ko}), one of the legion's heroes", look, 'RIGHT (they stand on the left of the duel stage)', fin,
                    "a victory pose — weapon lowered or raised, breathing hard, cloak settling, a proud, relieved look", refs))
for hid, look in AWAKENED.items():
    ko, _, fin = HEROES[hid]
    refs = [r for r in (bust_ref(f'{hid}_t3'), sheet_ref(f'{hid}_t3'), f'ref_bust_{hid}.png') if r] + ['layout_duel_sheet.png', 'style_aren_neutral.png']
    job('C', 'duel', f'{hid}_t3', '', f'duel_{hid}_t3.png', '2048x1024', refs,
        duel_prompt(f"{hid.capitalize()} ({ko}) after their awakening (the same person, later in the story)", look, 'RIGHT (they stand on the left of the duel stage)', fin,
                    "a victory pose — calm and grave, weapon lowered, light of the finisher fading around them", refs))
for i, (fid, (ko, ms, look, (b, s))) in enumerate(FOES.items()):
    refs = [r for r in ((bust_ref(b) if b else None), sheet_ref(s)) if r] + ['layout_duel_sheet.png', 'style_aren_neutral.png']
    job('D' if i < 7 else 'E', 'duel', fid, '', f'duel_{fid}.png', '2048x1024', refs,
        duel_prompt(f"{ko} — an enemy duellist ({ms})", look, 'LEFT (they stand on the right of the duel stage)',
                    "a desperate all-out attack — their strongest blow, thrown with everything they have",
                    "beaten: down on one knee, weapon lowered, cracked or dropped, one hand on the ground, head bowed — defeated but clearly alive (no blood, no wounds)", refs))

# ---------------------------------------------------------------- F: finishing-blow key art (one per hero, the foe a silhouette)
def layout_key(path):
    im = Image.new('RGB', (1920, 1080), '#1d2226'); d = ImageDraw.Draw(im)
    d.rectangle([140, 60, 1180, 1040], outline='#e0c070', width=6); d.text((160, 80), 'HERO (large, dynamic, the focus) - face clearly visible', fill='#e0c070', font=font)
    d.rectangle([1320, 260, 1820, 1040], outline='#707a84', width=4); d.text((1340, 280), 'FOE: a dark generic SILHOUETTE only (backlit,', fill='#a0a8b0', font=font)
    d.text((1340, 296), 'no face, no costume detail) - the same art is used for any foe', fill='#a0a8b0', font=font)
    d.line([600, 560, 1500, 560], fill='#ffffff', width=2); d.text((1000, 566), 'IMPACT POINT (light, sparks, speed lines)', fill='white', font=font)
    d.rectangle([0, 0, 1919, 1079], outline='#404850', width=2); d.text((20, 1050), 'keep 80 px clear at the left and right edges (phones crop to 16:9 safe area)', fill='#808890', font=font)
    im.save(path)
layout_key(ref / 'layout_finisher.png')
for hid, (ko, look, fin) in HEROES.items():
    refs = [f'ref_bust_{hid}.png'] + ([f'ref_sprite_{hid}.png'] if (ref / f'ref_sprite_{hid}.png').exists() else []) + ['layout_finisher.png', 'style_aren_neutral.png']
    job('F', 'key', f'finisher_{hid}', '', f'finisher_{hid}.jpg', '1920x1080', refs,
        f"Paint the FINISHING-BLOW KEY ART of {hid.capitalize()} ({ko}) for Ashen Crown's duel scene: one JPEG (quality 92-95), exactly 1920x1080, a full-frame cinematic "
        f"illustration shown for one heartbeat at the climax of every duel {hid.capitalize()} wins. Follow references/layout_finisher.png.\n"
        f"The hero (match the attached references; base look): {look}.\nThe moment: {fin}.\n"
        "Composition: a low, dramatic camera angle; the hero large on the left two-thirds, the whole figure or from the knees up, face visible and fierce; the opponent on the "
        "right is ONLY a dark backlit silhouette (no face, no costume detail, no colours) so the same picture works against any foe; a burst of light, sparks and speed lines "
        "at the impact point; dust and embers in the air; a dark dusk background softened by motion blur. It should feel like a frozen frame of a finely drawn action film.\n"
        + STYLE + "\n" + NOTEXT + "\n")

# ---------------------------------------------------------------- G: duel backdrops and the VFX sheet
def layout_stage(path):
    im = Image.new('RGB', (1920, 1080), '#28323a'); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 1919, 520], fill='#3a4a5a'); d.text((20, 20), 'SKY / FAR BACKGROUND (setting, mood)', fill='white', font=font)
    d.rectangle([0, 520, 1919, 700], fill='#4a4a40'); d.text((20, 530), 'MIDGROUND (walls, trees, buildings, torches, banners without marks)', fill='white', font=font)
    d.rectangle([0, 700, 1919, 1079], fill='#5a5040'); d.text((20, 710), 'STAGE FLOOR - flat, open, evenly lit: the two fighters stand here (feet around y=900)', fill='white', font=font)
    for x in (480, 1440): d.ellipse([x-90, 880, x+90, 920], outline='#e0c070', width=4); d.text((x-60, 930), 'fighter', fill='#e0c070', font=font)
    im.save(path)
layout_stage(ref / 'layout_duel_stage.png')
shutil.copy(h1 / 'references/ref_duel_screen.png', ref / 'ref_duel_screen.png')
for name in ['hub_village_raid', 'hub_fortress', 'hub_capital', 'hub_forest']:
    png(assets / f'hubs/{name}.webp', f'approved_{name}.jpg')
BACKDROPS = [
 ('duelbg_village', 'M01', 'the Ashen Village at dusk during the raid: burning thatched roofs, smoke and floating embers, a trampled village square of packed earth', 'approved_hub_village_raid.jpg'),
 ('duelbg_road', 'M05 · M09 · M18', 'a frontier road through an old forest at sunset: tall dark pines, a mossy stone marker, golden light through dust, a packed-earth clearing', 'approved_hub_forest.jpg'),
 ('duelbg_fortress', 'M10 · M13 · M16 · M25', 'a fortress courtyard of grey stone at stormy dusk: battlements, burning braziers, torn plain banners (no marks), a flagstone yard', 'approved_hub_fortress.jpg'),
 ('duelbg_rite', 'M12 · M19 · M20 · M21', 'a ritual plaza under an ash-grey sky with a violet glow: broken pillars, a sunken stone circle, drifting ash, cold violet braziers', 'approved_hub_capital.jpg'),
 ('duelbg_crown', 'M26 · M29', 'the great hall of the crown at the edge of dawn: tall cracked windows letting in cold blue light, an empty throne far behind, fallen banners, polished stone floor', 'approved_hub_capital.jpg')]
for id_, ms, scene, appr in BACKDROPS:
    refs = ['layout_duel_stage.png', appr, 'ref_duel_screen.png', 'style_aren_neutral.png']
    job('G', 'backdrop', id_, '', f'{id_}.jpg', '1920x1080', refs,
        f"Paint a DUEL BACKDROP for Ashen Crown ({ms}): one JPEG (quality 92-95), exactly 1920x1080, the stage behind a one-on-one duel. Follow references/layout_duel_stage.png: "
        "a wide side view at eye level, sky and far background in the top half, a midground band, and a flat, open, evenly lit STAGE FLOOR across the lower third where two "
        f"fighters will be drawn by the game (feet around y=900, at x≈480 and x≈1440). Setting: {scene}. Paint NO people and NO animals. Keep the centre of the stage clear and "
        "slightly darker at the edges (a natural vignette in the painting is fine) so the fighters read clearly. Dramatic, cinematic light.\n"
        "Painting style: match the attached approved hub painting and style_aren_neutral.png — hand-painted fantasy illustration, painterly cel shading, rich but earthy colours.\n" + NOTEXT + "\n")
VFX = ['slash arc, white-silver (a thick crescent swoosh)', 'slash arc, gold (heroic)', 'slash arc, violet (dark magic)', 'spark burst (metal on metal, orange-white)',
       'impact ring with flying shards', 'dust puff (from a stomp or a landing)', 'horizontal speed lines (a dash)', 'swirling embers and ash',
       'shield-block flash (a bright round flare)', 'violet arcane bolt with trail', 'golden holy light burst (rays)', 'grey smoke burst (a vanish)',
       'ground crack with debris', 'a rising column of golden light (level-up glow, no text)', 'small star twinkles', 'wind streaks (curving)']
def layout_vfx(path):
    im = Image.new('RGB', (2048, 2048), '#202020'); d = ImageDraw.Draw(im)
    for i, v in enumerate(VFX):
        x, y = (i % 4) * 512, (i // 4) * 512; d.rectangle([x, y, x+511, y+511], outline='#666'); d.text((x+10, y+10), f'{i+1:02d} {v}', fill='white', font=font)
    im.save(path)
layout_vfx(ref / 'layout_vfx.png')
job('G', 'vfx', 'duel_vfx', '', 'duel_vfx.png', '2048x2048', ['layout_vfx.png', 'style_aren_neutral.png'],
    "Paint the DUEL EFFECTS SHEET for Ashen Crown: one PNG, exactly 2048x2048, a 4x4 grid of 512x512 cells, TRANSPARENT background (real alpha; the effects are drawn "
    "over the scene with additive light), no grid lines, no labels. Follow references/layout_vfx.png. Each effect centred in its cell, filling most of it, soft glowing edges "
    "fading to full transparency well inside the cell border.\n" + ''.join(f"Cell {i+1:02d}: {v}.\n" for i, v in enumerate(VFX))
    + "Painted, not vector: brush-textured light, like hand-animated anime/painterly effects, matching the warm painterly look of style_aren_neutral.png. " + NOTEXT + "\n")

# ---------------------------------------------------------------- H, I: the H1 busts and icon sheets, painterly this time
for p in sorted((h1 / 'prompts').glob('*.txt')):
    n = int(p.name[:2])
    if 25 <= n <= 44:
        text = p.read_text(encoding='utf-8').split('Attach:')[0].rstrip()
        stem = p.stem[3:]; _, id_, expr = stem.split('_')
        text += ("\nIMPORTANT: the first attempt came back as flat vector drawings (rejected — see rejected_busts_H1.jpg). This must be a fully PAINTED portrait in the same "
                 "finish as the attached approved busts (ref_bust_baldrick_neutral.png, ref_bust_garr.png, ref_bust_eric.png): painted skin with soft shading and "
                 "highlights, painted hair strands, textured cloth and metal, a strong warm rim light. Placed beside the attached busts it must look like the same artist made it.\n")
        job('H' if n <= 39 else 'I', 'bust', id_, expr, f'bust_{id_}_{expr}.png', '1024x1280',
            ['style_aren_neutral.png', 'ref_bust_baldrick_neutral.png', 'ref_bust_garr.png', 'ref_bust_eric.png', 'rejected_busts_H1.jpg'], text)
for n, name in [(49, 'icons_P'), (50, 'icons_Q')]:
    p = h1 / f'prompts/{n}_{name}.txt'
    text = p.read_text(encoding='utf-8').rstrip() + ("\nIMPORTANT: the first attempt came back as flat vector icons (rejected — see rejected_icons_H1.jpg). Paint them like the "
        "attached approved icon sheets (approved_icons_D.png, approved_icons_H.png): painted objects with volume, texture, highlights and a soft shadow.\n")
    job('I', 'icons', name, '', f'{name}.png', '1024x1024', ['layout_' + name + '.png', 'approved_icons_D.png', 'approved_icons_H.png', 'rejected_icons_H1.jpg', 'style_aren_neutral.png'], text)
for nm in ['layout_icons_P.png', 'layout_icons_Q.png', 'approved_icons_D.png', 'approved_icons_H.png']:
    shutil.copy(h1 / 'references' / nm, ref / nm)
# the rejected H1 drafts, from the returned packs' contact sheets kept in the repo (D/E busts, G icons)
qa = root / 'docs/v2.1.0/art/pack-h1-qa'
def rejected_sheet(parts, name):
    ims = [Image.open(qa / f'contact_sheet_{p}.jpg') for p in parts if (qa / f'contact_sheet_{p}.jpg').exists()]
    if not ims:
        Image.new('RGB', (800, 200), '#333').save(ref / name); return
    w = max(i.width for i in ims); h = sum(i.height for i in ims); sheet = Image.new('RGB', (w, h), 'white'); y = 0
    for i in ims: sheet.paste(i, (0, y)); y += i.height
    sheet.thumbnail((1400, 1400)); sheet.save(ref / name, quality=80)
rejected_sheet(['D', 'E'], 'rejected_busts_H1.jpg'); rejected_sheet(['G'], 'rejected_icons_H1.jpg')

# ---------------------------------------------------------------- files
for n, j in enumerate(jobs, 1):
    pn = f"{n:02d}_{Path(j[4]).stem}.txt"
    (out / 'prompts' / pn).write_text(j[7] + f"\nAttach: {', '.join(j[6])}.\nOutput file name: {j[4]}\n", encoding='utf-8')
    j.append(pn)
with open(out / 'jobs.csv', 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
    for n, j in enumerate(jobs, 1): w.writerow([n, j[0], j[1], j[2], j[3], j[4], j[5], ', '.join(j[6]), f'prompts/{j[8]}'])
missing = sorted({r for j in jobs for r in j[6] if not (ref / r).exists()})
if missing: raise SystemExit(f'missing references: {missing}')

PARTS = {'A': ('the village tavern interior, redone', '마을 주점 실내 다시 그리기'),
         'B': ('duel action sheets — the six heroes', '일기토 동작 시트 — 주인공 여섯(에릭·엘리나·카이·리아·세인·테아)'),
         'C': ('duel action sheets — five heroes after their awakening', '일기토 동작 시트 — 각성한 다섯(에릭·엘리나·카이·리아·테아)'),
         'D': ('duel action sheets — enemy duellists 1', '일기토 동작 시트 — 적 1(가르·발드릭·그림자 자객·오스윈·브레넌·침묵의 원장·배신한 기사대장)'),
         'E': ('duel action sheets — enemy duellists 2', '일기토 동작 시트 — 적 2(벌목대장·의식 감독관·회색 장부·의식 기사단장·강경파 대장·벨라드)'),
         'F': ('finishing-blow key art, one per hero', '결정타 컷 — 주인공마다 한 장(상대는 실루엣)'),
         'G': ('duel backdrops (five) and the effects sheet', '일기토 배경 다섯과 효과(VFX) 시트'),
         'H': ('busts of the ACT I hires and Adel, painted (redo)', '용병 넷과 아델 초상 × 표정 셋 — 유화풍으로 다시'),
         'I': ('busts of the later hires and icon sheets P and Q, painted (redo)', '나중 용병 다섯 초상, 아이콘 시트 P·Q — 다시')}
count = {p: sum(1 for j in jobs if j[0] == p) for p in PARTS}
SIZES = {'room': 'JPEG 1536×1024', 'duel': 'PNG 2048×1024, alpha', 'key': 'JPEG 1920×1080', 'backdrop': 'JPEG 1920×1080', 'vfx': 'PNG 2048×2048, alpha', 'bust': 'PNG 1024×1280, alpha', 'icons': 'PNG 1024×1024, alpha'}
start = f"""# Ashen Crown — v2.2.0 Art Work Order (pack I: the duel scene and the village tavern)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file, then do **one part per run** in the order below and return the zip described in section 6.

What this pack is for:
- **The duel scene (parts B–G).** When two story-linked fighters meet, the game opens a separate cinematic window and the two fight. The game animates your painted key poses (sliding, zooming, slow motion, screen shake, flashes and your effects) so it plays like a short, finely drawn action film. Our hero always wins the duel.
- **The village tavern (part A).** The previous painting did not read as a tavern; it is redone with a new layout.
- **Parts H–I** redo, painted this time, portraits and icons that first came back as flat vector drafts.

| part | what | images |
|---|---|---:|
""" + ''.join(f"| **{p}** | {PARTS[p][0]} | {count[p]} |\n" for p in PARTS) + f"| | **total** | **{len(jobs)}** |\n" + """
## 1. Style — the one rule above all
Everything must look like it was painted by the artist of `references/style_aren_neutral.png` and the other `approved_*` / `ref_*` images:
- semi-realistic hand-painted fantasy illustration;
- confident inked contours and painterly cel shading with soft gradients;
- warm rim light, with rich but earthy colours.

**Flat vector art, clip-art, chibi, western cartoon, 3D renders and photo-realism are all rejected.** The `rejected_*` images show what came back last time and must not happen again.

## 2. Characters
- Match each character's attached bust and map sprite exactly: face, hair, skin, costume, colours and weapon. The same character must look the same in every image of the pack.
- Heroes face **screen right**; enemy duellists face **screen left**.
- No blood, wounds or gore anywhere. A beaten foe is on one knee, alive.

## 3. Jobs

| # | part | file | what | format | attach | prompt |
|---|---|---|---|---|---|---|
""" + ''.join(f"| {n} | {j[0]} | `{j[4]}` | {j[2]}{(' · ' + j[3]) if j[3] else ''} | {SIZES[j[1]]} | {', '.join(j[6])} | `prompts/{j[8]}` |\n" for n, j in enumerate(jobs, 1)) + """
## 4. Global rules
- Exact pixel sizes as listed. PNGs that need alpha use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md.
- **Duel sheets (B–E):** a 4×2 grid of 512×512 cells in the order of `layout_duel_sheet.png`.
  - Feet on the line at y=480 of every cell.
  - The same height and proportions in all eight cells.
  - Only the character and their weapon — no opponent, floor, shadow or background.
- **Key art (F):** the hero dominates the frame. The opponent is only a dark generic silhouette.
- **Backdrops (G):** no people. Keep the stage floor in the lower third flat and clear.
- **Effects (G):** real alpha, with soft edges fading to transparency.
- **Tavern (A):** follow `layout_int_village_tavern_v2.png`. Leave CHEST and KEEPER tiles as empty floor, paint no people, and add no front wall.
- No text, letters, numbers, runes, emblems or logos. Nothing may imitate an existing game.

## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)
- [ ] Every file at its exact size and format; the alpha method stated.
- [ ] Style: placed beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).
- [ ] Duel sheets: eight poses in the right cells, feet on y=480, consistent size, correct facing, the END pose matches hero (victory) or foe (beaten, alive).
- [ ] The same character is recognisably the same across all of the pack's images and matches their references.
- [ ] Key art: the foe is a featureless silhouette; the hero's face is visible.
- [ ] Tavern: bar counter, keg rack, stone fireplace with fire, tables, lanterns all clearly painted; layout boxes respected; chest and keeper tiles empty.
- [ ] No text, emblems, blood or gore.

## 6. Return format — one zip per part, **each under 25 MB** (if larger, split as `_1`, `_2`)
""" + ''.join(f"- `Ashen_Crown_v220_Art_Pack_I_{p}.zip`\n" for p in PARTS) + """
```
Ashen_Crown_v220_Art_Pack_I_<A–I>/
  png/ or jpg/        # the masters, file names exactly as in section 3
  manifest.csv        # id,kind,expression,file,width,height,sha256
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # under 1 MB
  prompts_used/
```
Before you hand a zip over, reopen it, list every file, verify every file against SHA256SUMS and report the zip's exact size in bytes. If an item cannot be met, deliver your best image and state the deviation plainly.
"""
(out / '00_START_HERE.md').write_text(start, encoding='utf-8')
ko_rows = ''.join(f"| **{p}** | {PARTS[p][1]} | {count[p]} |\n" for p in PARTS)
(out / 'README_KO.md').write_text(f"""# 사용 방법 (사용자용) — 그림팩 I: 일기토 장면과 마을 주점 (v2.2.0, {len(jobs)}장)

2026-11-18 22:44 요청을 반영한 지시서입니다.
- 마을 주점을 주점답게 다시 그립니다.
- 일기토는 새 창에서 두 사람이 싸우는 장면으로 바꾸고, 우리 장수가 반드시 이기고 레벨이 오릅니다.

게임 쪽 설계(PROPOSED)는 `docs/v2.2.0/DUEL_SCENE_DESIGN.md`에 있습니다. GPT용 영문 지시는 `00_START_HERE.md`입니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{ko_rows}| | **합계** | **{len(jobs)}** |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 아래를 붙여 넣으세요. `<A–I>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B|C|D|E|F|G|H|I> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v220_Art_Pack_I_<A|B|C|D|E|F|G|H|I>.zip.
```
- 우선순위가 있다면 **A(주점) → B·D(첫 일기토에 필요한 에릭·엘리나·가르) → G → F → C·E → H·I** 순서를 권합니다.
- 받은 부분부터 넣을 수 있습니다. 아직 없는 그림은 지금의 초상·전장 그림으로 대신합니다.

## 일기토 장면이 「동영상처럼」 움직이는 방식
- 동영상 파일 대신, 장면마다 **정교하게 그린 핵심 동작 8컷**을 받습니다.
  - 동작 8컷: 준비 · 돌진 · 공격 · 칼 맞대기 · 막기 · 밀려남 · 결정타 · 마무리
  - 여기에 결정타 컷, 배경, 효과(불꽃 · 베기 궤적 · 충격파 · 먼지 · 마법 · 빛기둥)를 더합니다.
- 게임이 이 그림들을 연출해 짧은 액션 영화처럼 보여 줍니다.
  - 미끄러지듯 다가가기, 확대, 슬로모션, 화면 흔들림, 번쩍임, 잔상, 효과 겹치기
- 동영상을 쓰지 않는 이유는 용량입니다.
  - 짝마다 영상을 넣으면 14쌍 × 수 MB가 됩니다.
  - 지금 게임 파일이 이미 약 53 MB이고, GitHub에 올릴 수 있는 한도는 100 MB입니다.
  - 그림 방식은 짝이 바뀌어도 같은 그림을 다시 쓸 수 있어 훨씬 가볍습니다.

장면 흐름(약 10초, 화면을 누르면 건너뜀):
1. 검은 창이 열리고, 장소에 맞는 배경(마을 · 숲길 · 성채 · 의식 광장 · 왕관의 홀)이 깔립니다.
2. 두 사람의 초상이 양쪽에서 미끄러져 들어오며 이름과 「일기토」가 뜹니다. 이어서 이야기 대사 두 줄이 나옵니다.
3. **1합:** 둘 다 돌진하다 칼이 맞물립니다(불꽃, 화면 흔들림). 상대가 밀려납니다.
4. **2합:** 상대의 강공을 우리 장수가 막아 내고(방패 섬광), 되받아칩니다.
5. **3합:** 슬로모션으로 우리 장수의 **결정타**가 들어갑니다. 결정타 컷이 화면 가득 번쩍입니다. 상대는 한쪽 무릎을 꿇습니다.
6. 승리 자세와 함께 금빛 기둥이 솟고 **「LEVEL UP」**이 뜨며 레벨이 하나 오릅니다.

## 주점 다시 그리기
- 앞 그림은 빈 홀에 납작한 깔개와 만화 같은 불, 도시 운하 그림이 걸려 있어 주점처럼 보이지 않았습니다.
- 새 지시서는 아래를 분명히 그리게 했습니다.
  - 왼쪽: 긴 바 카운터와 술통 선반
  - 오른쪽: 돌로 쌓은 큰 벽난로
  - 가운데: 의뢰 게시판
  - 탁자 · 의자 · 등불 · 술잔
- 주인은 바 뒤에 서 있도록 바꿨습니다(배치도 `layout_int_village_tavern_v2.png`).

## 받은 뒤
ZIP을 Claude에게 주세요. SHA256을 검증하고 넣습니다.
- 주점: import-interior-art.py
- 초상: import-art.py
- 아이콘: import-item-art.py --cells
- 일기토 그림: 새 import 스크립트를 v2.2.0 개발 때 만듭니다.
""", encoding='utf-8')
zip_out = Path(sys.argv[1]) if len(sys.argv) > 1 else None
if zip_out:
    with zipfile.ZipFile(zip_out, 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(out.rglob('*')):
            if p.is_file(): z.write(p, 'Ashen_Crown_v220_Duel_Work_Pack/' + p.relative_to(out).as_posix())
print(len(jobs), 'jobs;', count)
