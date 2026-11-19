// v2.2.1 (D-125): archive the earlier builds as GitHub Releases so they can leave the repository tree.
// Run by the user from GitHub (Actions → "Archive old builds" → Run workflow); a Claude session may not create releases.
// For every version in releases/ARCHIVE.json: check each file against its recorded SHA256, then create the release
// (tag v<version> at the commit that packaged that HTML) or upload the assets it is missing. Existing assets are kept.
// v2.3 (D-128): the first run stopped at v0.3.2 with "HTTP 403: Resource not accessible by integration" — GitHub does
// not let the workflow token place a tag on an old commit whose workflow files differ from today's. Such a version is
// then tagged on the current default branch instead, and its release text names the commit that packaged it. A version
// that still fails is reported and the run goes on; the job fails at the end if any did.
import fs from 'node:fs';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
const repo=process.env.GITHUB_REPOSITORY||'legendnever-collab/ashen-crown';
const gh=(...a)=>execFileSync('gh',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const {versions}=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8'));
const only=new Set(process.argv.slice(2));let made=0,uploaded=0;const failed=[];
const notes=(v,where)=>`Archived build of Ashen Crown ${v.tag} (D-125): moved out of the repository tree to keep it small. The standalone HTML runs offline in a browser. Packaged at commit ${v.commit}${where}. SHA256 per file in releases/ARCHIVE.json.`;
for(const v of versions){
 if(only.size&&!only.has(v.version))continue;
 try{
  const paths=Object.entries(v.files).map(([name,meta])=>{const p=`releases/${name}`,b=fs.readFileSync(p);
   if(crypto.createHash('sha256').update(b).digest('hex')!==meta.sha256)throw Error(`${name}: SHA256 differs from ARCHIVE.json`);return p;});
  let have=null;try{have=JSON.parse(gh('api',`repos/${repo}/releases/tags/${v.tag}`)).assets.map(a=>a.name);}catch{have=null;}
  if(have===null){
   const create=(target,where)=>gh('release','create',v.tag,...paths,'--repo',repo,...(target?['--target',target]:[]),'--title',`Ashen Crown ${v.tag}`,'--notes',notes(v,where));
   try{create(v.commit,'');console.log(`${v.tag}: release created with ${paths.length} files (tag at ${v.commit.slice(0,7)})`);}
   catch(e){
    if(!/403|not accessible/i.test(String(e.stderr||e.message)))throw e;
    // a half-made release (created, assets refused) is removed before trying again
    try{gh('release','delete',v.tag,'--repo',repo,'--yes','--cleanup-tag');}catch{}
    create(null,' (the tag sits on the default branch: GitHub refused a tag on that older commit)');
    console.log(`${v.tag}: release created with ${paths.length} files (tag on the default branch; packaged at ${v.commit.slice(0,7)})`);
   }
   made++;
  }else{
   const missing=paths.filter(p=>!have.includes(p.split('/').pop()));
   if(missing.length){gh('release','upload',v.tag,...missing,'--repo',repo);uploaded+=missing.length;}
   console.log(`${v.tag}: release exists; ${missing.length} file(s) added`);
  }
 }catch(e){failed.push(v.tag);console.log(`${v.tag}: FAILED — ${String(e.stderr||e.message).trim().split('\n')[0]}`);}
}
console.log(`Done: ${made} release(s) created, ${uploaded} asset(s) added${failed.length?`, failed: ${failed.join(' ')}`:''}.`);
if(failed.length)process.exit(1);
