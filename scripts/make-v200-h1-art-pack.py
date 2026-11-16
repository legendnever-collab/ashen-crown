#!/usr/bin/env python3
"""Build the ChatGPT work pack H1 for v2.0.0 전장 개편 (REFORM_DESIGN §9, D-115).
  A. class map sheets, tier 1 (8): one figure per class — the same class wears the same figure on both sides.
  B. class map sheets, tier 2 (8).
  C. class map sheets, tier 3 (8) — each with the Ashen Crown mark (ash-grey and a faint ward-gold light).
  D. the four ACT I officers' busts (Bram, Noa, Marta, Rowell), three expressions each (12).
  E. 「잿빛 결투장」 arena background (1600×900) and icon sheet P (the two start treasures and the four ACT I carried treasures).
The cloth that shows the side's colour is painted in pure magenta; the game recolours it (legion blue, enemy red, banners).
Parts A–D import with scripts/import-art.py (manifest.csv: id,kind,expression,file,sha256), the arena with
scripts/import-duel-art.py, the icons with scripts/import-item-art.py --cells.
Usage: python3 scripts/make-v200-h1-art-pack.py [--zip <out.zip>]
"""
import csv, importlib.util, sys, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
def load(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT/'scripts'/file); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
f2 = load('f2', 'make-act3-f2-art-pack.py'); ip = f2.ip
sys.argv_saved = sys.argv; sys.argv = ['x']; cp = load('cp', 'make-act2-character-pack.py'); sys.argv = sys.argv_saved
PACK = ROOT/'docs/v2.0.0/art/h1-work-pack'
NAME = 'Ashen_Crown_v200_Art_Pack_H1'
OLD = f2.OLD; F1REF = f2.F1REF; F2REF = ROOT/'docs/v0.9.1/art/act3-f2-work-pack/references'

MAGENTA = ("SIDE COLOUR (important): every cloth area that should show which side the soldier fights for — tabard, cloak, sash, hood "
           "lining, horse barding cloth, a small pennant — is painted in shades of PURE MAGENTA only (#FF00FF midtone, #B000B0 shadow, "
           "#FF80FF highlight), keeping the folds and shading. Nothing else may be magenta or pink: skin, hair, metal, leather, wood and "
           "the horse stay natural colours. The game replaces the magenta with blue, red or a banner colour.")
ORIGINAL = ("Original design: a generic soldier of this class for an original Western medieval frontier fantasy — not a named hero, no face "
            "close-up detail, no crest, emblem, letter or logo anywhere. Do not imitate the sprites, classes or costumes of any existing game.")
