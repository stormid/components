import { groupValueReducer } from '../src/lib/utils'

describe('Validate > Unit > Utils > groupValueReducer', () => {
    it('should return the String value given an input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('Test value');
    });
    it('should return an empty String given an input without a value and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input name="field" id="field" value="" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
    it('should return an Array containing a String value given a checkable input with a value', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual(['Test value']);
    });
    it('should return an Array containing a String value given a checkable input with a value and an initial Array', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" checked />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer([], field)).toEqual(['Test value']);
    });
    it('should return an empty String given a checkable input that is not checked and an initial empty string', async () => {
        expect.assertions(1);
        document.body.innerHTML = `<form>
            <input type="checkbox" name="field" id="field" value="Test value" />
        </form>`;
        const field = document.querySelector('#field');
        expect(groupValueReducer('', field)).toEqual('');
    });
});