// v2.1 작은 마을과 의뢰 (D-118, TAVERN_WORLD_DESIGN §7; names, numbers and wording PROPOSED). A cleared castle opens the
// small villages around it on the world map; each has a request board (촌장), a tavern and a shop. ACT I first: M04's
// abandoned fortress opens 갈대 나루 and 돌우물 마을. Leaf module (no imports).
export const VILLAGES={
 reed:{name:'갈대 나루',opens:4,site:{x:1398,y:398},note:'성채 아래 강가의 나루터 마을'},
 stonewell:{name:'돌우물 마을',opens:4,site:{x:1288,y:335},note:'국경 길가의 돌우물 마을'}
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
 bounty:{village:'both',title:'현상금: 떠돌이 산적',kind:'battle',mission:124,reward:{gold:120},repeat:true,text:'떠돌이 산적 무리에 현상금이 걸렸소. 본편 작전을 하나 마칠 때마다 새 무리가 나타나오.'}
};
export const REQUEST_IDS=Object.keys(REQUESTS);
export const requestMission=id=>REQUESTS[id]?.mission||null;
export const requestOfMission=mid=>Object.entries(REQUESTS).find(([,r])=>r.mission===mid)?.[0]||null;
