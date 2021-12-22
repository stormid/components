import { validate } from '../../../src/lib/validator';

describe('Validate > Integration > validator > error handling', () => {

    it('should ', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const errorMessage = 'There was an error';
        console.warn = jest.fn();
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        throw errorMessage;
                    }
                }]
        };
        validate(group, group.validators[0]);
        expect(console.warn).toHaveBeenCalledWith(errorMessage);
    });

});