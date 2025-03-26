const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

// test.describe('Cookie banner > Axe', { tag: '@reduced'}, () => {
// 	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
// 		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
// 		expect(accessibilityScanResults.violations).toEqual([]);
// 	});
// });

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
