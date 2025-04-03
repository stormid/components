const { test, expect } = require('@playwright/test');

const deepEqual = (a, b) => {
	if (a === b) return true;
	if (typeof a !== 'object' || typeof b !== 'object') return false;
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	return Object.keys(a).every(key => deepEqual(a[key], b[key]));
}

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test.describe('Cookie banner > Google EU Consent', { tag: '@all'}, () => {
	test('Should set a default consent event with all categories denied', async ({ page }) => {	
		let dataLayer = await page.evaluate(() => window.dataLayer);
		const expectedConsent = {
			'0': 'consent',
			'1': 'default',
			'2': {
			  ad_storage: 'denied',
			  ad_user_data: 'denied',
			  ad_personalization: 'denied',
			  analytics_storage: 'denied',
			  wait_for_update: 500
			}
		};
		expect(dataLayer.find(e => deepEqual(e, expectedConsent))).toBeDefined();	
	});

	test('Should set consent to granted if accept all is clicked', async ({ page }) => {
		const acceptAll = page.locator('.privacy-banner__accept').first();
		const updatedConsent = {
			'0': 'consent',
			'1': 'update',
			'2': {
			  ad_storage: 'granted',
			  ad_user_data: 'granted',
			  ad_personalization: 'granted',
			  analytics_storage: 'granted',
			}
		};

		await acceptAll.click();
		const dataLayer = await page.evaluate(() => window.dataLayer);
		expect(dataLayer.find(e => deepEqual(e, updatedConsent))).toBeDefined();
	});

	test('Should set consent to denied if reject all is clicked', async ({ page }) => {
		const rejectAll = page.locator('.privacy-banner__reject').first();
		const updatedConsent = {
			'0': 'consent',
			'1': 'update',
			'2': {
			  ad_storage: 'denied',
			  ad_user_data: 'denied',
			  ad_personalization: 'denied',
			  analytics_storage: 'denied',
			}
		};

		await rejectAll.click();
		const dataLayer = await page.evaluate(() => window.dataLayer);
		expect(dataLayer.find(e => deepEqual(e, updatedConsent))).toBeDefined();
	});
});
