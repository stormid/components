import { broadcast } from '../../src/lib/dom';
import { createStore } from '../../src/lib/store';
import defaults from '../../src/lib/defaults';
import { EVENTS } from '../../src/lib/constants';

describe(`Toggle > broadcast`, () => {

    it('should dispatch a bubbling custom event with a detail Object with a reference to Store.getState', async () => {
        document.body.innerHTML = `<div id="target"></div>`;
        const Store = createStore();
        const node = document.getElementById('target');
        const openState = {
            node,
            isOpen: true,
            settings: defaults
        };
        Store.update(openState);
        const listener = jest.fn();
        const delegatedlistener = jest.fn();
        node.addEventListener(EVENTS.OPEN, listener);
        document.addEventListener(EVENTS.OPEN, delegatedlistener);
        node.addEventListener(EVENTS.OPEN, e => {
            expect(e.detail).toEqual({ getState: Store.getState });
        });

        broadcast(Store)(openState);
        expect(listener).toHaveBeenCalled();
        expect(delegatedlistener).toHaveBeenCalled();
    });

});