import { validate, assembleValidationGroup } from '../../../src/lib/validator';

describe('Validate > Integration > validate > custom', () => {

    it('should return the validityState false for custom validator that fails', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = {
            valid:  false,
            fields: [input],
            validators: [ 
                { 
                    type: 'custom',
                    method(value, fields) {
                        return value === 'yes'
                    }
                }]
        };
		expect(validate(group, group.validators[0])).toEqual(false);
    });

    it('should return the validityState true for custom validator that fails', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = {
            valid:  false,
            fields: [input],
            validators: [ 
                { 
                    type: 'custom',
                    method(value, fields) {
                        return value === 'no'
                    }
                }]
        };
		expect(validate(group, group.validators[0])).toEqual(true);
    });

});