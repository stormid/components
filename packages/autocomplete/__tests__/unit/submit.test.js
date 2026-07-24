import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { host, mount, type } from './helpers.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Apricot', label: 'Apricot' }
];

const search = query => values.filter(item => item.value.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => mount(host('q', 'Search'), { name: 'q', minlength: 1, search, ...options });

//enhance a host wrapped in a form so the generated input's `form` resolves, and
//record any submits (prevented, so the DOM env never attempts a navigation)
const initInForm = (options = {}) => {
    const instance = mount(`<form id="search-form">${host('q', 'Search')}</form>`, { name: 'q', minlength: 1, search, ...options });
    const submits = [];
    document.getElementById('search-form').addEventListener('submit', event => {
        event.preventDefault();
        submits.push(event);
    });
    return { instance, node: instance.node, submits };
};

const enter = target => target.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, bubbles: true }));

describe('Autocomplete > submitOnConfirm', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should commit the highlighted option and submit the form on Enter', () => {
        const { node, submits } = initInForm({ submitOnConfirm: true });
        const input = node.querySelector('input');
        type(input, 'ap');
        enter(node.querySelector('[role="option"]')); // Enter on the first option

        assert.strictEqual(input.value, 'Apple');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="q"]').value, 'Apple');
        assert.strictEqual(submits.length, 1);
    });

    it('should submit the raw query on Enter when no option is highlighted', () => {
        const { instance, node, submits } = initInForm({ submitOnConfirm: true });
        type(node.querySelector('input'), 'ap');
        enter(node.querySelector('input')); // Enter while focus stays in the input

        assert.strictEqual(submits.length, 1);
        assert.strictEqual(instance.getState().selected, null);
    });

    it('should not submit the form on Enter when submitOnConfirm is off', () => {
        const { node, submits } = initInForm();
        const input = node.querySelector('input');
        type(input, 'ap');
        enter(node.querySelector('[role="option"]'));

        //the option is still committed, just without a form submit
        assert.strictEqual(input.value, 'Apple');
        assert.strictEqual(submits.length, 0);
    });

    it('should not throw on Enter when the input is not inside a form', () => {
        const { node } = init({ submitOnConfirm: true });
        const input = node.querySelector('input');
        type(input, 'ap');
        assert.doesNotThrow(() => enter(input));
    });
});
