const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

//TO DO
// add left/right keyboard navigation tests
test.describe('Gallery > Keyboard Navigation', () => {
    test('Should navigate to the next item when the right arrow key is pressed', async ({ page }) => {
        await page.keyboard.press('ArrowRight');
        const activeItem = await page.$('.gallery__item.active');
        expect(await activeItem.getAttribute('data-gallery-item')).toEqual('2');
    });

    test('Should navigate to the previous item when the left arrow key is pressed', async ({ page }) => {
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowLeft');
        const activeItem = await page.$('.gallery__item.active');
        expect(await activeItem.getAttribute('data-gallery-item')).toEqual('2');
    });
});


test.describe('Gallery > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

