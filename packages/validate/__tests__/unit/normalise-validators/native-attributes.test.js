import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > native attributes', () => {

    it('should return no validators for a field with native constraint attributes and no data-val', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            aria-required="true"
            minlength="2"
            maxlength="10"
            min="1"
            max="5"
            pattern="[a-z]+"
            type="email">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), []);
    });

    it('should return only data-val validators for a field that also has native constraint attributes', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            required
            pattern="[a-z]+"
            data-val="true"
            data-val-required="Required error message"
            type="email">`;
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'required',
                message: 'Required error message'
            }
        ]);
    });

});
