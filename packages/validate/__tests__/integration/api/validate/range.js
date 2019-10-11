import Validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';

describe('Validate > Integration >  api > validate > equalto', () => {
    
    it('should validate a form based on the data-val range validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the value is out of range', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                data-val-range-max="8"
                value="9"
                type="text">
        </form>`;
        const input = document.querySelector('#group1')
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
        expect(label.lastChild.textContent).toEqual('Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value > min with no max', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                value="5"
                type="text">
        </form>`;
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val range validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the value <= min with no max', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="8"
                value="7"
                type="text">
        </form>`;
        const input = document.querySelector('#group1')
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
        expect(label.lastChild.textContent).toEqual('Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value <= max with no min', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-max="2"
                value="2"
                type="text">
        </form>`;
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val range validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the value > max with no min', async () => {
        expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-max="8"
                value="9"
                type="text">
        </form>`;
        const input = document.querySelector('#group1')
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
        expect(label.lastChild.textContent).toEqual('Range error message');
    });

    it('should validate a form based on the data-val range validator returning true if value is in range', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">DoubleConfirmEmail</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-range="Range error message"
                data-val-range-min="2"
                data-val-range-max="8"
                value="7"
                type="text">
        </form>`;
        const validator = Validate.init('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });

});