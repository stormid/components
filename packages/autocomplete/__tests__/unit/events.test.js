import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type, clickOption, listen } from './helpers.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => mount(host(), { name: 'fruit', minlength: 1, search, ...options });

const escape = input => input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 27, bubbles: true }));

//capture several event types in one ordered list, so the sequence a consumer sees
//can be asserted rather than each type in isolation
const listenAll = (...types) => {
    const actions = [];
    types.forEach(type => document.addEventListener(type, event => actions.push(event.detail.action)));
    return actions;
};

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

    it('should dispatch an open event when the list opens', () => {
        const events = listen('autocomplete:open');
        const { node } = init();
        type(node.querySelector('input'), 'ap');

        assert.strictEqual(events.length, 1);
        assert.strictEqual(events[0].bubbles, true);
        assert.strictEqual(events[0].target, node);
        assert.strictEqual(events[0].detail.action, 'open');
        //no option is involved in a visibility change; the selection is carried as-is
        assert.strictEqual(events[0].detail.option, null);
        assert.strictEqual(events[0].detail.selected, null);
        assert.strictEqual(typeof events[0].detail.getState, 'function');
    });

    it('should not dispatch a second open event while the list is already open', () => {
        const events = listen('autocomplete:open');
        const { node } = init();
        const input = node.querySelector('input');
        type(input, 'ap');
        type(input, 'app'); // narrows the results, list stays open

        assert.strictEqual(events.length, 1);
    });

    it('should dispatch a close event when the list is closed with Escape', () => {
        const events = listen('autocomplete:close');
        const { node } = init();
        const input = node.querySelector('input');
        type(input, 'ap');
        escape(input);

        assert.strictEqual(events.length, 1);
        assert.strictEqual(events[0].detail.action, 'close');
        assert.strictEqual(node.querySelector('.autocomplete__list').hasAttribute('hidden'), true);
    });

    it('should dispatch a single close event when an option is confirmed, before the confirm', () => {
        const actions = listenAll('autocomplete:close', 'autocomplete:confirm');
        const { node } = init();
        type(node.querySelector('input'), 'apple');
        clickOption(node, 0);

        //the list closes as part of the commit, so the DOM has settled by the time
        //the confirm listener runs
        assert.deepStrictEqual(actions, [ 'close', 'confirm' ]);
    });

    it('should not dispatch a close event when nothing was open', () => {
        const events = listen('autocomplete:close');
        const instance = init();
        instance.clear(); // clear() closes unconditionally, but no list was showing

        assert.strictEqual(events.length, 0);
    });

    it('should not dispatch a close event while the list is being built', () => {
        const events = listen('autocomplete:close');
        init();

        assert.strictEqual(events.length, 0);
    });
});
