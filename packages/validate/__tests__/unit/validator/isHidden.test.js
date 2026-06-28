import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isFormValid, getValidityState, assembleValidationGroup } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > assembleValidationGroup > With hidden element', () => {
    it('should return the validation group minus hidden inputs', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value="test"
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('[name="group1"]'));
        const group = inputs.reduce(assembleValidationGroup, {});
        assert.deepStrictEqual(group.group1.fields, [inputs[0]]);
    });


    it('should return the validation state as valid ignoring hidden inputs', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value="test"
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('[name="group1"]'));
        const group = inputs.reduce(assembleValidationGroup, {});
        let validity = null;

        return getValidityState(group).then(validityState => {
            validity = isFormValid(validityState);
            assert.strictEqual(validity, true);
        });
    });

    it('should return the validation state as invalid ignoring hidden inputs', async () => {
        document.body.innerHTML = `<input
			id="group1-1"
            name="group1"
            required
            value=""
            type="text">
            <input
			id="group1-2"
            name="group1"
            required
            value=""
            type="hidden">`;
        const inputs = [].slice.call(document.querySelectorAll('[name="group1"]'));
        const group = inputs.reduce(assembleValidationGroup, {});
        let validity = null;

        return getValidityState(group).then(validityState => {
            validity = isFormValid(validityState);
            assert.strictEqual(validity, false);
        });
    });
});
