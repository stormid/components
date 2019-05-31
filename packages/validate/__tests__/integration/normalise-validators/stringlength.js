import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > stringlength', () => {
    
    it('should return the correct validation model for data-val stringlength', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-stringlength="Stringlength error message"
            data-val-length-max="8"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            { 
                type: 'stringlength',
                message: 'Stringlength error message',
                params: {
                    max: "8"
                }
            }
        ]);
    });
});