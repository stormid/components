import validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import defaults from '../../../../src/lib/defaults';

describe('Validate > Integration > api > validate > number', () => {
    
    it('should validate a form based on the HTML5 number validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="not.a.number"
                type="number">
        </form>`;
        const input = document.getElementById('group1');
        const label = document.getElementById('group1-label');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // // render error message
        expect(document.querySelector(DOTNET_CLASSNAMES.ERROR).textContent).toEqual(defaults.messages.number());
    });

    it('should validate a form based on the HTML5 number validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="100"
                type="number">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val number validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-number="Number error message"
                value="not.a.number"
                type="number">
        </form>`;
        const input = document.getElementById('group1');
        const label = document.getElementById('group1-label');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // // render error message
        expect(document.querySelector(DOTNET_CLASSNAMES.ERROR).textContent).toEqual('Number error message');
    });

    it('should validate a form based on the data-val number validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-number="Number error message"
                value="100"
                type="number">
            </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});