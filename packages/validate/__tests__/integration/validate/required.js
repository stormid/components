import Validate from '../../../src';
import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';
import MESSAGES from '../../../src/lib/constants/messages';

describe('Validate > Integration > validate > required', () => {

    //return boolean validityState
    //start realtimevalidation
    //render errors
    //focus on first invalid field

    //return boolean validityState
    //submit form

    it('should validate a form based on the HTML5 required validator', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text">
        </form>`;
        const input = document.getElementById('group1-1');
        const validator = await Validate.init('form')[0];
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
        expect(input.nextElementSibling.textContent).toEqual(MESSAGES.required());
    });

    it('should validate a form based on the data-val required validator', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <input
                id="group1-1"
                name="group1"
                data-val="true"
                data-val-required="Required error message"
                value=""
                type="text">
                <!--<span data-valmsg-for="group1-1" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>-->
        </form>`;
        const input = document.getElementById('group1-1');
        const validator = await Validate.init('form')[0];
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
        expect(input.nextElementSibling.textContent).toEqual('Required error message');

        //to do -> server-rendered error container
        // expect(input.nextElementSibling.textContent).toEqual('Required error message');
        
    });
});
