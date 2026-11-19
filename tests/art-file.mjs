// v2.2.1 (D-125): the large paintings were re-encoded from WebP to AVIF (scripts/convert-art-avif.py). The import logs still
// name the WebP each import wrote; src/assets/avif-conversion-log.csv links that WebP (by SHA256) to the AVIF on disk.
// artFile(folder, webpName) finds the runtime file and checks the chain, so the tests keep verifying every import.
import fs from 'node:fs';import crypto from 'node:crypto';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const [head,...rows]=fs.readFileSync('src/assets/avif-conversion-log.csv','utf8').trim().split(/\r?\n/);const cols=head.split(',');
export const CONVERSIONS=rows.map(r=>Object.fromEntries(r.split(',').map((v,i)=>[cols[i],v])));
// → {path, bytes, format:'webp'|'avif', webpSha}: webpSha is the SHA256 of the WebP the import wrote (the file itself if
// it is still WebP; else the conversion log's, after the AVIF on disk is checked against the log).
export function artFile(folder,webpName){
 const webp=`src/assets/${folder}/${webpName}`;
 if(fs.existsSync(webp)){const bytes=fs.readFileSync(webp);return {path:webp,bytes,format:'webp',webpSha:sha(bytes)};}
 const c=CONVERSIONS.find(r=>r.folder===folder&&r.webp===webpName);if(!c)throw Error(`${folder}/${webpName}: neither the WebP nor a logged AVIF`);
 const path=`src/assets/${folder}/${c.avif}`,bytes=fs.readFileSync(path);
 if(sha(bytes)!==c.avif_sha256)throw Error(`${path}: SHA256 differs from avif-conversion-log.csv`);
 if(bytes.length!==+c.avif_bytes)throw Error(`${path}: size differs from avif-conversion-log.csv`);
 return {path,bytes,format:'avif',webpSha:c.webp_sha256};
}
export const artSha=(folder,webpName)=>artFile(folder,webpName).webpSha;
// Runtime art names of a folder with the extension stripped (WebP or AVIF).
export const artNames=folder=>fs.readdirSync(`src/assets/${folder}`).filter(f=>/\.(webp|avif)$/.test(f)).map(f=>f.replace(/\.(webp|avif)$/,''));
// Pixel size from the file header: WebP (VP8X, VP8, VP8L) or AVIF (the 'ispe' box).
export function imageSize(b){
 if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'){const k=b.toString('ascii',12,16);
  if(k==='VP8X')return [b.readUIntLE(24,3)+1,b.readUIntLE(27,3)+1];
  if(k==='VP8L'){const v=b.readUInt32LE(21);return [(v&0x3fff)+1,((v>>14)&0x3fff)+1];}
  return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff];}
 if(b.toString('ascii',4,8)==='ftyp'&&/avi[fs]/.test(b.toString('ascii',8,12))){const i=b.indexOf('ispe');if(i>0)return [b.readUInt32BE(i+8),b.readUInt32BE(i+12)];}
 throw Error('not a WebP or AVIF file');
}
export const isAvif=b=>b.toString('ascii',4,8)==='ftyp'&&b.toString('ascii',8,12)==='avif';
