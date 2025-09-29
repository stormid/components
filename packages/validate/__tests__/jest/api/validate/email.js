import validate from '../../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../../src/lib/constants';
import defaults from '../../../../../src/lib/defaults';

describe('Validate > Integration >  api > validate > email', () => {
    it('should validate a form based on the HTML5 email validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="not.an.email.address"
                type="email" />
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual(defaults.messages.email());
    });

    it('should validate a form based on the HTML5 email validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="an.email.address@storm"
                type="text" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val email validator returning false, starting realTimeValidation, ', async () => {
        expect.assertions(4);
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
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
        expect(document.activeElement).toEqual(input);
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Email error message');
        
    });

    it('should validate a form based on the data-val email validator returning true if valid', async () => {
        expect.assertions(1);
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
        expect(validityState).toEqual(true);
    });
});
