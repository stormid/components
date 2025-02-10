import { createStore } from './store';
import { initTriggers, keyListener, open } from './dom';

/* 
 * @param items, HTMLElement, DOM node to be toggled
 * @param settings, Object, merged defaults + options passed in as instantiation config to module default
 *
 * @returns Object, Modal Gallery API
 */
export default ({ items, settings }) => {
    const store = createStore();
    store.update({
        settings,
        items,
        imageCache: [],
        isOpen: false,
        current: null,
        keyListener: keyListener(store)
    }, [ initTriggers(store) ]);

    return {
        getState: store.getState,
        open: open(store)
    };
};