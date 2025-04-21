import { validate } from '../../../../src/lib/validator';

describe('Validate > Integration > validator > custom', () => {

    it('should return the validityState false for custom validator that fails', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return value === 'yes';
                    }
                }]
        };
        expect(await validate(group, group.validators[0])).toEqual(false);
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
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return value === 'no';
                    }
                }]
        };
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

    it('should support asynchronous custom validators', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return new Promise(resolve => {
                            setTimeout(() => resolve(value === 'no'), 100);
                        });
                    }
                }]
        };
        expect(await validate(group, group.validators[0])).toEqual(true);
    });

});