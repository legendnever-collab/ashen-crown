// v2.1 작은 마을과 의뢰 (D-118, TAVERN_WORLD_DESIGN §7; names, numbers and wording PROPOSED). A cleared castle opens the
// small villages around it on the world map; each has a request board (촌장), a tavern and a shop. ACT I first: M04's
// abandoned fortress opens 갈대 나루 and 돌우물 마을. Leaf module (no imports).
export const VILLAGES={
 reed:{name:'갈대 나루',opens:4,site:{x:1398,y:398},note:'성채 아래 강가의 나루터 마을'},
 stonewell:{name:'돌우물 마을',opens:4,site:{x:1288,y:335},note:'국경 길가의 돌우물 마을'},
 // v2.3.1 (D-128 §3, D-131; PROPOSED): ACT II — the canyon (M08) opens 서리목 마을, Velmar (M09) opens 소금항.
 frost:{name:'서리목 마을',opens:8,site:{x:655,y:340},note:'협곡 아래 눈 덮인 나무꾼 마을'},
 saltport:{name:'소금항',opens:9,site:{x:305,y:600},note:'벨마르 남쪽 염전과 고깃배 포구'}
};
// Requests. battle: a short skirmish (MISSIONS[mission], kind 'request'); pay: no battle, hand over items or gold.
// repeat: a bounty that opens again after each story mission won. rescue: who joins when it is done.
export const REQUESTS={
 ferry:{village:'reed',title:'나루터의 산적',kind:'battle',mission:120,reward:{gold:180,items:{medium:1}},text:'나루터를 점거한 산적 여덟을 몰아내 주시오. 배가 묶여 장사를 못 하오.'},
 barge:{village:'reed',title:'짐배 호위',kind:'battle',mission:121,reward:{gold:220},text:'강을 내려갈 짐배가 산적에게 노려지고 있소. 짐배가 출발할 때까지 지켜 주시오.'},
 herbs:{village:'reed',title:'약초 모으기',kind:'pay',pay:{items:{herb:2}},reward:{gold:100,items:{antidote:1}},text:'나루 아이들이 열병을 앓소. 약초 두 묶음만 구해 주면 사례하겠소.'},
 besieged:{village:'stonewell',title:'포위된 창기사',kind:'battle',mission:122,reward:{gold:150},rescue:'adel',text:'마을을 지키던 창기사 한 분이 북쪽 길에서 산적에게 둘러싸였소. 제발 구해 주시오!'},
 raiders:{village:'stonewell',title:'길목의 약탈자',kind:'battle',mission:123,reward:{gold:160},text:'국경 길목에서 짐수레를 터는 약탈자들이 있소. 모두 쫓아 주시오.'},
 well:{village:'stonewell',title:'우물 수리',kind:'pay',pay:{gold:150},reward:{items:{elixir:1}},text:'마을 돌우물이 무너졌소. 수리비를 보태 주면 마을에서 귀한 약을 드리리다.'},
 bounty:{village:['reed','stonewell'],title:'현상금: 떠돌이 산적',kind:'battle',mission:124,reward:{gold:120},repeat:true,text:'떠돌이 산적 무리에 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 무리가 나타나오.'}
};
// v2.3.1 (D-131): the ACT II villages. 서리목's 「눈보라 속 도끼잡이」 brings 군나르; 「얼음 다리 수리」 takes 10% off the north
// shops (철관성 성하 마을 and 서리목); 소금항's 「소금 수레 나르기」 takes a bought potion. Each village has its own bounty.
Object.assign(REQUESTS,{
 blizzard:{village:'frost',title:'눈보라 속 도끼잡이',kind:'battle',mission:125,reward:{gold:250},rescue:'gunnar',text:'눈보라 속에서 마을을 지켜 온 도끼잡이가 늑대와 탈영병에게 둘러싸였소. 그 사람이 없었으면 이 마을은 벌써 없어졌을 거요. 구해 주시오!'},
 icebridge:{village:'frost',title:'얼음 다리 수리',kind:'pay',pay:{gold:300},reward:{discount:{hubs:['castletown','frost'],pct:10}},text:'성하 마을로 가는 얼음 다리가 갈라졌소. 수리비를 보태 주면 북부 상인들이 군단에는 값을 깎아 주겠다고 하오.'},
 wolves:{village:'frost',title:'굶주린 늑대 떼',kind:'battle',mission:126,reward:{gold:280,items:{medium:1}},text:'겨울이 길어 늑대 떼가 마을 울타리까지 내려왔소. 나무꾼들이 숲에 들어가지 못하오.'},
 smugglers:{village:'saltport',title:'밀수선 단속',kind:'battle',mission:127,reward:{gold:320},text:'부두에 밀수꾼이 판을 쳐 소금값이 엉망이오. 밀수꾼 열을 몰아내 주시오.'},
 lighthouse:{village:'saltport',title:'등대 지키기',kind:'battle',mission:128,reward:{gold:300,items:{antidote:1}},text:'해적이 등대에 불을 질러 배를 암초로 꾀려 하오. 밤이 샐 때까지 등대를 지켜 주시오.'},
 saltcart:{village:'saltport',title:'소금 수레 나르기',kind:'pay',pay:{items:{medium:1}},reward:{gold:150,items:{smoke:1}},text:'염전 일꾼이 수레에 깔려 다쳤소. 회복약 하나만 나눠 주면 소금 판 값으로 사례하리다.'},
 bountyNorth:{village:['frost'],title:'현상금: 북부 탈영병',kind:'battle',mission:129,reward:{gold:200},repeat:true,text:'북부 길에 탈영병 무리가 또 나타났소. 본편 작전을 하나 마칠 때마다 새 무리가 내려오오.'},
 bountyPort:{village:['saltport'],title:'현상금: 항구 해적',kind:'battle',mission:130,reward:{gold:200},repeat:true,text:'항구를 노리는 해적에게 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 배가 들어오오.'}
});
export const REQUEST_IDS=Object.keys(REQUESTS);
// A request's villages (one id, or a list for a bounty shared by two villages).
export const requestVillages=r=>[].concat(r?.village||[]);
export const requestMission=id=>REQUESTS[id]?.mission||null;
export const requestOfMission=mid=>Object.entries(REQUESTS).find(([,r])=>r.mission===mid)?.[0]||null;
