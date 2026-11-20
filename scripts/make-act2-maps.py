# v2.3.0 (D-129): draws the ACT II big maps (M07–M10) as terrain rows; the rows are copied into src/data/missions-v230.js.
# v2.3.1 (D-131): M11–M14 as well.
# Usage: python3 scripts/make-act2-maps.py <out.json>   (legend: src/data/game-data.js TERRAIN)
import json,sys
def grid(w,h,c): return [[c]*w for _ in range(h)]
def rect(g,x0,y0,x1,y1,c):
    for y in range(y0,y1+1):
        for x in range(x0,x1+1):
            if 0<=y<len(g) and 0<=x<len(g[0]): g[y][x]=c
def put(g,pts,c):
    for x,y in pts: g[y][x]=c
def rows(g): return [''.join(r) for r in g]
maps={}
# ---- M07 북부의 군령: valley road east, river with ice bridges, then north up to the Ironhold gate (NE) ----
W,H=30,14;g=grid(W,H,'n')
rect(g,0,0,W-1,1,'m');rect(g,0,12,W-1,13,'m')            # north and south ridges
rect(g,3,2,6,2,'f');rect(g,16,2,18,2,'f');rect(g,8,11,11,11,'f');rect(g,20,11,23,11,'f')
rect(g,5,4,6,4,'f');rect(g,10,9,10,10,'f');rect(g,18,9,19,9,'f')
rect(g,0,7,22,8,'r')                                       # valley road (2 wide)
rect(g,13,0,14,13,'w');rect(g,13,7,14,8,'i');rect(g,13,11,14,11,'i')   # river, ice bridge on the road, narrow ice ford
rect(g,21,2,22,8,'r')                                      # road climbs north
rect(g,21,2,27,3,'r')                                      # then east along the ridge foot to the gate
rect(g,24,0,29,1,'x');rect(g,28,2,29,6,'x')                # Ironhold walls
rect(g,26,0,27,1,'t')                                      # the gate (fort tiles) at the top of the road
rect(g,26,2,27,3,'r')
rect(g,24,5,26,6,'f');rect(g,25,9,28,10,'f')
maps[7]=g
# ---- M08 협곡 방어전: north canyon mouth + rear village to the south ----
W,H=22,20;g=grid(W,H,'n')
for y in range(0,10):
    w=3+ (y>=4)  # canyon floor half-width
    lo,hi=10-w-1,11+w+1
    rect(g,0,y,lo-1,y,'x');rect(g,hi+1,y,W-1,y,'x')
