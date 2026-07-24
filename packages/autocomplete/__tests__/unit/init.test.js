import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';
import { getSelection } from '../../src/lib/utils.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' }
];

describe('Autocomplete > Initialisation', () => {
    beforeEach(() => {
        document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit"></div>';
    });

    it('should return an array with one instance per matched node', () => {
        const instances = autocomplete('.js-autocomplete', { values });
        assert.strictEqual(instances.length, 1);
    });

    it('should expose the node, getState and clear on each instance', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        assert.notStrictEqual(instance.node, null);
        assert.strictEqual(typeof instance.getState, 'function');
        assert.strictEqual(typeof instance.clear, 'function');
    });

    it('should return an empty array (not undefined) when no nodes match', () => {
        assert.deepStrictEqual(autocomplete('.js-not-here'), []);
    });

    it('should let data attributes override options', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-minlength="5"></div>';
        const [instance] = autocomplete('.js-autocomplete', { minlength: 3, values });
        assert.strictEqual(instance.getState().settings.minlength, '5');
    });

    it('should move the node id onto the combobox input to keep the label association', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const { node } = instance;
        assert.strictEqual(node.hasAttribute('id'), false);
        assert.strictEqual(node.querySelector('input').getAttribute('id'), 'fruit');
    });

    it('should set the placeholder on the input when the option is given', () => {
        const [withPlaceholder] = autocomplete('.js-autocomplete', { values, placeholder: 'Search fruit' });
        assert.strictEqual(withPlaceholder.node.querySelector('input').getAttribute('placeholder'), 'Search fruit');
    });

    it('should not set a placeholder attribute when none is given', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        assert.strictEqual(instance.node.querySelector('input').hasAttribute('placeholder'), false);
    });

    it('should label the listbox with the field label', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const list = instance.node.querySelector('ul[role="listbox"]');
        const label = document.querySelector('label[for="fruit"]');
        assert.strictEqual(list.getAttribute('aria-labelledby'), label.getAttribute('id'));
    });

    it('should render an accessible combobox/listbox structure', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const input = instance.node.querySelector('input');
        const list = instance.node.querySelector('ul');
        assert.strictEqual(input.getAttribute('role'), 'combobox');
        assert.strictEqual(input.getAttribute('aria-expanded'), 'false');
        assert.strictEqual(input.getAttribute('aria-controls'), list.getAttribute('id'));
        assert.strictEqual(list.getAttribute('role'), 'listbox');
        assert.strictEqual(list.hasAttribute('hidden'), true);
    });
});

describe('Autocomplete > Initialisation > Get Selection', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div class="js-autocomplete"></div>';
    });

    it('should return an array when passed a DOM element', () => {
        const els = getSelection(document.querySelector('.js-autocomplete'));
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a NodeList', () => {
        const els = getSelection(document.querySelectorAll('.js-autocomplete'));
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed an array of DOM elements', () => {
        const els = getSelection([document.querySelector('.js-autocomplete')]);
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an array when passed a string selector', () => {
        const els = getSelection('.js-autocomplete');
        assert.strictEqual(els instanceof Array, true);
        assert.strictEqual(els.length, 1);
    });

    it('should return an empty array for an unsupported selector', () => {
        assert.deepStrictEqual(getSelection(42), []);
    });
});
