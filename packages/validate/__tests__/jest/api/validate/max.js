import validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import defaults from '../../../../src/lib/defaults';

describe('Validate > Integration > api > validate > max', () => {
    
    it('should validate a form based on the HTML5 max validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
        <label id="group1-label" for="group1">group1</label>
        <input
            id="group1"
            name="group1"
            max="2"
            value="3"
            type="number">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual(defaults.messages.max({ max: 2 }));
    });

    it('should validate a form based on the data-val equalto validator returning true if valid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-max="Max error message"
                data-val-max-max="2"
                value="3"
                type="number">
            </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Max error message');
    });

    it('should validate a form based on the data-val max validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                max="2"
                value="2"
                type="number">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val max validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-max="Max error message"
                data-val-max-max="2"
                value="2"
                type="number">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});