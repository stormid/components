const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Boilerplate', { tag: '@reduced'}, () => {
	test("DOM elements should exist", async ({ page }) => {
        await expect(page.locator(".js-boilerplate")).toHaveCount(2);  
	});	

    test('should attach the click eventListener to DOMElement of each instance with click eventHandler to toggle className', async({ page }) => {
        const element = page.locator('.js-boilerplate');
		await element.click();
        await expect(element).toHaveClass(/clicked/);
		await element.click();
        await expect(element).not.toHaveClass(/clicked/);
    });
});

test.describe('Boilerplate > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

