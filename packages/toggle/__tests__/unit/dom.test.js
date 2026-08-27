import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import toggle from '../../src/index.js';
import { findToggles, getFocusableChildren, getStateFromDOM, toggleAttributes } from '../../src/lib/dom.js';
import { coerceSettings, BOOLEAN_SETTINGS, NUMBER_SETTINGS } from '../../src/lib/utils.js';
import defaults from '../../src/lib/defaults.js';

describe('Toggle > dom > findToggles', () => {

    it('should return the buttons and anchors named by the data-toggle attribute', () => {
        document.body.innerHTML = `<button class="js-find-btn">Test toggle</button>
            <a href="#" class="js-find-btn">Test toggle</a>
            <span class="js-find-btn">Not an accepted trigger</span>
            <div id="find" data-toggle="js-find-btn"></div>`;

        const toggles = findToggles(document.getElementById('find'));
        assert.strictEqual(toggles.length, 2);
        assert.deepStrictEqual(toggles.map(t => t.tagName), ['BUTTON', 'A']);
    });

    it('should return an empty array and warn when the data-toggle attribute is missing', () => {
        document.body.innerHTML = `<div id="find"></div>`;
        const warn = mock.method(console, 'warn', () => {});

        const toggles = findToggles(document.getElementById('find'));

        assert.deepStrictEqual(toggles, []);
        assert.strictEqual(warn.mock.callCount(), 1);
        assert.match(warn.mock.calls[0].arguments[0], /no data-toggle attribute/);
        warn.mock.restore();
    });

    it('should return an empty array and warn when the data-toggle attribute matches no triggers', () => {
        document.body.innerHTML = `<div id="find" data-toggle="js-nothing-has-this"></div>`;
        const warn = mock.method(console, 'warn', () => {});

        const toggles = findToggles(document.getElementById('find'));

        assert.deepStrictEqual(toggles, []);
        assert.strictEqual(warn.mock.callCount(), 1);
        assert.match(warn.mock.calls[0].arguments[0], /no button or anchor found/);
        warn.mock.restore();
    });

    it('should return an empty array and warn rather than throw on an invalid data-toggle value', () => {
        document.body.innerHTML = `<div id="find" data-toggle="1-not-a-valid-identifier)"></div>`;
        const warn = mock.method(console, 'warn', () => {});

        let toggles;
        assert.doesNotThrow(() => {
            toggles = findToggles(document.getElementById('find'));
        });

        assert.deepStrictEqual(toggles, []);
        assert.strictEqual(warn.mock.callCount(), 1);
        warn.mock.restore();
    });

});

describe('Toggle > dom > initUI', () => {

    it('should not throw when the toggled element has no data-toggle attribute', () => {
        document.body.innerHTML = `<div class="parent"><div id="no-toggle" class="js-no-toggle"></div></div>`;
        const warn = mock.method(console, 'warn', () => {});

        assert.doesNotThrow(() => toggle('.js-no-toggle', { local: true }));

        assert.ok(warn.mock.callCount() > 0);
        warn.mock.restore();
    });

    it('should mint an id for the toggled element when it has none, so triggers can still reference it', () => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-no-id-btn">Test toggle</button>
            <div class="js-no-id" data-toggle="js-no-id-btn"></div>
        </div>`;
        const button = document.querySelector('.js-no-id-btn');
        const node = document.querySelector('.js-no-id');

        const [ instance ] = toggle('.js-no-id', { local: true });

        //a generated id lets aria-controls point at a real target rather than emitting "null"
        assert.ok(node.getAttribute('id'));
        assert.strictEqual(button.getAttribute('aria-controls'), node.getAttribute('id'));
        //listeners are bound, so the trigger now works
        button.click();
        assert.strictEqual(instance.getState().isOpen, true);
    });

    it('should set aria attributes on every trigger and give non-button triggers a button role', () => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-aria-btn">Test toggle</button>
            <a href="#target" class="js-aria-btn">Test toggle</a>
            <div id="aria" class="js-aria" data-toggle="js-aria-btn"></div>
        </div>`;

        toggle('.js-aria', { local: true });

        const [ button, anchor ] = [].slice.call(document.querySelectorAll('.js-aria-btn'));
        assert.strictEqual(button.getAttribute('aria-controls'), 'aria');
        assert.strictEqual(button.getAttribute('aria-expanded'), 'false');
        assert.strictEqual(button.hasAttribute('role'), false);
        assert.strictEqual(anchor.getAttribute('role'), 'button');
    });

    it('should make an anchor without an href reachable by keyboard', () => {
        document.body.innerHTML = `<div class="parent">
            <a class="js-href-btn">Test toggle</a>
            <div id="href" class="js-href" data-toggle="js-href-btn"></div>
        </div>`;

        toggle('.js-href', { local: true });

        assert.strictEqual(document.querySelector('.js-href-btn').getAttribute('tabindex'), '0');
    });

    it('should only set the hidden attribute when useHidden is set', () => {
        document.body.innerHTML = `<button class="js-hidden-btn">Test toggle</button>
            <div id="hidden" class="js-hidden" data-toggle="js-hidden-btn"></div>`;

        const [ instance ] = toggle('.js-hidden', { useHidden: true });
        const node = document.getElementById('hidden');
        assert.strictEqual(node.hidden, true);

        instance.toggle();
        assert.strictEqual(node.hidden, false);
    });

});

