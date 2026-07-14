import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../src/lib/store/index.js';
import { ACTIONS } from '../../src/lib/constants/index.js';
import reducers from '../../src/lib/reducers/index.js';
let Store;
before(() => {
    Store = createStore();
});

describe('Validate > Unit > Store > createStore', () => {
    it('should create a store object with update and get functions', async () => {
        assert.notStrictEqual(Store, undefined);
        assert.notStrictEqual(Store.update, undefined);
        assert.deepStrictEqual(typeof Store.update === 'function', true);
        assert.notStrictEqual(Store.getState, undefined);
        assert.deepStrictEqual(typeof Store.getState === 'function', true);
    });
});

describe('Validate > Unit > Store > getState', () => {
    it('should return the state object', async () => {
        assert.deepStrictEqual(Store.getState(), {});
    });
});

describe('Validate > Unit > Store > update', () => {
    it('should update state using reducers and nextState payload', async () => {
        const nextState = {
            newProp: true
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), nextState));
        assert.deepStrictEqual(Store.getState(), nextState);
    });

    it('should execute side effect functions', async () => {
        const nextState = { newProp: true };
        let flag = false;
        const sideEffect = () => {
            flag = true;
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), nextState), [sideEffect]);
        assert.deepStrictEqual(flag, true);
    });

    it('should execute side effect functions without updating state', async () => {

        const priorState = Store.getState();
        let flag = false;
        const sideEffect = () => {
            flag = true;
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), false), [sideEffect]);
        assert.deepStrictEqual(flag, true);
        assert.deepStrictEqual(Store.getState(), priorState);
    });
});