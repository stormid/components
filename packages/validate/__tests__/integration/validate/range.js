import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > range', () => {
    
    it('should return the validityState false for data-val range validator with value outside the specified range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value="9"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val range validator with value inside the specified range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value="5"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for an unrequired data-val range validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });


});