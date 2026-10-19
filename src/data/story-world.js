// v0.5.0 world-map interludes (D-052, W4): shown once at a new game and whenever the legion's hub
// changes. Narration uses only APPROVED_DIRECTION facts; region/place names are PROPOSED (renameable).
const w5=(text,world)=>({speaker:'chronicle',text,expression:'neutral',world});
const ACT1='ACT I · 불타는 국경';
export const STORY_WORLD={
 'world:intro':[
  w5('에르디아. 이백 년 전, 아우렐리우스가 한 왕관 아래 하나로 묶은 대륙.',{focus:'continent',to:'village'}),
  w5('왕관의 결계 아래, 대륙은 오랫동안 큰 전쟁 없이 살아왔다.',{focus:'continent',to:'village'}),
  w5('대륙 동쪽 끝, 왕도에서 가장 먼 국경. 잿빛 마을에 아침이 온다.',{focus:'east',prev:'continent',to:'village',card:{act:ACT1,region:'동부 변경',place:'잿빛 마을'}})
 ],
 'world:camp':[w5('불탄 마을을 뒤로하고 국경 수비대 진영으로. 숲으로 달아난 습격자들의 흔적이 북쪽으로 이어진다.',{focus:'east',from:'village',to:'camp',card:{act:ACT1,region:'동부 변경',place:'국경 수비대 진영'}})],
 'world:bivouac':[w5('무너진 다리를 건넌 밤. 수비대는 강 건너 숲가에 야영을 친다.',{focus:'east',from:'camp',to:'bivouac',card:{act:ACT1,region:'동부 변경',place:'강가 야영'}})],
 'world:fortress':[w5('버려진 성채의 장부를 손에 넣었다. 수비대는 그 성채를 임시 거점으로 삼는다.',{focus:'east',from:'bivouac',to:'fortress',card:{act:ACT1,region:'동부 변경',place:'버려진 성채'}})],
 'world:oathcamp':[w5('피난민과 함께 국경 관문을 넘었다. 왕실의 명령은 이제 그들 뒤에 있다.',{focus:'east',from:'fortress',to:'oathcamp',card:{act:ACT1,region:'동부 변경',place:'관문 너머 야영지'}})]
};
