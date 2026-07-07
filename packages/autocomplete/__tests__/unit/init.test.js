import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' }
];

describe('Autocomplete > Init', () => {
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

    it('should return without throwing when no nodes match', () => {
        assert.strictEqual(autocomplete('.js-not-here'), undefined);
    });

    it('should let data attributes override options', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-minlength="5"></div>';
        const [instance] = autocomplete('.js-autocomplete', { minlength: 2, values });
        assert.strictEqual(instance.getState().settings.minlength, '5');
    });

    it('should move the node id onto the combobox input to keep the label association', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const { node } = instance;
        assert.strictEqual(node.hasAttribute('id'), false);
        assert.strictEqual(node.querySelector('input').getAttribute('id'), 'fruit');
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
