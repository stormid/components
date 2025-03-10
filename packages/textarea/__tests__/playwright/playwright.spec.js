const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Textarea > Resize', { tag: '@all'}, () => {
    
    test('should update the height of the textarea after an input event', async ({page}) => {

		const testTextarea = page.locator('textarea').first();
		const originalHeight = await page.evaluate(() => document.querySelector('textarea').offsetHeight);

        await testTextarea.fill(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada, quam non finibus imperdiet, nulla dolor venenatis libero, quis euismod lectus justo ac orci. Praesent eget tincidunt dui, id blandit turpis. Ut arcu purus, semper vitae nibh at, fermentum tempor dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam. `);

		const newHeight = await page.evaluate(() => document.querySelector('textarea').offsetHeight);
		const newScrollHeight = await page.evaluate(() => document.querySelector('textarea').scrollHeight);

		expect(newHeight).toBeGreaterThan(originalHeight);
        expect(newHeight).toEqual(newScrollHeight);
    });

});

test.describe('Textarea > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

