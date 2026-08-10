const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Autocomplete > Functionality', { tag: '@all'}, () => {

	test('Should add a removable chip with a hidden field for each selection in multiple mode', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();

		const chip = output.locator('.autocomplete__chip');
		await expect(chip).toHaveCount(1);
		await expect(chip.locator('.autocomplete__chip-label')).toHaveText('Apple');
		await expect(chip.locator('.autocomplete__chip-remove')).toHaveAttribute('aria-label', 'Remove Apple');
		await expect(chip.locator('input[type="hidden"]')).toHaveAttribute('name', 'fruits');
		await expect(chip.locator('input[type="hidden"]')).toHaveValue('Apple');
		//committing a selection clears the search input so the user can keep typing
		await expect(input).toHaveValue('');
	});

	test('Should announce the current selection to the input via aria-describedby', async ({ page }) => {
		const input = page.locator('#fruits');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await input.fill('ban');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Banana' }).click();

		//the input's description (announced on focus) resolves to the selection summary,
		//so a screen reader hears what's chosen rather than just an empty input
		const describedby = await input.getAttribute('aria-describedby');
		const summary = page.locator(`#${describedby.split(' ').find(id => id.endsWith('-selection'))}`);
		await expect(summary).toHaveText('Apple, Banana selected');
	});

	test('Should accumulate a chip per selection in multiple mode', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await input.fill('ban');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Banana' }).click();

		await expect(output.locator('.autocomplete__chip')).toHaveCount(2);
		await expect(output.locator('.autocomplete__chip-label')).toHaveText(['Apple', 'Banana']);
	});

	test('Should hide an already-selected option from the list so it cannot be picked again', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(1);

		//re-searching the same term no longer offers the chosen option
		await input.fill('app');
		await expect(page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' })).toHaveCount(0);
		//the chip stays put — re-searching never removes the existing selection
		await expect(output.locator('.autocomplete__chip')).toHaveCount(1);
	});

	test('Should remove a chip when its remove button is clicked', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(1);

		await output.locator('.autocomplete__chip-remove').click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(0);
	});

	test('Should dispatch a bubbling remove event when a chip is removed', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await page.evaluate(() => {
			window.removedSelections = [];
			document.addEventListener('autocomplete:remove', e => window.removedSelections.push(e.detail.option));
		});

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await output.locator('.autocomplete__chip-remove').click();

		const removed = await page.evaluate(() => window.removedSelections);
		expect(removed).toHaveLength(1);
		expect(removed[0].value).toBe('Apple');
	});

});

test.describe('Autocomplete > Keyboard', { tag: '@all'}, () => {

	test('Should remove the last chip when Backspace is pressed on an empty input in multiple mode', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(1);

		await input.focus();
		await page.keyboard.press('Backspace');
		await expect(output.locator('.autocomplete__chip')).toHaveCount(0);
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {

	test('Should not have any accessibility issues with a chip present and the list open', async ({ page }) => {
		const input = page.locator('#fruits');
		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		//a chip is present; open the list again so the scan covers chips and options together
		await input.fill('ban');
		await expect(page.locator('#fruits-listbox')).toBeVisible();

		const accessibilityScanResults = await new AxeBuilder({ page }).include('.js-autocomplete-multiple').analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

});
