import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/lib/store.js';

describe('Autocomplete > Store', () => {

    const Store = createStore();
    let effect = false;
    const sideEffect = () => {
        effect = !effect;
    };

    it('createStore should return an object with getState and update', () => {
        assert.notStrictEqual(Store, null);
        assert.strictEqual(typeof Store.getState, 'function');
        assert.strictEqual(typeof Store.update, 'function');
    });

    it('should have a getState function that returns the initial private state object', () => {
        assert.deepStrictEqual(Store.getState(), {});
    });

    it('should have an update function that replaces state', () => {
        const nextState = { open: true };
        Store.update(nextState);
        assert.deepStrictEqual(Store.getState(), nextState);
    });

    it('should leave state untouched when update is called without a next state', () => {
        const fresh = createStore();
        fresh.update();
        assert.deepStrictEqual(fresh.getState(), {});
    });

    it('should run each effect after the state change, passing the new state', () => {
        let received = null;
        Store.update({ open: false }, [sideEffect, state => { received = state; }]);
        assert.strictEqual(effect, true);
        assert.deepStrictEqual(received, { open: false });
    });
});