TIER_MARK = "Tier 3 mark: ash-grey trim and a faint warm-gold ward light (small motes or a thin glow) on the weapon — the Ashen Crown's own sign."
# (class, mounted, weapon, [tier1, tier2, tier3]) — §3.5 of the design
CLASSES = [
 ('infantry', False, 'a straight sword (tier 1 short, tiers 2–3 long) and a shield', [
   "Swordhand: leather jerkin over a plain shirt, simple iron cap, short sword and a small round wooden buckler. Attack frame: one horizontal slash.",
   "Knight: chainmail with a magenta tabard and short magenta cloak, open helm, long sword and a kite shield. Attack frame: the second of two quick slashes, the blade blurred twice.",
   "Oathknight: full plate with a magenta tabard and an ash-grey oath sash, long sword with a thin gold glow along the edge. Attack frame: a full spinning sweep, the blade's arc drawn as a pale streak around the body."]),
 ('spear', False, 'a spear', [
   "Spearhand: quilted gambeson, kettle helm, short spear held in both hands, a magenta sash. Attack frame: one straight thrust.",
   "Phalanx: brigandine with a magenta surcoat, closed helm, long pike and a round shield on the arm. Attack frame: a long reaching thrust that goes past the target.",
   "Gatewarden: heavy gate-guard armour with a magenta tabard, tall spear with a small magenta pennant, plumed helm. Attack frame: a braced thrust, feet planted wide."]),
 ('archer', False, 'a bow', [
   "Bowhand: magenta hood, leather vest, short bow, one quiver. Attack frame: drawing and loosing ONE arrow.",
   "Marksman: leather armour with a magenta cloak, tall longbow, two quivers. Attack frame: TWO arrows nocked together, loosed at once.",
   "Emberbow: ash-grey hooded cloak lined with magenta, recurved bow bound with glowing ember bands, arrows with glowing orange tips. Attack frame: THREE ember arrows fanning out."]),
 ('cavalry', True, 'a lance', [
   "Rider: light leather barding with a magenta saddle cloth, rider in a leather coat with a light lance.",
   "Lancer Knight: chainmail rider and chain barding with magenta cloth, couched lance with a small magenta pennant. Attack frame: lance couched in a charge.",
   "Lionknight: plate rider and plate barding with magenta cloth, a helm with a long mane-like plume (no animal face, no emblem), heavy lance. Attack frame: riding through, lance swept."]),
 ('mage', False, 'a staff', [
   "Apprentice mage: magenta robe with a hood, wooden staff with a small ember at the tip. Attack frame: a small fireball leaving the staff.",
   "Mage: layered robe with a magenta mantle, crystal-topped staff. Attack frame: a column of flame rising in front.",
   "Ash Sage: long grey robe with a magenta stole, a circlet of grey ash-like leaves (not a royal crown), staff wreathed in swirling ash and embers. Attack frame: a storm of ash and embers."]),
 ('healer', False, 'a short staff', [
   "Mender: plain white robe with a magenta sash, short staff with a soft light. Attack frame: a small ring of light from the staff.",
   "Priest: white-and-magenta vestment, staff with a lantern-like head. Attack frame: a wider ring of light around the feet.",
   "Dawn Priest: layered dawn-gold and white vestments with a magenta stole, two faint wing-shaped streaks of light behind the shoulders (light only, not feathers, not an angel). Attack frame: rays of light."]),
 ('rogue', False, 'daggers', [
   "Cutpurse: dark hood with magenta lining, leather jerkin, one dagger. Attack frame: a quick stab.",
   "Shade: dark leathers with a magenta scarf, a dagger in each hand. Attack frame: two crossing slashes.",
   "Nightcrow: tattered dark cloak like crow feathers with magenta lining, two curved blades. Attack frame: a slash with a faint dark afterimage of the body behind."]),
 ('shield', False, 'a big shield and a club or hammer', [
   "Shieldhand: padded coat with a magenta sash, a tall wooden board shield, a cudgel. Attack frame: a shove with the shield.",
   "Ironwall: heavy coat of plates with a magenta tabard, a large iron shield, a war hammer. Attack frame: a shield bash pushing forward.",
   "Wardkeeper: heavy plate with a magenta tabard, a tower shield engraved with a plain geometric line pattern (no symbol) that glows faintly gold. Attack frame: the shield planted with a wall of faint gold light in front."]),
]
TEMP = {'infantry': ['ironInfantry', 'guard', 'flameKnight'], 'spear': ['ironSpear', 'mercSpear', 'ritualKnight'], 'archer': ['archer', 'ironArcher', 'fortArcher'],
        'cavalry': ['cavalry', 'thea_t2', 'thea_t3'], 'mage': ['ritualist', 'lia_t2', 'lia_t3'], 'healer': ['pilgrim', 'sain_t2', 'sain_t3'],
        'rogue': ['grayCloak', 'kai_t2', 'kai_t3'], 'shield': ['bearer', 'ines_t2', 'ines_t3']}
KO = {'infantry': '보병', 'spear': '창병', 'archer': '궁병', 'cavalry': '기병', 'mage': '마도사', 'healer': '치유사', 'rogue': '도적', 'shield': '방패병'}
TIER_KO = {'infantry': ['검사', '기사', '서약기사'], 'spear': ['창병', '방진창병', '수문장'], 'archer': ['궁수', '명사수', '잿불궁수'], 'cavalry': ['기수', '돌격기사', '사자기사'],
           'mage': ['견습 마도사', '마도사', '재의 현자'], 'healer': ['치유사', '사제', '새벽사제'], 'rogue': ['도적', '그림자', '밤까마귀'], 'shield': ['방패병', '철벽병', '결계수호자']}
