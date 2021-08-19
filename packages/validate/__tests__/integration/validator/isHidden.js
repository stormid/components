import { assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > assembleValidationGroup > With hidden element', () => {
    it('should return the validation group minus hidden inputs', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value="test"
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('name="group1'));
        const group = inputs.reduce(assembleValidationGroup, {});
        expect(group.group1.fields).toEqual([inputs[0]]);
    });


    it('should return the validation state as valid ignoring hidden inputs', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value="test"
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('name="group1'));
        const group = inputs.reduce(assembleValidationGroup, {});
        expect(group).toEqual({
            group1: {
                valid: true,
                validators: [{ type: 'required' }],
                fields: [inputs[0]],
                serverErrorNode: false
            }
        });
    });

    it('should return the validation state as invalid ignoring hidden inputs', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value=""
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('name="group1'));
        const group = inputs.reduce(assembleValidationGroup, {});
        expect(group).toEqual({
            group1: {
                valid: false,
                validators: [{ type: 'required' }],
                fields: [inputs[0]],
                serverErrorNode: false
            }
        });
    });
});
