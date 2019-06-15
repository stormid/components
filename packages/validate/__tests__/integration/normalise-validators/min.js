import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > min', () => {

    it('should return the correct validation model for HTML5 min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="2"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'min',
                params: { 
                    min: "2"
                }
            }
		]);
    });

     it('should return the correct validation model for data-val min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="2"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                message: "Min error message",
                type: 'min',
                params: { 
                    min: "2"
                }
            }
		]);
    });
});
