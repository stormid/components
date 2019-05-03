import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > number', () => {
    it('should return the validityState false for HTML5 number validator with non-number', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="not.a.number"
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for HTML5 number validator with a number', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="99"
            type="number">
            <input
			id="group2"
            name="group2"
            value="-99"
			type="number">`;
        const input1 = document.querySelector('#group1');
        const group1 = assembleValidationGroup({}, input1)['group1'];
        const input2 = document.querySelector('#group2');
        const group2 = assembleValidationGroup({}, input2)['group2'];
		expect(validate(group1, group1.validators[0])).toEqual(true);
		expect(validate(group2, group2.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty HTML5 number validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            value=""
			type="number">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val number validator with non-number', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-number="Number error message"
            value="not.a.number"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val number validator with a number', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-number="Number error message"
            value="99"
			type="text"><input
			id="group2"
            name="group2"
            data-val="true"
            data-val-number="Number error message"
            value="-99"
			type="text">`;
        const input1 = document.querySelector('#group1');
        const group1 = assembleValidationGroup({}, input1)['group1'];
        const input2 = document.querySelector('#group2');
        const group2 = assembleValidationGroup({}, input2)['group2'];
		expect(validate(group1, group1.validators[0])).toEqual(true);
		expect(validate(group2, group2.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty data-val number validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-number="Number error message"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input)['group1'];
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});