describe('Toggle > dom > keyboard', () => {

    let instance, anchor;

    beforeEach(() => {
        document.body.innerHTML = `<div class="parent">
            <a href="#space" class="js-space-btn">Test toggle</a>
            <div id="space" class="js-space" data-toggle="js-space-btn"></div>
        </div>`;
        anchor = document.querySelector('.js-space-btn');
        [ instance ] = toggle('.js-space', { local: true });
    });

    it('should activate a role=button trigger on Space, as a native button does', () => {
        anchor.dispatchEvent(new window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
        assert.strictEqual(instance.getState().isOpen, true);
    });

    it('should ignore other keys', () => {
        anchor.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }));
        assert.strictEqual(instance.getState().isOpen, false);
    });

    it('should not double-handle Enter on an anchor that already activates natively', () => {
        //an anchor with an href dispatches a click of its own on Enter, so handling keydown too
        //would toggle twice and land back where it started
        anchor.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        assert.strictEqual(instance.getState().isOpen, false);
    });

});

describe('Toggle > dom > getStateFromDOM', () => {

    it('should resolve classTarget, statusClass and shouldStartOpen from DOM with initial open state', () => {

        document.body.innerHTML = `<div class="is--active"><button class="js-toggle__btn">Test toggle</button>
            <div id="exp-section" class="js-toggle-local" data-toggle="js-toggle__btn"></div>
        </div>`;

        const settings = { local: true };
        const node = document.querySelector('#exp-section');
        const { classTarget, statusClass, shouldStartOpen } = getStateFromDOM(node, settings);

        assert.strictEqual(classTarget, node.parentNode);
        assert.strictEqual(statusClass, 'is--active');
        assert.strictEqual(shouldStartOpen, true);
    });

    it('should derive the status className from the id for a document level toggle', () => {
        document.body.innerHTML = `<div id="global"></div>`;
        const { classTarget, statusClass } = getStateFromDOM(document.getElementById('global'), { local: false });

        assert.strictEqual(classTarget, document.documentElement);
        assert.strictEqual(statusClass, 'on--global');
    });

    it('should not interpolate a null id into the status className', () => {
        document.body.innerHTML = `<div class="js-no-id"></div>`;
        const { statusClass } = getStateFromDOM(document.querySelector('.js-no-id'), { local: false });

        assert.doesNotMatch(statusClass, /null/);
    });

});

describe('Toggle > dom > toggleAttributes', () => {

    it('should reflect open state onto the triggers and the class target', () => {
        document.body.innerHTML = `<button class="js-attrs-btn" aria-expanded="false">Test toggle</button>
            <div id="attrs" class="is--animating"></div>`;
        const node = document.getElementById('attrs');
        const state = {
            toggles: [].slice.call(document.querySelectorAll('.js-attrs-btn')),
            isOpen: true,
            node,
            classTarget: node,
            animatingClass: 'is--animating',
            statusClass: 'on--attrs',
            settings: defaults
        };

        toggleAttributes(state);

        assert.strictEqual(document.querySelector('.js-attrs-btn').getAttribute('aria-expanded'), 'true');
        assert.strictEqual(node.classList.contains('is--animating'), false);
        assert.strictEqual(node.classList.contains('on--attrs'), true);

        toggleAttributes({ ...state, isOpen: false });
        assert.strictEqual(document.querySelector('.js-attrs-btn').getAttribute('aria-expanded'), 'false');
        assert.strictEqual(node.classList.contains('on--attrs'), false);
    });

});

describe('Toggle > dom > getFocusableChildren', () => {

    it('should return focusable descendants and skip disabled and hidden inputs', () => {
        document.body.innerHTML = `<div id="focusables">
            <a href="#">Anchor</a>
            <input type="text" />
            <input type="hidden" />
            <input type="text" disabled />
            <button>Button</button>
            <div tabindex="-1">Not tabbable</div>
        </div>`;

        const focusable = getFocusableChildren(document.getElementById('focusables'));
        assert.deepStrictEqual(focusable.map(el => el.tagName), ['A', 'INPUT', 'BUTTON']);
    });

});

