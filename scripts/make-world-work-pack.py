#!/usr/bin/env python3
"""Build the ChatGPT work pack for the v0.5.0 world map and interlude hub art (D-052).

Writes docs/v0.5.0/art/world-work-pack/{00_START_HERE.md, jobs.csv, prompts/*.txt}; the
reference images in references/ are prepared separately and kept in git.
Usage: python3 scripts/make-world-work-pack.py [--zip <out.zip>]
"""
import csv, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT/'docs/v0.5.0/art/world-work-pack'

STYLE = ("Painting style: match the attached approved character art (style_aren_neutral.png, style_eric_neutral.png) — "
         "hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, "
         "rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's map, "
         "town, emblem or layout.")

SITES = [  # world-map sites (pixel coordinates on the 1536x1024 map) that must stay open ground for icons
 ('royal capital (center)', 795, 510), ('northern stronghold', 710, 207), ('grey canyon mouth', 600, 335),
 ('free city on the west coast', 322, 517), ('lord castle A', 423, 411), ('lord castle B', 433, 651),
 ('cathedral (south)', 760, 785), ('cliff monastery (south coast)', 975, 853),
 ('border village', 1150, 610), ('border garrison camp', 1200, 545), ('forest trail', 1240, 470),
 ('broken bridge over the gorge', 1300, 440), ('abandoned hill fortress', 1361, 363), ('border ridge', 1310, 290),
 ('border gate in the wall', 1441, 331)]

HUB_COMMON = ("Attached layout_hub_*.png is a LAYOUT SKETCH for a walkable town map in a classic tactical RPG: a 24x16 grid of 64-pixel tiles. "
 "Keep every labelled area in the same place and roughly the same size; the labels are for you only — paint no text. "
 "Attached scale_reference.png and sprite_eric_sheet.png show the walking characters: a standing adult is about 60-70 px tall and a doorway about 64 px wide, "
 "so buildings, tents, doors and props must be in that scale. "
 "View: a high three-quarter top-down angle (about 60 degrees) like classic tactical RPG town maps — flat readable ground, objects showing their front faces, "
 "no perspective vanishing toward a horizon, no sky band. "
 "Keep all paths and the central open area wide, flat and uncluttered so characters can walk there (paths at least 2 tiles = 128 px wide). "
 "Paint NO people and NO animals except where the scene says so. No text, no letters on signs, no UI, no grid lines, no frame, no vignette border.")

