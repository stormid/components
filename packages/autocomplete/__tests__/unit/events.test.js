import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type, clickOption, listen } from './helpers.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => mount(host(), { name: 'fruit', minlength: 1, search, ...options });

describe('Autocomplete > Events', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should dispatch a bubbling confirm event from the node when an option is selected', () => {
        const events = listen('autocomplete:confirm');
        const { node } = init();
        type(node.querySelector('input'), 'apple');
        clickOption(node, 0);

        assert.strictEqual(events.length, 1);
        assert.strictEqual(events[0].bubbles, true);
        assert.strictEqual(events[0].target, node);
        assert.strictEqual(events[0].detail.action, 'confirm');
        assert.deepStrictEqual(events[0].detail.option, { value: 'Apple', label: 'Apple' });
        assert.deepStrictEqual(events[0].detail.selected, { value: 'Apple', label: 'Apple' });
        assert.strictEqual(typeof events[0].detail.getState, 'function');
    });

    it('should carry the full selection array in multiple mode', () => {
        const events = listen('autocomplete:confirm');
        const { node } = init({ multiple: true });
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0); // Apple
        type(input, 'ap');    // Apple is now hidden, so Apricot is first
        clickOption(node, 0); // Apricot

        assert.strictEqual(events.length, 2);
        assert.deepStrictEqual(events[1].detail.selected, [
            { value: 'Apple', label: 'Apple' },
            { value: 'Apricot', label: 'Apricot' }
        ]);
    });

    it('should dispatch a remove event with the removed option when a chip is removed', () => {
        const events = listen('autocomplete:remove');
        const { node } = init({ multiple: true });
        type(node.querySelector('input'), 'ap');
        clickOption(node, 0);
        node.querySelector('.autocomplete__chip-remove').dispatchEvent(new Event('click', { bubbles: true }));

        assert.strictEqual(events.length, 1);
        assert.strictEqual(events[0].detail.action, 'remove');
        assert.deepStrictEqual(events[0].detail.option, { value: 'Apple', label: 'Apple' });
        assert.deepStrictEqual(events[0].detail.selected, []);
    });

    it('should dispatch a remove event when the last chip is removed with Backspace', () => {
        const events = listen('autocomplete:remove');
        const { node } = init({ multiple: true });
        const input = node.querySelector('input');
        type(input, 'ap');
        clickOption(node, 0);
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 8, bubbles: true }));

        assert.strictEqual(events.length, 1);
        assert.deepStrictEqual(events[0].detail.option, { value: 'Apple', label: 'Apple' });
    });

    it('should dispatch a clear event when clear() is called', () => {
        const events = listen('autocomplete:clear');
        const instance = init();
        type(instance.node.querySelector('input'), 'apple');
        clickOption(instance.node, 0);
        instance.clear();

        assert.strictEqual(events.length, 1);
        assert.strictEqual(events[0].detail.action, 'clear');
        assert.strictEqual(events[0].detail.selected, null);
    });
});
