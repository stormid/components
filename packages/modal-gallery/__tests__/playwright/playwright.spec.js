const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

const openGallery = async page => {
    await page.locator('.js-modal-gallery').first().click();
    await expect(page.locator('.js-modal-gallery__outer')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Modal gallery > Functionality', { tag: '@all' }, () => {
    test('should not render the overlay until a trigger is clicked', async ({ page }) => {
        await expect(page.locator('.js-modal-gallery__outer')).toHaveCount(0);
    });

    test('should open the overlay when a trigger is clicked', async ({ page }) => {
        await openGallery(page);
        await expect(page.locator('.js-modal-gallery__outer')).toHaveClass(/is--active/);
        await expect(page.locator('.js-gallery-totals')).toHaveText('1/5');
    });

    test('should close and remove the overlay when the close button is clicked', async ({ page }) => {
        await openGallery(page);
        await page.locator('.js-modal-gallery__close').click();
        await expect(page.locator('.js-modal-gallery__outer')).toHaveCount(0);
    });

    test('should advance to the next item when the next button is clicked', async ({ page }) => {
        await openGallery(page);
        await page.locator('.js-modal-gallery__next').click();
        await expect(page.locator('.js-gallery-totals')).toHaveText('2/5');
    });
});

test.describe('Modal gallery > Keyboard', { tag: '@all' }, () => {
    test('should close the overlay on Escape', async ({ page }) => {
        await openGallery(page);
        await page.keyboard.press('Escape');
        await expect(page.locator('.js-modal-gallery__outer')).toHaveCount(0);
    });

    test('should navigate items with the arrow keys', async ({ page }) => {
        await openGallery(page);
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('.js-gallery-totals')).toHaveText('2/5');
        await page.keyboard.press('ArrowLeft');
        await expect(page.locator('.js-gallery-totals')).toHaveText('1/5');
    });

    test('should trap focus within the overlay', async ({ page }) => {
        await openGallery(page);
        for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
        const focusTrapped = await page.evaluate(() =>
            document.querySelector('.js-modal-gallery__outer').contains(document.activeElement)
        );
        expect(focusTrapped).toBe(true);
    });
});

test.describe('Modal gallery > Aria', { tag: '@all' }, () => {
    test('should expose the overlay as a named dialog when open', async ({ page }) => {
        await openGallery(page);
        const overlay = page.locator('.js-modal-gallery__outer');
        await expect(overlay).toHaveAttribute('role', 'dialog');
        await expect(overlay).toHaveAttribute('aria-label', 'Image gallery');
        await expect(overlay).toHaveAttribute('aria-hidden', 'false');
    });

    test('should label each slide with its position in the gallery', async ({ page }) => {
        await openGallery(page);
        await expect(page.locator('.js-modal-gallery__item').first()).toHaveAttribute('aria-label', /Image 1 of 5/);
    });
});

test.describe('Modal gallery > Axe', { tag: '@reduced' }, () => {
    test('Should not have any automatically detectable accessibility issues on load', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Should not have any automatically detectable accessibility issues when open', async ({ page }) => {
        await openGallery(page);
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
