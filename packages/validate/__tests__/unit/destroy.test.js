import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';

describe('Validate > Integration > destroy', () => {

    it('should expose a destroy method on each instance', () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');
        assert.strictEqual(typeof validator.destroy, 'function');
    });

    it('should stop intercepting submit after destroy()', () => {
        document.body.innerHTML = `<form class="form">
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');
        const form = document.querySelector('form');

        //before destroy the submit handler prevents the default (invalid form)
        const before = new Event('submit', { cancelable: true });
        form.dispatchEvent(before);
        assert.strictEqual(before.defaultPrevented, true);

        validator.destroy();

        const after = new Event('submit', { cancelable: true });
        form.dispatchEvent(after);
        assert.strictEqual(after.defaultPrevented, false);
    });

    it('should remove real-time listeners on destroy()', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');

        //failing validation renders an error and starts real-time validation
        await validator.validate();
        const input = document.getElementById('group1');
        assert.ok(document.getElementById('group1-error-message'), 'error should render after failed validation');

        validator.destroy();

        //if the real-time listener were still attached, this input event would clear the error
        input.value = 'now valid';
        input.dispatchEvent(new Event('input'));
        await Promise.resolve();

        assert.ok(document.getElementById('group1-error-message'), 'destroyed listener must not react to input');
    });

    it('should detach a removed group\'s real-time listeners', async () => {
        document.body.innerHTML = `<form class="form">
            <label for="group1">Label</label>
            <input id="group1" name="group1" data-val="true" data-val-required="Required" value="" />
        </form>`;
        const [ validator ] = validate('form');

        //failing validation starts real-time validation, which attaches the group's controller
        await validator.validate();
        const controller = validator.getState().groups.group1.controller;
        assert.ok(controller, 'group should have a controller after real-time init');
        assert.strictEqual(controller.signal.aborted, false);

        validator.removeGroup('group1');

        //removing the group aborts its controller, detaching its real-time listeners
        assert.strictEqual(controller.signal.aborted, true);
        assert.strictEqual(validator.getState().groups.group1, undefined);
    });
});
