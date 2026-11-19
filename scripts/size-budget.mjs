// v2.2.1 (D-125): the size budget of the standalone HTML. GitHub refuses files over 100 MiB; the game stays under 90 MiB
// (fail) and is flagged at 80 MiB (warn). sizeReport splits the bytes into the embedded art registries, fonts and code.
export const BUDGET={warnMiB:80,failMiB:90};
export const sizeStatus=bytes=>bytes>BUDGET.failMiB*1048576?'fail':bytes>BUDGET.warnMiB*1048576?'warn':'ok';
export function sizeReport(html,modules){
 const total=Buffer.byteLength(html),parts={};let art=0;
 for(const m of modules){const r=/^const (ASHEN_[A-Z_]+)=/.exec(m);if(r){const b=Buffer.byteLength(m);parts[r[1]]=b;art+=b;}}
 const fonts=[...html.matchAll(/url\(data:font\/woff;base64,[A-Za-z0-9+/=]+\)/g)].reduce((n,m)=>n+m[0].length,0);
 parts.fonts=fonts;parts.code=total-art-fonts;
 return {bytes:total,MiB:+(total/1048576).toFixed(2),status:sizeStatus(total),parts};
}
