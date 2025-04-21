import { validate, assembleValidationGroup } from '../../../../src/lib/validator';

describe('Validate > Integration > validator > stringlength', () => {
    
    it('should return the validityState false for data-val stringlength validator with value greater than max length', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-stringlength="Stringlength error message"
            data-val-length-max="8"
            value="String longer than 8 characters"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for non-required empty data-val stringlength validator field', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-stringlength="Stringlength error message"
            data-val-length-max="8"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState true for data-val stringlength validator with value less than max length', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-stringlength="Stringlength error message"
            data-val-length-max="8"
            value="Valid"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

});