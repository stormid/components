import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';
import { submitForm } from '../../src/lib/validator/post-validation.js';
import { getSubmitterEntries } from '../../src/lib/dom/index.js';
import { DOTNET_CLASSNAMES, PREHOOK_DELAY } from '../../src/lib/constants/index.js';

const getHiddenEntries = form => Array.from(form.querySelectorAll('input[type="hidden"]')).map(node => [ node.name, node.value ]);

//a submit function that records the form as it was at the time of submission
const createSnapshotSubmit = form => {
    const snapshots = [];
    const submit = mock.fn(() => snapshots.push({
        action: form.getAttribute('action'),
        method: form.getAttribute('method'),
        enctype: form.getAttribute('enctype'),
        target: form.getAttribute('target'),
        entries: getHiddenEntries(form)
    }));
    return { submit, snapshots };
};

const submitEvent = (form, submitter) => ({ target: form, submitter, preventDefault: mock.fn() });

const throwError = message => () => {
    throw new Error(message);
};

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
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('button')));

        assert.strictEqual(snapshots[0].action, '/other');
        assert.deepStrictEqual(snapshots[0].entries, [ [ 'btn', 'v' ] ]);
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
        assert.strictEqual(form.getAttribute('action'), '/original');
    });

    it('should not leave hidden inputs behind across repeated submits', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="save">Save</button>
            <button type="submit" name="op" value="publish">Publish</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { submit: mock.fn() });

        await validator.validate(submitEvent(form, form.querySelector('[value="save"]')));
        await validator.validate(submitEvent(form, form.querySelector('[value="publish"]')));

        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
    });

    it('should pass the submit button to the submit function', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const button = form.querySelector('button');
        const submit = mock.fn();
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, button));

        //compared with ok rather than strictEqual, which hangs rendering the DOM node diff on failure
        assert.ok(submit.mock.calls[0].arguments[0] === button);
    });

    it('should pass the submit button to the preSubmitHook', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const button = form.querySelector('button');
        const preSubmitHook = mock.fn();
        const [ validator ] = validate(form, { submit: mock.fn(), preSubmitHook });

        await validator.validate(submitEvent(form, button));

        assert.ok(preSubmitHook.mock.calls[0].arguments[0] === button);
    });

    it('should submit natively via the HTMLFormElement prototype if there is no submit function', async t => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <input type="submit" name="submit" value="Send">
        </form>`;
        const form = document.querySelector('form');
        const nativeSubmit = t.mock.method(HTMLFormElement.prototype, 'submit', () => {});
        const [ validator ] = validate(form);

        await validator.validate(submitEvent(form, form.querySelector('[type="submit"]')));

        assert.strictEqual(nativeSubmit.mock.callCount(), 1);
        assert.ok(nativeSubmit.mock.calls[0].this === form);
    });

    it('should restore the form if the submit function throws', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="save" formaction="/save">Save</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { submit: () => { throw new Error('Submit failed'); } });

        assert.throws(() => submitForm({ getState: validator.getState }, form.querySelector('button')), /Submit failed/);
        assert.strictEqual(form.getAttribute('action'), '/original');
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
    });
});

describe('Validate > Unit > DOM > getSubmitterEntries', () => {
    it('should return the name and value of a named button', async () => {
        document.body.innerHTML = `<form>
            <button id="btn" type="submit" name="op" value="save">Save</button>
        </form>`;
        assert.deepStrictEqual(getSubmitterEntries(document.getElementById('btn')), [ [ 'op', 'save' ] ]);
    });

    it('should return an empty value for a named button with no value attribute', async () => {
        document.body.innerHTML = `<form>
            <button id="btn" type="submit" name="op">Save</button>
        </form>`;
        assert.deepStrictEqual(getSubmitterEntries(document.getElementById('btn')), [ [ 'op', '' ] ]);
    });

    it('should return nothing for an unnamed button', async () => {
        document.body.innerHTML = `<form>
            <input id="btn" type="submit" value="Save" />
        </form>`;
        assert.deepStrictEqual(getSubmitterEntries(document.getElementById('btn')), []);
    });

    it('should return zero coordinates, not the value, for a named image button', async () => {
        document.body.innerHTML = `<form>
            <input id="btn" type="image" name="pos" value="ignored" alt="Save" />
        </form>`;
        assert.deepStrictEqual(getSubmitterEntries(document.getElementById('btn')), [ [ 'pos.x', '0' ], [ 'pos.y', '0' ] ]);
    });

    it('should return unprefixed zero coordinates for an unnamed image button', async () => {
        document.body.innerHTML = `<form>
            <input id="btn" type="image" alt="Save" />
        </form>`;
        assert.deepStrictEqual(getSubmitterEntries(document.getElementById('btn')), [ [ 'x', '0' ], [ 'y', '0' ] ]);
    });
});

describe('Validate > Integration > Submit > Submit button', () => {
    it('should submit the name/value and formaction of the button that submitted the form, not other submit buttons', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="save" formaction="/save">Save</button>
            <button type="submit" name="op" value="publish" formaction="/publish">Publish</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('[value="save"]')));

        assert.strictEqual(snapshots[0].action, '/save');
        assert.deepStrictEqual(snapshots[0].entries, [ [ 'op', 'save' ] ]);
    });

    it('should keep the form action if the button that submitted the form has no formaction', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="next">Next</button>
            <button type="submit" name="op" value="back" formaction="/back">Back</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('[value="next"]')));

        assert.strictEqual(snapshots[0].action, '/original');
        assert.deepStrictEqual(snapshots[0].entries, [ [ 'op', 'next' ] ]);
    });

    it('should apply formmethod, formenctype and formtarget for the submit and restore the form after', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" formmethod="get" formenctype="multipart/form-data" formtarget="_blank">Preview</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('button')));

        assert.deepStrictEqual(snapshots[0], {
            action: '/original',
            method: 'get',
            enctype: 'multipart/form-data',
            target: '_blank',
            entries: []
        });
        assert.strictEqual(form.getAttribute('method'), 'post');
        assert.strictEqual(form.hasAttribute('enctype'), false);
        assert.strictEqual(form.hasAttribute('target'), false);
    });

    it('should apply an empty formaction, as the browser does, and restore the form action after', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" formaction="">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('button')));

        assert.strictEqual(snapshots[0].action, '');
        assert.strictEqual(form.getAttribute('action'), '/original');
    });

    it('should submit an empty value for a named button with no value attribute', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button name="op">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('button')));

        assert.deepStrictEqual(snapshots[0].entries, [ [ 'op', '' ] ]);
    });

    it('should submit zero coordinates for an image button', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <input type="image" name="pos" value="ignored" alt="Submit">
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, form.querySelector('[type="image"]')));

        assert.deepStrictEqual(snapshots[0].entries, [ [ 'pos.x', '0' ], [ 'pos.y', '0' ] ]);
    });

    it('should not change the form if the submit event has no submit button', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="save" formaction="/save">Save</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit });

        await validator.validate(submitEvent(form, null));

        assert.strictEqual(snapshots[0].action, '/original');
        assert.deepStrictEqual(snapshots[0].entries, []);
    });

    it('should apply each submit button after the preSubmitHook, so overlapping submissions do not interleave', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit" name="op" value="save" formaction="/save">Save</button>
            <button type="submit" name="op" value="publish" formaction="/publish">Publish</button>
        </form>`;
        const form = document.querySelector('form');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const [ validator ] = validate(form, { submit, preSubmitHook: () => {} });

        await Promise.all([
            validator.validate(submitEvent(form, form.querySelector('[value="save"]'))),
            validator.validate(submitEvent(form, form.querySelector('[value="publish"]')))
        ]);

        assert.deepStrictEqual(snapshots.map(({ action, entries }) => ({ action, entries })), [
            { action: '/save', entries: [ [ 'op', 'save' ] ] },
            { action: '/publish', entries: [ [ 'op', 'publish' ] ] }
        ]);
        assert.strictEqual(form.getAttribute('action'), '/original');
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
    });
});

