#!/usr/bin/env python3
"""Import a user-supplied art pack (PNG masters + manifest.csv) into runtime WebP assets.

Busts   1024x1280 -> 704x880 artwork + 8px transparent side padding = 720x880 (same as pack r2).
Sprites 1024x768 (4x3 grid of 256 cells, anchor 128,240) -> 512x384, every cell halved on its own
        (anchor 64,120); alpha <= 4 fringe in the bottom 8px of each cell is cleared.
SHA256 of every PNG is checked against manifest.csv first. No network access.
Usage: python3 scripts/import-art.py <pack-root>
"""
import csv, hashlib, io, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BUST_DIR, SPRITE_DIR = ROOT/'src/assets/portraits', ROOT/'src/assets/sprites'

def webp(img, budget, qualities=(86, 82, 78, 74, 70, 66, 62, 58)):
    for q in qualities:
        out = io.BytesIO(); img.save(out, 'WEBP', quality=q, method=6, alpha_quality=90, exact=False)
        if out.tell() <= budget: return out.getvalue(), q
    return out.getvalue(), q

def bust(png):
    art = png.convert('RGBA').resize((704, 880), Image.LANCZOS)
    canvas = Image.new('RGBA', (720, 880), (0, 0, 0, 0)); canvas.paste(art, (8, 0)); return canvas

def sheet(png):
    png = png.convert('RGBA'); out = Image.new('RGBA', (512, 384), (0, 0, 0, 0))
    for r in range(3):
        for c in range(4):
            cell = png.crop((c*256, r*256, c*256+256, r*256+256)).resize((128, 128), Image.LANCZOS)
            px = cell.load()
            for y in range(120, 128):
                for x in range(128):
                    if px[x, y][3] <= 4: px[x, y] = (0, 0, 0, 0)
            out.paste(cell, (c*128, r*128))
    return out

def main(pack):
    pack = Path(pack); rows = list(csv.DictReader(open(pack/'manifest.csv')))
    BUST_DIR.mkdir(parents=True, exist_ok=True); SPRITE_DIR.mkdir(parents=True, exist_ok=True); log = []
    for r in rows:
        data = (pack/r['file']).read_bytes()
        if hashlib.sha256(data).hexdigest() != r['sha256']: raise SystemExit(f"SHA256 mismatch: {r['file']}")
        img = Image.open(io.BytesIO(data))
        if r['kind'] == 'bust':
            payload, q = webp(bust(img), 96*1024); dest = BUST_DIR/f"bust_{r['id']}_{r['expression']}.webp"
        else:
            payload, q = webp(sheet(img), 60*1024); dest = SPRITE_DIR/f"sprite_{r['id']}.webp"
        dest.write_bytes(payload); log.append((r['kind'], r['id'], r['expression'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), r['sha256']))
    with open(ROOT/'src/assets/art-import-log.csv', 'a', newline='') as f:
        w = csv.writer(f)
        if f.tell() == 0: w.writerow(['kind', 'id', 'expression', 'webp', 'bytes', 'quality', 'webp_sha256', 'source_png_sha256'])
        w.writerows(log)
    print(f"{len(log)} assets: {sum(l[4] for l in log)} bytes ({sum(1 for l in log if l[0]=='bust')} busts, {sum(1 for l in log if l[0]!='bust')} sheets)")

if __name__ == '__main__': main(sys.argv[1])
