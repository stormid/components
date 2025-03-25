const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Modal > Functionality', { tag: '@all'}, () => {

	test('Should move the modal node to be the first child of the body element on opening', async ({ page }) => {	
		await expect(page.locator('body > *:first-child')).toHaveAttribute('id', 'main');
		await page.locator('.js-modal__btn').first().click();
		await expect(page.locator('body > *:first-child')).toHaveAttribute('id', 'modal-confirmation');
	});

	test('Toggles a class on the body when the modal is used', async ({ page }) => {	
		const rootNode = page.locator('html');
		await expect(rootNode).not.toHaveClass(/is--modal/);
		await page.locator('.js-modal__btn').first().click();
		await expect(rootNode).toHaveClass(/is--modal/);
		await page.locator('#modal-confirmation .js-modal__btn').click();
		await expect(rootNode).not.toHaveClass(/is--modal/);
	});

	test('Modal visibility should be toggled when buttons are used', async ({ page }) => {	
		const modalNode = page.locator('#modal-confirmation');
		await expect(modalNode).not.toBeVisible();
		await page.locator('.js-modal__btn').first().click();
		await expect(modalNode).toBeVisible();
		await page.locator('#modal-confirmation .js-modal__btn').click();
		await expect(modalNode).not.toBeVisible();
	});

	test('Modal node be visible if the start open setting is used', async ({ page }) => {	
		await page.goto('/start-open.html');
		await expect(page.locator('#modal-confirmation')).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/is--modal/);
		await expect(page.locator('body > *:first-child')).toHaveAttribute('id', 'modal-confirmation');
	});

	test('Modal node be visible if the start open data attribute is used', async ({ page }) => {	
		await page.goto('/attribute.html');
		await expect(page.locator('#modal-confirmation')).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/is--modal/);
		await expect(page.locator('body > *:first-child')).toHaveAttribute('id', 'modal-confirmation');
	});
});

test.describe('Modal > Keyboard', { tag: '@all'}, () => {

	test('Modal node should toggle visibility when when buttons are activated via keyboard', async ({ page }) => {
		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(page.locator('#modal-confirmation')).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/is--modal/);
		await expect(page.locator('body > *:first-child')).toHaveAttribute('id', 'modal-confirmation');

		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(page.locator('#modal-confirmation')).not.toBeVisible();
		await expect(page.locator('html')).not.toHaveClass(/is--modal/);
	});

	test('Modal node should close if escape key is used when open', async ({ page }) => {
		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(page.locator('#modal-confirmation')).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/is--modal/);

		await page.keyboard.press('Escape');
		await expect(page.locator('#modal-confirmation')).not.toBeVisible();
		await expect(page.locator('html')).not.toHaveClass(/is--modal/);
	});

	test('Tabbing should be trapped within modal when open', async ({ page }) => {
		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(page.locator('#modal-confirmation')).toBeVisible();
		await expect(page.locator('html')).toHaveClass(/is--modal/);

		for(let i = 0; i<=2; i++) {
            await page.keyboard.press(tabKey);
        }

		await expect(page.locator(':focus')).toHaveClass(/js-modal__btn/);
	});

});

test.describe('Modal > Aria', { tag: '@all'}, () => {

	test('Should set a hidden attribute on the node', async ({ page }) => {	
		await expect(page.locator('#modal-confirmation')).toHaveAttribute('hidden');
	});

	test('Should have appropriate aria attributes on the node', async ({ page }) => {	
		const node = page.locator('#modal-confirmation');
		await expect(node).toHaveAttribute('aria-labelledby');

		const ariaLabelID = await node.getAttribute('aria-labelledby');
		await expect(page.locator('#'+ariaLabelID)).toHaveCount(1)
	});

});

test.describe('Modal > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});