import validate from '../../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../../src/lib/constants';

describe('Validate > Integration > api > validate > digits', () => {
    it('should validate a form based on the data-val digits validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-digits="Digits error message"
                value="Not a digit"
                type="text" />
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Digits error message');
    });

    it('should validate a form based on the data-val digits validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                data-val="true"
                data-val-digits="Digits error message"
                value="13465789"
                type="text" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});