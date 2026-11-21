# v2.5.0 (D-141): draws the ACT IV big maps (M23–M26) as terrain rows; the rows are copied into src/data/missions-v250.js.
# Usage: python3 scripts/make-act4-maps.py <out.json>   (legend: src/data/game-data.js TERRAIN)
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
# ---- M23 전쟁의 끝을 향해: the alliance camp at night. A palisade with four gates round the three council tents in the
# middle (Iron west, Free east, Flame south); the north forest where the raid captain comes from; causeways through the
# marsh to the east and west fences; the south road over the river bridge to the Flame tent.
W,H=26,20;g=grid(W,H,'g')
rect(g,0,0,W-1,2,'f');put(g,[(4,0),(5,0),(19,1),(20,1),(8,2),(17,2)],'g')                 # the north forest, glades
rect(g,12,0,13,4,'r')                                                                      # the north road
rect(g,0,6,4,13,'s');rect(g,21,6,25,13,'s');rect(g,0,9,5,10,'r');rect(g,20,9,25,10,'r')    # marsh, the causeways
rect(g,5,4,20,4,'x');rect(g,5,15,20,15,'x');rect(g,5,4,5,15,'x');rect(g,20,4,20,15,'x')    # the palisade
put(g,[(12,4),(13,4),(12,15),(13,15),(5,9),(5,10),(20,9),(20,10)],'r')                      # its four gates
rect(g,6,9,19,10,'r');rect(g,12,5,13,14,'r')                                               # the camp's cross roads
for (x0,y0,x1,y1) in [(7,5,8,6),(17,5,18,6),(7,13,8,14),(17,13,18,14)]: rect(g,x0,y0,x1,y1,'v')   # supply tents
rect(g,0,17,25,18,'w');put(g,[(12,17),(13,17),(12,18),(13,18)],'b');rect(g,12,16,13,16,'r');rect(g,12,19,13,19,'r')   # river, bridge
for (x0,y0,x1,y1) in [(1,3,2,4),(23,3,24,4),(2,15,3,16),(22,15,23,16),(8,19,10,19),(16,19,18,19)]: rect(g,x0,y0,x1,y1,'f')
maps[23]=g
# ---- M24 최후의 국경: the pass comes down from the north (already under the ash when the tide starts — m.ashBase rows),
# the lower slope where the refugees walk, the wall with the two-tile gate, the village inside.
W,H=20,24;g=grid(W,H,'g')
rect(g,0,0,W-1,9,'m');rect(g,8,0,11,9,'r');rect(g,6,3,13,6,'g');rect(g,3,7,16,9,'g')       # the upper pass and its road
rect(g,0,10,1,17,'f');rect(g,18,10,19,17,'f');put(g,[(5,12),(14,12),(4,15),(15,15),(3,11),(16,11)],'f')   # the side woods
rect(g,9,10,10,17,'r');rect(g,8,13,11,13,'r')                                             # the road down to the gate
put(g,[(6,14),(13,14),(7,11),(12,11)],'x')                                                 # boulders
rect(g,0,18,W-1,18,'x');rect(g,9,18,10,18,'k')                                             # the wall, the gate (9–10, 18)
rect(g,0,19,W-1,23,'g');rect(g,9,19,10,23,'r');rect(g,3,20,16,20,'r')
for (x0,y0) in [(0,19),(17,19),(1,22),(16,22),(5,22),(12,22)]: rect(g,x0,y0,x0+2,y0+1,'v')
maps[24]=g
# ---- M25 세 왕가의 깃발: the old summit field. The hardliners' north camp behind a palisade; the west and east camps of the
# other two banners behind their own fences; the legion at the south crossroads; ridges between the camps.
W,H=30,20;g=grid(W,H,'g')
rect(g,8,0,21,5,'g');rect(g,8,5,21,5,'x');rect(g,8,0,8,5,'x');rect(g,21,0,21,5,'x');put(g,[(14,5),(15,5),(8,3),(21,3)],'r')   # north camp
for (x0,y0) in [(10,1),(17,1)]: rect(g,x0,y0,x0+2,y0,'v')
rect(g,0,7,6,14,'g');rect(g,6,7,6,14,'x');rect(g,0,7,6,7,'x');rect(g,0,14,6,14,'x');put(g,[(6,10),(6,11)],'r')                # west camp
rect(g,23,7,29,14,'g');rect(g,23,7,23,14,'x');rect(g,23,7,29,7,'x');rect(g,23,14,29,14,'x');put(g,[(23,10),(23,11)],'r')      # east camp
put(g,[(1,8),(2,8),(1,13),(2,13)],'v');put(g,[(27,8),(28,8),(27,13),(28,13)],'v')
rect(g,14,6,15,19,'r');rect(g,7,10,22,11,'r');rect(g,3,16,26,16,'r');rect(g,3,15,3,16,'r');rect(g,26,15,26,16,'r')            # roads
rect(g,9,7,11,8,'m');rect(g,18,7,20,8,'m');rect(g,9,13,11,14,'m');rect(g,18,13,20,14,'m')                                      # ridges
for (x0,y0,x1,y1) in [(0,0,5,4),(24,0,29,4),(0,17,4,19),(25,17,29,19),(6,18,10,19),(19,18,23,19),(12,13,12,14),(17,13,17,14)]: rect(g,x0,y0,x1,y1,'f')
put(g,[(0,0),(29,0)],'g')
maps[25]=g
# ---- M26 검은 사자의 마지막 전투: the Lion's Pass. The lion camp at the top; two ways up — the broad wagon road that
# winds through the west, the narrow rock path straight up the east; the legion at the foot.
W,H=22,24;g=grid(W,H,'m')
rect(g,4,0,17,4,'g');put(g,[(6,1),(7,1),(14,1),(15,1),(6,3),(15,3)],'v');put(g,[(10,0),(11,0)],'r')   # the lion camp (tents; no fort — a fort heals and Baldrick must stay at half)
rect(g,3,5,18,6,'g')                                                                       # the brow
rect(g,4,7,6,12,'r');rect(g,3,7,7,12,'g');rect(g,4,7,5,12,'r')                             # the wagon road down the west...
rect(g,5,12,12,13,'r');rect(g,4,12,13,14,'g');rect(g,5,12,12,13,'r')                       # ...across...
rect(g,9,14,12,20,'g');rect(g,10,14,11,20,'r')                                             # ...and down to the foot
rect(g,15,7,16,14,'g');rect(g,16,7,16,14,'r');rect(g,14,14,16,15,'g')                      # the rock path (east, narrow)
rect(g,4,20,17,23,'g');rect(g,10,20,11,23,'r');rect(g,13,15,14,19,'g')                     # the foot, the legion's camp
for (x0,y0,x1,y1) in [(4,5,5,6),(16,5,17,6),(3,10,3,11),(7,8,7,9),(12,16,12,17),(5,21,6,22),(15,21,16,22)]: rect(g,x0,y0,x1,y1,'f')
put(g,[(8,9),(8,10),(13,8),(13,9)],'g');put(g,[(14,10),(14,11)],'g')                       # side slopes (the riders' way down)
maps[26]=g
# ---- v2.5.1: M27 왕도의 성문 — two fronts below the wall: the straight ram road up the west to the gate (8–9, 5); the east
# field below the three ladders (20, 24, 28); a ridge between the fronts; the city behind the rampart (row 4).
W,H=32,22;g=grid(W,H,'g')
rect(g,0,0,W-1,3,'k')
for (x0,y0) in [(1,0),(5,1),(12,0),(16,1),(22,0),(27,1)]: rect(g,x0,y0,x0+2,y0,'l')
rect(g,0,4,W-1,4,'q');rect(g,0,5,W-1,5,'x');put(g,[(8,5),(9,5)],'k');put(g,[(20,5),(24,5),(28,5)],'q')      # rampart, wall, gate, ladders
rect(g,8,6,9,21,'r')                                                                       # the ram road
rect(g,13,9,15,14,'m');put(g,[(14,9),(14,14)],'g')                                         # the ridge between the fronts
for (x0,y0,x1,y1) in [(1,8,2,9),(4,13,5,14),(0,19,1,21),(17,7,18,8),(30,8,31,10),(21,12,22,13),(27,14,28,15),(30,19,31,21),(16,18,17,19),(11,16,11,17)]: rect(g,x0,y0,x1,y1,'f')
put(g,[(3,10),(12,11),(19,16),(26,10)],'x')                                                # rubble
maps[27]=g
# ---- M28 잿빛 밤의 진실: the palace of memory — the legion and young Aren in the great hall; the oath fragment in the west
# wing, the king's in the east wing, the order's in the north wing; the night gate to the south.
W,H=26,22;g=grid(W,H,'x')
rect(g,9,9,16,17,'k');rect(g,9,1,16,7,'k');rect(g,11,8,14,8,'k');rect(g,1,6,7,16,'k');rect(g,8,11,8,13,'k');rect(g,18,6,24,16,'k');rect(g,17,11,17,13,'k')
rect(g,11,18,14,21,'k');rect(g,12,18,13,21,'r')
put(g,[(10,10),(15,10),(10,16),(15,16),(3,7),(5,14),(20,7),(22,14),(10,3),(15,3),(4,11),(21,11)],'x')                # pillars
maps[28]=g
# ---- M29 왕관의 심장: the heart chamber — Bellard's dais in the middle; the rite points on the ring round it (by the M22 path);
# four doors in the outer wall (north, west, east, south); the banners and the legion come in by the south door.
W,H=26,24;g=grid(W,H,'k')
rect(g,0,0,W-1,0,'x');rect(g,0,H-1,W-1,H-1,'x');rect(g,0,0,0,H-1,'x');rect(g,W-1,0,W-1,H-1,'x')
put(g,[(12,0),(13,0),(0,15),(0,16),(25,15),(25,16),(12,23),(13,23)],'k')                   # the four doors
rect(g,12,7,13,10,'z');rect(g,11,8,14,9,'z')                                               # the dais
put(g,[(7,9),(18,9),(5,5),(20,5),(5,19),(20,19),(9,4),(16,4),(7,15),(18,15),(1,1),(24,1)],'x')                   # pillars
maps[29]=g
# ---- M30 왕관 없는 새벽: the dawn courtyard — the ward heart in the south middle; the ash comes over the whole north edge and
# through the five breaches in the broken wall (row 6); the three banners hold the west, the middle and the east.
W,H=30,18;g=grid(W,H,'g')
rect(g,0,0,1,1,'f');rect(g,28,0,29,1,'f');put(g,[(8,2),(21,2),(5,4),(24,4)],'x');rect(g,14,0,15,5,'r')
rect(g,0,6,W-1,6,'x');put(g,[(3,6),(4,6),(9,6),(10,6),(14,6),(15,6),(19,6),(20,6),(25,6),(26,6)],'g')            # the broken wall, five breaches
rect(g,0,7,W-1,17,'k');put(g,[(6,9),(23,9),(10,12),(19,12),(3,14),(26,14)],'x');rect(g,0,17,8,17,'x');rect(g,21,17,29,17,'x')
maps[30]=g
json.dump({k:rows(v) for k,v in maps.items()},open(sys.argv[1] if len(sys.argv)>1 else '/dev/stdout','w'),indent=1,ensure_ascii=False)
if len(sys.argv)>1:
    for k,v in maps.items(): print(k,len(v[0]),'x',len(v));print('\n'.join(rows(v)))
