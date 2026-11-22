// v2.7.0 (D-158, the user's request 2026-11-22 22:46 「주민들도 주막이나 이런 곳은 조금 더 세련되게 옷을 입었으면」): the tavern's
// guests and the traveller by a small village's tavern door, in the existing painted clothes of the better dressed (D-094: extras
// reuse painted art). Each says a few lines in turn. Two guests: (4,5) and (7,5) are the only pair of tiles open in all fifteen
// tavern rooms that keeps every floor tile reachable. A leaf module (no imports).
export const TAVERN_PATRONS=[
 {id:'patron1',name:'상단 거간꾼',x:4,y:5,look:'councillor',lines:['길이 막히면 값이 오르고, 값이 오르면 사람이 굶지요. 길을 열어 주는 군대라니, 반가운 일이오.','철관성 강철이 좋다지만 요즘은 군수품으로 다 묶였다더군요. 장사꾼은 그런 데서 바람을 읽지요.']},
 {id:'patron2',name:'순례 중인 학자',x:7,y:5,look:'archivist',lines:['오래된 기록일수록 지운 자국이 많소. 지워진 자리를 읽는 법을 배워 두시오.','요즘 결계 이야기를 하는 사람이 부쩍 늘었소. 다들 무언가를 느끼는 게지.']}];
export const TAVERN_DOOR_GUEST={id:'doorguest',name:'주점 앞 나그네',x:1,y:9,look:'councillor',lines:['주점 안이 시끌시끌하오. 솜씨 좋은 떠돌이가 들렀다는 소문이 돌더군.','광장 게시판 보셨소? 관청 도장 찍힌 의뢰는 보수가 확실하다오.']};
