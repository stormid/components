import library from '../../../../src';
import { validate, assembleValidationGroup } from '../../../../src/lib/validator';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';

describe('Validate > Integration >  api > validate > equalto', () => {
    
    it('should validate a form based on the data-val equalto validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
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
        const label = document.getElementById('DoubleConfirmEmail-label');
        const validator = library('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(false);
        // //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // //focus on first invalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(document.querySelector(DOTNET_CLASSNAMES.ERROR).textContent).toEqual('Equalto error message');
    });

    it('should validate a form based on the data-val equalto validator returning true if valid', async () => {
        expect.assertions(1);
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
        expect(validate(group, group.validators[0])).toEqual(false);
    });

});