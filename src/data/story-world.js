// v0.5.0 world-map interludes (D-052, W4): shown once at a new game and whenever the legion's hub
// changes. Narration uses only APPROVED_DIRECTION facts; region/place names are PROPOSED (renameable).
const w5=(text,world)=>({speaker:'chronicle',text,expression:'neutral',world});
const ACT1='ACT I · 불타는 국경',ACT2='ACT II · 세 개의 깃발',ACT3='ACT III · 왕관의 진실',ACT4='ACT IV · 잿빛 왕관';
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
 // v0.7.1 (D-071): toward the capital for the summit of the three banners.
 'world:summit':[w5('세 깃발이 처음으로 한자리에 모인다. 장소는 왕도 외곽, 어느 깃발의 땅도 아닌 폐허 역참.',{focus:'continent',from:'refuge',to:'summit',card:{act:ACT2,region:'왕도령',place:'폐허 역참'}})],
 // v0.9.0 (D-079): ACT III — into the capital, then west to the forgotten battlefield.
 'world:capital':[w5('부서진 회담장을 떠난 재의 군단은 장부의 끈을 따라 대륙의 한가운데로 향한다.',{focus:'continent',from:'summit',to:'capital'}),
  w5('왕도 아우렐리아. 이백 년 동안 왕관이 결계를 지켜 온 도시. 그 아래 하층가에는 피난민과 소문이 넘친다.',{focus:'center',prev:'continent',from:'summit',to:'capital',card:{act:ACT3,region:'왕도령',place:'왕도 하층가'}})],
 'world:fieldcamp':[w5('왕도 서쪽 평원. 3년 전 내전이 휩쓴 들판을, 근처 마을 사람 누구도 기억하지 못한다.',{focus:'center',from:'capital',to:'fieldcamp',card:{act:ACT3,region:'왕도령',place:'잊힌 전장'}})],
 // v0.9.1 (D-084): north to the guardians' keep, then south-east to the unburning forest.
 'world:keep':[w5('명부 첫 장의 이름들을 따라 군단은 왕도 북쪽 고원으로 오른다. 바람만 남은 곳에 수호자 성채가 서 있다.',{focus:'center',from:'oldfield',to:'guardkeep',card:{act:ACT3,region:'북쪽 고원',place:'수호자 성채'}})],
 'world:forest':[w5('결계 아래의 오래된 숲. 불이 붙지 않고, 숲지기들은 병도 굶주림도 모른다고 한다.',{focus:'center',from:'guardkeep',to:'unburning',card:{act:ACT3,region:'남동 숲',place:'불타지 않는 숲'}})],
 // v0.9.2 (D-089): back to the capital, down to the rite hall under the archive.
 'world:capital:return':[w5('숲을 떠난 군단은 다시 왕도로 돌아온다. 하층가에서는 피난민들이 하나둘 사라지고 있었다.',{focus:'center',from:'unburning',to:'undercroft',card:{act:ACT3,region:'왕도령',place:'왕도 지하 의식장'}})],
 // v0.10.0 (D-100): ACT IV — the alliance camp on the road below the capital, then east to the last border.
 'world:alliance':[w5('광장의 낭독 뒤, 세 깃발은 더는 서로를 상대로 싸울 이유를 잃었다.',{focus:'continent',from:'ashsquare',to:'alliancecamp'}),
  w5('왕도 아래 길목, 폐허 역참 자리에 연합 진영이 선다. 마지막 전쟁을 끝내기 위한 회의가 열린다.',{focus:'center',prev:'continent',from:'ashsquare',to:'alliancecamp',card:{act:ACT4,region:'왕도령',place:'연합 진영'}})],
 'world:border':[w5('결계가 국경부터 무너지기 시작했다. 대륙 동쪽 끝, 이야기가 시작된 그 국경으로.',{focus:'east',prev:'continent',from:'alliancecamp',to:'lastborder',card:{act:ACT4,region:'동부 변경',place:'최후의 국경 · 잿빛 마을'}})],
 'world:oathcamp':[w5('피난민과 함께 국경 관문을 넘었다. 왕실의 명령은 이제 그들 뒤에 있다.',{focus:'east',from:'fortress',to:'oathcamp',card:{act:ACT1,region:'동부 변경',place:'관문 너머 야영지'}})]
};
