// v2.1 「주점과 세계지도」 (D-118, docs/v2.1.0/TAVERN_WORLD_DESIGN.md §4, §7; names, numbers and lines PROPOSED).
// A leaf module (no imports): the tavern hires, the ACT I rescued hero, their lines and records. game-data, classes8,
// story, hero-lore and ending read from here, so the four v2.0.0 officers and the new hires share one shape.

// Who can be hired where. `town` is the hub that holds the tavern; `from` = the mission that must be won first (0 = from
// the start); `elite` = only in that town, one grade stronger. A hire is paid once and stays to the ending.
export const MERCS={
 bram:{town:'ash',from:0,price:200},
 noa:{town:'ash',from:0,price:200},
 marta:{town:'ash',from:0,price:200},
 rowell:{town:'reed',from:4,price:450,elite:true},
 sera:{town:'castletown',from:7,price:600},
 orin:{town:'velmar',from:9,price:650},
 celine:{town:'pilgrim',from:11,price:700},
 ren:{town:'capital',from:15,price:900,elite:true},
 silva:{town:'forest',from:18,price:950}
};
// v2.1 (§7): the stonewell tavern takes in a wanderer each time a story mission is won — one of the ash village's three
// not yet hired, saying they moved here. Order of arrival.
export const WANDERERS=['bram','noa','marta'];
// v2.3.1 (D-131): the 서리목 tavern takes in a wanderer from the ACT II taverns the same way — 세라 or 오린, not yet hired.
export const WANDERERS_FROST=['sera','orin'];
// Rescued heroes (§7, one per ACT; ACT I first): joined by a request, not hired. Tavern towns → their hubs:
export const RESCUED={adel:{request:'besieged',town:'stonewell'},gunnar:{request:'blizzard',town:'frost'}}; // v2.3.1: 군나르 (ACT II)
export const TAVERN_HUBS={ash:['village','village_raid'],reed:['reed'],stonewell:['stonewell'],frost:['frost'],castletown:['castletown'],velmar:['velmar','saltport'],pilgrim:['pilgrim'],capital:['capital'],forest:['forest']};
export const TOWN_NAME={ash:'잿빛 마을',reed:'갈대 나루',stonewell:'돌우물 마을',castletown:'철관성 성하 마을',velmar:'벨마르',frost:'서리목 마을',pilgrim:'순례자 마을',capital:'왕도 하층가',forest:'숲 마을'};

