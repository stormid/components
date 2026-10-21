import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, assembleValidationGroup } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > assembleValidationGroup > required', () => {
    it('should return the validation group for data-val required validator', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value=""
            type="text">`;
        const input = document.querySelector('#group1-1');
        const group = [input].reduce(assembleValidationGroup, {});
        assert.deepStrictEqual(group, {
            group1: {
                valid: false,
                validators: [{ type: 'required', message: 'This field is required' }],
                fields: [input],
                serverErrorNode: false
            }
        });
    });

    it('should ignore native constraint attributes on a field without data-val', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            aria-required="true"
            minlength="2"
            pattern="[a-z]+"
            value=""
            type="email">`;
        const input = document.querySelector('#group1-1');
        const group = [input].reduce(assembleValidationGroup, {});
        assert.deepStrictEqual(group.group1.validators, []);
    });
});

describe('Validate > Integration > validator > required', () => {
    it('should return the validityState false for data-val required validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState false for data-val required validator with no value but whitespace', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value="    "
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState true for data-val required validator with a value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required="This field is required"
            value="Test"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });
});