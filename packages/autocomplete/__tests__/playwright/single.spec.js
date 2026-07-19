const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Autocomplete > Functionality', { tag: '@all'}, () => {

	test('Should enhance the node with a combobox input and a hidden listbox', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await expect(input).toHaveRole('combobox');
		await expect(input).toHaveClass(/autocomplete__input/);
		await expect(input).toHaveAttribute('aria-expanded', 'false');
		await expect(input).toHaveAttribute('aria-controls', 'default-listbox');
		await expect(listbox).toHaveRole('listbox');
		await expect(listbox).not.toBeVisible();
	});

	test('Should show matching options once the query reaches minlength', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('a');
		await expect(listbox).not.toBeVisible();

		await input.fill('ap');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveText(['Apple']);
	});

	test('Should populate the input and close the list when an option is clicked', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await listbox.locator('[role="option"]', { hasText: 'Apple' }).click();

		await expect(input).toHaveValue('Apple');
		await expect(listbox).not.toBeVisible();
		await expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	test('Should open the list with a no-results message when nothing matches', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('zzz');
		await expect(listbox).toBeVisible();
		await expect(input).toHaveAttribute('aria-expanded', 'true');
		await expect(listbox.locator('.autocomplete__option--empty')).toHaveText('No results found');
	});

	test('Should commit the focused option on blur when confirmOnBlur is set', async ({ page }) => {
		const input = page.locator('#default');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveText('Apple');

		//Tab out of the component: confirmOnBlur (default) commits the focused option
		await page.keyboard.press('Tab');
		await expect(input).toHaveValue('Apple');
	});

	test('Should dispatch a bubbling confirm event from the node when an option is selected', async ({ page }) => {
		const listbox = page.locator('#default-listbox');

		//capture events bubbling up to the document
		await page.evaluate(() => {
			window.confirmedSelections = [];
			document.addEventListener('autocomplete:confirm', e => window.confirmedSelections.push(e.detail.selected));
		});

		await page.locator('#default').fill('app');
		await listbox.locator('[role="option"]', { hasText: 'Apple' }).click();

		const confirmed = await page.evaluate(() => window.confirmedSelections);
		expect(confirmed).toHaveLength(1);
		expect(confirmed[0].value).toBe('Apple');
	});

});

test.describe('Autocomplete > Keyboard', { tag: '@all'}, () => {

	test('Should move focus into the options with the down arrow and back to the input with the up arrow', async ({ page }) => {
		const input = page.locator('#default');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveRole('option');
		await expect(page.locator(':focus')).toHaveText('Apple');

		await page.keyboard.press('ArrowUp');
		await expect(page.locator(':focus')).toHaveAttribute('id', 'default');
	});

	test('Should navigate a multi-option list and stop at each end', async ({ page }) => {
		const input = page.locator('#default');

		//'to' matches Potato and Sweet potato
		await input.fill('to');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveText('Potato');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveText('Sweet potato');

		//at the last option the down arrow holds position
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveText('Sweet potato');

		//the up arrow walks back up and past the first option returns to the input
		await page.keyboard.press('ArrowUp');
		await expect(page.locator(':focus')).toHaveText('Potato');
		await page.keyboard.press('ArrowUp');
		await expect(page.locator(':focus')).toHaveAttribute('id', 'default');
	});

	test('Should select the focused option when Enter is pressed', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect(input).toHaveValue('Apple');
		await expect(listbox).not.toBeVisible();
	});

	test('Should select the focused option when Space is pressed', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Space');

		await expect(input).toHaveValue('Apple');
		await expect(listbox).not.toBeVisible();
	});

	test('Should close the list and return focus to the input when Escape is pressed', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await expect(listbox).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(listbox).not.toBeVisible();
		await expect(page.locator(':focus')).toHaveAttribute('id', 'default');
	});

	test('Should select the committed value on refocus so typing replaces it', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await listbox.locator('[role="option"]', { hasText: 'Apple' }).click();
		await expect(input).toHaveValue('Apple');

		//blur then refocus: the whole value should be selected
		await page.locator('#fruits').focus();
		await input.focus();
		const selectionLength = await input.evaluate(el => el.selectionEnd - el.selectionStart);
		expect(selectionLength).toBe('Apple'.length);
	});

});

test.describe('Autocomplete > Aria', { tag: '@all'}, () => {

	test('Should wire the combobox aria attributes on the input', async ({ page }) => {
		const input = page.locator('#default');

		await expect(input).toHaveAttribute('role', 'combobox');
		await expect(input).toHaveAttribute('aria-autocomplete', 'list');
		await expect(input).toHaveAttribute('autocomplete', 'off');
		await expect(input).toHaveAttribute('aria-controls', 'default-listbox');
	});

	test('Should keep aria-expanded in sync with the list visibility', async ({ page }) => {
		const input = page.locator('#default');

		await expect(input).toHaveAttribute('aria-expanded', 'false');
		await input.fill('app');
		await expect(input).toHaveAttribute('aria-expanded', 'true');
		await page.keyboard.press('Escape');
		await expect(input).toHaveAttribute('aria-expanded', 'false');
	});

	test('Should set the option aria attributes for each rendered result', async ({ page }) => {
		const input = page.locator('#default');
		const options = page.locator('#default-listbox [role="option"]');

		await input.fill('app');

		const option = options.first();
		await expect(option).toHaveAttribute('aria-posinset', '1');
		await expect(option).toHaveAttribute('aria-setsize', '1');
		await expect(option).toHaveAttribute('aria-selected', 'false');
	});

	test('Should mark the focused option as selected during keyboard navigation', async ({ page }) => {
		const input = page.locator('#default');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveAttribute('aria-selected', 'true');
	});

	test('Should set the placeholder on the input when the option is given', async ({ page }) => {
		await expect(page.locator('#default')).toHaveAttribute('placeholder', 'e.g. Apple');
	});

});

test.describe('Autocomplete > Status', { tag: '@all'}, () => {

	test('Should link the minlength hint to the input via aria-describedby', async ({ page }) => {
		const input = page.locator('#default');
		const describedby = await input.getAttribute('aria-describedby');

		expect(describedby).toBeTruthy();
		await expect(page.locator(`#${describedby}`)).toHaveText('Type 2 or more characters for results');
	});

	test('Should keep the live region silent below minlength', async ({ page }) => {
		const status = page.locator('.js-autocomplete .autocomplete__status');

		await page.locator('#default').fill('a');
		await expect(status).toHaveText('');
	});

	test('Should announce the result count once the query is long enough', async ({ page }) => {
		const status = page.locator('.js-autocomplete .autocomplete__status');

		await page.locator('#default').fill('app');
		await expect(status).toHaveText('1 result is available');
	});

	test('Should announce the no-results message when nothing matches', async ({ page }) => {
		const status = page.locator('.js-autocomplete .autocomplete__status');

		await page.locator('#default').fill('zzz');
		await expect(status).toHaveText('No results found');
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {

	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('Should not have any accessibility issues with the no-results list open', async ({ page }) => {
		const listbox = page.locator('#default-listbox');
		await page.locator('#default').fill('zzz');
		await expect(listbox).toBeVisible();

		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});

});
