const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Scroll points > Functionality', { tag: '@all'}, () => {
	test('Should not have any activated scroll points on page load', async ({ page }) => {	
		const activePoints = page.locator('.is--scrolled-in');
		expect(await activePoints.count()).toBe(0);
	});

	test('Should have at least one activated scroll point by the time the page has scrolled to the bottom', async ({ page }) => {	
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight));
		await page.waitForTimeout(5000);
		const activePoints = page.locator('.is--scrolled-in');
		expect(await activePoints.count()).toBeGreaterThan(0);
	});
});

test.describe('Scroll points > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});



