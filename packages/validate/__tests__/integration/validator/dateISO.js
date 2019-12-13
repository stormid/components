import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validator > dateISO', () => {

    it('should return the validityState false for data-val dateISO validator with non-spec date', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            value="12/12/12"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val dateISO validator with an on-spec date', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            value="2019-05-14"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(validate(group, group.validators[0])).toEqual(true);
    });
});

//YYYY-MM-DDTHH:MM:SS