import Validate from '../../../src';

describe('Validate > Integration > Submit', () => {

    it('should call the submit function if validation passes', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <input
                id="group1"
                name="group1"
                value="valid"
                required>
            <button type="submit">Submit</button>
        </form>`;

        const form = document.querySelector('form');
        const button = document.querySelector('button');
        const submit = jest.fn();
        const [ validator ] = Validate.init(document.querySelector('form'), { submit });
        await validator.validate({ target: true, preventDefault(){} })
        // button.click();
		expect(validator.getState().settings.submit).toEqual(submit);
		expect(submit).toBeCalled();

    });

});

describe('Validate > Integration > preSubmitHook', () => {

    it('should call the submit function if validation passes', async () => {
        expect.assertions(2);
        document.body.innerHTML = `<form method="post" action="">
            <input
                id="group1"
                name="group1"
                value="valid"
                required>
            <button type="submit">Submit</button>
        </form>`;

        const form = document.querySelector('form');
        const button = document.querySelector('button');
        const preSubmitHook = jest.fn();
        const [ validator ] = Validate.init(document.querySelector('form'), { preSubmitHook });

        await validator.validate({ target: true, preventDefault(){} })
		expect(validator.getState().settings.preSubmitHook).toEqual(preSubmitHook);
		expect(preSubmitHook).toBeCalled();

    });

});