OFFICERS = [
 ('bram', 'Bram (브람)', "a man in his mid-fifties, the Ashen Village's watch captain and once a border spearman: weathered face, short grey beard, an old scar through the left eyebrow, patched border-guard gambeson with leather pieces, a spear over his shoulder; stern but kind"),
 ('noa', 'Noa (노아)', "a young adult man of about twenty, a village hunter: freckles, messy auburn hair, a green hunter's hood pushed back, a short bow in hand and a quiver, a cheeky confident grin; clearly an adult"),
 ('marta', 'Marta (마르타)', "a woman in her forties, the village smith: broad shoulders, dark hair tied back with a cloth, soot on her cheek, rolled sleeves and a scorched leather apron, a smith's hammer, a wooden door carried as a shield on her back; dry humour in her eyes"),
 ('rowell', 'Rowell (로웰)', "a lean man of about thirty, a border rider who left his post: tired eyes, unshaven, dark hair, a worn riding cloak with a paler square patch where a badge was torn off, riding gloves; quiet and guarded"),
]
EXPR = {'neutral': 'calm, neutral expression', 'determined': 'determined expression, jaw set, ready to fight', 'concerned': 'concerned, worried expression'}
ICON_ART = {
 'arenCrest': ('treasure', "an old round steel shield boss, dented and scratched, with a strip of ash-grey cloth tied through it (no emblem, no letters)"),
 'teacherTome': ('treasure', "a worn leather-bound spellbook with brass corners, a faint violet glow leaking between the pages"),
 'garrRing': ('treasure', "a thick, crude iron ring with a scratched surface, resting on a scrap of red cloth"),
 'runnerMapCase': ('treasure', "a leather map tube with a shoulder strap, a rolled map peeking out of the open end"),
 'pursuerGreaves': ('treasure', "a pair of leather-and-iron greaves splashed with dried mud"),
 'quartermasterSeal': ('treasure', "a small brass seal stamp with a dark wooden handle, its stamp face plain and blank"),
}
ARENA = ("Paint the background of the 「잿빛 결투장」 (Ash Dueling Ground) for Ashen Crown: one opaque PNG, exactly 1600x900 px. A circular dueling ground "
         "of trampled grey ash and earth at dusk, seen from a low three-quarter view. At a distance the ring is lined by two loose rows of soldiers' "
         "banners on poles — the left half plain blue cloth, the right half plain red cloth, no emblems — with a few low torches and distant ruined walls. "
         "NO people at all (the game draws the two fighters on top). The middle of the lower half is an empty, evenly lit circle of ash where the "
         "fighters stand; keep the bottom fifth darker and quiet (a dialogue band is laid over it).")
SCENE_STYLE = ("Painting style: the same hand as the attached painted hub (hub_capital.png): soft painterly rendering, warm firelight against cool "
               "dusk, Western medieval frontier fantasy, no anime, no photo-realism, no 3D render look. No text, letters, numbers or logos.")

def icon_cells():
    cat = {c['id']: c for c in ip.catalog()}
    return [dict(cat[i], cell=n+1, kind=ICON_ART[i][0]) for n, i in enumerate(ICON_ART)]
def icon_prompt(cells):
    lines = [f"Paint icon sheet P for Ashen Crown: one 1024x1024 PNG, a 4x4 grid of 256x256 cells, transparent background (or flat pure #00FF00), no grid lines, "
             "no labels. Follow references/layout_icons_P.png for which icon goes in which cell. Match the finish, light and scale of the attached "
             "approved_icons_D.png and approved_icons_H.png exactly (the same painter's hand).", '']
    for c in cells: lines.append(f"Cell {c['cell']:02d}: {c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}. A treasure: give it a soft glow so it reads as special.")
    lines.append(f'Cells {len(cells)+1:02d}–16: leave empty.')
    return '\n'.join(lines)

