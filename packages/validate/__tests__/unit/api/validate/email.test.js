import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';

describe('Validate > Integration >  api > validate > email', () => {
    it('should validate a form based on the data-val email validator returning false, starting realTimeValidation, ', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-email="Email error message"
                value="not.an.email.address"
                type="email">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const input = document.getElementById('group2');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Email error message');
        
    });

    it('should validate a form based on the data-val email validator returning true if valid', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-email="Required error message"
                value="an.email.address@storm"
                type="email" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
    });
});
