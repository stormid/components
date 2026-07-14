import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > url', () => {
    it('should return the correct validation model for HTML5 url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
			type="url">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'url'
            }
        ]);
    });

    it('should return the correct validation model for HTML5 url with a custom error message', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val-url="URL error message"
            type="url">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'url',
                message: 'URL error message'
            }
        ]);
    });

    it('should return the correct validation model for data-val url', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-url="Url error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'url',
                message: 'Url error message'
            }
        ]);
    });
});