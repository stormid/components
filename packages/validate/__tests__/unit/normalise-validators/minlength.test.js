import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > minlength', () => {
    
    it('should return the correct validation model for HTML5 minlength', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="2"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'minlength',
                params: {
                    min: '2'
                }
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 minlength with a custom error message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            minlength="2"
            data-val-minlength="Minlength error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'minlength',
                params: {
                    min: '2'
                },
                message: 'Minlength error message'
            }
        ]);
    });

    it('should return the correct validation model for data-val minlength', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-minlength="Minlength error message"
            data-val-minlength-min="2"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'minlength',
                message: 'Minlength error message',
                params: {
                    min: '2'
                }
            }
        ]);
    });
});