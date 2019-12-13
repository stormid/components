import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validator > min', () => {
    
    it('should return the validityState false for HTML5 min validator with value less than min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="5"
            value="3"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for data-val min validator with value less than min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            name="group1"
            id="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="5"
            value="3"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(false);
    });
    

    it('should return the validityState true for HTML5 min validator with value greater than min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="5"
            value="6"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val min validator with value greater than min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="5"
            value="6"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for HTML5 min validator with a non-numeric value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="5"
            value="Not a number"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for data-val min validator with a non-numeric value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="5"
            value="Not a number"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for unrequired HTML5 min validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="5"
            value=""
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for unrequired data-val min validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="5"
            value=""
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(true);
    });

});