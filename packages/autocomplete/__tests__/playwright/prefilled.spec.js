const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Autocomplete > Functionality', { tag: '@all'}, () => {

	test('Should restore a server-rendered value/label into the combobox and hidden field on load', async ({ page }) => {
		const container = page.locator('.js-autocomplete-prefilled');
		const input = page.locator('#prefilled');

		//the label shows in the visible combobox, the value submits via the hidden field
		await expect(input).toHaveValue('United Kingdom');
		await expect(container.locator('input[type="hidden"]')).toHaveAttribute('name', 'prefilled');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('GB');
	});

	test('Should restore server-rendered selections as chips in multiple mode on load', async ({ page }) => {
		const output = page.locator('.js-autocomplete-prefilled-multiple .autocomplete__output');

		await expect(output.locator('.autocomplete__chip')).toHaveCount(2);
		await expect(output.locator('.autocomplete__chip-label')).toHaveText(['United Kingdom', 'France']);
		const hidden = output.locator('input[type="hidden"][name="prefilled-multiple"]');
		await expect(hidden).toHaveCount(2);
		await expect(hidden.nth(0)).toHaveValue('GB');
		await expect(hidden.nth(1)).toHaveValue('FR');
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {

	test('Should not have any accessibility issues with restored chips', async ({ page }) => {
		const accessibilityScanResults = await new AxeBuilder({ page }).include('.js-autocomplete-prefilled-multiple').analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

});
