const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Autocomplete > Functionality', { tag: '@all'}, () => {

	test('Should progressively enhance a <select>, removing it and sourcing its options', async ({ page }) => {
		const container = page.locator('.js-autocomplete-select');
		const input = page.locator('#flavour');
		const listbox = page.locator('#flavour-listbox');

		//the original <select> is replaced by the enhanced combobox
		await expect(container.locator('select')).toHaveCount(0);
		await expect(input).toHaveRole('combobox');

		//options come from the <option> labels; the placeholder (value="") is skipped
		await input.fill('app');
		await expect(listbox.locator('[role="option"]')).toHaveText(['Apple']);

		//display is the option label, the submitted value is the option value
		await listbox.locator('[role="option"]', { hasText: 'Apple' }).click();
		await expect(input).toHaveValue('Apple');
		await expect(container.locator('input[type="hidden"]')).toHaveAttribute('name', 'flavour');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('apple');
	});

	test('Should seed a chip from a pre-selected option when enhancing <select multiple>', async ({ page }) => {
		const output = page.locator('.js-autocomplete-select-multiple .autocomplete__output');

		const chip = output.locator('.autocomplete__chip');
		await expect(chip).toHaveCount(1);
		await expect(chip.locator('.autocomplete__chip-label')).toHaveText('Banana');
		await expect(chip.locator('input[type="hidden"]')).toHaveAttribute('name', 'toppings');
		await expect(chip.locator('input[type="hidden"]')).toHaveValue('banana');
	});

});

test.describe('Autocomplete > Keyboard', { tag: '@all'}, () => {

	test('Should open the full option list when Space is pressed on the empty input', async ({ page }) => {
		const input = page.locator('#flavour');
		const listbox = page.locator('#flavour-listbox');

		//an enhanced <select> seeds settings.list, so Space opens the full set with no query
		await input.focus();
		await page.keyboard.press('Space');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveCount(5);
		await expect(input).toHaveValue('');
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {

	test('Should not have any accessibility issues with the enhanced select list open', async ({ page }) => {
		await page.locator('#flavour').focus();
		await page.keyboard.press('Space');
		await expect(page.locator('#flavour-listbox')).toBeVisible();

		const accessibilityScanResults = await new AxeBuilder({ page }).include('.js-autocomplete-select').analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

});
