from pathlib import Path
import zipfile, hashlib, json

root = Path(__file__).resolve().parent.parent
release = root / 'releases'
source = release / 'Ashen_Crown_v0.1.2_Source.zip'
files = [p for p in root.rglob('*') if p.is_file() and
         not any(part in {'.git', 'node_modules', 'test-output', '__pycache__'} for part in p.relative_to(root).parts) and
         p.suffix != '.zip' and p.name != 'SHA256SUMS.json']
with zipfile.ZipFile(source, 'w', zipfile.ZIP_DEFLATED) as archive:
    for p in sorted(files):
        entry = zipfile.ZipInfo('ashen-crown/' + p.relative_to(root).as_posix(), (2026, 10, 14, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        archive.writestr(entry, p.read_bytes())
manifest = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in
            [release / 'Ashen_Crown_v0.1.2.html', source, release / 'Ashen_Crown_v0.1.2_Test_Report.md']}
(release / 'SHA256SUMS.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'source_files': len(files), 'zip_bytes': source.stat().st_size, 'sha256': manifest}, indent=2))
