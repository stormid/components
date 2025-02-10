import { createStore } from '../../src/lib/store';
import { broadcast } from '../../src/lib/utils';
import { EVENTS } from '../../src/lib/constants';
import defaults from '../../src/lib/defaults';


describe(`Modal > Utils > broadcast`, () => {

    it('should dispatch a custom event with a detail Object with a reference to Store.getState', async () => {
        const store = createStore();
        const state = {
            settings: defaults
        };
        store.update(state, []);
        const listener = jest.fn();
        document.addEventListener(EVENTS.OPEN, listener);
        document.addEventListener(EVENTS.OPEN, e => {
            expect(e.detail).toEqual({ getState: store.getState });
        });

        broadcast(EVENTS.OPEN, store)(state);
        expect(listener).toHaveBeenCalled();
    });

});