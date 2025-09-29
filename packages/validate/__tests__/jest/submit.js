import validate from '../../src';

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

        const submit = jest.fn();
        const [ validator ] = validate(document.querySelector('form'), { submit });
        await validator.validate({ target: true, preventDefault(){} });
        expect(validator.getState().settings.submit).toEqual(submit);
        expect(submit).toBeCalled();
    });
});