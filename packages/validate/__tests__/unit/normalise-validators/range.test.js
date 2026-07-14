import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > range', () => {
    
    it('should return the correct validation model for data-val range', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'range',
                message: 'Range error message',
                params: {
                    min: '2',
                    max: '8'
                }
            }
        ]);
    });

});