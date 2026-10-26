// v0.5.0 world-map interludes (D-052, W4): shown once at a new game and whenever the legion's hub
// changes. Narration uses only APPROVED_DIRECTION facts; region/place names are PROPOSED (renameable).
const w5=(text,world)=>({speaker:'chronicle',text,expression:'neutral',world});
const ACT1='ACT I · 불타는 국경',ACT2='ACT II · 세 개의 깃발';
export const STORY_WORLD={
 'world:intro':[
  w5('에르디아. 이백 년 전, 아우렐리우스가 한 왕관 아래 하나로 묶은 대륙.',{focus:'continent',to:'village'}),
  w5('왕관의 결계 아래, 대륙은 오랫동안 큰 전쟁 없이 살아왔다.',{focus:'continent',to:'village'}),
  w5('대륙 동쪽 끝, 왕도에서 가장 먼 국경. 잿빛 마을에 아침이 온다.',{focus:'east',prev:'continent',to:'village',card:{act:ACT1,region:'동부 변경',place:'잿빛 마을'}})
 ],
 'world:camp':[w5('불탄 마을을 뒤로하고 국경 수비대 진영으로. 숲으로 달아난 습격자들의 흔적이 북쪽으로 이어진다.',{focus:'east',from:'village',to:'camp',card:{act:ACT1,region:'동부 변경',place:'국경 수비대 진영'}})],
 'world:bivouac':[w5('무너진 다리를 건넌 밤. 수비대는 강 건너 숲가에 야영을 친다.',{focus:'east',from:'camp',to:'bivouac',card:{act:ACT1,region:'동부 변경',place:'강가 야영'}})],
 'world:fortress':[w5('버려진 성채의 장부를 손에 넣었다. 수비대는 그 성채를 임시 거점으로 삼는다.',{focus:'east',from:'bivouac',to:'fortress',card:{act:ACT1,region:'동부 변경',place:'버려진 성채'}})],
 'world:castletown':[
  w5('관문 너머, 재의 군단에게는 돌아갈 곳이 없었다. 피난민이 머물 땅을 찾아 군단은 북쪽으로 향한다.',{focus:'continent',from:'oathcamp',to:'castletown'}),
  w5('대륙에는 세 개의 깃발이 오르고 있다. 북쪽의 철왕관, 서쪽의 자유 영주들, 남쪽의 성화.',{focus:'continent',from:'oathcamp',to:'castletown'}),
  w5('첫 번째 깃발 아래, 철관성의 성하 마을. 질서는 피난처를 주는 대신 무언가를 요구한다.',{focus:'north',prev:'continent',from:'oathcamp',to:'castletown',card:{act:ACT2,region:'철왕관 통령령',place:'철관성 성하 마을'}})
 ],
 'world:march':[w5('회색 협곡을 지켜 낸 밤. 군단은 협곡 아래에 야영을 친다. 서쪽으로, 자유도시 벨마르로 가는 길이 보인다.',{focus:'north',from:'castletown',to:'march',card:{act:ACT2,region:'철왕관 통령령',place:'협곡 야영지'}})],
 'world:velmar':[
  w5('협곡을 지나 서쪽으로. 철왕관의 길이 끝나는 곳에 자유 영주들의 땅이 펼쳐진다.',{focus:'continent',from:'march',to:'velmar'}),
  w5('두 번째 깃발 아래, 항구 도시 벨마르. 이 도시는 누구에게도 무릎 꿇지 않는다. 대신 누구도 지켜 주지 않는다.',{focus:'west',prev:'continent',from:'march',to:'velmar',card:{act:ACT2,region:'자유도시 연맹',place:'자유도시 벨마르'}})
 ],
 // v0.7 (D-068): the third banner.
 'world:pilgrim':[
  w5('벨마르를 떠나 남쪽으로. 들판이 끝나는 곳, 언덕 위 대성당의 불빛이 밤새 꺼지지 않는다.',{focus:'continent',from:'velmar',to:'pilgrim'}),
  w5('세 번째 깃발 아래, 성화 대성당 아래의 순례자 마을. 이곳은 누구에게나 빵을 나눈다. 그리고 맹세를 묻는다.',{focus:'south',prev:'continent',from:'velmar',to:'pilgrim',card:{act:ACT2,region:'성화령',place:'순례자 마을'}})
 ],
 'world:refuge':[w5('침묵의 수도원에서 돌아온 밤. 군단은 순례자 마을 아래 언덕에 피난민과 함께 야영을 친다.',{focus:'south',from:'pilgrim',to:'refuge',card:{act:ACT2,region:'성화령',place:'피난민 야영지'}})],
 'world:oathcamp':[w5('피난민과 함께 국경 관문을 넘었다. 왕실의 명령은 이제 그들 뒤에 있다.',{focus:'east',from:'fortress',to:'oathcamp',card:{act:ACT1,region:'동부 변경',place:'관문 너머 야영지'}})]
};
