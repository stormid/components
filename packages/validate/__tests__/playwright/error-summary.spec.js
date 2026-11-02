const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/error-summary.html');
});

test.describe('Validate > Error summary', { tag: '@all'}, () => {

	test('Should render a focused error summary above the form, alongside inline errors', async ({ page }) => {
		await page.click('#submitTest');

		const summary = page.locator('.error-summary');
		await expect(summary).toBeFocused();
		await expect(summary).not.toHaveAttribute('role');
		await expect(summary.locator('> [role="alert"] > .error-summary__title')).toHaveText('There is a problem');
		await expect(summary.locator('a')).toHaveText([
			'First name must not be empty',
			'Last name must not be empty',
			'Select a contact preference'
		]);
		expect(await page.evaluate(() => document.querySelector('.error-summary').nextElementSibling === document.querySelector('form'))).toBe(true);
		await expect(page.locator('#fname-error-message')).toHaveText('First name must not be empty');
	});

	test('Should focus the field and bring its legend into view when a link is followed', async ({ page }) => {
		//push the question below the fold, so following its link has to scroll it into view
		await page.evaluate(() => {
			const spacer = document.createElement('div');
			spacer.style.height = '150vh';
			const fieldset = document.getElementById('contact-email').closest('fieldset');
			fieldset.parentNode.insertBefore(spacer, fieldset);
		});
		await page.click('#submitTest');
		const legend = page.locator('legend', { hasText: 'Contact preference' });
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(legend).not.toBeInViewport();
		await page.locator('.error-summary a[href="#contact-email"]').click();

		await expect(page.locator('#contact-email')).toBeFocused();
		await expect(legend).toBeInViewport();
		expect(new URL(page.url()).hash).toBe('');
	});

	test('Should remove fixed errors from the summary in real time, and the summary once all are fixed', async ({ page }) => {
		await page.click('#submitTest');

		await page.fill('#fname', 'John');
		await expect(page.locator('.error-summary a')).toHaveCount(2);

		await page.fill('#lname', 'Smith');
		//the radio input is visually hidden over its label, so it's selected by keyboard rather than clicked
		await page.focus('#contact-email');
		await page.keyboard.press('Space');
		await expect(page.locator('.error-summary')).toHaveCount(0);
	});
});

test.describe('Validate > Error summary > Accessibility', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
		await page.click('#submitTest');
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
