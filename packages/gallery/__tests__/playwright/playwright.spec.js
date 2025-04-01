const { test, expect } = require('@playwright/test');
import defaults from '../../src/lib/defaults';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Gallery > Keyboard Navigation', { tag: '@all' }, () => {
    test('Should navigate to the next item when the right arrow key is pressed', async ({ page }) => {
        const list = await page.locator('[data-gallery-list]');
        const items = await page.locator('[data-gallery-item]').all();
        await list.focus();
        await expect(items[0]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowRight');
        await expect(items[1]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowRight');
        await expect(items[2]).toHaveClass(`gallery__item ${defaults.className.active}`);
    });

    test('Should navigate to the previous item when the left arrow key is pressed', async ({ page }) => {
        const list = await page.locator('[data-gallery-list]');
        const items = await page.locator('[data-gallery-item]').all();
        await list.focus();
        await expect(items[0]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowLeft');
        await expect(items[items.length - 1]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await page.keyboard.press('ArrowLeft');
        await expect(items[items.length - 2]).toHaveClass(`gallery__item ${defaults.className.active}`);
    });
});

test.describe('Gallery > Full screen mode support', { tag: '@all' }, () => {
    test('Should update the URL when item changes', async ({ page }) => {
        const list = await page.locator('[data-gallery-list]');
        await list.focus();
        await page.keyboard.press('ArrowRight');
        await expect(page.url()).toContain('#gallery-1-2');
        await page.keyboard.press('ArrowRight');
        await expect(page.url()).toContain('#gallery-1-3');
    });
});

test.describe('Gallery > scrolling support', { tag: '@desktop' }, () => {
    test('Should update the active item when scrolled to', async ({ page }) => {
        const list = await page.locator('[data-gallery-list]');
        const items = await page.locator('[data-gallery-item]').all();
        const itemWidth = await items[0].evaluate((node) => node.offsetWidth);
        await expect(items[0]).toHaveClass(`gallery__item ${defaults.className.active}`);
        await list.hover();
        await page.mouse.wheel(itemWidth/.75, 0);
        await expect(items[1]).toHaveClass(`gallery__item ${defaults.className.active}`);
    });
});


test.describe('Gallery > Full screen mode support', { tag: '@all' }, () => {
    test('Should remove the fullscreen button if not supported', async ({ page }) => {
        const supportsFullscreen = await page.evaluate(() => document.fullscreenEnabled || document.webkitFullscreenEnabled);
        if (!supportsFullscreen) {
            await expect(page.locator('[data-gallery-fullscreen]')).not.toBeVisible();
        } else {
            await expect(page.locator('[data-gallery-fullscreen]')).toBeVisible();
        }
    });
});

test.describe('Gallery > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

