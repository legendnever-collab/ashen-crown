// Original compositions for Ashen Crown (v0.4, 2026-10-17). Every melody, progression and
// arrangement here was written for this project; no samples, MIDI or recordings are used.
// Melody notation: "NOTE:eighths" tokens (e.g. "A4:3"), "-:n" is a rest. Each bar = 8 eighths.
const NAMES={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
export const midi=n=>{const m=/^([A-G](?:#|b)?)(-?\d)$/.exec(n);return m?12*(+m[2]+1)+NAMES[m[1]]:0;};
const melody=text=>text.trim().split(/\s+/).map(t=>{const [n,d]=t.split(':');return [n==='-'?0:midi(n),+d];});
const chords=text=>text.trim().split(/\s+/).map(c=>{const m=/^([A-G](?:#|b)?)(m|7|sus)?$/.exec(c);return {root:NAMES[m[1]],q:m[2]||'M'};});

export const SCORE={
 title:{name:'Ashes Before Dawn',tempo:72,lead:'flute',arp:'harp',pad:'pad',drums:null,gain:.9,
  chords:chords('Dm Bb F C Dm Gm Bb A'),
  melody:melody('A4:3 D5:1 E5:2 F5:2  F5:3 E5:1 D5:2 C5:2  C5:4 A4:2 C5:2  E5:6 -:2  A4:3 D5:1 E5:2 F5:2  G5:3 F5:1 E5:2 D5:2  D5:2 F5:2 E5:2 D5:2  C#5:6 -:2')},
 story:{name:'Secrets Beneath Stone',tempo:66,lead:'celesta',arp:null,pad:'pad',drums:null,gain:.8,
  chords:chords('Em C Am B Em C D B'),
  melody:melody('B4:4 E5:4  G5:4 E5:2 C5:2  A4:4 C5:2 E5:2  D#5:8  B4:2 E5:2 G5:2 B5:2  A5:4 G5:2 E5:2  F#5:4 D5:4  D#5:6 -:2')},
 village:{name:'Morning in Ashen Village',tempo:92,lead:'flute',arp:'harp',pad:'softpad',drums:null,gain:.8,
  chords:chords('F C Dm Bb F C Bb C'),
  melody:melody('C5:2 F5:2 A5:2 G5:2  E5:2 G5:2 C5:4  D5:2 F5:2 A5:2 F5:2  D5:4 Bb4:4  C5:2 F5:2 A5:2 C6:2  Bb5:2 A5:2 G5:4  F5:2 D5:2 Bb4:2 D5:2  C5:6 -:2')},
 camp:{name:'Embers at the Border',tempo:70,lead:'pluck',arp:null,pad:'softpad',drums:null,gain:.8,
  chords:chords('Am F C G Am F G E'),
  melody:melody('E5:4 C5:2 B4:2  A4:4 C5:4  E5:2 G5:2 E5:2 D5:2  D5:8  E5:4 A5:2 G5:2  F5:4 E5:2 C5:2  D5:4 B4:4  G#4:6 -:2')},
 shop:{name:'Hammer and Hearth',tempo:104,lead:'celesta',arp:'pluck',pad:null,drums:'light',gain:.75,
  chords:chords('G C D G Em C D G'),
  melody:melody('G5:2 B5:2 D6:2 B5:2  C6:2 E5:2 G5:4  A5:2 F#5:2 D5:2 F#5:2  G5:6 -:2  B5:2 G5:2 E5:2 G5:2  E5:2 C5:2 E5:2 G5:2  F#5:2 A5:2 D6:2 C6:2  B5:6 -:2')},
 departure:{name:'The Road We Choose',tempo:100,lead:'horn',arp:'harp',pad:'strings',drums:'march',gain:.85,
  chords:chords('D A Bm G D A G A'),
  melody:melody('D5:2 F#5:2 A5:3 F#5:1  E5:2 C#5:2 A4:4  B4:2 D5:2 F#5:2 B5:2  A5:4 G5:4  F#5:2 A5:2 D6:3 C#6:1  B5:2 A5:2 E5:4  G5:2 F#5:2 E5:2 D5:2  E5:6 -:2')},
 tension:{name:'Smoke Beyond the Watch',tempo:96,lead:'strings',arp:null,pad:'pad',drums:'heart',gain:.75,
  chords:chords('Gm Eb Cm D'),
  melody:melody('G4:4 Bb4:4  Eb5:4 D5:4  C5:2 Eb5:2 G5:4  F#5:8')},
 player:{name:'Defenders of the Border',tempo:120,lead:'horn',arp:'ostinato',pad:'strings',drums:'battle',gain:.85,
  chords:chords('Dm C Bb A Dm C Bb A'),
  melody:melody('D5:1 D5:1 A5:2 G5:1 F5:1 E5:2  E5:1 E5:1 G5:2 F5:1 E5:1 C5:2  D5:2 F5:2 Bb5:3 A5:1  A5:4 C#5:4  D5:1 D5:1 A5:2 G5:1 F5:1 E5:2  E5:1 F5:1 G5:2 A5:2 C6:2  Bb5:2 A5:2 G5:2 F5:2  E5:2 C#5:2 A4:4')},
 enemy:{name:'The Enemy Advances',tempo:116,lead:'strings',arp:'ostinato',pad:'lowpad',drums:'heavy',gain:.85,
  chords:chords('Cm Ab Bb G Cm Ab Bb G'),
  melody:melody('C5:2 Eb5:2 G5:2 Eb5:2  Ab5:4 G5:2 F5:2  F5:2 D5:2 Bb4:2 D5:2  B4:6 -:2  C5:1 C5:1 G5:2 Ab5:2 G5:2  Eb5:2 F5:2 Ab5:4  G5:2 F5:2 D5:2 Bb4:2  B4:4 D5:4')},
 crisis:{name:'The Last Crossing',tempo:128,lead:'strings',arp:'ostinato',pad:'strings',drums:'battle',gain:.85,
  chords:chords('Bm G A F#'),
  melody:melody('B4:1 D5:1 F#5:2 E5:1 D5:1 C#5:2  D5:2 B4:2 G5:4  A5:2 F#5:2 E5:2 C#5:2  F#5:4 A#4:4')},
 lion:{name:'The Black Lion',tempo:104,lead:'horn',arp:'ostinato',pad:'lowpad',drums:'heavy',gain:.85,
  chords:chords('Gm Eb Bb F Gm Eb D D'),
  melody:melody('G4:2 D5:2 G5:3 F5:1  Eb5:2 D5:2 Bb4:4  F5:2 D5:2 Bb4:2 C5:2  F4:6 -:2  G4:2 Bb4:2 D5:2 G5:2  G5:2 F5:2 Eb5:4  D5:2 C5:2 Bb4:2 A4:2  F#4:6 -:2')},
 oath:{name:'The Ashen Oath',tempo:112,lead:'horn',arp:'ostinato',pad:'strings',drums:'battle',gain:.85,
  chords:chords('Bm G D A Bm G Em F#'),
  melody:melody('B4:2 D5:2 F#5:3 E5:1  D5:2 C#5:2 B4:4  G5:2 F#5:2 E5:2 D5:2  C#5:6 -:2  B4:2 D5:2 F#5:2 B5:2  A5:3 G5:1 F#5:4  E5:2 G5:2 F#5:2 E5:2  F#5:6 -:2')},
 // v0.5 Phase F variations (original, 2026-10-20): hubs, the world map, the promotion rite and trials.
 campfire:{name:'Embers Under Pines',tempo:60,lead:'flute',arp:'pluck',pad:'softpad',drums:null,gain:.72,
  chords:chords('Am F C G Am Dm E Am'),
  melody:melody('E5:3 D5:1 C5:2 A4:2  C5:2 D5:2 E5:4  G5:3 E5:1 D5:2 C5:2  D5:6 -:2  E5:2 A5:2 G5:2 E5:2  F5:3 E5:1 D5:4  B4:2 C5:2 D5:2 E5:2  A4:6 -:2')},
 banner:{name:'Beneath the Ash Banner',tempo:84,lead:'horn',arp:'harp',pad:'strings',drums:null,gain:.78,
  chords:chords('Bm G D A G D Em F#'),
  melody:melody('F#5:4 E5:2 D5:2  B4:4 -:2 D5:2  A5:3 F#5:1 D5:2 E5:2  C#5:6 -:2  D5:2 E5:2 F#5:2 G5:2  A5:4 F#5:2 D5:2  G5:2 F#5:2 E5:2 D5:2  F#5:6 -:2')},
 rite:{name:'The Rank of Embers',tempo:76,lead:'celesta',arp:'harp',pad:'strings',drums:'march',gain:.8,
  chords:chords('D A Bm F#m G D Em A'),
  melody:melody('D5:2 F#5:2 A5:4  A5:2 G5:2 F#5:2 E5:2  F#5:3 E5:1 D5:2 B4:2  C#5:6 -:2  B4:2 D5:2 G5:2 F#5:2  F#5:2 E5:2 D5:4  E5:2 G5:2 F#5:2 E5:2  A5:6 -:2')},
 trial:{name:'Trial of the Legion',tempo:124,lead:'strings',arp:'ostinato',pad:'lowpad',drums:'battle',gain:.85,
  chords:chords('Dm Bb C A Dm Bb Gm A'),
  melody:melody('D5:1 D5:1 F5:2 A5:2 F5:2  Bb4:2 D5:2 F5:4  E5:2 G5:2 C5:2 E5:2  C#5:6 -:2  D5:2 A5:2 G5:2 F5:2  F5:2 D5:2 Bb4:4  Bb4:2 D5:2 G5:2 Bb5:2  A5:6 -:2')},
 chronicle:{name:'A Map of Erdia',tempo:70,lead:'flute',arp:'harp',pad:'pad',drums:null,gain:.8,
  chords:chords('C G Am F C Em F G'),
  melody:melody('G4:2 C5:2 E5:4  D5:2 B4:2 G4:4  A4:2 C5:2 E5:2 A5:2  F5:6 -:2  E5:2 G5:2 C6:4  B5:2 G5:2 E5:4  F5:2 A5:2 G5:2 F5:2  G5:6 -:2')},
 // v0.6.1 ACT II (original, 2026-10-26; D-055 §7): the northern march (castle town, M07–M08 battles), Velmar's
 // market square (Velmar hub) and the two lords' field (M10 player phase).
 northmarch:{name:'Banners in the Snow',tempo:100,lead:'horn',arp:'ostinato',pad:'strings',drums:'march',gain:.82,
  chords:chords('Gm Eb Bb F Gm Cm D7 D'),
  melody:melody('G4:2 Bb4:2 D5:3 C5:1  Bb4:2 G4:2 Eb5:4  D5:2 F5:2 Bb5:3 A5:1  A5:2 F5:2 C5:4  D5:1 D5:1 G5:2 Bb5:2 A5:2  G5:2 Eb5:2 C5:4  F#5:2 A5:2 C6:2 A5:2  F#5:6 -:2')},
 freecity:{name:'Lanterns over Velmar',tempo:104,lead:'pluck',arp:'harp',pad:'softpad',drums:null,gain:.78,
  chords:chords('D C G D Bm G A7 D'),
  melody:melody('F#5:2 A5:2 D6:2 A5:2  G5:2 E5:2 C5:4  B4:2 D5:2 G5:3 F#5:1  F#5:4 D5:4  B4:1 C#5:1 D5:2 F#5:2 B5:2  A5:2 G5:2 D5:4  E5:2 G5:2 C#6:2 A5:2  D6:6 -:2')},
 threeway:{name:'Two Banners, One Field',tempo:132,lead:'strings',arp:'ostinato',pad:'lowpad',drums:'battle',gain:.85,
  chords:chords('Cm Ab Bb G Cm Fm G7 G'),
  melody:melody('C5:1 Eb5:1 G5:2 C6:2 G5:2  Ab5:2 Eb5:2 C5:4  D5:2 F5:2 Bb5:2 F5:2  B4:6 -:2  G5:1 G5:1 Eb5:2 C5:2 Eb5:2  F5:2 Ab5:2 C6:4  B5:2 G5:2 F5:2 D5:2  G5:6 -:2')},
 // v0.7.0 ACT II part 2 (original, 2026-10-27; D-068 §8): the Sacred Flame's procession hymn (pilgrim village, M11 player
 // phase) and the silent monastery (M12 until the bell rings).
 procession:{name:'Procession of the Sacred Flame',tempo:76,lead:'flute',arp:'harp',pad:'pad',drums:null,gain:.8,
  chords:chords('F C Dm Bb F Gm C F'),
  melody:melody('A4:2 C5:2 F5:4  E5:2 D5:2 C5:4  D5:2 F5:2 A5:3 G5:1  F5:6 -:2  Bb4:2 D5:2 F5:2 D5:2  G5:2 F5:2 E5:2 D5:2  C5:2 E5:2 G5:2 Bb5:2  A5:6 -:2')},
 silence:{name:'The Silent Monastery',tempo:84,lead:'pluck',arp:'pluck',pad:'lowpad',drums:null,gain:.72,
  chords:chords('Am Am F E Am Dm E E'),
  melody:melody('E5:2 -:2 A4:2 C5:2  B4:4 -:4  C5:2 -:2 F5:2 E5:2  G#4:6 -:2  A4:2 -:2 E5:2 D5:2  F5:4 -:4  E5:2 D5:2 C5:2 B4:2  G#4:6 -:2')},
 // v0.7.1 (original, 2026-10-27; D-068 §8): the black lion's decision (M13, M14 player phase).
 lionresolve:{name:"The Black Lion's Decision",tempo:112,lead:'horn',arp:'ostinato',pad:'strings',drums:'march',gain:.84,
  chords:chords('Dm Bb F C Dm Gm A A7'),
  melody:melody('D5:2 F5:2 A5:3 G5:1  F5:2 D5:2 Bb4:4  C5:2 F5:2 A5:2 C6:2  C6:2 Bb5:2 G5:4  F5:1 G5:1 A5:2 D6:2 C6:2  Bb5:2 G5:2 D5:4  E5:2 A5:2 C#6:2 E6:2  A5:6 -:2')},
 fortress:{name:'Halls of the Quartermaster',tempo:108,lead:'horn',arp:'ostinato',pad:'lowpad',drums:'battle',gain:.85,
  chords:chords('Em D C B Em D C B'),
  melody:melody('E5:2 B4:2 E5:2 G5:2  F#5:2 D5:2 A4:4  G5:2 E5:2 C5:2 E5:2  D#5:6 -:2  E5:1 F#5:1 G5:2 A5:2 B5:2  A5:2 F#5:2 D5:4  C5:2 E5:2 G5:2 E5:2  B4:6 -:2')}
};
export const MOTIF=SCORE.title.melody.map(([n])=>n);
// Hub ambience (D-052): village / garrison & fortress / night bivouac / oath camp.
const hubMusic=hub=>!hub||hub.startsWith('village')?'village':hub==='bivouac'||hub==='march'?'campfire':hub==='oathcamp'?'banner':hub==='castletown'?'northmarch':hub==='velmar'?'freecity':hub==='pilgrim'?'procession':hub==='refuge'?'campfire':hub==='summit'?'banner':'camp';
export const musicScene=s=>s.narrative?.active?(s.narrative.active.key==='raid'?'tension':s.narrative.active.key.startsWith('world:')?'chronicle':s.narrative.active.key.startsWith('promo:')?'rite':s.narrative.active.key.startsWith('pre:')?'story':s.frontier?.hub&&!s.frontier.hub.startsWith('village')?hubMusic(s.frontier.hub):'story'):s.screen==='title'?'title':s.screen==='exploration'?hubMusic(s.frontier?.hub):s.skirmish?.kind==='trial'&&s.screen==='battle'?'trial':['warroom','deployment'].includes(s.screen)?'departure':s.screen!=='battle'?'story':s.missionId===6?(s.phase==='enemy'?'enemy':'oath'):s.missionId===10?(s.phase==='enemy'?'enemy':'threeway'):s.missionId===12&&(s.missionState?.alert||0)<2?'silence':s.missionId===3||s.units.some(u=>u.team==='civilian'&&!u.rescued&&u.hp>0&&u.hp<u.maxHP/2)?'crisis':s.phase==='enemy'?'enemy':s.missionId===4?'fortress':s.missionId===5?'lion':s.missionId===7||s.missionId===8?'northmarch':s.missionId===11?'procession':s.missionId===13||s.missionId===14?'lionresolve':'player';
