import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' },
    { value: 'Banana', label: 'Banana' }
];

const filter = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

//the debounce delay is 200ms, so wait past it plus a tick for the resolved promise
const wait = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const init = (options = {}) => {
    document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit"></div>';
    const [instance] = autocomplete('.js-autocomplete', { name: 'fruit', async: true, minlength: 1, ...options });
    return instance;
};

describe('Autocomplete > Remote', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render options resolved from an async search', async () => {
        const { node } = init({ search: query => Promise.resolve(filter(query)) });
        const input = node.querySelector('input');
        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(node.querySelectorAll('[role="option"]').length, 2);
        assert.strictEqual(node.querySelector('ul[role="listbox"]').hasAttribute('hidden'), false);
    });

    it('should announce the loading message while the search is in flight, then the result count', async () => {
        let resolveSearch;
        const { node } = init({ loadingMsg: 'Loading…', search: () => new Promise(resolve => { resolveSearch = resolve; }) });
        const status = node.querySelector('.autocomplete__status');
        const input = node.querySelector('input');
        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(status.textContent, 'Loading…');
        resolveSearch(filter('ap'));
        await wait(0);
        assert.strictEqual(status.textContent, '2 results are available');
    });

    it('should debounce rapid keystrokes into a single request', async () => {
        let calls = 0;
        const { node } = init({ search: query => { calls++; return Promise.resolve(filter(query)); } });
        const input = node.querySelector('input');
        input.value = 'a';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(calls, 1);
    });

    it('should not fire the search below minlength', async () => {
        let calls = 0;
        const { node } = init({ minlength: 3, search: () => { calls++; return Promise.resolve([]); } });
        const input = node.querySelector('input');
        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(calls, 0);
    });

    it('should show the no-results message when the async search resolves empty', async () => {
        const { node } = init({ noResultsMsg: 'Nothing', search: () => Promise.resolve([]) });
        const input = node.querySelector('input');
        input.value = 'zz';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(node.querySelector('.autocomplete__status').textContent, 'Nothing');
        assert.strictEqual(node.querySelector('ul[role="listbox"]').hasAttribute('hidden'), true);
    });

    it('should ignore results from a stale query that resolves after a newer one', async () => {
        //the slow first query resolves last; the input has moved on so it must be ignored
        const { node } = init({ search: query => new Promise(resolve => {
            setTimeout(() => resolve(filter(query)), query === 'ap' ? 120 : 10);
        }) });
        const input = node.querySelector('input');

        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();          // debounce fires; slow 'ap' request now in flight
        input.value = 'apr';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();          // 'ap' resolves stale (input is 'apr'); 'apr' resolves and wins

        const rendered = [...node.querySelectorAll('[role="option"]')].map(el => el.textContent);
        assert.deepStrictEqual(rendered, ['Apricot']);
    });

    it('should abort the in-flight request when a newer query supersedes it', async () => {
        const signals = [];
        const { node } = init({ search: (query, signal) => {
            signals.push(signal);
            return new Promise(resolve => setTimeout(() => resolve(filter(query)), 60));
        } });
        const input = node.querySelector('input');

        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();          // debounce fires; first request in flight
        input.value = 'apr';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();          // second request fires and aborts the first

        assert.strictEqual(signals.length, 2);
        assert.strictEqual(signals[0].aborted, true);
        assert.strictEqual(signals[1].aborted, false);
    });

    it('should not warn or clear results when a superseded request rejects with AbortError', async () => {
        //a real fetch rejects with an AbortError when aborted — that must be swallowed
        const { node } = init({ search: (query, signal) => new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
            setTimeout(() => resolve(filter(query)), query === 'ap' ? 60 : 10);
        }) });
        const input = node.querySelector('input');

        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();
        input.value = 'apr';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        //the aborted 'ap' rejection is ignored; the 'apr' result wins
        const rendered = [...node.querySelectorAll('[role="option"]')].map(el => el.textContent);
        assert.deepStrictEqual(rendered, ['Apricot']);
    });

    it('should not throw and should clear results when the async search rejects', async () => {
        const { node } = init({ noResultsMsg: 'Nothing', search: () => Promise.reject(new Error('boom')) });
        const input = node.querySelector('input');
        input.value = 'ap';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await wait();

        assert.strictEqual(node.querySelectorAll('[role="option"]').length, 0);
        assert.strictEqual(node.querySelector('ul[role="listbox"]').hasAttribute('hidden'), true);
    });
});
