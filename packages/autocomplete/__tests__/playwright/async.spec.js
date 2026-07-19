const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Autocomplete > Functionality', { tag: '@all'}, () => {

	test('Should resolve options from an async source', async ({ page }) => {
		const input = page.locator('#country');
		const listbox = page.locator('#country-listbox');

		await input.fill('app');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveText(['Apple']);
	});

	test('Should announce the loading message while an async search is in flight', async ({ page }) => {
		const status = page.locator('.js-autocomplete-async .autocomplete__status');

		await page.locator('#country').fill('app');
		//the debounced request shows the loading message until it resolves
		await expect(status).toHaveText('Loading…');
	});

	test('Should search a remote endpoint via fetch and submit the mapped value', async ({ page }) => {
		const container = page.locator('.js-autocomplete-endpoint');
		const input = page.locator('#country-code');
		const listbox = page.locator('#country-code-listbox');

		//results come from the mocked /api/countries route, mapped from { code, name }
		await input.fill('united');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"] .autocomplete__option-title')).toHaveText(['United Kingdom', 'United States']);

		//multiple mode: selecting clears the input, adds a chip, and submits the mapped code via the chip's hidden field
		await listbox.locator('[role="option"]', { hasText: 'United Kingdom' }).click();
		await expect(input).toHaveValue('');
		await expect(container.locator('.autocomplete__chip-label')).toHaveText('United Kingdom');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('GB');
	});

	test('Should render a custom option template with a detail line, leaving the label and value unaffected', async ({ page }) => {
		const container = page.locator('.js-autocomplete-endpoint');
		const listbox = page.locator('#country-code-listbox');

		await page.locator('#country-code').fill('united');
		await expect(listbox).toBeVisible();
		const option = listbox.locator('[role="option"]').first();
		//the list option carries the display label plus an extra detail line (the country code)
		await expect(option.locator('.autocomplete__option-title')).toHaveText('United Kingdom');
		await expect(option.locator('.autocomplete__option-detail')).toHaveText('GB');

		//multiple mode: selecting adds a chip showing just the label and submits the code
		await option.click();
		await expect(container.locator('.autocomplete__chip-label')).toHaveText('United Kingdom');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('GB');
	});

	test('Should cap the remote result list at maxResults (default 6)', async ({ page }) => {
		const listbox = page.locator('#country-code-listbox');

		//'land' matches seven countries in the mock; the default cap trims to six
		await page.locator('#country-code').fill('land');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveCount(6);
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {

	test('Should not have any accessibility issues with a custom option template list open', async ({ page }) => {
		const listbox = page.locator('#country-code-listbox');
		await page.locator('#country-code').fill('united');
		await expect(listbox).toBeVisible();

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

});
