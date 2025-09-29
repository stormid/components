import { normaliseValidators } from '../../../src/lib/validator';

describe('Validate > Integration > normalise-validators > url', () => {
    it('should return the correct validation model for HTML5 url', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="url">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'url'
            }
        ]);
    });

    it('should return the correct validation model for HTML5 url with a custom error message', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val-url="URL error message"
            type="url">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'url',
                message: 'URL error message'
            }
        ]);
    });

    it('should return the correct validation model for data-val url', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-url="Url error message"
            type="text">`;
        const input = document.querySelector('#group1');
        expect(normaliseValidators(input)).toEqual([
            {
                type: 'url',
                message: 'Url error message'
            }
        ]);
    });
});