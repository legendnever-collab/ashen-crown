// v2.6.1 (the user's request 2026-11-22 22:33: 「중요한 용병이 있는 마을은 은근슬쩍 힌트를」): the first time the legion walks
// into a town where someone worth meeting waits — a hero to rescue through the elder's requests, or notable wanderers at the
// tavern — one of the five says a word about the rumour. Once per town (flag hint_<hub>); a rescue hint only while that hero
// has not joined. A leaf module (no imports).
export const TOWN_HINTS={
 stonewell:{hero:'adel',lines:[['kai','이 근처 초소에 창 하나로 끝까지 버티는 기사가 있다던데. 광장 의뢰 게시판에 가 보면 무슨 소식이 있을지도.','neutral'],['eric','…버티고 있다면, 누군가 가 줘야겠지.','determined']]},
 frost:{hero:'gunnar',lines:[['elina','눈보라 속에서 도끼 한 자루로 늑대 떼를 막아 낸 사내 이야기를 들었어요. 이 마을 사람들은 알고 있을 거예요.','neutral']]},
 moss:{hero:'maren',lines:[['lia','안개 낀 숲길을 혼자 다니는 약초꾼이 있다고 들었어. 그런 사람이라면 길을 알 텐데… 광장 의뢰 게시판에 소식이 있을지 보자.','neutral']]},
 beacon:{hero:'luka',lines:[['sain','국경 수도원에 남은 젊은 약사가 있다는 이야기를 들었어요. 아직 무사하다면… 마을 분들께 물어봐야겠어요.','concerned']]},
 lamp:{lines:[['kai','등불골 주점에 솜씨 좋은 떠돌이들이 묵어 간다는 소문이야. 한번 들러 보자고.','neutral']]},
 lionspring:{lines:[['kai','사자샘 주점에 이름난 떠돌이가 와 있다던데. 운이 좋으면 만날 수 있겠어.','neutral']]}
};
