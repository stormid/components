const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
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
	// it('should close an open toggle when the document.activeElement becomes a non-child element', async () => {
    //     Toggles[0].toggle();
    //     // TogglesLocal[0].getState().toggles[0].focus();
    //     const focusin = new CustomEvent('focusin', { bubbles: true, cancelable: false });
    //     document.dispatchEvent(focusin);
    //     expect(Toggles[0].getState().isOpen).toEqual(false);
    // });

	//  it('should tab to the last focusable child with a shift-tab', async () => {
	// 		const shiftTab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true, shiftKey: true });
	// 		const focusableChildren = Toggles[0].getState().focusableChildren;
	// 		Toggles[0].toggle();
	// 		focusableChildren[0].dispatchEvent(shiftTab);
	// 		expect(document.activeElement).toEqual(focusableChildren[focusableChildren.length -1]);
	// 	});
	
	// 	it('should trapTab and return to the first focusable child', async () => {
	// 		const tab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true });
	// 		const focusableChildren = Toggles[0].getState().focusableChildren;
	// 		focusableChildren[0].dispatchEvent(tab);
	// 		expect(document.activeElement).toEqual(focusableChildren[0]);
	
	// 		//and close for next test
	// 		Toggles[0].toggle();
	// 	});
	
    // it('should close open toggles when the escape key is pressed', async () => {
    //     const escape = new window.KeyboardEvent('keydown', { keyCode: 27, bubbles: true });
    //     Toggles[0].toggle();
    //     document.dispatchEvent(escape);
    //     expect(Toggles[0].getState().isOpen).toEqual(true);
    // });
});

test.describe('Toggle > Aria', { tag: '@all'}, () => {
	// it('should add aria attributes to toggle buttons', async () => {
    //     expect(Toggles[0].getState().toggles[0].getAttribute('aria-controls')).toEqual(Toggles[0].node.getAttribute('id'));
    //     expect(Toggles[0].getState().toggles[0].getAttribute('aria-expanded')).toEqual('false');
    // });

    // it('should initially add a hidden attribute on the node', async () => {
    //     expect(Toggles[0].getState().node.hidden).toBeTruthy();
    // });

    // it('should focus on the first focusable child node fo the target when toggled open', () => {
    //     Toggles[0].getState().toggles[0].click();
    //     Toggles[0].getState().toggles[0].click();
    //     expect(document.activeElement.getAttribute('id')).toEqual('focusable-1-1');
    // });

    // it('should change the hidden attribute on the node when clicked', async () => {
    //     Toggles[0].getState().toggles[0].click();
    //     expect(Toggles[0].getState().node.hidden).toBeFalsy();
    // });

	
		// it('should change attributes of all toggle buttons when an instance changes state', async () => {
		// 	const togglesExpanded = toggles => toggles.reduce((acc, curr) => {
		// 		if (curr.getAttribute('aria-expanded') === 'false') acc = false;
		// 		return acc;
		// 	}, true);
	
		// 	Toggles[0].toggle();
		// 	expect(togglesExpanded(Toggles[0].getState().toggles)).toEqual(true);
		// 	Toggles[0].toggle();
		// 	expect(togglesExpanded(Toggles[0].getState().toggles)).toEqual(false);
		// });
	
});

test.describe('Toggle > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

