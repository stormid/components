import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' },
    { value: 'Banana', label: 'Banana' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => {
    document.body.innerHTML = '<label for="fruits">Fruits</label><div class="js-autocomplete" id="fruits"></div>';
    const [instance] = autocomplete('.js-autocomplete', { name: 'fruits', multiple: true, minlength: 1, search, ...options });
    return instance;
};

const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

const clickOption = (node, index) => node.querySelectorAll('[role="option"]')[index].dispatchEvent(new Event('click', { bubbles: true }));

describe('Autocomplete > Multiple', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should not put a name on the visible input and should create an output list', () => {
        const { node } = init();
        assert.strictEqual(node.querySelector('input').hasAttribute('name'), false);
        assert.notStrictEqual(node.querySelector('.autocomplete__output'), null);
    });

    it('should start with an empty selection array', () => {
        const instance = init();
        assert.deepStrictEqual(instance.getState().selected, []);
    });

    it('should add a chip with a hidden input under the shared name when an option is selected', () => {
        const { node } = init();
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);

        const chips = node.querySelectorAll('.autocomplete__chip');
        const hidden = node.querySelectorAll('input[type="hidden"][name="fruits"]');
        assert.strictEqual(chips.length, 1);
        assert.strictEqual(hidden.length, 1);
        assert.strictEqual(hidden[0].value, 'Apple');
    });

    it('should clear the search input and keep the list closed after a selection', () => {
        const { node } = init();
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0);

        assert.strictEqual(input.value, '');
        assert.strictEqual(input.getAttribute('aria-expanded'), 'false');
    });

    it('should accumulate multiple selections as repeated hidden inputs', () => {
        const { node } = init();
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0); // Apple
        type(input, 'ap');
        clickOption(node, 1); // Apricot

        const hidden = [...node.querySelectorAll('input[type="hidden"][name="fruits"]')].map(i => i.value);
        assert.deepStrictEqual(hidden, ['Apple', 'Apricot']);
    });

    it('should toggle a selected option off when it is chosen again', () => {
        const instance = init();
        const { node } = instance;
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0); // select Apple
        type(input, 'ap');
        clickOption(node, 0); // Apple again -> remove

        assert.deepStrictEqual(instance.getState().selected, []);
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 0);
    });

    it('should remove a chip when its remove button is clicked', () => {
        const instance = init();
        const { node } = instance;
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);

        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));
        assert.deepStrictEqual(instance.getState().selected, []);
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 0);
    });

    it('should not remove a chip when the output is clicked away from a remove button', () => {
        const instance = init();
        const { node } = instance;
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);

        node.querySelector('.autocomplete__chip-label').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(instance.getState().selected.length, 1);
    });

    it('should remove the last chip on Backspace when the input is empty', () => {
        const instance = init();
        const { node } = instance;
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0);
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8, bubbles: true }));

        assert.deepStrictEqual(instance.getState().selected, []);
    });

    it('should not remove a chip on Backspace while the input has a value', () => {
        const instance = init();
        const { node } = instance;
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0);
        input.value = 'a';
        input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8, bubbles: true }));

        assert.strictEqual(instance.getState().selected.length, 1);
    });

    it('should reset the selection and chips on clear()', () => {
        const instance = init();
        const { node } = instance;
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);
        instance.clear();

        assert.deepStrictEqual(instance.getState().selected, []);
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 0);
    });
});