JOBS = [
 dict(id='world_map', kind='world', file='world_map.png', size='1536x1024', refs='layout_world_map.png, style_aren_neutral.png',
  prompt=("Attached layout_world_map.png is a rough LAYOUT SKETCH of an original fantasy continent called Erdia. Follow its coastline, "
   "the five regions, the mountain range, the main river (which runs from the north-east gorge south-west then west across the middle to the west coast), "
   "and the site positions closely. Labels in the sketch are for you only.\n"
   "Paint a hand-painted fantasy campaign map for a classic tactical RPG: a top-down view of the whole continent on aged parchment with soft painted terrain, "
   "gentle relief shading, painted coastlines with light waves in a muted blue-green sea.\n"
   "Terrain by region:\n"
   "- North: a long snowy mountain range with dark pine forests and grey stone foothills; a narrow grey canyon cutting south-west out of the mountains.\n"
   "- West: green rolling plains, small woods, windmill fields, a wide river mouth with a natural harbor on the west coast.\n"
   "- Center: golden farmland and gentle hills along the great river, a wide open plain around the site of the royal city.\n"
   "- South: warm red-ochre cliffs, high plateaus and sun-baked valleys reaching the southern coast.\n"
   "- East: ash-tinted conifer forests, rolling hills and a deep river gorge running north to south; a long border wall ridge at the far north-east.\n"
   "- Far east edge: the land fades into drifting mist (unknown lands).\n"
   "Do NOT paint any cities, castles, icons, political borders, roads, labels, letters, compass rose, legend, frame or UI — terrain only. "
   "Keep each site position listed in 00_START_HERE.md as a clear, fairly flat patch of ground about 80 px across so an icon can be placed there later.")),
 dict(id='world_icons', kind='icons', file='world_icons.png', size='1024x1024', refs='world_map.png (your approved result), style_aren_neutral.png',
  prompt=("Same painting style as the approved world_map.png. Paint a 3x3 sheet of small map icons for that map. Each icon is centered in its own cell "
   "(cells are 1024/3 px; keep at least 24 px of empty space around each icon), seen from the same top-down three-quarter angle, with a soft drop shadow, "
   "on a fully TRANSPARENT background (if transparency is impossible, use flat pure green #00FF00 and nothing else). No text, no labels, no frames, no cell borders.\n"
   "Row 1: (1) a small border village of thatched houses, (2) a cluster of military canvas tents with a plain pennant, (3) a stone border gate set in a short wall.\n"
   "Row 2: (4) a ruined, partly broken hill fortress, (5) a grand royal castle with tall towers and gold-trimmed roofs, (6) a dark grey iron-and-stone mountain stronghold.\n"
   "Row 3: (7) a walled free city with a small harbor and a windmill, (8) a tall cathedral with a glowing ember-orange rose window, (9) a quiet cliffside monastery.\n"
   "Every icon must still read clearly when shrunk to 64x64 px: bold silhouette, few details.")),
 dict(id='hub_village_day', kind='hub', file='hub_village_day.png', size='1536x1024', refs='layout_hub_village.png, scale_reference.png, sprite_eric_sheet.png, style_aren_neutral.png',
  prompt=HUB_COMMON+"\nScene: A peaceful border village in the eastern frontier on a clear morning. Timber-and-plaster houses with thatched and shingled roofs. "
   "Top-left a blacksmith with an open forge, anvil and a weapon rack outside; top-right an item shop with a striped awning, crates and bottles. "
   "A small inn on the left, the elder's hall with a war-room table visible through an open door on the right. A cobbled square with a stone well in the center; "
   "vegetable plots, fences, a supply depot with barrels at the bottom-right, conifers around the edges, a dirt road leaving at the bottom center. "
   "This image becomes the style anchor for every other hub map."),
 dict(id='hub_village_raid', kind='hub', file='hub_village_raid.png', size='1536x1024', refs='hub_village_day.png (your approved result), layout_hub_village_raid.png',
  prompt=("Attached hub_village_day.png is the approved village map. Repaint the EXACT same map — identical layout, buildings, paths, camera and framing — "
   "as it looks the same evening right after a bandit raid. Use image editing on hub_village_day.png rather than a fresh generation so the layout cannot drift.\n"
   "Changes: several houses at the bottom-left are burnt down to charred beams with thin smoke; scorch marks on the item shop awning; the inn has become a makeshift "
   "infirmary with cots and bandages outside; a smouldering broken cart and a few sealed wooden supply crates in the square; scattered debris and trampled fences; "
   "warm orange sunset light mixed with grey smoke. Paths and the square stay walkable and clear. No people, no text, no UI.")),
 dict(id='hub_garrison', kind='hub', file='hub_garrison.png', size='1536x1024', refs='layout_hub_garrison.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png',
  prompt=HUB_COMMON+"\nScene: A royal border garrison camp on an overcast day, enclosed by a sharpened wooden palisade with a gate at the bottom center. "
   "Top-left an open-air field forge (anvil, coal forge, grindstone, racks of spears and shields — no building). Top-right a quartermaster tent with a counter, crates and barrels. "
   "Left a triage tent marked with a plain red cloth, cots inside. Right the largest command tent with a tall plain grey banner pole. "
   "A packed-earth parade ground in the center with a small fire and a map table. Bottom-left a wooden watchtower, bottom-right a training yard with straw dummies, "
   "a row of small soldier tents. Orderly and military, muted teal-grey and canvas tones. Match the style of the attached hub_village_day.png."),
 dict(id='hub_bivouac_night', kind='hub', file='hub_bivouac_night.png', size='1536x1024', refs='layout_hub_bivouac.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png',
  prompt=HUB_COMMON+"\nScene: A marching camp in a forest clearing at NIGHT. A large campfire in the exact center with a ring of log seats and open trampled ground around it, "
   "casting warm orange light; the rest of the scene in cool moonlit blue but still readable (keep mid-tones; the ground must never be near-black). "
   "Canvas tents at the top; the command tent at the top-right has a lantern and a map table under its awning. "
   "On the left a wandering merchant's covered wagon with hanging lanterns, its goods spread on a cloth: potion bottles, crates, a rack of swords, spears and bows, "
   "shields leaning on the wheel — clearly both an item shop and a weapon shop. A triage tent at the bottom-left, a supply cart and two tethered horses (allowed) at the bottom-right, "
   "a sentry torch at the entrance at the bottom center, dark pines all around. Match the style of the attached hub_village_day.png."),
 dict(id='hub_fortress', kind='hub', file='hub_fortress.png', size='1536x1024', refs='layout_hub_fortress.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png',
  prompt=HUB_COMMON+"\nScene: The courtyard of an old abandoned stone fortress, now reclaimed by a small garrison, on a windy grey day. Weathered curtain walls with ramparts and "
   "stone stairs on the left and right. Top-left an armory with an iron-banded door and weapon racks; top-center the keep door leading to a records hall; "
   "top-right a storehouse with sacks and barrels. A smithy corner under a wooden lean-to on the right. Flagstone courtyard with an old well in the center, "
   "moss and rubble in the corners, the broken main gate at the bottom center under repair with wooden scaffolding. Cold stone greys with warm torch accents. "
   "Match the style of the attached hub_village_day.png."),
 dict(id='hub_oathcamp', kind='hub', file='hub_oathcamp.png', size='1536x1024', refs='layout_hub_oathcamp.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png',
  prompt=HUB_COMMON+"\nScene: A new legion camp just beyond a great stone border gate, at dusk. Across the whole top of the map (about the top 2 tiles) stands the massive grey border wall "
   "seen from its far side, its gate standing open in the middle, a path leading down from it. In the center an open oath ground with a tall new banner — plain ash-grey cloth "
   "with a single ember-orange flame mark, no letters — and a stone brazier burning beside it. Left: a wandering merchant's covered wagon with a small open-air forge. "
   "Right: a training yard with straw dummies and a roped sparring ring. Canvas tents at the corners, the command tent at the top-right. "
   "Purple-orange dusk light, the first lanterns being lit. Match the style of the attached hub_village_day.png."),
]

