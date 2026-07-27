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

    it('should call the update hook with the previous and the new state', () => {
        const seen = [];
        const hooked = createStore((previous, next) => seen.push([ previous, next ]));
        hooked.update({ open: true });
        hooked.update({ open: false });
        assert.deepStrictEqual(seen, [
            [ {}, { open: true } ],
            [ { open: true }, { open: false } ]
        ]);
    });

    it('should call the update hook after the effects, so it observes a settled state', () => {
        const order = [];
        const hooked = createStore(() => order.push('hook'));
        hooked.update({ open: true }, [ () => order.push('effect') ]);
        assert.deepStrictEqual(order, [ 'effect', 'hook' ]);
    });

    it('should call the update hook even when no effects are supplied', () => {
        let calls = 0;
        const hooked = createStore(() => calls++);
        hooked.update({ open: true });
        assert.strictEqual(calls, 1);
    });
});
