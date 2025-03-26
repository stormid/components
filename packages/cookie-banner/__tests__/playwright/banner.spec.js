const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page, context }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Cookie banner > Banner > functionality', { tag: '@all'}, () => {
	test('Should render the banner', async ({ page }) => {	
		const banner = page.locator('.privacy-banner');
		await expect(banner).toHaveCount(1);
		await expect(banner).toBeVisible();
	});

	test('Should hide the banner and update preferences when cookies are accepted', async ({ page, context }) => {	
		const banner = page.locator('.privacy-banner');
		const acceptAll = page.locator('.privacy-banner__accept').first();

		await expect(banner).toBeVisible();
		
		await acceptAll.click();
		const cookies = await context.cookies();
		const preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');

		await expect(banner).not.toBeVisible();
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":1,"ads":1}}`));
	});

	test('Should hide the banner and update preferences when cookies are rejected', async ({ page, context }) => {	
		const banner = page.locator('.privacy-banner');
		const rejectAll = page.locator('.privacy-banner__reject').first();
		
		await rejectAll.click();
		const cookies = await context.cookies();
		const preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');

		await expect(banner).not.toBeVisible();
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":0,"ads":0}}`));
	});
	
});

test.describe('Cookie banner > Banner > keyboard', { tag: '@all'}, () => {

});

test.describe('Cookie banner > Banner > Aria', { tag: '@all'}, () => {
	test('Banner should have the appropriate aria attributes', async ({ page }) => {	
		const banner = page.locator('.privacy-banner');
		await expect(banner).toHaveAttribute('role', 'region');
		await expect(banner).toHaveAttribute('aria-live', 'polite');
		await expect(banner).toHaveAttribute('aria-label');
	});
});

test.describe('Cookie banner > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});


// describe(`Cookie banner > DOM > interactions`, () => {
//     beforeAll(init);
    
//     

// });

//  it('Sets a cookie based on preferences form', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1}}`)}`);

// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
// 		fields[1].checked = true;
// 		fields[3].checked = true;
// 		document.querySelector(`.${defaults.classNames.submitBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
// 	});

//  it('Should reject all cookies whe the reject button is clicked', async () => {
// 		document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
// 	});

// describe(`Cookie banner > Analytics > Data layer additions`, () => {
// 	beforeAll(init);

// 	it('It should add to the dataLayer when the banner is shown', async () => {
// 		expect(dataLayer.find(e => e.event === "stormcb_display")).toBeDefined();
// 	});

// 	it('It should add to the datalayer when accept all is clicked', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(dataLayer.find(e => e.event === "stormcb_accept_all")).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_performance === 1)).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_test === 1)).toBeDefined();
// 	});

// 	it('It should add to the datalayer when reject all is clicked', async () => {
// 		instance.showBanner();
// 		document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
// 		expect(dataLayer.find(e => e.event === "stormcb_reject_all")).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_performance === 0)).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_test === 0)).toBeDefined();
// 	});
// });

