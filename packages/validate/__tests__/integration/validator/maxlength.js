import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validator > maxlength', () => {
    
    it('should return the validityState false for data-val maxlength validator with value length greater than maxlength', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-maxlength="Maxlength error message"
            data-val-maxlength-max="5"
            value="Falsey"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val maxlength validator with value length less than the max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
			name="group1"
            data-val="true"
            data-val-maxlength="Maxlength error message"
            data-val-maxlength-max="5"
            value="Pass"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired data-val maxlength validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-maxlength="Maxength error message"
            data-val-maxlength-max="5"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for HTML5 maxlength validator with value length greater than max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="5"
            value="Falsey"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for HTML5 maxlength validator with value length less than max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="5"
            value="Pass"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired HTML5 maxlength validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="5"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});