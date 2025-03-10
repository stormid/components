const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Outliner', { tag: '@all'}, () => {
	
    test('should attach a mousedown eventListener that adds a className to the documentElement', async ({ page }) => {
        await page.mouse.click(0, 0);
		expect(await page.evaluate(() => document.documentElement.classList.contains('no-outline'))).toEqual(true);
    });

	test('Example links should have no visible outline when clicked', async ({ page }) => {
        const linktest = page.locator('button').first();
		await linktest.click();
		await expect(linktest).toHaveCSS('outline-style', 'none');
    });

    test('should attach a keydown eventListener that removes the className', async ({ page }) => {
		await page.keyboard.press(tabKey);
		expect(await page.evaluate(() => document.documentElement.classList.contains('no-outline'))).toEqual(false);
	});

	test('Example should have visible outline when tabbed to', async ({ page }) => {
		const linktest = page.locator('button').first();
		await page.keyboard.press(tabKey);
		await expect(linktest).toHaveCSS('outline-style', 'solid');
	});
});

test.describe('Outliner > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

