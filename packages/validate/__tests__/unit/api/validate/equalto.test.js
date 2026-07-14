import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import library from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';
import { validate, assembleValidationGroup } from '../../../../src/lib/validator/index.js';

describe('Validate > Integration >  api > validate > equalto', () => {
    
    it('should validate a form based on the data-val equalto validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        document.body.innerHTML = `<form class="form"><input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="example@stormid.com" />
            <label id="DoubleConfirmEmail-label" for="DoubleConfirmEmail">DoubleConfirmEmail</label>
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="not.the.same.email.address@stormid.com" /></form>`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const validator = library('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Equalto error message');
    });

    it('should validate a form based on the data-val equalto validator returning true if valid', async () => {
        document.body.innerHTML = `<input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="" />
            <label id="DoubleConfirmEmail-label" for="DoubleConfirmEmail">DoubleConfirmEmail</label>
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="example@stormid.com" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const group = assembleValidationGroup({}, input).DoubleConfirmEmail;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

});