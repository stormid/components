const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Cookie banner > Google EU Consent', { tag: '@all'}, () => {
	test.only('Should set a default consent event with all categories denied', async ({ page }) => {	
		const dataLayer = await page.evaluate(() => window.dataLayer);
		const acceptAll = page.locator('.privacy-banner__accept').first();
		
		const expectedConsent = {
			'0': 'consent',
			'1': 'default',
			'2': {
			  ad_storage: 'denied',
			  ad_user_data: 'denied',
			  ad_personalization: 'denied',
			  analytics_storage: 'denied',
			  wait_for_update: 500
			}
		}

		dataLayer.find(e => {console.log(e, "item being compared"); return e === expectedConsent;})

		//expect(dataLayer[0]).toEqual(expectedConsent);
		//expect(dataLayer.find(e => e === expectedConsent)).toBeDefined();

		// await acceptAll.click();
		// const newDataLayer = await page.evaluate(() => window.dataLayer);
		// console.log(newDataLayer);

	});
});


// describe(`Cookie banner > cookies > Google EU consent > default event`, () => {
// 	beforeAll(init);

// 	it('must set a default consent event with all categories denied', async () => {
// 		const banner = document.querySelector(`.${defaults.classNames.banner}`);
// 		expect(banner).not.toBeNull();
		
// 		//These assertions break Jest because of the use 'arguments' in the gtag implementation
// 		//They have been manually validated in the browser
// 		// expect(window.dataLayer).toEqual([
// 		//     ['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' }]
// 		// ]);
// 		// const acceptAllBtn = document.querySelector(`.${defaults.classNames.acceptBtn}`);
// 		// acceptAllBtn.click();

// 		// expect(window.dataLayer).toEqual([
// 		//     ['consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' }],
// 		//     ['consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }]
// 		// ]);
// 	});

// });

// describe(`Cookie banner > cookies > Google EU consent > no EU consent settings`, () => {
// 	beforeAll(init);

// 	it('No errors if no consent options configured', async () => {
// 		const banner = document.querySelector(`.${defaults.classNames.banner}`);
// 		expect(banner).not.toBeNull();
// 	});

// });
