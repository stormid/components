const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";

	await page.keyboard.press(tabKey);
	await page.keyboard.press('Enter');
});

test.describe('Skip > Hash change events', { tag: '@all'}, async () => {

	test('should focus on content from skip link', async ({page}) => {
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveId('content');
	});

	test('should focus on content from hash change event', async ({page}) => {
		await page.evaluate(() => {
			window.location.hash = '#test-2';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveId('test-2');
	});

	test('should ignore any hashes that do not match element ids', async ({page}) => {
		await page.evaluate(() => {
			window.location.hash = '#not-matched';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveId('content');
	});

});

test.describe('Skip > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

