import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import component from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

let basic, withCallback;
const init = () => {
    // Set up our document body
    document.body.innerHTML = `<div class="js-boilerplate test"></div>
             <div class="js-boilerplate test-2"></div>
             <div class="js-boilerplate-two test-3"></div>
             <div class="js-boilerplate-three test-4"></div>`;

    basic = component('.js-boilerplate');
    withCallback = component('.js-boilerplate-two', {
        callback(){
            this.classList.toggle('callback-test');
        }
    });
};

describe(`Boilerplate > Initialisation`, () => {

    before(init);

    it('should return two instances for a selector matching two DOMElements', async () => {
        assert.deepStrictEqual(basic.length, 2);
    });

    it('should return undefined if no DOMElements are matched', async () => {
        assert.deepStrictEqual(component('.js-unfound'), undefined);
    });

    it('each instances should be an object with DOMElement, settings, and  click properties', () => {
        assert.notStrictEqual(basic[0], null);
        assert.notStrictEqual(basic[0].node, null);
        assert.notStrictEqual(basic[0].settings, null);
        assert.notStrictEqual(basic[0].click, null);
    });

    it('should initialisation with different settings if different options are passed', () => {
        assert.notStrictEqual(basic[0].settings.callback, withCallback[0].settings.callback);
    });

});

describe('Boilerplate > Options', () => {

    it('should be passed in options', () => {
        assert.notStrictEqual(withCallback[0].settings.callback, null);
        assert.strictEqual(basic[0].settings.callback, null);
    });

    it('should be execute a callback passed in options', () => {
        assert.ok(!withCallback[0].node.classList.contains('callback-test'));
        withCallback[0].node.click();
        assert.ok(withCallback[0].node.classList.contains('callback-test'));
    });

});

describe('Boilerplate > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<div class="js-boilerplate test"></div>`;
    }

    before(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const boilerplate = document.querySelector('.js-boilerplate');
        const els = getSelection(boilerplate);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const boilerplate = document.querySelectorAll('.js-boilerplate');
        const els = getSelection(boilerplate);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const boilerplate = document.querySelector('.js-boilerplate');
        const els = getSelection([boilerplate]);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('.js-boilerplate');
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

});
