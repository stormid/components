import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type } from './helpers.js';

const values = [
    { value: 'apple', label: 'apple' },
    { value: 'apricot', label: 'apricot' },
    { value: 'banana', label: 'banana' }
];

const search = query => values.filter(item => item.value.includes(query));

const init = (options = {}) => mount(host('f', 'Fruit'), { name: 'f', minlength: 1, search, ...options });

const key = (target, keyCode) => target.dispatchEvent(new KeyboardEvent('keydown', { keyCode, bubbles: true }));

describe('Autocomplete > Escape', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should not write aria-selected onto the combobox input when Escape is pressed with focus in the input', () => {
        const { node } = init();
        const input = node.querySelector('input');
        input.focus();
        type(input, 'ap'); // list opens, focus stays on the input (nothing arrowed to)
        key(input, 27);

        //aria-selected is invalid on role="combobox" and must never be stamped there
        assert.strictEqual(input.hasAttribute('aria-selected'), false);
        assert.strictEqual(node.querySelector('.autocomplete__list').hasAttribute('hidden'), true);
    });

    it('should clear aria-selected from a focused option and return focus to the input on Escape', () => {
        const { node } = init();
        const input = node.querySelector('input');
        input.focus();
        type(input, 'ap');
        key(input, 40); // ArrowDown moves focus to the first option

        const option = node.querySelector('[role="option"]');
        assert.strictEqual(document.activeElement, option);
        assert.strictEqual(option.getAttribute('aria-selected'), 'true');

        key(option, 27);
        assert.strictEqual(option.getAttribute('aria-selected'), 'false');
        assert.strictEqual(document.activeElement, input);
        assert.strictEqual(input.hasAttribute('aria-selected'), false);
    });
});
