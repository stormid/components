import Validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import MESSAGES from '../../../../src/lib/constants/messages';

describe('Validate > Integration > api > validate > minlength', () => {
    
    it('should validate a form based on the HTML5 minlength validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
        <label id="group1-label" for="group1">group1</label>
        <input
			id="group1"
            name="group1"
            minlength="3"
            value="No"
			type="text">
        </form>`;   
        const input = document.getElementById('group1');
        const label = document.getElementById('group1-label');
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
        expect(label.lastChild.textContent).toEqual(MESSAGES.minlength({ min: 3 }));
    });

    it('should validate a form based on the data-val minlength validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-minlength="Minlength error message"
                data-val-minlength-min="3"
                value="No"
                type="text">
            </form>`;
            const input = document.getElementById('group1');
            const label = document.getElementById('group1-label');
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
            expect(label.lastChild.textContent).toEqual('Minlength error message');
    });

    it('should validate a form based on the HTML5 minlength validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                minlength="3"
                value="Fine"
                type="text">
            </form>`;
            const validator = Validate.init('form')[0];
            const validityState = await validator.validate();
            expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val minlength validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-minlength="Minlength error message"
                data-val-minlength-min="3"
                value="Fine"
                type="text">
            </form>`;
            const validator = Validate.init('form')[0];
            const validityState = await validator.validate();
            expect(validityState).toEqual(true);
    });

});