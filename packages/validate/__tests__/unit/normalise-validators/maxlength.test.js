import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > maxlength', () => {
    
    it('should return the correct validation model for data-val maxlength', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-maxlength="Maxlength error message"
            data-val-maxlength-max="5"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'maxlength',
                message: 'Maxlength error message',
                params: {
                    max: '5'
                }
            }
        ]);
    });
});