// New characters' records (same fields as game-data RECRUIT_HEROES; the six stats in classes8 decide the numbers).
export const NEW_HEROES=[
 {id:'sera',name:'세라',ko:'세라',officer:true,className:'Spearhand',role:'Spear',level:1,hp:39,mp:10,atk:16,def:8,mag:3,res:5,spd:5,mov:4,range:[1,1],skill:'Brace',cost:3,talent:'Iron Pike',color:'#7b8796',growth:{mp:1},description:'철왕관에서 파견된 창병대장. 명령보다 부하의 목숨을 먼저 센다. 방진: 근접 공격 ×1.1, 다음 아군 턴까지 반격 ×1.5.',clue:'',goal:''},
 {id:'orin',name:'오린',ko:'오린',officer:true,className:'Apprentice',role:'Mage',level:1,hp:27,mp:16,atk:6,def:3,mag:17,res:6,spd:5,mov:3,range:[1,2],skill:'Fire Bolt',cost:4,talent:'Guild Scholar',color:'#5f8f6a',growth:{mp:2},description:'자유 영주 연맹의 학자 술사. 계약서와 주문서를 같은 손으로 쓴다. 화염탄: 마법 공격.',clue:'',goal:''},
 {id:'celine',name:'셀린',ko:'셀린',officer:true,className:'Mender',role:'Healer',level:1,hp:28,mp:16,atk:6,def:4,mag:12,res:8,spd:6,mov:3,range:[1,1],skill:'Heal',cost:4,talent:'Pilgrim Priest',color:'#d9c9a3',growth:{mp:2},description:'성화 교단의 순례 사제. 순례길에서 다친 사람을 먼저 돌보다 교단의 행렬에서 뒤처졌다. 치유: 의지에 비례해 회복.',clue:'',goal:''},
 {id:'ren',name:'렌',ko:'렌',officer:true,elite:true,className:'Cutpurse',role:'Rogue',level:1,hp:30,mp:10,atk:15,def:5,mag:3,res:4,spd:11,mov:5,range:[1,1],skill:'Quick Strike',cost:3,talent:'Archive Gate',color:'#5a5470',growth:{mp:1},description:'왕도 서고의 문지기였던 정보원. 누가 어느 상자를 열었는지 다 기억한다. 엘리트 용병. 기습: 측면 공격.',clue:'',goal:''},
 {id:'silva',name:'실바',ko:'실바',officer:true,className:'Bowhand',role:'Ranged',level:1,hp:31,mp:12,atk:16,def:4,mag:3,res:5,spd:9,mov:4,range:[2,3],skill:'Aimed Shot',cost:3,talent:'Forest Keeper',color:'#4f7a46',growth:{mp:2},description:'불타지 않는 숲의 숲지기. 숲에 들어온 사람의 발소리로 이름을 맞힌다. 조준 사격: 명중 +18, 피해 ×1.15.',clue:'',goal:''},
 {id:'gunnar',name:'군나르',ko:'군나르',officer:true,rescued:true,className:'Axeman',role:'Infantry',level:1,hp:42,mp:10,atk:17,def:8,mag:2,res:4,spd:5,mov:4,range:[1,1],skill:'Blizzard Charge',cost:3,talent:'Snowbound',color:'#6f8fa8',growth:{mp:1},description:'철왕관 북부 수비대의 도끼잡이. 탈영병을 쫓다 눈보라에 낙오해 서리목 마을 사람들을 지켜 왔다. 눈보라 돌격: 받아치기(다음 아군 턴까지 반격 ×1.5) · 눈밭 이동 비용 1.',clue:'',goal:''},
 {id:'adel',name:'아델',ko:'아델',officer:true,rescued:true,className:'Spearhand',role:'Spear',level:1,hp:41,mp:10,atk:16,def:9,mag:3,res:5,spd:5,mov:4,range:[1,1],skill:'Last Post',cost:3,talent:'Last Post',color:'#9a6b3c',growth:{mp:1},description:'무너진 국경 초소의 마지막 창기사. 초소가 버려진 뒤에도 길가 마을을 지켰다. 마지막 초소: 근접 공격 ×1.1, 다음 아군 턴까지 반격 ×1.5.',clue:'',goal:''}
];
export const NEW_STATS={
 sera:{str:9,int:3,wil:5,con:8,agi:5,luk:4},orin:{str:3,int:9,wil:7,con:4,agi:5,luk:5},celine:{str:3,int:6,wil:9,con:5,agi:6,luk:6},
 ren:{str:7,int:4,wil:3,con:5,agi:11,luk:10},silva:{str:8,int:3,wil:4,con:5,agi:9,luk:7},adel:{str:9,int:3,wil:6,con:9,agi:5,luk:5},gunnar:{str:10,int:2,wil:5,con:9,agi:5,luk:5}
};
export const NEW_CLASS={sera:'spear',orin:'mage',celine:'healer',ren:'rogue',silva:'archer',adel:'spear',gunnar:'infantry'};
// Elite hires are one grade stronger in their main stats (§4).
export const ELITE_BONUS=2;
// Busts until art pack H1 (v2) returns (D-094 manner: a painted figure of the same calling).
export const MERC_BUST={sera:'captain16_iron',orin:'merchant',celine:'captain16_flame',ren:'pursuerCaptain',silva:'forestElder',adel:'captain16_free',gunnar:'dario'}; // v2.3.1: 군나르 borrows Dario's bust until art pack J

