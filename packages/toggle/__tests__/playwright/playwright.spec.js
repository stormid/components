const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Toggle > Functionality', { tag: '@all'}, () => {
	
	test('Should toggle a localised area of DOM', async ({ page }) => {	
		const toggleBlock = page.locator('#child1');
		const toggleButton = page.locator('.js-toggle__btn-local');
		const toggleWrapper = page.locator('#parent1');

		await expect(toggleBlock).not.toBeVisible();
		await expect(toggleWrapper).not.toHaveClass(/is--active/);

		await toggleButton.click();
		await expect(toggleBlock).toBeVisible();
		await expect(toggleWrapper).toHaveClass(/is--active/);
	});

	test('Should toggle a global area of DOM', async ({ page }) => {	
		const toggleBlock = page.locator('.js-toggle-menu');
		const toggleButton = page.locator('.js-toggle__btn').first();
		const HTMLNode = page.locator('html');

		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--nav/);

		await toggleButton.click();
		await expect(toggleBlock).toBeVisible();
		await expect(HTMLNode).toHaveClass(/on--nav/);
	});

	test('Should close an open toggle when the a non-child is clicked with setting closeOnClick', async ({ page }) => {	
		const toggleBlock = page.locator('.js-toggle-menu');
		const toggleButton = page.locator('.js-toggle__btn').first();
		const differentButton = page.locator('.js-toggle__btn-local');
		const HTMLNode = page.locator('html');

		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--nav/);

		await toggleButton.click();
		await expect(toggleBlock).toBeVisible();
		await expect(HTMLNode).toHaveClass(/on--nav/);

		await differentButton.click();
		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--nav/);
	});

	test('Should start open if a data attribute is used', async ({ page }) => {	
		const toggleBlock = page.locator('#child2');
		const toggleWrapper = page.locator('#parent2');

		await expect(toggleBlock).toBeVisible();
		await expect(toggleWrapper).toHaveClass(/is--active/);
	});

	test('Hidden attribute should only be used if settings specify', async ({ page }) => {	
		const toggleBlockGlobal = page.locator('.js-toggle-menu');
		const toggleBlockLocal = page.locator('#child1');
		const toggleButton = page.locator('.js-toggle__btn').first();

		await expect(toggleBlockGlobal).toHaveAttribute('hidden');
		await expect(toggleBlockLocal).not.toHaveAttribute('hidden');

		await toggleButton.click();
		await expect(toggleBlockGlobal).not.toHaveAttribute('hidden');
	});

	test('Should start open if a class is used on parent', async ({ page }) => {	
		const toggleBlock = page.locator('#child3');
		const toggleWrapper = page.locator('#parent3');
		const toggleButton = page.locator('.js-toggle__btn-class');

		await expect(toggleBlock).toBeVisible();
		await expect(toggleWrapper).toHaveClass(/is--active/);

		await toggleButton.click();
		await expect(toggleBlock).not.toBeVisible();
		await expect(toggleWrapper).not.toHaveClass(/is--active/);
	});

});

test.describe('Toggle > Keyboard', { tag: '@all'}, () => {

	test('Should close an open toggle that uses closeOnBlur if focus moves away', async ({ page }) => {	
		const toggleBlock = page.locator('.js-toggle-menu');
		const HTMLNode = page.locator('html');

		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--nav/);

		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(toggleBlock).toBeVisible();
		await expect(HTMLNode).toHaveClass(/on--nav/);

		//After a number of tab presses that exceeds the number of
        //elements in the panel, the panel should close
        for(let i = 0; i<=4; i++) {
            await page.keyboard.press(tabKey);
        }

		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--nav/);
	});

	test('Keyboard focus should move within the panel if the settings specify', async ({ page }) => {	
		const toggleBlock = page.locator('.js-toggle-trap');

		await page.keyboard.press(tabKey);
		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(toggleBlock).toBeVisible();
		await expect(page.locator(':focus')).toHaveClass(/eg__nav-item/);
	});

	test('Should trap the tab key within the toggle panel if the settings specify', async ({ page }) => {	
		const toggleBlock = page.locator('.js-toggle-trap');
		const HTMLNode = page.locator('html');

		await expect(toggleBlock).not.toBeVisible();
		await expect(HTMLNode).not.toHaveClass(/on--trap/);

		await page.keyboard.press(tabKey);
		await page.keyboard.press(tabKey);
		await page.keyboard.press('Enter');
		await expect(toggleBlock).toBeVisible();
		await expect(HTMLNode).toHaveClass(/on--trap/);

		//After a number of tab presses that exceeds the number of
        //elements in the panel, the panel should remain open with the focus within
        for(let i = 0; i<=6; i++) {
            await page.keyboard.press(tabKey);
        }

		await expect(toggleBlock).toBeVisible();
		await expect(HTMLNode).toHaveClass(/on--trap/);
		await expect(page.locator(':focus')).toHaveClass(/js-toggle__btn-trap/);
	});

});

test.describe('Toggle > Aria', { tag: '@all'}, () => {

	test('Should add aria attributes on all toggle buttons', async ({ page }) => {
		const buttons = await page.locator('.btn, .menu-button').all();
		for(const button of buttons) {
			await expect(button).toHaveAttribute('aria-controls');
			await expect(button).toHaveAttribute('aria-expanded');
		}
	});
	
	test('Should update aria expanded when toggle is used', async ({ page }) => {
		const toggleButton = page.locator('.js-toggle__btn-local');
		await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
		await toggleButton.click();
		await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
	});
	
});

test.describe('Toggle > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

