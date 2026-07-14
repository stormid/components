import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > number', () => {

    it('should return the correct validation model for data-val number', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-number="Number error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'number',
                message: 'Number error message'
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 number with a custom error message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val-number="Number error message"
            type="number">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'number',
                message: 'Number error message'
            }
        ]);
    });

    it('should return the correct validation model for HTML5 number', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            type="number">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'number'
            }
        ]);
    });

});