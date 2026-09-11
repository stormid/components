const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam.`;

test.describe('Textarea > Resize (JS fallback)', { tag: '@desktop' }, () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('/?fallback');
	});

	test('grows to fit its content with no internal scrollbar', async ({ page }) => {
		const textarea = page.locator('textarea').first();
		const originalHeight = await textarea.evaluate(el => el.offsetHeight);

		await textarea.fill(LOREM);

		const metrics = await textarea.evaluate(el => ({
			offset: el.offsetHeight,
			client: el.clientHeight,
			scroll: el.scrollHeight
		}));

		expect(metrics.offset).toBeGreaterThan(originalHeight);
		// Box-model-aware sizing: content fully visible, i.e. no vertical overflow.
		expect(metrics.scroll).toBeLessThanOrEqual(metrics.client);
	});

	test('shrinks back down when content is removed', async ({ page }) => {
		const textarea = page.locator('textarea').first();

		await textarea.fill(LOREM);
		const tall = await textarea.evaluate(el => el.offsetHeight);

		await textarea.fill('one line');
		const short = await textarea.evaluate(el => el.offsetHeight);

		expect(short).toBeLessThan(tall);
	});

	test('recomputes height when the width changes', async ({ page }) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		const textarea = page.locator('textarea').first();

		await textarea.fill(LOREM);
		const wideHeight = await textarea.evaluate(el => el.offsetHeight);

		await page.setViewportSize({ width: 480, height: 800 });
		// ResizeObserver fires asynchronously; poll until it reflows.
		await expect.poll(() => textarea.evaluate(el => el.offsetHeight)).toBeGreaterThan(wideHeight);
	});

	test('destroy stops further resizing', async ({ page }) => {
		const textarea = page.locator('textarea').first();

		await textarea.fill('one line');
		const before = await textarea.evaluate(el => el.offsetHeight);

		await page.evaluate(() => window.instances[0].destroy());
		await textarea.fill(LOREM);
		const after = await textarea.evaluate(el => el.offsetHeight);

		expect(after).toEqual(before);
	});

});

test.describe('Textarea > Native field-sizing', { tag: '@all' }, () => {

	test('applies field-sizing:content where the browser supports it', async ({ page }) => {
		await page.goto('/');

		const supported = await page.evaluate(() => typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content'));
		test.skip(!supported, 'Browser does not support field-sizing');

		const value = await page.evaluate(() => getComputedStyle(document.querySelector('textarea')).fieldSizing);
		expect(value).toBe('content');
	});

});

test.describe('Textarea > Axe', { tag: '@reduced' }, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
		await page.goto('/');
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});
