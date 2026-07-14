import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > validator > custom', () => {

    it('should return the validityState false for custom validator that fails', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return value === 'yes';
                    }
                }]
        };
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState true for custom validator that fails', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="email">`;
        const input = document.querySelector('#group1');
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return value === 'no';
                    }
                }]
        };
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should support asynchronous custom validators', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="no"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = {
            valid: false,
            fields: [input],
            validators: [
                {
                    type: 'custom',
                    method(value, fields) {
                        return new Promise(resolve => {
                            setTimeout(() => resolve(value === 'no'), 100);
                        });
                    }
                }]
        };
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

});