def jobs():
    seq = []
    for part, t in (('A', 1), ('B', 2), ('C', 3)):
        for cls, mounted, weapon, tiers in CLASSES:
            desc = tiers[t-1] + ' ' + MAGENTA + ' ' + ORIGINAL + (' ' + TIER_MARK if t == 3 else '')
            ref = TEMP[cls][t-1]
            prompt = cp.SHEET_D.format(ref=ref, mounted=cp.MOUNTED if mounted else '', desc=desc, weapon=weapon)
            seq.append(dict(part=part, kind='sprite', id=f'class_{cls}_{t}', expression='', file=f'class_{cls}_{t}.png', size='1024x768',
                            title=f'{KO[cls]} {t}단계 · {TIER_KO[cls][t-1]}', refs=f'ref_sprite_{ref}.png, style_aren_neutral.png', prompt=prompt))
    for oid, who, desc in OFFICERS:
        for e, ed in EXPR.items():
            prompt = (f"Paint a dialogue bust of {who} for Ashen Crown: one PNG, exactly 1024x1280, transparent background (or flat pure #00FF00), head and "
                      f"shoulders down to mid-chest, turned slightly to the viewer's right, framed exactly like the attached style_aren_neutral.png. "
                      f"{desc}. {ed}. The same person in all three expressions (neutral, determined, concerned). {cp.STYLE}")
            seq.append(dict(part='D', kind='bust', id=oid, expression=e, file=f'bust_{oid}_{e}.png', size='1024x1280', title=f'{who} · {e}',
                            refs='style_aren_neutral.png, ref_bust_baldrick_neutral.png', prompt=prompt))
    seq.append(dict(part='E', kind='scene', id='arena', expression='', file='arena.png', size='1600x900', title='잿빛 결투장 배경',
                    refs='hub_capital.png, ref_duel_screen.png', prompt=ARENA + '\n\n' + SCENE_STYLE))
    IL = icon_cells()
    seq.append(dict(part='E', kind='icons', id='icons_P', expression='', file='icons_P.png', size='1024x1024', title='아이콘 시트 P',
                    refs='layout_icons_P.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png', prompt=icon_prompt(IL)))
    return seq, IL