def start_here():
    L = []
    w = L.append
    w('# Ashen Crown — World Map & Hub Art Work Order (v0.5.0)')
    w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return ONE zip file.')
    w('Everything you need is in this pack: `jobs.csv` (job list), `prompts/` (the full image prompt for each job) and `references/` (images to attach as references).')
    w('')
    w('## 1. Deliverables (8 images)')
    w('')
    w('| # | id | file | size (px) | attach these references | prompt |')
    w('|---|---|---|---|---|---|')
    for i, j in enumerate(JOBS, 1):
        w(f"| {i} | `{j['id']}` | `{j['file']}` | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{j['id']}.txt` |")
    w('')
    w('## 2. Global rules (apply to every image)')
    w('')
    w(f'- {STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.')
    w('- **No text anywhere in the images**: no place names, sign lettering, legends, watermarks, signatures, UI or frames. The game draws all labels itself in Korean.')
    w('- Hub maps contain **no people** (two horses in the night camp are allowed). The game places walking characters on top.')
    w('- The layout sketches are composition guides on a 64 px grid. The painting does not have to snap to the grid, but every labelled area must stay in place, and paths and open areas must stay wide and uncluttered.')
    w('- Final sizes must be exact. If the generator returns another size, resize (keeping the aspect ratio) and center-crop or pad to the exact size. Do not stretch.')
    w('- Generate each image individually. Regenerate when an image breaks a rule (text appears, people appear, layout drifts, wrong time of day).')
    w('')
    w('## 3. Order of work')
    w('')
    w('1. `world_map` — compare it with `references/layout_world_map.png`. Coastline, regions, river and mountain range must match the sketch.')
    w('   The following positions (x, y on the 1536×1024 map) must stay clear, fairly flat ground about 80 px across, with no painted buildings:')
    w('')
    w('   | site | x | y |')
    w('   |---|---|---|')
    for name, x, y in SITES:
        w(f'   | {name} | {x} | {y} |')
    w('')
    w('2. `world_icons` — attach your final `world_map.png` as the style anchor.')
    w('3. `hub_village_day` — this becomes the **style anchor for all hubs**. Attach it to every later hub job.')
    w('4. `hub_village_raid` — **edit** `hub_village_day.png` instead of generating from scratch. The layout must stay identical.')
    w('5. `hub_garrison`, `hub_bivouac_night`, `hub_fortress`, `hub_oathcamp`.')
    w('')
    w('## 4. Self-check before packaging (record the result of each item in QA_REPORT.md)')
    w('')
    w('- [ ] 8 PNG files, exact sizes, all decode, RGB or RGBA. `world_icons` has real transparency, or a pure `#00FF00` background that is noted in the report.')
    w('- [ ] No text, letters, numbers, watermarks or UI in any image. Zoom in and check signs and banners.')
    w('- [ ] No people in the hub maps.')
    w('- [ ] Each hub matches its layout sketch: shop and service areas are in the labelled places, the center is open, and the entrance is at the bottom center.')
    w('- [ ] `hub_village_raid` overlays `hub_village_day` with the same buildings and paths (include a 50% blend image as evidence).')
    w('- [ ] Night and dusk scenes keep the ground readable.')
    w('- [ ] The world map keeps the listed site positions clear.')
    w('- [ ] The scale fits `scale_reference.png`: a 64 px doorway, an adult about 60–70 px tall.')
    w('')
    w('## 5. Return format — one zip: `Ashen_Crown_v050_World_Art_Pack.zip`')
    w('')
    w('```')
    w('Ashen_Crown_v050_World_Art_Pack/')
    w('  png/world_map.png')
    w('  png/world_icons.png')
    w('  png/hub_village_day.png  png/hub_village_raid.png  png/hub_garrison.png')
    w('  png/hub_bivouac_night.png  png/hub_fortress.png  png/hub_oathcamp.png')
    w('  manifest.csv        # id,kind,path,width,height,bytes,sha256   (one row per PNG)')
    w('  SHA256SUMS.txt      # sha256  path')
    w('  QA_REPORT.md        # the checklist above with PASS/FAIL, generation notes, any deviations')
    w('  contact_sheet.png   # all 8 images as thumbnails with their ids, for quick review')
    w('  evidence/raid_vs_day_blend.png')
    w('  prompts_used/       # the exact final prompt text used for each image (txt)')
    w('```')
    w('')
    w('- Do not include WebP or other runtime conversions. The game team converts the PNG masters.')
    w('- The `kind` column takes one of `world`, `icons` or `hub`. Paths are relative to the pack root.')
    w('- If an item cannot be met, still deliver your best image, and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

def main():
    (PACK/'prompts').mkdir(parents=True, exist_ok=True)
    (PACK/'00_START_HERE.md').write_text(start_here(), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'id', 'kind', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(JOBS, 1):
            wr.writerow([i, j['id'], j['kind'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{j['id']}.txt"])
    for i, j in enumerate(JOBS, 1):
        size = j['size']
        text = (f"{j['prompt']}\n{STYLE}\nAttach: {j['refs']}.\nOutput: one PNG, exactly {size} px"
                f"{' landscape' if size == '1536x1024' else ''}.\n")
        (PACK/'prompts'/f"{i:02d}_{j['id']}.txt").write_text(text, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v050_World_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out)
    print('pack', PACK)

if __name__ == '__main__':
    main()
