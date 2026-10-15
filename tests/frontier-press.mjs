// Historical UX assertions continue through the new explicit entry/service choices.
export async function frontierPress(page,touch,action,id){
 const click=async(a,value)=>{const l=page.locator(`[data-do="${a}"]${value?`[data-id="${value}"]`:''}`).first();touch?await l.tap():await l.click();};
 if(action==='shop-service'&&!await page.locator('[data-do="shop-service"]').count())await click('shop-owner');
 if(action==='transaction'&&/^(sell-|upgrade)/.test(id)&&!await page.locator(`[data-do="transaction"][data-id="${id}"]`).count()){await click('shop-owner');await click('shop-service',id.startsWith('sell-')?'sell':'upgrade');}
 if(action==='warroom'){
  await click('warroom');
  await page.waitForFunction(()=>!window.AshenCrown.view().busy);
  for(let i=0;i<20&&await page.locator('[data-do="story-next"]').count();i++)await click('story-next');
  await click('advisor-operation');return;
 }
 await click(action,id);
 if(action==='walk'&&await page.locator('[data-do="enter-building"]').count())await click('close-modal');
 if(action==='place'&&await page.locator('[data-do="enter-building"]').count())await click('enter-building');
 if(action==='buy-preview')await click('purchase-hero',id.split('|')[0]+'|'+({ironBlade:'eric',huntingBow:'elina'}[id.split('|')[0]]||'eric'));
 if(action==='npc'&&await page.locator('[data-do="shop-service"]').count())await click('shop-service','buy');
 if(action==='shop-exit')await page.waitForFunction(()=>!window.AshenCrown.view().busy);
}
