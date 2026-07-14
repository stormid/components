import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import validate from '../../../../src/index.js';

describe('Validate > Integration > api > validate > bypass disabled fields', () => {

    it('should return true for disabled groups regardless of validation criteria and value', async () => {
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
        assert.deepStrictEqual(validityState, true);
    });
});
