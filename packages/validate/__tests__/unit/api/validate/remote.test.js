import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import xhrMockPkg from 'xhr-mock';
import validate from '../../../../src/index.js';
import { DOTNET_CLASSNAMES } from '../../../../src/lib/constants/index.js';

const xhrMock = xhrMockPkg.default;

describe('Validate > Integration > api > validate > remote', () => {

    beforeEach(() => {
        xhrMock.setup();
        globalThis.XMLHttpRequest = window.XMLHttpRequest;
    });

    afterEach(() => {
        xhrMock.teardown();
        globalThis.XMLHttpRequest = window.XMLHttpRequest;
    });

    it('should validate a form based on the HTML5 remote validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering an error message if the remote validation returns an error', async () => {
 
        xhrMock.post('/api/validate', {
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
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Remote error message');
    });

    it('should validate a form based on the HTML5 remote validator returning false, staring realTimeValidation, focusing on first invalid field, and rendering the error message if noe is returned from the remote validation API', async () => {
 
        xhrMock.post('/api/validate', {
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
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Error message from API');
    });
    
    it('should validate a form based on the HTML5 remote validator returning false, starting realTimeValidation, focusing on first invalid field, and rendering an error message if the remote validation returns an error via a GET request', async () => {
 
        xhrMock.get('/api/validate?group1=Failure&group2=Value%202', {
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
        assert.deepStrictEqual(validityState, false);
        assert.deepStrictEqual(validator.getState().realTimeValidation, true);
        assert.deepStrictEqual(document.activeElement, input);
        assert.deepStrictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, 'Remote error message');
    });

    it('should validate a form based on the data-val remote validator returning true if it passes remote validate', async () => {

        xhrMock.post('/api/validate', {
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
        assert.deepStrictEqual(validityState, true);
    });
      
});