import {
    createButtonValueNode,
    addAXAttributes
} from '../../../../src/lib/dom';





//addAXAttributes
describe('Validate > Unit > DOM > addAXAttributes', () => {

    it('should add attribute to the input and server-rendered error container to improve accessibility', async () => {
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

    it('should not add aria-required attribute to radio inputs', async () => {
        // expect.assertions(3);
        document.body.innerHTML = `<form>
            <label for="group1">Text (required, min 2 characters, max 8 characters)</label>
            <input type="radio" id="group1" name="group1" data-val="true" data-val-required="This field is required">
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
        expect(field.hasAttribute('aria-required')).toEqual(false);
    });


    it('should not add aria-required attribute to multiple checkboxes', async () => {
        document.body.innerHTML = `<form>
            <label for="checkbox1">Label</label>
            <input type="radio" id="checkbox1" name="checkbox" data-val="true" data-val-required="This field is required">
            <label for="checkbox2">Label</label>
            <input type="radio" id="checkbox2" name="checkbox" data-val="true" data-val-required="This field is required">
            <label for="checkbox3">Label)</label>
            <input type="radio" id="checkbox3" name="checkbox" data-val="true" data-val-required="This field is required">
            <span data-valmsg-for="checkbox" data-valmsg-replace="true"></span>
        </form>`;
        const fields = Array.from(document.querySelectorAll('checkbox'));
        const errorContainer = document.querySelector('[data-valmsg-for="group1"]');
        const state = {
            groups: {
                checkbox: {
                    serverErrorNode: errorContainer,
                    fields
                }
            }
        };
        addAXAttributes(state);
        fields.forEach(field => expect(field.hasAttribute('aria-required')).toEqual(false));
        
    });


    //single checkbox
    it('should add aria-required attribute to a single checkbox inputs', async () => {
        // expect.assertions(3);
        document.body.innerHTML = `<form>
            <label for="group1">Text</label>
            <input type="checkbox" id="group1" name="group1" data-val="true" data-val-required="This field is required">
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
        expect(field.getAttribute('aria-required')).toEqual('true');
    });

});