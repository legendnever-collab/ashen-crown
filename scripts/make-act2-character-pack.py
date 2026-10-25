#!/usr/bin/env python3
"""Build the ChatGPT work pack for the v0.6.0 ACT II characters (D-055 §7): 16 busts + 9 sprite sheets.

Writes docs/v0.6.0/art/character-work-pack/{00_START_HERE.md, README_KO.md, jobs.csv, prompts/*.txt, references/*}.
The return manifest matches scripts/import-art.py (kind,id,expression,file,...,sha256).
Usage: python3 scripts/make-act2-character-pack.py [--zip <out.zip>]
"""
import csv, sys, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT/'docs/v0.6.0/art/character-work-pack'
NAME = 'Ashen_Crown_v060_Character_Art_Pack'
EXPR = {'neutral': 'neutral, composed',
        'concerned': 'concerned — brows raised and pulled together, slight frown',
        'determined': 'determined — brows lowered, firm mouth, intense eyes',
        'sad': 'sad — downcast eyes, inner brows raised, mouth turned down'}

STYLE = ("Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a "
         "classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated "
         "but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). "
         "Original characters: do not copy any existing game's character, costume, emblem or logo.")

BUST_B = ("Same painting style as the attached approved portraits. Original character for \"Ashen Crown\", a Western medieval frontier fantasy tactical RPG.\n"
          "Paint a three-quarter bust (head, shoulders, upper chest), turned slightly to the viewer's RIGHT, eyes looking right, as if speaking to a text box on the right.\n"
          "Character: {desc}\nExpression: {expr}\n"
          "Output: PNG exactly 1024x1280 portrait, the character only on a fully TRANSPARENT background (if impossible, flat pure green #00FF00), no text, no frame, no UI; "
          "same framing and scale as style_aren_neutral.png (top of the hair about 8% below the top edge, shoulders filling the width, bust cut cleanly at the bottom edge).")
BUST_C = ("Using the attached bust_{id}_neutral.png as the exact model sheet: same character, same outfit, same pose, same framing, same lighting and same style. "
          "Change ONLY the facial expression to: {expr}.\n"
          "Output: PNG exactly 1024x1280, transparent background (or flat pure green #00FF00), nothing else changed, no text.")
SHEET_D = ("Using the attached portrait (or description) as the costume and color reference, draw the same character as a small full-body battle-map figure for a classic "
           "tactical RPG, in the same painted style simplified for small size (clean dark outline, readable silhouette, about 3.5 heads tall — slightly heroic, not chibi). "
           "Match the scale and layout of the attached ref_sprite_{ref}.png exactly.\n"
           "Camera: classic top-down three-quarter SRPG map view (looking down about 45 degrees, no isometric rotation).\n"
           "ONE sprite sheet, PNG, exactly 1024x768, a 4-column x 3-row grid of 256x256 cells, transparent background (or flat pure green #00FF00), no grid lines, no text:\n"
           "- Row 1: facing DOWN (toward the camera)\n- Row 2: facing RIGHT (side view; the game mirrors it for left)\n- Row 3: facing UP (back view)\n"
           "- Column 1: standing idle · Column 2: walking step A (left foot forward) · Column 3: walking step B (right foot forward) · Column 4: attack pose with the weapon swung or thrust in the facing direction.\n"
           "Every frame: same scale, centered horizontally in its cell, FEET (or hooves) ON THE SAME BASELINE 16 px above the cell bottom, the whole figure including the weapon inside the cell, "
           "consistent colors in all 12 frames.{mounted}\nCharacter: {desc}\nWeapon: {weapon}")
MOUNTED = (" This figure is MOUNTED on a horse: the horse fills most of the cell width, rider and horse together fit inside the cell, hooves on the baseline "
           "(compare ref_sprite_cavalry.png).")

