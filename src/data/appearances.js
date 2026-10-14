export const APPEARANCE_TIERS={
 eric:[{tier:1,name:'Border Knight',available:true},{tier:2,name:'Guardian Mantle',available:true,level:5},{tier:3,name:'Awakened Guardian',available:false}],
 elina:[{tier:1,name:'Frontier Scout',available:true},{tier:2,name:'Advanced',available:false},{tier:3,name:'Awakened',available:false}],
 lia:[{tier:1,name:'Wandering Mage',available:true},{tier:2,name:'Advanced',available:false},{tier:3,name:'Awakened',available:false}],
 sain:[{tier:1,name:'Refugee Healer',available:true},{tier:2,name:'Advanced',available:false},{tier:3,name:'Awakened',available:false}],
 kai:[{tier:1,name:'Unknown Traveler',available:true},{tier:2,name:'Advanced',available:false},{tier:3,name:'Awakened',available:false}]
};
export function appearanceFor(u){const requested=Math.max(u.appearanceTier||1,u.classTier||1,u.storyTier||1,u.id==='eric'&&u.level>=5?2:1);return [...(APPEARANCE_TIERS[u.id]||[{tier:1,available:true}])].reverse().find(t=>t.available&&t.tier<=requested);}
