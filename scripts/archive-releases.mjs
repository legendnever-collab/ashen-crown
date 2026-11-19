// v2.2.1 (D-125): archive the earlier builds as GitHub Releases so they can leave the repository tree.
// Run by the user from GitHub (Actions → "Archive old builds" → Run workflow); a Claude session may not create releases.
// For every version in releases/ARCHIVE.json: check each file against its recorded SHA256, then create the release
// (tag v<version> at the commit that packaged that HTML) or upload the assets it is missing. Existing assets are kept.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const repo=process.env.GITHUB_REPOSITORY||'legendnever-collab/ashen-crown';
const gh=(...a)=>execFileSync('gh',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const {versions}=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8'));
const only=new Set(process.argv.slice(2));let made=0,uploaded=0;
for(const v of versions){
 if(only.size&&!only.has(v.version))continue;
 const paths=Object.entries(v.files).map(([name,meta])=>{const p=`releases/${name}`,b=fs.readFileSync(p);
  if(crypto.createHash('sha256').update(b).digest('hex')!==meta.sha256)throw Error(`${name}: SHA256 differs from ARCHIVE.json`);return p;});
 let have=null;try{have=JSON.parse(gh('api',`repos/${repo}/releases/tags/${v.tag}`)).assets.map(a=>a.name);}catch{have=null;}
 if(have===null){
  gh('release','create',v.tag,...paths,'--repo',repo,'--target',v.commit,'--title',`Ashen Crown ${v.tag}`,
   '--notes',`Archived build of Ashen Crown ${v.tag} (D-125): moved out of the repository tree to keep it small. The standalone HTML runs offline in a browser. SHA256 per file in releases/ARCHIVE.json.`);
  made++;console.log(`${v.tag}: release created with ${paths.length} files`);
 }else{
  const missing=paths.filter(p=>!have.includes(p.split('/').pop()));
  if(missing.length){gh('release','upload',v.tag,...missing,'--repo',repo);uploaded+=missing.length;}
  console.log(`${v.tag}: release exists; ${missing.length} file(s) added`);
 }
}
console.log(`Done: ${made} release(s) created, ${uploaded} asset(s) added.`);
