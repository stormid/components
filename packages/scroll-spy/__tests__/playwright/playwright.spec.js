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
	test('Page should load at the top with the first nav link activated', async ({ page }) => {	
		expect(await page.evaluate(() => window.scrollY)).toBe(0);

		const firstSection = page.locator('#section1');
		await expect(firstSection).toBeInViewport();
		const matchingLink = page.locator('nav a[href="#section1"]');
		setTimeout(async () => {
			await expect(matchingLink).toHaveClass(/is--active/);
		}, 2000);
	});

	test('Page activate the link when section scrolled into view', async ({ page }) => {	
		const newSection = page.locator('#section3');
		const matchingLink = page.locator('nav a[href="#section3"]');

		await newSection.scrollIntoViewIfNeeded();
		await expect(matchingLink).toHaveClass(/is--active/);
	});
});

test.describe('Scroll spy > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

