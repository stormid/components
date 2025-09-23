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

	test('Should replace text inside an error node completely, if text already exists', async ({ page }) => {	

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

test.describe('Validate > Errors > Clear errors', { tag: '@all'}, () => {

	test('Should empty a server-side rendered errorNode container, remove invalid classNames and aria', async ({ page }) => {	

		await page.goto('/mini.html');
		await page.click("#submit");

		const fnameErrorNode = page.locator("[data-valmsg-for='fname']");
		const lnameErrorNode = page.locator("[data-valmsg-for='lname']");

		const message1 = await page.evaluate(() => document.querySelector("#fname").getAttribute("data-val-required"));
		const message2 = await page.evaluate(() => document.querySelector("#lname").getAttribute("data-val-required"));

		await expect(fnameErrorNode).toHaveCount(1);
		await expect(lnameErrorNode).toHaveCount(1);

		await expect(fnameErrorNode).toHaveText(message1);
		await expect(lnameErrorNode).toHaveText(message2);
		await expect(page.locator("#fname")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#fname")).toHaveAttribute("aria-describedby", "fname-error-message");
		await expect(page.locator("//*[@id='fname']//parent::div")).toHaveClass(/is--invalid/);
		await expect(page.locator("#lname")).toHaveAttribute("aria-invalid", "true");
		await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "lname-error-message");
		await expect(page.locator("//*[@id='lname']//parent::div")).toHaveClass(/is--invalid/);

		await page.fill("#fname", "John");
		await page.fill("#lname", "Smith");

		await expect(fnameErrorNode).toBeEmpty();
		await expect(lnameErrorNode).toBeEmpty();
		await expect(page.locator("#fname")).not.toHaveAttribute("aria-invalid");
		await expect(page.locator("#fname")).not.toHaveAttribute("aria-describedby");
		await expect(page.locator("//*[@id='fname']//parent::div")).not.toHaveClass(/is--invalid/);
		await expect(page.locator("#lname")).not.toHaveAttribute("aria-invalid");
		await expect(page.locator("#lname")).not.toHaveAttribute("aria-describedby");
		await expect(page.locator("//*[@id='lname']//parent::div")).not.toHaveClass(/is--invalid/);
	});

	test('Should remove a client-side error node when valid', async ({ page }) => {	

		await page.goto('/mini-no-server-errors.html');

		await expect(page.locator("#fname-error-message")).toHaveCount(0);
		await expect(page.locator("#lname-error-message")).toHaveCount(0);

		await page.click("#submit");

		await expect(page.locator("#fname-error-message")).toHaveCount(1);
		await expect(page.locator("#lname-error-message")).toHaveCount(1);

		await page.fill("#fname", "John");
		await page.fill("#lname", "Smith");

		await expect(page.locator("#fname-error-message")).toHaveCount(0);
		await expect(page.locator("#lname-error-message")).toHaveCount(0);
	});

	test('Should remove the aria-describedby attribute relating to the error, but preserve other aria-describedby values', async ({ page }) => {	
		await page.goto('/mini-no-server-errors.html');
		await page.evaluate(() => {
			const fname = document.getElementById('fname');
			const lname = document.getElementById('lname');
			const title = document.createElement('h2');
			title.id = "form-title";
			title.innerText = "Title";
			fname.setAttribute('aria-describedby', 'form-title');
			lname.setAttribute('aria-describedby', 'form-title');
			fname.parentNode.insertBefore(title, fname);
		});

		await page.click("#submit");

		await expect(page.locator("#fname")).toHaveAttribute("aria-describedby", "form-title fname-error-message");
		await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "form-title lname-error-message");

		await page.fill("#fname", "John");
		await page.fill("#lname", "Smith");

		await expect(page.locator("#fname")).toHaveAttribute("aria-describedby", "form-title");
		await expect(page.locator("#lname")).toHaveAttribute("aria-describedby", "form-title");

	});

});

test.describe('Validate > Errors > Error message tokens', { tag: '@all'}, () => {

	test('Should return an error message string containing the input value if the {{value}} token is found in the error message', async ({ page }) => {
		await page.fill("#email", "test");
		await page.click("#submit");
		await expect(page.locator("#email-error-message")).toHaveText("test is not a valid email address");
	});

	test('Should return an error message with a comma delimited string of values if more than one field is in a group', async ({ page }) => {
		await page.fill("#group1", "test");
		await page.fill("#group2", "test2");
		await page.click("#submit");
		await expect(page.locator("#group1-error-message")).toHaveText("test, test2 are not valid inputs");
	});

});
