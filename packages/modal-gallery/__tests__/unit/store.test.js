import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/lib/store.js';

describe(`Modal Gallery > Store`, () => {

    const Store = createStore();
    let effect = false;
    const sideEffect = state => {
        effect = !effect;
    };

    it('createStore should return an Object with an API', async () => {
        assert.notStrictEqual(Store, null);
        assert.notStrictEqual(Store.getState, null);
        assert.notStrictEqual(Store.update, null);
    });

    it('should have a getState function that returns a private state Object', async () => {
        assert.strictEqual(Store.state, undefined);
        assert.deepStrictEqual(Store.getState(), {});
    });

    it('should have a update function that updates state', async () => {
        const nextState = { isOpen: true };
        Store.update(nextState);
        assert.deepStrictEqual(Store.getState(), nextState);
    });

    it('should have a update function that does not update state if nextState is not passed', async () => {
        const Store = createStore();
        Store.update();
        assert.deepStrictEqual(Store.getState(), {});
    });

    it('should have a update function that invokes any side effect functions passed after the state change, with new state as only argument', async () => {
        Store.update({}, [sideEffect]);
        assert.deepStrictEqual(effect, true);
    });


});
