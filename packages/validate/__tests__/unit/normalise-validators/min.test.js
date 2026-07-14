import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > min', () => {

    it('should return the correct validation model for HTML5 min', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="2"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'min',
                params: {
                    min: '2'
                }
            }
        ]);
    });

    it('should return the correct validation model for HTML5 min with a custom error message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            min="2"
            data-val-min="Min error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'min',
                params: {
                    min: '2'
                },
                message: 'Min error message'
            }
        ]);
    });


    it('should return the correct validation model for data-val min', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-min="Min error message"
            data-val-min-min="2"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                message: 'Min error message',
                type: 'min',
                params: {
                    min: '2'
                }
            }
        ]);
    });
});
