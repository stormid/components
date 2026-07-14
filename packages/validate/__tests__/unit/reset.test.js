import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../src/index.js';

describe('Validate  > Reset', () => {

    it('should clear errors messages from state and DOM, remove error classNames and attributes, remove errors from state', async () => {
        document.body.innerHTML = `<form class="form" method="post" action="">
            <div>
                <label for="group1">Label</label>
                <input id="group1" name="group1" data-val="true" data-val-required="This field is required" />
            </div>
            <div>
                <label for="group2">Label</label>
                <input id="group2" name="group2" data-val="true" data-val-required="This field is required" />
            </div>
        </form>`;
       
        const [ validator ] = validate('.form');
        await validator.validate();
        assert.deepStrictEqual(validator.getState().groups.group1.valid, false);
        assert.deepStrictEqual(validator.getState().groups.group2.valid, false);

        validator.getState().form.dispatchEvent(new Event('reset'));
        assert.deepStrictEqual(validator.getState().groups.group1.valid, true);
        assert.deepStrictEqual(validator.getState().groups.group2.valid, true);
        assert.deepStrictEqual(validator.getState().groups.group1.errorMessages, []);
        assert.deepStrictEqual(validator.getState().groups.group2.errorMessages, []);
        assert.strictEqual(validator.getState().errors.group1, undefined);
        assert.strictEqual(validator.getState().errors.group2, undefined);
    });
});
