import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > minlength', () => {
    
    it('should return the validityState false for data-val minlength validator with value length less than minlength', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-minlength="Minlength error message"
            data-val-minlength-min="5"
            value="No"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val minlength validator with value length greater than the min', async () => {
        document.body.innerHTML = `<input
			id="group1"
			name="group1"
            data-val="true"
            data-val-minlength="Minlength error message"
            data-val-minlength-min="5"
            value="Valid"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired data-val minlength validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-minlength="Maxlength error message"
            data-val-minlength-min="5"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for HTML5 minlength validator with value length less than min length', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="5"
            value="No"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for HTML5 minlength validator with value length greater than min length', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="5"
            value="Valid"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired HTML5 minlength validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="5"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});