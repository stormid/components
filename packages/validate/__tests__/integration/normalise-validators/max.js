import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > max', () => {

    it('should return the correct validation model for HTML5 max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            max="8"
			type="text">`;
		const input = document.querySelector('#group1');
		expect(normaliseValidators(input)).toEqual([
			{ 
                type: 'max',
                params: { 
                    max: "8"
                }
            }
		]);
    });
});