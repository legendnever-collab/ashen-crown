from pathlib import Path
import tempfile, zipfile, hashlib, subprocess, json
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
release=root/'releases'
for line in (release/f'Ashen_Crown_v{version}_SHA256SUMS').read_text().splitlines():
    digest,name=line.split('  ',1)
    assert hashlib.sha256((release/name).read_bytes()).hexdigest()==digest,name
with tempfile.TemporaryDirectory() as tmp:
    with zipfile.ZipFile(release/f'Ashen_Crown_v{version}_Source.zip') as archive:
        archive.extractall(tmp)
    source=Path(tmp)/'ashen-crown'
    subprocess.run(['node','scripts/build.mjs'],cwd=source,check=True)
    assert (source/'releases'/f'Ashen_Crown_v{version}.html').read_bytes()==(release/f'Ashen_Crown_v{version}.html').read_bytes()
    tested=subprocess.run(['npm','test'],cwd=source,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
    if tested.returncode:
        print(tested.stdout)
        tested.check_returncode()
print('SHA256, clean Source ZIP byte-identical HTML rebuild and unit tests: PASS')
