import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > equalto', () => {
    
    it('should validate a form based on the HTML5 email validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="example@stormid.com" />
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="not.the.same.email.address@stormid.com" />`;
        const input = document.querySelector('#DoubleConfirmEmail')
        const label = document.getElementById('group1-label');
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(false);
        // //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // //focus on first invalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(label.lastChild.nodeName).toEqual('SPAN');
        expect(label.lastChild.className).toEqual(DOTNET_CLASSNAMES.ERROR);
        expect(label.lastChild.textContent).toEqual(MESSAGES.email());
    });

    it('should validate a form based on the HTML5 email validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="" />
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="example@stormid.com" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const group = assembleValidationGroup({}, input)['DoubleConfirmEmail'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should validate a form based on the data-val email validator returning false, staring realTimeValidation', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="example@stormid.com" />
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="example@stormid.com" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const group = assembleValidationGroup({}, input)['DoubleConfirmEmail'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should validate a form based on the data-val email validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                id="Email"
                name="Email"
                value="example@stormid.com" />
            <input
                id="ConfirmEmail"
                name="ConfirmEmail"
                value="example@stormid.com" />
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
                value="" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const group = assembleValidationGroup({}, input)['DoubleConfirmEmail'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});