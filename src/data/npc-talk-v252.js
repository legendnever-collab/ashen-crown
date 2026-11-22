// v2.5.2 (the user's request 2026-11-22: clicking a person walks there and talks; a person with a service shows a small menu —
// 대화 or the service). The people behind a counter or a board had nothing to say before; these are their 「대화」 lines,
// one after another on each talk. A leaf module (no imports).
export const SERVICE_TALK={
 tavern:[
  '어서 오시오. 용병들은 저쪽 탁자에 모여 있소. 쓸 만한 사람을 찾으면 말씀하시오.',
  '전쟁 소식은 술보다 빨리 돌지. 군단 이야기도 벌써 여기까지 왔소.',
  '빈속으로 싸우러 가지 마시오. 국 한 그릇은 그냥 드리리다.'],
 weapon:[
  '날은 세워 두었소. 싸움이 끝나면 다시 가져오시오.',
  '좋은 칼보다 손에 맞는 칼이 사람을 살리오.',
  '방패 가장자리가 패였군. 오래 버틴 방패요.'],
 item:[
  '회복약은 넉넉히 챙기시오. 전장에선 사러 올 수 없으니.',
  '해독약은 늪 근처에서 다들 찾소. 하나쯤 넣어 두시오.',
  '연막은 도망칠 때보다 사람을 데리고 나올 때 쓰는 거요.'],
 requests:[
  '마을 일이 산더미요. 게시판을 한번 봐 주시오.',
  '작은 일이라도 군단이 맡아 주면 사람들이 밤에 잠을 자오.',
  '현상금 붙은 놈들은 본편 싸움이 끝날 때마다 다시 모여들지.']
};
// the label of the service button in the person's menu
export const SERVICE_LABEL={tavern:'인재 확보',weapon:'거래',item:'거래',stall:'거래',requests:'의뢰 게시판'};
export const serviceOf=n=>n?.service||(n?.services?'stall':null);
