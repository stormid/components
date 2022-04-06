import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validator > equalto', () => {
    
    it('should return the validityState false for data-val equalto validator with a value not matching another single field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                class="input"
                type="email"
                id="mce-EMAIL"
                name="EMAIL"
                data-val="true"
                data-val-required="Required error message"
                value="example@stormid.com"
            />
            <input
                class="input"
                type="email"
                id="VERIFY-EMAIL"
                name="VERIFY-EMAIL"
                value="not.matching@stormid.com"
                data-val="true"
                data-val-equalto="'Verify email' must match 'email'"
                data-val-equalto-other="EMAIL"
            />`;
        const input = document.querySelector('#VERIFY-EMAIL');
        const group = assembleValidationGroup({}, input)['VERIFY-EMAIL'];
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val equalto validator with a value matching another single field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
                class="input"
                type="email"
                id="mce-EMAIL"
                name="EMAIL"
                data-val="true"
                data-val-required="Required error message"
                value="example@stormid.com"
            />
            <input
                class="input"
                type="email"
                id="VERIFY-EMAIL"
                name="VERIFY-EMAIL"
                value="example@stormid.com"
                data-val="true"
                data-val-equalto="'Verify email' must match 'email'"
                data-val-equalto-other="EMAIL"
            />`;
        const input = document.querySelector('#VERIFY-EMAIL');
        const group = assembleValidationGroup({}, input)['VERIFY-EMAIL'];
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val equalto validator with a value not matching the other field(s)', async () => {
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
        const input = document.querySelector('#DoubleConfirmEmail');
        const group = assembleValidationGroup({}, input).DoubleConfirmEmail;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for data-val equalto validator with a value not matching the other field(s) with an empty value', async () => {
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
        const group = assembleValidationGroup({}, input).DoubleConfirmEmail;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val equalto validator with a value matching the other field(s)', async () => {
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
        const group = assembleValidationGroup({}, input).DoubleConfirmEmail;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for an unrequired data-val equalto validator with no value', async () => {
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
        const group = assembleValidationGroup({}, input).DoubleConfirmEmail;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

});