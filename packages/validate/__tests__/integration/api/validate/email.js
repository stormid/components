import Validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import MESSAGES from '../../../../src/lib/constants/messages';

describe('Validate > Integration >  api > validate > email', () => {
    //return boolean validityState
    //start realtimevalidation
    //render errors
    //focus on first invalid field

    //return boolean validityState
    //submit form

    it('should validate a form based on the HTML5 email validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="not.an.email.address"
                type="email" />
        </form>`;
        const input = document.getElementById('group1');
        const label = document.getElementById('group1-label');
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(false);
        // //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // //focus on first invalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(label.lastChild.nodeName).toEqual('SPAN');
        expect(label.lastChild.className).toEqual(DOTNET_CLASSNAMES.ERROR);
        expect(label.lastChild.textContent).toEqual(MESSAGES.email());
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
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val email validator returning false, staring realTimeValidation, ', async () => {
        expect.assertions(6);
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
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        //validityState
        expect(validityState).toEqual(false);
        //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        //focus on firstinvalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(input.nextElementSibling.nodeName).toEqual('SPAN');
        expect(input.nextElementSibling.className).toEqual(DOTNET_CLASSNAMES.ERROR);
        expect(input.nextElementSibling.textContent).toEqual('Email error message');
        
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
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(true);
    });
});
