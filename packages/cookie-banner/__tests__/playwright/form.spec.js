const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Cookie banner > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});

//  it('Submit button should be disabled', async () => {
// 		expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();
// 	});

// 	it('Submit button should be enabled if both field groups have values', async () => {
// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));

// 		fields[0].checked = true;
// 		dispatchSyntheticEvent(fields[0], 'change');//for JSDOM
// 		expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).not.toBeNull();

// 		fields[2].checked = true;
// 		dispatchSyntheticEvent(fields[2], 'change');//for JSDOM
// 		expect(document.querySelector(`.${defaults.classNames.submitBtn}`).getAttribute('disabled')).toEqual(null);
// 	});

// 	it('Submit button should set the cookie and hide the banner', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1}}`)}`);
// 		expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
// 	});

// it('Should return if there is no form container', async () => {
// 		expect(document.querySelector(`.${defaults.classNames.form}`)).toBeNull();
// 	});

// it('Should render the form', async () => {
// 		expect(document.querySelector(`.${defaults.classNames.form}`)).not.toBeNull();
// 	});

// 	it('Should render a fieldset for each type', async () => {
// 		const fieldset = Array.from(document.querySelectorAll(`.${defaults.classNames.fieldset}`));
// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
// 		expect(fieldset.length).toEqual(2);
// 		expect(fields.length).toEqual(4);
// 	});

// 	it('Should set the default values if any are set and no there is no user consent preferences', async () => {
// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
// 		expect(fields[0].checked).toEqual(true);
// 	});

//  it('Sets a cookie based on preferences form', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1}}`)}`);

// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
// 		fields[1].checked = true;
// 		fields[3].checked = true;
// 		document.querySelector(`.${defaults.classNames.submitBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
// 	});

