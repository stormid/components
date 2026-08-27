import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import textarea from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';
window.scrollTo = function() {}; //not implemented in JSDOM

let Textareas;

const init = () => {
    document.body.innerHTML = `<textarea rows="1"></textarea>`;
    Textareas = textarea('textarea');
};

describe(`Textarea > initialisation`, () => {

    before(init);

    it('should return array of length 1', () => {
        assert.strictEqual(Textareas.length, 1);
    });

    it('should expose the documented instance API', () => {
        const [ instance ] = Textareas;
        assert.strictEqual(instance.node, document.querySelector('textarea'));
        assert.strictEqual(typeof instance.resize, 'function');
        assert.strictEqual(typeof instance.destroy, 'function');
    });

    it('resize and destroy should be safe (and destroy idempotent)', () => {
        const [ instance ] = Textareas;
        assert.doesNotThrow(() => instance.resize());
        assert.doesNotThrow(() => instance.destroy());
        assert.doesNotThrow(() => instance.destroy());
    });

});

describe('Textarea > Fallback path', () => {

    before(() => {
        document.body.innerHTML = `<textarea rows="1"></textarea>`;
    });

    it('forceFallback runs the JS path without throwing', () => {
        let instances;
        assert.doesNotThrow(() => { instances = textarea('textarea', { forceFallback: true }); });
        const [ instance ] = instances;
        assert.strictEqual(typeof instance.resize, 'function');
        assert.doesNotThrow(() => instance.resize());
        assert.doesNotThrow(() => instance.destroy());
    });

});

describe('Textarea > Initialisation > Get Selection', () => {

    const setupDOM = () => {
        document.body.innerHTML = `<textarea rows="1"></textarea>`;
    }

    before(setupDOM);

    it('should return an array when passed a DOM element', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection(textarea);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList element', async () => {
        const textarea = document.querySelectorAll('textarea');
        const els = getSelection(textarea);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', async () => {
        const textarea = document.querySelector('textarea');
        const els = getSelection([textarea]);
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

    it('should return an array when passed a string', async () => {
        const els = getSelection('textarea');
        assert.strictEqual(els instanceof Array, true);
        assert.deepStrictEqual(els.length, 1);
    });

});
