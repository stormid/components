import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-validators > range', () => {
    
    it('should return the correct validation model for data-val range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'range',
                message: 'Range error message',
                params: {
                    min: '2',
                    max: '8'
                }
            }
        ]);
    });

});