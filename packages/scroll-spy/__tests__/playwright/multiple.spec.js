const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/multiple.html');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Scroll spy > functionality', { tag: '@all'}, () => {
	test('Multiple links should be active when the page is loaded', async ({ page }) => {	
		const matchingLinks = page.locator('.is--active');		
		expect(await matchingLinks.count()).toBeGreaterThan(1);
	});
});

test.describe('Scroll spy > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

