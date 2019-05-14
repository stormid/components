import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > email', () => {
    
    it('should return the correct validation model for data-val email', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-email="Email error message"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            { 
                type: 'email',
                message: 'Email error message'
            }
        ]);
    });

  	it('should return the correct validation model for HTML5 email', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="email">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'email'
            }
		]);
    });
});