// v2.2.1 (D-125): the migration suites play real earlier builds (releases/Ashen_Crown_v<x>.html) to make their saves.
// Once those builds are archived as GitHub Releases and leave the tree, this fetches the ones a run needs:
//   node scripts/fetch-releases.mjs <suite ...>   versions named in those suites' test files (package.json "test:<suite>")
//   node scripts/fetch-releases.mjs --all          every version in releases/ARCHIVE.json
// A file already here with the recorded SHA256 is kept; otherwise it is downloaded through the REST API (gh api, so it
// works with GH_TOKEN in CI) and must match the SHA256 in releases/ARCHIVE.json.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const repo=process.env.GITHUB_REPOSITORY||'legendnever-collab/ashen-crown';
const {versions}=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8')),byVersion=new Map(versions.map(v=>[v.version,v]));
const scripts=JSON.parse(fs.readFileSync('package.json','utf8')).scripts,args=process.argv.slice(2);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
// Versions a test file names: literal releases/Ashen_Crown_v<x>.html, and the quoted versions of a file that builds
// that path from a template (mobile-dock walks '0.1.0'…'0.1.3', post-move-attack uses '0.1.2'/'0.3.2').
export function versionsIn(text){const out=new Set();for(const m of text.matchAll(/Ashen_Crown_v(\d+\.\d+\.\d+)\.html/g))out.add(m[1]);
 if(/Ashen_Crown_v\$\{/.test(text))for(const m of text.matchAll(/'(\d+\.\d+\.\d+)'/g))out.add(m[1]);return [...out].filter(v=>byVersion.has(v));}
function wanted(){
 if(args.includes('--all'))return versions.map(v=>v.version);
 const out=new Set();for(const suite of args){const cmd=scripts[`test:${suite}`];if(!cmd)throw Error(`no npm script test:${suite}`);
  for(const f of cmd.match(/tests\/[\w.-]+\.m?js/g)||[])for(const v of versionsIn(fs.readFileSync(f,'utf8')))out.add(v);}
 return [...out];
}
let fetched=0,kept=0;
for(const v of wanted()){
 const name=`Ashen_Crown_v${v}.html`,meta=byVersion.get(v).files[name],path=`releases/${name}`;
 if(fs.existsSync(path)&&sha(fs.readFileSync(path))===meta.sha256){kept++;continue;}
 const asset=JSON.parse(execFileSync('gh',['api',`repos/${repo}/releases/tags/v${v}`],{encoding:'utf8'})).assets.find(a=>a.name===name);
 if(!asset)throw Error(`v${v}: the release has no ${name} — run the "Archive old builds" workflow first`);
 const bytes=execFileSync('gh',['api','-H','Accept: application/octet-stream',`repos/${repo}/releases/assets/${asset.id}`],{maxBuffer:256*1048576});
 if(sha(bytes)!==meta.sha256)throw Error(`${name}: downloaded SHA256 differs from releases/ARCHIVE.json`);
 fs.writeFileSync(path,bytes);fetched++;console.log(`fetched ${name} (${bytes.length} bytes)`);
}
console.log(`earlier builds: ${kept} already here, ${fetched} fetched`);
