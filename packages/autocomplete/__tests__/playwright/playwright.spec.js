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

		await input.fill('ap');
		await expect(listbox).not.toBeVisible();

		await input.fill('app');
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

	test('Should remove a chip when its remove button is clicked', async ({ page }) => {
		const input = page.locator('#fruits');
		const output = page.locator('.js-autocomplete-multiple .autocomplete__output');

		await input.fill('app');
		await page.locator('#fruits-listbox [role="option"]', { hasText: 'Apple' }).click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(1);

		await output.locator('.autocomplete__chip-remove').click();
		await expect(output.locator('.autocomplete__chip')).toHaveCount(0);
	});

	test('Should resolve options from an async source', async ({ page }) => {
		const input = page.locator('#country');
		const listbox = page.locator('#country-listbox');

		await input.fill('app');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveText(['Apple']);
	});

	test('Should search a remote endpoint via fetch and submit the mapped value', async ({ page }) => {
		const container = page.locator('.js-autocomplete-endpoint');
		const input = page.locator('#country-code');
		const listbox = page.locator('#country-code-listbox');

		//results come from the mocked /api/countries route, mapped from { code, name }
		await input.fill('united');
		await expect(listbox).toBeVisible();
		await expect(listbox.locator('[role="option"]')).toHaveText(['United Kingdom', 'United States']);

		//display is the name, the hidden field submits the mapped code
		await listbox.locator('[role="option"]', { hasText: 'United Kingdom' }).click();
		await expect(input).toHaveValue('United Kingdom');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('GB');
	});

	test('Should submit typed text via a hidden field when allowFreeText is set', async ({ page }) => {
		const container = page.locator('.js-autocomplete-freetext');
		const input = page.locator('#herb');

		//a chosen suggestion submits its value
		await input.fill('app');
		await page.locator('#herb-listbox [role="option"]', { hasText: 'Apple' }).click();
		await expect(container.locator('input[type="hidden"]')).toHaveValue('Apple');

		//typing text that matches no option still carries it to the form
		await input.fill('kumquat');
		await expect(container.locator('input[type="hidden"]')).toHaveAttribute('name', 'herb');
		await expect(container.locator('input[type="hidden"]')).toHaveValue('kumquat');
	});

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

	test('Should move focus into the options with the down arrow and back to the input with the up arrow', async ({ page }) => {
		const input = page.locator('#default');

		await input.fill('app');
		await page.keyboard.press('ArrowDown');
		await expect(page.locator(':focus')).toHaveRole('option');
		await expect(page.locator(':focus')).toHaveText('Apple');

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

	test('Should close the list and return focus to the input when Escape is pressed', async ({ page }) => {
		const input = page.locator('#default');
		const listbox = page.locator('#default-listbox');

		await input.fill('app');
		await expect(listbox).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(listbox).not.toBeVisible();
		await expect(page.locator(':focus')).toHaveAttribute('id', 'default');
	});

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

});

test.describe('Autocomplete > Status', { tag: '@all'}, () => {

	test('Should announce that the query is too short below minlength', async ({ page }) => {
		const status = page.locator('.js-autocomplete .autocomplete__status');

		await page.locator('#default').fill('ap');
		await expect(status).toHaveText('Type 3 or more characters for results');
	});

	test('Should announce the result count once the query is long enough', async ({ page }) => {
		const status = page.locator('.js-autocomplete .autocomplete__status');

		await page.locator('#default').fill('app');
		await expect(status).toHaveText('1 result is available');
	});

});

test.describe('Autocomplete > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
