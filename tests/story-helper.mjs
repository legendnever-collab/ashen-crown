// Settle shipped story and the explicit departure confirmation through visible UI.
export async function drainStory(page){for(let i=0;i<100;i++){await page.waitForFunction(()=>!window.AshenCrown?.view().busy,{},{timeout:30000});if(await page.locator('[data-do="advisor-operation"]').count()){await page.locator('[data-do="advisor-operation"]').click();continue;}if(await page.locator('[data-do="confirm-battle"]').count()){await page.locator('[data-do="confirm-battle"]').click();continue;}if(!await page.locator('[data-do="story-next"]').count())break;await page.locator('[data-do="story-next"]').click();}}

// Existing tactical suites enter preparation through the real advisor workflow.
export async function enterWarCouncil(page,touch=false){
 const press=async action=>{const el=page.locator(`[data-do="${action}"]`).first();touch?await el.tap():await el.click();};
 if(await page.locator('[data-do="advisor-locate"]').count()){await press('advisor-locate');await drainStory(page);await press('advisor-operation');}
 else await press('warroom');
 await drainStory(page);
}
