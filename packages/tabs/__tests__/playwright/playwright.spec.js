const { test, expect } = require('@playwright/test');
import AxeBuilder from '@axe-core/playwright';

let tabKey;

test.beforeEach(async ({ page }, testInfo) => {
	await page.goto('/');
	tabKey = testInfo.project.use.defaultBrowserType === 'webkit'
			? "Alt+Tab"
			: "Tab";
});

test.describe('Tabs > Functionality', { tag: '@all'}, () => {
	test('should make the appropriate tabpanel visible when clicked', async ({ page }) => {
		const firstPanel = page.locator('#panel-1');
		await expect(firstPanel).toBeVisible();

		const secondTab = page.locator('#tab-2');
		const secondPanel = page.locator('#panel-2');

		await secondTab.click();
		await expect(secondTab).toHaveClass(/is--active/);
		await expect(secondPanel).toHaveClass(/is--active/);
		await expect(firstPanel).not.toBeVisible();
		await expect(secondPanel).toBeVisible();
	});

	test('should make the appropriate tabpanel visible when the data attribute is used', async ({ page }) => {
		const sixthPanel = page.locator('#panel-6');
		await expect(sixthPanel).toBeVisible();
		const sixthTab = page.locator('#tab-6');
		await expect(sixthTab).toHaveClass(/is--active/);
	});

	test('should make the appropriate tabpanel visible when the page loads with a hash', async ({ page }) => {
		await page.goto('/#panel-3');
		await page.reload();
		const thirdPanel = page.locator('#panel-3');
		await expect(thirdPanel).toBeVisible();
		const thirdTab = page.locator('#tab-3');
		await expect(thirdTab).toHaveClass(/is--active/);
	});

});

test.describe('Tabs > Accessibility > ARIA', { tag: '@all'}, () => {
	
	test('should set the aria selected attribute when a tab button is clicked', async ({ page }) => {
		const secondTab = page.locator('#tab-2');
		await secondTab.click();
		await expect(secondTab).toHaveAttribute('aria-selected', 'true');
	});

	test('should set the appropriate aria attributes for the tabs', async ({ page }) => {
		const tabs = await page.locator('.tabs__tab:not(.is--active)').all(); 
		for (const tab of tabs) {
			await expect(tab).toHaveAttribute('role', 'tab');
			await expect(tab).toHaveAttribute('tabindex', '-1');
			await expect(tab).toHaveAttribute('aria-selected', 'false');
		}

		const activeTabs = await page.locator('.tabs__tab.is--active').all(); 
		for (const activeTab of activeTabs) {
			await expect(activeTab).toHaveAttribute('role', 'tab');
			await expect(activeTab).toHaveAttribute('tabindex', '0');
			await expect(activeTab).toHaveAttribute('aria-selected', 'true');
		}
	});

	test('should set the appropriate aria attributes for the panels', async ({ page }) => {
		const panels = await page.locator('.tabs__tabpanel:not(.is--active)').all(); 
		for (const panel of panels) {
			await expect(panel).toHaveAttribute('role', 'tabpanel');
			await expect(panel).toHaveAttribute('tabindex', '-1');
			await expect(panel).toHaveAttribute('hidden', 'hidden');
			await expect(panel).toHaveAttribute('aria-labelledby');

			const labelledby = await panel.getAttribute('aria-labelledby');
			const matchingLabel =  page.locator('#' + labelledby);
			expect(await matchingLabel.count()).toBe(1);
		}

		const activePanels = await page.locator('.tabs__tabpanel.is--active').all(); 
		for (const activePanel of activePanels) {
			await expect(activePanel).toHaveAttribute('role', 'tabpanel');
			await expect(activePanel).toHaveAttribute('tabindex', '0');
			await expect(activePanel).not.toHaveAttribute('hidden');
			await expect(activePanel).toHaveAttribute('aria-labelledby');

			const labelledby = await activePanel.getAttribute('aria-labelledby');
			const matchingLabel =  page.locator('#' + labelledby);
			expect(await matchingLabel.count()).toBe(1);
		}
	});
});

test.describe('Tabs > Accessibility > Keyboard', { tag: '@all'}, () => {
	
	// describe(`Tabs > Accessibility > keyboard events auto `, () => {
	
	// 	beforeAll(() => {init();});
	
	// 	it('should add keyboard event listener for the left and right keys to each tab', () => {
	// 		const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });
	// 		const left = new window.KeyboardEvent('keydown', { keyCode: 37, bubbles: true });
	
	// 		TabSet[0].getState().tabs[0].dispatchEvent(right);
	// 		expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
	// 		TabSet[0].getState().tabs[1].dispatchEvent(left);
	// 		expect(TabSet[0].getState().tabs[0].getAttribute('aria-selected')).toEqual('true');
	// 	});
		
	// });
	
	// describe(`Tabs > Accessibility > keyboard events manual `, () => {
	
	// 	beforeAll(() => {init('manual');});
	
	// 	it('should add keyboard event listener for the left and right keys to each tab', () => {
	// 		const right = new window.KeyboardEvent('keydown', { keyCode: 39, bubbles: true });
	
	// 		TabSet[0].getState().tabs[0].dispatchEvent(right);
	// 		//should not change the active tab (just move focus)
	// 		expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('false');
	// 		expect(TabSet[0].getState().tabs[0].getAttribute('aria-selected')).toEqual('true');
	// 		expect(TabSet[0].getState().tabs[0].classList.contains('is--active')).toBeTruthy();
	// 	});
		
	// });
	
	// describe(`Tabs > Accessibility > keyboard events both `, () => {
	
	// 	beforeAll(() => {init();});
		
	// 	it('should add keyboard event listener for the space key to each tab', () => {
	// 		const space = new window.KeyboardEvent('keydown', { keyCode: 32, bubbles: true });
	
	// 		TabSet[0].getState().tabs[1].dispatchEvent(space);
	// 		expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
			
	// 	});
	
	// 	it('should add keyboard event listener for the enter key to each tab', () => {
	// 		const enter = new window.KeyboardEvent('keydown', { keyCode: 13, bubbles: true });
	
	// 		TabSet[0].getState().tabs[2].dispatchEvent(enter);
	// 		expect(TabSet[0].getState().tabs[2].getAttribute('aria-selected')).toEqual('true');
			
	// 	});
	
	// 	it('should ignore other keyboard events, tab should follow tab order of the page', () => {
	// 		const tab = new window.KeyboardEvent('keydown', { keyCode: 9, bubbles: true });
	// 		const space = new window.KeyboardEvent('keydown', { keyCode: 32, bubbles: true });
	
	// 		TabSet[0].getState().tabs[1].dispatchEvent(space);
	// 		TabSet[0].getState().tabs[1].dispatchEvent(tab);
	// 		expect(TabSet[0].getState().tabs[1].getAttribute('aria-selected')).toEqual('true');
			
	// 	});
	
	// });
	
});

test.describe('Tabs > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});


