import validate from '../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants';
import defaults from '../../../../src/lib/defaults';

describe('Validate > Integration >  api > validate > url', () => {
    //html5 spec regex approximation:
    ///^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?

    it('should validate a form based on the HTML5 url validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="not.a.url.com"
                type="url" />
        </form>`;
        const input = document.getElementById('group1');
        const label = document.getElementById('group1-label');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(false);
        // //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // //focus on first invalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(document.querySelector(DOTNET_CLASSNAMES.ERROR).textContent).toEqual(defaults.messages.url());
    });

    it('should validate a form based on the HTML5 url validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                value="https://a.url.com"
                type="url" />
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        // //validityState
        expect(validityState).toEqual(true);
    });

    it('should validate a form based on the data-val email validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if a field is invalid', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-url="Url error message"
                value="not.a.url"
                type="url">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const input = document.getElementById('group2');
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        //validityState
        expect(validityState).toEqual(false);
        //realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        //focus on firstinvalid node
        expect(document.activeElement).toEqual(input);
        //render error message
        expect(document.querySelector(DOTNET_CLASSNAMES.ERROR).textContent).toEqual('Url error message');
        
    });


    it('should validate a form based on the data-val url validator returning true if valid', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label for="group2">group1</label>
            <input
                id="group2"
                name="group2"
                data-val="true"
                data-val-url="Url error message"
                value="https://a.url.com"
                type="url">
                <span data-valmsg-for="group2" data-valmsg-replace="true" class="${DOTNET_CLASSNAMES.ERROR}"></span>
        </form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        //validityState
        expect(validityState).toEqual(true);
        
    });


});