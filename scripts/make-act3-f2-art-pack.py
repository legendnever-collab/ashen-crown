#!/usr/bin/env python3
"""Build the ChatGPT work pack F2 for ACT III part 2 (v0.9.1, M17–M18; ACT3_DESIGN.md §10, D-084, D-087): everything v0.9.1
still draws as a temporary (game-drawn) placeholder, in four parts that can be ordered one at a time —
  A. places and things: the guardians' keep and the forest village (each on the footprint the game already uses for it, so
     the walk masks and doors stay), the forest village's six rooms on the village room footprints, a four-style chest
     sheet, icon sheet I (the three ④ ultimates, the two v0.9.1 treasures, the basic potion) and a battle-prop sheet (the
     ward tree in three states, the sleeping guardian statue);
  B. the awakened looks (tier 3) of Erik, Elina and Sain — busts and map sheets;
  C. the recruits' tier 2 looks of Thea, Dario and Ines — busts and map sheets;
  D. the people of the keep and the forest (the last guardian, the forest elder), the M16 knight-captains of the three
     banners (who speak in the duel), and the map figures of the guardian statue, the forest-keepers and the chancellery
     captain.
Reuses the prompt templates of make-act2-character-pack.py, make-interior-work-pack.py, make-item-art-pack.py and
make-act3-art-pack.py, so the returned files import with scripts/import-art.py, scripts/import-interior-art.py and
scripts/import-item-art.py --cells (the prop sheet gets its own importer step when it returns).
Usage: python3 scripts/make-act3-f2-art-pack.py [--zip <out.zip>] [--icons-h <returned icons_H.png>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
cp = load('cp', 'make-act2-character-pack.py'); iwp = load('iwp', 'make-interior-work-pack.py'); ip = load('ip', 'make-item-art-pack.py')
f1 = load('f1', 'make-act3-art-pack.py'); bp = load('bp', 'make-act2b-art-pack.py')
PACK = ROOT/'docs/v0.9.1/art/act3-f2-work-pack'
NAME = 'Ashen_Crown_v091_ACT3_Art_Pack_F2'
OLD = ROOT/'docs/v0.5.0/art/world-work-pack/references'
F1REF = ROOT/'docs/v0.9.0/art/act3-f1-work-pack/references'

# ---------- B / C: new looks of the heroes and the recruits (all PROPOSED) ----------
EVOLVE = ("Using the attached {base} as the exact identity reference: the same person — same face, age, skin, eye color and hair — painted in the same "
          "style, framing and lighting. This is the character's new {stage} look; keep the core colors so the player knows them at once, and change the "
          "outfit as follows.\nNew look: {desc}\nExpression: {expr}\n"
          "Output: PNG exactly 1024x1280 portrait, the character only on a fully TRANSPARENT background (if impossible, flat pure green #00FF00), no text, no frame, "
          "no UI; same framing and scale as the attached bust (top of the hair about 8% below the top edge, shoulders filling the width).")
AWAKEN = [
 dict(id='eric_t3', base='eric_t2', part='B', name='Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened)', ref='eric_t2',
  desc=("Erik after he swears the guardians' oath at the keep. His teal plate is now aged, burnished steel with pale-gold edging, the layered pauldrons "
        "keep their shape; over them an old stone-grey mantle with a frayed hem, given to him by the last guardian, fastened over the dark purple cape. "
        "Thin lines of soft blue-gold light run along the edges of the tall tower shield and the gauntlet seams, like the light in the guardian statues' eyes "
        "(subtle, not a glowing aura). A small smooth grey stone token on a cord at the throat. Older-looking eyes, calm and resolved."),
  weapon='the tall tower shield with the faint blue-gold edge light and a straight longsword; attack pose is a shield-forward guard with a short thrust'),
 dict(id='elina_t3', base='elina_t2', part='B', name='Elina — Hawk Archer (엘리나 · 매의 사수, awakened)', ref='elina_t2',
  desc=("Elina after M16. The dark-green ranger cloak now has a short layered mantle of brown-and-white hawk feathers over the shoulders, the hood down; "
        "a falconer's leather glove on the draw hand, a leather bracer on the bow arm with fine tooling (no symbols); a single long barred hawk feather tied "
        "into the braid; an amber-tinted strap of arrows with red fletching on the back. Keen, steady, a little older in the eyes. No bird."),
  weapon='a long recurved bow of pale ash wood with dark horn tips; attack pose is a full draw'),
 dict(id='sain_t3', base='sain_t2', part='B', name='Sain — Dawn Priest (세인 · 새벽 사제, awakened)', ref='sain_t2',
  desc=("Sain after M18. The cream robe turns to the colors of first light: white and very pale rose-gold with a soft dawn-pink inner lining, a light "
        "half-cape of pale gold, the hood down showing the short cream-white hair; a small hanging lantern at the belt holding a soft dawn-pink flame. "
        "Gender stays intentionally ambiguous. Gentle and hopeful, with quiet strength."),
  weapon='the golden staff, its head now a plain open ring of pale gold that glows faintly like sunrise; attack pose raises the staff and the ring brightens'),
]
RECRUITS = {r['id']: r for r in cp.RECRUITS}; RECRUITS['ines'] = bp.RECRUIT
PROMOTE = [
 dict(id='thea_t2', base='thea', part='C', name='Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2)', ref='thea', mounted=True,
  desc=("Thea after her promotion trial. The steel-blue lamellar becomes heavier blackened-iron plate with thin steel-blue edging, the fur collar now dark "
        "grey wolf fur, a longer black riding cape; copper-brown ponytail and the small chin scar unchanged; an open-faced black iron helm carried under one arm "
        "in the bust (worn on the map). Disciplined, a sharper and more confident look."),
  weapon='a heavier long lance with a plain black pennant (no emblem); on the map she rides a grey horse in black iron barding with steel-blue cloth'),
 dict(id='dario_t2', base='dario', part='C', name='Dario — Sword Saint (다리오 · 검성, tier 2)', ref='dario', mounted=False,
  desc=("Dario after his promotion trial. A long sea-green-and-wine coat open over a light mail shirt, the brigandine gone, a leather bracer in place of the "
        "old bandage, the black curly hair tied back neatly; the gold hoop earring stays. The sly grin has become a calm, focused half-smile — a master who "
        "no longer needs to show off."),
  weapon='a single elegant longsword with a bright plain steel blade and a wrapped grip, held in one hand; attack pose is a clean fast cut'),
 dict(id='ines_t2', base='ines', part='C', name='Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2)', ref='ines', mounted=False,
  desc=("Ines after her promotion trial. A heavier white-and-gold tabard with plain crimson borders over bright mail and rounded pauldrons, a long crimson "
        "cloak, the short black hair with the thin braid unchanged, the pale scar across the nose. A faint warm golden haze close around the shield rim "
        "(sanctuary), subtle."),
  weapon='the long-hafted poleaxe with gold binding and a larger round white shield with a broad plain gold rim (no emblem)'),
]

# ---------- D: people of the keep and the forest; the M16 knight-captains; three map figures ----------
GUARDIAN = dict(id='guardianElder', part='D', name='the last guardian of the keep (마지막 수호자)', exprs=['neutral', 'concerned', 'sad'], ref='eric',
 desc=("The last living guardian of the Guardians' Keep on the northern plateau, a very old man (late seventies), stooped but broad-shouldered. Bald, a long "
       "white beard, deep-set tired grey eyes, a weathered face. Worn steel plate of an ancient pattern with rounded pauldrons, slate-blue cloth under it, a faded "
       "pale-gold edging, a heavy grey wool mantle. He swore the oath forty years ago and gave his wife's face to it: he remembers her name but not her face. "
       "Kind, proud, without regret."),
 weapon='an old long spear he leans on like a staff; attack pose is a slow straight thrust')
FOREST = dict(id='forestElder', part='D', name='the forest elder of the unburning forest (숲지기 장로)', exprs=['neutral', 'concerned', 'sad'], ref='eric',
 desc=("The elder of the forest-keepers in the unburning forest, a woman in her sixties. Long grey-white hair in a loose braid wound with green ribbons and a "
       "few small fresh leaves, sun-browned skin, soft hazel eyes, a serene, almost too peaceful smile — her people forget every winter and do not know it. "
       "Layered moss-green and bark-brown robes with pale-gold stitching along the hems (plain lines, no symbols), a shawl of undyed wool."),
 weapon='a carved wooden walking staff with a living sprig of green leaves at the top; no weapon — the attack column is a calm raised hand')
CAPTAIN_EXPRS = ['determined', 'sad']
CAPTAINS = [
 dict(id='captain16_iron', part='D', look='ironInfantry', name="Iron Crown knight-captain of the betraying banner (철왕관 기사대장, M16 duel)",
  desc=("a knight-captain of the Iron Crown Dominion in his forties who turned on the legion at the summit: steel-blue plate over a dark padded coat, a grey fur "
        "mantle, an open steel helm with a short steel-blue crest, a square jaw with short dark stubble, cold disciplined eyes; proud, honorable in his own way")),
 dict(id='captain16_free', part='D', look='lordA', name='Free Lords Alliance knight-captain of the betraying banner (연맹 기사대장, M16 duel)',
  desc=("a knight-captain of the Free Lords Alliance in his late thirties: green-and-cream lacquered half-plate, a short dark-green cape, a ribbon sash of many "
        "narrow colors, chestnut hair swept back, a trimmed beard, a confident sardonic look")),
 dict(id='captain16_flame', part='D', look='flameKnight', name='Sacred Flame knight-captain of the betraying banner (성화 기사대장, M16 duel)',
  desc=("a knight-captain of the Order of the Sacred Flame in her forties: white enamelled plate with crimson borders and gold-colored edging, a crimson cloak, "
        "short fair hair, a stern zealous face with a thin scar on the cheek")),
]
FIGURES = [
 dict(id='guardianElder', part='D', name='the last guardian — map figure (hub NPC)', ref='eric', bust='bust_guardianElder_neutral.png (your approved result)',
  desc=GUARDIAN['desc'], weapon=GUARDIAN['weapon']),
 dict(id='forestElder', part='D', name='the forest elder — map figure (hub NPC)', ref='eric', bust='bust_forestElder_neutral.png (your approved result)',
  desc=FOREST['desc'], weapon=FOREST['weapon']),
 dict(id='guardianStatue', part='D', name='guardian statue, awakened — map figure (fights for whoever swore the oath, M17)', ref='ironSpear',
  desc=("a life-size stone knight that has woken: weathered pale grey granite armor with moss and lichen in the cracks, a closed stone helm with a narrow eye "
        "slit, soft blue-gold light glowing in the eye slit and in the joints of the armor; heavy, slow, solemn — clearly stone, not a man in armor"),
  weapon='a stone tower shield and a stone longsword; attack pose is a heavy downward cut'),
 dict(id='forester', part='D', name='forest-keeper villager (civilian to lead to safety, M18)', ref='eric',
  desc=("a forest-keeper villager of the unburning forest, any age: layered moss-green robe with a bark-brown hood down, a few leaves woven into the hair, a "
        "small woven basket of mushrooms at the hip, soft leather shoes; calm and unafraid even in danger"),
  weapon='a plain walking staff; no weapon — the attack column is a startled step back holding the staff'),
 dict(id='greyCaptain', part='D', name="the chancellery's grey captain (enemy commander, M17)", ref='ironSpear',
  desc=("the captain of the chancellery's grey soldiers: dull grey steel plate, an ash-grey hooded mantle over it, pale bone-white edging, black gloves, the hood "
        "up over an open grey helm, a pale stern face; no colors and no badges"),
  weapon='a long straight sword held in both hands; attack pose is a heavy overhead cut'),
]

def char_jobs(part):
    J = []
    if part == 'B' or part == 'C':
        for c in (AWAKEN if part == 'B' else PROMOTE):
            stage = 'awakened (third tier)' if part == 'B' else 'promoted (second tier)'
            for e in cp.EXPR:
                if e == 'neutral':
                    refs = f"ref_bust_{c['base']}_neutral.png, style_aren_neutral.png"
                    prompt = EVOLVE.format(base=f"ref_bust_{c['base']}_neutral.png", stage=stage, desc=c['desc'], expr=cp.EXPR[e])
                else:
                    refs = f"bust_{c['id']}_neutral.png (your approved result)"; prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
                J.append(dict(id=c['id'], part=part, kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
        for c in (AWAKEN if part == 'B' else PROMOTE):
            ref = 'cavalry' if c.get('mounted') else 'eric'
            J.append(dict(id=c['id'], part=part, kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768',
                          refs=f"bust_{c['id']}_neutral.png (your approved result), ref_sprite_{c['ref']}.png, ref_sprite_{ref}.png",
                          prompt=cp.SHEET_D.format(ref=c['ref'], mounted=cp.MOUNTED if c.get('mounted') else '', desc=c['desc'], weapon=c['weapon'])
                                 + f"\nThis is the new look of the figure in the attached ref_sprite_{c['ref']}.png: keep its size, proportions and colors so the player recognizes it."
                          , who=c['name']))
        return J
    for c in (GUARDIAN, FOREST):
        for e in c['exprs']:
            if e == 'neutral':
                refs = 'style_aren_neutral.png, ref_bust_baldrick_neutral.png'; prompt = cp.BUST_B.format(desc=c['desc'], expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"; prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e])
            J.append(dict(id=c['id'], part='D', kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in CAPTAINS:
        for e in CAPTAIN_EXPRS:
            if e == CAPTAIN_EXPRS[0]:
                refs = f"ref_sprite_{c['look']}.png (the map figure this captain must match), style_aren_neutral.png, ref_bust_baldrick_neutral.png"
                prompt = cp.BUST_B.format(desc=c['desc']+f". The outfit and colors must match the attached ref_sprite_{c['look']}.png map figure, which is this captain's troop", expr=cp.EXPR[e])
            else:
                refs = f"bust_{c['id']}_{CAPTAIN_EXPRS[0]}.png (your approved result)"
                prompt = cp.BUST_C.format(id=c['id'], expr=cp.EXPR[e]).replace(f"bust_{c['id']}_neutral.png", f"bust_{c['id']}_{CAPTAIN_EXPRS[0]}.png")
            J.append(dict(id=c['id'], part='D', kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in FIGURES:
        refs = f"{c['bust']}, ref_sprite_{c['ref']}.png" if c.get('bust') else f"ref_sprite_{c['ref']}.png, style_aren_neutral.png"
        J.append(dict(id=c['id'], part='D', kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768', refs=refs,
                      prompt=cp.SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

# ---------- A: places (the keep on the fortress footprint, the forest village on the village footprint) ----------
HUBS = [
 dict(id='hub_keep', base='hub_fortress', layout='layout_hub_fortress.png', title="the Guardians' Keep on the northern plateau (M17)",
  scene=("The Guardians' Keep, an ancient citadel high on a cold northern plateau, half ruined but still standing, late afternoon under a pale sky with thin "
         "drifting cloud. Massive pale grey granite walls far older than the kingdom, weathered and patched with moss and lichen; broken battlements on one side; "
         "tall narrow arched windows; heavy timber doors bound in old iron. In the courtyard and along the walls stand several life-size stone knight statues on "
         "plinths, eyes dark, weathered and solemn (they are part of the scenery here, not characters). Sparse hardy grass and heather between the flagstones, "
         "a few stunted pines outside the walls, distant snow-dusted peaks beyond. The keep's buildings: the guardians' hall, a small chapel of the oath, barracks, "
         "an armory, the archive tower. Keep exactly the same footprint as the attached approved_hub_fortress.jpg (the same building positions, door tiles, "
         "courtyard and gates) — it is a different, older fortress painted on the same layout. Match the style of the attached approved hubs. Quiet, cold, "
         "noble and sad.")),
 dict(id='hub_forest', base='hub_village_day', layout='layout_hub_village.png', title='the forest village in the unburning forest (M18)',
  scene=("The forest-keepers' village deep in an ancient forest that never burns, soft morning light falling through a high green canopy in long beams, a light "
         "mist between enormous old trunks. Low houses of dark timber and woven wattle with mossy turf and thatch roofs, round doors, wind chimes of wood and "
         "little lanterns hanging from branches, vegetable patches and herb beds, a moss-covered stone well. At the heart of the village one immense ancient "
         "ward tree with roots like walls (scenery only). Everything is green, gentle and a little too perfect — no fallen leaves rot, nothing is sick. "
         "The buildings: a woodworker's and bowyer's workshop (weapon shop), an herbalist (item shop), the guides' longhouse, the elder's lodge, a family house, "
         "a seed-and-root store. Keep exactly the same footprint as the attached approved_hub_village_day.jpg (the same building positions, door tiles, square, "
         "paths and well) — it is a different village painted on the same layout. Match the style of the attached approved hubs.")),
]
VILLAGE = {r['id']: r for r in iwp.INTERIORS}
ROOMS = [
 dict(VILLAGE['int_village_barracks'], base='int_village_barracks', id='int_forest_longhouse', family='forest', used="the guides' longhouse", title="guides' longhouse", anchor=True,
  scene=("Inside the forest guides' longhouse: dark timber posts carved with simple leaf lines (no symbols), a woven wattle wall, a mossy turf ceiling with "
         "roots showing between beams, sleeping benches with wool blankets, bows, walking staffs and coiled ropes on wall pegs, a low hearth of river stones, "
         "green light through a round window. Calm, tidy and warm. Empty of people."),
  chests=[('a', 1, 4, 'guide_locker'), ('b', 10, 2, 'guide_locker')]),
 dict(VILLAGE['int_village_forge'], base='int_village_forge', id='int_forest_bowyer', family='forest', used='woodworker and bowyer (weapon shop)', title='woodworker and bowyer',
  scene=("Inside the woodworker's and bowyer's workshop (same construction as the approved longhouse): a shaving horse and a workbench with wood shavings, "
         "unstrung bow staves drying on racks, finished bows and spears and wooden shields on the right wall, a small charcoal brazier instead of a forge, a sales "
         "counter with a bow laid on a green cloth, the bowyer's floor behind it.")),
 dict(VILLAGE['int_village_shop'], base='int_village_shop', id='int_forest_herbalist', family='forest', used='herbalist (item shop)', title='herbalist',
  scene=("Inside the herbalist's (same construction as the approved longhouse): bundles of herbs and dried flowers hanging from the beams, clay jars and glass "
         "bottles with green and amber tinctures on bark shelves, a mortar and pestle, a basket of fresh mushrooms, a counter with a small brass scale, sunlight "
         "through leaves in a round window.")),
 dict(VILLAGE['int_village_hall'], base='int_village_hall', id='int_forest_lodge', family='forest', kind='quarters', used="the elder's lodge", title="elder's lodge",
  scene=("Inside the forest elder's lodge (same construction as the approved longhouse, a little grander): a living tree trunk grows through the room, a low "
         "round table with cushions, woven hangings of plain green and brown stripes, shelves of carved wooden figures and dried seed heads, a carved chest, "
         "a calendar of notched sticks on the wall where every winter's notches are missing (subtle, no writing).")),
 dict(VILLAGE['int_village_house'], base='int_village_house', id='int_forest_house', family='forest', used="a forest-keeper family's house", title='forest-keeper house',
  scene=("Inside a forest-keeper family's round house (same construction as the approved longhouse): a bed with a patchwork of green and brown wool, a small "
         "hearth with a clay pot, a table with bread and berries, a cradle, dried flowers on the walls, a round window on the misty trunks.")),
 dict(VILLAGE['int_village_store'], base='int_village_store', id='int_forest_store', family='forest', used='seed and root store', title='seed and root store',
  scene=("Inside the seed-and-root store (same construction as the approved longhouse): bins of nuts and acorns, hanging strings of roots and mushrooms, sacks "
         "of seed, stacked woven baskets, clay storage jars, a ladder to a loft.")),
]
for r in ROOMS: r['ext'] = 'hub_forest.jpg (your approved result)'
# the forest's names for the village furniture, same tiles (so the walk masks of the village rooms still fit)
RELABEL = {
 'int_forest_longhouse': ['SLEEPING BENCH (wool blankets)', 'SLEEPING BENCH', 'SLEEPING BENCH', 'LOW TABLE + log benches', 'BOWS + STAFFS on pegs'],
 'int_forest_bowyer': ['CHARCOAL BRAZIER + shaving horse', 'WORKBENCH (shavings)', "BOWYER'S WORK FLOOR (behind counter)", 'SALES COUNTER (bow on green cloth)', 'BOW + SPEAR RACKS', 'WOODEN SHIELDS'],
 'int_forest_herbalist': ['HERB BUNDLES (hanging)', 'BASKETS + clay jars', 'STOCK FLOOR (behind counter)', 'COUNTER (scale, mortar)', 'TINCTURE SHELVES (bark)'],
 'int_forest_lodge': ['SHELF (carved figures, seed heads)', 'ROUND TABLE + cushions (a living trunk beside it)', 'NOTCHED-STICK CALENDAR + hearth'],
 'int_forest_house': ['BED (green-brown wool)', 'TABLE (bread, berries)', 'HEARTH (clay pot)', 'CRADLE + shelf'],
 'int_forest_store': ['WOVEN BASKET STACK', 'CLAY STORAGE JARS', 'SEED SACKS', 'ROOT + MUSHROOM STRINGS'],
}
for r in ROOMS: r['regions'] = [(n,)+tuple(g[1:]) for n, g in zip(RELABEL[r['id']], r['regions'])]
for r in ROOMS:
    if r.get('npc'): r['npc'] = (r['npc'][0], r['npc'][1], 'BOWYER stands here' if r['kind'] == 'weapon' else 'HERBALIST stands here')
CHESTS = [
 ('guide_locker', "guides' longhouse", 'a long low chest of dark walnut wood with leather straps and a coiled rope and a bundle of arrows tied on the lid'),
 ('keeper_box', 'forest-keeper house', 'a small chest of pale birch wood with rounded corners and a carved leaf border (plain lines, no symbols), a simple wooden latch'),
 ('elder_casket', "elder's lodge", 'a carved casket of old dark oak with a living green moss pad on the lid and smooth river-stone handles'),
 ('seed_bin', 'seed and root store', 'a woven wicker bin with a wooden lid, acorns and seeds spilling around its base'),
]
ROOM_CHEST = {'int_forest_house': [('a', 1, 4, 'keeper_box')], 'int_forest_lodge': [('a', 10, 4, 'elder_casket')], 'int_forest_store': [('a', 10, 4, 'seed_bin'), ('b', 3, 4, 'seed_bin')]}
for r in ROOMS:
    if r['id'] in ROOM_CHEST: r['chests'] = ROOM_CHEST[r['id']]
    elif r['id'] != 'int_forest_longhouse': r['chests'] = []

def chest_layout():
    f1.CHESTS[:] = CHESTS
    return f1.chest_layout()

# ---------- A: icon sheet I and the battle-prop sheet ----------
ICON_ART = {
 'oathWall': ('skill', 'a tall tower shield standing upright with thin lines of soft blue-gold light running along its rim, a faint wall of light rising behind it'),
 'blockade': ('skill', 'three arrows with red fletching stuck crosswise in the ground in front of a small plain stake barrier, a hawk feather caught on one'),
 'dawnPrayer': ('skill', 'a pair of hands raised around a small rising sun of soft dawn-pink and pale gold light, a few motes of light rising'),
 'oathBadge': ('treasure', 'a small round badge of pale grey stone set in a plain worn silver rim, a faint blue-gold glint in its center'),
 'groveLeaf': ('treasure', 'a single broad green leaf from the ancient ward tree, its veins glowing faintly gold, a drop of dew on it'),
 'potion': ('tool', 'a small round glass flask of clear amber-gold healing draught with a cork stopper and a twist of twine at the neck (the basic potion)'),
}
EXTRA = {'potion': dict(id='potion', en='Basic Potion', ko='기본 회복약', kind='tool')}
def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}; cat.update(EXTRA)
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet I for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_I.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_B.png, approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells:
        extra = (' This is a unique treasure: give it a soft magical glow so it reads as special.' if c['kind'] == 'treasure' else
                 ' This is a once-a-battle ultimate skill: make it read as powerful, with a little more light than the other skill icons.' if c['kind'] == 'skill' else '')
        lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}.{extra}")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)
PROPS = [
 ('wardTree', 'ward tree — standing', 'one of the three ancient ward trees of the unburning forest: a broad gnarled oak-like tree with a thick mossy trunk, roots gripping the ground, a full green crown with faint gold light between the leaves'),
 ('wardTree_hurt', 'ward tree — wounded', 'the SAME tree, same size and position, with deep fresh axe cuts in the trunk, pale wood showing, leaves falling, the gold light dimmer'),
 ('wardTree_felled', 'ward tree — felled', 'the SAME tree cut down: a broad stump with a raw pale cut face and roots in place, the fallen trunk lying behind it to the right, no light'),
 ('guardianStatue_sleeping', 'guardian statue — sleeping', 'the guardian statue (match your sprite_guardianStatue.png if you have painted it, otherwise a stone knight with a tower shield and a longsword) standing still on a square stone plinth, eyes dark, weathered grey granite with moss, no light'),
]
PROP_PROMPT = ("Paint a BATTLE-MAP PROP SHEET for a classic tactical RPG: one 1024x256 PNG, a 4-column x 1-row grid of 256x256 cells (see layout_props_act3b.png; "
               "no grid lines, no text), fully TRANSPARENT background (or flat pure #00FF00). The same small painted battle-map style, the same classic top-down "
               "three-quarter SRPG view and the same scale as the attached ref_sprite_eric.png and ref_sprite_ironSpear.png figures (a character is about 150 px "
               "tall in a 256 px cell). Each prop is centered in its cell with its base on a baseline 16 px above the cell bottom, a soft contact shadow, "
               "everything inside the cell. The trees may fill the whole cell height; the statue on its plinth is about 1.2 times a character's height. "
               "They replace the temporary game-drawn props shown in the attached ref_battle_m18.jpg (trees) and ref_battle_m17.jpg (statues).\nCells, left to right:\n")

def props_layout():
    im = Image.new('RGB', (1024, 256), (236, 230, 214)); d = ImageDraw.Draw(im); f = iwp.font(15)
    for i, (pid, title, _) in enumerate(PROPS):
        x0 = i*256; d.rectangle((x0, 0, x0+255, 255), outline=(90, 80, 60), width=2); d.line((x0+20, 240, x0+236, 240), fill=(200, 60, 60), width=2)
        iwp.label(d, (x0, 10, x0+256, 120), f'{i+1}. {pid} — {title}', f)
    return im

def place_jobs():
    hub = lambda h: dict(id=h['id'], part='A', kind='hub', file=f"{h['id']}.jpg", size='1536x1024',
                         refs=f"{h['layout']}, approved_{h['base']}.jpg (same footprint), approved_hub_capital.jpg (latest style), scale_reference.png, sprite_eric_sheet.png",
                         prompt=f1.hp.HUB_COMMON+f"\nScene: {h['scene']}")
    J = [hub(HUBS[1])]  # the forest village first: its rooms follow it
    anchor = ROOMS[0]
    for r in ROOMS:
        base = r['base']
        refs = [f"layout_{r['id']}.png", 'scale_reference_interior.png', r['ext'], f'approved_{base}.jpg (same room footprint)']
        refs += ['approved_int_capital_tavern.jpg'] if r is anchor else [f"{anchor['id']}.jpg (your approved result)"]
        cl = ''.join(f" Chest tile {c[0]} at column {c[1]}, row {c[2]} (0-based) stays empty floor." for c in r['chests'])
        J.append(dict(id=r['id'], part='A', kind='interior', file=f"{r['id']}.jpg", size='1536x1024', refs=', '.join(refs),
                      prompt=iwp.INT_COMMON+f"\nScene: {r['scene']}{cl}\nKeep the furniture where the attached approved_{base}.jpg has it (the same walk "
                             "areas and counter), but in the forest village's own materials."+("\nThis image becomes the style anchor for the forest village's rooms." if r is anchor else
                             f"\nMatch the walls, floor, light and scale of the attached approved {anchor['id']}.jpg.")))
    cells = ''.join(f"  {i+1}. {sid} ({where}): {desc}.\n" for i, (sid, where, desc) in enumerate(CHESTS))
    J.append(dict(id='chests_forest', part='A', kind='chests', file='chests_forest.png', size='1024x512',
                  refs='layout_chests_forest.png, approved_chests_act2.png, int_forest_longhouse.jpg (your approved result)',
                  prompt=iwp.CHEST_PROMPT.replace('12 different', '4 different').replace('Canvas 1536x1024, a 6-column x 4-row grid', 'Canvas 1024x512, a 4-column x 2-row grid')
                         .replace('layout_chests.png', 'layout_chests_forest.png').replace('(int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg)', '(int_forest_longhouse.jpg)')
                         + "Row 1 = chests 1-4 closed, row 2 = chests 1-4 open (empty), each open cell lined up exactly with the closed cell above it.\n" + cells))
    J.append(hub(HUBS[0]))
    J.append(dict(id='props_act3b', part='A', kind='props', file='props_act3b.png', size='1024x256',
                  refs='layout_props_act3b.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m17.jpg, ref_battle_m18.jpg',
                  prompt=PROP_PROMPT+''.join(f"  {i+1}. {pid} ({title}): {desc}.\n" for i, (pid, title, desc) in enumerate(PROPS))))
    return J

PARTS = {'A': 'places and things — the keep, the forest village and its six rooms, forest chests, icon sheet I, battle props',
         'B': "the awakened looks of Erik, Elina and Sain", 'C': "the recruits' tier 2 looks of Thea, Dario and Ines",
         'D': 'the people of the keep and the forest, the M16 knight-captains, three map figures'}

def start_here(PA, IJ, CB, CC, CD):
    L = []; w = L.append; total = len(PA)+1+len(CB)+len(CC)+len(CD)
    w('# Ashen Crown — ACT III Part 2 Art Work Order (pack F2, v0.9.1)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 8.')
    w(f'The game already plays with temporary game-drawn art for everything in this pack. It has **{total} images in four parts** (A–D). The user may order one part at a time: **do only the parts the user asks for**, in the order A → B → D → C unless told otherwise, and return each part as its own zip(s).')
    w('')
    w('| part | what | images |')
    w('|---|---|---:|')
    for k, n in (('A', len(PA)+1), ('B', len(CB)), ('C', len(CC)), ('D', len(CD))): w(f'| **{k}** | {PARTS[k]} | {n} |')
    w(f'| | total | **{total}** |')
    w('')
    def table(title, J, start):
        w(f'## {title}'); w('')
        w('| # | file | what | size (px) | attach | prompt |'); w('|---|---|---|---|---|---|')
        for i, j in enumerate(J, start):
            stem = Path(j['file']).stem
            w(f"| {i} | `{j['file']}` | {j.get('who', j['id'])} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{stem}.txt` |")
        w('')
    n = 1; table(f'1. Part A — places and things ({len(PA)+1} images)', PA, n); n += len(PA)
    w(f"Plus job {n}: `icons_I.png` (1024×1024, attach layout_icons_I.png, approved_icons_B.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, ref_ui_shop.jpg, prompt `prompts/{n:02d}_icons_I.txt`)."); w('')
    w('| cell | id | icon |'); w('|---|---|---|')
    for c in IJ: w(f"| I{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w(''); n += 1
    table(f'2. Part B — awakened looks ({len(CB)} images)', CB, n); n += len(CB)
    table(f"3. Part C — recruits' tier 2 looks ({len(CC)} images)", CC, n); n += len(CC)
    table(f'4. Part D — people of the keep and the forest, captains, figures ({len(CD)} images)', CD, n); n += len(CD)
    w('## 5. Global rules'); w('')
    w(f'- Characters: {cp.STYLE}')
    w(f'- Places: {iwp.STYLE}')
    w(f'- Icons: {ip.STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, banners, books, seals, signs, crates). Factions are told apart by colors only: Iron Crown = steel-blue and grey fur; Free Lords Alliance = green and cream with a many-colored ribbon sash; Sacred Flame = white, crimson and gold-colored; the chancellery = ash-grey and plum.')
    w('- **New looks of existing heroes (parts B and C): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors; only the outfit grows. The map sheet must match the old sheet\'s size and proportions (`ref_sprite_<id>.png`).')
    w('- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer\'s right.')
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.')
    w('- The two town maps follow the attached layout sketches (24×16 tiles of 64 px) and **keep exactly the footprint of their attached approved hub** (`approved_hub_fortress.jpg` for the keep, `approved_hub_village_day.jpg` for the forest village): the same building positions, doors, squares, streets and gates. Rooms: 12×8 tiles of 128 px, each on the footprint of its attached approved village room.')
    w('- Icon sheet I: 4×4 cells of 256 px, cells 07–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.')
    w('')
    w('## 6. Order of work'); w('')
    w("- **A:** in the table's order — `hub_forest` → its six rooms (`int_forest_longhouse` first) → `chests_forest` → `hub_keep` → `props_act3b.png` → `icons_I.png`.")
    w('- **B:** for each of `eric_t3`, `elina_t3`, `sain_t3`: neutral bust → concerned / determined / sad → map sheet.')
    w('- **C:** the same for `thea_t2` (mounted, like `ref_sprite_thea.png`), `dario_t2`, `ines_t2`.')
    w('- **D:** `guardianElder` and `forestElder` busts (neutral first) → the three captains (`determined` first, then `sad`) → the five map sheets.')
    w('')
    w('## 7. Self-check (record PASS/FAIL per item in each zip\'s QA_REPORT.md)'); w('')
    w('- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] Hubs and rooms exactly 1536×1024 RGB JPEG quality 92–95; `chests_forest.png` exactly 1024×512; `icons_I.png` exactly 1024×1024; `props_act3b.png` exactly 1024×256 (PNG).')
    w('- [ ] No text, letters, emblems, holy symbols or logos anywhere. No people or animals in hubs and rooms (the keep\'s stone statues are scenery).')
    w('- [ ] Each character\'s busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Parts B and C: the face matches the attached old bust.')
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.')
    w('- [ ] The keep keeps the footprint of `approved_hub_fortress.jpg`; the forest village keeps the footprint of `approved_hub_village_day.jpg`; rooms match their sketches and their approved village rooms; doorway at bottom-row tiles 5–6.')
    w('- [ ] Chest sheet: 4 chests, open cells lined up with closed cells, open chests empty. Prop sheet: the three tree states line up (same position and size).')
    w('- [ ] Icon sheet: 6 icons in cells 01–06, cells 07–16 fully transparent, same finish as the approved icon sheets.')
    w('')
    w('## 8. Return format — one zip per part, **each under 20 MB**'); w('')
    for k in 'ABCD': w(f'- `{NAME}_{k}.zip` — part {k}: {PARTS[k]}')
    w('')
    w('```')
    w(f'{NAME}_A/   (and _B, _C, _D the same way)')
    w('  png/ or img/      # PNG masters for characters, icons, props and chests (png/), JPEG for hubs and rooms (img/)')
    w('  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · places: id,kind,path,width,height,bytes,sha256')
    w('  manifest_icons.csv  # part A only: sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt    # sha256  path')
    w('  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations')
    w('  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/     # the exact final prompt per image')
    w('```')
    w('')
    w('- Busts are large: **if a zip would exceed 20 MB, split it** (`_B1`, `_B2`, …), each with its own manifest, checksums and QA report. Do not include WebP.')
    w('- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). A zip of pack F1 once arrived cut off in the middle of a file; report each zip\'s exact size in bytes so a cut-off download can be spotted.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 작업 팩 F2 (ACT III 2부 · v0.9.1의 가안 그림 전부, {TOTAL}장)

v0.9.1에서 아직 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **네 부분(A–D)으로 나뉘어 있어서 GPT 사용량에 맞춰 한 부분씩 시켜도 됩니다.** GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
{PARTS}

권장 순서: **A → B → D → C** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `A` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part A only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_A.zip as described in section 8 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all parts in the order A, B, D, C, run the self-check, and return one zip per part as described in section 8. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- **GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.** F1_1은 처음에 내려받기가 끊긴 파일(6.59 MB)이었습니다.

## A. 장소와 물건 (모두 PROPOSED)
- **숲지기 마을** — 거대한 고목 숲 속 이끼 지붕 마을. 지금 쓰는 잿빛 마을 배치 위에 다른 마을로 그림(길과 문 그대로). 방 여섯: 길잡이 장옥, 활장이 공방(무기점), 약초상(도구점), 장로의 오두막, 숲지기 집, 씨앗 창고. 상자 4종.
- **수호자 성채** — 북쪽 고원의 오래된 화강암 성채, 일부 무너짐, 안뜰의 석상들. 지금 쓰는 탈환한 성채 배치 위에 그림. (성채 방은 탈환한 성채의 그려진 방을 계속 씀)
- **아이콘 시트 I (6개)**: 맹세의 성벽 · 퇴로 봉쇄 · 새벽의 기도(④) · 맹세의 휘장 · 고목의 잎(보물) · 기본 회복약(소지품 머리줄에 나오는 물약 — 지금 가안)
- **전투 소품 시트**: 결계 고목(서 있음 / 상처 / 쓰러짐), 잠든 수호 석상.

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `eric_t3` 맹세의 수호자 | 낡아 빛바랜 강철과 옅은 금 테, 마지막 수호자가 준 돌빛 망토, 방패 테두리의 옅은 푸른 금빛 |
| `elina_t3` 매의 사수 | 매 깃털 어깨 망토, 매사냥 장갑, 땋은 머리의 긴 매 깃털, 옅은 물푸레 장궁 |
| `sain_t3` 새벽 사제 | 새벽빛 흰색·옅은 장밋빛 금, 옅은 금 반망토, 새벽빛 등불, 해돋이처럼 빛나는 금 고리 지팡이 |

## C. 영입 장수 전직 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `thea_t2` 흑철 창기사 | 검게 그을린 철판 갑옷에 강청색 테, 회색 늑대 털 깃, 검은 깃발 창, 흑철 마갑의 회색 말 |
| `dario_t2` 검성 | 바다빛·포도주빛 긴 외투와 사슬 셔츠, 단정히 묶은 머리, 여유 있는 미소, 맑은 강철 장검 |
| `ines_t2` 성소 수호자 | 흰색·금색 무거운 휘장 겉옷, 긴 진홍 망토, 넓은 금 테 흰 원방패(옅은 금빛) |

## D. 사람과 맵 그림
- 반신: **마지막 수호자**(70대 후반, 대머리, 긴 흰 수염, 옛 강철 갑옷 · 표정 3개), **숲지기 장로**(60대 여성, 초록 리본을 감은 흰 머리, 너무 평온한 미소 · 표정 3개), **M16 결투의 기사대장** 3명(철왕관·연맹·성화 — 배신한 깃발에 따라 달라짐 · 결의/슬픔)
- 맵 그림: 마지막 수호자, 숲지기 장로, 깨어난 수호 석상, 숲지기 주민, 재상부 회색 대장

## 이번에 코드로 고친 것 (그림 필요 없음)
- 빈 상자를 열면 나오던 가안 물약 그림 → 그 방의 **그려진 상자가 열린 모습**으로 바뀌었습니다.
- 전투 중 「연대기」 내레이션에 나오던 가안 얼굴 → 초상 없이 글만 나옵니다.
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    for n in ('style_aren_neutral.png', 'scale_reference.png', 'sprite_eric_sheet.png', 'layout_hub_village.png', 'layout_hub_fortress.png'): Image.open(OLD/n).save(refs/n, optimize=True)
    def ref_png(src, dst): Image.open(src).convert('RGBA').save(dst, optimize=True)
    ref_png(ROOT/'src/assets/portraits/bust_baldrick_neutral.webp', refs/'ref_bust_baldrick_neutral.png')
    for b in ('eric_t2', 'elina_t2', 'sain_t2', 'thea', 'dario', 'ines'): ref_png(ROOT/f'src/assets/portraits/bust_{b}_neutral.webp', refs/f'ref_bust_{b}_neutral.png')
    for s in ('eric', 'ironSpear', 'cavalry', 'eric_t2', 'elina_t2', 'sain_t2', 'thea', 'dario', 'ines', 'ironInfantry', 'lordA', 'flameKnight'):
        ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    for hub in ('hub_village_day', 'hub_fortress', 'hub_capital'): iwp.ext_jpg(ROOT/f'src/assets/hubs/{hub}.webp', refs/f'approved_{hub}.jpg')
    for r in VILLAGE: iwp.ext_jpg(ROOT/f'src/assets/rooms/{r}.webp', refs/f'approved_{r}.jpg')
    iwp.ext_jpg(ROOT/'src/assets/rooms/int_capital_tavern.webp', refs/'approved_int_capital_tavern.jpg')
    for r in ROOMS: iwp.layout_sketch(r).save(refs/f"layout_{r['id']}.png", optimize=True)
    chest_layout().save(refs/'layout_chests_forest.png', optimize=True); props_layout().save(refs/'layout_props_act3b.png', optimize=True)
    iwp.scale_reference().save(refs/'scale_reference_interior.png', optimize=True)
    for n in ('approved_chests_act2.png', 'approved_icons_B.png', 'approved_icons_D.png', 'ref_ui_shop.jpg'): (refs/n).write_bytes((F1REF/n).read_bytes())
    h = Path(sys.argv[sys.argv.index('--icons-h')+1]) if '--icons-h' in sys.argv else None
    if h and h.exists(): Image.open(h).save(refs/'approved_icons_H.png', optimize=True)
    elif not (refs/'approved_icons_H.png').exists(): sys.exit('approved_icons_H.png: pass --icons-h <the returned pack F1 icons_H.png>')
    for m, shot in (('m17', 'act3b/m17-oath-1440.png'), ('m18', 'act3b/m18-rain-1440.png')):
        src = ROOT/'docs/v0.9.1/screenshots'/shot
        if src.exists(): Image.open(src).convert('RGB').save(refs/f'ref_battle_{m}.jpg', quality=85)
        elif not (refs/f'ref_battle_{m}.jpg').exists(): sys.exit(f'missing {src}')
    IJ = icon_cells(); ip.grid_sketch(IJ, 'I').save(refs/'layout_icons_I.png', optimize=True)
    PA, CB, CC, CD = place_jobs(), char_jobs('B'), char_jobs('C'), char_jobs('D')
    seq = PA + [dict(id='icons_I', part='A', kind='icons', file='icons_I.png', size='1024x1024',
                     refs='layout_icons_I.png, approved_icons_B.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, ref_ui_shop.jpg', prompt=icon_prompt(IJ))] + CB + CC + CD
    (PACK/'00_START_HERE.md').write_text(start_here(PA, IJ, CB, CC, CD), encoding='utf-8')
    rows = '\n'.join(f"| **{k}** | {t} | {n} |" for k, t, n in (('A', '장소와 물건 — 수호자 성채, 숲지기 마을과 방 6, 숲 상자, 아이콘 시트 I, 전투 소품', len(PA)+1),
                     ('B', '엘리나·에릭·세인의 각성 모습', len(CB)), ('C', '테아·다리오·이네스의 전직 모습', len(CC)), ('D', '성채와 숲의 사람들, M16 기사대장, 맵 그림 5', len(CD))))
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))).replace('{PARTS}', rows), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j.get('expression', ''), j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IJ: wr.writerow(['I', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
    with open(PACK/'props.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['cell', 'id', 'title', 'description'])
        for i, (pid, title, desc) in enumerate(PROPS, 1): wr.writerow([i, pid, title, desc])
    for i, j in enumerate(seq, 1):
        stem = Path(j['file']).stem
        if j['kind'] in ('bust', 'sprite'): body = f"{j['prompt']}\n{cp.STYLE}\nAttach: {j['refs']}.\n"
        elif j['kind'] == 'icons': body = f"{j['prompt']}\n\n{ip.STYLE}\nAttach: {j['refs']}.\n"
        else:
            fmt = 'one PNG with transparency (or pure #00FF00 background)' if j['kind'] in ('chests', 'props') else 'one JPEG (quality 92-95)'
            st = iwp.STYLE if j['kind'] != 'hub' else iwp.STYLE.replace('rooms, furniture designs', 'map, town')
            body = f"{j['prompt']}\n{st}\nAttach: {j['refs']}.\nOutput: {fmt}, exactly {j['size']} px.\n"
        (PACK/'prompts'/f'{i:02d}_{stem}.txt').write_text(body, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v091_ACT3_F2_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, 'A', len(PA)+1, 'B', len(CB), 'C', len(CC), 'D', len(CD), 'total', len(seq))

if __name__ == '__main__':
    main()
