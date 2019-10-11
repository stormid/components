import Validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';

describe('Validate > Integration > api > validate > digits', () => {
    //return boolean validityState
    //start realtimevalidation
    //render errors
    //focus on first invalid field

    //return boolean validityState
    //submit form

    it('should validate a form based on the data-val digits validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(6);
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
        const label = document.getElementById('group1-1-label');
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // // render error message
        expect(label.lastChild.nodeName).toEqual('SPAN');
        expect(label.lastChild.className).toEqual(DOTNET_CLASSNAMES.ERROR);
        expect(label.lastChild.textContent).toEqual('Digits error message');
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
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});