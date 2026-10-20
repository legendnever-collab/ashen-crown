#!/usr/bin/env python3
"""Build the follow-up ChatGPT work pack for the four world/hub images that did not arrive (D-052).

The first return zip was cut off in upload at 25.19 MB; garrison, bivouac, fortress and oath camp
arrived hash-verified, world_map, world_icons, hub_village_day and hub_village_raid did not.
Path A: the GPT session still has the final images (SHA256 below) -> repackage only.
Path B: regenerate them, matching the four approved hubs.
Writes docs/v0.5.0/art/world-work-pack-2/ and optionally a zip.
Usage: python3 scripts/make-world-work-pack-2.py [--zip <out.zip>]
"""
import importlib.util, io, shutil, sys, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FIRST = ROOT/'docs/v0.5.0/art/world-work-pack'
PACK = ROOT/'docs/v0.5.0/art/world-work-pack-2'
spec = importlib.util.spec_from_file_location('wp1', ROOT/'scripts/make-world-work-pack.py'); wp1 = importlib.util.module_from_spec(spec); spec.loader.exec_module(wp1)

MISSING = [  # id, kind, file, size, sha256 and bytes of the final image reported in the first return manifest
 ('world_map', 'world', 'world_map.png', '1536x1024', 'af31a6b35846b683e9ba7f5b3c4c8ddff2621d1a726403a619d1a7214e4e5f24', 3855413),
 ('world_icons', 'icons', 'world_icons.png', '1024x1024', '7f6ddc8030e17ef3984f6e7f2def00d4797206ae1f511a7627c9a0da2e46d285', 1613245),
 ('hub_village_day', 'hub', 'hub_village_day.png', '1536x1024', 'f1b5d45d936aa06a0d44a83bfd0ce2ab6ad1fd9f014d50da8392d8c966a85d26', 3723455),
 ('hub_village_raid', 'hub', 'hub_village_raid.png', '1536x1024', 'f448c3fdce020d4ce79a3b896342fa4ec93c74d9d3879ce0289ae623d6b681d0', 3511292)]
RECEIVED = ['hub_garrison', 'hub_bivouac_night', 'hub_fortress', 'hub_oathcamp']

EXTRA = {
 'world_map': ("\nAdditional requirements for this run:\n"
  "- The four hub maps in references/approved_*.jpg are already approved; match their palette and brush texture (warm, saturated, painterly).\n"
  "- Keep every site position listed in 00_START_HERE.md as a calm, fairly flat patch about 80 px across: no trees, rocks, cliffs, water edges or relief inside it. "
  "Small grass or field texture is fine. Check each one in a 100x100 crop before delivering.\n"),
 'world_icons': ("\nAdditional requirements for this run:\n"
  "- Each icon must sit fully inside its own cell with at least 24 px of fully transparent space on every side; nothing may touch or cross a cell boundary "
  "(cells are 341/342/341 px wide and tall). If the generator crowds the icons, generate them in batches and compose the sheet yourself with Pillow — composing "
  "and moving whole icons is allowed; repainting is not.\n"
  "- No colored fringes: on a dark background no red/yellow/cyan halo may remain around a silhouette.\n"),
 'hub_village_day': ("\nAdditional requirements for this run:\n"
  "- Attach references/approved_hub_garrison.jpg and references/approved_hub_fortress.jpg as the style anchor instead of a village image: "
  "same camera angle, scale, outline weight and palette as those approved maps.\n"
  "- Ordinary house and shop doors about 64 px wide, facing down (toward the viewer), each with a clear walkable patch in front.\n"),
 'hub_village_raid': ("\nAdditional requirements for this run:\n"
  "- Edit your final hub_village_day.png; do not generate from scratch. Buildings that are not burnt keep identical outlines and doors.\n"
  "- Thin smoke only; no large flames over paths or doorways.\n"),
}

def jpg(src, dest, width=1024):
    img = Image.open(src).convert('RGB'); img.thumbnail((width, width), Image.LANCZOS); img.save(dest, 'JPEG', quality=86, optimize=True)

