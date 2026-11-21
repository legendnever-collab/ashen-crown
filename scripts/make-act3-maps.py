# v2.4.0 (D-135): draws the ACT III big maps (M15–M18) as terrain rows; the rows are copied into src/data/missions-v240.js.
# Usage: python3 scripts/make-act3-maps.py <out.json>   (legend: src/data/game-data.js TERRAIN)
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
# ---- M15 사라진 기록: the upper city. In from the south bridges over the canal; the chancellery annex in the middle;
# the three gates at the north-west corner, the west edge and the east edge. Houses (walls) with rooftops between streets.
W,H=28,20;g=grid(W,H,'l')
rect(g,0,0,W-1,0,'x');rect(g,0,0,0,H-1,'x');rect(g,W-1,0,W-1,H-1,'x')      # city wall
rect(g,1,0,2,0,'r')                                                          # NW gate (1,0)
rect(g,0,8,0,9,'r');rect(g,W-1,8,W-1,9,'r')                                  # W gate (0,8), E gate (27,8)
rect(g,1,1,26,2,'r');rect(g,1,8,26,9,'r');rect(g,13,1,14,13,'r')             # north street, gate street, the long avenue
rect(g,4,1,5,13,'r');rect(g,22,1,23,13,'r')                                  # west and east streets
for (x0,y0,x1,y1) in [(7,3,11,6),(16,3,20,6),(7,10,11,12),(16,10,20,12),(1,3,3,6),(24,3,26,6),(1,10,3,12),(24,10,26,12)]:
    rect(g,x0,y0,x1,y1,'x');rect(g,x0,y0,x1,y0,'o')                          # houses, their roofs on the street side
