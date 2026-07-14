import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';
import defaults from '../../../../src/lib/defaults/index.js';

describe('Validate > Integration > api > validate > regex/pattern', () => {
    it('should validate a form based on the HTML5 pattern validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the value does not match', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                pattern="^(pass)$"
                value="fail"
                type="text">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, defaults.messages.pattern());
    });

    it('should validate a form based on the data-val regex validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-regex="Regex error message"
                data-val-regex-pattern="^(pass)$"
                value="fail"
                type="text">
            </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Regex error message');
    });
    
    it('should validate a form based on the HTML5 pattern validator returning true if the pattern is matched', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                pattern="^(pass)$"
                value="pass"
                type="text">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

    it('should validate a form based on the HTML5 pattern validator returning true if the pattern is matched', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-regex="Regex error message"
                data-val-regex-pattern="^(pass)$"
                value="pass"
                type="text">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

});