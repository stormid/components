import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';

describe('Validate > Integration >  api > validate > url', () => {
    //html5 spec regex approximation:
    ///^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?

    it('should validate a form based on the data-val email validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-url="Url error message"
                value="not.a.url"
                type="url">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const input = document.getElementById('group2');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Url error message');
    });

    it('should validate a form based on the data-val url validator returning true if valid', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-url="Url error message"
                value="https://a.url.com"
                type="url">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        assert.deepStrictEqual(validityState, true);
        
    });


});