import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { normaliseValidators } from '../../../src/lib/validator/index.js';

describe('Validate > Integration > normalise-validators > equalto', () => {

    it('should return the correct validation model for data-val equalto', async () => {
        document.body.innerHTML = `<input
            id="Email"
            name="Email"
            value="example@stormid.com" />
            <input
            id="ConfirmEmail"
            name="ConfirmEmail"
            value="example@stormid.com" />
            <input data-val="true" 
                data-val-equalto="Equalto error message"
                data-val-equalto-other="Email,ConfirmEmail"
                id="DoubleConfirmEmail"
                name="DoubleConfirmEmail"
            value="" />`;
        const input = document.querySelector('#DoubleConfirmEmail');
        const firstTarget = document.querySelector('#Email');
        const secondTarget = document.querySelector('#ConfirmEmail');
        assert.deepStrictEqual(normaliseValidators(input), [
            {
                type: 'equalto',
                message: 'Equalto error message',
                params: {
                    other: [[firstTarget], [secondTarget]]
                }
            }
        ]);
    });

});