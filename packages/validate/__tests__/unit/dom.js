import { 
    h,
    createErrorTextNode
} from '../../src/lib/dom';
import { DOTNET_CLASSNAMES } from '../../src/lib/constants';

// const init = () => {
//     document.body.innerHTML = ``;
// };

// beforeAll(init);

describe('Validate > Unit > DOM > h', () => {
  	it('should return a DOM node for given vNode arguments', async () => {
        document.body.innerHTML = `<div class="test">Lorem ipsum</div>`;
        expect(h('div', { class: 'test' }, 'Lorem ipsum')).toEqual(document.body.firstElementChild);
    });
})



//createErrorTextNode
describe('Validate > Unit > DOM > createErrorTextNode', () => {

  	it('should append a child text node to a group serverErrorNode for a given invalid group', async () => {
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

//clearError
describe('Validate > Unit > DOM > clearError', () => {
});

//clearErrors
describe('Validate > Unit > DOM > clearErrors', () => {
});

//renderErrors
describe('Validate > Unit > DOM > renderErrors', () => {
});

//renderError
describe('Validate > Unit > DOM > renderError', () => {
});

//focusFirstInvalidField
describe('Validate > Unit > DOM > focusFirstInvalidField', () => {});

//createButtonValueNode
describe('Validate > Unit > DOM > createButtonValueNode', () => {});
