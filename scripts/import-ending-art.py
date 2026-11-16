#!/usr/bin/env python3
"""Import ACT IV art pack G4 part A (D-113): the three ending illustrations and the epilogue background.
Reads <pack>/manifest.csv (id,kind,path,width,height,bytes,sha256), checks every PNG's SHA256 and size (1600×900), and writes
src/assets/endings/<id>.webp (1280×720, quality 86) for ending_a, ending_b, ending_c and epilogue, with a log in
src/assets/ending-art-import-log.csv. Usage: python3 scripts/import-ending-art.py <unzipped pack folder>
"""
import csv, hashlib, sys
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent
IDS = ['ending_a', 'ending_b', 'ending_c', 'epilogue']
def main():
    pack = Path(sys.argv[1]); rows = list(csv.DictReader(open(pack/'manifest.csv', encoding='utf-8')))
    out = ROOT/'src/assets/endings'; out.mkdir(parents=True, exist_ok=True); log = []
    for id_ in IDS:
        r = next((r for r in rows if r['id'] == id_), None)
        if not r: sys.exit(f'missing {id_} in manifest')
        p = pack/r['path']; data = p.read_bytes(); sha = hashlib.sha256(data).hexdigest()
        if sha != r['sha256']: sys.exit(f'{id_}: sha256 mismatch')
        im = Image.open(p)
        if im.size != (1600, 900): sys.exit(f'{id_}: {im.size}, expected 1600x900')
        dst = out/f'{id_}.webp'; im.convert('RGB').resize((1280, 720), Image.LANCZOS).save(dst, 'WEBP', quality=86, method=6)
        w = dst.read_bytes(); log.append([id_, r['path'], len(data), sha, f'{id_}.webp', len(w), hashlib.sha256(w).hexdigest()])
        print(id_, len(w))
    with open(ROOT/'src/assets/ending-art-import-log.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['id', 'png', 'png_bytes', 'png_sha256', 'webp', 'webp_bytes', 'webp_sha256']); wr.writerows(log)
if __name__ == '__main__':
    main()
