import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type, clickOption } from './helpers.js';

const init = (options = {}) => mount(host('fruit', 'Fruit'), { name: 'fruit', minlength: 1, ...options });

describe('Autocomplete > values option', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render, display and submit string values via the default templates', () => {
        const { node } = init({ values: ['apple', 'apricot', 'banana'] });
        const input = node.querySelector('input');
        type(input, 'ap');

        const options = [...node.querySelectorAll('.autocomplete__option')].map(option => option.textContent);
        assert.deepStrictEqual(options, ['apple', 'apricot']);

        clickOption(node, 0);
        assert.strictEqual(input.value, 'apple');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, 'apple');
    });

    it('should accept { value, label } objects (no throw) and split display from submitted value', () => {
        const { node } = init({
            values: [{ value: 'GB', label: 'United Kingdom' }, { value: 'FR', label: 'France' }],
            displayTemplate: option => option.label
        });
        const input = node.querySelector('input');
        type(input, 'united');

        assert.strictEqual(node.querySelector('.autocomplete__option').textContent, 'United Kingdom');
        clickOption(node, 0);
        assert.strictEqual(input.value, 'United Kingdom');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, 'GB');
    });
});
