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


//fulfils the first request to a path; the returned function resolves with that request
const captureRequest = async (page, pathname) => {
	let resolveRequest;
	const request = new Promise((resolve) => {
		resolveRequest = resolve;
	});
	await page.route((url) => url.pathname === pathname, async (route, req) => {
		await route.fulfill({ status: 200, body: "OK" });
		resolveRequest(req);
	});
	return () => request;
};

const fillForm = async (page) => {
	await page.fill("#fname", "John");
	await page.fill("#lname", "Doe");
};

const addToForm = (page, html) => page.locator("form").evaluate((form, markup) => form.insertAdjacentHTML("beforeend", markup), html);

test.describe("Validate > Post-validation > Submit button", { tag: "@all" }, () => {
	test("Should submit the name/value and formaction of the button that submitted the form, not other submit buttons", async ({ page }) => {
		const getRequest = await captureRequest(page, "/save");
		await page.goto("/mini.html");
		await addToForm(page, `<button type="submit" id="save" name="op" value="save" formaction="/save">Save</button>
			<button type="submit" id="publish" name="op" value="publish" formaction="/publish">Publish</button>`);
		await fillForm(page);
		await page.click("#save");

		const params = new URLSearchParams((await getRequest()).postData());
		expect(params.getAll("op")).toEqual(["save"]);
		expect(params.get("submitTest")).toBeNull();
		expect(params.get("fname")).toBe("John");
	});

	test("Should submit a button with no type attribute", async ({ page }) => {
		const getRequest = await captureRequest(page, "/untyped");
		await page.goto("/mini.html");
		await addToForm(page, `<button id="untyped" name="op" value="untyped" formaction="/untyped">Untyped</button>`);
		await fillForm(page);
		await page.click("#untyped");

		const params = new URLSearchParams((await getRequest()).postData());
		expect(params.get("op")).toBe("untyped");
	});

	test("Should submit a button outside the form associated by its form attribute", async ({ page }) => {
		const getRequest = await captureRequest(page, "/external");
		await page.goto("/mini.html");
		await page.locator("form").evaluate((form) => {
			form.id = "miniForm";
			form.insertAdjacentHTML("afterend", `<button type="submit" id="external" form="miniForm" name="op" value="external" formaction="/external">External</button>`);
		});
		await fillForm(page);
		await page.click("#external");

		const params = new URLSearchParams((await getRequest()).postData());
		expect(params.get("op")).toBe("external");
		expect(params.get("fname")).toBe("John");
	});

	test("Should submit with the formmethod of the button that submitted the form", async ({ page }) => {
		const getRequest = await captureRequest(page, "/get-test");
		await page.goto("/mini.html");
		await addToForm(page, `<button type="submit" id="get" formmethod="get" formaction="/get-test">Search</button>`);
		await fillForm(page);
		await page.click("#get");

		const request = await getRequest();
		expect(request.method()).toBe("GET");
		expect(new URL(request.url()).searchParams.get("fname")).toBe("John");
	});

	test("Should submit with the formenctype of the button that submitted the form", async ({ page }) => {
		const getRequest = await captureRequest(page, "/multipart-test");
		await page.goto("/mini.html");
		await addToForm(page, `<button type="submit" id="multipart" formenctype="multipart/form-data" formaction="/multipart-test">Upload</button>`);
		await fillForm(page);
		await page.click("#multipart");

		const request = await getRequest();
		expect(request.headers()["content-type"]).toMatch(/^multipart\/form-data/);
		expect(request.postData()).toContain("John");
	});

	test("Should submit to the formtarget of the button that submitted the form", async ({ page }) => {
		const getRequest = await captureRequest(page, "/target-test");
		await page.goto("/mini.html");
		await page.locator("body").evaluate((body) => body.insertAdjacentHTML("beforeend", `<iframe name="result"></iframe>`));
		await addToForm(page, `<button type="submit" id="targeted" formtarget="result" formaction="/target-test">Preview</button>`);
		await fillForm(page);
		await page.click("#targeted");

		const request = await getRequest();
		expect(request.frame().name()).toBe("result");
		expect(new URL(page.url()).pathname).toBe("/mini.html");
	});

	test("Should submit the form when it contains a control named submit", async ({ page }) => {
		const getRequest = await captureRequest(page, "/test");
		await page.goto("/mini.html");
		await addToForm(page, `<input type="submit" id="namedSubmit" name="submit" value="Send">`);
		await fillForm(page);
		await page.click("#namedSubmit");

		const params = new URLSearchParams((await getRequest()).postData());
		expect(params.get("submit")).toBe("Send");
	});

	test("Should submit without validating or calling the preSubmitHook if the button that submitted the form has formnovalidate", async ({ page }) => {
		const getRequest = await captureRequest(page, "/draft");
		await page.goto("/mini.html");
		await addToForm(page, `<button type="submit" id="draft" name="op" value="draft" formaction="/draft" formnovalidate>Save draft</button>`);
		await page.click("#draft");

		const params = new URLSearchParams((await getRequest()).postData());
		expect(params.get("op")).toBe("draft");
		expect(params.get("fname")).toBe("");
		expect(params.get("hiddenCheck")).toBeNull();
	});
});
