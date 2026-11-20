#!/usr/bin/env python3
"""Import art pack J (v2.3.1, D-131/D-132; docs/v2.3.1/art/j-work-pack) into the game's art.

Part A  bust_gunnar_{neutral,concerned,determined}.png 1024x1280 -> src/assets/portraits/bust_gunnar_<e>.webp (720x880)
Part B  hub_frost.jpg, hub_saltport.jpg 1536x1024            -> src/assets/hubs/hub_<id>.webp (same size)
Part C  sprite_wolf.png 1024x768 (4x3 cells of 256)          -> src/assets/sprites/sprite_wolf.webp (512x384)
        bust_wolf_neutral.png 1024x1280                      -> src/assets/portraits/bust_wolf_neutral.webp
Each part's master is checked against manifest.csv and SHA256SUMS.txt and its size before anything is written.
Gunnar's busts came with a magenta band on the cloak (the work order did not ask for one; busts are never re-tinted in
the game), so the band is painted in the legion's blue (#3a78d8, the ally side colour) keeping its folds: magenta
pixels take that hue with their own value. The wolf sheet keeps its magenta collar: the game tints it by side, so it
stays WebP like the class sheets. Busts and sheets are logged in src/assets/art-import-log.csv, hubs in
src/assets/room-art-import-log.csv; then scripts/convert-art-avif.py turns busts and hubs into AVIF.
Usage: python3 scripts/import-art-pack-j.py <part zip or folder> [...]
"""
import csv, colorsys, hashlib, importlib.util, io, subprocess, sys, tempfile, zipfile
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('import_art', ROOT / 'scripts/import-art.py'); ia = importlib.util.module_from_spec(spec)
sys.argv, _argv = [sys.argv[0]], sys.argv; spec.loader.exec_module(ia); sys.argv = _argv
SIZES = {'bust': (1024, 1280), 'sprite': (1024, 768), 'hub': (1536, 1024)}
LEGION_BLUE = (0x3a, 0x78, 0xd8)
# The wolf came at a natural size (shoulder about 0.4 of a soldier's height); on the battle map that read as a small grey
# blot, so the sheet is scaled 1.25× around the foot anchor like the v0.6 pack B sheets (scripts/import-art.py SHEET_SCALE).
WOLF_SCALE = 1.25

def pack_root(arg):
    p = Path(arg)
    if p.suffix == '.zip':
        d = Path(tempfile.mkdtemp(prefix='packj_')); zipfile.ZipFile(p).extractall(d); p = d
    hits = list(p.rglob('manifest.csv'))
    if len(hits) != 1: sys.exit(f'{arg}: expected one manifest.csv, found {len(hits)}')
    return hits[0].parent

def sums(root):
    out = {}
    for line in (root / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        if line.strip(): h, name = line.split(None, 1); out[name.strip().lstrip('*').lstrip('./')] = h
    return out

def legion_band(img):
    """Repaint the magenta band in the legion's blue: hue and saturation of #3a78d8, each pixel's own brightness."""
    a = np.asarray(img.convert('RGBA')).astype(np.float32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    band = (r > 120) & (b > 120) & (g < 0.62 * np.minimum(r, b)) & (a[..., 3] > 0)
    h, s, _ = colorsys.rgb_to_hsv(*(c / 255 for c in LEGION_BLUE)); v = np.maximum(r, b)[band] / 255
    rgb = np.array([colorsys.hsv_to_rgb(h, s * 0.85, min(1, x * 0.8)) for x in v]) * 255 if band.any() else np.zeros((0, 3))
    a[..., :3][band] = rgb
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), 'RGBA'), int(band.sum())

def main(args):
    art_log, hub_log = [], []
    for arg in args:
        root = pack_root(arg); recorded = sums(root)
        for row in csv.DictReader(open(root / 'manifest.csv', encoding='utf-8-sig')):
            data = (root / row['file']).read_bytes(); h = hashlib.sha256(data).hexdigest()
            if h != row['sha256'] or recorded.get(row['file']) != h: sys.exit(f"{row['file']}: SHA256 differs from manifest/SHA256SUMS")
            img = Image.open(io.BytesIO(data)); img.load()
            if img.size != SIZES[row['kind']]: sys.exit(f"{row['file']}: {img.size}, expected {SIZES[row['kind']]}")
            if row['kind'] == 'bust':
                if row['id'] == 'gunnar': img, n = legion_band(img); print(f"  {row['file']}: {n} band pixels in the legion's blue")
                payload, q = ia.webp(ia.bust(img), 96 * 1024); dest = ia.BUST_DIR / f"bust_{row['id']}_{row['expression']}.webp"
                art_log.append(('bust', row['id'], row['expression'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), h))
            elif row['kind'] == 'sprite':
                payload, q = ia.webp(ia.sheet(img, WOLF_SCALE if row['id'] == 'wolf' else 1), 60 * 1024); dest = ia.SPRITE_DIR / f"sprite_{row['id']}.webp"
                art_log.append(('sprite', row['id'], '', dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), h))
            else:
                out = io.BytesIO(); img.convert('RGB').save(out, 'WEBP', quality=76, method=6); payload, q = out.getvalue(), 76
                dest = ROOT / 'src/assets/hubs' / f"{row['id']}.webp"; hub_log.append(('hub', row['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), h))
            dest.write_bytes(payload); print(f"  {dest.relative_to(ROOT)}: {len(payload)} bytes (q{q})")
    for path, rows in ((ROOT / 'src/assets/art-import-log.csv', art_log), (ROOT / 'src/assets/room-art-import-log.csv', hub_log)):
        if rows:
            with open(path, 'a', newline='') as f: csv.writer(f).writerows(rows)
    print(f'{len(art_log)} busts/sheets, {len(hub_log)} hubs imported')
    subprocess.run([sys.executable, str(ROOT / 'scripts/convert-art-avif.py'), 'portraits', 'hubs', 'sprites'], check=True)

if __name__ == '__main__': main(sys.argv[1:])
