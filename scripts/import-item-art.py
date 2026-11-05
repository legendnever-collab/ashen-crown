#!/usr/bin/env python3
"""Import art work pack E (D-073 Q9, docs/v0.8.0/art/item-work-pack) into runtime item icons.

Pack layout (00_START_HERE.md section 6): png/icons_A.png … icons_G.png (1024x1024, 4x4 cells of 256),
manifest.csv (sheet,file,width,height,background,bytes,sha256) and SHA256SUMS.txt. The cell → id table is the work
pack's own cells.csv (sheet,cell,id,…; cells numbered 1–16 row by row), so the import never guesses.
  - Every file listed in SHA256SUMS.txt is checked first; a mismatch stops the import.
  - Background: transparent sheets keep their alpha (alpha below 20 cleared); #00FF00 sheets are keyed (green screen
    with a despill on the fringe).
  - Each cell becomes src/assets/items/<id>.webp at 128x128 (icons are drawn at 20–56 px, twice that on phones).
  - QA per cell: empty cells, icons touching the cell edge (outside the 80 % safe square) and stray green are reported
    in src/assets/item-art-import-log.csv; --strict makes any warning fatal.
--cells CSV takes another work pack's cell table (ACT III F1: docs/v0.9.0/art/act3-f1-work-pack/cells.csv); the icons it
names are added to or replaced in the import log, the other rows are kept, and the pack's QA report is not copied over
pack E's. A pack with manifest_icons.csv (F1_2) uses it for the sheet rows.
No network access. Usage: python3 scripts/import-item-art.py <pack root or .zip> [--out DIR] [--strict] [--cells CSV]
"""
import csv, hashlib, io, sys, tempfile, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CELLS = ROOT/'docs/v0.8.0/art/item-work-pack/cells.csv'

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def webp(img, budget=9000, qualities=(86, 82, 78, 74, 70, 66)):
    for q in qualities:
        out = io.BytesIO(); img.save(out, 'WEBP', quality=q, method=6, alpha_quality=90)
        if out.tell() <= budget: return out.getvalue(), q
    return out.getvalue(), q

def key_green(cell):
    """#00FF00 green screen → alpha; soften the fringe and pull green spill out of edge pixels."""
    px = cell.load(); w, h = cell.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lead = g - max(r, b)
            if g > 150 and lead > 90: px[x, y] = (r, g, b, 0)
            elif lead > 40: px[x, y] = (r, max(r, b), b, int(a * max(0.0, 1 - (lead - 40) / 60)))
    return cell

def find_pack(arg):
    p = Path(arg)
    if p.suffix == '.zip':
        tmp = Path(tempfile.mkdtemp(prefix='item-pack-')); zipfile.ZipFile(p).extractall(tmp); p = tmp
    hits = list(p.rglob('SHA256SUMS.txt'))
    if not hits: sys.exit('SHA256SUMS.txt not found in the pack')
    return hits[0].parent

def main(argv):
    if not argv: sys.exit(__doc__)
    strict = '--strict' in argv; out = ROOT/'src/assets/items'
    if '--out' in argv: out = Path(argv[argv.index('--out') + 1])
    cells_csv = Path(argv[argv.index('--cells') + 1]) if '--cells' in argv else CELLS
    pack = find_pack(argv[0]); out.mkdir(parents=True, exist_ok=True)
    for line in (pack/'SHA256SUMS.txt').read_text().splitlines():
        if not line.strip(): continue
        digest, name = line.split(None, 1); name = name.strip().lstrip('*')
        f = pack/name
        if not f.exists(): f = pack/Path(name).name
        if not f.exists(): sys.exit(f'missing {name}')
        if sha(f) != digest: sys.exit(f'SHA256 mismatch: {name}')
    mf = pack/'manifest_icons.csv' if (pack/'manifest_icons.csv').exists() else pack/'manifest.csv'
    manifest = {r['sheet']: r for r in csv.DictReader(open(mf)) if 'sheet' in r} if mf.exists() else {}
    cells = list(csv.DictReader(open(cells_csv))); log, warnings = [], 0
    for sheet in sorted({c['sheet'] for c in cells}):
        src = next(iter(pack.rglob(f'icons_{sheet}.png')), None)
        if not src: sys.exit(f'icons_{sheet}.png not in the pack')
        img = Image.open(src).convert('RGBA')
        if img.size != (1024, 1024): img = img.resize((1024, 1024), Image.LANCZOS)
        green = (manifest.get(sheet, {}).get('background', '') or '').upper().startswith('00FF00') or img.getpixel((2, 2))[1] > 200 and img.getpixel((2, 2))[3] == 255
        for c in (c for c in cells if c['sheet'] == sheet):
            n = int(c['cell']) - 1; x, y = (n % 4) * 256, (n // 4) * 256
            cell = img.crop((x, y, x + 256, y + 256))
            cell = key_green(cell) if green else cell
            a = cell.split()[3].point(lambda v: 0 if v < 20 else v); cell.putalpha(a)
            box = cell.getbbox(); cover = 1 - a.histogram()[0] / (256 * 256)
            notes = []
            if not box or cover < 0.03: notes.append('empty cell')
            elif box[0] < 12 or box[1] < 12 or box[2] > 244 or box[3] > 244: notes.append('touches the cell edge')
            small = cell.resize((64, 64)).tobytes()
            if green and any(small[i+1] > 180 and small[i+1] - max(small[i], small[i+2]) > 80 and small[i+3] > 0 for i in range(0, len(small), 4)): notes.append('green fringe')
            data, q = webp(cell.resize((128, 128), Image.LANCZOS))
            (out/f"{c['id']}.webp").write_bytes(data); warnings += bool(notes)
            log.append({'id': c['id'], 'sheet': sheet, 'cell': c['cell'], 'source': src.name, 'source_sha256': sha(src), 'background': 'green' if green else 'alpha', 'coverage': f'{cover:.2f}', 'quality': q, 'bytes': len(data), 'webp_sha256': hashlib.sha256(data).hexdigest(), 'qa': '; '.join(notes) or 'ok'})
    log_path = ROOT/'src/assets/item-art-import-log.csv' if out == ROOT/'src/assets/items' else out/'item-art-import-log.csv'
    if cells_csv != CELLS and log_path.exists():
        new = {r['id'] for r in log}; log = [r for r in csv.DictReader(open(log_path)) if r['id'] not in new] + log
    with open(log_path, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(log[0])); w.writeheader(); w.writerows(log)
    if cells_csv == CELLS and (pack/'QA_REPORT.md').exists(): (out.parent if out == ROOT/'src/assets/items' else out).joinpath('item-art-pack-qa.md').write_text((pack/'QA_REPORT.md').read_text())
    print(f'{len(log)} icons → {out} · {warnings} with QA notes')
    if strict and warnings: sys.exit(1)

if __name__ == '__main__': main(sys.argv[1:])
