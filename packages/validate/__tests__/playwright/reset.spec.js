const { test, expect } = require('@playwright/test');

test.describe('Validate > Reset', { tag: '@all'}, () => {
	test('Should reset the form errors when a reset event is dispached', async ({ page }) => {	
		await page.goto('/mini.html');

        const fnameErrorNode = page.locator("[data-valmsg-for='fname']");
		const lnameErrorNode = page.locator("[data-valmsg-for='lname']");

        const message1 = await page.evaluate(() => document.querySelector("#fname").getAttribute("data-val-required"));
        const message2 = await page.evaluate(() => document.querySelector("#lname").getAttribute("data-val-required"));

        await expect(fnameErrorNode).toBeEmpty();
		await expect(lnameErrorNode).toHaveText('Existing server error');

        await page.click('#submitTest');
        await expect(fnameErrorNode).toHaveText(message1);
        await expect(lnameErrorNode).toHaveText(message2);
        await expect(page.locator("#fname")).toHaveAttribute("aria-invalid", "true");
        await expect(page.locator("#fname")).toHaveAttribute("aria-describedby", "fname-error-message");
        await expect(page.locator("//*[@id='fname']//parent::div")).toHaveClass(/is--invalid/);
        await expect(page.locator("#lname")).toHaveAttribute("aria-invalid", "true");
        await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "lname-error-message");
        await expect(page.locator("//*[@id='lname']//parent::div")).toHaveClass(/is--invalid/);

		await page.click('#resetBtn');

        await expect(fnameErrorNode).toBeEmpty();
        await expect(lnameErrorNode).toBeEmpty();
        await expect(page.locator("#fname")).not.toHaveAttribute("aria-invalid");
        await expect(page.locator("#fname")).not.toHaveAttribute("aria-describedby");
        await expect(page.locator("//*[@id='fname']//parent::div")).not.toHaveClass(/is--invalid/);
        await expect(page.locator("#lname")).not.toHaveAttribute("aria-invalid");
        await expect(page.locator("#lname")).not.toHaveAttribute("aria-describedby");
        await expect(page.locator("//*[@id='lname']//parent::div")).not.toHaveClass(/is--invalid/);
	});
});
