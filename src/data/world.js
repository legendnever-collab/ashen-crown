// v0.5.0 world map of Erdia (D-052, APPROVED_DIRECTION layout; place names PROPOSED and renameable).
// Coordinates are pixels on the 1536×1024 painted map (fitted to the user's world_map art, 2026-10-20). Faction names/leaders are CANON; regions are
// tinted only once the story has met them (W2). Nothing beyond the sealed border is defined (OPEN).

export const WORLD_SIZE={w:1536,h:1024};
export const CONTINENT=[[300,120],[420,70],[640,72],[820,90],[1000,72],[1200,82],[1350,150],[1460,200],[1500,300],[1490,420],[1500,540],[1470,650],[1400,720],[1320,800],[1200,870],[1060,920],[900,960],[700,960],[560,930],[420,900],[300,850],[230,760],[160,680],[150,560],[170,450],[150,330],[200,190]];
export const REGIONS=[
 {id:'east',name:'동부 변경',faction:'왕국 국경 수비대',color:'#c0703a',label:[1290,700],shown:()=>true,
  poly:[[1240,130],[1350,150],[1460,200],[1490,420],[1500,540],[1470,650],[1400,720],[1320,800],[1200,830],[1120,720],[1000,680],[1010,560],[1040,420],[960,340],[1050,310],[1130,280],[1180,250]]},
 {id:'center',name:'왕도령',faction:'왕실',color:'#d4ad3c',label:[820,450],shown:c=>c.completed.includes(5)||c.choices?.m06_oath!=null,
  poly:[[600,360],[700,340],[850,330],[960,340],[1040,420],[1010,560],[1000,680],[820,650],[640,640],[520,700],[560,520]]},
 {id:'north',name:'철왕관 통령령',faction:'Iron Crown Dominion',color:'#6f86a0',label:[760,150],shown:c=>c.completed.includes(5),
  poly:[[300,120],[420,70],[640,72],[820,90],[1000,72],[1150,85],[1240,130],[1180,250],[1050,300],[900,330],[760,330],[600,330],[450,300],[300,280],[240,250],[250,170]]},
 {id:'west',name:'자유도시 연맹',faction:'Free Lords Alliance',color:'#7aa35a',label:[330,430],shown:c=>c.completed.includes(8),
  poly:[[170,450],[150,330],[200,290],[300,280],[450,300],[560,330],[600,360],[560,520],[520,700],[430,760],[300,790],[230,760],[160,680],[150,560]]},
 {id:'south',name:'성화령',faction:'Order of the Sacred Flame',color:'#c4553f',label:[760,740],shown:()=>false,
  poly:[[520,700],[640,640],[820,650],[1000,680],[1120,720],[1200,760],[1200,830],[1060,920],[900,960],[700,960],[560,930],[420,900],[300,850],[230,760],[300,790],[430,760]]}
];
// Sites: icon id (world icon sheet), region, ACT I mission/hub links. Unmet sites are drawn without names.
export const SITES=[
 {id:'capital',name:'왕도 아우렐리아',icon:'capital',x:790,y:455,region:'center'},
 {id:'stronghold',name:'철관성',icon:'stronghold',x:710,y:207,region:'north'},
 {id:'canyon',name:'회색 협곡',icon:null,x:690,y:300,region:'north'},
 {id:'freecity',name:'자유도시 벨마르',icon:'freecity',x:270,y:525,region:'west'},
 {id:'lordA',name:'영주성',icon:'ruin',x:423,y:411,region:'west',small:true},
 {id:'lordB',name:'영주성',icon:'ruin',x:433,y:651,region:'west',small:true},
 {id:'cathedral',name:'성화 대성당',icon:'cathedral',x:760,y:785,region:'south'},
 {id:'monastery',name:'침묵의 수도원',icon:'monastery',x:975,y:853,region:'south'},
 {id:'village',name:'잿빛 마을',icon:'village',x:1150,y:620,region:'east',mission:1,hub:'village'},
 {id:'garrison',name:'국경 수비대 진영',icon:'camp',x:1235,y:585,region:'east',hub:'camp'},
 {id:'forest',name:'숲길',icon:null,x:1292,y:505,region:'east',mission:2},
 {id:'bridge',name:'무너진 다리',icon:null,x:1262,y:442,region:'east',mission:3},
 {id:'bivouac',name:'강가 야영',icon:'camp',x:1305,y:398,region:'east',hub:'bivouac',small:true},
 {id:'fortress',name:'버려진 성채',icon:'ruin',x:1361,y:360,region:'east',mission:4,hub:'fortress'},
 {id:'ridge',name:'국경 능선',icon:null,x:1325,y:275,region:'east',mission:5},
 {id:'gate',name:'국경 관문',icon:'gate',x:1432,y:333,region:'east',mission:6},
 {id:'oathcamp',name:'관문 너머 야영지',icon:'camp',x:1458,y:295,region:'east',hub:'oathcamp',small:true}
];
export const HUB_SITE={village:'village',village_raid:'village',camp:'garrison',bivouac:'bivouac',fortress:'fortress',oathcamp:'oathcamp',castletown:'stronghold',velmar:'freecity'};
// ACT I march order (W1): village → garrison → forest → bridge → bivouac → fortress → ridge → gate → oath camp.
export const ACT1_ROUTE=['village','garrison','forest','bridge','bivouac','fortress','ridge','gate','oathcamp'];
// ACT II first half (D-055 §6): oath camp → Ironhold's castle town → the grey canyon → Velmar. Drawn from v0.6 Phase F.
export const ACT2_ROUTE=['oathcamp','stronghold','canyon','freecity'];
export const siteById=id=>SITES.find(s=>s.id===id);
// How far along the march the legion has come, from completed missions.
export function routeReached(campaign,hub){const c=campaign?.completed||[];let i=ACT1_ROUTE.indexOf(HUB_SITE[hub]||'village');for(const [m,site] of [[1,'village'],[2,'forest'],[3,'bridge'],[4,'fortress'],[5,'ridge']])if(c.includes(m))i=Math.max(i,ACT1_ROUTE.indexOf(site));if(c.includes(5)&&hub==='oathcamp')i=ACT1_ROUTE.length-1;return Math.max(0,i);}
export const siteKnown=(site,campaign)=>site.region==='east'||REGIONS.find(r=>r.id===site.region)?.shown(campaign||{completed:[]});
