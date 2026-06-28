import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { broadcast } from '../../src/lib/dom.js';
import { createStore } from '../../src/lib/store.js';
import defaults from '../../src/lib/defaults.js';
import { EVENTS } from '../../src/lib/constants.js';

describe('Toggle > broadcast', () => {

    it('should dispatch a bubbling custom event with a detail Object with a reference to Store.getState', () => {
        document.body.innerHTML = `<div id="target"></div>`;
        const Store = createStore();
        const node = document.getElementById('target');
        const openState = {
            node,
            isOpen: true,
            settings: defaults
        };
        Store.update(openState);
        const listener = mock.fn();
        const delegatedlistener = mock.fn();
        node.addEventListener(EVENTS.OPEN, listener);
        document.addEventListener(EVENTS.OPEN, delegatedlistener);
        node.addEventListener(EVENTS.OPEN, e => {
            assert.deepStrictEqual(e.detail, { getState: Store.getState });
        });

        broadcast(Store)(openState);
        assert.ok(listener.mock.callCount() > 0);
        assert.ok(delegatedlistener.mock.callCount() > 0);
    });

});
