import validate from '../../../../src';

describe('Validate > Integration > api > validate > bypass disabled fields', () => {

    it('should return true for disabled groups regardless of validation criteria and value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form class="form">
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group1-1"
                name="group1"
                value=""
                type="text"
                required
                disabled
            />

            
            <label id="group1-1-label" for="group1-1">group1</label>
            <input
                id="group2"
                name="group2"
                value="Test"
                type="text"
                required
            />
        </form>`;
        const [ validator ] = validate('form');
        const validityState = await validator.validate();
        expect(validityState).toEqual(true);
    });
});
