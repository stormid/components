import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const single = `
    <label for="flavour">Flavour</label>
    <div class="js-autocomplete">
        <select id="flavour" name="flavour">
            <option value="">Choose a fruit</option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="cherry">Cherry</option>
        </select>
    </div>`;

const multiple = `
    <label for="toppings">Toppings</label>
    <div class="js-autocomplete">
        <select id="toppings" name="toppings" multiple>
            <option value="apple">Apple</option>
            <option value="banana" selected>Banana</option>
            <option value="cherry">Cherry</option>
        </select>
    </div>`;

const init = (markup, options) => {
    document.body.innerHTML = markup;
    const [instance] = autocomplete('.js-autocomplete', options);
    return instance;
};

describe('Autocomplete > Select', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should remove the native select once enhanced', () => {
        const { node } = init(single);
        assert.strictEqual(node.querySelector('select'), null);
    });

    it('should source its options from the select options, skipping the empty placeholder', () => {
        const instance = init(single);
        const options = instance.getState().options;
        assert.deepStrictEqual(options, [
            { value: 'apple', label: 'Apple' },
            { value: 'banana', label: 'Banana' },
            { value: 'cherry', label: 'Cherry' }
        ]);
    });

    it('should carry the select name on a hidden value field and move its id onto the combobox input for the label', () => {
        const { node } = init(single);
        const input = node.querySelector('input');
        //the visible combobox is display/search only; a hidden field submits the value
        assert.strictEqual(input.hasAttribute('name'), false);
        assert.strictEqual(input.getAttribute('id'), 'flavour');
        assert.strictEqual(node.querySelector('input[type="hidden"]').getAttribute('name'), 'flavour');
    });

    it('should display option labels but submit option values', () => {
        const { node } = init(single);
        const input = node.querySelector('input');
        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));

        const option = node.querySelector('[role="option"]');
        assert.strictEqual(option.textContent, 'Apple');

        option.dispatchEvent(new Event('click', { bubbles: true }));
        //the input shows the display label, the hidden field submits the value
        assert.strictEqual(input.value, 'Apple');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="flavour"]').value, 'apple');
    });

    it('should clear the hidden value when the input is edited away from the selection', () => {
        const { node } = init(single);
        const input = node.querySelector('input');
        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        node.querySelector('[role="option"]').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(node.querySelector('input[type="hidden"]').value, 'apple');

        //typing over the committed selection drops it, so no stale value is submitted
        input.value = 'ban';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        assert.strictEqual(node.querySelector('input[type="hidden"]').value, '');
    });

    it('should let an explicit option override the select for name and template', () => {
        const { node } = init(single, { name: 'fruit', template: option => `${option.label}!` });
        assert.strictEqual(node.querySelector('input[type="hidden"]').getAttribute('name'), 'fruit');

        const input = node.querySelector('input');
        input.value = 'app';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        assert.strictEqual(node.querySelector('[role="option"]').textContent, 'Apple!');
    });

    it('should enhance a multiple select into chip mode with a shared name', () => {
        const instance = init(multiple);
        const { node } = instance;
        assert.strictEqual(instance.getState().settings.multiple, true);
        assert.notStrictEqual(node.querySelector('.autocomplete__output'), null);
        assert.strictEqual(node.querySelector('input').hasAttribute('name'), false);
    });

    it('should seed the initial selection from a pre-selected option in single mode', () => {
        const markup = single.replace('<option value="banana">', '<option value="banana" selected>');
        const instance = init(markup);
        assert.deepStrictEqual(instance.getState().selected, { value: 'banana', label: 'Banana' });
        //visible input shows the label, the hidden field carries the submit value
        assert.strictEqual(instance.node.querySelector('input').value, 'Banana');
        assert.strictEqual(instance.node.querySelector('input[type="hidden"]').value, 'banana');
    });

    it('should seed pre-selected options as chips with hidden inputs in multiple mode', () => {
        const instance = init(multiple);
        const { node } = instance;
        assert.deepStrictEqual(instance.getState().selected, [{ value: 'banana', label: 'Banana' }]);

        const chips = node.querySelectorAll('.autocomplete__chip');
        const hidden = node.querySelectorAll('input[type="hidden"][name="toppings"]');
        assert.strictEqual(chips.length, 1);
        assert.strictEqual(hidden.length, 1);
        assert.strictEqual(hidden[0].value, 'banana');
    });
});
