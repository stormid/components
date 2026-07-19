import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

//ten matching options, so any cap below ten is observable
const values = Array.from({ length: 10 }, (_, i) => ({ value: `Apple ${i}`, label: `Apple ${i}` }));

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

//the debounce delay is 200ms, so wait past it plus a tick for the resolved promise
const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const init = (options = {}) => {
    document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit"></div>';
    const [instance] = autocomplete('.js-autocomplete', { minlength: 1, search, ...options });
    return instance;
};

const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

const optionCount = node => node.querySelectorAll('.autocomplete__option:not(.autocomplete__option--empty)').length;

describe('Autocomplete > Max results', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should cap the rendered results at the default of 6', () => {
        const { node } = init();
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(optionCount(node), 6);
    });

    it('should respect a custom maxResults', () => {
        const { node } = init({ maxResults: 3 });
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(optionCount(node), 3);
    });

    it('should announce the capped count in the live region', () => {
        const { node } = init({ maxResults: 4 });
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, '4 results are available');
    });

    it('should show every result when maxResults is 0 (cap disabled)', () => {
        const { node } = init({ maxResults: 0 });
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(optionCount(node), 10);
    });

    it('should leave a result set smaller than the cap untouched', () => {
        const { node } = init();
        type(node.querySelector('input'), 'apple 7');
        assert.strictEqual(optionCount(node), 1);
    });

    it('should honour maxResults from a data-* attribute', () => {
        document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit" data-max-results="2"></div>';
        const [{ node }] = autocomplete('.js-autocomplete', { minlength: 1, search });
        type(node.querySelector('input'), 'apple');
        assert.strictEqual(optionCount(node), 2);
    });

    it('should cap results resolved from an async search', async () => {
        const { node } = init({ async: true, maxResults: 5, search: query => Promise.resolve(search(query)) });
        type(node.querySelector('input'), 'apple');
        await wait();
        assert.strictEqual(optionCount(node), 5);
    });
});
