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

    it('should return array of length 1', async () => {
        assert.deepStrictEqual(Textareas.length, 1);
    });

    it('should return the expected API', () => {
        assert.notStrictEqual(Textareas[0], null);
        assert.notStrictEqual(Textareas[0].node, null);
        assert.notStrictEqual(Textareas[0].update, null);
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
