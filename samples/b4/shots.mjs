import {chromium} from 'playwright';import fs from 'fs';import http from 'http';import path from 'path';
const root='/home/claude/ashen-crown',out=process.argv[2];
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('#')[0].split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream'});r.end(d);});}).listen(8766);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for(const v of process.argv.slice(3)){const p=await b.newPage({viewport:{width:800,height:600}});p.on('pageerror',e=>console.log('ERR',v,e.message));p.on('console',m=>console.log('LOG',m.text()));
 const [vv,q]=v.split('?');await p.goto(`http://localhost:8766/samples/b4/index.html${q?'?'+q:''}#${vv}`);await p.waitForFunction(()=>window.ready,null,{timeout:20000}).catch(e=>console.log('timeout',v));
 if(v==='walk'){const fr=await p.evaluate(()=>window.frames);fs.mkdirSync(`${out}/walk`,{recursive:true});fr.forEach((d,i)=>fs.writeFileSync(`${out}/walk/${String(i).padStart(3,'0')}.png`,Buffer.from(d.split(',')[1],'base64')));}else{const el=await p.$('#out');await el.screenshot({path:`${out}/b4-${v.replace(/[?=&,]/g,'_').slice(0,60)}.png`});}console.log('shot',v);await p.close();}
await b.close();srv.close();
