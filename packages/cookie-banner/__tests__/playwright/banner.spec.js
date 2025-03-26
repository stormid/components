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

// describe(`Cookie banner > DOM > render`, () => {
//     beforeAll(init);

//     it('It should render the banner', async () => {
//         expect(document.querySelector(`.${defaults.classNames.banner}`)).not.toBeNull();
//     });
// });

// describe(`Cookie banner > DOM > not render`, () => {

//     it('It should not render the banner if hideBannerOnFormPage setting is true and on consent form page', async () => {
//         document.body.innerHTML = `<div class="privacy-banner__form-container"></div>`;
//         cookieBanner({
//             secure: false,
//             hideBannerOnFormPage: true,
//             types: {
//                 test: {
//                     title: 'Test title',
//                     description: 'Test description',
//                     labels: {
//                         yes: 'Pages you visit and actions you take will be measured and used to improve the service',
//                         no: 'Pages you visit and actions you take will not be measured and used to improve the service'
//                     },
//                     fns: [
//                         () => { }
//                     ]
//                 }
//             }
//         });
//         expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
//     });
// });


// describe(`Cookie banner > DOM > accessibility`, () => {
//     beforeAll(init);
//     it('The banner should be a region', async () => {
//         expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('role')).toEqual('region');
//     });
    
//     it('The banner should be a polite aria live region', async () => {
//         expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('aria-live')).toEqual('polite');
//     });
    
//     it('The banner should have an aria label', async () => {
//         expect(document.querySelector(`.${defaults.classNames.banner}`).getAttribute('aria-label')).toBeDefined();
//     });
    
// });

// describe(`Cookie banner > DOM > interactions`, () => {
//     beforeAll(init);
    
//     it('Hides the banner', async () => {
//         document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
//         expect(document.querySelector(`.${defaults.classNames.banner}`)).toBeNull();
//     });

// });

//  it('Sets a cookie based on preferences form', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":1,"performance":1}}`)}`);

// 		const fields = Array.from(document.querySelectorAll(`.${defaults.classNames.field}`));
// 		fields[1].checked = true;
// 		fields[3].checked = true;
// 		document.querySelector(`.${defaults.classNames.submitBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
// 	});

//  it('Should reject all cookies whe the reject button is clicked', async () => {
// 		document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
// 		expect(document.cookie).toEqual(`${defaults.name}=${btoa(`{"consent":{"test":0,"performance":0}}`)}`);
// 	});

// describe(`Cookie banner > Analytics > Data layer additions`, () => {
// 	beforeAll(init);

// 	it('It should add to the dataLayer when the banner is shown', async () => {
// 		expect(dataLayer.find(e => e.event === "stormcb_display")).toBeDefined();
// 	});

// 	it('It should add to the datalayer when accept all is clicked', async () => {
// 		document.querySelector(`.${defaults.classNames.acceptBtn}`).click();
// 		expect(dataLayer.find(e => e.event === "stormcb_accept_all")).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_performance === 1)).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_test === 1)).toBeDefined();
// 	});

// 	it('It should add to the datalayer when reject all is clicked', async () => {
// 		instance.showBanner();
// 		document.querySelector(`.${defaults.classNames.rejectBtn}`).click();
// 		expect(dataLayer.find(e => e.event === "stormcb_reject_all")).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_performance === 0)).toBeDefined();
// 		expect(dataLayer.find(e => e.stormcb_test === 0)).toBeDefined();
// 	});
// });

