import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > length', () => {
    
    it('should return the correct validation model for data-val length', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-length="Length error message"
            data-val-length-min="2"
            data-val-length-max="8"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'length',
                message: 'Length error message',
                params: {
                    min: '2',
                    max: '8'
                }
            }
        ]);
    });
});