import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-vaidators > max', () => {

    it('should return the correct validation model for data-val max', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-max="Max error message"
            data-val-max-max="2"
			type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                message: 'Max error message',
                type: 'max',
                params: {
                    max: '2'
                }
            }]);
    });
});