import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mount, type, clickOption } from './helpers.js';

const countries = [
    { value: 'GB', label: 'United Kingdom' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' }
];

const search = query => countries.filter(country => country.label.toLowerCase().includes(query.toLowerCase()));

//the reset restore runs in a microtask (after the browser resets the controls), so
//tests await a microtask turn before asserting
const tick = () => Promise.resolve();

describe('Autocomplete > form reset', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should restore a seeded single selection on form reset', async () => {
        const markup = '<form id="f"><label for="c">Country</label><div class="js-autocomplete" id="c" data-value="GB" data-label="United Kingdom"></div></form>';
        const { node } = mount(markup, { name: 'country', displayTemplate: option => option.label, minlength: 1, search });
        const input = node.querySelector('input');
        const hidden = () => node.querySelector('input[type="hidden"][name="country"]').value;

        type(input, 'fra');
        clickOption(node, 0); // change to France
        assert.strictEqual(input.value, 'France');
        assert.strictEqual(hidden(), 'FR');

        document.getElementById('f').reset();
        await tick();

        //returns to the seeded default, like a native <select>
        assert.strictEqual(input.value, 'United Kingdom');
        assert.strictEqual(hidden(), 'GB');
    });

    it('should restore an empty single selection (no initial value) on form reset', async () => {
        const markup = '<form id="e"><label for="s">Country</label><div class="js-autocomplete" id="s"></div></form>';
        const instance = mount(markup, { name: 'country', displayTemplate: option => option.label, minlength: 1, search });
        const { node } = instance;
        const input = node.querySelector('input');

        type(input, 'fra');
        clickOption(node, 0); // pick France where there was no initial selection
        assert.strictEqual(input.value, 'France');

        document.getElementById('e').reset();
        await tick();

        //no initial selection -> reset returns to empty
        assert.strictEqual(input.value, '');
        assert.strictEqual(node.querySelector('input[type="hidden"][name="country"]').value, '');
        assert.strictEqual(instance.getState().selected, null);
    });

    it('should clear chips back to the empty initial selection on form reset', async () => {
        const markup = '<form id="g"><label for="m">Countries</label><div class="js-autocomplete" id="m"></div></form>';
        const instance = mount(markup, { name: 'countries', multiple: true, displayTemplate: option => option.label, minlength: 1, search });
        const { node } = instance;
        const input = node.querySelector('input');

        type(input, 'united');
        clickOption(node, 0); // United Kingdom
        type(input, 'fra');
        clickOption(node, 0); // France
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 2);

        document.getElementById('g').reset();
        await tick();

        assert.deepStrictEqual(instance.getState().selected, []);
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 0);
        assert.strictEqual(node.querySelector('.autocomplete__output'), null);
    });

    it('should restore a pre-selected <select multiple> chip on form reset', async () => {
        const markup = `
            <form id="h"><label for="t">Toppings</label>
                <div class="js-autocomplete">
                    <select id="t" name="t" multiple>
                        <option value="a">Apple</option>
                        <option value="b" selected>Banana</option>
                        <option value="c">Cherry</option>
                    </select>
                </div>
            </form>`;
        const instance = mount(markup);
        const { node } = instance;
        const input = node.querySelector('input');

        type(input, 'app');
        clickOption(node, 0); // add Apple alongside the pre-selected Banana
        assert.strictEqual(node.querySelectorAll('.autocomplete__chip').length, 2);

        document.getElementById('h').reset();
        await tick();

        assert.deepStrictEqual(instance.getState().selected, [{ value: 'b', label: 'Banana' }]);
        const hidden = [...node.querySelectorAll('input[type="hidden"][name="t"]')].map(i => i.value);
        assert.deepStrictEqual(hidden, ['b']);
    });
});
