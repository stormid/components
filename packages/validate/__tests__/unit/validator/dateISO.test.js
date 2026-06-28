import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, assembleValidationGroup } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > validator > dateISO', () => {

    it('should return the validityState false for data-val dateISO validator with non-spec date', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            value="12/12/12"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState true for data-val dateISO validator with an on-spec date', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-dateISO="DateISO error message"
            value="2019-05-14"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });
});

//YYYY-MM-DDTHH:MM:SS