def start_here():
    L = []; w = L.append
    w('# Ashen Crown — World Art Work Order, Part 2 (v0.5.0)')
    w('')
    w('This is a follow-up to the earlier world/hub work order. The earlier return zip was cut off during upload (it arrived truncated at 25.19 MB).')
    w('Four hub maps arrived intact and are approved: hub_garrison, hub_bivouac_night, hub_fortress, hub_oathcamp. **Do not redo or include them.**')
    w('Only the four images below are needed.')
    w('')
    w('| # | id | file | size (px) | final image reported earlier: SHA256 · bytes | prompt |')
    w('|---|---|---|---|---|---|')
    for i, (id_, kind, f, size, sha, n) in enumerate(MISSING, 1):
        w(f"| {i} | `{id_}` | `{f}` | {size.replace('x', '×')} | `{sha[:16]}…` · {n:,} | `prompts/{i:02d}_{id_}.txt` |")
    w('')
    w('## 1. Path A — repackage (preferred)')
    w('If the final files from the earlier run are still available in this conversation or your workspace, **do not regenerate**.')
    w('Instead, verify that each one has exactly this SHA256 and package it:')
    w('')
    w('```')
    for id_, kind, f, size, sha, n in MISSING:
        w(f'{sha}  png/{f}')
    w('```')
    w('')
    w('Use Path A per file. Any file that is missing or has a different hash goes through Path B.')
    w('')
    w('## 2. Path B — regenerate')
    w('Use `prompts/01–04_*.txt` and attach the listed references from `references/`. The global rules of the first work order still apply:')
    w('')
    w(f'- {wp1.STYLE}')
    w('- **No text anywhere in the images**: no place names, sign lettering, legends, watermarks, UI or frames.')
    w('- Village maps contain **no people and no animals**. The game places walking characters on top.')
    w('- The layout sketches use a 64 px grid. Labelled areas stay in place, and paths and the square stay wide and clear.')
    w('- Final sizes must be exact. Resize keeping the aspect ratio, then center-crop or pad. Never stretch.')
    w('- The four `references/approved_*.jpg` images are the already-approved hub maps. New images must look like the same game.')
    w('- Generation order: `world_map` → `world_icons` (attach your final map) → `hub_village_day` → `hub_village_raid` (an edit of your final village).')
    w('')
    w('World-map site positions that must stay clear (x, y on 1536×1024):')
    w('')
    w('| site | x | y |')
    w('|---|---|---|')
    for name, x, y in wp1.SITES:
        w(f'| {name} | {x} | {y} |')
    w('')
    w('## 3. Self-check (write the results in QA_REPORT.md; only claim what you actually checked)')
    w('')
    w('- [ ] 4 PNGs, exact sizes, all decode. `world_icons` is RGBA with real transparency.')
    w('- [ ] For each file, state Path A (hash matched) or Path B (regenerated).')
    w('- [ ] No text, letters, numbers, watermarks or UI. No people in the village maps.')
    w('- [ ] Path B only: world-map sites are clear, icon cells have ≥24 px empty margins, and raid/day building outlines align (attach a 50% blend).')
    w('')
    w('## 4. Return format — one zip under 20 MB: `Ashen_Crown_v050_World_Art_Pack_Part2.zip`')
    w('')
    w('```')
    w('Ashen_Crown_v050_World_Art_Pack_Part2/')
    w('  png/world_map.png  png/world_icons.png  png/hub_village_day.png  png/hub_village_raid.png')
    w('  manifest.csv        # id,kind,path,width,height,bytes,sha256  (4 rows)')
    w('  SHA256SUMS.txt')
    w('  QA_REPORT.md')
    w('  contact_sheet.jpg   # small JPEG preview of the 4 images')
    w('  evidence/           # JPEG only, each under 1 MB (e.g. raid_vs_day_blend.jpg) — Path B only')
    w('  prompts_used/       # Path B only')
    w('```')
    w('')
    w('- **Size limit:** the whole zip must be under 20 MB, because the earlier 25 MB zip was cut off in upload.')
    w('  - Keep the four masters as PNG. Make all evidence and previews JPEG.')
    w('  - If the zip would still exceed 20 MB, split it into `…_Part2a.zip` (world_map, world_icons) and `…_Part2b.zip` (both village maps). Each part gets its own manifest and checksums.')
    w('- Before finishing, reopen the zip you produced and verify every file against SHA256SUMS. Report the final zip size in the reply.')
    w('')
    return '\n'.join(L)

