const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Validate > Accessibility > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

test.describe('Validate > Accessibility > focus', { tag: '@all'}, () => {
	test('Should focus on the first invalid field in a form post-validation', async ({ page }) => {	
		await page.goto('/mini.html');
		await page.click('#submitTest');
		const fNameInput = page.locator('#fname');
		await expect(fNameInput).toBeFocused();
	});
});

test.describe('Validate > Accessibility > Aria', { tag: '@all'}, () => {
	test('Should add an aria required attribute to improve accessibility', async ({ page }) => {	
		await page.goto('/mini.html');
		const fNameInput = page.locator('#fname');
		const lNameInput = page.locator('#lname');
		await expect(lNameInput).toHaveAttribute('aria-required', 'true');
		await expect(fNameInput).toHaveAttribute('aria-required', 'true');
	});

	test('Should NOT add an aria required attribute to radio buttons', async ({ page }) => {	
		await page.goto('/');
		const radioInput = await page.locator('[name="radio"]').all();
		for (const radio of radioInput) {
			await expect(radio).not.toHaveAttribute('aria-required', 'true');
		}
	});

	test('Should NOT add an aria required attribute to multiple checkboxes', async ({ page }) => {	
		await page.goto('/');
		const checkboxInput = await page.locator('[name="opts"]').all();
		for (const checkbox of checkboxInput) {
			await expect(checkbox).not.toHaveAttribute('aria-required', 'true');
		}
	});

	test('Should add an aria required attribute to single checkboxes', async ({ page }) => {	
		await page.goto('/');
		const termsConditions = page.locator('[name="tcs"]');
		await expect(termsConditions).toHaveAttribute('aria-required', 'true');
	});
});