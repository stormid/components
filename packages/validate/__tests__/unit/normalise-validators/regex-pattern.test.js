import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > regex/pattern ', () => {
    
    it('should return the correct validation model for data-val regex', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-regex="Regex error message"
            data-val-regex-pattern="[a-z]+$"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'regex',
                message: 'Regex error message',
                params: { pattern: '[a-z]+$' }
            }
        ]);
    });

    it('should return the correct validation model for HTML5 pattern', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="[a-z]+$"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'pattern',
                params: {
                    regex: '[a-z]+$'
                }
            }
        ]);
    });
    
    it('should return the correct validation model for HTML5 pattern with a custom error message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            pattern="[a-z]+$"
            data-val-pattern="Pattern error message"
            type="text">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'pattern',
                params: {
                    regex: '[a-z]+$'
                },
                message: 'Pattern error message'
            }
        ]);
    });

});