describe('Validate > Integration > Submit > formnovalidate', () => {
    it('should not validate or prevent the native submission if the submit button has formnovalidate', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <label for="group1">Label</label>
            <input id="group1" name="group1" required>
            <button type="submit" name="op" value="draft" formnovalidate>Save draft</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form);
        const event = submitEvent(form, form.querySelector('button'));

        const result = await validator.validate(event);

        assert.strictEqual(result, true);
        assert.strictEqual(event.preventDefault.mock.callCount(), 0);
        assert.strictEqual(document.querySelectorAll(`.${DOTNET_CLASSNAMES.ERROR}`).length, 0);
        assert.strictEqual(form.querySelectorAll('input[type="hidden"]').length, 0);
    });

    it('should call the submit function, without validating or calling the preSubmitHook, if the submit button has formnovalidate', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <label for="group1">Label</label>
            <input id="group1" name="group1" required>
            <button type="submit" name="op" value="draft" formaction="/draft" formnovalidate>Save draft</button>
        </form>`;
        const form = document.querySelector('form');
        const button = form.querySelector('button');
        const { submit, snapshots } = createSnapshotSubmit(form);
        const preSubmitHook = mock.fn();
        const [ validator ] = validate(form, { submit, preSubmitHook });
        const event = submitEvent(form, button);

        const result = await validator.validate(event);

        assert.strictEqual(result, true);
        assert.strictEqual(event.preventDefault.mock.callCount(), 1);
        assert.ok(submit.mock.calls[0].arguments[0] === button);
        assert.strictEqual(snapshots[0].action, '/draft');
        assert.deepStrictEqual(snapshots[0].entries, [ [ 'op', 'draft' ] ]);
        assert.strictEqual(preSubmitHook.mock.callCount(), 0);
        assert.strictEqual(document.querySelectorAll(`.${DOTNET_CLASSNAMES.ERROR}`).length, 0);
    });

    it('should validate as normal when validate() is called via the API, even if the form has a formnovalidate button', async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" required>
            <button type="submit" formnovalidate>Save draft</button>
        </form>`;
        const [ validator ] = validate(document.querySelector('form'));

        const result = await validator.validate();

        assert.strictEqual(result, false);
    });
});

