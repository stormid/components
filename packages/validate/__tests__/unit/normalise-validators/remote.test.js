import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > remote', () => {
    
    it('should return the correct validation model for data-val remote', async () => {
        document.body.innerHTML = `<input
          id="group1"
          name="group1"
          data-val="true"
          data-val-remote="Remote error message"
          data-val-remote-url="/api/validate"
          type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'remote',
                message: 'Remote error message',
                params: {
                    url: '/api/validate'
                }
            }
        ]);
    });

    it('should return the correct validation model for data-val remote with additional fields', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-remote="Remote error message"
            data-val-remote-url="/api/validate"
            data-val-remote-additionalfields="group2"
            type="text">
            <input
            id="group2"
            name="group2"
            type="text">`;
        const input = document.querySelector('#group1');
        const input2 = [].slice.call(document.querySelectorAll('#group2'));
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'remote',
                message: 'Remote error message',
                params: {
                    url: '/api/validate',
                    additionalfields: [input2]
                }
            }
        ]);
    });

});