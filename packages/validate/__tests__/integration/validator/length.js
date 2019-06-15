import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validator > length', () => {
    
    it('should return the validityState false for data-val length validator with value greater than max length', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-length="Length error message"
            data-val-length-min="2"
            data-val-length-max="8"
            value="Value is too long"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val length validator with value within the min and max length range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-length="Length error message"
            data-val-length-min="2"
            data-val-length-max="8"
            value="Pass"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired data-val length validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-length="Length error message"
            data-val-length-min="2"
            data-val-length-max="8"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});