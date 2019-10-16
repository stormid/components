import { createStore } from '../src/lib/store';

describe(`Scroll spy > Store`, () => {

    const Store = createStore();

    it('createStore should return an Object with an API', async () => {
      expect(Store).not.toBeNull();
      expect(Store.getState).not.toBeNull();
      expect(Store.dispatch).not.toBeNull();
    });

    it('should have a getState function that returns a private state Object', async () => {
        expect(Store.state).toBeUndefined();
        expect(Store.getState()).toEqual({});
    });

    it('should have a dispatch function that updates state', async () => {
        const nextState = { isOpen: true }
        Store.dispatch(nextState);
        expect(Store.getState()).toEqual(nextState);
    });

    it('should have a dispatch function that does not update state if nextState is not passed', async () => {
        const Store = createStore();
        Store.dispatch();
        expect(Store.getState()).toEqual({});
    });

    it('should have a dispatch function that invokes any side effect functions passed after the state change, with new state as only argument', async () => {
        const sideEffect = jest.fn();
        Store.dispatch({}, [sideEffect]);
        expect(sideEffect).toBeCalled;
    });


});
