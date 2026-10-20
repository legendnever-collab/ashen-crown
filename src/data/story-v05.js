// v0.5.0 promotion rite and trial dialogue — PROPOSED wording within approved canon (D-047/D-048):
// Aren grants the ranks as commander of the Ashen Legion; no new backstory or lore is introduced.
const say5=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V05={
 'skirmish:101:intro':[say5('aren','에릭, 훈련병들이 네 뒤에 있다. 두 출구 사이를 지켜.'),say5('eric','방패를 세우면 아무도 못 지나간다.','determined')],
 'skirmish:102:intro':[say5('aren','엘리나, 빠른 놈들이 다섯. 숲에서 기다려라.'),say5('elina','들어오는 순간 발을 묶을게요.','determined')],
 'skirmish:103:intro':[say5('aren','리아, 수호상엔 칼이 잘 안 먹힌다. 에릭이 붙어 줄 거다.'),say5('lia','땅에 룬을 새기면 저 돌덩이들도 약해질 거예요.','determined')],
 'skirmish:104:intro':[say5('aren','세인, 에릭과 카이가 다쳐서 걷지 못한다. 둘을 데려와.','concerned'),say5('sain','부르면 와요. 제가 길이 될게요.','determined')],
 'skirmish:105:intro':[say5('aren','카이, 파수꾼이 문을 막고 있다. 정면으론 못 뚫어.'),say5('kai','막혀 있으면 바꾸면 되지. 저 녀석 자리, 잠깐 빌릴게.')],
 'skirmish:110:intro':[say5('aren','오늘은 실전처럼 한다. 다치지 않을 만큼만, 그러나 진지하게.'),say5('lia','모의전 부대 여덟. 보급병 둘은 구출하면 좋아요.')],
 'promo:eric':[say5('aren','에릭. 오늘부터 너를 재의 군단 수호기사로 부른다.'),say5('eric','…이번엔 끝까지 지키겠습니다. 모두를.','determined'),say5('aren','알고 있다. 그래서 맡기는 거다.')],
 'promo:elina':[say5('aren','엘리나, 군단의 레인저. 네 눈이 우리의 경계선이다.'),say5('elina','믿어 주는 만큼은 지킬게요. 화살 끝까지요.','determined')],
 'promo:lia':[say5('aren','리아, 비전술사. 군사로서도, 마도사로서도 네 판단을 믿는다.'),say5('lia','룬은 땅에 남아요. 우리 군단이 지나간 자리처럼요.','determined')],
 'promo:sain':[say5('aren','세인, 성화 사제. 네가 부르면 군단은 돌아온다.'),say5('sain','누구도 혼자 남겨두지 않을게요. 그게 제 맹세예요.','determined')],
 'promo:kai':[say5('aren','카이, 그림자 추적자. 이제는 군단의 그림자다.'),say5('kai','그림자는 주인을 안 버리지. …뭐, 그런 셈 치자고.')]
};
