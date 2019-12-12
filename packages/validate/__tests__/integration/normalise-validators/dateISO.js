import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-vaidators > dateISO', () => {
    
    it('should return the correct validation model for data-val email', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'dateISO',
                message: 'DateISO error message'
            }
        ]);
    });
});