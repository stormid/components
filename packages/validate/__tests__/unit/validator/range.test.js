import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, assembleValidationGroup } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > validator > range', () => {
    
    it('should return the validityState false for data-val range validator with value outside the specified range', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value="9"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState true for data-val range validator with value inside the specified range', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value="5"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState true for an unrequired data-val range validator with no value', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            data-val-range-max="8"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState true for data-val range validator with value > min with no max', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="2"
            value="5"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState false for data-val range validator with value <= min with no max', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-min="5"
            value="1"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState true for data-val range validator with value <= max with no min', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-max="5"
            value="5"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState false for data-val range validator with value > max with no min', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-range="Range error message"
            data-val-range-max="5"
            value="6"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

});