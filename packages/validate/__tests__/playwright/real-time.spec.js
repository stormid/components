const { test, expect } = require('@playwright/test');
const exp = require('constants');

test.describe('Validate > Realtime validation', { tag: '@all'}, () => {
	test('Should start real-time validation after first form submission', async ({ page }) => {	
        await page.goto("/");
        const emailInput = page.locator('#email');
        const emailErrorContainer = page.locator('[data-valmsg-for="email"]');
        await expect(emailErrorContainer).toBeEmpty();
        await expect(emailInput).not.toHaveAttribute('aria-invalid');
        await expect(emailInput).not.toHaveAttribute('aria-describedby');
        await expect(page.locator("//*[@id='email']//parent::div")).not.toHaveClass(/is--invalid/);

        await page.fill('#email', 'invalid-email');
        await expect(emailErrorContainer).toBeEmpty();
        await expect(emailInput).not.toHaveAttribute('aria-invalid');
        await expect(emailInput).not.toHaveAttribute('aria-describedby');
        await expect(page.locator("//*[@id='email']//parent::div")).not.toHaveClass(/is--invalid/);

        await page.click('#submitTest');
        await expect(emailErrorContainer).toHaveText('invalid-email is not a valid email address');
        await expect(emailInput).toHaveAttribute('aria-invalid');
        await expect(emailInput).toHaveAttribute('aria-describedby');
        await expect(page.locator("//*[@id='email']//parent::div")).toHaveClass(/is--invalid/);

        await page.fill('#email', 'test@test.com');
        await expect(emailErrorContainer).toBeEmpty();
        await expect(emailInput).not.toHaveAttribute('aria-invalid');
        await expect(emailInput).not.toHaveAttribute('aria-describedby');
        await expect(page.locator("//*[@id='email']//parent::div")).not.toHaveClass(/is--invalid/);
    });

    test('Should update error message on real-time input', async ({ page }) => {
        await page.goto("/");
        const emailInput = page.locator('#email');
        const emailErrorContainer = page.locator('[data-valmsg-for="email"]');
        await expect(emailErrorContainer).toBeEmpty();
        await emailInput.fill('invalid-email');
        await page.click('#submitTest');
        await expect(emailErrorContainer).toHaveText('invalid-email is not a valid email address');
        await emailInput.clear();
        await expect(emailErrorContainer).toHaveText('Email must not be empty');
        await emailInput.fill('test@test.com');
        await expect(emailErrorContainer).toBeEmpty();
    })

    test('Should update realtime on non-text input types', async ({ page }) => {
        await page.goto("/");
        const selectBoxErrorContainer = page.locator('#selectexample-error-message');
        const checkboxErrorContainer = page.locator('#opts-error-message');
        const radioErrorContainer = page.locator('#radio-error-message');

        const selectBox = page.locator('#selectexample');
        const checkbox1 = page.locator('#opt1');
        const radio1 = page.locator('#radio-1');

        await page.click('#submitTest');
        
        await expect(selectBoxErrorContainer).toHaveText('You must select an option');
        await expect(checkboxErrorContainer).toHaveText('Select at least one option');
        await expect(radioErrorContainer).toHaveText('Select an option');

        await selectBox.selectOption('option1');
        await expect(selectBoxErrorContainer).toBeEmpty();

        await checkbox1.check();
        await expect(checkboxErrorContainer).toBeEmpty();

        await radio1.check();
        await expect(radioErrorContainer).toBeEmpty();

    });

    test('Should apply realtime validation to groups added later', async ({ page }) => {

        await page.goto("/");
        await page.evaluate(() => {     
            const newLabel = document.createElement('label');
            newLabel.textContent = 'New Input';
            newLabel.setAttribute('for', 'newinput');
            document.querySelector('form').appendChild(newLabel);
            const newInput = document.createElement('input');
            newInput.setAttribute('type', 'text');
            newInput.setAttribute('id', 'newinput');
            newInput.setAttribute('name', 'newinput');
            newInput.setAttribute('data-val', 'true');
            newInput.setAttribute('data-val-required', 'New input is required');
            document.querySelector('form').appendChild(newInput);
            window.validator.addGroup([newInput]);
        });

        await page.click('#submitTest');
        const newInputErrorContainer = page.locator('#newinput-error-message');
        const newInput = page.locator('#newinput');
        await expect(newInputErrorContainer).toHaveText('New input is required');
        await expect(newInput).toHaveAttribute('aria-invalid');
        await expect(newInput).toHaveAttribute('aria-describedby');
        await expect(page.locator("//*[@id='newinput']//parent::form")).toHaveClass(/is--invalid/);
    });
});
