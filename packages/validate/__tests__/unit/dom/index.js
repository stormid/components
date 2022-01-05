import {
    h,
    createErrorTextNode,
    focusFirstInvalidField,
    createButtonValueNode,
    addAXAttributes
} from '../../../src/lib/dom';
import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';

describe('Validate > Unit > DOM > h', () => {
    

    it('should return a DOM node for given vNode arguments', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<div class="test"></div>`;
        expect(h('div', { class: 'test' })).toEqual(document.body.firstElementChild);
    });

    it('should return a DOM node for given vNode arguments with text nodes', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<div class="test">Lorem ipsum</div>`;
        expect(h('div', { class: 'test' }, 'Lorem ipsum')).toEqual(document.body.firstElementChild);
    });

});

//createErrorTextNode
describe('Validate > Unit > DOM > createErrorTextNode', () => {

    it('should append a child text node to a group serverErrorNode for a given invalid group', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1-1">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group1-1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="This field is required" data-val-length-min="2" data-val-length-max="8" type="text">
            <span class="text-danger field-validation-valid" data-valmsg-for="group1" data-valmsg-replace="true"></span>
        </form>`;
        const serverErrorNode = document.querySelector('[data-valmsg-for="group1"]');
        const mockGroup = { serverErrorNode };
        const errorMessage = 'This field is required';
        createErrorTextNode(mockGroup, errorMessage);
        expect(serverErrorNode.textContent).toEqual('This field is required');
        expect(document.querySelector('[data-valmsg-for="group1"]').classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(true);
    });
    
});

//focusFirstInvalidField
describe('Validate > Unit > DOM > focusFirstInvalidField', () => {
    it('should focus on the first invalid field in a form post-validation', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form" method="post" action="">
            <label for="group1">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group1" name="group1" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="This field is required" data-val-length-min="2" data-val-length-max="8" type="text">
            <span class="text-danger field-validation-valid" data-valmsg-for="group1" data-valmsg-replace="true"></span>
            <label for="group2">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group2" name="group2" data-val="true" data-val-length="Please enter between 2 and 8 characters" data-val-required="This field is required" data-val-length-min="2" data-val-length-max="8" type="text">
            <span class="text-danger field-validation-valid" data-valmsg-for="group2" data-valmsg-replace="true"></span>
        </form>`;
        const field = document.querySelector('#group2');
        const mockState = {
            groups: {
                group1: {
                    valid: true,
                    fields: []
                },
                group2: {
                    valid: false,
                    fields: [field]
                }
            }
        };
        focusFirstInvalidField(mockState);
        expect(document.activeElement).toEqual(field);
    });
});

//createButtonValueNode
describe('Validate > Unit > DOM > createButtonValueNode', () => {
    it('should a hidden field duplicate of a given field, for conferring submit button values', async () => {
        expect.assertions(3);
        document.body.innerHTML = `<form class="form" method="post" action="">
            <button name="continue" value="1">Continue</button>
        </form>`;
        const node = document.getElementsByName('continue')[0];
        const form = document.querySelector('.form');
        createButtonValueNode(node, form);
        const lastElement = form.lastElementChild;
        expect(lastElement.tagName).toEqual('INPUT');
        expect(lastElement.getAttribute('name')).toEqual('continue');
        expect(lastElement.getAttribute('value')).toEqual('1');
    });
});


//addAXAttributes
describe('Validate > Unit > DOM > addAXAttributes', () => {
    it('should add attriubute to the input and server-rendered error container to improve accessibility', async () => {
        // expect.assertions(3);
        document.body.innerHTML = `<form>
            <label for="group1">Text (required, min 2 characters, max 8 characters)</label>
            <input id="group1" name="group1" data-val="true" data-val-required="This field is required">
            <span data-valmsg-for="group1" data-valmsg-replace="true"></span>
        </form>`;
        const field = document.getElementById('group1');
        const errorContainer = document.querySelector('[data-valmsg-for="group1"]');
        const state = {
            groups: {
                group1: {
                    serverErrorNode: errorContainer,
                    fields: [field]
                }
            }
        };
        addAXAttributes(state);
        //ensure error message has an id for aria-describedby
        expect(errorContainer.getAttribute('id')).toEqual(`group1-error-message`);
        //add aria-required=true to required and data-val-required fields
        expect(field.getAttribute('aria-required')).toEqual(`true`);
    });
});