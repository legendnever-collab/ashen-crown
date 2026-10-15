from pathlib import Path
import tempfile, zipfile, hashlib, subprocess, json
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
release=root/'releases'
manifest={}
for line in (release/f'Ashen_Crown_v{version}_SHA256SUMS').read_text().splitlines():
    digest,name=line.split('  ',1)
    assert name not in manifest, f'Duplicate checksum: {name}'
    manifest[name]=digest
    assert hashlib.sha256((release/name).read_bytes()).hexdigest()==digest,name
assert set(manifest)=={f'Ashen_Crown_v{version}{suffix}' for suffix in ('.html','_Source.zip','_Test_Report.md')}
assert json.loads((release/'SHA256SUMS.json').read_text())==manifest
with tempfile.TemporaryDirectory() as tmp:
    with zipfile.ZipFile(release/f'Ashen_Crown_v{version}_Source.zip') as archive:
        # Validate all packaged source/docs/evidence, not only rebuilt HTML.
        expected={p.relative_to(root).as_posix():p for p in root.rglob('*') if p.is_file() and not any(part in {'.git','node_modules','test-output','__pycache__'} for part in p.relative_to(root).parts) and p.suffix!='.zip' and 'SHA256SUMS' not in p.name}
        assert set(archive.namelist())=={'ashen-crown/'+name for name in expected}, 'ZIP/current file coverage differs'
        for name,p in expected.items():
            assert archive.read('ashen-crown/'+name)==p.read_bytes(), f'ZIP/current mismatch: {name}'
        archive.extractall(tmp)
    source=Path(tmp)/'ashen-crown'
    subprocess.run(['node','scripts/build.mjs'],cwd=source,check=True)
    assert (source/'releases'/f'Ashen_Crown_v{version}.html').read_bytes()==(release/f'Ashen_Crown_v{version}.html').read_bytes()
    tested=subprocess.run(['npm','test'],cwd=source,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
    if tested.returncode:
        print(tested.stdout)
        tested.check_returncode()
print('SHA256/text+JSON manifests, exact ZIP/current source/docs/evidence, clean byte-identical HTML rebuild and unit tests: PASS')