rect(g,10,0,11,19,'r')
rect(g,5,6,6,8,'m');rect(g,15,6,16,8,'m')                  # cliff ledges with the rockfall devices
rect(g,0,10,4,11,'m');rect(g,17,10,21,11,'m')
rect(g,7,9,8,9,'f');rect(g,13,9,14,9,'f')
rect(g,0,14,21,19,'g');rect(g,10,12,11,19,'r')
rect(g,2,15,5,17,'v');rect(g,16,15,19,17,'v');rect(g,3,16,4,16,'h')
rect(g,8,16,9,17,'f');rect(g,12,17,13,18,'f');rect(g,0,18,1,19,'f')
maps[8]=g
# ---- M09 자유의 도시: SW harbor → NE council hall, roofs and alleys ----
W,H=26,20;g=grid(W,H,'l')
rect(g,0,0,2,19,'w');rect(g,0,17,25,19,'w')                # sea to the west and south
rect(g,3,15,9,16,'r');rect(g,1,15,2,16,'b');rect(g,5,17,6,18,'b')   # docks
blocks=[(5,2,8,5),(11,1,14,4),(5,8,8,11),(11,7,14,10),(17,7,20,10),(5,13,8,13),(11,13,14,15),(17,12,20,15),(22,12,24,15),(17,1,18,4)]
for x0,y0,x1,y1 in blocks: rect(g,x0,y0,x1,y1,'o')
rect(g,9,0,10,19,'r');rect(g,3,11,25,11,'r');rect(g,15,0,16,16,'r');rect(g,3,6,25,6,'r')
rect(g,20,0,25,4,'x');rect(g,21,1,24,3,'k');rect(g,22,4,23,4,'k')   # council hall (walls, floor, door)
rect(g,3,15,9,16,'r');rect(g,3,12,4,14,'l');rect(g,23,7,25,10,'l')
rect(g,3,0,4,0,'x')
maps[9]=g
# ---- M10 두 영주의 전쟁: legion from the west, village in the middle, Oswin's fort north, Brennan's fort south ----
W,H=30,18;g=grid(W,H,'g')
rect(g,0,8,29,9,'r');rect(g,19,0,20,17,'r')
rect(g,15,0,24,3,'x');rect(g,16,1,23,2,'t');rect(g,19,3,20,3,'r')     # Oswin's fort
rect(g,15,14,24,17,'x');rect(g,16,15,23,16,'t');rect(g,19,14,20,14,'r') # Brennan's fort
rect(g,14,6,18,7,'v');rect(g,21,10,25,11,'v');rect(g,14,10,17,11,'v');rect(g,22,6,24,7,'v')
rect(g,27,0,29,17,'s');rect(g,29,0,29,17,'w')
rect(g,2,2,5,4,'f');rect(g,2,13,5,15,'f');rect(g,9,4,11,5,'f');rect(g,9,12,11,13,'f');rect(g,25,4,26,5,'f');rect(g,25,12,26,13,'f')
rect(g,7,0,9,1,'m');rect(g,7,16,9,17,'m');rect(g,1,8,1,9,'h')
maps[10]=g
# ---- M11 성화의 행렬: a switchback road from the south-west foot up to the sanctuary (top left), five braziers ----
W,H=24,20;g=grid(W,H,'g')
rect(g,0,0,W-1,0,'x');rect(g,3,0,9,2,'z');rect(g,0,1,2,1,'m');rect(g,10,1,23,1,'m')
# up the foot path, east to the first bend, up, back west, up to the sanctuary (row 2): 17 tiles for the leading pilgrim
road=[(4,y) for y in range(19,10,-1)]+[(x,11) for x in range(5,9)]+[(8,y) for y in range(10,6,-1)]+[(x,7) for x in range(7,5,-1)]+[(6,y) for y in range(6,2,-1)]
put(g,road,'r')
rect(g,0,2,2,8,'m');rect(g,11,2,14,4,'m');rect(g,16,2,23,3,'m');rect(g,20,4,23,6,'m')    # slopes
rect(g,8,3,9,5,'f');rect(g,1,10,2,13,'f');rect(g,12,6,15,9,'f');rect(g,17,10,21,13,'f');rect(g,7,13,9,15,'f');rect(g,13,15,16,17,'f');rect(g,19,16,23,19,'f')
rect(g,16,5,18,7,'f');rect(g,0,16,1,19,'f');rect(g,11,12,12,13,'m');rect(g,6,9,8,9,'f')
put(g,road,'r')
maps[11]=g
# ---- M12 침묵의 수도원: outer wall, cloister ring, courtyard, three record rooms to the north; the side gate SE ----
maps[12]=[list(r) for r in [
"xxxxxxxxxxxxxxxxxxxxxxxx",
"xkkkkkxxxkkkkkxxxkkkkkxx",
"xkkkkkxxxkkkkkxxxkkkkkxx",
"xxxkxxxxxxxkkxxxxxxkxxxx",
"xkkkkkkkkkkkkkkkkkkkkkkx",
"xkkkkkkkkkkkkkkkkkkkkkkx",
"xkkxxxkxxxxggxxxxkxxxkkx",
"xkkxggggggggggggggggxkkx",
"xkkkggggggggggggggggkkkx",
"xkkxggggggggggggggggxkkx",
"xkkkggggggggggggggggkkkx",
"xkkxggggggggggggggggxkkx",
"xkkxxxkxxxxggxxxxkxxxkkx",
"xkkkkkkkkkkkkkkkkkkkkkkx",
"xkkkkkkkkkkkkkkkkkkkkkkx",
"xxxxxxxxxxxxxxxxxxxkxxxx",
"gggfffggggggggggggrrrggg",
"ggffggggggggggggggrrrggf",
"gfffgggggggggggggrrrrgff",
"ffffggggggggggggrrrrrgff"]]
# ---- M13 검은 사자의 결단: the lion's host from the north road, the refugee camp low in the middle, hills east and west ----
W,H=28,18;g=grid(W,H,'g')
rect(g,12,0,15,0,'r');rect(g,13,1,14,10,'r')
rect(g,0,0,4,1,'m');rect(g,23,0,27,1,'m');rect(g,0,5,2,9,'m');rect(g,25,5,27,9,'m')   # hills the cavalry comes down
rect(g,5,0,9,2,'f');rect(g,18,0,22,2,'f');rect(g,3,3,5,4,'f');rect(g,22,3,24,4,'f');rect(g,6,6,8,7,'f');rect(g,19,6,21,7,'f')
rect(g,9,4,10,5,'x');rect(g,17,4,18,5,'x');rect(g,4,10,5,11,'x');rect(g,22,10,23,11,'x')                       # ruins (cover)
rect(g,10,11,17,16,'v');rect(g,13,13,14,14,'h');rect(g,9,12,9,15,'v');rect(g,18,12,18,15,'v')                 # refugee camp
rect(g,0,15,3,17,'f');rect(g,24,15,27,17,'f');rect(g,6,14,7,16,'f');rect(g,20,14,21,16,'f')
rect(g,11,10,16,10,'r');rect(g,0,12,8,12,'r');rect(g,19,12,27,12,'r')
maps[13]=g
# ---- M14 부서진 동맹: the council hall at the top, the square, the houses, the south gate, out to the bottom row ----
maps[14]=[list(r) for r in [
"xxxxxxxxxxxxxxxxxxxxxxxx",
"xxxxxkkkkkkkkkkkkkkxxxxx",
"xxxxxkkkkkkkkkkkkkkxxxxx",
"xxxxxkkkkkkkkkkkkkkxxxxx",
"lllllxkkkkkkkkkkkkxlllll",
"lxxlrrrrrrrrrrrrrrrrlxxl",
"lxxlrrggggggggggggrrlxxl",
"llllrgggggfggfgggggrllll",
"lxxlrggggggggggggggrlxxl",
"lxxlrrrrrrrrrrrrrrrrlxxl",
"llllggxxxggggggxxxggllll",
"lxxlggxxxggrrggxxxgglxxl",
"xxxxxxxxxxrrrrxxxxxxxxxx",
"ggffgggggrrrrrrgggggffgg",
"gfffgggggrrrrrrggggfffgg",
"ggfgggggrrrrrrrrgggggfgg",
"gggggggrrrrrrrrrrggggggg",
"ggggggrrrrrrrrrrrrgggggg"]]
json.dump({k:rows(v) for k,v in maps.items()},open(sys.argv[1],'w'),indent=0)
for k,v in maps.items():
    print(f'M{k:02d} {len(v[0])}x{len(v)}');print('\n'.join(rows(v)));print()
