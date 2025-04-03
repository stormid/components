const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

const tabLoop = async (page, selector) => {
	let focussed = page.locator(':focus');
	
	if(!await focussed.evaluate((el) => el.classList.contains(selector))) {
		let maxTabCount = 10; // Prevent infinite loop in case of failure

		/*Keep tabbing until the accept button is focused*/
		/* Different browsers and environments require different numbers */
		do {
			await page.keyboard.press(tabKey);
			focussed = page.locator(':focus');
			maxTabCount--;
		} while ((await focussed.count() === 0 || await focussed.evaluate((el, selector) => !el.classList.contains(selector))) && maxTabCount > 0);
	};
}

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

	
	test('Should re-open the banner if Update preferences links are used', async ({ page }) => {
		const banner = page.locator('.privacy-banner');
		const updateLink = page.locator('.js-preferences-update').first();
		const rejectAll = page.locator('.privacy-banner__reject').first();
		
		await rejectAll.click();
		await expect(banner).not.toBeVisible();
		await updateLink.click();
		await expect(banner).toBeVisible();
	});
});

test.describe('Cookie banner > Banner > Analytics', { tag: '@all'}, () => {

	test('Should add to the dataLayer when the banner is shown', async ({ page }) => {	
		expect(await page.evaluate(() => window.dataLayer.find(e => e.event === "stormcb_display"))).toBeDefined();
	});

	test('Should add to the datalayer when accept all is clicked', async ({ page }) => {	
		await page.locator('.privacy-banner__accept').first().click();
		const dataLayer = await page.evaluate(() => window.dataLayer);
 		expect(dataLayer.find(e => e.event === "stormcb_accept_all")).toBeDefined();
 		expect(dataLayer.find(e => e.stormcb_performance === 1)).toBeDefined();
 		expect(dataLayer.find(e => e.stormcb_ads === 1)).toBeDefined();
	});

	test('Should add to the datalayer when reject all is clicked', async ({ page }) => {	
		await page.locator('.privacy-banner__reject').first().click();
		const dataLayer = await page.evaluate(() => window.dataLayer);
 		expect(dataLayer.find(e => e.event === "stormcb_reject_all")).toBeDefined();
 		expect(dataLayer.find(e => e.stormcb_performance === 0)).toBeDefined();
 		expect(dataLayer.find(e => e.stormcb_ads === 0)).toBeDefined();
	});
	
});

test.describe('Cookie banner > Banner > keyboard', { tag: '@all'}, () => {
	test('If the banner is open, focus should move there first', async ({ page }) => {
		await page.keyboard.press(tabKey);
		expect(await page.evaluate(() => document.querySelector('.privacy-banner').contains(document.querySelector(':focus')))).toBeTruthy();
	});

	test('If the banner is open and trapTab is set, focus should not leave the banner', async ({ page }) => {
		for(let i = 0; i<=5; i++) {
			await page.keyboard.press(tabKey);
		}
		expect(await page.evaluate(() => document.querySelector('.privacy-banner').contains(document.querySelector(':focus')))).toBeTruthy();
	});

	test('Cookies can be accepted via keyboard', async ({ page, context }) => {
		const banner = page.locator('.privacy-banner');
		await page.keyboard.press(tabKey);
		await tabLoop(page, 'privacy-banner__accept');

		await page.keyboard.press('Enter');
		const cookies = await context.cookies();
		const preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');

		await expect(banner).not.toBeVisible();
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":1,"ads":1}}`));
	});

	test('Cookies can be rejected via keyboard', async ({ page, context }) => {
		const banner = page.locator('.privacy-banner');
		await page.keyboard.press(tabKey);
		await tabLoop(page, 'privacy-banner__reject');
		
		await page.keyboard.press('Enter');
		const cookies = await context.cookies();
		const preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');

		await expect(banner).not.toBeVisible();
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":0,"ads":0}}`));
	});
	
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
