import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/lib/store.js';
import { broadcast } from '../../src/lib/utils.js';
import { EVENTS } from '../../src/lib/constants.js';
import defaults from '../../src/lib/defaults.js';


describe(`Modal > Utils > broadcast`, () => {

    it('should dispatch a custom event with a detail Object with a reference to Store.getState', async () => {
        const store = createStore();
        const state = {
            settings: defaults
        };
        store.update(state);
        const listener = mock.fn();
        document.addEventListener(EVENTS.OPEN, listener);
        document.addEventListener(EVENTS.OPEN, e => {
            assert.deepStrictEqual(e.detail, { getState: store.getState });
        });

        broadcast(EVENTS.OPEN, store)(state);
        assert.ok(listener.mock.callCount() > 0);
    });

});
