const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});


test.describe('Cookie banner > IFrame ', { tag: '@all'}, () => {
	test('Should not have any visible iframes when banner is initially shown', async ({ page }) => {	
		const banner = page.locator('.privacy-banner');
		await expect(banner).toBeVisible();

		const iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);

		const placeholders = page.locator('[data-iframe-src]');
		expect(await placeholders.count()).toBeGreaterThan(0);
	});

	test('Should not have any visible iframes when cookies are rejected', async ({ page }) => {	
		let iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);
		const rejectAll = page.locator('.privacy-banner__reject').first();
		await rejectAll.click();
		iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);
	});

	test('Should load the iframes when all cookies are accepted', async ({ page }) => {	
		let iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);
		const acceptAll = page.locator('.privacy-banner__accept').first();
		await acceptAll.click();
		iframes = page.locator('iframe');
		expect(await iframes.count()).toBeGreaterThan(0);
	});

	test('Should not have any visible iframes when cookies are rejected via the form', async ({ page }) => {	
		await page.goto('/form.html');

		let iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);

		const radios = await page.getByLabel(/No thank you/).all();
		for(const radio of radios) {
			await radio.check({force: true});
		}
		await page.locator('.privacy-banner__submit').click();

		iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);
	});

	test('Should not have any visible iframes if only performance cookies are accepted', async ({ page }) => {	
		await page.goto('/form.html');

		let iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);

		await page.getByLabel(/Pages you visit and actions you take will be measured and used to improve the service/).check({force: true});
		await page.getByLabel(/Our partners will still serve you ads, but they will not know you have visited out website/).check({force: true});
		await page.locator('.privacy-banner__submit').click();

		iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);
	});

	test('Should load the iframe once third party cookies are accepted', async ({ page }) => {	
		await page.goto('/form.html');

		let iframes = page.locator('iframe');
		await expect(iframes).toHaveCount(0);

		await page.getByLabel(/Pages you visit and actions you take will not be measured and used to improve the service/).check({force: true});
		await page.getByLabel(/Our partners might serve you ads knowing you have visited our website/).check({force: true});
		await page.locator('.privacy-banner__submit').click();

		iframes = page.locator('iframe');
		expect(await iframes.count()).toBeGreaterThan(0);
	});

});

test.describe('Cookie banner > GA', { tag: '@all'}, () => {
	test('Should not load a GTM container by default', async ({ page }) => {	
		const banner = page.locator('.privacy-banner');
		await expect(banner).toBeVisible();

		const GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
	});

	test('Should not load a GTM container when cookies are rejected', async ({ page }) => {	
		let GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
		const rejectAll = page.locator('.privacy-banner__reject').first();
		await rejectAll.click();
		GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
	});

	test('Should load a GTM container when cookies are accepted', async ({ page }) => {	
		let GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
		const acceptAll = page.locator('.privacy-banner__accept').first();
		await acceptAll.click();
		GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(1);
	});

	test('Should not load a GTM container when cookies are rejected via the form', async ({ page }) => {	
		await page.goto('/form.html');

		let GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);

		const radios = await page.getByLabel(/No thank you/).all();
		for(const radio of radios) {
			await radio.check({force: true});
		}
		await page.locator('.privacy-banner__submit').click();

		GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
	});

	test('Should not have any visible iframes if only ads cookies are accepted', async ({ page }) => {	
		await page.goto('/form.html');

		let GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
		
		await page.getByLabel(/Our partners might serve you ads knowing you have visited our website/).check({force: true});
		await page.getByLabel(/Pages you visit and actions you take will not be measured and used to improve the service/).check({force: true});
		await page.locator('.privacy-banner__submit').click();

		GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
	});

	test('Should load a GTM container if performance cookies are accepted', async ({ page }) => {	
		await page.goto('/form.html');

		let GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(0);
		
		await page.getByLabel(/Pages you visit and actions you take will be measured and used to improve the service/).check({force: true});
		await page.getByLabel(/Our partners will still serve you ads, but they will not know you have visited out website/).check({force: true});
		await page.locator('.privacy-banner__submit').click();

		GTMscript = page.locator('script[src*="googletagmanager"]');
		await expect(GTMscript).toHaveCount(1);
	});
});

