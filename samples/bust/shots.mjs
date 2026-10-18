import {chromium} from 'playwright';import fs from 'fs';import http from 'http';import path from 'path';
const root='/home/claude/ashen-crown',out=process.argv[2],query=process.argv[3]||'',width=+(process.argv[4]||1500);
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('#')[0].split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.html')?'text/html':'application/octet-stream'});r.end(d);});}).listen(8767);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:8767/samples/bust/index.html?'+query);await p.waitForSelector('body[data-ready]',{timeout:15000}).catch(()=>{});
await p.screenshot({path:out,fullPage:true});console.log(errs.join('\n')||'ok');await b.close();srv.close();
