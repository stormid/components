import { describe, it, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import toggle from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

let Toggles, ToggleLocals;

const init = () => {
    // Set up our document body
    document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
        </div>

        <button id="btn-2-1" class="js-toggle_btn-2">Test toggle</button>
        <div id="target-2" class="js-toggle" data-toggle="js-toggle_btn-2">
            <div tabindex="0">Test focusable content</div>
        </div>

        <div class="parent">
            <button id="btn-local" class="js-toggle__btn-local">Test toggle</button>
            <div id="target-local" class="js-toggle-local" data-toggle="js-toggle__btn-local" data-start-open="true"></div>
        </div>`;

    Toggles = toggle('.js-toggle', {
        trapTab: true,
        closeOnBlur: true,
        focus: true
    });
    ToggleLocals = toggle('.js-toggle-local', { local: true });
};


describe('Toggle > Init', () => {

    before(init);

    it('should return an instance for each matching node', () => {
        assert.strictEqual(Toggles.length, 2);
    });

    it('should return the expected API', () => {
        assert.notStrictEqual(Toggles[0], null);
        assert.notStrictEqual(Toggles[0].node, null);
        assert.strictEqual(typeof Toggles[0].startToggle, 'function');
        assert.strictEqual(typeof Toggles[0].toggle, 'function');
        assert.strictEqual(typeof Toggles[0].getState, 'function');
        assert.strictEqual(typeof Toggles[0].destroy, 'function');
    });

    it('should return instances with own enumerable properties', () => {
        assert.deepStrictEqual(Object.keys(Toggles[0]), ['node', 'startToggle', 'toggle', 'getState', 'destroy']);
    });

    it('should return an empty array if no DOM nodes are found', () => {
        assert.deepStrictEqual(toggle('.js-not-found'), []);
    });

    it('should use data attributes as settings, overriding options', () => {
        assert.strictEqual(ToggleLocals[0].getState().settings.startOpen, true);
        assert.strictEqual(ToggleLocals[0].getState().isOpen, true);
    });

    it('should expose a toggle function that toggles the state of the instance', () => {
        assert.strictEqual(Toggles[0].getState().isOpen, false);
        Toggles[0].toggle();
        assert.strictEqual(Toggles[0].getState().isOpen, true);
        Toggles[0].toggle();
    });

});

describe('Toggle > Init > Settings coercion', () => {

    beforeEach(() => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-coerce-btn">Test toggle</button>
            <div id="coerce" class="js-coerce" data-toggle="js-coerce-btn" data-start-open="false" data-delay="150"></div>
        </div>`;
    });

    it('should coerce a "false" data attribute to a Boolean rather than leaving it truthy', () => {
        const [ instance ] = toggle('.js-coerce', { local: true, startOpen: true });
        assert.strictEqual(instance.getState().settings.startOpen, false);
        assert.strictEqual(instance.getState().isOpen, false);
    });

    it('should coerce a numeric data attribute to a Number', () => {
        const [ instance ] = toggle('.js-coerce', { local: true });
        assert.strictEqual(instance.getState().settings.delay, 150);
    });

    it('should not carry the structural data-toggle attribute into settings', () => {
        const [ instance ] = toggle('.js-coerce', { local: true });
        assert.strictEqual('toggle' in instance.getState().settings, false);
    });

});

describe('Toggle > API > destroy', () => {

    let instance, button, node;

    beforeEach(() => {
        document.body.innerHTML = `<div class="parent">
            <button class="js-destroy-btn">Test toggle</button>
            <div id="destroy" class="js-destroy" data-toggle="js-destroy-btn">
                <a href="#" id="destroy-child">Test focusable content</a>
            </div>
        </div>`;
        button = document.querySelector('.js-destroy-btn');
        node = document.getElementById('destroy');
        [ instance ] = toggle('.js-destroy', { local: true, closeOnClick: true, closeOnBlur: true });
    });

    it('should remove the trigger listeners so the toggle no longer responds', () => {
        instance.destroy();
        button.click();
        assert.strictEqual(instance.getState().isOpen, false);
        assert.strictEqual(node.parentNode.classList.contains('is--active'), false);
    });

    it('should close an open toggle before tearing down', () => {
        button.click();
        assert.strictEqual(instance.getState().isOpen, true);

        instance.destroy();
        assert.strictEqual(instance.getState().isOpen, false);
        assert.strictEqual(node.parentNode.classList.contains('is--active'), false);
    });

    it('should be safe to call repeatedly', () => {
        assert.doesNotThrow(() => instance.destroy());
        assert.doesNotThrow(() => instance.destroy());
    });

    it('should not throw when the instance never initialised', () => {
        document.body.innerHTML = `<div class="parent"><div id="no-triggers" class="js-no-triggers"></div></div>`;
        const [ uninitialised ] = toggle('.js-no-triggers', { local: true });
        assert.doesNotThrow(() => uninitialised.destroy());
    });

});

describe('Toggle > Initialisation > Get Selection', () => {

    // Set up our document body
    const setupDOM = () => {
        document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
        </div>`;
    };

    before(setupDOM);

    it('should return an array when passed a DOM element', () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection(toggles);
        assert.strictEqual(Array.isArray(els), true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', () => {
        const toggles = document.querySelectorAll('.js-toggle');
        const els = getSelection(toggles);
        assert.strictEqual(Array.isArray(els), true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed an HTMLCollection', () => {
        const els = getSelection(document.getElementsByClassName('js-toggle'));
        assert.strictEqual(Array.isArray(els), true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection([toggles]);
        assert.strictEqual(Array.isArray(els), true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a string', () => {
        const els = getSelection('.js-toggle');
        assert.strictEqual(Array.isArray(els), true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an empty array when passed anything else', () => {
        assert.deepStrictEqual(getSelection(undefined), []);
        assert.deepStrictEqual(getSelection(42), []);
    });

});
