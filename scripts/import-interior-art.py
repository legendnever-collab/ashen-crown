#!/usr/bin/env python3
"""Import the interior & chest art pack (D-056) into runtime WebP assets.

Pack layout (work pack return format): manifest.csv with id,kind,path,width,height,bytes,sha256.
  interior 1536x1024 (12x8 tiles of 128) -> src/assets/rooms/<id>.webp at 1152x768 (1.5x the 64-px world tile)
  hub      1536x1024 (24x16 tiles of 64) -> src/assets/hubs/<id>.webp, same size (ACT II pack C)
  chests   1536x1024 / 1024x1024 sheet of 256-px cells, closed row above open row -> src/assets/chests/<style>_<closed|open>.webp
           at 128x128 each (chest baseline 216/256 of the cell, kept); alpha below 20 is cleared (matting fringe).
SHA256 of every master is checked against the manifest first. No network access.
Usage: python3 scripts/import-interior-art.py <pack-root>
"""
import csv, hashlib, io, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ROOM_DIR, CHEST_DIR, HUB_DIR = ROOT/'src/assets/rooms', ROOT/'src/assets/chests', ROOT/'src/assets/hubs'
SHEETS = {  # sheet id -> styles in reading order (columns per row pair)
 'chests_act1': (6, ['village_chest', 'militia_locker', 'grain_bin', 'elder_coffer', 'field_locker', 'medic_chest',
                     'supply_crate', 'officer_strongbox', 'document_coffer', 'armory_chest', 'fort_locker', 'old_chest']),
 'chests_act2': (4, ['frost_chest', 'fur_trunk', 'sled_crate', 'iron_lockbox', 'sea_chest', 'merchant_coffer', 'cargo_crate', 'council_strongbox']),
}

def webp(img, budget, qualities=(82, 78, 74, 70, 66, 62, 58)):
    for q in qualities:
        out = io.BytesIO(); img.save(out, 'WEBP', quality=q, method=6, alpha_quality=90, exact=False)
        if out.tell() <= budget: return out.getvalue(), q
    return out.getvalue(), q

def cells(sheet, cols, styles):
    sheet = sheet.convert('RGBA')
    for i, style in enumerate(styles):
        c, pair = i % cols, i // cols
        for state, row in (('closed', pair*2), ('open', pair*2+1)):
            cell = sheet.crop((c*256, row*256, c*256+256, row*256+256))
            a = cell.split()[3].point(lambda v: 0 if v < 20 else v); cell.putalpha(a)
            yield style, state, cell.resize((128, 128), Image.LANCZOS)

def main(pack):
    pack = Path(pack); rows = list(csv.DictReader(open(pack/'manifest.csv'))); log = []
    ROOM_DIR.mkdir(parents=True, exist_ok=True); CHEST_DIR.mkdir(parents=True, exist_ok=True)
    for r in rows:
        data = (pack/r['path']).read_bytes()
        if hashlib.sha256(data).hexdigest() != r['sha256']: raise SystemExit(f"SHA256 mismatch: {r['path']}")
        img = Image.open(io.BytesIO(data)); assert img.size == (int(r['width']), int(r['height'])), r['path']
        if r['kind'] == 'interior':
            payload, q = webp(img.convert('RGB').resize((1152, 768), Image.LANCZOS), 240*1024); dest = ROOM_DIR/f"{r['id']}.webp"
            dest.write_bytes(payload); log.append(('room', r['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
        elif r['kind'] == 'hub':
            payload, q = webp(img.convert('RGB'), 380*1024, (84, 80, 76, 72, 68, 64, 60, 56)); dest = HUB_DIR/f"{r['id']}.webp"
            dest.write_bytes(payload); log.append(('hub', r['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
        elif r['kind'] == 'chests':
            cols, styles = SHEETS[r['id']]
            for style, state, cell in cells(img, cols, styles):
                payload, q = webp(cell, 12*1024); dest = CHEST_DIR/f'{style}_{state}.webp'
                dest.write_bytes(payload); log.append(('chest', f'{style}_{state}', dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
        else: raise SystemExit(f"unknown kind {r['kind']}")
    with open(ROOT/'src/assets/room-art-import-log.csv', 'a', newline='') as f:
        w = csv.writer(f)
        if f.tell() == 0: w.writerow(['kind', 'id', 'webp', 'bytes', 'quality', 'webp_sha256', 'source_sha256'])
        w.writerows(log)
    print(f"{len(log)} assets: {sum(l[3] for l in log)} bytes ({sum(1 for l in log if l[0]=='hub')} hubs, {sum(1 for l in log if l[0]=='room')} rooms, {sum(1 for l in log if l[0]=='chest')} chest cells)")

if __name__ == '__main__': main(sys.argv[1])
