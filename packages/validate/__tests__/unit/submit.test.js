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

    it('should not leak a hidden input or mutate form.action when validate() is called via the API (no event)', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="btn" value="v" formaction="/other">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form);

        const result = await validator.validate();

        assert.strictEqual(result, true);
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
        assert.strictEqual(form.getAttribute('action'), '/original');
    });

    it('should clean up the hidden input and restore form.action after a real submit', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="btn" value="v" formaction="/other">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const submit = mock.fn();
        const [ validator ] = validate(form, { submit });

        await validator.validate({ target: form, preventDefault(){} });

        assert.ok(submit.mock.callCount() > 0);
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
        assert.strictEqual(form.getAttribute('action'), '/original');
    });
});