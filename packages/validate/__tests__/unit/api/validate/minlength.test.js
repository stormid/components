import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';
import defaults from '../../../../src/lib/defaults/index.js';

describe('Validate > Integration > api > validate > minlength', () => {
    
    it('should validate a form based on the HTML5 minlength validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        document.body.innerHTML = `<form class="form">
        <label id="group1-label" for="group1">group1</label>
        <input
			id="group1"
            name="group1"
            minlength="3"
            value="No"
			type="text">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, defaults.messages.minlength({ min: 3 }));
    });

    it('should validate a form based on the data-val minlength validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-minlength="Minlength error message"
                data-val-minlength-min="3"
                value="No"
                type="text">
            </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Minlength error message');
    });

    it('should validate a form based on the HTML5 minlength validator returning true if valid', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                minlength="3"
                value="Fine"
                type="text">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

    it('should validate a form based on the data-val minlength validator returning true if valid', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-minlength="Minlength error message"
                data-val-minlength-min="3"
                value="Fine"
                type="text">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

});