// Camp lines (§4: the same way as the v2.0.0 officers; one of three by mission).
export const MERC_TALK={
 sera:[[['sera','철관성에서 창병 백 명을 이끌었다. 여기선 창 하나지. 그래도 셈은 같다. 다 데리고 돌아가는 것.']],
  [['sera','명령서는 종이다. 종이는 아무도 지켜 주지 않아.','concerned'],['eric','그래서 군단에 왔어요?'],['sera','그래서 군단에 왔다.']],
  [['sera','창끝을 낮추는 법부터 가르친다. 높이 든 창은 멋있지만 아무도 못 막는다.','determined']]],
 orin:[[['orin','계약서 한 장 써 줄까? 농담이다. 이 군단은 계약보다 약속이 많더군.']],
  [['orin','불꽃은 셈이야. 얼마나 멀리, 얼마나 세게. 리아의 셈은 나보다 빠르더군.'],['eric','리아한테 그 말 해 줘요.'],['orin','이미 했다. 웃더군.']],
  [['orin','벨마르 의회는 아직도 우리 얘기를 하겠지. 좋게든 나쁘게든.','concerned']]],
 celine:[[['celine','순례길에서 배운 건 하나예요. 걷다 쓰러진 사람 옆에 앉는 것.']],
  [['celine','세인 님은 상처보다 사람 얼굴을 먼저 봐요. 저도 그렇게 하려고요.'],['eric','세인이 들으면 쑥스러워하겠네요.'],['celine','그러니까 말 안 했어요.']],
  [['celine','성화가 꺼지지 않는 건 누가 계속 장작을 넣기 때문이에요. 기도도 그렇고요.','determined']]],
 ren:[[['ren','서고 문지기는 문을 여는 사람이 아니라 문을 연 사람을 기억하는 사람이야.']],
  [['ren','회색 망토가 어느 상자를 가져갔는지, 난 다 봤어. 말할 데가 없었을 뿐.','concerned'],['eric','이젠 있잖아요.'],['ren','그래서 비싸게 받은 거야.']],
  [['ren','등 뒤는 내가 본다. 대신 앞은 네가 봐.','determined']]],
 silva:[[['silva','숲은 불에 타지 않았지만, 사람은 숲을 떠났어. 나는 남았고.']],
  [['silva','엘리나의 발소리는 바람 같아. 노아는… 좀 시끄럽고.'],['eric','노아한테는 비밀로 할게요.'],['silva','이미 알아. 들었으니까.']],
  [['silva','화살은 숲에서 왔으니 숲으로 돌려보내는 거야. 낭비하지 마.','determined']]],
 adel:[[['adel','초소는 무너졌지만 길은 남았다. 길이 있는 한 지킬 사람도 있어야지.']],
  [['adel','산적 열둘에게 둘러싸였을 때, 창을 놓을까 생각했다. 놓지 않길 잘했다.','sad'],['eric','우리가 늦지 않아서 다행이에요.'],['adel','늦지 않았다. 그게 전부다.']],
  [['adel','마지막 초소란 건 없다. 내가 서 있는 곳이 초소다.','determined']]],
 gunnar:[[['gunnar','눈보라는 사흘이면 그친다. 그 사흘을 버티는 게 일이지. 서리목에서 배운 거다.']],
  [['gunnar','그 탈영병 대장… 같은 막사에서 자던 놈이다. 도망친 놈을 쫓던 내가, 결국 같이 길을 잃었지.','sad'],['eric','그래도 마을을 지켰잖아요.'],['gunnar','지킨 게 아니라 떠나지 못한 거다. …뭐, 결과는 같군.']],
  [['gunnar','도끼는 나무를 패라고 있는 거다. 사람을 패야 하는 날이 오면, 적어도 누굴 위해서인지는 알고 싶다.','determined']]]
};
// 열전 (§4): observed facts only; chapters show from the mission after they joined.
export const MERC_LORE={
 sera:{title:'철관의 창',traits:['엄격함','책임감','계산'],likes:'정렬된 창끝, 살아 돌아온 부하',dislikes:'종이 명령',quote:'다 데리고 돌아간다.',
  bio:'철왕관 통령령에서 파견된 창병대장. 부하를 잃는 명령서를 받은 날 창을 들고 성하 마을 주점으로 내려왔다.',chapters:[],bonds:[['thea','같은 깃발 아래 다른 길을 고른 기병.'],['bram','창 쥐는 법을 두고 사흘을 다툰 늙은 창병.']]},
 orin:{title:'계약의 불꽃',traits:['재치','셈','호기심'],likes:'잘 쓴 계약서, 새 주문',dislikes:'지키지 않은 약속',quote:'불꽃도 셈이다.',
  bio:'자유 영주 연맹의 학자 술사. 의회의 계약서를 쓰다가, 계약보다 약속을 지키는 군단을 보러 왔다.',chapters:[],bonds:[['lia','셈이 빠른 동료 술사.'],['dario','같은 도시 출신. 서로의 빚을 기억한다.']]},
 celine:{title:'순례의 손',traits:['다정함','끈기','조용함'],likes:'새벽 기도, 따뜻한 물',dislikes:'뒤에 남겨진 사람',quote:'쓰러진 사람 옆에 앉아요.',
  bio:'성화 교단의 순례 사제. 행렬에서 뒤처진 사람들을 돌보다 순례자 마을에 남았다.',chapters:[],bonds:[['sain','상처보다 얼굴을 먼저 보는 치유사.'],['ines','순례길을 지키던 수호자.']]},
 ren:{title:'서고의 문지기',traits:['기억력','냉소','충실'],likes:'닫힌 문, 정확한 장부',dislikes:'지운 기록',quote:'문을 연 사람을 기억한다.',
  bio:'왕도 서고의 문지기였던 정보원. 회색 망토가 기록 상자를 옮기던 밤을 다 보았다. 엘리트 용병.',chapters:[],bonds:[['kai','그림자 길을 아는 동료.'],['lia','지운 기록을 다시 쓰는 사람.']]},
 silva:{title:'불타지 않는 숲의 활',traits:['고요함','예민함','고집'],likes:'숲의 소리, 아침 이슬',dislikes:'낭비한 화살',quote:'화살은 숲으로 돌려보낸다.',
  bio:'불타지 않는 숲의 숲지기. 사람들이 떠난 숲에 혼자 남았다가 군단을 따라 나섰다.',chapters:[],bonds:[['elina','발소리가 바람 같은 궁수.'],['noa','시끄러운 사냥꾼.']]},
 adel:{title:'마지막 초소',traits:['끈기','과묵함','의리'],likes:'새벽 경계, 잘 닦은 창날',dislikes:'버려진 길',quote:'내가 서 있는 곳이 초소다.',
  bio:'무너진 국경 초소의 마지막 창기사. 초소가 버려진 뒤에도 길가의 돌우물 마을을 지키다 산적에게 포위되었고, 군단이 구해 냈다.',chapters:[],bonds:[['eric','늦지 않게 온 젊은 방패.'],['bram','같은 창을 쥔 늙은 자경단장.']]},
 gunnar:{title:'서리목의 도끼',traits:['우직함','과묵함','책임감'],likes:'마른 장작, 그친 눈보라',dislikes:'버리고 가는 사람',quote:'그 사흘을 버티는 게 일이다.',
  bio:'철왕관 북부 수비대의 도끼잡이. 탈영병을 쫓다 눈보라에 낙오해 협곡 아래 서리목 마을에 머물며 마을 사람들을 지켰다. 늑대와 탈영병에게 둘러싸였을 때 군단이 구해 냈다. 탈영병 대장과 같은 부대 출신이다.',chapters:[],bonds:[['thea','같은 북부 수비대의 기병.'],['dario','도끼와 칼, 같은 보병.']]}
};
// One epilogue line by ending (§4).
export const MERC_EPILOGUE={
 sera:{A:'세라는 새 왕관의 창병대를 맡았다. 첫 명령은 "다 데리고 돌아온다"였다.',B:'세라는 철관성으로 돌아가 명령서 대신 약속을 쓰는 법을 가르쳤다.',C:'세라는 서약한 마을들의 자경단에 창 쥐는 법을 가르치며 돌아다닌다.'},
 orin:{A:'오린은 새 왕관의 헌장을 받아 적었다. 한 줄도 빼지 않았다.',B:'오린은 벨마르 의회로 돌아가 지역 사이의 약속을 계약서로 남겼다.',C:'오린은 서약을 글로 남기는 일을 맡았다. 서약은 글보다 사람에게 남는다고 그는 썼다.'},
 celine:{A:'셀린은 왕도 구호소를 열었다. 줄 선 사람은 길었지만 아무도 돌아가지 않았다.',B:'셀린은 순례길로 돌아갔다. 뒤처진 사람 옆에 앉는 일은 끝나지 않았다.',C:'셀린은 서약한 마을마다 들러 아픈 사람을 돌본다. 서약하지 않은 마을도.'},
 ren:{A:'렌은 왕도 서고의 문을 다시 지킨다. 이번엔 누가 문을 열었는지 모두에게 말한다.',B:'렌은 지역의 기록을 서로 바꿔 보게 하는 일을 맡았다. 지운 기록은 이제 없다.',C:'렌은 서약의 기록을 지키는 문지기가 되었다.'},
 silva:{A:'실바는 왕실 사냥터를 맡았지만 숲으로 돌아가는 날이 더 많다.',B:'실바는 불타지 않는 숲으로 돌아갔다. 이제 숲에는 다시 사람이 산다.',C:'실바는 숲길을 지키며 서약한 사람들을 숲 너머로 안내한다.'},
 adel:{A:'아델은 새 왕관의 국경 초소를 다시 세웠다. 첫 보초는 그 자신이었다.',B:'아델은 돌우물 마을의 자경단장이 되었다. 길이 있는 한 지킬 사람도 있다.',C:'아델은 서약한 길가 마을들을 돌며 초소 대신 사람을 세웠다.'},
 gunnar:{A:'군나르는 새 왕관의 북부 수비대로 돌아갔다. 눈보라가 오면 서리목에 먼저 들른다.',B:'군나르는 서리목 마을에 남아 나무를 팼다. 마을 사람들은 그를 도끼잡이 촌장이라 부른다.',C:'군나르는 서약한 북부 마을들을 돌며 겨울을 나는 법을 가르쳤다.'}
};
// What the tavern keeper says when a hire is made (§4).
export const HIRE_LINES={
 bram:'자경단장이 군단에 서겠다는군. 마을은 남은 자경단이 지킨다니 걱정 말라고.',noa:'사냥꾼 녀석이 꼭 가겠대. 엘리나한테 질 수 없다나.',marta:'대장장이가 모루까지 챙겨 갔소. 장비 걱정은 덜겠군.',
 rowell:'국경 기병이라오. 떠난 이유는 묻지 말라더군. 말은 잘 탄다오.',sera:'철관성 창병대장이었소. 군단의 약속을 보고 왔다더군.',orin:'의회 학자요. 계약서 대신 약속을 지키는 데를 찾았다나.',
 celine:'순례 사제님이오. 다친 사람이 있는 곳이면 어디든 간다더군.',ren:'서고 문지기였다오. 비싸지만 값은 하오. 아는 게 많거든.',silva:'숲지기라오. 숲 밖으로 나온 건 처음이라더군.'
};
// The wandering hire's word at the stonewell tavern (§7).
export const WANDER_LINE={bram:'잿빛 마을 자경단은 젊은 놈들한테 맡겼다. 나는 길을 따라 여기까지 왔지.',noa:'숲길 따라 여기까지 왔어. 군단 소식 듣고 따라온 거 아니야. …아마.',marta:'모루 하나 지고 여기까지 왔다. 일거리가 있으면 망치질 하마.'};
