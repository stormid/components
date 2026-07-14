const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Boilerplate > Functionality', { tag: '@all'}, () => {
	test("DOM elements should exist", async ({ page }) => {
        await expect(page.locator(".js-boilerplate")).toHaveCount(2);  
	});	

    test('should attach the click eventListener to DOMElement of each instance with click eventHandler to toggle className', async({ page }) => {
        const element = page.locator('.js-boilerplate').first();
		await element.click();
        await expect(element).toHaveClass(/clicked/);
		await element.click();
        await expect(element).not.toHaveClass(/clicked/);
    });
});

// Add further describe blocks for whichever categories apply to this component,
// following the 'Boilerplate > Category' naming convention, e.g.:
//   'Boilerplate > Keyboard' - keyboard-interaction and focus-management tests
//   'Boilerplate > Aria'     - aria attributes staying in sync (aria-controls / aria-expanded etc.)
// Only add what the component actually does. See toggle / modal / tabs for
// interactive examples, or textarea / skip for non-standard categories.

test.describe('Boilerplate > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

