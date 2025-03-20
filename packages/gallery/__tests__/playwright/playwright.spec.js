const { test, expect } = require('@playwright/test');
import defaults from '../../src/lib/defaults';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

//TO DO
// add left/right keyboard navigation tests
test.describe('Gallery > Keyboard Navigation', { tag: '@reduced' }, () => {
    test('Should navigate to the next item when the right arrow key is pressed', async ({ page }) => {
        const items = await page.locator('[data-gallery-item]').all();
        await items[0].focus();
        await expect(items[0]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowRight');
        await expect(items[1]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowRight');
        await expect(items[2]).toHaveClass(`gallery__item ${defaults.className.active}`);
    });

    test('Should navigate to the previous item when the left arrow key is pressed', async ({ page }) => {
        const items = await page.locator('[data-gallery-item]').all();
        await items[0].focus();
        await expect(items[0]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowLeft');
        await expect(items[items.length - 1]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowLeft');
        await expect(items[items.length - 2]).toHaveClass(`gallery__item ${defaults.className.active}`);
    });
});


test.describe('Gallery > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