describe('Toggle > utils > coerceSettings', () => {

    const opts = { booleans: BOOLEAN_SETTINGS, numbers: NUMBER_SETTINGS };

    it('should coerce the string forms of Boolean options', () => {
        const settings = coerceSettings({ ...defaults, startOpen: 'true', local: 'false', useHidden: 'true' }, opts);
        assert.strictEqual(settings.startOpen, true);
        assert.strictEqual(settings.local, false);
        assert.strictEqual(settings.useHidden, true);
    });

    it('should leave Boolean options passed as Booleans untouched', () => {
        const settings = coerceSettings({ ...defaults, trapTab: true, closeOnBlur: false }, opts);
        assert.strictEqual(settings.trapTab, true);
        assert.strictEqual(settings.closeOnBlur, false);
    });

    it('should coerce delay to a Number, defaulting to 0', () => {
        assert.strictEqual(coerceSettings({ ...defaults, delay: '250' }, opts).delay, 250);
        assert.strictEqual(coerceSettings({ ...defaults, delay: 'not a number' }, opts).delay, 0);
        assert.strictEqual(coerceSettings({ ...defaults }, opts).delay, 0);
    });

    it('should not coerce function options', () => {
        const callback = () => {};
        assert.strictEqual(coerceSettings({ ...defaults, callback }, opts).callback, callback);
    });

});

describe('Toggle > dom > trapTab', () => {

    let instance, button, first, last;

    const pressTab = (shiftKey = false) => document.dispatchEvent(
        new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true })
    );

    beforeEach(() => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-trap-btn">Test toggle</button>
            <div id="trap" class="js-trap" data-toggle="js-trap-btn">
                <a href="#" id="trap-first">First</a>
                <a href="#" id="trap-mid">Middle</a>
                <a href="#" id="trap-last">Last</a>
            </div>
        </div>`;
        button = document.querySelector('.js-trap-btn');
        first = document.getElementById('trap-first');
        last = document.getElementById('trap-last');
        [ instance ] = toggle('.js-trap', { local: true, trapTab: true });
        instance.startToggle();
    });

    it('should move focus to the first child when tabbing from the last', () => {
        last.focus();
        pressTab();
        assert.strictEqual(document.activeElement, first);
    });

    it('should move focus to the last child when shift tabbing from the first', () => {
        first.focus();
        pressTab(true);
        assert.strictEqual(document.activeElement, last);
    });

    it('should pull focus back when it has escaped the toggled element', () => {
        button.focus(); //outside the toggled element, so not in focusableChildren
        pressTab();
        assert.strictEqual(document.activeElement, first);
    });

    it('should stop trapping tab once closed', () => {
        instance.startToggle();
        last.focus();
        pressTab();
        assert.strictEqual(document.activeElement, last);
    });

    it('should trap focusable children added after initialisation', () => {
        const added = document.createElement('a');
        added.setAttribute('href', '#');
        added.setAttribute('id', 'trap-added');
        document.getElementById('trap').appendChild(added);

        instance.startToggle(); //close
        instance.startToggle(); //re-open, recomputing focusable children

        added.focus();
        pressTab();
        assert.strictEqual(document.activeElement, first);
    });

});

describe('Toggle > dom > manageFocus', () => {

    let button;

    beforeEach(() => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-focus-btn">Test toggle</button>
            <div id="focus" class="js-focus" data-toggle="js-focus-btn">
                <a href="#" id="focus-first">First</a>
            </div>
        </div>`;
        button = document.querySelector('.js-focus-btn');
    });

    it('should move focus into the element on open and return it on close', () => {
        const [ instance ] = toggle('.js-focus', { local: true, focus: true });
        button.focus();

        instance.startToggle();
        assert.strictEqual(document.activeElement, document.getElementById('focus-first'));

        instance.startToggle();
        assert.strictEqual(document.activeElement, button);
    });

    it('should not move focus when focus is false, even with trapTab set', () => {
        const [ instance ] = toggle('.js-focus', { local: true, focus: false, trapTab: true });
        button.focus();

        instance.startToggle();
        assert.strictEqual(document.activeElement, button);
    });

    it('should not move focus when neither focus nor trapTab is set', () => {
        const [ instance ] = toggle('.js-focus', { local: true, focus: false, trapTab: false });
        button.focus();

        instance.startToggle();
        assert.strictEqual(document.activeElement, button);
    });

});

describe('Toggle > dom > delay', () => {

    it('should ignore further activations while a delayed close is in flight', async () => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-delay-btn">Test toggle</button>
            <div id="delay" class="js-delay" data-toggle="js-delay-btn"></div>
        </div>`;
        const callback = mock.fn();
        const [ instance ] = toggle('.js-delay', { local: true, delay: 20, callback });
        const button = document.querySelector('.js-delay-btn');

        button.click(); //delay applies to the close only, so this opens synchronously
        assert.strictEqual(instance.getState().isOpen, true);
        assert.strictEqual(callback.mock.callCount(), 1);

        button.click(); //begins the delayed close
        button.click(); //ignored while the close is in flight
        button.click(); //ignored while the close is in flight

        await new Promise(resolve => setTimeout(resolve, 80));

        assert.strictEqual(instance.getState().isOpen, false);
        assert.strictEqual(callback.mock.callCount(), 2);
    });

});
