const { test, expect } = require("@playwright/test");
import AxeBuilder from "@axe-core/playwright";

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto("/form.html");
	tabKey = testInfo.project.use.defaultBrowserType === "webkit" ? "Alt+Tab" : "Tab";
});

test.describe("Cookie banner > Functionality", { tag: "@all" }, () => {
	test("Should not render the banner when the hideBannerOnFormPage has been used", async ({ page }) => {
		const banner = page.locator(".privacy-banner");
		await expect(banner).toHaveCount(0);
	});

	test("Should not render the form if there is no form container on the page", async ({ page }) => {
		await page.goto("/");
		const form = page.locator(".privacy-banner__form");
		await expect(form).toHaveCount(0);
	});

	test("Should render the form if the container is on the page", async ({ page }) => {
		const form = page.locator(".privacy-banner__form");
		await expect(form).toHaveCount(1);
		await expect(form).toBeVisible();
	});

	test("The submit button should be disabled if no choices are made", async ({ page }) => {
		const radios = await page.getByRole('radio').all();
		const submitBtn = page.locator(".privacy-banner__submit");
		await expect(submitBtn).toHaveRole('button');

		for (const radio of radios) {
			await expect(radio).not.toBeChecked();
		}

		await expect(submitBtn).toBeDisabled();
	});

	test("The submit button should be enabled if choices are made for all consent types", async ({ page }) => {
		const submitBtn = page.locator(".privacy-banner__submit");
		await expect(submitBtn).toBeDisabled();
		await expect(submitBtn).toHaveRole('button');

		await page.getByLabel(/Our partners might serve you ads knowing you have visited our website/).check({force: true});
		await expect(submitBtn).toBeDisabled();

		await page.getByLabel(/Pages you visit and actions you take will not be measured and used to improve the service/).check({force: true});
		await expect(submitBtn).toBeEnabled();
	});

	test("A cookie should be set when the form is submitted and user preferences updated", async ({ page, context }) => {
		const submitBtn = page.locator(".privacy-banner__submit");

		await page.getByLabel(/Our partners might serve you ads knowing you have visited our website/).check({force: true});
		await page.getByLabel(/Pages you visit and actions you take will not be measured and used to improve the service/).check({force: true});
		await submitBtn.click();

		let cookies = await context.cookies();
		let preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":0,"ads":1}}`));

		await page.getByLabel(/Pages you visit and actions you take will be measured and used to improve the service/).check({force: true});
		await page.getByLabel(/Our partners will still serve you ads, but they will not know you have visited out website/).check({force: true});
		await submitBtn.click();

		cookies = await context.cookies();
		preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":1,"ads":0}}`));
	});
});

test.describe("Cookie banner > Form >Markup", { tag: "@all" }, () => {
	test("Should render a fieldset for each cookie type", async ({ page }) => {
		const fieldsets = page.locator(".privacy-banner__fieldset");
		await expect(fieldsets).toHaveCount(2);

		for (const fieldset of await fieldsets.all()) {
			await expect(fieldset.locator('legend')).toHaveCount(1);
		}
	});

	test("Should have a yes/no radio button per cookie type with appropriate labels", async ({ page }) => {
		const labels = page.locator(".privacy-banner__fieldset label");

		for (const label of await labels.all()) {
			await expect(label.locator('input[type=radio]')).toHaveCount(1);
		}
	});
});

test.describe("Cookie banner > Form > Keyboard", { tag: "@all" }, () => {
	test("Should be able to update cookie preferences via keyboard", async ({ page, context }) => {
		for(let i = 0; i < 2; i++) {
			await page.keyboard.press(tabKey);
		}
		for(let i = 0; i < 2; i++) {
			await page.keyboard.press('Space');
			await page.keyboard.press(tabKey);
		}
		await page.keyboard.press('Enter');

		let cookies = await context.cookies();
		let preferences = cookies.find((c) => c.name === '.Components.Dev.Consent');
		expect(preferences.value).toEqual(btoa(`{"consent":{"performance":1,"ads":1}}`));
	});
});

test.describe("Cookie banner > Axe", { tag: "@reduced" }, () => {
	test("Should not have any automatically detectable accessibility issues", async ({ page }) => {
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});