#!/usr/bin/env python3
"""Import art pack I parts B–G (v2.2.0, D-122/D-124, docs/v2.2.0/art/duel-work-pack) into the duel window's art:
src/assets/duel/<name>.webp, bundled by scripts/build.mjs as ASHEN_DUEL.

Each part folder (or zip) holds manifest.csv (id,kind,expression,file,width,height,sha256) and SHA256SUMS.txt. Every
listed master is checked against both before anything is written; a mismatch or a wrong size stops the import.
  duel      2048×1024 RGBA, 4×2 poses of 512  → duel_<id>.webp     1536×768 (cells of 384), alpha, quality 84
  key       1920×1080                          → <id>.webp          1600×900, quality 82
  backdrop  1920×1080                          → <id>.webp          1600×900, quality 82
  vfx       2048×2048 RGBA, 4×4 effects of 512 → duel_vfx.webp      1024×1024 (cells of 256), alpha, quality 86
The log src/assets/duel-art-import-log.csv records master and runtime bytes and hashes (the arena row is kept).
Usage: python3 scripts/import-duel-art-v220.py <part folder or zip> [...]
"""
import csv, hashlib, io, sys, zipfile, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src/assets/duel'
LOG = ROOT / 'src/assets/duel-art-import-log.csv'
SPEC = {'duel': ((2048, 1024), (1536, 768), True, 84, lambda i: f'duel_{i}'),
        'key': ((1920, 1080), (1600, 900), False, 82, lambda i: i),
        'backdrop': ((1920, 1080), (1600, 900), False, 82, lambda i: i),
        'vfx': ((2048, 2048), (1024, 1024), True, 86, lambda i: i)}

def pack_root(arg):
    p = Path(arg)
    if p.suffix == '.zip':
        d = Path(tempfile.mkdtemp(prefix='duelart_')); zipfile.ZipFile(p).extractall(d); p = d
    hits = list(p.rglob('manifest.csv'))
    if len(hits) != 1: sys.exit(f'{arg}: expected one manifest.csv, found {len(hits)}')
    return hits[0].parent

def sums(root):
    out = {}
    for line in (root / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        if line.strip():
            h, name = line.split(None, 1); out[name.strip().lstrip('*').lstrip('./')] = h
    return out

def main(args):
    if not args: sys.exit(__doc__)
    OUT.mkdir(parents=True, exist_ok=True)
    rows_out = []
    if LOG.exists():
        rows_out = [r for r in csv.reader(open(LOG, encoding='utf-8'))][1:]
    for arg in args:
        root = pack_root(arg); listed = sums(root)
        for r in csv.DictReader(open(root / 'manifest.csv', encoding='utf-8-sig')):
            kind = r['kind']
            if kind not in SPEC: continue
            src = root / r['file']; data = src.read_bytes(); sha = hashlib.sha256(data).hexdigest()
            if sha != r['sha256'] or listed.get(r['file'], sha) != sha: sys.exit(f"{r['id']}: sha256 mismatch")
            size, target, alpha, q, name = SPEC[kind]
            im = Image.open(io.BytesIO(data))
            if im.size != size: sys.exit(f"{r['id']}: {im.size}, expected {size}")
            im = im.convert('RGBA' if alpha else 'RGB').resize(target, Image.LANCZOS)
            if alpha:  # clear the near-transparent haze so the stage does not show a faint box
                a = im.getchannel('A').point(lambda v: 0 if v < 12 else v); im.putalpha(a)
            dst = OUT / f'{name(r["id"])}.webp'
            im.save(dst, 'WEBP', quality=q, method=6, **({'exact': False} if alpha else {}))
            w = dst.read_bytes()
            rows_out = [x for x in rows_out if x[0] != name(r['id'])]
            rows_out.append([name(r['id']), r['file'], len(data), sha, dst.name, len(w), hashlib.sha256(w).hexdigest()])
            print(f"{dst.name:28s} {len(data):>9} → {len(w):>8}")
    rows_out.sort(key=lambda x: x[0])
    with open(LOG, 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['id', 'png', 'png_bytes', 'png_sha256', 'webp', 'webp_bytes', 'webp_sha256']); wr.writerows(rows_out)
    print(len(rows_out), 'entries in', LOG.relative_to(ROOT))

if __name__ == '__main__':
    main(sys.argv[1:])

# v2.2.1 (D-125): the large paintings are kept as AVIF. Convert what this import just wrote (resolution unchanged,
# each image checked by SSIM against the WebP it replaces; see scripts/convert-art-avif.py).
if __name__ == '__main__':
    import subprocess as _sp, sys as _sys, os as _os
    _sp.run([_sys.executable, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'convert-art-avif.py'), 'duel'], check=True)
