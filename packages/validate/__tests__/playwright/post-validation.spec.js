const { test, expect } = require('@playwright/test');
let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});


test.describe('Validate > Post-validation', { tag: '@all'}, () => {

	test('Should add correct user input to the form data if the form is valid', async ({ page }) => {	

		await page.route('**/test', async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			expect(params.get('fname')).toBe('John');
			expect(params.get('lname')).toBe('Doe');
			await route.fulfill({ status: 200, body: 'OK' });
		});

		await page.goto('/mini.html');
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submit");

	});

	test('Should mutate the action attribute of the form if the submit button clicked has a formaction', async ({ page }) => {

		await page.route('**/alternative', async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			expect(params.get('fname')).toBe('John');
			expect(params.get('lname')).toBe('Doe');
			await route.fulfill({ status: 200, body: 'OK' });
		});

		await page.goto('/mini.html');
		await page.locator('#submit').evaluate((button) => {
			button.setAttribute('formaction', '/alternative');
		});
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submit");
	});

	test('Should call the presubmit hook pre-submit', async ({ page }) => {
		await page.route('**/test', async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			expect(params.get('hiddenCheck')).toBe('true');
			await route.fulfill({ status: 200, body: 'OK' });
		});

		await page.goto('/mini.html');
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submit");
	});
	
});