rect(g,10,4,17,7,'x');rect(g,11,5,16,6,'k');put(g,[(13,4),(14,4),(13,7),(14,7),(10,5),(17,6)],'k')   # the chancellery annex and its doors
rect(g,8,4,9,5,'o');rect(g,18,5,19,6,'o')                                    # roofs the cloaks use
rect(g,1,14,26,15,'w');put(g,[(4,14),(4,15),(13,14),(14,14),(13,15),(14,15),(23,14),(23,15)],'b')  # canal, three bridges
rect(g,1,16,26,19,'l');rect(g,1,16,26,16,'r');rect(g,12,16,15,19,'r')
for (x0,y0,x1,y1) in [(2,17,4,18),(7,17,9,18),(18,17,20,18),(23,17,25,18)]: rect(g,x0,y0,x1,y1,'v')
rect(g,1,13,26,13,'r')                                                       # canal-side street
maps[15]=g
# ---- M16 잊힌 전장: west → east through the fog. Grave hill in the west, broken trenches and stakes across the field,
# the old camp at the east end. A stream with two fords in the middle.
W,H=30,18;g=grid(W,H,'g')
rect(g,0,0,W-1,0,'m');rect(g,0,17,W-1,17,'m');rect(g,0,0,3,2,'m');rect(g,0,15,2,17,'m')
for (x0,y0,x1,y1) in [(1,5,2,6),(1,10,2,11),(5,3,5,4),(6,13,6,14)]: rect(g,x0,y0,x1,y1,'v')   # the grave hill's markers
rect(g,0,7,29,8,'r');rect(g,8,8,8,13,'r');rect(g,20,3,20,8,'r')               # the old military road, side tracks
for (x0,y0,x1,y1) in [(9,2,9,5),(10,11,10,14),(17,1,17,4),(17,11,17,15),(23,4,23,6),(24,10,24,13)]: rect(g,x0,y0,x1,y1,'x')  # trenches
for (x0,y0,x1,y1) in [(6,1,8,2),(11,14,13,16),(18,13,21,15),(25,1,27,2),(26,14,28,15),(12,3,13,4),(3,12,4,13)]: rect(g,x0,y0,x1,y1,'f')
rect(g,14,0,15,17,'w');put(g,[(14,7),(15,7),(14,8),(15,8),(14,13),(15,13)],'b')      # the stream, the road ford, a south ford
rect(g,25,5,28,11,'t');rect(g,26,6,27,10,'k');put(g,[(25,8),(25,7)],'r')     # the old camp
rect(g,29,1,29,16,'x')
maps[16]=g
# ---- M17 수호자의 맹세: the keep at the north (archive at the very top), the outer yard, the south gate, breaches in the
# west and east walls.
W,H=26,22;g=grid(W,H,'g')
rect(g,0,0,W-1,0,'x');rect(g,0,0,0,10,'x');rect(g,W-1,0,W-1,10,'x')
rect(g,1,1,24,9,'k')                                                          # keep floor; the archive niche at the top (11–14, 1)
rect(g,1,2,10,2,'x');rect(g,15,2,24,2,'x');rect(g,9,1,9,2,'x');rect(g,16,1,16,2,'x')   # the archive hall's walls
rect(g,1,6,8,6,'x');rect(g,17,6,24,6,'x');put(g,[(4,6),(21,6)],'k')            # inner wall of the courtyard
rect(g,1,10,24,10,'x');put(g,[(11,10),(12,10),(13,10),(14,10)],'k')          # the keep's south wall and its gate
rect(g,0,10,0,21,'m');rect(g,W-1,10,W-1,21,'m')
put(g,[(3,10),(22,10)],'q');rect(g,1,9,3,9,'q');rect(g,22,9,24,9,'q')        # ramparts over the side breaches
rect(g,0,12,1,13,'g');rect(g,W-2,12,W-1,13,'g')                              # the west and east breaches (in through the hills)
rect(g,1,11,24,21,'g');rect(g,12,11,13,21,'r');rect(g,4,14,21,14,'r')        # the outer yard, roads
for (x0,y0,x1,y1) in [(2,16,4,18),(21,16,23,18),(7,11,8,12),(17,11,18,12),(9,18,10,20),(15,18,16,20)]: rect(g,x0,y0,x1,y1,'f')
rect(g,6,16,7,17,'x');rect(g,18,16,19,17,'x')                                 # ruined towers
rect(g,1,21,10,21,'m');rect(g,15,21,24,21,'m')                                # the south gate between the hills
maps[17]=g
# ---- M18 불타지 않는 숲: the ward in the middle with three old trees; forest all round; paths in from the four edges.
W,H=26,22;g=grid(W,H,'f')
rect(g,9,7,16,14,'g')                                                         # the ward's clearing
rect(g,0,10,25,11,'r');rect(g,12,0,13,21,'r')                                 # the cross paths
for (x0,y0,x1,y1) in [(3,3,6,5),(19,3,22,5),(3,16,6,18),(19,16,22,18),(8,1,10,2),(15,19,17,20),(1,8,2,9),(23,12,24,13)]: rect(g,x0,y0,x1,y1,'g')   # glades
for (x0,y0,x1,y1) in [(4,7,5,8),(20,7,21,8),(4,13,5,14),(20,13,21,14)]: rect(g,x0,y0,x1,y1,'g')
for (x0,y0,x1,y1) in [(0,0,1,1),(24,0,25,1),(0,20,1,21),(24,20,25,21),(16,2,17,3),(7,18,8,19)]: rect(g,x0,y0,x1,y1,'m')
put(g,[(3,4),(22,4),(4,17),(21,17)],'v')                                     # the keepers' huts
rect(g,10,8,15,13,'g')
maps[18]=g
# ---- v2.4.1 (D-135): M19–M22 ----
# M19 금지된 의식: down the stair at the top into a vault of four chambers (a circle each) round a water channel; the
# overseer and Lia's teacher in the bottom chamber.
W,H=28,20;g=grid(W,H,'x')
rect(g,12,0,15,1,'k')                                                         # the stair down (the legion's way in)
rect(g,2,2,25,3,'k')                                                          # the upper hall
for (x0,y0,x1,y1) in [(2,5,8,9),(19,5,25,9),(2,12,8,16),(19,12,25,16)]: rect(g,x0,y0,x1,y1,'k')   # four chambers
rect(g,5,4,5,4,'k');rect(g,22,4,22,4,'k');rect(g,9,7,10,7,'k');rect(g,17,7,18,7,'k')              # doors up and in
rect(g,11,4,16,17,'k');rect(g,9,14,10,14,'k');rect(g,17,14,18,14,'k')       # the central gallery and the lower doors
rect(g,1,10,26,11,'w');put(g,[(13,10),(14,10),(13,11),(14,11),(5,10),(5,11),(22,10),(22,11)],'b')   # the channel, three bridges
rect(g,2,10,8,11,'w');rect(g,19,10,25,11,'w');put(g,[(5,10),(5,11),(22,10),(22,11)],'b')
rect(g,11,17,16,18,'k');rect(g,12,18,15,18,'z')                               # the bottom chamber (overseer, teacher)
put(g,[(12,8),(15,8),(12,13),(15,13)],'x')                                    # pillars
maps[19]=g
# M20 왕관의 그림자: the chancellery archive to the north, the canal with two bridges, the burning lower city to the south
# (houses in pairs so the fire leaps rather than sweeps), the south gate where the banner's soldiers come in.
W,H=28,22;g=grid(W,H,'l')
rect(g,0,0,W-1,0,'x');rect(g,0,0,0,7,'x');rect(g,W-1,0,W-1,7,'x')
rect(g,1,1,26,5,'k');rect(g,1,6,26,7,'x');put(g,[(6,6),(6,7),(13,6),(14,6),(13,7),(14,7),(21,6),(21,7)],'k')   # archive, its doors
rect(g,9,1,9,3,'x');rect(g,18,1,18,3,'x')                                     # stacks dividing the halls
rect(g,0,8,27,9,'r')                                                          # the archive street (the legion's start)
rect(g,0,10,27,11,'w');put(g,[(7,10),(7,11),(20,10),(20,11)],'b')            # the canal, two bridges
rect(g,0,12,27,12,'r');rect(g,13,12,14,21,'r')
for (x0,y0) in [(2,14),(6,14),(10,14),(16,14),(20,14),(24,14),(2,18),(6,18),(10,18),(16,18),(20,18),(24,18)]: rect(g,x0,y0,x0+1,y0+1,'v')
rect(g,0,21,12,21,'x');rect(g,15,21,27,21,'x')                                # the south wall, the gate at 13–14
maps[20]=g
# M21 마지막 국왕: the palace of the crown's heart. The throne dais in the middle, four wings to the corners with an anchor
# stone at each end; in from the south hall.
W,H=24,24;g=grid(W,H,'x')
rect(g,5,5,18,18,'k');rect(g,10,10,13,13,'z')                                # the great hall, the throne dais
for (x0,y0,x1,y1) in [(1,1,6,6),(17,1,22,6),(1,17,6,22),(17,17,22,22)]: rect(g,x0,y0,x1,y1,'k')   # the four wings
rect(g,5,5,6,6,'k');rect(g,17,5,18,6,'k');rect(g,5,17,6,18,'k');rect(g,17,17,18,18,'k')
for (x,y) in [(8,8),(15,8),(8,15),(15,15)]: put(g,[(x,y)],'x')               # pillars
rect(g,10,19,13,23,'k');rect(g,10,0,13,4,'k')                                 # south hall (the legion), north hall (reinforcements)
rect(g,0,11,4,12,'k');rect(g,19,11,23,12,'k')                                 # side passages
maps[21]=g
# M22 잿빛 선택: the lower-city square with the three daises; the chancellery's north gate, the east and west roads, the
# south street where the allied banners come in.
W,H=28,22;g=grid(W,H,'l')
rect(g,0,0,W-1,0,'x');rect(g,12,0,15,0,'r')                                  # north gate
rect(g,6,4,21,15,'k')                                                         # the square
put(g,[(9,10),(18,10),(13,13),(14,13)],'z')                                   # daises (records W, plan E, the king's words S)
rect(g,0,9,5,10,'r');rect(g,22,9,27,10,'r')                                  # east and west roads
rect(g,12,1,15,3,'r');rect(g,12,16,15,21,'r')                                 # north and south streets
for (x0,y0) in [(1,1),(1,5),(1,13),(1,17),(23,1),(23,5),(23,13),(23,17),(7,18),(18,18),(7,1),(18,1)]: rect(g,x0,y0,x0+2,y0+1,'v')
rect(g,0,21,11,21,'x');rect(g,16,21,27,21,'x')
maps[22]=g
json.dump({k:rows(v) for k,v in maps.items()},open(sys.argv[1] if len(sys.argv)>1 else '/dev/stdout','w'),indent=1,ensure_ascii=False)
if len(sys.argv)>1:
    for k,v in maps.items(): print(k,len(v[0]),'x',len(v));print('\n'.join(rows(v)))
