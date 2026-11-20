#!/usr/bin/env python3
"""v2.2.1 (D-125): re-encode the large painted art from WebP to AVIF so the standalone HTML stays far under GitHub's
100 MB file limit until the game is finished.

Folders and starting quality (measured on the v2.2.0 art: AVIF at these settings is 57–84% of the WebP bytes):
  portraits 60, duel 60, sprites 60 (SSIM floor 0.975) · rooms 65, hubs 65, world 65 (floor 0.97)
Each image is compared with the WebP it replaces (SSIM on alpha-weighted luminance). Below the floor the quality rises
by 5 up to 80; an image still below the floor stays WebP. Resolution never changes (busts are drawn up to 500 px tall).
Icons, chests and props stay WebP (small images gain nothing). The class sheets (sprite_class_*) stay WebP too: their
pure-magenta sash is recoloured to the side's colour by threshold, and AVIF's softer colour edges left 31% more pink
fringe pixels outside the threshold (14,247 → 18,679 over the 24 sheets).

The original import logs keep recording the import as it was. src/assets/avif-conversion-log.csv records every
conversion: folder, the WebP name and SHA256 it replaced, the AVIF name, quality, bytes, SHA256 and the SSIM.
Usage: python3 scripts/convert-art-avif.py [folder ...]   (default: all six folders; already converted files are kept)
"""
import csv, hashlib, io, os, sys
from concurrent.futures import ProcessPoolExecutor
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'src', 'assets')
LOG = os.path.join(ASSETS, 'avif-conversion-log.csv')
PLAN = {'portraits': (60, 0.975), 'duel': (60, 0.975), 'sprites': (60, 0.975),
        'rooms': (65, 0.97), 'hubs': (65, 0.97), 'world': (65, 0.97)}
KEEP_WEBP = lambda name: name.startswith('sprite_class_') or name == 'sprite_wolf.webp'  # magenta-marked side-colour sheets (v2.3.1: the wolf's collar)
FIELDS = ['folder', 'webp', 'webp_sha256', 'avif', 'quality', 'avif_bytes', 'avif_sha256', 'ssim']

def lum(im):
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    rgb = a[..., :3] * (a[..., 3:4] / 255.0)
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]

def convert(job):
    folder, name = job
    src = os.path.join(ASSETS, folder, name)
    data = open(src, 'rb').read()
    im = Image.open(io.BytesIO(data)); im.load()
    if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
    q, floor = PLAN[folder]; ref = lum(im)
    while q <= 80:
        buf = io.BytesIO(); im.save(buf, 'AVIF', quality=q, speed=6)
        out = buf.getvalue(); back = Image.open(io.BytesIO(out)); back.load()
        score = float(ssim(ref, lum(back), data_range=255))
        if score >= floor:
            return {'folder': folder, 'webp': name, 'webp_sha256': hashlib.sha256(data).hexdigest(), 'avif': name[:-5] + '.avif',
                    'quality': q, 'avif_bytes': len(out), 'avif_sha256': hashlib.sha256(out).hexdigest(), 'ssim': f'{score:.4f}', '_data': out}
        q += 5
    return {'folder': folder, 'webp': name, 'kept': True}

def main(folders):
    rows = list(csv.DictReader(open(LOG, encoding='utf-8'))) if os.path.exists(LOG) else []
    jobs = [(f, n) for f in folders for n in sorted(os.listdir(os.path.join(ASSETS, f))) if n.endswith('.webp') and not KEEP_WEBP(n)]
    kept = []
    with ProcessPoolExecutor(max_workers=os.cpu_count() or 2) as pool:
        for r in pool.map(convert, jobs, chunksize=2):
            if r.get('kept'): kept.append(f"{r['folder']}/{r['webp']}"); continue
            open(os.path.join(ASSETS, r['folder'], r['avif']), 'wb').write(r.pop('_data'))
            os.remove(os.path.join(ASSETS, r['folder'], r['webp']))
            rows = [x for x in rows if not (x['folder'] == r['folder'] and x['webp'] == r['webp'])] + [r]
            print(f"{r['folder']}/{r['avif']:40s} q{r['quality']} ssim {r['ssim']} {r['avif_bytes']:>8}", flush=True)
    rows.sort(key=lambda x: (x['folder'], x['webp']))
    with open(LOG, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(rows)
    print(f'{len(rows)} conversions logged; kept as WebP: {kept or "none"}')

if __name__ == '__main__':
    main(sys.argv[1:] or list(PLAN))
