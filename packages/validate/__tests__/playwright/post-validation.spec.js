const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("Validate > Post-validation", { tag: "@all" }, () => {
	test("Should add correct user input to the form data if the form is valid", async ({ page }) => {
		let capturedParams = null;
		let routeResolve;
		const routePromise = new Promise((resolve) => {
			routeResolve = resolve;
		});
		await page.route("**/test", async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			capturedParams = params;
			await route.fulfill({ status: 200, body: "OK" });
			routeResolve();
		});

		await page.goto("/mini.html");
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submitTest");

		await routePromise;

		expect(capturedParams).not.toBeNull();
		expect(capturedParams.get("fname")).toBe("John");
		expect(capturedParams.get("lname")).toBe("Doe");
	});

	test("Should mutate the action attribute of the form if the submit button clicked has a formaction", async ({ page }) => {
		let capturedParams = null;
		let routeResolve;
		const routePromise = new Promise((resolve) => {
			routeResolve = resolve;
		});
		await page.route("**/alternative", async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			capturedParams = params;
			await route.fulfill({ status: 200, body: "OK" });
			routeResolve();
		});

		await page.goto("/mini.html");
		await page.locator("#submitTest").evaluate((button) => {
			button.setAttribute("formaction", "/alternative");
		});
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submitTest");

		await routePromise;

		expect(capturedParams).not.toBeNull();
		expect(capturedParams.get("fname")).toBe("John");
		expect(capturedParams.get("lname")).toBe("Doe");
	});

	test("Should call the presubmit hook pre-submit", async ({ page }) => {
		let capturedParams = null;
		let routeResolve;
		const routePromise = new Promise((resolve) => {
			routeResolve = resolve;
		});
		await page.route("**/test", async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			capturedParams = params;
			await route.fulfill({ status: 200, body: "OK" });
			routeResolve();
		});

		await page.goto("/mini.html");
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submitTest");

		await routePromise;

		expect(capturedParams).not.toBeNull();
		expect(capturedParams.get("hiddenCheck")).toBe("true");
	});

	test("Should add hidden field duplicate of a button field, for conferring submit button values", async ({ page }) => {
		let capturedParams = null;
		let routeResolve;
		const routePromise = new Promise((resolve) => {
			routeResolve = resolve;
		});
		await page.route("**/test", async (route, request) => {
			const postData = request.postData();
			const params = new URLSearchParams(postData);
			capturedParams = params;
			await route.fulfill({ status: 200, body: "OK" });
			routeResolve();
		});

		await page.goto("/mini.html");
		await page.fill("#fname", "John");
		await page.fill("#lname", "Doe");
		await page.click("#submitTest");

		await routePromise;
		expect(capturedParams).not.toBeNull();
		expect(capturedParams.get("submitTest")).toBe("checking");
	});
});
