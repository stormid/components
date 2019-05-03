import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > max', () => {
    
    it('should return the validityState false for HTML5 max validator with value greater than max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="2"
            value="3"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for HTML5 max validator with value less than or equal to max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="2"
            value="2"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for HTML5 max validator with a non-numeric value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="2"
            value="Not a number"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for unrequired HTML5 max validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="2"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });


});