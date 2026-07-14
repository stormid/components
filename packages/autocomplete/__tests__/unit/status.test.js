import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => {
    document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit"></div>';
    const [instance] = autocomplete('.js-autocomplete', { search, ...options });
    return instance;
};

const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('Autocomplete > Status', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should announce that the query is too short below minlength', () => {
        const { node } = init({ minlength: 3 });
        type(node.querySelector('input'), 'ap');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Type 3 or more characters for results');
    });

    it('should let queryTooShortMsg be overridden', () => {
        const { node } = init({ minlength: 3, queryTooShortMsg: n => `Keep going (${n})` });
        type(node.querySelector('input'), 'a');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Keep going (3)');
    });

    it('should announce a singular result count', () => {
        const { node } = init({ minlength: 1 });
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '1 result is available');
    });

    it('should announce a plural result count', () => {
        const { node } = init({ minlength: 1 });
        type(node.querySelector('input'), 'ap');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '2 results are available');
    });

    it('should announce the no-results message when a search returns nothing', () => {
        const { node } = init({ minlength: 1, noResultsMsg: 'Nothing here' });
        const input = node.querySelector('input');
        type(input, 'ap');     // matches -> results shown
        type(input, 'apzz');   // extended past any match -> transitions to empty
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Nothing here');
    });

    it('should keep the status silent when the field is empty', () => {
        const { node } = init({ minlength: 1 });
        const input = node.querySelector('input');
        type(input, 'ap');
        type(input, '');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '');
    });

    it('should open the list with a visible no-results message when a search returns nothing', () => {
        const { node } = init({ minlength: 1, noResultsMsg: 'No results found' });
        const input = node.querySelector('input');
        type(input, 'zz');
        const list = node.querySelector('ul[role="listbox"]');
        assert.strictEqual(list.hasAttribute('hidden'), false);
        assert.strictEqual(input.getAttribute('aria-expanded'), 'true');
        assert.strictEqual(node.querySelector('.autocomplete__option--empty').textContent, 'No results found');
    });

    it('should not show the no-results message while the query is below minlength', () => {
        const { node } = init({ minlength: 3 });
        const input = node.querySelector('input');
        type(input, 'zz');
        const list = node.querySelector('ul[role="listbox"]');
        assert.strictEqual(list.hasAttribute('hidden'), true);
        assert.strictEqual(node.querySelector('.autocomplete__option--empty'), null);
    });
});
