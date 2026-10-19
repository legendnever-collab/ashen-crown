#!/usr/bin/env python3
"""Import the world-map / hub art pack (D-052) into runtime WebP assets.

Pack layout (ChatGPT work pack return format): manifest.csv with id,kind,path,width,height,bytes,sha256.
  hub    1536x1024 -> src/assets/hubs/hub_<id>.webp (same size; 24x16 tiles of 64 px)
  world  1536x1024 -> src/assets/world/world_map.webp
  icons  1024x1024 3x3 sheet -> src/assets/world/icon_<name>.webp (each icon trimmed by alpha, fit in 160x160)
SHA256 of every PNG is checked against the manifest first. Rows whose PNG is absent are skipped
only with --allow-missing (reported). No network access.
Usage: python3 scripts/import-world-art.py <pack-root> [--allow-missing]
"""
import csv, hashlib, io, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
HUB_DIR, WORLD_DIR = ROOT/'src/assets/hubs', ROOT/'src/assets/world'
ICONS = ['village', 'camp', 'gate', 'ruin', 'capital', 'stronghold', 'freecity', 'cathedral', 'monastery']  # row-major

def webp(img, budget, qualities=(84, 80, 76, 72, 68, 64, 60, 56)):
    for q in qualities:
        out = io.BytesIO(); img.save(out, 'WEBP', quality=q, method=6, alpha_quality=90, exact=False)
        if out.tell() <= budget: return out.getvalue(), q
    return out.getvalue(), q

def icons(sheet):
    sheet = sheet.convert('RGBA'); cell = sheet.width / 3; out = []
    for i, name in enumerate(ICONS):
        r, c = divmod(i, 3)
        box = (round(c*cell), round(r*cell), round((c+1)*cell), round((r+1)*cell))
        part = sheet.crop(box); alpha = part.split()[3].point(lambda a: 255 if a > 16 else 0)
        bbox = alpha.getbbox() or (0, 0, part.width, part.height); part = part.crop(bbox)
        part.thumbnail((160, 160), Image.LANCZOS)
        canvas = Image.new('RGBA', (160, 160), (0, 0, 0, 0)); canvas.paste(part, ((160-part.width)//2, 160-part.height)); out.append((name, canvas))
    return out

def main(pack, allow_missing=False):
    pack = Path(pack); rows = list(csv.DictReader(open(pack/'manifest.csv'))); log = []; missing = []
    HUB_DIR.mkdir(parents=True, exist_ok=True); WORLD_DIR.mkdir(parents=True, exist_ok=True)
    for r in rows:
        src = pack/r['path']
        if not src.exists():
            if allow_missing: missing.append(r['id']); continue
            raise SystemExit(f"missing: {r['path']}")
        data = src.read_bytes()
        if hashlib.sha256(data).hexdigest() != r['sha256']: raise SystemExit(f"SHA256 mismatch: {r['path']}")
        img = Image.open(io.BytesIO(data)); assert img.size == (int(r['width']), int(r['height'])), r['path']
        if r['kind'] == 'hub':
            payload, q = webp(img.convert('RGB'), 380*1024); dest = HUB_DIR/f"{r['id']}.webp"
            dest.write_bytes(payload); log.append((r['kind'], r['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
        elif r['kind'] == 'world':
            payload, q = webp(img.convert('RGB'), 420*1024); dest = WORLD_DIR/'world_map.webp'
            dest.write_bytes(payload); log.append((r['kind'], r['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
        elif r['kind'] == 'icons':
            for name, icon in icons(img):
                payload, q = webp(icon, 24*1024); dest = WORLD_DIR/f'icon_{name}.webp'
                dest.write_bytes(payload); log.append(('icon', name, dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
    with open(ROOT/'src/assets/world-art-import-log.csv', 'a', newline='') as f:
        w = csv.writer(f)
        if f.tell() == 0: w.writerow(['kind', 'id', 'webp', 'bytes', 'quality', 'webp_sha256', 'source_png_sha256'])
        w.writerows(log)
    print(f"{len(log)} assets, {sum(l[3] for l in log)} bytes" + (f"; skipped (absent): {', '.join(missing)}" if missing else ''))

if __name__ == '__main__': main(sys.argv[1], '--allow-missing' in sys.argv)
