import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';

describe('Validate > Integration >  api > validate > equalto', () => {
    
    it('should validate a form based on the data-val range validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if the value is out of range', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                data-val-range-max="8"
                value="9"
                type="text">
        </form>`;
        const input = document.querySelector('#group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value > min with no max', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                value="5"
                type="text">
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

    it('should validate a form based on the data-val range validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if the value <= min with no max', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="8"
                value="7"
                type="text">
        </form>`;
        const input = document.querySelector('#group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value <= max with no min', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-max="2"
                value="2"
                type="text">
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

    it('should validate a form based on the data-val range validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if the value > max with no min', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-max="8"
                value="9"
                type="text">
        </form>`;
        const input = document.querySelector('#group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value is in range', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                data-val-range-max="8"
                value="7"
                type="text">
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });

});