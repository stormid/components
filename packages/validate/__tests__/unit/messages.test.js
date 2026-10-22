import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';
import { normaliseValidators, reduceErrorMessages } from '../../src/lib/validator/index.js';
import { FALLBACK_ERROR_MESSAGE, DOTNET_CLASSNAMES } from '../../src/lib/constants/index.js';

describe('Validate > Unit > Messages > empty data-val messages', () => {

    it('should keep a validator with an empty data-val message, using the fallback message and warning', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-required=""
            type="text">`;
        console.warn = mock.fn();
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'required',
                message: FALLBACK_ERROR_MESSAGE
            }
        ]);
        assert.strictEqual(console.warn.mock.callCount(), 1);
    });

    it('should keep a validator with a whitespace data-val message, using the fallback message', async () => {
        document.body.innerHTML = `<input
			id="group1"
            name="group1"
            data-val="true"
            data-val-length="   "
            data-val-length-min="2"
            type="text">`;
        console.warn = mock.fn();
        const input = document.querySelector('#group1');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'length',
                message: FALLBACK_ERROR_MESSAGE,
                params: {
                    min: '2'
                }
            }
        ]);
        assert.strictEqual(console.warn.mock.callCount(), 1);
    });

    it('should render the fallback message for a failed validator with an empty data-val message', async () => {
        document.body.innerHTML = `<form class="form">
            <label id="group1-label" for="group1">group1</label>
            <input
                id="group1"
                name="group1"
                data-val="true"
                data-val-required=""
                value=""
                type="text">
            </form>`;
        console.warn = mock.fn();
        const [ validator ] = validate('form');
        assert.strictEqual(await validator.validate(), false);
        assert.strictEqual(document.querySelector(`.${DOTNET_CLASSNAMES.ERROR}`).textContent, FALLBACK_ERROR_MESSAGE);
    });
});

describe('Validate > Unit > Messages > addMethod', () => {

    for (const message of ['', '   ', 42]) {
        it(`should not add a validation method with an invalid message (${JSON.stringify(message)})`, async () => {
            document.body.innerHTML = `<form class="form">
                <input id="group1" name="group1" type="text">
            </form>`;
            console.warn = mock.fn();
            const [ validator ] = validate('form');
            validator.addMethod('group1', () => false, message);
            assert.deepStrictEqual(validator.getState().groups, {});
            assert.strictEqual(console.warn.mock.callCount(), 1);
        });
    }
});

describe('Validate > Unit > Messages > reduceErrorMessages', () => {
    const state = {
        groups: {
            group1: {
                validators: [{ type: 'remote', message: 'Validator message' }]
            }
        }
    };

    it('should use a non-empty message returned by the validation method', async () => {
        assert.deepStrictEqual([ 'Remote message' ].reduce(reduceErrorMessages('group1', state), []), [ 'Remote message' ]);
    });

    it('should use the validator message if the validation method returns false', async () => {
        assert.deepStrictEqual([ false ].reduce(reduceErrorMessages('group1', state), []), [ 'Validator message' ]);
    });

    it('should use the validator message if the validation method returns an empty or whitespace string', async () => {
        assert.deepStrictEqual([ '' ].reduce(reduceErrorMessages('group1', state), []), [ 'Validator message' ]);
        assert.deepStrictEqual([ '  ' ].reduce(reduceErrorMessages('group1', state), []), [ 'Validator message' ]);
    });

    it('should use the validator message if the validation method resolves a non-string', async () => {
        assert.deepStrictEqual([ new Error('Failed') ].reduce(reduceErrorMessages('group1', state), []), [ 'Validator message' ]);
    });

    it('should not add a message for a valid result', async () => {
        assert.deepStrictEqual([ true ].reduce(reduceErrorMessages('group1', state), []), []);
    });
});
