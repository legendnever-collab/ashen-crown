"""Extend the embedded AshenUI font with every Korean syllable authored in src/.

AshenUI.woff is a subset of Noto Sans CJK KR Regular, Version 2.004 (SIL OFL 1.1).
This script keeps every code point already in AshenUI.woff, adds the Hangul
syllables used in src/**/*.js|css, re-subsets from the same source font and
rewrites src/assets/font-glyphs.json. Run only when authored text changes:

    python scripts/font-subset.py [path/to/NotoSansCJK-Regular.ttc]
"""
from pathlib import Path
import json, re, sys
from fontTools import subset
from fontTools.ttLib import TTFont, TTCollection

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1] if len(sys.argv) > 1 else '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
target = root / 'src/assets/AshenUI.woff'
manifest = root / 'src/assets/font-glyphs.json'
fallback = json.loads((root / 'src/assets/fallback-glyphs.json').read_text())

current = TTFont(target)
version = current['name'].getDebugName(5)
font = next(f for f in TTCollection(source).fonts if f['name'].getDebugName(4) == 'Noto Sans CJK KR')
if font['name'].getDebugName(5) != version:
    raise SystemExit(f'Source version {font["name"].getDebugName(5)!r} differs from embedded {version!r}')

authored = set()
for p in (root / 'src').rglob('*'):
    if p.suffix in {'.js', '.css'}:
        authored.update(ord(c) for c in p.read_text(encoding='utf-8') if '가' <= c <= '힣')
codepoints = set(current.getBestCmap()) | authored
missing = sorted(c for c in authored if c not in font.getBestCmap())
if missing:
    raise SystemExit('Source font lacks: ' + ''.join(map(chr, missing)))

options = subset.Options()
options.flavor = 'woff'
options.layout_features = ['kern', 'liga', 'locl', 'vert', 'vkrn', 'palt', 'ccmp']
options.name_IDs = [0, 1, 2, 3, 4, 5, 6]
options.notdef_outline = True
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=sorted(codepoints))
subsetter.subset(font)
font.flavor = 'woff'
font.save(target)

glyphs = sorted(set(TTFont(target).getBestCmap()) | set(fallback))
manifest.write_text(json.dumps(glyphs, separators=(',', ':')) + '\n')
added = sorted(authored - set(current.getBestCmap()) - set(fallback))
print(json.dumps({'codepoints': len(glyphs), 'added': ''.join(map(chr, added)), 'bytes': target.stat().st_size}, ensure_ascii=False))
