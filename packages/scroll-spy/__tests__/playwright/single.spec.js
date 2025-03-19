const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Scroll spy > functionality', { tag: '@all'}, () => {
	test('Activate the first link when page is loaded', async ({ page }) => {	
		const matchingLink = page.locator('nav a[href="#section1"]');		
		await expect(matchingLink).toHaveClass(/is--active/);
	});

	test('Activate the link when section scrolled into view', async ({ page }) => {	
		const matchingLink = page.locator('nav a[href="#section5"]');		
		await page.evaluate(() => window.scrollBy(0, 500));
		await expect(matchingLink).toHaveClass(/is--active/);
	});

	test('Only one link should be active when the page is loaded', async ({ page }) => {	
		const matchingLinks = page.locator('.is--active');		
		expect(await matchingLinks.count()).toBe(1);
	});

	test('Only one link should be active when the page is scrolled', async ({ page }) => {	
		await page.evaluate(() => window.scrollBy(0, 500));
		const matchingLinks = page.locator('.is--active');		
		expect(await matchingLinks.count()).toBe(1);
	});

	test('Activate the last link when the page is at the bottom, even if not intersecting top of window', async ({ page }) => {	
		const matchingLink = page.locator('nav a[href="#section3"]');		
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight));
		await expect(matchingLink).toHaveClass(/is--active/);
	});
});

test.describe('Scroll spy > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

