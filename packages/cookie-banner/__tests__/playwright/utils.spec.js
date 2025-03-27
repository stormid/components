const { test, expect } = require('@playwright/test');

test.describe('Cookie banner > IFrame ', { tag: '@all'}, () => {
	// test('Should render the banner', async ({ page }) => {	
	// 	const banner = page.locator('.privacy-banner');
	// 	await expect(banner).toHaveCount(1);
	// 	await expect(banner).toBeVisible();
	// });
});

test.describe('Cookie banner > GA', { tag: '@all'}, () => {
	// test('Should add to the dataLayer when the banner is shown', async ({ page }) => {	
	// 	expect(await page.evaluate(() => window.dataLayer.find(e => e.event === "stormcb_display"))).toBeDefined();
	// });
});

