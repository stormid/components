import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import tabs from '../../src/index.js';

const anchorMarkup = (attrs = '') => `<div role="tablist" ${attrs}>
    <nav class="tabs__nav">
        <a id="tab-1" class="js-tabs__link" href="#panel-1" role="tab">Tab 1</a>
        <a id="tab-2" class="js-tabs__link" href="#panel-2" role="tab">Tab 2</a>
        <a id="tab-3" class="js-tabs__link" href="#panel-3" role="tab">Tab 3</a>
    </nav>
    <section id="panel-1" role="tabpanel">Panel 1</section>
    <section id="panel-2" role="tabpanel" hidden><p><a href="/">link</a></p></section>
    <section id="panel-3" role="tabpanel" hidden><p><a href="/">link</a></p></section>
</div>`;

const buttonMarkup = (attrs = '') => `<div role="tablist" ${attrs}>
    <div class="tabs__nav">
        <button id="tab-1" class="js-tabs__link" aria-controls="panel-1" role="tab" type="button">Tab 1</button>
        <button id="tab-2" class="js-tabs__link" aria-controls="panel-2" role="tab" type="button">Tab 2</button>
        <button id="tab-3" class="js-tabs__link" aria-controls="panel-3" role="tab" type="button">Tab 3</button>
    </div>
    <section id="panel-1" role="tabpanel">Panel 1</section>
    <section id="panel-2" role="tabpanel" hidden>Panel 2</section>
    <section id="panel-3" role="tabpanel" hidden>Panel 3</section>
</div>`;

const keydown = (el, key) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

const visiblePanels = () => document.querySelectorAll('[role=tabpanel]:not([hidden])');
const activeTabs = () => document.querySelectorAll('[role=tab].is--active');

// replaceState mutates location.hash, which would leak the active-tab hash into
// the next test's init - reset it before every test.
beforeEach(() => window.history.replaceState(null, '', '/'));

describe('Tabs > interaction > click after manual arrow-nav (regression)', () => {

    let instance;
    beforeEach(() => {
        document.body.innerHTML = anchorMarkup();
        [instance] = tabs('[role=tablist]', { activation: 'manual', updateUrl: false });
    });

    it('activates the clicked tab and closes only the previously-open panel', () => {
        assert.strictEqual(instance.getState().activeIndex, 0);

        // manual arrow only moves focus - activeTabIndex diverges from activeIndex
        keydown(document.getElementById('tab-1'), 'ArrowRight');
        assert.strictEqual(instance.getState().activeTabIndex, 1);
        assert.strictEqual(instance.getState().activeIndex, 0);
        assert.strictEqual(visiblePanels().length, 1);

        // clicking must close the *activated* panel (0), not the *focused* one (1)
        document.getElementById('tab-2').click();
        assert.strictEqual(instance.getState().activeIndex, 1);

        const visible = visiblePanels();
        assert.strictEqual(visible.length, 1);
        assert.strictEqual(visible[0].id, 'panel-2');

        const active = activeTabs();
        assert.strictEqual(active.length, 1);
        assert.strictEqual(active[0].id, 'tab-2');
    });

});

describe('Tabs > interaction > click (auto)', () => {

    beforeEach(() => {
        document.body.innerHTML = anchorMarkup();
        tabs('[role=tablist]', { updateUrl: false });
    });

    it('activates the clicked tab and reveals its panel', () => {
        document.getElementById('tab-3').click();
        const visible = visiblePanels();
        assert.strictEqual(visible.length, 1);
        assert.strictEqual(visible[0].id, 'panel-3');
        assert.strictEqual(activeTabs()[0].id, 'tab-3');
    });

});

describe('Tabs > keyboard > Home / End (auto)', () => {

    let instance;
    beforeEach(() => {
        document.body.innerHTML = anchorMarkup();
        [instance] = tabs('[role=tablist]', { updateUrl: false });
    });

    it('activates the last tab on End and the first on Home', () => {
        keydown(document.getElementById('tab-1'), 'End');
        assert.strictEqual(instance.getState().activeIndex, 2);
        assert.strictEqual(visiblePanels()[0].id, 'panel-3');

        keydown(document.getElementById('tab-3'), 'Home');
        assert.strictEqual(instance.getState().activeIndex, 0);
        assert.strictEqual(visiblePanels()[0].id, 'panel-1');
    });

});

describe('Tabs > keyboard > roving tabindex (manual)', () => {

    let instance;
    beforeEach(() => {
        document.body.innerHTML = anchorMarkup();
        [instance] = tabs('[role=tablist]', { activation: 'manual', updateUrl: false });
    });

    it('moves tabindex="0" to the focused tab without activating it', () => {
        keydown(document.getElementById('tab-1'), 'ArrowRight');

        assert.strictEqual(document.getElementById('tab-2').getAttribute('tabindex'), '0');
        assert.strictEqual(document.getElementById('tab-1').getAttribute('tabindex'), '-1');
        // activation is unchanged - tab-1 is still the selected tab
        assert.strictEqual(instance.getState().activeIndex, 0);
        assert.strictEqual(document.getElementById('tab-1').classList.contains('is--active'), true);
    });

});

