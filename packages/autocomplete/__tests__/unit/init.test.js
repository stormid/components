import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'Apple', label: 'Apple' },
    { value: 'Banana', label: 'Banana' }
];

describe('Autocomplete > Init', () => {
    beforeEach(() => {
        document.body.innerHTML = '<label for="fruit">Fruit</label><div class="js-autocomplete" id="fruit"></div>';
    });

    it('should return an array with one instance per matched node', () => {
        const instances = autocomplete('.js-autocomplete', { values });
        assert.strictEqual(instances.length, 1);
    });

    it('should expose the node, getState and clear on each instance', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        assert.notStrictEqual(instance.node, null);
        assert.strictEqual(typeof instance.getState, 'function');
        assert.strictEqual(typeof instance.clear, 'function');
    });

    it('should return without throwing when no nodes match', () => {
        assert.strictEqual(autocomplete('.js-not-here'), undefined);
    });

    it('should let data attributes override options', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-minlength="5"></div>';
        const [instance] = autocomplete('.js-autocomplete', { minlength: 3, values });
        assert.strictEqual(instance.getState().settings.minlength, '5');
    });

    it('should move the node id onto the combobox input to keep the label association', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const { node } = instance;
        assert.strictEqual(node.hasAttribute('id'), false);
        assert.strictEqual(node.querySelector('input').getAttribute('id'), 'fruit');
    });

    it('should set the placeholder on the input when the option is given', () => {
        const [withPlaceholder] = autocomplete('.js-autocomplete', { values, placeholder: 'Search fruit' });
        assert.strictEqual(withPlaceholder.node.querySelector('input').getAttribute('placeholder'), 'Search fruit');
    });

    it('should not set a placeholder attribute when none is given', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        assert.strictEqual(instance.node.querySelector('input').hasAttribute('placeholder'), false);
    });

    it('should render an accessible combobox/listbox structure', () => {
        const [instance] = autocomplete('.js-autocomplete', { values });
        const input = instance.node.querySelector('input');
        const list = instance.node.querySelector('ul');
        assert.strictEqual(input.getAttribute('role'), 'combobox');
        assert.strictEqual(input.getAttribute('aria-expanded'), 'false');
        assert.strictEqual(input.getAttribute('aria-controls'), list.getAttribute('id'));
        assert.strictEqual(list.getAttribute('role'), 'listbox');
        assert.strictEqual(list.hasAttribute('hidden'), true);
    });

    it('should display the template but submit extractValue via a hidden field in single mode', () => {
        const list = [{ id: 42, label: 'Apple' }, { id: 7, label: 'Banana' }];
        const [instance] = autocomplete('.js-autocomplete', {
            name: 'fruit',
            list,
            template: option => option.label,
            extractValue: option => option.id,
            search: query => list.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
        });
        const { node } = instance;
        const input = node.querySelector('input');
        //the visible combobox is display/search only; the hidden field submits the value
        assert.strictEqual(input.hasAttribute('name'), false);

        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        node.querySelector('[role="option"]').dispatchEvent(new Event('click', { bubbles: true }));

        //display is the label, the submitted value is the distinct extractValue
        assert.strictEqual(input.value, 'Apple');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, '42');
    });

    it('should select the committed value when the input is refocused so typing replaces it', () => {
        const list = [{ value: 'apple', label: 'Apple' }];
        const [instance] = autocomplete('.js-autocomplete', {
            name: 'fruit',
            template: option => option.label,
            search: query => list.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
        });
        const input = instance.node.querySelector('input');

        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        instance.node.querySelector('[role="option"]').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(input.value, 'Apple');

        //refocusing the committed selection selects its whole text
        input.dispatchEvent(new Event('focus'));
        assert.strictEqual(input.selectionStart, 0);
        assert.strictEqual(input.selectionEnd, input.value.length);
    });

    it('should submit typed text via the hidden field when allowFreeText is set', () => {
        const [instance] = autocomplete('.js-autocomplete', { name: 'fruit', allowFreeText: true, search: () => [] });
        const { node } = instance;
        const input = node.querySelector('input');

        input.value = 'kumquat';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        //no matching option selected, but the free text is carried to the form
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, 'kumquat');
    });

    it('should not submit typed text when allowFreeText is not set (strict picker)', () => {
        const [instance] = autocomplete('.js-autocomplete', { name: 'fruit', search: () => [] });
        const { node } = instance;
        const input = node.querySelector('input');

        input.value = 'kumquat';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        //nothing selected, so nothing is submitted
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, '');
    });

    it('should seed a server-rendered value/label pair into the combobox and hidden field', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-value="GB" data-label="United Kingdom"></div>';
        const [instance] = autocomplete('.js-autocomplete', { name: 'country', template: option => option.label, search: () => [] });
        const { node } = instance;

        //the label shows in the visible combobox, the value submits via the hidden field
        assert.strictEqual(node.querySelector('input[role="combobox"]').value, 'United Kingdom');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="country"]').value, 'GB');
        //and it's a real selection, not just seeded text
        assert.strictEqual(instance.getState().selected.value, 'GB');
    });

    it('should seed an initial value/label passed as options', () => {
        const [instance] = autocomplete('.js-autocomplete', { name: 'country', value: 'GB', label: 'United Kingdom', template: option => option.label, search: () => [] });
        const { node } = instance;

        assert.strictEqual(node.querySelector('input[role="combobox"]').value, 'United Kingdom');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="country"]').value, 'GB');
    });

    it('should fall back to the value for display when no label is given', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-value="Apple"></div>';
        const [instance] = autocomplete('.js-autocomplete', { name: 'fruit', search: () => [] });
        const { node } = instance;

        assert.strictEqual(node.querySelector('input[role="combobox"]').value, 'Apple');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="fruit"]').value, 'Apple');
    });

    it('should clear a seeded selection and its hidden value once the input is edited', () => {
        document.body.innerHTML = '<div class="js-autocomplete" data-value="GB" data-label="United Kingdom"></div>';
        const [instance] = autocomplete('.js-autocomplete', { name: 'country', template: option => option.label, search: () => [] });
        const input = instance.node.querySelector('input[role="combobox"]');

        input.value = 'Fra';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        //editing away from the restored selection drops it and clears the submit value
        assert.strictEqual(instance.getState().selected, null);
        assert.strictEqual(instance.node.querySelector('input[type="hidden"][name="country"]').value, '');
    });

    it('should seed multiple server-rendered value/label pairs as chips in multiple mode', () => {
        const [instance] = autocomplete('.js-autocomplete', {
            name: 'countries',
            multiple: true,
            value: ['GB', 'FR'],
            label: ['United Kingdom', 'France'],
            template: option => option.label,
            search: () => []
        });
        const { node } = instance;

        const chips = node.querySelectorAll('.autocomplete__chip');
        assert.strictEqual(chips.length, 2);
        assert.strictEqual(chips[0].querySelector('.autocomplete__chip-label').textContent, 'United Kingdom');
        //each selection submits its value under the repeated name
        const hidden = [...node.querySelectorAll('input[type="hidden"][name="countries"]')].map(i => i.value);
        assert.deepStrictEqual(hidden, ['GB', 'FR']);
        assert.strictEqual(instance.getState().selected.length, 2);
    });
});
