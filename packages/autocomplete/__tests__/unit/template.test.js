import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import autocomplete from '../../src/index.js';

const values = [
    { value: 'LHR', label: 'Heathrow', detail: 'London, United Kingdom' },
    { value: 'JFK', label: 'John F. Kennedy', detail: 'New York, United States' }
];

const search = query => values.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

const init = (options = {}) => {
    document.body.innerHTML = '<label for="airport">Airport</label><div class="js-autocomplete" id="airport"></div>';
    const [instance] = autocomplete('.js-autocomplete', { minlength: 1, name: 'airport', search, ...options });
    return instance;
};

const type = (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('Autocomplete > Option template', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should render list options with displayTemplate when no optionTemplate is set', () => {
        const { node } = init({ displayTemplate: option => option.label });
        type(node.querySelector('input'), 'hea');
        assert.strictEqual(node.querySelector('.autocomplete__option').textContent, 'Heathrow');
    });

    it('should render list options with a string returned by optionTemplate', () => {
        const { node } = init({
            displayTemplate: option => option.label,
            optionTemplate: option => `${option.label} — ${option.detail}`
        });
        type(node.querySelector('input'), 'hea');
        assert.strictEqual(node.querySelector('.autocomplete__option').textContent, 'Heathrow — London, United Kingdom');
    });

    it('should append a DOM node returned by optionTemplate for richer markup', () => {
        const { node } = init({
            displayTemplate: option => option.label,
            optionTemplate(option){
                const title = document.createElement('span');
                title.classList.add('title');
                title.textContent = option.label;
                const detail = document.createElement('small');
                detail.classList.add('detail');
                detail.textContent = option.detail;
                const wrap = document.createElement('span');
                wrap.append(title, detail);
                return wrap;
            }
        });
        type(node.querySelector('input'), 'hea');
        const option = node.querySelector('.autocomplete__option');
        assert.strictEqual(option.querySelector('.title').textContent, 'Heathrow');
        assert.strictEqual(option.querySelector('.detail').textContent, 'London, United Kingdom');
    });

    it('should commit the option when a click lands on a child node of the template', () => {
        const { node } = init({
            displayTemplate: option => option.label,
            submissionTemplate: option => option.value,
            optionTemplate(option){
                const detail = document.createElement('small');
                detail.classList.add('detail');
                detail.textContent = option.detail;
                const wrap = document.createElement('span');
                wrap.append(option.label, detail);
                return wrap;
            }
        });
        const input = node.querySelector('input');
        type(input, 'hea');
        //click the inner detail node, not the option <li> itself
        node.querySelector('.autocomplete__option .detail').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(input.value, 'Heathrow');
        assert.strictEqual(node.querySelector('input[type="hidden"]').value, 'LHR');
    });

    it('should keep optionTemplate out of the input display and submitted value', () => {
        const { node } = init({
            displayTemplate: option => option.label,
            submissionTemplate: option => option.value,
            optionTemplate: option => `${option.label} — ${option.detail}`
        });
        const input = node.querySelector('input');
        type(input, 'hea');
        node.querySelector('.autocomplete__option').dispatchEvent(new Event('click', { bubbles: true }));
        assert.strictEqual(input.value, 'Heathrow');
        assert.strictEqual(node.querySelector('input[type="hidden"]').value, 'LHR');
    });
});
