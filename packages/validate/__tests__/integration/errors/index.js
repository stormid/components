import validate from '../../../src';
import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';
import defaults from '../../../src/lib/defaults';

describe('Validate > Integration > errors', () => {

    it('Should render client-side error container as the last element in a label', async () => {
        expect.assertions(3);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
        </form>`;
        const label = document.getElementById('group1-1-label');
        const validator = validate('form')[0];
        await validator.validate();
        //render error message
        expect(label.lastChild.nodeName).toEqual('SPAN');
        expect(label.lastChild.className).toEqual(DOTNET_CLASSNAMES.ERROR);
        expect(label.lastChild.textContent).toEqual(defaults.messages.required());
    });

    it('Should render a text node error to a server-side error container', async () => {
        expect.assertions(3);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
            <span id="ssec" data-valmsg-for="group1" role="alert"></span>
        </form>`;
        const [ validator ] = validate('form');
        await validator.validate();
        const errorContainer = document.getElementById('ssec');
        //render error message
        expect(errorContainer.firstChild).toBeDefined();
        expect(errorContainer.classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(true);
        expect(errorContainer.firstChild.textContent).toEqual(defaults.messages.required());
    });

    it('Should clear a server-rendered error node before rendering a text node error to a server-side error container', async () => {
        expect.assertions(4);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
            <span id="ssec" data-valmsg-for="group1" role="alert">The server dislikes this value</span>
        </form>`;
        const [ validator ] = validate('form');
        expect(validator.getState().errors.group1).toEqual('The server dislikes this value');
        await validator.validate();
        const errorContainer = document.getElementById('ssec');
        //render error message
        expect(errorContainer.firstChild).toBeDefined();
        expect(errorContainer.classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(true);
        expect(errorContainer.firstChild.textContent).toEqual(defaults.messages.required());
    });

});