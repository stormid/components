import { createStore } from '../../src/lib/store';

describe(`Modal > Store`, () => {

    const Store = createStore();
    let effect = false;
    const sideEffect = state => {
        effect = !effect;
    };

    it('createStore should return an Object with an API', async () => {
        expect(Store).not.toBeNull();
        expect(Store.getState).not.toBeNull();
        expect(Store.update).not.toBeNull();
    });

    it('should have a getState function that returns a private state Object', async () => {
        expect(Store.state).toBeUndefined();
        expect(Store.getState()).toEqual({});
    });

    it('should have a update function that updates state', async () => {
        const nextState = { isOpen: true };
        Store.update(nextState);
        expect(Store.getState()).toEqual(nextState);
    });

    it('should have a update function that does not update state if nextState is not passed', async () => {
        const Store = createStore();
        Store.update();
        expect(Store.getState()).toEqual({});
    });

    it('should have a update function that invokes any side effect functions passed after the state change, with new state as only argument', async () => {
        Store.update({}, [sideEffect]);
        expect(effect).toEqual(true);
    });


});
