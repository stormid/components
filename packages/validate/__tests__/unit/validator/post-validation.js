import Validate from '../../../src/';

//isSubmitButton
describe('Validate > Unit > postValidation', () => {

    it('should add name/value to the form data if the submit button clicked has a name and value', async () => {
        document.body.innerHTML  = `<form action="/test">
            <label for="tautology">Label</label>
            <input value="value" name="tautology" id="tautology" required>
            <button class="submit-btn">Submit</button>
            <button class="continue-btn" name="continue" value="1">Submit and continue</button>
        </form>`;
        const form = document.querySelector('form'); 
        const mockSubmit = jest.fn(() => {
            const data = new FormData(form);
            let body = {};
            for(let kv of data.entries()) {
                body[kv[0]] = kv[1];
            }
            expect(body).toEqual({ tautology: 'value', continue: '1' });
        });
        const [ validator ] = Validate.init(document.querySelector('form'), { submit: mockSubmit });
        const submitBtn = document.querySelector('.submit-btn');
        const continueBtn = document.querySelector('.continue-btn');
        continueBtn.focus();
        await validator.validate({ 
            target: form,
            preventDefault(){}
        });
        expect(mockSubmit).toBeCalled();
    });

    it('should mutate the action attribute of the form if the submit button clicked has a formaction', async () => {
        document.body.innerHTML  = `<form action="/default">
            <label for="tautology">Label</label>
            <input value="value" name="tautology" id="tautology" required>
            <button class="submit-btn">Submit</button>
            <button class="alt-btn" formaction="/alternative">Alternative handler</button>
        </form>`;
        const form = document.querySelector('form'); 
        const mockSubmit = jest.fn(() => {
            expect(form.getAttribute('action')).toEqual('/alternative');
        });
        const [ validator ] = Validate.init(document.querySelector('form'), { submit: mockSubmit });
        const submitBtn = document.querySelector('.submit-btn');
        const altBtn = document.querySelector('.alt-btn');
        altBtn.focus();
        await validator.validate({ 
            target: form,
            preventDefault(){}
        });
        expect(mockSubmit).toBeCalled();
        expect(form.getAttribute('action')).toEqual('/default');
    });

    it('should call the presubmit hook pre-submit', async () => {
        document.body.innerHTML  = `<form action="/default">
            <label for="tautology">Label</label>
            <input value="value" name="tautology" id="tautology" required>
            <button class="submit-btn">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const mockSubmit = jest.fn();
        const mockPreSubmit = jest.fn();
        const [ validator ] = Validate.init(document.querySelector('form'), {
            preSubmitHook: mockPreSubmit
        });
        await validator.validate({ 
            target: form,
            preventDefault(){}
        });
        expect(mockPreSubmit).toBeCalled();
    });

});