import validate from '../../../src';
import { DOTNET_CLASSNAMES, AX_ATTRIBUTES } from '../../../src/lib/constants';
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
        expect.assertions(5);
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

        expect(validator.getState().errors.group1.nodeType).toEqual(Node.TEXT_NODE);
        expect(validator.getState().errors.group1.textContent).toEqual('The server dislikes this value');
        await validator.validate();
        const errorContainer = document.getElementById('ssec');
        //render error message
        expect(errorContainer.firstChild).toBeDefined();
        expect(errorContainer.classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(true);
        expect(errorContainer.firstChild.textContent).toEqual(defaults.messages.required());
    });

});

describe('Validate > Integration > errors > error summary', () => {

    it('Should render an error summary if config setting, and an error if one is present in state on initialisation', () => {
        document.body.innerHTML = `<form id="form" class="form" method="post" action="">
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
                <span class="error-message" data-valmsg-for="group1">This field is required</span>
            </div>
            <div>
                <label id="test-label" for="group2">Text</label>
                <input id="group2" name="group2" value="Has a value" data-val="true" data-val-required="This field is required">
            </div>
        </form>`;
        
        const [ validator ] = validate('form', { useSummary: true });
        const state = validator.getState();
        expect(document.querySelector(`[${AX_ATTRIBUTES.ERROR_SUMMARY}]`)).toBeDefined();
        expect(state.groups.group1.valid).toEqual(false);
        expect(state.groups.group1.errorMessages).toEqual(['This field is required']);
        // window.setTimeout(() => {
        //     expect(document.querySelector(`[${AX_ATTRIBUTES.ERROR_MESSAGE}=group1]`)).toEqual(state.groups.group1.errorMessages[0]);
        // }, 300);
    });

    it('Should render server-side errors to the error summary', () => {
        document.body.innerHTML = `<form id="form" class="form" method="post" action="">
            <div ${AX_ATTRIBUTES.ERROR_SUMMARY}></div>
            <div>
                <label id="test-label" for="group1">Text</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
                <span class="error-message" data-valmsg-for="group1">This field is required</span>
            </div>
            <div>
                <label id="test-label" for="group2">Text</label>
                <input id="group2" name="group2" value="Has a value" data-val="true" data-val-required="This field is required">
            </div>
        </form>`;
        
        const [ validator ] = validate('form');
        const state = validator.getState();
        expect(document.querySelector(`[${AX_ATTRIBUTES.ERROR_SUMMARY}]`)).toBeDefined();
        expect(state.groups.group1.valid).toEqual(false);
        expect(state.groups.group1.errorMessages).toEqual(['This field is required']);
        expect(document.querySelector(`[${AX_ATTRIBUTES.ERROR_MESSAGE}=group1]`).textContent).toEqual(state.groups.group1.errorMessages[0]);

    });

});