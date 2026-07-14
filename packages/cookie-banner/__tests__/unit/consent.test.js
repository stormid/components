import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyEffects } from '../../src/lib/consent.js';

describe(`Cookie banner > consent > callback`, () => {
    document.body.innerHTML = `<main><div class="privacy-banner__form-container"></div><p id="test"><p><p id="test2"></p></main>`;

    it('Callback functions should run based on consent data', async () => {
        const types = {
            test: {
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: [
                    () => { document.getElementById('test').textContent = "Consent given"}
                ]
            },
            test2: {
                title: 'Test title',
                description: 'Test description',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: [
                    () => { document.getElementById('test2').textContent = "Consent given"}
                ]
            }
        };

        const state = { settings: { types }, consent: { test: 1, test2: 0 }};
        applyEffects(state);
        assert.deepStrictEqual(document.getElementById('test').textContent, "Consent given");
        assert.deepStrictEqual(document.getElementById('test2').textContent, "");

    });

});
