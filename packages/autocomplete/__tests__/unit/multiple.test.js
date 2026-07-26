import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type, clickOption } from './helpers.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' },
    { value: 'Banana', label: 'Banana' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => mount(host('fruits', 'Fruits'), { name: 'fruits', multiple: true, minlength: 1, search, ...options });

describe('Autocomplete > Multiple', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should not put a name on the visible input', () => {
        const { node } = init();
        assert.strictEqual(node.querySelector('input').hasAttribute('name'), false);
    });

    it('should not render the output list while the selection is empty', () => {
        const { node } = init();
        assert.strictEqual(node.querySelector('.autocomplete__output'), null);
    });

    it('should render the output list once a selection is added and remove it again when emptied', () => {
        const { node } = init();
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);
        assert.notStrictEqual(node.querySelector('.autocomplete__output'), null);

        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(node.querySelector('.autocomplete__output'), null);
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

    it('should label a chip remove button with the default remove message', () => {
        const { node } = init();
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);
        assert.strictEqual(node.querySelector('.autocomplete__chip-remove').getAttribute('aria-label'), 'Remove Apple');
    });

    it('should let removeMsg override the chip remove button label', () => {
        const { node } = init({ removeMsg: label => `Dileu ${label}` });
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);
        assert.strictEqual(node.querySelector('.autocomplete__chip-remove').getAttribute('aria-label'), 'Dileu Apple');
    });

    it('should link a visually-hidden selection summary to the input via aria-describedby', () => {
        const { node } = init();
        const input = node.querySelector('input');
        const summary = node.querySelector('.autocomplete__selection');
        assert.notStrictEqual(summary, null);
        assert.strictEqual(input.getAttribute('aria-describedby').split(' ').includes(summary.id), true);
    });

    it('should keep the selection summary in step with the chips so it is announced on refocus', () => {
        const { node } = init();
        const input = node.querySelector('input');
        const summary = node.querySelector('.autocomplete__selection');

        //nothing selected yet: empty, so a refocus announces no stale selection
        assert.strictEqual(summary.textContent, '');

        type(input, 'ap');
        clickOption(node, 0); // Apple
        assert.strictEqual(summary.textContent, 'Apple selected');

        type(input, 'ap');
        clickOption(node, 0); // Apricot (Apple already chosen, hidden from the list)
        assert.strictEqual(summary.textContent, 'Apple, Apricot selected');

        //removing a chip updates the summary too
        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(summary.textContent, 'Apricot selected');
    });

    it('should let selectionMsg override the selection summary', () => {
        const { node } = init({ selectionMsg: labels => `${labels.length} dewiswyd` });
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0);
        assert.strictEqual(node.querySelector('.autocomplete__selection').textContent, '1 dewiswyd');
    });

    it('should seed the selection summary from an initial value', () => {
        const { node } = init({ value: [ 'Apple', 'Banana' ] });
        assert.strictEqual(node.querySelector('.autocomplete__selection').textContent, 'Apple, Banana selected');
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
        type(input, 'ap');    // Apple is now hidden, so Apricot is first
        clickOption(node, 0); // Apricot

        const hidden = [...node.querySelectorAll('input[type="hidden"][name="fruits"]')].map(i => i.value);
        assert.deepStrictEqual(hidden, ['Apple', 'Apricot']);
    });

    it('should hide an already-selected option from the list so it cannot be picked twice', () => {
        const instance = init();
        const { node } = instance;
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0); // select Apple
        type(input, 'ap');    // re-search: Apple is now hidden, only Apricot remains

        const labels = [...node.querySelectorAll('.autocomplete__option')].map(option => option.textContent);
        assert.deepStrictEqual(labels, ['Apricot']);
        //the selection is untouched — re-searching never removes the existing chip
        assert.strictEqual(instance.getState().selected.length, 1);
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
