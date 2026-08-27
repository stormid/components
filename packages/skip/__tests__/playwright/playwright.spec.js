const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";

	await page.keyboard.press(tabKey);
	await page.keyboard.press('Enter');
});

test.describe('Skip > Hash change events', { tag: '@all'}, async () => {

	test('should focus on content from skip link', async ({page}) => {
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveId('content');
	});

	test('should focus on content from hash change event', async ({page}) => {
		await page.evaluate(() => {
			window.location.hash = '#test-2';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toHaveId('test-2');
	});

	test('should ignore any hashes that do not match element ids', async ({page}) => {
		// Move focus to a real, natively-focusable target first so the assertion is
		// deterministic across browsers (a non-matching fragment navigation resets
		// focus off a tabindex="-1" target in Blink, but not off a tab-order element).
		await page.evaluate(() => {
			window.location.hash = '#test-2';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		await expect(page.locator(':focus')).toHaveId('test-2');
		// Navigating to a fragment that matches no element is a no-op for the library:
		// it must not move focus onto a non-existent target.
		await page.evaluate(() => {
			window.location.hash = '#not-matched';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		await expect(page.locator(':focus')).toHaveId('test-2');
	});

	test('should add tabindex="-1" (not "0") to a non-focusable target', async ({page}) => {
		await page.evaluate(() => {
			window.location.hash = '#plain';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		const target = page.locator('#plain');
		await expect(target).toBeFocused();
		await expect(target).toHaveAttribute('tabindex', '-1');
	});

	test('should not override a target that already has a tabindex', async ({page}) => {
		await page.evaluate(() => {
			window.location.hash = '#preset';
			window.dispatchEvent(new HashChangeEvent("hashchange"))
		});
		const target = page.locator('#preset');
		await expect(target).toBeFocused();
		await expect(target).toHaveAttribute('tabindex', '0');
	});

});

test.describe('Skip > Same-hash re-activation', { tag: '@all'}, async () => {

	test('should re-focus the target when a link to the current hash is re-activated', async ({page}) => {
		// beforeEach has already activated the skip link: focus is on #content and the hash is #content.
		await page.locator('#test-2').focus();
		await expect(page.locator(':focus')).toHaveId('test-2');
		// Re-activate the skip link. Its hash matches the current URL, so no hashchange fires.
		await page.locator('#skip-link').focus();
		await page.keyboard.press('Enter');
		await expect(page.locator(':focus')).toHaveId('content');
	});

});

test.describe('Skip > Initial load', { tag: '@all'}, async () => {

	test('should focus a fragment target present in the URL on load', async ({page}) => {
		await page.goto('/#plain');
		const target = page.locator('#plain');
		await expect(target).toBeFocused();
		await expect(target).toHaveAttribute('tabindex', '-1');
	});

});

test.describe('Skip > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

