import { createStore } from '../../src/lib/store';
import { ACTIONS } from '../../src/lib/constants';
import reducers from '../../src/lib/reducers';
let Store;
beforeAll(() => {
    Store = createStore();
});

describe('Validate > Unit > Store > createStore', () => {
    it('should create a store object with update and get functions', async () => {
        expect.assertions(5);
        expect(Store).not.toBeUndefined();
        expect(Store.update).not.toBeUndefined();
        expect(typeof Store.update === 'function').toEqual(true);
        expect(Store.getState).not.toBeUndefined();
        expect(typeof Store.getState === 'function').toEqual(true);
    });
});

describe('Validate > Unit > Store > getState', () => {
    it('should return the state object', async () => {
        expect.assertions(1);
        expect(Store.getState()).toEqual({});
    });
});

describe('Validate > Unit > Store > update', () => {
    it('should update state using reducers and nextState payload', async () => {
        expect.assertions(1);
        const nextState = {
            newProp: true
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), nextState));
        expect(Store.getState()).toEqual(nextState);
    });

    it('should execute side effect functions', async () => {
        expect.assertions(1);
        const nextState = { newProp: true };
        let flag = false;
        const sideEffect = () => {
            flag = true;
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), nextState), [sideEffect]);
        expect(flag).toEqual(true);
    });

    it('should execute side effect functions without updating state', async () => {
        expect.assertions(2);

        const priorState = Store.getState();
        let flag = false;
        const sideEffect = () => {
            flag = true;
        };
        Store.update(reducers[ACTIONS.SET_INITIAL_STATE](Store.getState(), false), [sideEffect]);
        expect(flag).toEqual(true);
        expect(Store.getState()).toEqual(priorState);
    });
});