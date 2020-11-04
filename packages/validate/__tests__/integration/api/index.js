import validate from '../../../src';
import { GROUP_ATTRIBUTE } from '../../../src/lib/constants';

describe('Validate > Integration > API > addGroup', () => {

    it('should add a validation group', async () => {
        // expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = validate('form')[0];

        expect(validator.getState().groups).toEqual({});
        input.setAttribute('required', 'required');
        validator.addGroup([input]);
        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });

    });

    it('should return leave state unchanged if it cannot add the validation group', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text" />
        </form>`;
        const input = document.querySelector('#group1-1');
        const [ validator ] = validate('form');
        console.warn = jest.fn();

        expect(validator.getState().groups).toEqual({});
        validator.addGroup([input]);
        expect(validator.getState().groups).toEqual({});
        expect(console.warn).toHaveBeenCalled();
    });


});

describe('Validate > Integration > API > removeGroup', () => {

    it('should remove a validation group', async () => {
        // expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                required
                value=""
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = validate('form')[0];

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        input.removeAttribute('required');
        validator.removeGroup('group1');
        expect(validator.getState().groups).toEqual({});

    });

});

describe('Validate > Integration > API > addMethod', () => {

    it('should add a validation method to a group', async () => {
        // expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = validate('form')[0];

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        const method = () => false;
        const message = 'Custom error';
        validator.addMethod('group1', method, message);

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }, { type: 'custom', method, message }],
                fields: [input],
                valid: false
            }
        });
    });

    it('should not add a validation method if parameters are missing', async () => {
        // expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                required
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = validate('form')[0];
        console.warn = jest.fn();

        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        const method = () => false;
        const message = 'Custom error';

        validator.addMethod(undefined, method, message);
        expect(validator.getState().groups).toEqual({
            group1: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        expect(console.warn).toHaveBeenCalled();

    });

    it('should not add a validation method if fields cannot be found', async () => {
        // expect.assertions(6);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                data-val-${GROUP_ATTRIBUTE}="groupX"
                value=""
                required
                type="text" />
        </form>`;
        // const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = validate('form')[0];

        expect(validator.getState().groups).toEqual({
            groupX: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });
        const method = () => false;
        const message = 'Custom error';

        validator.addMethod('neither-name-or-group-name', method, message);
        expect(validator.getState().groups).toEqual({
            groupX: {
                serverErrorNode: false,
                validators: [{ type: 'required' }],
                fields: [input],
                valid: false
            }
        });

    });

});