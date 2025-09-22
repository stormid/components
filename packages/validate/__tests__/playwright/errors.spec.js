const { test, expect } = require('@playwright/test');
let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});


test.describe('Validate > Errors > Render errors', { tag: '@all'}, () => {

	test('Should add an error message container if there is no serverErrorNode, and attributes to reflect invalidity', async ({ page }) => {	

		await page.goto('/mini-no-server-errors.html');
		await expect(page.locator("#fname-error-message")).toHaveCount(0);
		await expect(page.locator("#lname-error-message")).toHaveCount(0);

		await page.fill("#fname", "John");
		await page.click("#submit");

		await expect(page.locator("#fname-error-message")).toHaveCount(0);
		await expect(page.locator("#lname-error-message")).toHaveCount(1);

		const message = await page.evaluate(() => document.querySelector("#lname").getAttribute("data-val-required"));
		await expect(page.locator("#lname-error-message")).toHaveText(message);
		await expect(page.locator("#lname")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "lname-error-message");
		await expect(page.locator("//*[@id='lname']//parent::div")).toHaveClass(/is--invalid/);

	});

	test('Should add an error message text node to a serverErrorNode, and attributes to reflect invalidity', async ({ page }) => {	

		await page.goto('/mini.html');
		await expect(page.locator("[data-valmsg-for='fname']")).toHaveCount(1);
		await expect(page.locator("[data-valmsg-for='lname']")).toHaveCount(1);

		const message1 = await page.evaluate(() => document.querySelector("#fname").getAttribute("data-val-required"));
		const message2 = await page.evaluate(() => document.querySelector("#lname").getAttribute("data-val-required"));

		await page.click("#submit");

		await expect(page.locator("[data-valmsg-for='fname']")).toHaveText(message1);
		await expect(page.locator("[data-valmsg-for='lname']")).toHaveText(message2);

		await expect(page.locator("#fname")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#fname")).toHaveAttribute("aria-describedby", "fname-error-message");
		await expect(page.locator("//*[@id='fname']//parent::div")).toHaveClass(/is--invalid/);

		await expect(page.locator("#lname")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "lname-error-message");
		await expect(page.locator("//*[@id='lname']//parent::div")).toHaveClass(/is--invalid/);

	});

	test.only('Should replace text inside an error node completely, if text already exists', async ({ page }) => {	

		await page.goto('/mini.html');

		const fnameErrorNode = page.locator("[data-valmsg-for='fname']");
		await expect(fnameErrorNode).toHaveCount(1);
		
		await fnameErrorNode.evaluate(node => {
			const errorNode = document.createTextNode('The server dislikes the value of this field');
			node.appendChild(errorNode);
		});

		const message1 = await page.evaluate(() => document.querySelector("#fname").getAttribute("data-val-required"));
		await page.click("#submit");

		await expect(fnameErrorNode).toHaveText(message1);

	});
	
});

