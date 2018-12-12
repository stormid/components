import { createStore } from '../../src/lib/store';

describe(`Store`, () => {

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
  

});
