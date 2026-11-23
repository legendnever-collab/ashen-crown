#!/usr/bin/env python3
"""Import art pack M (v2.7.0 work order, D-158/D-159; docs/v2.7.0/art/m-work-pack) into the game's art.

Part A  prop_request_board.png 512x512 RGBA -> src/assets/props/requestBoard.webp (256x256, alpha; the hub draws it 96 px)
The master is checked against manifest.csv and SHA256SUMS.txt, its size and real transparency (corners clear) before
anything is written; the prop is logged in src/assets/room-art-import-log.csv like the other props (WebP — props stay WebP).
Usage: python3 scripts/import-art-pack-m.py <part zip or folder>
"""
import csv, hashlib, io, sys, tempfile, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = 256

def pack_root(arg):
    p = Path(arg)
    if p.suffix == '.zip':
        d = Path(tempfile.mkdtemp(prefix='packm_')); zipfile.ZipFile(p).extractall(d); p = d
    hits = list(p.rglob('manifest.csv'))
    if len(hits) != 1: sys.exit(f'{arg}: expected one manifest.csv, found {len(hits)}')
    return hits[0].parent

def sums(root):
    out = {}
    for line in (root / 'SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
        if line.strip(): h, name = line.split(None, 1); out[name.strip().lstrip('*').lstrip('./')] = h
    return out

def main(args):
    log = []
    for arg in args:
        root = pack_root(arg); recorded = sums(root)
        for row in csv.DictReader(open(root / 'manifest.csv', encoding='utf-8-sig')):
            if row['kind'] != 'prop': sys.exit(f"{row['file']}: unexpected kind {row['kind']}")
            data = (root / row['file']).read_bytes(); h = hashlib.sha256(data).hexdigest()
            if h != row['sha256'] or recorded.get(row['file']) != h: sys.exit(f"{row['file']}: SHA256 differs from manifest/SHA256SUMS")
            img = Image.open(io.BytesIO(data)); img.load()
            if img.size != (512, 512) or img.mode != 'RGBA': sys.exit(f"{row['file']}: {img.size} {img.mode}, expected 512x512 RGBA")
            a = img.getchannel('A')
            if any(a.getpixel(p) for p in ((0, 0), (511, 0), (0, 511), (511, 511))): sys.exit(f"{row['file']}: the corners are not transparent")
            bbox = a.point(lambda v: 255 if v > 16 else 0).getbbox(); print(f"  {row['file']}: drawn area {bbox}")
            small = img.resize((OUT, OUT), Image.LANCZOS); out = io.BytesIO(); small.save(out, 'WEBP', quality=86, method=6, exact=True)
            payload = out.getvalue(); dest = ROOT / 'src/assets/props' / f"{row['id']}.webp"; dest.write_bytes(payload)
            log.append(('prop', row['id'], dest.name, len(payload), 86, hashlib.sha256(payload).hexdigest(), h)); print(f"  {dest.relative_to(ROOT)}: {len(payload)} bytes (q86, {OUT}x{OUT})")
    with open(ROOT / 'src/assets/room-art-import-log.csv', 'a', newline='') as f: csv.writer(f).writerows(log)

if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1:])