describe('Validate > Integration > Submit > Errors', () => {
    //an error that isn't propagated leaves validate() pending forever, so fail fast instead
    const timeout = 1000;

    it('should reject if the submit function throws', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { submit: throwError('Submit failed') });

        await assert.rejects(validator.validate(submitEvent(form, form.querySelector('button'))), /Submit failed/);
    });

    it('should reject if the submit function throws after the preSubmitHook', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { submit: throwError('Submit failed'), preSubmitHook: () => {} });

        await assert.rejects(validator.validate(submitEvent(form, form.querySelector('button'))), /Submit failed/);
    });

    it('should reject without submitting if the preSubmitHook throws', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const submit = mock.fn();
        const [ validator ] = validate(form, { submit, preSubmitHook: throwError('Hook failed') });

        await assert.rejects(validator.validate(submitEvent(form, form.querySelector('button'))), /Hook failed/);
        await new Promise(resolve => setTimeout(resolve, PREHOOK_DELAY * 2));

        assert.strictEqual(submit.mock.callCount(), 0);
    });

    it('should return a rejected promise, not throw, if the submit function throws for a formnovalidate submission', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" required>
            <button type="submit" formnovalidate>Save draft</button>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { submit: throwError('Submit failed') });

        let result;
        assert.doesNotThrow(() => {
            result = validator.validate(submitEvent(form, form.querySelector('button')));
        });
        await assert.rejects(result, /Submit failed/);
    });

    it('should reject if rendering the errors throws', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <label for="group1">Label</label>
            <input id="group1" name="group1" required>
        </form>`;
        const form = document.querySelector('form');
        const [ validator ] = validate(form, { messages: { required: throwError('Message failed') } });

        await assert.rejects(validator.validate(submitEvent(form, null)), /Message failed/);
    });

    it('should resolve once the form has been submitted after the preSubmitHook', { timeout }, async () => {
        document.body.innerHTML = `<form method="post" action="/original">
            <input id="group1" name="group1" value="valid" required>
            <button type="submit">Submit</button>
        </form>`;
        const form = document.querySelector('form');
        const submit = mock.fn();
        const [ validator ] = validate(form, { submit, preSubmitHook: () => {} });

        const result = await validator.validate(submitEvent(form, form.querySelector('button')));

        assert.strictEqual(result, true);
        assert.strictEqual(submit.mock.callCount(), 1);
    });
});