def start_here(seq, IL):
    L = []; w = L.append; n = lambda p: sum(1 for j in seq if j['part'] == p)
    w('# Ashen Crown — v2.0.0 Battle Reform Art Work Order (pack H1)'); w('')
    w('You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the parts in order and return the zips described in section 7.')
    w('The game now draws **every soldier of a class with the same figure** on the battlefield, and the side (the player\'s legion, the enemy, allied banners) is shown by **colour**. The heroes keep their own dialogue portraits; on the map they carry a small pennant. This pack paints those class figures, the four new officers\' portraits, the duel arena and six treasure icons.'); w('')
    w('| part | what | images |'); w('|---|---|---:|')
    w(f"| **A** | class map sheets, tier 1 (eight classes) | {n('A')} |"); w(f"| **B** | class map sheets, tier 2 | {n('B')} |"); w(f"| **C** | class map sheets, tier 3 | {n('C')} |")
    w(f"| **D** | the four officers' busts × three expressions | {n('D')} |"); w(f"| **E** | the duel arena background and icon sheet P | {n('E')} |"); w('')
    w('## 1. The magenta rule (parts A–C)'); w(''); w(f'- {MAGENTA}'); w('- Test: if you replace every magenta pixel with blue, the figure must read as a legion soldier; with red, as an enemy. Keep magenta out of everything else.'); w('')
    w('## 2. Each class grows (parts A–C)'); w('')
    w('The three tiers of one class are the same kind of soldier growing: the armour gets heavier and richer, the weapon better, and the **attack frame (column 4) changes** as listed — e.g. the archer looses one arrow at tier 1, two at tier 2 and three ember arrows at tier 3. Tier 3 always carries the Ashen Crown mark (ash-grey trim, a faint warm-gold ward light).'); w('')
    w('| class | tier 1 | tier 2 | tier 3 |'); w('|---|---|---|---|')
    for cls, mounted, weapon, tiers in CLASSES: w(f"| {KO[cls]} ({cls}) | {TIER_KO[cls][0]} | {TIER_KO[cls][1]} | {TIER_KO[cls][2]} |")
    w('')
    w('## 3. Jobs'); w(''); w('| # | part | file | what | size | attach | prompt |'); w('|---|---|---|---|---|---|---|')
    for i, j in enumerate(seq, 1): w(f"| {i} | {j['part']} | `{j['file']}` | {j['title']} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    w(''); w('| cell | id | icon |'); w('|---|---|---|')
    for c in IL: w(f"| P{c['cell']:02d} | `{c['id']}` | {c['en']} ({c['ko']}) |")
    w('')
    w('## 4. Global rules'); w('')
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheet (`ref_sprite_*.png`, shown at half size: double it).')
    w('- Busts: exactly 1024×1280, transparent (or `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer\'s right. All three expressions of one officer are the same person. Noa is an adult.')
    w('- Arena: exactly 1600×900, opaque, no people. Icon sheet: 4×4 cells of 256 px, cells 07–16 empty, transparent (or `#00FF00`).')
    w('- **Original work only.** Never write the name of any existing game, character or studio in a prompt, and do not copy or imitate any existing artwork, sprite, class costume or duel screen. No text, letters, numbers, emblems, crests, holy symbols or logos anywhere.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.'); w('')
    w('## 5. Order of work'); w(''); w('- **A → B → C:** class by class in the table order (keep each class consistent across its three tiers).'); w('- **D:** officer by officer, neutral first.'); w('- **E:** `arena.png` → `icons_P.png`.'); w('')
    w("## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)"); w('')
    w('- [ ] Every file at its exact size; real transparency or pure `#00FF00` (say which).')
    w('- [ ] Parts A–C: side-colour cloth is pure magenta shades only; no other magenta or pink; the 12 frames of a sheet are consistent; the attack frame matches the tier.')
    w('- [ ] Tier 3 sheets carry the ash-grey and ward-gold mark.')
    w('- [ ] Part D: the three expressions of each officer are the same person; Noa reads as an adult.')
    w('- [ ] No text, emblems or logos; nothing imitates an existing game.'); w('')
    w('## 7. Return format — one zip per part, **each under 20 MB**'); w('')
    for p in 'ABCDE': w(f'- `{NAME}_{p}.zip`')
    w(''); w('```'); w(f'{NAME}_<A|B|C|D|E>/'); w('  png/                # PNG masters')
    w('  manifest.csv        # A–D: id,kind,expression,file,sha256   (kind = sprite or bust; file = png/<file>)')
    w('  manifest_scene.csv  # E: id,file,width,height,sha256 (arena)'); w('  manifest_icons.csv  # E: sheet,file,width,height,background,bytes,sha256')
    w('  SHA256SUMS.txt'); w('  QA_REPORT.md'); w('  contact_sheet.jpg   # under 1 MB'); w('  prompts_used/'); w('```'); w('')
    w("- **Before you hand a zip over, reopen it and test it** (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.")
    w('- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.'); w('')
    return '\n'.join(L)

README_KO_T = """# 사용 방법 (사용자용) — 그림팩 H1 (v2.0.0 전장 개편, {TOTAL}장)

설계안 §9(D-115)의 첫 그림팩입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 병종 전장 그림 1단계 (보병·창병·궁병·기병·마도사·치유사·도적·방패병) | 8 |
| **B** | 병종 전장 그림 2단계 | 8 |
| **C** | 병종 전장 그림 3단계 (잿빛 문장과 결계의 금빛) | 8 |
| **D** | 부장 넷(브람·노아·마르타·로웰)의 초상 × 표정 셋 | 12 |
| **E** | 잿빛 결투장 배경 + 아이콘 시트 P(보물 여섯) | 2 |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 붙여 넣으세요. `<A|B|C|D|E>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B|C|D|E> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return {NAME}_<A|B|C|D|E>.
```

## 진영 색(마젠타) 규칙
병종 그림에서 **진영을 나타낼 천(겉옷·망토·띠·마갑 천)만 순수한 마젠타**로 칠하게 했습니다. 게임이 그 부분을 아군 파랑·적 빨강·동맹 깃발 색으로 바꿉니다. 그래서 같은 병종은 아군과 적군이 같은 그림이고 색만 다릅니다.

## 승급별 변화 (§3.5)
| 병종 | 1단계 | 2단계 | 3단계 |
|---|---|---|---|
| 궁병 | 화살 1발 | 화살 2발 | 잿불 화살 3발 |
| 기병 | 가죽 마갑 | 사슬 마갑 | 판금 마갑, 갈기 장식 |
| 보병 | 베기 | 2연 베기 | 회전 베기 |
| 그 밖 | 표 `00_START_HERE.md` §2 | | |

## 표절 방지 (§13)
지시서에 「기존 게임의 그림·병과 복장·결투 화면을 흉내 내지 말 것, 게임 이름을 쓰지 말 것」을 적었습니다. 받은 뒤 확인합니다.

## 받은 뒤
ZIP을 Claude에게 주세요. SHA256을 검증하고 넣습니다(병종·초상: import-art.py, 결투장: import-duel-art.py, 아이콘: import-item-art.py --cells). 받기 전까지는 게임이 기존 그림에 색을 입혀 임시로 씁니다.
"""

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    Image.open(OLD/'style_aren_neutral.png').save(refs/'style_aren_neutral.png', optimize=True)
    Image.open(ROOT/'src/assets/portraits/bust_baldrick_neutral.webp').convert('RGBA').save(refs/'ref_bust_baldrick_neutral.png', optimize=True)
    for ids in TEMP.values():
        for sid in ids: Image.open(ROOT/f'src/assets/sprites/sprite_{sid}.webp').convert('RGBA').save(refs/f'ref_sprite_{sid}.png', optimize=True)
    Image.open(ROOT/'src/assets/hubs/hub_capital.webp').convert('RGB').save(refs/'hub_capital.png', optimize=True)
    (refs/'approved_icons_D.png').write_bytes((F1REF/'approved_icons_D.png').read_bytes())
    h = F2REF/'approved_icons_H.png'
    if h.exists(): (refs/'approved_icons_H.png').write_bytes(h.read_bytes())
    shot = ROOT/'docs/v2.0.0/screenshots/duel-arena.png'
    if shot.exists(): Image.open(shot).convert('RGB').save(refs/'ref_duel_screen.png', optimize=True)
    seq, IL = jobs(); ip.grid_sketch(IL, 'P').save(refs/'layout_icons_P.png', optimize=True)
    (PACK/'00_START_HERE.md').write_text(start_here(seq, IL), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO_T.replace('{NAME}', NAME).replace('{TOTAL}', str(len(seq))), encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'part', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(seq, 1): wr.writerow([i, j['part'], j['kind'], j['id'], j['expression'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    with open(PACK/'cells.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['sheet', 'cell', 'id', 'kind', 'name_en', 'name_ko', 'description'])
        for c in IL: wr.writerow(['P', c['cell'], c['id'], c['kind'], c['en'], c['ko'], f"{c['en']} ({c['ko']}): {ICON_ART[c['id']][1]}."])
    for i, j in enumerate(seq, 1):
        body = f"{j['prompt']}\n\n{ip.STYLE if j['kind']=='icons' else ''}\nAttach: {j['refs']}.\n"
        (PACK/'prompts'/f"{i:02d}_{Path(j['file']).stem}.txt").write_text(body, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v200_H1_Work_Pack/'+str(p.relative_to(PACK)))
        with zipfile.ZipFile(out) as z: assert z.testzip() is None
        print('zip', out, out.stat().st_size)
    print('pack', PACK, {p: sum(1 for j in seq if j['part'] == p) for p in 'ABCDE'}, 'total', len(seq))

if __name__ == '__main__':
    main()
