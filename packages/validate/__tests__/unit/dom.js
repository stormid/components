import { 
    h,
    createErrorTextNode,
    focusFirstInvalidField,
    createButtonValueNode
} from '../../src/lib/dom';
import { DOTNET_CLASSNAMES } from '../../src/lib/constants';

describe('Validate > Unit > DOM > h', () => {
  	it('should return a DOM node for given vNode arguments', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<div class="test">Lorem ipsum</div>`;
        expect(h('div', { class: 'test' }, 'Lorem ipsum')).toEqual(document.body.firstElementChild);
    });
})

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
        const mockGroup = { serverErrorNode }
        const errorMessage = 'This field is required';
        createErrorTextNode(mockGroup, errorMessage);
        expect(serverErrorNode.textContent).toEqual('This field is required');
        expect(document.querySelector('[data-valmsg-for="group1"]').classList.contains(DOTNET_CLASSNAMES.ERROR)).toEqual(true);
    });
});


/**
 * To do: rationalise error rendering and clean-up
 */

//clearError
// describe('Validate > Unit > DOM > clearError', () => {
// });
//clearError
// describe('Validate > Unit > DOM > clearErrors', () => {
// });
//renderErrors
// describe('Validate > Unit > DOM > renderErrors', () => {
// });
//renderError
// describe('Validate > Unit > DOM > renderError', () => {
// });

//focusFirstInvalidField
describe('Validate > Unit > DOM > focusFirstInvalidField', () => {
    it('should focus on the first invalid field in a form post-vaidation', async () => {
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