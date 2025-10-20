import validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';

describe('Validate > Integration >  api > validate > stringlength', () => {
    
    it('should validate a form based on the data-val stringlength validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is outwith the min and max length range', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-stringlength="Stringlength error message"
                data-val-length-max="8"
                value="Value is too long"
                type="text" />
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Stringlength error message');
    });

    it('should validate a form based on the data-val stringlength validator returning true if within the min and max length range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                data-val="true"
                data-val-stringlength="Length error message"
                data-val-length-max="8"
                value="Fine"
                type="text" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});