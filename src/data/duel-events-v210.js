// v2.1 일기토 이벤트 (D-118, docs/v2.1.0/TAVERN_WORLD_DESIGN.md §2; pairs and lines PROPOSED). A duel is no longer asked
// for from a menu: when one of `heroes` stands beside `foe` (a story-linked enemy lead) on the player's phase, the two
// exchange a word and the 잿빛 결투장 opens with 받는다 / 물러선다. One time per pair and battle.
// `key` is the story key (the existing story duels keep theirs and their outcomes); `from` = the first turn it may happen;
// `flag` = a missionState flag set when it fires (the story duels' duelDone, read by their mission rules).
// New pairs bring their own two lines (speaker, text, expression).
export const DUEL_EVENTS={
 1:[{key:'duel:1:garr',foe:'boss',heroes:['eric','elina'],lines:[['garr','군단 꼬마들이 칼을 들었군. 네 마을은 내가 불태웠다. 와라, 받아 주마.','determined'],['eric','마을은 다시 지어. 너는 여기서 멈춘다.','determined']]}],
 5:[{key:'duel:5:baldrick',foe:'boss',heroes:['eric'],lines:[['baldrick','어린 기사. 국경을 넘은 자는 사자의 이빨을 본다. 칼을 들어라.','determined'],['eric','국경을 지키는 건 나도 같습니다. 받겠습니다.','determined']]}],
 9:[{key:'duel:9:chief',foe:'boss',heroes:['kai'],lines:[['chief','그림자 길에서 떨어져 나간 놈이 군단의 개가 됐다더니. 칼끝은 아직 녹슬지 않았나?','determined'],['kai','녹슬었는지는 네가 알게 되겠지.','determined']]}],
 10:[{key:'duel:10:oswin',foe:'boss',heroes:['eric'],lines:[['oswin','군단이 영주들의 싸움에 끼어든다고? 칼로 말해 보게, 젊은 기사.','determined'],['eric','싸움을 멈추러 왔습니다. 칼이 필요하다면 받겠습니다.','determined']]},
  {key:'duel:10:brennan',foe:'boss2',heroes:['eric'],lines:[['brennan','청백 깃발 편이냐, 우리 편이냐. 칼끝으로 정하지!','determined'],['eric','어느 깃발 편도 아닙니다. 사람 편입니다.','determined']]}],
 12:[{key:'duel:12:abbot',foe:'boss',heroes:['lia','sain'],lines:[['abbot','침묵의 서약을 깬 자들이여. 말로 하지 않겠다면, 칼로 답하라.','determined'],['lia','기록을 숨긴 침묵이라면, 깨야죠.','determined']]}],
 13:[{key:'duel:13:baldrick',foe:'boss',heroes:['eric','thea'],lines:[['baldrick','결단의 날이다. 네 칼이 무엇을 지키는지 다시 보자.','determined'],['eric','그때와 같습니다. 사람입니다.','determined']]}],
 16:[{key:'16:duel',foe:'cap',heroes:['eric'],from:3,flag:'duelDone'}],
 18:[{key:'duel:18:logger',foe:'lcap',heroes:['elina'],lines:[['logger','숲 하나 베는 데 무슨 사연이 그리 많아. 활잡이, 비켜라.','determined'],['elina','이 숲은 불에도 타지 않았어요. 당신 도끼로도 안 됩니다.','determined']]}],
 19:[{key:'duel:19:overseer',foe:'ov',heroes:['lia'],lines:[['overseer','스승의 의식을 끝까지 잇지 못한 제자로군. 내가 대신 끝내 주마.','determined'],['lia','스승님이 끝내지 못한 건, 끝내면 안 되는 것이었어요.','determined']]}],
 20:[{key:'20:duel',foe:'sup',heroes:['kai'],from:2,flag:'duelDone'}],
 21:[{key:'21:duel',foe:'rc',heroes:['eric'],from:2,flag:'duelDone'}],
 25:[{key:'duel:25:hardliner',foe:'hc',heroes:['eric','thea'],lines:[['hardliner','동맹을 판 건 우리가 아니다. 약한 깃발이었지. 칼로 증명해 주마.','determined'],['thea','약한 깃발은 없어요. 등을 돌린 사람이 있을 뿐.','determined']]}],
 26:[{key:'26:duel',foe:'boss',heroes:['eric'],from:2,flag:'duelDone'}],
 29:[{key:'29:duel',foe:'boss',heroes:['eric'],from:2,flag:'duelDone',phase:1}]
};
// Speakers the new pairs need (the game's own figures, D-094: busts fall back to existing art).
export const DUEL_SPEAKERS={garr:'가르',chief:'그림자 자객 우두머리',logger:'벌목대장',overseer:'의식 감독관'};
