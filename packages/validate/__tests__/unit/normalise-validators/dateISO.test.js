import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > dateISO', () => {
    
    it('should return the correct validation model for data-val email', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'dateISO',
                message: 'DateISO error message'
            }
        ]);
    });
});