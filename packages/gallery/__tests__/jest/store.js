import { createStore } from '../../src/lib/store';

describe(`Gallery > store`, () => {

    const store = createStore();
    let effect = false;
    const sideEffect = state => {
        effect = !effect;
    };

    it('createstore should return an Object with an API', async () => {
        expect(store).not.toBeNull();
        expect(store.getState).not.toBeNull();
        expect(store.update).not.toBeNull();
    });

    it('should have a getState function that returns a private state Object', async () => {
        expect(store.state).toBeUndefined();
        expect(store.getState()).toEqual({});
    });

    it('should have a dispatch function that updates state', async () => {
        const nextState = { isOpen: true };
        store.update(nextState);
        expect(store.getState()).toEqual(nextState);
    });

    it('should have a dispatch function that does not update state if nextState is not passed', async () => {
        const store = createStore();
        store.update();
        expect(store.getState()).toEqual({});
    });

    it('should have a dispatch function that invokes any side effect functions passed after the state change, with new state as only argument', async () => {
        store.update({}, [sideEffect]);
        expect(effect).toEqual(true);
    });


});
