// v2.1 작은 마을과 의뢰 (D-118, TAVERN_WORLD_DESIGN §7; names, numbers and wording PROPOSED). A cleared castle opens the
// small villages around it on the world map; each has a request board (촌장), a tavern and a shop. ACT I first: M04's
// abandoned fortress opens 갈대 나루 and 돌우물 마을. Leaf module (no imports).
export const VILLAGES={
 reed:{name:'갈대 나루',opens:4,site:{x:1398,y:398},note:'성채 아래 강가의 나루터 마을'},
 stonewell:{name:'돌우물 마을',opens:4,site:{x:1288,y:335},note:'국경 길가의 돌우물 마을'},
 // v2.3.1 (D-128 §3, D-131; PROPOSED): ACT II — the canyon (M08) opens 서리목 마을, Velmar (M09) opens 소금항.
 frost:{name:'서리목 마을',opens:8,site:{x:655,y:340},note:'협곡 아래 눈 덮인 나무꾼 마을'},
 saltport:{name:'소금항',opens:9,site:{x:305,y:600},note:'벨마르 남쪽 염전과 고깃배 포구'},
 // v2.4.1 (D-135 §3; PROPOSED): ACT III — the forgotten battlefield (M16) opens 등불골, the unburning forest (M18) opens 이끼다리.
 lamp:{name:'등불골',opens:16,site:{x:552,y:488},note:'잊힌 전장 서쪽, 옛 전사자 묘지를 지키는 등불지기 마을'},
 moss:{name:'이끼다리',opens:18,site:{x:985,y:592},note:'불타지 않는 숲 동쪽, 이끼 낀 돌다리 둘레의 약초꾼 · 사냥꾼 마을'},
 // v2.5.1 (D-141 §3; PROPOSED): ACT IV — the last border (M24) opens 봉화둔덕, the lion's pass (M26) opens 사자샘.
 beacon:{name:'봉화둔덕',opens:24,site:{x:1228,y:668},note:'최후의 국경 동쪽, 봉화대 아래 피난민이 머무는 둔덕 마을'},
 lionspring:{name:'사자샘',opens:26,site:{x:742,y:372},note:'사자의 고개 아래, 철왕관 기병이 말을 쉬게 하던 샘터 마을'}
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
// v2.4.1 (D-135): the ACT III villages. 이끼다리's 「잿빛 안개 속 약초꾼」 brings 마렌; 「이끼다리 보수」 takes 10% off the shops
// round the capital (왕도 하층가, 이끼다리, 등불골); 등불골's 「등유 나르기」 takes an ether. Each village has its own bounty.
Object.assign(REQUESTS,{
 robbers:{village:'lamp',title:'무덤 도굴꾼',kind:'battle',mission:131,reward:{gold:320},text:'옛 전사자 묘지를 파헤치는 도굴꾼들이 있소. 이름 없는 무덤이라도 누군가의 무덤이오. 열 명을 모두 쫓아 주시오.'},
 lanterns:{village:'lamp',title:'안개 속 등불',kind:'battle',mission:132,reward:{gold:300,items:{antidote:1}},text:'묘지 등불 셋이 꺼지면 길 잃은 사람이 늪으로 빠지오. 회색 망토 잔당이 등불을 노리니, 날이 밝을 때까지 지켜 주시오.'},
 lampoil:{village:'lamp',title:'등유 나르기',kind:'pay',pay:{items:{ether:1}},reward:{gold:150,items:{ward:1}},text:'등불 기름이 떨어졌소. 에테르 한 병이면 등유 대신 한 달은 버티오. 사례는 하리다.'},
 herbalist:{village:'moss',title:'잿빛 안개 속 약초꾼',kind:'battle',mission:133,reward:{gold:250},rescue:'maren',text:'숲길을 아는 사냥꾼이 벌목대 소식을 알리러 나왔다가 숲 가장자리에서 둘러싸였소. 그 사람이 없으면 숲지기들은 길을 잃소. 구해 주시오!'},
 mossbridge:{village:'moss',title:'이끼다리 보수',kind:'pay',pay:{gold:300},reward:{discount:{hubs:['capital','moss','lamp'],pct:10}},text:'왕도로 가는 돌다리가 내려앉았소. 보수비를 보태 주면 왕도 둘레 상인들이 군단에는 값을 깎아 주겠다고 하오.'},
 loggers:{village:'moss',title:'벌목꾼 몰아내기',kind:'battle',mission:134,reward:{gold:300,items:{medium:1}},text:'숲 가장자리 고목을 베려는 벌목꾼들이 또 왔소. 열 명이오. 숲 안쪽으로 들어가기 전에 몰아내 주시오.'},
 bountyCapital:{village:['lamp'],title:'현상금: 회색 망토 잔당',kind:'battle',mission:135,reward:{gold:220},repeat:true,text:'흩어진 회색 망토 잔당에게 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 무리가 나타나오.'},
 bountyForest:{village:['moss'],title:'현상금: 재상부 밀정',kind:'battle',mission:136,reward:{gold:220},repeat:true,text:'숲길을 엿보는 재상부 밀정에게 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 무리가 들어오오.'}
});
// v2.5.1 (D-141): the ACT IV villages. 봉화둔덕's 「재 속의 약사」 brings 루카; 「샘터 우물 보수」 takes 10% off at 사자샘,
// 봉화둔덕 and 왕도 하층가 (one discount per shop — the first paid one counts); 「피난민 겨울나기」 takes two medium potions.
Object.assign(REQUESTS,{
 apothecary:{village:'beacon',title:'재 속의 약사',kind:'battle',mission:137,reward:{gold:250},rescue:'luka',text:'봉화대 아래 버려진 수도원에 젊은 약사가 남아 있소. 관문이 닫힌 밤, 바깥에 남은 사람들을 돌보겠다고 나가지 않았지. 재의 짐승이 수도원을 에워쌌소. 이레만 버텨 주면 우리가 길을 내겠소.'},
 beacons:{village:'beacon',title:'봉화 다시 올리기',kind:'battle',mission:138,reward:{gold:320,items:{ward:1}},text:'봉화대 둘에 다시 불을 올렸소. 재상부 탈영병들이 불을 꺼서 국경을 어둡게 하려 하오. 엿새만 지켜 주시오.'},
 winter:{village:'beacon',title:'피난민 겨울나기',kind:'pay',pay:{items:{medium:2}},reward:{gold:200,items:{antidote:1}},text:'관문 안으로 들어온 사람들이 첫 겨울을 나야 하오. 회복약 두 병이면 아픈 이들을 돌볼 수 있소.'},
 horses:{village:'lionspring',title:'도망친 군마',kind:'battle',mission:139,reward:{gold:300,items:{medium:2}},text:'고개 싸움 뒤 철왕관 마부 셋이 흩어진 군마를 끌고 산속을 헤매고 있소. 고개 도적이 먼저 찾기 전에 데려와 주시오. 여드레 안에.'},
 springwell:{village:'lionspring',title:'샘터 우물 보수',kind:'pay',pay:{gold:300},reward:{discount:{hubs:['lionspring','beacon','capital'],pct:10}},text:'샘터 우물이 무너져 물을 길을 수가 없소. 보수비를 보태 주면 사자샘과 봉화둔덕, 왕도 하층가 상인들이 값을 깎아 주겠다 하오.'},
 passbandits:{village:'lionspring',title:'고개 도적',kind:'battle',mission:140,reward:{gold:320,items:{medium:1}},text:'싸움이 끝난 고갯길에 도적이 들끓소. 열 명쯤 되오. 여드레 안에 몰아내 주시오.'},
 bountyBorder:{village:['beacon'],title:'현상금: 재상부 탈영병',kind:'battle',mission:141,reward:{gold:240},repeat:true,text:'국경을 떠도는 재상부 탈영병에게 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 무리가 나타나오.'},
 bountyLion:{village:['lionspring'],title:'현상금: 사자 깃발 잔당',kind:'battle',mission:142,reward:{gold:240},repeat:true,text:'사자 깃발을 내리지 않은 잔당이 고갯길에서 짐을 털고 있소. 본편 작전을 하나 마칠 때마다 다시 모이오.'}
});
export const REQUEST_IDS=Object.keys(REQUESTS);
// A request's villages (one id, or a list for a bounty shared by two villages).
export const requestVillages=r=>[].concat(r?.village||[]);
export const requestMission=id=>REQUESTS[id]?.mission||null;
export const requestOfMission=mid=>Object.entries(REQUESTS).find(([,r])=>r.mission===mid)?.[0]||null;
