import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validate, assembleValidationGroup } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > validator > url', () => {
    //html5 spec regex approximation:
    ///^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
    it('should return the validityState false for HTML5 url validator with non-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="not.a.url.com"
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });

    it('should return the validityState false for data-val url validator with non-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-url="Not a valid url"
            value="not.a.url.com"
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), false);
    });
    
    it('should return the validityState true for non-required empty HTML5 url validator field', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value=""
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState true for non-required empty data-val url validator field', async () => {
        document.body.innerHTML = `<input
            id="group1"
            name="group1"
            data-val="true"
            data-val-url="Not a valid url"
            value=""
			type="text">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });

    it('should return the validityState false for HTML5 url validator with an on-spec url', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            value="https://a.url.com"
			type="url">`;
        const input = document.querySelector('#group1');
        const group = assembleValidationGroup({}, input).group1;
        assert.deepStrictEqual(await validate(group, group.validators[0]), true);
    });


});