def main():
    if PACK.exists(): shutil.rmtree(PACK)
    (PACK/'prompts').mkdir(parents=True); (PACK/'references').mkdir()
    jobs = {j['id']: j for j in wp1.JOBS}
    refs = {'world_map': 'layout_world_map.png, style_aren_neutral.png, approved_hub_garrison.jpg',
            'world_icons': 'world_map.png (your final result), style_aren_neutral.png',
            'hub_village_day': 'layout_hub_village.png, scale_reference.png, sprite_eric_sheet.png, approved_hub_garrison.jpg, approved_hub_fortress.jpg',
            'hub_village_raid': 'hub_village_day.png (your final result), layout_hub_village_raid.png'}
    for i, (id_, kind, f, size, sha, n) in enumerate(MISSING, 1):
        j = jobs[id_]; prompt = j['prompt']
        if id_ == 'hub_village_day': prompt = prompt.replace('This image becomes the style anchor for every other hub map.', 'It must match the approved hub maps attached as approved_*.jpg.')
        text = (f"{prompt}\n{EXTRA[id_]}{wp1.STYLE}\nAttach: {refs[id_]}.\nOutput: one PNG, exactly {size} px{' landscape' if size == '1536x1024' else ''}.\n")
        (PACK/'prompts'/f'{i:02d}_{id_}.txt').write_text(text, encoding='utf-8')
    with open(PACK/'jobs.csv', 'w', encoding='utf-8') as fh:
        fh.write('order,id,kind,file,size,expected_sha256_if_repackaged,references,prompt_file\n')
        for i, (id_, kind, f, size, sha, n) in enumerate(MISSING, 1):
            fh.write(f'{i},{id_},{kind},{f},{size},{sha},"{refs[id_]}",prompts/{i:02d}_{id_}.txt\n')
    for name in ['layout_world_map.png', 'layout_hub_village.png', 'layout_hub_village_raid.png', 'scale_reference.png', 'sprite_eric_sheet.png', 'style_aren_neutral.png', 'style_eric_neutral.png']:
        shutil.copy(FIRST/'references'/name, PACK/'references'/name)
    for hub in RECEIVED:
        jpg(ROOT/f'src/assets/hubs/{hub}.webp', PACK/'references'/f'approved_{hub}.jpg')
    (PACK/'00_START_HERE.md').write_text(start_here(), encoding='utf-8')
    (PACK/'README_KO.md').write_text(README_KO, encoding='utf-8')
    if '--zip' in sys.argv:
        out = Path(sys.argv[sys.argv.index('--zip')+1])
        with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
            for p in sorted(PACK.rglob('*')):
                if p.is_file(): z.write(p, 'Ashen_Crown_v050_World_Work_Pack_Part2/'+str(p.relative_to(PACK)))
        print('zip', out, out.stat().st_size)
    print('pack', PACK)

README_KO = """# 사용 방법 (사용자용) — 못 받은 4장만

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요.

## 처음 그림을 그렸던 대화창이 남아 있을 때 (권장)
같은 대화창에 이 ZIP을 올리면, GPT가 이미 만든 4장을 다시 그리지 않고 SHA256을 확인한 뒤 묶어서 줍니다.
```
Attached is a follow-up work pack. Read 00_START_HERE.md first. The previous return zip was cut off during upload. Use Path A for every file you still have (verify the SHA256), Path B only for the rest, and return Ashen_Crown_v050_World_Art_Pack_Part2.zip under 20 MB exactly as described in section 4.
```

## 새 대화창일 때
같은 메시지를 쓰면 됩니다. GPT가 4장을 새로 그리고(Path B), 이미 승인된 거점 4장의 화풍에 맞춥니다.

## 받은 뒤
- 결과 ZIP을 그대로 Claude에게 주세요.
- 20MB를 넘으면 GPT가 두 개(Part2a, Part2b)로 나눕니다. 그때는 두 개 모두 주세요.

## 파일 구성
| 파일 | 내용 |
|---|---|
| `00_START_HERE.md` | GPT가 읽는 영문 작업 지시서 (Path A 재포장 / Path B 재생성, 20MB 제한) |
| `jobs.csv` | 4장 목록과 예전 결과물의 SHA256 |
| `prompts/01–04_*.txt` | Path B로 다시 그릴 때 쓰는 프롬프트 (지난번 품질 지적 사항 보강) |
| `references/approved_*.jpg` | 이미 게임에 들어간 거점 4장 (화풍 맞추기용) |
| `references/layout_*.png`, `scale_reference.png`, `sprite_eric_sheet.png`, `style_aren_neutral.png`, `style_eric_neutral.png` | 배치 스케치와 크기·화풍 기준 |
"""

if __name__ == '__main__':
    main()
