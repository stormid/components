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

	test('should make the appropriate tabpanel visible when using the activeIndex', async ({ page }) => {
		await page.goto('/focus.html');
		const thirdPanel = page.locator('#panel-6');
		await expect(thirdPanel).toBeVisible();
		const thirdTab = page.locator('#tab-6');
		await expect(thirdTab).toHaveClass(/is--active/);
	});

	test('should autofocus on the active tab if the autofocus setting is used', async ({ page }) => {
		await page.goto('/focus.html');
		const focussed = page.locator(':focus');
		await expect(focussed).toHaveAttribute('id', 'tab-1');
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

test.describe('Tabs > Manual activation > Keyboard', { tag: '@all'}, () => {
	
	test('should use the arrow keys to navigate between tabs for selection without activating', async ({ page }) => {
		await page.keyboard.press(tabKey);
		let focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-1');
		await expect(focussed).toHaveClass(/is--active/);

		await page.keyboard.press('ArrowRight');
		focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-2');
		await expect(focussed).not.toHaveClass(/is--active/);

		await page.keyboard.press('ArrowLeft');
		focussed = page.locator(':focus');

		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-1');
		await expect(focussed).toHaveClass(/is--active/);
	});

	test('should activate the tab on pressing the enter key', async ({ page }) => {
		await page.keyboard.press(tabKey);
		let focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-1');
		await expect(focussed).toHaveClass(/is--active/);

		await page.keyboard.press('ArrowRight');
		focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-2');
		await expect(focussed).not.toHaveClass(/is--active/);

		await page.keyboard.press('Enter');
		focussed = page.locator(':focus');

		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-2');
		await expect(focussed).toHaveClass(/is--active/);
		await expect(page.locator('#panel-2')).toBeVisible();
	});

	test('should activate the tab on pressing the space bar', async ({ page }) => {
		await page.keyboard.press(tabKey);
		let focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-1');
		await expect(focussed).toHaveClass(/is--active/);

		await page.keyboard.press('ArrowRight');
		focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-2');
		await expect(focussed).not.toHaveClass(/is--active/);

		await page.keyboard.press(' ');
		focussed = page.locator(':focus');

		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-2');
		await expect(focussed).toHaveClass(/is--active/);
		await expect(page.locator('#panel-2')).toBeVisible();
	});

});

test.describe('Tabs > Auto activation > Keyboard', { tag: '@all'}, () => {
	
	test('should use the arrow keys to navigate between tabs and activate', async ({ page }) => {
		await page.keyboard.press(tabKey);
		await page.keyboard.press(tabKey);
		await page.keyboard.press(tabKey);
		let focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-6');
		await expect(focussed).toHaveClass(/is--active/);

		await page.keyboard.press('ArrowRight');
		focussed = page.locator(':focus');

		await expect(focussed).toHaveAttribute('id', 'tab-4');
		await expect(focussed).toHaveClass(/is--active/);
		await expect(page.locator('#panel-4')).toBeVisible();

		await page.keyboard.press('ArrowLeft');
		focussed = page.locator(':focus');

		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-6');
		await expect(focussed).toHaveClass(/is--active/);
		await expect(page.locator('#panel-6')).toBeVisible();
	});

});


test.describe('Tabs > Keyboard > Home and End', { tag: '@all'}, () => {

	test('should activate the first tab on Home and the last on End', async ({ page }) => {
		await page.locator('#tab-5').click();
		await expect(page.locator('#tab-5')).toHaveClass(/is--active/);

		await page.keyboard.press('End');
		await expect(page.locator('#tab-6')).toHaveClass(/is--active/);
		await expect(page.locator('#panel-6')).toBeVisible();

		await page.keyboard.press('Home');
		await expect(page.locator('#tab-4')).toHaveClass(/is--active/);
		await expect(page.locator('#panel-4')).toBeVisible();
	});

});

test.describe('Tabs > Manual activation > Roving tabindex', { tag: '@all'}, () => {

	test('should move tabindex to the focused tab without activating it', async ({ page }) => {
		await page.keyboard.press(tabKey);
		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-1');

		await page.keyboard.press('ArrowRight');
		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-2');
		await expect(page.locator('#tab-2')).toHaveAttribute('tabindex', '0');
		await expect(page.locator('#tab-1')).toHaveAttribute('tabindex', '-1');
		// selection stays on the originally-active tab in manual mode
		await expect(page.locator('#tab-1')).toHaveClass(/is--active/);
	});

});

test.describe('Tabs > Buttons', { tag: '@all'}, () => {

	test('should activate a button-based tab on click', async ({ page }) => {
		await expect(page.locator('#panel-7')).toBeVisible();

		await page.locator('#tab-8').click();
		await expect(page.locator('#tab-8')).toHaveClass(/is--active/);
		await expect(page.locator('#panel-8')).toBeVisible();
		await expect(page.locator('#panel-7')).not.toBeVisible();
	});

	test('should activate a button-based tab with the keyboard', async ({ page }) => {
		await page.locator('#tab-7').focus();
		await page.keyboard.press('ArrowRight');
		await expect(page.locator(':focus')).toHaveAttribute('id', 'tab-8');

		await page.keyboard.press('Enter');
		await expect(page.locator('#tab-8')).toHaveClass(/is--active/);
		await expect(page.locator('#panel-8')).toBeVisible();
	});

});

test.describe('Tabs > Axe', { tag: '@reduced'}, () => {
	test('Should not have any automatically detectable accessibility issues', async ({ page }) => {	
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); 
		expect(accessibilityScanResults.violations).toEqual([]);
	});
});