# ---- characters (all descriptions PROPOSED; names PROPOSED, D-055) ----
LEADERS = [
 dict(id='cassian', name='Cassian Arcane — Consul of the Iron Crown Dominion (철왕관 통령)',
  desc=("Cassian Arcane, the Consul who rules the Iron Crown Dominion of the snowy north, a man in his early forties. Tall and composed, short dark hair greying at the temples, "
        "clean-shaven, sharp pale grey eyes, a straight nose, a thin old scar along the jaw. A high-collared steel-blue officer's long coat with black trim over a polished "
        "gunmetal breastplate, a heavy dark-grey fur mantle on the shoulders against the cold, a plain iron ring-collar at the throat (no crown, no emblem, no letters), "
        "black leather gloves, one hand resting on a sheathed sword hilt. Calm authority of a statesman-general; he believes order is the only shelter.")),
 dict(id='leonora', name='Leonora Arcane — Speaker of the Free Lords Alliance (자유 영주 연맹 의장)',
  desc=("Leonora Arcane, the elected Speaker of the Free Lords Alliance, who governs from the free port city of Velmar on the west coast, a woman in her late thirties. "
        "Ash-blonde hair in a loose low braid pinned with small silver pins, warm hazel eyes, a few freckles, a confident half-smile. A green-and-cream layered noble "
        "riding coat with silver buttons, a short dark-green shoulder cape, a sash made of many narrow ribbons in different colors (the colors of the allied lords, no "
        "emblems or letters), a slim rapier at the hip, a sea-salt-weathered leather glove. Elegant but practical; she argues that order can exist without a king.")),
]
RECRUITS = [
 dict(id='thea', name='Thea Corvin — Iron Crown mounted lancer (철왕관 기병 창기사)', ref='cavalry', mounted=True,
  desc=("Thea Corvin, captain of an Iron Crown supply-escort cavalry troop, a young woman in her mid-twenties. Copper-brown hair tied in a short high ponytail, "
        "steel-blue eyes, light skin reddened by cold wind, a small scar on the chin, a disciplined, straight-backed bearing. Steel-blue lamellar-and-plate cavalry "
        "armor over a dark padded coat, a fur-lined collar, a short steel-blue riding cape, riding gauntlets; she trusts order but questions harsh punishment."),
  weapon='a long cavalry lance with a small plain steel-blue pennant (no emblem); on the map she rides a grey horse with steel-blue cloth barding'),
 dict(id='dario', name='Dario Venn — Velmar mercenary swordsman (자유도시 용병 검사)', ref='eric', mounted=False,
  desc=("Dario Venn, a sell-sword from the free port city of Velmar, a man in his late twenties. Tanned olive skin, black curly hair tied back loosely, short stubble, "
        "dark brown eyes, a small gold hoop earring, a crooked sly grin. A wine-red open-collared doublet under a brown leather brigandine with many buckles, "
        "a sea-green sash at the waist, a bandaged left forearm, a short weathered travel cloak; he talks of freedom but laughs at freedom without coin."),
  weapon='a broad single-edged longsword held in one hand, a parrying dagger at the belt'),
]
UNITS = [
 dict(id='ironInfantry', name='Iron Crown infantry (allied NPC army, M07–M08)', ref='ironSpear',
  desc='Iron Crown Dominion line infantryman, gunmetal half-plate, steel-blue tabard, open kettle helmet with a short steel-blue plume, grey fur shoulder cloak for the snow, orderly posture',
  weapon='spear and a tall rectangular steel-blue shield (plain, no emblem)'),
 dict(id='ironDeserter', name='Iron Crown deserter (M07)', ref='ironSpear',
  desc='Iron Crown deserter, mismatched gunmetal armor pieces, a torn steel-blue tabard with the badge cut away, ragged fur cloak, stubble, hungry and desperate',
  weapon='notched hand axe'),
 dict(id='mercSpear', name='hard-line mercenary pikeman (M08)', ref='ironSpear',
  desc='mercenary pikeman of a hard-line free company, brown brigandine with red-and-black quartered sleeves (company colors, no emblem), open sallet helmet, leather boots',
  weapon='long pike'),
 dict(id='assassin', name='assassin (M09)', ref='eric',
  desc='lean assassin in a dark grey-green hooded coat, a cloth mask over the lower face, soft boots, many small straps and pouches, quick and low stance',
  weapon='two short curved blades'),
 dict(id='lordA', name="Lord A's soldier (M10)", ref='ironSpear',
  desc="soldier of a western lord's army, blue-and-white quartered tabard over mail, rounded open helmet, white plume (color group A)",
  weapon='spear and a round blue-and-white shield (plain, no emblem)'),
 dict(id='lordB', name="Lord B's soldier (M10)", ref='ironSpear',
  desc="soldier of a rival western lord's army, orange-and-brown quartered tabard over mail, kettle helmet, orange plume (color group B)",
  weapon='halberd'),
 dict(id='councillor', name='Velmar council delegate (civilian to protect, M09)', ref='eric',
  desc='elderly Velmar council delegate, fine green-and-cream long robe, a plain silver chain of office without any emblem, a soft cap, grey beard, carrying a rolled document',
  weapon='no weapon — the attack column is a startled flinch holding the document up'),
]

