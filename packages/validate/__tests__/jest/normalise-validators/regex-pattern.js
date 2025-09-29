import { normaliseValidators } from '../../../../src/lib/validator';

describe('Validate > Integration > normalise-validators > regex/pattern ', () => {
    
    it('should return the correct validation model for data-val regex', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-regex="Regex error message"
            data-val-regex-pattern="[a-z]+$"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'regex',
                message: 'Regex error message',
                params: { pattern: '[a-z]+$' }
            }
        ]);
    });

    it('should return the correct validation model for HTML5 pattern', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="[a-z]+$"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'pattern',
                params: {
                    regex: '[a-z]+$'
                }
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 pattern with a custom error message', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="[a-z]+$"
            data-val-pattern="Pattern error message"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'pattern',
                params: {
                    regex: '[a-z]+$'
                },
                message: 'Pattern error message'
            }
        ]);
    });

});