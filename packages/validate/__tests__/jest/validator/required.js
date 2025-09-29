import { validate, assembleValidationGroup } from '../../../../src/lib/validator';

describe('Validate > Integration > assembleValidationGroup > required', () => {
    it('should return the validation group for HTML5 required validator', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value=""
            type="text">`;
        const input = document.querySelector('#group1-1');
        const group = [input].reduce(assembleValidationGroup, {});
        expect(group).toEqual({
            group1: {
                valid: false,
                validators: [{ type: 'required' }],
                fields: [input],
                serverErrorNode: false
            }
        });
    });
});

describe('Validate > Integration > validator > required', () => {
    it('should return the validityState false for HTML5 required validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for HTML5 required validator with no value other than whitespace', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            value="     "
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for HTML5 required validator with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            value="Test"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should return the validityState false for data-val required validator with no value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState false for data-val required validator with no value but whitespace', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value="    "
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for data-val required validator with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value="Test"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        expect(await validate(group, group.validators[0])).toEqual(true);
    });
});