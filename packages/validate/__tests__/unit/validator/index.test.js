import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > validator > error handling', () => {

    it('should handle and console warn an error thrown during validation', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const errorMessage = 'There was an error';
        console.warn = mock.fn();
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        throw errorMessage;
                    }
                }]
        };
        await validate(group, group.validators[0]);
        assert.ok(console.warn.mock.calls.some(c => {
            try { assert.deepStrictEqual(c.arguments, [errorMessage]); return true; } catch { return false; }
        }));
    });

});