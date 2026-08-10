import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type, clickOption } from './helpers.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => mount(host(), { search, ...options });

describe('Autocomplete > Status', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should keep the live region silent below minlength', () => {
        const { node } = init({ minlength: 3 });
        type(node.querySelector('input'), 'ap');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '');
    });

    it('should link the minlength hint to the input via aria-describedby', () => {
        const { node } = init({ minlength: 3 });
        const input = node.querySelector('input');
        const hint = node.querySelector('.autocomplete__hint');
        assert.strictEqual(input.getAttribute('aria-describedby'), hint.getAttribute('id'));
    });

    it('should render the default hint message from minlength', () => {
        const { node } = init({ minlength: 3 });
        assert.strictEqual(node.querySelector('.autocomplete__hint').textContent, 'Type 3 or more characters for results');
    });

    it('should let hintMsg override the default hint message', () => {
        const { node } = init({ minlength: 3, hintMsg: n => `Keep going (${n})` });
        assert.strictEqual(node.querySelector('.autocomplete__hint').textContent, 'Keep going (3)');
    });

    it('should not render a hint when minlength is not above one', () => {
        const { node } = init({ minlength: 1 });
        assert.strictEqual(node.querySelector('.autocomplete__hint'), null);
        assert.strictEqual(node.querySelector('input').getAttribute('aria-describedby'), null);
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

    it('should let resultsMsg override the default result-count message', () => {
        const { node } = init({ minlength: 1, resultsMsg: n => `${n} canlyniad ar gael` });
        type(node.querySelector('input'), 'ap');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '2 canlyniad ar gael');
    });

    it('should announce the no-results message when a search returns nothing', () => {
        const { node } = init({ minlength: 1, noResultsMsg: 'Nothing here' });
        const input = node.querySelector('input');
        type(input, 'ap');     // matches -> results shown
        type(input, 'apzz');   // extended past any match -> transitions to empty
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Nothing here');
    });

    it('should clear the live region after a single-mode selection is committed', () => {
        const { node } = init({ minlength: 1 });
        const input = node.querySelector('input');
        type(input, 'apple');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '1 result is available');

        clickOption(node, 0); // commit Apple; the list closes
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '');
    });

    it('should announce a selection being added in multiple mode', () => {
        const { node } = init({ minlength: 1, multiple: true });
        type(node.querySelector('input'), 'apple');
        clickOption(node, 0);

        //replaces the result count rather than falling silent, so the new chip is heard
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Apple added');
    });

    it('should announce a selection being removed when a chip is dismissed', () => {
        const { node } = init({ minlength: 1, multiple: true });
        type(node.querySelector('input'), 'apple');
        clickOption(node, 0);
        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));

        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Apple removed');
    });

    it('should announce a selection being removed with Backspace', () => {
        const { node } = init({ minlength: 1, multiple: true });
        const input = node.querySelector('input');
        type(input, 'apple');
        clickOption(node, 0);
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8, bubbles: true }));

        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Apple removed');
    });

    it('should let selectionAddedMsg and selectionRemovedMsg override the announcements', () => {
        const { node } = init({
            minlength: 1,
            multiple: true,
            selectionAddedMsg: label => `${label} ychwanegwyd`,
            selectionRemovedMsg: label => `${label} tynnwyd`
        });
        type(node.querySelector('input'), 'apple');
        clickOption(node, 0);
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Apple ychwanegwyd');

        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Apple tynnwyd');
    });

    it('should announce the display label rather than the submitted value', () => {
        const countries = [ { value: 'GB', label: 'United Kingdom' } ];
        const { node } = init({ minlength: 1, multiple: true, displayTemplate: option => option.label, search: () => countries });
        type(node.querySelector('input'), 'un');
        clickOption(node, 0);

        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'United Kingdom added');
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