def jobs():
    J = []
    for c in LEADERS+RECRUITS:
        for e in EXPR:
            if e == 'neutral':
                refs = 'style_aren_neutral.png, ref_bust_baldrick_neutral.png'
                prompt = BUST_B.format(desc=c['desc'], expr=EXPR[e])
            else:
                refs = f"bust_{c['id']}_neutral.png (your approved result)"
                prompt = BUST_C.format(id=c['id'], expr=EXPR[e])
            J.append(dict(id=c['id'], kind='bust', expression=e, file=f"bust_{c['id']}_{e}.png", size='1024x1280', refs=refs, prompt=prompt, who=c['name']))
    for c in RECRUITS:
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768',
                      refs=f"bust_{c['id']}_neutral.png (your approved result), ref_sprite_{c['ref']}.png",
                      prompt=SHEET_D.format(ref=c['ref'], mounted=MOUNTED if c['mounted'] else '', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    for c in UNITS:
        J.append(dict(id=c['id'], kind='sprite', expression='', file=f"sprite_{c['id']}.png", size='1024x768',
                      refs=f"ref_sprite_{c['ref']}.png, style_aren_neutral.png",
                      prompt=SHEET_D.format(ref=c['ref'], mounted='', desc=c['desc'], weapon=c['weapon']), who=c['name']))
    return J

def start_here(J):
    L = []; w = L.append
    w('# Ashen Crown — ACT II Characters Art Work Order (v0.6.0)')
    w('')
    w('You are producing finished character art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs in order and return the zips described in section 5.')
    w('Everything you need is in this pack: `jobs.csv`, `prompts/` (one full prompt per image) and `references/` (images to attach).')
    w('')
    w(f'## 1. Deliverables ({len(J)} images)')
    w('')
    w('| # | file | who | size (px) | attach | prompt |')
    w('|---|---|---|---|---|---|')
    for i, j in enumerate(J, 1):
        w(f"| {i} | `{j['file']}` | {j['who']} | {j['size'].replace('x', '×')} | {j['refs']} | `prompts/{i:02d}_{Path(j['file']).stem}.txt` |")
    w('')
    w('## 2. Global rules')
    w('')
    w(f'- {STYLE}')
    w('- Never write the name of any existing game, character or studio in a prompt.')
    w('- **No text, letters, numbers, emblems, crests or logos** on clothing, shields, banners or anywhere. Faction identity comes from colors only.')
    w('- Busts: exactly 1024×1280, transparent background (or flat pure `#00FF00`), same framing as `style_aren_neutral.png`, turned to the viewer\'s right.')
    w('- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells, feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached `ref_sprite_*.png` (they are shown at half size: 512×384).')
    w('- Do each named character in **one conversation thread**: neutral bust first, then the three expressions from it, then its sprite sheet. The face, hair, eyes, outfit and colors must stay identical across all of that character\'s images.')
    w('- Final sizes must be exact. If the generator returns another size, resize keeping the aspect ratio and pad (transparent) to the exact size. Do not stretch.')
    w('')
    w('## 3. Order of work')
    w('')
    w('1. `cassian` neutral → concerned / determined / sad.')
    w('2. `leonora` neutral → three expressions.')
    w('3. `thea` neutral → three expressions → `sprite_thea.png` (mounted; compare `ref_sprite_cavalry.png`).')
    w('4. `dario` neutral → three expressions → `sprite_dario.png`.')
    w('5. The seven unit sheets (no busts). Allied and enemy groups must be told apart by color at small size: Iron Crown = steel-blue and gunmetal; deserters = torn steel-blue and ragged fur; hard-line mercenaries = red-and-black; assassin = dark grey-green; lord A = blue-and-white; lord B = orange-and-brown; council delegate = green-and-cream civilian robe.')
    w('')
    w('## 4. Self-check (record PASS/FAIL per item in QA_REPORT.md)')
    w('')
    w('- [ ] 16 busts at exactly 1024×1280 and 9 sheets at exactly 1024×768; all decode; real transparency or pure `#00FF00` (say which per file).')
    w('- [ ] No text, letters, emblems, crests or logos anywhere.')
    w('- [ ] Each character\'s four busts share the same face, outfit, framing and lighting; only the expression changes.')
    w('- [ ] Each sheet: 12 frames in the right rows/columns, feet on the same baseline, nothing cut off at cell edges, left/right not swapped (row 2 faces RIGHT).')
    w('- [ ] `sprite_thea.png` is mounted and fits each cell; the other sheets are on foot.')
    w('- [ ] The sheet scale matches the attached references (a standing figure about 2/3 of the cell height).')
    w('')
    w('## 5. Return format — **three zips, each under 20 MB**')
    w('')
    w('Large uploads get cut off, so split the work into three zips with the same structure:')
    w('')
    w(f'- `{NAME}_B1.zip` — the 8 busts of `cassian` and `leonora`')
    w(f'- `{NAME}_B2.zip` — the 8 busts of `thea` and `dario` and their 2 sheets')
    w(f'- `{NAME}_B3.zip` — the 7 unit sheets')
    w('')
    w('```')
    w(f'{NAME}_B1/')
    w('  png/bust_cassian_neutral.png ...   (PNG masters)')
    w('  manifest.csv     # kind,id,expression,file,width,height,bytes,sha256   (kind = bust or sprite; expression empty for sprites; file = png/<name>.png)')
    w('  SHA256SUMS.txt   # sha256  path')
    w('  QA_REPORT.md     # the checklist above (for the files in this zip), generation notes, deviations')
    w('  contact_sheet.jpg   # thumbnails with file names, JPEG under 1 MB')
    w('  prompts_used/    # the exact final prompt per image (txt)')
    w('```')
    w('')
    w('- If one zip would still exceed 20 MB, split it again (`_B2a`, `_B2b`), each with its own manifest and checksums.')
    w('- Do not include WebP. The game team converts the PNG masters.')
    w('- Before finishing, reopen each zip and verify every file against its SHA256SUMS. Report each zip\'s final size in the reply.')
    w('- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.')
    w('')
    return '\n'.join(L)

README_KO = f"""# 사용 방법 (사용자용) — ACT II 인물 25장

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

## A. 한 번에 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 25 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return the three zips {NAME}_B1/_B2/_B3 (each under 20 MB) exactly as described in section 5.
```

## B. 지도자 2명을 먼저 보고 결정하기
```
Attached is a work pack. Read 00_START_HERE.md first. Do only the two neutral busts of cassian and leonora now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 `Approved. Continue with all remaining jobs and return the zips described in section 5.`를 보냅니다.

## 받은 뒤
- ZIP 세 개(_B1, _B2, _B3)를 Claude에게 주세요. 한 개씩 와도 됩니다.
- Claude가 SHA256을 검증하고, 지난번과 같은 방식(`scripts/import-art.py`)으로 WebP로 바꿔 넣습니다.

## 인물 (모두 PROPOSED — 생김새, 이름 모두 바꿀 수 있습니다)
| id | 인물 | 생김새 요점 |
|---|---|---|
| `cassian` | 카시안 아케인, 철왕관 통령 | 40대 초반, 관자놀이가 센 짙은 머리, 회색 눈, 강철 청색 장교 외투와 회색 털 망토, 문장 없는 쇠 목깃 |
| `leonora` | 레오노라 아케인, 자유 영주 연맹 의장 | 30대 후반, 은핀을 꽂은 잿빛 금발 땋은 머리, 녹색·크림색 승마 외투, 여러 영주 색 리본 띠, 레이피어 |
| `thea` | 테아 코르빈, 철왕관 기병 창기사 | 20대 중반, 구릿빛 갈색 포니테일, 강철 청색 미늘 갑옷과 털 깃, 창. 맵에서는 회색 말을 탐 |
| `dario` | 다리오 벤, 벨마르 용병 검사 | 20대 후반, 올리브빛 피부, 묶은 검은 곱슬머리, 금 귀걸이, 와인색 더블릿과 가죽 브리건딘, 바다빛 띠, 외날 장검 |

맵 시트만 그리는 병종 7종:
- 통령국 보병(동맹)
- 통령국 탈영병
- 강경파 용병 창병
- 자객
- 영주군 A(청백)
- 영주군 B(주황·갈색)
- 벨마르 의회 대표(민간인)
"""

def ref_png(src, dst, size=None):
    im = Image.open(src).convert('RGBA')
    if size: im = im.resize(size, Image.LANCZOS)
    im.save(dst, optimize=True)

def main():
    refs = PACK/'references'; (PACK/'prompts').mkdir(parents=True, exist_ok=True); refs.mkdir(parents=True, exist_ok=True)
    for p in list((PACK/'prompts').glob('*.txt')): p.unlink()
    old = ROOT/'docs/v0.5.0/art/world-work-pack/references'
    ref_png(old/'style_aren_neutral.png', refs/'style_aren_neutral.png')
    ref_png(ROOT/'src/assets/portraits/bust_baldrick_neutral.webp', refs/'ref_bust_baldrick_neutral.png')
    for s in ('eric', 'cavalry', 'ironSpear'):
        ref_png(ROOT/f'src/assets/sprites/sprite_{s}.webp', refs/f'ref_sprite_{s}.png')
    J = jobs()
    (PACK/'00_START_HERE.md').write_text(start_here(J), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO, encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['order', 'kind', 'id', 'expression', 'file', 'size', 'references', 'prompt_file'])
        for i, j in enumerate(J, 1): wr.writerow([i, j['kind'], j['id'], j['expression'], j['file'], j['size'], j['refs'], f"prompts/{i:02d}_{Path(j['file']).stem}.txt"])
    for i, j in enumerate(J, 1):
        (PACK/'prompts'/f"{i:02d}_{Path(j['file']).stem}.txt").write_text(f"{j['prompt']}\n{STYLE}\nAttach: {j['refs']}.\n", encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v060_Character_Work_Pack/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK, len(J), 'jobs')

if __name__ == '__main__':
    main()
