import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > email', () => {
    
    it('should return the correct validation model for data-val email', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-email="Email error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'email',
                message: 'Email error message'
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 email with a custom error message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val-email="Email error message"
            type="email">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [{
            type: 'email',
            message: 'Email error message'
        }]);
    });
    
    it('should return the correct validation model for HTML5 email', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            type="email">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [{
            type: 'email'
        }]);
    });
});