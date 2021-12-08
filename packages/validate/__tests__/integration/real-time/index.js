import validate from '../../../src';
import defaults from '../../../src/lib/defaults';
// import { DOTNET_CLASSNAMES } from '../../../src/lib/constants';


describe('Validate > Integration > Real-time', () => {

    it('should start real-time validation after first form submission', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <label for="group1">Group1</label>
            <input
                id="group1"
                name="group1"
                value=""
                required>
        </form>`;

        const form = document.querySelector('form');
        const [ validator ] = validate(form);
        await validator.validate();
        const validityState = await validator.validate();
        expect(validityState).toEqual(false);
        expect(validator.getState().realTimeValidation).toEqual(true);
    });

    it('should remove error message and not replace if field is valid', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <label for="group1">Group1</label>
            <input
                id="group1"
                name="group1"
                value=""
                required>
        </form>`;

        const form = document.querySelector('form');
        const label = document.querySelector('label');
        const input = document.querySelector('input');
        const cachedLabel = label.innerHTML;
        const [ validator ] = validate(form);
        await validator.validate();
        expect(label.innerHTML).not.toEqual(cachedLabel);
        input.value = 'Super';
        const event = new Event('input', { bubbles: false });
        input.dispatchEvent(event);
        expect(label.innerHTML).toEqual(cachedLabel);
    });

    
    it('should update error message based on real-time validation', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <label for="group1">Group1</label>
            <input
                type="email"
                id="group1"
                name="group1"
                required>
        </form>`;

        const form = document.querySelector('form');
        const label = document.querySelector('label');
        const input = document.querySelector('input');
        const [ validator ] = validate(form);
        await validator.validate();
        expect(label.lastElementChild.textContent).toEqual(defaults.messages.required());
        input.value = 'Super';
        const event = new Event('input', { bubbles: false });
        input.dispatchEvent(event);
        
        //have to game Jest to ensure that the error is rendered in time for the assertion
        const nextLabel = await new Promise((resolve, reject) => setTimeout(() => {
            resolve(label.lastElementChild.textContent);
        }, 16));

        expect(nextLabel).toEqual(defaults.messages.email());
    });

    it('should trigger real-time validation with appropriate event for the input type', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <label for="group1">Group1</label>
            <input
                type="checkbox"
                id="group1"
                name="group1"
                required>
        </form>`;

        const form = document.querySelector('form');
        const label = document.querySelector('label');
        const input = document.querySelector('input');
        const cachedLabel = label.innerHTML;
        const [ validator ] = validate(form);
        await validator.validate();
        expect(label.lastElementChild.textContent).toEqual(defaults.messages.required());
        input.checked = 'checked';
        const event = new Event('change', { bubbles: false });
        input.dispatchEvent(event);
        expect(label.innerHTML).toEqual(cachedLabel);
    });

    it('should run realtime validation after a new group is added post first validation', async () => {
        expect.assertions(3);
        document.body.innerHTML = `<form method="post" action="">
            <label for="group1">Group1</label>
            <input
                type="checkbox"
                id="group1"
                name="group1"
                required />
        </form>`;

        const form = document.querySelector('form');
        const label = document.querySelector('label');
        const [ validator ] = validate(form);
        await validator.validate();
        expect(label.lastElementChild.textContent).toEqual(defaults.messages.required());

        const newLabel = document.createElement('label');
        newLabel.textContent="Group2";
        newLabel.setAttribute('for', 'group2');
        form.appendChild(newLabel);

        const newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('id', 'group2');
        newInput.setAttribute('name', 'group2');
        newInput.required = true;
        form.appendChild(newInput);

        validator.addGroup([newInput]);
        await validator.validate();
        expect(newLabel.lastElementChild.textContent).toEqual(defaults.messages.required());

        newInput.value="Sample";
        const event = new Event('input', { bubbles: false });
        newInput.dispatchEvent(event);
        expect(newLabel.querySelector('span')).toBeNull();
    });
    
});