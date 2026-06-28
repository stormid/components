import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';

describe('Validate > Integration > Submit', () => {
    it('should call the submit function if validation passes', async () => {
        document.body.innerHTML = `<form method="post" action="">
            <input
                id="group1"
                name="group1"
                value="valid"
                required>
            <button type="submit">Submit</button>
        </form>`;

        const submit = mock.fn();
        const [ validator ] = validate(document.querySelector('form'), { submit });
        await validator.validate({ target: true, preventDefault(){} });
        assert.deepStrictEqual(validator.getState().settings.submit, submit);
        assert.ok(submit.mock.callCount() > 0);
    });
});