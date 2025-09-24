import { normaliseValidators } from '../../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > number', () => {

    it('should return the correct validation model for data-val number', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-number="Number error message"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'number',
                message: 'Number error message'
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 number with a custom error message', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val-number="Number error message"
            type="number">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'number',
                message: 'Number error message'
            }
        ]);
    });

    it('should return the correct validation model for HTML5 number', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            type="number">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'number'
            }
        ]);
    });

});