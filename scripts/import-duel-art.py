#!/usr/bin/env python3
"""Import pack H1 part E's arena (v2.0.0 「잿빛 결투장」, D-115): <pack>/manifest_scene.csv (id,file,width,height,sha256) →
src/assets/duel/arena.webp (1280×720, quality 86), the duel screen's background (build registry ASHEN_DUEL_BG).
Usage: python3 scripts/import-duel-art.py <unzipped part E folder>
"""
import csv, hashlib, sys
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent
def main():
    pack = Path(sys.argv[1]); rows = list(csv.DictReader(open(pack/'manifest_scene.csv', encoding='utf-8-sig')))
    r = next((r for r in rows if r['id'] == 'arena'), None)
    if not r: sys.exit('missing arena in manifest_scene.csv')
    p = pack/r['file']; data = p.read_bytes(); sha = hashlib.sha256(data).hexdigest()
    if sha != r['sha256']: sys.exit('arena: sha256 mismatch')
    im = Image.open(p)
    if im.size != (1600, 900): sys.exit(f'arena: {im.size}, expected 1600x900')
    out = ROOT/'src/assets/duel'; out.mkdir(parents=True, exist_ok=True); dst = out/'arena.webp'
    im.convert('RGB').resize((1280, 720), Image.LANCZOS).save(dst, 'WEBP', quality=86, method=6)
    w = dst.read_bytes(); print('arena', len(w))
    with open(ROOT/'src/assets/duel-art-import-log.csv', 'w', newline='', encoding='utf-8') as f:
        wr = csv.writer(f); wr.writerow(['id', 'png', 'png_bytes', 'png_sha256', 'webp', 'webp_bytes', 'webp_sha256']); wr.writerow(['arena', r['file'], len(data), sha, 'arena.webp', len(w), hashlib.sha256(w).hexdigest()])
if __name__ == '__main__':
    main()
