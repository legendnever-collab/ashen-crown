#!/usr/bin/env python3
"""Import art pack L (v2.5.1, D-141/D-145; docs/v2.5.1/art/l-work-pack) into the game's art.

Part A  bust_luka_{neutral,concerned,determined}.png 1024x1280  -> src/assets/portraits/bust_luka_<e>.webp (720x880)
Part B  hub_beacon.jpg, hub_lionspring.jpg 1536x1024             -> src/assets/hubs/hub_<id>.webp (same size)
Each part's master is checked against manifest.csv and SHA256SUMS.txt and its size before anything is written. The
busts carry no faction magenta (checked here, as the pack's QA states). Busts are logged in src/assets/art-import-log.csv,
hubs in src/assets/room-art-import-log.csv; then scripts/convert-art-avif.py turns both into AVIF.
Usage: python3 scripts/import-art-pack-l.py <part zip or folder> [...]
"""
import csv, colorsys, hashlib, importlib.util, io, subprocess, sys, tempfile, zipfile
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('import_art', ROOT / 'scripts/import-art.py'); ia = importlib.util.module_from_spec(spec)
sys.argv, _argv = [sys.argv[0]], sys.argv; spec.loader.exec_module(ia); sys.argv = _argv
SIZES = {'bust': (1024, 1280), 'hub': (1536, 1024)}

def pack_root(arg):
    p = Path(arg)
    if p.suffix == '.zip':
        d = Path(tempfile.mkdtemp(prefix='packl_')); zipfile.ZipFile(p).extractall(d); p = d
    hits = list(p.rglob('manifest.csv'))
    if len(hits) != 1: sys.exit(f'{arg}: expected one manifest.csv, found {len(hits)}')
    return hits[0].parent

def sums(root):
    out = {}
    for line in (root / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        if line.strip(): h, name = line.split(None, 1); out[name.strip().lstrip('*').lstrip('./')] = h
    return out

def magenta(img):
    """Pixels in the faction magenta range (they would show as an unasked side colour; busts are never tinted)."""
    a = np.asarray(img.convert('RGBA')).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return int(((r > 120) & (b > 120) & (g < 0.62 * np.minimum(r, b)) & (a[..., 3] > 0)).sum())

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
                n = magenta(img); print(f"  {row['file']}: {n} pixels in the magenta range")
                if n > 2000: sys.exit(f"{row['file']}: a magenta area ({n} pixels) — not expected on a bust")  # a band would be tens of thousands; stray warm highlights are a few dozen
                payload, q = ia.webp(ia.bust(img), 96 * 1024); dest = ia.BUST_DIR / f"bust_{row['id']}_{row['expression']}.webp"
                art_log.append(('bust', row['id'], row['expression'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), h))
            else:
                out = io.BytesIO(); img.convert('RGB').save(out, 'WEBP', quality=76, method=6); payload, q = out.getvalue(), 76
                dest = ROOT / 'src/assets/hubs' / f"{row['id']}.webp"; hub_log.append(('hub', row['id'], dest.name, len(payload), q, hashlib.sha256(payload).hexdigest(), h))
            dest.write_bytes(payload); print(f"  {dest.relative_to(ROOT)}: {len(payload)} bytes (q{q})")
    for path, rows in ((ROOT / 'src/assets/art-import-log.csv', art_log), (ROOT / 'src/assets/room-art-import-log.csv', hub_log)):
        if rows:
            with open(path, 'a', newline='') as f: csv.writer(f).writerows(rows)
    print(f'{len(art_log)} busts, {len(hub_log)} hubs imported')
    subprocess.run([sys.executable, str(ROOT / 'scripts/convert-art-avif.py'), 'portraits', 'hubs'], check=True)

if __name__ == '__main__': main(sys.argv[1:])
