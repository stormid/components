const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/error-summary-container.html');
});

test.describe('Validate > Error summary > errorSummaryId container', { tag: '@all'}, () => {

	test('Should render the summary inside the container and focus it', async ({ page }) => {
		const summary = page.locator('#form-errors');
		await expect(summary).toBeHidden();
		await page.click('#submitTest');

		await expect(summary).toBeVisible();
		await expect(summary).toBeFocused();
		await expect(summary.locator('> [role="alert"] > .error-summary__title')).toHaveText('There is a problem');
		await expect(summary.locator('a')).toHaveText([
			'First name must not be empty',
			'Last name must not be empty',
			'Select a contact preference'
		]);
		expect(await page.evaluate(() => document.querySelector('form').previousElementSibling.tagName)).toBe('A');
	});

	test('Should hide the container when all errors are fixed', async ({ page }) => {
		await page.click('#submitTest');
		await page.fill('#fname', 'Mick');
		await page.fill('#lname', 'Jagger');
		await page.check('#contact-email');

		await expect(page.locator('#form-errors')).toBeHidden();
		await expect(page.locator('#form-errors')).toBeEmpty();
	});
});

test.describe('Validate > Error summary > errorSummaryId container > Accessibility', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
		await page.click('#submitTest');
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
