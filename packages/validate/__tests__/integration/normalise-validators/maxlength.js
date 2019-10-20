import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > maxlength', () => {
    
    it('should return the correct validation model for HTML5 maxlength', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="8"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'maxlength',
                params: { 
                    max: "8"
                }
            }
		]);
    });

  	it('should return the correct validation model for HTML5 maxlength with a custom error message', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            maxlength="8"
            data-val-maxlength="Maxlength error message"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'maxlength',
                params: { 
                    max: "8"
                },
                message: 'Maxlength error message'
            }
		]);
    });
    
    it('should return the correct validation model for data-val maxlength', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-maxlength="Maxlength error message"
            data-val-maxlength-max="5"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            { 
                type: 'maxlength',
                message: 'Maxlength error message',
                params: {
                    max: "5"
                }
            }
        ]);
    });
});