describe('Tabs > buttons', () => {

    let instance;
    beforeEach(() => {
        document.body.innerHTML = buttonMarkup();
        [instance] = tabs('[role=tablist]', { updateUrl: false });
    });

    it('initialises button-based tabs without throwing', () => {
        assert.notStrictEqual(instance, undefined);
        assert.strictEqual(document.getElementById('tab-1').getAttribute('aria-controls'), 'panel-1');
    });

    it('activates a button tab on click', () => {
        document.getElementById('tab-2').click();
        assert.strictEqual(instance.getState().activeIndex, 1);
        assert.strictEqual(visiblePanels()[0].id, 'panel-2');
    });

});

describe('Tabs > aria > tab id fallback', () => {

    it('mints an id for a tab that has none so its panel can reference it, never aria-labelledby="null"', () => {
        document.body.innerHTML = `<div role="tablist">
            <div class="tabs__nav">
                <button class="js-tabs__link" aria-controls="panel-1" role="tab" type="button">Tab 1</button>
                <button class="js-tabs__link" aria-controls="panel-2" role="tab" type="button">Tab 2</button>
            </div>
            <section id="panel-1" role="tabpanel">Panel 1</section>
            <section id="panel-2" role="tabpanel" hidden>Panel 2</section>
        </div>`;

        tabs('[role=tablist]', { updateUrl: false });

        const [tab1, tab2] = document.querySelectorAll('[role=tab]');
        assert.ok(tab1.getAttribute('id'));
        assert.ok(tab2.getAttribute('id'));
        assert.strictEqual(document.getElementById('panel-1').getAttribute('aria-labelledby'), tab1.getAttribute('id'));
        assert.strictEqual(document.getElementById('panel-2').getAttribute('aria-labelledby'), tab2.getAttribute('id'));
    });

});

describe('Tabs > options > updateUrl', () => {

    it('does not update the URL when data-update-url="false"', () => {
        document.body.innerHTML = anchorMarkup('data-update-url="false"');
        let calls = 0;
        const original = window.history.replaceState;
        window.history.replaceState = function (...args) { calls++; return original.apply(this, args); };

        tabs('[role=tablist]');
        document.getElementById('tab-2').click();

        window.history.replaceState = original;
        assert.strictEqual(calls, 0);
    });

    it('updates the URL by default', () => {
        document.body.innerHTML = anchorMarkup();
        let calls = 0;
        const original = window.history.replaceState;
        window.history.replaceState = function (...args) { calls++; return original.apply(this, args); };

        tabs('[role=tablist]');
        document.getElementById('tab-2').click();

        window.history.replaceState = original;
        assert.ok(calls > 0);
    });

});

describe('Tabs > activeIndex bounds', () => {

    it('falls back to 0 for an out-of-range activeIndex option', () => {
        document.body.innerHTML = anchorMarkup();
        const [instance] = tabs('[role=tablist]', { activeIndex: 99, updateUrl: false });
        assert.strictEqual(instance.getState().activeIndex, 0);
    });

    it('falls back to 0 for a non-numeric data-active-index', () => {
        document.body.innerHTML = anchorMarkup('data-active-index="abc"');
        const [instance] = tabs('[role=tablist]', { updateUrl: false });
        assert.strictEqual(instance.getState().activeIndex, 0);
    });

});

describe('Tabs > API > onChange, destroy, goTo', () => {

    it('calls onChange with { activeIndex, tab, panel } on activation but not on load', () => {
        document.body.innerHTML = anchorMarkup();
        const changes = [];
        tabs('[role=tablist]', { updateUrl: false, onChange: payload => changes.push(payload) });

        assert.strictEqual(changes.length, 0);

        document.getElementById('tab-2').click();
        assert.strictEqual(changes.length, 1);
        assert.strictEqual(changes[0].activeIndex, 1);
        assert.strictEqual(changes[0].tab.id, 'tab-2');
        assert.strictEqual(changes[0].panel.id, 'panel-2');
    });

    it('removes event listeners on destroy', () => {
        document.body.innerHTML = anchorMarkup();
        const [instance] = tabs('[role=tablist]', { updateUrl: false });
        instance.destroy();

        document.getElementById('tab-2').click();
        assert.strictEqual(instance.getState().activeIndex, 0);
    });

    it('activates a tab programmatically via goTo', () => {
        document.body.innerHTML = anchorMarkup();
        const [instance] = tabs('[role=tablist]', { updateUrl: false });
        instance.goTo(2);

        assert.strictEqual(instance.getState().activeIndex, 2);
        const visible = visiblePanels();
        assert.strictEqual(visible.length, 1);
        assert.strictEqual(visible[0].id, 'panel-3');
    });

});
