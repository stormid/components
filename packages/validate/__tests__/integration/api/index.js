import Validate from '../../../src';

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
        const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = Validate.init('form')[0];      

        expect(validator.getState().groups).toEqual({});
        input.setAttribute('required', 'required');
        validator.addGroup([input]);
        expect(validator.getState().groups).toEqual({
            group1: {
            serverErrorNode: false,
            validators: [{ type: 'required' }],
            fields: [input],
            valid: false
        }});

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
        const form = document.querySelector('.form');
        const input = document.querySelector('#group1-1');
        const validator = Validate.init('form')[0];      

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