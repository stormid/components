import mock from 'xhr-mock';
import validate from '../../../../../src';
import { DOTNET_CLASSNAMES } from '../../../../../src/lib/constants';

describe('Validate > Integration > api > validate > remote', () => {
    
    beforeEach(() => mock.setup());

    afterEach(() => mock.teardown());

    it('should validate a form based on the HTML5 remote validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the remote validation returns an error', async () => {
        expect.assertions(4);
 
        mock.post('/api/validate', {
            status: 201,
            body: 'Remote error message'
        });
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-remote="Remote error message"
                data-val-remote-type="post"
                data-val-remote-url="/api/validate"
                data-val-remote-additionalfields="group2"
                value="Failure"
                type="text">   
                <input
                id="group2"
                name="group2"
                value="Value 2"
                type="text">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // // render error message
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Remote error message');
    });

    it('should validate a form based on the HTML5 remote validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering the error message if noe is returned from the remote validation API', async () => {
        expect.assertions(4);
 
        mock.post('/api/validate', {
            status: 201,
            body: 'Error message from API'
        });
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-remote="Remote error message"
                data-val-remote-type="post"
                data-val-remote-url="/api/validate"
                value="Failure"
                type="text">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // render error message
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Error message from API');
    });
    
    it('should validate a form based on the HTML5 remote validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if the remote validation returns an error via a GET request', async () => {
        expect.assertions(4);
 
        mock.get('/api/validate?group1=Failure&group2=Value%202', {
            status: 201,
            body: 'false'
        });
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">Label</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-remote="Remote error message"
                data-val-remote-type="get"
                data-val-remote-url="/api/validate"
                data-val-remote-additionalfields="group2"
                value="Failure"
                type="text">   
                <input
                id="group2"
                name="group2"
                value="Value 2"
                type="text">
        </form>`;
        const input = document.getElementById('group1');
        const validator = validate('form')[0];
        
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        // realtimeValidation start
        expect(validator.getState().realTimeValidation).toEqual(true);
        // focus on first invalid node
        expect(document.activeElement).toEqual(input);
        // render error message
        expect(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent).toEqual('Remote error message');
    });

    it('should validate a form based on the data-val remote validator returning true if it passes remote validate', async () => {
        expect.assertions(1);

        mock.post('/api/validate', {
            status: 201,
            body: 'true'
        });
        document.body.innerHTML = `<form class="form">
        <label id="group1-label" for="group1">Label</label>
        <input
            id="group1"
            name="group1"
            data-val="true"
            data-val-remote="Remote error message"
            data-val-remote-type="post"
            data-val-remote-url="/api/validate"
            value="Pass"
            type="text"></form>`;
        const validator = validate('form')[0];
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });
      
});