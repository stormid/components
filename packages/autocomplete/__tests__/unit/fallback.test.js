import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mount } from './helpers.js';

//The no-JS fallback: the node ships a real, submittable <input> (works with JS
//off) and the component enhances *that element in place* rather than generating
//one. Only the enhancement-in-place and the adoption of the input's own
//name/value are new here — the hidden-field split, label wiring, ARIA and the
//restore/edit lifecycle are the shared machinery covered by init/value/select.
const single = `
    <label for="q">Fruit</label>
    <div class="js-autocomplete">
        <input type="search" id="q" name="q">
    </div>`;

const fruits = [{ value: 'apple', label: 'Apple' }];
const search = query => fruits.filter(fruit => fruit.label.toLowerCase().includes(query.toLowerCase()));

describe('Autocomplete > Input fallback', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should enhance the server-rendered input in place, adopting its name onto the hidden field', () => {
        const { node } = mount(single, { search });
        //type="search" surviving on the sole combobox proves this is the *same*
        //element decorated — a generated input would be type="text" and the original
        //would be left behind, giving two inputs
        const visible = node.querySelectorAll('input:not([type="hidden"])');
        assert.strictEqual(visible.length, 1);
        assert.strictEqual(visible[0].getAttribute('type'), 'search');
        assert.strictEqual(visible[0].getAttribute('role'), 'combobox');
        //its name is moved to the hidden value field so the field isn't submitted twice
        assert.strictEqual(visible[0].hasAttribute('name'), false);
        assert.strictEqual(node.querySelector('input[type="hidden"]').getAttribute('name'), 'q');
    });

    it('should seed a value on the enhanced input as the initial selection', () => {
        const { node, getState } = mount(single.replace('name="q"', 'name="q" value="Apple"'), { search });
        //the input's own value is adopted like a data-value, becoming a real selection
        assert.deepStrictEqual(getState().selected, { value: 'Apple', label: 'Apple' });
        assert.strictEqual(node.querySelector('input[type="hidden"]').value, 'Apple');
    });

    //One input can't carry several values without JS, so multiple mode degrades to a
    //plain search field: a server value stays as ordinary typed text rather than being
    //turned into a lone chip (which would be a confusing, single-item multi-select).
    it('should not seed a chip from the input value in multiple mode', () => {
        const multiple = single
            .replace('js-autocomplete', 'js-autocomplete autocomplete--multiple')
            .replace('name="q"', 'name="q" value="apple"');
        const { node, getState } = mount(multiple, { search, multiple: true });

        assert.strictEqual(node.querySelector('.autocomplete__chip'), null);
        assert.deepStrictEqual(getState().selected, []);
        //still enhanced, and the name is adopted so chips from real selections submit
        const input = node.querySelector('input[role="combobox"]');
        assert.strictEqual(input.hasAttribute('name'), false);
        assert.strictEqual(input.value, 'apple');
    });
});
