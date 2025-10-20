import validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import defaults from '../../../../src/lib/defaults';

describe('Validate > Integration > api > validate > required', () => {

    it('should validate a form based on the HTML5 required validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
        </form>`;
        const input = document.getElementById('group1-1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual(defaults.messages.required());
    });

    it('should validate a form based on the HTML5 required validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value="Valid value"
                type="text" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val required validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-required="Required error message"
                value=""
                type="text">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const input = document.getElementById('group2');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Required error message');
        
    });

    it('should validate a form based on the data-val required validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-required="Required error message"
                value="Valid value"
                type="text" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });
});
