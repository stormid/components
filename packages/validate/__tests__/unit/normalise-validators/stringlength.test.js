import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > stringlength', () => {
    
    it('should return the correct validation model for data-val stringlength', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-stringlength="Stringlength error message"
            data-val-length-max="8"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'stringlength',
                message: 'Stringlength error message',
                params: {
                    max: '8'
                }
            }
        ]);
    });
});