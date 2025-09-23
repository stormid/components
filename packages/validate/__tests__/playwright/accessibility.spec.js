const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});


test.describe('Validate > Accessibility > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

test.describe('Validate > Accessibility > focus', { tag: '@all'}, () => {
	test('Should focus on the first invalid field in a form post-validation', async ({ page }) => {	
		await page.goto('/mini.html');
		await page.click('#submitTest');
		const fNameInput = page.locator('#fname');
		await expect(fNameInput).toBeFocused();
	});
});
