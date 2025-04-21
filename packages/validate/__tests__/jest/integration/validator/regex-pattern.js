import { validate, assembleValidationGroup } from '../../../../src/lib/validator';

describe('Validate > Integration > validator > regex/pattern', () => {
    it('should return the validityState false for HTML5 pattern validator with non-matching value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="^(pass)$"
            value="fail"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });
    
    it('should return the validityState false for HTML5 pattern validator with matching value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="^(pass)$"
            value="pass"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty HTML5 pattern validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            pattern="^(pass)$"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val regex validator with non-matching value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-regex="Regex error message"
            data-val-regex-pattern="^(pass)$"
            value="fail"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val regex validator with a matching value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-regex="Regex error message"
            data-val-regex-pattern="^(pass)$"
            value="pass"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for non-required empty data-val pattern validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-regex="Regex error message"
            data-val-regex-pattern="^(pass)$"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

});