import { describe, it, before } from 'node:test';
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

        <button id="target-4" class="js-toggle__btn-2">Test toggle</button>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-2" data-start-open="true"></div>`;

    Toggles = toggle('.js-toggle', {
        trapTab: true,
        closeOnBlur: true,
        focus: true
    });
    ToggleLocals = toggle('.js-toggle-local', { local: true });
};


describe('Toggle > Init', () => {

    before(init);

    it('should return array of length 2', () => {
        assert.strictEqual(Toggles.length, 1);
    });

    it('should return the expected API', () => {
        assert.notStrictEqual(Toggles[0], null);
        assert.notStrictEqual(Toggles[0].node, null);
        assert.notStrictEqual(Toggles[0].startToggle, null);
        assert.notStrictEqual(Toggles[0].toggle, null);
        assert.notStrictEqual(Toggles[0].getState, null);
    });

    it('should return without throwing if no DOM nodes are found', () => {
        assert.strictEqual(toggle('.js-not-found'), undefined);
    });

    it('should use data attributes as settings, overriding options', () => {
        assert.strictEqual(ToggleLocals[0].getState().settings.startOpen, 'true');
        assert.strictEqual(ToggleLocals[0].getState().isOpen, true);
    });

    it('should expose a toggle function that toggles the state of the instance', () => {
        assert.strictEqual(Toggles[0].getState().isOpen, false);
        Toggles[0].toggle();
        assert.strictEqual(Toggles[0].getState().isOpen, true);
        Toggles[0].toggle();
    });

});

describe('Toggle > Initialisation > Get Selection', () => {

    // Set up our document body
    const setupDOM = () => {
        document.body.innerHTML = `<a tabindex="0" id="btn-1-1" href="#target-1" class="js-toggle_btn">Test toggle</a>
        <a href="#target-1" class="js-toggle_btn">Test toggle</a>
        <div id="target-1" class="js-toggle" data-toggle="js-toggle_btn">
            <div id="focusable-1-1" tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
            <div tabindex="0">Test focusable content</div>
        </div>

        <button id="target-4" class="js-toggle__btn-2">Test toggle</button>
        <div id="target-4" class="js-toggle-local" data-toggle="js-toggle__btn-2" data-start-open="true"></div>`;
    };

    before(setupDOM);

    it('should return an array when passed a DOM element', () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection(toggles);
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', () => {
        const toggles = document.querySelectorAll('.js-toggle');
        const els = getSelection(toggles);
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', () => {
        const toggles = document.querySelector('.js-toggle');
        const els = getSelection([toggles]);
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a string', () => {
        const els = getSelection('.js-toggle');
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

});
